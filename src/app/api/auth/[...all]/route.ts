import { toNextJsHandler } from 'better-auth/next-js'
import { auth } from '~/lib/auth'

/**
 * Better Auth API handler
 * Handles all auth endpoints:
 * - POST /api/auth/sign-in/email - Email login
 * - POST /api/auth/sign-up/email - Email registration
 * - POST /api/auth/sign-out - Logout
 * - GET /api/auth/session - Get current session
 * - POST /api/auth/forgot-password - Request password reset
 * - POST /api/auth/reset-password - Reset password with token
 * - GET /api/auth/callback/google - Google OAuth callback
 * - GET /api/auth/callback/apple - Apple OAuth callback
 */
export const { GET, POST } = toNextJsHandler(auth)
