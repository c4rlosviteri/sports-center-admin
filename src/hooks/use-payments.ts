import useSWR from 'swr'
import {
  deletePayment,
  getAllPayments,
  getPaymentsByUser,
} from '~/actions/admin'

export function usePayments() {
  return useSWR('payments', getAllPayments)
}

export function useUserPayments(userId: string | null) {
  return useSWR(userId ? ['user-payments', userId] : null, () =>
    getPaymentsByUser(userId!)
  )
}

export function usePaymentMutations(mutate: () => void) {
  const handleDelete = async (paymentId: string) => {
    await deletePayment(paymentId)
    mutate()
  }

  return { handleDelete }
}
