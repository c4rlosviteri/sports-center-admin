import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getClientDetails, getCurrentBranchContext } from '~/actions/admin'
import { getSession } from '~/actions/auth'
import { AdminHeader } from '~/components/admin-header-simple'
import { ClientDetails } from './client-details'

interface PageProps {
  params: Promise<{ userId: string }>
}

export default async function ClientDetailPage({ params }: PageProps) {
  const session = await getSession()
  const { userId } = await params

  if (!session) {
    redirect('/login')
  }

  const [clientData, branchContext] = await Promise.all([
    getClientDetails(userId),
    getCurrentBranchContext(),
  ])

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-background">
      <AdminHeader
        user={session.user}
        currentBranchId={branchContext.currentBranchId}
        branches={branchContext.branches}
        currentPage="/admin/users"
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Link
            href="/admin/users"
            className="text-gray-400 hover:text-white transition-colors text-sm mb-4 inline-block"
          >
            ← Volver a usuarios
          </Link>
          <h2 className="text-3xl font-bold text-white mb-2">
            {clientData.user.firstName} {clientData.user.lastName}
          </h2>
          <p className="text-gray-400">{clientData.user.email}</p>
        </div>

        <ClientDetails clientData={clientData} />
      </main>
    </div>
  )
}
