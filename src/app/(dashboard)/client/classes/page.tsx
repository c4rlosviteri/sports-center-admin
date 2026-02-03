import { redirect } from 'next/navigation'
import { getSession } from '~/actions/auth'
import { ClientHeader } from '~/components/client-header'
import { ClassesContent } from './classes-content'

export default async function ClassSchedule() {
  const session = await getSession()

  if (!session) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-background">
      <ClientHeader user={session.user} currentPage="/client/classes" />
      <ClassesContent />
    </div>
  )
}
