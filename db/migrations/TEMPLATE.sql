-- Migration: [Brief Title - e.g., "Add User Preferences Table"]
-- Date: YYYY-MM-DD
-- Description: [Detailed description of what this migration does and why it's needed]
--              [Include any important context or dependencies]

-- ============================================================================
-- MIGRATION SQL
-- ============================================================================

-- Your migration SQL goes here
-- Use idempotent patterns (IF NOT EXISTS, DO $$, etc.) when possible

-- Example: Creating a new table
-- CREATE TABLE IF NOT EXISTS example_table (
--   id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
--   name VARCHAR(255) NOT NULL,
--   created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
--   updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
-- );

-- Example: Adding a column
-- DO $$
-- BEGIN
--   IF NOT EXISTS (
--     SELECT 1 FROM information_schema.columns
--     WHERE table_name = 'users' AND column_name = 'new_column'
--   ) THEN
--     ALTER TABLE users ADD COLUMN new_column VARCHAR(255);
--   END IF;
-- END $$;

-- Example: Creating an index
-- DO $$
-- BEGIN
--   IF NOT EXISTS (
--     SELECT 1 FROM pg_indexes WHERE indexname = 'idx_example'
--   ) THEN
--     CREATE INDEX idx_example ON example_table(column_name);
--   END IF;
-- END $$;

-- ============================================================================
-- ROLLBACK INSTRUCTIONS (Comment only - for reference)
-- ============================================================================

-- To rollback this migration, create a new migration file with:
-- DROP TABLE IF EXISTS example_table;
-- DELETE FROM schema_migrations WHERE version = 'XXX';

-- ============================================================================
-- RECORD MIGRATION
-- ============================================================================

-- Replace XXX with your migration version number (e.g., 003, 004, etc.)
-- Replace 'migration_name' with a snake_case identifier
-- Replace 'YYYY_MM_DD' with the current date

INSERT INTO schema_migrations (version, name, checksum, success)
VALUES ('XXX', 'migration_name', MD5('migration_name_YYYY_MM_DD'), true)
ON CONFLICT (version) DO NOTHING;
