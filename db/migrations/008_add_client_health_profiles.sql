-- Migration: Add Client Health Profiles
-- Date: 2026-01-24
-- Description: Adds medical conditions, injuries, fitness levels, goals, and emergency contacts

-- ============================================================================
-- CLIENT HEALTH PROFILES TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS client_health_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  branch_id UUID NOT NULL REFERENCES branches(id) ON DELETE CASCADE,

  -- Medical Information
  medical_conditions JSONB, -- Array of conditions: [{name, severity, notes}]
  current_injuries JSONB, -- Array of injuries: [{type, location, date, restrictions}]
  medications TEXT[],
  allergies TEXT[],

  -- Fitness Information
  fitness_level VARCHAR(20) CHECK (fitness_level IN ('beginner', 'intermediate', 'advanced', 'athlete')),
  fitness_goals TEXT[],
  exercise_restrictions TEXT,

  -- Physical Stats
  height_cm DECIMAL(5, 2),
  weight_kg DECIMAL(5, 2),

  -- Health History
  previous_injuries JSONB, -- Historical injuries
  surgery_history JSONB,

  -- Medical Release
  medical_release_signed BOOLEAN DEFAULT false,
  medical_release_date DATE,
  liability_waiver_signed BOOLEAN DEFAULT false,
  liability_waiver_date DATE,

  -- Doctor Information
  doctor_name VARCHAR(255),
  doctor_phone VARCHAR(50),

  -- Additional Notes
  notes TEXT,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_client_health_user_id ON client_health_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_client_health_branch_id ON client_health_profiles(branch_id);
CREATE INDEX IF NOT EXISTS idx_client_health_fitness_level ON client_health_profiles(fitness_level);
CREATE INDEX IF NOT EXISTS idx_client_health_waivers ON client_health_profiles(medical_release_signed, liability_waiver_signed);

-- Trigger for updated_at
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_client_health_profiles_updated_at'
  ) THEN
    CREATE TRIGGER update_client_health_profiles_updated_at
      BEFORE UPDATE ON client_health_profiles
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

-- ============================================================================
-- EMERGENCY CONTACTS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS emergency_contacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
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

-- Indexes
CREATE INDEX IF NOT EXISTS idx_emergency_contacts_user_id ON emergency_contacts(user_id);
CREATE INDEX IF NOT EXISTS idx_emergency_contacts_branch_id ON emergency_contacts(branch_id);
CREATE INDEX IF NOT EXISTS idx_emergency_contacts_primary ON emergency_contacts(is_primary);

-- Trigger for updated_at
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_emergency_contacts_updated_at'
  ) THEN
    CREATE TRIGGER update_emergency_contacts_updated_at
      BEFORE UPDATE ON emergency_contacts
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

-- ============================================================================
-- HEALTH ASSESSMENTS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS health_assessments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  branch_id UUID NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
  assessment_date DATE NOT NULL,
  conducted_by UUID REFERENCES users(id) ON DELETE SET NULL, -- Instructor or admin

  -- Vital Signs
  resting_heart_rate INTEGER,
  blood_pressure_systolic INTEGER,
  blood_pressure_diastolic INTEGER,

  -- Body Composition
  weight_kg DECIMAL(5, 2),
  body_fat_percentage DECIMAL(4, 2),
  muscle_mass_kg DECIMAL(5, 2),

  -- Fitness Tests
  max_heart_rate INTEGER,
  vo2_max DECIMAL(5, 2),
  flexibility_score INTEGER,
  strength_score INTEGER,
  endurance_score INTEGER,

  -- Overall Assessment
  fitness_level VARCHAR(20) CHECK (fitness_level IN ('beginner', 'intermediate', 'advanced', 'athlete')),
  recommendations TEXT,
  goals_set JSONB,

  -- Progress Tracking
  previous_assessment_id UUID REFERENCES health_assessments(id) ON DELETE SET NULL,

  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_health_assessments_user_id ON health_assessments(user_id);
CREATE INDEX IF NOT EXISTS idx_health_assessments_branch_id ON health_assessments(branch_id);
CREATE INDEX IF NOT EXISTS idx_health_assessments_date ON health_assessments(assessment_date DESC);
CREATE INDEX IF NOT EXISTS idx_health_assessments_conducted_by ON health_assessments(conducted_by);

-- ============================================================================
-- INJURY REPORTS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS injury_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  branch_id UUID NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
  class_id UUID REFERENCES classes(id) ON DELETE SET NULL,

  -- Incident Details
  incident_date TIMESTAMP WITH TIME ZONE NOT NULL,
  injury_type VARCHAR(100) NOT NULL,
  injury_location VARCHAR(100),
  severity VARCHAR(20) CHECK (severity IN ('minor', 'moderate', 'severe', 'critical')),

  -- Description
  description TEXT NOT NULL,
  activity_at_time TEXT,

  -- Response
  first_aid_administered BOOLEAN DEFAULT false,
  first_aid_details TEXT,
  emergency_services_called BOOLEAN DEFAULT false,
  hospital_visit BOOLEAN DEFAULT false,

  -- Reporting
  reported_by UUID NOT NULL REFERENCES users(id) ON DELETE SET NULL,
  witnesses JSONB, -- Array of witness information

  -- Follow-up
  follow_up_required BOOLEAN DEFAULT false,
  follow_up_notes TEXT,
  cleared_to_return BOOLEAN DEFAULT false,
  cleared_date DATE,
  cleared_by UUID REFERENCES users(id) ON DELETE SET NULL,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_injury_reports_user_id ON injury_reports(user_id);
CREATE INDEX IF NOT EXISTS idx_injury_reports_branch_id ON injury_reports(branch_id);
CREATE INDEX IF NOT EXISTS idx_injury_reports_class_id ON injury_reports(class_id);
CREATE INDEX IF NOT EXISTS idx_injury_reports_date ON injury_reports(incident_date DESC);
CREATE INDEX IF NOT EXISTS idx_injury_reports_severity ON injury_reports(severity);
CREATE INDEX IF NOT EXISTS idx_injury_reports_follow_up ON injury_reports(follow_up_required);

-- Trigger for updated_at
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_injury_reports_updated_at'
  ) THEN
    CREATE TRIGGER update_injury_reports_updated_at
      BEFORE UPDATE ON injury_reports
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

-- ============================================================================
-- PARQ (PHYSICAL ACTIVITY READINESS QUESTIONNAIRE) TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS parq_questionnaires (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  branch_id UUID NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
  submission_date DATE NOT NULL,

  -- Standard PAR-Q Questions (Yes/No)
  heart_condition BOOLEAN,
  chest_pain_activity BOOLEAN,
  chest_pain_rest BOOLEAN,
  dizziness_balance BOOLEAN,
  bone_joint_problem BOOLEAN,
  blood_pressure_medication BOOLEAN,
  other_reason BOOLEAN,

  -- Additional Information
  other_reason_details TEXT,
  physician_approval_required BOOLEAN DEFAULT false,
  physician_approval_received BOOLEAN DEFAULT false,
  physician_approval_date DATE,

  -- Signatures
  client_signature_data TEXT, -- Base64 encoded signature image or digital signature
  staff_signature_data TEXT,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_parq_user_id ON parq_questionnaires(user_id);
CREATE INDEX IF NOT EXISTS idx_parq_branch_id ON parq_questionnaires(branch_id);
CREATE INDEX IF NOT EXISTS idx_parq_date ON parq_questionnaires(submission_date DESC);
CREATE INDEX IF NOT EXISTS idx_parq_approval ON parq_questionnaires(physician_approval_required, physician_approval_received);

-- ============================================================================
-- FUNCTIONS FOR HEALTH PROFILE MANAGEMENT
-- ============================================================================

-- Function to check if client has required medical clearance
CREATE OR REPLACE FUNCTION has_medical_clearance(
  p_user_id UUID
)
RETURNS BOOLEAN AS $$
DECLARE
  v_profile RECORD;
  v_parq RECORD;
BEGIN
  -- Get health profile
  SELECT * INTO v_profile
  FROM client_health_profiles
  WHERE user_id = p_user_id;

  -- Check if waivers are signed
  IF v_profile.medical_release_signed = false OR v_profile.liability_waiver_signed = false THEN
    RETURN false;
  END IF;

  -- Get most recent PAR-Q
  SELECT * INTO v_parq
  FROM parq_questionnaires
  WHERE user_id = p_user_id
  ORDER BY submission_date DESC
  LIMIT 1;

  -- If no PAR-Q exists, return false
  IF NOT FOUND THEN
    RETURN false;
  END IF;

  -- If physician approval required but not received, return false
  IF v_parq.physician_approval_required = true AND v_parq.physician_approval_received = false THEN
    RETURN false;
  END IF;

  -- All checks passed
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

-- ============================================================================
-- RECORD MIGRATION
-- ============================================================================

INSERT INTO schema_migrations (version, name, checksum, success)
VALUES ('008', 'add_client_health_profiles', MD5('add_client_health_profiles_2026_01_24'), true)
ON CONFLICT (version) DO NOTHING;
