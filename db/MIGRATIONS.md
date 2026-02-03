# Database Migrations Guide

## Overview

This project uses a **single-schema + incremental migrations** approach:

- **`db/schema.sql`** - The complete, canonical database schema. This is the source of truth.
- **`db/migrations/`** - Contains only incremental migrations for changes AFTER the initial schema setup.

## Quick Start

### New Database (Fresh Setup)

For a brand new database, simply run the schema file:

```bash
# Create database first
createdb biciantro

# Apply complete schema
psql postgres://localhost:5432/biciantro -f db/schema.sql
```

This creates all 42+ tables, functions, indexes, and sets up migration tracking automatically.

### Existing Database (Already Has Schema)

If the database already has tables, run any pending incremental migrations. The runner
will bootstrap `schema_migrations` automatically if it doesn't exist yet:

```bash
# Check migration status
npm run migrate:status

# Run pending migrations (002, 003, etc.)
npm run migrate
```

## How It Works

### The Consolidated Schema (schema.sql)

The `db/schema.sql` file contains:

1. **All 42 tables** - Complete table definitions with columns, types, constraints
2. **All indexes** - Performance indexes for every table
3. **All functions** - 15+ helper functions (booking validation, equipment assignment, etc.)
4. **All triggers** - Automatic timestamp updates
5. **All foreign keys** - Referential integrity constraints
6. **All enums** - User roles, booking statuses, notification types, etc.
7. **Migration tracking table** - For future incremental changes

When you run `schema.sql` on a fresh database, it automatically records version `001` in the `schema_migrations` table, marking the schema as initialized.

### Incremental Migrations (db/migrations/)

After the initial schema is applied, future changes use numbered migration files:

```
db/migrations/
├── 002_add_notification_settings.sql
├── 003_modify_booking_constraints.sql
├── 004_add_user_preferences.sql
└── [future migrations...]
```

**Key points:**
- Start numbering from **002** (001 is reserved for the consolidated schema)
- Each migration should be idempotent (safe to run multiple times)
- Include the migration recording SQL at the end of each file

> Note: `db/migrations/000_create_migrations_table.sql` exists solely to bootstrap
> migration tracking for older databases. It is not part of the incremental chain.

## Creating a New Migration

### 1. Determine the Version Number

- Find the highest migration number in `db/migrations/`
- Increment by 1 (e.g., if highest is 003, use 004)
- **Never use 001** (reserved for consolidated schema)

### 2. Create the Migration File

File naming: `{VERSION}_{description}.sql`

Example: `004_add_user_preferences.sql`

```sql
-- Migration: Add User Preferences
-- Date: 2026-02-03
-- Description: Adds JSONB column for user preference storage

-- Add the column (idempotent)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user' AND column_name = 'preferences'
  ) THEN
    ALTER TABLE "user" ADD COLUMN preferences JSONB DEFAULT '{}'::jsonb;
  END IF;
END $$;

-- Record this migration
INSERT INTO schema_migrations (version, name, checksum, success)
VALUES ('004', 'add_user_preferences', MD5('add_user_preferences_2026_02_03'), true)
ON CONFLICT (version) DO NOTHING;
```

### 3. Best Practices

✅ **DO:**
- Use `IF NOT EXISTS` or `DO $$` blocks for idempotency
- Keep migrations small and focused on one change
- Add comments explaining the change
- Test migrations on a local database first
- Update PGTyped queries if schema changes affect existing queries

❌ **DON'T:**
- Modify migration files after they've been applied
- Create migrations that duplicate what's already in schema.sql
- Skip version numbers

## After Schema Changes

### Update PGTyped Queries

If your migration affects tables used in PGTyped queries:

```bash
# Regenerate TypeScript types
npx pgtyped -c pgtyped.config.json
```

### Update SQL Query Files

Add or modify queries in:
- `src/db/queries/admin.sql`
- `src/db/queries/branches.sql`
- `src/db/queries/bookings.sql`
- etc.

### Update Action Files

Update the corresponding action files:
- `src/actions/admin.ts`
- `src/actions/branches.ts`
- etc.

## Migration History

### Where Are The Old Migrations?

Historical migrations (001-023) have been **consolidated into schema.sql** and removed from the working tree, but they are **preserved in git history**.  
The repo keeps only:

- `db/migrations/000_create_migrations_table.sql` (bootstrap tracking table)
- `db/migrations/TEMPLATE.sql` (migration template)
- New incremental migrations **002+**

If you need to see the evolution:
```bash
# View old migrations from git history
git show HEAD~1:db/migrations/000_create_migrations_table.sql
git log --oneline -- db/migrations/
```

### Why Consolidate?

1. **Single source of truth** - One file shows the complete schema
2. **Easier onboarding** - New developers can understand the database by reading one file
3. **Simpler setup** - No need to run dozens of sequential migrations
4. **Better tooling** - Schema can be diffed, reviewed, and visualized easily

### Checking Migration Status

```sql
-- See all applied migrations
SELECT version, name, applied_at, success
FROM schema_migrations
ORDER BY version;

-- Check current schema version
SELECT version FROM schema_migrations 
WHERE success = true 
ORDER BY version DESC 
LIMIT 1;
```

## Common Migration Patterns

### Adding a New Table

```sql
-- Migration: Add Equipment Categories
-- Date: 2026-02-03

CREATE TABLE IF NOT EXISTS equipment_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  branch_id UUID NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_equipment_categories_branch 
ON equipment_categories(branch_id);

CREATE TRIGGER update_equipment_categories_updated_at
  BEFORE UPDATE ON equipment_categories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Record migration
INSERT INTO schema_migrations (version, name, checksum, success)
VALUES ('005', 'add_equipment_categories', MD5('add_equipment_categories_2026_02_03'), true)
ON CONFLICT (version) DO NOTHING;
```

### Adding a Column

```sql
-- Migration: Add Phone Verification
-- Date: 2026-02-03

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user' AND column_name = 'phone_verified'
  ) THEN
    ALTER TABLE "user" ADD COLUMN phone_verified BOOLEAN DEFAULT false;
  END IF;
END $$;

-- Record migration
INSERT INTO schema_migrations (version, name, checksum, success)
VALUES ('006', 'add_phone_verified', MD5('add_phone_verified_2026_02_03'), true)
ON CONFLICT (version) DO NOTHING;
```

### Creating an Index

```sql
-- Migration: Add User Search Index
-- Date: 2026-02-03

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes WHERE indexname = 'idx_user_search'
  ) THEN
    CREATE INDEX idx_user_search ON "user" 
    USING gin(to_tsvector('spanish', coalesce(first_name, '') || ' ' || coalesce(last_name, '')));
  END IF;
END $$;

-- Record migration
INSERT INTO schema_migrations (version, name, checksum, success)
VALUES ('007', 'add_user_search_index', MD5('add_user_search_index_2026_02_03'), true)
ON CONFLICT (version) DO NOTHING;
```

## Troubleshooting

### Migration Fails

```bash
# Check which migration failed
psql postgres://localhost:5432/biciantro -c "SELECT * FROM schema_migrations WHERE success = false;"

# View the error
psql postgres://localhost:5432/biciantro -c "SELECT * FROM schema_migrations ORDER BY applied_at DESC LIMIT 5;"
```

### Need to Re-run a Migration

```sql
-- Remove the migration record to retry
DELETE FROM schema_migrations WHERE version = '004';

-- Then re-run the migration
```

### Schema Out of Sync

If `schema.sql` and the actual database diverge:

1. **For new databases**: Just re-run `schema.sql`
2. **For existing databases**: Create incremental migrations to bring them in sync

### Checking What's In schema.sql vs Database

```bash
# Extract table names from schema.sql
grep -E "^CREATE TABLE" db/schema.sql | head -20

# Compare with actual database
psql postgres://localhost:5432/biciantro -c "\dt"
```

## Migration Workflow Example

```bash
# 1. Create new migration file (starts from 002+)
touch db/migrations/002_add_feature.sql

# 2. Write migration SQL with idempotent checks
# (see patterns above)

# 3. Test locally
psql postgres://localhost:5432/biciantro -f db/migrations/002_add_feature.sql

# 4. If schema changes, regenerate PGTyped
npx pgtyped -c pgtyped.config.json

# 5. Update queries and actions as needed

# 6. Test the application
npm run dev

# 7. Commit migration and code changes together
git add db/migrations/002_add_feature.sql
git add src/db/queries/*.sql src/db/queries/*.ts
git add src/actions/*.ts
git commit -m "Add new feature with database migration"
```

## Related Documentation

- [Database Schema](./schema.sql) - Complete schema definition
- [PGTyped Configuration](../pgtyped.config.json)
- [Setup Instructions](../README.md)

---

## Quick Reference

| Task | Command |
|------|---------|
| Fresh database setup | `psql <db> -f db/schema.sql` |
| Run pending migrations | `npm run migrate` |
| Check migration status | `npm run migrate:status` |
| Regenerate PGTyped | `npx pgtyped -c pgtyped.config.json` |
| Create new migration | Create `XXX_description.sql` in `db/migrations/` |

**Note**: Migration version 001 is reserved for the consolidated schema (schema.sql). All incremental migrations start from 002.
