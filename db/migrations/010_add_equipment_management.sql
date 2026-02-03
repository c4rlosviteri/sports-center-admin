-- Migration: Add Equipment Management System
-- Date: 2026-01-24
-- Description: Adds bike/equipment tracking, maintenance schedules, assignments, and client preferences

-- ============================================================================
-- EQUIPMENT TYPES TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS equipment_types (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  branch_id UUID NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  icon VARCHAR(50), -- Icon identifier for UI
  requires_assignment BOOLEAN DEFAULT true, -- Whether equipment must be assigned to users
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(branch_id, name)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_equipment_types_branch ON equipment_types(branch_id);

-- ============================================================================
-- EQUIPMENT TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS equipment (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  branch_id UUID NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
  equipment_type_id UUID NOT NULL REFERENCES equipment_types(id) ON DELETE RESTRICT,

  -- Identification
  equipment_number VARCHAR(50) NOT NULL, -- e.g., "BIKE-001"
  name VARCHAR(255), -- Optional friendly name
  serial_number VARCHAR(255),
  manufacturer VARCHAR(255),
  model VARCHAR(255),
  purchase_date DATE,
  purchase_price DECIMAL(10, 2),

  -- Status
  status VARCHAR(20) DEFAULT 'available' CHECK (status IN (
    'available', 'in_use', 'maintenance', 'out_of_service', 'retired'
  )),
  condition VARCHAR(20) CHECK (condition IN ('excellent', 'good', 'fair', 'poor')),

  -- Location
  location VARCHAR(255), -- Room/area within branch

  -- Features/Specs
  specifications JSONB, -- Equipment-specific specs (e.g., resistance levels, adjustability)
  features TEXT[],

  -- Maintenance
  last_maintenance_date DATE,
  next_maintenance_due DATE,
  maintenance_interval_days INTEGER DEFAULT 90,
  total_usage_hours DECIMAL(10, 2) DEFAULT 0,

  -- Notes
  notes TEXT,
  internal_notes TEXT, -- Only visible to staff

  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

  UNIQUE(branch_id, equipment_number)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_equipment_branch ON equipment(branch_id);
CREATE INDEX IF NOT EXISTS idx_equipment_type ON equipment(equipment_type_id);
CREATE INDEX IF NOT EXISTS idx_equipment_number ON equipment(equipment_number);
CREATE INDEX IF NOT EXISTS idx_equipment_status ON equipment(status);
CREATE INDEX IF NOT EXISTS idx_equipment_maintenance_due ON equipment(next_maintenance_due);

-- Trigger for updated_at
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_equipment_updated_at'
  ) THEN
    CREATE TRIGGER update_equipment_updated_at
      BEFORE UPDATE ON equipment
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

-- ============================================================================
-- EQUIPMENT ASSIGNMENTS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS equipment_assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  equipment_id UUID NOT NULL REFERENCES equipment(id) ON DELETE CASCADE,
  class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  branch_id UUID NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
  booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,

  -- Assignment Details
  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  assigned_by UUID REFERENCES users(id) ON DELETE SET NULL, -- Staff member who made assignment
  assignment_type VARCHAR(20) DEFAULT 'manual' CHECK (assignment_type IN ('manual', 'auto', 'preference')),

  -- Status
  status VARCHAR(20) DEFAULT 'assigned' CHECK (status IN ('assigned', 'checked_in', 'in_use', 'completed', 'cancelled')),
  checked_in_at TIMESTAMP WITH TIME ZONE,
  checked_out_at TIMESTAMP WITH TIME ZONE,

  -- Usage Tracking
  usage_duration_minutes INTEGER,

  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

  UNIQUE(class_id, user_id),
  CONSTRAINT no_double_assignment UNIQUE(equipment_id, class_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_equipment_assignments_equipment ON equipment_assignments(equipment_id);
CREATE INDEX IF NOT EXISTS idx_equipment_assignments_class ON equipment_assignments(class_id);
CREATE INDEX IF NOT EXISTS idx_equipment_assignments_user ON equipment_assignments(user_id);
CREATE INDEX IF NOT EXISTS idx_equipment_assignments_branch ON equipment_assignments(branch_id);
CREATE INDEX IF NOT EXISTS idx_equipment_assignments_status ON equipment_assignments(status);

-- ============================================================================
-- CLIENT EQUIPMENT PREFERENCES TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS client_equipment_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  branch_id UUID NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
  equipment_type_id UUID NOT NULL REFERENCES equipment_types(id) ON DELETE CASCADE,

  -- Preferences
  preferred_equipment_ids UUID[], -- Array of preferred equipment IDs, in order of preference
  avoid_equipment_ids UUID[], -- Equipment to avoid

  -- Settings
  auto_assign_preferred BOOLEAN DEFAULT true, -- Automatically assign preferred equipment if available

  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

  UNIQUE(user_id, equipment_type_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_client_equipment_pref_user ON client_equipment_preferences(user_id);
CREATE INDEX IF NOT EXISTS idx_client_equipment_pref_branch ON client_equipment_preferences(branch_id);
CREATE INDEX IF NOT EXISTS idx_client_equipment_pref_type ON client_equipment_preferences(equipment_type_id);
CREATE INDEX IF NOT EXISTS idx_client_equipment_pref_preferred ON client_equipment_preferences USING GIN(preferred_equipment_ids);

-- Trigger for updated_at
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_client_equipment_preferences_updated_at'
  ) THEN
    CREATE TRIGGER update_client_equipment_preferences_updated_at
      BEFORE UPDATE ON client_equipment_preferences
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

-- ============================================================================
-- EQUIPMENT MAINTENANCE LOGS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS equipment_maintenance_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  equipment_id UUID NOT NULL REFERENCES equipment(id) ON DELETE CASCADE,
  branch_id UUID NOT NULL REFERENCES branches(id) ON DELETE CASCADE,

  -- Maintenance Details
  maintenance_date DATE NOT NULL,
  maintenance_type VARCHAR(50) NOT NULL CHECK (maintenance_type IN (
    'routine', 'repair', 'inspection', 'cleaning', 'replacement', 'upgrade'
  )),
  performed_by UUID REFERENCES users(id) ON DELETE SET NULL,
  external_service_provider VARCHAR(255),

  -- Work Details
  description TEXT NOT NULL,
  parts_replaced JSONB, -- Array of parts replaced: [{name, part_number, cost}]
  labor_hours DECIMAL(5, 2),
  total_cost DECIMAL(10, 2),

  -- Before/After
  condition_before VARCHAR(20),
  condition_after VARCHAR(20),

  -- Next Maintenance
  next_maintenance_due DATE,

  -- Documentation
  photos JSONB, -- Array of photo URLs
  documents JSONB, -- Array of document URLs (receipts, warranties, etc.)

  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_equipment_maintenance_equipment ON equipment_maintenance_logs(equipment_id);
CREATE INDEX IF NOT EXISTS idx_equipment_maintenance_branch ON equipment_maintenance_logs(branch_id);
CREATE INDEX IF NOT EXISTS idx_equipment_maintenance_date ON equipment_maintenance_logs(maintenance_date DESC);
CREATE INDEX IF NOT EXISTS idx_equipment_maintenance_type ON equipment_maintenance_logs(maintenance_type);
CREATE INDEX IF NOT EXISTS idx_equipment_maintenance_performed_by ON equipment_maintenance_logs(performed_by);

-- ============================================================================
-- EQUIPMENT ISSUES TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS equipment_issues (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  equipment_id UUID NOT NULL REFERENCES equipment(id) ON DELETE CASCADE,
  branch_id UUID NOT NULL REFERENCES branches(id) ON DELETE CASCADE,

  -- Issue Details
  reported_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  reported_by UUID NOT NULL REFERENCES users(id) ON DELETE SET NULL,
  issue_type VARCHAR(50) CHECK (issue_type IN (
    'malfunction', 'damage', 'safety_concern', 'discomfort', 'noise', 'cleanliness', 'other'
  )),
  severity VARCHAR(20) DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),

  -- Description
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  photos JSONB,

  -- Resolution
  status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open', 'acknowledged', 'in_progress', 'resolved', 'closed')),
  assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,
  resolved_at TIMESTAMP WITH TIME ZONE,
  resolved_by UUID REFERENCES users(id) ON DELETE SET NULL,
  resolution_notes TEXT,
  maintenance_log_id UUID REFERENCES equipment_maintenance_logs(id) ON DELETE SET NULL,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_equipment_issues_equipment ON equipment_issues(equipment_id);
CREATE INDEX IF NOT EXISTS idx_equipment_issues_branch ON equipment_issues(branch_id);
CREATE INDEX IF NOT EXISTS idx_equipment_issues_status ON equipment_issues(status);
CREATE INDEX IF NOT EXISTS idx_equipment_issues_severity ON equipment_issues(severity);
CREATE INDEX IF NOT EXISTS idx_equipment_issues_reported_by ON equipment_issues(reported_by);
CREATE INDEX IF NOT EXISTS idx_equipment_issues_date ON equipment_issues(reported_at DESC);

-- Trigger for updated_at
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_equipment_issues_updated_at'
  ) THEN
    CREATE TRIGGER update_equipment_issues_updated_at
      BEFORE UPDATE ON equipment_issues
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

-- ============================================================================
-- FUNCTIONS FOR EQUIPMENT MANAGEMENT
-- ============================================================================

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
  -- Get user preferences
  SELECT * INTO v_preferences
  FROM client_equipment_preferences
  WHERE user_id = p_user_id
    AND equipment_type_id = p_equipment_type_id;

  -- Try to assign preferred equipment in order
  IF FOUND AND v_preferences.auto_assign_preferred THEN
    FOREACH v_preferred_id IN ARRAY v_preferences.preferred_equipment_ids
    LOOP
      -- Check if preferred equipment is available
      IF EXISTS (
        SELECT 1 FROM get_available_equipment_for_class(p_class_id, p_equipment_type_id)
        WHERE equipment_id = v_preferred_id
      ) THEN
        v_equipment_id := v_preferred_id;
        EXIT;
      END IF;
    END LOOP;
  END IF;

  -- If no preferred equipment available, assign first available
  IF v_equipment_id IS NULL THEN
    SELECT equipment_id INTO v_equipment_id
    FROM get_available_equipment_for_class(p_class_id, p_equipment_type_id)
    LIMIT 1;
  END IF;

  -- Create assignment if equipment found
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
  -- Update equipment status
  UPDATE equipment
  SET
    status = 'maintenance',
    next_maintenance_due = p_maintenance_date + (maintenance_interval_days || ' days')::INTERVAL
  WHERE id = p_equipment_id;

  -- Cancel any future assignments during maintenance period
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

-- ============================================================================
-- RECORD MIGRATION
-- ============================================================================

INSERT INTO schema_migrations (version, name, checksum, success)
VALUES ('010', 'add_equipment_management', MD5('add_equipment_management_2026_01_24'), true)
ON CONFLICT (version) DO NOTHING;
