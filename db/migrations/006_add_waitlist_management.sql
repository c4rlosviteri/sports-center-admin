-- Migration: Add Automated Waitlist Management
-- Date: 2026-01-24
-- Description: Adds waitlist notifications, time-limited acceptance, and auto-escalation

-- ============================================================================
-- WAITLIST NOTIFICATIONS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS waitlist_notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  branch_id UUID NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
  notification_type VARCHAR(50) NOT NULL CHECK (notification_type IN (
    'spot_available', 'acceptance_reminder', 'spot_expired', 'auto_escalated'
  )),
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  sent_via VARCHAR(20) CHECK (sent_via IN ('email', 'sms', 'push', 'in_app')),
  status VARCHAR(20) DEFAULT 'sent' CHECK (status IN ('pending', 'sent', 'delivered', 'failed', 'bounced')),
  response_deadline TIMESTAMP WITH TIME ZONE,
  responded_at TIMESTAMP WITH TIME ZONE,
  response_action VARCHAR(20) CHECK (response_action IN ('accepted', 'declined', 'expired')),
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_waitlist_notifications_booking_id ON waitlist_notifications(booking_id);
CREATE INDEX IF NOT EXISTS idx_waitlist_notifications_user_id ON waitlist_notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_waitlist_notifications_class_id ON waitlist_notifications(class_id);
CREATE INDEX IF NOT EXISTS idx_waitlist_notifications_status ON waitlist_notifications(status);
CREATE INDEX IF NOT EXISTS idx_waitlist_notifications_deadline ON waitlist_notifications(response_deadline);

-- ============================================================================
-- WAITLIST OFFERS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS waitlist_offers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  branch_id UUID NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
  offered_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'expired', 'auto_escalated')),
  accepted_at TIMESTAMP WITH TIME ZONE,
  declined_at TIMESTAMP WITH TIME ZONE,
  expired_at TIMESTAMP WITH TIME ZONE,
  escalated_at TIMESTAMP WITH TIME ZONE,
  next_offer_id UUID REFERENCES waitlist_offers(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_waitlist_offers_booking_id ON waitlist_offers(booking_id);
CREATE INDEX IF NOT EXISTS idx_waitlist_offers_user_id ON waitlist_offers(user_id);
CREATE INDEX IF NOT EXISTS idx_waitlist_offers_class_id ON waitlist_offers(class_id);
CREATE INDEX IF NOT EXISTS idx_waitlist_offers_status ON waitlist_offers(status);
CREATE INDEX IF NOT EXISTS idx_waitlist_offers_expires_at ON waitlist_offers(expires_at);

-- Trigger for updated_at
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_waitlist_offers_updated_at'
  ) THEN
    CREATE TRIGGER update_waitlist_offers_updated_at
      BEFORE UPDATE ON waitlist_offers
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

-- ============================================================================
-- NOTIFICATION PREFERENCES TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS notification_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  email_enabled BOOLEAN DEFAULT true,
  sms_enabled BOOLEAN DEFAULT false,
  push_enabled BOOLEAN DEFAULT true,
  waitlist_notification_enabled BOOLEAN DEFAULT true,
  booking_confirmation_enabled BOOLEAN DEFAULT true,
  cancellation_notification_enabled BOOLEAN DEFAULT true,
  reminder_notification_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id)
);

-- Trigger for updated_at
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_notification_preferences_updated_at'
  ) THEN
    CREATE TRIGGER update_notification_preferences_updated_at
      BEFORE UPDATE ON notification_preferences
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

-- ============================================================================
-- BRANCH SETTINGS FOR WAITLIST POLICIES
-- ============================================================================

-- Add waitlist policy columns to branch_settings
DO $$
BEGIN
  -- Time limit for accepting waitlist offer (in hours)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'branch_settings' AND column_name = 'waitlist_acceptance_hours'
  ) THEN
    ALTER TABLE branch_settings ADD COLUMN waitlist_acceptance_hours INTEGER DEFAULT 2;
  END IF;

  -- Enable/disable automated waitlist management
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'branch_settings' AND column_name = 'enable_auto_waitlist'
  ) THEN
    ALTER TABLE branch_settings ADD COLUMN enable_auto_waitlist BOOLEAN DEFAULT true;
  END IF;

  -- Number of reminder notifications before expiration
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'branch_settings' AND column_name = 'waitlist_reminder_count'
  ) THEN
    ALTER TABLE branch_settings ADD COLUMN waitlist_reminder_count INTEGER DEFAULT 1;
  END IF;

  -- Hours before class to stop waitlist promotions
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'branch_settings' AND column_name = 'waitlist_cutoff_hours'
  ) THEN
    ALTER TABLE branch_settings ADD COLUMN waitlist_cutoff_hours INTEGER DEFAULT 2;
  END IF;
END $$;

-- ============================================================================
-- FUNCTIONS FOR WAITLIST MANAGEMENT
-- ============================================================================

-- Function to offer spot to next person on waitlist
CREATE OR REPLACE FUNCTION offer_waitlist_spot(
  p_class_id UUID,
  p_acceptance_hours INTEGER DEFAULT 2
)
RETURNS UUID AS $$
DECLARE
  v_next_booking RECORD;
  v_offer_id UUID;
  v_expires_at TIMESTAMP WITH TIME ZONE;
  v_branch_settings RECORD;
BEGIN
  -- Get branch settings
  SELECT bs.* INTO v_branch_settings
  FROM classes c
  JOIN branch_settings bs ON c.branch_id = bs.branch_id
  WHERE c.id = p_class_id
  LIMIT 1;

  -- Check if auto waitlist is enabled
  IF v_branch_settings.enable_auto_waitlist = false THEN
    RETURN NULL;
  END IF;

  -- Check if class is too soon (within cutoff window)
  IF EXISTS (
    SELECT 1 FROM classes
    WHERE id = p_class_id
      AND scheduled_at < NOW() + (v_branch_settings.waitlist_cutoff_hours || ' hours')::INTERVAL
  ) THEN
    RETURN NULL;
  END IF;

  -- Get next person on waitlist
  SELECT b.* INTO v_next_booking
  FROM bookings b
  WHERE b.class_id = p_class_id
    AND b.status = 'waitlisted'
    AND NOT EXISTS (
      SELECT 1 FROM waitlist_offers wo
      WHERE wo.booking_id = b.id
        AND wo.status IN ('pending', 'accepted')
    )
  ORDER BY b.waitlist_position ASC, b.booked_at ASC
  LIMIT 1;

  IF NOT FOUND THEN
    RETURN NULL;
  END IF;

  -- Calculate expiration time
  v_expires_at := NOW() + (COALESCE(v_branch_settings.waitlist_acceptance_hours, p_acceptance_hours) || ' hours')::INTERVAL;

  -- Create offer
  INSERT INTO waitlist_offers (
    booking_id,
    user_id,
    class_id,
    branch_id,
    expires_at
  ) VALUES (
    v_next_booking.id,
    v_next_booking.user_id,
    p_class_id,
    (SELECT branch_id FROM classes WHERE id = p_class_id),
    v_expires_at
  ) RETURNING id INTO v_offer_id;

  -- Create notification
  INSERT INTO waitlist_notifications (
    booking_id,
    user_id,
    class_id,
    branch_id,
    notification_type,
    response_deadline,
    sent_via
  ) VALUES (
    v_next_booking.id,
    v_next_booking.user_id,
    p_class_id,
    (SELECT branch_id FROM classes WHERE id = p_class_id),
    'spot_available',
    v_expires_at,
    'email'
  );

  RETURN v_offer_id;
END;
$$ LANGUAGE plpgsql;

-- Function to accept waitlist offer
CREATE OR REPLACE FUNCTION accept_waitlist_offer(
  p_offer_id UUID,
  p_user_id UUID
)
RETURNS BOOLEAN AS $$
DECLARE
  v_offer RECORD;
  v_booking RECORD;
BEGIN
  -- Get offer details
  SELECT * INTO v_offer
  FROM waitlist_offers
  WHERE id = p_offer_id
    AND user_id = p_user_id
    AND status = 'pending'
    AND expires_at > NOW();

  IF NOT FOUND THEN
    RETURN false;
  END IF;

  -- Get booking details
  SELECT * INTO v_booking
  FROM bookings
  WHERE id = v_offer.booking_id;

  -- Update offer status
  UPDATE waitlist_offers
  SET status = 'accepted',
      accepted_at = NOW()
  WHERE id = p_offer_id;

  -- Promote booking from waitlist
  UPDATE bookings
  SET status = 'confirmed',
      waitlist_position = NULL,
      updated_at = NOW()
  WHERE id = v_offer.booking_id;

  -- Deduct class from membership if applicable
  IF v_booking.membership_id IS NOT NULL THEN
    UPDATE user_memberships
    SET classes_remaining = classes_remaining - 1
    WHERE id = v_booking.membership_id
      AND classes_remaining > 0;
  END IF;

  -- Create notification
  INSERT INTO waitlist_notifications (
    booking_id,
    user_id,
    class_id,
    branch_id,
    notification_type,
    sent_via
  ) VALUES (
    v_offer.booking_id,
    v_offer.user_id,
    v_offer.class_id,
    v_offer.branch_id,
    'spot_available',
    'email'
  );

  RETURN true;
END;
$$ LANGUAGE plpgsql;

-- Function to handle expired offers and auto-escalate
CREATE OR REPLACE FUNCTION handle_expired_waitlist_offers()
RETURNS INTEGER AS $$
DECLARE
  v_expired_offer RECORD;
  v_count INTEGER := 0;
  v_new_offer_id UUID;
BEGIN
  FOR v_expired_offer IN
    SELECT *
    FROM waitlist_offers
    WHERE status = 'pending'
      AND expires_at < NOW()
  LOOP
    -- Mark offer as expired
    UPDATE waitlist_offers
    SET status = 'expired',
        expired_at = NOW()
    WHERE id = v_expired_offer.id;

    -- Create notification
    INSERT INTO waitlist_notifications (
      booking_id,
      user_id,
      class_id,
      branch_id,
      notification_type,
      sent_via
    ) VALUES (
      v_expired_offer.booking_id,
      v_expired_offer.user_id,
      v_expired_offer.class_id,
      v_expired_offer.branch_id,
      'spot_expired',
      'email'
    );

    -- Auto-escalate to next person
    v_new_offer_id := offer_waitlist_spot(v_expired_offer.class_id);

    IF v_new_offer_id IS NOT NULL THEN
      -- Link the escalation
      UPDATE waitlist_offers
      SET next_offer_id = v_new_offer_id,
          escalated_at = NOW()
      WHERE id = v_expired_offer.id;

      v_count := v_count + 1;
    END IF;
  END LOOP;

  RETURN v_count;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- RECORD MIGRATION
-- ============================================================================

INSERT INTO schema_migrations (version, name, checksum, success)
VALUES ('006', 'add_waitlist_management', MD5('add_waitlist_management_2026_01_24'), true)
ON CONFLICT (version) DO NOTHING;
