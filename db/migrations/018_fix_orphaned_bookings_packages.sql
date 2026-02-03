-- Migration: Fix Orphaned Bookings - Create Packages for Users Without Coverage
-- Date: 2026-02-01
-- Description: Creates packages for users with orphaned bookings and links bookings to them

-- Step 1: Create packages for users with orphaned confirmed/waitlisted bookings
WITH orphaned_users AS (
  SELECT DISTINCT 
    b.user_id,
    c.branch_id,
    COUNT(CASE WHEN b.status = 'confirmed' THEN 1 END) as confirmed_count,
    COUNT(CASE WHEN b.status = 'waitlisted' THEN 1 END) as waitlisted_count
  FROM bookings b
  JOIN classes c ON b.class_id = c.id
  WHERE b.package_id IS NULL 
    AND b.status IN ('confirmed', 'waitlisted')
  GROUP BY b.user_id, c.branch_id
),
-- Get the most appropriate template (smallest class count that covers their needs)
template_selection AS (
  SELECT 
    ou.user_id,
    ou.branch_id,
    ou.confirmed_count,
    cpt.id as template_id,
    cpt.name as template_name,
    cpt.class_count,
    cpt.price
  FROM orphaned_users ou
  CROSS JOIN (
    SELECT id, name, class_count, price
    FROM class_package_templates
    WHERE is_active = true
    ORDER BY class_count ASC
    LIMIT 1
  ) cpt
)
INSERT INTO user_class_packages (
  user_id,
  branch_id,
  package_template_id,
  total_classes,
  classes_remaining,
  expires_at,
  status,
  is_gift,
  purchased_at,
  purchase_price
)
SELECT 
  ts.user_id,
  ts.branch_id,
  ts.template_id,
  ts.class_count,
  GREATEST(ts.class_count - ts.confirmed_count, 0), -- Remaining after covering confirmed bookings
  CURRENT_TIMESTAMP + INTERVAL '30 days', -- Give them 30 days from now
  'active',
  false,
  CURRENT_TIMESTAMP,
  ts.price
FROM template_selection ts
WHERE NOT EXISTS (
  -- Don't create if they already have an active package
  SELECT 1 FROM user_class_packages ucp 
  WHERE ucp.user_id = ts.user_id 
    AND ucp.status = 'active'
)
RETURNING id, user_id, classes_remaining;

-- Step 2: Link orphaned bookings to the newly created packages
UPDATE bookings b
SET package_id = (
  SELECT ucp.id
  FROM user_class_packages ucp
  WHERE ucp.user_id = b.user_id
    AND ucp.status = 'active'
  ORDER BY ucp.purchased_at DESC
  LIMIT 1
)
WHERE b.package_id IS NULL
  AND b.status IN ('confirmed', 'waitlisted');

-- Step 3: Create package_class_usage records for confirmed bookings
INSERT INTO package_class_usage (
  user_package_id,
  booking_id,
  user_id,
  class_id,
  branch_id,
  credits_used,
  created_at
)
SELECT 
  b.package_id,
  b.id,
  b.user_id,
  b.class_id,
  c.branch_id,
  1,
  b.created_at
FROM bookings b
JOIN classes c ON b.class_id = c.id
WHERE b.package_id IS NOT NULL
  AND b.status = 'confirmed'
  AND NOT EXISTS (
    SELECT 1 FROM package_class_usage pcu WHERE pcu.booking_id = b.id
  );

-- Record this migration
INSERT INTO schema_migrations (version, name, checksum, success)
VALUES ('018', 'fix_orphaned_bookings_packages', MD5('fix_orphaned_bookings_packages_2026_02_01'), true)
ON CONFLICT (version) DO NOTHING;
