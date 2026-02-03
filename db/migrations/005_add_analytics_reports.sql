-- Migration: Add Analytics & Reports Dashboard
-- Date: 2026-01-24
-- Description: Adds tables and views for revenue trends, class popularity, retention metrics

-- ============================================================================
-- ANALYTICS CACHE TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS analytics_cache (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  branch_id UUID NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
  metric_type VARCHAR(100) NOT NULL,
  metric_date DATE NOT NULL,
  metric_value JSONB NOT NULL,
  calculated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(branch_id, metric_type, metric_date)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_analytics_cache_branch_metric ON analytics_cache(branch_id, metric_type);
CREATE INDEX IF NOT EXISTS idx_analytics_cache_date ON analytics_cache(metric_date DESC);

-- ============================================================================
-- CLIENT ACTIVITY LOG
-- ============================================================================

CREATE TABLE IF NOT EXISTS client_activity_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  branch_id UUID NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
  activity_type VARCHAR(50) NOT NULL CHECK (activity_type IN (
    'registration', 'booking', 'cancellation', 'attendance',
    'payment', 'membership_purchase', 'membership_renewal', 'no_show'
  )),
  activity_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for analytics queries
CREATE INDEX IF NOT EXISTS idx_client_activity_user_id ON client_activity_log(user_id);
CREATE INDEX IF NOT EXISTS idx_client_activity_branch_id ON client_activity_log(branch_id);
CREATE INDEX IF NOT EXISTS idx_client_activity_type ON client_activity_log(activity_type);
CREATE INDEX IF NOT EXISTS idx_client_activity_date ON client_activity_log(activity_date DESC);

-- ============================================================================
-- MATERIALIZED VIEWS FOR ANALYTICS
-- ============================================================================

-- Daily Revenue Summary View
CREATE MATERIALIZED VIEW IF NOT EXISTS mv_daily_revenue AS
SELECT
  p.branch_id,
  DATE(p.payment_date) as revenue_date,
  COUNT(DISTINCT p.user_id) as unique_customers,
  COUNT(p.id) as transaction_count,
  SUM(p.amount) as total_revenue,
  AVG(p.amount) as avg_transaction_value,
  SUM(CASE WHEN p.payment_date >= CURRENT_DATE - INTERVAL '7 days' THEN p.amount ELSE 0 END) as revenue_last_7_days,
  SUM(CASE WHEN p.payment_date >= CURRENT_DATE - INTERVAL '30 days' THEN p.amount ELSE 0 END) as revenue_last_30_days
FROM payments p
JOIN users u ON p.user_id = u.id
GROUP BY p.branch_id, DATE(p.payment_date);

CREATE UNIQUE INDEX IF NOT EXISTS idx_mv_daily_revenue_unique
  ON mv_daily_revenue(branch_id, revenue_date);

-- Class Popularity View
CREATE MATERIALIZED VIEW IF NOT EXISTS mv_class_popularity AS
SELECT
  c.branch_id,
  c.name as class_name,
  c.instructor,
  EXTRACT(DOW FROM c.scheduled_at) as day_of_week,
  EXTRACT(HOUR FROM c.scheduled_at) as hour_of_day,
  COUNT(DISTINCT c.id) as total_classes,
  COUNT(DISTINCT b.id) FILTER (WHERE b.status = 'confirmed') as total_bookings,
  COUNT(DISTINCT b.id) FILTER (WHERE b.status = 'waitlisted') as total_waitlisted,
  AVG(c.capacity) as avg_capacity,
  (COUNT(DISTINCT b.id) FILTER (WHERE b.status = 'confirmed')::DECIMAL / NULLIF(COUNT(DISTINCT c.id), 0)) as avg_bookings_per_class,
  (COUNT(DISTINCT b.id) FILTER (WHERE b.status = 'confirmed')::DECIMAL / NULLIF(SUM(c.capacity), 0)) * 100 as utilization_rate
FROM classes c
LEFT JOIN bookings b ON c.id = b.class_id
WHERE c.scheduled_at >= CURRENT_DATE - INTERVAL '90 days'
GROUP BY c.branch_id, c.name, c.instructor, EXTRACT(DOW FROM c.scheduled_at), EXTRACT(HOUR FROM c.scheduled_at);

CREATE INDEX IF NOT EXISTS idx_mv_class_popularity_branch
  ON mv_class_popularity(branch_id);

-- Client Retention Metrics View
CREATE MATERIALIZED VIEW IF NOT EXISTS mv_client_retention AS
WITH user_activity AS (
  SELECT
    u.id as user_id,
    u.branch_id,
    u.created_at as registration_date,
    MAX(b.booked_at) as last_booking_date,
    COUNT(DISTINCT b.id) as total_bookings,
    COUNT(DISTINCT CASE WHEN b.booked_at >= CURRENT_DATE - INTERVAL '30 days' THEN b.id END) as bookings_last_30_days,
    COUNT(DISTINCT CASE WHEN b.booked_at >= CURRENT_DATE - INTERVAL '90 days' THEN b.id END) as bookings_last_90_days
  FROM users u
  LEFT JOIN bookings b ON u.id = b.user_id
  WHERE u.role = 'client'
  GROUP BY u.id, u.branch_id, u.created_at
)
SELECT
  branch_id,
  DATE_TRUNC('month', registration_date)::DATE as cohort_month,
  COUNT(*) as total_users,
  COUNT(*) FILTER (WHERE bookings_last_30_days > 0) as active_last_30_days,
  COUNT(*) FILTER (WHERE bookings_last_90_days > 0) as active_last_90_days,
  COUNT(*) FILTER (WHERE last_booking_date < CURRENT_DATE - INTERVAL '90 days') as churned_users,
  (COUNT(*) FILTER (WHERE bookings_last_30_days > 0)::DECIMAL / NULLIF(COUNT(*), 0)) * 100 as retention_rate_30d,
  (COUNT(*) FILTER (WHERE bookings_last_90_days > 0)::DECIMAL / NULLIF(COUNT(*), 0)) * 100 as retention_rate_90d,
  AVG(total_bookings) as avg_lifetime_bookings
FROM user_activity
GROUP BY branch_id, DATE_TRUNC('month', registration_date);

CREATE INDEX IF NOT EXISTS idx_mv_client_retention_branch
  ON mv_client_retention(branch_id, cohort_month);

-- Membership Conversion Funnel View
CREATE MATERIALIZED VIEW IF NOT EXISTS mv_membership_funnel AS
WITH funnel_data AS (
  SELECT
    u.branch_id,
    DATE_TRUNC('month', u.created_at)::DATE as signup_month,
    COUNT(DISTINCT u.id) as total_signups,
    COUNT(DISTINCT CASE WHEN EXISTS (
      SELECT 1 FROM bookings b WHERE b.user_id = u.id
    ) THEN u.id END) as users_with_bookings,
    COUNT(DISTINCT CASE WHEN EXISTS (
      SELECT 1 FROM user_memberships um WHERE um.user_id = u.id
    ) THEN u.id END) as users_with_memberships,
    COUNT(DISTINCT CASE WHEN EXISTS (
      SELECT 1 FROM payments p WHERE p.user_id = u.id
    ) THEN u.id END) as users_with_payments
  FROM users u
  WHERE u.role = 'client'
    AND u.created_at >= CURRENT_DATE - INTERVAL '12 months'
  GROUP BY u.branch_id, DATE_TRUNC('month', u.created_at)
)
SELECT
  branch_id,
  signup_month,
  total_signups,
  users_with_bookings,
  users_with_memberships,
  users_with_payments,
  (users_with_bookings::DECIMAL / NULLIF(total_signups, 0)) * 100 as booking_conversion_rate,
  (users_with_memberships::DECIMAL / NULLIF(total_signups, 0)) * 100 as membership_conversion_rate,
  (users_with_payments::DECIMAL / NULLIF(total_signups, 0)) * 100 as payment_conversion_rate
FROM funnel_data;

CREATE INDEX IF NOT EXISTS idx_mv_membership_funnel_branch
  ON mv_membership_funnel(branch_id, signup_month);

-- ============================================================================
-- FUNCTIONS TO REFRESH MATERIALIZED VIEWS
-- ============================================================================

CREATE OR REPLACE FUNCTION refresh_analytics_views()
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY mv_daily_revenue;
  REFRESH MATERIALIZED VIEW CONCURRENTLY mv_class_popularity;
  REFRESH MATERIALIZED VIEW CONCURRENTLY mv_client_retention;
  REFRESH MATERIALIZED VIEW CONCURRENTLY mv_membership_funnel;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- ANALYTICS HELPER FUNCTIONS
-- ============================================================================

-- Calculate class utilization heatmap
CREATE OR REPLACE FUNCTION get_class_utilization_heatmap(
  p_branch_id UUID,
  p_days_back INTEGER DEFAULT 30
)
RETURNS TABLE(
  day_of_week INTEGER,
  hour_of_day INTEGER,
  total_classes INTEGER,
  avg_utilization DECIMAL,
  total_revenue DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    EXTRACT(DOW FROM c.scheduled_at)::INTEGER as day_of_week,
    EXTRACT(HOUR FROM c.scheduled_at)::INTEGER as hour_of_day,
    COUNT(DISTINCT c.id)::INTEGER as total_classes,
    (COUNT(DISTINCT b.id) FILTER (WHERE b.status = 'confirmed')::DECIMAL / NULLIF(SUM(c.capacity), 0)) * 100 as avg_utilization,
    COALESCE(SUM(p.amount), 0) as total_revenue
  FROM classes c
  LEFT JOIN bookings b ON c.id = b.class_id
  LEFT JOIN payments p ON b.membership_id = p.membership_id
  WHERE c.branch_id = p_branch_id
    AND c.scheduled_at >= CURRENT_DATE - (p_days_back || ' days')::INTERVAL
    AND c.scheduled_at < CURRENT_DATE
  GROUP BY EXTRACT(DOW FROM c.scheduled_at), EXTRACT(HOUR FROM c.scheduled_at)
  ORDER BY day_of_week, hour_of_day;
END;
$$ LANGUAGE plpgsql;

-- Calculate revenue trends
CREATE OR REPLACE FUNCTION get_revenue_trend(
  p_branch_id UUID,
  p_period VARCHAR DEFAULT 'daily',
  p_days_back INTEGER DEFAULT 30
)
RETURNS TABLE(
  period_date DATE,
  revenue DECIMAL,
  transaction_count INTEGER,
  avg_transaction DECIMAL
) AS $$
BEGIN
  IF p_period = 'daily' THEN
    RETURN QUERY
    SELECT
      DATE(p.payment_date) as period_date,
      SUM(p.amount) as revenue,
      COUNT(p.id)::INTEGER as transaction_count,
      AVG(p.amount) as avg_transaction
    FROM payments p
    JOIN users u ON p.user_id = u.id
    WHERE u.branch_id = p_branch_id
      AND p.payment_date >= CURRENT_DATE - (p_days_back || ' days')::INTERVAL
    GROUP BY DATE(p.payment_date)
    ORDER BY period_date DESC;
  ELSIF p_period = 'weekly' THEN
    RETURN QUERY
    SELECT
      DATE_TRUNC('week', p.payment_date)::DATE as period_date,
      SUM(p.amount) as revenue,
      COUNT(p.id)::INTEGER as transaction_count,
      AVG(p.amount) as avg_transaction
    FROM payments p
    JOIN users u ON p.user_id = u.id
    WHERE u.branch_id = p_branch_id
      AND p.payment_date >= CURRENT_DATE - (p_days_back || ' days')::INTERVAL
    GROUP BY DATE_TRUNC('week', p.payment_date)
    ORDER BY period_date DESC;
  ELSIF p_period = 'monthly' THEN
    RETURN QUERY
    SELECT
      DATE_TRUNC('month', p.payment_date)::DATE as period_date,
      SUM(p.amount) as revenue,
      COUNT(p.id)::INTEGER as transaction_count,
      AVG(p.amount) as avg_transaction
    FROM payments p
    JOIN users u ON p.user_id = u.id
    WHERE u.branch_id = p_branch_id
      AND p.payment_date >= CURRENT_DATE - (p_days_back || ' days')::INTERVAL
    GROUP BY DATE_TRUNC('month', p.payment_date)
    ORDER BY period_date DESC;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- RECORD MIGRATION
-- ============================================================================

INSERT INTO schema_migrations (version, name, checksum, success)
VALUES ('005', 'add_analytics_reports', MD5('add_analytics_reports_2026_01_24'), true)
ON CONFLICT (version) DO NOTHING;
