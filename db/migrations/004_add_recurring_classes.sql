-- Migration: Add Recurring Class Templates
-- Date: 2026-01-24
-- Description: Adds support for weekly schedules, auto-generation, and holiday exceptions

-- ============================================================================
-- RECURRING CLASS TEMPLATES TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS recurring_class_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  branch_id UUID NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  instructor VARCHAR(255),
  day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6), -- 0=Sunday, 6=Saturday
  start_time TIME NOT NULL,
  duration_minutes INTEGER NOT NULL,
  capacity INTEGER NOT NULL DEFAULT 20,
  waitlist_capacity INTEGER NOT NULL DEFAULT 5,
  is_active BOOLEAN DEFAULT true,
  start_date DATE NOT NULL,
  end_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_recurring_templates_branch_id ON recurring_class_templates(branch_id);
CREATE INDEX IF NOT EXISTS idx_recurring_templates_day_of_week ON recurring_class_templates(day_of_week);
CREATE INDEX IF NOT EXISTS idx_recurring_templates_is_active ON recurring_class_templates(is_active);

-- Trigger for updated_at
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_recurring_class_templates_updated_at'
  ) THEN
    CREATE TRIGGER update_recurring_class_templates_updated_at
      BEFORE UPDATE ON recurring_class_templates
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

-- ============================================================================
-- HOLIDAY EXCEPTIONS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS holiday_exceptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  branch_id UUID NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  exception_date DATE NOT NULL,
  is_closure BOOLEAN DEFAULT true, -- true = closed all day, false = modified schedule
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  UNIQUE(branch_id, exception_date)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_holiday_exceptions_branch_id ON holiday_exceptions(branch_id);
CREATE INDEX IF NOT EXISTS idx_holiday_exceptions_date ON holiday_exceptions(exception_date);

-- ============================================================================
-- GENERATED CLASSES TRACKING TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS generated_classes_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  branch_id UUID NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
  template_id UUID REFERENCES recurring_class_templates(id) ON DELETE SET NULL,
  generation_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  classes_generated INTEGER NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  generated_by UUID REFERENCES users(id) ON DELETE SET NULL,
  notes TEXT
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_generated_classes_log_branch_id ON generated_classes_log(branch_id);
CREATE INDEX IF NOT EXISTS idx_generated_classes_log_template_id ON generated_classes_log(template_id);
CREATE INDEX IF NOT EXISTS idx_generated_classes_log_date ON generated_classes_log(generation_date DESC);

-- ============================================================================
-- LINK CLASSES TO TEMPLATES
-- ============================================================================

-- Add template_id to classes table to track which template generated each class
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'classes' AND column_name = 'template_id'
  ) THEN
    ALTER TABLE classes ADD COLUMN template_id UUID REFERENCES recurring_class_templates(id) ON DELETE SET NULL;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'classes' AND column_name = 'is_recurring'
  ) THEN
    ALTER TABLE classes ADD COLUMN is_recurring BOOLEAN DEFAULT false;
  END IF;
END $$;

-- Index for template lookups
CREATE INDEX IF NOT EXISTS idx_classes_template_id ON classes(template_id);

-- ============================================================================
-- FUNCTIONS FOR CLASS GENERATION
-- ============================================================================

-- Function to generate classes from template for date range
CREATE OR REPLACE FUNCTION generate_classes_from_template(
  p_template_id UUID,
  p_start_date DATE,
  p_end_date DATE,
  p_generated_by UUID
)
RETURNS INTEGER AS $$
DECLARE
  v_template RECORD;
  v_current_date DATE;
  v_class_datetime TIMESTAMP WITH TIME ZONE;
  v_classes_created INTEGER := 0;
  v_is_holiday BOOLEAN;
BEGIN
  -- Get template details
  SELECT * INTO v_template
  FROM recurring_class_templates
  WHERE id = p_template_id AND is_active = true;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Template not found or inactive';
  END IF;

  -- Find first occurrence of the day of week
  v_current_date := p_start_date;
  WHILE EXTRACT(DOW FROM v_current_date) != v_template.day_of_week LOOP
    v_current_date := v_current_date + INTERVAL '1 day';
  END LOOP;

  -- Generate classes for each occurrence
  WHILE v_current_date <= p_end_date LOOP
    -- Check if this date is a holiday
    SELECT EXISTS (
      SELECT 1 FROM holiday_exceptions
      WHERE branch_id = v_template.branch_id
        AND exception_date = v_current_date
        AND is_closure = true
    ) INTO v_is_holiday;

    -- Only create class if not a holiday
    IF NOT v_is_holiday THEN
      v_class_datetime := v_current_date + v_template.start_time;

      -- Create the class (only if it doesn't already exist)
      INSERT INTO classes (
        branch_id,
        name,
        instructor,
        scheduled_at,
        duration_minutes,
        capacity,
        waitlist_capacity,
        template_id,
        is_recurring
      )
      SELECT
        v_template.branch_id,
        v_template.name,
        v_template.instructor,
        v_class_datetime,
        v_template.duration_minutes,
        v_template.capacity,
        v_template.waitlist_capacity,
        v_template.id,
        true
      WHERE NOT EXISTS (
        SELECT 1 FROM classes
        WHERE template_id = v_template.id
          AND scheduled_at = v_class_datetime
      );

      IF FOUND THEN
        v_classes_created := v_classes_created + 1;
      END IF;
    END IF;

    -- Move to next week
    v_current_date := v_current_date + INTERVAL '7 days';
  END LOOP;

  -- Log the generation
  INSERT INTO generated_classes_log (
    branch_id,
    template_id,
    classes_generated,
    start_date,
    end_date,
    generated_by
  ) VALUES (
    v_template.branch_id,
    p_template_id,
    v_classes_created,
    p_start_date,
    p_end_date,
    p_generated_by
  );

  RETURN v_classes_created;
END;
$$ LANGUAGE plpgsql;

-- Function to auto-generate next month's classes for all active templates
CREATE OR REPLACE FUNCTION auto_generate_next_month_classes()
RETURNS TABLE(template_id UUID, classes_created INTEGER) AS $$
DECLARE
  v_start_date DATE;
  v_end_date DATE;
  v_template RECORD;
  v_created INTEGER;
BEGIN
  -- Calculate first day of next month
  v_start_date := DATE_TRUNC('month', CURRENT_DATE + INTERVAL '1 month')::DATE;
  -- Calculate last day of next month
  v_end_date := (DATE_TRUNC('month', CURRENT_DATE + INTERVAL '2 months') - INTERVAL '1 day')::DATE;

  FOR v_template IN
    SELECT id, branch_id
    FROM recurring_class_templates
    WHERE is_active = true
      AND (end_date IS NULL OR end_date >= v_start_date)
  LOOP
    v_created := generate_classes_from_template(
      v_template.id,
      v_start_date,
      v_end_date,
      NULL
    );

    template_id := v_template.id;
    classes_created := v_created;
    RETURN NEXT;
  END LOOP;

  RETURN;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- RECORD MIGRATION
-- ============================================================================

INSERT INTO schema_migrations (version, name, checksum, success)
VALUES ('004', 'add_recurring_classes', MD5('add_recurring_classes_2026_01_24'), true)
ON CONFLICT (version) DO NOTHING;
