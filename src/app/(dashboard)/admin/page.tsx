import {
  AlertCircle,
  ArrowRight,
  Calendar,
  ChevronRight,
  Clock,
  DollarSign,
  Sparkles,
  TrendingUp,
  Users,
} from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { EmptyStateCompact } from '@/components/ui/empty-state'
import { getCurrentBranchContext } from '~/actions/admin'
import { getSession } from '~/actions/auth'
import { getDashboardStats } from '~/actions/dashboard'
import { AdminHeader } from '~/components/admin-header-simple'
import { CreateClassDialog } from './classes/create-class-dialog'

export default async function AdminDashboard() {
  const session = await getSession()

  if (!session) {
    redirect('/login')
  }

  const user = session.user
  const [stats, branchContext] = await Promise.all([
    getDashboardStats(),
    getCurrentBranchContext(),
  ])

  const nextClass = stats.upcomingClasses[0]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <AdminHeader
        user={user}
        currentBranchId={branchContext.currentBranchId}
        branches={branchContext.branches}
        currentPage="/admin"
      />

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
              <h1 className="text-4xl font-bold text-white">
                Hola, {user.firstName}
              </h1>
              <p className="text-gray-400 mt-1">
                {stats.todayClasses > 0
                  ? `Tienes ${stats.todayClasses} clase${stats.todayClasses > 1 ? 's' : ''} programada${stats.todayClasses > 1 ? 's' : ''} para hoy`
                  : 'No hay clases programadas para hoy'}
              </p>
            </div>
            <div className="flex gap-3">
              <Link
                href="/admin/users"
                className="inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium h-10 px-4 py-2 border border-white/20 bg-transparent hover:bg-white/5 text-white transition-all duration-200 cursor-pointer"
              >
                <Users className="size-4" />
                Usuarios
              </Link>
              <CreateClassDialog>
                <Button className="bg-red-600 hover:bg-red-700 text-foreground gap-2">
                  <Calendar className="size-4" />
                  Nueva Clase
                </Button>
              </CreateClassDialog>
            </div>
          </div>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-12 gap-4 lg:gap-6 mb-8">
          {/* Featured Stat - Revenue (Large) */}
          <div className="col-span-12 md:col-span-6 lg:col-span-4 animate-slide-up">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-warning/20 via-warning/10 to-transparent border border-yellow-500/20 p-6 h-full">
              <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 rounded-full blur-3xl" />
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-xl bg-yellow-500/20">
                    <DollarSign className="w-6 h-6 text-yellow-400" />
                  </div>
                  <Badge variant="success" size="sm">
                    Este mes
                  </Badge>
                </div>
                <p className="text-gray-400 text-sm mb-1">Ingresos Totales</p>
                <p className="text-4xl font-bold text-white mb-2">
                  ${stats.monthlyRevenue.toFixed(0)}
                </p>
                <p className="text-yellow-400/80 text-sm">Pagos completados</p>
              </div>
            </div>
          </div>

          {/* Stats Column */}
          <div className="col-span-12 md:col-span-6 lg:col-span-4 grid grid-rows-2 gap-4 lg:gap-6">
            {/* Clients */}
            <Link
              href="/admin/users"
              className="group block animate-slide-up"
              style={{ animationDelay: '50ms' }}
            >
              <div className="rounded-xl bg-white/5 border border-white/10 p-5 h-full transition-all duration-300 hover:bg-white/5 hover:border-white/20 hover:-translate-y-0.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-lg bg-blue-500/20">
                      <Users className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-white">
                        {stats.totalClients}
                      </p>
                      <p className="text-gray-400 text-sm">Total Clientes</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                </div>
              </div>
            </Link>

            {/* Active Packages */}
            <div
              className="rounded-xl bg-white/5 border border-white/10 p-5 animate-slide-up"
              style={{ animationDelay: '100ms' }}
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-green-500/20">
                  <TrendingUp className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">
                    {stats.activePackages}
                  </p>
                  <p className="text-gray-400 text-sm">Paquetes Activos</p>
                </div>
              </div>
            </div>
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
                {nextClass ? (
                  <>
                    <p className="text-3xl font-bold text-white mb-1">
                      {new Date(nextClass.scheduledAt).toLocaleTimeString(
                        'es-EC',
                        { hour: '2-digit', minute: '2-digit' }
                      )}
                    </p>
                    <p className="text-gray-400 mb-4">
                      {new Date(nextClass.scheduledAt).toLocaleDateString(
                        'es-EC',
                        { weekday: 'long', day: 'numeric', month: 'short' }
                      )}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="flex -space-x-2">
                          {(nextClass.bookedUsers || [])
                            .slice(0, 3)
                            .map((user, i) => (
                              <div
                                key={`avatar-${i}-${nextClass.id}`}
                                className="w-7 h-7 rounded-full bg-white/20 border-2 border-white/30 flex items-center justify-center"
                              >
                                <span className="text-xs text-white">
                                  {`${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase()}
                                </span>
                              </div>
                            ))}
                        </div>
                        <span className="text-gray-400 text-sm">
                          {nextClass.bookingsCount}/{nextClass.capacity}
                        </span>
                      </div>
                      <Link
                        href="/admin/classes"
                        className="text-red-400 text-sm hover:text-red-300 transition-colors flex items-center gap-1"
                      >
                        Ver <ArrowRight className="size-4" />
                      </Link>
                    </div>
                  </>
                ) : (
                  <div className="text-gray-400">
                    <p className="text-lg mb-2">Sin clases próximas</p>
                    <CreateClassDialog>
                      <button
                        type="button"
                        className="text-red-400 text-sm hover:text-red-300 transition-colors flex items-center gap-1"
                      >
                        Programar clase <ArrowRight className="size-4" />
                      </button>
                    </CreateClassDialog>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Expiring Packages Alert */}
        {stats.expiringPackages.length > 0 && (
          <div className="mb-8 animate-slide-up">
            <div className="rounded-2xl bg-gradient-to-r from-red-500/10 via-red-500/5 to-transparent border border-red-500/20 p-5">
              <div className="flex items-start gap-4">
                <div className="p-2.5 rounded-xl bg-red-500/20 shrink-0">
                  <AlertCircle className="w-5 h-5 text-red-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-white font-semibold">
                      {stats.expiringPackages.length} paquete
                      {stats.expiringPackages.length > 1 ? 's' : ''} por vencer
                    </h3>
                    <Link
                      href="/admin/users"
                      className="text-red-400 text-sm hover:text-red-300 transition-colors"
                    >
                      Ver todos →
                    </Link>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {stats.expiringPackages.slice(0, 4).map((pkg) => (
                      <div
                        key={pkg.id}
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm"
                      >
                        <span className="text-foreground">
                          {pkg.firstName} {pkg.lastName}
                        </span>
                        <span className="text-red-400">
                          {pkg.expiresAt
                            ? new Date(pkg.expiresAt).toLocaleDateString(
                                'es-EC',
                                {
                                  day: 'numeric',
                                  month: 'short',
                                }
                              )
                            : 'Sin expiración'}
                        </span>
                      </div>
                    ))}
                    {stats.expiringPackages.length > 4 && (
                      <span className="text-gray-400 text-sm self-center">
                        +{stats.expiringPackages.length - 4} más
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Activity Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Upcoming Classes - Takes more space */}
          <Card
            variant="glass"
            className="lg:col-span-3 animate-slide-up overflow-hidden border-white/10"
          >
            <CardHeader className="border-b border-white/5">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-foreground flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-red-400" />
                    Clases Programadas
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Próximos 7 días
                  </CardDescription>
                </div>
                <Link
                  href="/admin/classes"
                  className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-1"
                >
                  Ver todas <ChevronRight className="size-4" />
                </Link>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {stats.upcomingClasses.length === 0 ? (
                <div className="p-6">
                  <EmptyStateCompact
                    icon={Calendar}
                    message="No hay clases programadas"
                  />
                </div>
              ) : (
                <div className="divide-y divide-white/5">
                  {stats.upcomingClasses.slice(0, 5).map((classItem, index) => (
                    <div
                      key={classItem.id}
                      className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <div className="flex items-center gap-4">
                        <div className="text-center min-w-12">
                          <p className="text-2xl font-bold text-white">
                            {new Date(classItem.scheduledAt).getDate()}
                          </p>
                          <p className="text-xs text-gray-400 uppercase">
                            {new Date(classItem.scheduledAt).toLocaleDateString(
                              'es-EC',
                              { month: 'short' }
                            )}
                          </p>
                        </div>
                        <div className="h-12 w-px bg-white/10" />
                        <div>
                          <p className="text-white font-medium">
                            {new Date(classItem.scheduledAt).toLocaleTimeString(
                              'es-EC',
                              { hour: '2-digit', minute: '2-digit' }
                            )}
                          </p>
                          <p className="text-gray-400 text-sm">
                            {new Date(classItem.scheduledAt).toLocaleDateString(
                              'es-EC',
                              { weekday: 'long' }
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className="text-white font-medium">
                            {classItem.bookingsCount}/{classItem.capacity}
                          </p>
                          <p className="text-xs text-gray-400">reservas</p>
                        </div>
                        <div
                          className={`w-2 h-2 rounded-full ${
                            classItem.bookingsCount >= classItem.capacity
                              ? 'bg-red-400'
                              : classItem.bookingsCount >=
                                  classItem.capacity * 0.8
                                ? 'bg-warning'
                                : 'bg-green-600'
                          }`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Bookings - Compact list */}
          <Card
            variant="glass"
            className="lg:col-span-2 animate-slide-up border-white/10"
          >
            <CardHeader className="border-b border-white/5">
              <CardTitle className="text-white text-base flex items-center gap-2">
                <Users className="size-4 text-blue-400" />
                Reservas Recientes
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {stats.recentBookings.length === 0 ? (
                <div className="p-6">
                  <EmptyStateCompact
                    icon={Users}
                    message="No hay reservas recientes"
                  />
                </div>
              ) : (
                <div className="divide-y divide-white/5">
                  {stats.recentBookings.slice(0, 6).map((booking, index) => (
                    <div
                      key={booking.id}
                      className="flex items-center justify-between p-3 hover:bg-white/5 transition-colors"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                          <span className="text-xs text-white font-medium">
                            {booking.firstName?.charAt(0)}
                            {booking.lastName?.charAt(0)}
                          </span>
                        </div>
                        <div className="min-w-0">
                          <p className="text-white text-sm font-medium truncate">
                            {booking.firstName} {booking.lastName}
                          </p>
                          <p className="text-gray-400 text-xs">
                            {new Date(booking.scheduledAt).toLocaleDateString(
                              'es-EC',
                              { day: 'numeric', month: 'short' }
                            )}
                          </p>
                        </div>
                      </div>
                      <div
                        className={`w-2 h-2 rounded-full shrink-0 ${
                          booking.status === 'confirmed'
                            ? 'bg-success'
                            : booking.status === 'waitlisted'
                              ? 'bg-warning'
                              : 'bg-gray-400'
                        }`}
                      />
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
