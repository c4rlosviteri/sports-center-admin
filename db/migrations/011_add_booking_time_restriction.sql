-- Migration: Add Booking Time Restriction
-- Date: 2026-01-25
-- Description: Allow admins to restrict how soon before a class starts users can book it

-- Add booking_hours_before to branch_settings (global default)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'branch_settings' AND column_name = 'booking_hours_before'
  ) THEN
    ALTER TABLE branch_settings
    ADD COLUMN booking_hours_before INTEGER NOT NULL DEFAULT 0;

    COMMENT ON COLUMN branch_settings.booking_hours_before IS
      'Minimum hours before class start time that users can book (0 = no restriction)';
  END IF;
END $$;

-- Add booking_hours_before to classes (per-class override, nullable)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'classes' AND column_name = 'booking_hours_before'
  ) THEN
    ALTER TABLE classes
    ADD COLUMN booking_hours_before INTEGER;

    COMMENT ON COLUMN classes.booking_hours_before IS
      'Minimum hours before class start time that users can book. NULL = use branch default';
  END IF;
END $$;
