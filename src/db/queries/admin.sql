/* @name GetBranchStats */
SELECT
  (SELECT COUNT(*) FROM "user" WHERE branch_id = :branchId! AND role = 'client') as total_clients,
  (SELECT COUNT(*) FROM "user" WHERE branch_id = :branchId! AND role = 'client' AND "createdAt" >= CURRENT_DATE - INTERVAL '30 days') as new_clients_last_month,
  (SELECT COALESCE(SUM(amount), 0) FROM payments p JOIN "user" u ON p.user_id = u.id WHERE u.branch_id = :branchId!) as total_revenue;

/* @name GetUsersByBranch */
SELECT
  id,
  email,
  first_name,
  last_name,
  phone,
  role,
  "createdAt" as created_at
FROM "user"
WHERE branch_id = :branchId! AND role = :role
ORDER BY "createdAt" DESC
LIMIT :limit! OFFSET :offset!;

/* @name CreatePayment */
INSERT INTO payments (
  user_id,
  amount,
  payment_date,
  notes,
  recorded_by
) VALUES (
  :userId!,
  :amount!,
  :paymentDate!,
  :notes,
  :recordedBy!
) RETURNING id, user_id, amount, payment_date, notes, recorded_by, created_at;

/* @name GetPaymentsByUser */
SELECT
  p.id,
  p.user_id,
  p.amount,
  p.payment_date,
  p.notes,
  p.recorded_by,
  p.created_at,
  COALESCE(u.first_name || ' ' || u.last_name, 'Sistema') as recorded_by_name
FROM payments p
LEFT JOIN "user" u ON p.recorded_by = u.id
WHERE p.user_id = :userId!
ORDER BY p.payment_date DESC;

/* @name GetPaymentForAdmin */
SELECT
  p.id,
  p.user_id,
  p.amount,
  u.branch_id
FROM payments p
JOIN "user" u ON p.user_id = u.id
WHERE p.id = :paymentId!
  AND u.branch_id = :branchId!;

/* @name UpdatePayment */
UPDATE payments
SET amount = :amount!,
    payment_date = :paymentDate!,
    notes = :notes,
    updated_at = CURRENT_TIMESTAMP
WHERE id = :paymentId!
RETURNING id;

/* @name DeletePayment */
DELETE FROM payments
WHERE id = :paymentId!
RETURNING id;

/* @name LogAdminAction */
INSERT INTO admin_action_logs (
  admin_id,
  action_type,
  entity_type,
  entity_id,
  description,
  metadata
) VALUES (
  :adminId!,
  :actionType!,
  :entityType!,
  :entityId,
  :description,
  :metadata
) RETURNING id, admin_id, action_type, entity_type, entity_id, description, created_at;

/* @name GetAdminActionLogs */
SELECT
  al.id,
  al.admin_id,
  al.action_type,
  al.entity_type,
  al.entity_id,
  al.description,
  al.metadata,
  al.created_at,
  u.first_name,
  u.last_name,
  u.email
FROM admin_action_logs al
JOIN "user" u ON al.admin_id = u.id
WHERE u.branch_id = :branchId!
ORDER BY al.created_at DESC
LIMIT :limit! OFFSET :offset!;

/* @name GetBranchSettings */
SELECT
  id,
  branch_id,
  cancellation_hours_before,
  timezone,
  created_at,
  updated_at
FROM branch_settings
WHERE branch_id = :branchId!;

/* @name UpdateBranchSettings */
UPDATE branch_settings
SET cancellation_hours_before = :cancellationHoursBefore!,
    timezone = :timezone!,
    updated_at = CURRENT_TIMESTAMP
WHERE branch_id = :branchId!
RETURNING id, branch_id, cancellation_hours_before, timezone, updated_at;

/* @name CreateBranchSettings */
INSERT INTO branch_settings (
  branch_id,
  cancellation_hours_before,
  timezone
) VALUES (
  :branchId!,
  :cancellationHoursBefore!,
  :timezone!
) RETURNING id, branch_id, cancellation_hours_before, timezone, created_at;

/* @name GetNotificationSettings */
SELECT
  id,
  branch_id,
  notification_type,
  is_enabled,
  email_template,
  created_at,
  updated_at
FROM notification_settings
WHERE branch_id = :branchId!;

/* @name UpdateNotificationSetting */
UPDATE notification_settings
SET is_enabled = :isEnabled!,
    email_template = :emailTemplate,
    updated_at = CURRENT_TIMESTAMP
WHERE branch_id = :branchId! AND notification_type = :notificationType!
RETURNING id, branch_id, notification_type, is_enabled, email_template, updated_at;

/* @name CreateNotificationSetting */
INSERT INTO notification_settings (
  branch_id,
  notification_type,
  is_enabled,
  email_template
) VALUES (
  :branchId!,
  :notificationType!,
  :isEnabled!,
  :emailTemplate
) RETURNING id, branch_id, notification_type, is_enabled, email_template, created_at;

/* @name CreateBranch */
INSERT INTO branches (
  name,
  address,
  phone,
  email
) VALUES (
  :name!,
  :address,
  :phone,
  :email
) RETURNING id, name, address, phone, email, created_at;

/* @name GetAllBranches */
SELECT
  id,
  name,
  address,
  phone,
  email,
  created_at,
  updated_at
FROM branches
ORDER BY created_at DESC;

/* @name CheckAdminBranchAccess */
SELECT 1 as has_access
FROM admin_branch_assignments
WHERE admin_id = :adminId! AND branch_id = :branchId!;

/* @name UpdateUserBranch */
UPDATE "user"
SET branch_id = :branchId!,
    "updatedAt" = CURRENT_TIMESTAMP
WHERE id = :userId!
RETURNING id, branch_id;

/* @name GetUserRoleById */
SELECT role
FROM "user"
WHERE id = :userId!;

/* @name GetUserIdByEmail */
SELECT id
FROM "user"
WHERE email = :email!;

/* @name UpdateUserRoleInBranch */
UPDATE "user"
SET role = :role!,
    "updatedAt" = CURRENT_TIMESTAMP
WHERE id = :userId!
  AND branch_id = :branchId!
RETURNING id, role;

/* @name DeleteAdminBranchAssignments */
DELETE FROM admin_branch_assignments
WHERE admin_id = :adminId!;

/* @name CreateAdminBranchAssignment */
INSERT INTO admin_branch_assignments (admin_id, branch_id, is_primary)
VALUES (:adminId!, :branchId!, :isPrimary!)
RETURNING admin_id, branch_id, is_primary;

/* @name CountPaymentsRecordedBy */
SELECT COUNT(*)::int as count
FROM payments
WHERE recorded_by = :userId!;

/* @name DeleteUserInBranch */
DELETE FROM "user"
WHERE id = :userId!
  AND branch_id = :branchId!
RETURNING id;

/* @name CreateUserWithRole */
INSERT INTO "user" (
  email,
  first_name,
  last_name,
  phone,
  role,
  branch_id
) VALUES (
  :email!,
  :firstName!,
  :lastName!,
  :phone,
  :role!,
  :branchId!
)
RETURNING id;

/* @name CreateAccountCredential */
INSERT INTO "account" ("userId", "accountId", "providerId", password)
VALUES (:userId!, :accountId!, 'credential', :password!)
RETURNING id;

/* @name DeleteUser */
DELETE FROM "user"
WHERE id = :userId!;

/* @name GetAllUsers */
SELECT
  u.id,
  u.email,
  u.first_name,
  u.last_name,
  u.phone,
  u.role,
  u.branch_id,
  u."createdAt" as created_at,
  b.name as branch_name
FROM "user" u
LEFT JOIN branches b ON u.branch_id = b.id
WHERE u.branch_id = :branchId!
ORDER BY u."createdAt" DESC;

/* @name GetUsersPaginated */
SELECT
  u.id,
  u.email,
  u.first_name,
  u.last_name,
  u.phone,
  u.role,
  u.branch_id,
  u."createdAt" as created_at,
  b.name as branch_name
FROM "user" u
LEFT JOIN branches b ON u.branch_id = b.id
WHERE u.branch_id = :branchId!
  AND (:role::text IS NULL OR u.role = :role::user_role)
ORDER BY u."createdAt" DESC
LIMIT :limit!
OFFSET :offset!;

/* @name GetUsersCount */
SELECT COUNT(*)::int as total
FROM "user" u
WHERE u.branch_id = :branchId!
  AND (:role::text IS NULL OR u.role = :role::user_role);

/* @name GetAllPackageTemplates */
SELECT
  id,
  branch_id,
  name,
  description,
  price,
  class_count,
  validity_type,
  validity_period,
  is_active,
  created_at,
  updated_at
FROM class_package_templates
WHERE branch_id = :branchId!
ORDER BY is_active DESC, display_order, created_at DESC;

/* @name GetPackageInvitations */
SELECT
  pi.id,
  pi.code,
  pi.expires_at,
  pi.is_active,
  pi.created_at,
  cpt.name as package_name,
  u.first_name || ' ' || u.last_name as created_by_name
FROM package_invitations pi
JOIN class_package_templates cpt ON pi.package_id = cpt.id
LEFT JOIN "user" u ON pi.created_by = u.id
WHERE pi.branch_id = :branchId!
ORDER BY pi.created_at DESC
LIMIT 50;

/* @name GetClientPackages */
SELECT
  ucp.id,
  ucp.package_template_id,
  ucp.purchased_at,
  ucp.expires_at,
  ucp.classes_remaining,
  ucp.total_classes,
  ucp.status,
  ucp.created_at,
  cpt.name as package_name,
  cpt.validity_type
FROM user_class_packages ucp
JOIN class_package_templates cpt ON ucp.package_template_id = cpt.id
WHERE ucp.user_id = :userId!
ORDER BY ucp.purchased_at DESC;

/* @name GetClientBookings */
SELECT
  b.id,
  b.class_id,
  b.status,
  b.waitlist_position,
  b.booked_at,
  b.cancelled_at,
  b.created_at,
  c.name as class_name,
  c.instructor as instructor_name,
  c.scheduled_at,
  c.duration_minutes
FROM bookings b
JOIN classes c ON b.class_id = c.id
WHERE b.user_id = :userId!
ORDER BY c.scheduled_at DESC;

/* @name GetAllPayments */
SELECT
  p.id,
  p.user_id,
  p.amount,
  p.payment_date,
  p.notes,
  p.created_at,
  u.first_name,
  u.last_name,
  u.email,
  COALESCE(recorder.first_name || ' ' || recorder.last_name, 'Sistema') as recorded_by_name
FROM payments p
JOIN "user" u ON p.user_id = u.id
LEFT JOIN "user" recorder ON p.recorded_by = recorder.id
WHERE u.branch_id = :branchId!
ORDER BY p.payment_date DESC;

/* @name GetCurrentBranchContext */
SELECT
  u.id,
  u.role,
  u.branch_id,
  b.name as branch_name
FROM "user" u
LEFT JOIN branches b ON u.branch_id = b.id
WHERE u.id = :userId!;

/* @name GetUserDetails */
SELECT
  id,
  email,
  first_name,
  last_name,
  phone,
  date_of_birth,
  id_number,
  address,
  "createdAt" as created_at
FROM "user"
WHERE id = :userId! AND branch_id = :branchId!;

/* @name CreateAdminClass */
INSERT INTO classes (
  branch_id,
  name,
  instructor,
  scheduled_at,
  duration_minutes,
  capacity,
  waitlist_capacity,
  booking_hours_before
) VALUES (
  :branchId!,
  :name!,
  :instructor!,
  :scheduledAt!,
  :durationMinutes!,
  :capacity!,
  :waitlistCapacity!,
  :bookingHoursBefore
)
RETURNING id, name, instructor, scheduled_at, duration_minutes, capacity, waitlist_capacity, booking_hours_before;

/* @name UpdateAdminClass */
UPDATE classes
SET
  name = :name!,
  instructor = :instructor!,
  scheduled_at = :scheduledAt!,
  duration_minutes = :durationMinutes!,
  capacity = :capacity!,
  waitlist_capacity = :waitlistCapacity!,
  booking_hours_before = :bookingHoursBefore,
  updated_at = CURRENT_TIMESTAMP
WHERE id = :classId!
  AND branch_id = :branchId!
RETURNING id;

/* @name DeleteAdminClass */
DELETE FROM classes
WHERE id = :classId!
  AND branch_id = :branchId!
RETURNING id;

/* @name GetAdminClassesByMonth */
SELECT
  c.id,
  c.name,
  c.instructor,
  (c.scheduled_at AT TIME ZONE 'America/Guayaquil') as scheduled_at,
  c.duration_minutes,
  c.capacity,
  c.waitlist_capacity,
  COUNT(DISTINCT CASE WHEN b.status = 'confirmed' THEN b.id END)::int as confirmed_count,
  COUNT(DISTINCT CASE WHEN b.status = 'waitlisted' THEN b.id END)::int as waitlist_count
FROM classes c
LEFT JOIN bookings b ON c.id = b.class_id
WHERE c.branch_id = :branchId!
  AND EXTRACT(YEAR FROM c.scheduled_at AT TIME ZONE 'America/Guayaquil') = :year!
  AND EXTRACT(MONTH FROM c.scheduled_at AT TIME ZONE 'America/Guayaquil') = :month!
GROUP BY c.id, c.name, c.instructor, c.scheduled_at, c.duration_minutes, c.capacity, c.waitlist_capacity
ORDER BY c.scheduled_at;
