/* @name GetAllBranches */
SELECT
  b.id,
  b.name,
  b.address,
  b.phone,
  b.email,
  b.is_active,
  b.created_at,
  b.updated_at,
  bs.cancellation_hours_before,
  bs.booking_hours_before
FROM branches b
LEFT JOIN branch_settings bs ON b.id = bs.branch_id
ORDER BY b.name ASC;

/* @name GetAdminBranches */
SELECT
  b.id,
  b.name,
  b.address,
  b.phone,
  b.email,
  b.is_active,
  aba.is_primary,
  b.created_at,
  b.updated_at,
  bs.cancellation_hours_before,
  bs.booking_hours_before
FROM branches b
INNER JOIN admin_branch_assignments aba ON b.id = aba.branch_id
LEFT JOIN branch_settings bs ON b.id = bs.branch_id
WHERE aba.admin_id = :adminId! AND b.is_active = true
ORDER BY aba.is_primary DESC, b.name ASC;

/* @name GetBranch */
SELECT
  b.id,
  b.name,
  b.address,
  b.phone,
  b.email,
  b.is_active,
  b.created_at,
  b.updated_at,
  bs.cancellation_hours_before,
  bs.booking_hours_before,
  bs.timezone,
  (SELECT COUNT(*) FROM "user" WHERE branch_id = b.id AND role = 'client') as client_count,
  (SELECT COUNT(*) FROM "user" WHERE branch_id = b.id AND role = 'admin') as admin_count,
  (SELECT COUNT(*) FROM classes WHERE branch_id = b.id AND scheduled_at > NOW()) as upcoming_classes_count
FROM branches b
LEFT JOIN branch_settings bs ON b.id = bs.branch_id
WHERE b.id = :branchId!;

/* @name CreateBranch */
INSERT INTO branches (name, address, phone, email, is_active)
VALUES (:name!, :address, :phone, :email, true)
RETURNING id, name, address, phone, email, is_active, created_at;

/* @name UpdateBranch */
UPDATE branches
SET name = :name!,
    address = :address,
    phone = :phone,
    email = :email,
    is_active = :isActive!,
    updated_at = CURRENT_TIMESTAMP
WHERE id = :branchId!
RETURNING id, name, address, phone, email, is_active, updated_at;

/* @name ToggleBranchStatus */
UPDATE branches
SET is_active = NOT is_active,
    updated_at = CURRENT_TIMESTAMP
WHERE id = :branchId!
RETURNING is_active, name;

/* @name DeleteBranch */
DELETE FROM branches WHERE id = :branchId! RETURNING name;

/* @name CheckBranchData */
SELECT
  (SELECT COUNT(*) FROM "user" WHERE branch_id = :branchId!) as users_count,
  (SELECT COUNT(*) FROM classes WHERE branch_id = :branchId!) as classes_count;

/* @name AssignAdminToBranch */
INSERT INTO admin_branch_assignments (admin_id, branch_id, is_primary)
VALUES (:adminId!, :branchId!, :isPrimary!)
ON CONFLICT (admin_id, branch_id)
DO UPDATE SET is_primary = :isPrimary!, updated_at = CURRENT_TIMESTAMP
RETURNING admin_id, branch_id, is_primary;

/* @name RemoveAdminFromBranch */
DELETE FROM admin_branch_assignments
WHERE admin_id = :adminId! AND branch_id = :branchId!;

/* @name UnsetOtherPrimaryBranches */
UPDATE admin_branch_assignments
SET is_primary = false
WHERE admin_id = :adminId!;

/* @name TransferClientToBranch */
UPDATE "user"
SET branch_id = :newBranchId!,
    "updatedAt" = CURRENT_TIMESTAMP
WHERE id = :userId!
RETURNING id, branch_id;

/* @name GetUserForTransfer */
SELECT role, branch_id, first_name, last_name
FROM "user"
WHERE id = :userId!;

/* @name CheckUserRole */
SELECT role FROM "user" WHERE id = :userId!;
