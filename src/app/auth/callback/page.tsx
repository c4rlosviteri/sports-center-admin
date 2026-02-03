import { redirect } from 'next/navigation'
import { getSession } from '~/actions/auth'

/**
 * OAuth callback page
 * Handles redirect after Google/Apple OAuth login
 * Redirects user based on their role
 */
export default async function AuthCallbackPage() {
  const session = await getSession()

  if (!session) {
    // If no session, redirect to login
    redirect('/login')
  }

  // For OAuth user accounts without a branch, they may need to complete profile
  // This could redirect to a "complete profile" page if needed
  // For now, we assume OAuth user accounts already exist in the system

  // Redirect based on role
  if (session.user.role === 'client') {
    redirect('/client')
  } else {
    redirect('/admin')
  }
}
