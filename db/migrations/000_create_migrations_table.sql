-- Migration: Create Migrations Tracking Table
-- Date: 2026-01-24
-- Description: Adds a table to track which migrations have been applied

CREATE TABLE IF NOT EXISTS schema_migrations (
  id SERIAL PRIMARY KEY,
  version VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  applied_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  checksum VARCHAR(64),
  execution_time_ms INTEGER,
  success BOOLEAN DEFAULT true
);

-- Create index for faster version lookups
CREATE INDEX IF NOT EXISTS idx_schema_migrations_version ON schema_migrations(version);
CREATE INDEX IF NOT EXISTS idx_schema_migrations_applied_at ON schema_migrations(applied_at DESC);

-- Insert this migration itself
INSERT INTO schema_migrations (version, name, checksum, success)
VALUES ('000', 'create_migrations_table', MD5('create_migrations_table'), true)
ON CONFLICT (version) DO NOTHING;
