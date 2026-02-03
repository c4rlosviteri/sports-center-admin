import pool from './db'
import { sendBookingConfirmation, sendWaitlistPromotion } from './email'

interface ClassInfo {
  id: string
  scheduledAt: string
  capacity: number
  waitlistCapacity: number
  bookedCount: number
  waitlistCount: number
  bookingHoursBefore?: number | null
}

interface UserInfo {
  id: string
  email: string
  firstName: string
  lastName: string
}

interface PackageInfo {
  id: string
  templateName: string
  classesRemaining: number
  expiresAt: string | null
  maxClassesPerDay: number | null
  maxClassesPerWeek: number | null
}

interface BookingResult {
  bookingId: string
  status: 'confirmed' | 'waitlisted'
  waitlistPosition?: number
  usedPackage?: boolean
}

/**
 * Check if user can book a class based on their package
 */
export function canBookWithPackage(pkg: PackageInfo): {
  canBook: boolean
  reason?: string
} {
  // Check expiration
  if (pkg.expiresAt) {
    const now = new Date()
    const expiresAt = new Date(pkg.expiresAt)
    if (expiresAt < now) {
      return {
        canBook: false,
        reason: 'Tu paquete ha expirado.',
      }
    }
  }

  // Check remaining credits
  if (pkg.classesRemaining <= 0) {
    return {
      canBook: false,
      reason: 'No tienes clases disponibles en tu paquete.',
    }
  }

  return { canBook: true }
}

/**
 * Get user's best available package
 */
export async function getBestCreditSource(
  userId: string,
  branchId: string
): Promise<PackageInfo | null> {
  // Check for active packages
  const packageResult = await pool.query(
    `SELECT
      ucp.id,
      cpt.name as template_name,
      ucp.classes_remaining,
      ucp.expires_at,
      cpt.max_classes_per_day,
      cpt.max_classes_per_week
    FROM user_class_packages ucp
    JOIN class_package_templates cpt ON ucp.package_template_id = cpt.id
    WHERE ucp.user_id = $1
      AND ucp.branch_id = $2
      AND ucp.status = 'active'
      AND ucp.classes_remaining > 0
      AND (ucp.expires_at IS NULL OR ucp.expires_at > CURRENT_TIMESTAMP)
      AND (ucp.frozen_until IS NULL OR ucp.frozen_until < CURRENT_DATE)
    ORDER BY ucp.expires_at NULLS LAST
    LIMIT 1`,
    [userId, branchId]
  )

  if (packageResult.rows.length > 0) {
    const pkg = packageResult.rows[0]
    return {
      id: pkg.id,
      templateName: pkg.template_name,
      classesRemaining: pkg.classes_remaining,
      expiresAt: pkg.expires_at,
      maxClassesPerDay: pkg.max_classes_per_day,
      maxClassesPerWeek: pkg.max_classes_per_week,
    }
  }

  return null
}

/**
 * Check if booking is allowed based on time restriction policy
 */
export function canBookByTime(
  scheduledAt: string,
  bookingHoursBefore: number
): { canBook: boolean; reason?: string } {
  if (bookingHoursBefore === 0) {
    return { canBook: true }
  }

  const classTime = new Date(scheduledAt)
  const now = new Date()
  const hoursUntilClass =
    (classTime.getTime() - now.getTime()) / (1000 * 60 * 60)

  if (hoursUntilClass < bookingHoursBefore) {
    return {
      canBook: false,
      reason: `No puedes reservar esta clase menos de ${bookingHoursBefore} ${bookingHoursBefore === 1 ? 'hora' : 'horas'} antes de su inicio.`,
    }
  }

  return { canBook: true }
}

/**
 * Book a class using a package (new system)
 */
export async function bookClassWithPackage(
  user: UserInfo,
  classInfo: ClassInfo,
  pkg: PackageInfo,
  branchId: string,
  notificationsEnabled = true
): Promise<BookingResult> {
  const client = await pool.connect()

  try {
    await client.query('BEGIN')

    const { canBook, reason } = canBookWithPackage(pkg)
    if (!canBook) {
      throw new Error(reason)
    }

    // Check booking time restriction
    const bookingRestriction = classInfo.bookingHoursBefore ?? 0
    const timeCheck = canBookByTime(classInfo.scheduledAt, bookingRestriction)
    if (!timeCheck.canBook) {
      throw new Error(timeCheck.reason)
    }

    let status: 'confirmed' | 'waitlisted' = 'confirmed'
    let waitlistPosition: number | undefined

    if (classInfo.bookedCount >= classInfo.capacity) {
      if (classInfo.waitlistCount >= classInfo.waitlistCapacity) {
        throw new Error('La clase está llena y la lista de espera también.')
      }
      status = 'waitlisted'
      waitlistPosition = classInfo.waitlistCount + 1
    }

    // Check for existing booking
    const existingBookingResult = await client.query(
      `SELECT id, status FROM bookings WHERE user_id = $1 AND class_id = $2`,
      [user.id, classInfo.id]
    )

    let booking: {
      id: string
      status: 'confirmed' | 'waitlisted'
      waitlist_position: number | undefined
    }

    if (existingBookingResult.rows.length > 0) {
      const existingBooking = existingBookingResult.rows[0]
      if (existingBooking.status !== 'cancelled') {
        throw new Error('Ya tienes una reserva para esta clase.')
      }

      // Reactivate cancelled booking with package
      const updateResult = await client.query(
        `UPDATE bookings
         SET status = $1, waitlist_position = $2, package_id = $3, cancelled_at = NULL
         WHERE id = $4
         RETURNING id, status, waitlist_position`,
        [status, waitlistPosition ?? null, pkg.id, existingBooking.id]
      )
      booking = {
        id: updateResult.rows[0].id,
        status: updateResult.rows[0].status as 'confirmed' | 'waitlisted',
        waitlist_position: updateResult.rows[0].waitlist_position ?? undefined,
      }
    } else {
      // Insert new booking with package
      const bookingResult = await client.query(
        `INSERT INTO bookings (user_id, class_id, package_id, status, waitlist_position)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING id, status, waitlist_position`,
        [user.id, classInfo.id, pkg.id, status, waitlistPosition ?? null]
      )
      booking = {
        id: bookingResult.rows[0].id,
        status: bookingResult.rows[0].status as 'confirmed' | 'waitlisted',
        waitlist_position: bookingResult.rows[0].waitlist_position ?? undefined,
      }
    }

    // Deduct credit from package if confirmed
    if (status === 'confirmed') {
      await client.query(
        `UPDATE user_class_packages
         SET classes_remaining = classes_remaining - 1,
             activated_at = COALESCE(activated_at, CURRENT_TIMESTAMP),
             status = CASE WHEN classes_remaining - 1 <= 0 THEN 'exhausted' ELSE status END
         WHERE id = $1`,
        [pkg.id]
      )

      // Record package usage
      await client.query(
        `INSERT INTO package_class_usage (user_package_id, booking_id, user_id, class_id, branch_id, credits_used)
         VALUES ($1, $2, $3, $4, $5, 1)`,
        [pkg.id, booking.id, user.id, classInfo.id, branchId]
      )
    }

    await client.query('COMMIT')

    if (notificationsEnabled && status === 'confirmed') {
      const classDetails = await client.query(
        `SELECT name, instructor, scheduled_at FROM classes WHERE id = $1`,
        [classInfo.id]
      )
      const classData = classDetails.rows[0]

      await sendBookingConfirmation(user.email, {
        firstName: user.firstName,
        className: classData.name,
        scheduledAt: classData.scheduled_at,
        instructor: classData.instructor,
      }).catch(console.error)
    }

    return {
      bookingId: booking.id,
      status: booking.status,
      waitlistPosition: booking.waitlist_position,
      usedPackage: true,
    }
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}

/**
 * Check if cancellation is allowed based on policy
 */
export function canCancelBooking(
  scheduledAt: string,
  cancellationHoursBefore: number
): { canCancel: boolean; reason?: string } {
  const classTime = new Date(scheduledAt)
  const now = new Date()
  const hoursUntilClass =
    (classTime.getTime() - now.getTime()) / (1000 * 60 * 60)

  if (hoursUntilClass < cancellationHoursBefore) {
    return {
      canCancel: false,
      reason: `No puedes cancelar la reserva menos de ${cancellationHoursBefore} horas antes de la clase.`,
    }
  }

  return { canCancel: true }
}

/**
 * Cancel a booking and promote from waitlist if applicable
 */
export async function cancelBooking(
  bookingId: string,
  scheduledAt: string,
  cancellationHoursBefore: number,
  notificationsEnabled = true
): Promise<void> {
  const { canCancel, reason } = canCancelBooking(
    scheduledAt,
    cancellationHoursBefore
  )
  if (!canCancel) {
    throw new Error(reason)
  }

  const client = await pool.connect()

  try {
    await client.query('BEGIN')

    // Get the original booking status BEFORE updating
    const originalBookingResult = await client.query(
      `SELECT user_id, class_id, status, package_id FROM bookings WHERE id = $1`,
      [bookingId]
    )

    if (originalBookingResult.rows.length === 0) {
      throw new Error('Reserva no encontrada')
    }

    const booking = originalBookingResult.rows[0]
    const wasConfirmed = booking.status === 'confirmed'

    // Now update the booking to cancelled
    await client.query(
      `UPDATE bookings
       SET status = 'cancelled', cancelled_at = CURRENT_TIMESTAMP
       WHERE id = $1`,
      [bookingId]
    )

    if (wasConfirmed) {
      // Restore credits based on source (package or membership)
      if (booking.package_id) {
        // Restore package credit
        await client.query(
          `UPDATE user_class_packages
           SET classes_remaining = classes_remaining + 1,
               status = CASE WHEN status = 'exhausted' THEN 'active' ELSE status END
           WHERE id = $1`,
          [booking.package_id]
        )

        // Mark package usage as refunded
        await client.query(
          `UPDATE package_class_usage
           SET refunded = true, refunded_at = CURRENT_TIMESTAMP, refund_reason = 'Cancelación de reserva'
           WHERE booking_id = $1`,
          [bookingId]
        )
      }

      const nextWaitlistResult = await client.query(
        `SELECT id, user_id, package_id FROM bookings
         WHERE class_id = $1 AND status = 'waitlisted'
         ORDER BY waitlist_position ASC
         LIMIT 1`,
        [booking.class_id]
      )

      if (nextWaitlistResult.rows.length > 0) {
        const nextBooking = nextWaitlistResult.rows[0]

        await client.query(
          `UPDATE bookings
           SET status = 'confirmed', waitlist_position = NULL
           WHERE id = $1`,
          [nextBooking.id]
        )

        // Deduct credit from appropriate source
        if (nextBooking.package_id) {
          // Deduct from package
          await client.query(
            `UPDATE user_class_packages
             SET classes_remaining = classes_remaining - 1,
                 activated_at = COALESCE(activated_at, CURRENT_TIMESTAMP),
                 status = CASE WHEN classes_remaining - 1 <= 0 THEN 'exhausted' ELSE status END
             WHERE id = $1`,
            [nextBooking.package_id]
          )

          // Get branch_id for package usage
          const branchResult = await client.query(
            `SELECT branch_id FROM classes WHERE id = $1`,
            [booking.class_id]
          )
          const branchId = branchResult.rows[0]?.branch_id

          // Record package usage
          if (branchId) {
            await client.query(
              `INSERT INTO package_class_usage (user_package_id, booking_id, user_id, class_id, branch_id, credits_used)
               VALUES ($1, $2, $3, $4, $5, 1)`,
              [
                nextBooking.package_id,
                nextBooking.id,
                nextBooking.user_id,
                booking.class_id,
                branchId,
              ]
            )
          }
        }

        if (notificationsEnabled) {
          const [userResult, classResult] = await Promise.all([
            client.query(`SELECT email, first_name FROM "user" WHERE id = $1`, [
              nextBooking.user_id,
            ]),
            client.query(
              `SELECT name, instructor, scheduled_at FROM classes WHERE id = $1`,
              [booking.class_id]
            ),
          ])

          const promotedUser = userResult.rows[0]
          const classData = classResult.rows[0]

          await sendWaitlistPromotion(promotedUser.email, {
            firstName: promotedUser.first_name,
            className: classData.name,
            scheduledAt: classData.scheduled_at,
            instructor: classData.instructor,
          }).catch(console.error)
        }
      }
    }

    await client.query('COMMIT')

    // TODO: Implement notification for cancellation
    // This would send an email to the user confirming their cancellation
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}
