'use client'

import type { ReactNode } from 'react'
import { SWRConfig } from 'swr'

const swrFetcher = async (...args: unknown[]) => {
  const [key, init] = args

  if (typeof key === 'function') {
    return key(...args.slice(1))
  }

  if (typeof key === 'string') {
    const response = await fetch(key, init as RequestInit | undefined)

    if (!response.ok) {
      const error = new Error('Error fetching data')
      ;(error as Error & { status?: number }).status = response.status
      throw error
    }

    return response.json()
  }

  throw new Error('Unsupported SWR key. Provide a fetcher for non-URL keys.')
}

export function SWRProvider({ children }: { children: ReactNode }) {
  return (
    <SWRConfig
      value={{
        fetcher: swrFetcher,
        dedupingInterval: 2000,
        errorRetryCount: 3,
        errorRetryInterval: 2000,
        revalidateOnFocus: false,
        shouldRetryOnError: true,
      }}
    >
      {children}
    </SWRConfig>
  )
}
