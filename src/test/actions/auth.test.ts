import { beforeEach, describe, expect, it, vi } from 'vitest'

// Mock Better Auth before importing
vi.mock('~/lib/auth', async () => {
  const actual = await vi.importActual('~/lib/auth')
  return {
    ...actual,
    auth: {
      api: {
        getSession: vi.fn(),
        signUpEmail: vi.fn(),
        signInEmail: vi.fn(),
        signOut: vi.fn(),
      },
      $Infer: {
        Session: {},
      },
    },
  }
})

vi.mock('next/headers', () => ({
  cookies: vi.fn().mockResolvedValue({
    delete: vi.fn(),
  }),
  headers: vi.fn(),
}))

vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}))

vi.mock('~/lib/db', () => ({
  pool: {
    query: vi.fn(),
    connect: vi.fn(),
  },
}))

import { cookies, headers } from 'next/headers'
import { redirect } from 'next/navigation'
// Import after mocks
import { getSession, logoutAction } from '~/actions/auth'
import { auth } from '~/lib/auth'
import { pool } from '~/lib/db'

describe('auth actions - Better Auth', () => {
  const mockHeaders = new Map()

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(headers).mockReturnValue(mockHeaders as any)
  })

  describe('getSession', () => {
    it('should return null when no session exists', async () => {
      vi.mocked(auth.api.getSession).mockResolvedValue(null)

      const session = await getSession()

      expect(session).toBeNull()
      expect(auth.api.getSession).toHaveBeenCalledWith({
        headers: mockHeaders,
      })
    })

    it('should return user session with branch info when valid', async () => {
      const mockBetterAuthSession = {
        user: {
          id: '660e8400-e29b-41d4-a716-446655440000',
          email: 'admin@biciantro.ec',
          name: 'Carlos Admin',
          firstName: 'Carlos',
          lastName: 'Admin',
          role: 'superuser',
          branchId: '550e8400-e29b-41d4-a716-446655440000',
          dateOfBirth: '1985-05-15',
          idNumber: '1712345678',
          address: 'Quito, Ecuador',
          phone: '+593 99 123 4567',
          termsAcceptedAt: null,
        },
      }

      const mockUserWithBranch = {
        id: '660e8400-e29b-41d4-a716-446655440000',
        email: 'admin@biciantro.ec',
        name: 'Carlos Admin',
        first_name: 'Carlos',
        last_name: 'Admin',
        role: 'superuser',
        branch_id: '550e8400-e29b-41d4-a716-446655440000',
        branch_name: 'Biciantro Norte',
        date_of_birth: '1985-05-15',
        id_number: '1712345678',
        address: 'Quito, Ecuador',
        phone: '+593 99 123 4567',
        terms_accepted_at: null,
      }

      vi.mocked(auth.api.getSession).mockResolvedValue(
        mockBetterAuthSession as any
      )
      vi.mocked(pool.query).mockResolvedValue({
        rows: [mockUserWithBranch],
      } as any)

      const session = await getSession()

      expect(session).toEqual({
        user: {
          id: '660e8400-e29b-41d4-a716-446655440000',
          email: 'admin@biciantro.ec',
          name: 'Carlos Admin',
          firstName: 'Carlos',
          lastName: 'Admin',
          role: 'superuser',
          branchId: '550e8400-e29b-41d4-a716-446655440000',
          branchName: 'Biciantro Norte',
          dateOfBirth: '1985-05-15',
          idNumber: '1712345678',
          address: 'Quito, Ecuador',
          phone: '+593 99 123 4567',
          termsAcceptedAt: null,
        },
      })
    })

    it('should return null when user not found in database', async () => {
      const mockBetterAuthSession = {
        user: {
          id: 'non-existent-id',
          email: 'test@test.com',
        },
      }

      vi.mocked(auth.api.getSession).mockResolvedValue(
        mockBetterAuthSession as any
      )
      vi.mocked(pool.query).mockResolvedValue({ rows: [] } as any)

      const session = await getSession()

      expect(session).toBeNull()
    })
  })

  describe('logoutAction', () => {
    it('should delete session from database and clear cookie when session exists', async () => {
      const mockSession = {
        user: {
          id: '660e8400-e29b-41d4-a716-446655440000',
          email: 'test@test.com',
        },
      }
      vi.mocked(auth.api.getSession).mockResolvedValue(mockSession as any)
      const mockCookieDelete = vi.fn()
      vi.mocked(cookies).mockResolvedValue({
        delete: mockCookieDelete,
      } as any)

      await logoutAction()

      expect(pool.query).toHaveBeenCalledWith(
        'DELETE FROM "session" WHERE "userId" = $1',
        ['660e8400-e29b-41d4-a716-446655440000']
      )
      expect(mockCookieDelete).toHaveBeenCalledWith('better-auth.session_token')
      expect(redirect).toHaveBeenCalledWith('/login')
    })

    it('should clear cookie even when no session exists', async () => {
      vi.mocked(auth.api.getSession).mockResolvedValue(null)
      const mockCookieDelete = vi.fn()
      vi.mocked(cookies).mockResolvedValue({
        delete: mockCookieDelete,
      } as any)

      await logoutAction()

      expect(pool.query).not.toHaveBeenCalled()
      expect(mockCookieDelete).toHaveBeenCalledWith('better-auth.session_token')
      expect(redirect).toHaveBeenCalledWith('/login')
    })
  })
})
