/*
NOTE: These materialized view queries are temporarily disabled because
the views were recreated in migration 012 with different schemas than
what these queries expect. The columns need to be aligned between:
- Migration 005 (original views with more columns)
- Migration 012 (recreated views with fewer columns)
TODO: Update these queries to match the actual column structure in migration 012

@name GetDailyRevenue
SELECT *
FROM mv_daily_revenue
WHERE branch_id = :branchId!
  AND revenue_date >= :startDate!
  AND revenue_date <= :endDate!
ORDER BY revenue_date DESC;

@name GetClassPopularity
SELECT *
FROM mv_class_popularity
WHERE branch_id = :branchId!
ORDER BY utilization_rate DESC
LIMIT :limit;

@name GetClientRetention
SELECT *
FROM mv_client_retention
WHERE branch_id = :branchId!
ORDER BY cohort_month DESC
LIMIT :limit;
*/

/* @name CreateAnalyticsCache */
INSERT INTO analytics_cache (
  branch_id,
  metric_type,
  metric_date,
  metric_value
) VALUES (
  :branchId!,
  :metricType!,
  :metricDate!,
  :metricValue!
)
ON CONFLICT (branch_id, metric_type, metric_date) DO UPDATE SET
  metric_value = EXCLUDED.metric_value,
  calculated_at = CURRENT_TIMESTAMP
RETURNING *;

/* @name GetAnalyticsCache */
SELECT
  id,
  branch_id,
  metric_type,
  metric_date,
  metric_value,
  calculated_at
FROM analytics_cache
WHERE branch_id = :branchId!
  AND metric_type = :metricType!
  AND metric_date = :metricDate!;

/* @name LogClientActivity */
INSERT INTO client_activity_log (
  user_id,
  branch_id,
  activity_type,
  metadata
) VALUES (
  :userId!,
  :branchId!,
  :activityType!,
  :metadata
)
RETURNING *;

/* @name GetRecentClientActivity */
SELECT
  cal.*,
  u.first_name,
  u.last_name,
  u.email
FROM client_activity_log cal
JOIN "user" u ON cal.user_id = u.id
WHERE cal.branch_id = :branchId!
  AND cal.activity_date >= :startDate!
ORDER BY cal.activity_date DESC
LIMIT :limit;

/* @name GetRevenueTrend */
SELECT
  DATE_TRUNC(:period!, p.payment_date) as period_start,
  COUNT(DISTINCT p.user_id) as unique_customers,
  COUNT(p.id) as transaction_count,
  SUM(p.amount) as total_revenue,
  AVG(p.amount) as avg_transaction_value
FROM payments p
WHERE p.branch_id = :branchId!
  AND p.payment_date >= CURRENT_DATE - :daysBack! * INTERVAL '1 day'
  AND p.status = 'completed'
GROUP BY DATE_TRUNC(:period!, p.payment_date)
ORDER BY period_start DESC;

/* @name GetClassUtilizationHeatmap */
SELECT
  EXTRACT(DOW FROM c.scheduled_at) as day_of_week,
  EXTRACT(HOUR FROM c.scheduled_at) as hour_of_day,
  COUNT(c.id) as class_count,
  ROUND(AVG(
    (SELECT COUNT(*) FROM bookings WHERE class_id = c.id AND status = 'confirmed')::numeric /
    NULLIF(c.capacity, 0)
  ) * 100, 2) as avg_utilization_rate,
  ROUND(AVG(
    (SELECT COUNT(*) FROM bookings WHERE class_id = c.id AND status = 'confirmed')::numeric
  ), 2) as avg_attendance
FROM classes c
WHERE c.branch_id = :branchId!
  AND c.scheduled_at >= CURRENT_DATE - :daysBack! * INTERVAL '1 day'
  AND c.scheduled_at < CURRENT_DATE
GROUP BY EXTRACT(DOW FROM c.scheduled_at), EXTRACT(HOUR FROM c.scheduled_at)
ORDER BY day_of_week, hour_of_day;

/* @name GetInstructorPerformance */
SELECT
  c.instructor,
  COUNT(DISTINCT c.id) as total_classes,
  COUNT(DISTINCT b.id) FILTER (WHERE b.status = 'confirmed') as total_bookings,
  ROUND(AVG(
    (SELECT COUNT(*) FROM bookings WHERE class_id = c.id AND status = 'confirmed')::numeric
  ), 2) as avg_attendance,
  ROUND(AVG(
    (SELECT COUNT(*) FROM bookings WHERE class_id = c.id AND status = 'confirmed')::numeric /
    NULLIF(c.capacity, 0)
  ) * 100, 2) as avg_utilization_rate,
  ROUND(AVG(
    (SELECT COUNT(*) FROM attendance_records WHERE class_id = c.id AND status = 'present')::numeric /
    NULLIF((SELECT COUNT(*) FROM bookings WHERE class_id = c.id AND status = 'confirmed'), 0)
  ) * 100, 2) as avg_attendance_rate
FROM classes c
LEFT JOIN bookings b ON c.id = b.class_id
WHERE c.branch_id = :branchId!
  AND c.scheduled_at >= CURRENT_DATE - :daysBack! * INTERVAL '1 day'
  AND c.scheduled_at < CURRENT_DATE
  AND c.instructor IS NOT NULL
GROUP BY c.instructor
ORDER BY avg_utilization_rate DESC;

/* @name GetPeakHoursAnalysis */
SELECT
  EXTRACT(HOUR FROM c.scheduled_at) as hour_of_day,
  COUNT(c.id) as total_classes,
  ROUND(AVG(
    (SELECT COUNT(*) FROM bookings WHERE class_id = c.id AND status = 'confirmed')::numeric
  ), 2) as avg_bookings,
  ROUND(AVG(
    (SELECT COUNT(*) FROM bookings WHERE class_id = c.id AND status = 'confirmed')::numeric /
    NULLIF(c.capacity, 0)
  ) * 100, 2) as avg_utilization_rate,
  COUNT(DISTINCT c.id) FILTER (
    WHERE (SELECT COUNT(*) FROM bookings WHERE class_id = c.id AND status = 'confirmed') >= c.capacity
  ) as fully_booked_count
FROM classes c
WHERE c.branch_id = :branchId!
  AND c.scheduled_at >= CURRENT_DATE - :daysBack! * INTERVAL '1 day'
  AND c.scheduled_at < CURRENT_DATE
GROUP BY EXTRACT(HOUR FROM c.scheduled_at)
ORDER BY hour_of_day;

/* @name GetClientLifetimeValue */
SELECT
  u.id as user_id,
  u.first_name,
  u.last_name,
  u.email,
  MIN(p.payment_date) as first_payment_date,
  MAX(p.payment_date) as last_payment_date,
  COUNT(DISTINCT p.id) as total_transactions,
  SUM(p.amount) as lifetime_value,
  AVG(p.amount) as avg_transaction_value,
  COUNT(DISTINCT b.id) FILTER (WHERE b.status = 'confirmed') as total_classes_attended,
  ROUND(
    SUM(p.amount) / NULLIF(
      EXTRACT(EPOCH FROM (MAX(p.payment_date)::timestamp - MIN(p.payment_date)::timestamp)) / 2592000,
      0
    ),
    2
  ) as monthly_value
FROM "user" u
LEFT JOIN payments p ON u.id = p.user_id AND p.status = 'completed'
LEFT JOIN bookings b ON u.id = b.user_id
WHERE u.branch_id = :branchId!
  AND u.role = 'client'
  AND p.payment_date IS NOT NULL
GROUP BY u.id, u.first_name, u.last_name, u.email
HAVING SUM(p.amount) > 0
ORDER BY lifetime_value DESC
LIMIT :limit;

/* @name RefreshAnalyticsViews */
SELECT refresh_analytics_views() as refreshed;
