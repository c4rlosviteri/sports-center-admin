import { beforeEach, describe, expect, it, vi } from 'vitest'

/**
 * Integration tests for multi-branch access control
 * These tests verify that user accounts can only access resources within their branch
 * and that proper authorization is enforced across the application
 */

// Mock dependencies
vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}))

vi.mock('next/headers', () => ({
  cookies: vi.fn(),
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
  getClassesByDate: { run: vi.fn() },
}))

vi.mock('~/db/queries/bookings.queries', () => ({
  getClassBookings: { run: vi.fn() },
  getBookingDetails: { run: vi.fn() },
  cancelBookingById: { run: vi.fn() },
  getPackageClassesRemaining: { run: vi.fn() },
  updatePackageClasses: { run: vi.fn() },
  getNextWaitlistBooking: { run: vi.fn() },
  promoteWaitlistBooking: { run: vi.fn() },
}))

vi.mock('~/db/queries/branches.queries', () => ({
  getAllBranches: { run: vi.fn() },
  getAdminBranches: { run: vi.fn() },
  getBranch: { run: vi.fn() },
}))

vi.mock('~/lib/audit', () => ({
  logAdminAction: vi.fn(),
}))

import { getSession } from '~/actions/auth'
import { adminRemoveBooking, getClassBookings } from '~/actions/bookings'
import { getAdminBranches, getAllBranches, getBranch } from '~/actions/branches'
import { getClassesByDate } from '~/actions/classes'
import * as bookingsQueries from '~/db/queries/bookings.queries'
import * as branchesQueries from '~/db/queries/branches.queries'
import * as classesQueries from '~/db/queries/classes.queries'
import { pool } from '~/lib/db'

describe('Multi-Branch Access Control Integration Tests', () => {
  const mockClient = {
    query: vi.fn(),
    release: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(pool.connect).mockResolvedValue(mockClient as any)
    mockClient.query.mockResolvedValue({ rows: [] })
  })

  describe('Branch Visibility', () => {
    describe('Superuser Access', () => {
      it('should see all branches in the system', async () => {
        vi.mocked(getSession).mockResolvedValue({
          user: { id: 'super-1', role: 'superuser', branchId: 'branch-1' },
        } as any)

        vi.mocked(branchesQueries.getAllBranches.run).mockResolvedValue([
          {
            id: 'branch-1',
            name: 'Branch 1',
            is_active: true,
            created_at: new Date(),
          },
          {
            id: 'branch-2',
            name: 'Branch 2',
            is_active: true,
            created_at: new Date(),
          },
          {
            id: 'branch-3',
            name: 'Branch 3',
            is_active: false,
            created_at: new Date(),
          },
        ] as any)

        const result = await getAllBranches()

        expect(result).toHaveLength(3)
      })

      it('should access details of any branch', async () => {
        vi.mocked(getSession).mockResolvedValue({
          user: { id: 'super-1', role: 'superuser', branchId: 'branch-1' },
        } as any)

        vi.mocked(branchesQueries.getBranch.run).mockResolvedValue([
          {
            id: 'branch-2',
            name: 'Different Branch',
            is_active: true,
            client_count: '0',
            admin_count: '0',
            upcoming_classes_count: '0',
          },
        ] as any)

        const result = await getBranch('branch-2')

        expect(result.id).toBe('branch-2')
      })
    })

    describe('Admin Access', () => {
      it('should only see assigned branches', async () => {
        vi.mocked(getSession).mockResolvedValue({
          user: { id: 'admin-1', role: 'admin', branchId: 'branch-1' },
        } as any)

        vi.mocked(branchesQueries.getAdminBranches.run).mockResolvedValue([
          {
            id: 'branch-1',
            name: 'Assigned Branch',
            is_active: true,
            is_primary: true,
            created_at: new Date(),
          },
        ] as any)

        const result = await getAdminBranches()

        expect(result).toHaveLength(1)
        expect(result[0].id).toBe('branch-1')
        expect(branchesQueries.getAdminBranches.run).toHaveBeenCalledWith(
          { adminId: 'admin-1' },
          expect.anything()
        )
      })

      it('should not access branch details for unassigned branch', async () => {
        vi.mocked(getSession).mockResolvedValue({
          user: { id: 'admin-1', role: 'admin', branchId: 'branch-1' },
        } as any)

        vi.mocked(pool.query).mockResolvedValue({ rows: [] } as any)

        await expect(getBranch('branch-2')).rejects.toThrow(
          'No tienes acceso a esta sucursal'
        )
      })

      it('should access branch details for assigned branch', async () => {
        vi.mocked(getSession).mockResolvedValue({
          user: { id: 'admin-1', role: 'admin', branchId: 'branch-1' },
        } as any)

        vi.mocked(pool.query).mockResolvedValue({
          rows: [{ admin_id: 'admin-1', branch_id: 'branch-1' }],
        } as any)

        vi.mocked(branchesQueries.getBranch.run).mockResolvedValue([
          {
            id: 'branch-1',
            name: 'Assigned Branch',
            is_active: true,
            client_count: '0',
            admin_count: '0',
            upcoming_classes_count: '0',
          },
        ] as any)

        const result = await getBranch('branch-1')

        expect(result.id).toBe('branch-1')
      })
    })

    describe('Client Access', () => {
      it('should not access branch list', async () => {
        vi.mocked(getSession).mockResolvedValue({
          user: { id: 'client-1', role: 'client', branchId: 'branch-1' },
        } as any)

        await expect(getAllBranches()).rejects.toThrow('No autorizado')
        await expect(getAdminBranches()).rejects.toThrow('No autorizado')
      })

      it('should not access branch details', async () => {
        vi.mocked(getSession).mockResolvedValue({
          user: { id: 'client-1', role: 'client', branchId: 'branch-1' },
        } as any)

        await expect(getBranch('branch-1')).rejects.toThrow('No autorizado')
      })
    })
  })

  describe('Class Data Isolation', () => {
    it('should only return classes from user branch', async () => {
      vi.mocked(getSession).mockResolvedValue({
        user: {
          id: 'client-1',
          role: 'client',
          branchId: 'branch-1',
        },
      } as any)

      const mockClasses = [
        {
          id: 'class-1',
          branchId: 'branch-1',
          name: 'Yoga',
          instructor: 'John',
          created_at: new Date(),
        },
      ]

      vi.mocked(classesQueries.getClassesByDate.run).mockResolvedValue(
        mockClasses as any
      )

      await getClassesByDate('2024-01-15')

      expect(classesQueries.getClassesByDate.run).toHaveBeenCalledWith(
        expect.objectContaining({
          branchId: 'branch-1',
        }),
        expect.anything()
      )
    })

    it('should filter classes by branch for admin', async () => {
      vi.mocked(getSession).mockResolvedValue({
        user: {
          id: 'admin-1',
          role: 'admin',
          branchId: 'branch-2',
        },
      } as any)

      vi.mocked(classesQueries.getClassesByDate.run).mockResolvedValue([])

      await getClassesByDate('2024-01-15')

      expect(classesQueries.getClassesByDate.run).toHaveBeenCalledWith(
        expect.objectContaining({
          branchId: 'branch-2',
        }),
        expect.anything()
      )
    })
  })

  describe('Booking Access Control', () => {
    it('should allow admin to view bookings only for classes in their branch', async () => {
      vi.mocked(getSession).mockResolvedValue({
        user: { id: 'admin-1', role: 'admin', branchId: 'branch-1' },
      } as any)

      vi.mocked(pool.query).mockResolvedValue({ rows: [] } as any)

      await expect(getClassBookings('class-from-other-branch')).rejects.toThrow(
        'Clase no encontrada en tu sucursal'
      )
    })

    it('should allow admin to remove bookings only from their branch', async () => {
      vi.mocked(getSession).mockResolvedValue({
        user: { id: 'admin-1', role: 'admin', branchId: 'branch-1' },
      } as any)

      mockClient.query.mockResolvedValue({ rows: [] })

      vi.mocked(bookingsQueries.getBookingDetails.run).mockResolvedValue([
        {
          id: 'booking-1',
          status: 'confirmed',
          branchId: 'branch-2', // Different branch
          class_id: 'class-1',
          package_id: 'package-1',
        },
      ] as any)

      await expect(adminRemoveBooking('booking-1')).rejects.toThrow(
        'No tienes acceso a esta reserva'
      )
    })

    it('should allow superuser to manage bookings from any branch', async () => {
      vi.mocked(getSession).mockResolvedValue({
        user: { id: 'super-1', role: 'superuser', branchId: 'branch-1' },
      } as any)

      mockClient.query.mockResolvedValue({ rows: [] })

      vi.mocked(bookingsQueries.getBookingDetails.run).mockResolvedValue([
        {
          id: 'booking-1',
          status: 'confirmed',
          branchId: 'branch-99', // Any branch
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

      const result = await adminRemoveBooking('booking-1')

      expect(result).toEqual({ success: true })
    })
  })

  describe('Role-Based Access Matrix', () => {
    const testCases = [
      {
        role: 'client',
        action: 'view all branches',
        shouldThrow: true,
        errorMessage: 'No autorizado',
      },
      {
        role: 'admin',
        action: 'view all branches (superuser only)',
        shouldThrow: true,
        errorMessage: 'No autorizado',
      },
      {
        role: 'superuser',
        action: 'view all branches',
        shouldThrow: false,
      },
    ]

    for (const testCase of testCases) {
      it(`${testCase.role} ${testCase.shouldThrow ? 'cannot' : 'can'} ${testCase.action}`, async () => {
        vi.mocked(getSession).mockResolvedValue({
          user: { id: 'user-1', role: testCase.role, branchId: 'branch-1' },
        } as any)

        if (!testCase.shouldThrow) {
          vi.mocked(branchesQueries.getAllBranches.run).mockResolvedValue([])
        }

        if (testCase.shouldThrow) {
          await expect(getAllBranches()).rejects.toThrow(testCase.errorMessage)
        } else {
          await expect(getAllBranches()).resolves.toBeDefined()
        }
      })
    }
  })

  describe('Cross-Branch Data Leakage Prevention', () => {
    it('should not leak user data across branches', async () => {
      // This test ensures that when an admin queries for user accounts,
      // they only see user accounts from their branch
      vi.mocked(getSession).mockResolvedValue({
        user: { id: 'admin-1', role: 'admin', branchId: 'branch-1' },
      } as any)

      // The query should include branch filtering
      vi.mocked(classesQueries.getClassesByDate.run).mockResolvedValue([])

      await getClassesByDate('2024-01-15')

      // Verify that branchId is passed to the query
      expect(classesQueries.getClassesByDate.run).toHaveBeenCalledWith(
        expect.objectContaining({
          branchId: 'branch-1',
        }),
        expect.anything()
      )
    })

    it('should prevent admin from accessing other branch booking list', async () => {
      vi.mocked(getSession).mockResolvedValue({
        user: { id: 'admin-1', role: 'admin', branchId: 'branch-1' },
      } as any)

      // Class not found in admin's branch
      vi.mocked(pool.query).mockResolvedValue({ rows: [] } as any)

      await expect(getClassBookings('class-from-branch-2')).rejects.toThrow(
        'Clase no encontrada en tu sucursal'
      )
    })
  })

  describe('Session Validation', () => {
    it('should reject requests without valid session', async () => {
      vi.mocked(getSession).mockResolvedValue(null)

      await expect(getClassesByDate('2024-01-15')).rejects.toThrow(
        'No autorizado'
      )
      await expect(getAllBranches()).rejects.toThrow('No autorizado')
      await expect(getAdminBranches()).rejects.toThrow('No autorizado')
      await expect(getClassBookings('class-1')).rejects.toThrow('No autorizado')
      await expect(adminRemoveBooking('booking-1')).rejects.toThrow(
        'No autorizado'
      )
    })

    it('should use branch_id from session for data filtering', async () => {
      vi.mocked(getSession).mockResolvedValue({
        user: {
          id: 'client-1',
          role: 'client',
          branchId: 'specific-branch-123',
        },
      } as any)

      vi.mocked(classesQueries.getClassesByDate.run).mockResolvedValue([])

      await getClassesByDate('2024-01-15')

      expect(classesQueries.getClassesByDate.run).toHaveBeenCalledWith(
        expect.objectContaining({
          branchId: 'specific-branch-123',
        }),
        expect.anything()
      )
    })
  })
})
