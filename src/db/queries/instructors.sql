/* @name CreateInstructorProfile */
INSERT INTO instructor_profiles (
  user_id,
  branch_id,
  bio,
  specializations,
  certifications,
  hire_date,
  hourly_rate,
  is_active,
  profile_image_url
) VALUES (
  :userId!,
  :branchId!,
  :bio,
  :specializations,
  :certifications,
  :hireDate,
  :hourlyRate,
  :isActive!,
  :profileImageUrl
)
RETURNING *;

/* @name GetInstructorProfile */
SELECT
  ip.*,
  u.first_name,
  u.last_name,
  u.email,
  u.phone
FROM instructor_profiles ip
JOIN "user" u ON ip.user_id = u.id
WHERE ip.id = :instructorId!
  AND ip.branch_id = :branchId!;

/* @name GetInstructorProfileByUserId */
SELECT *
FROM instructor_profiles
WHERE user_id = :userId!
  AND branch_id = :branchId!;

/* @name GetAllInstructors */
SELECT
  ip.*,
  u.first_name,
  u.last_name,
  u.email,
  u.phone
FROM instructor_profiles ip
JOIN "user" u ON ip.user_id = u.id
WHERE ip.branch_id = :branchId!
  AND ip.is_active = true
ORDER BY u.first_name, u.last_name;

/* @name UpdateInstructorProfile */
UPDATE instructor_profiles
SET
  bio = :bio,
  specializations = :specializations,
  certifications = :certifications,
  hourly_rate = :hourlyRate,
  is_active = :isActive!,
  profile_image_url = :profileImageUrl
WHERE id = :instructorId!
  AND branch_id = :branchId!
RETURNING *;

/* @name DeactivateInstructor */
UPDATE instructor_profiles
SET is_active = false
WHERE id = :instructorId!
  AND branch_id = :branchId!
RETURNING *;

/* @name CreateAvailability */
INSERT INTO instructor_availability (
  instructor_id,
  branch_id,
  day_of_week,
  start_time,
  end_time,
  is_recurring,
  effective_date,
  notes
) VALUES (
  :instructorId!,
  :branchId!,
  :dayOfWeek!,
  :startTime!,
  :endTime!,
  :isRecurring!,
  :effectiveDate,
  :notes
)
RETURNING *;

/* @name GetInstructorAvailability */
SELECT *
FROM instructor_availability
WHERE instructor_id = :instructorId!
  AND branch_id = :branchId!
ORDER BY day_of_week, start_time;

/* @name UpdateAvailability */
UPDATE instructor_availability
SET
  day_of_week = :dayOfWeek!,
  start_time = :startTime!,
  end_time = :endTime!,
  is_recurring = :isRecurring!,
  effective_date = :effectiveDate,
  notes = :notes
WHERE id = :availabilityId!
  AND branch_id = :branchId!
RETURNING *;

/* @name DeleteAvailability */
DELETE FROM instructor_availability
WHERE id = :availabilityId!
  AND branch_id = :branchId!
RETURNING *;

/* @name CreateTimeOffRequest */
INSERT INTO instructor_time_off (
  instructor_id,
  branch_id,
  start_date,
  end_date,
  reason,
  status,
  notes
) VALUES (
  :instructorId!,
  :branchId!,
  :startDate!,
  :endDate!,
  :reason,
  :status!,
  :notes
)
RETURNING *;

/* @name GetInstructorTimeOff */
SELECT *
FROM instructor_time_off
WHERE instructor_id = :instructorId!
  AND branch_id = :branchId!
  AND end_date >= :startDate!
ORDER BY start_date;

/* @name ApproveTimeOff */
UPDATE instructor_time_off
SET
  status = 'approved',
  approved_by = :approvedBy!,
  approved_at = CURRENT_TIMESTAMP
WHERE id = :timeOffId!
  AND branch_id = :branchId!
RETURNING *;

/* @name DenyTimeOff */
UPDATE instructor_time_off
SET
  status = 'denied',
  approved_by = :approvedBy!,
  approved_at = CURRENT_TIMESTAMP
WHERE id = :timeOffId!
  AND branch_id = :branchId!
RETURNING *;

/* @name CreateClassAssignment */
INSERT INTO instructor_class_assignments (
  instructor_id,
  class_id,
  branch_id,
  assignment_status,
  assigned_by,
  notes,
  payment_amount,
  payment_status
) VALUES (
  :instructorId!,
  :classId!,
  :branchId!,
  :assignmentStatus!,
  :assignedBy!,
  :notes,
  :paymentAmount,
  :paymentStatus!
)
RETURNING *;

/* @name GetInstructorAssignments */
SELECT
  ica.*,
  c.scheduled_at,
  c.name as class_name,
  c.capacity,
  COUNT(b.id) FILTER (WHERE b.status = 'confirmed') as confirmed_count
FROM instructor_class_assignments ica
JOIN classes c ON ica.class_id = c.id
LEFT JOIN bookings b ON c.id = b.class_id
WHERE ica.instructor_id = :instructorId!
  AND ica.branch_id = :branchId!
  AND c.scheduled_at >= :startDate!
  AND c.scheduled_at <= :endDate!
GROUP BY ica.id, c.scheduled_at, c.name, c.capacity
ORDER BY c.scheduled_at;

/* @name UpdateAssignmentStatus */
UPDATE instructor_class_assignments
SET assignment_status = :assignmentStatus!
WHERE id = :assignmentId!
  AND branch_id = :branchId!
RETURNING *;

/* @name UpdateAssignmentPayment */
UPDATE instructor_class_assignments
SET
  payment_amount = :paymentAmount!,
  payment_status = :paymentStatus!
WHERE id = :assignmentId!
  AND branch_id = :branchId!
RETURNING *;

/* @name CreateInstructorClientNote */
INSERT INTO instructor_client_notes (
  instructor_id,
  client_id,
  branch_id,
  note_text,
  note_type,
  is_private
) VALUES (
  :instructorId!,
  :clientId!,
  :branchId!,
  :noteText!,
  :noteType,
  :isPrivate!
)
RETURNING *;

/* @name GetInstructorNotesForClient */
SELECT
  icn.*,
  ip.user_id as instructor_user_id,
  u.first_name as instructor_first_name,
  u.last_name as instructor_last_name
FROM instructor_client_notes icn
JOIN instructor_profiles ip ON icn.instructor_id = ip.id
JOIN "user" u ON ip.user_id = u.id
WHERE icn.client_id = :clientId!
  AND icn.branch_id = :branchId!
ORDER BY icn.created_at DESC
LIMIT :limit;

/* @name GetInstructorStats */
SELECT * FROM get_instructor_stats(:instructorId!, :startDate!, :endDate!);

/* @name CheckInstructorAvailability */
SELECT is_instructor_available(:instructorId!, :date!, :startTime!, :endTime!) as is_available;

/* @name GetInstructorDashboardStats */
SELECT
  COUNT(DISTINCT ica.class_id) FILTER (
    WHERE c.scheduled_at >= CURRENT_DATE
    AND c.scheduled_at < CURRENT_DATE + INTERVAL '7 days'
  ) as upcoming_classes_week,
  COUNT(DISTINCT ica.class_id) FILTER (
    WHERE ica.assignment_status = 'completed'
    AND c.scheduled_at >= CURRENT_DATE - INTERVAL '30 days'
  ) as completed_classes_month,
  COUNT(DISTINCT b.user_id) FILTER (
    WHERE c.scheduled_at >= CURRENT_DATE - INTERVAL '30 days'
  ) as unique_students_month,
  COALESCE(SUM(ica.payment_amount) FILTER (
    WHERE ica.payment_status = 'paid'
    AND c.scheduled_at >= CURRENT_DATE - INTERVAL '30 days'
  ), 0) as earnings_month
FROM instructor_class_assignments ica
JOIN classes c ON ica.class_id = c.id
LEFT JOIN bookings b ON c.id = b.class_id AND b.status = 'confirmed'
WHERE ica.instructor_id = :instructorId!
  AND ica.branch_id = :branchId!;

/* @name GetInstructorClassHistory */
SELECT
  c.id as class_id,
  c.scheduled_at,
  c.name as class_name,
  c.capacity,
  ica.assignment_status,
  ica.payment_amount,
  ica.payment_status,
  COUNT(b.id) FILTER (WHERE b.status = 'confirmed') as confirmed_count,
  COUNT(ar.id) FILTER (WHERE ar.status = 'present') as present_count,
  ROUND(
    COUNT(ar.id) FILTER (WHERE ar.status = 'present')::NUMERIC /
    NULLIF(COUNT(b.id) FILTER (WHERE b.status = 'confirmed'), 0) * 100,
    2
  ) as attendance_rate
FROM instructor_class_assignments ica
JOIN classes c ON ica.class_id = c.id
LEFT JOIN bookings b ON c.id = b.class_id
LEFT JOIN attendance_records ar ON b.id = ar.booking_id
WHERE ica.instructor_id = :instructorId!
  AND ica.branch_id = :branchId!
  AND c.scheduled_at < CURRENT_TIMESTAMP
GROUP BY c.id, c.scheduled_at, c.name, c.capacity, ica.assignment_status, ica.payment_amount, ica.payment_status
ORDER BY c.scheduled_at DESC
LIMIT :limit;
