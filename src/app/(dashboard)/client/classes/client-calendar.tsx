'use client'

import { AlertCircle, Check, Clock, User, Users, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'
import { Calendar } from '@/components/calendar'
import { FeedbackDialog, type FeedbackType } from '@/components/feedback-dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  cancelBooking,
  claimSpotFromWaitlist,
  createBooking,
} from '~/actions/classes'
import { useClientClasses } from '~/hooks/use-classes'
import { usePackage } from '~/hooks/use-package'

export function ClientCalendar() {
  const router = useRouter()
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [bookingInProgress, setBookingInProgress] = useState<string | null>(
    null
  )
  const [cancellingId, setCancellingId] = useState<string | null>(null)
  const [claimingId, setClaimingId] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<{
    open: boolean
    type: FeedbackType
    title: string
    message: string
    onConfirm?: () => void
  } | null>(null)
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean
    bookingId: string
  } | null>(null)

  const {
    data: classes = [],
    isLoading,
    mutate: mutateClasses,
  } = useClientClasses(selectedDate.getFullYear(), selectedDate.getMonth() + 1)
  const { data: pkg } = usePackage()

  const selectedDateClasses = useMemo(() => {
    return classes.filter((cls) => {
      const clsDate = new Date(cls.scheduledAt)
      return (
        clsDate.getDate() === selectedDate.getDate() &&
        clsDate.getMonth() === selectedDate.getMonth() &&
        clsDate.getFullYear() === selectedDate.getFullYear()
      )
    })
  }, [classes, selectedDate])

  const classesDataForCalendar = useMemo(() => {
    return classes.reduce(
      (acc, cls) => {
        const date = new Date(cls.scheduledAt)
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const day = String(date.getDate()).padStart(2, '0')
        const key = `${year}-${month}-${day}`
        acc[key] = (acc[key] || 0) + 1
        return acc
      },
      {} as Record<string, number>
    )
  }, [classes])

  const handleBook = async (classId: string) => {
    if (bookingInProgress) return

    setBookingInProgress(classId)
    try {
      await createBooking(classId)
      mutateClasses()
      setFeedback({
        open: true,
        type: 'success',
        title: '¡Reserva exitosa!',
        message: 'Tu clase ha sido reservada correctamente.',
      })
    } catch (err) {
      setFeedback({
        open: true,
        type: 'error',
        title: 'Error al reservar',
        message: err instanceof Error ? err.message : 'Error al reservar',
      })
    } finally {
      setBookingInProgress(null)
    }
  }

  const handleCancelConfirm = (bookingId: string) => {
    setConfirmDialog({
      open: true,
      bookingId,
    })
  }

  const handleCancel = async () => {
    if (!confirmDialog) return

    const bookingId = confirmDialog.bookingId
    setConfirmDialog(null)
    setCancellingId(bookingId)
    try {
      await cancelBooking(bookingId)
      mutateClasses()
      setFeedback({
        open: true,
        type: 'success',
        title: 'Reserva cancelada',
        message: 'Tu reserva ha sido cancelada exitosamente.',
      })
    } catch (err) {
      setFeedback({
        open: true,
        type: 'error',
        title: 'Error al cancelar',
        message: err instanceof Error ? err.message : 'Error al cancelar',
      })
    } finally {
      setCancellingId(null)
    }
  }

  const handleClaimSpot = async (bookingId: string) => {
    if (claimingId) return

    setClaimingId(bookingId)
    try {
      await claimSpotFromWaitlist(bookingId)
      mutateClasses()
      setFeedback({
        open: true,
        type: 'success',
        title: '¡Lugar confirmado!',
        message: 'Has reclamado tu lugar en la clase exitosamente.',
      })
    } catch (err) {
      setFeedback({
        open: true,
        type: 'error',
        title: 'Error al reclamar lugar',
        message: err instanceof Error ? err.message : 'Error al reclamar lugar',
      })
    } finally {
      setClaimingId(null)
    }
  }

  const canCancelBooking = (scheduledAt: string) => {
    const classTime = new Date(scheduledAt)
    const now = new Date()
    const hoursUntilClass =
      (classTime.getTime() - now.getTime()) / (1000 * 60 * 60)
    return hoursUntilClass >= 2
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('es-EC', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-EC', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const hasNoClassesRemaining =
    pkg?.classesRemaining !== null &&
    pkg?.classesRemaining !== undefined &&
    pkg?.classesRemaining <= 0

  return (
    <div className="space-y-6">
      {/* Package Status */}
      {pkg && (
        <Card
          className={`border-border ${hasNoClassesRemaining ? 'bg-primary/10 border-primary/30' : 'bg-card/50'}`}
        >
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">
                  {pkg.packageName || 'Paquete Activo'}
                </h3>
                <p className="text-gray-400 text-sm">
                  {pkg.classesRemaining !== null &&
                  pkg.classesRemaining !== undefined
                    ? `${pkg.classesRemaining} ${pkg.classesRemaining === 1 ? 'clase restante' : 'clases restantes'}`
                    : 'Clases ilimitadas'}
                </p>
              </div>
              {hasNoClassesRemaining && (
                <div className="flex items-center gap-2 text-primary">
                  <AlertCircle className="w-5 h-5" />
                  <span className="text-sm font-medium">
                    Sin clases disponibles
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Calendar Section */}
        <Card className="bg-white/5 border-white/10">
          <CardContent className="pt-6">
            <Calendar
              selectedDate={selectedDate}
              onDateSelect={setSelectedDate}
              classesData={classesDataForCalendar}
            />
          </CardContent>
        </Card>

        {/* Selected Date Classes */}
        <div>
          <h3 className="text-2xl font-bold text-white mb-4">
            Clases para {formatDate(selectedDate)}
          </h3>

          {isLoading ? (
            <div className="text-center text-gray-400 py-8">
              Cargando clases...
            </div>
          ) : selectedDateClasses.length === 0 ? (
            <Card className="bg-white/5 border-white/10">
              <CardContent className="pt-6">
                <div className="text-center text-gray-400 py-8">
                  No hay clases programadas para esta fecha
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {selectedDateClasses.map((classItem) => {
                const spotsAvailable =
                  classItem.maxCapacity - classItem.confirmedCount
                const userHasBooking = classItem.userBookingStatus
                const isConfirmed = userHasBooking === 'confirmed'
                const isWaitlisted = userHasBooking === 'waitlisted'
                const classTime = new Date(classItem.scheduledAt)
                const now = new Date()
                const isPast = classTime.getTime() < now.getTime()

                return (
                  <Card
                    key={classItem.id}
                    className={`bg-white/5 border-white/10 ${
                      isConfirmed ? 'ring-2 ring-success/50' : ''
                    } ${isPast ? 'opacity-60' : ''}`}
                  >
                    <CardContent className="pt-6">
                      {/* Header: Title + Status Badge */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <h4 className="text-xl font-bold text-white">
                            {classItem.className}
                          </h4>
                          {isConfirmed && (
                            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                              <Check className="w-3 h-3 mr-1" />
                              Reservado
                            </Badge>
                          )}
                          {isWaitlisted && (
                            <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                              Lista de espera
                            </Badge>
                          )}
                          {isPast && (
                            <Badge className="bg-muted/30 text-gray-400 border-gray-500/30">
                              Finalizada
                            </Badge>
                          )}
                        </div>
                        {/* Availability */}
                        {spotsAvailable > 0 ? (
                          <span className="text-sm text-green-400 font-medium">
                            {spotsAvailable}{' '}
                            {spotsAvailable === 1
                              ? 'lugar disponible'
                              : 'lugares disponibles'}
                          </span>
                        ) : classItem.waitlistCount > 0 ? (
                          <span className="text-sm text-yellow-400 font-medium">
                            Lista de espera ({classItem.waitlistCount}/
                            {classItem.waitlistCapacity})
                          </span>
                        ) : (
                          <span className="text-sm text-red-400 font-medium">
                            Clase llena
                          </span>
                        )}
                      </div>

                      {/* Info Row */}
                      <div className="flex items-center gap-6 text-sm text-gray-400 mb-4">
                        <div className="flex items-center">
                          <User className="w-4 h-4 mr-2 text-gray-400" />
                          <span>{classItem.instructorName}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-2 text-gray-400" />
                          <span>
                            {formatTime(classItem.scheduledAt)} ·{' '}
                            {classItem.durationMinutes} min
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-red-500/50 text-red-400 hover:bg-red-500/10 hover:border-red-600"
                          onClick={() =>
                            router.push(`/client/classes/${classItem.id}`)
                          }
                        >
                          <Users className="w-4 h-4 mr-1" />
                          Ver participantes
                        </Button>

                        {!isPast &&
                          (isConfirmed ? (
                            <Button
                              onClick={() => {
                                if (!canCancelBooking(classItem.scheduledAt)) {
                                  setFeedback({
                                    open: true,
                                    type: 'warning',
                                    title: 'No se puede cancelar',
                                    message:
                                      'No puedes cancelar la reserva menos de 2 horas antes de la clase.',
                                  })
                                  return
                                }
                                if (classItem.userBookingId) {
                                  handleCancelConfirm(classItem.userBookingId)
                                }
                              }}
                              disabled={
                                cancellingId === classItem.userBookingId ||
                                !classItem.userBookingId
                              }
                              variant="outline"
                              size="sm"
                              className="border-primary/50 text-primary hover:bg-primary/10"
                            >
                              <X className="w-4 h-4 mr-1" />
                              {cancellingId === classItem.userBookingId
                                ? 'Cancelando...'
                                : 'Cancelar'}
                            </Button>
                          ) : isWaitlisted ? (
                            spotsAvailable > 0 ? (
                              <Button
                                onClick={() =>
                                  classItem.userBookingId &&
                                  handleClaimSpot(classItem.userBookingId)
                                }
                                disabled={
                                  claimingId === classItem.userBookingId ||
                                  !classItem.userBookingId
                                }
                                size="sm"
                                className="bg-green-600 hover:bg-green-600/90 text-white animate-pulse"
                              >
                                <Check className="w-4 h-4 mr-1" />
                                {claimingId === classItem.userBookingId
                                  ? 'Confirmando...'
                                  : '¡Reclamar lugar!'}
                              </Button>
                            ) : (
                              <Button
                                disabled
                                variant="outline"
                                size="sm"
                                className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 cursor-not-allowed"
                              >
                                En lista de espera
                              </Button>
                            )
                          ) : (
                            <Button
                              onClick={() => handleBook(classItem.id)}
                              disabled={
                                hasNoClassesRemaining ||
                                (spotsAvailable === 0 &&
                                  classItem.waitlistCount >= 3) ||
                                bookingInProgress === classItem.id
                              }
                              size="sm"
                              className={
                                hasNoClassesRemaining
                                  ? 'bg-muted/60 hover:bg-muted/60 text-gray-400 cursor-not-allowed'
                                  : 'bg-red-600 hover:bg-red-700 text-white'
                              }
                              title={
                                hasNoClassesRemaining
                                  ? 'No tienes clases disponibles en tu paquete'
                                  : undefined
                              }
                            >
                              {hasNoClassesRemaining
                                ? 'Sin clases disponibles'
                                : bookingInProgress === classItem.id
                                  ? 'Reservando...'
                                  : spotsAvailable > 0
                                    ? 'Reservar'
                                    : classItem.waitlistCount <
                                        classItem.waitlistCapacity
                                      ? 'Lista de espera'
                                      : 'Clase llena'}
                            </Button>
                          ))}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Feedback Dialog */}
      <FeedbackDialog
        open={feedback?.open || false}
        onOpenChange={(open) => !open && setFeedback(null)}
        type={feedback?.type || 'info'}
        title={feedback?.title || ''}
        message={feedback?.message || ''}
        onConfirm={feedback?.onConfirm}
      />

      {/* Confirmation Dialog for Cancellation */}
      <FeedbackDialog
        open={confirmDialog?.open || false}
        onOpenChange={(open) => !open && setConfirmDialog(null)}
        type="warning"
        title="¿Cancelar reserva?"
        message="¿Estás seguro de que deseas cancelar esta reserva?"
        confirmText="Sí, cancelar"
        onConfirm={handleCancel}
      />
    </div>
  )
}
