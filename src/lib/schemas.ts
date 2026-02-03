import { z } from 'zod'

/**
 * User role enum schema
 */
export const userRoleSchema = z.enum(['superuser', 'admin', 'client'])

/**
 * Auth provider enum schema
 */
export const authProviderSchema = z.enum(['email', 'google', 'apple'])

/**
 * Registration schema with terms acceptance
 */
export const registerSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z
    .string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .optional(),
  firstName: z.string().min(1, 'El nombre es requerido'),
  lastName: z.string().min(1, 'El apellido es requerido'),
  dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Fecha inválida'),
  idNumber: z.string().min(1, 'El número de identificación es requerido'),
  address: z.string().min(1, 'La dirección es requerida'),
  phone: z
    .string()
    .min(1, 'El teléfono es requerido')
    .transform((val) => val.replace(/\s/g, ''))
    .pipe(z.string().regex(/^\+?[0-9]{10,15}$/, 'Número de teléfono inválido')),
  termsAccepted: z.literal(true, {
    message: 'Debes aceptar los términos y condiciones',
  }),
  inviteToken: z.string(),
})

/**
 * Login schema
 */
export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'La contraseña es requerida'),
})

/**
 * Create package template schema
 */
export const createPackageTemplateSchema = z.object({
  name: z.string().min(1, 'El nombre del paquete es requerido'),
  totalClasses: z.number().min(1).default(4),
  defaultDurationDays: z.number().min(1).default(30),
  price: z.number().min(0).optional(),
  description: z.string().optional(),
  maxClassesPerDay: z.number().min(1).nullable().optional(),
  maxClassesPerWeek: z.number().min(1).nullable().optional(),
})

/**
 * Create class schema
 */
export const createClassSchema = z.object({
  name: z.string().min(1, 'El nombre de la clase es requerido'),
  instructor: z.string().optional(),
  scheduledAt: z.string().datetime('Fecha y hora inválidas'),
  durationMinutes: z.number().min(1).default(45),
  capacity: z.number().min(1, 'La capacidad debe ser al menos 1'),
  waitlistCapacity: z.number().min(0).default(3),
})

/**
 * Booking schema
 */
export const createBookingSchema = z.object({
  classId: z.string().uuid('ID de clase inválido'),
})

/**
 * Payment schema
 */
export const createPaymentSchema = z.object({
  userId: z.string().uuid(),
  amount: z.number().min(0),
  paymentDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  notes: z.string().optional(),
})

export type UserRole = z.infer<typeof userRoleSchema>
export type AuthProvider = z.infer<typeof authProviderSchema>
export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type CreatePackageTemplateInput = z.infer<
  typeof createPackageTemplateSchema
>
export type CreateClassInput = z.infer<typeof createClassSchema>
export type CreateBookingInput = z.infer<typeof createBookingSchema>
export type CreatePaymentInput = z.infer<typeof createPaymentSchema>
