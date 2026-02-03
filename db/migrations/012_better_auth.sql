-- Migration: 012_better_auth.sql
-- Description: Migrate from custom JWT auth to Better Auth
-- Date: 2026-01-29

-- ============================================
-- STEP 1: Backup existing tables
-- ============================================

ALTER TABLE users RENAME TO users_backup;
ALTER TABLE user_sessions RENAME TO user_sessions_backup;
ALTER TABLE user_auth_providers RENAME TO user_auth_providers_backup;

-- Drop indexes on renamed tables
DROP INDEX IF EXISTS idx_users_branch_id;
DROP INDEX IF EXISTS idx_users_email;
DROP INDEX IF EXISTS idx_users_role;
DROP INDEX IF EXISTS idx_user_sessions_token;
DROP INDEX IF EXISTS idx_user_sessions_user_id;

-- ============================================
-- STEP 2: Drop foreign key constraints that reference users table
-- ============================================

ALTER TABLE admin_branch_assignments DROP CONSTRAINT IF EXISTS admin_branch_assignments_admin_id_fkey;
ALTER TABLE invite_links DROP CONSTRAINT IF EXISTS invite_links_created_by_fkey;
ALTER TABLE invite_links DROP CONSTRAINT IF EXISTS invite_links_used_by_fkey;
ALTER TABLE user_memberships DROP CONSTRAINT IF EXISTS user_memberships_user_id_fkey;
ALTER TABLE bookings DROP CONSTRAINT IF EXISTS bookings_user_id_fkey;
ALTER TABLE payments DROP CONSTRAINT IF EXISTS payments_user_id_fkey;
ALTER TABLE payments DROP CONSTRAINT IF EXISTS payments_recorded_by_fkey;
ALTER TABLE admin_action_logs DROP CONSTRAINT IF EXISTS admin_action_logs_admin_id_fkey;

-- Drop constraints for health-related tables (if they exist)
-- These tables may not exist in all environments
DO $$ BEGIN
  ALTER TABLE client_health_profiles DROP CONSTRAINT IF EXISTS client_health_profiles_user_id_fkey;
EXCEPTION WHEN undefined_table THEN NULL; END $$;
DO $$ BEGIN
  ALTER TABLE emergency_contacts DROP CONSTRAINT IF EXISTS emergency_contacts_user_id_fkey;
EXCEPTION WHEN undefined_table THEN NULL; END $$;
DO $$ BEGIN
  ALTER TABLE health_assessments DROP CONSTRAINT IF EXISTS health_assessments_user_id_fkey;
EXCEPTION WHEN undefined_table THEN NULL; END $$;
DO $$ BEGIN
  ALTER TABLE health_assessments DROP CONSTRAINT IF EXISTS health_assessments_conducted_by_fkey;
EXCEPTION WHEN undefined_table THEN NULL; END $$;
DO $$ BEGIN
  ALTER TABLE injury_reports DROP CONSTRAINT IF EXISTS injury_reports_user_id_fkey;
EXCEPTION WHEN undefined_table THEN NULL; END $$;
DO $$ BEGIN
  ALTER TABLE injury_reports DROP CONSTRAINT IF EXISTS injury_reports_reported_by_fkey;
EXCEPTION WHEN undefined_table THEN NULL; END $$;
DO $$ BEGIN
  ALTER TABLE injury_reports DROP CONSTRAINT IF EXISTS injury_reports_cleared_by_fkey;
EXCEPTION WHEN undefined_table THEN NULL; END $$;
DO $$ BEGIN
  ALTER TABLE parq_questionnaires DROP CONSTRAINT IF EXISTS parq_questionnaires_user_id_fkey;
EXCEPTION WHEN undefined_table THEN NULL; END $$;
DO $$ BEGIN
  ALTER TABLE client_activity_log DROP CONSTRAINT IF EXISTS client_activity_log_user_id_fkey;
EXCEPTION WHEN undefined_table THEN NULL; END $$;
DO $$ BEGIN
  ALTER TABLE attendance_records DROP CONSTRAINT IF EXISTS attendance_records_user_id_fkey;
EXCEPTION WHEN undefined_table THEN NULL; END $$;
DO $$ BEGIN
  ALTER TABLE attendance_records DROP CONSTRAINT IF EXISTS attendance_records_marked_by_fkey;
EXCEPTION WHEN undefined_table THEN NULL; END $$;

-- ============================================
-- STEP 3: Create Better Auth tables with UUID
-- ============================================

-- Better Auth "user" table with custom fields (using UUID to match existing schema)
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

-- Better Auth "session" table (using UUID)
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

-- Better Auth "account" table (for OAuth and password credentials)
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

-- Better Auth "verification" table (for email verification and password reset tokens)
CREATE TABLE "verification" (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  identifier TEXT NOT NULL,
  value TEXT NOT NULL,
  "expiresAt" TIMESTAMP WITH TIME ZONE NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- STEP 4: Create indexes
-- ============================================

CREATE INDEX idx_user_email ON "user"(email);
CREATE INDEX idx_user_role ON "user"(role);
CREATE INDEX idx_user_branch_id ON "user"(branch_id);
CREATE INDEX idx_session_user_id ON "session"("userId");
CREATE INDEX idx_session_token ON "session"(token);
CREATE INDEX idx_account_user_id ON "account"("userId");
CREATE INDEX idx_account_provider ON "account"("providerId", "accountId");
CREATE INDEX idx_verification_identifier ON "verification"(identifier);

-- ============================================
-- STEP 5: Migrate existing user data
-- ============================================

INSERT INTO "user" (
  id, email, "emailVerified", name, first_name, last_name,
  date_of_birth, id_number, address, phone, role, branch_id,
  terms_accepted_at, "createdAt", "updatedAt"
)
SELECT
  id,  -- Keep existing UUID
  email,
  true, -- Existing users are considered verified
  COALESCE(first_name, '') || ' ' || COALESCE(last_name, ''),
  first_name,
  last_name,
  date_of_birth,
  id_number,
  address,
  phone,
  role,
  branch_id,
  terms_accepted_at,
  created_at,
  updated_at
FROM users_backup;

-- ============================================
-- STEP 6: Migrate password hashes to account table
-- ============================================

INSERT INTO "account" (id, "userId", "accountId", "providerId", password, "createdAt")
SELECT
  uuid_generate_v4(),
  id,
  email,
  'credential',
  password_hash,
  created_at
FROM users_backup
WHERE password_hash IS NOT NULL;

-- ============================================
-- STEP 7: Migrate OAuth providers
-- ============================================

INSERT INTO "account" (id, "userId", "accountId", "providerId", "createdAt")
SELECT
  uuid_generate_v4(),
  user_id,
  provider_user_id,
  provider::text,
  created_at
FROM user_auth_providers_backup;

-- ============================================
-- STEP 8: Restore foreign key constraints referencing the new user table
-- ============================================

ALTER TABLE admin_branch_assignments
  ADD CONSTRAINT admin_branch_assignments_admin_id_fkey
    FOREIGN KEY (admin_id) REFERENCES "user"(id) ON DELETE CASCADE;

ALTER TABLE invite_links
  ADD CONSTRAINT invite_links_created_by_fkey
    FOREIGN KEY (created_by) REFERENCES "user"(id) ON DELETE CASCADE;

ALTER TABLE invite_links
  ADD CONSTRAINT invite_links_used_by_fkey
    FOREIGN KEY (used_by) REFERENCES "user"(id) ON DELETE SET NULL;

ALTER TABLE user_memberships
  ADD CONSTRAINT user_memberships_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES "user"(id) ON DELETE CASCADE;

ALTER TABLE bookings
  ADD CONSTRAINT bookings_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES "user"(id) ON DELETE CASCADE;

ALTER TABLE payments
  ADD CONSTRAINT payments_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES "user"(id) ON DELETE CASCADE;

ALTER TABLE payments
  ADD CONSTRAINT payments_recorded_by_fkey
    FOREIGN KEY (recorded_by) REFERENCES "user"(id) ON DELETE RESTRICT;

ALTER TABLE admin_action_logs
  ADD CONSTRAINT admin_action_logs_admin_id_fkey
    FOREIGN KEY (admin_id) REFERENCES "user"(id) ON DELETE CASCADE;

-- Health-related tables (if they exist)
DO $$ BEGIN
  ALTER TABLE client_health_profiles
    ADD CONSTRAINT client_health_profiles_user_id_fkey
      FOREIGN KEY (user_id) REFERENCES "user"(id) ON DELETE CASCADE;
EXCEPTION WHEN undefined_table THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE emergency_contacts
    ADD CONSTRAINT emergency_contacts_user_id_fkey
      FOREIGN KEY (user_id) REFERENCES "user"(id) ON DELETE CASCADE;
EXCEPTION WHEN undefined_table THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE health_assessments
    ADD CONSTRAINT health_assessments_user_id_fkey
      FOREIGN KEY (user_id) REFERENCES "user"(id) ON DELETE CASCADE;
EXCEPTION WHEN undefined_table THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE health_assessments
    ADD CONSTRAINT health_assessments_conducted_by_fkey
      FOREIGN KEY (conducted_by) REFERENCES "user"(id) ON DELETE SET NULL;
EXCEPTION WHEN undefined_table THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE injury_reports
    ADD CONSTRAINT injury_reports_user_id_fkey
      FOREIGN KEY (user_id) REFERENCES "user"(id) ON DELETE CASCADE;
EXCEPTION WHEN undefined_table THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE injury_reports
    ADD CONSTRAINT injury_reports_reported_by_fkey
      FOREIGN KEY (reported_by) REFERENCES "user"(id) ON DELETE SET NULL;
EXCEPTION WHEN undefined_table THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE injury_reports
    ADD CONSTRAINT injury_reports_cleared_by_fkey
      FOREIGN KEY (cleared_by) REFERENCES "user"(id) ON DELETE SET NULL;
EXCEPTION WHEN undefined_table THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE parq_questionnaires
    ADD CONSTRAINT parq_questionnaires_user_id_fkey
      FOREIGN KEY (user_id) REFERENCES "user"(id) ON DELETE CASCADE;
EXCEPTION WHEN undefined_table THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE client_activity_log
    ADD CONSTRAINT client_activity_log_user_id_fkey
      FOREIGN KEY (user_id) REFERENCES "user"(id) ON DELETE CASCADE;
EXCEPTION WHEN undefined_table THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE attendance_records
    ADD CONSTRAINT attendance_records_user_id_fkey
      FOREIGN KEY (user_id) REFERENCES "user"(id) ON DELETE CASCADE;
EXCEPTION WHEN undefined_table THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE attendance_records
    ADD CONSTRAINT attendance_records_marked_by_fkey
      FOREIGN KEY (marked_by) REFERENCES "user"(id) ON DELETE SET NULL;
EXCEPTION WHEN undefined_table THEN NULL; END $$;

-- ============================================
-- STEP 9: Create triggers for updated_at
-- ============================================

CREATE TRIGGER update_user_updated_at
  BEFORE UPDATE ON "user"
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_session_updated_at
  BEFORE UPDATE ON "session"
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_account_updated_at
  BEFORE UPDATE ON "account"
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_verification_updated_at
  BEFORE UPDATE ON "verification"
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- STEP 10: Recreate materialized views
-- ============================================

-- mv_client_retention
CREATE MATERIALIZED VIEW mv_client_retention AS
SELECT
  u.branch_id,
  DATE_TRUNC('month', u."createdAt") as cohort_month,
  COUNT(DISTINCT u.id) as cohort_size,
  COUNT(DISTINCT um.user_id) as active_members,
  ROUND(
    COUNT(DISTINCT um.user_id)::numeric / NULLIF(COUNT(DISTINCT u.id), 0) * 100,
    2
  ) as retention_rate
FROM "user" u
LEFT JOIN user_memberships um ON u.id = um.user_id AND um.is_active = true
WHERE u.role = 'client'
GROUP BY u.branch_id, DATE_TRUNC('month', u."createdAt");

CREATE INDEX idx_mv_client_retention_branch ON mv_client_retention(branch_id);

-- mv_class_popularity
CREATE MATERIALIZED VIEW mv_class_popularity AS
SELECT
  c.branch_id,
  c.name as class_name,
  c.instructor,
  COUNT(DISTINCT c.id) as total_classes,
  COUNT(DISTINCT b.id) as total_bookings,
  ROUND(AVG(c.capacity), 0) as avg_capacity,
  ROUND(
    COUNT(DISTINCT b.id)::numeric / NULLIF(COUNT(DISTINCT c.id), 0),
    2
  ) as avg_bookings_per_class,
  ROUND(
    COUNT(DISTINCT b.id)::numeric / NULLIF(SUM(c.capacity), 0) * 100,
    2
  ) as utilization_rate
FROM classes c
LEFT JOIN bookings b ON c.id = b.class_id AND b.status != 'cancelled'
GROUP BY c.branch_id, c.name, c.instructor;

CREATE INDEX idx_mv_class_popularity_branch ON mv_class_popularity(branch_id);

-- mv_membership_funnel
CREATE MATERIALIZED VIEW mv_membership_funnel AS
SELECT
  u.branch_id,
  DATE_TRUNC('month', u."createdAt") as signup_month,
  COUNT(DISTINCT u.id) as total_signups,
  COUNT(DISTINCT um.user_id) as converted_to_membership,
  ROUND(
    COUNT(DISTINCT um.user_id)::numeric / NULLIF(COUNT(DISTINCT u.id), 0) * 100,
    2
  ) as conversion_rate
FROM "user" u
LEFT JOIN user_memberships um ON u.id = um.user_id
WHERE u.role = 'client'
GROUP BY u.branch_id, DATE_TRUNC('month', u."createdAt");

CREATE INDEX idx_mv_membership_funnel_branch ON mv_membership_funnel(branch_id);

-- mv_daily_revenue
CREATE MATERIALIZED VIEW mv_daily_revenue AS
SELECT
  u.branch_id,
  DATE(p.payment_date) as revenue_date,
  COUNT(DISTINCT p.id) as transaction_count,
  COUNT(DISTINCT p.user_id) as unique_customers,
  SUM(p.amount) as total_revenue,
  AVG(p.amount) as avg_transaction
FROM payments p
JOIN "user" u ON p.user_id = u.id
GROUP BY u.branch_id, DATE(p.payment_date);

CREATE INDEX idx_mv_daily_revenue_branch_date ON mv_daily_revenue(branch_id, revenue_date);

-- ============================================
-- NOTE: Backup tables are kept for rollback
-- To rollback, run:
--   DROP TABLE "user", "session", "account", "verification" CASCADE;
--   ALTER TABLE users_backup RENAME TO users;
--   ALTER TABLE user_sessions_backup RENAME TO user_sessions;
--   ALTER TABLE user_auth_providers_backup RENAME TO user_auth_providers;
--   (Then restore foreign keys and indexes)
-- ============================================
