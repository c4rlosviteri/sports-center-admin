import { redirect } from 'next/navigation'
import { getCurrentBranchContext } from '~/actions/admin'
import { getSession } from '~/actions/auth'
import { AdminPackagesClient } from './admin-packages-client'

export default async function AdminPackagesPage() {
  const session = await getSession()

  if (!session) {
    redirect('/login')
  }

  const branchContext = await getCurrentBranchContext()

  return (
    <AdminPackagesClient branchContext={branchContext} user={session.user} />
  )
}
