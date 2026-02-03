import { redirect } from 'next/navigation'
import { getSession } from '~/actions/auth'

export default async function HomePage() {
  const session = await getSession()

  if (session) {
    redirect(session.user.role === 'client' ? '/client' : '/admin')
  } else {
    redirect('/login')
  }
}
