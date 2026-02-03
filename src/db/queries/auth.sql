/* @name GetUserByEmail */
SELECT
  id,
  email,
  first_name,
  last_name,
  date_of_birth,
  id_number,
  address,
  phone,
  role,
  branch_id,
  terms_accepted_at,
  "createdAt" as created_at
FROM "user"
WHERE email = :email!;

/* @name GetUserById */
SELECT
  id,
  email,
  first_name,
  last_name,
  date_of_birth,
  id_number,
  address,
  phone,
  role,
  branch_id,
  terms_accepted_at,
  "createdAt" as created_at
FROM "user"
WHERE id = :userId!;

/* @name GetUserWithBranch */
SELECT
  u.id,
  u.email,
  u.name,
  u.first_name,
  u.last_name,
  u.date_of_birth,
  u.id_number,
  u.address,
  u.phone,
  u.role,
  u.branch_id,
  u.terms_accepted_at,
  u."createdAt" as created_at,
  b.name as branch_name
FROM "user" u
LEFT JOIN branches b ON u.branch_id = b.id
WHERE u.id = :userId!;

/* @name UpdateUserRole */
UPDATE "user"
SET role = :role!,
    "updatedAt" = CURRENT_TIMESTAMP
WHERE id = :userId!
RETURNING id, email, role;

/* @name UpdateUserBranch */
UPDATE "user"
SET branch_id = :branchId,
    "updatedAt" = CURRENT_TIMESTAMP
WHERE id = :userId!
RETURNING id, email, branch_id;

/* @name UpdateUserProfile */
UPDATE "user"
SET first_name = COALESCE(:firstName, first_name),
    last_name = COALESCE(:lastName, last_name),
    phone = COALESCE(:phone, phone),
    address = COALESCE(:address, address),
    "updatedAt" = CURRENT_TIMESTAMP
WHERE id = :userId!
RETURNING id, email, first_name, last_name, phone, address;

/* @name GetPackageInvitationByCode */
SELECT
  pi.id,
  pi.package_id,
  pi.branch_id,
  pi.code,
  pi.is_active,
  pi.expires_at,
  pi.created_at,
  b.name as branch_name,
  cpt.name as package_name,
  cpt.class_count,
  cpt.validity_type,
  cpt.validity_period,
  cpt.price
FROM package_invitations pi
JOIN branches b ON pi.branch_id = b.id
JOIN class_package_templates cpt ON pi.package_id = cpt.id
WHERE pi.code = :code!
  AND pi.is_active = true
  AND cpt.is_active = true
  AND (pi.expires_at IS NULL OR pi.expires_at > CURRENT_TIMESTAMP);

/* @name GetUsersByBranch */
SELECT
  u.id,
  u.email,
  u.first_name,
  u.last_name,
  u.role,
  u.branch_id,
  u."createdAt" as created_at,
  b.name as branch_name
FROM "user" u
LEFT JOIN branches b ON u.branch_id = b.id
WHERE u.branch_id = :branchId!
ORDER BY u."createdAt" DESC;

/* @name GetUsersByRole */
SELECT
  u.id,
  u.email,
  u.first_name,
  u.last_name,
  u.role,
  u.branch_id,
  u."createdAt" as created_at,
  b.name as branch_name
FROM "user" u
LEFT JOIN branches b ON u.branch_id = b.id
WHERE u.role = :role!
ORDER BY u."createdAt" DESC;

/* @name GetAllClients */
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
WHERE u.role = 'client'
ORDER BY u."createdAt" DESC;
