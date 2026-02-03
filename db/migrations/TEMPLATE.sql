-- Migration: <Title>
-- Date: YYYY-MM-DD
-- Description: <Short description of the change>

-- Example (idempotent)
-- DO $$
-- BEGIN
--   IF NOT EXISTS (
--     SELECT 1 FROM information_schema.columns
--     WHERE table_name = 'user' AND column_name = 'preferences'
--   ) THEN
--     ALTER TABLE "user" ADD COLUMN preferences JSONB DEFAULT '{}'::jsonb;
--   END IF;
-- END $$;

-- Record this migration
INSERT INTO schema_migrations (version, name, checksum, success)
VALUES ('XXX', 'migration_name', MD5('migration_name_YYYY_MM_DD'), true)
ON CONFLICT (version) DO NOTHING;
