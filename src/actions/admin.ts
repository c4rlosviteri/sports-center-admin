'use server'

import { revalidatePath } from 'next/cache'
import * as admin from '~/db/queries/admin.queries'
import { logAdminAction } from '~/lib/audit'
import { hashPassword } from '~/lib/auth'
import { pool } from '~/lib/db'
import { getSession } from './auth'
import { getAdminBranches, getAllBranches } from './branches'

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
 * Get all user accounts for the admin's branch
 */
export async function getAllUsers() {
  const session = await getAdminSession()

  const result = await admin.getAllUsers.run(
    { branchId: session.user.branchId },
    pool
  )

  return result.map((row) => ({
    id: row.id,
    email: row.email,
    firstName: row.first_name,
    lastName: row.last_name,
    phone: row.phone,
    role: row.role,
    createdAt: row.created_at ?? new Date(),
    branchId: row.branch_id,
    branchName: row.branch_name,
  }))
}

/**
 * Get paginated user accounts with optional role filter
 */
export async function getUsersPaginated(options: {
  page?: number
  pageSize?: number
  role?: 'superuser' | 'admin' | 'client' | null
}) {
  const session = await getAdminSession()

  const page = options.page ?? 1
  const pageSize = options.pageSize ?? 10
  const offset = (page - 1) * pageSize

  const [usersResult, countResult] = await Promise.all([
    admin.getUsersPaginated.run(
      {
        branchId: session.user.branchId,
        role: options.role ?? null,
        limit: pageSize,
        offset,
      },
      pool
    ),
    admin.getUsersCount.run(
      {
        branchId: session.user.branchId,
        role: options.role ?? null,
      },
      pool
    ),
  ])

  const total = countResult[0]?.total ?? 0
  const totalPages = Math.ceil(total / pageSize)

  return {
    users: usersResult.map((row) => ({
      id: row.id,
      email: row.email,
      firstName: row.first_name,
      lastName: row.last_name,
      phone: row.phone,
      role: row.role,
      createdAt: row.created_at ?? new Date(),
      branchId: row.branch_id,
      branchName: row.branch_name,
    })),
    pagination: {
      page,
      pageSize,
      total,
      totalPages,
    },
  }
}

/**
 * Update user role
 */
export async function updateUserRole(
  userId: string,
  newRole: 'admin' | 'client',
  branchIds?: string[]
) {
  const session = await getAdminSession()

  // Prevent changing superuser role
  const userCheck = await admin.getUserRoleById.run({ userId }, pool)
  if (userCheck.length === 0) {
    throw new Error('Usuario no encontrado')
  }
  if (userCheck[0]?.role === 'superuser') {
    throw new Error('No se puede cambiar el rol de un superusuario')
  }

  const client = await pool.connect()
  try {
    await client.query('BEGIN')

    // Update user role
    await admin.updateUserRoleInBranch.run(
      { role: newRole, userId, branchId: session.user.branchId },
      client
    )

    // Handle branch assignments
    if (newRole === 'admin' && branchIds && branchIds.length > 0) {
      // Remove existing branch assignments
      await admin.deleteAdminBranchAssignments.run({ adminId: userId }, client)

      // Add new branch assignments
      for (let i = 0; i < branchIds.length; i++) {
        await admin.createAdminBranchAssignment.run(
          { adminId: userId, branchId: branchIds[i], isPrimary: i === 0 },
          client
        )
      }
    } else if (newRole === 'client') {
      // Remove all branch assignments when demoting to client
      await admin.deleteAdminBranchAssignments.run({ adminId: userId }, client)
    }

    await client.query('COMMIT')

    await logAdminAction(
      session.user.id,
      'update',
      'user',
      userId,
      `Cambió rol de usuario a ${newRole}`,
      { newRole, previousRole: userCheck[0]?.role, branchIds }
    )

    revalidatePath('/admin/users')
    return { success: true }
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}

/**
 * Delete a user (soft delete by setting inactive or hard delete)
 */
export async function deleteUser(userId: string) {
  const session = await getAdminSession()

  // Prevent deleting superuser
  const userCheck = await admin.getUserRoleById.run({ userId }, pool)
  if (userCheck.length === 0) {
    throw new Error('Usuario no encontrado')
  }
  if (userCheck[0]?.role === 'superuser') {
    throw new Error('No se puede eliminar un superusuario')
  }

  // Check if user has recorded payments (would prevent deletion due to RESTRICT constraint)
  const paymentsCheck = await admin.countPaymentsRecordedBy.run(
    { userId },
    pool
  )
  if ((paymentsCheck[0]?.count ?? 0) > 0) {
    throw new Error(
      'No se puede eliminar este usuario porque ha registrado pagos en el sistema'
    )
  }

  await admin.deleteUserInBranch.run(
    { userId, branchId: session.user.branchId },
    pool
  )

  await logAdminAction(
    session.user.id,
    'delete',
    'user',
    userId,
    'Eliminó usuario',
    { deletedRole: userCheck[0]?.role }
  )

  revalidatePath('/admin/users')
  return { success: true }
}

/**
 * Get all classes for a specific month
 */
export async function getClassesByMonth(year: number, month: number) {
  const session = await getAdminSession()

  const result = await admin.getAdminClassesByMonth.run(
    { branchId: session.user.branchId, year, month },
    pool
  )

  return result.map((row) => ({
    id: row.id,
    name: row.name,
    instructor: row.instructor,
    scheduledAt: row.scheduled_at
      ? new Date(row.scheduled_at).toISOString()
      : '',
    durationMinutes: row.duration_minutes,
    capacity: row.capacity,
    waitlistCapacity: row.waitlist_capacity,
    confirmedCount: row.confirmed_count,
    waitlistCount: row.waitlist_count,
  }))
}

/**
 * Create a new class
 */
export async function createClass(data: {
  name: string
  instructor: string
  scheduledAt: Date
  durationMinutes: number
  capacity: number
  waitlistCapacity: number
  bookingHoursBefore?: number
}) {
  const session = await getAdminSession()

  const result = await admin.createAdminClass.run(
    {
      branchId: session.user.branchId,
      name: data.name,
      instructor: data.instructor,
      scheduledAt: data.scheduledAt,
      durationMinutes: data.durationMinutes,
      capacity: data.capacity,
      waitlistCapacity: data.waitlistCapacity,
      bookingHoursBefore: data.bookingHoursBefore ?? null,
    },
    pool
  )

  const classId = result[0]?.id
  if (!classId) {
    throw new Error('No se pudo crear la clase')
  }

  await logAdminAction(
    session.user.id,
    'create',
    'class',
    classId,
    `Creó clase: ${data.name}`,
    {
      name: data.name,
      instructor: data.instructor,
      scheduledAt: data.scheduledAt,
      capacity: data.capacity,
    }
  )

  revalidatePath('/admin/classes')
  return {
    id: result[0].id,
    name: result[0].name,
    instructor: result[0].instructor,
    scheduledAt: result[0].scheduled_at,
    durationMinutes: result[0].duration_minutes,
    capacity: result[0].capacity,
    waitlistCapacity: result[0].waitlist_capacity,
  }
}

/**
 * Update a class
 */
export async function updateClass(
  classId: string,
  data: {
    name: string
    instructor: string
    scheduledAt: Date
    durationMinutes: number
    capacity: number
    waitlistCapacity: number
    bookingHoursBefore?: number
  }
) {
  const session = await getAdminSession()

  await admin.updateAdminClass.run(
    {
      classId,
      branchId: session.user.branchId,
      name: data.name,
      instructor: data.instructor,
      scheduledAt: data.scheduledAt,
      durationMinutes: data.durationMinutes,
      capacity: data.capacity,
      waitlistCapacity: data.waitlistCapacity,
      bookingHoursBefore: data.bookingHoursBefore ?? null,
    },
    pool
  )

  await logAdminAction(
    session.user.id,
    'update',
    'class',
    classId,
    `Actualizó clase: ${data.name}`,
    {
      name: data.name,
      instructor: data.instructor,
      scheduledAt: data.scheduledAt,
    }
  )

  revalidatePath('/admin/classes')
  return { success: true }
}

/**
 * Delete a class
 */
export async function deleteClass(classId: string) {
  const session = await getAdminSession()

  await admin.deleteAdminClass.run(
    { classId, branchId: session.user.branchId },
    pool
  )

  await logAdminAction(
    session.user.id,
    'delete',
    'class',
    classId,
    'Eliminó clase',
    {}
  )

  revalidatePath('/admin/classes')
  return { success: true }
}

/**
 * Get client details with bookings
 */
export async function getClientDetails(userId: string) {
  const session = await getAdminSession()

  const userResult = await admin.getUserDetails.run(
    { userId, branchId: session.user.branchId },
    pool
  )

  if (userResult.length === 0) {
    throw new Error('Usuario no encontrado')
  }

  const user = userResult[0]

  const bookingsResult = await admin.getClientBookings.run({ userId }, pool)

  return {
    user: {
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      phone: user.phone,
      dateOfBirth: user.date_of_birth,
      idNumber: user.id_number,
      address: user.address,
      createdAt: user.created_at ?? new Date(),
    },
    bookings: bookingsResult.map((row) => ({
      id: row.id,
      status: row.status,
      bookedAt: row.booked_at,
      cancelledAt: row.cancelled_at,
      className: row.class_name,
      instructorName: row.instructor_name,
      scheduledAt: row.scheduled_at,
    })),
  }
}

/**
 * Create a new admin user without requiring a package
 */
export async function createAdminUser(formData: FormData) {
  const session = await getSession()
  if (!session || session.user.role !== 'superuser') {
    throw new Error('Solo superusuarios pueden crear administradores')
  }

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const firstName = formData.get('firstName') as string
  const lastName = formData.get('lastName') as string
  const phone = formData.get('phone') as string
  const branchId = formData.get('branchId') as string

  if (!email || !password || !firstName || !lastName) {
    throw new Error('Todos los campos son requeridos')
  }

  const { hashPassword } = await import('~/lib/auth')
  const client = await pool.connect()

  try {
    await client.query('BEGIN')

    // Check if user exists
    const existingUser = await admin.getUserIdByEmail.run({ email }, client)
    if (existingUser.length > 0) {
      throw new Error('Este correo electrónico ya está registrado')
    }

    const passwordHash = await hashPassword(password)

    const userResult = await admin.createUserWithRole.run(
      {
        email,
        firstName,
        lastName,
        phone: phone || null,
        role: 'admin',
        branchId,
      },
      client
    )

    const userId = userResult[0]?.id
    if (!userId) {
      throw new Error('No se pudo crear el usuario')
    }

    // Insert password into account table (Better Auth)
    await admin.createAccountCredential.run(
      { userId, accountId: email, password: passwordHash },
      client
    )

    await logAdminAction(
      session.user.id,
      'create',
      'user',
      userId,
      `Creó usuario administrador: ${email}`,
      { email, role: 'admin' }
    )

    await client.query('COMMIT')
    revalidatePath('/admin/users')
    return { success: true }
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}

/**
 * Create a new payment record
 */
export async function createPayment(data: {
  userId: string
  amount: number
  paymentDate: string
  notes?: string
}) {
  const session = await getAdminSession()

  try {
    const result = await admin.createPayment.run(
      {
        userId: data.userId,
        amount: data.amount,
        paymentDate: data.paymentDate,
        notes: data.notes || null,
        recordedBy: session.user.id,
      },
      pool
    )

    const created = result[0]
    if (!created) {
      throw new Error('No se pudo registrar el pago')
    }

    await logAdminAction(
      session.user.id,
      'create',
      'payment',
      created.id,
      `Registró pago de $${data.amount} para usuario ${data.userId}`,
      data
    )

    revalidatePath('/admin/payments')
    revalidatePath(`/admin/users/${data.userId}`)
    return created
  } catch (error) {
    console.error('Error creating payment:', error)
    if (error instanceof Error) {
      throw new Error(`Error al crear pago: ${error.message}`)
    }
    throw new Error('Error al crear pago')
  }
}

/**
 * Get all payments for a specific user
 */
export async function getPaymentsByUser(userId: string) {
  const session = await getSession()
  if (!session) {
    throw new Error('No autorizado')
  }

  // Allow admins and the user themselves to view payments
  if (
    !['admin', 'superuser'].includes(session.user.role) &&
    session.user.id !== userId
  ) {
    throw new Error('No autorizado')
  }

  const result = await admin.getPaymentsByUser.run({ userId }, pool)

  return result.map((row) => ({
    id: row.id,
    userId: row.user_id,
    amount: parseFloat(row.amount.toString()),
    paymentDate: row.payment_date,
    notes: row.notes,
    recordedByName: row.recorded_by_name ?? 'Sistema',
    createdAt: row.created_at,
  }))
}

/**
 * Get all payments (admin only)
 */
export async function getAllPayments() {
  const session = await getAdminSession()

  const result = await admin.getAllPayments.run(
    { branchId: session.user.branchId },
    pool
  )

  return result.map((row) => ({
    id: row.id,
    userId: row.user_id,
    amount: parseFloat(row.amount.toString()),
    paymentDate: row.payment_date,
    notes: row.notes,
    createdAt: row.created_at,
    userName: `${row.first_name} ${row.last_name}`,
    userEmail: row.email,
    recordedByName: row.recorded_by_name ?? 'Sistema',
  }))
}

/**
 * Update a payment record
 */
export async function updatePayment(
  paymentId: string,
  data: {
    amount: number
    paymentDate: string
    notes?: string
  }
) {
  const session = await getAdminSession()

  try {
    // Verify payment exists and belongs to a user in the admin's branch
    const paymentCheck = await admin.getPaymentForAdmin.run(
      { paymentId, branchId: session.user.branchId },
      pool
    )

    if (paymentCheck.length === 0) {
      throw new Error('Pago no encontrado')
    }

    await admin.updatePayment.run(
      {
        paymentId,
        amount: data.amount,
        paymentDate: data.paymentDate,
        notes: data.notes ?? null,
      },
      pool
    )

    await logAdminAction(
      session.user.id,
      'update',
      'payment',
      paymentId,
      `Actualizó pago: $${data.amount}`,
      data
    )

    revalidatePath('/admin/payments')
    return { success: true }
  } catch (error) {
    console.error('Error updating payment:', error)
    if (error instanceof Error) {
      throw new Error(`Error al actualizar pago: ${error.message}`)
    }
    throw new Error('Error al actualizar pago')
  }
}

/**
 * Delete a payment record
 */
export async function deletePayment(paymentId: string) {
  const session = await getAdminSession()

  try {
    // Verify payment exists and belongs to a user in the admin's branch
    const paymentCheck = await admin.getPaymentForAdmin.run(
      { paymentId, branchId: session.user.branchId },
      pool
    )

    if (paymentCheck.length === 0) {
      throw new Error('Pago no encontrado')
    }

    const payment = paymentCheck[0]

    await admin.deletePayment.run({ paymentId }, pool)

    await logAdminAction(
      session.user.id,
      'delete',
      'payment',
      paymentId,
      `Eliminó pago de $${payment.amount}`,
      { userId: payment.user_id, amount: payment.amount }
    )

    revalidatePath('/admin/payments')
    return { success: true }
  } catch (error) {
    console.error('Error deleting payment:', error)
    if (error instanceof Error) {
      throw new Error(`Error al eliminar pago: ${error.message}`)
    }
    throw new Error('Error al eliminar pago')
  }
}

/**
 * Get current admin's active branch context
 */
export async function getCurrentBranchContext() {
  const session = await getAdminSession()

  // For superuser, get all branches
  if (session.user.role === 'superuser') {
    return {
      role: 'superuser' as const,
      currentBranchId: session.user.branchId,
      branches: await getAllBranches(),
    }
  }

  // For admin, get assigned branches
  const branches = await getAdminBranches()

  return {
    role: 'admin' as const,
    currentBranchId: session.user.branchId || session.user.branchId,
    branches,
  }
}

/**
 * Switch admin's active branch context
 */
export async function switchBranchContext(branchId: string) {
  const session = await getAdminSession()

  // Verify admin has access to this branch
  if (session.user.role === 'admin') {
    const accessCheck = await admin.checkAdminBranchAccess.run(
      { adminId: session.user.id, branchId },
      pool
    )
    if (accessCheck.length === 0) {
      throw new Error('No tienes acceso a esta sucursal')
    }
  }

  // Update user's current branch
  await admin.updateUserBranch.run(
    { branchId, userId: session.user.id },
    pool
  )

  await logAdminAction(
    session.user.id,
    'switch_branch',
    'user',
    session.user.id,
    `Cambió a sucursal ${branchId}`
  )

  revalidatePath('/admin')
  return { success: true }
}

/**
 * Create a new superuser (superuser only)
 */
export async function createSuperuser(formData: FormData) {
  const session = await getSession()
  if (!session || session.user.role !== 'superuser') {
    throw new Error(
      'No autorizado - solo superusuarios pueden crear otros superusuarios'
    )
  }

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const firstName = formData.get('firstName') as string
  const lastName = formData.get('lastName') as string
  const phone = formData.get('phone') as string
  const branchId = formData.get('branchId') as string

  if (!email || !password || !firstName || !lastName) {
    throw new Error('Todos los campos requeridos deben ser completados')
  }

  // Check if email already exists
  const existingUser = await admin.getUserIdByEmail.run({ email }, pool)

  if (existingUser.length > 0) {
    throw new Error('Ya existe un usuario con este correo electrónico')
  }

  const passwordHash = await hashPassword(password)

  const client = await pool.connect()
  try {
    await client.query('BEGIN')

    const result = await admin.createUserWithRole.run(
      {
        email,
        firstName,
        lastName,
        phone: phone || null,
        role: 'superuser',
        branchId,
      },
      client
    )

    const userId = result[0]?.id
    if (!userId) {
      throw new Error('No se pudo crear el usuario')
    }

    // Insert password into account table (Better Auth)
    await admin.createAccountCredential.run(
      { userId, accountId: email, password: passwordHash },
      client
    )

    await client.query('COMMIT')

    await logAdminAction(
      session.user.id,
      'create',
      'user',
      userId,
      `Superusuario creado: ${email}`
    )

    revalidatePath('/admin/users')
    return { success: true, userId }
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}

/**
 * Create a new admin user (superuser only)
 */
export async function createAdmin(formData: FormData) {
  const session = await getSession()
  if (!session || session.user.role !== 'superuser') {
    throw new Error(
      'No autorizado - solo superusuarios pueden crear administradores'
    )
  }

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const firstName = formData.get('firstName') as string
  const lastName = formData.get('lastName') as string
  const phone = formData.get('phone') as string
  const branchId = formData.get('branchId') as string

  if (!email || !password || !firstName || !lastName || !branchId) {
    throw new Error('Todos los campos requeridos deben ser completados')
  }

  // Check if email already exists
  const existingUser = await admin.getUserIdByEmail.run({ email }, pool)

  if (existingUser.length > 0) {
    throw new Error('Ya existe un usuario con este correo electrónico')
  }

  const passwordHash = await hashPassword(password)

  const client = await pool.connect()
  try {
    await client.query('BEGIN')

    // Create admin user
    const userResult = await admin.createUserWithRole.run(
      {
        email,
        firstName,
        lastName,
        phone: phone || null,
        role: 'admin',
        branchId,
      },
      client
    )

    const userId = userResult[0]?.id
    if (!userId) {
      throw new Error('No se pudo crear el usuario')
    }

    // Insert password into account table (Better Auth)
    await admin.createAccountCredential.run(
      { userId, accountId: email, password: passwordHash },
      client
    )

    // Assign admin to branch
    await admin.createAdminBranchAssignment.run(
      { adminId: userId, branchId, isPrimary: true },
      client
    )

    await client.query('COMMIT')

    await logAdminAction(
      session.user.id,
      'create',
      'user',
      userId,
      `Administrador creado: ${email} para sucursal ${branchId}`
    )

    revalidatePath('/admin/users')
    return { success: true, userId }
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}
