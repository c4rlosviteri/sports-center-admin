# Database Migrations Guide

## Overview

This project uses a versioned migration system to track and apply database schema changes. Each migration is a SQL file with a numeric prefix that runs in order.

## Migration Files Location

```
db/migrations/
├── 000_create_migrations_table.sql
├── 001_add_multi_branch_support.sql
├── 002_pgtyped_integration.sql
└── [future migrations...]
```

## Running Migrations

### Using the Migration Runner

```bash
# Run all pending migrations
./db/run-migrations.sh

# Run with custom database URL
DATABASE_URL=postgres://user:pass@host:port/dbname ./db/run-migrations.sh
```

### Manual Execution

```bash
# Run a specific migration
psql postgres://localhost:5432/biciantro -f db/migrations/001_add_multi_branch_support.sql
```

## Creating a New Migration

### 1. Determine the Version Number

- Migrations are numbered sequentially: `000`, `001`, `002`, etc.
- Check the latest migration in `db/migrations/` and increment by 1

### 2. Create the Migration File

File naming convention: `{VERSION}_{description}.sql`

Example: `003_add_user_preferences.sql`

### 3. Use the Migration Template

```sql
-- Migration: [Brief Title]
-- Date: YYYY-MM-DD
-- Description: [What this migration does and why]

-- Your migration SQL here
-- Keep migrations idempotent when possible (use IF NOT EXISTS, etc.)

-- Record this migration
INSERT INTO schema_migrations (version, name, checksum, success)
VALUES ('003', 'add_user_preferences', MD5('add_user_preferences_YYYY_MM_DD'), true)
ON CONFLICT (version) DO NOTHING;
```

### 4. Best Practices

✅ **DO:**
- Keep migrations small and focused
- Make migrations idempotent (can run multiple times safely)
- Use descriptive names
- Add comments explaining complex changes
- Test migrations on a local database first
- Include rollback instructions in comments
- Update PGTyped queries if schema changes affect existing queries

❌ **DON'T:**
- Modify existing migration files that have been applied
- Delete migration files
- Change migration version numbers
- Include data that could expose sensitive information

## Migration Types

### Schema Migrations (Most Common)

Changes to database structure:
- `CREATE TABLE`, `ALTER TABLE`, `DROP TABLE`
- `CREATE INDEX`, `DROP INDEX`
- `ADD COLUMN`, `DROP COLUMN`, `ALTER COLUMN`
- `CREATE TRIGGER`, `CREATE FUNCTION`

### Data Migrations

Changes to existing data:
- `UPDATE` statements for data transformations
- `INSERT` for seed data
- `DELETE` for cleanup

### Code-Only Migrations (Documentation)

Changes that don't modify the database but need tracking:
- PGTyped query updates
- Type system changes
- API contract changes

## After Schema Changes

When you modify the database schema, you must:

### 1. Update PGTyped Queries

If your migration affects tables used in PGTyped queries:

```bash
# Regenerate TypeScript types
npx pgtyped -c pgtyped.config.json
```

### 2. Update SQL Query Files

Add or modify queries in:
- `src/db/queries/admin.sql`
- `src/db/queries/branches.sql`
- `src/db/queries/bookings.sql`
- `src/db/queries/classes.sql`
- `src/db/queries/dashboard.sql`
- etc.

### 3. Update Action Files

Update the corresponding action files to use the new queries:
- `src/actions/admin.ts`
- `src/actions/branches.ts`
- `src/actions/bookings.ts`
- etc.

### 4. Update Type Definitions

If database schema changes affect UI types:
- Update `src/types/database.ts`
- Ensure nullable fields match database schema
- Update interfaces that reference changed tables

## Migration History Tracking

All applied migrations are tracked in the `schema_migrations` table:

```sql
-- Check which migrations have been applied
SELECT version, name, applied_at, success
FROM schema_migrations
ORDER BY version;

-- Check if a specific migration has been applied
SELECT * FROM schema_migrations WHERE version = '001';
```

## Rollback Strategy

### For Schema Changes

Create a corresponding rollback migration:

```sql
-- Original: 003_add_user_preferences.sql
-- Rollback: 004_rollback_user_preferences.sql
```

### For Emergency Rollback

```sql
-- Manually rollback (use with caution)
BEGIN;
-- Your rollback SQL
DELETE FROM schema_migrations WHERE version = '003';
COMMIT;
```

## Example Migration Workflow

```bash
# 1. Create new migration file
touch db/migrations/003_add_notification_settings.sql

# 2. Write migration SQL with idempotent checks
# (see template above)

# 3. Test locally
./db/run-migrations.sh

# 4. If schema changes, regenerate PGTyped
npx pgtyped -c pgtyped.config.json

# 5. Update queries and actions as needed

# 6. Test the application
npm run dev

# 7. Commit migration and code changes together
git add db/migrations/003_add_notification_settings.sql
git add src/db/queries/*.sql src/db/queries/*.ts
git add src/actions/*.ts
git commit -m "Add notification settings table"
```

## Common Patterns

### Adding a New Table

```sql
CREATE TABLE IF NOT EXISTS new_table (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_new_table_name ON new_table(name);

-- Add trigger for updated_at
CREATE TRIGGER update_new_table_updated_at
  BEFORE UPDATE ON new_table
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

### Adding a Column

```sql
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'preferences'
  ) THEN
    ALTER TABLE users ADD COLUMN preferences JSONB DEFAULT '{}'::jsonb;
  END IF;
END $$;
```

### Creating an Index

```sql
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes WHERE indexname = 'idx_users_email'
  ) THEN
    CREATE INDEX idx_users_email ON users(email);
  END IF;
END $$;
```

## Troubleshooting

### Migration Fails Midway

```bash
# Check what failed
psql postgres://localhost:5432/biciantro

# Check migrations table
SELECT * FROM schema_migrations ORDER BY applied_at DESC LIMIT 5;

# Fix the issue and re-run
./db/run-migrations.sh
```

### Migration Marked as Applied But Failed

```sql
-- Check the success status
SELECT * FROM schema_migrations WHERE success = false;

-- Mark as not applied to retry
DELETE FROM schema_migrations WHERE version = '003';
```

### Schema Out of Sync with PGTyped

```bash
# Regenerate all types
npx pgtyped -c pgtyped.config.json

# Check for TypeScript errors
npx tsc --noEmit
```

## Current Migration Status

| Version | Name | Date | Status |
|---------|------|------|--------|
| 000 | create_migrations_table | 2026-01-24 | ✅ Applied |
| 001 | add_multi_branch_support | 2026-01-23 | ✅ Applied |
| 002 | pgtyped_integration | 2026-01-24 | ✅ Applied (Code-only) |

## Related Documentation

- [PGTyped Configuration](../pgtyped.config.json)
- [Database Schema](./schema.sql)
- [Setup Instructions](../SETUP.md)
