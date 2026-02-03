-- Migration: Add Error Message Column to Schema Migrations
-- Date: 2026-02-01
-- Description: Adds error_message column to track migration failures

ALTER TABLE schema_migrations 
ADD COLUMN IF NOT EXISTS error_message TEXT;

-- Update the migration record
INSERT INTO schema_migrations (version, name, checksum, success)
VALUES ('015', 'add_error_message_column', MD5('add_error_message_column_2026_02_01'), true)
ON CONFLICT (version) DO NOTHING;
