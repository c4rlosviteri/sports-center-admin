'use server'

import { revalidatePath } from 'next/cache'
import * as classPackagesQueries from '~/db/queries/class-packages.queries'
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

  const rows = await classPackagesQueries.getPackageTemplates.run(
    { branchId: session.user.branchId },
    pool
  )

  return rows.map((row) => ({
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
    const rows =
      await classPackagesQueries.getAllPackageTemplatesWithBranch.run(
        undefined,
        pool
      )

    return rows.map((row) => ({
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
  const rows = await classPackagesQueries.getAllPackageTemplatesByBranch.run(
    { branchId: session.user.branchId },
    pool
  )

  return rows.map((row) => ({
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

  const result = await classPackagesQueries.createPackageTemplate.run(
    {
      branchId: session.user.branchId,
      name: input.name,
      description: input.description ?? null,
      classCount: input.classCount,
      price: input.price,
      validityType: input.validityType,
      validityPeriod:
        input.validityType === 'unlimited'
          ? null
          : (input.validityPeriod ?? null),
      maxClassesPerDay: input.maxClassesPerDay ?? null,
      maxClassesPerWeek: input.maxClassesPerWeek ?? null,
      isGiftEligible: input.isGiftEligible ?? false,
      isShareable: input.isShareable ?? false,
      allowsWaitlist: input.allowsWaitlist ?? true,
      priorityBooking: input.priorityBooking ?? false,
      isActive: input.isActive,
      displayOrder: input.displayOrder ?? 0,
      allowedClassTypes: null,
      blackoutDates: null,
    },
    pool
  )

  await logAdminAction(
    session.user.id,
    'create',
    'class_package_template',
    result[0].id,
    `Creó paquete ${input.name}`,
    { classCount: input.classCount, price: input.price }
  )

  revalidatePath('/admin/packages')

  return result[0]
}

/**
 * Update an existing package template
 */
export async function updatePackageTemplate(
  packageId: string,
  input: Partial<PackageTemplateInput>
) {
  const session = await getAdminSession()

  const existingResult =
    await classPackagesQueries.getPackageTemplateByIdAny.run(
      { templateId: packageId },
      pool
    )

  if (existingResult.length === 0) {
    throw new Error('Paquete no encontrado')
  }

  const existing = existingResult[0]

  // For non-superusers, verify they own this package's branch
  if (
    session.user.role !== 'superuser' &&
    existing.branch_id !== session.user.branchId
  ) {
    throw new Error('No tienes permiso para editar este paquete')
  }

  const nextValidityType = input.validityType ?? existing.validity_type
  const nextValidityPeriod =
    nextValidityType === 'unlimited'
      ? null
      : (input.validityPeriod ?? existing.validity_period)

  const result = await classPackagesQueries.updatePackageTemplate.run(
    {
      templateId: packageId,
      branchId: existing.branch_id,
      name: input.name ?? existing.name,
      description: input.description ?? existing.description,
      classCount: input.classCount ?? existing.class_count,
      price: input.price ?? existing.price,
      validityType: nextValidityType,
      validityPeriod: nextValidityPeriod ?? null,
      isGiftEligible: existing.is_gift_eligible ?? false,
      isShareable: existing.is_shareable ?? false,
      allowsWaitlist: existing.allows_waitlist ?? true,
      priorityBooking: existing.priority_booking ?? false,
      allowedClassTypes: existing.allowed_class_types ?? null,
      blackoutDates: existing.blackout_dates ?? null,
      maxClassesPerDay:
        input.maxClassesPerDay ?? existing.max_classes_per_day ?? null,
      maxClassesPerWeek:
        input.maxClassesPerWeek ?? existing.max_classes_per_week ?? null,
      isActive: input.isActive ?? existing.is_active ?? true,
      displayOrder: existing.display_order ?? null,
    },
    pool
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

  return result[0]
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
  const existingResult =
    await classPackagesQueries.getPackageTemplateByIdAny.run(
      { templateId: packageId },
      pool
    )

  if (existingResult.length === 0) {
    throw new Error('Paquete no encontrado')
  }

  const existing = existingResult[0]

  // For non-superusers, verify they own this package's branch
  if (
    session.user.role !== 'superuser' &&
    existing.branch_id !== session.user.branchId
  ) {
    throw new Error('No tienes permiso para modificar este paquete')
  }

  const result = await classPackagesQueries.updatePackageTemplateStatus.run(
    { templateId: packageId, isActive },
    pool
  )

  await logAdminAction(
    session.user.id,
    'update',
    'class_package_template',
    packageId,
    `${isActive ? 'Activó' : 'Desactivó'} paquete ${existing.name}`,
    { isActive }
  )

  revalidatePath('/admin/packages')

  return result[0]
}

/**
 * Delete a package template (only if no purchases)
 */
export async function deletePackageTemplate(packageId: string) {
  const session = await getAdminSession()

  // Check if user has access to this package
  const existingResult =
    await classPackagesQueries.getPackageTemplateByIdAny.run(
      { templateId: packageId },
      pool
    )

  if (existingResult.length === 0) {
    throw new Error('Paquete no encontrado')
  }

  const existing = existingResult[0]

  // For non-superusers, verify they own this package's branch
  if (
    session.user.role !== 'superuser' &&
    existing.branch_id !== session.user.branchId
  ) {
    throw new Error('No tienes permiso para eliminar este paquete')
  }

  // Check if there are any purchases
  const purchasesCheck =
    await classPackagesQueries.getPackagePurchasesCount.run(
      { templateId: packageId },
      pool
    )

  if (purchasesCheck[0]?.count && purchasesCheck[0].count > 0) {
    throw new Error('No se puede eliminar un paquete con compras asociadas')
  }

  await classPackagesQueries.deletePackageTemplateById.run(
    { templateId: packageId },
    pool
  )

  await logAdminAction(
    session.user.id,
    'delete',
    'class_package_template',
    packageId,
    `Eliminó paquete ${existing.name}`,
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
  const templateResult =
    await classPackagesQueries.getActivePackageTemplateById.run(
      { templateId: packageTemplateId },
      pool
    )

  if (templateResult.length === 0) {
    throw new Error('Paquete no encontrado o inactivo')
  }

  const template = templateResult[0]

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
    if (template.validity_type === 'days' && template.validity_period) {
      finalExpiresAt.setDate(
        finalExpiresAt.getDate() + template.validity_period
      )
    } else if (
      template.validity_type === 'months' &&
      template.validity_period
    ) {
      finalExpiresAt.setMonth(
        finalExpiresAt.getMonth() + template.validity_period
      )
    }
  }

  // Create user package
  const result = await classPackagesQueries.purchasePackage.run(
    {
      userId,
      branchId: template.branch_id,
      packageTemplateId,
      totalClasses: template.class_count,
      classesRemaining: template.class_count,
      expiresAt: finalExpiresAt?.toISOString() ?? null,
      status: 'active',
      isGift: false,
      giftFromUserId: null,
      giftMessage: null,
      paymentId: null,
      purchasePrice: template.price,
    },
    pool
  )

  await logAdminAction(
    session.user.id,
    'create',
    'user_class_package',
    result[0].id,
    `Asignó paquete ${template.name} a usuario ${userId}`,
    { packageTemplateId, userId }
  )

  return result[0]
}
