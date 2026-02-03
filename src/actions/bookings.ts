'use server'

import { revalidatePath } from 'next/cache'
import * as bookingsQueries from '~/db/queries/bookings.queries'
import { pool } from '~/lib/db'
import { getSession } from './auth'

/**
 * Get all bookings for a specific class (for admins)
 */
export async function getClassBookings(classId: string) {
  const session = await getSession()
  if (!session) throw new Error('No autorizado')

  // Verify class belongs to admin's branch
  if (['admin', 'superuser'].includes(session.user.role)) {
    const classCheck = await pool.query(
      'SELECT id FROM classes WHERE id = $1 AND branch_id = $2',
      [classId, session.user.branchId]
    )
    if (classCheck.rows.length === 0) {
      throw new Error('Clase no encontrada en tu sucursal')
    }
  }

  const result = await bookingsQueries.getClassBookings.run({ classId }, pool)

  return result.map((row) => ({
    id: row.id,
    status: row.status,
    waitlistPosition: row.waitlist_position,
    bookedAt: row.booked_at,
    userFirstName: row.first_name,
    userLastName: row.last_name,
    userEmail: row.email,
    userPhone: row.phone,
  }))
}

/**
 * Admin remove booking from class
 */
export async function adminRemoveBooking(bookingId: string) {
  const session = await getSession()
  if (!session || !['admin', 'superuser'].includes(session.user.role)) {
    throw new Error('No autorizado')
  }

  const client = await pool.connect()

  try {
    await client.query('BEGIN')

    // Get booking details and verify branch access
    const bookingResult = await bookingsQueries.getBookingDetails.run(
      { bookingId },
      client
    )

    if (bookingResult.length === 0) {
      throw new Error('Reserva no encontrada')
    }

    const booking = bookingResult[0]

    // Verify class belongs to admin's branch
    const bookingBranchId = (booking as { branch_id?: string }).branch_id
    if (
      session.user.role === 'admin' &&
      bookingBranchId !== session.user.branchId
    ) {
      throw new Error('No tienes acceso a esta reserva')
    }

    // Cancel the booking
    await bookingsQueries.cancelBookingById.run({ bookingId }, client)

    // If it was confirmed, return the class and promote from waitlist
    if (booking.status === 'confirmed') {
      // Return class to package if not unlimited
      if (booking.package_id) {
        const packageResult =
          await bookingsQueries.getPackageClassesRemaining.run(
            { packageId: booking.package_id },
            client
          )
        const pkg = packageResult[0]

        if (pkg && pkg.classes_remaining !== null) {
          await bookingsQueries.updatePackageClasses.run(
            { packageId: booking.package_id, delta: 1 },
            client
          )
        }
      }

      // Promote from waitlist
      const nextWaitlistResult =
        await bookingsQueries.getNextWaitlistBooking.run(
          { classId: booking.class_id },
          client
        )

      if (nextWaitlistResult.length > 0) {
        const nextBooking = nextWaitlistResult[0]

        await bookingsQueries.promoteWaitlistBooking.run(
          { bookingId: nextBooking.id },
          client
        )

        // Deduct class from promoted user's package if not unlimited
        if (nextBooking.package_id) {
          const userPackageResult =
            await bookingsQueries.getPackageClassesRemaining.run(
              { packageId: nextBooking.package_id },
              client
            )

          const userPackage = userPackageResult[0]

          if (userPackage && userPackage.classes_remaining !== null) {
            await bookingsQueries.updatePackageClasses.run(
              { packageId: nextBooking.package_id, delta: -1 },
              client
            )
          }
        }
      }
    }

    await client.query('COMMIT')

    const { logAdminAction } = await import('~/lib/audit')
    await logAdminAction(
      session.user.id,
      'remove_booking',
      'booking',
      bookingId,
      'Removed user from class',
      { classId: booking.class_id, status: booking.status }
    )

    revalidatePath('/admin/classes')
    return { success: true }
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}
