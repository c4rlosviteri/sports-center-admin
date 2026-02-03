'use client'

import { AdminHeader } from '~/components/admin-header-simple'
import { usePackages } from '~/hooks/use-packages'
import { CreatePackageDialog } from './create-package-dialog'
import { PackagesTable } from './packages-table'

interface Branch {
  id: string
  name: string
}

interface BranchContext {
  currentBranchId: string | null
  branches: Branch[]
}

interface User {
  id: string
  email: string
  name?: string | null
  firstName?: string | null
  lastName?: string | null
  role: string
  branchId?: string | null
  branchName?: string | null
  dateOfBirth?: string | null
  idNumber?: string | null
  address?: string | null
  phone?: string | null
  termsAcceptedAt?: string | null
}

interface AdminPackagesClientProps {
  branchContext: BranchContext
  user: User
}

export function AdminPackagesClient({
  branchContext,
  user,
}: AdminPackagesClientProps) {
  const { mutate } = usePackages()

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-background">
      <AdminHeader
        user={user}
        currentBranchId={branchContext.currentBranchId || ''}
        branches={branchContext.branches}
        currentPage="/admin/packages"
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">
              Paquetes de Clases
            </h2>
            <p className="text-gray-400">
              Administra los paquetes flexibles de clases
            </p>
          </div>
          <CreatePackageDialog onSuccess={mutate} />
        </div>

        <PackagesTable />
      </main>
    </div>
  )
}
