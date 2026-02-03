import { redirect } from 'next/navigation'
import { getSession } from '~/actions/auth'
import { ClientHeader } from '~/components/client-header'
import { PaymentsContent } from './payments-content'

export default async function ClientPaymentsPage() {
  const session = await getSession()

  if (!session) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-background">
      <ClientHeader user={session.user} currentPage="/client/payments" />
      <PaymentsContent />
    </div>
  )
}
