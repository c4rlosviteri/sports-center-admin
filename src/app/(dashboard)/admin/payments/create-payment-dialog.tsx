'use client'

import { useId, useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { createPayment } from '~/actions/admin'
import { getTodayDateString } from '~/lib/date-utils'

interface User {
  id: string
  email: string
  firstName?: string | null
  lastName?: string | null
}

interface CreatePaymentDialogProps {
  users: User[]
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
  children?: React.ReactNode
}

export function CreatePaymentDialog({
  users,
  open,
  onOpenChange,
  onSuccess,
  children,
}: CreatePaymentDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    userId: '',
    amount: '',
    paymentDate: getTodayDateString(),
    notes: '',
  })

  const amountId = useId()
  const paymentDateId = useId()
  const notesId = useId()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await createPayment({
        userId: formData.userId,
        amount: parseFloat(formData.amount),
        paymentDate: formData.paymentDate,
        notes: formData.notes || undefined,
      })

      setFormData({
        userId: '',
        amount: '',
        paymentDate: getTodayDateString(),
        notes: '',
      })
      onOpenChange(false)
      onSuccess()
    } catch (error) {
      console.error('Error creating payment:', error)
      toast.error(
        error instanceof Error ? error.message : 'Error al registrar el pago'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      <DialogContent className="bg-gray-900 border-white/10 text-white sm:max-w-lg">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-white">Registrar Pago</DialogTitle>
            <DialogDescription className="text-gray-400">
              Registra un pago realizado por un cliente
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="user" className="text-white">
                Cliente
              </Label>
              <Select
                value={formData.userId}
                onValueChange={(value) =>
                  setFormData({ ...formData, userId: value })
                }
                required
              >
                <SelectTrigger className="bg-white/5 border-white/10 text-white">
                  <SelectValue placeholder="Selecciona un cliente" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-white/10">
                  {users.map((user) => (
                    <SelectItem
                      key={user.id}
                      value={user.id}
                      className="text-white"
                    >
                      {user.firstName} {user.lastName} - {user.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

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
              {isSubmitting ? 'Registrando...' : 'Registrar Pago'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
