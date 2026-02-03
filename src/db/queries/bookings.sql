/* @name GetClassBookings */
SELECT
  b.id,
  b.status,
  b.waitlist_position,
  b.booked_at,
  u.first_name,
  u.last_name,
  u.email,
  u.phone
FROM bookings b
JOIN "user" u ON b.user_id = u.id
WHERE b.class_id = :classId!
  AND b.status IN ('confirmed', 'waitlisted')
ORDER BY
  CASE WHEN b.status = 'confirmed' THEN 0 ELSE 1 END,
  b.waitlist_position NULLS LAST,
  b.booked_at;

/* @name GetBookingDetails */
SELECT
  b.status,
  b.class_id,
  b.package_id,
  c.scheduled_at,
  c.branch_id
FROM bookings b
JOIN classes c ON b.class_id = c.id
WHERE b.id = :bookingId!;

/* @name CancelBookingById */
UPDATE bookings
SET status = 'cancelled',
    cancelled_at = CURRENT_TIMESTAMP
WHERE id = :bookingId!
RETURNING id, status, cancelled_at;

/* @name GetNextWaitlistBooking */
SELECT id, package_id
FROM bookings
WHERE class_id = :classId! AND status = 'waitlisted'
ORDER BY waitlist_position ASC
LIMIT 1;

/* @name PromoteWaitlistBooking */
UPDATE bookings
SET status = 'confirmed',
    waitlist_position = NULL
WHERE id = :bookingId!
RETURNING id, status;

/* @name GetPackageClassesRemaining */
SELECT classes_remaining
FROM user_class_packages
WHERE id = :packageId!;

/* @name UpdatePackageClasses */
UPDATE user_class_packages
SET classes_remaining = classes_remaining + :delta!
WHERE id = :packageId!
RETURNING classes_remaining;
