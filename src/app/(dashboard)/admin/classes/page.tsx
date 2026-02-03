import { redirect } from 'next/navigation'
import { getCurrentBranchContext } from '~/actions/admin'
import { getSession } from '~/actions/auth'
import { AdminHeader } from '~/components/admin-header-simple'
import { ClassesCalendar } from './classes-calendar'

export default async function AdminClassesPage() {
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
        currentPage="/admin/classes"
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">
            Calendario de Clases
          </h2>
          <p className="text-gray-400">
            Visualiza y administra las clases del estudio
          </p>
        </div>

        <ClassesCalendar />
      </main>
    </div>
  )
}
