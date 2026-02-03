import useSWR from 'swr'
import { getSession } from '~/actions/auth'

export function useSession() {
  return useSWR('session', getSession)
}
