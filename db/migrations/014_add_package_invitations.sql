-- Migration: Add Package Invitations
-- Date: 2026-02-01
-- Description: Adds invitation link system for packages to allow client self-registration

-- ============================================================================
-- PACKAGE INVITATIONS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS package_invitations (
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
  max_uses INTEGER, -- NULL = unlimited
  
  -- Validity
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP WITH TIME ZONE,
  
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_package_invitations_code ON package_invitations(code);
CREATE INDEX IF NOT EXISTS idx_package_invitations_package ON package_invitations(package_id);
CREATE INDEX IF NOT EXISTS idx_package_invitations_branch ON package_invitations(branch_id);
CREATE INDEX IF NOT EXISTS idx_package_invitations_active ON package_invitations(is_active);

-- Trigger for updated_at
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_package_invitations_updated_at'
  ) THEN
    CREATE TRIGGER update_package_invitations_updated_at
      BEFORE UPDATE ON package_invitations
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

-- ============================================================================
-- RECORD MIGRATION
-- ============================================================================

INSERT INTO schema_migrations (version, name, checksum, success)
VALUES ('014', 'add_package_invitations', MD5('add_package_invitations_2026_02_01'), true)
ON CONFLICT (version) DO NOTHING;
