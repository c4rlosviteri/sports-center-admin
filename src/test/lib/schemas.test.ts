import { describe, expect, it } from 'vitest'
import { loginSchema, registerSchema, userRoleSchema } from '~/lib/schemas'

describe('userRoleSchema', () => {
  it('should validate superuser role', () => {
    const result = userRoleSchema.safeParse('superuser')
    expect(result.success).toBe(true)
    expect(result.data).toBe('superuser')
  })

  it('should validate admin role', () => {
    const result = userRoleSchema.safeParse('admin')
    expect(result.success).toBe(true)
    expect(result.data).toBe('admin')
  })

  it('should validate client role', () => {
    const result = userRoleSchema.safeParse('client')
    expect(result.success).toBe(true)
    expect(result.data).toBe('client')
  })

  it('should reject invalid roles', () => {
    const result = userRoleSchema.safeParse('invalid-role')
    expect(result.success).toBe(false)
  })

  it('should reject non-string values', () => {
    const result = userRoleSchema.safeParse(123)
    expect(result.success).toBe(false)
  })
})

describe('registerSchema', () => {
  const validRegistrationData = {
    email: 'test@example.com',
    password: 'password123',
    firstName: 'John',
    lastName: 'Doe',
    dateOfBirth: '1990-01-15',
    idNumber: '1712345678',
    address: '123 Main St',
    phone: '+593991234567',
    termsAccepted: true,
    inviteToken: 'invite-token-123',
  }

  it('should validate complete valid registration data', () => {
    const result = registerSchema.safeParse(validRegistrationData)
    expect(result.success).toBe(true)
  })

  it('should validate without optional password', () => {
    const { password: _password, ...dataWithoutPassword } =
      validRegistrationData
    const result = registerSchema.safeParse(dataWithoutPassword)
    expect(result.success).toBe(true)
  })

  it('should reject invalid email', () => {
    const result = registerSchema.safeParse({
      ...validRegistrationData,
      email: 'invalid-email',
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Email inválido')
    }
  })

  it('should reject password shorter than 8 characters', () => {
    const result = registerSchema.safeParse({
      ...validRegistrationData,
      password: 'short',
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        'La contraseña debe tener al menos 8 caracteres'
      )
    }
  })

  it('should reject empty firstName', () => {
    const result = registerSchema.safeParse({
      ...validRegistrationData,
      firstName: '',
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('El nombre es requerido')
    }
  })

  it('should reject empty lastName', () => {
    const result = registerSchema.safeParse({
      ...validRegistrationData,
      lastName: '',
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('El apellido es requerido')
    }
  })

  it('should validate cedula (idNumber) format - 10 digits', () => {
    const result = registerSchema.safeParse({
      ...validRegistrationData,
      idNumber: '1712345678',
    })
    expect(result.success).toBe(true)
  })

  it('should validate cedula (idNumber) format - 13 digits (with RUC)', () => {
    const result = registerSchema.safeParse({
      ...validRegistrationData,
      idNumber: '1712345678001',
    })
    expect(result.success).toBe(true)
  })

  it('should reject empty cedula (idNumber)', () => {
    const result = registerSchema.safeParse({
      ...validRegistrationData,
      idNumber: '',
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        'El número de identificación es requerido'
      )
    }
  })

  it('should reject invalid date format', () => {
    const result = registerSchema.safeParse({
      ...validRegistrationData,
      dateOfBirth: 'invalid-date',
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Fecha inválida')
    }
  })

  it('should reject invalid phone format', () => {
    const result = registerSchema.safeParse({
      ...validRegistrationData,
      phone: 'invalid-phone',
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Número de teléfono inválido')
    }
  })

  it('should reject phone with too few digits', () => {
    const result = registerSchema.safeParse({
      ...validRegistrationData,
      phone: '+593123',
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Número de teléfono inválido')
    }
  })

  it('should reject termsAccepted as false', () => {
    const result = registerSchema.safeParse({
      ...validRegistrationData,
      termsAccepted: false,
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        'Debes aceptar los términos y condiciones'
      )
    }
  })

  it('should reject empty address', () => {
    const result = registerSchema.safeParse({
      ...validRegistrationData,
      address: '',
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('La dirección es requerida')
    }
  })
})

describe('loginSchema', () => {
  it('should validate valid login data', () => {
    const result = loginSchema.safeParse({
      email: 'test@example.com',
      password: 'password123',
    })
    expect(result.success).toBe(true)
  })

  it('should reject invalid email', () => {
    const result = loginSchema.safeParse({
      email: 'invalid-email',
      password: 'password123',
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Email inválido')
    }
  })

  it('should reject empty password', () => {
    const result = loginSchema.safeParse({
      email: 'test@example.com',
      password: '',
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('La contraseña es requerida')
    }
  })

  it('should reject missing email', () => {
    const result = loginSchema.safeParse({
      password: 'password123',
    })
    expect(result.success).toBe(false)
  })

  it('should reject missing password', () => {
    const result = loginSchema.safeParse({
      email: 'test@example.com',
    })
    expect(result.success).toBe(false)
  })
})
