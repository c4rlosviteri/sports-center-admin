#!/usr/bin/env tsx
/**
 * Database Migration Script
 * Run this script to execute all pending migrations
 * Usage: npx tsx scripts/migrate.ts
 */

import { checkMigrationNeeded, migratePlansToPackages } from '../src/actions/migrate-plans'
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

    // Check and run plan migration if needed
    console.log('\nChecking plan migration status...')
    const migrationCheck = await checkMigrationNeeded()

    if (migrationCheck.needsMigration) {
      console.log(
        `Found ${migrationCheck.plansCount} plans and ${migrationCheck.usersCount} users to migrate`
      )
      console.log('Running plan-to-package migration...')

      const planResult = await migratePlansToPackages()

      console.log(
        `✓ Migrated ${planResult.plansMigrated} plans and ${planResult.usersMigrated} users`
      )

      if (planResult.errors.length > 0) {
        console.error('\nPlan migration errors:')
        planResult.errors.forEach((err) => console.error(`  - ${err}`))
      }
    } else {
      console.log('✓ No plan migration needed')
    }

    console.log('\n✓ Migration process completed')
    process.exit(0)
  } catch (error) {
    console.error('\n✗ Migration failed:', error)
    process.exit(1)
  }
}

main()
