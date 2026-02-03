import { pool } from './db'

/**
 * Log admin actions for audit trail
 */
export async function logAdminAction(
  adminId: string,
  actionType: string,
  entityType: string,
  entityId: string | null,
  description: string,
  metadata?: Record<string, any>
) {
  try {
    await pool.query(
      `INSERT INTO admin_action_logs (admin_id, action_type, entity_type, entity_id, description, metadata)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        adminId,
        actionType,
        entityType,
        entityId,
        description,
        JSON.stringify(metadata || {}),
      ]
    )
  } catch (error) {
    console.error('Failed to log admin action:', error)
  }
}
