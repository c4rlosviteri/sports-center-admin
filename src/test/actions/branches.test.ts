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

vi.mock('~/db/queries/branches.queries', () => ({
  getAllBranches: { run: vi.fn() },
  getAdminBranches: { run: vi.fn() },
  getBranch: { run: vi.fn() },
}))

vi.mock('~/lib/audit', () => ({
  logAdminAction: vi.fn(),
}))

import { revalidatePath } from 'next/cache'
import { getSession } from '~/actions/auth'
import {
  assignAdminToBranch,
  createBranch,
  deleteBranch,
  getAdminBranches,
  getAllBranches,
  getBranch,
  removeAdminFromBranch,
  toggleBranchStatus,
  transferClientToBranch,
  updateBranch,
  updateBranchSettings,
} from '~/actions/branches'
import * as branchesQueries from '~/db/queries/branches.queries'
import { logAdminAction } from '~/lib/audit'
import { pool } from '~/lib/db'

describe('branches actions', () => {
  const mockClient = {
    query: vi.fn(),
    release: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(pool.connect).mockResolvedValue(mockClient as any)
  })

  describe('getAllBranches', () => {
    it('should throw error when user is not authenticated', async () => {
      vi.mocked(getSession).mockResolvedValue(null)

      await expect(getAllBranches()).rejects.toThrow('No autorizado')
    })

    it('should throw error when user is not superuser', async () => {
      vi.mocked(getSession).mockResolvedValue({
        user: { id: 'admin-1', role: 'admin', branch_id: 'branch-1' },
      } as any)

      await expect(getAllBranches()).rejects.toThrow('No autorizado')
    })

    it('should return all branches for superuser', async () => {
      vi.mocked(getSession).mockResolvedValue({
        user: { id: 'super-1', role: 'superuser', branch_id: 'branch-1' },
      } as any)

      const mockBranches = [
        {
          id: 'branch-1',
          name: 'Main Branch',
          address: '123 Main St',
          phone: '123456',
          email: 'main@test.com',
          is_active: true,
          cancellation_hours_before: 2,
          booking_hours_before: 0,
          created_at: new Date(),
          updated_at: null,
        },
        {
          id: 'branch-2',
          name: 'Second Branch',
          address: '456 Second St',
          phone: '789012',
          email: 'second@test.com',
          is_active: false,
          cancellation_hours_before: 4,
          booking_hours_before: 1,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ]

      vi.mocked(branchesQueries.getAllBranches.run).mockResolvedValue(
        mockBranches
      )

      const result = await getAllBranches()

      expect(result).toHaveLength(2)
      expect(result[0]).toMatchObject({
        id: 'branch-1',
        name: 'Main Branch',
        isActive: true,
        cancellationHoursBefore: 2,
      })
      expect(result[1]).toMatchObject({
        id: 'branch-2',
        name: 'Second Branch',
        isActive: false,
      })
    })
  })

  describe('getAdminBranches', () => {
    it('should throw error when user is client', async () => {
      vi.mocked(getSession).mockResolvedValue({
        user: { id: 'user-1', role: 'client', branch_id: 'branch-1' },
      } as any)

      await expect(getAdminBranches()).rejects.toThrow('No autorizado')
    })

    it('should return all branches for superuser', async () => {
      vi.mocked(getSession).mockResolvedValue({
        user: { id: 'super-1', role: 'superuser', branch_id: 'branch-1' },
      } as any)

      vi.mocked(branchesQueries.getAllBranches.run).mockResolvedValue([
        {
          id: 'branch-1',
          name: 'Branch 1',
          address: '',
          phone: '',
          email: '',
          is_active: true,
          cancellation_hours_before: 2,
          booking_hours_before: 0,
          created_at: new Date(),
          updated_at: null,
        },
      ])

      const result = await getAdminBranches()

      expect(result).toHaveLength(1)
    })

    it('should return only assigned branches for admin', async () => {
      vi.mocked(getSession).mockResolvedValue({
        user: { id: 'admin-1', role: 'admin', branch_id: 'branch-1' },
      } as any)

      vi.mocked(branchesQueries.getAdminBranches.run).mockResolvedValue([
        {
          id: 'branch-1',
          name: 'Assigned Branch',
          address: '',
          phone: '',
          email: '',
          is_active: true,
          is_primary: true,
          booking_hours_before: 0,
          cancellation_hours_before: 2,
          created_at: new Date(),
          updated_at: null,
        },
      ])

      const result = await getAdminBranches()

      expect(result).toHaveLength(1)
      expect(result[0].isPrimary).toBe(true)
      expect(branchesQueries.getAdminBranches.run).toHaveBeenCalledWith(
        { adminId: 'admin-1' },
        pool
      )
    })
  })

  describe('getBranch', () => {
    it('should throw error when admin has no access to branch', async () => {
      vi.mocked(getSession).mockResolvedValue({
        user: { id: 'admin-1', role: 'admin', branch_id: 'branch-1' },
      } as any)

      vi.mocked(pool.query).mockResolvedValue({ rows: [] } as any)

      await expect(getBranch('branch-2')).rejects.toThrow(
        'No tienes acceso a esta sucursal'
      )
    })

    it('should throw error when branch not found', async () => {
      vi.mocked(getSession).mockResolvedValue({
        user: { id: 'super-1', role: 'superuser', branch_id: 'branch-1' },
      } as any)

      vi.mocked(branchesQueries.getBranch.run).mockResolvedValue([])

      await expect(getBranch('nonexistent')).rejects.toThrow(
        'Sucursal no encontrada'
      )
    })

    it('should return branch details', async () => {
      vi.mocked(getSession).mockResolvedValue({
        user: { id: 'super-1', role: 'superuser', branch_id: 'branch-1' },
      } as any)

      vi.mocked(branchesQueries.getBranch.run).mockResolvedValue([
        {
          id: 'branch-1',
          name: 'Main Branch',
          address: '123 Main St',
          phone: '123456',
          email: 'main@test.com',
          is_active: true,
          cancellation_hours_before: 2,
          booking_hours_before: 0,
          timezone: 'America/Guayaquil',
          client_count: '50',
          admin_count: '3',
          upcoming_classes_count: '10',
          created_at: new Date(),
          updated_at: null,
        },
      ])

      const result = await getBranch('branch-1')

      expect(result).toMatchObject({
        id: 'branch-1',
        name: 'Main Branch',
        clientCount: 50,
        adminCount: 3,
        upcomingClassesCount: 10,
      })
    })
  })

  describe('createBranch', () => {
    const createFormData = (data: Record<string, string>) => {
      const formData = new FormData()
      for (const [key, value] of Object.entries(data)) {
        formData.set(key, value)
      }
      return formData
    }

    it('should throw error when not superuser', async () => {
      vi.mocked(getSession).mockResolvedValue({
        user: { id: 'admin-1', role: 'admin', branch_id: 'branch-1' },
      } as any)

      const formData = createFormData({ name: 'New Branch' })

      await expect(createBranch(formData)).rejects.toThrow('No autorizado')
    })

    it('should throw error when name is missing', async () => {
      vi.mocked(getSession).mockResolvedValue({
        user: { id: 'super-1', role: 'superuser', branch_id: 'branch-1' },
      } as any)

      const formData = createFormData({ name: '' })

      await expect(createBranch(formData)).rejects.toThrow(
        'El nombre de la sucursal es requerido'
      )
    })

    it('should create branch with default settings', async () => {
      vi.mocked(getSession).mockResolvedValue({
        user: { id: 'super-1', role: 'superuser', branch_id: 'branch-1' },
      } as any)

      mockClient.query
        .mockResolvedValueOnce({ rows: [] }) // BEGIN
        .mockResolvedValueOnce({ rows: [{ id: 'new-branch-id' }] }) // INSERT branch
        .mockResolvedValueOnce({ rows: [] }) // INSERT branch_settings
        .mockResolvedValueOnce({ rows: [] }) // INSERT notification 1
        .mockResolvedValueOnce({ rows: [] }) // INSERT notification 2
        .mockResolvedValueOnce({ rows: [] }) // INSERT notification 3
        .mockResolvedValueOnce({ rows: [] }) // INSERT notification 4
        .mockResolvedValueOnce({ rows: [] }) // COMMIT

      const formData = createFormData({
        name: 'New Branch',
        address: '789 New St',
        phone: '111222',
        email: 'new@test.com',
      })

      const result = await createBranch(formData)

      expect(result).toEqual({ success: true, branchId: 'new-branch-id' })
      expect(logAdminAction).toHaveBeenCalled()
      expect(revalidatePath).toHaveBeenCalledWith('/admin')
    })
  })

  describe('updateBranch', () => {
    const createFormData = (data: Record<string, string>) => {
      const formData = new FormData()
      for (const [key, value] of Object.entries(data)) {
        formData.set(key, value)
      }
      return formData
    }

    it('should update branch', async () => {
      vi.mocked(getSession).mockResolvedValue({
        user: { id: 'super-1', role: 'superuser', branch_id: 'branch-1' },
      } as any)

      vi.mocked(pool.query).mockResolvedValue({ rows: [] } as any)

      const formData = createFormData({
        name: 'Updated Branch',
        address: 'New Address',
        phone: '999888',
        email: 'updated@test.com',
        isActive: 'true',
      })

      const result = await updateBranch('branch-1', formData)

      expect(result).toEqual({ success: true })
      expect(logAdminAction).toHaveBeenCalled()
    })
  })

  describe('toggleBranchStatus', () => {
    it('should toggle branch status', async () => {
      vi.mocked(getSession).mockResolvedValue({
        user: { id: 'super-1', role: 'superuser', branch_id: 'branch-1' },
      } as any)

      vi.mocked(pool.query).mockResolvedValue({
        rows: [{ is_active: false, name: 'Branch' }],
      } as any)

      const result = await toggleBranchStatus('branch-1')

      expect(result).toEqual({ success: true, isActive: false })
    })

    it('should throw error when branch not found', async () => {
      vi.mocked(getSession).mockResolvedValue({
        user: { id: 'super-1', role: 'superuser', branch_id: 'branch-1' },
      } as any)

      vi.mocked(pool.query).mockResolvedValue({ rows: [] } as any)

      await expect(toggleBranchStatus('nonexistent')).rejects.toThrow(
        'Sucursal no encontrada'
      )
    })
  })

  describe('assignAdminToBranch', () => {
    it('should throw error when user is not admin', async () => {
      vi.mocked(getSession).mockResolvedValue({
        user: { id: 'super-1', role: 'superuser', branch_id: 'branch-1' },
      } as any)

      vi.mocked(pool.query).mockResolvedValue({
        rows: [{ role: 'client' }],
      } as any)

      await expect(
        assignAdminToBranch('user-1', 'branch-1', false)
      ).rejects.toThrow('El usuario debe ser un administrador')
    })

    it('should assign admin to branch', async () => {
      vi.mocked(getSession).mockResolvedValue({
        user: { id: 'super-1', role: 'superuser', branch_id: 'branch-1' },
      } as any)

      vi.mocked(pool.query)
        .mockResolvedValueOnce({ rows: [{ role: 'admin' }] } as any) // User check
        .mockResolvedValueOnce({ rows: [] } as any) // INSERT assignment

      const result = await assignAdminToBranch('admin-1', 'branch-2', false)

      expect(result).toEqual({ success: true })
      expect(logAdminAction).toHaveBeenCalled()
    })

    it('should unset other primaries when setting new primary', async () => {
      vi.mocked(getSession).mockResolvedValue({
        user: { id: 'super-1', role: 'superuser', branch_id: 'branch-1' },
      } as any)

      vi.mocked(pool.query)
        .mockResolvedValueOnce({ rows: [{ role: 'admin' }] } as any) // User check
        .mockResolvedValueOnce({ rows: [] } as any) // UPDATE to unset primaries
        .mockResolvedValueOnce({ rows: [] } as any) // INSERT assignment

      await assignAdminToBranch('admin-1', 'branch-2', true)

      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('SET is_primary = false'),
        ['admin-1']
      )
    })
  })

  describe('removeAdminFromBranch', () => {
    it('should remove admin from branch', async () => {
      vi.mocked(getSession).mockResolvedValue({
        user: { id: 'super-1', role: 'superuser', branch_id: 'branch-1' },
      } as any)

      vi.mocked(pool.query).mockResolvedValue({ rows: [] } as any)

      const result = await removeAdminFromBranch('admin-1', 'branch-1')

      expect(result).toEqual({ success: true })
      expect(logAdminAction).toHaveBeenCalled()
    })
  })

  describe('transferClientToBranch', () => {
    it('should throw error when user is not client', async () => {
      vi.mocked(getSession).mockResolvedValue({
        user: { id: 'admin-1', role: 'admin', branch_id: 'branch-1' },
      } as any)

      vi.mocked(pool.query).mockResolvedValue({
        rows: [{ role: 'admin' }],
      } as any)

      await expect(
        transferClientToBranch('user-1', 'branch-2')
      ).rejects.toThrow('El usuario debe ser un cliente')
    })

    it('should transfer client to new branch', async () => {
      vi.mocked(getSession).mockResolvedValue({
        user: { id: 'admin-1', role: 'admin', branch_id: 'branch-1' },
      } as any)

      vi.mocked(pool.query)
        .mockResolvedValueOnce({
          rows: [
            {
              role: 'client',
              branch_id: 'branch-1',
              first_name: 'John',
              last_name: 'Doe',
            },
          ],
        } as any)
        .mockResolvedValueOnce({ rows: [] } as any) // UPDATE

      const result = await transferClientToBranch('client-1', 'branch-2')

      expect(result).toEqual({ success: true })
      expect(logAdminAction).toHaveBeenCalled()
    })
  })

  describe('updateBranchSettings', () => {
    const createFormData = (data: Record<string, string>) => {
      const formData = new FormData()
      for (const [key, value] of Object.entries(data)) {
        formData.set(key, value)
      }
      return formData
    }

    it('should throw error when admin has no access to branch', async () => {
      vi.mocked(getSession).mockResolvedValue({
        user: { id: 'admin-1', role: 'admin', branch_id: 'branch-1' },
      } as any)

      vi.mocked(pool.query).mockResolvedValue({ rows: [] } as any)

      const formData = createFormData({
        cancellationHoursBefore: '2',
        bookingHoursBefore: '0',
      })

      await expect(updateBranchSettings('branch-2', formData)).rejects.toThrow(
        'No tienes acceso a esta sucursal'
      )
    })

    it('should throw error for invalid cancellation hours', async () => {
      vi.mocked(getSession).mockResolvedValue({
        user: { id: 'super-1', role: 'superuser', branch_id: 'branch-1' },
      } as any)

      const formData = createFormData({
        cancellationHoursBefore: '-1',
        bookingHoursBefore: '0',
      })

      await expect(updateBranchSettings('branch-1', formData)).rejects.toThrow(
        'Horas de cancelación inválidas'
      )
    })

    it('should update branch settings', async () => {
      vi.mocked(getSession).mockResolvedValue({
        user: { id: 'super-1', role: 'superuser', branch_id: 'branch-1' },
      } as any)

      vi.mocked(pool.query).mockResolvedValue({ rows: [] } as any)

      const formData = createFormData({
        cancellationHoursBefore: '4',
        bookingHoursBefore: '2',
      })

      const result = await updateBranchSettings('branch-1', formData)

      expect(result).toEqual({ success: true })
      expect(logAdminAction).toHaveBeenCalled()
    })
  })

  describe('deleteBranch', () => {
    it('should not delete branch with associated data', async () => {
      vi.mocked(getSession).mockResolvedValue({
        user: { id: 'super-1', role: 'superuser', branch_id: 'branch-1' },
      } as any)

      vi.mocked(pool.query).mockResolvedValue({
        rows: [{ users_count: '5', classes_count: '10' }],
      } as any)

      const result = await deleteBranch('branch-1')

      expect(result.success).toBe(false)
      expect(result.message).toContain('5 usuarios')
      expect(result.message).toContain('10 clases')
    })

    it('should delete empty branch', async () => {
      vi.mocked(getSession).mockResolvedValue({
        user: { id: 'super-1', role: 'superuser', branch_id: 'branch-1' },
      } as any)

      vi.mocked(pool.query)
        .mockResolvedValueOnce({
          rows: [{ users_count: '0', classes_count: '0' }],
        } as any)
        .mockResolvedValueOnce({
          rowCount: 1,
          rows: [{ name: 'Deleted Branch' }],
        } as any)

      const result = await deleteBranch('branch-1')

      expect(result).toEqual({ success: true })
      expect(logAdminAction).toHaveBeenCalled()
    })
  })
})
