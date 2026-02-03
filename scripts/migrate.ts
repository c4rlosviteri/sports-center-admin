#!/usr/bin/env tsx
/**
 * Database Migration Script
 * Run this script to execute all pending migrations
 * Usage: npx tsx scripts/migrate.ts
 */

import { runAllPendingMigrations } from '../src/lib/migrations'

async function main() {
  console.log('Starting database migrations...\n')

  try {
    // Run database migrations
    console.log('Running database schema migrations...')
    const dbResult = await runAllPendingMigrations()

    if (dbResult.migrationsRun > 0) {
      console.log(`✓ Applied ${dbResult.migrationsRun} migrations`)
    } else {
      console.log('✓ No pending database migrations')
    }

    if (dbResult.errors.length > 0) {
      console.error('\nDatabase migration errors:')
      dbResult.errors.forEach((err) => console.error(`  - ${err}`))
    }

    console.log('\n✓ Migration process completed')
    process.exit(0)
  } catch (error) {
    console.error('\n✗ Migration failed:', error)
    process.exit(1)
  }
}

main()
