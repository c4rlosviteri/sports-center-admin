'use server'

import { logAdminAction } from '~/lib/audit'
import { pool } from '~/lib/db'
import { getSession } from './auth'

interface MigrationResult {
  plansMigrated: number
  usersMigrated: number
  errors: string[]
  branchResults: {
    branchId: string
    branchName: string
    plansMigrated: number
    usersMigrated: number
  }[]
}

interface MigrationCheckResult {
  needsMigration: boolean
  plansCount: number
  usersCount: number
  branchBreakdown: {
    branchId: string
    branchName: string
    plansCount: number
    usersCount: number
  }[]
}

/**
 * Helper to get validated admin session with branchId
 */
async function getAdminSession() {
  const session = await getSession()
  if (!session || !['admin', 'superuser'].includes(session.user.role)) {
    throw new Error('No autorizado')
  }
  if (!session.user.branchId) {
    throw new Error('No se encontró la sucursal del usuario')
  }
  return {
    ...session,
    user: {
      ...session.user,
      branchId: session.user.branchId as string,
    },
  }
}

/**
 * Migrate all membership plans to package templates and user memberships to packages
 * For superusers: migrates ALL branches
 * For admins: migrates only their branch
 */
export async function migratePlansToPackages(): Promise<MigrationResult> {
  const session = await getAdminSession()
  const result: MigrationResult = {
    plansMigrated: 0,
    usersMigrated: 0,
    errors: [],
    branchResults: [],
  }

  const client = await pool.connect()

  try {
    await client.query('BEGIN')

    // Determine which branches to process
    let branchesToProcess: { id: string; name: string }[] = []

    if (session.user.role === 'superuser') {
      // Get all active branches for superusers
      const branchesResult = await client.query(
        `SELECT id, name FROM branches WHERE is_active = true ORDER BY name`
      )
      branchesToProcess = branchesResult.rows
    } else {
      // Get current branch for regular admins
      const branchResult = await client.query(
        `SELECT id, name FROM branches WHERE id = $1`,
        [session.user.branchId]
      )
      if (branchResult.rows.length > 0) {
        branchesToProcess = [branchResult.rows[0]]
      }
    }

    // Process each branch
    for (const branch of branchesToProcess) {
      const branchResult = {
        branchId: branch.id,
        branchName: branch.name,
        plansMigrated: 0,
        usersMigrated: 0,
      }

      try {
        // Get all active membership plans for this branch
        const plansResult = await client.query(
          `SELECT 
            id,
            name,
            description,
            frequency,
            default_duration_days,
            price
          FROM membership_plans
          WHERE branch_id = $1 AND is_active = true`,
          [branch.id]
        )

        const plans = plansResult.rows

        // Track already migrated plans to avoid duplicates
        const migratedPlans = new Map<string, string>() // planId -> packageTemplateId

        // Create package template for each plan
        for (const plan of plans) {
          try {
            // Check if we already created a package for this plan in this run
            if (migratedPlans.has(plan.id)) {
              // Skip creating duplicate template, use existing one
              continue
            }

            // Determine class count based on frequency
            let classCount = 8 // Default for monthly
            if (plan.frequency === 'weekly') {
              classCount = 2
            } else if (plan.frequency === 'biweekly') {
              classCount = 4
            } else if (plan.frequency === 'yearly') {
              classCount = 96 // ~8 classes per month * 12
            } else if (plan.frequency === 'unlimited') {
              classCount = 9999 // Unlimited marker
            }

            // Determine validity period
            let validityType: 'unlimited' | 'days' | 'months' = 'months'
            let validityPeriod = 1

            if (plan.frequency === 'weekly') {
              validityType = 'days'
              validityPeriod = 7
            } else if (plan.frequency === 'biweekly') {
              validityType = 'days'
              validityPeriod = 14
            } else if (plan.frequency === 'monthly') {
              validityType = 'months'
              validityPeriod = 1
            } else if (plan.frequency === 'yearly') {
              validityType = 'months'
              validityPeriod = 12
            } else if (
              plan.frequency === 'unlimited' ||
              plan.default_duration_days === null
            ) {
              validityType = 'unlimited'
              validityPeriod = 0
            } else if (plan.default_duration_days > 0) {
              if (plan.default_duration_days <= 31) {
                validityType = 'days'
                validityPeriod = plan.default_duration_days
              } else {
                validityType = 'months'
                validityPeriod = Math.ceil(plan.default_duration_days / 30)
              }
            }

            // Check if package template already exists for this plan (from previous migration)
            const existingPackage = await client.query(
              `SELECT id FROM class_package_templates 
               WHERE branch_id = $1 AND name = $2 AND class_count = $3 
               AND validity_type = $4 
               AND (validity_period = $5 OR (validity_period IS NULL AND $5 IS NULL))`,
              [
                branch.id,
                plan.name,
                classCount,
                validityType,
                validityType === 'unlimited' ? null : validityPeriod,
              ]
            )

            let packageTemplateId: string

            if (existingPackage.rows.length > 0) {
              // Use existing package template
              packageTemplateId = existingPackage.rows[0].id
            } else {
              // Create new package template
              const packageTemplateResult = await client.query(
                `INSERT INTO class_package_templates (
                  branch_id,
                  name,
                  description,
                  class_count,
                  price,
                  validity_type,
                  validity_period,
                  is_gift_eligible,
                  is_shareable,
                  allows_waitlist,
                  priority_booking,
                  is_active,
                  display_order
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, false, false, true, false, true, 0)
                RETURNING id`,
                [
                  branch.id,
                  plan.name,
                  plan.description,
                  classCount,
                  plan.price || 0,
                  validityType,
                  validityType === 'unlimited' ? null : validityPeriod,
                ]
              )
              packageTemplateId = packageTemplateResult.rows[0].id
              branchResult.plansMigrated++
              result.plansMigrated++
            }

            // Track this plan as migrated
            migratedPlans.set(plan.id, packageTemplateId)

            // Get all active user memberships for this plan that haven't been migrated yet
            const membershipsResult = await client.query(
              `SELECT 
                um.id,
                um.user_id,
                um.end_date,
                um.classes_remaining,
                um.created_at
              FROM user_memberships um
              WHERE um.plan_id = $1 
                AND um.is_active = true
                AND um.end_date >= CURRENT_DATE
                AND NOT EXISTS (
                  SELECT 1 FROM user_class_packages ucp 
                  WHERE ucp.user_id = um.user_id 
                  AND ucp.package_template_id = $2
                )`,
              [plan.id, packageTemplateId]
            )

            // Convert each membership to a package
            for (const membership of membershipsResult.rows) {
              const savepointName = `membership_${membership.id.replace(/-/g, '_')}`

              try {
                // Create a savepoint for this membership so we can rollback just this one if it fails
                await client.query(`SAVEPOINT ${savepointName}`)

                // Check if user exists before migrating
                const userCheck = await client.query(
                  'SELECT id FROM "user" WHERE id = $1',
                  [membership.user_id]
                )

                if (userCheck.rows.length === 0) {
                  await client.query(`ROLLBACK TO SAVEPOINT ${savepointName}`)
                  continue
                }

                await client.query(
                  `INSERT INTO user_class_packages (
                    user_id,
                    branch_id,
                    package_template_id,
                    total_classes,
                    classes_remaining,
                    expires_at,
                    status,
                    is_gift,
                    purchased_at,
                    purchase_price
                  ) VALUES ($1, $2, $3, $4, $5, $6, 'active', false, $7, $8)`,
                  [
                    membership.user_id,
                    branch.id,
                    packageTemplateId,
                    classCount,
                    membership.classes_remaining ?? classCount,
                    membership.end_date,
                    membership.created_at,
                    plan.price || 0,
                  ]
                )

                // Mark old membership as inactive
                await client.query(
                  `UPDATE user_memberships 
                   SET is_active = false, 
                       updated_at = CURRENT_TIMESTAMP
                   WHERE id = $1`,
                  [membership.id]
                )

                // Release the savepoint on success
                await client.query(`RELEASE SAVEPOINT ${savepointName}`)

                branchResult.usersMigrated++
                result.usersMigrated++
              } catch (err) {
                // Rollback to savepoint on error
                try {
                  await client.query(`ROLLBACK TO SAVEPOINT ${savepointName}`)
                } catch {
                  // Savepoint might not exist if error occurred before it was created
                }

                const errorMsg = `Error migrating membership ${membership.id} in branch ${branch.name}: ${err instanceof Error ? err.message : 'Unknown error'}`
                result.errors.push(errorMsg)
              }
            }
          } catch (err) {
            const errorMsg = `Error migrating plan ${plan.id} in branch ${branch.name}: ${err instanceof Error ? err.message : 'Unknown error'}`
            result.errors.push(errorMsg)
          }
        }

        result.branchResults.push(branchResult)
      } catch (err) {
        const errorMsg = `Error processing branch ${branch.name}: ${err instanceof Error ? err.message : 'Unknown error'}`
        result.errors.push(errorMsg)
      }
    }

    // Log the migration
    await logAdminAction(
      session.user.id,
      'migrate',
      'membership_to_package',
      session.user.branchId,
      `Migró ${result.plansMigrated} planes y ${result.usersMigrated} membresías a paquetes en ${result.branchResults.length} sucursal(es)`,
      {
        plansMigrated: result.plansMigrated,
        usersMigrated: result.usersMigrated,
        branches: result.branchResults.map((b) => ({
          name: b.branchName,
          plans: b.plansMigrated,
          users: b.usersMigrated,
        })),
        errors: result.errors.length,
      }
    )

    await client.query('COMMIT')

    return result
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}

/**
 * Check if migration is needed (are there active memberships?)
 * For superusers: checks ALL branches
 * For admins: checks only their branch
 */
export async function checkMigrationNeeded(): Promise<MigrationCheckResult> {
  const session = await getAdminSession()

  const result: MigrationCheckResult = {
    needsMigration: false,
    plansCount: 0,
    usersCount: 0,
    branchBreakdown: [],
  }

  if (session.user.role === 'superuser') {
    // Check ALL branches for superusers
    const plansResult = await pool.query(
      `SELECT 
        b.id as branch_id, 
        b.name as branch_name, 
        COUNT(mp.id) as plans_count
       FROM branches b
       LEFT JOIN membership_plans mp ON b.id = mp.branch_id AND mp.is_active = true
       WHERE b.is_active = true
       GROUP BY b.id, b.name
       ORDER BY b.name`
    )

    const usersResult = await pool.query(
      `SELECT 
        b.id as branch_id, 
        COUNT(um.id) as users_count
       FROM branches b
       LEFT JOIN membership_plans mp ON b.id = mp.branch_id
       LEFT JOIN user_memberships um ON mp.id = um.plan_id 
         AND um.is_active = true
         AND um.end_date >= CURRENT_DATE
       WHERE b.is_active = true
       GROUP BY b.id, b.name
       ORDER BY b.name`
    )

    // Combine results
    const branchMap = new Map()

    for (const row of plansResult.rows) {
      branchMap.set(row.branch_id, {
        branchId: row.branch_id,
        branchName: row.branch_name,
        plansCount: parseInt(row.plans_count, 10),
        usersCount: 0,
      })
    }

    for (const row of usersResult.rows) {
      if (branchMap.has(row.branch_id)) {
        branchMap.get(row.branch_id).usersCount = parseInt(row.users_count, 10)
      }
    }

    result.branchBreakdown = Array.from(branchMap.values())
    result.plansCount = result.branchBreakdown.reduce(
      (sum, b) => sum + b.plansCount,
      0
    )
    result.usersCount = result.branchBreakdown.reduce(
      (sum, b) => sum + b.usersCount,
      0
    )
    result.needsMigration = result.plansCount > 0 || result.usersCount > 0
  } else {
    // Check only current branch for regular admins
    const plansResult = await pool.query(
      `SELECT COUNT(*) as count 
       FROM membership_plans 
       WHERE branch_id = $1 AND is_active = true`,
      [session.user.branchId]
    )

    const usersResult = await pool.query(
      `SELECT COUNT(*) as count 
       FROM user_memberships um
       JOIN membership_plans mp ON um.plan_id = mp.id
       WHERE mp.branch_id = $1 
         AND um.is_active = true
         AND um.end_date >= CURRENT_DATE`,
      [session.user.branchId]
    )

    const plansCount = parseInt(plansResult.rows[0].count, 10)
    const usersCount = parseInt(usersResult.rows[0].count, 10)

    result.plansCount = plansCount
    result.usersCount = usersCount
    result.needsMigration = plansCount > 0 || usersCount > 0

    if (result.needsMigration) {
      const branchResult = await pool.query(
        `SELECT id, name FROM branches WHERE id = $1`,
        [session.user.branchId]
      )
      result.branchBreakdown = [
        {
          branchId: session.user.branchId,
          branchName: branchResult.rows[0]?.name || 'Unknown',
          plansCount,
          usersCount,
        },
      ]
    }
  }

  return result
}
