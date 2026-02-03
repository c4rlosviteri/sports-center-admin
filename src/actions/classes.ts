'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import * as classesQueries from '~/db/queries/classes.queries'
import { bookClassWithPackage } from '~/lib/booking-service'
import { pool } from '~/lib/db'
import type { ClassWithCounts } from '~/types/database'
import { getSession } from './auth'

export async function getClassesByDate(
  date: string
): Promise<ClassWithCounts[]> {
  const validated = z.object({ date: z.string() }).parse({ date })

  const session = await getSession()
  if (!session) throw new Error('No autorizado')
  if (!session.user.branchId)
    throw new Error('No se encontró la sucursal del usuario')

  const result = await classesQueries.getClassesByDate.run(
    {
      branchId: session.user.branchId,
      date: validated.date,
      userId: session.user.id,
    },
    pool
  )

  return result.map((row) => ({
    id: row.id,
    branchId: row.branch_id,
    instructorName: row.instructor,
    className: row.name,
    description: '',
    scheduledAt: row.scheduled_at
      ? new Date(row.scheduled_at).toISOString()
      : new Date().toISOString(),
    durationMinutes: row.duration_minutes,
    maxCapacity: row.capacity,
    waitlistCapacity: row.waitlist_capacity,
    location: '',
    createdAt: row.created_at || new Date(),
    confirmedCount: row.confirmed_count || 0,
    waitlistCount: row.waitlist_count || 0,
    bookedCount: (row.confirmed_count || 0) + (row.waitlist_count || 0),
    userBookingStatus: row.user_booking_status,
    userBookingId: row.user_booking_id,
  }))
}

export async function createBooking(classId: string) {
  const validated = z.object({ classId: z.string().uuid() }).parse({ classId })
  const session = await getSession()
  if (!session) throw new Error('No autorizado')
  if (!session.user.branchId)
    throw new Error('No se encontró la sucursal del usuario')

  const client = await pool.connect()
  try {
    // Check if user already has a booking for this class
    const existingBooking = await client.query(
      'SELECT id, status FROM bookings WHERE user_id = $1 AND class_id = $2',
      [session.user.id, validated.classId]
    )

    if (existingBooking.rows.length > 0) {
      const status = existingBooking.rows[0].status
      if (status === 'confirmed') {
        throw new Error('Ya tienes una reserva confirmada para esta clase')
      } else if (status === 'waitlisted') {
        throw new Error('Ya estás en la lista de espera para esta clase')
      }
    }

    // Get class info with booking restriction (class-level or branch-level default)
    const classResult = await client.query(
      `SELECT c.id, c.scheduled_at, c.capacity, c.waitlist_capacity,
        (SELECT COUNT(*) FROM bookings WHERE class_id = $1 AND status = 'confirmed') as booked_count,
        (SELECT COUNT(*) FROM bookings WHERE class_id = $1 AND status = 'waitlisted') as waitlist_count,
        COALESCE(c.booking_hours_before, bs.booking_hours_before, 0) as effective_booking_hours_before
       FROM classes c
       LEFT JOIN branch_settings bs ON c.branch_id = bs.branch_id
       WHERE c.id = $1`,
      [validated.classId]
    )
    const classRow = classResult.rows[0]
    const classInfo = {
      id: classRow.id,
      scheduledAt: classRow.scheduled_at,
      capacity: classRow.capacity,
      waitlistCapacity: classRow.waitlist_capacity,
      bookedCount: parseInt(classRow.booked_count, 10),
      waitlistCount: parseInt(classRow.waitlist_count, 10),
      bookingHoursBefore: parseInt(classRow.effective_booking_hours_before, 10),
    }

    // Get user's active package
    const packageResult = await client.query(
      `SELECT ucp.id, ucp.expires_at, ucp.classes_remaining, cpt.class_count, cpt.name as package_name 
       FROM user_class_packages ucp 
       JOIN class_package_templates cpt ON ucp.package_template_id = cpt.id 
       WHERE ucp.user_id = $1 
         AND ucp.status = 'active'
         AND (ucp.expires_at IS NULL OR ucp.expires_at > NOW())
       ORDER BY ucp.purchased_at DESC
       LIMIT 1`,
      [session.user.id]
    )

    if (packageResult.rows.length === 0) {
      throw new Error(
        'No tienes un paquete activo. Por favor compra un paquete primero.'
      )
    }

    const packageRow = packageResult.rows[0]
    const userPackage = {
      id: packageRow.id,
      templateName: packageRow.package_name || 'Package',
      classesRemaining: packageRow.classes_remaining,
      expiresAt: packageRow.expires_at,
      maxClassesPerDay: null,
      maxClassesPerWeek: null,
    }

    const booking = await bookClassWithPackage(
      {
        id: session.user.id,
        email: session.user.email,
        firstName: session.user.firstName || '',
        lastName: session.user.lastName || '',
      },
      classInfo,
      userPackage,
      session.user.branchId as string
    )

    revalidatePath('/client/classes')
    return booking
  } finally {
    client.release()
  }
}

export async function cancelBooking(bookingId: string) {
  const validated = z
    .object({ bookingId: z.string().uuid() })
    .parse({ bookingId })
  const session = await getSession()
  if (!session) throw new Error('No autorizado')

  const client = await pool.connect()
  try {
    // Get booking and class info
    const bookingResult = await client.query(
      `SELECT b.id, b.user_id, b.status, c.scheduled_at 
       FROM bookings b
       JOIN classes c ON b.class_id = c.id
       WHERE b.id = $1`,
      [validated.bookingId]
    )

    if (bookingResult.rows.length === 0) {
      throw new Error('Reserva no encontrada')
    }

    const booking = bookingResult.rows[0]

    // Verify ownership
    if (booking.user_id !== session.user.id) {
      throw new Error('No autorizado')
    }

    // Check if already cancelled
    if (booking.status === 'cancelled') {
      throw new Error('Esta reserva ya ha sido cancelada')
    }

    // Get branch cancellation policy (default 2 hours)
    if (!session.user.branchId)
      throw new Error('No se encontró la sucursal del usuario')
    const settingsResult = await client.query(
      'SELECT cancellation_hours_before FROM branch_settings WHERE branch_id = $1',
      [session.user.branchId]
    )
    const cancellationHours =
      settingsResult.rows[0]?.cancellation_hours_before || 2

    const { cancelBooking: cancelBookingService } = await import(
      '~/lib/booking-service'
    )
    await cancelBookingService(
      validated.bookingId,
      booking.scheduled_at,
      cancellationHours,
      true
    )

    revalidatePath('/client')
    revalidatePath('/client/classes')
    return { success: true }
  } finally {
    client.release()
  }
}

/**
 * Claim a spot from the waitlist when a spot becomes available
 */
export async function claimSpotFromWaitlist(bookingId: string) {
  const validated = z
    .object({ bookingId: z.string().uuid() })
    .parse({ bookingId })
  const session = await getSession()
  if (!session) throw new Error('No autorizado')

  const client = await pool.connect()
  try {
    await client.query('BEGIN')

    // Get booking info
    const bookingResult = await client.query(
      `SELECT b.id, b.user_id, b.class_id, b.status, b.package_id,
              c.capacity, c.branch_id,
              (SELECT COUNT(*) FROM bookings WHERE class_id = c.id AND status = 'confirmed') as confirmed_count
       FROM bookings b
       JOIN classes c ON b.class_id = c.id
       WHERE b.id = $1`,
      [validated.bookingId]
    )

    if (bookingResult.rows.length === 0) {
      throw new Error('Reserva no encontrada')
    }

    const booking = bookingResult.rows[0]

    // Verify user owns this booking
    if (booking.user_id !== session.user.id) {
      throw new Error('No tienes permiso para esta acción')
    }

    // Verify booking is waitlisted
    if (booking.status !== 'waitlisted') {
      throw new Error('Esta reserva no está en lista de espera')
    }

    // Check if there's a spot available
    const spotsAvailable =
      booking.capacity - parseInt(booking.confirmed_count, 10)
    if (spotsAvailable <= 0) {
      throw new Error('No hay lugares disponibles en este momento')
    }

    // Update booking to confirmed
    await client.query(
      `UPDATE bookings
       SET status = 'confirmed', waitlist_position = NULL
       WHERE id = $1`,
      [validated.bookingId]
    )

    // Deduct from package classes
    if (booking.package_id) {
      const packageResult = await client.query(
        `SELECT classes_remaining FROM user_class_packages WHERE id = $1`,
        [booking.package_id]
      )

      if (packageResult.rows[0]?.classes_remaining !== null) {
        await client.query(
          `UPDATE user_class_packages
           SET classes_remaining = classes_remaining - 1,
               activated_at = COALESCE(activated_at, CURRENT_TIMESTAMP),
               status = CASE WHEN classes_remaining - 1 <= 0 THEN 'exhausted' ELSE status END
           WHERE id = $1`,
          [booking.package_id]
        )

        // Record package usage
        await client.query(
          `INSERT INTO package_class_usage (user_package_id, booking_id, user_id, class_id, branch_id, credits_used)
           VALUES ($1, $2, $3, $4, $5, 1)`,
          [
            booking.package_id,
            validated.bookingId,
            session.user.id,
            booking.class_id,
            booking.branch_id,
          ]
        )
      }
    }

    await client.query('COMMIT')

    revalidatePath('/client')
    revalidatePath('/client/classes')
    return { success: true }
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}

/**
 * Get classes for a specific month (for calendar view)
 */
export async function getClassesByMonth(
  year: number,
  month: number
): Promise<ClassWithCounts[]> {
  const session = await getSession()
  if (!session) throw new Error('No autorizado')
  if (!session.user.branchId)
    throw new Error('No se encontró la sucursal del usuario')

  // Calculate the first and last day of the month
  const firstDay = new Date(year, month - 1, 1)
  const lastDay = new Date(year, month, 0)

  const result = await classesQueries.getClassesByMonth.run(
    {
      branchId: session.user.branchId,
      firstDay: firstDay.toISOString(),
      lastDay: lastDay.toISOString(),
      userId: session.user.id,
    },
    pool
  )

  return result.map((row) => ({
    id: row.id,
    branchId: row.branch_id,
    instructorName: row.instructor,
    className: row.name,
    description: '',
    scheduledAt: row.scheduled_at
      ? new Date(row.scheduled_at).toISOString()
      : new Date().toISOString(),
    durationMinutes: row.duration_minutes,
    maxCapacity: row.capacity,
    waitlistCapacity: row.waitlist_capacity,
    location: '',
    createdAt: row.created_at || new Date(),
    confirmedCount: row.confirmed_count || 0,
    waitlistCount: row.waitlist_count || 0,
    bookedCount: (row.confirmed_count || 0) + (row.waitlist_count || 0),
    userBookingStatus: row.user_booking_status,
    userBookingId: row.user_booking_id,
  }))
}
