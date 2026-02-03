'use server'

import * as path from 'node:path'
import * as fs from 'fs'
import { pool } from '~/lib/db'

interface Migration {
  version: string
  name: string
  checksum: string
  sql: string
}

async function ensureSchemaMigrationsTable(): Promise<void> {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      id SERIAL PRIMARY KEY,
      version VARCHAR(255) NOT NULL UNIQUE,
      name VARCHAR(255) NOT NULL,
      applied_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      checksum VARCHAR(64),
      execution_time_ms INTEGER,
      success BOOLEAN DEFAULT true
    )
  `)

  await pool.query(
    'CREATE INDEX IF NOT EXISTS idx_schema_migrations_version ON schema_migrations(version)'
  )
  await pool.query(
    'CREATE INDEX IF NOT EXISTS idx_schema_migrations_applied_at ON schema_migrations(applied_at DESC)'
  )

  await pool.query(
    `INSERT INTO schema_migrations (version, name, checksum, success)
     VALUES ('001', 'initial_schema_consolidated', MD5('schema_consolidated_2026_02_03'), true)
     ON CONFLICT (version) DO NOTHING`
  )
}

async function checkSchemaMigrationsExists(): Promise<boolean> {
  try {
    const result = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'schema_migrations'
      )
    `)
    return result.rows[0].exists
  } catch {
    return false
  }
}

/**
 * Check if base tables exist ("user", branches)
 * If these exist, it means schema.sql has been applied
 */
async function checkBaseTablesExist(): Promise<boolean> {
  try {
    const result = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'user'
      ) AND EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'branches'
      )
    `)
    return result.rows[0].exists
  } catch {
    return false
  }
}

/**
 * Check if schema has been initialized
 * Returns true if schema_migrations table exists and contains version 001
 */
async function checkSchemaInitialized(): Promise<boolean> {
  try {
    // First check if schema_migrations table exists
    const tableCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'schema_migrations'
      )
    `)

    if (!tableCheck.rows[0].exists) {
      return false
    }

    // Check if version 001 (consolidated schema) is recorded
    const versionCheck = await pool.query(`
      SELECT EXISTS (
        SELECT 1 FROM schema_migrations 
        WHERE version = '001' AND success = true
      )
    `)

    return versionCheck.rows[0].exists
  } catch {
    return false
  }
}

/**
 * Get all pending migrations
 * Only returns migrations with version >= 002 (001 is the consolidated schema)
 */
export async function getPendingMigrations(): Promise<Migration[]> {
  const migrationsDir = path.join(process.cwd(), 'db', 'migrations')

  // Check if schema has been initialized
  const baseTablesExist = await checkBaseTablesExist()
  const schemaMigrationsExists = await checkSchemaMigrationsExists()

  if (baseTablesExist && !schemaMigrationsExists) {
    await ensureSchemaMigrationsTable()
  }

  const schemaInitialized = await checkSchemaInitialized()

  // If schema hasn't been initialized and base tables don't exist,
  // schema.sql needs to be run manually first
  if (!schemaInitialized && !baseTablesExist) {
    console.log(
      'Schema not initialized. Please run db/schema.sql first to set up the database.'
    )
    return []
  }

  // If base tables exist but schema_migrations doesn't,
  // we might be on an older version - still allow new migrations
  if (baseTablesExist && !schemaInitialized) {
    // Load all migrations and return them (they'll try to run idempotently)
    const allMigrations = loadMigrationFiles(migrationsDir)
    return allMigrations
  }

  // Get already applied migrations (versions >= 002)
  const appliedResult = await pool.query(
    "SELECT version FROM schema_migrations WHERE success = true AND version >= '002'"
  )
  const appliedVersions = new Set(appliedResult.rows.map((r) => r.version))

  // Load migration files and filter out applied ones
  const allMigrations = loadMigrationFiles(migrationsDir)
  return allMigrations.filter((m) => {
    // Skip if already applied
    if (appliedVersions.has(m.version)) return false
    // Only allow versions >= 002 (001 is consolidated in schema.sql)
    if (parseInt(m.version) < 2) return false
    return true
  })
}

/**
 * Load migration files from directory
 * Only loads files matching pattern: XXX_name.sql where XXX >= 002
 */
function loadMigrationFiles(migrationsDir: string): Migration[] {
  if (!fs.existsSync(migrationsDir)) {
    return []
  }

  const files = fs
    .readdirSync(migrationsDir)
    .filter((f) => f.endsWith('.sql') && !f.startsWith('TEMPLATE'))
    .sort()

  return files
    .map((file) => {
      const match = file.match(/^(\d+)_(.+?)\.sql$/)
      if (!match) return null

      const [, version, name] = match
      const versionNum = parseInt(version)

      // Skip versions < 002 (001 is the consolidated schema)
      if (versionNum < 2) return null

      const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf-8')

      return {
        version,
        name: name.replace(/_/g, ' '),
        checksum: Buffer.from(sql).toString('base64').slice(0, 32),
        sql,
      }
    })
    .filter((m): m is Migration => m !== null)
}

/**
 * Run a single migration
 */
export async function runMigration(
  migration: Migration
): Promise<{ success: boolean; error?: string }> {
  const client = await pool.connect()

  try {
    await client.query('BEGIN')

    // Execute migration SQL
    await client.query(migration.sql)

    // Record migration
    await client.query(
      `INSERT INTO schema_migrations (version, name, checksum, success, applied_at)
       VALUES ($1, $2, $3, true, CURRENT_TIMESTAMP)
       ON CONFLICT (version) DO UPDATE SET
         success = true,
         applied_at = CURRENT_TIMESTAMP`,
      [migration.version, migration.name, migration.checksum]
    )

    await client.query('COMMIT')

    return { success: true }
  } catch (error) {
    await client.query('ROLLBACK')

    const errorMsg = error instanceof Error ? error.message : 'Unknown error'

    // Try to record failed migration
    try {
      await pool.query(
        `INSERT INTO schema_migrations (version, name, checksum, success)
         VALUES ($1, $2, $3, false)
         ON CONFLICT (version) DO UPDATE SET
           success = false`,
        [migration.version, migration.name, migration.checksum]
      )
    } catch {
      // If that fails too, just log to console
      console.error(`Failed to record migration ${migration.version} failure`)
    }

    return { success: false, error: errorMsg }
  } finally {
    client.release()
  }
}

/**
 * Run all pending migrations automatically
 */
export async function runAllPendingMigrations(): Promise<{
  success: boolean
  migrationsRun: number
  errors: string[]
}> {
  const pending = await getPendingMigrations()

  if (pending.length === 0) {
    return { success: true, migrationsRun: 0, errors: [] }
  }

  const errors: string[] = []
  let migrationsRun = 0

  for (const migration of pending) {
    const result = await runMigration(migration)

    if (result.success) {
      migrationsRun++
    } else {
      errors.push(
        `Migration ${migration.version} (${migration.name}): ${result.error}`
      )
      // Don't continue if a migration fails - it might have dependencies
      break
    }
  }

  return {
    success: errors.length === 0,
    migrationsRun,
    errors,
  }
}

/**
 * Get migration status summary
 */
export async function getMigrationStatus(): Promise<{
  schemaInitialized: boolean
  totalMigrations: number
  appliedMigrations: number
  pendingMigrations: number
}> {
  const schemaInitialized = await checkSchemaInitialized()
  const pending = await getPendingMigrations()

  let appliedCount = 0
  if (schemaInitialized) {
    const result = await pool.query(
      "SELECT COUNT(*) FROM schema_migrations WHERE success = true AND version >= '002'"
    )
    appliedCount = parseInt(result.rows[0].count)
  }

  return {
    schemaInitialized,
    totalMigrations: appliedCount + pending.length,
    appliedMigrations: appliedCount,
    pendingMigrations: pending.length,
  }
}
