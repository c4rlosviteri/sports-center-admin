import type { NextRequest } from 'next/server'
import { beforeEach, describe, expect, it, vi } from 'vitest'

// Mock next/headers
vi.mock('next/headers', () => ({
  headers: vi.fn(),
}))

// Mock next/server
vi.mock('next/server', () => ({
  NextResponse: {
    next: vi.fn().mockReturnValue({
      type: 'next',
    }),
    redirect: vi.fn().mockImplementation((url: URL) => ({
      type: 'redirect',
      url: url,
    })),
  },
}))

// Mock auth
vi.mock('~/lib/auth', () => ({
  auth: {
    api: {
      getSession: vi.fn(),
    },
  },
}))

import { headers } from 'next/headers'
import { auth } from '~/lib/auth'
import { config, middleware } from '../../../middleware'

// Helper to create mock request with clone method
function createMockRequest(pathname: string): NextRequest {
  const url = new URL(`http://localhost:3000${pathname}`)
  return {
    nextUrl: {
      pathname: url.pathname,
      clone: vi
        .fn()
        .mockReturnValue(new URL(`http://localhost:3000${pathname}`)),
    },
  } as unknown as NextRequest
}

describe('auth middleware', () => {
  const mockHeaders = new Map<string, string>()

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(headers).mockResolvedValue(mockHeaders as unknown as Headers)
  })

  describe('public routes', () => {
    it('should allow access to /login without authentication', async () => {
      vi.mocked(auth.api.getSession).mockResolvedValue(null)

      const result = await middleware(createMockRequest('/login'))

      expect(result.type).toBe('next')
    })

    it('should allow access to /register without authentication', async () => {
      vi.mocked(auth.api.getSession).mockResolvedValue(null)

      const result = await middleware(createMockRequest('/register'))

      expect(result.type).toBe('next')
    })

    it('should allow access to /forgot-password without authentication', async () => {
      vi.mocked(auth.api.getSession).mockResolvedValue(null)

      const result = await middleware(createMockRequest('/forgot-password'))

      expect(result.type).toBe('next')
    })

    it('should allow access to /reset-password without authentication', async () => {
      vi.mocked(auth.api.getSession).mockResolvedValue(null)

      const result = await middleware(createMockRequest('/reset-password'))

      expect(result.type).toBe('next')
    })

    it('should skip middleware for /api/auth/* routes', async () => {
      const result = await middleware(createMockRequest('/api/auth/sign-in'))

      expect(result.type).toBe('next')
      expect(auth.api.getSession).not.toHaveBeenCalled()
    })

    it('should skip middleware for /api/auth/sign-up', async () => {
      const result = await middleware(createMockRequest('/api/auth/sign-up'))

      expect(result.type).toBe('next')
      expect(auth.api.getSession).not.toHaveBeenCalled()
    })
  })

  describe('protected routes', () => {
    it('should redirect to login when accessing protected route without session', async () => {
      vi.mocked(auth.api.getSession).mockResolvedValue(null)

      const mockReq = createMockRequest('/admin')
      const result = (await middleware(mockReq)) as unknown as {
        type: string
        url: URL
      }

      expect(result.type).toBe('redirect')
      expect(result.url.pathname).toBe('/login')
    })

    it('should redirect to login when accessing /client without session', async () => {
      vi.mocked(auth.api.getSession).mockResolvedValue(null)

      const mockReq = createMockRequest('/client')
      const result = (await middleware(mockReq)) as unknown as {
        type: string
        url: URL
      }

      expect(result.type).toBe('redirect')
      expect(result.url.pathname).toBe('/login')
    })

    it('should redirect to login when accessing root path without session', async () => {
      vi.mocked(auth.api.getSession).mockResolvedValue(null)

      const mockReq = createMockRequest('/')
      const result = (await middleware(mockReq)) as unknown as {
        type: string
        url: URL
      }

      expect(result.type).toBe('redirect')
      expect(result.url.pathname).toBe('/login')
    })
  })

  describe('authenticated users accessing auth pages', () => {
    it('should redirect client to /client when accessing login', async () => {
      const mockSession = { user: { role: 'client' } } as const
      vi.mocked(auth.api.getSession).mockResolvedValue(
        mockSession as unknown as Parameters<
          typeof vi.mocked<typeof auth.api.getSession>
        >[0] extends (...args: unknown[]) => Promise<infer R>
          ? R
          : never
      )

      const mockReq = createMockRequest('/login')
      const result = (await middleware(mockReq)) as unknown as {
        type: string
        url: URL
      }

      expect(result.type).toBe('redirect')
      expect(result.url.pathname).toBe('/client')
    })

    it('should redirect admin to /admin when accessing login', async () => {
      const mockSession = { user: { role: 'admin' } } as const
      vi.mocked(auth.api.getSession).mockResolvedValue(
        mockSession as unknown as Parameters<
          typeof vi.mocked<typeof auth.api.getSession>
        >[0] extends (...args: unknown[]) => Promise<infer R>
          ? R
          : never
      )

      const mockReq = createMockRequest('/login')
      const result = (await middleware(mockReq)) as unknown as {
        type: string
        url: URL
      }

      expect(result.type).toBe('redirect')
      expect(result.url.pathname).toBe('/admin')
    })

    it('should redirect superuser to /admin when accessing login', async () => {
      const mockSession = { user: { role: 'superuser' } } as const
      vi.mocked(auth.api.getSession).mockResolvedValue(
        mockSession as unknown as Parameters<
          typeof vi.mocked<typeof auth.api.getSession>
        >[0] extends (...args: unknown[]) => Promise<infer R>
          ? R
          : never
      )

      const mockReq = createMockRequest('/login')
      const result = (await middleware(mockReq)) as unknown as {
        type: string
        url: URL
      }

      expect(result.type).toBe('redirect')
      expect(result.url.pathname).toBe('/admin')
    })

    it('should redirect client to /client when accessing register', async () => {
      const mockSession = { user: { role: 'client' } } as const
      vi.mocked(auth.api.getSession).mockResolvedValue(
        mockSession as unknown as Parameters<
          typeof vi.mocked<typeof auth.api.getSession>
        >[0] extends (...args: unknown[]) => Promise<infer R>
          ? R
          : never
      )

      const mockReq = createMockRequest('/register')
      const result = (await middleware(mockReq)) as unknown as {
        type: string
        url: URL
      }

      expect(result.type).toBe('redirect')
      expect(result.url.pathname).toBe('/client')
    })
  })

  describe('role-based redirects', () => {
    it('should allow admin to access /admin routes', async () => {
      const mockSession = { user: { role: 'admin' } } as const
      vi.mocked(auth.api.getSession).mockResolvedValue(
        mockSession as unknown as Parameters<
          typeof vi.mocked<typeof auth.api.getSession>
        >[0] extends (...args: unknown[]) => Promise<infer R>
          ? R
          : never
      )

      const result = await middleware(createMockRequest('/admin/dashboard'))

      expect(result.type).toBe('next')
    })

    it('should allow superuser to access /admin routes', async () => {
      const mockSession = { user: { role: 'superuser' } } as const
      vi.mocked(auth.api.getSession).mockResolvedValue(
        mockSession as unknown as Parameters<
          typeof vi.mocked<typeof auth.api.getSession>
        >[0] extends (...args: unknown[]) => Promise<infer R>
          ? R
          : never
      )

      const result = await middleware(createMockRequest('/admin/dashboard'))

      expect(result.type).toBe('next')
    })

    it('should redirect client to /client when accessing /admin', async () => {
      const mockSession = { user: { role: 'client' } } as const
      vi.mocked(auth.api.getSession).mockResolvedValue(
        mockSession as unknown as Parameters<
          typeof vi.mocked<typeof auth.api.getSession>
        >[0] extends (...args: unknown[]) => Promise<infer R>
          ? R
          : never
      )

      const mockReq = createMockRequest('/admin/dashboard')
      const result = (await middleware(mockReq)) as unknown as {
        type: string
        url: URL
      }

      expect(result.type).toBe('redirect')
      expect(result.url.pathname).toBe('/client')
    })

    it('should allow client to access /client routes', async () => {
      const mockSession = { user: { role: 'client' } } as const
      vi.mocked(auth.api.getSession).mockResolvedValue(
        mockSession as unknown as Parameters<
          typeof vi.mocked<typeof auth.api.getSession>
        >[0] extends (...args: unknown[]) => Promise<infer R>
          ? R
          : never
      )

      const result = await middleware(createMockRequest('/client/dashboard'))

      expect(result.type).toBe('next')
    })

    it('should redirect admin to /admin when accessing /client', async () => {
      const mockSession = { user: { role: 'admin' } } as const
      vi.mocked(auth.api.getSession).mockResolvedValue(
        mockSession as unknown as Parameters<
          typeof vi.mocked<typeof auth.api.getSession>
        >[0] extends (...args: unknown[]) => Promise<infer R>
          ? R
          : never
      )

      const mockReq = createMockRequest('/client/dashboard')
      const result = (await middleware(mockReq)) as unknown as {
        type: string
        url: URL
      }

      expect(result.type).toBe('redirect')
      expect(result.url.pathname).toBe('/admin')
    })

    it('should redirect superuser to /admin when accessing /client', async () => {
      const mockSession = { user: { role: 'superuser' } } as const
      vi.mocked(auth.api.getSession).mockResolvedValue(
        mockSession as unknown as Parameters<
          typeof vi.mocked<typeof auth.api.getSession>
        >[0] extends (...args: unknown[]) => Promise<infer R>
          ? R
          : never
      )

      const mockReq = createMockRequest('/client/dashboard')
      const result = (await middleware(mockReq)) as unknown as {
        type: string
        url: URL
      }

      expect(result.type).toBe('redirect')
      expect(result.url.pathname).toBe('/admin')
    })
  })

  describe('middleware config', () => {
    it('should have correct matcher configuration', () => {
      expect(config.matcher).toBeDefined()
      expect(config.matcher).toHaveLength(1)
      expect(config.matcher[0]).toContain('/((?!_next/static')
    })
  })
})
