'use client'

import { Check, Users, X } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { adminRemoveBooking } from '~/actions/bookings'
import { useClassBookings } from '~/hooks/use-classes'

export function ClassDetailContent() {
  const params = useParams()
  const router = useRouter()
  const [removingId, setRemovingId] = useState<string | null>(null)
  const [removeConfirm, setRemoveConfirm] = useState<{
    open: boolean
    bookingId: string
    userName: string
  }>({ open: false, bookingId: '', userName: '' })

  const classId = typeof params.id === 'string' ? params.id : null
  const { data: bookings = [], isLoading, mutate } = useClassBookings(classId)

  const handleRemove = (bookingId: string, userName: string) => {
    setRemoveConfirm({ open: true, bookingId, userName })
  }

  const confirmRemove = async () => {
    setRemovingId(removeConfirm.bookingId)
    try {
      await adminRemoveBooking(removeConfirm.bookingId)
      mutate()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error al eliminar')
    } finally {
      setRemovingId(null)
    }
  }

  const confirmedBookings = useMemo(
    () => bookings.filter((b) => b.status === 'confirmed'),
    [bookings]
  )
  const waitlistedBookings = useMemo(
    () => bookings.filter((b) => b.status === 'waitlisted'),
    [bookings]
  )

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-3xl font-bold text-white">
          Participantes de la Clase
        </h2>
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="text-gray-400 hover:text-white"
        >
          ← Volver
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Check className="w-5 h-5 mr-2 text-success" />
              Confirmados ({confirmedBookings.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-gray-400">Cargando...</p>
            ) : confirmedBookings.length === 0 ? (
              <p className="text-gray-400">No hay reservas confirmadas</p>
            ) : (
              <div className="space-y-3">
                {confirmedBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="p-3 bg-white/5 rounded-lg border border-white/10"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-white font-medium">
                          {booking.userFirstName} {booking.userLastName}
                        </p>
                        <p className="text-gray-400 text-sm">
                          {booking.userEmail}
                        </p>
                        {booking.userPhone && (
                          <p className="text-gray-400 text-sm">
                            {booking.userPhone}
                          </p>
                        )}
                      </div>
                      <Button
                        onClick={() =>
                          handleRemove(
                            booking.id,
                            `${booking.userFirstName} ${booking.userLastName}`
                          )
                        }
                        disabled={removingId === booking.id}
                        variant="destructive"
                        size="sm"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Users className="w-5 h-5 mr-2 text-warning" />
              Lista de Espera ({waitlistedBookings.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-gray-400">Cargando...</p>
            ) : waitlistedBookings.length === 0 ? (
              <p className="text-gray-400">
                No hay personas en lista de espera
              </p>
            ) : (
              <div className="space-y-3">
                {waitlistedBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="p-3 bg-white/5 rounded-lg border border-white/10"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-white font-medium">
                          #{booking.waitlistPosition} - {booking.userFirstName}{' '}
                          {booking.userLastName}
                        </p>
                        <p className="text-gray-400 text-sm">
                          {booking.userEmail}
                        </p>
                        {booking.userPhone && (
                          <p className="text-gray-400 text-sm">
                            {booking.userPhone}
                          </p>
                        )}
                      </div>
                      <Button
                        onClick={() =>
                          handleRemove(
                            booking.id,
                            `${booking.userFirstName} ${booking.userLastName}`
                          )
                        }
                        disabled={removingId === booking.id}
                        variant="destructive"
                        size="sm"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <ConfirmDialog
        open={removeConfirm.open}
        onOpenChange={(open) => setRemoveConfirm((s) => ({ ...s, open }))}
        title="Eliminar de la Clase"
        description={`¿Estás seguro de que deseas eliminar a ${removeConfirm.userName} de esta clase?`}
        confirmText="Eliminar"
        variant="danger"
        onConfirm={confirmRemove}
      />
    </main>
  )
}
