'use client'

import { Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatDateDDMMYYYY } from '~/lib/date-utils'

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

interface PaymentsTableProps {
  payments: Payment[]
  onEdit: (payment: Payment) => void
  onDelete: (payment: Payment) => void
}

export function PaymentsTable({
  payments,
  onEdit,
  onDelete,
}: PaymentsTableProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-EC', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  return (
    <div className="bg-white/5 border border-white/10 rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent border-white/10">
            <TableHead className="text-gray-400">Fecha de Pago</TableHead>
            <TableHead className="text-gray-400">Cliente</TableHead>
            <TableHead className="text-gray-400">Monto</TableHead>
            <TableHead className="text-gray-400">Notas</TableHead>
            <TableHead className="text-gray-400">Registrado por</TableHead>
            <TableHead className="text-gray-400 text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payments.length === 0 ? (
            <TableRow className="border-white/10">
              <TableCell colSpan={6} className="text-center text-gray-400 py-8">
                No hay pagos registrados
              </TableCell>
            </TableRow>
          ) : (
            payments.map((payment) => (
              <TableRow
                key={payment.id}
                className="border-white/10 hover:bg-white/5"
              >
                <TableCell className="text-gray-400">
                  {formatDateDDMMYYYY(payment.paymentDate)}
                </TableCell>
                <TableCell className="text-white">
                  <div>{payment.userName}</div>
                  <div className="text-sm text-gray-400">
                    {payment.userEmail}
                  </div>
                </TableCell>
                <TableCell className="text-white font-semibold">
                  {formatCurrency(payment.amount)}
                </TableCell>
                <TableCell className="text-gray-400 max-w-xs truncate">
                  {payment.notes || '-'}
                </TableCell>
                <TableCell className="text-gray-400 text-sm">
                  {payment.recordedByName}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(payment)}
                      className="text-gray-400 hover:text-white hover:bg-white/5"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(payment)}
                      className="text-muted-foreground hover:text-primary hover:bg-primary/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
