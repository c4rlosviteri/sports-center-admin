'use client'

import {
  ArrowRight,
  Calendar,
  ChevronRight,
  Clock,
  Dumbbell,
  Flame,
  Sparkles,
  TrendingUp,
  X,
  Zap,
} from 'lucide-react'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { Skeleton } from '@/components/ui/skeleton'
import { cancelBooking } from '~/actions/classes'
import { useBookings, usePackage } from '~/hooks/use-package'
import { useSession } from '~/hooks/use-session'

export function ClientDashboardContent() {
  const { data: session } = useSession()
  const userName = session?.user?.firstName ?? 'Cliente'
  const { data: pkg, isLoading: packageLoading } = usePackage()
  const {
    data: bookings = [],
    mutate: mutateBookings,
    isLoading: bookingsLoading,
  } = useBookings()
  const [cancellingId, setCancellingId] = useState<string | null>(null)
  const [cancelConfirm, setCancelConfirm] = useState<{
    open: boolean
    bookingId: string
  }>({ open: false, bookingId: '' })

  const { upcomingBookings, pastBookings } = useMemo(() => {
    const now = Date.now()
    const upcoming = bookings.filter((b) => {
      if (!b.scheduledAt) return false
      const classTime = new Date(b.scheduledAt).getTime()
      return classTime >= now && b.status !== 'cancelled'
    })
    const past = bookings.filter((b) => {
      if (!b.scheduledAt) return true
      const classTime = new Date(b.scheduledAt).getTime()
      return classTime < now || b.status === 'cancelled'
    })
    return { upcomingBookings: upcoming, pastBookings: past }
  }, [bookings])

  const handleCancelBooking = (bookingId: string) => {
    setCancelConfirm({ open: true, bookingId })
  }

  const confirmCancelBooking = async () => {
    setCancellingId(cancelConfirm.bookingId)
    try {
      await cancelBooking(cancelConfirm.bookingId)
      mutateBookings()
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'Error al cancelar reserva'
      )
    } finally {
      setCancellingId(null)
    }
  }

  const canCancelBooking = (scheduledAt: string | null) => {
    if (!scheduledAt) return false
    const classTime = new Date(scheduledAt).getTime()
    const now = Date.now()
    const hoursUntilClass = (classTime - now) / (1000 * 60 * 60)
    return hoursUntilClass >= 2
  }

  const nextBooking = upcomingBookings[0]
  const todayClasses = upcomingBookings.filter((b) => {
    if (!b.scheduledAt) return false
    const classDate = new Date(b.scheduledAt)
    const today = new Date()
    return (
      classDate.getDate() === today.getDate() &&
      classDate.getMonth() === today.getMonth() &&
      classDate.getFullYear() === today.getFullYear()
    )
  }).length

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Header with Today's Highlight */}
      <div className="mb-8 animate-fade-in">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
          <div>
            <p className="text-red-400 font-medium mb-1 flex items-center gap-2">
              <Sparkles className="size-4" />
              {new Date().toLocaleDateString('es-EC', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
              })}
            </p>
            <h1 className="text-4xl font-bold text-white">Hola, {userName}</h1>
            <p className="text-gray-400 mt-1">
              {todayClasses > 0
                ? `Tienes ${todayClasses} clase${todayClasses > 1 ? 's' : ''} programada${todayClasses > 1 ? 's' : ''} para hoy`
                : upcomingBookings.length > 0
                  ? `Tienes ${upcomingBookings.length} clase${upcomingBookings.length > 1 ? 's' : ''} reservada${upcomingBookings.length > 1 ? 's' : ''}`
                  : 'No tienes clases reservadas'}
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/client/classes"
              className="inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium h-10 px-4 py-2 border border-white/20 bg-transparent hover:bg-white/5 text-white transition-all duration-200 cursor-pointer"
            >
              <Calendar className="size-4" />
              Reservar
            </Link>
            <Link href="/client/payments" className="cursor-pointer">
              <Button className="bg-red-600 hover:bg-red-700 text-foreground gap-2">
                <TrendingUp className="size-4" />
                Mi Paquete
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-12 gap-4 lg:gap-6 mb-8">
        {/* Featured Stat - Classes Remaining (Large) */}
        <div className="col-span-12 md:col-span-6 lg:col-span-4 animate-slide-up">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-warning/20 via-warning/10 to-transparent border border-yellow-500/20 p-6 h-full">
            <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 rounded-full blur-3xl" />
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-yellow-500/20">
                  <Zap className="w-6 h-6 text-yellow-400" />
                </div>
                {pkg && (
                  <Badge variant="success" size="sm">
                    Activo
                  </Badge>
                )}
              </div>
              <p className="text-gray-400 text-sm mb-1">Clases Disponibles</p>
              {packageLoading ? (
                <Skeleton className="h-10 w-24 bg-white/10" />
              ) : (
                <p className="text-4xl font-bold text-white mb-2">
                  {pkg?.classesRemaining ?? '∞'}
                </p>
              )}
              <p className="text-yellow-400/80 text-sm">
                {pkg
                  ? pkg.packageName || 'Paquete Activo'
                  : 'Sin paquete activo'}
              </p>
            </div>
          </div>
        </div>

        {/* Stats Column */}
        <div className="col-span-12 md:col-span-6 lg:col-span-4 grid grid-rows-2 gap-4 lg:gap-6">
          {/* Upcoming Bookings */}
          <Link
            href="/client/classes"
            className="group block animate-slide-up"
            style={{ animationDelay: '50ms' }}
          >
            <div className="rounded-xl bg-white/5 border border-white/10 p-5 h-full transition-all duration-300 hover:bg-white/5 hover:border-white/20 hover:-translate-y-0.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-blue-500/20">
                    <Calendar className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    {bookingsLoading ? (
                      <Skeleton className="h-8 w-12 bg-white/10" />
                    ) : (
                      <p className="text-2xl font-bold text-white">
                        {upcomingBookings.length}
                      </p>
                    )}
                    <p className="text-gray-400 text-sm">Próximas Clases</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
              </div>
            </div>
          </Link>

          {/* Completed Classes */}
          <Link
            href="/client/payments"
            className="group block animate-slide-up"
            style={{ animationDelay: '100ms' }}
          >
            <div className="rounded-xl bg-white/5 border border-white/10 p-5 h-full transition-all duration-300 hover:bg-white/5 hover:border-white/20 hover:-translate-y-0.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-green-500/20">
                    <Dumbbell className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    {bookingsLoading ? (
                      <Skeleton className="h-8 w-12 bg-white/10" />
                    ) : (
                      <p className="text-2xl font-bold text-white">
                        {
                          pastBookings.filter((b) => b.status !== 'cancelled')
                            .length
                        }
                      </p>
                    )}
                    <p className="text-gray-400 text-sm">Clases Completadas</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
              </div>
            </div>
          </Link>
        </div>

        {/* Next Class Card */}
        <div
          className="col-span-12 lg:col-span-4 animate-slide-up"
          style={{ animationDelay: '150ms' }}
        >
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-red-500/20 via-red-600/10 to-transparent border border-red-500/20 p-6 h-full">
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full blur-3xl" />
            <div className="relative">
              <div className="flex items-center gap-2 text-red-400 text-sm font-medium mb-4">
                <Clock className="size-4" />
                Próxima Clase
              </div>
              {nextBooking ? (
                <>
                  <p className="text-3xl font-bold text-white mb-1">
                    {nextBooking.className}
                  </p>
                  <p className="text-gray-400 mb-4">
                    {nextBooking.scheduledAt &&
                      new Date(nextBooking.scheduledAt).toLocaleDateString(
                        'es-EC',
                        { weekday: 'long', day: 'numeric', month: 'short' }
                      )}{' '}
                    a las{' '}
                    {nextBooking.scheduledAt &&
                      new Date(nextBooking.scheduledAt).toLocaleTimeString(
                        'es-EC',
                        { hour: '2-digit', minute: '2-digit' }
                      )}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          nextBooking.status === 'confirmed'
                            ? 'success'
                            : 'warning'
                        }
                        dot
                      >
                        {nextBooking.status === 'confirmed'
                          ? 'Confirmada'
                          : `En espera #${nextBooking.position}`}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      {nextBooking.status !== 'cancelled' &&
                        canCancelBooking(nextBooking.scheduledAt) && (
                          <Button
                            onClick={() => handleCancelBooking(nextBooking.id)}
                            loading={cancellingId === nextBooking.id}
                            variant="ghost"
                            size="sm"
                            className="text-muted-foreground hover:text-red-400 h-8 w-8 p-0"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        )}
                      <Link
                        href="/client/classes"
                        className="text-red-400 text-sm hover:text-red-300 transition-colors flex items-center gap-1"
                      >
                        Ver <ArrowRight className="size-4" />
                      </Link>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-gray-400">
                  <p className="text-lg mb-2">Sin clases próximas</p>
                  <Link
                    href="/client/classes"
                    className="text-red-400 text-sm hover:text-red-300 transition-colors flex items-center gap-1"
                  >
                    Reservar clase <ArrowRight className="size-4" />
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Membership Card - Glass Style */}
      <div
        className="mb-8 animate-slide-up"
        style={{ animationDelay: '200ms' }}
      >
        <div className="relative overflow-hidden rounded-2xl bg-white/5 border border-white/10 p-6">
          <div className="absolute top-0 right-0 w-48 h-48 bg-red-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-warning/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />

          <div className="relative">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-red-500/20">
                    <Flame className="w-5 h-5 text-red-400" />
                  </div>
                  <span className="text-muted-foreground text-sm font-medium">
                    Tu Paquete
                  </span>
                </div>

                {packageLoading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-10 w-48 bg-white/10" />
                    <Skeleton className="h-5 w-32 bg-white/10" />
                  </div>
                ) : pkg ? (
                  <>
                    <h2 className="text-2xl md:text-3xl font-bold text-white">
                      {pkg.packageName || 'Paquete Activo'}
                    </h2>
                    <p className="text-gray-400">
                      Válido hasta{' '}
                      {pkg.expiresAt
                        ? new Date(pkg.expiresAt).toLocaleDateString('es-EC', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          })
                        : 'Sin expiración'}
                    </p>
                  </>
                ) : (
                  <>
                    <h2 className="text-2xl font-bold text-white">
                      Sin Paquete Activo
                    </h2>
                    <p className="text-gray-400">
                      Contacta con nosotros para activar tu paquete
                    </p>
                  </>
                )}
              </div>

              {/* Classes Remaining Badge */}
              {pkg && (
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <div className="relative">
                      <div className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-gradient-to-br from-yellow-500/20 to-yellow-500/10 backdrop-blur flex items-center justify-center border-4 border-yellow-500/20">
                        <div>
                          <p className="text-3xl md:text-4xl font-bold text-white">
                            {pkg.classesRemaining ?? '∞'}
                          </p>
                        </div>
                      </div>
                      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-3 py-1 bg-yellow-600 rounded-full">
                        <p className="text-xs font-semibold text-black">
                          Restantes
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main CTA - Book Class */}
      <div
        className="mb-8 animate-slide-up"
        style={{ animationDelay: '250ms' }}
      >
        <Link href="/client/classes" className="block group">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-red-500/10 via-red-500/5 to-transparent border border-red-500/20 p-6 transition-all duration-300 hover:bg-red-500/15 hover:border-red-500/30 hover:-translate-y-0.5">
            <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="flex items-center justify-between relative">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-red-500/20 group-hover:bg-red-600/30 transition-colors">
                  <Dumbbell className="w-6 h-6 text-red-400" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-foreground group-hover:text-red-300 transition-colors">
                    Reservar una Clase
                  </h2>
                  <p className="text-muted-foreground">
                    Explora los horarios disponibles y reserva tu lugar
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground group-hover:text-red-400 transition-colors">
                <span className="hidden sm:inline text-sm">Ver horarios</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* Grid Layout for Upcoming/Empty State and History */}
      {(upcomingBookings.length > 1 ||
        (!bookingsLoading && upcomingBookings.length === 0) ||
        pastBookings.length > 0) && (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left column - Upcoming bookings list or Empty state */}
          <div className="lg:col-span-3">
            {/* Upcoming Bookings List */}
            {upcomingBookings.length > 1 && (
              <Card
                variant="glass"
                className="animate-slide-up overflow-hidden"
              >
                <CardHeader className="border-b border-white/5 py-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white text-base flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-blue-400" />
                      Otras Reservas
                    </CardTitle>
                    <span className="text-xs text-gray-400">
                      {upcomingBookings.length - 1} más
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y divide-white/5">
                    {upcomingBookings.slice(1).map((booking) => (
                      <div
                        key={booking.id}
                        className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="text-center min-w-11">
                            <p className="text-lg font-bold text-white">
                              {booking.scheduledAt &&
                                new Date(booking.scheduledAt).getDate()}
                            </p>
                            <p className="text-xs text-gray-400 uppercase">
                              {booking.scheduledAt &&
                                new Date(
                                  booking.scheduledAt
                                ).toLocaleDateString('es-EC', {
                                  month: 'short',
                                })}
                            </p>
                          </div>
                          <div>
                            <p className="text-white font-medium">
                              {booking.className}
                            </p>
                            <p className="text-gray-400 text-sm">
                              {booking.scheduledAt &&
                                new Date(
                                  booking.scheduledAt
                                ).toLocaleTimeString('es-EC', {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-2 h-2 rounded-full ${
                              booking.status === 'confirmed'
                                ? 'bg-green-600'
                                : 'bg-yellow-600'
                            }`}
                          />
                          {booking.status !== 'cancelled' &&
                            canCancelBooking(booking.scheduledAt) && (
                              <Button
                                onClick={() => handleCancelBooking(booking.id)}
                                loading={cancellingId === booking.id}
                                variant="ghost"
                                size="sm"
                                className="text-muted-foreground hover:text-red-400 h-8 w-8 p-0"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Empty State for No Bookings */}
            {!bookingsLoading && upcomingBookings.length === 0 && (
              <div className="animate-slide-up h-full">
                <div className="rounded-2xl border border-dashed border-white/20 p-8 text-center h-full flex flex-col items-center justify-center">
                  <div className="mx-auto w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-4">
                    <Calendar className="w-6 h-6 text-gray-400" />
                  </div>
                  <h3 className="text-white font-medium mb-2">
                    No tienes clases reservadas
                  </h3>
                  <p className="text-gray-400 text-sm mb-4">
                    Reserva tu primera clase y comienza tu entrenamiento
                  </p>
                  <Button asChild size="sm">
                    <Link
                      href="/client/classes"
                      className="inline-flex items-center gap-2 cursor-pointer"
                    >
                      <Calendar className="size-4" />
                      Ver Horarios
                    </Link>
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Right column - History */}
          <div className="lg:col-span-2">
            {/* Past Bookings - Collapsible/Compact */}
            {pastBookings.length > 0 && (
              <Card variant="glass" className="animate-slide-up">
                <CardHeader className="border-b border-white/5 py-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white text-base flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      Historial
                    </CardTitle>
                    <CardDescription className="text-gray-400 text-xs">
                      Últimos 30 días
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y divide-white/5">
                    {pastBookings.slice(0, 5).map((booking) => (
                      <div
                        key={booking.id}
                        className="flex items-center justify-between p-3 opacity-60 hover:opacity-100 transition-opacity"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                            <Dumbbell className="w-4 h-4 text-gray-400" />
                          </div>
                          <div>
                            <p className="text-white text-sm font-medium">
                              {booking.className}
                            </p>
                            <p className="text-gray-400 text-xs">
                              {booking.scheduledAt &&
                                new Date(
                                  booking.scheduledAt
                                ).toLocaleDateString('es-EC', {
                                  day: 'numeric',
                                  month: 'short',
                                })}
                            </p>
                          </div>
                        </div>
                        <Badge
                          variant={
                            booking.status === 'cancelled' ? 'error' : 'success'
                          }
                          size="sm"
                        >
                          {booking.status === 'cancelled'
                            ? 'Cancelada'
                            : 'Completada'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                  {pastBookings.length > 5 && (
                    <div className="p-3 border-t border-white/5">
                      <Link
                        href="/client/payments"
                        className="text-xs text-gray-400 hover:text-white transition-colors flex items-center justify-center gap-1"
                      >
                        Ver historial completo
                        <ChevronRight className="w-3 h-3" />
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}

      <ConfirmDialog
        open={cancelConfirm.open}
        onOpenChange={(open) => setCancelConfirm((s) => ({ ...s, open }))}
        title="Cancelar Reserva"
        description="¿Estás seguro de que deseas cancelar esta reserva?"
        confirmText="Cancelar Reserva"
        variant="danger"
        onConfirm={confirmCancelBooking}
      />
    </main>
  )
}
