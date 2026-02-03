import { describe, expect, it } from 'vitest'
import { canBookWithPackage, canCancelBooking } from '../lib/booking-service'

describe('booking-service', () => {
  describe('canBookWithPackage', () => {
    it('should allow booking when package is valid', () => {
      const pkg = {
        id: '1',
        templateName: 'Basic Package',
        classesRemaining: 5,
        expiresAt: new Date(
          Date.now() + 10 * 24 * 60 * 60 * 1000
        ).toISOString(),
        maxClassesPerDay: null,
        maxClassesPerWeek: null,
      }

      const result = canBookWithPackage(pkg)
      expect(result.canBook).toBe(true)
      expect(result.reason).toBeUndefined()
    })

    it('should block booking when package is expired', () => {
      const pkg = {
        id: '1',
        templateName: 'Basic Package',
        classesRemaining: 5,
        expiresAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        maxClassesPerDay: null,
        maxClassesPerWeek: null,
      }

      const result = canBookWithPackage(pkg)
      expect(result.canBook).toBe(false)
      expect(result.reason).toContain('expirado')
    })

    it('should block booking when no classes remaining', () => {
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

    it('should allow booking for packages without expiration', () => {
      const pkg = {
        id: '1',
        templateName: 'Unlimited Package',
        classesRemaining: 100,
        expiresAt: null,
        maxClassesPerDay: null,
        maxClassesPerWeek: null,
      }

      const result = canBookWithPackage(pkg)
      expect(result.canBook).toBe(true)
    })
  })

  describe('canCancelBooking', () => {
    it('should allow cancellation more than 2 hours before class', () => {
      const scheduledAt = new Date(
        Date.now() + 5 * 60 * 60 * 1000
      ).toISOString()
      const result = canCancelBooking(scheduledAt, 2)

      expect(result.canCancel).toBe(true)
      expect(result.reason).toBeUndefined()
    })

    it('should block cancellation less than 2 hours before class', () => {
      const scheduledAt = new Date(
        Date.now() + 1 * 60 * 60 * 1000
      ).toISOString()
      const result = canCancelBooking(scheduledAt, 2)

      expect(result.canCancel).toBe(false)
      expect(result.reason).toContain('menos de 2 horas')
    })

    it('should respect custom cancellation policy', () => {
      const scheduledAt = new Date(
        Date.now() + 10 * 60 * 60 * 1000
      ).toISOString()
      const result = canCancelBooking(scheduledAt, 24)

      expect(result.canCancel).toBe(false)
      expect(result.reason).toContain('menos de 24 horas')
    })
  })
})
