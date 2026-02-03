-- Migration: Backfill Package IDs for Existing Bookings
-- Date: 2026-02-01
-- Description: Links existing bookings to user packages after membership-to-package migration

-- Update bookings to link to the user's most appropriate package
-- For each booking without a package_id, find the user's active package at that time
UPDATE bookings b
SET package_id = (
  SELECT ucp.id
  FROM user_class_packages ucp
  WHERE ucp.user_id = b.user_id
    AND ucp.status = 'active'
    AND (ucp.expires_at IS NULL OR ucp.expires_at > b.booked_at)
  ORDER BY ucp.purchased_at DESC
  LIMIT 1
)
WHERE b.package_id IS NULL;

-- Create package_class_usage records for confirmed bookings that now have package_id
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
  1, -- Each booking uses 1 credit
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
VALUES ('017', 'backfill_booking_package_ids', MD5('backfill_booking_package_ids_2026_02_01'), true)
ON CONFLICT (version) DO NOTHING;
