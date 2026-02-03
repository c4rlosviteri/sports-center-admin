/* @name CreateRecurringTemplate */
INSERT INTO recurring_class_templates (
  branch_id,
  name,
  instructor,
  day_of_week,
  start_time,
  duration_minutes,
  capacity,
  waitlist_capacity,
  is_active,
  start_date,
  end_date,
  created_by
) VALUES (
  :branchId!,
  :name!,
  :instructor!,
  :dayOfWeek!,
  :startTime!,
  :durationMinutes!,
  :capacity!,
  :waitlistCapacity!,
  :isActive!,
  :startDate!,
  :endDate,
  :createdBy!
)
RETURNING *;

/* @name GetRecurringTemplates */
SELECT *
FROM recurring_class_templates
WHERE branch_id = :branchId!
  AND is_active = true
ORDER BY day_of_week ASC, start_time ASC;

/* @name GetRecurringTemplateById */
SELECT *
FROM recurring_class_templates
WHERE id = :templateId!
  AND branch_id = :branchId!;

/* @name UpdateRecurringTemplate */
UPDATE recurring_class_templates
SET
  name = :name!,
  instructor = :instructor!,
  day_of_week = :dayOfWeek!,
  start_time = :startTime!,
  duration_minutes = :durationMinutes!,
  capacity = :capacity!,
  waitlist_capacity = :waitlistCapacity!,
  is_active = :isActive!,
  start_date = :startDate!,
  end_date = :endDate
WHERE id = :templateId!
  AND branch_id = :branchId!
RETURNING *;

/* @name DeactivateRecurringTemplate */
UPDATE recurring_class_templates
SET is_active = false
WHERE id = :templateId!
  AND branch_id = :branchId!
RETURNING *;

/* @name DeleteRecurringTemplate */
DELETE FROM recurring_class_templates
WHERE id = :templateId!
  AND branch_id = :branchId!
RETURNING *;

/* @name CreateHolidayException */
INSERT INTO holiday_exceptions (
  branch_id,
  exception_date,
  name,
  description,
  affects_all_classes,
  created_by
) VALUES (
  :branchId!,
  :exceptionDate!,
  :name!,
  :description,
  :affectsAllClasses!,
  :createdBy!
)
RETURNING *;

/* @name GetHolidayExceptions */
SELECT *
FROM holiday_exceptions
WHERE branch_id = :branchId!
  AND exception_date >= :startDate!
  AND exception_date <= :endDate!
ORDER BY exception_date ASC;

/* @name GetUpcomingHolidays */
SELECT *
FROM holiday_exceptions
WHERE branch_id = :branchId!
  AND exception_date >= CURRENT_DATE
ORDER BY exception_date ASC
LIMIT :limit;

/* @name DeleteHolidayException */
DELETE FROM holiday_exceptions
WHERE id = :exceptionId!
  AND branch_id = :branchId!
RETURNING *;

/* @name GetGenerationLog */
SELECT
  gcl.*,
  rct.name as template_name,
  u.first_name || ' ' || u.last_name as generated_by_name
FROM generated_classes_log gcl
JOIN recurring_class_templates rct ON gcl.template_id = rct.id
LEFT JOIN "user" u ON gcl.generated_by = u.id
WHERE gcl.branch_id = :branchId!
ORDER BY gcl.generated_at DESC
LIMIT :limit;

/* @name GetGenerationLogByTemplate */
SELECT
  gcl.*,
  u.first_name || ' ' || u.last_name as generated_by_name
FROM generated_classes_log gcl
LEFT JOIN "user" u ON gcl.generated_by = u.id
WHERE gcl.template_id = :templateId!
  AND gcl.branch_id = :branchId!
ORDER BY gcl.generated_at DESC
LIMIT :limit;

/* @name GetClassesByTemplate */
SELECT
  c.*,
  COUNT(b.id) FILTER (WHERE b.status = 'confirmed') as confirmed_count,
  COUNT(b.id) FILTER (WHERE b.status = 'waitlisted') as waitlist_count
FROM classes c
LEFT JOIN bookings b ON c.id = b.class_id
WHERE c.template_id = :templateId!
  AND c.branch_id = :branchId!
  AND c.scheduled_at >= :startDate!
  AND c.scheduled_at <= :endDate!
GROUP BY c.id
ORDER BY c.scheduled_at ASC;

/* @name BulkUpdateTemplateClasses */
UPDATE classes
SET
  instructor = :instructor!,
  capacity = :capacity!,
  waitlist_capacity = :waitlistCapacity!
WHERE template_id = :templateId!
  AND branch_id = :branchId!
  AND scheduled_at >= CURRENT_TIMESTAMP
RETURNING *;

/* @name GetTemplateStats */
SELECT
  rct.id,
  rct.name,
  rct.instructor,
  rct.day_of_week,
  rct.start_time,
  rct.capacity,
  COUNT(DISTINCT c.id) as total_classes_generated,
  COUNT(DISTINCT b.id) FILTER (WHERE b.status = 'confirmed') as total_bookings,
  ROUND(
    AVG(
      (SELECT COUNT(*) FROM bookings WHERE class_id = c.id AND status = 'confirmed')::numeric
    ),
    2
  ) as avg_attendance_per_class,
  ROUND(
    (COUNT(DISTINCT b.id) FILTER (WHERE b.status = 'confirmed')::numeric /
     NULLIF(COUNT(DISTINCT c.id) * rct.capacity, 0)) * 100,
    2
  ) as utilization_rate
FROM recurring_class_templates rct
LEFT JOIN classes c ON rct.id = c.template_id
LEFT JOIN bookings b ON c.id = b.class_id
WHERE rct.branch_id = :branchId!
  AND rct.is_active = true
GROUP BY rct.id, rct.name, rct.instructor, rct.day_of_week, rct.start_time, rct.capacity
ORDER BY rct.day_of_week ASC, rct.start_time ASC;
