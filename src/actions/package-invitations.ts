'use server'

import { revalidatePath } from 'next/cache'
import { logAdminAction } from '~/lib/audit'
import { pool } from '~/lib/db'
import { getSession } from './auth'

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
 * Generate a unique invitation code for a package
 */
export async function generatePackageInvitation(packageId: string): Promise<{
  code: string
  invitationUrl: string
}> {
  const session = await getAdminSession()

  // Check if package exists and belongs to this branch
  const packageCheck = await pool.query(
    `SELECT id, name FROM class_package_templates 
     WHERE id = $1 AND branch_id = $2`,
    [packageId, session.user.branchId]
  )

  if (packageCheck.rows.length === 0) {
    throw new Error('Paquete no encontrado')
  }

  const pkg = packageCheck.rows[0]

  // Generate unique code
  const code = `PKG-${Math.random().toString(36).substring(2, 8).toUpperCase()}-${Date.now().toString(36).substring(4, 8).toUpperCase()}`

  // Store the invitation
  await pool.query(
    `INSERT INTO package_invitations (
      package_id,
      branch_id,
      code,
      created_by,
      is_active
    ) VALUES ($1, $2, $3, $4, true)
    ON CONFLICT (code) DO NOTHING`,
    [packageId, session.user.branchId, code, session.user.id]
  )

  await logAdminAction(
    session.user.id,
    'create',
    'package_invitation',
    packageId,
    `Generó enlace de invitación para ${pkg.name}`,
    { code }
  )

  // Generate the full URL
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  const invitationUrl = `${baseUrl}/registro?invitation=${code}`

  revalidatePath('/admin/packages')

  return {
    code,
    invitationUrl,
  }
}

/**
 * Get invitation link for a package
 */
export async function getPackageInvitation(packageId: string): Promise<{
  code: string | null
  invitationUrl: string | null
  createdAt: Date | null
} | null> {
  const session = await getAdminSession()

  const result = await pool.query(
    `SELECT code, created_at 
     FROM package_invitations 
     WHERE package_id = $1 
       AND branch_id = $2 
       AND is_active = true
     ORDER BY created_at DESC
     LIMIT 1`,
    [packageId, session.user.branchId]
  )

  if (result.rows.length === 0) {
    return null
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

  return {
    code: result.rows[0].code,
    invitationUrl: `${baseUrl}/registro?invitation=${result.rows[0].code}`,
    createdAt: result.rows[0].created_at,
  }
}

/**
 * Revoke an invitation code
 */
export async function revokePackageInvitation(code: string): Promise<void> {
  const session = await getAdminSession()

  await pool.query(
    `UPDATE package_invitations 
     SET is_active = false, 
         updated_at = CURRENT_TIMESTAMP
     WHERE code = $1 
       AND branch_id = $2`,
    [code, session.user.branchId]
  )

  await logAdminAction(
    session.user.id,
    'update',
    'package_invitation',
    code,
    'Revocó enlace de invitación',
    { code }
  )

  revalidatePath('/admin/packages')
}

/**
 * Validate an invitation code and get package details
 */
export async function validateInvitationCode(code: string): Promise<{
  valid: boolean
  package?: {
    id: string
    name: string
    description: string | null
    classCount: number
    price: number
    validityType: string
    validityPeriod: number | null
  }
  branchId?: string
  error?: string
}> {
  const result = await pool.query(
    `SELECT 
      pi.package_id,
      pi.branch_id,
      cpt.name,
      cpt.description,
      cpt.class_count,
      cpt.price,
      cpt.validity_type,
      cpt.validity_period
    FROM package_invitations pi
    JOIN class_package_templates cpt ON pi.package_id = cpt.id
    WHERE pi.code = $1 
      AND pi.is_active = true
      AND cpt.is_active = true`,
    [code]
  )

  if (result.rows.length === 0) {
    return {
      valid: false,
      error: 'Código de invitación inválido o expirado',
    }
  }

  const invitation = result.rows[0]

  return {
    valid: true,
    package: {
      id: invitation.package_id,
      name: invitation.name,
      description: invitation.description,
      classCount: invitation.class_count,
      price: parseFloat(invitation.price),
      validityType: invitation.validity_type,
      validityPeriod: invitation.validity_period,
    },
    branchId: invitation.branch_id,
  }
}

/**
 * Assign package to user after registration via invitation
 */
export async function assignPackageViaInvitation(
  userId: string,
  invitationCode: string
): Promise<{ success: boolean; error?: string }> {
  const client = await pool.connect()

  try {
    await client.query('BEGIN')

    // Get invitation details
    const invitationResult = await client.query(
      `SELECT 
        pi.package_id,
        pi.branch_id,
        cpt.class_count,
        cpt.validity_type,
        cpt.validity_period,
        cpt.price
      FROM package_invitations pi
      JOIN class_package_templates cpt ON pi.package_id = cpt.id
      WHERE pi.code = $1 
        AND pi.is_active = true
        AND cpt.is_active = true`,
      [invitationCode]
    )

    if (invitationResult.rows.length === 0) {
      return {
        success: false,
        error: 'Código de invitación inválido o expirado',
      }
    }

    const invitation = invitationResult.rows[0]

    // Calculate expiration date
    let expiresAt: Date | null = null
    if (
      invitation.validity_type !== 'unlimited' &&
      invitation.validity_period
    ) {
      expiresAt = new Date()
      if (invitation.validity_type === 'days') {
        expiresAt.setDate(expiresAt.getDate() + invitation.validity_period)
      } else if (invitation.validity_type === 'months') {
        expiresAt.setMonth(expiresAt.getMonth() + invitation.validity_period)
      }
    }

    // Create user package
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
        purchase_price
      ) VALUES ($1, $2, $3, $4, $5, $6, 'active', false, $7)`,
      [
        userId,
        invitation.branch_id,
        invitation.package_id,
        invitation.class_count,
        invitation.class_count,
        expiresAt?.toISOString() ?? null,
        parseFloat(invitation.price),
      ]
    )

    await client.query('COMMIT')

    return { success: true }
  } catch (error) {
    await client.query('ROLLBACK')
    console.error('Error assigning package via invitation:', error)
    return {
      success: false,
      error: 'Error al asignar el paquete',
    }
  } finally {
    client.release()
  }
}
