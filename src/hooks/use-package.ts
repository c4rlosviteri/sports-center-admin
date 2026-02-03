import useSWR from 'swr'
import { getUserActivePackage, getUserBookings } from '~/actions/dashboard'

export function usePackage() {
  return useSWR('package', getUserActivePackage)
}

export function useBookings() {
  return useSWR('bookings', getUserBookings)
}
