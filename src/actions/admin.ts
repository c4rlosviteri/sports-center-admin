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
 * Get all users for the admin's branch
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
 * Get paginated users with optional role filter
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
  const userCheck = await pool.query('SELECT role FROM "user" WHERE id = $1', [
    userId,
  ])
  if (userCheck.rows[0]?.role === 'superuser') {
    throw new Error('No se puede cambiar el rol de un superusuario')
  }

  const client = await pool.connect()
  try {
    await client.query('BEGIN')

    // Update user role
    await client.query(
      'UPDATE "user" SET role = $1, "updatedAt" = CURRENT_TIMESTAMP WHERE id = $2 AND branch_id = $3',
      [newRole, userId, session.user.branchId]
    )

    // Handle branch assignments
    if (newRole === 'admin' && branchIds && branchIds.length > 0) {
      // Remove existing branch assignments
      await client.query(
        'DELETE FROM admin_branch_assignments WHERE admin_id = $1',
        [userId]
      )

      // Add new branch assignments
      for (let i = 0; i < branchIds.length; i++) {
        await client.query(
          `INSERT INTO admin_branch_assignments (admin_id, branch_id, is_primary)
           VALUES ($1, $2, $3)`,
          [userId, branchIds[i], i === 0] // First branch is primary
        )
      }
    } else if (newRole === 'client') {
      // Remove all branch assignments when demoting to client
      await client.query(
        'DELETE FROM admin_branch_assignments WHERE admin_id = $1',
        [userId]
      )
    }

    await client.query('COMMIT')

    await logAdminAction(
      session.user.id,
      'update',
      'user',
      userId,
      `Cambió rol de usuario a ${newRole}`,
      { newRole, previousRole: userCheck.rows[0]?.role, branchIds }
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
  const userCheck = await pool.query('SELECT role FROM "user" WHERE id = $1', [
    userId,
  ])
  if (userCheck.rows[0]?.role === 'superuser') {
    throw new Error('No se puede eliminar un superusuario')
  }

  // Check if user has recorded payments (would prevent deletion due to RESTRICT constraint)
  const paymentsCheck = await pool.query(
    'SELECT COUNT(*) as count FROM payments WHERE recorded_by = $1',
    [userId]
  )
  if (parseInt(paymentsCheck.rows[0].count, 10) > 0) {
    throw new Error(
      'No se puede eliminar este usuario porque ha registrado pagos en el sistema'
    )
  }

  await pool.query('DELETE FROM "user" WHERE id = $1 AND branch_id = $2', [
    userId,
    session.user.branchId,
  ])

  await logAdminAction(
    session.user.id,
    'delete',
    'user',
    userId,
    'Eliminó usuario',
    { deletedRole: userCheck.rows[0]?.role }
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

  const result = await pool.query(
    `INSERT INTO classes (
      branch_id,
      name,
      instructor,
      scheduled_at,
      duration_minutes,
      capacity,
      waitlist_capacity,
      booking_hours_before
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING id, name, instructor, scheduled_at, duration_minutes, capacity, waitlist_capacity, booking_hours_before`,
    [
      session.user.branchId,
      data.name,
      data.instructor,
      data.scheduledAt,
      data.durationMinutes,
      data.capacity,
      data.waitlistCapacity,
      data.bookingHoursBefore ?? null,
    ]
  )

  const classId = result.rows[0].id

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
    id: result.rows[0].id,
    name: result.rows[0].name,
    instructor: result.rows[0].instructor,
    scheduledAt: result.rows[0].scheduled_at,
    durationMinutes: result.rows[0].duration_minutes,
    capacity: result.rows[0].capacity,
    waitlistCapacity: result.rows[0].waitlist_capacity,
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

  await pool.query(
    `UPDATE classes
    SET name = $1,
        instructor = $2,
        scheduled_at = $3,
        duration_minutes = $4,
        capacity = $5,
        waitlist_capacity = $6,
        booking_hours_before = $7,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = $8 AND branch_id = $9`,
    [
      data.name,
      data.instructor,
      data.scheduledAt,
      data.durationMinutes,
      data.capacity,
      data.waitlistCapacity,
      data.bookingHoursBefore ?? null,
      classId,
      session.user.branchId,
    ]
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

  await pool.query('DELETE FROM classes WHERE id = $1 AND branch_id = $2', [
    classId,
    session.user.branchId,
  ])

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
    const existingUser = await client.query(
      'SELECT id FROM "user" WHERE email = $1',
      [email]
    )
    if (existingUser.rows.length > 0) {
      throw new Error('Este correo electrónico ya está registrado')
    }

    const passwordHash = await hashPassword(password)

    const userResult = await client.query(
      `INSERT INTO "user" (email, first_name, last_name, phone, role, branch_id)
       VALUES ($1, $2, $3, $4, 'admin', $5)
       RETURNING id`,
      [email, firstName, lastName, phone, branchId]
    )

    const userId = userResult.rows[0].id

    // Insert password into account table (Better Auth)
    await client.query(
      `INSERT INTO "account" ("userId", "accountId", "providerId", password)
       VALUES ($1, $2, 'credential', $3)`,
      [userId, email, passwordHash]
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
    const result = await pool.query(
      `INSERT INTO payments (
        user_id,
        amount,
        payment_date,
        notes,
        recorded_by
      ) VALUES ($1, $2, $3, $4, $5)
      RETURNING id, user_id, amount, payment_date, notes, recorded_by, created_at`,
      [
        data.userId,
        data.amount,
        data.paymentDate,
        data.notes || null,
        session.user.id,
      ]
    )

    await logAdminAction(
      session.user.id,
      'create',
      'payment',
      result.rows[0].id,
      `Registró pago de $${data.amount} para usuario ${data.userId}`,
      data
    )

    revalidatePath('/admin/payments')
    revalidatePath(`/admin/users/${data.userId}`)
    return result.rows[0]
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
    const paymentCheck = await pool.query(
      `SELECT p.id, p.user_id, u.branch_id
       FROM payments p
       JOIN users u ON p.user_id = u.id
       WHERE p.id = $1 AND u.branch_id = $2`,
      [paymentId, session.user.branchId]
    )

    if (paymentCheck.rows.length === 0) {
      throw new Error('Pago no encontrado')
    }

    await pool.query(
      `UPDATE payments
       SET amount = $1, payment_date = $2, notes = $3, updated_at = CURRENT_TIMESTAMP
       WHERE id = $4`,
      [data.amount, data.paymentDate, data.notes || null, paymentId]
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
    const paymentCheck = await pool.query(
      `SELECT p.id, p.amount, p.user_id, u.branch_id
       FROM payments p
       JOIN users u ON p.user_id = u.id
       WHERE p.id = $1 AND u.branch_id = $2`,
      [paymentId, session.user.branchId]
    )

    if (paymentCheck.rows.length === 0) {
      throw new Error('Pago no encontrado')
    }

    const payment = paymentCheck.rows[0]

    await pool.query('DELETE FROM payments WHERE id = $1', [paymentId])

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
    const accessCheck = await pool.query(
      `SELECT 1 FROM admin_branch_assignments 
       WHERE admin_id = $1 AND branch_id = $2`,
      [session.user.id, branchId]
    )
    if (accessCheck.rows.length === 0) {
      throw new Error('No tienes acceso a esta sucursal')
    }
  }

  // Update user's current branch
  await pool.query(
    `UPDATE "user"
     SET branch_id = $1, "updatedAt" = CURRENT_TIMESTAMP
     WHERE id = $2`,
    [branchId, session.user.id]
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
  const existingUser = await pool.query(
    `SELECT id FROM "user" WHERE email = $1`,
    [email]
  )

  if (existingUser.rows.length > 0) {
    throw new Error('Ya existe un usuario con este correo electrónico')
  }

  const passwordHash = await hashPassword(password)

  const client = await pool.connect()
  try {
    await client.query('BEGIN')

    const result = await client.query(
      `INSERT INTO "user" (email, first_name, last_name, phone, role, branch_id)
       VALUES ($1, $2, $3, $4, 'superuser', $5)
       RETURNING id`,
      [email, firstName, lastName, phone, branchId]
    )

    const userId = result.rows[0].id

    // Insert password into account table (Better Auth)
    await client.query(
      `INSERT INTO "account" ("userId", "accountId", "providerId", password)
       VALUES ($1, $2, 'credential', $3)`,
      [userId, email, passwordHash]
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
  const existingUser = await pool.query(
    `SELECT id FROM "user" WHERE email = $1`,
    [email]
  )

  if (existingUser.rows.length > 0) {
    throw new Error('Ya existe un usuario con este correo electrónico')
  }

  const passwordHash = await hashPassword(password)

  const client = await pool.connect()
  try {
    await client.query('BEGIN')

    // Create admin user
    const userResult = await client.query(
      `INSERT INTO "user" (email, first_name, last_name, phone, role, branch_id)
       VALUES ($1, $2, $3, $4, 'admin', $5)
       RETURNING id`,
      [email, firstName, lastName, phone, branchId]
    )

    const userId = userResult.rows[0].id

    // Insert password into account table (Better Auth)
    await client.query(
      `INSERT INTO "account" ("userId", "accountId", "providerId", password)
       VALUES ($1, $2, 'credential', $3)`,
      [userId, email, passwordHash]
    )

    // Assign admin to branch
    await client.query(
      `INSERT INTO admin_branch_assignments (admin_id, branch_id, is_primary)
       VALUES ($1, $2, true)`,
      [userId, branchId]
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
