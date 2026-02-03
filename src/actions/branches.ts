'use server'

import { revalidatePath } from 'next/cache'
import * as branches from '~/db/queries/branches.queries'
import { logAdminAction } from '~/lib/audit'
import { pool } from '~/lib/db'
import { getSession } from './auth'

/**
 * Get all branches (superuser only)
 */
export async function getAllBranches() {
  const session = await getSession()
  if (!session || session.user.role !== 'superuser') {
    throw new Error('No autorizado')
  }

  const result = await branches.getAllBranches.run(undefined, pool)

  return result.map((row) => ({
    id: row.id,
    name: row.name,
    address: row.address,
    phone: row.phone,
    email: row.email,
    isActive: row.is_active ?? true,
    isPrimary: false, // Superusers see all branches, none are "primary" for them
    cancellationHoursBefore: row.cancellation_hours_before ?? 2,
    bookingHoursBefore: row.booking_hours_before ?? 0,
    createdAt: row.created_at ?? new Date(),
    updatedAt: row.updated_at ?? undefined,
  }))
}

/**
 * Get branches accessible by current admin
 */
export async function getAdminBranches() {
  const session = await getSession()
  if (!session || !['admin', 'superuser'].includes(session.user.role)) {
    throw new Error('No autorizado')
  }

  // Superusers can see all branches
  if (session.user.role === 'superuser') {
    return getAllBranches()
  }

  // Admins see only their assigned branches
  const result = await branches.getAdminBranches.run(
    { adminId: session.user.id },
    pool
  )

  return result.map((row) => ({
    id: row.id,
    name: row.name,
    address: row.address,
    phone: row.phone,
    email: row.email,
    isActive: row.is_active ?? true,
    isPrimary: row.is_primary ?? false,
    cancellationHoursBefore: row.cancellation_hours_before ?? 2,
    bookingHoursBefore: row.booking_hours_before ?? 0,
    createdAt: row.created_at ?? new Date(),
    updatedAt: row.updated_at ?? undefined,
  }))
}

/**
 * Get single branch details
 */
export async function getBranch(branchId: string) {
  const session = await getSession()
  if (!session || !['admin', 'superuser'].includes(session.user.role)) {
    throw new Error('No autorizado')
  }

  // Check if admin has access to this branch
  if (session.user.role === 'admin') {
    const accessCheck = await branches.checkAdminBranchAccess.run(
      { adminId: session.user.id, branchId },
      pool
    )
    if (accessCheck.length === 0) {
      throw new Error('No tienes acceso a esta sucursal')
    }
  }

  const result = await branches.getBranch.run({ branchId }, pool)

  if (result.length === 0) {
    throw new Error('Sucursal no encontrada')
  }

  const row = result[0]
  return {
    id: row.id,
    name: row.name,
    address: row.address,
    phone: row.phone,
    email: row.email,
    isActive: row.is_active,
    cancellationHoursBefore: row.cancellation_hours_before,
    bookingHoursBefore: row.booking_hours_before,
    timezone: row.timezone,
    clientCount: parseInt(row.client_count || '0', 10),
    adminCount: parseInt(row.admin_count || '0', 10),
    upcomingClassesCount: parseInt(row.upcoming_classes_count || '0', 10),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

/**
 * Create a new branch (superuser only)
 */
export async function createBranch(formData: FormData) {
  const session = await getSession()
  if (!session || session.user.role !== 'superuser') {
    throw new Error('No autorizado')
  }

  const name = formData.get('name') as string
  const address = formData.get('address') as string
  const phone = formData.get('phone') as string
  const email = formData.get('email') as string

  if (!name) {
    throw new Error('El nombre de la sucursal es requerido')
  }

  const client = await pool.connect()
  try {
    await client.query('BEGIN')

    // Create branch
    const branchResult = await branches.createBranch.run(
      {
        name,
        address: address || null,
        phone: phone || null,
        email: email || null,
      },
      client
    )

    const branchId = branchResult[0]?.id
    if (!branchId) {
      throw new Error('No se pudo crear la sucursal')
    }

    // Create default branch settings
    await branches.createBranchSettings.run(
      {
        branchId,
        cancellationHoursBefore: 2,
        bookingHoursBefore: 0,
        timezone: 'America/Guayaquil',
      },
      client
    )

    // Create default notification settings
    const notificationTypes: branches.notification_type[] = [
      'booking_confirmation',
      'booking_cancellation',
      'package_expiration',
      'waitlist_promotion',
    ]
    for (const type of notificationTypes) {
      await branches.createNotificationSetting.run(
        {
          branchId,
          notificationType: type,
          isEnabled: true,
        },
        client
      )
    }

    await client.query('COMMIT')

    await logAdminAction(
      session.user.id,
      'create',
      'branch',
      branchId,
      `Sucursal creada: ${name}`
    )

    revalidatePath('/admin')
    return { success: true, branchId }
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}

/**
 * Update a branch (superuser only)
 */
export async function updateBranch(branchId: string, formData: FormData) {
  const session = await getSession()
  if (!session || session.user.role !== 'superuser') {
    throw new Error('No autorizado')
  }

  const name = formData.get('name') as string
  const address = formData.get('address') as string
  const phone = formData.get('phone') as string
  const email = formData.get('email') as string
  const isActive = formData.get('isActive') === 'true'

  if (!name) {
    throw new Error('El nombre de la sucursal es requerido')
  }

  await branches.updateBranch.run(
    {
      branchId,
      name,
      address: address || null,
      phone: phone || null,
      email: email || null,
      isActive,
    },
    pool
  )

  await logAdminAction(
    session.user.id,
    'update',
    'branch',
    branchId,
    `Sucursal actualizada: ${name}`
  )

  revalidatePath('/admin')
  return { success: true }
}

/**
 * Toggle branch active status (superuser only)
 */
export async function toggleBranchStatus(branchId: string) {
  const session = await getSession()
  if (!session || session.user.role !== 'superuser') {
    throw new Error('No autorizado')
  }

  const result = await branches.toggleBranchStatus.run({ branchId }, pool)

  if (result.length === 0) {
    throw new Error('Sucursal no encontrada')
  }

  await logAdminAction(
    session.user.id,
    'toggle_status',
    'branch',
    branchId,
    `Sucursal ${result[0].is_active ? 'activada' : 'desactivada'}: ${result[0].name}`
  )

  revalidatePath('/admin')
  return { success: true, isActive: result[0].is_active }
}

/**
 * Assign admin to branch (superuser only)
 */
export async function assignAdminToBranch(
  adminId: string,
  branchId: string,
  isPrimary: boolean = false
) {
  const session = await getSession()
  if (!session || session.user.role !== 'superuser') {
    throw new Error('No autorizado')
  }

  // Verify user is an admin
  const userCheck = await branches.checkUserRole.run({ userId: adminId }, pool)

  if (userCheck.length === 0 || userCheck[0].role !== 'admin') {
    throw new Error('El usuario debe ser un administrador')
  }

  // If setting as primary, unset other primaries for this admin
  if (isPrimary) {
    await branches.unsetOtherPrimaryBranches.run({ adminId }, pool)
  }

  // Insert or update assignment
  await branches.assignAdminToBranch.run({ adminId, branchId, isPrimary }, pool)

  await logAdminAction(
    session.user.id,
    'assign',
    'admin_branch',
    null,
    `Admin ${adminId} asignado a sucursal ${branchId}`
  )

  revalidatePath('/admin/users')
  return { success: true }
}

/**
 * Remove admin from branch (superuser only)
 */
export async function removeAdminFromBranch(adminId: string, branchId: string) {
  const session = await getSession()
  if (!session || session.user.role !== 'superuser') {
    throw new Error('No autorizado')
  }

  await branches.removeAdminFromBranch.run({ adminId, branchId }, pool)

  await logAdminAction(
    session.user.id,
    'remove',
    'admin_branch',
    null,
    `Admin ${adminId} removido de sucursal ${branchId}`
  )

  revalidatePath('/admin/users')
  return { success: true }
}

/**
 * Transfer client to another branch (admin or superuser)
 */
export async function transferClientToBranch(
  userId: string,
  newBranchId: string
) {
  const session = await getSession()
  if (!session || !['admin', 'superuser'].includes(session.user.role)) {
    throw new Error('No autorizado')
  }

  // Verify user is a client
  const userCheck = await branches.getUserForTransfer.run({ userId }, pool)

  if (userCheck.length === 0 || userCheck[0].role !== 'client') {
    throw new Error('El usuario debe ser un cliente')
  }

  const oldBranchId = userCheck[0].branch_id

  // Update user's branch
  await branches.transferClientToBranch.run({ userId, newBranchId }, pool)

  await logAdminAction(
    session.user.id,
    'transfer',
    'user',
    userId,
    `Cliente ${userCheck[0].first_name} ${userCheck[0].last_name} transferido de sucursal ${oldBranchId} a ${newBranchId}`
  )

  revalidatePath('/admin/users')
  return { success: true }
}

/**
 * Update branch settings (cancellation and booking restrictions)
 */
export async function updateBranchSettings(
  branchId: string,
  formData: FormData
) {
  const session = await getSession()
  if (!session || !['admin', 'superuser'].includes(session.user.role)) {
    throw new Error('No autorizado')
  }

  // Check if admin has access to this branch
  if (session.user.role === 'admin') {
    const accessCheck = await branches.checkAdminBranchAccess.run(
      { adminId: session.user.id, branchId },
      pool
    )
    if (accessCheck.length === 0) {
      throw new Error('No tienes acceso a esta sucursal')
    }
  }

  const cancellationHoursBefore = parseInt(
    formData.get('cancellationHoursBefore') as string,
    10
  )
  const bookingHoursBefore = parseInt(
    formData.get('bookingHoursBefore') as string,
    10
  )

  if (Number.isNaN(cancellationHoursBefore) || cancellationHoursBefore < 0) {
    throw new Error('Horas de cancelación inválidas')
  }

  if (Number.isNaN(bookingHoursBefore) || bookingHoursBefore < 0) {
    throw new Error('Horas de restricción de reserva inválidas')
  }

  await branches.updateBranchSettings.run(
    { branchId, cancellationHoursBefore, bookingHoursBefore },
    pool
  )

  await logAdminAction(
    session.user.id,
    'update',
    'branch_settings',
    branchId,
    `Configuración de sucursal actualizada: cancelación ${cancellationHoursBefore}h, reserva ${bookingHoursBefore}h`
  )

  revalidatePath('/admin')
  revalidatePath('/admin/branches')
  return { success: true }
}

/**
 * Delete a branch (superuser only)
 */
export async function deleteBranch(
  branchId: string
): Promise<{ success: boolean; message?: string }> {
  const session = await getSession()
  if (!session?.user || session.user.role !== 'superuser') {
    throw new Error(
      'No autorizado. Solo superusuarios pueden eliminar sucursales.'
    )
  }

  // Check if branch has any associated data
  const checkResult = await branches.checkBranchData.run({ branchId }, pool)

  const { users_count, classes_count } = checkResult[0]

  if (
    parseInt(users_count ?? '0', 10) > 0 ||
    parseInt(classes_count ?? '0', 10) > 0
  ) {
    return {
      success: false,
      message: `No se puede eliminar la sucursal. Tiene ${users_count} usuarios y ${classes_count} clases asociadas.`,
    }
  }

  // Delete the branch
  const result = await branches.deleteBranch.run({ branchId }, pool)

  if (result.length === 0) {
    return { success: false, message: 'Sucursal no encontrada' }
  }

  await logAdminAction(
    session.user.id,
    'delete',
    'branch',
    branchId,
    `Sucursal ${result[0].name} eliminada`
  )

  revalidatePath('/admin/branches')
  return { success: true }
}
