-- Migration: Drop legacy membership tables
-- Date: 2026-02-03
-- Description: Removes membership_plans and user_memberships (packages are canonical)

-- Drop legacy tables if they exist
DROP TABLE IF EXISTS user_memberships CASCADE;
DROP TABLE IF EXISTS membership_plans CASCADE;

-- Record migration
INSERT INTO schema_migrations (version, name, checksum, success)
VALUES ('024', 'drop_legacy_membership_tables', MD5('drop_legacy_membership_tables_2026_02_03'), true)
ON CONFLICT (version) DO NOTHING;
