'use client'

import { Plus } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { usePaymentMutations, usePayments } from '~/hooks/use-payments'
import { useUsers } from '~/hooks/use-users'
import { CreatePaymentDialog } from './create-payment-dialog'
import { EditPaymentDialog } from './edit-payment-dialog'
import { PaymentsTable } from './payments-table'

interface Payment {
  id: string
  userId: string
  amount: number
  paymentDate: Date
  notes: string | null
  createdAt: Date | null
  userName: string
  userEmail: string
  recordedByName: string
}

export function PaymentsPageContent() {
  const {
    data: payments = [],
    isLoading: paymentsLoading,
    mutate: mutatePayments,
  } = usePayments()
  const { handleDelete: handleDeletePayment } =
    usePaymentMutations(mutatePayments)
  const { data: users = [], isLoading: usersLoading } = useUsers()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<{
    open: boolean
    payment: Payment | null
  }>({ open: false, payment: null })

  const isLoading = paymentsLoading || usersLoading

  const handleEdit = (payment: Payment) => {
    setSelectedPayment(payment)
    setEditDialogOpen(true)
  }

  const handleDelete = (payment: Payment) => {
    setDeleteConfirm({ open: true, payment })
  }

  const confirmDeletePayment = async () => {
    if (!deleteConfirm.payment) return
    try {
      await handleDeletePayment(deleteConfirm.payment.id)
    } catch (error) {
      console.error('Error deleting payment:', error)
      toast.error(
        error instanceof Error ? error.message : 'Error al eliminar el pago'
      )
    }
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">
            Gestión de Pagos
          </h2>
          <p className="text-gray-400">Gestiona los registros de pagos</p>
        </div>
        <CreatePaymentDialog
          users={users}
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onSuccess={() => mutatePayments()}
        >
          <Button className="bg-red-600 hover:bg-red-700 text-white gap-2">
            <Plus className="size-4" />
            Registrar Pago
          </Button>
        </CreatePaymentDialog>
      </div>

      {isLoading ? (
        <div className="bg-white/5 border border-white/10 rounded-lg p-8 text-center">
          <p className="text-gray-400">Cargando pagos...</p>
        </div>
      ) : (
        <PaymentsTable
          payments={payments}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      <EditPaymentDialog
        payment={selectedPayment}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSuccess={() => mutatePayments()}
      />

      <ConfirmDialog
        open={deleteConfirm.open}
        onOpenChange={(open) => setDeleteConfirm((s) => ({ ...s, open }))}
        title="Eliminar Pago"
        description={
          deleteConfirm.payment
            ? `¿Estás seguro de eliminar el pago de $${deleteConfirm.payment.amount} de ${deleteConfirm.payment.userName}?`
            : ''
        }
        confirmText="Eliminar"
        variant="danger"
        onConfirm={confirmDeletePayment}
      />
    </main>
  )
}
