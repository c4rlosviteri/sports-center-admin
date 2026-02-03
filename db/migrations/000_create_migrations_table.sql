-- Migration: Create schema_migrations table
-- Date: 2026-02-03
-- Description: Bootstraps migration tracking for databases that predate schema.sql

CREATE TABLE IF NOT EXISTS schema_migrations (
  id SERIAL PRIMARY KEY,
  version VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  applied_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  checksum VARCHAR(64),
  execution_time_ms INTEGER,
  success BOOLEAN DEFAULT true
);

CREATE INDEX IF NOT EXISTS idx_schema_migrations_version ON schema_migrations(version);
CREATE INDEX IF NOT EXISTS idx_schema_migrations_applied_at ON schema_migrations(applied_at DESC);

-- Mark baseline schema as initialized (schema.sql uses version 001)
INSERT INTO schema_migrations (version, name, checksum, success)
VALUES ('001', 'initial_schema_consolidated', MD5('schema_consolidated_2026_02_03'), true)
ON CONFLICT (version) DO NOTHING;
