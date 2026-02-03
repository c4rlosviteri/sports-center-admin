import { beforeEach, describe, expect, it, vi } from 'vitest'

// Mock dependencies
vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}))

vi.mock('~/lib/db', () => ({
  pool: {
    query: vi.fn(),
    connect: vi.fn(),
  },
}))

vi.mock('~/actions/auth', () => ({
  getSession: vi.fn(),
}))

vi.mock('~/db/queries/bookings.queries', () => ({
  getClassBookings: {
    run: vi.fn(),
  },
  getBookingDetails: {
    run: vi.fn(),
  },
  cancelBookingById: {
    run: vi.fn(),
  },
  getPackageClassesRemaining: {
    run: vi.fn(),
  },
  updatePackageClasses: {
    run: vi.fn(),
  },
  getNextWaitlistBooking: {
    run: vi.fn(),
  },
  promoteWaitlistBooking: {
    run: vi.fn(),
  },
}))

vi.mock('~/lib/audit', () => ({
  logAdminAction: vi.fn(),
}))

import { revalidatePath } from 'next/cache'
import { getSession } from '~/actions/auth'
import { adminRemoveBooking, getClassBookings } from '~/actions/bookings'
import * as bookingsQueries from '~/db/queries/bookings.queries'
import { logAdminAction } from '~/lib/audit'
import { pool } from '~/lib/db'

describe('bookings actions', () => {
  const mockClient = {
    query: vi.fn(),
    release: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(pool.connect).mockResolvedValue(mockClient as any)
  })

  describe('getClassBookings', () => {
    it('should throw error when user is not authenticated', async () => {
      vi.mocked(getSession).mockResolvedValue(null)

      await expect(getClassBookings('class-123')).rejects.toThrow(
        'No autorizado'
      )
    })

    it('should throw error when admin tries to access class from different branch', async () => {
      vi.mocked(getSession).mockResolvedValue({
        user: {
          id: 'admin-1',
          role: 'admin',
          branchId: 'branch-1',
        },
      } as any)

      vi.mocked(pool.query).mockResolvedValue({ rows: [] } as any)

      await expect(getClassBookings('class-123')).rejects.toThrow(
        'Clase no encontrada en tu sucursal'
      )
    })

    it('should return bookings for admin with valid branch access', async () => {
      vi.mocked(getSession).mockResolvedValue({
        user: {
          id: 'admin-1',
          role: 'admin',
          branchId: 'branch-1',
        },
      } as any)

      vi.mocked(pool.query).mockResolvedValue({
        rows: [{ id: 'class-123' }],
      } as any)

      const mockBookings = [
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
        {
          id: 'booking-2',
          status: 'waitlisted' as const,
          waitlist_position: 1,
          booked_at: new Date(),
          first_name: 'Jane',
          last_name: 'Doe',
          email: 'jane@test.com',
          phone: '987654321',
        },
      ]

      vi.mocked(bookingsQueries.getClassBookings.run).mockResolvedValue(
        mockBookings
      )

      const result = await getClassBookings('class-123')

      expect(result).toHaveLength(2)
      expect(result[0]).toMatchObject({
        id: 'booking-1',
        status: 'confirmed',
        userFirstName: 'John',
        userLastName: 'Doe',
      })
      expect(result[1]).toMatchObject({
        id: 'booking-2',
        status: 'waitlisted',
        waitlistPosition: 1,
      })
    })

    it('should allow superuser to access any class', async () => {
      vi.mocked(getSession).mockResolvedValue({
        user: {
          id: 'superuser-1',
          role: 'superuser',
          branchId: 'branch-1',
        },
      } as any)

      // Superuser check returns class not in their branch, but should still work
      vi.mocked(pool.query).mockResolvedValue({
        rows: [{ id: 'class-123' }],
      } as any)

      vi.mocked(bookingsQueries.getClassBookings.run).mockResolvedValue([])

      const result = await getClassBookings('class-123')

      expect(result).toEqual([])
    })
  })

  describe('adminRemoveBooking', () => {
    it('should throw error when user is not authenticated', async () => {
      vi.mocked(getSession).mockResolvedValue(null)

      await expect(adminRemoveBooking('booking-123')).rejects.toThrow(
        'No autorizado'
      )
    })

    it('should throw error when user is not admin or superuser', async () => {
      vi.mocked(getSession).mockResolvedValue({
        user: {
          id: 'user-1',
          role: 'client',
          branchId: 'branch-1',
        },
      } as any)

      await expect(adminRemoveBooking('booking-123')).rejects.toThrow(
        'No autorizado'
      )
    })

    it('should throw error when booking not found', async () => {
      vi.mocked(getSession).mockResolvedValue({
        user: {
          id: 'admin-1',
          role: 'admin',
          branchId: 'branch-1',
        },
      } as any)

      mockClient.query.mockResolvedValue({ rows: [] } as any)
      vi.mocked(bookingsQueries.getBookingDetails.run).mockResolvedValue([])

      await expect(adminRemoveBooking('booking-123')).rejects.toThrow(
        'Reserva no encontrada'
      )
    })

    it('should throw error when admin tries to remove booking from different branch', async () => {
      vi.mocked(getSession).mockResolvedValue({
        user: {
          id: 'admin-1',
          role: 'admin',
          branchId: 'branch-1',
        },
      } as any)

      mockClient.query.mockResolvedValue({ rows: [] } as any)
      vi.mocked(bookingsQueries.getBookingDetails.run).mockResolvedValue([
        {
          id: 'booking-123',
          status: 'confirmed',
          branchId: 'branch-2', // Different branch
          class_id: 'class-1',
          package_id: 'package-1',
        },
      ] as any)

      await expect(adminRemoveBooking('booking-123')).rejects.toThrow(
        'No tienes acceso a esta reserva'
      )
    })

    it('should successfully remove a confirmed booking and promote waitlist', async () => {
      vi.mocked(getSession).mockResolvedValue({
        user: {
          id: 'admin-1',
          role: 'admin',
          branchId: 'branch-1',
        },
      } as any)

      mockClient.query
        .mockResolvedValueOnce({ rows: [] }) // BEGIN
        .mockResolvedValueOnce({ rows: [] }) // COMMIT

      vi.mocked(bookingsQueries.getBookingDetails.run).mockResolvedValue([
        {
          id: 'booking-123',
          status: 'confirmed',
          branch_id: 'branch-1',
          class_id: 'class-1',
          package_id: 'package-1',
        },
      ] as any)

      vi.mocked(bookingsQueries.cancelBookingById.run).mockResolvedValue([])
      vi.mocked(
        bookingsQueries.getPackageClassesRemaining.run
      ).mockResolvedValue([{ classes_remaining: 5 }] as any)
      vi.mocked(bookingsQueries.updatePackageClasses.run).mockResolvedValue([])
      vi.mocked(bookingsQueries.getNextWaitlistBooking.run).mockResolvedValue([
        { id: 'waitlist-booking-1', package_id: 'package-2' },
      ] as any)
      vi.mocked(bookingsQueries.promoteWaitlistBooking.run).mockResolvedValue(
        []
      )

      const result = await adminRemoveBooking('booking-123')

      expect(result).toEqual({ success: true })
      expect(bookingsQueries.cancelBookingById.run).toHaveBeenCalled()
      expect(bookingsQueries.updatePackageClasses.run).toHaveBeenCalledWith(
        { packageId: 'package-1', delta: 1 },
        expect.anything()
      )
      expect(bookingsQueries.promoteWaitlistBooking.run).toHaveBeenCalled()
      expect(logAdminAction).toHaveBeenCalledWith(
        'admin-1',
        'remove_booking',
        'booking',
        'booking-123',
        'Removed user from class',
        expect.any(Object)
      )
      expect(revalidatePath).toHaveBeenCalledWith('/admin/classes')
    })

    it('should handle waitlisted booking removal without promotion', async () => {
      vi.mocked(getSession).mockResolvedValue({
        user: {
          id: 'admin-1',
          role: 'admin',
          branchId: 'branch-1',
        },
      } as any)

      mockClient.query.mockResolvedValue({ rows: [] })

      vi.mocked(bookingsQueries.getBookingDetails.run).mockResolvedValue([
        {
          id: 'booking-123',
          status: 'waitlisted',
          branch_id: 'branch-1',
          class_id: 'class-1',
          package_id: 'package-1',
        },
      ] as any)

      vi.mocked(bookingsQueries.cancelBookingById.run).mockResolvedValue([])

      const result = await adminRemoveBooking('booking-123')

      expect(result).toEqual({ success: true })
      // Should not try to return classes or promote waitlist for waitlisted booking
      expect(
        bookingsQueries.getPackageClassesRemaining.run
      ).not.toHaveBeenCalled()
      expect(bookingsQueries.getNextWaitlistBooking.run).not.toHaveBeenCalled()
    })

    it('should handle unlimited package (null classes_remaining)', async () => {
      vi.mocked(getSession).mockResolvedValue({
        user: {
          id: 'admin-1',
          role: 'admin',
          branchId: 'branch-1',
        },
      } as any)

      mockClient.query.mockResolvedValue({ rows: [] })

      vi.mocked(bookingsQueries.getBookingDetails.run).mockResolvedValue([
        {
          id: 'booking-123',
          status: 'confirmed',
          branch_id: 'branch-1',
          class_id: 'class-1',
          package_id: 'package-1',
        },
      ] as any)

      vi.mocked(bookingsQueries.cancelBookingById.run).mockResolvedValue([])
      vi.mocked(
        bookingsQueries.getPackageClassesRemaining.run
      ).mockResolvedValue([
        { classes_remaining: null }, // Unlimited
      ] as any)
      vi.mocked(bookingsQueries.getNextWaitlistBooking.run).mockResolvedValue(
        []
      )

      const result = await adminRemoveBooking('booking-123')

      expect(result).toEqual({ success: true })
      // Should not call updatePackageClasses for unlimited package
      expect(bookingsQueries.updatePackageClasses.run).not.toHaveBeenCalled()
    })

    it('should allow superuser to remove booking from any branch', async () => {
      vi.mocked(getSession).mockResolvedValue({
        user: {
          id: 'superuser-1',
          role: 'superuser',
          branchId: 'branch-1',
        },
      } as any)

      mockClient.query.mockResolvedValue({ rows: [] })

      vi.mocked(bookingsQueries.getBookingDetails.run).mockResolvedValue([
        {
          id: 'booking-123',
          status: 'confirmed',
          branch_id: 'branch-2', // Different branch
          class_id: 'class-1',
          package_id: 'package-1',
        },
      ] as any)

      vi.mocked(bookingsQueries.cancelBookingById.run).mockResolvedValue([])
      vi.mocked(
        bookingsQueries.getPackageClassesRemaining.run
      ).mockResolvedValue([{ classes_remaining: null }] as any)
      vi.mocked(bookingsQueries.getNextWaitlistBooking.run).mockResolvedValue(
        []
      )

      const result = await adminRemoveBooking('booking-123')

      expect(result).toEqual({ success: true })
    })

    it('should rollback transaction on error', async () => {
      vi.mocked(getSession).mockResolvedValue({
        user: {
          id: 'admin-1',
          role: 'admin',
          branchId: 'branch-1',
        },
      } as any)

      mockClient.query.mockResolvedValue({ rows: [] })

      vi.mocked(bookingsQueries.getBookingDetails.run).mockResolvedValue([
        {
          id: 'booking-123',
          status: 'confirmed',
          branch_id: 'branch-1',
          class_id: 'class-1',
          package_id: 'package-1',
        },
      ] as any)

      vi.mocked(bookingsQueries.cancelBookingById.run).mockRejectedValue(
        new Error('Database error')
      )

      await expect(adminRemoveBooking('booking-123')).rejects.toThrow(
        'Database error'
      )
      expect(mockClient.query).toHaveBeenCalledWith('ROLLBACK')
      expect(mockClient.release).toHaveBeenCalled()
    })
  })
})
