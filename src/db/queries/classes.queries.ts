/** Types generated for queries found in "src/db/queries/classes.sql" */
import { PreparedQuery } from '@pgtyped/runtime';

export type booking_status = 'cancelled' | 'confirmed' | 'waitlisted';

export type DateOrString = Date | string;

/** 'CreateClass' parameters type */
export interface CreateClassParams {
  branchId: string;
  capacity: number;
  durationMinutes: number;
  instructor?: string | null | void;
  name: string;
  scheduledAt: DateOrString;
  waitlistCapacity: number;
}

/** 'CreateClass' return type */
export interface CreateClassResult {
  branch_id: string;
  capacity: number;
  created_at: Date | null;
  duration_minutes: number;
  id: string;
  instructor: string | null;
  name: string;
  scheduled_at: Date;
  waitlist_capacity: number;
}

/** 'CreateClass' query type */
export interface CreateClassQuery {
  params: CreateClassParams;
  result: CreateClassResult;
}

const createClassIR: any = {"usedParamSet":{"branchId":true,"name":true,"instructor":true,"scheduledAt":true,"durationMinutes":true,"capacity":true,"waitlistCapacity":true},"params":[{"name":"branchId","required":true,"transform":{"type":"scalar"},"locs":[{"a":138,"b":147}]},{"name":"name","required":true,"transform":{"type":"scalar"},"locs":[{"a":152,"b":157}]},{"name":"instructor","required":false,"transform":{"type":"scalar"},"locs":[{"a":162,"b":172}]},{"name":"scheduledAt","required":true,"transform":{"type":"scalar"},"locs":[{"a":177,"b":189}]},{"name":"durationMinutes","required":true,"transform":{"type":"scalar"},"locs":[{"a":194,"b":210}]},{"name":"capacity","required":true,"transform":{"type":"scalar"},"locs":[{"a":215,"b":224}]},{"name":"waitlistCapacity","required":true,"transform":{"type":"scalar"},"locs":[{"a":229,"b":246}]}],"statement":"INSERT INTO classes (\n  branch_id,\n  name,\n  instructor,\n  scheduled_at,\n  duration_minutes,\n  capacity,\n  waitlist_capacity\n) VALUES (\n  :branchId!,\n  :name!,\n  :instructor,\n  :scheduledAt!,\n  :durationMinutes!,\n  :capacity!,\n  :waitlistCapacity!\n) RETURNING id, branch_id, name, instructor, scheduled_at, duration_minutes, capacity, waitlist_capacity, created_at"};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO classes (
 *   branch_id,
 *   name,
 *   instructor,
 *   scheduled_at,
 *   duration_minutes,
 *   capacity,
 *   waitlist_capacity
 * ) VALUES (
 *   :branchId!,
 *   :name!,
 *   :instructor,
 *   :scheduledAt!,
 *   :durationMinutes!,
 *   :capacity!,
 *   :waitlistCapacity!
 * ) RETURNING id, branch_id, name, instructor, scheduled_at, duration_minutes, capacity, waitlist_capacity, created_at
 * ```
 */
export const createClass = new PreparedQuery<CreateClassParams,CreateClassResult>(createClassIR);


/** 'GetClassesByBranch' parameters type */
export interface GetClassesByBranchParams {
  branchId: string;
  fromDate: DateOrString;
  toDate: DateOrString;
}

/** 'GetClassesByBranch' return type */
export interface GetClassesByBranchResult {
  booked_count: string | null;
  branch_id: string;
  capacity: number;
  created_at: Date | null;
  duration_minutes: number;
  id: string;
  instructor: string | null;
  name: string;
  scheduled_at: Date;
  waitlist_capacity: number;
  waitlist_count: string | null;
}

/** 'GetClassesByBranch' query type */
export interface GetClassesByBranchQuery {
  params: GetClassesByBranchParams;
  result: GetClassesByBranchResult;
}

const getClassesByBranchIR: any = {"usedParamSet":{"branchId":true,"fromDate":true,"toDate":true},"params":[{"name":"branchId","required":true,"transform":{"type":"scalar"},"locs":[{"a":367,"b":376}]},{"name":"fromDate","required":true,"transform":{"type":"scalar"},"locs":[{"a":403,"b":412}]},{"name":"toDate","required":true,"transform":{"type":"scalar"},"locs":[{"a":438,"b":445}]}],"statement":"SELECT \n  c.id,\n  c.branch_id,\n  c.name,\n  c.instructor,\n  c.scheduled_at,\n  c.duration_minutes,\n  c.capacity,\n  c.waitlist_capacity,\n  c.created_at,\n  COUNT(b.id) FILTER (WHERE b.status = 'confirmed') as booked_count,\n  COUNT(b.id) FILTER (WHERE b.status = 'waitlisted') as waitlist_count\nFROM classes c\nLEFT JOIN bookings b ON c.id = b.class_id\nWHERE c.branch_id = :branchId! \n  AND c.scheduled_at >= :fromDate!\n  AND c.scheduled_at <= :toDate!\nGROUP BY c.id\nORDER BY c.scheduled_at ASC"};

/**
 * Query generated from SQL:
 * ```
 * SELECT 
 *   c.id,
 *   c.branch_id,
 *   c.name,
 *   c.instructor,
 *   c.scheduled_at,
 *   c.duration_minutes,
 *   c.capacity,
 *   c.waitlist_capacity,
 *   c.created_at,
 *   COUNT(b.id) FILTER (WHERE b.status = 'confirmed') as booked_count,
 *   COUNT(b.id) FILTER (WHERE b.status = 'waitlisted') as waitlist_count
 * FROM classes c
 * LEFT JOIN bookings b ON c.id = b.class_id
 * WHERE c.branch_id = :branchId! 
 *   AND c.scheduled_at >= :fromDate!
 *   AND c.scheduled_at <= :toDate!
 * GROUP BY c.id
 * ORDER BY c.scheduled_at ASC
 * ```
 */
export const getClassesByBranch = new PreparedQuery<GetClassesByBranchParams,GetClassesByBranchResult>(getClassesByBranchIR);


/** 'GetClassById' parameters type */
export interface GetClassByIdParams {
  classId: string;
}

/** 'GetClassById' return type */
export interface GetClassByIdResult {
  booked_count: string | null;
  branch_id: string;
  capacity: number;
  created_at: Date | null;
  duration_minutes: number;
  id: string;
  instructor: string | null;
  name: string;
  scheduled_at: Date;
  waitlist_capacity: number;
  waitlist_count: string | null;
}

/** 'GetClassById' query type */
export interface GetClassByIdQuery {
  params: GetClassByIdParams;
  result: GetClassByIdResult;
}

const getClassByIdIR: any = {"usedParamSet":{"classId":true},"params":[{"name":"classId","required":true,"transform":{"type":"scalar"},"locs":[{"a":360,"b":368}]}],"statement":"SELECT \n  c.id,\n  c.branch_id,\n  c.name,\n  c.instructor,\n  c.scheduled_at,\n  c.duration_minutes,\n  c.capacity,\n  c.waitlist_capacity,\n  c.created_at,\n  COUNT(b.id) FILTER (WHERE b.status = 'confirmed') as booked_count,\n  COUNT(b.id) FILTER (WHERE b.status = 'waitlisted') as waitlist_count\nFROM classes c\nLEFT JOIN bookings b ON c.id = b.class_id\nWHERE c.id = :classId!\nGROUP BY c.id"};

/**
 * Query generated from SQL:
 * ```
 * SELECT 
 *   c.id,
 *   c.branch_id,
 *   c.name,
 *   c.instructor,
 *   c.scheduled_at,
 *   c.duration_minutes,
 *   c.capacity,
 *   c.waitlist_capacity,
 *   c.created_at,
 *   COUNT(b.id) FILTER (WHERE b.status = 'confirmed') as booked_count,
 *   COUNT(b.id) FILTER (WHERE b.status = 'waitlisted') as waitlist_count
 * FROM classes c
 * LEFT JOIN bookings b ON c.id = b.class_id
 * WHERE c.id = :classId!
 * GROUP BY c.id
 * ```
 */
export const getClassById = new PreparedQuery<GetClassByIdParams,GetClassByIdResult>(getClassByIdIR);


/** 'CreateBooking' parameters type */
export interface CreateBookingParams {
  classId: string;
  packageId: string;
  status: booking_status;
  userId: string;
  waitlistPosition?: number | null | void;
}

/** 'CreateBooking' return type */
export interface CreateBookingResult {
  booked_at: Date | null;
  class_id: string;
  created_at: Date | null;
  id: string;
  package_id: string | null;
  status: booking_status;
  user_id: string;
  waitlist_position: number | null;
}

/** 'CreateBooking' query type */
export interface CreateBookingQuery {
  params: CreateBookingParams;
  result: CreateBookingResult;
}

const createBookingIR: any = {"usedParamSet":{"userId":true,"classId":true,"packageId":true,"status":true,"waitlistPosition":true},"params":[{"name":"userId","required":true,"transform":{"type":"scalar"},"locs":[{"a":103,"b":110}]},{"name":"classId","required":true,"transform":{"type":"scalar"},"locs":[{"a":115,"b":123}]},{"name":"packageId","required":true,"transform":{"type":"scalar"},"locs":[{"a":128,"b":138}]},{"name":"status","required":true,"transform":{"type":"scalar"},"locs":[{"a":143,"b":150}]},{"name":"waitlistPosition","required":false,"transform":{"type":"scalar"},"locs":[{"a":155,"b":171}]}],"statement":"INSERT INTO bookings (\n  user_id,\n  class_id,\n  package_id,\n  status,\n  waitlist_position\n) VALUES (\n  :userId!,\n  :classId!,\n  :packageId!,\n  :status!,\n  :waitlistPosition\n) RETURNING id, user_id, class_id, package_id, status, waitlist_position, booked_at, created_at"};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO bookings (
 *   user_id,
 *   class_id,
 *   package_id,
 *   status,
 *   waitlist_position
 * ) VALUES (
 *   :userId!,
 *   :classId!,
 *   :packageId!,
 *   :status!,
 *   :waitlistPosition
 * ) RETURNING id, user_id, class_id, package_id, status, waitlist_position, booked_at, created_at
 * ```
 */
export const createBooking = new PreparedQuery<CreateBookingParams,CreateBookingResult>(createBookingIR);


/** 'GetBookingsByUser' parameters type */
export interface GetBookingsByUserParams {
  packageId: string;
  userId: string;
}

/** 'GetBookingsByUser' return type */
export interface GetBookingsByUserResult {
  booked_at: Date | null;
  cancelled_at: Date | null;
  class_id: string;
  class_name: string;
  duration_minutes: number;
  id: string;
  instructor: string | null;
  package_id: string | null;
  scheduled_at: Date;
  status: booking_status;
  user_id: string;
  waitlist_position: number | null;
}

/** 'GetBookingsByUser' query type */
export interface GetBookingsByUserQuery {
  params: GetBookingsByUserParams;
  result: GetBookingsByUserResult;
}

const getBookingsByUserIR: any = {"usedParamSet":{"userId":true,"packageId":true},"params":[{"name":"userId","required":true,"transform":{"type":"scalar"},"locs":[{"a":276,"b":283}]},{"name":"packageId","required":true,"transform":{"type":"scalar"},"locs":[{"a":307,"b":317}]}],"statement":"SELECT \n  b.id,\n  b.user_id,\n  b.class_id,\n  b.package_id,\n  b.status,\n  b.waitlist_position,\n  b.booked_at,\n  b.cancelled_at,\n  c.name as class_name,\n  c.instructor,\n  c.scheduled_at,\n  c.duration_minutes\nFROM bookings b\nJOIN classes c ON b.class_id = c.id\nWHERE b.user_id = :userId! \n  AND b.package_id = :packageId!\nORDER BY c.scheduled_at ASC"};

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
 *   c.name as class_name,
 *   c.instructor,
 *   c.scheduled_at,
 *   c.duration_minutes
 * FROM bookings b
 * JOIN classes c ON b.class_id = c.id
 * WHERE b.user_id = :userId! 
 *   AND b.package_id = :packageId!
 * ORDER BY c.scheduled_at ASC
 * ```
 */
export const getBookingsByUser = new PreparedQuery<GetBookingsByUserParams,GetBookingsByUserResult>(getBookingsByUserIR);


/** 'GetBookingsByClass' parameters type */
export interface GetBookingsByClassParams {
  classId: string;
}

/** 'GetBookingsByClass' return type */
export interface GetBookingsByClassResult {
  booked_at: Date | null;
  class_id: string;
  email: string;
  first_name: string | null;
  id: string;
  last_name: string | null;
  package_id: string | null;
  status: booking_status;
  user_id: string;
  waitlist_position: number | null;
}

/** 'GetBookingsByClass' query type */
export interface GetBookingsByClassQuery {
  params: GetBookingsByClassParams;
  result: GetBookingsByClassResult;
}

const getBookingsByClassIR: any = {"usedParamSet":{"classId":true},"params":[{"name":"classId","required":true,"transform":{"type":"scalar"},"locs":[{"a":219,"b":227}]}],"statement":"SELECT \n  b.id,\n  b.user_id,\n  b.class_id,\n  b.package_id,\n  b.status,\n  b.waitlist_position,\n  b.booked_at,\n  u.first_name,\n  u.last_name,\n  u.email\nFROM bookings b\nJOIN \"user\" u ON b.user_id = u.id\nWHERE b.class_id = :classId!\n  AND b.status IN ('confirmed', 'waitlisted')\nORDER BY \n  CASE WHEN b.status = 'confirmed' THEN 0 ELSE 1 END,\n  b.waitlist_position NULLS LAST,\n  b.booked_at ASC"};

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
 *   u.first_name,
 *   u.last_name,
 *   u.email
 * FROM bookings b
 * JOIN "user" u ON b.user_id = u.id
 * WHERE b.class_id = :classId!
 *   AND b.status IN ('confirmed', 'waitlisted')
 * ORDER BY 
 *   CASE WHEN b.status = 'confirmed' THEN 0 ELSE 1 END,
 *   b.waitlist_position NULLS LAST,
 *   b.booked_at ASC
 * ```
 */
export const getBookingsByClass = new PreparedQuery<GetBookingsByClassParams,GetBookingsByClassResult>(getBookingsByClassIR);


/** 'CancelBooking' parameters type */
export interface CancelBookingParams {
  bookingId: string;
}

/** 'CancelBooking' return type */
export interface CancelBookingResult {
  cancelled_at: Date | null;
  class_id: string;
  id: string;
  status: booking_status;
  user_id: string;
}

/** 'CancelBooking' query type */
export interface CancelBookingQuery {
  params: CancelBookingParams;
  result: CancelBookingResult;
}

const cancelBookingIR: any = {"usedParamSet":{"bookingId":true},"params":[{"name":"bookingId","required":true,"transform":{"type":"scalar"},"locs":[{"a":126,"b":136}]}],"statement":"UPDATE bookings\nSET status = 'cancelled',\n    cancelled_at = CURRENT_TIMESTAMP,\n    updated_at = CURRENT_TIMESTAMP\nWHERE id = :bookingId!\nRETURNING id, user_id, class_id, status, cancelled_at"};

/**
 * Query generated from SQL:
 * ```
 * UPDATE bookings
 * SET status = 'cancelled',
 *     cancelled_at = CURRENT_TIMESTAMP,
 *     updated_at = CURRENT_TIMESTAMP
 * WHERE id = :bookingId!
 * RETURNING id, user_id, class_id, status, cancelled_at
 * ```
 */
export const cancelBooking = new PreparedQuery<CancelBookingParams,CancelBookingResult>(cancelBookingIR);


/** 'GetNextWaitlistBooking' parameters type */
export interface GetNextWaitlistBookingParams {
  classId: string;
}

/** 'GetNextWaitlistBooking' return type */
export interface GetNextWaitlistBookingResult {
  class_id: string;
  id: string;
  package_id: string | null;
  user_id: string;
  waitlist_position: number | null;
}

/** 'GetNextWaitlistBooking' query type */
export interface GetNextWaitlistBookingQuery {
  params: GetNextWaitlistBookingParams;
  result: GetNextWaitlistBookingResult;
}

const getNextWaitlistBookingIR: any = {"usedParamSet":{"classId":true},"params":[{"name":"classId","required":true,"transform":{"type":"scalar"},"locs":[{"a":102,"b":110}]}],"statement":"SELECT \n  id,\n  user_id,\n  class_id,\n  package_id,\n  waitlist_position\nFROM bookings\nWHERE class_id = :classId! \n  AND status = 'waitlisted'\nORDER BY waitlist_position ASC\nLIMIT 1"};

/**
 * Query generated from SQL:
 * ```
 * SELECT 
 *   id,
 *   user_id,
 *   class_id,
 *   package_id,
 *   waitlist_position
 * FROM bookings
 * WHERE class_id = :classId! 
 *   AND status = 'waitlisted'
 * ORDER BY waitlist_position ASC
 * LIMIT 1
 * ```
 */
export const getNextWaitlistBooking = new PreparedQuery<GetNextWaitlistBookingParams,GetNextWaitlistBookingResult>(getNextWaitlistBookingIR);


/** 'PromoteFromWaitlist' parameters type */
export interface PromoteFromWaitlistParams {
  bookingId: string;
}

/** 'PromoteFromWaitlist' return type */
export interface PromoteFromWaitlistResult {
  class_id: string;
  id: string;
  package_id: string | null;
  status: booking_status;
  user_id: string;
}

/** 'PromoteFromWaitlist' query type */
export interface PromoteFromWaitlistQuery {
  params: PromoteFromWaitlistParams;
  result: PromoteFromWaitlistResult;
}

const promoteFromWaitlistIR: any = {"usedParamSet":{"bookingId":true},"params":[{"name":"bookingId","required":true,"transform":{"type":"scalar"},"locs":[{"a":118,"b":128}]}],"statement":"UPDATE bookings\nSET status = 'confirmed',\n    waitlist_position = NULL,\n    updated_at = CURRENT_TIMESTAMP\nWHERE id = :bookingId!\nRETURNING id, user_id, class_id, package_id, status"};

/**
 * Query generated from SQL:
 * ```
 * UPDATE bookings
 * SET status = 'confirmed',
 *     waitlist_position = NULL,
 *     updated_at = CURRENT_TIMESTAMP
 * WHERE id = :bookingId!
 * RETURNING id, user_id, class_id, package_id, status
 * ```
 */
export const promoteFromWaitlist = new PreparedQuery<PromoteFromWaitlistParams,PromoteFromWaitlistResult>(promoteFromWaitlistIR);


/** 'GetWaitlistCount' parameters type */
export interface GetWaitlistCountParams {
  classId: string;
}

/** 'GetWaitlistCount' return type */
export interface GetWaitlistCountResult {
  count: string | null;
}

/** 'GetWaitlistCount' query type */
export interface GetWaitlistCountQuery {
  params: GetWaitlistCountParams;
  result: GetWaitlistCountResult;
}

const getWaitlistCountIR: any = {"usedParamSet":{"classId":true},"params":[{"name":"classId","required":true,"transform":{"type":"scalar"},"locs":[{"a":56,"b":64}]}],"statement":"SELECT COUNT(*) as count\nFROM bookings\nWHERE class_id = :classId! AND status = 'waitlisted'"};

/**
 * Query generated from SQL:
 * ```
 * SELECT COUNT(*) as count
 * FROM bookings
 * WHERE class_id = :classId! AND status = 'waitlisted'
 * ```
 */
export const getWaitlistCount = new PreparedQuery<GetWaitlistCountParams,GetWaitlistCountResult>(getWaitlistCountIR);


/** 'GetConfirmedBookingsCount' parameters type */
export interface GetConfirmedBookingsCountParams {
  classId: string;
}

/** 'GetConfirmedBookingsCount' return type */
export interface GetConfirmedBookingsCountResult {
  count: string | null;
}

/** 'GetConfirmedBookingsCount' query type */
export interface GetConfirmedBookingsCountQuery {
  params: GetConfirmedBookingsCountParams;
  result: GetConfirmedBookingsCountResult;
}

const getConfirmedBookingsCountIR: any = {"usedParamSet":{"classId":true},"params":[{"name":"classId","required":true,"transform":{"type":"scalar"},"locs":[{"a":56,"b":64}]}],"statement":"SELECT COUNT(*) as count\nFROM bookings\nWHERE class_id = :classId! AND status = 'confirmed'"};

/**
 * Query generated from SQL:
 * ```
 * SELECT COUNT(*) as count
 * FROM bookings
 * WHERE class_id = :classId! AND status = 'confirmed'
 * ```
 */
export const getConfirmedBookingsCount = new PreparedQuery<GetConfirmedBookingsCountParams,GetConfirmedBookingsCountResult>(getConfirmedBookingsCountIR);


/** 'GetClassesByDate' parameters type */
export interface GetClassesByDateParams {
  branchId: string;
  date: DateOrString;
  userId: string;
}

/** 'GetClassesByDate' return type */
export interface GetClassesByDateResult {
  branch_id: string;
  capacity: number;
  confirmed_count: number | null;
  created_at: Date | null;
  duration_minutes: number;
  id: string;
  instructor: string | null;
  name: string;
  scheduled_at: Date | null;
  user_booking_id: string | null;
  user_booking_status: booking_status | null;
  waitlist_capacity: number;
  waitlist_count: number | null;
}

/** 'GetClassesByDate' query type */
export interface GetClassesByDateQuery {
  params: GetClassesByDateParams;
  result: GetClassesByDateResult;
}

const getClassesByDateIR: any = {"usedParamSet":{"userId":true,"branchId":true,"date":true},"params":[{"name":"userId","required":true,"transform":{"type":"scalar"},"locs":[{"a":460,"b":467},{"a":585,"b":592}]},{"name":"branchId","required":true,"transform":{"type":"scalar"},"locs":[{"a":750,"b":759}]},{"name":"date","required":true,"transform":{"type":"scalar"},"locs":[{"a":828,"b":833}]}],"statement":"SELECT\n  c.id,\n  c.branch_id,\n  c.name,\n  c.instructor,\n  c.duration_minutes,\n  c.capacity,\n  c.waitlist_capacity,\n  c.created_at,\n  (c.scheduled_at AT TIME ZONE 'America/Guayaquil') as scheduled_at,\n  COUNT(DISTINCT CASE WHEN b.status = 'confirmed' THEN b.id END)::int as confirmed_count,\n  COUNT(DISTINCT CASE WHEN b.status = 'waitlisted' THEN b.id END)::int as waitlist_count,\n  (\n    SELECT status\n    FROM bookings\n    WHERE class_id = c.id AND user_id = :userId!\n    LIMIT 1\n  ) as user_booking_status,\n  (\n    SELECT id\n    FROM bookings\n    WHERE class_id = c.id AND user_id = :userId!\n    LIMIT 1\n  ) as user_booking_id\nFROM classes c\nLEFT JOIN bookings b ON c.id = b.class_id AND b.status IN ('confirmed', 'waitlisted')\nWHERE c.branch_id = :branchId!\n  AND DATE(c.scheduled_at AT TIME ZONE 'America/Guayaquil') = DATE(:date!::timestamptz AT TIME ZONE 'America/Guayaquil')\nGROUP BY c.id, c.branch_id, c.name, c.instructor, c.duration_minutes, c.capacity, c.waitlist_capacity, c.created_at, c.scheduled_at\nORDER BY c.scheduled_at"};

/**
 * Query generated from SQL:
 * ```
 * SELECT
 *   c.id,
 *   c.branch_id,
 *   c.name,
 *   c.instructor,
 *   c.duration_minutes,
 *   c.capacity,
 *   c.waitlist_capacity,
 *   c.created_at,
 *   (c.scheduled_at AT TIME ZONE 'America/Guayaquil') as scheduled_at,
 *   COUNT(DISTINCT CASE WHEN b.status = 'confirmed' THEN b.id END)::int as confirmed_count,
 *   COUNT(DISTINCT CASE WHEN b.status = 'waitlisted' THEN b.id END)::int as waitlist_count,
 *   (
 *     SELECT status
 *     FROM bookings
 *     WHERE class_id = c.id AND user_id = :userId!
 *     LIMIT 1
 *   ) as user_booking_status,
 *   (
 *     SELECT id
 *     FROM bookings
 *     WHERE class_id = c.id AND user_id = :userId!
 *     LIMIT 1
 *   ) as user_booking_id
 * FROM classes c
 * LEFT JOIN bookings b ON c.id = b.class_id AND b.status IN ('confirmed', 'waitlisted')
 * WHERE c.branch_id = :branchId!
 *   AND DATE(c.scheduled_at AT TIME ZONE 'America/Guayaquil') = DATE(:date!::timestamptz AT TIME ZONE 'America/Guayaquil')
 * GROUP BY c.id, c.branch_id, c.name, c.instructor, c.duration_minutes, c.capacity, c.waitlist_capacity, c.created_at, c.scheduled_at
 * ORDER BY c.scheduled_at
 * ```
 */
export const getClassesByDate = new PreparedQuery<GetClassesByDateParams,GetClassesByDateResult>(getClassesByDateIR);


/** 'GetClassesByMonth' parameters type */
export interface GetClassesByMonthParams {
  branchId: string;
  firstDay: DateOrString;
  lastDay: DateOrString;
  userId: string;
}

/** 'GetClassesByMonth' return type */
export interface GetClassesByMonthResult {
  branch_id: string;
  capacity: number;
  confirmed_count: number | null;
  created_at: Date | null;
  duration_minutes: number;
  id: string;
  instructor: string | null;
  name: string;
  scheduled_at: Date | null;
  user_booking_id: string | null;
  user_booking_status: booking_status | null;
  waitlist_capacity: number;
  waitlist_count: number | null;
}

/** 'GetClassesByMonth' query type */
export interface GetClassesByMonthQuery {
  params: GetClassesByMonthParams;
  result: GetClassesByMonthResult;
}

const getClassesByMonthIR: any = {"usedParamSet":{"userId":true,"branchId":true,"firstDay":true,"lastDay":true},"params":[{"name":"userId","required":true,"transform":{"type":"scalar"},"locs":[{"a":460,"b":467},{"a":585,"b":592}]},{"name":"branchId","required":true,"transform":{"type":"scalar"},"locs":[{"a":750,"b":759}]},{"name":"firstDay","required":true,"transform":{"type":"scalar"},"locs":[{"a":785,"b":794}]},{"name":"lastDay","required":true,"transform":{"type":"scalar"},"locs":[{"a":826,"b":834}]}],"statement":"SELECT\n  c.id,\n  c.branch_id,\n  c.name,\n  c.instructor,\n  c.duration_minutes,\n  c.capacity,\n  c.waitlist_capacity,\n  c.created_at,\n  (c.scheduled_at AT TIME ZONE 'America/Guayaquil') as scheduled_at,\n  COUNT(DISTINCT CASE WHEN b.status = 'confirmed' THEN b.id END)::int as confirmed_count,\n  COUNT(DISTINCT CASE WHEN b.status = 'waitlisted' THEN b.id END)::int as waitlist_count,\n  (\n    SELECT status\n    FROM bookings\n    WHERE class_id = c.id AND user_id = :userId!\n    LIMIT 1\n  ) as user_booking_status,\n  (\n    SELECT id\n    FROM bookings\n    WHERE class_id = c.id AND user_id = :userId!\n    LIMIT 1\n  ) as user_booking_id\nFROM classes c\nLEFT JOIN bookings b ON c.id = b.class_id AND b.status IN ('confirmed', 'waitlisted')\nWHERE c.branch_id = :branchId!\n  AND c.scheduled_at >= :firstDay!::date\n  AND c.scheduled_at < (:lastDay!::date + INTERVAL '1 day')\nGROUP BY c.id, c.branch_id, c.name, c.instructor, c.duration_minutes, c.capacity, c.waitlist_capacity, c.created_at, c.scheduled_at\nORDER BY c.scheduled_at"};

/**
 * Query generated from SQL:
 * ```
 * SELECT
 *   c.id,
 *   c.branch_id,
 *   c.name,
 *   c.instructor,
 *   c.duration_minutes,
 *   c.capacity,
 *   c.waitlist_capacity,
 *   c.created_at,
 *   (c.scheduled_at AT TIME ZONE 'America/Guayaquil') as scheduled_at,
 *   COUNT(DISTINCT CASE WHEN b.status = 'confirmed' THEN b.id END)::int as confirmed_count,
 *   COUNT(DISTINCT CASE WHEN b.status = 'waitlisted' THEN b.id END)::int as waitlist_count,
 *   (
 *     SELECT status
 *     FROM bookings
 *     WHERE class_id = c.id AND user_id = :userId!
 *     LIMIT 1
 *   ) as user_booking_status,
 *   (
 *     SELECT id
 *     FROM bookings
 *     WHERE class_id = c.id AND user_id = :userId!
 *     LIMIT 1
 *   ) as user_booking_id
 * FROM classes c
 * LEFT JOIN bookings b ON c.id = b.class_id AND b.status IN ('confirmed', 'waitlisted')
 * WHERE c.branch_id = :branchId!
 *   AND c.scheduled_at >= :firstDay!::date
 *   AND c.scheduled_at < (:lastDay!::date + INTERVAL '1 day')
 * GROUP BY c.id, c.branch_id, c.name, c.instructor, c.duration_minutes, c.capacity, c.waitlist_capacity, c.created_at, c.scheduled_at
 * ORDER BY c.scheduled_at
 * ```
 */
export const getClassesByMonth = new PreparedQuery<GetClassesByMonthParams,GetClassesByMonthResult>(getClassesByMonthIR);


