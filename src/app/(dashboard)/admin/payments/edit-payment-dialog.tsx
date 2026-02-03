'use client'

import { useEffect, useId, useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { updatePayment } from '~/actions/admin'

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

interface EditPaymentDialogProps {
  payment: Payment | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

function formatDateForInput(date: Date): string {
  const d = new Date(date)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function EditPaymentDialog({
  payment,
  open,
  onOpenChange,
  onSuccess,
}: EditPaymentDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    amount: '',
    paymentDate: '',
    notes: '',
  })

  const amountId = useId()
  const paymentDateId = useId()
  const notesId = useId()

  useEffect(() => {
    if (payment) {
      setFormData({
        amount: payment.amount.toString(),
        paymentDate: formatDateForInput(payment.paymentDate),
        notes: payment.notes || '',
      })
    }
  }, [payment])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!payment) return

    setIsSubmitting(true)

    try {
      await updatePayment(payment.id, {
        amount: parseFloat(formData.amount),
        paymentDate: formData.paymentDate,
        notes: formData.notes || undefined,
      })

      onOpenChange(false)
      onSuccess()
    } catch (error) {
      console.error('Error updating payment:', error)
      toast.error(
        error instanceof Error ? error.message : 'Error al actualizar el pago'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-900 border-white/10 text-white sm:max-w-lg">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-white">Editar Pago</DialogTitle>
            <DialogDescription className="text-gray-400">
              {payment && (
                <>
                  Pago de <span className="text-white">{payment.userName}</span>
                </>
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor={amountId} className="text-white">
                Monto ($)
              </Label>
              <Input
                id={amountId}
                type="number"
                step="0.01"
                min="0"
                value={formData.amount}
                onChange={(e) =>
                  setFormData({ ...formData, amount: e.target.value })
                }
                placeholder="50.00"
                required
                className="bg-white/5 border-white/10 text-white"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor={paymentDateId} className="text-white">
                Fecha de Pago
              </Label>
              <Input
                id={paymentDateId}
                type="date"
                value={formData.paymentDate}
                onChange={(e) =>
                  setFormData({ ...formData, paymentDate: e.target.value })
                }
                required
                className="bg-white/5 border-white/10 text-white"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor={notesId} className="text-white">
                Notas (opcional)
              </Label>
              <Input
                id={notesId}
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                placeholder="Pago mensual - Enero 2026"
                className="bg-white/5 border-white/10 text-white"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="bg-white/5 border-white/10 text-white hover:bg-white/5"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
