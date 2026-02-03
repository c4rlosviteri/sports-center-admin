import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

// Mock database pool first (before better-auth tries to use it)
vi.mock('~/lib/db', () => ({
  pool: {
    query: vi.fn(),
    connect: vi.fn().mockResolvedValue({
      query: vi.fn(),
      release: vi.fn(),
    }),
  },
}))

// Create mock functions for bcryptjs that will be shared across all imports
const mockBcryptjsHash = vi.fn().mockResolvedValue('$2b$10$mockedhash')
const mockBcryptjsCompare = vi.fn()

// Mock bcrypt before importing
vi.mock('bcrypt', () => ({
  default: {
    hash: vi.fn().mockResolvedValue('$2b$10$mockedhash'),
    compare: vi.fn(),
  },
  hash: vi.fn().mockResolvedValue('$2b$10$mockedhash'),
  compare: vi.fn(),
}))

// Mock bcryptjs for dynamic imports - use the same mock function instances
vi.mock('bcryptjs', () => ({
  default: {
    hash: mockBcryptjsHash,
    compare: mockBcryptjsCompare,
  },
  hash: mockBcryptjsHash,
  compare: mockBcryptjsCompare,
}))

import {
  auth,
  generateInviteToken,
  hashPassword,
  hasRole,
  verifyInviteToken,
} from '~/lib/auth'
import type { UserRole } from '~/lib/schemas'

describe('auth configuration', () => {
  it('should have auth instance exported', () => {
    expect(auth).toBeDefined()
    expect(auth.api).toBeDefined()
  })
})

describe('hasRole', () => {
  const roleHierarchy: {
    role: UserRole
    canAccess: UserRole[]
    cannotAccess: UserRole[]
  }[] = [
    {
      role: 'superuser',
      canAccess: ['admin', 'client'],
      cannotAccess: [],
    },
    {
      role: 'admin',
      canAccess: ['admin', 'client'],
      cannotAccess: ['superuser'],
    },
    {
      role: 'client',
      canAccess: ['client'],
      cannotAccess: ['superuser', 'admin'],
    },
  ]

  roleHierarchy.forEach(({ role, canAccess, cannotAccess }) => {
    describe(`role: ${role}`, () => {
      canAccess.forEach((targetRole) => {
        it(`should allow access to ${targetRole}`, () => {
          expect(hasRole(role, targetRole)).toBe(true)
        })
      })

      cannotAccess.forEach((targetRole) => {
        it(`should deny access to ${targetRole}`, () => {
          expect(hasRole(role, targetRole)).toBe(false)
        })
      })
    })
  })

  it('should handle array of roles', () => {
    expect(hasRole('client', ['admin', 'client'])).toBe(true)
    expect(hasRole('client', ['admin', 'superuser'])).toBe(false)
    expect(hasRole('admin', ['admin', 'superuser'])).toBe(true)
  })
})

describe('invite token functions', () => {
  const JWT_SECRET = 'test-secret-key-12345'
  const originalEnv: string | undefined = process.env.BETTER_AUTH_SECRET

  beforeEach(() => {
    process.env.BETTER_AUTH_SECRET = JWT_SECRET
  })

  afterEach(() => {
    process.env.BETTER_AUTH_SECRET = originalEnv
  })

  describe('generateInviteToken', () => {
    it('should generate a valid JWT token', async () => {
      const payload = {
        branchId: '550e8400-e29b-41d4-a716-446655440000',
        packageId: '770e8400-e29b-41d4-a716-446655440000',
        createdBy: '660e8400-e29b-41d4-a716-446655440000',
      }

      const token = await generateInviteToken(payload)

      expect(token).toBeDefined()
      expect(typeof token).toBe('string')
      expect(token.split('.')).toHaveLength(3) // JWT format: header.payload.signature
    })

    it('should set 24-hour expiration', async () => {
      const payload = {
        branchId: '550e8400-e29b-41d4-a716-446655440000',
        packageId: '770e8400-e29b-41d4-a716-446655440000',
        createdBy: '660e8400-e29b-41d4-a716-446655440000',
      }

      const now = Date.now()
      const token = await generateInviteToken(payload)
      const decoded = await verifyInviteToken(token)

      expect(decoded).toBeTruthy()
      expect(decoded!.expiresAt).toBeGreaterThan(now)
      expect(decoded!.expiresAt).toBeLessThanOrEqual(now + 25 * 60 * 60 * 1000) // 25 hours max
    })
  })

  describe('verifyInviteToken', () => {
    it('should return payload for valid token', async () => {
      const payload = {
        branchId: '550e8400-e29b-41d4-a716-446655440000',
        packageId: '770e8400-e29b-41d4-a716-446655440000',
        createdBy: '660e8400-e29b-41d4-a716-446655440000',
      }

      const token = await generateInviteToken(payload)
      const decoded = await verifyInviteToken(token)

      expect(decoded).toEqual(
        expect.objectContaining({
          ...payload,
          expiresAt: expect.any(Number),
        })
      )
    })

    it('should return null for expired token', async () => {
      // Create a token that's already expired
      const expiredPayload = {
        branchId: '550e8400-e29b-41d4-a716-446655440000',
        packageId: '770e8400-e29b-41d4-a716-446655440000',
        createdBy: '660e8400-e29b-41d4-a716-446655440000',
        expiresAt: Date.now() - 1000, // 1 second ago
      }

      // We need to manually create an expired token
      const jwt = await import('jsonwebtoken')
      const expiredToken = jwt.default.sign(expiredPayload, JWT_SECRET)

      const decoded = await verifyInviteToken(expiredToken)
      expect(decoded).toBeNull()
    })

    it('should return null for invalid token', async () => {
      const decoded = await verifyInviteToken('invalid-token')
      expect(decoded).toBeNull()
    })

    it('should return null for token with wrong signature', async () => {
      const payload = {
        branchId: '550e8400-e29b-41d4-a716-446655440000',
        packageId: '770e8400-e29b-41d4-a716-446655440000',
        createdBy: '660e8400-e29b-41d4-a716-446655440000',
      }

      const token = await generateInviteToken(payload)
      const tamperedToken = token.slice(0, -5) + 'xxxxx'

      const decoded = await verifyInviteToken(tamperedToken)
      expect(decoded).toBeNull()
    })
  })
})

describe('password hashing', () => {
  beforeEach(() => {
    // Reset mock before each test
    mockBcryptjsHash.mockClear()
    mockBcryptjsHash.mockResolvedValue('$2b$10$mockedhash')
  })

  it('should hash password with bcryptjs', async () => {
    const password = 'password123'
    const hashed = await hashPassword(password)

    expect(mockBcryptjsHash).toHaveBeenCalledWith(password, 10)
    expect(hashed).toBe('$2b$10$mockedhash')
  })

  it('should produce bcrypt-formatted hash', async () => {
    mockBcryptjsHash.mockResolvedValueOnce('$2b$10$actualhashfrombcrypt')

    const hashed = await hashPassword('testpassword')

    expect(hashed).toMatch(/^\$2[ab]\$\d+\$/)
  })
})
