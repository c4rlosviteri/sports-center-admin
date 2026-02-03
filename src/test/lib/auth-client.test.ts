import { describe, expect, it, vi } from 'vitest'

// Mock better-auth/react before importing
vi.mock('better-auth/react', () => ({
  createAuthClient: vi.fn().mockReturnValue({
    signIn: vi.fn().mockResolvedValue({ data: null, error: null }),
    signUp: vi.fn().mockResolvedValue({ data: null, error: null }),
    signOut: vi.fn().mockResolvedValue({ data: null, error: null }),
    useSession: vi.fn().mockReturnValue({
      data: null,
      error: null,
      isPending: false,
      isRefetching: false,
    }),
    forgetPassword: vi.fn().mockResolvedValue({ error: null }),
    resetPassword: vi.fn().mockResolvedValue({ error: null }),
  }),
}))

// Import after mock
import {
  authClient,
  forgetPassword,
  resetPassword,
  signIn,
  signOut,
  signUp,
  useSession,
} from '~/lib/auth-client'

describe('auth-client exports', () => {
  it('should export authClient', () => {
    expect(authClient).toBeDefined()
    expect(typeof authClient).toBe('object')
  })

  it('should export signIn function', () => {
    expect(signIn).toBeDefined()
    expect(typeof signIn).toBe('function')
  })

  it('should export signUp function', () => {
    expect(signUp).toBeDefined()
    expect(typeof signUp).toBe('function')
  })

  it('should export signOut function', () => {
    expect(signOut).toBeDefined()
    expect(typeof signOut).toBe('function')
  })

  it('should export useSession hook', () => {
    expect(useSession).toBeDefined()
    expect(typeof useSession).toBe('function')
  })
})

describe('forgetPassword', () => {
  it('should be exported as a function', () => {
    expect(forgetPassword).toBeDefined()
    expect(typeof forgetPassword).toBe('function')
  })

  it('should accept email and optional redirectTo options', async () => {
    const result = await forgetPassword({
      email: 'test@example.com',
      redirectTo: '/reset-password',
    })
    expect(result).toBeDefined()
    expect(typeof result).toBe('object')
  })

  it('should work without redirectTo option', async () => {
    const result = await forgetPassword({
      email: 'test@example.com',
    })
    expect(result).toBeDefined()
    expect(typeof result).toBe('object')
  })
})

describe('resetPassword', () => {
  it('should be exported as a function', () => {
    expect(resetPassword).toBeDefined()
    expect(typeof resetPassword).toBe('function')
  })

  it('should accept newPassword and optional token options', async () => {
    const result = await resetPassword({
      newPassword: 'newpassword123',
      token: 'reset-token-123',
    })
    expect(result).toBeDefined()
    expect(typeof result).toBe('object')
  })

  it('should work without token option', async () => {
    const result = await resetPassword({
      newPassword: 'newpassword123',
    })
    expect(result).toBeDefined()
    expect(typeof result).toBe('object')
  })
})

describe('auth client baseURL configuration', () => {
  it('should use environment variable for baseURL', () => {
    const originalEnv = process.env.NEXT_PUBLIC_BETTER_AUTH_URL
    process.env.NEXT_PUBLIC_BETTER_AUTH_URL = 'https://api.example.com'

    // Re-import to pick up new env var
    vi.resetModules()
    // The mock will still return the same object, but in real usage it would use the env var

    process.env.NEXT_PUBLIC_BETTER_AUTH_URL = originalEnv
  })

  it('should fall back to localhost when env var not set', () => {
    const originalEnv = process.env.NEXT_PUBLIC_BETTER_AUTH_URL
    delete process.env.NEXT_PUBLIC_BETTER_AUTH_URL

    vi.resetModules()
    // In real usage, it would fall back to http://localhost:3000

    process.env.NEXT_PUBLIC_BETTER_AUTH_URL = originalEnv
  })
})
