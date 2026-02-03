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

-- Better Auth "user" table (canonical user table)
CREATE TABLE "user" (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  "emailVerified" BOOLEAN DEFAULT false,
  name VARCHAR(255),
  image TEXT,
  -- Custom fields preserved from existing schema
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  date_of_birth DATE,
  id_number VARCHAR(50),
  address TEXT,
  phone VARCHAR(50),
  role user_role NOT NULL DEFAULT 'client',
  branch_id UUID REFERENCES branches(id) ON DELETE SET NULL,
  terms_accepted_at TIMESTAMP WITH TIME ZONE,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Admin branch assignments table (for multi-branch admin access)
CREATE TABLE admin_branch_assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_id UUID NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  branch_id UUID NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(admin_id, branch_id)
);

-- Better Auth "session" table
CREATE TABLE "session" (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "userId" UUID NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  token TEXT UNIQUE NOT NULL,
  "expiresAt" TIMESTAMP WITH TIME ZONE NOT NULL,
  "ipAddress" TEXT,
  "userAgent" TEXT,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Better Auth "account" table
CREATE TABLE "account" (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "userId" UUID NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  "accountId" TEXT NOT NULL,
  "providerId" TEXT NOT NULL,
  "accessToken" TEXT,
  "refreshToken" TEXT,
  "accessTokenExpiresAt" TIMESTAMP WITH TIME ZONE,
  "refreshTokenExpiresAt" TIMESTAMP WITH TIME ZONE,
  scope TEXT,
  "idToken" TEXT,
  password TEXT,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Better Auth "verification" table
CREATE TABLE "verification" (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  identifier TEXT NOT NULL,
  value TEXT NOT NULL,
  "expiresAt" TIMESTAMP WITH TIME ZONE NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
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
  user_id UUID NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
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
  gift_from_user_id UUID REFERENCES "user"(id) ON DELETE SET NULL,
  gift_message TEXT,
  gift_redeemed_at TIMESTAMP WITH TIME ZONE,

  -- Sharing
  is_shareable BOOLEAN DEFAULT false,
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
  user_id UUID NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
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
  purchased_by UUID REFERENCES "user"(id) ON DELETE SET NULL,
  purchased_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  purchase_price DECIMAL(10, 2) NOT NULL,
  payment_id UUID,

  -- Gift Details
  recipient_email VARCHAR(255),
  recipient_name VARCHAR(255),
  gift_message TEXT,

  -- Redemption
  redeemed BOOLEAN DEFAULT false,
  redeemed_by UUID REFERENCES "user"(id) ON DELETE SET NULL,
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
  created_by UUID REFERENCES "user"(id) ON DELETE SET NULL,

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
  user_id UUID NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  branch_id UUID NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
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
  user_id UUID NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  branch_id UUID NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL,
  payment_date DATE NOT NULL,
  notes TEXT,
  recorded_by UUID NOT NULL REFERENCES "user"(id) ON DELETE RESTRICT,
  status VARCHAR(20) NOT NULL DEFAULT 'completed',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);


-- ============================================================================
-- ATTENDANCE AND PENALTIES
-- ============================================================================

CREATE TABLE attendance_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  branch_id UUID NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
  status VARCHAR(20) NOT NULL CHECK (status IN ('present', 'absent', 'late', 'excused')),
  marked_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  marked_by UUID REFERENCES "user"(id) ON DELETE SET NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(booking_id)
);

CREATE INDEX idx_attendance_records_user_id ON attendance_records(user_id);
CREATE INDEX idx_attendance_records_class_id ON attendance_records(class_id);
CREATE INDEX idx_attendance_records_branch_id ON attendance_records(branch_id);
CREATE INDEX idx_attendance_records_status ON attendance_records(status);
CREATE INDEX idx_attendance_records_marked_at ON attendance_records(marked_at DESC);

CREATE TABLE no_show_penalties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  branch_id UUID NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
  no_show_count INTEGER DEFAULT 0,
  penalty_start_date DATE,
  penalty_end_date DATE,
  is_active BOOLEAN DEFAULT false,
  penalty_type VARCHAR(50) CHECK (penalty_type IN ('booking_restriction', 'warning', 'fee', 'suspension')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  created_by UUID REFERENCES "user"(id) ON DELETE SET NULL,
  applied_by UUID REFERENCES "user"(id) ON DELETE SET NULL,
  notes TEXT
);

CREATE INDEX idx_no_show_penalties_user_id ON no_show_penalties(user_id);
CREATE INDEX idx_no_show_penalties_branch_id ON no_show_penalties(branch_id);
CREATE INDEX idx_no_show_penalties_is_active ON no_show_penalties(is_active);

CREATE TABLE late_cancellation_fees (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  branch_id UUID NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
  fee_amount DECIMAL(10, 2) NOT NULL,
  cancelled_at TIMESTAMP WITH TIME ZONE NOT NULL,
  payment_status VARCHAR(20) DEFAULT 'unpaid',
  amount DECIMAL(10, 2) NOT NULL,
  cancellation_time TIMESTAMP WITH TIME ZONE NOT NULL,
  class_time TIMESTAMP WITH TIME ZONE NOT NULL,
  hours_before_class DECIMAL(5, 2),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'waived', 'disputed')),
  paid_at TIMESTAMP WITH TIME ZONE,
  waived_by UUID REFERENCES "user"(id) ON DELETE SET NULL,
  waived_reason TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_late_cancellation_fees_user_id ON late_cancellation_fees(user_id);
CREATE INDEX idx_late_cancellation_fees_booking_id ON late_cancellation_fees(booking_id);
CREATE INDEX idx_late_cancellation_fees_branch_id ON late_cancellation_fees(branch_id);
CREATE INDEX idx_late_cancellation_fees_status ON late_cancellation_fees(status);

-- ============================================================================
-- WAITLIST MANAGEMENT
-- ============================================================================

CREATE TABLE waitlist_notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
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

CREATE INDEX idx_waitlist_notifications_booking_id ON waitlist_notifications(booking_id);
CREATE INDEX idx_waitlist_notifications_user_id ON waitlist_notifications(user_id);
CREATE INDEX idx_waitlist_notifications_class_id ON waitlist_notifications(class_id);
CREATE INDEX idx_waitlist_notifications_status ON waitlist_notifications(status);
CREATE INDEX idx_waitlist_notifications_deadline ON waitlist_notifications(response_deadline);

CREATE TABLE waitlist_offers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
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

CREATE INDEX idx_waitlist_offers_booking_id ON waitlist_offers(booking_id);
CREATE INDEX idx_waitlist_offers_user_id ON waitlist_offers(user_id);
CREATE INDEX idx_waitlist_offers_class_id ON waitlist_offers(class_id);
CREATE INDEX idx_waitlist_offers_status ON waitlist_offers(status);
CREATE INDEX idx_waitlist_offers_expires_at ON waitlist_offers(expires_at);

CREATE TABLE notification_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
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

-- ============================================================================
-- INSTRUCTOR MANAGEMENT
-- ============================================================================

CREATE TABLE instructor_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES "user"(id) ON DELETE CASCADE UNIQUE,
  branch_id UUID NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
  bio TEXT,
  specializations TEXT[],
  certifications JSONB,
  hire_date DATE,
  hourly_rate DECIMAL(10, 2),
  is_active BOOLEAN DEFAULT true,
  profile_image_url VARCHAR(500),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_instructor_profiles_user_id ON instructor_profiles(user_id);
CREATE INDEX idx_instructor_profiles_branch_id ON instructor_profiles(branch_id);
CREATE INDEX idx_instructor_profiles_active ON instructor_profiles(is_active);

CREATE TABLE instructor_availability (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  instructor_id UUID NOT NULL REFERENCES instructor_profiles(id) ON DELETE CASCADE,
  branch_id UUID NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_recurring BOOLEAN DEFAULT true,
  effective_date DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT valid_instructor_time_range CHECK (end_time > start_time)
);

CREATE INDEX idx_instructor_availability_instructor ON instructor_availability(instructor_id);
CREATE INDEX idx_instructor_availability_branch ON instructor_availability(branch_id);
CREATE INDEX idx_instructor_availability_day ON instructor_availability(day_of_week);

CREATE TABLE instructor_time_off (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  instructor_id UUID NOT NULL REFERENCES instructor_profiles(id) ON DELETE CASCADE,
  branch_id UUID NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  reason VARCHAR(100),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'denied')),
  notes TEXT,
  requested_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  approved_by UUID REFERENCES "user"(id) ON DELETE SET NULL,
  approved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT valid_instructor_date_range CHECK (end_date >= start_date)
);

CREATE INDEX idx_instructor_time_off_instructor ON instructor_time_off(instructor_id);
CREATE INDEX idx_instructor_time_off_branch ON instructor_time_off(branch_id);
CREATE INDEX idx_instructor_time_off_dates ON instructor_time_off(start_date, end_date);
CREATE INDEX idx_instructor_time_off_status ON instructor_time_off(status);

CREATE TABLE instructor_class_assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  instructor_id UUID NOT NULL REFERENCES instructor_profiles(id) ON DELETE CASCADE,
  class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  branch_id UUID NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
  assignment_status VARCHAR(20) DEFAULT 'assigned' CHECK (
    assignment_status IN ('assigned', 'confirmed', 'completed', 'cancelled', 'no_show')
  ),
  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  assigned_by UUID REFERENCES "user"(id) ON DELETE SET NULL,
  notes TEXT,
  payment_amount DECIMAL(10, 2),
  payment_status VARCHAR(20) DEFAULT 'pending' CHECK (
    payment_status IN ('pending', 'paid', 'cancelled')
  ),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(instructor_id, class_id)
);

CREATE INDEX idx_instructor_assignments_instructor ON instructor_class_assignments(instructor_id);
CREATE INDEX idx_instructor_assignments_class ON instructor_class_assignments(class_id);
CREATE INDEX idx_instructor_assignments_branch ON instructor_class_assignments(branch_id);
CREATE INDEX idx_instructor_assignments_status ON instructor_class_assignments(assignment_status);
CREATE INDEX idx_instructor_assignments_payment ON instructor_class_assignments(payment_status);

CREATE TABLE instructor_client_notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  instructor_id UUID NOT NULL REFERENCES instructor_profiles(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  branch_id UUID NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
  note_text TEXT NOT NULL,
  note_type VARCHAR(50) CHECK (note_type IN ('general', 'performance', 'health', 'behavior', 'goals')),
  is_private BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_instructor_notes_instructor ON instructor_client_notes(instructor_id);
CREATE INDEX idx_instructor_notes_client ON instructor_client_notes(client_id);
CREATE INDEX idx_instructor_notes_branch ON instructor_client_notes(branch_id);
CREATE INDEX idx_instructor_notes_type ON instructor_client_notes(note_type);

-- ============================================================================
-- HEALTH PROFILES
-- ============================================================================

CREATE TABLE client_health_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES "user"(id) ON DELETE CASCADE UNIQUE,
  branch_id UUID NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
  medical_conditions JSONB,
  current_injuries JSONB,
  medications TEXT[],
  allergies TEXT[],
  fitness_level VARCHAR(20) CHECK (fitness_level IN ('beginner', 'intermediate', 'advanced', 'athlete')),
  fitness_goals TEXT[],
  exercise_restrictions TEXT,
  height_cm DECIMAL(5, 2),
  weight_kg DECIMAL(5, 2),
  previous_injuries JSONB,
  surgery_history JSONB,
  medical_release_signed BOOLEAN DEFAULT false,
  medical_release_date DATE,
  liability_waiver_signed BOOLEAN DEFAULT false,
  liability_waiver_date DATE,
  doctor_name VARCHAR(255),
  doctor_phone VARCHAR(50),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_client_health_user_id ON client_health_profiles(user_id);
CREATE INDEX idx_client_health_branch_id ON client_health_profiles(branch_id);
CREATE INDEX idx_client_health_fitness_level ON client_health_profiles(fitness_level);
CREATE INDEX idx_client_health_waivers ON client_health_profiles(medical_release_signed, liability_waiver_signed);

CREATE TABLE emergency_contacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  branch_id UUID NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
  contact_name VARCHAR(255) NOT NULL,
  relationship VARCHAR(100),
  phone_primary VARCHAR(50) NOT NULL,
  phone_secondary VARCHAR(50),
  email VARCHAR(255),
  is_primary BOOLEAN DEFAULT false,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_emergency_contacts_user_id ON emergency_contacts(user_id);
CREATE INDEX idx_emergency_contacts_branch_id ON emergency_contacts(branch_id);
CREATE INDEX idx_emergency_contacts_primary ON emergency_contacts(is_primary);

CREATE TABLE health_assessments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  branch_id UUID NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
  assessment_date DATE NOT NULL,
  conducted_by UUID REFERENCES "user"(id) ON DELETE SET NULL,
  resting_heart_rate INTEGER,
  blood_pressure_systolic INTEGER,
  blood_pressure_diastolic INTEGER,
  weight_kg DECIMAL(5, 2),
  body_fat_percentage DECIMAL(4, 2),
  muscle_mass_kg DECIMAL(5, 2),
  max_heart_rate INTEGER,
  vo2_max DECIMAL(5, 2),
  flexibility_score INTEGER,
  strength_score INTEGER,
  endurance_score INTEGER,
  fitness_level VARCHAR(20) CHECK (fitness_level IN ('beginner', 'intermediate', 'advanced', 'athlete')),
  recommendations TEXT,
  goals_set JSONB,
  previous_assessment_id UUID REFERENCES health_assessments(id) ON DELETE SET NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_health_assessments_user_id ON health_assessments(user_id);
CREATE INDEX idx_health_assessments_branch_id ON health_assessments(branch_id);
CREATE INDEX idx_health_assessments_date ON health_assessments(assessment_date DESC);
CREATE INDEX idx_health_assessments_conducted_by ON health_assessments(conducted_by);

CREATE TABLE injury_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  branch_id UUID NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
  class_id UUID REFERENCES classes(id) ON DELETE SET NULL,
  incident_date TIMESTAMP WITH TIME ZONE NOT NULL,
  injury_type VARCHAR(100) NOT NULL,
  injury_location VARCHAR(100),
  severity VARCHAR(20) CHECK (severity IN ('minor', 'moderate', 'severe', 'critical')),
  description TEXT NOT NULL,
  activity_at_time TEXT,
  first_aid_administered BOOLEAN DEFAULT false,
  first_aid_details TEXT,
  emergency_services_called BOOLEAN DEFAULT false,
  hospital_visit BOOLEAN DEFAULT false,
  reported_by UUID NOT NULL REFERENCES "user"(id) ON DELETE SET NULL,
  witnesses JSONB,
  follow_up_required BOOLEAN DEFAULT false,
  follow_up_notes TEXT,
  cleared_to_return BOOLEAN DEFAULT false,
  cleared_date DATE,
  cleared_by UUID REFERENCES "user"(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_injury_reports_user_id ON injury_reports(user_id);
CREATE INDEX idx_injury_reports_branch_id ON injury_reports(branch_id);
CREATE INDEX idx_injury_reports_class_id ON injury_reports(class_id);
CREATE INDEX idx_injury_reports_date ON injury_reports(incident_date DESC);
CREATE INDEX idx_injury_reports_severity ON injury_reports(severity);
CREATE INDEX idx_injury_reports_follow_up ON injury_reports(follow_up_required);

CREATE TABLE parq_questionnaires (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  branch_id UUID NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
  submission_date DATE NOT NULL,
  heart_condition BOOLEAN,
  chest_pain_activity BOOLEAN,
  chest_pain_rest BOOLEAN,
  dizziness_balance BOOLEAN,
  bone_joint_problem BOOLEAN,
  blood_pressure_medication BOOLEAN,
  other_reason BOOLEAN,
  other_reason_details TEXT,
  physician_approval_required BOOLEAN DEFAULT false,
  physician_approval_received BOOLEAN DEFAULT false,
  physician_approval_date DATE,
  client_signature_data TEXT,
  staff_signature_data TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_parq_user_id ON parq_questionnaires(user_id);
CREATE INDEX idx_parq_branch_id ON parq_questionnaires(branch_id);
CREATE INDEX idx_parq_date ON parq_questionnaires(submission_date DESC);
CREATE INDEX idx_parq_approval ON parq_questionnaires(physician_approval_required, physician_approval_received);

-- ============================================================================
-- EQUIPMENT MANAGEMENT
-- ============================================================================

CREATE TABLE equipment_types (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  branch_id UUID NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  icon VARCHAR(50),
  requires_assignment BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(branch_id, name)
);

CREATE INDEX idx_equipment_types_branch ON equipment_types(branch_id);

CREATE TABLE equipment (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  branch_id UUID NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
  equipment_type_id UUID NOT NULL REFERENCES equipment_types(id) ON DELETE RESTRICT,
  equipment_number VARCHAR(50) NOT NULL,
  name VARCHAR(255),
  serial_number VARCHAR(255),
  manufacturer VARCHAR(255),
  model VARCHAR(255),
  purchase_date DATE,
  purchase_price DECIMAL(10, 2),
  status VARCHAR(20) DEFAULT 'available' CHECK (status IN (
    'available', 'in_use', 'maintenance', 'out_of_service', 'retired'
  )),
  condition VARCHAR(20) CHECK (condition IN ('excellent', 'good', 'fair', 'poor')),
  location VARCHAR(255),
  specifications JSONB,
  features TEXT[],
  last_maintenance_date DATE,
  next_maintenance_due DATE,
  maintenance_interval_days INTEGER DEFAULT 90,
  total_usage_hours DECIMAL(10, 2) DEFAULT 0,
  notes TEXT,
  internal_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(branch_id, equipment_number)
);

CREATE INDEX idx_equipment_branch ON equipment(branch_id);
CREATE INDEX idx_equipment_type ON equipment(equipment_type_id);
CREATE INDEX idx_equipment_number ON equipment(equipment_number);
CREATE INDEX idx_equipment_status ON equipment(status);
CREATE INDEX idx_equipment_maintenance_due ON equipment(next_maintenance_due);

CREATE TABLE equipment_assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  equipment_id UUID NOT NULL REFERENCES equipment(id) ON DELETE CASCADE,
  class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  branch_id UUID NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
  booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,
  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  assigned_by UUID REFERENCES "user"(id) ON DELETE SET NULL,
  assignment_type VARCHAR(20) DEFAULT 'manual' CHECK (assignment_type IN ('manual', 'auto', 'preference')),
  status VARCHAR(20) DEFAULT 'assigned' CHECK (status IN ('assigned', 'checked_in', 'in_use', 'completed', 'cancelled')),
  checked_in_at TIMESTAMP WITH TIME ZONE,
  checked_out_at TIMESTAMP WITH TIME ZONE,
  usage_duration_minutes INTEGER,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(class_id, user_id),
  CONSTRAINT no_double_assignment UNIQUE(equipment_id, class_id)
);

CREATE INDEX idx_equipment_assignments_equipment ON equipment_assignments(equipment_id);
CREATE INDEX idx_equipment_assignments_class ON equipment_assignments(class_id);
CREATE INDEX idx_equipment_assignments_user ON equipment_assignments(user_id);
CREATE INDEX idx_equipment_assignments_branch ON equipment_assignments(branch_id);
CREATE INDEX idx_equipment_assignments_status ON equipment_assignments(status);

CREATE TABLE client_equipment_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  branch_id UUID NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
  equipment_type_id UUID NOT NULL REFERENCES equipment_types(id) ON DELETE CASCADE,
  preferred_equipment_ids UUID[],
  avoid_equipment_ids UUID[],
  auto_assign_preferred BOOLEAN DEFAULT true,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, equipment_type_id)
);

CREATE INDEX idx_client_equipment_pref_user ON client_equipment_preferences(user_id);
CREATE INDEX idx_client_equipment_pref_branch ON client_equipment_preferences(branch_id);
CREATE INDEX idx_client_equipment_pref_type ON client_equipment_preferences(equipment_type_id);
CREATE INDEX idx_client_equipment_pref_preferred ON client_equipment_preferences USING GIN(preferred_equipment_ids);

CREATE TABLE equipment_maintenance_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  equipment_id UUID NOT NULL REFERENCES equipment(id) ON DELETE CASCADE,
  branch_id UUID NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
  maintenance_date DATE NOT NULL,
  maintenance_type VARCHAR(50) NOT NULL CHECK (maintenance_type IN (
    'routine', 'repair', 'inspection', 'cleaning', 'replacement', 'upgrade'
  )),
  performed_by UUID REFERENCES "user"(id) ON DELETE SET NULL,
  external_service_provider VARCHAR(255),
  description TEXT NOT NULL,
  parts_replaced JSONB,
  labor_hours DECIMAL(5, 2),
  total_cost DECIMAL(10, 2),
  condition_before VARCHAR(20),
  condition_after VARCHAR(20),
  next_maintenance_due DATE,
  photos JSONB,
  documents JSONB,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_equipment_maintenance_equipment ON equipment_maintenance_logs(equipment_id);
CREATE INDEX idx_equipment_maintenance_branch ON equipment_maintenance_logs(branch_id);
CREATE INDEX idx_equipment_maintenance_date ON equipment_maintenance_logs(maintenance_date DESC);
CREATE INDEX idx_equipment_maintenance_type ON equipment_maintenance_logs(maintenance_type);
CREATE INDEX idx_equipment_maintenance_performed_by ON equipment_maintenance_logs(performed_by);

CREATE TABLE equipment_issues (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  equipment_id UUID NOT NULL REFERENCES equipment(id) ON DELETE CASCADE,
  branch_id UUID NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
  reported_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  reported_by UUID NOT NULL REFERENCES "user"(id) ON DELETE SET NULL,
  issue_type VARCHAR(50) CHECK (issue_type IN (
    'malfunction', 'damage', 'safety_concern', 'discomfort', 'noise', 'cleanliness', 'other'
  )),
  severity VARCHAR(20) DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  photos JSONB,
  status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open', 'acknowledged', 'in_progress', 'resolved', 'closed')),
  assigned_to UUID REFERENCES "user"(id) ON DELETE SET NULL,
  resolved_at TIMESTAMP WITH TIME ZONE,
  resolved_by UUID REFERENCES "user"(id) ON DELETE SET NULL,
  resolution_notes TEXT,
  maintenance_log_id UUID REFERENCES equipment_maintenance_logs(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_equipment_issues_equipment ON equipment_issues(equipment_id);
CREATE INDEX idx_equipment_issues_branch ON equipment_issues(branch_id);
CREATE INDEX idx_equipment_issues_status ON equipment_issues(status);
CREATE INDEX idx_equipment_issues_severity ON equipment_issues(severity);
CREATE INDEX idx_equipment_issues_reported_by ON equipment_issues(reported_by);
CREATE INDEX idx_equipment_issues_date ON equipment_issues(reported_at DESC);



-- ============================================================================
-- RECURRING CLASSES
-- ============================================================================

CREATE TABLE recurring_class_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  branch_id UUID NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  instructor VARCHAR(255),
  day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  start_time TIME NOT NULL,
  duration_minutes INTEGER NOT NULL,
  capacity INTEGER NOT NULL DEFAULT 20,
  waitlist_capacity INTEGER NOT NULL DEFAULT 5,
  is_active BOOLEAN DEFAULT true,
  start_date DATE NOT NULL,
  end_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  created_by UUID REFERENCES "user"(id) ON DELETE SET NULL
);

CREATE INDEX idx_recurring_templates_branch_id ON recurring_class_templates(branch_id);
CREATE INDEX idx_recurring_templates_day_of_week ON recurring_class_templates(day_of_week);
CREATE INDEX idx_recurring_templates_is_active ON recurring_class_templates(is_active);

CREATE TABLE holiday_exceptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  branch_id UUID NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  exception_date DATE NOT NULL,
  is_closure BOOLEAN DEFAULT true,
  notes TEXT,
  description TEXT,
  affects_all_classes BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  created_by UUID REFERENCES "user"(id) ON DELETE SET NULL,
  UNIQUE(branch_id, exception_date)
);

CREATE INDEX idx_holiday_exceptions_branch_id ON holiday_exceptions(branch_id);
CREATE INDEX idx_holiday_exceptions_date ON holiday_exceptions(exception_date);

CREATE TABLE generated_classes_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  branch_id UUID NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
  template_id UUID REFERENCES recurring_class_templates(id) ON DELETE SET NULL,
  generation_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  generated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  classes_generated INTEGER NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  generated_by UUID REFERENCES "user"(id) ON DELETE SET NULL,
  notes TEXT
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
  no_show_threshold INTEGER DEFAULT 3,
  late_cancellation_hours INTEGER DEFAULT 24,
  late_cancellation_fee DECIMAL(10, 2) DEFAULT 10.00,
  penalty_duration_days INTEGER DEFAULT 30,
  enable_attendance_tracking BOOLEAN DEFAULT true,
  waitlist_acceptance_hours INTEGER DEFAULT 2,
  enable_auto_waitlist BOOLEAN DEFAULT true,
  waitlist_reminder_count INTEGER DEFAULT 1,
  waitlist_cutoff_hours INTEGER DEFAULT 2,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Admin action logs table
CREATE TABLE admin_action_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_id UUID NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  action_type VARCHAR(100) NOT NULL,
  entity_type VARCHAR(100) NOT NULL,
  entity_id UUID,
  description TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- FOREIGN KEYS (added after core tables exist)
-- ============================================================================

ALTER TABLE package_class_usage
  ADD CONSTRAINT package_class_usage_booking_id_fkey
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE;

ALTER TABLE package_class_usage
  ADD CONSTRAINT package_class_usage_class_id_fkey
    FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE;

ALTER TABLE user_class_packages
  ADD CONSTRAINT user_class_packages_payment_id_fkey
    FOREIGN KEY (payment_id) REFERENCES payments(id) ON DELETE SET NULL;

ALTER TABLE gift_package_codes
  ADD CONSTRAINT gift_package_codes_payment_id_fkey
    FOREIGN KEY (payment_id) REFERENCES payments(id) ON DELETE SET NULL;

-- ============================================================================
-- INDEXES
-- ============================================================================

-- Users
CREATE INDEX idx_user_branch_id ON "user"(branch_id);
CREATE INDEX idx_user_email ON "user"(email);
CREATE INDEX idx_user_role ON "user"(role);

-- Better Auth sessions
CREATE INDEX idx_session_user_id ON "session"("userId");
CREATE INDEX idx_session_token ON "session"(token);

-- Better Auth accounts
CREATE INDEX idx_account_user_id ON "account"("userId");
CREATE INDEX idx_account_provider ON "account"("providerId", "accountId");

-- Better Auth verification
CREATE INDEX idx_verification_identifier ON "verification"(identifier);

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

-- Function to update Better Auth "updatedAt" timestamp
CREATE OR REPLACE FUNCTION update_better_auth_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW."updatedAt" = CURRENT_TIMESTAMP;
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


-- Function to check if client has required medical clearance
CREATE OR REPLACE FUNCTION has_medical_clearance(
  p_user_id UUID
)
RETURNS BOOLEAN AS $$
DECLARE
  v_profile RECORD;
  v_parq RECORD;
BEGIN
  SELECT * INTO v_profile
  FROM client_health_profiles
  WHERE user_id = p_user_id;

  IF v_profile.medical_release_signed = false OR v_profile.liability_waiver_signed = false THEN
    RETURN false;
  END IF;

  SELECT * INTO v_parq
  FROM parq_questionnaires
  WHERE user_id = p_user_id
  ORDER BY submission_date DESC
  LIMIT 1;

  IF NOT FOUND THEN
    RETURN false;
  END IF;

  IF v_parq.physician_approval_required = true AND v_parq.physician_approval_received = false THEN
    RETURN false;
  END IF;

  RETURN true;
END;
$$ LANGUAGE plpgsql;

-- Function to get client health summary for instructors
CREATE OR REPLACE FUNCTION get_client_health_summary(
  p_user_id UUID
)
RETURNS TABLE (
  has_medical_conditions BOOLEAN,
  has_current_injuries BOOLEAN,
  fitness_level VARCHAR(20),
  restrictions TEXT,
  medical_clearance BOOLEAN,
  emergency_contact_name VARCHAR(255),
  emergency_contact_phone VARCHAR(50)
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    CASE WHEN chp.medical_conditions IS NOT NULL
         AND jsonb_array_length(chp.medical_conditions) > 0
         THEN true ELSE false END as has_medical_conditions,
    CASE WHEN chp.current_injuries IS NOT NULL
         AND jsonb_array_length(chp.current_injuries) > 0
         THEN true ELSE false END as has_current_injuries,
    chp.fitness_level,
    chp.exercise_restrictions as restrictions,
    has_medical_clearance(p_user_id) as medical_clearance,
    ec.contact_name as emergency_contact_name,
    ec.phone_primary as emergency_contact_phone
  FROM client_health_profiles chp
  LEFT JOIN emergency_contacts ec ON chp.user_id = ec.user_id AND ec.is_primary = true
  WHERE chp.user_id = p_user_id
  LIMIT 1;
END;
$$ LANGUAGE plpgsql;

-- Function to get available equipment for a class
CREATE OR REPLACE FUNCTION get_available_equipment_for_class(
  p_class_id UUID,
  p_equipment_type_id UUID
)
RETURNS TABLE (
  equipment_id UUID,
  equipment_number VARCHAR(50),
  equipment_name VARCHAR(255),
  condition VARCHAR(20),
  is_preferred BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    e.id as equipment_id,
    e.equipment_number,
    e.name as equipment_name,
    e.condition,
    false as is_preferred
  FROM equipment e
  WHERE e.equipment_type_id = p_equipment_type_id
    AND e.status = 'available'
    AND NOT EXISTS (
      SELECT 1 FROM equipment_assignments ea
      WHERE ea.equipment_id = e.id
        AND ea.class_id = p_class_id
        AND ea.status NOT IN ('cancelled', 'completed')
    )
    AND NOT EXISTS (
      SELECT 1 FROM equipment_issues ei
      WHERE ei.equipment_id = e.id
        AND ei.status IN ('open', 'acknowledged', 'in_progress')
        AND ei.severity IN ('high', 'critical')
    )
  ORDER BY e.equipment_number;
END;
$$ LANGUAGE plpgsql;

-- Function to auto-assign equipment based on preferences
CREATE OR REPLACE FUNCTION auto_assign_equipment(
  p_class_id UUID,
  p_user_id UUID,
  p_equipment_type_id UUID
)
RETURNS UUID AS $$
DECLARE
  v_equipment_id UUID;
  v_preferences RECORD;
  v_preferred_id UUID;
BEGIN
  SELECT * INTO v_preferences
  FROM client_equipment_preferences
  WHERE user_id = p_user_id
    AND equipment_type_id = p_equipment_type_id;

  IF FOUND AND v_preferences.auto_assign_preferred THEN
    FOREACH v_preferred_id IN ARRAY v_preferences.preferred_equipment_ids
    LOOP
      IF EXISTS (
        SELECT 1 FROM get_available_equipment_for_class(p_class_id, p_equipment_type_id)
        WHERE equipment_id = v_preferred_id
      ) THEN
        v_equipment_id := v_preferred_id;
        EXIT;
      END IF;
    END LOOP;
  END IF;

  IF v_equipment_id IS NULL THEN
    SELECT equipment_id INTO v_equipment_id
    FROM get_available_equipment_for_class(p_class_id, p_equipment_type_id)
    LIMIT 1;
  END IF;

  IF v_equipment_id IS NOT NULL THEN
    INSERT INTO equipment_assignments (
      equipment_id, class_id, user_id, branch_id, assignment_type
    )
    SELECT
      v_equipment_id, p_class_id, p_user_id, c.branch_id,
      CASE WHEN v_preferences.auto_assign_preferred THEN 'preference' ELSE 'auto' END
    FROM classes c
    WHERE c.id = p_class_id;
  END IF;

  RETURN v_equipment_id;
END;
$$ LANGUAGE plpgsql;

-- Function to mark equipment for maintenance
CREATE OR REPLACE FUNCTION schedule_equipment_maintenance(
  p_equipment_id UUID,
  p_maintenance_date DATE,
  p_duration_days INTEGER DEFAULT 1
)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE equipment
  SET
    status = 'maintenance',
    next_maintenance_due = p_maintenance_date + (maintenance_interval_days || ' days')::INTERVAL
  WHERE id = p_equipment_id;

  UPDATE equipment_assignments ea
  SET status = 'cancelled'
  FROM classes c
  WHERE ea.equipment_id = p_equipment_id
    AND ea.class_id = c.id
    AND ea.status = 'assigned'
    AND c.scheduled_at::DATE BETWEEN p_maintenance_date AND p_maintenance_date + p_duration_days;

  RETURN true;
END;
$$ LANGUAGE plpgsql;

-- Function to get equipment utilization statistics
CREATE OR REPLACE FUNCTION get_equipment_utilization_stats(
  p_branch_id UUID,
  p_start_date DATE,
  p_end_date DATE
)
RETURNS TABLE (
  equipment_id UUID,
  equipment_number VARCHAR(50),
  equipment_type VARCHAR(100),
  total_assignments BIGINT,
  total_usage_hours NUMERIC,
  avg_usage_per_class NUMERIC,
  utilization_rate NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    e.id as equipment_id,
    e.equipment_number,
    et.name as equipment_type,
    COUNT(ea.id) as total_assignments,
    COALESCE(SUM(ea.usage_duration_minutes) / 60.0, 0) as total_usage_hours,
    ROUND(AVG(ea.usage_duration_minutes), 2) as avg_usage_per_class,
    ROUND(
      (COUNT(ea.id)::NUMERIC /
       NULLIF((SELECT COUNT(*) FROM classes WHERE branch_id = p_branch_id
               AND scheduled_at BETWEEN p_start_date AND p_end_date), 0)) * 100,
      2
    ) as utilization_rate
  FROM equipment e
  JOIN equipment_types et ON e.equipment_type_id = et.id
  LEFT JOIN equipment_assignments ea ON e.id = ea.equipment_id
  LEFT JOIN classes c ON ea.class_id = c.id
  WHERE e.branch_id = p_branch_id
    AND (c.scheduled_at IS NULL OR c.scheduled_at BETWEEN p_start_date AND p_end_date)
  GROUP BY e.id, e.equipment_number, et.name
  ORDER BY total_assignments DESC;
END;
$$ LANGUAGE plpgsql;

-- Function to check if instructor is available for a specific date/time
CREATE OR REPLACE FUNCTION is_instructor_available(
  p_instructor_id UUID,
  p_date DATE,
  p_start_time TIME,
  p_end_time TIME
)
RETURNS BOOLEAN AS $$
DECLARE
  v_day_of_week INTEGER;
  v_has_availability BOOLEAN;
  v_has_time_off BOOLEAN;
BEGIN
  v_day_of_week := EXTRACT(DOW FROM p_date);

  SELECT EXISTS (
    SELECT 1 FROM instructor_availability ia
    WHERE ia.instructor_id = p_instructor_id
      AND ia.day_of_week = v_day_of_week
      AND ia.start_time <= p_start_time
      AND ia.end_time >= p_end_time
      AND (ia.is_recurring = true OR ia.effective_date = p_date)
  ) INTO v_has_availability;

  SELECT EXISTS (
    SELECT 1 FROM instructor_time_off ito
    WHERE ito.instructor_id = p_instructor_id
      AND ito.status = 'approved'
      AND p_date BETWEEN ito.start_date AND ito.end_date
  ) INTO v_has_time_off;

  RETURN v_has_availability AND NOT v_has_time_off;
END;
$$ LANGUAGE plpgsql;

-- Function to get instructor stats
CREATE OR REPLACE FUNCTION get_instructor_stats(
  p_instructor_id UUID,
  p_start_date DATE,
  p_end_date DATE
)
RETURNS TABLE (
  total_classes BIGINT,
  completed_classes BIGINT,
  cancelled_classes BIGINT,
  no_show_classes BIGINT,
  total_students BIGINT,
  avg_attendance_rate NUMERIC,
  total_earnings NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(DISTINCT ica.class_id) as total_classes,
    COUNT(DISTINCT ica.class_id) FILTER (WHERE ica.assignment_status = 'completed') as completed_classes,
    COUNT(DISTINCT ica.class_id) FILTER (WHERE ica.assignment_status = 'cancelled') as cancelled_classes,
    COUNT(DISTINCT ica.class_id) FILTER (WHERE ica.assignment_status = 'no_show') as no_show_classes,
    COUNT(DISTINCT b.user_id) as total_students,
    ROUND(AVG(
      CASE WHEN ica.assignment_status = 'completed' THEN
        (SELECT COUNT(*) FROM attendance_records ar
         WHERE ar.class_id = ica.class_id AND ar.status = 'present')::NUMERIC /
        NULLIF((SELECT COUNT(*) FROM bookings WHERE class_id = ica.class_id AND status = 'confirmed'), 0)
      ELSE NULL END
    ) * 100, 2) as avg_attendance_rate,
    COALESCE(SUM(ica.payment_amount) FILTER (WHERE ica.payment_status = 'paid'), 0) as total_earnings
  FROM instructor_class_assignments ica
  LEFT JOIN bookings b ON ica.class_id = b.class_id AND b.status = 'confirmed'
  LEFT JOIN classes c ON ica.class_id = c.id
  WHERE ica.instructor_id = p_instructor_id
    AND c.scheduled_at BETWEEN p_start_date AND p_end_date;
END;
$$ LANGUAGE plpgsql;

-- Function to keep booking branch_id in sync with class
CREATE OR REPLACE FUNCTION set_booking_branch_id()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.branch_id IS NULL THEN
    SELECT branch_id INTO NEW.branch_id FROM classes WHERE id = NEW.class_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- TRIGGERS
-- ============================================================================

CREATE TRIGGER update_admin_branch_assignments_updated_at BEFORE UPDATE ON admin_branch_assignments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_branches_updated_at BEFORE UPDATE ON branches FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_updated_at BEFORE UPDATE ON "user" FOR EACH ROW EXECUTE FUNCTION update_better_auth_updated_at_column();
CREATE TRIGGER update_session_updated_at BEFORE UPDATE ON "session" FOR EACH ROW EXECUTE FUNCTION update_better_auth_updated_at_column();
CREATE TRIGGER update_account_updated_at BEFORE UPDATE ON "account" FOR EACH ROW EXECUTE FUNCTION update_better_auth_updated_at_column();
CREATE TRIGGER update_verification_updated_at BEFORE UPDATE ON "verification" FOR EACH ROW EXECUTE FUNCTION update_better_auth_updated_at_column();
CREATE TRIGGER update_class_package_templates_updated_at BEFORE UPDATE ON class_package_templates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_class_packages_updated_at BEFORE UPDATE ON user_class_packages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_classes_updated_at BEFORE UPDATE ON classes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER set_bookings_branch_id BEFORE INSERT ON bookings FOR EACH ROW EXECUTE FUNCTION set_booking_branch_id();
CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_notification_settings_updated_at BEFORE UPDATE ON notification_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_branch_settings_updated_at BEFORE UPDATE ON branch_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_package_invitations_updated_at BEFORE UPDATE ON package_invitations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_recurring_class_templates_updated_at BEFORE UPDATE ON recurring_class_templates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_no_show_penalties_updated_at BEFORE UPDATE ON no_show_penalties FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_late_cancellation_fees_updated_at BEFORE UPDATE ON late_cancellation_fees FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_waitlist_offers_updated_at BEFORE UPDATE ON waitlist_offers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_notification_preferences_updated_at BEFORE UPDATE ON notification_preferences FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_instructor_profiles_updated_at BEFORE UPDATE ON instructor_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_instructor_availability_updated_at BEFORE UPDATE ON instructor_availability FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_instructor_client_notes_updated_at BEFORE UPDATE ON instructor_client_notes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_client_health_profiles_updated_at BEFORE UPDATE ON client_health_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_emergency_contacts_updated_at BEFORE UPDATE ON emergency_contacts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_injury_reports_updated_at BEFORE UPDATE ON injury_reports FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_equipment_updated_at BEFORE UPDATE ON equipment FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_client_equipment_preferences_updated_at BEFORE UPDATE ON client_equipment_preferences FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_equipment_issues_updated_at BEFORE UPDATE ON equipment_issues FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- MIGRATION TRACKING (for future incremental migrations)
-- ============================================================================

CREATE TABLE IF NOT EXISTS schema_migrations (
  id SERIAL PRIMARY KEY,
  version VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  applied_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  checksum VARCHAR(64),
  execution_time_ms INTEGER,
  success BOOLEAN DEFAULT true
);

CREATE INDEX IF NOT EXISTS idx_schema_migrations_version ON schema_migrations(version);
CREATE INDEX IF NOT EXISTS idx_schema_migrations_applied_at ON schema_migrations(applied_at DESC);

-- Record that schema has been initialized (version 001 = consolidated schema)
INSERT INTO schema_migrations (version, name, checksum, success)
VALUES ('001', 'initial_schema_consolidated', MD5('schema_consolidated_2026_02_03'), true)
ON CONFLICT (version) DO NOTHING;
