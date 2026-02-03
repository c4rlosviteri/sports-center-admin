'use client'

import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { getClientDetails } from '~/actions/admin'
import { formatDateDDMMYYYY } from '~/lib/date-utils'

interface ClientDetailsProps {
  clientData: Awaited<ReturnType<typeof getClientDetails>>
}

export function ClientDetails({ clientData }: ClientDetailsProps) {
  const getStatusBadge = (status: string) => {
    if (status === 'confirmed')
      return <Badge className="bg-green-600">Confirmado</Badge>
    if (status === 'waitlisted')
      return <Badge className="bg-yellow-600">En Espera</Badge>
    if (status === 'cancelled')
      return <Badge className="bg-muted">Cancelado</Badge>
    return <Badge>{status}</Badge>
  }

  return (
    <div className="space-y-6">
      {/* User Info */}
      <div className="bg-white/5 border border-white/10 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-white mb-4">
          Información Personal
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-400">Teléfono</p>
            <p className="text-white">{clientData.user.phone || '-'}</p>
          </div>
          <div>
            <p className="text-gray-400">Cédula</p>
            <p className="text-white">{clientData.user.idNumber || '-'}</p>
          </div>
          <div>
            <p className="text-gray-400">Dirección</p>
            <p className="text-white">{clientData.user.address || '-'}</p>
          </div>
          <div>
            <p className="text-gray-400">Fecha de Registro</p>
            <p className="text-white">
              {formatDateDDMMYYYY(clientData.user.createdAt)}
            </p>
          </div>
        </div>
      </div>

      {/* Bookings */}
      <div className="bg-white/5 border border-white/10 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-white mb-4">
          Historial de Reservas
        </h3>
        {clientData.bookings.length === 0 ? (
          <p className="text-gray-400 text-center py-8">
            Este cliente no tiene reservas registradas
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-white/10">
                <TableHead className="text-gray-400">Clase</TableHead>
                <TableHead className="text-gray-400">Instructor</TableHead>
                <TableHead className="text-gray-400">Fecha</TableHead>
                <TableHead className="text-gray-400">Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clientData.bookings.map((booking) => (
                <TableRow
                  key={booking.id}
                  className="border-white/10 hover:bg-white/5"
                >
                  <TableCell className="text-white font-medium">
                    {booking.className}
                  </TableCell>
                  <TableCell className="text-gray-400">
                    {booking.instructorName}
                  </TableCell>
                  <TableCell className="text-gray-400">
                    {new Date(booking.scheduledAt).toLocaleString('es-EC', {
                      dateStyle: 'short',
                      timeStyle: 'short',
                    })}
                  </TableCell>
                  <TableCell>{getStatusBadge(booking.status)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  )
}
