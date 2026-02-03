/* @name GetUserActivePackage */
SELECT
  ucp.*,
  cpt.name as package_name,
  cpt.description as package_description,
  cpt.validity_type,
  cpt.validity_period,
  cpt.class_count
FROM user_class_packages ucp
INNER JOIN class_package_templates cpt ON ucp.package_template_id = cpt.id
WHERE ucp.user_id = :userId!
  AND ucp.status = 'active'
  AND (ucp.expires_at IS NULL OR ucp.expires_at > NOW())
ORDER BY ucp.purchased_at DESC
LIMIT 1;

/* @name GetUserBookings */
SELECT
  b.id,
  b.user_id,
  b.class_id,
  b.package_id,
  b.status,
  b.waitlist_position,
  b.booked_at,
  b.cancelled_at,
  b.created_at,
  b.updated_at,
  c.name as class_name,
  c.instructor as instructor_name,
  (c.scheduled_at AT TIME ZONE 'America/Guayaquil') as scheduled_at,
  c.duration_minutes
FROM bookings b
INNER JOIN classes c ON b.class_id = c.id
WHERE b.user_id = :userId!
  AND c.scheduled_at >= NOW() - INTERVAL '30 days'
ORDER BY c.scheduled_at DESC;

/* @name GetTotalClients */
SELECT COUNT(*) as count
FROM "user"
WHERE branch_id = :branchId!
  AND role = 'client';

/* @name GetTodayClassesCount */
SELECT COUNT(*) as count
FROM classes
WHERE branch_id = :branchId!
  AND DATE(scheduled_at AT TIME ZONE 'America/Guayaquil') = CURRENT_DATE;

/* @name GetMonthlyRevenue */
SELECT COALESCE(SUM(p.amount), 0) as total
FROM payments p
JOIN "user" u ON p.user_id = u.id
WHERE u.branch_id = :branchId!
  AND DATE_TRUNC('month', p.payment_date) = DATE_TRUNC('month', CURRENT_DATE);

/* @name GetUpcomingClasses */
SELECT
  c.id,
  c.scheduled_at,
  c.capacity,
  COUNT(b.id) as bookings_count
FROM classes c
LEFT JOIN bookings b ON c.id = b.class_id AND b.status != 'cancelled'
WHERE c.branch_id = :branchId!
  AND DATE(c.scheduled_at AT TIME ZONE 'America/Guayaquil') BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '7 days'
GROUP BY c.id, c.scheduled_at, c.capacity
ORDER BY c.scheduled_at ASC
LIMIT 5;

/* @name GetRecentBookings */
SELECT
  b.id,
  b.status,
  b.created_at,
  u.first_name,
  u.last_name,
  c.scheduled_at
FROM bookings b
JOIN "user" u ON b.user_id = u.id
JOIN classes c ON b.class_id = c.id
WHERE u.branch_id = :branchId!
ORDER BY b.created_at DESC
LIMIT 5;

/* @name GetActivePackagesCount */
SELECT COUNT(*) as count
FROM user_class_packages ucp
JOIN "user" u ON ucp.user_id = u.id
WHERE u.branch_id = :branchId!
  AND ucp.status = 'active'
  AND ucp.classes_remaining > 0
  AND (ucp.expires_at IS NULL OR ucp.expires_at > CURRENT_TIMESTAMP);

/* @name GetExpiringPackages */
SELECT
  ucp.id,
  ucp.expires_at,
  ucp.classes_remaining,
  u.first_name,
  u.last_name,
  u.email,
  cpt.name as package_name
FROM user_class_packages ucp
JOIN "user" u ON ucp.user_id = u.id
JOIN class_package_templates cpt ON ucp.package_template_id = cpt.id
WHERE u.branch_id = :branchId!
  AND ucp.status = 'active'
  AND ucp.expires_at IS NOT NULL
  AND ucp.expires_at BETWEEN CURRENT_TIMESTAMP AND CURRENT_TIMESTAMP + INTERVAL '7 days'
  AND ucp.classes_remaining > 0
ORDER BY ucp.expires_at ASC
LIMIT 5;

