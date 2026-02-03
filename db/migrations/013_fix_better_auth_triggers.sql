-- Migration: 013_fix_better_auth_triggers.sql
-- Description: Fix updated_at trigger for Better Auth tables which use "updatedAt" column
-- Date: 2026-01-31

-- ============================================
-- STEP 1: Drop existing broken triggers
-- ============================================

DROP TRIGGER IF EXISTS update_user_updated_at ON "user";
DROP TRIGGER IF EXISTS update_session_updated_at ON "session";
DROP TRIGGER IF EXISTS update_account_updated_at ON "account";
DROP TRIGGER IF EXISTS update_verification_updated_at ON "verification";

-- ============================================
-- STEP 2: Create new trigger function for Better Auth tables
-- (uses "updatedAt" instead of updated_at)
-- ============================================

CREATE OR REPLACE FUNCTION update_better_auth_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW."updatedAt" = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- ============================================
-- STEP 3: Recreate triggers with correct function
-- ============================================

CREATE TRIGGER update_user_updated_at
  BEFORE UPDATE ON "user"
  FOR EACH ROW
  EXECUTE FUNCTION update_better_auth_updated_at_column();

CREATE TRIGGER update_session_updated_at
  BEFORE UPDATE ON "session"
  FOR EACH ROW
  EXECUTE FUNCTION update_better_auth_updated_at_column();

CREATE TRIGGER update_account_updated_at
  BEFORE UPDATE ON "account"
  FOR EACH ROW
  EXECUTE FUNCTION update_better_auth_updated_at_column();

CREATE TRIGGER update_verification_updated_at
  BEFORE UPDATE ON "verification"
  FOR EACH ROW
  EXECUTE FUNCTION update_better_auth_updated_at_column();
