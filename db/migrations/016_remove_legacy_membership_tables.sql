-- Migration: Remove Legacy Membership Tables
-- Date: 2026-02-01
-- Description: Drops membership_plans, user_memberships, and invite_links tables after migrating to packages
-- The system now uses:
--   - class_package_templates (instead of membership_plans)
--   - user_class_packages (instead of user_memberships)
--   - package_invitations (instead of invite_links)
--   - bookings.package_id (instead of bookings.membership_id)

-- ============================================================================
-- STEP 1: Drop foreign key constraints
-- ============================================================================

ALTER TABLE IF EXISTS invite_links DROP CONSTRAINT IF EXISTS invite_links_plan_id_fkey;
ALTER TABLE IF EXISTS user_memberships DROP CONSTRAINT IF EXISTS user_memberships_plan_id_fkey;
ALTER TABLE IF EXISTS bookings DROP CONSTRAINT IF EXISTS bookings_membership_id_fkey;

-- ============================================================================
-- STEP 2: Remove membership_id column from bookings
-- ============================================================================

-- The package_id column was added in migration 009 and is now the primary reference
ALTER TABLE IF EXISTS bookings DROP COLUMN IF EXISTS membership_id;

-- ============================================================================
-- STEP 3: Drop legacy tables
-- ============================================================================

-- Drop the user_memberships table
DROP TABLE IF EXISTS user_memberships CASCADE;

-- Drop the membership_plans table
DROP TABLE IF EXISTS membership_plans CASCADE;

-- Drop the legacy invite_links table (replaced by package_invitations)
DROP TABLE IF EXISTS invite_links CASCADE;

-- ============================================================================
-- STEP 4: Drop related triggers if they exist
-- ============================================================================

DROP TRIGGER IF EXISTS update_membership_plans_updated_at ON membership_plans;
DROP TRIGGER IF EXISTS update_user_memberships_updated_at ON user_memberships;

-- ============================================================================
-- STEP 5: Drop legacy enum type if not used elsewhere
-- ============================================================================

-- Note: plan_frequency enum might still be used, check before dropping
-- DROP TYPE IF EXISTS plan_frequency;

-- ============================================================================
-- RECORD MIGRATION
-- ============================================================================

INSERT INTO schema_migrations (version, name, checksum, success)
VALUES ('016', 'remove_legacy_membership_tables', MD5('remove_legacy_membership_tables_v2_2026_02_01'), true)
ON CONFLICT (version) DO NOTHING;
