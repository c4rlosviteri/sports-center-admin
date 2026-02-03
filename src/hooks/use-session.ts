import useSWR from 'swr'
import { getSession } from '~/actions/auth'

type SessionData = Awaited<ReturnType<typeof getSession>>

export function useSession() {
  return useSWR<SessionData>('session', getSession)
}
