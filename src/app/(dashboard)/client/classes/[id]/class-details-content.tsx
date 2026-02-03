'use client'

import { Check, Clock, Users } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useClassBookings } from '~/hooks/use-classes'

export function ClassDetailsContent() {
  const params = useParams()
  const router = useRouter()
  const classId = typeof params.id === 'string' ? params.id : null
  const { data: bookings = [], isLoading } = useClassBookings(classId)

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
                      <div>
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
                      <Clock className="w-5 h-5 text-gray-400" />
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
                      <div>
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
                      <Clock className="w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
