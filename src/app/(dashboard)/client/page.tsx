import { redirect } from 'next/navigation'
import { getSession } from '~/actions/auth'
import { ClientHeader } from '~/components/client-header'
import { ClientDashboardContent } from './client-dashboard-content'

export default async function ClientDashboard() {
  const session = await getSession()

  // Layout handles auth, but redirect as safety measure
  if (!session) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-background">
      <ClientHeader user={session.user} currentPage="/client" />
      <ClientDashboardContent />
    </div>
  )
}
