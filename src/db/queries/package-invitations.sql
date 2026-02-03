/* @name GetPackageTemplateForInvitation */
SELECT
  id,
  name,
  branch_id
FROM class_package_templates
WHERE id = :packageId!
  AND branch_id = :branchId!;

/* @name CreatePackageInvitation */
INSERT INTO package_invitations (
  package_id,
  branch_id,
  code,
  created_by,
  is_active
) VALUES (
  :packageId!,
  :branchId!,
  :code!,
  :createdBy!,
  true
)
ON CONFLICT (code) DO NOTHING
RETURNING id;

/* @name GetLatestPackageInvitation */
SELECT
  code,
  created_at
FROM package_invitations
WHERE package_id = :packageId!
  AND branch_id = :branchId!
  AND is_active = true
ORDER BY created_at DESC
LIMIT 1;

/* @name RevokePackageInvitation */
UPDATE package_invitations
SET
  is_active = false,
  updated_at = CURRENT_TIMESTAMP
WHERE code = :code!
  AND branch_id = :branchId!;

/* @name GetInvitationWithPackageDetails */
SELECT
  pi.package_id,
  pi.branch_id,
  cpt.name,
  cpt.description,
  cpt.class_count,
  cpt.price,
  cpt.validity_type,
  cpt.validity_period
FROM package_invitations pi
JOIN class_package_templates cpt ON pi.package_id = cpt.id
WHERE pi.code = :code!
  AND pi.is_active = true
  AND cpt.is_active = true;

/* @name CreateUserPackageFromInvitation */
INSERT INTO user_class_packages (
  user_id,
  branch_id,
  package_template_id,
  total_classes,
  classes_remaining,
  expires_at,
  status,
  is_gift,
  purchase_price
) VALUES (
  :userId!,
  :branchId!,
  :packageTemplateId!,
  :totalClasses!,
  :classesRemaining!,
  :expiresAt,
  'active',
  false,
  :purchasePrice!
)
RETURNING id;
