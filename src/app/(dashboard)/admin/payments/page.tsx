import { redirect } from 'next/navigation'
import { getCurrentBranchContext } from '~/actions/admin'
import { getSession } from '~/actions/auth'
import { AdminHeader } from '~/components/admin-header-simple'
import { PaymentsPageContent } from './payments-page-content'

export default async function PaymentsPage() {
  const session = await getSession()

  if (!session) {
    redirect('/login')
  }

  const branchContext = await getCurrentBranchContext()

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-background">
      <AdminHeader
        user={session.user}
        currentBranchId={branchContext.currentBranchId}
        branches={branchContext.branches}
        currentPage="/admin/payments"
      />
      <PaymentsPageContent />
    </div>
  )
}
