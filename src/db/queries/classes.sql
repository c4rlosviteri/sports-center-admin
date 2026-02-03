/* @name CreateClass */
INSERT INTO classes (
  branch_id,
  name,
  instructor,
  scheduled_at,
  duration_minutes,
  capacity,
  waitlist_capacity
) VALUES (
  :branchId!,
  :name!,
  :instructor,
  :scheduledAt!,
  :durationMinutes!,
  :capacity!,
  :waitlistCapacity!
) RETURNING id, branch_id, name, instructor, scheduled_at, duration_minutes, capacity, waitlist_capacity, created_at;

/* @name GetClassesByBranch */
SELECT 
  c.id,
  c.branch_id,
  c.name,
  c.instructor,
  c.scheduled_at,
  c.duration_minutes,
  c.capacity,
  c.waitlist_capacity,
  c.created_at,
  COUNT(b.id) FILTER (WHERE b.status = 'confirmed') as booked_count,
  COUNT(b.id) FILTER (WHERE b.status = 'waitlisted') as waitlist_count
FROM classes c
LEFT JOIN bookings b ON c.id = b.class_id
WHERE c.branch_id = :branchId! 
  AND c.scheduled_at >= :fromDate!
  AND c.scheduled_at <= :toDate!
GROUP BY c.id
ORDER BY c.scheduled_at ASC;

/* @name GetClassById */
SELECT 
  c.id,
  c.branch_id,
  c.name,
  c.instructor,
  c.scheduled_at,
  c.duration_minutes,
  c.capacity,
  c.waitlist_capacity,
  c.created_at,
  COUNT(b.id) FILTER (WHERE b.status = 'confirmed') as booked_count,
  COUNT(b.id) FILTER (WHERE b.status = 'waitlisted') as waitlist_count
FROM classes c
LEFT JOIN bookings b ON c.id = b.class_id
WHERE c.id = :classId!
GROUP BY c.id;

/* @name CreateBooking */
INSERT INTO bookings (
  user_id,
  class_id,
  package_id,
  status,
  waitlist_position
) VALUES (
  :userId!,
  :classId!,
  :packageId!,
  :status!,
  :waitlistPosition
) RETURNING id, user_id, class_id, package_id, status, waitlist_position, booked_at, created_at;

/* @name GetBookingsByUser */
SELECT 
  b.id,
  b.user_id,
  b.class_id,
  b.package_id,
  b.status,
  b.waitlist_position,
  b.booked_at,
  b.cancelled_at,
  c.name as class_name,
  c.instructor,
  c.scheduled_at,
  c.duration_minutes
FROM bookings b
JOIN classes c ON b.class_id = c.id
WHERE b.user_id = :userId! 
  AND b.package_id = :packageId!
ORDER BY c.scheduled_at ASC;

/* @name GetBookingsByClass */
SELECT 
  b.id,
  b.user_id,
  b.class_id,
  b.package_id,
  b.status,
  b.waitlist_position,
  b.booked_at,
  u.first_name,
  u.last_name,
  u.email
FROM bookings b
JOIN "user" u ON b.user_id = u.id
WHERE b.class_id = :classId!
  AND b.status IN ('confirmed', 'waitlisted')
ORDER BY 
  CASE WHEN b.status = 'confirmed' THEN 0 ELSE 1 END,
  b.waitlist_position NULLS LAST,
  b.booked_at ASC;

/* @name CancelBooking */
UPDATE bookings
SET status = 'cancelled',
    cancelled_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE id = :bookingId!
RETURNING id, user_id, class_id, status, cancelled_at;

/* @name GetNextWaitlistBooking */
SELECT 
  id,
  user_id,
  class_id,
  package_id,
  waitlist_position
FROM bookings
WHERE class_id = :classId! 
  AND status = 'waitlisted'
ORDER BY waitlist_position ASC
LIMIT 1;

/* @name PromoteFromWaitlist */
UPDATE bookings
SET status = 'confirmed',
    waitlist_position = NULL,
    updated_at = CURRENT_TIMESTAMP
WHERE id = :bookingId!
RETURNING id, user_id, class_id, package_id, status;

/* @name GetWaitlistCount */
SELECT COUNT(*) as count
FROM bookings
WHERE class_id = :classId! AND status = 'waitlisted';

/* @name GetConfirmedBookingsCount */
SELECT COUNT(*) as count
FROM bookings
WHERE class_id = :classId! AND status = 'confirmed';

/* @name GetClassesByDate */
SELECT
  c.id,
  c.branch_id,
  c.name,
  c.instructor,
  c.duration_minutes,
  c.capacity,
  c.waitlist_capacity,
  c.created_at,
  (c.scheduled_at AT TIME ZONE 'America/Guayaquil') as scheduled_at,
  COUNT(DISTINCT CASE WHEN b.status = 'confirmed' THEN b.id END)::int as confirmed_count,
  COUNT(DISTINCT CASE WHEN b.status = 'waitlisted' THEN b.id END)::int as waitlist_count,
  (
    SELECT status
    FROM bookings
    WHERE class_id = c.id AND user_id = :userId!
    LIMIT 1
  ) as user_booking_status,
  (
    SELECT id
    FROM bookings
    WHERE class_id = c.id AND user_id = :userId!
    LIMIT 1
  ) as user_booking_id
FROM classes c
LEFT JOIN bookings b ON c.id = b.class_id AND b.status IN ('confirmed', 'waitlisted')
WHERE c.branch_id = :branchId!
  AND DATE(c.scheduled_at AT TIME ZONE 'America/Guayaquil') = DATE(:date!::timestamptz AT TIME ZONE 'America/Guayaquil')
GROUP BY c.id, c.branch_id, c.name, c.instructor, c.duration_minutes, c.capacity, c.waitlist_capacity, c.created_at, c.scheduled_at
ORDER BY c.scheduled_at;

/* @name GetClassesByMonth */
SELECT
  c.id,
  c.branch_id,
  c.name,
  c.instructor,
  c.duration_minutes,
  c.capacity,
  c.waitlist_capacity,
  c.created_at,
  (c.scheduled_at AT TIME ZONE 'America/Guayaquil') as scheduled_at,
  COUNT(DISTINCT CASE WHEN b.status = 'confirmed' THEN b.id END)::int as confirmed_count,
  COUNT(DISTINCT CASE WHEN b.status = 'waitlisted' THEN b.id END)::int as waitlist_count,
  (
    SELECT status
    FROM bookings
    WHERE class_id = c.id AND user_id = :userId!
    LIMIT 1
  ) as user_booking_status,
  (
    SELECT id
    FROM bookings
    WHERE class_id = c.id AND user_id = :userId!
    LIMIT 1
  ) as user_booking_id
FROM classes c
LEFT JOIN bookings b ON c.id = b.class_id AND b.status IN ('confirmed', 'waitlisted')
WHERE c.branch_id = :branchId!
  AND c.scheduled_at >= :firstDay!::date
  AND c.scheduled_at < (:lastDay!::date + INTERVAL '1 day')
GROUP BY c.id, c.branch_id, c.name, c.instructor, c.duration_minutes, c.capacity, c.waitlist_capacity, c.created_at, c.scheduled_at
ORDER BY c.scheduled_at;
