'use server'

// Stub file for waitlist management - awaiting migration completion
// TODO: Remove unused imports once implemented

/**
 * Offer a waitlist spot to the next person
 */
export async function offerWaitlistSpot(
  _classId: string,
  _branchId: string,
  _acceptanceHours?: number
) {
  throw new Error(
    'Not implemented - run migrations and regenerate PGTyped types first'
  )
}

/**
 * Accept a waitlist offer
 */
export async function acceptWaitlistOffer(
  _offerId: string,
  _userId: string,
  _branchId: string
) {
  throw new Error(
    'Not implemented - run migrations and regenerate PGTyped types first'
  )
}

/**
 * Decline a waitlist offer
 */
export async function declineWaitlistOffer(
  _offerId: string,
  _userId: string,
  _branchId: string
) {
  throw new Error(
    'Not implemented - run migrations and regenerate PGTyped types first'
  )
}

/**
 * Handle expired waitlist offers
 */
export async function handleExpiredOffers() {
  throw new Error(
    'Not implemented - run migrations and regenerate PGTyped types first'
  )
}

/**
 * Get pending waitlist offers for a branch
 */
export async function getPendingWaitlistOffers(_branchId: string) {
  throw new Error(
    'Not implemented - run migrations and regenerate PGTyped types first'
  )
}

/**
 * Get a specific waitlist offer by ID
 */
export async function getWaitlistOfferById(
  _offerId: string,
  _branchId: string
) {
  throw new Error(
    'Not implemented - run migrations and regenerate PGTyped types first'
  )
}

/**
 * Get waitlist offers for a user
 */
export async function getUserWaitlistOffers(
  _userId: string,
  _branchId: string,
  _limit: number = 20
) {
  throw new Error(
    'Not implemented - run migrations and regenerate PGTyped types first'
  )
}

/**
 * Get the waitlist queue for a class
 */
export async function getWaitlistQueue(_classId: string, _branchId: string) {
  throw new Error(
    'Not implemented - run migrations and regenerate PGTyped types first'
  )
}

/**
 * Get waitlist statistics for classes
 */
export async function getWaitlistStats(
  _branchId: string,
  _startDate: Date,
  _endDate: Date
) {
  throw new Error(
    'Not implemented - run migrations and regenerate PGTyped types first'
  )
}

/**
 * Get class waitlist status
 */
export async function getClassWaitlistStatus(
  _classId: string,
  _branchId: string
) {
  throw new Error(
    'Not implemented - run migrations and regenerate PGTyped types first'
  )
}

/**
 * Create a waitlist notification
 */
export async function createWaitlistNotification(_data: {
  bookingId: string
  userId: string
  classId: string
  branchId: string
  notificationType:
    | 'spot_available'
    | 'acceptance_reminder'
    | 'spot_expired'
    | 'auto_escalated'
  sentVia: 'email' | 'sms' | 'push' | 'in_app'
  status: 'pending' | 'sent' | 'delivered' | 'failed' | 'bounced'
  responseDeadline?: Date
  metadata?: Record<string, unknown>
}) {
  throw new Error(
    'Not implemented - run migrations and regenerate PGTyped types first'
  )
}

/**
 * Get waitlist notifications for a branch
 */
export async function getWaitlistNotifications(
  _branchId: string,
  _startDate: Date,
  _limit: number = 100
) {
  throw new Error(
    'Not implemented - run migrations and regenerate PGTyped types first'
  )
}

/**
 * Get user's waitlist notifications
 */
export async function getUserWaitlistNotifications(
  _userId: string,
  _branchId: string,
  _limit: number = 20
) {
  throw new Error(
    'Not implemented - run migrations and regenerate PGTyped types first'
  )
}

/**
 * Update notification status
 */
export async function updateNotificationStatus(
  _notificationId: string,
  _branchId: string,
  _status: 'sent' | 'delivered' | 'failed' | 'bounced',
  _responseAction?: 'accepted' | 'declined' | 'expired',
  _respondedAt?: Date
) {
  throw new Error(
    'Not implemented - run migrations and regenerate PGTyped types first'
  )
}

/**
 * Get user's notification preferences
 */
export async function getUserNotificationPreferences(_userId: string) {
  throw new Error(
    'Not implemented - run migrations and regenerate PGTyped types first'
  )
}

/**
 * Create or update user's notification preferences
 */
export async function updateNotificationPreferences(
  _userId: string,
  _preferences: {
    emailEnabled: boolean
    smsEnabled: boolean
    pushEnabled: boolean
    waitlistNotificationEnabled: boolean
    bookingConfirmationEnabled: boolean
    cancellationNotificationEnabled: boolean
    reminderNotificationEnabled: boolean
  }
) {
  throw new Error(
    'Not implemented - run migrations and regenerate PGTyped types first'
  )
}

/**
 * Get branch waitlist settings
 */
export async function getBranchWaitlistSettings(_branchId: string) {
  throw new Error(
    'Not implemented - run migrations and regenerate PGTyped types first'
  )
}

/**
 * Get expired offers that need processing
 */
export async function getExpiredOffers(_branchId: string, _limit: number = 50) {
  throw new Error(
    'Not implemented - run migrations and regenerate PGTyped types first'
  )
}
