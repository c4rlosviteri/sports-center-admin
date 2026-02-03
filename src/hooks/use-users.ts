import useSWR from 'swr'
import { getAllUsers, getUsersPaginated } from '~/actions/admin'

export function useUsers() {
  return useSWR('users', getAllUsers)
}

export function usePaginatedUsers(
  page: number,
  pageSize: number,
  role: 'superuser' | 'admin' | 'client' | null
) {
  return useSWR(['users-paginated', page, pageSize, role], () =>
    getUsersPaginated({ page, pageSize, role })
  )
}
