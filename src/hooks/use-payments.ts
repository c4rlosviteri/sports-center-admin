import useSWR, { type KeyedMutator } from 'swr'
import {
  deletePayment,
  getAllPayments,
  getPaymentsByUser,
} from '~/actions/admin'

type PaymentsData = Awaited<ReturnType<typeof getAllPayments>>
type UserPaymentsData = Awaited<ReturnType<typeof getPaymentsByUser>>

export function usePayments() {
  return useSWR<PaymentsData>('payments', getAllPayments)
}

export function useUserPayments(userId: string | null) {
  return useSWR<UserPaymentsData>(
    userId ? ['user-payments', userId] : null,
    () => {
      if (!userId) {
        throw new Error('User ID is required to fetch payments')
      }
      return getPaymentsByUser(userId)
    }
  )
}

export function usePaymentMutations(mutate: KeyedMutator<PaymentsData>) {
  const handleDelete = async (paymentId: string) => {
    const optimistic = (current?: PaymentsData) => {
      if (!current) return []
      return current.filter((payment) => payment.id !== paymentId)
    }

    return mutate(
      async (current) => {
        await deletePayment(paymentId)
        return optimistic(current)
      },
      {
        optimisticData: (current) => optimistic(current),
        rollbackOnError: true,
        populateCache: true,
        revalidate: true,
        throwOnError: true,
      }
    )
  }

  return { handleDelete }
}
