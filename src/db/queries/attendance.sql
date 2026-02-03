/* @name MarkAttendance */
INSERT INTO attendance_records (
  booking_id,
  user_id,
  class_id,
  branch_id,
  status,
  marked_by,
  notes
) VALUES (
  :bookingId!,
  :userId!,
  :classId!,
  :branchId!,
  :status!,
  :markedBy,
  :notes
) ON CONFLICT (booking_id) DO UPDATE SET
  status = EXCLUDED.status,
  marked_by = EXCLUDED.marked_by,
  marked_at = CURRENT_TIMESTAMP,
  notes = EXCLUDED.notes
RETURNING *;

/* @name GetAttendanceRecordsByClass */
SELECT
  ar.*,
  u.first_name,
  u.last_name,
  u.email,
  b.status as booking_status
FROM attendance_records ar
JOIN "user" u ON ar.user_id = u.id
JOIN bookings b ON ar.booking_id = b.id
WHERE ar.class_id = :classId!
  AND ar.branch_id = :branchId!
ORDER BY ar.marked_at DESC;

/* @name GetAttendanceRecordsByUser */
SELECT
  ar.*,
  c.scheduled_at,
  c.instructor
FROM attendance_records ar
JOIN classes c ON ar.class_id = c.id
WHERE ar.user_id = :userId!
  AND ar.branch_id = :branchId!
ORDER BY c.scheduled_at DESC
LIMIT :limit;

/* @name GetNoShowStats */
SELECT
  user_id,
  COUNT(*) FILTER (WHERE status = 'absent') as no_show_count,
  COUNT(*) as total_attended_classes,
  ROUND(
    (COUNT(*) FILTER (WHERE status = 'absent')::numeric / NULLIF(COUNT(*), 0)) * 100,
    2
  ) as no_show_percentage
FROM attendance_records
WHERE user_id = :userId!
  AND branch_id = :branchId!
  AND created_at >= CURRENT_TIMESTAMP - INTERVAL '90 days'
GROUP BY user_id;

/* @name CreateNoShowPenalty */
INSERT INTO no_show_penalties (
  user_id,
  branch_id,
  no_show_count,
  penalty_type,
  penalty_start_date,
  penalty_end_date,
  applied_by,
  notes
) VALUES (
  :userId!,
  :branchId!,
  :noShowCount!,
  :penaltyType!,
  :penaltyStartDate!,
  :penaltyEndDate!,
  :appliedBy!,
  :notes
)
RETURNING *;

/* @name GetActivePenalties */
SELECT
  id,
  user_id,
  branch_id,
  no_show_count,
  penalty_start_date,
  penalty_end_date,
  is_active,
  penalty_type,
  created_at,
  updated_at,
  created_by,
  notes
FROM no_show_penalties
WHERE user_id = :userId!
  AND branch_id = :branchId!
  AND is_active = true
  AND penalty_end_date > CURRENT_TIMESTAMP
ORDER BY penalty_start_date DESC;

/* @name DeactivatePenalty */
UPDATE no_show_penalties
SET is_active = false
WHERE id = :penaltyId!
  AND branch_id = :branchId!
RETURNING *;

/* @name CreateLateCancellationFee */
INSERT INTO late_cancellation_fees (
  booking_id,
  user_id,
  class_id,
  branch_id,
  fee_amount,
  cancelled_at,
  payment_status,
  notes
) VALUES (
  :bookingId!,
  :userId!,
  :classId!,
  :branchId!,
  :feeAmount!,
  :cancelledAt!,
  :paymentStatus!,
  :notes
)
RETURNING *;

/* @name GetOutstandingFees */
SELECT
  lcf.*,
  c.scheduled_at,
  c.instructor
FROM late_cancellation_fees lcf
JOIN classes c ON lcf.class_id = c.id
WHERE lcf.user_id = :userId!
  AND lcf.branch_id = :branchId!
  AND lcf.payment_status = 'unpaid'
ORDER BY lcf.cancelled_at DESC;

/* @name MarkFeeAsPaid */
UPDATE late_cancellation_fees
SET payment_status = 'paid',
    paid_at = CURRENT_TIMESTAMP
WHERE id = :feeId!
  AND branch_id = :branchId!
RETURNING *;

/* @name GetClassAttendanceSummary */
SELECT
  c.id as class_id,
  c.scheduled_at,
  c.instructor,
  c.capacity,
  COUNT(b.id) as total_bookings,
  COUNT(ar.id) FILTER (WHERE ar.status = 'present') as present_count,
  COUNT(ar.id) FILTER (WHERE ar.status = 'absent') as absent_count,
  COUNT(ar.id) FILTER (WHERE ar.status = 'late') as late_count,
  ROUND(
    (COUNT(ar.id) FILTER (WHERE ar.status = 'present')::numeric / NULLIF(COUNT(b.id), 0)) * 100,
    2
  ) as attendance_rate
FROM classes c
LEFT JOIN bookings b ON c.id = b.class_id AND b.status = 'confirmed'
LEFT JOIN attendance_records ar ON b.id = ar.booking_id
WHERE c.branch_id = :branchId!
  AND c.scheduled_at >= :startDate!
  AND c.scheduled_at <= :endDate!
GROUP BY c.id, c.scheduled_at, c.instructor, c.capacity
ORDER BY c.scheduled_at DESC;

/* @name GetUserAttendanceHistory */
SELECT
  c.id as class_id,
  c.scheduled_at,
  c.instructor,
  b.id as booking_id,
  b.status as booking_status,
  ar.status as attendance_status,
  ar.marked_at,
  ar.notes
FROM bookings b
JOIN classes c ON b.class_id = c.id
LEFT JOIN attendance_records ar ON b.id = ar.booking_id
WHERE b.user_id = :userId!
  AND b.branch_id = :branchId!
  AND c.scheduled_at < CURRENT_TIMESTAMP
ORDER BY c.scheduled_at DESC
LIMIT :limit;
