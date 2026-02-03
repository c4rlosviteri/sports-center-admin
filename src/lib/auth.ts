import { betterAuth } from 'better-auth'
import { pool } from './db'
import type { UserRole } from './schemas'

/**
 * Better Auth server configuration
 */
export const auth = betterAuth({
  database: pool,

  // Base URL for callbacks
  baseURL: process.env.BETTER_AUTH_URL || 'http://localhost:3000',

  // Secret for signing tokens
  secret: process.env.BETTER_AUTH_SECRET,

  // User configuration with custom fields
  user: {
    additionalFields: {
      firstName: {
        type: 'string',
        required: false,
        fieldName: 'first_name',
      },
      lastName: {
        type: 'string',
        required: false,
        fieldName: 'last_name',
      },
      dateOfBirth: {
        type: 'string',
        required: false,
        fieldName: 'date_of_birth',
      },
      idNumber: {
        type: 'string',
        required: false,
        fieldName: 'id_number',
      },
      address: {
        type: 'string',
        required: false,
      },
      phone: {
        type: 'string',
        required: false,
      },
      role: {
        type: 'string',
        required: false,
        defaultValue: 'client',
        input: false, // Not settable by user during signup
      },
      branchId: {
        type: 'string',
        required: false,
        fieldName: 'branch_id',
      },
      termsAcceptedAt: {
        type: 'string',
        required: false,
        fieldName: 'terms_accepted_at',
      },
    },
  },

  // Session configuration
  session: {
    expiresIn: 60 * 60 * 24 * 30, // 30 days
    updateAge: 60 * 60 * 24, // Update session every 24 hours
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5, // 5 minutes
    },
  },

  // Email and password authentication
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    maxPasswordLength: 128,

    // Use bcrypt for password hashing to match existing database hashes
    password: {
      hash: async (password: string) => {
        const bcrypt = await import('bcrypt')
        return bcrypt.hash(password, 10)
      },
      verify: async (data: { password: string; hash: string }) => {
        const bcrypt = await import('bcrypt')
        return bcrypt.compare(data.password, data.hash)
      },
    },

    // Password reset configuration
    sendResetPassword: async ({
      user,
      url,
    }: {
      user: { email: string; name?: string | null }
      url: string
      token: string
    }) => {
      const { Resend } = await import('resend')
      const resend = new Resend(process.env.RESEND_API_KEY)

      await resend.emails.send({
        from: 'Biciantro <noreply@biciantro.com>',
        to: user.email,
        subject: 'Restablecer tu contraseña - Biciantro',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <title>Restablecer Contraseña</title>
          </head>
          <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #333;">Biciantro</h1>
              <p style="color: #666;">Indoor Cycling</p>
            </div>

            <h2 style="color: #333;">Hola${user.name ? ` ${user.name}` : ''}!</h2>

            <p style="color: #555; line-height: 1.6;">
              Recibimos una solicitud para restablecer la contraseña de tu cuenta en Biciantro.
            </p>

            <p style="color: #555; line-height: 1.6;">
              Haz clic en el siguiente botón para crear una nueva contraseña:
            </p>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${url}"
                 style="background-color: #000; color: #fff; padding: 14px 28px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">
                Restablecer Contraseña
              </a>
            </div>

            <p style="color: #888; font-size: 14px; line-height: 1.6;">
              Este enlace expirará en 1 hora.
            </p>

            <p style="color: #888; font-size: 14px; line-height: 1.6;">
              Si no solicitaste este cambio, puedes ignorar este correo de forma segura. Tu contraseña no será modificada.
            </p>

            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">

            <p style="color: #999; font-size: 12px; text-align: center;">
              © ${new Date().getFullYear()} Biciantro. Todos los derechos reservados.
            </p>
          </body>
          </html>
        `,
      })
    },
  },

  // OAuth providers
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      mapProfileToUser: (profile: {
        given_name?: string
        family_name?: string
      }) => ({
        firstName: profile.given_name || '',
        lastName: profile.family_name || '',
      }),
    },
    apple: {
      clientId: process.env.APPLE_CLIENT_ID || '',
      clientSecret: process.env.APPLE_CLIENT_SECRET || '',
      mapProfileToUser: (profile) => {
        // Apple returns name as a string
        const nameParts = (profile.name || '').split(' ')
        return {
          firstName: nameParts[0] || '',
          lastName: nameParts.slice(1).join(' ') || '',
        }
      },
    },
  },
})

// Export auth types
export type Session = typeof auth.$Infer.Session
export type User = typeof auth.$Infer.Session.user

/**
 * Check if user has required role
 * Role hierarchy: superuser > admin > client
 */
export function hasRole(
  userRole: UserRole,
  requiredRoles: UserRole | UserRole[]
): boolean {
  const roleHierarchy: Record<UserRole, number> = {
    superuser: 3,
    admin: 2,
    client: 1,
  }

  const roles = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles]
  return roles.some((role) => roleHierarchy[userRole] >= roleHierarchy[role])
}

/**
 * Invite token payload type
 */
export interface InviteTokenPayload {
  branchId: string
  packageId: string
  createdBy: string
  expiresAt: number
}

/**
 * Generate an invite link token with 24h expiration
 * Note: Still using JWT for invite tokens as they're separate from auth
 */
export async function generateInviteToken(
  payload: Omit<InviteTokenPayload, 'expiresAt'>
): Promise<string> {
  const jwt = await import('jsonwebtoken')
  const secret =
    process.env.BETTER_AUTH_SECRET || 'default-secret-change-in-production'
  const expiresAt = Date.now() + 24 * 60 * 60 * 1000 // 24 hours

  return jwt.default.sign(
    {
      ...payload,
      expiresAt,
    },
    secret,
    {
      expiresIn: '24h',
    }
  )
}

/**
 * Verify and decode an invite token
 */
export async function verifyInviteToken(
  token: string
): Promise<InviteTokenPayload | null> {
  try {
    const jwt = await import('jsonwebtoken')
    const secret =
      process.env.BETTER_AUTH_SECRET || 'default-secret-change-in-production'
    const payload = jwt.default.verify(token, secret) as InviteTokenPayload

    if (payload.expiresAt < Date.now()) {
      return null
    }
    return payload
  } catch {
    return null
  }
}

/**
 * Hash a password using bcrypt
 * Used by admin actions to create user accounts with passwords
 */
export async function hashPassword(password: string): Promise<string> {
  const bcrypt = await import('bcryptjs')
  return bcrypt.hash(password, 10)
}
