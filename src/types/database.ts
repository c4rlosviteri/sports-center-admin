// Application-level type definitions
// These define the camelCase interfaces used by frontend components
// PgTyped generates types for raw SQL results (snake_case), while these
// represent the transformed data returned from server actions

export type UserRole = 'superuser' | 'admin' | 'client'
export type BookingStatus = 'confirmed' | 'waitlisted' | 'cancelled'

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  dateOfBirth: Date
  idNumber: string
  address: string
  phone: string
  role: UserRole
  branchId: string
  createdAt: Date
  updatedAt: Date
}

export interface Session {
  id: string
  userId: string
  token: string
  expiresAt: Date
  createdAt: Date
}

export interface Branch {
  id: string
  name: string
  address: string | null
  phone: string | null
  email: string | null
  isActive: boolean
  cancellationHoursBefore: number
  bookingHoursBefore: number
  createdAt: Date
  updatedAt?: Date | null
}

export interface BranchWithStats extends Branch {
  clientCount: number
  adminCount: number
  upcomingClassesCount: number
  cancellationHoursBefore: number
  timezone: string
}

export interface AdminBranchAssignment {
  id: string
  adminId: string
  branchId: string
  isPrimary: boolean
  createdAt: Date
  updatedAt: Date
}

export interface BranchContext {
  role: 'superuser' | 'admin'
  currentBranchId: string
  branches: Array<{
    id: string
    name: string
    isPrimary?: boolean
  }>
}

export interface Class {
  id: string
  branchId: string
  instructorName: string | null
  className: string
  description: string | null
  scheduledAt: string
  durationMinutes: number
  maxCapacity: number
  waitlistCapacity: number
  location: string
  createdAt: Date
}

export interface ClassWithCounts extends Class {
  confirmedCount: number
  waitlistCount: number
  bookedCount: number
  userBookingStatus?: 'confirmed' | 'cancelled' | 'waitlisted' | null
  userBookingId?: string | null
}

export interface Booking {
  id: string
  userId: string
  classId: string
  status: BookingStatus
  position: number | null
  createdAt: string
  cancelledAt: string | null
}

export interface BookingWithDetails extends Booking {
  className: string
  instructorName: string | null
  scheduledAt: string | null
  durationMinutes: number
  location: string
  userFirstName: string
  userLastName: string
  userEmail: string
  userName?: string
  bookedAt?: string | null
}

export interface Payment {
  id: string
  userId: string
  amount: number
  paymentDate: Date
  notes: string | null
  createdBy?: string | null
  createdAt: Date | null
  userName?: string
  userEmail?: string
  recordedByName?: string
}

export interface BranchStats {
  totalClients: number
  newClientsLastMonth: number
  newClientsThisMonth: number
  totalRevenue: number
  totalRevenueThisMonth: number
}

export interface BranchSettings {
  branchId: string
  cancellationHoursBefore: number
  updatedAt: Date
}

// User package info from active package
export interface UserPackage {
  id: string
  userId: string
  packageTemplateId: string
  startDate: Date
  endDate: Date | null
  classesRemaining: number
  isActive: boolean
  packageName?: string
  packageDescription?: string
  status: 'active' | 'expired' | 'cancelled'
  createdAt: Date
}
