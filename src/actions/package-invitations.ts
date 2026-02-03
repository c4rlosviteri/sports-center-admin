'use server'

import { revalidatePath } from 'next/cache'
import { logAdminAction } from '~/lib/audit'
import * as packageInvitationsQueries from '~/db/queries/package-invitations.queries'
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
  const packageCheck =
    await packageInvitationsQueries.getPackageTemplateForInvitation.run(
      { packageId, branchId: session.user.branchId },
      pool
    )

  if (packageCheck.length === 0) {
    throw new Error('Paquete no encontrado')
  }

  const pkg = packageCheck[0]

  // Generate unique code
  const code = `PKG-${Math.random().toString(36).substring(2, 8).toUpperCase()}-${Date.now().toString(36).substring(4, 8).toUpperCase()}`

  // Store the invitation
  await packageInvitationsQueries.createPackageInvitation.run(
    {
      packageId,
      branchId: session.user.branchId,
      code,
      createdBy: session.user.id,
    },
    pool
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

  const result = await packageInvitationsQueries.getLatestPackageInvitation.run(
    { packageId, branchId: session.user.branchId },
    pool
  )

  if (result.length === 0) {
    return null
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

  return {
    code: result[0].code,
    invitationUrl: `${baseUrl}/registro?invitation=${result[0].code}`,
    createdAt: result[0].created_at,
  }
}

/**
 * Revoke an invitation code
 */
export async function revokePackageInvitation(code: string): Promise<void> {
  const session = await getAdminSession()

  await packageInvitationsQueries.revokePackageInvitation.run(
    { code, branchId: session.user.branchId },
    pool
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
  const result = await packageInvitationsQueries.getInvitationWithPackageDetails.run(
    { code },
    pool
  )

  if (result.length === 0) {
    return {
      valid: false,
      error: 'Código de invitación inválido o expirado',
    }
  }

  const invitation = result[0]

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
    const invitationResult =
      await packageInvitationsQueries.getInvitationWithPackageDetails.run(
        { code: invitationCode },
        client
      )

    if (invitationResult.length === 0) {
      return {
        success: false,
        error: 'Código de invitación inválido o expirado',
      }
    }

    const invitation = invitationResult[0]

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
    await packageInvitationsQueries.createUserPackageFromInvitation.run(
      {
        userId,
        branchId: invitation.branch_id,
        packageTemplateId: invitation.package_id,
        totalClasses: invitation.class_count,
        classesRemaining: invitation.class_count,
        expiresAt: expiresAt?.toISOString() ?? null,
        purchasePrice: parseFloat(invitation.price),
      },
      client
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
