/** Types generated for queries found in "src/db/queries/attendance.sql" */
import { PreparedQuery } from '@pgtyped/runtime';

export type booking_status = 'cancelled' | 'confirmed' | 'waitlisted';

export type DateOrString = Date | string;

export type NumberOrString = number | string;

/** 'MarkAttendance' parameters type */
export interface MarkAttendanceParams {
  bookingId: string;
  branchId: string;
  classId: string;
  markedBy?: string | null | void;
  notes?: string | null | void;
  status: string;
  userId: string;
}

/** 'MarkAttendance' return type */
export interface MarkAttendanceResult {
  booking_id: string;
  branch_id: string;
  class_id: string;
  created_at: Date | null;
  id: string;
  marked_at: Date | null;
  marked_by: string | null;
  notes: string | null;
  status: string;
  user_id: string;
}

/** 'MarkAttendance' query type */
export interface MarkAttendanceQuery {
  params: MarkAttendanceParams;
  result: MarkAttendanceResult;
}

const markAttendanceIR: any = {"usedParamSet":{"bookingId":true,"userId":true,"classId":true,"branchId":true,"status":true,"markedBy":true,"notes":true},"params":[{"name":"bookingId","required":true,"transform":{"type":"scalar"},"locs":[{"a":127,"b":137}]},{"name":"userId","required":true,"transform":{"type":"scalar"},"locs":[{"a":142,"b":149}]},{"name":"classId","required":true,"transform":{"type":"scalar"},"locs":[{"a":154,"b":162}]},{"name":"branchId","required":true,"transform":{"type":"scalar"},"locs":[{"a":167,"b":176}]},{"name":"status","required":true,"transform":{"type":"scalar"},"locs":[{"a":181,"b":188}]},{"name":"markedBy","required":false,"transform":{"type":"scalar"},"locs":[{"a":193,"b":201}]},{"name":"notes","required":false,"transform":{"type":"scalar"},"locs":[{"a":206,"b":211}]}],"statement":"INSERT INTO attendance_records (\n  booking_id,\n  user_id,\n  class_id,\n  branch_id,\n  status,\n  marked_by,\n  notes\n) VALUES (\n  :bookingId!,\n  :userId!,\n  :classId!,\n  :branchId!,\n  :status!,\n  :markedBy,\n  :notes\n) ON CONFLICT (booking_id) DO UPDATE SET\n  status = EXCLUDED.status,\n  marked_by = EXCLUDED.marked_by,\n  marked_at = CURRENT_TIMESTAMP,\n  notes = EXCLUDED.notes\nRETURNING *"};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO attendance_records (
 *   booking_id,
 *   user_id,
 *   class_id,
 *   branch_id,
 *   status,
 *   marked_by,
 *   notes
 * ) VALUES (
 *   :bookingId!,
 *   :userId!,
 *   :classId!,
 *   :branchId!,
 *   :status!,
 *   :markedBy,
 *   :notes
 * ) ON CONFLICT (booking_id) DO UPDATE SET
 *   status = EXCLUDED.status,
 *   marked_by = EXCLUDED.marked_by,
 *   marked_at = CURRENT_TIMESTAMP,
 *   notes = EXCLUDED.notes
 * RETURNING *
 * ```
 */
export const markAttendance = new PreparedQuery<MarkAttendanceParams,MarkAttendanceResult>(markAttendanceIR);


/** 'GetAttendanceRecordsByClass' parameters type */
export interface GetAttendanceRecordsByClassParams {
  branchId: string;
  classId: string;
}

/** 'GetAttendanceRecordsByClass' return type */
export interface GetAttendanceRecordsByClassResult {
  booking_id: string;
  booking_status: booking_status;
  branch_id: string;
  class_id: string;
  created_at: Date | null;
  email: string;
  first_name: string | null;
  id: string;
  last_name: string | null;
  marked_at: Date | null;
  marked_by: string | null;
  notes: string | null;
  status: string;
  user_id: string;
}

/** 'GetAttendanceRecordsByClass' query type */
export interface GetAttendanceRecordsByClassQuery {
  params: GetAttendanceRecordsByClassParams;
  result: GetAttendanceRecordsByClassResult;
}

const getAttendanceRecordsByClassIR: any = {"usedParamSet":{"classId":true,"branchId":true},"params":[{"name":"classId","required":true,"transform":{"type":"scalar"},"locs":[{"a":208,"b":216}]},{"name":"branchId","required":true,"transform":{"type":"scalar"},"locs":[{"a":239,"b":248}]}],"statement":"SELECT\n  ar.*,\n  u.first_name,\n  u.last_name,\n  u.email,\n  b.status as booking_status\nFROM attendance_records ar\nJOIN \"user\" u ON ar.user_id = u.id\nJOIN bookings b ON ar.booking_id = b.id\nWHERE ar.class_id = :classId!\n  AND ar.branch_id = :branchId!\nORDER BY ar.marked_at DESC"};

/**
 * Query generated from SQL:
 * ```
 * SELECT
 *   ar.*,
 *   u.first_name,
 *   u.last_name,
 *   u.email,
 *   b.status as booking_status
 * FROM attendance_records ar
 * JOIN "user" u ON ar.user_id = u.id
 * JOIN bookings b ON ar.booking_id = b.id
 * WHERE ar.class_id = :classId!
 *   AND ar.branch_id = :branchId!
 * ORDER BY ar.marked_at DESC
 * ```
 */
export const getAttendanceRecordsByClass = new PreparedQuery<GetAttendanceRecordsByClassParams,GetAttendanceRecordsByClassResult>(getAttendanceRecordsByClassIR);


/** 'GetAttendanceRecordsByUser' parameters type */
export interface GetAttendanceRecordsByUserParams {
  branchId: string;
  limit?: NumberOrString | null | void;
  userId: string;
}

/** 'GetAttendanceRecordsByUser' return type */
export interface GetAttendanceRecordsByUserResult {
  booking_id: string;
  branch_id: string;
  class_id: string;
  created_at: Date | null;
  id: string;
  instructor: string | null;
  marked_at: Date | null;
  marked_by: string | null;
  notes: string | null;
  scheduled_at: Date;
  status: string;
  user_id: string;
}

/** 'GetAttendanceRecordsByUser' query type */
export interface GetAttendanceRecordsByUserQuery {
  params: GetAttendanceRecordsByUserParams;
  result: GetAttendanceRecordsByUserResult;
}

const getAttendanceRecordsByUserIR: any = {"usedParamSet":{"userId":true,"branchId":true,"limit":true},"params":[{"name":"userId","required":true,"transform":{"type":"scalar"},"locs":[{"a":131,"b":138}]},{"name":"branchId","required":true,"transform":{"type":"scalar"},"locs":[{"a":161,"b":170}]},{"name":"limit","required":false,"transform":{"type":"scalar"},"locs":[{"a":207,"b":212}]}],"statement":"SELECT\n  ar.*,\n  c.scheduled_at,\n  c.instructor\nFROM attendance_records ar\nJOIN classes c ON ar.class_id = c.id\nWHERE ar.user_id = :userId!\n  AND ar.branch_id = :branchId!\nORDER BY c.scheduled_at DESC\nLIMIT :limit"};

/**
 * Query generated from SQL:
 * ```
 * SELECT
 *   ar.*,
 *   c.scheduled_at,
 *   c.instructor
 * FROM attendance_records ar
 * JOIN classes c ON ar.class_id = c.id
 * WHERE ar.user_id = :userId!
 *   AND ar.branch_id = :branchId!
 * ORDER BY c.scheduled_at DESC
 * LIMIT :limit
 * ```
 */
export const getAttendanceRecordsByUser = new PreparedQuery<GetAttendanceRecordsByUserParams,GetAttendanceRecordsByUserResult>(getAttendanceRecordsByUserIR);


/** 'GetNoShowStats' parameters type */
export interface GetNoShowStatsParams {
  branchId: string;
  userId: string;
}

/** 'GetNoShowStats' return type */
export interface GetNoShowStatsResult {
  no_show_count: string | null;
  no_show_percentage: string | null;
  total_attended_classes: string | null;
  user_id: string;
}

/** 'GetNoShowStats' query type */
export interface GetNoShowStatsQuery {
  params: GetNoShowStatsParams;
  result: GetNoShowStatsResult;
}

const getNoShowStatsIR: any = {"usedParamSet":{"userId":true,"branchId":true},"params":[{"name":"userId","required":true,"transform":{"type":"scalar"},"locs":[{"a":285,"b":292}]},{"name":"branchId","required":true,"transform":{"type":"scalar"},"locs":[{"a":312,"b":321}]}],"statement":"SELECT\n  user_id,\n  COUNT(*) FILTER (WHERE status = 'absent') as no_show_count,\n  COUNT(*) as total_attended_classes,\n  ROUND(\n    (COUNT(*) FILTER (WHERE status = 'absent')::numeric / NULLIF(COUNT(*), 0)) * 100,\n    2\n  ) as no_show_percentage\nFROM attendance_records\nWHERE user_id = :userId!\n  AND branch_id = :branchId!\n  AND created_at >= CURRENT_TIMESTAMP - INTERVAL '90 days'\nGROUP BY user_id"};

/**
 * Query generated from SQL:
 * ```
 * SELECT
 *   user_id,
 *   COUNT(*) FILTER (WHERE status = 'absent') as no_show_count,
 *   COUNT(*) as total_attended_classes,
 *   ROUND(
 *     (COUNT(*) FILTER (WHERE status = 'absent')::numeric / NULLIF(COUNT(*), 0)) * 100,
 *     2
 *   ) as no_show_percentage
 * FROM attendance_records
 * WHERE user_id = :userId!
 *   AND branch_id = :branchId!
 *   AND created_at >= CURRENT_TIMESTAMP - INTERVAL '90 days'
 * GROUP BY user_id
 * ```
 */
export const getNoShowStats = new PreparedQuery<GetNoShowStatsParams,GetNoShowStatsResult>(getNoShowStatsIR);


/** 'CreateNoShowPenalty' parameters type */
export interface CreateNoShowPenaltyParams {
  appliedBy: string;
  branchId: string;
  noShowCount: number;
  notes?: string | null | void;
  penaltyEndDate: DateOrString;
  penaltyStartDate: DateOrString;
  penaltyType: string;
  userId: string;
}

/** 'CreateNoShowPenalty' return type */
export interface CreateNoShowPenaltyResult {
  applied_by: string | null;
  branch_id: string;
  created_at: Date | null;
  created_by: string | null;
  id: string;
  is_active: boolean | null;
  no_show_count: number | null;
  notes: string | null;
  penalty_end_date: Date | null;
  penalty_start_date: Date | null;
  penalty_type: string | null;
  updated_at: Date | null;
  user_id: string;
}

/** 'CreateNoShowPenalty' query type */
export interface CreateNoShowPenaltyQuery {
  params: CreateNoShowPenaltyParams;
  result: CreateNoShowPenaltyResult;
}

const createNoShowPenaltyIR: any = {"usedParamSet":{"userId":true,"branchId":true,"noShowCount":true,"penaltyType":true,"penaltyStartDate":true,"penaltyEndDate":true,"appliedBy":true,"notes":true},"params":[{"name":"userId","required":true,"transform":{"type":"scalar"},"locs":[{"a":166,"b":173}]},{"name":"branchId","required":true,"transform":{"type":"scalar"},"locs":[{"a":178,"b":187}]},{"name":"noShowCount","required":true,"transform":{"type":"scalar"},"locs":[{"a":192,"b":204}]},{"name":"penaltyType","required":true,"transform":{"type":"scalar"},"locs":[{"a":209,"b":221}]},{"name":"penaltyStartDate","required":true,"transform":{"type":"scalar"},"locs":[{"a":226,"b":243}]},{"name":"penaltyEndDate","required":true,"transform":{"type":"scalar"},"locs":[{"a":248,"b":263}]},{"name":"appliedBy","required":true,"transform":{"type":"scalar"},"locs":[{"a":268,"b":278}]},{"name":"notes","required":false,"transform":{"type":"scalar"},"locs":[{"a":283,"b":288}]}],"statement":"INSERT INTO no_show_penalties (\n  user_id,\n  branch_id,\n  no_show_count,\n  penalty_type,\n  penalty_start_date,\n  penalty_end_date,\n  applied_by,\n  notes\n) VALUES (\n  :userId!,\n  :branchId!,\n  :noShowCount!,\n  :penaltyType!,\n  :penaltyStartDate!,\n  :penaltyEndDate!,\n  :appliedBy!,\n  :notes\n)\nRETURNING *"};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO no_show_penalties (
 *   user_id,
 *   branch_id,
 *   no_show_count,
 *   penalty_type,
 *   penalty_start_date,
 *   penalty_end_date,
 *   applied_by,
 *   notes
 * ) VALUES (
 *   :userId!,
 *   :branchId!,
 *   :noShowCount!,
 *   :penaltyType!,
 *   :penaltyStartDate!,
 *   :penaltyEndDate!,
 *   :appliedBy!,
 *   :notes
 * )
 * RETURNING *
 * ```
 */
export const createNoShowPenalty = new PreparedQuery<CreateNoShowPenaltyParams,CreateNoShowPenaltyResult>(createNoShowPenaltyIR);


/** 'GetActivePenalties' parameters type */
export interface GetActivePenaltiesParams {
  branchId: string;
  userId: string;
}

/** 'GetActivePenalties' return type */
export interface GetActivePenaltiesResult {
  branch_id: string;
  created_at: Date | null;
  created_by: string | null;
  id: string;
  is_active: boolean | null;
  no_show_count: number | null;
  notes: string | null;
  penalty_end_date: Date | null;
  penalty_start_date: Date | null;
  penalty_type: string | null;
  updated_at: Date | null;
  user_id: string;
}

/** 'GetActivePenalties' query type */
export interface GetActivePenaltiesQuery {
  params: GetActivePenaltiesParams;
  result: GetActivePenaltiesResult;
}

const getActivePenaltiesIR: any = {"usedParamSet":{"userId":true,"branchId":true},"params":[{"name":"userId","required":true,"transform":{"type":"scalar"},"locs":[{"a":214,"b":221}]},{"name":"branchId","required":true,"transform":{"type":"scalar"},"locs":[{"a":241,"b":250}]}],"statement":"SELECT\n  id,\n  user_id,\n  branch_id,\n  no_show_count,\n  penalty_start_date,\n  penalty_end_date,\n  is_active,\n  penalty_type,\n  created_at,\n  updated_at,\n  created_by,\n  notes\nFROM no_show_penalties\nWHERE user_id = :userId!\n  AND branch_id = :branchId!\n  AND is_active = true\n  AND penalty_end_date > CURRENT_TIMESTAMP\nORDER BY penalty_start_date DESC"};

/**
 * Query generated from SQL:
 * ```
 * SELECT
 *   id,
 *   user_id,
 *   branch_id,
 *   no_show_count,
 *   penalty_start_date,
 *   penalty_end_date,
 *   is_active,
 *   penalty_type,
 *   created_at,
 *   updated_at,
 *   created_by,
 *   notes
 * FROM no_show_penalties
 * WHERE user_id = :userId!
 *   AND branch_id = :branchId!
 *   AND is_active = true
 *   AND penalty_end_date > CURRENT_TIMESTAMP
 * ORDER BY penalty_start_date DESC
 * ```
 */
export const getActivePenalties = new PreparedQuery<GetActivePenaltiesParams,GetActivePenaltiesResult>(getActivePenaltiesIR);


/** 'DeactivatePenalty' parameters type */
export interface DeactivatePenaltyParams {
  branchId: string;
  penaltyId: string;
}

/** 'DeactivatePenalty' return type */
export interface DeactivatePenaltyResult {
  applied_by: string | null;
  branch_id: string;
  created_at: Date | null;
  created_by: string | null;
  id: string;
  is_active: boolean | null;
  no_show_count: number | null;
  notes: string | null;
  penalty_end_date: Date | null;
  penalty_start_date: Date | null;
  penalty_type: string | null;
  updated_at: Date | null;
  user_id: string;
}

/** 'DeactivatePenalty' query type */
export interface DeactivatePenaltyQuery {
  params: DeactivatePenaltyParams;
  result: DeactivatePenaltyResult;
}

const deactivatePenaltyIR: any = {"usedParamSet":{"penaltyId":true,"branchId":true},"params":[{"name":"penaltyId","required":true,"transform":{"type":"scalar"},"locs":[{"a":58,"b":68}]},{"name":"branchId","required":true,"transform":{"type":"scalar"},"locs":[{"a":88,"b":97}]}],"statement":"UPDATE no_show_penalties\nSET is_active = false\nWHERE id = :penaltyId!\n  AND branch_id = :branchId!\nRETURNING *"};

/**
 * Query generated from SQL:
 * ```
 * UPDATE no_show_penalties
 * SET is_active = false
 * WHERE id = :penaltyId!
 *   AND branch_id = :branchId!
 * RETURNING *
 * ```
 */
export const deactivatePenalty = new PreparedQuery<DeactivatePenaltyParams,DeactivatePenaltyResult>(deactivatePenaltyIR);


/** 'CreateLateCancellationFee' parameters type */
export interface CreateLateCancellationFeeParams {
  bookingId: string;
  branchId: string;
  cancelledAt: DateOrString;
  classId: string;
  feeAmount: NumberOrString;
  notes?: string | null | void;
  paymentStatus: string;
  userId: string;
}

/** 'CreateLateCancellationFee' return type */
export interface CreateLateCancellationFeeResult {
  amount: string;
  booking_id: string;
  branch_id: string;
  cancellation_time: Date;
  cancelled_at: Date;
  class_id: string;
  class_time: Date;
  created_at: Date | null;
  fee_amount: string;
  hours_before_class: string | null;
  id: string;
  notes: string | null;
  paid_at: Date | null;
  payment_status: string;
  status: string | null;
  updated_at: Date | null;
  user_id: string;
  waived_by: string | null;
  waived_reason: string | null;
}

/** 'CreateLateCancellationFee' query type */
export interface CreateLateCancellationFeeQuery {
  params: CreateLateCancellationFeeParams;
  result: CreateLateCancellationFeeResult;
}

const createLateCancellationFeeIR: any = {"usedParamSet":{"bookingId":true,"userId":true,"classId":true,"branchId":true,"feeAmount":true,"cancelledAt":true,"paymentStatus":true,"notes":true},"params":[{"name":"bookingId","required":true,"transform":{"type":"scalar"},"locs":[{"a":156,"b":166}]},{"name":"userId","required":true,"transform":{"type":"scalar"},"locs":[{"a":171,"b":178}]},{"name":"classId","required":true,"transform":{"type":"scalar"},"locs":[{"a":183,"b":191}]},{"name":"branchId","required":true,"transform":{"type":"scalar"},"locs":[{"a":196,"b":205}]},{"name":"feeAmount","required":true,"transform":{"type":"scalar"},"locs":[{"a":210,"b":220}]},{"name":"cancelledAt","required":true,"transform":{"type":"scalar"},"locs":[{"a":225,"b":237}]},{"name":"paymentStatus","required":true,"transform":{"type":"scalar"},"locs":[{"a":242,"b":256}]},{"name":"notes","required":false,"transform":{"type":"scalar"},"locs":[{"a":261,"b":266}]}],"statement":"INSERT INTO late_cancellation_fees (\n  booking_id,\n  user_id,\n  class_id,\n  branch_id,\n  fee_amount,\n  cancelled_at,\n  payment_status,\n  notes\n) VALUES (\n  :bookingId!,\n  :userId!,\n  :classId!,\n  :branchId!,\n  :feeAmount!,\n  :cancelledAt!,\n  :paymentStatus!,\n  :notes\n)\nRETURNING *"};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO late_cancellation_fees (
 *   booking_id,
 *   user_id,
 *   class_id,
 *   branch_id,
 *   fee_amount,
 *   cancelled_at,
 *   payment_status,
 *   notes
 * ) VALUES (
 *   :bookingId!,
 *   :userId!,
 *   :classId!,
 *   :branchId!,
 *   :feeAmount!,
 *   :cancelledAt!,
 *   :paymentStatus!,
 *   :notes
 * )
 * RETURNING *
 * ```
 */
export const createLateCancellationFee = new PreparedQuery<CreateLateCancellationFeeParams,CreateLateCancellationFeeResult>(createLateCancellationFeeIR);


/** 'GetOutstandingFees' parameters type */
export interface GetOutstandingFeesParams {
  branchId: string;
  userId: string;
}

/** 'GetOutstandingFees' return type */
export interface GetOutstandingFeesResult {
  amount: string;
  booking_id: string;
  branch_id: string;
  cancellation_time: Date;
  cancelled_at: Date;
  class_id: string;
  class_time: Date;
  created_at: Date | null;
  fee_amount: string;
  hours_before_class: string | null;
  id: string;
  instructor: string | null;
  notes: string | null;
  paid_at: Date | null;
  payment_status: string;
  scheduled_at: Date;
  status: string | null;
  updated_at: Date | null;
  user_id: string;
  waived_by: string | null;
  waived_reason: string | null;
}

/** 'GetOutstandingFees' query type */
export interface GetOutstandingFeesQuery {
  params: GetOutstandingFeesParams;
  result: GetOutstandingFeesResult;
}

const getOutstandingFeesIR: any = {"usedParamSet":{"userId":true,"branchId":true},"params":[{"name":"userId","required":true,"transform":{"type":"scalar"},"locs":[{"a":139,"b":146}]},{"name":"branchId","required":true,"transform":{"type":"scalar"},"locs":[{"a":170,"b":179}]}],"statement":"SELECT\n  lcf.*,\n  c.scheduled_at,\n  c.instructor\nFROM late_cancellation_fees lcf\nJOIN classes c ON lcf.class_id = c.id\nWHERE lcf.user_id = :userId!\n  AND lcf.branch_id = :branchId!\n  AND lcf.payment_status = 'unpaid'\nORDER BY lcf.cancelled_at DESC"};

/**
 * Query generated from SQL:
 * ```
 * SELECT
 *   lcf.*,
 *   c.scheduled_at,
 *   c.instructor
 * FROM late_cancellation_fees lcf
 * JOIN classes c ON lcf.class_id = c.id
 * WHERE lcf.user_id = :userId!
 *   AND lcf.branch_id = :branchId!
 *   AND lcf.payment_status = 'unpaid'
 * ORDER BY lcf.cancelled_at DESC
 * ```
 */
export const getOutstandingFees = new PreparedQuery<GetOutstandingFeesParams,GetOutstandingFeesResult>(getOutstandingFeesIR);


/** 'MarkFeeAsPaid' parameters type */
export interface MarkFeeAsPaidParams {
  branchId: string;
  feeId: string;
}

/** 'MarkFeeAsPaid' return type */
export interface MarkFeeAsPaidResult {
  amount: string;
  booking_id: string;
  branch_id: string;
  cancellation_time: Date;
  cancelled_at: Date;
  class_id: string;
  class_time: Date;
  created_at: Date | null;
  fee_amount: string;
  hours_before_class: string | null;
  id: string;
  notes: string | null;
  paid_at: Date | null;
  payment_status: string;
  status: string | null;
  updated_at: Date | null;
  user_id: string;
  waived_by: string | null;
  waived_reason: string | null;
}

/** 'MarkFeeAsPaid' query type */
export interface MarkFeeAsPaidQuery {
  params: MarkFeeAsPaidParams;
  result: MarkFeeAsPaidResult;
}

const markFeeAsPaidIR: any = {"usedParamSet":{"feeId":true,"branchId":true},"params":[{"name":"feeId","required":true,"transform":{"type":"scalar"},"locs":[{"a":102,"b":108}]},{"name":"branchId","required":true,"transform":{"type":"scalar"},"locs":[{"a":128,"b":137}]}],"statement":"UPDATE late_cancellation_fees\nSET payment_status = 'paid',\n    paid_at = CURRENT_TIMESTAMP\nWHERE id = :feeId!\n  AND branch_id = :branchId!\nRETURNING *"};

/**
 * Query generated from SQL:
 * ```
 * UPDATE late_cancellation_fees
 * SET payment_status = 'paid',
 *     paid_at = CURRENT_TIMESTAMP
 * WHERE id = :feeId!
 *   AND branch_id = :branchId!
 * RETURNING *
 * ```
 */
export const markFeeAsPaid = new PreparedQuery<MarkFeeAsPaidParams,MarkFeeAsPaidResult>(markFeeAsPaidIR);


/** 'GetClassAttendanceSummary' parameters type */
export interface GetClassAttendanceSummaryParams {
  branchId: string;
  endDate: DateOrString;
  startDate: DateOrString;
}

/** 'GetClassAttendanceSummary' return type */
export interface GetClassAttendanceSummaryResult {
  absent_count: string | null;
  attendance_rate: string | null;
  capacity: number;
  class_id: string;
  instructor: string | null;
  late_count: string | null;
  present_count: string | null;
  scheduled_at: Date;
  total_bookings: string | null;
}

/** 'GetClassAttendanceSummary' query type */
export interface GetClassAttendanceSummaryQuery {
  params: GetClassAttendanceSummaryParams;
  result: GetClassAttendanceSummaryResult;
}

const getClassAttendanceSummaryIR: any = {"usedParamSet":{"branchId":true,"startDate":true,"endDate":true},"params":[{"name":"branchId","required":true,"transform":{"type":"scalar"},"locs":[{"a":605,"b":614}]},{"name":"startDate","required":true,"transform":{"type":"scalar"},"locs":[{"a":640,"b":650}]},{"name":"endDate","required":true,"transform":{"type":"scalar"},"locs":[{"a":676,"b":684}]}],"statement":"SELECT\n  c.id as class_id,\n  c.scheduled_at,\n  c.instructor,\n  c.capacity,\n  COUNT(b.id) as total_bookings,\n  COUNT(ar.id) FILTER (WHERE ar.status = 'present') as present_count,\n  COUNT(ar.id) FILTER (WHERE ar.status = 'absent') as absent_count,\n  COUNT(ar.id) FILTER (WHERE ar.status = 'late') as late_count,\n  ROUND(\n    (COUNT(ar.id) FILTER (WHERE ar.status = 'present')::numeric / NULLIF(COUNT(b.id), 0)) * 100,\n    2\n  ) as attendance_rate\nFROM classes c\nLEFT JOIN bookings b ON c.id = b.class_id AND b.status = 'confirmed'\nLEFT JOIN attendance_records ar ON b.id = ar.booking_id\nWHERE c.branch_id = :branchId!\n  AND c.scheduled_at >= :startDate!\n  AND c.scheduled_at <= :endDate!\nGROUP BY c.id, c.scheduled_at, c.instructor, c.capacity\nORDER BY c.scheduled_at DESC"};

/**
 * Query generated from SQL:
 * ```
 * SELECT
 *   c.id as class_id,
 *   c.scheduled_at,
 *   c.instructor,
 *   c.capacity,
 *   COUNT(b.id) as total_bookings,
 *   COUNT(ar.id) FILTER (WHERE ar.status = 'present') as present_count,
 *   COUNT(ar.id) FILTER (WHERE ar.status = 'absent') as absent_count,
 *   COUNT(ar.id) FILTER (WHERE ar.status = 'late') as late_count,
 *   ROUND(
 *     (COUNT(ar.id) FILTER (WHERE ar.status = 'present')::numeric / NULLIF(COUNT(b.id), 0)) * 100,
 *     2
 *   ) as attendance_rate
 * FROM classes c
 * LEFT JOIN bookings b ON c.id = b.class_id AND b.status = 'confirmed'
 * LEFT JOIN attendance_records ar ON b.id = ar.booking_id
 * WHERE c.branch_id = :branchId!
 *   AND c.scheduled_at >= :startDate!
 *   AND c.scheduled_at <= :endDate!
 * GROUP BY c.id, c.scheduled_at, c.instructor, c.capacity
 * ORDER BY c.scheduled_at DESC
 * ```
 */
export const getClassAttendanceSummary = new PreparedQuery<GetClassAttendanceSummaryParams,GetClassAttendanceSummaryResult>(getClassAttendanceSummaryIR);


/** 'GetUserAttendanceHistory' parameters type */
export interface GetUserAttendanceHistoryParams {
  branchId: string;
  limit?: NumberOrString | null | void;
  userId: string;
}

/** 'GetUserAttendanceHistory' return type */
export interface GetUserAttendanceHistoryResult {
  attendance_status: string;
  booking_id: string;
  booking_status: booking_status;
  class_id: string;
  instructor: string | null;
  marked_at: Date | null;
  notes: string | null;
  scheduled_at: Date;
}

/** 'GetUserAttendanceHistory' query type */
export interface GetUserAttendanceHistoryQuery {
  params: GetUserAttendanceHistoryParams;
  result: GetUserAttendanceHistoryResult;
}

const getUserAttendanceHistoryIR: any = {"usedParamSet":{"userId":true,"branchId":true,"limit":true},"params":[{"name":"userId","required":true,"transform":{"type":"scalar"},"locs":[{"a":300,"b":307}]},{"name":"branchId","required":true,"transform":{"type":"scalar"},"locs":[{"a":329,"b":338}]},{"name":"limit","required":false,"transform":{"type":"scalar"},"locs":[{"a":416,"b":421}]}],"statement":"SELECT\n  c.id as class_id,\n  c.scheduled_at,\n  c.instructor,\n  b.id as booking_id,\n  b.status as booking_status,\n  ar.status as attendance_status,\n  ar.marked_at,\n  ar.notes\nFROM bookings b\nJOIN classes c ON b.class_id = c.id\nLEFT JOIN attendance_records ar ON b.id = ar.booking_id\nWHERE b.user_id = :userId!\n  AND b.branch_id = :branchId!\n  AND c.scheduled_at < CURRENT_TIMESTAMP\nORDER BY c.scheduled_at DESC\nLIMIT :limit"};

/**
 * Query generated from SQL:
 * ```
 * SELECT
 *   c.id as class_id,
 *   c.scheduled_at,
 *   c.instructor,
 *   b.id as booking_id,
 *   b.status as booking_status,
 *   ar.status as attendance_status,
 *   ar.marked_at,
 *   ar.notes
 * FROM bookings b
 * JOIN classes c ON b.class_id = c.id
 * LEFT JOIN attendance_records ar ON b.id = ar.booking_id
 * WHERE b.user_id = :userId!
 *   AND b.branch_id = :branchId!
 *   AND c.scheduled_at < CURRENT_TIMESTAMP
 * ORDER BY c.scheduled_at DESC
 * LIMIT :limit
 * ```
 */
export const getUserAttendanceHistory = new PreparedQuery<GetUserAttendanceHistoryParams,GetUserAttendanceHistoryResult>(getUserAttendanceHistoryIR);


