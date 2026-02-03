-- Migration: Add Class Packages (Alternative to Memberships)
-- Date: 2026-01-24
-- Description: Adds class pack system for credit-based bookings, gift packages, and flexible options

-- ============================================================================
-- CLASS PACKAGE TEMPLATES TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS class_package_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  branch_id UUID NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  class_count INTEGER NOT NULL CHECK (class_count > 0),
  price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),

  -- Validity Options
  validity_type VARCHAR(20) NOT NULL CHECK (validity_type IN ('unlimited', 'days', 'months')),
  validity_period INTEGER, -- Number of days/months, NULL for unlimited

  -- Package Features
  is_gift_eligible BOOLEAN DEFAULT true,
  is_shareable BOOLEAN DEFAULT false, -- Can multiple people use the same package
  allows_waitlist BOOLEAN DEFAULT true,
  priority_booking BOOLEAN DEFAULT false, -- Can book before non-package users

  -- Restrictions
  allowed_class_types TEXT[], -- NULL = all classes allowed
  blackout_dates JSONB, -- Array of date ranges when package can't be used
  max_classes_per_day INTEGER DEFAULT 1,
  max_classes_per_week INTEGER,

  -- Status
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_package_templates_branch_id ON class_package_templates(branch_id);
CREATE INDEX IF NOT EXISTS idx_package_templates_active ON class_package_templates(is_active);
CREATE INDEX IF NOT EXISTS idx_package_templates_display ON class_package_templates(display_order);

-- Trigger for updated_at
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_class_package_templates_updated_at'
  ) THEN
    CREATE TRIGGER update_class_package_templates_updated_at
      BEFORE UPDATE ON class_package_templates
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

-- ============================================================================
-- USER CLASS PACKAGES TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS user_class_packages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  branch_id UUID NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
  package_template_id UUID NOT NULL REFERENCES class_package_templates(id) ON DELETE RESTRICT,

  -- Package Details
  total_classes INTEGER NOT NULL CHECK (total_classes > 0),
  classes_remaining INTEGER NOT NULL CHECK (classes_remaining >= 0),

  -- Validity
  purchased_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  activated_at TIMESTAMP WITH TIME ZONE, -- When first class was booked
  expires_at TIMESTAMP WITH TIME ZONE, -- NULL for unlimited packages

  -- Status
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'expired', 'exhausted', 'refunded', 'frozen')),
  frozen_until DATE, -- For temporary suspension

  -- Gift Information
  is_gift BOOLEAN DEFAULT false,
  gift_from_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  gift_message TEXT,
  gift_redeemed_at TIMESTAMP WITH TIME ZONE,

  -- Sharing
  shared_with_user_ids UUID[], -- Array of user IDs who can use this package

  -- Payment
  payment_id UUID REFERENCES payments(id) ON DELETE SET NULL,
  purchase_price DECIMAL(10, 2) NOT NULL,

  -- Refund
  refund_amount DECIMAL(10, 2),
  refunded_at TIMESTAMP WITH TIME ZONE,
  refund_reason TEXT,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT valid_classes_remaining CHECK (classes_remaining <= total_classes)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_user_packages_user_id ON user_class_packages(user_id);
CREATE INDEX IF NOT EXISTS idx_user_packages_branch_id ON user_class_packages(branch_id);
CREATE INDEX IF NOT EXISTS idx_user_packages_template ON user_class_packages(package_template_id);
CREATE INDEX IF NOT EXISTS idx_user_packages_status ON user_class_packages(status);
CREATE INDEX IF NOT EXISTS idx_user_packages_expires ON user_class_packages(expires_at);
CREATE INDEX IF NOT EXISTS idx_user_packages_gift ON user_class_packages(is_gift, gift_redeemed_at);
CREATE INDEX IF NOT EXISTS idx_user_packages_shared ON user_class_packages USING GIN(shared_with_user_ids);

-- Trigger for updated_at
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_user_class_packages_updated_at'
  ) THEN
    CREATE TRIGGER update_user_class_packages_updated_at
      BEFORE UPDATE ON user_class_packages
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

-- ============================================================================
-- PACKAGE CLASS USAGE TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS package_class_usage (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_package_id UUID NOT NULL REFERENCES user_class_packages(id) ON DELETE CASCADE,
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  branch_id UUID NOT NULL REFERENCES branches(id) ON DELETE CASCADE,

  -- Usage Details
  used_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  credits_used INTEGER DEFAULT 1,

  -- Refund tracking
  refunded BOOLEAN DEFAULT false,
  refunded_at TIMESTAMP WITH TIME ZONE,
  refund_reason TEXT,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

  UNIQUE(user_package_id, booking_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_package_usage_package ON package_class_usage(user_package_id);
CREATE INDEX IF NOT EXISTS idx_package_usage_booking ON package_class_usage(booking_id);
CREATE INDEX IF NOT EXISTS idx_package_usage_user ON package_class_usage(user_id);
CREATE INDEX IF NOT EXISTS idx_package_usage_class ON package_class_usage(class_id);
CREATE INDEX IF NOT EXISTS idx_package_usage_branch ON package_class_usage(branch_id);
CREATE INDEX IF NOT EXISTS idx_package_usage_date ON package_class_usage(used_at DESC);

-- ============================================================================
-- GIFT PACKAGE CODES TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS gift_package_codes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(50) NOT NULL UNIQUE,
  package_template_id UUID NOT NULL REFERENCES class_package_templates(id) ON DELETE RESTRICT,
  branch_id UUID NOT NULL REFERENCES branches(id) ON DELETE CASCADE,

  -- Purchaser Information
  purchased_by UUID REFERENCES users(id) ON DELETE SET NULL,
  purchased_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  purchase_price DECIMAL(10, 2) NOT NULL,
  payment_id UUID REFERENCES payments(id) ON DELETE SET NULL,

  -- Gift Details
  recipient_email VARCHAR(255),
  recipient_name VARCHAR(255),
  gift_message TEXT,

  -- Redemption
  redeemed BOOLEAN DEFAULT false,
  redeemed_by UUID REFERENCES users(id) ON DELETE SET NULL,
  redeemed_at TIMESTAMP WITH TIME ZONE,
  user_package_id UUID REFERENCES user_class_packages(id) ON DELETE SET NULL,

  -- Validity
  expires_at TIMESTAMP WITH TIME ZONE,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_gift_codes_code ON gift_package_codes(code);
CREATE INDEX IF NOT EXISTS idx_gift_codes_branch ON gift_package_codes(branch_id);
CREATE INDEX IF NOT EXISTS idx_gift_codes_purchased_by ON gift_package_codes(purchased_by);
CREATE INDEX IF NOT EXISTS idx_gift_codes_redeemed ON gift_package_codes(redeemed, redeemed_at);
CREATE INDEX IF NOT EXISTS idx_gift_codes_expires ON gift_package_codes(expires_at);

-- ============================================================================
-- ADD PACKAGE SUPPORT TO BOOKINGS TABLE
-- ============================================================================

DO $$
BEGIN
  -- Add package_id column to bookings if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'bookings' AND column_name = 'package_id'
  ) THEN
    ALTER TABLE bookings ADD COLUMN package_id UUID REFERENCES user_class_packages(id) ON DELETE SET NULL;
    CREATE INDEX IF NOT EXISTS idx_bookings_package_id ON bookings(package_id);
  END IF;
END $$;

-- ============================================================================
-- FUNCTIONS FOR PACKAGE MANAGEMENT
-- ============================================================================

-- Function to check if user can book with package
CREATE OR REPLACE FUNCTION can_book_with_package(
  p_user_package_id UUID,
  p_class_id UUID,
  p_user_id UUID
)
RETURNS BOOLEAN AS $$
DECLARE
  v_package RECORD;
  v_template RECORD;
  v_class RECORD;
  v_usage_today INTEGER;
  v_usage_this_week INTEGER;
BEGIN
  -- Get package details
  SELECT * INTO v_package
  FROM user_class_packages
  WHERE id = p_user_package_id;

  IF NOT FOUND THEN
    RETURN false;
  END IF;

  -- Check if package belongs to user or is shared with them
  IF v_package.user_id != p_user_id AND NOT (p_user_id = ANY(v_package.shared_with_user_ids)) THEN
    RETURN false;
  END IF;

  -- Check if package is active
  IF v_package.status != 'active' THEN
    RETURN false;
  END IF;

  -- Check if package has credits remaining
  IF v_package.classes_remaining <= 0 THEN
    RETURN false;
  END IF;

  -- Check if package is expired
  IF v_package.expires_at IS NOT NULL AND v_package.expires_at < CURRENT_TIMESTAMP THEN
    RETURN false;
  END IF;

  -- Check if package is frozen
  IF v_package.frozen_until IS NOT NULL AND v_package.frozen_until > CURRENT_DATE THEN
    RETURN false;
  END IF;

  -- Get template restrictions
  SELECT * INTO v_template
  FROM class_package_templates
  WHERE id = v_package.package_template_id;

  -- Get class details
  SELECT * INTO v_class
  FROM classes
  WHERE id = p_class_id;

  -- Check class type restrictions
  IF v_template.allowed_class_types IS NOT NULL
     AND NOT (v_class.name = ANY(v_template.allowed_class_types)) THEN
    RETURN false;
  END IF;

  -- Check daily usage limit
  IF v_template.max_classes_per_day IS NOT NULL THEN
    SELECT COUNT(*) INTO v_usage_today
    FROM package_class_usage pcu
    JOIN classes c ON pcu.class_id = c.id
    WHERE pcu.user_package_id = p_user_package_id
      AND DATE(c.scheduled_at) = CURRENT_DATE
      AND pcu.refunded = false;

    IF v_usage_today >= v_template.max_classes_per_day THEN
      RETURN false;
    END IF;
  END IF;

  -- Check weekly usage limit
  IF v_template.max_classes_per_week IS NOT NULL THEN
    SELECT COUNT(*) INTO v_usage_this_week
    FROM package_class_usage pcu
    JOIN classes c ON pcu.class_id = c.id
    WHERE pcu.user_package_id = p_user_package_id
      AND c.scheduled_at >= DATE_TRUNC('week', CURRENT_DATE)
      AND c.scheduled_at < DATE_TRUNC('week', CURRENT_DATE) + INTERVAL '1 week'
      AND pcu.refunded = false;

    IF v_usage_this_week >= v_template.max_classes_per_week THEN
      RETURN false;
    END IF;
  END IF;

  -- All checks passed
  RETURN true;
END;
$$ LANGUAGE plpgsql;

-- Function to use package credit for booking
CREATE OR REPLACE FUNCTION use_package_credit(
  p_user_package_id UUID,
  p_booking_id UUID,
  p_class_id UUID,
  p_user_id UUID
)
RETURNS BOOLEAN AS $$
DECLARE
  v_can_book BOOLEAN;
BEGIN
  -- Check if booking is allowed
  v_can_book := can_book_with_package(p_user_package_id, p_class_id, p_user_id);

  IF NOT v_can_book THEN
    RETURN false;
  END IF;

  -- Activate package if first use
  UPDATE user_class_packages
  SET activated_at = COALESCE(activated_at, CURRENT_TIMESTAMP)
  WHERE id = p_user_package_id AND activated_at IS NULL;

  -- Deduct credit
  UPDATE user_class_packages
  SET classes_remaining = classes_remaining - 1
  WHERE id = p_user_package_id;

  -- Record usage
  INSERT INTO package_class_usage (
    user_package_id, booking_id, user_id, class_id, branch_id
  )
  SELECT
    p_user_package_id, p_booking_id, p_user_id, p_class_id, b.branch_id
  FROM bookings b
  WHERE b.id = p_booking_id;

  -- Update booking to reference package
  UPDATE bookings
  SET package_id = p_user_package_id
  WHERE id = p_booking_id;

  -- Mark package as exhausted if no credits remaining
  UPDATE user_class_packages
  SET status = 'exhausted'
  WHERE id = p_user_package_id
    AND classes_remaining = 0
    AND status = 'active';

  RETURN true;
END;
$$ LANGUAGE plpgsql;

-- Function to generate unique gift code
CREATE OR REPLACE FUNCTION generate_gift_code()
RETURNS VARCHAR(50) AS $$
DECLARE
  v_code VARCHAR(50);
  v_exists BOOLEAN;
BEGIN
  LOOP
    -- Generate code: GIFT-XXXX-XXXX-XXXX
    v_code := 'GIFT-' ||
              UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 4)) || '-' ||
              UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 4)) || '-' ||
              UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 4));

    -- Check if code already exists
    SELECT EXISTS (SELECT 1 FROM gift_package_codes WHERE code = v_code) INTO v_exists;

    EXIT WHEN NOT v_exists;
  END LOOP;

  RETURN v_code;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- RECORD MIGRATION
-- ============================================================================

INSERT INTO schema_migrations (version, name, checksum, success)
VALUES ('009', 'add_class_packages', MD5('add_class_packages_2026_01_24'), true)
ON CONFLICT (version) DO NOTHING;
