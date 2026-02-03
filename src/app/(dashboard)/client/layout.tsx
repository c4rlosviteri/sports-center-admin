import { redirect } from 'next/navigation'
import { getSession } from '~/actions/auth'

export default async function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()

  // Redirect to login if not authenticated
  if (!session) {
    redirect('/login')
  }

  // Redirect to admin if user is not a client
  if (session.user.role !== 'client') {
    redirect('/admin')
  }

  return <>{children}</>
}
