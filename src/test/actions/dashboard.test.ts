import { beforeEach, describe, expect, it, vi } from 'vitest'

// Mock dependencies
vi.mock('~/lib/db', () => ({
  pool: {
    query: vi.fn(),
  },
}))

vi.mock('~/actions/auth', () => ({
  getSession: vi.fn(),
}))

vi.mock('~/db/queries/dashboard.queries', () => ({
  getUserActivePackage: { run: vi.fn() },
  getUserBookings: { run: vi.fn() },
  getTotalClients: { run: vi.fn() },
  getActivePackagesCount: { run: vi.fn() },
  getTodayClassesCount: { run: vi.fn() },
  getMonthlyRevenue: { run: vi.fn() },
  getUpcomingClasses: { run: vi.fn() },
  getRecentBookings: { run: vi.fn() },
  getExpiringPackages: { run: vi.fn() },
}))

vi.mock('~/db/queries/bookings.queries', () => ({
  getClassBookings: { run: vi.fn() },
}))

import { getSession } from '~/actions/auth'
import {
  getDashboardStats,
  getUserActiveMembership,
  getUserBookings,
} from '~/actions/dashboard'
import * as bookingsQueries from '~/db/queries/bookings.queries'
import * as dashboardQueries from '~/db/queries/dashboard.queries'
import { pool } from '~/lib/db'

describe('dashboard actions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getUserActiveMembership', () => {
    it('should throw error when user is not authenticated', async () => {
      vi.mocked(getSession).mockResolvedValue(null)

      await expect(getUserActiveMembership()).rejects.toThrow('No autorizado')
    })

    it('should return null when user has no active membership', async () => {
      vi.mocked(getSession).mockResolvedValue({
        user: { id: 'user-1', role: 'client', branchId: 'branch-1' },
      } as any)

      vi.mocked(dashboardQueries.getUserActivePackage.run).mockResolvedValue([])

      const result = await getUserActiveMembership()

      expect(result).toBeNull()
    })

    it('should return active membership with plan details', async () => {
      vi.mocked(getSession).mockResolvedValue({
        user: { id: 'user-1', role: 'client', branchId: 'branch-1' },
      } as any)

      const mockPackage = {
        id: 'package-1',
        user_id: 'user-1',
        package_template_id: 'template-1',
        total_classes: 10,
        classes_remaining: 8,
        expires_at: new Date('2024-02-01'),
        status: 'active',
        package_name: 'Monthly Package',
        package_description: 'Access to all classes',
        validity_type: 'monthly',
        validity_period: 30,
        class_count: 10,
        branch_id: 'branch-1',
        activated_at: new Date('2024-01-01'),
        created_at: new Date(),
        updated_at: new Date(),
        purchased_at: new Date(),
        purchase_price: '50.00',
        frozen_until: null,
        gift_from_user_id: null,
        gift_message: null,
        gift_redeemed_at: null,
        is_gift: false,
        payment_id: null,
        refund_amount: null,
        refund_reason: null,
        refunded_at: null,
        shared_with_user_ids: null,
      }

      vi.mocked(dashboardQueries.getUserActivePackage.run).mockResolvedValue([
        mockPackage,
      ])

      const result = await getUserActiveMembership()

      expect(result).toMatchObject({
        id: 'package-1',
        userId: 'user-1',
        packageTemplateId: 'template-1',
        classesRemaining: 8,
        isActive: true,
        packageName: 'Monthly Package',
        packageDescription: 'Access to all classes',
        status: 'active',
      })
    })

    it('should handle unlimited membership (null classes_remaining)', async () => {
      vi.mocked(getSession).mockResolvedValue({
        user: { id: 'user-1', role: 'client', branchId: 'branch-1' },
      } as any)

      const mockPackage = {
        id: 'package-1',
        user_id: 'user-1',
        package_template_id: 'template-1',
        total_classes: 0,
        classes_remaining: 0,
        expires_at: new Date('2024-02-01'),
        status: 'active',
        package_name: 'Unlimited Package',
        package_description: null,
        validity_type: 'unlimited',
        validity_period: 30,
        class_count: 0,
        branch_id: 'branch-1',
        activated_at: new Date('2024-01-01'),
        created_at: new Date(),
        updated_at: new Date(),
        purchased_at: new Date(),
        purchase_price: '100.00',
        frozen_until: null,
        gift_from_user_id: null,
        gift_message: null,
        gift_redeemed_at: null,
        is_gift: false,
        payment_id: null,
        refund_amount: null,
        refund_reason: null,
        refunded_at: null,
        shared_with_user_ids: null,
      }

      vi.mocked(dashboardQueries.getUserActivePackage.run).mockResolvedValue([
        mockPackage,
      ])

      const result = await getUserActiveMembership()

      expect(result?.classesRemaining).toBe(0)
      expect(result?.packageDescription).toBeUndefined()
    })
  })

  describe('getUserBookings', () => {
    it('should throw error when user is not authenticated', async () => {
      vi.mocked(getSession).mockResolvedValue(null)

      await expect(getUserBookings()).rejects.toThrow('No autorizado')
    })

    it('should return empty array when user has no bookings', async () => {
      vi.mocked(getSession).mockResolvedValue({
        user: { id: 'user-1', role: 'client', branchId: 'branch-1' },
      } as any)

      vi.mocked(dashboardQueries.getUserBookings.run).mockResolvedValue([])

      const result = await getUserBookings()

      expect(result).toEqual([])
    })

    it('should return user bookings with class details', async () => {
      vi.mocked(getSession).mockResolvedValue({
        user: { id: 'user-1', role: 'client', branchId: 'branch-1' },
      } as any)

      const mockBookings = [
        {
          id: 'booking-1',
          user_id: 'user-1',
          class_id: 'class-1',
          status: 'confirmed' as const,
          waitlist_position: null,
          booked_at: new Date('2024-01-15T10:00:00Z'),
          class_name: 'Yoga',
          instructor_name: 'John',
          scheduled_at: new Date('2024-01-20T10:00:00Z'),
          duration_minutes: 60,
          package_id: 'package-1',
          created_at: new Date(),
          updated_at: new Date(),
          cancelled_at: null,
        },
        {
          id: 'booking-2',
          user_id: 'user-1',
          class_id: 'class-2',
          status: 'waitlisted' as const,
          waitlist_position: 2,
          booked_at: new Date('2024-01-15T11:00:00Z'),
          class_name: 'Spinning',
          instructor_name: 'Jane',
          scheduled_at: new Date('2024-01-21T09:00:00Z'),
          duration_minutes: 45,
          package_id: 'package-1',
          created_at: new Date(),
          updated_at: new Date(),
          cancelled_at: null,
        },
      ]

      vi.mocked(dashboardQueries.getUserBookings.run).mockResolvedValue(
        mockBookings
      )

      const result = await getUserBookings()

      expect(result).toHaveLength(2)
      expect(result[0]).toMatchObject({
        id: 'booking-1',
        status: 'confirmed',
        className: 'Yoga',
        instructorName: 'John',
        durationMinutes: 60,
      })
      expect(result[1]).toMatchObject({
        id: 'booking-2',
        status: 'waitlisted',
        position: 2,
        className: 'Spinning',
      })
    })

    it('should handle cancelled bookings', async () => {
      vi.mocked(getSession).mockResolvedValue({
        user: { id: 'user-1', role: 'client', branchId: 'branch-1' },
      } as any)

      const mockBookings = [
        {
          id: 'booking-1',
          user_id: 'user-1',
          class_id: 'class-1',
          status: 'cancelled' as const,
          waitlist_position: null,
          booked_at: new Date('2024-01-15T10:00:00Z'),
          class_name: 'Yoga',
          instructor_name: 'John',
          scheduled_at: new Date('2024-01-20T10:00:00Z'),
          duration_minutes: 60,
          package_id: 'package-1',
          created_at: new Date(),
          updated_at: new Date(),
          cancelled_at: new Date('2024-01-16T10:00:00Z'),
        },
      ]

      vi.mocked(dashboardQueries.getUserBookings.run).mockResolvedValue(
        mockBookings
      )

      const result = await getUserBookings()

      expect(result[0].cancelledAt).not.toBeNull()
    })
  })

  describe('getDashboardStats', () => {
    it('should throw error when user is not authenticated', async () => {
      vi.mocked(getSession).mockResolvedValue(null)

      await expect(getDashboardStats()).rejects.toThrow('No autorizado')
    })

    it('should throw error when user is client', async () => {
      vi.mocked(getSession).mockResolvedValue({
        user: { id: 'user-1', role: 'client', branchId: 'branch-1' },
      } as any)

      await expect(getDashboardStats()).rejects.toThrow('No autorizado')
    })

    it('should return dashboard stats for admin', async () => {
      vi.mocked(getSession).mockResolvedValue({
        user: { id: 'admin-1', role: 'admin', branchId: 'branch-1' },
      } as any)

      vi.mocked(dashboardQueries.getTotalClients.run).mockResolvedValue([
        { count: '150' },
      ])
      vi.mocked(dashboardQueries.getActivePackagesCount.run).mockResolvedValue([
        { count: '120' },
      ])
      vi.mocked(dashboardQueries.getTodayClassesCount.run).mockResolvedValue([
        { count: '8' },
      ])
      vi.mocked(dashboardQueries.getMonthlyRevenue.run).mockResolvedValue([
        { total: '5000.50' },
      ])
      vi.mocked(dashboardQueries.getUpcomingClasses.run).mockResolvedValue([
        {
          id: 'class-1',
          scheduled_at: new Date(),
          capacity: 20,
          bookings_count: '15',
        },
      ])
      vi.mocked(dashboardQueries.getRecentBookings.run).mockResolvedValue([
        {
          id: 'booking-1',
          status: 'confirmed',
          created_at: new Date(),
          first_name: 'John',
          last_name: 'Doe',
          scheduled_at: new Date(),
        },
      ])
      vi.mocked(dashboardQueries.getExpiringPackages.run).mockResolvedValue([
        {
          id: 'package-1',
          expires_at: new Date(),
          classes_remaining: 2,
          first_name: 'Jane',
          last_name: 'Smith',
          email: 'jane@test.com',
          package_name: 'Monthly',
        },
      ])
      vi.mocked(bookingsQueries.getClassBookings.run).mockResolvedValue([
        {
          id: 'booking-1',
          status: 'confirmed' as const,
          waitlist_position: null,
          booked_at: new Date(),
          first_name: 'John',
          last_name: 'Doe',
          email: 'john@test.com',
          phone: '123456789',
        },
      ])

      const result = await getDashboardStats()

      expect(result).toMatchObject({
        totalClients: 150,
        activePackages: 120,
        todayClasses: 8,
        monthlyRevenue: 5000.5,
      })
      expect(result.upcomingClasses).toHaveLength(1)
      expect(result.upcomingClasses[0].bookingsCount).toBe(15)
      expect(result.recentBookings).toHaveLength(1)
      expect(result.expiringPackages).toHaveLength(1)
    })

    it('should handle empty stats', async () => {
      vi.mocked(getSession).mockResolvedValue({
        user: { id: 'admin-1', role: 'admin', branchId: 'branch-1' },
      } as any)

      vi.mocked(dashboardQueries.getTotalClients.run).mockResolvedValue([])
      vi.mocked(dashboardQueries.getActivePackagesCount.run).mockResolvedValue(
        []
      )
      vi.mocked(dashboardQueries.getTodayClassesCount.run).mockResolvedValue([])
      vi.mocked(dashboardQueries.getMonthlyRevenue.run).mockResolvedValue([])
      vi.mocked(dashboardQueries.getUpcomingClasses.run).mockResolvedValue([])
      vi.mocked(dashboardQueries.getRecentBookings.run).mockResolvedValue([])
      vi.mocked(dashboardQueries.getExpiringPackages.run).mockResolvedValue([])
      vi.mocked(bookingsQueries.getClassBookings.run).mockResolvedValue([])

      const result = await getDashboardStats()

      expect(result).toMatchObject({
        totalClients: 0,
        activePackages: 0,
        todayClasses: 0,
        monthlyRevenue: 0,
        upcomingClasses: [],
        recentBookings: [],
        expiringPackages: [],
      })
    })

    it('should allow superuser to view stats', async () => {
      vi.mocked(getSession).mockResolvedValue({
        user: { id: 'super-1', role: 'superuser', branchId: 'branch-1' },
      } as any)

      vi.mocked(dashboardQueries.getTotalClients.run).mockResolvedValue([
        { count: '50' },
      ])
      vi.mocked(dashboardQueries.getActivePackagesCount.run).mockResolvedValue([
        { count: '40' },
      ])
      vi.mocked(dashboardQueries.getTodayClassesCount.run).mockResolvedValue([
        { count: '3' },
      ])
      vi.mocked(dashboardQueries.getMonthlyRevenue.run).mockResolvedValue([
        { total: '2000' },
      ])
      vi.mocked(dashboardQueries.getUpcomingClasses.run).mockResolvedValue([])
      vi.mocked(dashboardQueries.getRecentBookings.run).mockResolvedValue([])
      vi.mocked(dashboardQueries.getExpiringPackages.run).mockResolvedValue([])
      vi.mocked(bookingsQueries.getClassBookings.run).mockResolvedValue([])

      const result = await getDashboardStats()

      expect(result.totalClients).toBe(50)
    })

    it('should run queries with correct branch ID', async () => {
      vi.mocked(getSession).mockResolvedValue({
        user: { id: 'admin-1', role: 'admin', branchId: 'branch-42' },
      } as any)

      vi.mocked(dashboardQueries.getTotalClients.run).mockResolvedValue([])
      vi.mocked(dashboardQueries.getActivePackagesCount.run).mockResolvedValue(
        []
      )
      vi.mocked(dashboardQueries.getTodayClassesCount.run).mockResolvedValue([])
      vi.mocked(dashboardQueries.getMonthlyRevenue.run).mockResolvedValue([])
      vi.mocked(dashboardQueries.getUpcomingClasses.run).mockResolvedValue([])
      vi.mocked(dashboardQueries.getRecentBookings.run).mockResolvedValue([])
      vi.mocked(dashboardQueries.getExpiringPackages.run).mockResolvedValue([])
      vi.mocked(bookingsQueries.getClassBookings.run).mockResolvedValue([])

      await getDashboardStats()

      expect(dashboardQueries.getTotalClients.run).toHaveBeenCalledWith(
        { branchId: 'branch-42' },
        pool
      )
      expect(dashboardQueries.getActivePackagesCount.run).toHaveBeenCalledWith(
        { branchId: 'branch-42' },
        pool
      )
    })
  })
})
