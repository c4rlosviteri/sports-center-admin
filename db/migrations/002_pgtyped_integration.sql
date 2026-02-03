-- Migration: PGTyped Integration and Type Safety
-- Date: 2026-01-24
-- Description: Documents the integration of PGTyped for type-safe database queries
-- NOTE: This migration is documentation-only as it involves code changes, not schema changes

-- CHANGES MADE:
-- 1. Configured PGTyped with snake_case column names (pgtyped.config.json)
-- 2. Created type-safe SQL query files:
--    - src/db/queries/admin.sql (24 queries)
--    - src/db/queries/branches.sql (14 queries)
--    - src/db/queries/bookings.sql (7 queries)
--    - src/db/queries/classes.sql (extended with 2 new queries)
-- 3. Generated TypeScript types for all queries
-- 4. Migrated all raw pool.query() calls to use PGTyped PreparedQuery
-- 5. Removed duplicate manual type definitions
-- 6. Fixed nullable field types to match database schema
-- 7. Ensured consistent snake_case in DB → camelCase in UI mapping

-- AFFECTED FILES:
-- Code:
--   - src/actions/admin.ts
--   - src/actions/branches.ts
--   - src/actions/bookings.ts
--   - src/actions/classes.ts
--   - src/actions/dashboard.ts (already using PGTyped)
-- Types:
--   - src/types/database.ts (updated Branch, ClassWithCounts interfaces)
-- UI Components:
--   - src/app/(dashboard)/admin/branches/branches-table.tsx
--   - src/app/(dashboard)/admin/branches/edit-branch-dialog.tsx
--   - src/app/(dashboard)/admin/users/[userId]/client-details.tsx
--   - src/app/(dashboard)/client/classes/client-calendar.tsx

-- BENEFITS:
-- ✅ Type safety from database to UI
-- ✅ Compile-time query validation
-- ✅ Eliminated 'any' types
-- ✅ Consistent snake_case ↔ camelCase mapping
-- ✅ Auto-generated types match actual database schema
-- ✅ Reduced runtime errors with nullable field handling

-- Record this migration
INSERT INTO schema_migrations (version, name, checksum, success)
VALUES ('002', 'pgtyped_integration', MD5('pgtyped_integration_2026_01_24'), true)
ON CONFLICT (version) DO NOTHING;
