import { renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

// Mock SWR
vi.mock('swr', () => ({
  default: vi.fn(),
}))

// Mock getSession action
vi.mock('~/actions/auth', () => ({
  getSession: vi.fn().mockResolvedValue({
    user: {
      id: 'user-123',
      email: 'test@example.com',
      name: 'Test User',
      role: 'client',
    },
  }),
}))

import useSWR from 'swr'
import { getSession } from '~/actions/auth'
import { useSession } from '~/hooks/use-session'

describe('useSession hook', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should call useSWR with correct key and fetcher', () => {
    const mockSWRReturn = {
      data: null,
      error: null,
      isLoading: false,
      mutate: vi.fn(),
    }
    vi.mocked(useSWR).mockReturnValue(mockSWRReturn as any)

    renderHook(() => useSession())

    expect(useSWR).toHaveBeenCalledWith('session', getSession)
  })

  it('should return session data when available', () => {
    const mockSession = {
      user: {
        id: 'user-123',
        email: 'test@example.com',
        name: 'Test User',
        role: 'client',
      },
    }

    const mockSWRReturn = {
      data: mockSession,
      error: null,
      isLoading: false,
      mutate: vi.fn(),
    }
    vi.mocked(useSWR).mockReturnValue(mockSWRReturn as any)

    const { result } = renderHook(() => useSession())

    expect(result.current.data).toEqual(mockSession)
    expect(result.current.error).toBeNull()
    expect(result.current.isLoading).toBe(false)
  })

  it('should return null data when no session exists', () => {
    const mockSWRReturn = {
      data: null,
      error: null,
      isLoading: false,
      mutate: vi.fn(),
    }
    vi.mocked(useSWR).mockReturnValue(mockSWRReturn as any)

    const { result } = renderHook(() => useSession())

    expect(result.current.data).toBeNull()
    expect(result.current.error).toBeNull()
    expect(result.current.isLoading).toBe(false)
  })

  it('should return loading state while fetching', () => {
    const mockSWRReturn = {
      data: null,
      error: null,
      isLoading: true,
      mutate: vi.fn(),
    }
    vi.mocked(useSWR).mockReturnValue(mockSWRReturn as any)

    const { result } = renderHook(() => useSession())

    expect(result.current.isLoading).toBe(true)
    expect(result.current.data).toBeNull()
  })

  it('should return error state when fetch fails', () => {
    const mockError = new Error('Failed to fetch session')

    const mockSWRReturn = {
      data: null,
      error: mockError,
      isLoading: false,
      mutate: vi.fn(),
    }
    vi.mocked(useSWR).mockReturnValue(mockSWRReturn as any)

    const { result } = renderHook(() => useSession())

    expect(result.current.error).toBe(mockError)
    expect(result.current.data).toBeNull()
    expect(result.current.isLoading).toBe(false)
  })

  it('should include mutate function in return value', () => {
    const mockMutate = vi.fn()
    const mockSWRReturn = {
      data: null,
      error: null,
      isLoading: false,
      mutate: mockMutate,
    }
    vi.mocked(useSWR).mockReturnValue(mockSWRReturn as any)

    const { result } = renderHook(() => useSession())

    expect(result.current.mutate).toBe(mockMutate)
  })

  it('should pass through all SWR options', () => {
    const mockSWRReturn = {
      data: null,
      error: null,
      isLoading: false,
      isValidating: false,
      mutate: vi.fn(),
    }
    vi.mocked(useSWR).mockReturnValue(mockSWRReturn as any)

    renderHook(() => useSession())

    // Verify useSWR was called with the session key and getSession fetcher
    expect(useSWR).toHaveBeenCalledTimes(1)
    expect(vi.mocked(useSWR).mock.calls[0][0]).toBe('session')
    expect(vi.mocked(useSWR).mock.calls[0][1]).toBe(getSession)
  })
})
