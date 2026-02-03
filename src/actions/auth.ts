'use server'

import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import * as authQueries from '~/db/queries/auth.queries'
import { auth } from '~/lib/auth'
import { pool } from '~/lib/db'
import { registerSchema, type UserRole } from '~/lib/schemas'

/**
 * Session user type with branch info
 */
export interface SessionUser {
  id: string
  email: string
  name: string | null
  firstName: string | null
  lastName: string | null
  role: UserRole
  branchId: string | null
  branchName: string | null
  dateOfBirth: string | null
  idNumber: string | null
  address: string | null
  phone: string | null
  termsAcceptedAt: string | null
}

/**
 * Get the current session with user data including branch info
 * Uses Better Auth for session validation
 */
export async function getSession(): Promise<{ user: SessionUser } | null> {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) return null

  // Fetch additional user data including branch info
  const result = await authQueries.getUserWithBranch.run(
    { userId: session.user.id },
    pool
  )

  if (result.length === 0) return null

  const user = result[0]

  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      firstName: user.first_name,
      lastName: user.last_name,
      role: user.role,
      branchId: user.branch_id,
      branchName: user.branch_name,
      dateOfBirth: user.date_of_birth?.toISOString() ?? null,
      idNumber: user.id_number,
      address: user.address,
      phone: user.phone,
      termsAcceptedAt: user.terms_accepted_at?.toISOString() ?? null,
    },
  }
}

/**
 * Validate an invite token and return its status
 */
export async function validateInviteToken(token: string): Promise<{
  valid: boolean
  status: 'valid' | 'used' | 'expired' | 'invalid'
  branchName?: string
}> {
  if (!token) {
    return { valid: false, status: 'invalid' }
  }

  const result = await authQueries.getInvitationByCode.run(
    { code: token },
    pool
  )

  if (result.length === 0) {
    return { valid: false, status: 'invalid' }
  }

  const invitation = result[0]

  if (
    !invitation.is_active ||
    (invitation.max_uses &&
      (invitation.usage_count ?? 0) >= invitation.max_uses)
  ) {
    return { valid: false, status: 'used' }
  }

  if (invitation.expires_at && new Date(invitation.expires_at) < new Date()) {
    return { valid: false, status: 'expired' }
  }

  return {
    valid: true,
    status: 'valid',
    branchName: invitation.branch_name,
  }
}

/**
 * Register a new user with invite token validation
 * This action handles the custom invite flow that Better Auth doesn't support natively
 */
export async function registerAction(formData: FormData) {
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    firstName: formData.get('firstName') as string,
    lastName: formData.get('lastName') as string,
    dateOfBirth: formData.get('dateOfBirth') as string,
    idNumber: formData.get('idNumber') as string,
    address: formData.get('address') as string,
    phone: formData.get('phone') as string,
    termsAccepted: formData.get('termsAccepted') === 'on',
    inviteToken: formData.get('inviteToken') as string,
  }

  // Validate input
  const validatedData = registerSchema.parse(data)

  const client = await pool.connect()

  try {
    await client.query('BEGIN')

    // Validate invite token
    const invitationResult = await authQueries.getValidInvitationByCode.run(
      { code: validatedData.inviteToken },
      client
    )

    if (invitationResult.length === 0) {
      throw new Error('El enlace de invitación no es válido o ha expirado')
    }

    const invitation = invitationResult[0]

    // Check if email already exists
    const existingEmail = await authQueries.getUserIdByEmail.run(
      { email: validatedData.email },
      client
    )
    if (existingEmail.length > 0) {
      throw new Error('Este correo electrónico ya está registrado')
    }

    // Check if cédula already exists
    const existingCedula = await authQueries.getUserIdByIdNumber.run(
      { idNumber: validatedData.idNumber },
      client
    )
    if (existingCedula.length > 0) {
      throw new Error('Este número de cédula ya está registrado')
    }

    // Check if phone already exists
    const existingPhone = await authQueries.getUserIdByPhone.run(
      { phone: validatedData.phone },
      client
    )
    if (existingPhone.length > 0) {
      throw new Error('Este número de teléfono ya está registrado')
    }

    if (!validatedData.password) {
      throw new Error('La contraseña es requerida')
    }

    // Hash password using bcrypt
    const bcrypt = await import('bcryptjs')
    const passwordHash = await bcrypt.hash(validatedData.password, 10)

    // Generate user ID
    const userId = crypto.randomUUID()

    // Create user in Better Auth's user table
    await authQueries.insertUserWithInvite.run(
      {
        id: userId,
        email: validatedData.email,
        emailVerified: true,
        name: `${validatedData.firstName} ${validatedData.lastName}`,
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        dateOfBirth: validatedData.dateOfBirth,
        idNumber: validatedData.idNumber,
        address: validatedData.address,
        phone: validatedData.phone,
        role: 'client',
        branchId: invitation.branch_id,
      },
      client
    )

    // Create account entry for credential-based auth
    await authQueries.insertAccountCredential.run(
      {
        id: crypto.randomUUID(),
        userId,
        accountId: validatedData.email,
        password: passwordHash,
      },
      client
    )

    // Mark invite as used
    await authQueries.incrementInvitationUsage.run(
      { code: validatedData.inviteToken },
      client
    )

    await client.query('COMMIT')
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }

  // Return credentials for client-side sign in
  // The client will use authClient.signIn.email() which properly handles session/cookies
  return {
    success: true,
    credentials: {
      email: validatedData.email,
      password: validatedData.password,
    },
  }
}

/**
 * Logout action - clears session
 * Note: Can also use authClient.signOut() on client side
 */
export async function logoutAction() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (session) {
    // Delete session from database
    await authQueries.deleteSessionByUserId.run(
      { userId: session.user.id },
      pool
    )
  }

  // Clear session cookie
  const { cookies } = await import('next/headers')
  const cookieStore = await cookies()
  cookieStore.delete('better-auth.session_token')

  redirect('/login')
}
