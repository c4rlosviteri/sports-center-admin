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

vi.mock('~/db/queries/classes.queries', () => ({
  getClassesByDate: {
    run: vi.fn(),
  },
  getClassesByMonth: {
    run: vi.fn(),
  },
}))

vi.mock('~/lib/booking-service', () => ({
  bookClassWithPackage: vi.fn(),
  cancelBooking: vi.fn(),
}))

import { revalidatePath } from 'next/cache'
import type { SessionUser } from '~/actions/auth'
import { getSession } from '~/actions/auth'
import {
  cancelBooking,
  createBooking,
  getClassesByDate,
  getClassesByMonth,
} from '~/actions/classes'
import * as classesQueries from '~/db/queries/classes.queries'
import {
  bookClassWithPackage,
  cancelBooking as cancelBookingService,
} from '~/lib/booking-service'
import { pool } from '~/lib/db'

describe('classes actions', () => {
  const mockClient = {
    query: vi.fn(),
    release: vi.fn(),
  }

  const mockSession = {
    user: {
      id: 'user-123',
      email: 'test@test.com',
      name: 'John Doe',
      firstName: 'John',
      lastName: 'Doe',
      role: 'client',
      branchId: 'branch-1',
      branchName: 'Test Branch',
      dateOfBirth: null,
      idNumber: null,
      address: null,
      phone: null,
      termsAcceptedAt: null,
    } satisfies SessionUser,
  }

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(pool.connect).mockResolvedValue(
      mockClient as unknown as ReturnType<typeof pool.connect> extends Promise<
        infer T
      >
        ? T
        : never
    )
    vi.mocked(getSession).mockResolvedValue(mockSession)
  })

  describe('getClassesByDate', () => {
    it('should throw error when user is not authenticated', async () => {
      vi.mocked(getSession).mockResolvedValue(null)

      await expect(getClassesByDate('2024-01-15')).rejects.toThrow(
        'No autorizado'
      )
    })

    it('should return classes for the specified date', async () => {
      const mockClasses = [
        {
          id: 'class-1',
          branch_id: 'branch-1',
          instructor: 'John Instructor',
          name: 'Yoga',
          scheduled_at: new Date('2024-01-15T10:00:00Z'),
          duration_minutes: 60,
          capacity: 20,
          waitlist_capacity: 5,
          created_at: new Date(),
          confirmed_count: 5,
          waitlist_count: 2,
          user_booking_status: null,
          user_booking_id: null,
        },
      ]

      vi.mocked(classesQueries.getClassesByDate.run).mockResolvedValue(
        mockClasses
      )

      const result = await getClassesByDate('2024-01-15')

      expect(result).toHaveLength(1)
      expect(result[0]).toMatchObject({
        id: 'class-1',
        className: 'Yoga',
        instructorName: 'John Instructor',
        confirmedCount: 5,
        waitlistCount: 2,
        bookedCount: 7,
      })
    })

    it('should handle empty results', async () => {
      vi.mocked(classesQueries.getClassesByDate.run).mockResolvedValue([])

      const result = await getClassesByDate('2024-01-15')

      expect(result).toEqual([])
    })
  })

  describe('getClassesByMonth', () => {
    it('should throw error when user is not authenticated', async () => {
      vi.mocked(getSession).mockResolvedValue(null)

      await expect(getClassesByMonth(2024, 1)).rejects.toThrow('No autorizado')
    })

    it('should return classes for the specified month', async () => {
      const mockClasses = [
        {
          id: 'class-1',
          branch_id: 'branch-1',
          instructor: 'Instructor',
          name: 'Spinning',
          scheduled_at: new Date('2024-01-10T08:00:00Z'),
          duration_minutes: 45,
          capacity: 15,
          waitlist_capacity: 5,
          created_at: new Date(),
          confirmed_count: 10,
          waitlist_count: 0,
          user_booking_status: 'confirmed' as const,
          user_booking_id: 'booking-1',
        },
      ]

      vi.mocked(classesQueries.getClassesByMonth.run).mockResolvedValue(
        mockClasses
      )

      const result = await getClassesByMonth(2024, 1)

      expect(result).toHaveLength(1)
      expect(result[0].userBookingStatus).toBe('confirmed')
      expect(classesQueries.getClassesByMonth.run).toHaveBeenCalledWith(
        expect.objectContaining({
          branchId: 'branch-1',
          userId: 'user-123',
        }),
        pool
      )
    })
  })

  describe('createBooking', () => {
    it('should throw error when user is not authenticated', async () => {
      vi.mocked(getSession).mockResolvedValue(null)

      // Use valid UUID format since validation happens before auth check
      await expect(
        createBooking('550e8400-e29b-41d4-a716-446655440000')
      ).rejects.toThrow('No autorizado')
    })

    it('should throw error for invalid class ID format', async () => {
      await expect(createBooking('invalid-id')).rejects.toThrow()
    })

    it('should throw error when user already has confirmed booking', async () => {
      mockClient.query.mockResolvedValueOnce({
        rows: [{ id: 'booking-1', status: 'confirmed' }],
      })

      await expect(
        createBooking('550e8400-e29b-41d4-a716-446655440000')
      ).rejects.toThrow('Ya tienes una reserva confirmada para esta clase')
    })

    it('should throw error when user already on waitlist', async () => {
      mockClient.query.mockResolvedValueOnce({
        rows: [{ id: 'booking-1', status: 'waitlisted' }],
      })

      await expect(
        createBooking('550e8400-e29b-41d4-a716-446655440000')
      ).rejects.toThrow('Ya estás en la lista de espera para esta clase')
    })

    it('should successfully create a booking', async () => {
      const classId = '550e8400-e29b-41d4-a716-446655440000'

      // No existing booking
      mockClient.query.mockResolvedValueOnce({ rows: [] })

      // Class info
      mockClient.query.mockResolvedValueOnce({
        rows: [
          {
            id: classId,
            scheduled_at: new Date(Date.now() + 24 * 60 * 60 * 1000),
            capacity: 20,
            waitlist_capacity: 5,
            booked_count: '5',
            waitlist_count: '0',
            effective_booking_hours_before: '0',
          },
        ],
      })

      // Package info
      mockClient.query.mockResolvedValueOnce({
        rows: [
          {
            id: 'package-1',
            expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            classes_remaining: 10,
            package_name: 'Basic Package',
          },
        ],
      })

      const mockBookingResult = {
        bookingId: 'booking-new',
        status: 'confirmed' as const,
        usedPackage: true,
      }

      vi.mocked(bookClassWithPackage).mockResolvedValue(mockBookingResult)

      const result = await createBooking(classId)

      expect(result).toEqual(mockBookingResult)
      expect(revalidatePath).toHaveBeenCalledWith('/client/classes')
    })
  })

  describe('cancelBooking', () => {
    it('should throw error when user is not authenticated', async () => {
      vi.mocked(getSession).mockResolvedValue(null)

      await expect(
        cancelBooking('550e8400-e29b-41d4-a716-446655440000')
      ).rejects.toThrow('No autorizado')
    })

    it('should throw error when booking not found', async () => {
      mockClient.query.mockResolvedValueOnce({ rows: [] })

      await expect(
        cancelBooking('550e8400-e29b-41d4-a716-446655440000')
      ).rejects.toThrow('Reserva no encontrada')
    })

    it('should throw error when user does not own the booking', async () => {
      mockClient.query.mockResolvedValueOnce({
        rows: [
          {
            id: 'booking-1',
            user_id: 'other-user',
            status: 'confirmed',
            scheduled_at: new Date(),
          },
        ],
      })

      await expect(
        cancelBooking('550e8400-e29b-41d4-a716-446655440000')
      ).rejects.toThrow('No autorizado')
    })

    it('should throw error when booking already cancelled', async () => {
      mockClient.query.mockResolvedValueOnce({
        rows: [
          {
            id: 'booking-1',
            user_id: 'user-123',
            status: 'cancelled',
            scheduled_at: new Date(),
          },
        ],
      })

      await expect(
        cancelBooking('550e8400-e29b-41d4-a716-446655440000')
      ).rejects.toThrow('Esta reserva ya ha sido cancelada')
    })

    it('should successfully cancel a booking', async () => {
      const scheduledAt = new Date(Date.now() + 24 * 60 * 60 * 1000)

      // Get booking info
      mockClient.query.mockResolvedValueOnce({
        rows: [
          {
            id: 'booking-1',
            user_id: 'user-123',
            status: 'confirmed',
            scheduled_at: scheduledAt,
          },
        ],
      })

      // Get branch settings
      mockClient.query.mockResolvedValueOnce({
        rows: [{ cancellation_hours_before: 2 }],
      })

      vi.mocked(cancelBookingService).mockResolvedValue()

      const result = await cancelBooking('550e8400-e29b-41d4-a716-446655440000')

      expect(result).toEqual({ success: true })
      expect(revalidatePath).toHaveBeenCalledWith('/client')
      expect(revalidatePath).toHaveBeenCalledWith('/client/classes')
    })
  })
})
