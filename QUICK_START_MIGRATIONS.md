# Quick Start: Database Migrations

## Initial Setup (One Time)

1. **Initialize the schema (fresh DB):**
   ```bash
   psql postgres://localhost:5432/biciantro -f db/schema.sql
   ```

   This creates the full schema and records version `001` in `schema_migrations`.

2. **Initialize migration tracking (existing DB without schema_migrations):**
   ```bash
   psql postgres://localhost:5432/biciantro -f db/migrations/000_create_migrations_table.sql
   ```

   This only creates the tracking table and marks version `001` so future migrations can run.

3. **Run incremental migrations (002+):**
   ```bash
   ./db/run-migrations.sh
   ```

   This will:
   - Create the `schema_migrations` tracking table
   - Apply any pending migrations
   - Mark existing migrations as applied

## Creating a New Migration

### Step 1: Create the Migration File

```bash
# Find the next version number
ls db/migrations/*.sql | tail -1
# If last migration is 002, your new one will be 003

# Create the file
cp db/migrations/TEMPLATE.sql db/migrations/003_your_migration_name.sql
```

### Step 2: Edit the Migration

```sql
-- Migration: Add User Preferences
-- Date: 2026-01-24
-- Description: Adds a preferences JSONB column to "user" table

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
VALUES ('003', 'add_user_preferences', MD5('add_user_preferences_2026_01_24'), true)
ON CONFLICT (version) DO NOTHING;
```

### Step 3: Test Locally

```bash
# Run the migration
./db/run-migrations.sh

# If it affects queries, regenerate PGTyped types
npx pgtyped -c pgtyped.config.json

# Check for TypeScript errors
npx tsc --noEmit
```

### Step 4: Update Code (if needed)

If your migration changes the schema:

1. **Update SQL queries** in `src/db/queries/*.sql`
2. **Regenerate types**: `npx pgtyped -c pgtyped.config.json`
3. **Update actions** in `src/actions/*.ts`
4. **Update types** in `src/types/database.ts`
5. **Update UI components** that use the changed data

### Step 5: Commit

```bash
git add db/migrations/003_*.sql
git add src/db/queries/*.sql src/db/queries/*.ts  # if changed
git add src/actions/*.ts                          # if changed
git commit -m "Add user preferences table"
```

## Common Operations

### Check Migration Status

```bash
# See which migrations have been applied
psql postgres://localhost:5432/biciantro -c "
  SELECT version, name, applied_at, success
  FROM schema_migrations
  ORDER BY version;
"
```

### Run Pending Migrations

```bash
./db/run-migrations.sh
```

### Regenerate PGTyped Types

```bash
# After any schema change that affects queries
npx pgtyped -c pgtyped.config.json
```

### Verify Everything Works

```bash
# Check TypeScript
npx tsc --noEmit

# Run tests
npm test

# Start dev server
npm run dev
```

## Troubleshooting

### "Migration already applied"
This is normal - migrations are idempotent and won't run twice.

### "Column already exists" error
Your migration should use `IF NOT EXISTS` checks (see template).

### TypeScript errors after migration
```bash
# Regenerate types
npx pgtyped -c pgtyped.config.json

# Check what changed
git diff src/db/queries/*.ts
```

### Need to rollback
Create a new migration that reverses the changes:
```sql
-- 004_rollback_user_preferences.sql
ALTER TABLE "user" DROP COLUMN IF EXISTS preferences;
```

## Full Example: Adding a Feature

Let's add a "favorite classes" feature:

```bash
# 1. Create migration
cat > db/migrations/003_add_favorite_classes.sql << 'EOF'
-- Migration: Add Favorite Classes
-- Date: 2026-01-24
-- Description: Allows user accounts to mark classes as favorites

CREATE TABLE IF NOT EXISTS favorite_classes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, class_id)
);

CREATE INDEX IF NOT EXISTS idx_favorite_classes_user_id
  ON favorite_classes(user_id);

CREATE INDEX IF NOT EXISTS idx_favorite_classes_class_id
  ON favorite_classes(class_id);

INSERT INTO schema_migrations (version, name, checksum, success)
VALUES ('003', 'add_favorite_classes', MD5('add_favorite_classes_2026_01_24'), true)
ON CONFLICT (version) DO NOTHING;
EOF

# 2. Run migration
./db/run-migrations.sh

# 3. Add queries to src/db/queries/classes.sql
cat >> src/db/queries/classes.sql << 'EOF'

/* @name AddFavoriteClass */
INSERT INTO favorite_classes (user_id, class_id)
VALUES (:userId!, :classId!)
ON CONFLICT (user_id, class_id) DO NOTHING
RETURNING id;

/* @name RemoveFavoriteClass */
DELETE FROM favorite_classes
WHERE user_id = :userId! AND class_id = :classId!;

/* @name GetUserFavoriteClasses */
SELECT c.*
FROM classes c
INNER JOIN favorite_classes fc ON c.id = fc.class_id
WHERE fc.user_id = :userId!
ORDER BY fc.created_at DESC;
EOF

# 4. Regenerate types
npx pgtyped -c pgtyped.config.json

# 5. Update src/actions/classes.ts
# Add functions that use the new queries:
# - addFavoriteClass() using classes.addFavoriteClass.run()
# - removeFavoriteClass() using classes.removeFavoriteClass.run()
# - getFavoriteClasses() using classes.getUserFavoriteClasses.run()

# 6. Test
npm run dev

# 7. Commit everything
git add db/migrations/003_add_favorite_classes.sql
git add src/db/queries/classes.sql
git add src/db/queries/classes.queries.ts
git add src/actions/classes.ts
git commit -m "Add favorite classes feature"
```

## Reference

- **Full Documentation:** [db/MIGRATIONS.md](db/MIGRATIONS.md)
- **Change Tracking:** [MIGRATION_TRACKING.md](MIGRATION_TRACKING.md)
- **Migration Template:** [db/migrations/TEMPLATE.sql](db/migrations/TEMPLATE.sql)
