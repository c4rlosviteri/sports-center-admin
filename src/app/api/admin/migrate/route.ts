import { NextResponse } from 'next/server'
import {
  checkMigrationNeeded,
  migratePlansToPackages,
} from '~/actions/migrate-plans'
import { runAllPendingMigrations } from '~/lib/migrations'

/**
 * POST /api/admin/migrate
 * Run all pending database migrations and plan-to-package migration
 * This should be called during deployment or initialization
 */
export async function POST() {
  try {
    // Run database migrations
    const dbResult = await runAllPendingMigrations()

    // Check and run plan migration if needed
    let planResult = null
    const migrationCheck = await checkMigrationNeeded()

    if (migrationCheck.needsMigration) {
      planResult = await migratePlansToPackages()
    }

    return NextResponse.json({
      success:
        dbResult.success &&
        (planResult ? planResult.errors.length === 0 : true),
      database: {
        migrationsRun: dbResult.migrationsRun,
        errors: dbResult.errors,
      },
      plans: planResult
        ? {
            migrated: planResult.plansMigrated,
            usersMigrated: planResult.usersMigrated,
            errors: planResult.errors,
          }
        : null,
      planMigrationNeeded: migrationCheck.needsMigration,
    })
  } catch (error) {
    console.error('Migration API error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

/**
 * GET /api/admin/migrate
 * Check migration status without running migrations
 */
export async function GET() {
  try {
    const migrationCheck = await checkMigrationNeeded()

    return NextResponse.json({
      planMigrationNeeded: migrationCheck.needsMigration,
      plansCount: migrationCheck.plansCount,
      usersCount: migrationCheck.usersCount,
    })
  } catch (error) {
    console.error('Migration status check error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
