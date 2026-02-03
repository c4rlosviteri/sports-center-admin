/** Types generated for queries found in "src/db/queries/dashboard.sql" */
import { PreparedQuery } from '@pgtyped/runtime';

export type booking_status = 'cancelled' | 'confirmed' | 'waitlisted';

export type stringArray = (string)[];

/** 'GetUserActivePackage' parameters type */
export interface GetUserActivePackageParams {
  userId: string;
}

/** 'GetUserActivePackage' return type */
export interface GetUserActivePackageResult {
  activated_at: Date | null;
  branch_id: string;
  class_count: number;
  classes_remaining: number;
  created_at: Date | null;
  expires_at: Date | null;
  frozen_until: Date | null;
  gift_from_user_id: string | null;
  gift_message: string | null;
  gift_redeemed_at: Date | null;
  id: string;
  is_gift: boolean | null;
  package_description: string | null;
  package_name: string;
  package_template_id: string;
  payment_id: string | null;
  purchase_price: string;
  purchased_at: Date | null;
  refund_amount: string | null;
  refund_reason: string | null;
  refunded_at: Date | null;
  shared_with_user_ids: stringArray | null;
  status: string | null;
  total_classes: number;
  updated_at: Date | null;
  user_id: string;
  validity_period: number | null;
  validity_type: string;
}

/** 'GetUserActivePackage' query type */
export interface GetUserActivePackageQuery {
  params: GetUserActivePackageParams;
  result: GetUserActivePackageResult;
}

const getUserActivePackageIR: any = {"usedParamSet":{"userId":true},"params":[{"name":"userId","required":true,"transform":{"type":"scalar"},"locs":[{"a":272,"b":279}]}],"statement":"SELECT\n  ucp.*,\n  cpt.name as package_name,\n  cpt.description as package_description,\n  cpt.validity_type,\n  cpt.validity_period,\n  cpt.class_count\nFROM user_class_packages ucp\nINNER JOIN class_package_templates cpt ON ucp.package_template_id = cpt.id\nWHERE ucp.user_id = :userId!\n  AND ucp.status = 'active'\n  AND (ucp.expires_at IS NULL OR ucp.expires_at > NOW())\nORDER BY ucp.purchased_at DESC\nLIMIT 1"};

/**
 * Query generated from SQL:
 * ```
 * SELECT
 *   ucp.*,
 *   cpt.name as package_name,
 *   cpt.description as package_description,
 *   cpt.validity_type,
 *   cpt.validity_period,
 *   cpt.class_count
 * FROM user_class_packages ucp
 * INNER JOIN class_package_templates cpt ON ucp.package_template_id = cpt.id
 * WHERE ucp.user_id = :userId!
 *   AND ucp.status = 'active'
 *   AND (ucp.expires_at IS NULL OR ucp.expires_at > NOW())
 * ORDER BY ucp.purchased_at DESC
 * LIMIT 1
 * ```
 */
export const getUserActivePackage = new PreparedQuery<GetUserActivePackageParams,GetUserActivePackageResult>(getUserActivePackageIR);


/** 'GetUserBookings' parameters type */
export interface GetUserBookingsParams {
  userId: string;
}

/** 'GetUserBookings' return type */
export interface GetUserBookingsResult {
  booked_at: Date | null;
  cancelled_at: Date | null;
  class_id: string;
  class_name: string;
  created_at: Date | null;
  duration_minutes: number;
  id: string;
  instructor_name: string | null;
  package_id: string | null;
  scheduled_at: Date | null;
  status: booking_status;
  updated_at: Date | null;
  user_id: string;
  waitlist_position: number | null;
}

/** 'GetUserBookings' query type */
export interface GetUserBookingsQuery {
  params: GetUserBookingsParams;
  result: GetUserBookingsResult;
}

const getUserBookingsIR: any = {"usedParamSet":{"userId":true},"params":[{"name":"userId","required":true,"transform":{"type":"scalar"},"locs":[{"a":383,"b":390}]}],"statement":"SELECT\n  b.id,\n  b.user_id,\n  b.class_id,\n  b.package_id,\n  b.status,\n  b.waitlist_position,\n  b.booked_at,\n  b.cancelled_at,\n  b.created_at,\n  b.updated_at,\n  c.name as class_name,\n  c.instructor as instructor_name,\n  (c.scheduled_at AT TIME ZONE 'America/Guayaquil') as scheduled_at,\n  c.duration_minutes\nFROM bookings b\nINNER JOIN classes c ON b.class_id = c.id\nWHERE b.user_id = :userId!\n  AND c.scheduled_at >= NOW() - INTERVAL '30 days'\nORDER BY c.scheduled_at DESC"};

/**
 * Query generated from SQL:
 * ```
 * SELECT
 *   b.id,
 *   b.user_id,
 *   b.class_id,
 *   b.package_id,
 *   b.status,
 *   b.waitlist_position,
 *   b.booked_at,
 *   b.cancelled_at,
 *   b.created_at,
 *   b.updated_at,
 *   c.name as class_name,
 *   c.instructor as instructor_name,
 *   (c.scheduled_at AT TIME ZONE 'America/Guayaquil') as scheduled_at,
 *   c.duration_minutes
 * FROM bookings b
 * INNER JOIN classes c ON b.class_id = c.id
 * WHERE b.user_id = :userId!
 *   AND c.scheduled_at >= NOW() - INTERVAL '30 days'
 * ORDER BY c.scheduled_at DESC
 * ```
 */
export const getUserBookings = new PreparedQuery<GetUserBookingsParams,GetUserBookingsResult>(getUserBookingsIR);


/** 'GetTotalClients' parameters type */
export interface GetTotalClientsParams {
  branchId: string;
}

/** 'GetTotalClients' return type */
export interface GetTotalClientsResult {
  count: string | null;
}

/** 'GetTotalClients' query type */
export interface GetTotalClientsQuery {
  params: GetTotalClientsParams;
  result: GetTotalClientsResult;
}

const getTotalClientsIR: any = {"usedParamSet":{"branchId":true},"params":[{"name":"branchId","required":true,"transform":{"type":"scalar"},"locs":[{"a":55,"b":64}]}],"statement":"SELECT COUNT(*) as count\nFROM \"user\"\nWHERE branch_id = :branchId!\n  AND role = 'client'"};

/**
 * Query generated from SQL:
 * ```
 * SELECT COUNT(*) as count
 * FROM "user"
 * WHERE branch_id = :branchId!
 *   AND role = 'client'
 * ```
 */
export const getTotalClients = new PreparedQuery<GetTotalClientsParams,GetTotalClientsResult>(getTotalClientsIR);


/** 'GetTodayClassesCount' parameters type */
export interface GetTodayClassesCountParams {
  branchId: string;
}

/** 'GetTodayClassesCount' return type */
export interface GetTodayClassesCountResult {
  count: string | null;
}

/** 'GetTodayClassesCount' query type */
export interface GetTodayClassesCountQuery {
  params: GetTodayClassesCountParams;
  result: GetTodayClassesCountResult;
}

const getTodayClassesCountIR: any = {"usedParamSet":{"branchId":true},"params":[{"name":"branchId","required":true,"transform":{"type":"scalar"},"locs":[{"a":56,"b":65}]}],"statement":"SELECT COUNT(*) as count\nFROM classes\nWHERE branch_id = :branchId!\n  AND DATE(scheduled_at AT TIME ZONE 'America/Guayaquil') = CURRENT_DATE"};

/**
 * Query generated from SQL:
 * ```
 * SELECT COUNT(*) as count
 * FROM classes
 * WHERE branch_id = :branchId!
 *   AND DATE(scheduled_at AT TIME ZONE 'America/Guayaquil') = CURRENT_DATE
 * ```
 */
export const getTodayClassesCount = new PreparedQuery<GetTodayClassesCountParams,GetTodayClassesCountResult>(getTodayClassesCountIR);


/** 'GetMonthlyRevenue' parameters type */
export interface GetMonthlyRevenueParams {
  branchId: string;
}

/** 'GetMonthlyRevenue' return type */
export interface GetMonthlyRevenueResult {
  total: string | null;
}

/** 'GetMonthlyRevenue' query type */
export interface GetMonthlyRevenueQuery {
  params: GetMonthlyRevenueParams;
  result: GetMonthlyRevenueResult;
}

const getMonthlyRevenueIR: any = {"usedParamSet":{"branchId":true},"params":[{"name":"branchId","required":true,"transform":{"type":"scalar"},"locs":[{"a":113,"b":122}]}],"statement":"SELECT COALESCE(SUM(p.amount), 0) as total\nFROM payments p\nJOIN \"user\" u ON p.user_id = u.id\nWHERE u.branch_id = :branchId!\n  AND DATE_TRUNC('month', p.payment_date) = DATE_TRUNC('month', CURRENT_DATE)"};

/**
 * Query generated from SQL:
 * ```
 * SELECT COALESCE(SUM(p.amount), 0) as total
 * FROM payments p
 * JOIN "user" u ON p.user_id = u.id
 * WHERE u.branch_id = :branchId!
 *   AND DATE_TRUNC('month', p.payment_date) = DATE_TRUNC('month', CURRENT_DATE)
 * ```
 */
export const getMonthlyRevenue = new PreparedQuery<GetMonthlyRevenueParams,GetMonthlyRevenueResult>(getMonthlyRevenueIR);


/** 'GetUpcomingClasses' parameters type */
export interface GetUpcomingClassesParams {
  branchId: string;
}

/** 'GetUpcomingClasses' return type */
export interface GetUpcomingClassesResult {
  bookings_count: string | null;
  capacity: number;
  id: string;
  scheduled_at: Date;
}

/** 'GetUpcomingClasses' query type */
export interface GetUpcomingClassesQuery {
  params: GetUpcomingClassesParams;
  result: GetUpcomingClassesResult;
}

const getUpcomingClassesIR: any = {"usedParamSet":{"branchId":true},"params":[{"name":"branchId","required":true,"transform":{"type":"scalar"},"locs":[{"a":184,"b":193}]}],"statement":"SELECT\n  c.id,\n  c.scheduled_at,\n  c.capacity,\n  COUNT(b.id) as bookings_count\nFROM classes c\nLEFT JOIN bookings b ON c.id = b.class_id AND b.status != 'cancelled'\nWHERE c.branch_id = :branchId!\n  AND DATE(c.scheduled_at AT TIME ZONE 'America/Guayaquil') BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '7 days'\nGROUP BY c.id, c.scheduled_at, c.capacity\nORDER BY c.scheduled_at ASC\nLIMIT 5"};

/**
 * Query generated from SQL:
 * ```
 * SELECT
 *   c.id,
 *   c.scheduled_at,
 *   c.capacity,
 *   COUNT(b.id) as bookings_count
 * FROM classes c
 * LEFT JOIN bookings b ON c.id = b.class_id AND b.status != 'cancelled'
 * WHERE c.branch_id = :branchId!
 *   AND DATE(c.scheduled_at AT TIME ZONE 'America/Guayaquil') BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '7 days'
 * GROUP BY c.id, c.scheduled_at, c.capacity
 * ORDER BY c.scheduled_at ASC
 * LIMIT 5
 * ```
 */
export const getUpcomingClasses = new PreparedQuery<GetUpcomingClassesParams,GetUpcomingClassesResult>(getUpcomingClassesIR);


/** 'GetRecentBookings' parameters type */
export interface GetRecentBookingsParams {
  branchId: string;
}

/** 'GetRecentBookings' return type */
export interface GetRecentBookingsResult {
  created_at: Date | null;
  first_name: string | null;
  id: string;
  last_name: string | null;
  scheduled_at: Date;
  status: booking_status;
}

/** 'GetRecentBookings' query type */
export interface GetRecentBookingsQuery {
  params: GetRecentBookingsParams;
  result: GetRecentBookingsResult;
}

const getRecentBookingsIR: any = {"usedParamSet":{"branchId":true},"params":[{"name":"branchId","required":true,"transform":{"type":"scalar"},"locs":[{"a":197,"b":206}]}],"statement":"SELECT\n  b.id,\n  b.status,\n  b.created_at,\n  u.first_name,\n  u.last_name,\n  c.scheduled_at\nFROM bookings b\nJOIN \"user\" u ON b.user_id = u.id\nJOIN classes c ON b.class_id = c.id\nWHERE u.branch_id = :branchId!\nORDER BY b.created_at DESC\nLIMIT 5"};

/**
 * Query generated from SQL:
 * ```
 * SELECT
 *   b.id,
 *   b.status,
 *   b.created_at,
 *   u.first_name,
 *   u.last_name,
 *   c.scheduled_at
 * FROM bookings b
 * JOIN "user" u ON b.user_id = u.id
 * JOIN classes c ON b.class_id = c.id
 * WHERE u.branch_id = :branchId!
 * ORDER BY b.created_at DESC
 * LIMIT 5
 * ```
 */
export const getRecentBookings = new PreparedQuery<GetRecentBookingsParams,GetRecentBookingsResult>(getRecentBookingsIR);


/** 'GetActivePackagesCount' parameters type */
export interface GetActivePackagesCountParams {
  branchId: string;
}

/** 'GetActivePackagesCount' return type */
export interface GetActivePackagesCountResult {
  count: string | null;
}

/** 'GetActivePackagesCount' query type */
export interface GetActivePackagesCountQuery {
  params: GetActivePackagesCountParams;
  result: GetActivePackagesCountResult;
}

const getActivePackagesCountIR: any = {"usedParamSet":{"branchId":true},"params":[{"name":"branchId","required":true,"transform":{"type":"scalar"},"locs":[{"a":110,"b":119}]}],"statement":"SELECT COUNT(*) as count\nFROM user_class_packages ucp\nJOIN \"user\" u ON ucp.user_id = u.id\nWHERE u.branch_id = :branchId!\n  AND ucp.status = 'active'\n  AND ucp.classes_remaining > 0\n  AND (ucp.expires_at IS NULL OR ucp.expires_at > CURRENT_TIMESTAMP)"};

/**
 * Query generated from SQL:
 * ```
 * SELECT COUNT(*) as count
 * FROM user_class_packages ucp
 * JOIN "user" u ON ucp.user_id = u.id
 * WHERE u.branch_id = :branchId!
 *   AND ucp.status = 'active'
 *   AND ucp.classes_remaining > 0
 *   AND (ucp.expires_at IS NULL OR ucp.expires_at > CURRENT_TIMESTAMP)
 * ```
 */
export const getActivePackagesCount = new PreparedQuery<GetActivePackagesCountParams,GetActivePackagesCountResult>(getActivePackagesCountIR);


/** 'GetExpiringPackages' parameters type */
export interface GetExpiringPackagesParams {
  branchId: string;
}

/** 'GetExpiringPackages' return type */
export interface GetExpiringPackagesResult {
  classes_remaining: number;
  email: string;
  expires_at: Date | null;
  first_name: string | null;
  id: string;
  last_name: string | null;
  package_name: string;
}

/** 'GetExpiringPackages' query type */
export interface GetExpiringPackagesQuery {
  params: GetExpiringPackagesParams;
  result: GetExpiringPackagesResult;
}

const getExpiringPackagesIR: any = {"usedParamSet":{"branchId":true},"params":[{"name":"branchId","required":true,"transform":{"type":"scalar"},"locs":[{"a":283,"b":292}]}],"statement":"SELECT\n  ucp.id,\n  ucp.expires_at,\n  ucp.classes_remaining,\n  u.first_name,\n  u.last_name,\n  u.email,\n  cpt.name as package_name\nFROM user_class_packages ucp\nJOIN \"user\" u ON ucp.user_id = u.id\nJOIN class_package_templates cpt ON ucp.package_template_id = cpt.id\nWHERE u.branch_id = :branchId!\n  AND ucp.status = 'active'\n  AND ucp.expires_at IS NOT NULL\n  AND ucp.expires_at BETWEEN CURRENT_TIMESTAMP AND CURRENT_TIMESTAMP + INTERVAL '7 days'\n  AND ucp.classes_remaining > 0\nORDER BY ucp.expires_at ASC\nLIMIT 5"};

/**
 * Query generated from SQL:
 * ```
 * SELECT
 *   ucp.id,
 *   ucp.expires_at,
 *   ucp.classes_remaining,
 *   u.first_name,
 *   u.last_name,
 *   u.email,
 *   cpt.name as package_name
 * FROM user_class_packages ucp
 * JOIN "user" u ON ucp.user_id = u.id
 * JOIN class_package_templates cpt ON ucp.package_template_id = cpt.id
 * WHERE u.branch_id = :branchId!
 *   AND ucp.status = 'active'
 *   AND ucp.expires_at IS NOT NULL
 *   AND ucp.expires_at BETWEEN CURRENT_TIMESTAMP AND CURRENT_TIMESTAMP + INTERVAL '7 days'
 *   AND ucp.classes_remaining > 0
 * ORDER BY ucp.expires_at ASC
 * LIMIT 5
 * ```
 */
export const getExpiringPackages = new PreparedQuery<GetExpiringPackagesParams,GetExpiringPackagesResult>(getExpiringPackagesIR);


