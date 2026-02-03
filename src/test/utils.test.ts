import { describe, expect, it } from 'vitest'
import { cn } from '../lib/utils'

describe('utils', () => {
  describe('cn', () => {
    it('should merge class names correctly', () => {
      const result = cn('text-primary', 'bg-black')
      expect(result).toBe('text-primary bg-black')
    })

    it('should handle conflicting Tailwind classes', () => {
      const result = cn('p-4', 'p-8')
      expect(result).toBe('p-8')
    })

    it('should handle conditional classes', () => {
      const result = cn('base-class', false && 'hidden', 'visible')
      expect(result).toBe('base-class visible')
    })
  })
})
