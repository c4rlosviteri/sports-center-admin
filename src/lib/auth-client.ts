import { createAuthClient } from 'better-auth/react'

/**
 * Better Auth client for React components
 */
export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL || 'http://localhost:3000',
})

// Export commonly used functions
export const { signIn, signUp, signOut, useSession } = authClient

// Password reset methods - cast to any to bypass type issues
// Better Auth types don't include these methods but they exist at runtime
const client = authClient as Record<string, unknown>

export const forgetPassword = client.forgetPassword as (options: {
  email: string
  redirectTo?: string
}) => Promise<{ error?: { message: string } }>

export const resetPassword = client.resetPassword as (options: {
  newPassword: string
  token?: string
}) => Promise<{ error?: { message: string } }>
