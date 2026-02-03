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

/**
 * Check if base tables exist (users, branches)
 */
async function checkBaseTablesExist(): Promise<boolean> {
  try {
    const result = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'users'
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
 * Get all pending migrations
 */
export async function getPendingMigrations(): Promise<Migration[]> {
  const migrationsDir = path.join(process.cwd(), 'db', 'migrations')

  // Check if schema_migrations table exists
  const tableCheck = await pool.query(`
    SELECT EXISTS (
      SELECT FROM information_schema.tables 
      WHERE table_name = 'schema_migrations'
    )
  `)

  if (!tableCheck.rows[0].exists) {
    // Return only migration 000 if schema_migrations table doesn't exist
    const allMigrations = loadMigrationFiles(migrationsDir)
    return allMigrations.filter((m) => m.version === '000')
  }

  // Check if base tables exist
  const baseTablesExist = await checkBaseTablesExist()

  // Get already applied migrations
  const appliedResult = await pool.query(
    'SELECT version FROM schema_migrations WHERE success = true'
  )
  const appliedVersions = new Set(appliedResult.rows.map((r) => r.version))

  // Load all migration files and filter out applied ones
  const allMigrations = loadMigrationFiles(migrationsDir)
  return allMigrations.filter((m) => {
    if (appliedVersions.has(m.version)) return false
    // If base tables don't exist, only allow migration 000
    if (!baseTablesExist && m.version !== '000') return false
    return true
  })
}

/**
 * Load migration files from directory
 */
function loadMigrationFiles(migrationsDir: string): Migration[] {
  const files = fs
    .readdirSync(migrationsDir)
    .filter((f) => f.endsWith('.sql') && !f.startsWith('TEMPLATE'))
    .sort()

  return files
    .map((file) => {
      const match = file.match(/^(\d+)_(.+?)\.sql$/)
      if (!match) return null

      const [, version, name] = match
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
      // After migration 000 runs, base tables should exist, so re-check
      if (migration.version === '000') {
        // Return early to let the next page load pick up remaining migrations
        return {
          success: true,
          migrationsRun,
          errors: [],
        }
      }
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
