import useSWR from 'swr'
import { getClassesByMonth as getAdminClassesByMonth } from '~/actions/admin'
import { getClassBookings } from '~/actions/bookings'
import { getClassesByMonth as getClientClassesByMonth } from '~/actions/classes'

export function useAdminClasses(year: number, month: number) {
  return useSWR(['admin-classes', year, month], () =>
    getAdminClassesByMonth(year, month)
  )
}

export function useClientClasses(year: number, month: number) {
  return useSWR(['client-classes', year, month], () =>
    getClientClassesByMonth(year, month)
  )
}

export function useClassBookings(classId: string | null) {
  return useSWR(classId ? ['class-bookings', classId] : null, () => {
    if (!classId) {
      throw new Error('Class ID is required to fetch bookings')
    }
    return getClassBookings(classId)
  })
}
