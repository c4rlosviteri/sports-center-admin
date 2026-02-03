-- Migration: Add Instructor Management System
-- Date: 2026-01-24
-- Description: Adds instructor role, dashboard, availability calendar, and class assignment tracking

-- ============================================================================
-- UPDATE USERS TABLE - ADD INSTRUCTOR ROLE
-- ============================================================================

-- Add instructor role to existing CHECK constraint
DO $$
BEGIN
  -- Drop existing constraint if it exists
  IF EXISTS (
    SELECT 1 FROM information_schema.constraint_column_usage
    WHERE table_name = 'users' AND constraint_name LIKE '%role%'
  ) THEN
    ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;
  END IF;

  -- Add new constraint with instructor role
  ALTER TABLE users ADD CONSTRAINT users_role_check
    CHECK (role IN ('client', 'admin', 'superuser', 'instructor'));
END $$;

-- ============================================================================
-- INSTRUCTOR PROFILES TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS instructor_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  branch_id UUID NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
  bio TEXT,
  specializations TEXT[], -- Array of specializations (e.g., 'spinning', 'yoga', 'HIIT')
  certifications JSONB, -- Store certification details
  hire_date DATE,
  hourly_rate DECIMAL(10, 2),
  is_active BOOLEAN DEFAULT true,
  profile_image_url VARCHAR(500),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_instructor_profiles_user_id ON instructor_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_instructor_profiles_branch_id ON instructor_profiles(branch_id);
CREATE INDEX IF NOT EXISTS idx_instructor_profiles_active ON instructor_profiles(is_active);

-- Trigger for updated_at
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_instructor_profiles_updated_at'
  ) THEN
    CREATE TRIGGER update_instructor_profiles_updated_at
      BEFORE UPDATE ON instructor_profiles
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

-- ============================================================================
-- INSTRUCTOR AVAILABILITY TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS instructor_availability (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  instructor_id UUID NOT NULL REFERENCES instructor_profiles(id) ON DELETE CASCADE,
  branch_id UUID NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6), -- 0 = Sunday, 6 = Saturday
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_recurring BOOLEAN DEFAULT true, -- If true, applies every week
  effective_date DATE, -- For one-time availability
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT valid_time_range CHECK (end_time > start_time)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_instructor_availability_instructor ON instructor_availability(instructor_id);
CREATE INDEX IF NOT EXISTS idx_instructor_availability_branch ON instructor_availability(branch_id);
CREATE INDEX IF NOT EXISTS idx_instructor_availability_day ON instructor_availability(day_of_week);

-- Trigger for updated_at
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_instructor_availability_updated_at'
  ) THEN
    CREATE TRIGGER update_instructor_availability_updated_at
      BEFORE UPDATE ON instructor_availability
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

-- ============================================================================
-- INSTRUCTOR TIME OFF TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS instructor_time_off (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  instructor_id UUID NOT NULL REFERENCES instructor_profiles(id) ON DELETE CASCADE,
  branch_id UUID NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  reason VARCHAR(100),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'denied')),
  notes TEXT,
  requested_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  approved_by UUID REFERENCES users(id) ON DELETE SET NULL,
  approved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT valid_date_range CHECK (end_date >= start_date)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_instructor_time_off_instructor ON instructor_time_off(instructor_id);
CREATE INDEX IF NOT EXISTS idx_instructor_time_off_branch ON instructor_time_off(branch_id);
CREATE INDEX IF NOT EXISTS idx_instructor_time_off_dates ON instructor_time_off(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_instructor_time_off_status ON instructor_time_off(status);

-- ============================================================================
-- INSTRUCTOR CLASS ASSIGNMENTS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS instructor_class_assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  instructor_id UUID NOT NULL REFERENCES instructor_profiles(id) ON DELETE CASCADE,
  class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  branch_id UUID NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
  assignment_status VARCHAR(20) DEFAULT 'assigned' CHECK (
    assignment_status IN ('assigned', 'confirmed', 'completed', 'cancelled', 'no_show')
  ),
  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  assigned_by UUID REFERENCES users(id) ON DELETE SET NULL,
  notes TEXT,
  payment_amount DECIMAL(10, 2), -- Payment for this specific class
  payment_status VARCHAR(20) DEFAULT 'pending' CHECK (
    payment_status IN ('pending', 'paid', 'cancelled')
  ),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(instructor_id, class_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_instructor_assignments_instructor ON instructor_class_assignments(instructor_id);
CREATE INDEX IF NOT EXISTS idx_instructor_assignments_class ON instructor_class_assignments(class_id);
CREATE INDEX IF NOT EXISTS idx_instructor_assignments_branch ON instructor_class_assignments(branch_id);
CREATE INDEX IF NOT EXISTS idx_instructor_assignments_status ON instructor_class_assignments(assignment_status);
CREATE INDEX IF NOT EXISTS idx_instructor_assignments_payment ON instructor_class_assignments(payment_status);

-- ============================================================================
-- INSTRUCTOR NOTES ON CLIENTS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS instructor_client_notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  instructor_id UUID NOT NULL REFERENCES instructor_profiles(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  branch_id UUID NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
  note_text TEXT NOT NULL,
  note_type VARCHAR(50) CHECK (note_type IN ('general', 'performance', 'health', 'behavior', 'goals')),
  is_private BOOLEAN DEFAULT true, -- Only visible to instructor and admins
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_instructor_notes_instructor ON instructor_client_notes(instructor_id);
CREATE INDEX IF NOT EXISTS idx_instructor_notes_client ON instructor_client_notes(client_id);
CREATE INDEX IF NOT EXISTS idx_instructor_notes_branch ON instructor_client_notes(branch_id);
CREATE INDEX IF NOT EXISTS idx_instructor_notes_type ON instructor_client_notes(note_type);

-- Trigger for updated_at
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_instructor_client_notes_updated_at'
  ) THEN
    CREATE TRIGGER update_instructor_client_notes_updated_at
      BEFORE UPDATE ON instructor_client_notes
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

-- ============================================================================
-- FUNCTIONS FOR INSTRUCTOR MANAGEMENT
-- ============================================================================

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
  -- Get day of week (0 = Sunday)
  v_day_of_week := EXTRACT(DOW FROM p_date);

  -- Check if instructor has availability for this day/time
  SELECT EXISTS (
    SELECT 1 FROM instructor_availability ia
    WHERE ia.instructor_id = p_instructor_id
      AND ia.day_of_week = v_day_of_week
      AND ia.start_time <= p_start_time
      AND ia.end_time >= p_end_time
      AND (ia.is_recurring = true OR ia.effective_date = p_date)
  ) INTO v_has_availability;

  -- Check if instructor has time off on this date
  SELECT EXISTS (
    SELECT 1 FROM instructor_time_off ito
    WHERE ito.instructor_id = p_instructor_id
      AND ito.status = 'approved'
      AND p_date BETWEEN ito.start_date AND ito.end_date
  ) INTO v_has_time_off;

  -- Available if has availability and no time off
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

-- ============================================================================
-- RECORD MIGRATION
-- ============================================================================

INSERT INTO schema_migrations (version, name, checksum, success)
VALUES ('007', 'add_instructor_management', MD5('add_instructor_management_2026_01_24'), true)
ON CONFLICT (version) DO NOTHING;
