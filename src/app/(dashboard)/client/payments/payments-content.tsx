'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useUserPayments } from '~/hooks/use-payments'
import { useSession } from '~/hooks/use-session'
import { formatDateDDMMYYYY } from '~/lib/date-utils'

export function PaymentsContent() {
  const { data: session } = useSession()
  const { data: payments = [], isLoading } = useUserPayments(
    session?.user?.id ?? null
  )

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-EC', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  const totalPaid = payments.reduce((sum, payment) => sum + payment.amount, 0)

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-white mb-2">Mis Pagos</h1>
        <p className="text-gray-400">Historial de pagos realizados</p>
      </div>

      {/* Summary Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardDescription className="text-gray-400">
              Total Pagado
            </CardDescription>
            <CardTitle className="text-3xl text-white">
              {formatCurrency(totalPaid)}
            </CardTitle>
          </CardHeader>
        </Card>

        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardDescription className="text-gray-400">
              Número de Pagos
            </CardDescription>
            <CardTitle className="text-3xl text-white">
              {payments.length}
            </CardTitle>
          </CardHeader>
        </Card>

        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardDescription className="text-gray-400">
              Último Pago
            </CardDescription>
            <CardTitle className="text-2xl text-white">
              {payments.length > 0
                ? formatDateDDMMYYYY(payments[0].paymentDate)
                : 'N/A'}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Payments List */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Historial de Pagos</CardTitle>
          <CardDescription className="text-gray-400">
            Todos tus pagos registrados
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-gray-400">
              Cargando pagos...
            </div>
          ) : payments.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              No hay pagos registrados
            </div>
          ) : (
            <div className="space-y-4">
              {payments.map((payment) => (
                <div
                  key={payment.id}
                  className="bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-white/5 transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl font-bold text-white">
                          {formatCurrency(payment.amount)}
                        </span>
                        <span className="text-sm text-gray-400">
                          {formatDateDDMMYYYY(payment.paymentDate)}
                        </span>
                      </div>
                      {payment.notes && (
                        <p className="text-gray-400 text-sm mb-2">
                          {payment.notes}
                        </p>
                      )}
                      <div className="flex items-center gap-4 text-xs text-gray-400">
                        <span>Registrado por: {payment.recordedByName}</span>
                        {payment.createdAt && (
                          <span>
                            Fecha de registro:{' '}
                            {formatDateDDMMYYYY(payment.createdAt)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  )
}
