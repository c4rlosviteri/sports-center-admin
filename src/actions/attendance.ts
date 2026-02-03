'use server'

// Stub file for attendance tracking - awaiting migration completion
// TODO: Remove unused imports once implemented

/**
 * Mark attendance for a booking
 */
export async function markAttendance(
  _bookingId: string,
  _userId: string,
  _classId: string,
  _branchId: string,
  _status: 'present' | 'absent' | 'late' | 'excused',
  _markedBy: string,
  _notes?: string
) {
  throw new Error(
    'Not implemented - run migrations and regenerate PGTyped types first'
  )
}

/**
 * Get attendance records for a class
 */
export async function getClassAttendance(_classId: string, _branchId: string) {
  throw new Error(
    'Not implemented - run migrations and regenerate PGTyped types first'
  )
}

/**
 * Get user's attendance history
 */
export async function getUserAttendanceHistory(
  _userId: string,
  _branchId: string,
  _limit: number = 50
) {
  throw new Error(
    'Not implemented - run migrations and regenerate PGTyped types first'
  )
}

/**
 * Get no-show statistics for a user
 */
export async function getNoShowStats(_userId: string, _branchId: string) {
  throw new Error(
    'Not implemented - run migrations and regenerate PGTyped types first'
  )
}

/**
 * Create a no-show penalty for a user
 */
export async function createNoShowPenalty(
  _userId: string,
  _branchId: string,
  _noShowCount: number,
  _penaltyType: 'booking_restriction' | 'fee' | 'warning' | 'suspension',
  _penaltyDays: number,
  _appliedBy: string,
  _notes?: string
) {
  throw new Error(
    'Not implemented - run migrations and regenerate PGTyped types first'
  )
}

/**
 * Get active penalties for a user
 */
export async function getActivePenalties(_userId: string, _branchId: string) {
  throw new Error(
    'Not implemented - run migrations and regenerate PGTyped types first'
  )
}

/**
 * Deactivate a penalty
 */
export async function deactivatePenalty(_penaltyId: string, _branchId: string) {
  throw new Error(
    'Not implemented - run migrations and regenerate PGTyped types first'
  )
}

/**
 * Create a late cancellation fee
 */
export async function createLateCancellationFee(
  _bookingId: string,
  _userId: string,
  _classId: string,
  _branchId: string,
  _feeAmount: number,
  _cancelledAt: Date,
  _notes?: string
) {
  throw new Error(
    'Not implemented - run migrations and regenerate PGTyped types first'
  )
}

/**
 * Get outstanding fees for a user
 */
export async function getOutstandingFees(_userId: string, _branchId: string) {
  throw new Error(
    'Not implemented - run migrations and regenerate PGTyped types first'
  )
}

/**
 * Mark a fee as paid
 */
export async function markFeeAsPaid(_feeId: string, _branchId: string) {
  throw new Error(
    'Not implemented - run migrations and regenerate PGTyped types first'
  )
}

/**
 * Get class attendance summary for a date range
 */
export async function getClassAttendanceSummary(
  _branchId: string,
  _startDate: Date,
  _endDate: Date
) {
  throw new Error(
    'Not implemented - run migrations and regenerate PGTyped types first'
  )
}
