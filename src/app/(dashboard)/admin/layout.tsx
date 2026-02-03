import { redirect } from 'next/navigation'
import { getSession } from '~/actions/auth'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()

  // Redirect to login if not authenticated
  if (!session) {
    redirect('/login')
  }

  // Redirect to client if user is not admin or superuser
  if (session.user.role !== 'admin' && session.user.role !== 'superuser') {
    redirect('/client')
  }

  return <>{children}</>
}
