-- Migration: Rename plan_expiration to package_expiration in notification_type enum
-- Date: 2026-02-03
-- Description: Updates notification_type enum to use 'package_expiration' instead of 'plan_expiration'
--              to align with the migration from membership plans to class packages

-- PostgreSQL doesn't support renaming enum values directly
-- We need to add the new value, update data, then remove the old value

-- Step 1: Add the new enum value
ALTER TYPE notification_type ADD VALUE IF NOT EXISTS 'package_expiration';

-- Step 2: Update existing data from plan_expiration to package_expiration
UPDATE notification_settings 
SET notification_type = 'package_expiration'::notification_type
WHERE notification_type = 'plan_expiration'::notification_type;

UPDATE waitlist_notifications
SET notification_type = 'package_expiration'::notification_type  
WHERE notification_type = 'plan_expiration'::notification_type;

-- Note: Cannot drop 'plan_expiration' from enum without recreating the type
-- The old value will remain in the enum but won't be used
-- This is a PostgreSQL limitation - enum values cannot be removed

-- Record migration
INSERT INTO schema_migrations (version, name, checksum, success)
VALUES ('002', 'rename_plan_to_package_expiration', MD5('rename_plan_to_package_expiration_2026_02_03'), true)
ON CONFLICT (version) DO NOTHING;
