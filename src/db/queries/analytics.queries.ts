/** Types generated for queries found in "src/db/queries/analytics.sql" */
import { PreparedQuery } from '@pgtyped/runtime';

export type DateOrString = Date | string;

export type Json = null | boolean | number | string | Json[] | { [key: string]: Json };

export type NumberOrString = number | string;

/** 'CreateAnalyticsCache' parameters type */
export interface CreateAnalyticsCacheParams {
  branchId: string;
  metricDate: DateOrString;
  metricType: string;
  metricValue: Json;
}

/** 'CreateAnalyticsCache' return type */
export interface CreateAnalyticsCacheResult {
  branch_id: string;
  calculated_at: Date | null;
  id: string;
  metric_date: Date;
  metric_type: string;
  metric_value: Json;
}

/** 'CreateAnalyticsCache' query type */
export interface CreateAnalyticsCacheQuery {
  params: CreateAnalyticsCacheParams;
  result: CreateAnalyticsCacheResult;
}

const createAnalyticsCacheIR: any = {"usedParamSet":{"branchId":true,"metricType":true,"metricDate":true,"metricValue":true},"params":[{"name":"branchId","required":true,"transform":{"type":"scalar"},"locs":[{"a":101,"b":110}]},{"name":"metricType","required":true,"transform":{"type":"scalar"},"locs":[{"a":115,"b":126}]},{"name":"metricDate","required":true,"transform":{"type":"scalar"},"locs":[{"a":131,"b":142}]},{"name":"metricValue","required":true,"transform":{"type":"scalar"},"locs":[{"a":147,"b":159}]}],"statement":"INSERT INTO analytics_cache (\n  branch_id,\n  metric_type,\n  metric_date,\n  metric_value\n) VALUES (\n  :branchId!,\n  :metricType!,\n  :metricDate!,\n  :metricValue!\n)\nON CONFLICT (branch_id, metric_type, metric_date) DO UPDATE SET\n  metric_value = EXCLUDED.metric_value,\n  calculated_at = CURRENT_TIMESTAMP\nRETURNING *"};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO analytics_cache (
 *   branch_id,
 *   metric_type,
 *   metric_date,
 *   metric_value
 * ) VALUES (
 *   :branchId!,
 *   :metricType!,
 *   :metricDate!,
 *   :metricValue!
 * )
 * ON CONFLICT (branch_id, metric_type, metric_date) DO UPDATE SET
 *   metric_value = EXCLUDED.metric_value,
 *   calculated_at = CURRENT_TIMESTAMP
 * RETURNING *
 * ```
 */
export const createAnalyticsCache = new PreparedQuery<CreateAnalyticsCacheParams,CreateAnalyticsCacheResult>(createAnalyticsCacheIR);


/** 'GetAnalyticsCache' parameters type */
export interface GetAnalyticsCacheParams {
  branchId: string;
  metricDate: DateOrString;
  metricType: string;
}

/** 'GetAnalyticsCache' return type */
export interface GetAnalyticsCacheResult {
  branch_id: string;
  calculated_at: Date | null;
  id: string;
  metric_date: Date;
  metric_type: string;
  metric_value: Json;
}

/** 'GetAnalyticsCache' query type */
export interface GetAnalyticsCacheQuery {
  params: GetAnalyticsCacheParams;
  result: GetAnalyticsCacheResult;
}

const getAnalyticsCacheIR: any = {"usedParamSet":{"branchId":true,"metricType":true,"metricDate":true},"params":[{"name":"branchId","required":true,"transform":{"type":"scalar"},"locs":[{"a":127,"b":136}]},{"name":"metricType","required":true,"transform":{"type":"scalar"},"locs":[{"a":158,"b":169}]},{"name":"metricDate","required":true,"transform":{"type":"scalar"},"locs":[{"a":191,"b":202}]}],"statement":"SELECT\n  id,\n  branch_id,\n  metric_type,\n  metric_date,\n  metric_value,\n  calculated_at\nFROM analytics_cache\nWHERE branch_id = :branchId!\n  AND metric_type = :metricType!\n  AND metric_date = :metricDate!"};

/**
 * Query generated from SQL:
 * ```
 * SELECT
 *   id,
 *   branch_id,
 *   metric_type,
 *   metric_date,
 *   metric_value,
 *   calculated_at
 * FROM analytics_cache
 * WHERE branch_id = :branchId!
 *   AND metric_type = :metricType!
 *   AND metric_date = :metricDate!
 * ```
 */
export const getAnalyticsCache = new PreparedQuery<GetAnalyticsCacheParams,GetAnalyticsCacheResult>(getAnalyticsCacheIR);


/** 'LogClientActivity' parameters type */
export interface LogClientActivityParams {
  activityType: string;
  branchId: string;
  metadata?: Json | null | void;
  userId: string;
}

/** 'LogClientActivity' return type */
export interface LogClientActivityResult {
  activity_date: Date | null;
  activity_type: string;
  branch_id: string;
  created_at: Date | null;
  id: string;
  metadata: Json | null;
  user_id: string;
}

/** 'LogClientActivity' query type */
export interface LogClientActivityQuery {
  params: LogClientActivityParams;
  result: LogClientActivityResult;
}

const logClientActivityIR: any = {"usedParamSet":{"userId":true,"branchId":true,"activityType":true,"metadata":true},"params":[{"name":"userId","required":true,"transform":{"type":"scalar"},"locs":[{"a":99,"b":106}]},{"name":"branchId","required":true,"transform":{"type":"scalar"},"locs":[{"a":111,"b":120}]},{"name":"activityType","required":true,"transform":{"type":"scalar"},"locs":[{"a":125,"b":138}]},{"name":"metadata","required":false,"transform":{"type":"scalar"},"locs":[{"a":143,"b":151}]}],"statement":"INSERT INTO client_activity_log (\n  user_id,\n  branch_id,\n  activity_type,\n  metadata\n) VALUES (\n  :userId!,\n  :branchId!,\n  :activityType!,\n  :metadata\n)\nRETURNING *"};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO client_activity_log (
 *   user_id,
 *   branch_id,
 *   activity_type,
 *   metadata
 * ) VALUES (
 *   :userId!,
 *   :branchId!,
 *   :activityType!,
 *   :metadata
 * )
 * RETURNING *
 * ```
 */
export const logClientActivity = new PreparedQuery<LogClientActivityParams,LogClientActivityResult>(logClientActivityIR);


/** 'GetRecentClientActivity' parameters type */
export interface GetRecentClientActivityParams {
  branchId: string;
  limit?: NumberOrString | null | void;
  startDate: DateOrString;
}

/** 'GetRecentClientActivity' return type */
export interface GetRecentClientActivityResult {
  activity_date: Date | null;
  activity_type: string;
  branch_id: string;
  created_at: Date | null;
  email: string;
  first_name: string | null;
  id: string;
  last_name: string | null;
  metadata: Json | null;
  user_id: string;
}

/** 'GetRecentClientActivity' query type */
export interface GetRecentClientActivityQuery {
  params: GetRecentClientActivityParams;
  result: GetRecentClientActivityResult;
}

const getRecentClientActivityIR: any = {"usedParamSet":{"branchId":true,"startDate":true,"limit":true},"params":[{"name":"branchId","required":true,"transform":{"type":"scalar"},"locs":[{"a":144,"b":153}]},{"name":"startDate","required":true,"transform":{"type":"scalar"},"locs":[{"a":182,"b":192}]},{"name":"limit","required":false,"transform":{"type":"scalar"},"locs":[{"a":232,"b":237}]}],"statement":"SELECT\n  cal.*,\n  u.first_name,\n  u.last_name,\n  u.email\nFROM client_activity_log cal\nJOIN \"user\" u ON cal.user_id = u.id\nWHERE cal.branch_id = :branchId!\n  AND cal.activity_date >= :startDate!\nORDER BY cal.activity_date DESC\nLIMIT :limit"};

/**
 * Query generated from SQL:
 * ```
 * SELECT
 *   cal.*,
 *   u.first_name,
 *   u.last_name,
 *   u.email
 * FROM client_activity_log cal
 * JOIN "user" u ON cal.user_id = u.id
 * WHERE cal.branch_id = :branchId!
 *   AND cal.activity_date >= :startDate!
 * ORDER BY cal.activity_date DESC
 * LIMIT :limit
 * ```
 */
export const getRecentClientActivity = new PreparedQuery<GetRecentClientActivityParams,GetRecentClientActivityResult>(getRecentClientActivityIR);


/** 'GetRevenueTrend' parameters type */
export interface GetRevenueTrendParams {
  branchId: string;
  daysBack: number;
  period: string;
}

/** 'GetRevenueTrend' return type */
export interface GetRevenueTrendResult {
  avg_transaction_value: string | null;
  period_start: Date | null;
  total_revenue: string | null;
  transaction_count: string | null;
  unique_customers: string | null;
}

/** 'GetRevenueTrend' query type */
export interface GetRevenueTrendQuery {
  params: GetRevenueTrendParams;
  result: GetRevenueTrendResult;
}

const getRevenueTrendIR: any = {"usedParamSet":{"period":true,"branchId":true,"daysBack":true},"params":[{"name":"period","required":true,"transform":{"type":"scalar"},"locs":[{"a":20,"b":27},{"a":388,"b":395}]},{"name":"branchId","required":true,"transform":{"type":"scalar"},"locs":[{"a":259,"b":268}]},{"name":"daysBack","required":true,"transform":{"type":"scalar"},"locs":[{"a":309,"b":318}]}],"statement":"SELECT\n  DATE_TRUNC(:period!, p.payment_date) as period_start,\n  COUNT(DISTINCT p.user_id) as unique_customers,\n  COUNT(p.id) as transaction_count,\n  SUM(p.amount) as total_revenue,\n  AVG(p.amount) as avg_transaction_value\nFROM payments p\nWHERE p.branch_id = :branchId!\n  AND p.payment_date >= CURRENT_DATE - :daysBack! * INTERVAL '1 day'\n  AND p.status = 'completed'\nGROUP BY DATE_TRUNC(:period!, p.payment_date)\nORDER BY period_start DESC"};

/**
 * Query generated from SQL:
 * ```
 * SELECT
 *   DATE_TRUNC(:period!, p.payment_date) as period_start,
 *   COUNT(DISTINCT p.user_id) as unique_customers,
 *   COUNT(p.id) as transaction_count,
 *   SUM(p.amount) as total_revenue,
 *   AVG(p.amount) as avg_transaction_value
 * FROM payments p
 * WHERE p.branch_id = :branchId!
 *   AND p.payment_date >= CURRENT_DATE - :daysBack! * INTERVAL '1 day'
 *   AND p.status = 'completed'
 * GROUP BY DATE_TRUNC(:period!, p.payment_date)
 * ORDER BY period_start DESC
 * ```
 */
export const getRevenueTrend = new PreparedQuery<GetRevenueTrendParams,GetRevenueTrendResult>(getRevenueTrendIR);


/** 'GetClassUtilizationHeatmap' parameters type */
export interface GetClassUtilizationHeatmapParams {
  branchId: string;
  daysBack: number;
}

/** 'GetClassUtilizationHeatmap' return type */
export interface GetClassUtilizationHeatmapResult {
  avg_attendance: string | null;
  avg_utilization_rate: string | null;
  class_count: string | null;
  day_of_week: string | null;
  hour_of_day: string | null;
}

/** 'GetClassUtilizationHeatmap' query type */
export interface GetClassUtilizationHeatmapQuery {
  params: GetClassUtilizationHeatmapParams;
  result: GetClassUtilizationHeatmapResult;
}

const getClassUtilizationHeatmapIR: any = {"usedParamSet":{"branchId":true,"daysBack":true},"params":[{"name":"branchId","required":true,"transform":{"type":"scalar"},"locs":[{"a":478,"b":487}]},{"name":"daysBack","required":true,"transform":{"type":"scalar"},"locs":[{"a":528,"b":537}]}],"statement":"SELECT\n  EXTRACT(DOW FROM c.scheduled_at) as day_of_week,\n  EXTRACT(HOUR FROM c.scheduled_at) as hour_of_day,\n  COUNT(c.id) as class_count,\n  ROUND(AVG(\n    (SELECT COUNT(*) FROM bookings WHERE class_id = c.id AND status = 'confirmed')::numeric /\n    NULLIF(c.capacity, 0)\n  ) * 100, 2) as avg_utilization_rate,\n  ROUND(AVG(\n    (SELECT COUNT(*) FROM bookings WHERE class_id = c.id AND status = 'confirmed')::numeric\n  ), 2) as avg_attendance\nFROM classes c\nWHERE c.branch_id = :branchId!\n  AND c.scheduled_at >= CURRENT_DATE - :daysBack! * INTERVAL '1 day'\n  AND c.scheduled_at < CURRENT_DATE\nGROUP BY EXTRACT(DOW FROM c.scheduled_at), EXTRACT(HOUR FROM c.scheduled_at)\nORDER BY day_of_week, hour_of_day"};

/**
 * Query generated from SQL:
 * ```
 * SELECT
 *   EXTRACT(DOW FROM c.scheduled_at) as day_of_week,
 *   EXTRACT(HOUR FROM c.scheduled_at) as hour_of_day,
 *   COUNT(c.id) as class_count,
 *   ROUND(AVG(
 *     (SELECT COUNT(*) FROM bookings WHERE class_id = c.id AND status = 'confirmed')::numeric /
 *     NULLIF(c.capacity, 0)
 *   ) * 100, 2) as avg_utilization_rate,
 *   ROUND(AVG(
 *     (SELECT COUNT(*) FROM bookings WHERE class_id = c.id AND status = 'confirmed')::numeric
 *   ), 2) as avg_attendance
 * FROM classes c
 * WHERE c.branch_id = :branchId!
 *   AND c.scheduled_at >= CURRENT_DATE - :daysBack! * INTERVAL '1 day'
 *   AND c.scheduled_at < CURRENT_DATE
 * GROUP BY EXTRACT(DOW FROM c.scheduled_at), EXTRACT(HOUR FROM c.scheduled_at)
 * ORDER BY day_of_week, hour_of_day
 * ```
 */
export const getClassUtilizationHeatmap = new PreparedQuery<GetClassUtilizationHeatmapParams,GetClassUtilizationHeatmapResult>(getClassUtilizationHeatmapIR);


/** 'GetInstructorPerformance' parameters type */
export interface GetInstructorPerformanceParams {
  branchId: string;
  daysBack: number;
}

/** 'GetInstructorPerformance' return type */
export interface GetInstructorPerformanceResult {
  avg_attendance: string | null;
  avg_attendance_rate: string | null;
  avg_utilization_rate: string | null;
  instructor: string | null;
  total_bookings: string | null;
  total_classes: string | null;
}

/** 'GetInstructorPerformance' query type */
export interface GetInstructorPerformanceQuery {
  params: GetInstructorPerformanceParams;
  result: GetInstructorPerformanceResult;
}

const getInstructorPerformanceIR: any = {"usedParamSet":{"branchId":true,"daysBack":true},"params":[{"name":"branchId","required":true,"transform":{"type":"scalar"},"locs":[{"a":771,"b":780}]},{"name":"daysBack","required":true,"transform":{"type":"scalar"},"locs":[{"a":821,"b":830}]}],"statement":"SELECT\n  c.instructor,\n  COUNT(DISTINCT c.id) as total_classes,\n  COUNT(DISTINCT b.id) FILTER (WHERE b.status = 'confirmed') as total_bookings,\n  ROUND(AVG(\n    (SELECT COUNT(*) FROM bookings WHERE class_id = c.id AND status = 'confirmed')::numeric\n  ), 2) as avg_attendance,\n  ROUND(AVG(\n    (SELECT COUNT(*) FROM bookings WHERE class_id = c.id AND status = 'confirmed')::numeric /\n    NULLIF(c.capacity, 0)\n  ) * 100, 2) as avg_utilization_rate,\n  ROUND(AVG(\n    (SELECT COUNT(*) FROM attendance_records WHERE class_id = c.id AND status = 'present')::numeric /\n    NULLIF((SELECT COUNT(*) FROM bookings WHERE class_id = c.id AND status = 'confirmed'), 0)\n  ) * 100, 2) as avg_attendance_rate\nFROM classes c\nLEFT JOIN bookings b ON c.id = b.class_id\nWHERE c.branch_id = :branchId!\n  AND c.scheduled_at >= CURRENT_DATE - :daysBack! * INTERVAL '1 day'\n  AND c.scheduled_at < CURRENT_DATE\n  AND c.instructor IS NOT NULL\nGROUP BY c.instructor\nORDER BY avg_utilization_rate DESC"};

/**
 * Query generated from SQL:
 * ```
 * SELECT
 *   c.instructor,
 *   COUNT(DISTINCT c.id) as total_classes,
 *   COUNT(DISTINCT b.id) FILTER (WHERE b.status = 'confirmed') as total_bookings,
 *   ROUND(AVG(
 *     (SELECT COUNT(*) FROM bookings WHERE class_id = c.id AND status = 'confirmed')::numeric
 *   ), 2) as avg_attendance,
 *   ROUND(AVG(
 *     (SELECT COUNT(*) FROM bookings WHERE class_id = c.id AND status = 'confirmed')::numeric /
 *     NULLIF(c.capacity, 0)
 *   ) * 100, 2) as avg_utilization_rate,
 *   ROUND(AVG(
 *     (SELECT COUNT(*) FROM attendance_records WHERE class_id = c.id AND status = 'present')::numeric /
 *     NULLIF((SELECT COUNT(*) FROM bookings WHERE class_id = c.id AND status = 'confirmed'), 0)
 *   ) * 100, 2) as avg_attendance_rate
 * FROM classes c
 * LEFT JOIN bookings b ON c.id = b.class_id
 * WHERE c.branch_id = :branchId!
 *   AND c.scheduled_at >= CURRENT_DATE - :daysBack! * INTERVAL '1 day'
 *   AND c.scheduled_at < CURRENT_DATE
 *   AND c.instructor IS NOT NULL
 * GROUP BY c.instructor
 * ORDER BY avg_utilization_rate DESC
 * ```
 */
export const getInstructorPerformance = new PreparedQuery<GetInstructorPerformanceParams,GetInstructorPerformanceResult>(getInstructorPerformanceIR);


/** 'GetPeakHoursAnalysis' parameters type */
export interface GetPeakHoursAnalysisParams {
  branchId: string;
  daysBack: number;
}

/** 'GetPeakHoursAnalysis' return type */
export interface GetPeakHoursAnalysisResult {
  avg_bookings: string | null;
  avg_utilization_rate: string | null;
  fully_booked_count: string | null;
  hour_of_day: string | null;
  total_classes: string | null;
}

/** 'GetPeakHoursAnalysis' query type */
export interface GetPeakHoursAnalysisQuery {
  params: GetPeakHoursAnalysisParams;
  result: GetPeakHoursAnalysisResult;
}

const getPeakHoursAnalysisIR: any = {"usedParamSet":{"branchId":true,"daysBack":true},"params":[{"name":"branchId","required":true,"transform":{"type":"scalar"},"locs":[{"a":589,"b":598}]},{"name":"daysBack","required":true,"transform":{"type":"scalar"},"locs":[{"a":639,"b":648}]}],"statement":"SELECT\n  EXTRACT(HOUR FROM c.scheduled_at) as hour_of_day,\n  COUNT(c.id) as total_classes,\n  ROUND(AVG(\n    (SELECT COUNT(*) FROM bookings WHERE class_id = c.id AND status = 'confirmed')::numeric\n  ), 2) as avg_bookings,\n  ROUND(AVG(\n    (SELECT COUNT(*) FROM bookings WHERE class_id = c.id AND status = 'confirmed')::numeric /\n    NULLIF(c.capacity, 0)\n  ) * 100, 2) as avg_utilization_rate,\n  COUNT(DISTINCT c.id) FILTER (\n    WHERE (SELECT COUNT(*) FROM bookings WHERE class_id = c.id AND status = 'confirmed') >= c.capacity\n  ) as fully_booked_count\nFROM classes c\nWHERE c.branch_id = :branchId!\n  AND c.scheduled_at >= CURRENT_DATE - :daysBack! * INTERVAL '1 day'\n  AND c.scheduled_at < CURRENT_DATE\nGROUP BY EXTRACT(HOUR FROM c.scheduled_at)\nORDER BY hour_of_day"};

/**
 * Query generated from SQL:
 * ```
 * SELECT
 *   EXTRACT(HOUR FROM c.scheduled_at) as hour_of_day,
 *   COUNT(c.id) as total_classes,
 *   ROUND(AVG(
 *     (SELECT COUNT(*) FROM bookings WHERE class_id = c.id AND status = 'confirmed')::numeric
 *   ), 2) as avg_bookings,
 *   ROUND(AVG(
 *     (SELECT COUNT(*) FROM bookings WHERE class_id = c.id AND status = 'confirmed')::numeric /
 *     NULLIF(c.capacity, 0)
 *   ) * 100, 2) as avg_utilization_rate,
 *   COUNT(DISTINCT c.id) FILTER (
 *     WHERE (SELECT COUNT(*) FROM bookings WHERE class_id = c.id AND status = 'confirmed') >= c.capacity
 *   ) as fully_booked_count
 * FROM classes c
 * WHERE c.branch_id = :branchId!
 *   AND c.scheduled_at >= CURRENT_DATE - :daysBack! * INTERVAL '1 day'
 *   AND c.scheduled_at < CURRENT_DATE
 * GROUP BY EXTRACT(HOUR FROM c.scheduled_at)
 * ORDER BY hour_of_day
 * ```
 */
export const getPeakHoursAnalysis = new PreparedQuery<GetPeakHoursAnalysisParams,GetPeakHoursAnalysisResult>(getPeakHoursAnalysisIR);


/** 'GetClientLifetimeValue' parameters type */
export interface GetClientLifetimeValueParams {
  branchId: string;
  limit?: NumberOrString | null | void;
}

/** 'GetClientLifetimeValue' return type */
export interface GetClientLifetimeValueResult {
  avg_transaction_value: string | null;
  email: string;
  first_name: string | null;
  first_payment_date: Date | null;
  last_name: string | null;
  last_payment_date: Date | null;
  lifetime_value: string | null;
  monthly_value: string | null;
  total_classes_attended: string | null;
  total_transactions: string | null;
  user_id: string;
}

/** 'GetClientLifetimeValue' query type */
export interface GetClientLifetimeValueQuery {
  params: GetClientLifetimeValueParams;
  result: GetClientLifetimeValueResult;
}

const getClientLifetimeValueIR: any = {"usedParamSet":{"branchId":true,"limit":true},"params":[{"name":"branchId","required":true,"transform":{"type":"scalar"},"locs":[{"a":693,"b":702}]},{"name":"limit","required":false,"transform":{"type":"scalar"},"locs":[{"a":871,"b":876}]}],"statement":"SELECT\n  u.id as user_id,\n  u.first_name,\n  u.last_name,\n  u.email,\n  MIN(p.payment_date) as first_payment_date,\n  MAX(p.payment_date) as last_payment_date,\n  COUNT(DISTINCT p.id) as total_transactions,\n  SUM(p.amount) as lifetime_value,\n  AVG(p.amount) as avg_transaction_value,\n  COUNT(DISTINCT b.id) FILTER (WHERE b.status = 'confirmed') as total_classes_attended,\n  ROUND(\n    SUM(p.amount) / NULLIF(\n      EXTRACT(EPOCH FROM (MAX(p.payment_date)::timestamp - MIN(p.payment_date)::timestamp)) / 2592000,\n      0\n    ),\n    2\n  ) as monthly_value\nFROM \"user\" u\nLEFT JOIN payments p ON u.id = p.user_id AND p.status = 'completed'\nLEFT JOIN bookings b ON u.id = b.user_id\nWHERE u.branch_id = :branchId!\n  AND u.role = 'client'\n  AND p.payment_date IS NOT NULL\nGROUP BY u.id, u.first_name, u.last_name, u.email\nHAVING SUM(p.amount) > 0\nORDER BY lifetime_value DESC\nLIMIT :limit"};

/**
 * Query generated from SQL:
 * ```
 * SELECT
 *   u.id as user_id,
 *   u.first_name,
 *   u.last_name,
 *   u.email,
 *   MIN(p.payment_date) as first_payment_date,
 *   MAX(p.payment_date) as last_payment_date,
 *   COUNT(DISTINCT p.id) as total_transactions,
 *   SUM(p.amount) as lifetime_value,
 *   AVG(p.amount) as avg_transaction_value,
 *   COUNT(DISTINCT b.id) FILTER (WHERE b.status = 'confirmed') as total_classes_attended,
 *   ROUND(
 *     SUM(p.amount) / NULLIF(
 *       EXTRACT(EPOCH FROM (MAX(p.payment_date)::timestamp - MIN(p.payment_date)::timestamp)) / 2592000,
 *       0
 *     ),
 *     2
 *   ) as monthly_value
 * FROM "user" u
 * LEFT JOIN payments p ON u.id = p.user_id AND p.status = 'completed'
 * LEFT JOIN bookings b ON u.id = b.user_id
 * WHERE u.branch_id = :branchId!
 *   AND u.role = 'client'
 *   AND p.payment_date IS NOT NULL
 * GROUP BY u.id, u.first_name, u.last_name, u.email
 * HAVING SUM(p.amount) > 0
 * ORDER BY lifetime_value DESC
 * LIMIT :limit
 * ```
 */
export const getClientLifetimeValue = new PreparedQuery<GetClientLifetimeValueParams,GetClientLifetimeValueResult>(getClientLifetimeValueIR);


/** 'RefreshAnalyticsViews' parameters type */
export type RefreshAnalyticsViewsParams = void;

/** 'RefreshAnalyticsViews' return type */
export interface RefreshAnalyticsViewsResult {
  refreshed: undefined | null;
}

/** 'RefreshAnalyticsViews' query type */
export interface RefreshAnalyticsViewsQuery {
  params: RefreshAnalyticsViewsParams;
  result: RefreshAnalyticsViewsResult;
}

const refreshAnalyticsViewsIR: any = {"usedParamSet":{},"params":[],"statement":"SELECT refresh_analytics_views() as refreshed"};

/**
 * Query generated from SQL:
 * ```
 * SELECT refresh_analytics_views() as refreshed
 * ```
 */
export const refreshAnalyticsViews = new PreparedQuery<RefreshAnalyticsViewsParams,RefreshAnalyticsViewsResult>(refreshAnalyticsViewsIR);


