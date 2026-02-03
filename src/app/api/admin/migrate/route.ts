import { NextResponse } from 'next/server'
import { runAllPendingMigrations } from '~/lib/migrations'

/**
 * POST /api/admin/migrate
 * Run all pending database migrations
 * This should be called during deployment or initialization
 */
export async function POST() {
  try {
    // Run database migrations
    const dbResult = await runAllPendingMigrations()

    return NextResponse.json({
      success: dbResult.success,
      database: {
        migrationsRun: dbResult.migrationsRun,
        errors: dbResult.errors,
      },
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
    return NextResponse.json({
      databaseOnly: true,
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
