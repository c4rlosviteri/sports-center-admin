-- Indoor Bike Booking System Database Schema
-- Updated to use Package-based system instead of Memberships

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enum types
CREATE TYPE user_role AS ENUM ('superuser', 'admin', 'client');
CREATE TYPE auth_provider AS ENUM ('email', 'google', 'apple');
CREATE TYPE booking_status AS ENUM ('confirmed', 'cancelled', 'waitlisted');
CREATE TYPE notification_type AS ENUM ('booking_confirmation', 'booking_cancellation', 'package_expiration', 'waitlist_promotion');

-- Branches table
CREATE TABLE branches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  address TEXT,
  phone VARCHAR(50),
  email VARCHAR(255),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255),
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  date_of_birth DATE,
  id_number VARCHAR(50),
  address TEXT,
  phone VARCHAR(50),
  role user_role NOT NULL DEFAULT 'client',
  branch_id UUID REFERENCES branches(id) ON DELETE SET NULL,
  terms_accepted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Admin branch assignments table (for multi-branch admin access)
CREATE TABLE admin_branch_assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  branch_id UUID NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(admin_id, branch_id)
);

-- Auth providers table (for OAuth)
CREATE TABLE user_auth_providers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  provider auth_provider NOT NULL,
  provider_user_id VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(provider, provider_user_id)
);

-- Sessions table
CREATE TABLE user_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token VARCHAR(500) NOT NULL UNIQUE,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- PACKAGE SYSTEM TABLES (replaces membership_plans and user_memberships)
-- ============================================================================

-- Class Package Templates table (replaces membership_plans)
CREATE TABLE class_package_templates (
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
  is_shareable BOOLEAN DEFAULT false,
  allows_waitlist BOOLEAN DEFAULT true,
  priority_booking BOOLEAN DEFAULT false,

  -- Restrictions
  allowed_class_types TEXT[],
  blackout_dates JSONB,
  max_classes_per_day INTEGER DEFAULT 1,
  max_classes_per_week INTEGER,

  -- Status
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- User Class Packages table (replaces user_memberships)
CREATE TABLE user_class_packages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  branch_id UUID NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
  package_template_id UUID NOT NULL REFERENCES class_package_templates(id) ON DELETE RESTRICT,

  -- Package Details
  total_classes INTEGER NOT NULL CHECK (total_classes > 0),
  classes_remaining INTEGER NOT NULL CHECK (classes_remaining >= 0),

  -- Validity
  purchased_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  activated_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE,

  -- Status
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'expired', 'exhausted', 'refunded', 'frozen')),
  frozen_until DATE,

  -- Gift Information
  is_gift BOOLEAN DEFAULT false,
  gift_from_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  gift_message TEXT,
  gift_redeemed_at TIMESTAMP WITH TIME ZONE,

  -- Sharing
  shared_with_user_ids UUID[],

  -- Payment
  payment_id UUID,
  purchase_price DECIMAL(10, 2) NOT NULL,

  -- Refund
  refund_amount DECIMAL(10, 2),
  refunded_at TIMESTAMP WITH TIME ZONE,
  refund_reason TEXT,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT valid_classes_remaining CHECK (classes_remaining <= total_classes)
);

-- Package Class Usage table
CREATE TABLE package_class_usage (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_package_id UUID NOT NULL REFERENCES user_class_packages(id) ON DELETE CASCADE,
  booking_id UUID NOT NULL,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  class_id UUID NOT NULL,
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

-- Gift Package Codes table
CREATE TABLE gift_package_codes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(50) NOT NULL UNIQUE,
  package_template_id UUID NOT NULL REFERENCES class_package_templates(id) ON DELETE RESTRICT,
  branch_id UUID NOT NULL REFERENCES branches(id) ON DELETE CASCADE,

  -- Purchaser Information
  purchased_by UUID REFERENCES users(id) ON DELETE SET NULL,
  purchased_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  purchase_price DECIMAL(10, 2) NOT NULL,
  payment_id UUID,

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

-- Package Invitations table (replaces invite_links)
CREATE TABLE package_invitations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  package_id UUID NOT NULL REFERENCES class_package_templates(id) ON DELETE CASCADE,
  branch_id UUID NOT NULL REFERENCES branches(id) ON DELETE CASCADE,

  -- Invitation Code
  code VARCHAR(50) NOT NULL UNIQUE,

  -- Creator
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,

  -- Status
  is_active BOOLEAN DEFAULT true,
  usage_count INTEGER DEFAULT 0,
  max_uses INTEGER,

  -- Validity
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP WITH TIME ZONE,

  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- CORE BOOKING SYSTEM TABLES
-- ============================================================================

-- Classes table
CREATE TABLE classes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  branch_id UUID NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  instructor VARCHAR(255),
  scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
  duration_minutes INTEGER NOT NULL DEFAULT 45,
  capacity INTEGER NOT NULL,
  waitlist_capacity INTEGER NOT NULL DEFAULT 3,
  booking_hours_before INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Bookings table
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  package_id UUID REFERENCES user_class_packages(id) ON DELETE SET NULL,
  status booking_status NOT NULL DEFAULT 'confirmed',
  waitlist_position INTEGER,
  booked_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  cancelled_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, class_id)
);

-- Payments table
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL,
  payment_date DATE NOT NULL,
  notes TEXT,
  recorded_by UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- SETTINGS AND CONFIGURATION TABLES
-- ============================================================================

-- Notification settings table
CREATE TABLE notification_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  branch_id UUID NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
  notification_type notification_type NOT NULL,
  is_enabled BOOLEAN DEFAULT true,
  email_template TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(branch_id, notification_type)
);

-- Branch settings table
CREATE TABLE branch_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  branch_id UUID NOT NULL UNIQUE REFERENCES branches(id) ON DELETE CASCADE,
  cancellation_hours_before INTEGER NOT NULL DEFAULT 2,
  booking_hours_before INTEGER DEFAULT 0,
  timezone VARCHAR(50) NOT NULL DEFAULT 'America/Guayaquil',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Admin action logs table
CREATE TABLE admin_action_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  action_type VARCHAR(100) NOT NULL,
  entity_type VARCHAR(100) NOT NULL,
  entity_id UUID,
  description TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- INDEXES
-- ============================================================================

-- Users
CREATE INDEX idx_users_branch_id ON users(branch_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- Sessions
CREATE INDEX idx_user_sessions_token ON user_sessions(token);
CREATE INDEX idx_user_sessions_user_id ON user_sessions(user_id);

-- Admin branch assignments
CREATE INDEX idx_admin_branch_assignments_admin_id ON admin_branch_assignments(admin_id);
CREATE INDEX idx_admin_branch_assignments_branch_id ON admin_branch_assignments(branch_id);

-- Package templates
CREATE INDEX idx_package_templates_branch_id ON class_package_templates(branch_id);
CREATE INDEX idx_package_templates_active ON class_package_templates(is_active);
CREATE INDEX idx_package_templates_display ON class_package_templates(display_order);

-- User packages
CREATE INDEX idx_user_packages_user_id ON user_class_packages(user_id);
CREATE INDEX idx_user_packages_branch_id ON user_class_packages(branch_id);
CREATE INDEX idx_user_packages_template ON user_class_packages(package_template_id);
CREATE INDEX idx_user_packages_status ON user_class_packages(status);
CREATE INDEX idx_user_packages_expires ON user_class_packages(expires_at);
CREATE INDEX idx_user_packages_gift ON user_class_packages(is_gift, gift_redeemed_at);
CREATE INDEX idx_user_packages_shared ON user_class_packages USING GIN(shared_with_user_ids);

-- Package usage
CREATE INDEX idx_package_usage_package ON package_class_usage(user_package_id);
CREATE INDEX idx_package_usage_booking ON package_class_usage(booking_id);
CREATE INDEX idx_package_usage_user ON package_class_usage(user_id);
CREATE INDEX idx_package_usage_class ON package_class_usage(class_id);
CREATE INDEX idx_package_usage_branch ON package_class_usage(branch_id);
CREATE INDEX idx_package_usage_date ON package_class_usage(used_at DESC);

-- Gift codes
CREATE INDEX idx_gift_codes_code ON gift_package_codes(code);
CREATE INDEX idx_gift_codes_branch ON gift_package_codes(branch_id);
CREATE INDEX idx_gift_codes_purchased_by ON gift_package_codes(purchased_by);
CREATE INDEX idx_gift_codes_redeemed ON gift_package_codes(redeemed, redeemed_at);
CREATE INDEX idx_gift_codes_expires ON gift_package_codes(expires_at);

-- Package invitations
CREATE INDEX idx_package_invitations_code ON package_invitations(code);
CREATE INDEX idx_package_invitations_package ON package_invitations(package_id);
CREATE INDEX idx_package_invitations_branch ON package_invitations(branch_id);
CREATE INDEX idx_package_invitations_active ON package_invitations(is_active);

-- Classes
CREATE INDEX idx_classes_branch_id ON classes(branch_id);
CREATE INDEX idx_classes_scheduled_at ON classes(scheduled_at);

-- Bookings
CREATE INDEX idx_bookings_user_id ON bookings(user_id);
CREATE INDEX idx_bookings_class_id ON bookings(class_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_package_id ON bookings(package_id);

-- Payments
CREATE INDEX idx_payments_user_id ON payments(user_id);

-- Admin logs
CREATE INDEX idx_admin_action_logs_admin_id ON admin_action_logs(admin_id);
CREATE INDEX idx_admin_action_logs_created_at ON admin_action_logs(created_at);

-- ============================================================================
-- FUNCTIONS
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

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
  SELECT * INTO v_package FROM user_class_packages WHERE id = p_user_package_id;
  IF NOT FOUND THEN RETURN false; END IF;

  IF v_package.user_id != p_user_id AND NOT (p_user_id = ANY(v_package.shared_with_user_ids)) THEN
    RETURN false;
  END IF;

  IF v_package.status != 'active' THEN RETURN false; END IF;
  IF v_package.classes_remaining <= 0 THEN RETURN false; END IF;
  IF v_package.expires_at IS NOT NULL AND v_package.expires_at < CURRENT_TIMESTAMP THEN RETURN false; END IF;
  IF v_package.frozen_until IS NOT NULL AND v_package.frozen_until > CURRENT_DATE THEN RETURN false; END IF;

  SELECT * INTO v_template FROM class_package_templates WHERE id = v_package.package_template_id;
  SELECT * INTO v_class FROM classes WHERE id = p_class_id;

  IF v_template.allowed_class_types IS NOT NULL AND NOT (v_class.name = ANY(v_template.allowed_class_types)) THEN
    RETURN false;
  END IF;

  IF v_template.max_classes_per_day IS NOT NULL THEN
    SELECT COUNT(*) INTO v_usage_today
    FROM package_class_usage pcu
    JOIN classes c ON pcu.class_id = c.id
    WHERE pcu.user_package_id = p_user_package_id AND DATE(c.scheduled_at) = CURRENT_DATE AND pcu.refunded = false;
    IF v_usage_today >= v_template.max_classes_per_day THEN RETURN false; END IF;
  END IF;

  IF v_template.max_classes_per_week IS NOT NULL THEN
    SELECT COUNT(*) INTO v_usage_this_week
    FROM package_class_usage pcu
    JOIN classes c ON pcu.class_id = c.id
    WHERE pcu.user_package_id = p_user_package_id
      AND c.scheduled_at >= DATE_TRUNC('week', CURRENT_DATE)
      AND c.scheduled_at < DATE_TRUNC('week', CURRENT_DATE) + INTERVAL '1 week'
      AND pcu.refunded = false;
    IF v_usage_this_week >= v_template.max_classes_per_week THEN RETURN false; END IF;
  END IF;

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
    v_code := 'GIFT-' ||
              UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 4)) || '-' ||
              UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 4)) || '-' ||
              UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 4));
    SELECT EXISTS (SELECT 1 FROM gift_package_codes WHERE code = v_code) INTO v_exists;
    EXIT WHEN NOT v_exists;
  END LOOP;
  RETURN v_code;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- TRIGGERS
-- ============================================================================

CREATE TRIGGER update_admin_branch_assignments_updated_at BEFORE UPDATE ON admin_branch_assignments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_branches_updated_at BEFORE UPDATE ON branches FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_class_package_templates_updated_at BEFORE UPDATE ON class_package_templates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_class_packages_updated_at BEFORE UPDATE ON user_class_packages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_classes_updated_at BEFORE UPDATE ON classes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_notification_settings_updated_at BEFORE UPDATE ON notification_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_branch_settings_updated_at BEFORE UPDATE ON branch_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_package_invitations_updated_at BEFORE UPDATE ON package_invitations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
