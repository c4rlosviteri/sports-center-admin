'use server'

import * as bookingsQueries from '~/db/queries/bookings.queries'
import * as dashboard from '~/db/queries/dashboard.queries'
import { pool } from '~/lib/db'
import type { BookingWithDetails, UserMembership } from '~/types/database'
import { getSession } from './auth'

export async function getUserActiveMembership(): Promise<UserMembership | null> {
  // Use packages instead of legacy memberships
  const pkg = await getUserActivePackage()
  if (!pkg) return null

  return {
    id: pkg.id,
    userId: pkg.userId,
    packageTemplateId: pkg.packageTemplateId,
    startDate: new Date(),
    endDate: pkg.expiresAt,
    classesRemaining: pkg.classesRemaining,
    isActive: pkg.status === 'active',
    packageName: pkg.packageName,
    packageDescription: pkg.packageDescription,
    status: 'active' as const,
    createdAt: new Date(),
  }
}

export async function getUserActivePackage(): Promise<{
  id: string
  userId: string
  packageTemplateId: string
  totalClasses: number
  classesRemaining: number
  expiresAt: Date | null
  status: string
  packageName: string | undefined
  packageDescription: string | undefined
} | null> {
  const session = await getSession()
  if (!session) throw new Error('No autorizado')

  const result = await dashboard.getUserActivePackage.run(
    { userId: session.user.id },
    pool
  )

  if (result.length === 0) return null

  const row = result[0]

  return {
    id: row.id,
    userId: row.user_id,
    packageTemplateId: row.package_template_id,
    totalClasses: row.total_classes,
    classesRemaining: row.classes_remaining,
    expiresAt: row.expires_at,
    status: row.status ?? 'active',
    packageName: row.package_name ?? undefined,
    packageDescription: row.package_description ?? undefined,
  }
}

export async function getUserBookings(): Promise<BookingWithDetails[]> {
  const session = await getSession()
  if (!session) throw new Error('No autorizado')

  const result = await dashboard.getUserBookings.run(
    { userId: session.user.id },
    pool
  )

  const mapped = result.map((row: dashboard.GetUserBookingsResult) => {
    const booking = {
      id: row.id,
      userId: row.user_id,
      classId: row.class_id,
      status: row.status,
      position: row.waitlist_position,
      bookedAt: row.booked_at ? new Date(row.booked_at).toISOString() : null,
      className: row.class_name,
      instructorName: row.instructor_name,
      scheduledAt: row.scheduled_at
        ? new Date(row.scheduled_at).toISOString()
        : null,
      durationMinutes: row.duration_minutes,
      location: '',
      userFirstName: '',
      userLastName: '',
      userEmail: '',
      userName: '',
      createdAt: row.created_at
        ? new Date(row.created_at).toISOString()
        : new Date().toISOString(),
      cancelledAt: row.cancelled_at
        ? new Date(row.cancelled_at).toISOString()
        : null,
    }
    return booking
  })

  return mapped
}

/**
 * Get dashboard statistics for admin
 */
export async function getDashboardStats() {
  const session = await getSession()
  if (!session || !['admin', 'superuser'].includes(session.user.role)) {
    throw new Error('No autorizado')
  }
  if (!session.user.branchId) {
    throw new Error('No se encontró la sucursal del usuario')
  }

  const branchId = session.user.branchId

  // Run all queries in parallel
  const [
    usersResult,
    activePackagesResult,
    todayClassesResult,
    revenueResult,
    upcomingClassesResult,
    recentBookingsResult,
    expiringPackagesResult,
  ] = await Promise.all([
    dashboard.getTotalClients.run({ branchId }, pool),
    dashboard.getActivePackagesCount.run({ branchId }, pool),
    dashboard.getTodayClassesCount.run({ branchId }, pool),
    dashboard.getMonthlyRevenue.run({ branchId }, pool),
    dashboard.getUpcomingClasses.run({ branchId }, pool),
    dashboard.getRecentBookings.run({ branchId }, pool),
    dashboard.getExpiringPackages.run({ branchId }, pool),
  ])

  // Fetch bookings for each upcoming class in parallel
  const upcomingClassesWithBookings = await Promise.all(
    upcomingClassesResult.map(async (row) => {
      const bookings = await bookingsQueries.getClassBookings.run(
        { classId: row.id },
        pool
      )
      const first3Bookings = bookings.slice(0, 3).map((booking) => ({
        firstName: booking.first_name ?? '',
        lastName: booking.last_name ?? '',
      }))

      return {
        id: row.id,
        scheduledAt: row.scheduled_at,
        capacity: row.capacity,
        bookingsCount: parseInt(row.bookings_count ?? '0', 10),
        bookedUsers: first3Bookings,
      }
    })
  )

  return {
    totalClients: parseInt(usersResult[0]?.count ?? '0', 10),
    activePackages: parseInt(activePackagesResult[0]?.count ?? '0', 10),
    todayClasses: parseInt(todayClassesResult[0]?.count ?? '0', 10),
    monthlyRevenue: parseFloat(revenueResult[0]?.total ?? '0'),
    upcomingClasses: upcomingClassesWithBookings,
    recentBookings: recentBookingsResult.map((row) => ({
      id: row.id,
      status: row.status,
      createdAt: row.created_at,
      firstName: row.first_name,
      lastName: row.last_name,
      scheduledAt: row.scheduled_at,
    })),
    expiringPackages: expiringPackagesResult.map((row) => ({
      id: row.id,
      expiresAt: row.expires_at,
      remainingClasses: row.classes_remaining,
      firstName: row.first_name,
      lastName: row.last_name,
      email: row.email,
      packageName: row.package_name,
    })),
  }
}
