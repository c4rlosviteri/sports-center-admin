'use server'

import { revalidatePath } from 'next/cache'
import { logAdminAction } from '~/lib/audit'
import { pool } from '~/lib/db'
import { getSession } from './auth'

export interface Package {
  id: string
  name: string
  description: string | null
  classCount: number
  price: number
  validityType: 'unlimited' | 'days' | 'months'
  validityPeriod: number | null
  maxClassesPerDay: number | null
  maxClassesPerWeek: number | null
  isActive: boolean
  displayOrder: number | null
  createdAt: Date | null
  branchName?: string
}

export interface PackageTemplateInput {
  name: string
  description?: string
  classCount: number
  price: number
  validityType: 'unlimited' | 'days' | 'months'
  validityPeriod?: number
  maxClassesPerDay?: number | null
  maxClassesPerWeek?: number | null
  isGiftEligible?: boolean
  isShareable?: boolean
  allowsWaitlist?: boolean
  priorityBooking?: boolean
  isActive: boolean
  displayOrder?: number
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
 * Get all package templates for the admin's branch
 */
export async function getPackageTemplates() {
  const session = await getAdminSession()

  const result = await pool.query(
    `SELECT * FROM class_package_templates
     WHERE branch_id = $1 AND is_active = true
     ORDER BY display_order, class_count`,
    [session.user.branchId]
  )

  return result.rows.map((row) => ({
    id: row.id,
    name: row.name,
    description: row.description,
    classCount: row.class_count,
    price: parseFloat(row.price),
    validityType: row.validity_type as 'unlimited' | 'days' | 'months',
    validityPeriod: row.validity_period,
    maxClassesPerDay: row.max_classes_per_day,
    maxClassesPerWeek: row.max_classes_per_week,
    isActive: row.is_active ?? true,
    displayOrder: row.display_order,
    createdAt: row.created_at,
  }))
}

/**
 * Get all package templates including inactive ones (for admin management)
 * For superusers: returns packages from ALL branches with branch names
 * For admins: returns packages from their branch only
 */
export async function getAllPackageTemplates(): Promise<Package[]> {
  const session = await getAdminSession()

  // For superusers, get packages from ALL branches
  if (session.user.role === 'superuser') {
    const result = await pool.query(
      `SELECT cpt.*, b.name as branch_name
       FROM class_package_templates cpt
       JOIN branches b ON cpt.branch_id = b.id
       ORDER BY b.name, cpt.is_active DESC, cpt.display_order, cpt.class_count`
    )

    return result.rows.map((row) => ({
      id: row.id,
      name: row.name,
      description: row.description,
      classCount: row.class_count,
      price: parseFloat(row.price),
      validityType: row.validity_type as 'unlimited' | 'days' | 'months',
      validityPeriod: row.validity_period,
      maxClassesPerDay: row.max_classes_per_day,
      maxClassesPerWeek: row.max_classes_per_week,
      isActive: row.is_active ?? true,
      displayOrder: row.display_order,
      createdAt: row.created_at,
      branchName: row.branch_name,
    }))
  }

  // For admins, keep existing behavior - only their branch
  const result = await pool.query(
    `SELECT * FROM class_package_templates
     WHERE branch_id = $1
     ORDER BY is_active DESC, display_order, class_count`,
    [session.user.branchId]
  )

  return result.rows.map((row) => ({
    id: row.id,
    name: row.name,
    description: row.description,
    classCount: row.class_count,
    price: parseFloat(row.price),
    validityType: row.validity_type as 'unlimited' | 'days' | 'months',
    validityPeriod: row.validity_period,
    maxClassesPerDay: row.max_classes_per_day,
    maxClassesPerWeek: row.max_classes_per_week,
    isActive: row.is_active ?? true,
    displayOrder: row.display_order,
    createdAt: row.created_at,
    branchName: undefined,
  }))
}

/**
 * Create a new package template
 */
export async function createPackageTemplate(input: PackageTemplateInput) {
  const session = await getAdminSession()

  const result = await pool.query(
    `INSERT INTO class_package_templates (
      branch_id,
      name,
      description,
      class_count,
      price,
      validity_type,
      validity_period,
      max_classes_per_day,
      max_classes_per_week,
      is_gift_eligible,
      is_shareable,
      allows_waitlist,
      priority_booking,
      is_active,
      display_order
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
    RETURNING *`,
    [
      session.user.branchId,
      input.name,
      input.description ?? null,
      input.classCount,
      input.price,
      input.validityType,
      input.validityType === 'unlimited' ? null : input.validityPeriod,
      input.maxClassesPerDay ?? null,
      input.maxClassesPerWeek ?? null,
      input.isGiftEligible ?? false,
      input.isShareable ?? false,
      input.allowsWaitlist ?? true,
      input.priorityBooking ?? false,
      input.isActive,
      input.displayOrder ?? 0,
    ]
  )

  await logAdminAction(
    session.user.id,
    'create',
    'class_package_template',
    result.rows[0].id,
    `Creó paquete ${input.name}`,
    { classCount: input.classCount, price: input.price }
  )

  revalidatePath('/admin/packages')

  return result.rows[0]
}

/**
 * Update an existing package template
 */
export async function updatePackageTemplate(
  packageId: string,
  input: Partial<PackageTemplateInput>
) {
  const session = await getAdminSession()

  // Check if user has access to this package
  const checkResult = await pool.query(
    'SELECT branch_id FROM class_package_templates WHERE id = $1',
    [packageId]
  )

  if (checkResult.rows.length === 0) {
    throw new Error('Paquete no encontrado')
  }

  // For non-superusers, verify they own this package's branch
  if (
    session.user.role !== 'superuser' &&
    checkResult.rows[0].branch_id !== session.user.branchId
  ) {
    throw new Error('No tienes permiso para editar este paquete')
  }

  const setClauses: string[] = []
  const values: (string | number | boolean | null)[] = []
  let paramIndex = 1

  if (input.name !== undefined) {
    setClauses.push(`name = $${paramIndex++}`)
    values.push(input.name)
  }
  if (input.description !== undefined) {
    setClauses.push(`description = $${paramIndex++}`)
    values.push(input.description ?? null)
  }
  if (input.classCount !== undefined) {
    setClauses.push(`class_count = $${paramIndex++}`)
    values.push(input.classCount)
  }
  if (input.price !== undefined) {
    setClauses.push(`price = $${paramIndex++}`)
    values.push(input.price)
  }
  if (input.validityType !== undefined) {
    setClauses.push(`validity_type = $${paramIndex++}`)
    values.push(input.validityType)
  }
  if (input.validityPeriod !== undefined) {
    setClauses.push(`validity_period = $${paramIndex++}`)
    values.push(
      input.validityType === 'unlimited' ? null : input.validityPeriod
    )
  }
  if (input.maxClassesPerDay !== undefined) {
    setClauses.push(`max_classes_per_day = $${paramIndex++}`)
    values.push(input.maxClassesPerDay)
  }
  if (input.maxClassesPerWeek !== undefined) {
    setClauses.push(`max_classes_per_week = $${paramIndex++}`)
    values.push(input.maxClassesPerWeek)
  }
  if (input.isActive !== undefined) {
    setClauses.push(`is_active = $${paramIndex++}`)
    values.push(input.isActive)
  }

  if (setClauses.length === 0) {
    throw new Error('No hay campos para actualizar')
  }

  values.push(packageId)

  const result = await pool.query(
    `UPDATE class_package_templates
     SET ${setClauses.join(', ')}, updated_at = CURRENT_TIMESTAMP
     WHERE id = $${paramIndex}
     RETURNING *`,
    values
  )

  await logAdminAction(
    session.user.id,
    'update',
    'class_package_template',
    packageId,
    `Actualizó paquete ${input.name ?? packageId}`,
    input
  )

  revalidatePath('/admin/packages')

  return result.rows[0]
}

/**
 * Toggle package active status
 */
export async function togglePackageStatus(
  packageId: string,
  isActive: boolean
) {
  const session = await getAdminSession()

  // Check if user has access to this package
  const checkResult = await pool.query(
    'SELECT branch_id, name FROM class_package_templates WHERE id = $1',
    [packageId]
  )

  if (checkResult.rows.length === 0) {
    throw new Error('Paquete no encontrado')
  }

  // For non-superusers, verify they own this package's branch
  if (
    session.user.role !== 'superuser' &&
    checkResult.rows[0].branch_id !== session.user.branchId
  ) {
    throw new Error('No tienes permiso para modificar este paquete')
  }

  const result = await pool.query(
    `UPDATE class_package_templates
     SET is_active = $1, updated_at = CURRENT_TIMESTAMP
     WHERE id = $2
     RETURNING *`,
    [isActive, packageId]
  )

  await logAdminAction(
    session.user.id,
    'update',
    'class_package_template',
    packageId,
    `${isActive ? 'Activó' : 'Desactivó'} paquete ${checkResult.rows[0].name}`,
    { isActive }
  )

  revalidatePath('/admin/packages')

  return result.rows[0]
}

/**
 * Delete a package template (only if no purchases)
 */
export async function deletePackageTemplate(packageId: string) {
  const session = await getAdminSession()

  // Check if user has access to this package
  const checkResult = await pool.query(
    'SELECT branch_id, name FROM class_package_templates WHERE id = $1',
    [packageId]
  )

  if (checkResult.rows.length === 0) {
    throw new Error('Paquete no encontrado')
  }

  // For non-superusers, verify they own this package's branch
  if (
    session.user.role !== 'superuser' &&
    checkResult.rows[0].branch_id !== session.user.branchId
  ) {
    throw new Error('No tienes permiso para eliminar este paquete')
  }

  // Check if there are any purchases
  const purchasesCheck = await pool.query(
    'SELECT COUNT(*) as count FROM user_class_packages WHERE package_template_id = $1',
    [packageId]
  )

  if (parseInt(purchasesCheck.rows[0].count, 10) > 0) {
    throw new Error('No se puede eliminar un paquete con compras asociadas')
  }

  await pool.query('DELETE FROM class_package_templates WHERE id = $1', [
    packageId,
  ])

  await logAdminAction(
    session.user.id,
    'delete',
    'class_package_template',
    packageId,
    `Eliminó paquete ${checkResult.rows[0].name}`,
    {}
  )

  revalidatePath('/admin/packages')

  return { success: true }
}

/**
 * Assign a package to a user (admin only)
 */
export async function assignPackageToUser(
  userId: string,
  packageTemplateId: string,
  expiresAt?: Date
) {
  const session = await getAdminSession()

  // Get template details
  const templateResult = await pool.query(
    `SELECT * FROM class_package_templates
     WHERE id = $1 AND is_active = true`,
    [packageTemplateId]
  )

  if (templateResult.rows.length === 0) {
    throw new Error('Paquete no encontrado o inactivo')
  }

  const template = templateResult.rows[0]

  // For non-superusers, verify the package belongs to their branch
  if (
    session.user.role !== 'superuser' &&
    template.branch_id !== session.user.branchId
  ) {
    throw new Error('No tienes permiso para asignar este paquete')
  }

  // Calculate expiration date
  let finalExpiresAt: Date | null = expiresAt ?? null
  if (!finalExpiresAt && template.validity_type !== 'unlimited') {
    finalExpiresAt = new Date()
    if (template.validity_type === 'days') {
      finalExpiresAt.setDate(
        finalExpiresAt.getDate() + template.validity_period
      )
    } else if (template.validity_type === 'months') {
      finalExpiresAt.setMonth(
        finalExpiresAt.getMonth() + template.validity_period
      )
    }
  }

  // Create user package
  const result = await pool.query(
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
    ) VALUES ($1, $2, $3, $4, $5, $6, 'active', false, CURRENT_TIMESTAMP, $7)
    RETURNING *`,
    [
      userId,
      template.branch_id,
      packageTemplateId,
      template.class_count,
      template.class_count,
      finalExpiresAt?.toISOString() ?? null,
      parseFloat(template.price),
    ]
  )

  await logAdminAction(
    session.user.id,
    'create',
    'user_class_package',
    result.rows[0].id,
    `Asignó paquete ${template.name} a usuario ${userId}`,
    { packageTemplateId, userId }
  )

  return result.rows[0]
}
