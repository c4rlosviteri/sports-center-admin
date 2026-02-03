'use server'

import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { auth } from '~/lib/auth'
import { pool } from '~/lib/db'
import { registerSchema } from '~/lib/schemas'

/**
 * Session user type with branch info
 */
export interface SessionUser {
  id: string
  email: string
  name: string | null
  firstName: string | null
  lastName: string | null
  role: string
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
  const result = await pool.query(
    `SELECT u.*, b.name as branch_name
     FROM "user" u
     LEFT JOIN branches b ON u.branch_id = b.id
     WHERE u.id = $1`,
    [session.user.id]
  )

  if (result.rows.length === 0) return null

  const user = result.rows[0]

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
      dateOfBirth: user.date_of_birth,
      idNumber: user.id_number,
      address: user.address,
      phone: user.phone,
      termsAcceptedAt: user.terms_accepted_at,
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

  const result = await pool.query(
    `SELECT pi.*, b.name as branch_name
     FROM package_invitations pi
     INNER JOIN branches b ON pi.branch_id = b.id
     WHERE pi.code = $1`,
    [token]
  )

  if (result.rows.length === 0) {
    return { valid: false, status: 'invalid' }
  }

  const invitation = result.rows[0]

  if (
    !invitation.is_active ||
    (invitation.max_uses && invitation.usage_count >= invitation.max_uses)
  ) {
    return { valid: false, status: 'used' }
  }

  if (new Date(invitation.expires_at) < new Date()) {
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
    const invitationResult = await client.query(
      `SELECT pi.*
       FROM package_invitations pi
       WHERE pi.code = $1 AND pi.is_active = true AND (pi.max_uses IS NULL OR pi.usage_count < pi.max_uses) AND pi.expires_at > NOW()`,
      [validatedData.inviteToken]
    )

    if (invitationResult.rows.length === 0) {
      throw new Error('El enlace de invitación no es válido o ha expirado')
    }

    const invitation = invitationResult.rows[0]

    // Check if email already exists
    const existingEmail = await client.query(
      'SELECT id FROM "user" WHERE email = $1',
      [validatedData.email]
    )
    if (existingEmail.rows.length > 0) {
      throw new Error('Este correo electrónico ya está registrado')
    }

    // Check if cédula already exists
    const existingCedula = await client.query(
      'SELECT id FROM "user" WHERE id_number = $1',
      [validatedData.idNumber]
    )
    if (existingCedula.rows.length > 0) {
      throw new Error('Este número de cédula ya está registrado')
    }

    // Check if phone already exists
    const existingPhone = await client.query(
      'SELECT id FROM "user" WHERE phone = $1',
      [validatedData.phone]
    )
    if (existingPhone.rows.length > 0) {
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
    await client.query(
      `INSERT INTO "user" (
        id, email, "emailVerified", name, first_name, last_name,
        date_of_birth, id_number, address, phone, role, branch_id, terms_accepted_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, NOW())`,
      [
        userId,
        validatedData.email,
        true, // Email verified since they have invite link
        `${validatedData.firstName} ${validatedData.lastName}`,
        validatedData.firstName,
        validatedData.lastName,
        validatedData.dateOfBirth,
        validatedData.idNumber,
        validatedData.address,
        validatedData.phone,
        'client',
        invitation.branch_id,
      ]
    )

    // Create account entry for credential-based auth
    await client.query(
      `INSERT INTO "account" (id, "userId", "accountId", "providerId", password)
       VALUES ($1, $2, $3, 'credential', $4)`,
      [crypto.randomUUID(), userId, validatedData.email, passwordHash]
    )

    // Mark invite as used
    await client.query(
      'UPDATE package_invitations SET usage_count = usage_count + 1 WHERE code = $1',
      [validatedData.inviteToken]
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
    await pool.query('DELETE FROM "session" WHERE "userId" = $1', [
      session.user.id,
    ])
  }

  // Clear session cookie
  const { cookies } = await import('next/headers')
  const cookieStore = await cookies()
  cookieStore.delete('better-auth.session_token')

  redirect('/login')
}
