-- Migration: Add Attendance Tracking & No-Show Management
-- Date: 2026-01-24
-- Description: Adds attendance tracking, no-show penalties, and late cancellation fees

-- ============================================================================
-- ATTENDANCE RECORDS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS attendance_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  branch_id UUID NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
  status VARCHAR(20) NOT NULL CHECK (status IN ('present', 'absent', 'late', 'excused')),
  marked_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  marked_by UUID REFERENCES users(id) ON DELETE SET NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(booking_id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_attendance_records_user_id ON attendance_records(user_id);
CREATE INDEX IF NOT EXISTS idx_attendance_records_class_id ON attendance_records(class_id);
CREATE INDEX IF NOT EXISTS idx_attendance_records_branch_id ON attendance_records(branch_id);
CREATE INDEX IF NOT EXISTS idx_attendance_records_status ON attendance_records(status);
CREATE INDEX IF NOT EXISTS idx_attendance_records_marked_at ON attendance_records(marked_at DESC);

-- ============================================================================
-- NO-SHOW PENALTIES TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS no_show_penalties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  branch_id UUID NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
  no_show_count INTEGER DEFAULT 0,
  penalty_start_date DATE,
  penalty_end_date DATE,
  is_active BOOLEAN DEFAULT false,
  penalty_type VARCHAR(50) CHECK (penalty_type IN ('booking_restriction', 'warning', 'fee', 'suspension')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  notes TEXT
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_no_show_penalties_user_id ON no_show_penalties(user_id);
CREATE INDEX IF NOT EXISTS idx_no_show_penalties_branch_id ON no_show_penalties(branch_id);
CREATE INDEX IF NOT EXISTS idx_no_show_penalties_is_active ON no_show_penalties(is_active);

-- Trigger for updated_at
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_no_show_penalties_updated_at'
  ) THEN
    CREATE TRIGGER update_no_show_penalties_updated_at
      BEFORE UPDATE ON no_show_penalties
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

-- ============================================================================
-- LATE CANCELLATION FEES TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS late_cancellation_fees (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  branch_id UUID NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL,
  cancellation_time TIMESTAMP WITH TIME ZONE NOT NULL,
  class_time TIMESTAMP WITH TIME ZONE NOT NULL,
  hours_before_class DECIMAL(5, 2),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'waived', 'disputed')),
  paid_at TIMESTAMP WITH TIME ZONE,
  waived_by UUID REFERENCES users(id) ON DELETE SET NULL,
  waived_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_late_cancellation_fees_user_id ON late_cancellation_fees(user_id);
CREATE INDEX IF NOT EXISTS idx_late_cancellation_fees_booking_id ON late_cancellation_fees(booking_id);
CREATE INDEX IF NOT EXISTS idx_late_cancellation_fees_branch_id ON late_cancellation_fees(branch_id);
CREATE INDEX IF NOT EXISTS idx_late_cancellation_fees_status ON late_cancellation_fees(status);

-- Trigger for updated_at
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_late_cancellation_fees_updated_at'
  ) THEN
    CREATE TRIGGER update_late_cancellation_fees_updated_at
      BEFORE UPDATE ON late_cancellation_fees
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

-- ============================================================================
-- BRANCH SETTINGS FOR ATTENDANCE POLICIES
-- ============================================================================

-- Add attendance policy columns to branch_settings
DO $$
BEGIN
  -- No-show threshold before penalty
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'branch_settings' AND column_name = 'no_show_threshold'
  ) THEN
    ALTER TABLE branch_settings ADD COLUMN no_show_threshold INTEGER DEFAULT 3;
  END IF;

  -- Late cancellation hours (e.g., 24 hours)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'branch_settings' AND column_name = 'late_cancellation_hours'
  ) THEN
    ALTER TABLE branch_settings ADD COLUMN late_cancellation_hours INTEGER DEFAULT 24;
  END IF;

  -- Late cancellation fee amount
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'branch_settings' AND column_name = 'late_cancellation_fee'
  ) THEN
    ALTER TABLE branch_settings ADD COLUMN late_cancellation_fee DECIMAL(10, 2) DEFAULT 10.00;
  END IF;

  -- Penalty duration in days
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'branch_settings' AND column_name = 'penalty_duration_days'
  ) THEN
    ALTER TABLE branch_settings ADD COLUMN penalty_duration_days INTEGER DEFAULT 30;
  END IF;

  -- Enable/disable attendance tracking
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'branch_settings' AND column_name = 'enable_attendance_tracking'
  ) THEN
    ALTER TABLE branch_settings ADD COLUMN enable_attendance_tracking BOOLEAN DEFAULT true;
  END IF;
END $$;

-- ============================================================================
-- FUNCTIONS FOR ATTENDANCE CALCULATIONS
-- ============================================================================

-- Function to calculate no-show rate for a user
CREATE OR REPLACE FUNCTION calculate_no_show_rate(p_user_id UUID, p_days_back INTEGER DEFAULT 90)
RETURNS DECIMAL(5, 2) AS $$
DECLARE
  total_attended INTEGER;
  total_no_shows INTEGER;
  no_show_rate DECIMAL(5, 2);
BEGIN
  SELECT
    COUNT(*) FILTER (WHERE ar.status = 'present' OR ar.status = 'late') as attended,
    COUNT(*) FILTER (WHERE ar.status = 'absent') as no_shows
  INTO total_attended, total_no_shows
  FROM attendance_records ar
  WHERE ar.user_id = p_user_id
    AND ar.created_at >= NOW() - (p_days_back || ' days')::INTERVAL;

  IF (total_attended + total_no_shows) = 0 THEN
    RETURN 0;
  END IF;

  no_show_rate := (total_no_shows::DECIMAL / (total_attended + total_no_shows)) * 100;
  RETURN ROUND(no_show_rate, 2);
END;
$$ LANGUAGE plpgsql;

-- Function to check if user has active penalty
CREATE OR REPLACE FUNCTION has_active_penalty(p_user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM no_show_penalties
    WHERE user_id = p_user_id
      AND is_active = true
      AND (penalty_end_date IS NULL OR penalty_end_date >= CURRENT_DATE)
  );
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- RECORD MIGRATION
-- ============================================================================

INSERT INTO schema_migrations (version, name, checksum, success)
VALUES ('003', 'add_attendance_tracking', MD5('add_attendance_tracking_2026_01_24'), true)
ON CONFLICT (version) DO NOTHING;
