import useSWR from 'swr'
import { getUserActivePackage, getUserBookings } from '~/actions/dashboard'
import { useSession } from '~/hooks/use-session'

type UserPackageData = Awaited<ReturnType<typeof getUserActivePackage>>
type UserBookingsData = Awaited<ReturnType<typeof getUserBookings>>

export function usePackage() {
  const { data: session } = useSession()
  const userId = session?.user.id
  return useSWR<UserPackageData>(
    userId ? ['package', userId] : null,
    getUserActivePackage
  )
}

export function useBookings() {
  const { data: session } = useSession()
  const userId = session?.user.id
  return useSWR<UserBookingsData>(
    userId ? ['bookings', userId] : null,
    getUserBookings
  )
}
