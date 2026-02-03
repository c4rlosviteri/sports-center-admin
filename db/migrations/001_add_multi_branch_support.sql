-- Migration: Add Multi-Branch Support
-- Date: 2026-01-23

-- Add is_active column to branches if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'branches' AND column_name = 'is_active'
  ) THEN
    ALTER TABLE branches ADD COLUMN is_active BOOLEAN DEFAULT true;
  END IF;
END $$;

-- Create admin_branch_assignments table if it doesn't exist
CREATE TABLE IF NOT EXISTS admin_branch_assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  branch_id UUID NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(admin_id, branch_id)
);

-- Add indexes if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes WHERE indexname = 'idx_admin_branch_assignments_admin_id'
  ) THEN
    CREATE INDEX idx_admin_branch_assignments_admin_id ON admin_branch_assignments(admin_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes WHERE indexname = 'idx_admin_branch_assignments_branch_id'
  ) THEN
    CREATE INDEX idx_admin_branch_assignments_branch_id ON admin_branch_assignments(branch_id);
  END IF;
END $$;

-- Add trigger if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_admin_branch_assignments_updated_at'
  ) THEN
    CREATE TRIGGER update_admin_branch_assignments_updated_at 
      BEFORE UPDATE ON admin_branch_assignments 
      FOR EACH ROW 
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

-- Assign existing admins to their current branches
INSERT INTO admin_branch_assignments (admin_id, branch_id, is_primary)
SELECT id, branch_id, true
FROM users
WHERE role = 'admin' AND branch_id IS NOT NULL
ON CONFLICT (admin_id, branch_id) DO NOTHING;

-- Update all existing branches to be active
UPDATE branches SET is_active = true WHERE is_active IS NULL;
