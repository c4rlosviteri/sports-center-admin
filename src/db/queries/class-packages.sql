/* @name CreatePackageTemplate */
INSERT INTO class_package_templates (
  branch_id,
  name,
  description,
  class_count,
  price,
  validity_type,
  validity_period,
  is_gift_eligible,
  is_shareable,
  allows_waitlist,
  priority_booking,
  allowed_class_types,
  blackout_dates,
  max_classes_per_day,
  max_classes_per_week,
  is_active,
  display_order
) VALUES (
  :branchId!,
  :name!,
  :description,
  :classCount!,
  :price!,
  :validityType!,
  :validityPeriod,
  :isGiftEligible!,
  :isShareable!,
  :allowsWaitlist!,
  :priorityBooking!,
  :allowedClassTypes,
  :blackoutDates,
  :maxClassesPerDay,
  :maxClassesPerWeek,
  :isActive!,
  :displayOrder
)
RETURNING *;

/* @name GetPackageTemplates */
SELECT *
FROM class_package_templates
WHERE branch_id = :branchId!
  AND is_active = true
ORDER BY display_order, class_count;

/* @name GetPackageTemplateById */
SELECT *
FROM class_package_templates
WHERE id = :templateId!
  AND branch_id = :branchId!;

/* @name UpdatePackageTemplate */
UPDATE class_package_templates
SET
  name = :name!,
  description = :description,
  class_count = :classCount!,
  price = :price!,
  validity_type = :validityType!,
  validity_period = :validityPeriod,
  is_gift_eligible = :isGiftEligible!,
  is_shareable = :isShareable!,
  allows_waitlist = :allowsWaitlist!,
  priority_booking = :priorityBooking!,
  allowed_class_types = :allowedClassTypes,
  blackout_dates = :blackoutDates,
  max_classes_per_day = :maxClassesPerDay,
  max_classes_per_week = :maxClassesPerWeek,
  is_active = :isActive!,
  display_order = :displayOrder
WHERE id = :templateId!
  AND branch_id = :branchId!
RETURNING *;

/* @name PurchasePackage */
INSERT INTO user_class_packages (
  user_id,
  branch_id,
  package_template_id,
  total_classes,
  classes_remaining,
  expires_at,
  status,
  is_gift,
  gift_from_user_id,
  gift_message,
  payment_id,
  purchase_price
) VALUES (
  :userId!,
  :branchId!,
  :packageTemplateId!,
  :totalClasses!,
  :classesRemaining!,
  :expiresAt,
  :status!,
  :isGift!,
  :giftFromUserId,
  :giftMessage,
  :paymentId,
  :purchasePrice!
)
RETURNING *;

/* @name GetUserPackages */
SELECT
  ucp.*,
  cpt.name as template_name,
  cpt.description as template_description,
  cpt.validity_type,
  cpt.allowed_class_types,
  cpt.max_classes_per_day,
  cpt.max_classes_per_week
FROM user_class_packages ucp
JOIN class_package_templates cpt ON ucp.package_template_id = cpt.id
WHERE ucp.user_id = :userId!
  AND ucp.branch_id = :branchId!
ORDER BY ucp.status = 'active' DESC, ucp.purchased_at DESC;

/* @name GetActivePackages */
SELECT
  ucp.*,
  cpt.name as template_name,
  cpt.allowed_class_types,
  cpt.max_classes_per_day,
  cpt.max_classes_per_week
FROM user_class_packages ucp
JOIN class_package_templates cpt ON ucp.package_template_id = cpt.id
WHERE ucp.user_id = :userId!
  AND ucp.branch_id = :branchId!
  AND ucp.status = 'active'
  AND ucp.classes_remaining > 0
  AND (ucp.expires_at IS NULL OR ucp.expires_at > CURRENT_TIMESTAMP)
  AND (ucp.frozen_until IS NULL OR ucp.frozen_until < CURRENT_DATE)
ORDER BY ucp.expires_at NULLS LAST;

/* @name GetPackageById */
SELECT
  ucp.*,
  cpt.name as template_name,
  cpt.description as template_description,
  cpt.validity_type,
  cpt.allowed_class_types
FROM user_class_packages ucp
JOIN class_package_templates cpt ON ucp.package_template_id = cpt.id
WHERE ucp.id = :packageId!
  AND ucp.branch_id = :branchId!;

/* @name CheckPackageEligibility */
SELECT can_book_with_package(:packageId!, :classId!, :userId!) as can_book;

/* @name UsePackageCredit */
SELECT use_package_credit(:packageId!, :bookingId!, :classId!, :userId!) as success;

/* @name RecordPackageUsage */
INSERT INTO package_class_usage (
  user_package_id,
  booking_id,
  user_id,
  class_id,
  branch_id,
  credits_used
) VALUES (
  :userPackageId!,
  :bookingId!,
  :userId!,
  :classId!,
  :branchId!,
  :creditsUsed!
)
RETURNING *;

/* @name GetPackageUsageHistory */
SELECT
  pcu.*,
  c.scheduled_at,
  c.name as class_name,
  c.instructor
FROM package_class_usage pcu
JOIN classes c ON pcu.class_id = c.id
WHERE pcu.user_package_id = :packageId!
  AND pcu.branch_id = :branchId!
  AND pcu.refunded = false
ORDER BY pcu.used_at DESC;

/* @name RefundPackageCredit */
UPDATE package_class_usage
SET
  refunded = true,
  refunded_at = CURRENT_TIMESTAMP,
  refund_reason = :refundReason
WHERE id = :usageId!
  AND branch_id = :branchId!
RETURNING *;

/* @name RestorePackageCredit */
UPDATE user_class_packages
SET classes_remaining = classes_remaining + :creditsToRestore!
WHERE id = :packageId!
  AND branch_id = :branchId!
RETURNING *;

/* @name FreezePackage */
UPDATE user_class_packages
SET
  status = 'frozen',
  frozen_until = :frozenUntil!
WHERE id = :packageId!
  AND branch_id = :branchId!
RETURNING *;

/* @name UnfreezePackage */
UPDATE user_class_packages
SET
  status = 'active',
  frozen_until = NULL
WHERE id = :packageId!
  AND branch_id = :branchId!
RETURNING *;

/* @name RefundPackage */
UPDATE user_class_packages
SET
  status = 'refunded',
  refund_amount = :refundAmount!,
  refunded_at = CURRENT_TIMESTAMP,
  refund_reason = :refundReason
WHERE id = :packageId!
  AND branch_id = :branchId!
RETURNING *;

/* @name SharePackage */
UPDATE user_class_packages
SET shared_with_user_ids = :sharedWithUserIds!
WHERE id = :packageId!
  AND branch_id = :branchId!
  AND is_shareable = true
RETURNING *;

/* @name CreateGiftCode */
INSERT INTO gift_package_codes (
  code,
  package_template_id,
  branch_id,
  purchased_by,
  purchase_price,
  payment_id,
  recipient_email,
  recipient_name,
  gift_message,
  expires_at
) VALUES (
  generate_gift_code(),
  :packageTemplateId!,
  :branchId!,
  :purchasedBy!,
  :purchasePrice!,
  :paymentId,
  :recipientEmail,
  :recipientName,
  :giftMessage,
  :expiresAt
)
RETURNING *;

/* @name GetGiftCodeByCode */
SELECT
  gpc.*,
  cpt.name as package_name,
  cpt.description as package_description,
  cpt.class_count,
  cpt.validity_type,
  cpt.validity_period
FROM gift_package_codes gpc
JOIN class_package_templates cpt ON gpc.package_template_id = cpt.id
WHERE gpc.code = :code!;

/* @name RedeemGiftCode */
UPDATE gift_package_codes
SET
  redeemed = true,
  redeemed_by = :redeemedBy!,
  redeemed_at = CURRENT_TIMESTAMP,
  user_package_id = :userPackageId!
WHERE code = :code!
  AND redeemed = false
  AND (expires_at IS NULL OR expires_at > CURRENT_TIMESTAMP)
RETURNING *;

/* @name GetUserGiftCodes */
SELECT
  gpc.*,
  cpt.name as package_name,
  cpt.class_count
FROM gift_package_codes gpc
JOIN class_package_templates cpt ON gpc.package_template_id = cpt.id
WHERE gpc.purchased_by = :userId!
  AND gpc.branch_id = :branchId!
ORDER BY gpc.purchased_at DESC;

/* @name GetPackageSalesReport */
SELECT
  cpt.id as template_id,
  cpt.name as package_name,
  cpt.class_count,
  cpt.price,
  COUNT(ucp.id) as packages_sold,
  SUM(ucp.total_classes) as total_classes_sold,
  SUM(ucp.total_classes - ucp.classes_remaining) as classes_used,
  SUM(ucp.purchase_price) as total_revenue,
  AVG(ucp.total_classes - ucp.classes_remaining) as avg_classes_used_per_package
FROM class_package_templates cpt
LEFT JOIN user_class_packages ucp ON cpt.id = ucp.package_template_id
  AND ucp.purchased_at >= :startDate!
  AND ucp.purchased_at <= :endDate!
WHERE cpt.branch_id = :branchId!
  AND cpt.is_active = true
GROUP BY cpt.id, cpt.name, cpt.class_count, cpt.price
ORDER BY total_revenue DESC NULLS LAST;

/* @name GetExpiringPackages */
SELECT
  ucp.*,
  u.first_name,
  u.last_name,
  u.email,
  cpt.name as package_name
FROM user_class_packages ucp
JOIN "user" u ON ucp.user_id = u.id
JOIN class_package_templates cpt ON ucp.package_template_id = cpt.id
WHERE ucp.branch_id = :branchId!
  AND ucp.status = 'active'
  AND ucp.expires_at IS NOT NULL
  AND ucp.expires_at BETWEEN CURRENT_TIMESTAMP AND CURRENT_TIMESTAMP + :daysAhead! * INTERVAL '1 day'
  AND ucp.classes_remaining > 0
ORDER BY ucp.expires_at;

/* @name ExpireOldPackages */
UPDATE user_class_packages
SET status = 'expired'
WHERE branch_id = :branchId!
  AND status = 'active'
  AND expires_at < CURRENT_TIMESTAMP
RETURNING *;

/* @name GetPackageStats */
SELECT
  COUNT(*) FILTER (WHERE status = 'active') as active_count,
  COUNT(*) FILTER (WHERE status = 'expired') as expired_count,
  COUNT(*) FILTER (WHERE status = 'exhausted') as exhausted_count,
  SUM(classes_remaining) FILTER (WHERE status = 'active') as total_credits_available,
  SUM(total_classes - classes_remaining) as total_credits_used,
  ROUND(AVG(total_classes - classes_remaining), 2) as avg_credits_used_per_package
FROM user_class_packages
WHERE branch_id = :branchId!
  AND user_id = :userId!;
