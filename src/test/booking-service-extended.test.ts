import { describe, expect, it } from 'vitest'
import {
  canBookByTime,
  canBookWithPackage,
  canCancelBooking,
} from '../lib/booking-service'

describe('booking-service extended tests', () => {
  describe('canBookWithPackage', () => {
    it('should allow booking when package expires today', () => {
      const today = new Date()
      today.setHours(23, 59, 59, 999) // End of today

      const pkg = {
        id: '1',
        templateName: 'Basic Package',
        classesRemaining: 5,
        expiresAt: today.toISOString(),
        maxClassesPerDay: null,
        maxClassesPerWeek: null,
      }

      const result = canBookWithPackage(pkg)
      expect(result.canBook).toBe(true)
    })

    it('should block booking when package expired yesterday', () => {
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)

      const pkg = {
        id: '1',
        templateName: 'Basic Package',
        classesRemaining: 5,
        expiresAt: yesterday.toISOString(),
        maxClassesPerDay: null,
        maxClassesPerWeek: null,
      }

      const result = canBookWithPackage(pkg)
      expect(result.canBook).toBe(false)
      expect(result.reason).toContain('expirado')
    })

    it('should block booking when exactly 0 classes remaining', () => {
      const pkg = {
        id: '1',
        templateName: 'Basic Package',
        classesRemaining: 0,
        expiresAt: new Date(
          Date.now() + 10 * 24 * 60 * 60 * 1000
        ).toISOString(),
        maxClassesPerDay: null,
        maxClassesPerWeek: null,
      }

      const result = canBookWithPackage(pkg)
      expect(result.canBook).toBe(false)
      expect(result.reason).toContain('No tienes clases disponibles')
    })

    it('should block booking when negative classes remaining (edge case)', () => {
      const pkg = {
        id: '1',
        templateName: 'Basic Package',
        classesRemaining: -1,
        expiresAt: new Date(
          Date.now() + 10 * 24 * 60 * 60 * 1000
        ).toISOString(),
        maxClassesPerDay: null,
        maxClassesPerWeek: null,
      }

      const result = canBookWithPackage(pkg)
      expect(result.canBook).toBe(false)
    })

    it('should allow booking with exactly 1 class remaining', () => {
      const pkg = {
        id: '1',
        templateName: 'Basic Package',
        classesRemaining: 1,
        expiresAt: new Date(
          Date.now() + 10 * 24 * 60 * 60 * 1000
        ).toISOString(),
        maxClassesPerDay: null,
        maxClassesPerWeek: null,
      }

      const result = canBookWithPackage(pkg)
      expect(result.canBook).toBe(true)
    })

    it('should handle packages without expiration', () => {
      const pkg = {
        id: '1',
        templateName: 'Lifetime Package',
        classesRemaining: 10,
        expiresAt: null,
        maxClassesPerDay: null,
        maxClassesPerWeek: null,
      }

      const result = canBookWithPackage(pkg)
      expect(result.canBook).toBe(true)
    })
  })

  describe('canBookByTime', () => {
    it('should allow booking when no time restriction (0 hours)', () => {
      const scheduledAt = new Date(Date.now() + 30 * 60 * 1000).toISOString() // 30 minutes from now

      const result = canBookByTime(scheduledAt, 0)
      expect(result.canBook).toBe(true)
    })

    it('should allow booking exactly at the cutoff time', () => {
      const hoursFromNow = 2
      const scheduledAt = new Date(
        Date.now() + hoursFromNow * 60 * 60 * 1000 + 1000
      ).toISOString() // 2 hours + 1 second from now

      const result = canBookByTime(scheduledAt, 2)
      expect(result.canBook).toBe(true)
    })

    it('should block booking just before cutoff time', () => {
      const scheduledAt = new Date(
        Date.now() + 1.99 * 60 * 60 * 1000
      ).toISOString() // 1.99 hours from now

      const result = canBookByTime(scheduledAt, 2)
      expect(result.canBook).toBe(false)
      expect(result.reason).toContain('2 horas')
    })

    it('should block booking when class is in the past', () => {
      const scheduledAt = new Date(Date.now() - 60 * 60 * 1000).toISOString() // 1 hour ago

      const result = canBookByTime(scheduledAt, 2)
      expect(result.canBook).toBe(false)
    })

    it('should allow booking 24+ hours before class with 24 hour restriction', () => {
      const scheduledAt = new Date(
        Date.now() + 25 * 60 * 60 * 1000
      ).toISOString() // 25 hours from now

      const result = canBookByTime(scheduledAt, 24)
      expect(result.canBook).toBe(true)
    })

    it('should block booking less than 24 hours before with 24 hour restriction', () => {
      const scheduledAt = new Date(
        Date.now() + 23 * 60 * 60 * 1000
      ).toISOString() // 23 hours from now

      const result = canBookByTime(scheduledAt, 24)
      expect(result.canBook).toBe(false)
      expect(result.reason).toContain('24 horas')
    })
  })

  describe('canCancelBooking', () => {
    it('should allow cancellation exactly at the cutoff', () => {
      const scheduledAt = new Date(
        Date.now() + 2 * 60 * 60 * 1000 + 1000
      ).toISOString() // 2 hours + 1 second from now

      const result = canCancelBooking(scheduledAt, 2)
      expect(result.canCancel).toBe(true)
    })

    it('should block cancellation 1 minute before cutoff', () => {
      const scheduledAt = new Date(
        Date.now() + 2 * 60 * 60 * 1000 - 60 * 1000
      ).toISOString() // 1 hour 59 minutes from now

      const result = canCancelBooking(scheduledAt, 2)
      expect(result.canCancel).toBe(false)
    })

    it('should allow cancellation with 0 hour policy', () => {
      // Even if class is in 1 minute, should allow
      const scheduledAt = new Date(Date.now() + 60 * 1000).toISOString()

      const result = canCancelBooking(scheduledAt, 0)
      expect(result.canCancel).toBe(true)
    })

    it('should block cancellation when class already started', () => {
      const scheduledAt = new Date(Date.now() - 30 * 60 * 1000).toISOString() // 30 minutes ago

      const result = canCancelBooking(scheduledAt, 0)
      // With 0 hour policy, hoursUntilClass is negative, so it's < 0 (the policy)
      // Current implementation blocks cancellation when hoursUntilClass < policy hours
      expect(result.canCancel).toBe(false) // Class already started
    })

    it('should respect different cancellation policies per branch', () => {
      // Add a small buffer (1 minute) to avoid race conditions
      const scheduledAt = new Date(
        Date.now() + 4 * 60 * 60 * 1000 + 60000 // 4 hours and 1 minute from now
      ).toISOString()

      // With 2-hour policy, should allow
      expect(canCancelBooking(scheduledAt, 2).canCancel).toBe(true)

      // With 6-hour policy, should block
      expect(canCancelBooking(scheduledAt, 6).canCancel).toBe(false)

      // With 4-hour policy, should be safely cancellable (4h 1m > 4h)
      expect(canCancelBooking(scheduledAt, 4).canCancel).toBe(true)
    })
  })

  describe('Edge Cases', () => {
    it('should handle timezone edge cases', () => {
      // Create a date at midnight UTC
      const midnight = new Date()
      midnight.setUTCHours(0, 0, 0, 0)
      midnight.setUTCDate(midnight.getUTCDate() + 1) // Tomorrow midnight

      const pkg = {
        id: '1',
        templateName: 'Basic Package',
        classesRemaining: 5,
        expiresAt: midnight.toISOString(),
        maxClassesPerDay: null,
        maxClassesPerWeek: null,
      }

      // Should still be valid
      const result = canBookWithPackage(pkg)
      expect(result.canBook).toBe(true)
    })

    it('should handle very large class remaining values', () => {
      const pkg = {
        id: '1',
        templateName: 'Unlimited Package',
        classesRemaining: 999999,
        expiresAt: new Date(
          Date.now() + 365 * 24 * 60 * 60 * 1000
        ).toISOString(),
        maxClassesPerDay: null,
        maxClassesPerWeek: null,
      }

      const result = canBookWithPackage(pkg)
      expect(result.canBook).toBe(true)
    })

    it('should handle very long cancellation policies', () => {
      const scheduledAt = new Date(
        Date.now() + 6 * 24 * 60 * 60 * 1000
      ).toISOString() // 6 days from now

      const result = canCancelBooking(scheduledAt, 168) // 168 hours = 1 week
      expect(result.canCancel).toBe(false)
      expect(result.reason).toContain('168 horas')
    })
  })
})
