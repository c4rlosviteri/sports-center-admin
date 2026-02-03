import { redirect } from 'next/navigation'
import { getCurrentBranchContext } from '~/actions/admin'
import { getSession } from '~/actions/auth'
import { getAdminBranches } from '~/actions/branches'
import { AdminHeader } from '~/components/admin-header-simple'
import { CreateUserDialog } from './create-user-dialog'
import { UsersTable } from './users-table'

export default async function AdminUsersPage() {
  const session = await getSession()

  if (!session) {
    redirect('/login')
  }

  const [branches, branchContext] = await Promise.all([
    getAdminBranches(),
    getCurrentBranchContext(),
  ])

  const isSuperuser = session.user.role === 'superuser'

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-background">
      <AdminHeader
        user={session.user}
        currentBranchId={branchContext.currentBranchId}
        branches={branchContext.branches}
        currentPage="/admin/users"
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">
              Gestión de Usuarios
            </h2>
            <p className="text-gray-400">
              Administra los usuarios de tu sucursal
            </p>
          </div>
          {isSuperuser && <CreateUserDialog branches={branches} />}
        </div>

        <UsersTable branches={branches} />
      </main>
    </div>
  )
}
