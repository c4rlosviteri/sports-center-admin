/* @name CreateWaitlistNotification */
INSERT INTO waitlist_notifications (
  booking_id,
  user_id,
  class_id,
  branch_id,
  notification_type,
  sent_via,
  status,
  response_deadline,
  metadata
) VALUES (
  :bookingId!,
  :userId!,
  :classId!,
  :branchId!,
  :notificationType!,
  :sentVia!,
  :status!,
  :responseDeadline,
  :metadata
)
RETURNING *;

/* @name GetWaitlistNotifications */
SELECT
  wn.*,
  u.first_name,
  u.last_name,
  u.email,
  u.phone,
  c.scheduled_at,
  c.instructor
FROM waitlist_notifications wn
JOIN "user" u ON wn.user_id = u.id
JOIN classes c ON wn.class_id = c.id
WHERE wn.branch_id = :branchId!
  AND wn.sent_at >= :startDate!
ORDER BY wn.sent_at DESC
LIMIT :limit;

/* @name GetUserWaitlistNotifications */
SELECT
  wn.*,
  c.scheduled_at,
  c.instructor
FROM waitlist_notifications wn
JOIN classes c ON wn.class_id = c.id
WHERE wn.user_id = :userId!
  AND wn.branch_id = :branchId!
ORDER BY wn.sent_at DESC
LIMIT :limit;

/* @name UpdateNotificationStatus */
UPDATE waitlist_notifications
SET
  status = :status!,
  response_action = :responseAction,
  responded_at = :respondedAt
WHERE id = :notificationId!
  AND branch_id = :branchId!
RETURNING *;

/* @name CreateWaitlistOffer */
INSERT INTO waitlist_offers (
  booking_id,
  user_id,
  class_id,
  branch_id,
  expires_at
) VALUES (
  :bookingId!,
  :userId!,
  :classId!,
  :branchId!,
  :expiresAt!
)
RETURNING *;

/* @name GetWaitlistOfferById */
SELECT
  wo.*,
  u.first_name,
  u.last_name,
  u.email,
  u.phone,
  c.scheduled_at,
  c.instructor,
  c.capacity,
  b.status as booking_status
FROM waitlist_offers wo
JOIN "user" u ON wo.user_id = u.id
JOIN classes c ON wo.class_id = c.id
JOIN bookings b ON wo.booking_id = b.id
WHERE wo.id = :offerId!
  AND wo.branch_id = :branchId!;

/* @name GetPendingWaitlistOffers */
SELECT
  wo.*,
  u.first_name,
  u.last_name,
  u.email,
  u.phone,
  c.scheduled_at,
  c.instructor,
  b.status as booking_status
FROM waitlist_offers wo
JOIN "user" u ON wo.user_id = u.id
JOIN classes c ON wo.class_id = c.id
JOIN bookings b ON wo.booking_id = b.id
WHERE wo.branch_id = :branchId!
  AND wo.status = 'pending'
  AND wo.expires_at > CURRENT_TIMESTAMP
ORDER BY wo.offered_at ASC;

/* @name GetUserWaitlistOffers */
SELECT
  wo.*,
  c.scheduled_at,
  c.instructor,
  c.capacity,
  b.status as booking_status
FROM waitlist_offers wo
JOIN classes c ON wo.class_id = c.id
JOIN bookings b ON wo.booking_id = b.id
WHERE wo.user_id = :userId!
  AND wo.branch_id = :branchId!
ORDER BY wo.offered_at DESC
LIMIT :limit;

/* @name AcceptWaitlistOffer */
UPDATE waitlist_offers
SET
  status = 'accepted',
  accepted_at = CURRENT_TIMESTAMP
WHERE id = :offerId!
  AND user_id = :userId!
  AND branch_id = :branchId!
  AND status = 'pending'
  AND expires_at > CURRENT_TIMESTAMP
RETURNING *;

/* @name DeclineWaitlistOffer */
UPDATE waitlist_offers
SET
  status = 'declined',
  declined_at = CURRENT_TIMESTAMP
WHERE id = :offerId!
  AND user_id = :userId!
  AND branch_id = :branchId!
  AND status = 'pending'
RETURNING *;

/* @name ExpireWaitlistOffer */
UPDATE waitlist_offers
SET
  status = 'expired',
  expired_at = CURRENT_TIMESTAMP
WHERE id = :offerId!
  AND branch_id = :branchId!
RETURNING *;

/* @name MarkOfferAsEscalated */
UPDATE waitlist_offers
SET
  status = 'auto_escalated',
  escalated_at = CURRENT_TIMESTAMP,
  next_offer_id = :nextOfferId
WHERE id = :offerId!
  AND branch_id = :branchId!
RETURNING *;

/* @name GetExpiredOffers */
SELECT
  wo.*,
  u.first_name,
  u.last_name,
  u.email,
  c.scheduled_at,
  c.instructor
FROM waitlist_offers wo
JOIN "user" u ON wo.user_id = u.id
JOIN classes c ON wo.class_id = c.id
WHERE wo.branch_id = :branchId!
  AND wo.status = 'pending'
  AND wo.expires_at <= CURRENT_TIMESTAMP
ORDER BY wo.expires_at ASC
LIMIT :limit;

/* @name GetNotificationPreferences */
SELECT
  id,
  user_id,
  email_enabled,
  sms_enabled,
  push_enabled,
  waitlist_notification_enabled,
  booking_confirmation_enabled,
  cancellation_notification_enabled,
  reminder_notification_enabled,
  created_at,
  updated_at
FROM notification_preferences
WHERE user_id = :userId!;

/* @name CreateNotificationPreferences */
INSERT INTO notification_preferences (
  user_id,
  email_enabled,
  sms_enabled,
  push_enabled,
  waitlist_notification_enabled,
  booking_confirmation_enabled,
  cancellation_notification_enabled,
  reminder_notification_enabled
) VALUES (
  :userId!,
  :emailEnabled!,
  :smsEnabled!,
  :pushEnabled!,
  :waitlistNotificationEnabled!,
  :bookingConfirmationEnabled!,
  :cancellationNotificationEnabled!,
  :reminderNotificationEnabled!
)
ON CONFLICT (user_id) DO UPDATE SET
  email_enabled = EXCLUDED.email_enabled,
  sms_enabled = EXCLUDED.sms_enabled,
  push_enabled = EXCLUDED.push_enabled,
  waitlist_notification_enabled = EXCLUDED.waitlist_notification_enabled,
  booking_confirmation_enabled = EXCLUDED.booking_confirmation_enabled,
  cancellation_notification_enabled = EXCLUDED.cancellation_notification_enabled,
  reminder_notification_enabled = EXCLUDED.reminder_notification_enabled
RETURNING *;

/* @name UpdateNotificationPreferences */
UPDATE notification_preferences
SET
  email_enabled = :emailEnabled!,
  sms_enabled = :smsEnabled!,
  push_enabled = :pushEnabled!,
  waitlist_notification_enabled = :waitlistNotificationEnabled!,
  booking_confirmation_enabled = :bookingConfirmationEnabled!,
  cancellation_notification_enabled = :cancellationNotificationEnabled!,
  reminder_notification_enabled = :reminderNotificationEnabled!
WHERE user_id = :userId!
RETURNING *;

/* @name GetBranchWaitlistSettings */
SELECT
  waitlist_acceptance_hours,
  enable_auto_waitlist,
  waitlist_reminder_count,
  waitlist_cutoff_hours
FROM branch_settings
WHERE branch_id = :branchId!;

/* @name GetClassWaitlistStatus */
SELECT
  c.id as class_id,
  c.scheduled_at,
  c.instructor,
  c.capacity,
  c.waitlist_capacity,
  COUNT(b.id) FILTER (WHERE b.status = 'confirmed') as confirmed_count,
  COUNT(b.id) FILTER (WHERE b.status = 'waitlisted') as waitlisted_count,
  COUNT(wo.id) FILTER (WHERE wo.status = 'pending') as pending_offers_count,
  CASE
    WHEN COUNT(b.id) FILTER (WHERE b.status = 'confirmed') < c.capacity
    THEN true
    ELSE false
  END as has_available_spots,
  CASE
    WHEN COUNT(b.id) FILTER (WHERE b.status = 'waitlisted') > 0
    THEN true
    ELSE false
  END as has_waitlist
FROM classes c
LEFT JOIN bookings b ON c.id = b.class_id
LEFT JOIN waitlist_offers wo ON c.id = wo.class_id
WHERE c.id = :classId!
  AND c.branch_id = :branchId!
GROUP BY c.id, c.scheduled_at, c.instructor, c.capacity, c.waitlist_capacity;

/* @name GetWaitlistQueue */
SELECT
  b.id as booking_id,
  b.user_id,
  b.waitlist_position,
  b.booked_at,
  u.first_name,
  u.last_name,
  u.email,
  u.phone,
  wo.id as active_offer_id,
  wo.status as offer_status,
  wo.expires_at as offer_expires_at
FROM bookings b
JOIN "user" u ON b.user_id = u.id
LEFT JOIN waitlist_offers wo ON
  b.id = wo.booking_id
  AND wo.status IN ('pending', 'accepted')
WHERE b.class_id = :classId!
  AND b.branch_id = :branchId!
  AND b.status = 'waitlisted'
ORDER BY b.waitlist_position ASC, b.booked_at ASC;

/* @name GetWaitlistStats */
SELECT
  c.id as class_id,
  c.scheduled_at,
  c.instructor,
  COUNT(DISTINCT wo.id) as total_offers_sent,
  COUNT(DISTINCT wo.id) FILTER (WHERE wo.status = 'accepted') as accepted_count,
  COUNT(DISTINCT wo.id) FILTER (WHERE wo.status = 'declined') as declined_count,
  COUNT(DISTINCT wo.id) FILTER (WHERE wo.status = 'expired') as expired_count,
  COUNT(DISTINCT wo.id) FILTER (WHERE wo.status = 'auto_escalated') as escalated_count,
  ROUND(
    (COUNT(DISTINCT wo.id) FILTER (WHERE wo.status = 'accepted')::numeric /
     NULLIF(COUNT(DISTINCT wo.id), 0)) * 100,
    2
  ) as acceptance_rate,
  AVG(
    EXTRACT(EPOCH FROM (wo.accepted_at - wo.offered_at)) / 3600
  ) FILTER (WHERE wo.status = 'accepted') as avg_hours_to_accept
FROM classes c
LEFT JOIN waitlist_offers wo ON c.id = wo.class_id
WHERE c.branch_id = :branchId!
  AND c.scheduled_at >= :startDate!
  AND c.scheduled_at <= :endDate!
GROUP BY c.id, c.scheduled_at, c.instructor
HAVING COUNT(DISTINCT wo.id) > 0
ORDER BY c.scheduled_at DESC;
