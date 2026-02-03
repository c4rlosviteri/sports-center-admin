/** Types generated for queries found in "src/db/queries/bookings.sql" */
import { PreparedQuery } from '@pgtyped/runtime';

export type booking_status = 'cancelled' | 'confirmed' | 'waitlisted';

/** 'GetClassBookings' parameters type */
export interface GetClassBookingsParams {
  classId: string;
}

/** 'GetClassBookings' return type */
export interface GetClassBookingsResult {
  booked_at: Date | null;
  email: string;
  first_name: string | null;
  id: string;
  last_name: string | null;
  phone: string | null;
  status: booking_status;
  waitlist_position: number | null;
}

/** 'GetClassBookings' query type */
export interface GetClassBookingsQuery {
  params: GetClassBookingsParams;
  result: GetClassBookingsResult;
}

const getClassBookingsIR: any = {"usedParamSet":{"classId":true},"params":[{"name":"classId","required":true,"transform":{"type":"scalar"},"locs":[{"a":186,"b":194}]}],"statement":"SELECT\n  b.id,\n  b.status,\n  b.waitlist_position,\n  b.booked_at,\n  u.first_name,\n  u.last_name,\n  u.email,\n  u.phone\nFROM bookings b\nJOIN \"user\" u ON b.user_id = u.id\nWHERE b.class_id = :classId!\n  AND b.status IN ('confirmed', 'waitlisted')\nORDER BY\n  CASE WHEN b.status = 'confirmed' THEN 0 ELSE 1 END,\n  b.waitlist_position NULLS LAST,\n  b.booked_at"};

/**
 * Query generated from SQL:
 * ```
 * SELECT
 *   b.id,
 *   b.status,
 *   b.waitlist_position,
 *   b.booked_at,
 *   u.first_name,
 *   u.last_name,
 *   u.email,
 *   u.phone
 * FROM bookings b
 * JOIN "user" u ON b.user_id = u.id
 * WHERE b.class_id = :classId!
 *   AND b.status IN ('confirmed', 'waitlisted')
 * ORDER BY
 *   CASE WHEN b.status = 'confirmed' THEN 0 ELSE 1 END,
 *   b.waitlist_position NULLS LAST,
 *   b.booked_at
 * ```
 */
export const getClassBookings = new PreparedQuery<GetClassBookingsParams,GetClassBookingsResult>(getClassBookingsIR);


/** 'GetBookingDetails' parameters type */
export interface GetBookingDetailsParams {
  bookingId: string;
}

/** 'GetBookingDetails' return type */
export interface GetBookingDetailsResult {
  branch_id: string;
  class_id: string;
  package_id: string | null;
  scheduled_at: Date;
  status: booking_status;
}

/** 'GetBookingDetails' query type */
export interface GetBookingDetailsQuery {
  params: GetBookingDetailsParams;
  result: GetBookingDetailsResult;
}

const getBookingDetailsIR: any = {"usedParamSet":{"bookingId":true},"params":[{"name":"bookingId","required":true,"transform":{"type":"scalar"},"locs":[{"a":146,"b":156}]}],"statement":"SELECT\n  b.status,\n  b.class_id,\n  b.package_id,\n  c.scheduled_at,\n  c.branch_id\nFROM bookings b\nJOIN classes c ON b.class_id = c.id\nWHERE b.id = :bookingId!"};

/**
 * Query generated from SQL:
 * ```
 * SELECT
 *   b.status,
 *   b.class_id,
 *   b.package_id,
 *   c.scheduled_at,
 *   c.branch_id
 * FROM bookings b
 * JOIN classes c ON b.class_id = c.id
 * WHERE b.id = :bookingId!
 * ```
 */
export const getBookingDetails = new PreparedQuery<GetBookingDetailsParams,GetBookingDetailsResult>(getBookingDetailsIR);


/** 'CancelBookingById' parameters type */
export interface CancelBookingByIdParams {
  bookingId: string;
}

/** 'CancelBookingById' return type */
export interface CancelBookingByIdResult {
  cancelled_at: Date | null;
  id: string;
  status: booking_status;
}

/** 'CancelBookingById' query type */
export interface CancelBookingByIdQuery {
  params: CancelBookingByIdParams;
  result: CancelBookingByIdResult;
}

const cancelBookingByIdIR: any = {"usedParamSet":{"bookingId":true},"params":[{"name":"bookingId","required":true,"transform":{"type":"scalar"},"locs":[{"a":90,"b":100}]}],"statement":"UPDATE bookings\nSET status = 'cancelled',\n    cancelled_at = CURRENT_TIMESTAMP\nWHERE id = :bookingId!\nRETURNING id, status, cancelled_at"};

/**
 * Query generated from SQL:
 * ```
 * UPDATE bookings
 * SET status = 'cancelled',
 *     cancelled_at = CURRENT_TIMESTAMP
 * WHERE id = :bookingId!
 * RETURNING id, status, cancelled_at
 * ```
 */
export const cancelBookingById = new PreparedQuery<CancelBookingByIdParams,CancelBookingByIdResult>(cancelBookingByIdIR);


/** 'GetNextWaitlistBooking' parameters type */
export interface GetNextWaitlistBookingParams {
  classId: string;
}

/** 'GetNextWaitlistBooking' return type */
export interface GetNextWaitlistBookingResult {
  id: string;
  package_id: string | null;
}

/** 'GetNextWaitlistBooking' query type */
export interface GetNextWaitlistBookingQuery {
  params: GetNextWaitlistBookingParams;
  result: GetNextWaitlistBookingResult;
}

const getNextWaitlistBookingIR: any = {"usedParamSet":{"classId":true},"params":[{"name":"classId","required":true,"transform":{"type":"scalar"},"locs":[{"a":53,"b":61}]}],"statement":"SELECT id, package_id\nFROM bookings\nWHERE class_id = :classId! AND status = 'waitlisted'\nORDER BY waitlist_position ASC\nLIMIT 1"};

/**
 * Query generated from SQL:
 * ```
 * SELECT id, package_id
 * FROM bookings
 * WHERE class_id = :classId! AND status = 'waitlisted'
 * ORDER BY waitlist_position ASC
 * LIMIT 1
 * ```
 */
export const getNextWaitlistBooking = new PreparedQuery<GetNextWaitlistBookingParams,GetNextWaitlistBookingResult>(getNextWaitlistBookingIR);


/** 'PromoteWaitlistBooking' parameters type */
export interface PromoteWaitlistBookingParams {
  bookingId: string;
}

/** 'PromoteWaitlistBooking' return type */
export interface PromoteWaitlistBookingResult {
  id: string;
  status: booking_status;
}

/** 'PromoteWaitlistBooking' query type */
export interface PromoteWaitlistBookingQuery {
  params: PromoteWaitlistBookingParams;
  result: PromoteWaitlistBookingResult;
}

const promoteWaitlistBookingIR: any = {"usedParamSet":{"bookingId":true},"params":[{"name":"bookingId","required":true,"transform":{"type":"scalar"},"locs":[{"a":82,"b":92}]}],"statement":"UPDATE bookings\nSET status = 'confirmed',\n    waitlist_position = NULL\nWHERE id = :bookingId!\nRETURNING id, status"};

/**
 * Query generated from SQL:
 * ```
 * UPDATE bookings
 * SET status = 'confirmed',
 *     waitlist_position = NULL
 * WHERE id = :bookingId!
 * RETURNING id, status
 * ```
 */
export const promoteWaitlistBooking = new PreparedQuery<PromoteWaitlistBookingParams,PromoteWaitlistBookingResult>(promoteWaitlistBookingIR);


/** 'GetPackageClassesRemaining' parameters type */
export interface GetPackageClassesRemainingParams {
  packageId: string;
}

/** 'GetPackageClassesRemaining' return type */
export interface GetPackageClassesRemainingResult {
  classes_remaining: number;
}

/** 'GetPackageClassesRemaining' query type */
export interface GetPackageClassesRemainingQuery {
  params: GetPackageClassesRemainingParams;
  result: GetPackageClassesRemainingResult;
}

const getPackageClassesRemainingIR: any = {"usedParamSet":{"packageId":true},"params":[{"name":"packageId","required":true,"transform":{"type":"scalar"},"locs":[{"a":61,"b":71}]}],"statement":"SELECT classes_remaining\nFROM user_class_packages\nWHERE id = :packageId!"};

/**
 * Query generated from SQL:
 * ```
 * SELECT classes_remaining
 * FROM user_class_packages
 * WHERE id = :packageId!
 * ```
 */
export const getPackageClassesRemaining = new PreparedQuery<GetPackageClassesRemainingParams,GetPackageClassesRemainingResult>(getPackageClassesRemainingIR);


/** 'UpdatePackageClasses' parameters type */
export interface UpdatePackageClassesParams {
  delta: number;
  packageId: string;
}

/** 'UpdatePackageClasses' return type */
export interface UpdatePackageClassesResult {
  classes_remaining: number;
}

/** 'UpdatePackageClasses' query type */
export interface UpdatePackageClassesQuery {
  params: UpdatePackageClassesParams;
  result: UpdatePackageClassesResult;
}

const updatePackageClassesIR: any = {"usedParamSet":{"delta":true,"packageId":true},"params":[{"name":"delta","required":true,"transform":{"type":"scalar"},"locs":[{"a":71,"b":77}]},{"name":"packageId","required":true,"transform":{"type":"scalar"},"locs":[{"a":90,"b":100}]}],"statement":"UPDATE user_class_packages\nSET classes_remaining = classes_remaining + :delta!\nWHERE id = :packageId!\nRETURNING classes_remaining"};

/**
 * Query generated from SQL:
 * ```
 * UPDATE user_class_packages
 * SET classes_remaining = classes_remaining + :delta!
 * WHERE id = :packageId!
 * RETURNING classes_remaining
 * ```
 */
export const updatePackageClasses = new PreparedQuery<UpdatePackageClassesParams,UpdatePackageClassesResult>(updatePackageClassesIR);


