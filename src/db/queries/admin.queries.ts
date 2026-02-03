/** Types generated for queries found in "src/db/queries/admin.sql" */
import { PreparedQuery } from '@pgtyped/runtime';

export type booking_status = 'cancelled' | 'confirmed' | 'waitlisted';

export type notification_type = 'booking_cancellation' | 'booking_confirmation' | 'package_expiration' | 'waitlist_promotion';

export type user_role = 'admin' | 'client' | 'superuser';

export type DateOrString = Date | string;

export type Json = null | boolean | number | string | Json[] | { [key: string]: Json };

export type NumberOrString = number | string;

/** 'GetBranchStats' parameters type */
export interface GetBranchStatsParams {
  branchId: string;
}

/** 'GetBranchStats' return type */
export interface GetBranchStatsResult {
  new_clients_last_month: string | null;
  total_clients: string | null;
  total_revenue: string | null;
}

/** 'GetBranchStats' query type */
export interface GetBranchStatsQuery {
  params: GetBranchStatsParams;
  result: GetBranchStatsResult;
}

const getBranchStatsIR: any = {"usedParamSet":{"branchId":true},"params":[{"name":"branchId","required":true,"transform":{"type":"scalar"},"locs":[{"a":56,"b":65},{"a":155,"b":164},{"a":372,"b":381}]}],"statement":"SELECT\n  (SELECT COUNT(*) FROM \"user\" WHERE branch_id = :branchId! AND role = 'client') as total_clients,\n  (SELECT COUNT(*) FROM \"user\" WHERE branch_id = :branchId! AND role = 'client' AND \"createdAt\" >= CURRENT_DATE - INTERVAL '30 days') as new_clients_last_month,\n  (SELECT COALESCE(SUM(amount), 0) FROM payments p JOIN \"user\" u ON p.user_id = u.id WHERE u.branch_id = :branchId!) as total_revenue"};

/**
 * Query generated from SQL:
 * ```
 * SELECT
 *   (SELECT COUNT(*) FROM "user" WHERE branch_id = :branchId! AND role = 'client') as total_clients,
 *   (SELECT COUNT(*) FROM "user" WHERE branch_id = :branchId! AND role = 'client' AND "createdAt" >= CURRENT_DATE - INTERVAL '30 days') as new_clients_last_month,
 *   (SELECT COALESCE(SUM(amount), 0) FROM payments p JOIN "user" u ON p.user_id = u.id WHERE u.branch_id = :branchId!) as total_revenue
 * ```
 */
export const getBranchStats = new PreparedQuery<GetBranchStatsParams,GetBranchStatsResult>(getBranchStatsIR);


/** 'GetUsersByBranch' parameters type */
export interface GetUsersByBranchParams {
  branchId: string;
  limit: NumberOrString;
  offset: NumberOrString;
  role?: user_role | null | void;
}

/** 'GetUsersByBranch' return type */
export interface GetUsersByBranchResult {
  created_at: Date | null;
  email: string;
  first_name: string | null;
  id: string;
  last_name: string | null;
  phone: string | null;
  role: user_role;
}

/** 'GetUsersByBranch' query type */
export interface GetUsersByBranchQuery {
  params: GetUsersByBranchParams;
  result: GetUsersByBranchResult;
}

const getUsersByBranchIR: any = {"usedParamSet":{"branchId":true,"role":true,"limit":true,"offset":true},"params":[{"name":"branchId","required":true,"transform":{"type":"scalar"},"locs":[{"a":124,"b":133}]},{"name":"role","required":false,"transform":{"type":"scalar"},"locs":[{"a":146,"b":150}]},{"name":"limit","required":true,"transform":{"type":"scalar"},"locs":[{"a":184,"b":190}]},{"name":"offset","required":true,"transform":{"type":"scalar"},"locs":[{"a":199,"b":206}]}],"statement":"SELECT\n  id,\n  email,\n  first_name,\n  last_name,\n  phone,\n  role,\n  \"createdAt\" as created_at\nFROM \"user\"\nWHERE branch_id = :branchId! AND role = :role\nORDER BY \"createdAt\" DESC\nLIMIT :limit! OFFSET :offset!"};

/**
 * Query generated from SQL:
 * ```
 * SELECT
 *   id,
 *   email,
 *   first_name,
 *   last_name,
 *   phone,
 *   role,
 *   "createdAt" as created_at
 * FROM "user"
 * WHERE branch_id = :branchId! AND role = :role
 * ORDER BY "createdAt" DESC
 * LIMIT :limit! OFFSET :offset!
 * ```
 */
export const getUsersByBranch = new PreparedQuery<GetUsersByBranchParams,GetUsersByBranchResult>(getUsersByBranchIR);


/** 'CreatePayment' parameters type */
export interface CreatePaymentParams {
  amount: NumberOrString;
  notes?: string | null | void;
  paymentDate: DateOrString;
  recordedBy: string;
  userId: string;
}

/** 'CreatePayment' return type */
export interface CreatePaymentResult {
  amount: string;
  created_at: Date | null;
  id: string;
  notes: string | null;
  payment_date: Date;
  recorded_by: string;
  user_id: string;
}

/** 'CreatePayment' query type */
export interface CreatePaymentQuery {
  params: CreatePaymentParams;
  result: CreatePaymentResult;
}

const createPaymentIR: any = {"usedParamSet":{"userId":true,"amount":true,"paymentDate":true,"notes":true,"recordedBy":true},"params":[{"name":"userId","required":true,"transform":{"type":"scalar"},"locs":[{"a":96,"b":103}]},{"name":"amount","required":true,"transform":{"type":"scalar"},"locs":[{"a":108,"b":115}]},{"name":"paymentDate","required":true,"transform":{"type":"scalar"},"locs":[{"a":120,"b":132}]},{"name":"notes","required":false,"transform":{"type":"scalar"},"locs":[{"a":137,"b":142}]},{"name":"recordedBy","required":true,"transform":{"type":"scalar"},"locs":[{"a":147,"b":158}]}],"statement":"INSERT INTO payments (\n  user_id,\n  amount,\n  payment_date,\n  notes,\n  recorded_by\n) VALUES (\n  :userId!,\n  :amount!,\n  :paymentDate!,\n  :notes,\n  :recordedBy!\n) RETURNING id, user_id, amount, payment_date, notes, recorded_by, created_at"};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO payments (
 *   user_id,
 *   amount,
 *   payment_date,
 *   notes,
 *   recorded_by
 * ) VALUES (
 *   :userId!,
 *   :amount!,
 *   :paymentDate!,
 *   :notes,
 *   :recordedBy!
 * ) RETURNING id, user_id, amount, payment_date, notes, recorded_by, created_at
 * ```
 */
export const createPayment = new PreparedQuery<CreatePaymentParams,CreatePaymentResult>(createPaymentIR);


/** 'GetPaymentsByUser' parameters type */
export interface GetPaymentsByUserParams {
  userId: string;
}

/** 'GetPaymentsByUser' return type */
export interface GetPaymentsByUserResult {
  amount: string;
  created_at: Date | null;
  id: string;
  notes: string | null;
  payment_date: Date;
  recorded_by: string;
  recorded_by_name: string | null;
  user_id: string;
}

/** 'GetPaymentsByUser' query type */
export interface GetPaymentsByUserQuery {
  params: GetPaymentsByUserParams;
  result: GetPaymentsByUserResult;
}

const getPaymentsByUserIR: any = {"usedParamSet":{"userId":true},"params":[{"name":"userId","required":true,"transform":{"type":"scalar"},"locs":[{"a":257,"b":264}]}],"statement":"SELECT\n  p.id,\n  p.user_id,\n  p.amount,\n  p.payment_date,\n  p.notes,\n  p.recorded_by,\n  p.created_at,\n  COALESCE(u.first_name || ' ' || u.last_name, 'Sistema') as recorded_by_name\nFROM payments p\nLEFT JOIN \"user\" u ON p.recorded_by = u.id\nWHERE p.user_id = :userId!\nORDER BY p.payment_date DESC"};

/**
 * Query generated from SQL:
 * ```
 * SELECT
 *   p.id,
 *   p.user_id,
 *   p.amount,
 *   p.payment_date,
 *   p.notes,
 *   p.recorded_by,
 *   p.created_at,
 *   COALESCE(u.first_name || ' ' || u.last_name, 'Sistema') as recorded_by_name
 * FROM payments p
 * LEFT JOIN "user" u ON p.recorded_by = u.id
 * WHERE p.user_id = :userId!
 * ORDER BY p.payment_date DESC
 * ```
 */
export const getPaymentsByUser = new PreparedQuery<GetPaymentsByUserParams,GetPaymentsByUserResult>(getPaymentsByUserIR);


/** 'GetPaymentForAdmin' parameters type */
export interface GetPaymentForAdminParams {
  branchId: string;
  paymentId: string;
}

/** 'GetPaymentForAdmin' return type */
export interface GetPaymentForAdminResult {
  amount: string;
  branch_id: string | null;
  id: string;
  user_id: string;
}

/** 'GetPaymentForAdmin' query type */
export interface GetPaymentForAdminQuery {
  params: GetPaymentForAdminParams;
  result: GetPaymentForAdminResult;
}

const getPaymentForAdminIR: any = {"usedParamSet":{"paymentId":true,"branchId":true},"params":[{"name":"paymentId","required":true,"transform":{"type":"scalar"},"locs":[{"a":117,"b":127}]},{"name":"branchId","required":true,"transform":{"type":"scalar"},"locs":[{"a":149,"b":158}]}],"statement":"SELECT\n  p.id,\n  p.user_id,\n  p.amount,\n  u.branch_id\nFROM payments p\nJOIN \"user\" u ON p.user_id = u.id\nWHERE p.id = :paymentId!\n  AND u.branch_id = :branchId!"};

/**
 * Query generated from SQL:
 * ```
 * SELECT
 *   p.id,
 *   p.user_id,
 *   p.amount,
 *   u.branch_id
 * FROM payments p
 * JOIN "user" u ON p.user_id = u.id
 * WHERE p.id = :paymentId!
 *   AND u.branch_id = :branchId!
 * ```
 */
export const getPaymentForAdmin = new PreparedQuery<GetPaymentForAdminParams,GetPaymentForAdminResult>(getPaymentForAdminIR);


/** 'UpdatePayment' parameters type */
export interface UpdatePaymentParams {
  amount: NumberOrString;
  notes?: string | null | void;
  paymentDate: DateOrString;
  paymentId: string;
}

/** 'UpdatePayment' return type */
export interface UpdatePaymentResult {
  id: string;
}

/** 'UpdatePayment' query type */
export interface UpdatePaymentQuery {
  params: UpdatePaymentParams;
  result: UpdatePaymentResult;
}

const updatePaymentIR: any = {"usedParamSet":{"amount":true,"paymentDate":true,"notes":true,"paymentId":true},"params":[{"name":"amount","required":true,"transform":{"type":"scalar"},"locs":[{"a":29,"b":36}]},{"name":"paymentDate","required":true,"transform":{"type":"scalar"},"locs":[{"a":58,"b":70}]},{"name":"notes","required":false,"transform":{"type":"scalar"},"locs":[{"a":85,"b":90}]},{"name":"paymentId","required":true,"transform":{"type":"scalar"},"locs":[{"a":139,"b":149}]}],"statement":"UPDATE payments\nSET amount = :amount!,\n    payment_date = :paymentDate!,\n    notes = :notes,\n    updated_at = CURRENT_TIMESTAMP\nWHERE id = :paymentId!\nRETURNING id"};

/**
 * Query generated from SQL:
 * ```
 * UPDATE payments
 * SET amount = :amount!,
 *     payment_date = :paymentDate!,
 *     notes = :notes,
 *     updated_at = CURRENT_TIMESTAMP
 * WHERE id = :paymentId!
 * RETURNING id
 * ```
 */
export const updatePayment = new PreparedQuery<UpdatePaymentParams,UpdatePaymentResult>(updatePaymentIR);


/** 'DeletePayment' parameters type */
export interface DeletePaymentParams {
  paymentId: string;
}

/** 'DeletePayment' return type */
export interface DeletePaymentResult {
  id: string;
}

/** 'DeletePayment' query type */
export interface DeletePaymentQuery {
  params: DeletePaymentParams;
  result: DeletePaymentResult;
}

const deletePaymentIR: any = {"usedParamSet":{"paymentId":true},"params":[{"name":"paymentId","required":true,"transform":{"type":"scalar"},"locs":[{"a":32,"b":42}]}],"statement":"DELETE FROM payments\nWHERE id = :paymentId!\nRETURNING id"};

/**
 * Query generated from SQL:
 * ```
 * DELETE FROM payments
 * WHERE id = :paymentId!
 * RETURNING id
 * ```
 */
export const deletePayment = new PreparedQuery<DeletePaymentParams,DeletePaymentResult>(deletePaymentIR);


/** 'LogAdminAction' parameters type */
export interface LogAdminActionParams {
  actionType: string;
  adminId: string;
  description?: string | null | void;
  entityId?: string | null | void;
  entityType: string;
  metadata?: Json | null | void;
}

/** 'LogAdminAction' return type */
export interface LogAdminActionResult {
  action_type: string;
  admin_id: string;
  created_at: Date | null;
  description: string | null;
  entity_id: string | null;
  entity_type: string;
  id: string;
}

/** 'LogAdminAction' query type */
export interface LogAdminActionQuery {
  params: LogAdminActionParams;
  result: LogAdminActionResult;
}

const logAdminActionIR: any = {"usedParamSet":{"adminId":true,"actionType":true,"entityType":true,"entityId":true,"description":true,"metadata":true},"params":[{"name":"adminId","required":true,"transform":{"type":"scalar"},"locs":[{"a":126,"b":134}]},{"name":"actionType","required":true,"transform":{"type":"scalar"},"locs":[{"a":139,"b":150}]},{"name":"entityType","required":true,"transform":{"type":"scalar"},"locs":[{"a":155,"b":166}]},{"name":"entityId","required":false,"transform":{"type":"scalar"},"locs":[{"a":171,"b":179}]},{"name":"description","required":false,"transform":{"type":"scalar"},"locs":[{"a":184,"b":195}]},{"name":"metadata","required":false,"transform":{"type":"scalar"},"locs":[{"a":200,"b":208}]}],"statement":"INSERT INTO admin_action_logs (\n  admin_id,\n  action_type,\n  entity_type,\n  entity_id,\n  description,\n  metadata\n) VALUES (\n  :adminId!,\n  :actionType!,\n  :entityType!,\n  :entityId,\n  :description,\n  :metadata\n) RETURNING id, admin_id, action_type, entity_type, entity_id, description, created_at"};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO admin_action_logs (
 *   admin_id,
 *   action_type,
 *   entity_type,
 *   entity_id,
 *   description,
 *   metadata
 * ) VALUES (
 *   :adminId!,
 *   :actionType!,
 *   :entityType!,
 *   :entityId,
 *   :description,
 *   :metadata
 * ) RETURNING id, admin_id, action_type, entity_type, entity_id, description, created_at
 * ```
 */
export const logAdminAction = new PreparedQuery<LogAdminActionParams,LogAdminActionResult>(logAdminActionIR);


/** 'GetAdminActionLogs' parameters type */
export interface GetAdminActionLogsParams {
  branchId: string;
  limit: NumberOrString;
  offset: NumberOrString;
}

/** 'GetAdminActionLogs' return type */
export interface GetAdminActionLogsResult {
  action_type: string;
  admin_id: string;
  created_at: Date | null;
  description: string | null;
  email: string;
  entity_id: string | null;
  entity_type: string;
  first_name: string | null;
  id: string;
  last_name: string | null;
  metadata: Json | null;
}

/** 'GetAdminActionLogs' query type */
export interface GetAdminActionLogsQuery {
  params: GetAdminActionLogsParams;
  result: GetAdminActionLogsResult;
}

const getAdminActionLogsIR: any = {"usedParamSet":{"branchId":true,"limit":true,"offset":true},"params":[{"name":"branchId","required":true,"transform":{"type":"scalar"},"locs":[{"a":256,"b":265}]},{"name":"limit","required":true,"transform":{"type":"scalar"},"locs":[{"a":301,"b":307}]},{"name":"offset","required":true,"transform":{"type":"scalar"},"locs":[{"a":316,"b":323}]}],"statement":"SELECT\n  al.id,\n  al.admin_id,\n  al.action_type,\n  al.entity_type,\n  al.entity_id,\n  al.description,\n  al.metadata,\n  al.created_at,\n  u.first_name,\n  u.last_name,\n  u.email\nFROM admin_action_logs al\nJOIN \"user\" u ON al.admin_id = u.id\nWHERE u.branch_id = :branchId!\nORDER BY al.created_at DESC\nLIMIT :limit! OFFSET :offset!"};

/**
 * Query generated from SQL:
 * ```
 * SELECT
 *   al.id,
 *   al.admin_id,
 *   al.action_type,
 *   al.entity_type,
 *   al.entity_id,
 *   al.description,
 *   al.metadata,
 *   al.created_at,
 *   u.first_name,
 *   u.last_name,
 *   u.email
 * FROM admin_action_logs al
 * JOIN "user" u ON al.admin_id = u.id
 * WHERE u.branch_id = :branchId!
 * ORDER BY al.created_at DESC
 * LIMIT :limit! OFFSET :offset!
 * ```
 */
export const getAdminActionLogs = new PreparedQuery<GetAdminActionLogsParams,GetAdminActionLogsResult>(getAdminActionLogsIR);


/** 'GetBranchSettings' parameters type */
export interface GetBranchSettingsParams {
  branchId: string;
}

/** 'GetBranchSettings' return type */
export interface GetBranchSettingsResult {
  branch_id: string;
  cancellation_hours_before: number;
  created_at: Date | null;
  id: string;
  timezone: string;
  updated_at: Date | null;
}

/** 'GetBranchSettings' query type */
export interface GetBranchSettingsQuery {
  params: GetBranchSettingsParams;
  result: GetBranchSettingsResult;
}

const getBranchSettingsIR: any = {"usedParamSet":{"branchId":true},"params":[{"name":"branchId","required":true,"transform":{"type":"scalar"},"locs":[{"a":133,"b":142}]}],"statement":"SELECT\n  id,\n  branch_id,\n  cancellation_hours_before,\n  timezone,\n  created_at,\n  updated_at\nFROM branch_settings\nWHERE branch_id = :branchId!"};

/**
 * Query generated from SQL:
 * ```
 * SELECT
 *   id,
 *   branch_id,
 *   cancellation_hours_before,
 *   timezone,
 *   created_at,
 *   updated_at
 * FROM branch_settings
 * WHERE branch_id = :branchId!
 * ```
 */
export const getBranchSettings = new PreparedQuery<GetBranchSettingsParams,GetBranchSettingsResult>(getBranchSettingsIR);


/** 'UpdateBranchSettings' parameters type */
export interface UpdateBranchSettingsParams {
  branchId: string;
  cancellationHoursBefore: number;
  timezone: string;
}

/** 'UpdateBranchSettings' return type */
export interface UpdateBranchSettingsResult {
  branch_id: string;
  cancellation_hours_before: number;
  id: string;
  timezone: string;
  updated_at: Date | null;
}

/** 'UpdateBranchSettings' query type */
export interface UpdateBranchSettingsQuery {
  params: UpdateBranchSettingsParams;
  result: UpdateBranchSettingsResult;
}

const updateBranchSettingsIR: any = {"usedParamSet":{"cancellationHoursBefore":true,"timezone":true,"branchId":true},"params":[{"name":"cancellationHoursBefore","required":true,"transform":{"type":"scalar"},"locs":[{"a":55,"b":79}]},{"name":"timezone","required":true,"transform":{"type":"scalar"},"locs":[{"a":97,"b":106}]},{"name":"branchId","required":true,"transform":{"type":"scalar"},"locs":[{"a":162,"b":171}]}],"statement":"UPDATE branch_settings\nSET cancellation_hours_before = :cancellationHoursBefore!,\n    timezone = :timezone!,\n    updated_at = CURRENT_TIMESTAMP\nWHERE branch_id = :branchId!\nRETURNING id, branch_id, cancellation_hours_before, timezone, updated_at"};

/**
 * Query generated from SQL:
 * ```
 * UPDATE branch_settings
 * SET cancellation_hours_before = :cancellationHoursBefore!,
 *     timezone = :timezone!,
 *     updated_at = CURRENT_TIMESTAMP
 * WHERE branch_id = :branchId!
 * RETURNING id, branch_id, cancellation_hours_before, timezone, updated_at
 * ```
 */
export const updateBranchSettings = new PreparedQuery<UpdateBranchSettingsParams,UpdateBranchSettingsResult>(updateBranchSettingsIR);


/** 'CreateBranchSettings' parameters type */
export interface CreateBranchSettingsParams {
  branchId: string;
  cancellationHoursBefore: number;
  timezone: string;
}

/** 'CreateBranchSettings' return type */
export interface CreateBranchSettingsResult {
  branch_id: string;
  cancellation_hours_before: number;
  created_at: Date | null;
  id: string;
  timezone: string;
}

/** 'CreateBranchSettings' query type */
export interface CreateBranchSettingsQuery {
  params: CreateBranchSettingsParams;
  result: CreateBranchSettingsResult;
}

const createBranchSettingsIR: any = {"usedParamSet":{"branchId":true,"cancellationHoursBefore":true,"timezone":true},"params":[{"name":"branchId","required":true,"transform":{"type":"scalar"},"locs":[{"a":96,"b":105}]},{"name":"cancellationHoursBefore","required":true,"transform":{"type":"scalar"},"locs":[{"a":110,"b":134}]},{"name":"timezone","required":true,"transform":{"type":"scalar"},"locs":[{"a":139,"b":148}]}],"statement":"INSERT INTO branch_settings (\n  branch_id,\n  cancellation_hours_before,\n  timezone\n) VALUES (\n  :branchId!,\n  :cancellationHoursBefore!,\n  :timezone!\n) RETURNING id, branch_id, cancellation_hours_before, timezone, created_at"};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO branch_settings (
 *   branch_id,
 *   cancellation_hours_before,
 *   timezone
 * ) VALUES (
 *   :branchId!,
 *   :cancellationHoursBefore!,
 *   :timezone!
 * ) RETURNING id, branch_id, cancellation_hours_before, timezone, created_at
 * ```
 */
export const createBranchSettings = new PreparedQuery<CreateBranchSettingsParams,CreateBranchSettingsResult>(createBranchSettingsIR);


/** 'GetNotificationSettings' parameters type */
export interface GetNotificationSettingsParams {
  branchId: string;
}

/** 'GetNotificationSettings' return type */
export interface GetNotificationSettingsResult {
  branch_id: string;
  created_at: Date | null;
  email_template: string | null;
  id: string;
  is_enabled: boolean | null;
  notification_type: notification_type;
  updated_at: Date | null;
}

/** 'GetNotificationSettings' query type */
export interface GetNotificationSettingsQuery {
  params: GetNotificationSettingsParams;
  result: GetNotificationSettingsResult;
}

const getNotificationSettingsIR: any = {"usedParamSet":{"branchId":true},"params":[{"name":"branchId","required":true,"transform":{"type":"scalar"},"locs":[{"a":151,"b":160}]}],"statement":"SELECT\n  id,\n  branch_id,\n  notification_type,\n  is_enabled,\n  email_template,\n  created_at,\n  updated_at\nFROM notification_settings\nWHERE branch_id = :branchId!"};

/**
 * Query generated from SQL:
 * ```
 * SELECT
 *   id,
 *   branch_id,
 *   notification_type,
 *   is_enabled,
 *   email_template,
 *   created_at,
 *   updated_at
 * FROM notification_settings
 * WHERE branch_id = :branchId!
 * ```
 */
export const getNotificationSettings = new PreparedQuery<GetNotificationSettingsParams,GetNotificationSettingsResult>(getNotificationSettingsIR);


/** 'UpdateNotificationSetting' parameters type */
export interface UpdateNotificationSettingParams {
  branchId: string;
  emailTemplate?: string | null | void;
  isEnabled: boolean;
  notificationType: notification_type;
}

/** 'UpdateNotificationSetting' return type */
export interface UpdateNotificationSettingResult {
  branch_id: string;
  email_template: string | null;
  id: string;
  is_enabled: boolean | null;
  notification_type: notification_type;
  updated_at: Date | null;
}

/** 'UpdateNotificationSetting' query type */
export interface UpdateNotificationSettingQuery {
  params: UpdateNotificationSettingParams;
  result: UpdateNotificationSettingResult;
}

const updateNotificationSettingIR: any = {"usedParamSet":{"isEnabled":true,"emailTemplate":true,"branchId":true,"notificationType":true},"params":[{"name":"isEnabled","required":true,"transform":{"type":"scalar"},"locs":[{"a":46,"b":56}]},{"name":"emailTemplate","required":false,"transform":{"type":"scalar"},"locs":[{"a":80,"b":93}]},{"name":"branchId","required":true,"transform":{"type":"scalar"},"locs":[{"a":149,"b":158}]},{"name":"notificationType","required":true,"transform":{"type":"scalar"},"locs":[{"a":184,"b":201}]}],"statement":"UPDATE notification_settings\nSET is_enabled = :isEnabled!,\n    email_template = :emailTemplate,\n    updated_at = CURRENT_TIMESTAMP\nWHERE branch_id = :branchId! AND notification_type = :notificationType!\nRETURNING id, branch_id, notification_type, is_enabled, email_template, updated_at"};

/**
 * Query generated from SQL:
 * ```
 * UPDATE notification_settings
 * SET is_enabled = :isEnabled!,
 *     email_template = :emailTemplate,
 *     updated_at = CURRENT_TIMESTAMP
 * WHERE branch_id = :branchId! AND notification_type = :notificationType!
 * RETURNING id, branch_id, notification_type, is_enabled, email_template, updated_at
 * ```
 */
export const updateNotificationSetting = new PreparedQuery<UpdateNotificationSettingParams,UpdateNotificationSettingResult>(updateNotificationSettingIR);


/** 'CreateNotificationSetting' parameters type */
export interface CreateNotificationSettingParams {
  branchId: string;
  emailTemplate?: string | null | void;
  isEnabled: boolean;
  notificationType: notification_type;
}

/** 'CreateNotificationSetting' return type */
export interface CreateNotificationSettingResult {
  branch_id: string;
  created_at: Date | null;
  email_template: string | null;
  id: string;
  is_enabled: boolean | null;
  notification_type: notification_type;
}

/** 'CreateNotificationSetting' query type */
export interface CreateNotificationSettingQuery {
  params: CreateNotificationSettingParams;
  result: CreateNotificationSettingResult;
}

const createNotificationSettingIR: any = {"usedParamSet":{"branchId":true,"notificationType":true,"isEnabled":true,"emailTemplate":true},"params":[{"name":"branchId","required":true,"transform":{"type":"scalar"},"locs":[{"a":114,"b":123}]},{"name":"notificationType","required":true,"transform":{"type":"scalar"},"locs":[{"a":128,"b":145}]},{"name":"isEnabled","required":true,"transform":{"type":"scalar"},"locs":[{"a":150,"b":160}]},{"name":"emailTemplate","required":false,"transform":{"type":"scalar"},"locs":[{"a":165,"b":178}]}],"statement":"INSERT INTO notification_settings (\n  branch_id,\n  notification_type,\n  is_enabled,\n  email_template\n) VALUES (\n  :branchId!,\n  :notificationType!,\n  :isEnabled!,\n  :emailTemplate\n) RETURNING id, branch_id, notification_type, is_enabled, email_template, created_at"};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO notification_settings (
 *   branch_id,
 *   notification_type,
 *   is_enabled,
 *   email_template
 * ) VALUES (
 *   :branchId!,
 *   :notificationType!,
 *   :isEnabled!,
 *   :emailTemplate
 * ) RETURNING id, branch_id, notification_type, is_enabled, email_template, created_at
 * ```
 */
export const createNotificationSetting = new PreparedQuery<CreateNotificationSettingParams,CreateNotificationSettingResult>(createNotificationSettingIR);


/** 'CreateBranch' parameters type */
export interface CreateBranchParams {
  address?: string | null | void;
  email?: string | null | void;
  name: string;
  phone?: string | null | void;
}

/** 'CreateBranch' return type */
export interface CreateBranchResult {
  address: string | null;
  created_at: Date | null;
  email: string | null;
  id: string;
  name: string;
  phone: string | null;
}

/** 'CreateBranch' query type */
export interface CreateBranchQuery {
  params: CreateBranchParams;
  result: CreateBranchResult;
}

const createBranchIR: any = {"usedParamSet":{"name":true,"address":true,"phone":true,"email":true},"params":[{"name":"name","required":true,"transform":{"type":"scalar"},"locs":[{"a":72,"b":77}]},{"name":"address","required":false,"transform":{"type":"scalar"},"locs":[{"a":82,"b":89}]},{"name":"phone","required":false,"transform":{"type":"scalar"},"locs":[{"a":94,"b":99}]},{"name":"email","required":false,"transform":{"type":"scalar"},"locs":[{"a":104,"b":109}]}],"statement":"INSERT INTO branches (\n  name,\n  address,\n  phone,\n  email\n) VALUES (\n  :name!,\n  :address,\n  :phone,\n  :email\n) RETURNING id, name, address, phone, email, created_at"};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO branches (
 *   name,
 *   address,
 *   phone,
 *   email
 * ) VALUES (
 *   :name!,
 *   :address,
 *   :phone,
 *   :email
 * ) RETURNING id, name, address, phone, email, created_at
 * ```
 */
export const createBranch = new PreparedQuery<CreateBranchParams,CreateBranchResult>(createBranchIR);


/** 'GetAllBranches' parameters type */
export type GetAllBranchesParams = void;

/** 'GetAllBranches' return type */
export interface GetAllBranchesResult {
  address: string | null;
  created_at: Date | null;
  email: string | null;
  id: string;
  name: string;
  phone: string | null;
  updated_at: Date | null;
}

/** 'GetAllBranches' query type */
export interface GetAllBranchesQuery {
  params: GetAllBranchesParams;
  result: GetAllBranchesResult;
}

const getAllBranchesIR: any = {"usedParamSet":{},"params":[],"statement":"SELECT\n  id,\n  name,\n  address,\n  phone,\n  email,\n  created_at,\n  updated_at\nFROM branches\nORDER BY created_at DESC"};

/**
 * Query generated from SQL:
 * ```
 * SELECT
 *   id,
 *   name,
 *   address,
 *   phone,
 *   email,
 *   created_at,
 *   updated_at
 * FROM branches
 * ORDER BY created_at DESC
 * ```
 */
export const getAllBranches = new PreparedQuery<GetAllBranchesParams,GetAllBranchesResult>(getAllBranchesIR);


/** 'CheckAdminBranchAccess' parameters type */
export interface CheckAdminBranchAccessParams {
  adminId: string;
  branchId: string;
}

/** 'CheckAdminBranchAccess' return type */
export interface CheckAdminBranchAccessResult {
  has_access: number | null;
}

/** 'CheckAdminBranchAccess' query type */
export interface CheckAdminBranchAccessQuery {
  params: CheckAdminBranchAccessParams;
  result: CheckAdminBranchAccessResult;
}

const checkAdminBranchAccessIR: any = {"usedParamSet":{"adminId":true,"branchId":true},"params":[{"name":"adminId","required":true,"transform":{"type":"scalar"},"locs":[{"a":70,"b":78}]},{"name":"branchId","required":true,"transform":{"type":"scalar"},"locs":[{"a":96,"b":105}]}],"statement":"SELECT 1 as has_access\nFROM admin_branch_assignments\nWHERE admin_id = :adminId! AND branch_id = :branchId!"};

/**
 * Query generated from SQL:
 * ```
 * SELECT 1 as has_access
 * FROM admin_branch_assignments
 * WHERE admin_id = :adminId! AND branch_id = :branchId!
 * ```
 */
export const checkAdminBranchAccess = new PreparedQuery<CheckAdminBranchAccessParams,CheckAdminBranchAccessResult>(checkAdminBranchAccessIR);


/** 'UpdateUserBranch' parameters type */
export interface UpdateUserBranchParams {
  branchId: string;
  userId: string;
}

/** 'UpdateUserBranch' return type */
export interface UpdateUserBranchResult {
  branch_id: string | null;
  id: string;
}

/** 'UpdateUserBranch' query type */
export interface UpdateUserBranchQuery {
  params: UpdateUserBranchParams;
  result: UpdateUserBranchResult;
}

const updateUserBranchIR: any = {"usedParamSet":{"branchId":true,"userId":true},"params":[{"name":"branchId","required":true,"transform":{"type":"scalar"},"locs":[{"a":30,"b":39}]},{"name":"userId","required":true,"transform":{"type":"scalar"},"locs":[{"a":89,"b":96}]}],"statement":"UPDATE \"user\"\nSET branch_id = :branchId!,\n    \"updatedAt\" = CURRENT_TIMESTAMP\nWHERE id = :userId!\nRETURNING id, branch_id"};

/**
 * Query generated from SQL:
 * ```
 * UPDATE "user"
 * SET branch_id = :branchId!,
 *     "updatedAt" = CURRENT_TIMESTAMP
 * WHERE id = :userId!
 * RETURNING id, branch_id
 * ```
 */
export const updateUserBranch = new PreparedQuery<UpdateUserBranchParams,UpdateUserBranchResult>(updateUserBranchIR);


/** 'GetUserRoleById' parameters type */
export interface GetUserRoleByIdParams {
  userId: string;
}

/** 'GetUserRoleById' return type */
export interface GetUserRoleByIdResult {
  role: user_role;
}

/** 'GetUserRoleById' query type */
export interface GetUserRoleByIdQuery {
  params: GetUserRoleByIdParams;
  result: GetUserRoleByIdResult;
}

const getUserRoleByIdIR: any = {"usedParamSet":{"userId":true},"params":[{"name":"userId","required":true,"transform":{"type":"scalar"},"locs":[{"a":35,"b":42}]}],"statement":"SELECT role\nFROM \"user\"\nWHERE id = :userId!"};

/**
 * Query generated from SQL:
 * ```
 * SELECT role
 * FROM "user"
 * WHERE id = :userId!
 * ```
 */
export const getUserRoleById = new PreparedQuery<GetUserRoleByIdParams,GetUserRoleByIdResult>(getUserRoleByIdIR);


/** 'GetUserIdByEmail' parameters type */
export interface GetUserIdByEmailParams {
  email: string;
}

/** 'GetUserIdByEmail' return type */
export interface GetUserIdByEmailResult {
  id: string;
}

/** 'GetUserIdByEmail' query type */
export interface GetUserIdByEmailQuery {
  params: GetUserIdByEmailParams;
  result: GetUserIdByEmailResult;
}

const getUserIdByEmailIR: any = {"usedParamSet":{"email":true},"params":[{"name":"email","required":true,"transform":{"type":"scalar"},"locs":[{"a":36,"b":42}]}],"statement":"SELECT id\nFROM \"user\"\nWHERE email = :email!"};

/**
 * Query generated from SQL:
 * ```
 * SELECT id
 * FROM "user"
 * WHERE email = :email!
 * ```
 */
export const getUserIdByEmail = new PreparedQuery<GetUserIdByEmailParams,GetUserIdByEmailResult>(getUserIdByEmailIR);


/** 'UpdateUserRoleInBranch' parameters type */
export interface UpdateUserRoleInBranchParams {
  branchId: string;
  role: user_role;
  userId: string;
}

/** 'UpdateUserRoleInBranch' return type */
export interface UpdateUserRoleInBranchResult {
  id: string;
  role: user_role;
}

/** 'UpdateUserRoleInBranch' query type */
export interface UpdateUserRoleInBranchQuery {
  params: UpdateUserRoleInBranchParams;
  result: UpdateUserRoleInBranchResult;
}

const updateUserRoleInBranchIR: any = {"usedParamSet":{"role":true,"userId":true,"branchId":true},"params":[{"name":"role","required":true,"transform":{"type":"scalar"},"locs":[{"a":25,"b":30}]},{"name":"userId","required":true,"transform":{"type":"scalar"},"locs":[{"a":80,"b":87}]},{"name":"branchId","required":true,"transform":{"type":"scalar"},"locs":[{"a":107,"b":116}]}],"statement":"UPDATE \"user\"\nSET role = :role!,\n    \"updatedAt\" = CURRENT_TIMESTAMP\nWHERE id = :userId!\n  AND branch_id = :branchId!\nRETURNING id, role"};

/**
 * Query generated from SQL:
 * ```
 * UPDATE "user"
 * SET role = :role!,
 *     "updatedAt" = CURRENT_TIMESTAMP
 * WHERE id = :userId!
 *   AND branch_id = :branchId!
 * RETURNING id, role
 * ```
 */
export const updateUserRoleInBranch = new PreparedQuery<UpdateUserRoleInBranchParams,UpdateUserRoleInBranchResult>(updateUserRoleInBranchIR);


/** 'DeleteAdminBranchAssignments' parameters type */
export interface DeleteAdminBranchAssignmentsParams {
  adminId: string;
}

/** 'DeleteAdminBranchAssignments' return type */
export type DeleteAdminBranchAssignmentsResult = void;

/** 'DeleteAdminBranchAssignments' query type */
export interface DeleteAdminBranchAssignmentsQuery {
  params: DeleteAdminBranchAssignmentsParams;
  result: DeleteAdminBranchAssignmentsResult;
}

const deleteAdminBranchAssignmentsIR: any = {"usedParamSet":{"adminId":true},"params":[{"name":"adminId","required":true,"transform":{"type":"scalar"},"locs":[{"a":54,"b":62}]}],"statement":"DELETE FROM admin_branch_assignments\nWHERE admin_id = :adminId!"};

/**
 * Query generated from SQL:
 * ```
 * DELETE FROM admin_branch_assignments
 * WHERE admin_id = :adminId!
 * ```
 */
export const deleteAdminBranchAssignments = new PreparedQuery<DeleteAdminBranchAssignmentsParams,DeleteAdminBranchAssignmentsResult>(deleteAdminBranchAssignmentsIR);


/** 'CreateAdminBranchAssignment' parameters type */
export interface CreateAdminBranchAssignmentParams {
  adminId: string;
  branchId: string;
  isPrimary: boolean;
}

/** 'CreateAdminBranchAssignment' return type */
export interface CreateAdminBranchAssignmentResult {
  admin_id: string;
  branch_id: string;
  is_primary: boolean | null;
}

/** 'CreateAdminBranchAssignment' query type */
export interface CreateAdminBranchAssignmentQuery {
  params: CreateAdminBranchAssignmentParams;
  result: CreateAdminBranchAssignmentResult;
}

const createAdminBranchAssignmentIR: any = {"usedParamSet":{"adminId":true,"branchId":true,"isPrimary":true},"params":[{"name":"adminId","required":true,"transform":{"type":"scalar"},"locs":[{"a":79,"b":87}]},{"name":"branchId","required":true,"transform":{"type":"scalar"},"locs":[{"a":90,"b":99}]},{"name":"isPrimary","required":true,"transform":{"type":"scalar"},"locs":[{"a":102,"b":112}]}],"statement":"INSERT INTO admin_branch_assignments (admin_id, branch_id, is_primary)\nVALUES (:adminId!, :branchId!, :isPrimary!)\nRETURNING admin_id, branch_id, is_primary"};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO admin_branch_assignments (admin_id, branch_id, is_primary)
 * VALUES (:adminId!, :branchId!, :isPrimary!)
 * RETURNING admin_id, branch_id, is_primary
 * ```
 */
export const createAdminBranchAssignment = new PreparedQuery<CreateAdminBranchAssignmentParams,CreateAdminBranchAssignmentResult>(createAdminBranchAssignmentIR);


/** 'CountPaymentsRecordedBy' parameters type */
export interface CountPaymentsRecordedByParams {
  userId: string;
}

/** 'CountPaymentsRecordedBy' return type */
export interface CountPaymentsRecordedByResult {
  count: number | null;
}

/** 'CountPaymentsRecordedBy' query type */
export interface CountPaymentsRecordedByQuery {
  params: CountPaymentsRecordedByParams;
  result: CountPaymentsRecordedByResult;
}

const countPaymentsRecordedByIR: any = {"usedParamSet":{"userId":true},"params":[{"name":"userId","required":true,"transform":{"type":"scalar"},"locs":[{"a":64,"b":71}]}],"statement":"SELECT COUNT(*)::int as count\nFROM payments\nWHERE recorded_by = :userId!"};

/**
 * Query generated from SQL:
 * ```
 * SELECT COUNT(*)::int as count
 * FROM payments
 * WHERE recorded_by = :userId!
 * ```
 */
export const countPaymentsRecordedBy = new PreparedQuery<CountPaymentsRecordedByParams,CountPaymentsRecordedByResult>(countPaymentsRecordedByIR);


/** 'DeleteUserInBranch' parameters type */
export interface DeleteUserInBranchParams {
  branchId: string;
  userId: string;
}

/** 'DeleteUserInBranch' return type */
export interface DeleteUserInBranchResult {
  id: string;
}

/** 'DeleteUserInBranch' query type */
export interface DeleteUserInBranchQuery {
  params: DeleteUserInBranchParams;
  result: DeleteUserInBranchResult;
}

const deleteUserInBranchIR: any = {"usedParamSet":{"userId":true,"branchId":true},"params":[{"name":"userId","required":true,"transform":{"type":"scalar"},"locs":[{"a":30,"b":37}]},{"name":"branchId","required":true,"transform":{"type":"scalar"},"locs":[{"a":57,"b":66}]}],"statement":"DELETE FROM \"user\"\nWHERE id = :userId!\n  AND branch_id = :branchId!\nRETURNING id"};

/**
 * Query generated from SQL:
 * ```
 * DELETE FROM "user"
 * WHERE id = :userId!
 *   AND branch_id = :branchId!
 * RETURNING id
 * ```
 */
export const deleteUserInBranch = new PreparedQuery<DeleteUserInBranchParams,DeleteUserInBranchResult>(deleteUserInBranchIR);


/** 'CreateUserWithRole' parameters type */
export interface CreateUserWithRoleParams {
  branchId: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string | null | void;
  role: user_role;
}

/** 'CreateUserWithRole' return type */
export interface CreateUserWithRoleResult {
  id: string;
}

/** 'CreateUserWithRole' query type */
export interface CreateUserWithRoleQuery {
  params: CreateUserWithRoleParams;
  result: CreateUserWithRoleResult;
}

const createUserWithRoleIR: any = {"usedParamSet":{"email":true,"firstName":true,"lastName":true,"phone":true,"role":true,"branchId":true},"params":[{"name":"email","required":true,"transform":{"type":"scalar"},"locs":[{"a":99,"b":105}]},{"name":"firstName","required":true,"transform":{"type":"scalar"},"locs":[{"a":110,"b":120}]},{"name":"lastName","required":true,"transform":{"type":"scalar"},"locs":[{"a":125,"b":134}]},{"name":"phone","required":false,"transform":{"type":"scalar"},"locs":[{"a":139,"b":144}]},{"name":"role","required":true,"transform":{"type":"scalar"},"locs":[{"a":149,"b":154}]},{"name":"branchId","required":true,"transform":{"type":"scalar"},"locs":[{"a":159,"b":168}]}],"statement":"INSERT INTO \"user\" (\n  email,\n  first_name,\n  last_name,\n  phone,\n  role,\n  branch_id\n) VALUES (\n  :email!,\n  :firstName!,\n  :lastName!,\n  :phone,\n  :role!,\n  :branchId!\n)\nRETURNING id"};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO "user" (
 *   email,
 *   first_name,
 *   last_name,
 *   phone,
 *   role,
 *   branch_id
 * ) VALUES (
 *   :email!,
 *   :firstName!,
 *   :lastName!,
 *   :phone,
 *   :role!,
 *   :branchId!
 * )
 * RETURNING id
 * ```
 */
export const createUserWithRole = new PreparedQuery<CreateUserWithRoleParams,CreateUserWithRoleResult>(createUserWithRoleIR);


/** 'CreateAccountCredential' parameters type */
export interface CreateAccountCredentialParams {
  accountId: string;
  password: string;
  userId: string;
}

/** 'CreateAccountCredential' return type */
export interface CreateAccountCredentialResult {
  id: string;
}

/** 'CreateAccountCredential' query type */
export interface CreateAccountCredentialQuery {
  params: CreateAccountCredentialParams;
  result: CreateAccountCredentialResult;
}

const createAccountCredentialIR: any = {"usedParamSet":{"userId":true,"accountId":true,"password":true},"params":[{"name":"userId","required":true,"transform":{"type":"scalar"},"locs":[{"a":78,"b":85}]},{"name":"accountId","required":true,"transform":{"type":"scalar"},"locs":[{"a":88,"b":98}]},{"name":"password","required":true,"transform":{"type":"scalar"},"locs":[{"a":115,"b":124}]}],"statement":"INSERT INTO \"account\" (\"userId\", \"accountId\", \"providerId\", password)\nVALUES (:userId!, :accountId!, 'credential', :password!)\nRETURNING id"};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO "account" ("userId", "accountId", "providerId", password)
 * VALUES (:userId!, :accountId!, 'credential', :password!)
 * RETURNING id
 * ```
 */
export const createAccountCredential = new PreparedQuery<CreateAccountCredentialParams,CreateAccountCredentialResult>(createAccountCredentialIR);


/** 'DeleteUser' parameters type */
export interface DeleteUserParams {
  userId: string;
}

/** 'DeleteUser' return type */
export type DeleteUserResult = void;

/** 'DeleteUser' query type */
export interface DeleteUserQuery {
  params: DeleteUserParams;
  result: DeleteUserResult;
}

const deleteUserIR: any = {"usedParamSet":{"userId":true},"params":[{"name":"userId","required":true,"transform":{"type":"scalar"},"locs":[{"a":30,"b":37}]}],"statement":"DELETE FROM \"user\"\nWHERE id = :userId!"};

/**
 * Query generated from SQL:
 * ```
 * DELETE FROM "user"
 * WHERE id = :userId!
 * ```
 */
export const deleteUser = new PreparedQuery<DeleteUserParams,DeleteUserResult>(deleteUserIR);


/** 'GetAllUsers' parameters type */
export interface GetAllUsersParams {
  branchId: string;
}

/** 'GetAllUsers' return type */
export interface GetAllUsersResult {
  branch_id: string | null;
  branch_name: string;
  created_at: Date | null;
  email: string;
  first_name: string | null;
  id: string;
  last_name: string | null;
  phone: string | null;
  role: user_role;
}

/** 'GetAllUsers' query type */
export interface GetAllUsersQuery {
  params: GetAllUsersParams;
  result: GetAllUsersResult;
}

const getAllUsersIR: any = {"usedParamSet":{"branchId":true},"params":[{"name":"branchId","required":true,"transform":{"type":"scalar"},"locs":[{"a":225,"b":234}]}],"statement":"SELECT\n  u.id,\n  u.email,\n  u.first_name,\n  u.last_name,\n  u.phone,\n  u.role,\n  u.branch_id,\n  u.\"createdAt\" as created_at,\n  b.name as branch_name\nFROM \"user\" u\nLEFT JOIN branches b ON u.branch_id = b.id\nWHERE u.branch_id = :branchId!\nORDER BY u.\"createdAt\" DESC"};

/**
 * Query generated from SQL:
 * ```
 * SELECT
 *   u.id,
 *   u.email,
 *   u.first_name,
 *   u.last_name,
 *   u.phone,
 *   u.role,
 *   u.branch_id,
 *   u."createdAt" as created_at,
 *   b.name as branch_name
 * FROM "user" u
 * LEFT JOIN branches b ON u.branch_id = b.id
 * WHERE u.branch_id = :branchId!
 * ORDER BY u."createdAt" DESC
 * ```
 */
export const getAllUsers = new PreparedQuery<GetAllUsersParams,GetAllUsersResult>(getAllUsersIR);


/** 'GetUsersPaginated' parameters type */
export interface GetUsersPaginatedParams {
  branchId: string;
  limit: NumberOrString;
  offset: NumberOrString;
  role?: string | null | void;
}

/** 'GetUsersPaginated' return type */
export interface GetUsersPaginatedResult {
  branch_id: string | null;
  branch_name: string;
  created_at: Date | null;
  email: string;
  first_name: string | null;
  id: string;
  last_name: string | null;
  phone: string | null;
  role: user_role;
}

/** 'GetUsersPaginated' query type */
export interface GetUsersPaginatedQuery {
  params: GetUsersPaginatedParams;
  result: GetUsersPaginatedResult;
}

const getUsersPaginatedIR: any = {"usedParamSet":{"branchId":true,"role":true,"limit":true,"offset":true},"params":[{"name":"branchId","required":true,"transform":{"type":"scalar"},"locs":[{"a":225,"b":234}]},{"name":"role","required":false,"transform":{"type":"scalar"},"locs":[{"a":243,"b":247},{"a":275,"b":279}]},{"name":"limit","required":true,"transform":{"type":"scalar"},"locs":[{"a":327,"b":333}]},{"name":"offset","required":true,"transform":{"type":"scalar"},"locs":[{"a":342,"b":349}]}],"statement":"SELECT\n  u.id,\n  u.email,\n  u.first_name,\n  u.last_name,\n  u.phone,\n  u.role,\n  u.branch_id,\n  u.\"createdAt\" as created_at,\n  b.name as branch_name\nFROM \"user\" u\nLEFT JOIN branches b ON u.branch_id = b.id\nWHERE u.branch_id = :branchId!\n  AND (:role::text IS NULL OR u.role = :role::user_role)\nORDER BY u.\"createdAt\" DESC\nLIMIT :limit!\nOFFSET :offset!"};

/**
 * Query generated from SQL:
 * ```
 * SELECT
 *   u.id,
 *   u.email,
 *   u.first_name,
 *   u.last_name,
 *   u.phone,
 *   u.role,
 *   u.branch_id,
 *   u."createdAt" as created_at,
 *   b.name as branch_name
 * FROM "user" u
 * LEFT JOIN branches b ON u.branch_id = b.id
 * WHERE u.branch_id = :branchId!
 *   AND (:role::text IS NULL OR u.role = :role::user_role)
 * ORDER BY u."createdAt" DESC
 * LIMIT :limit!
 * OFFSET :offset!
 * ```
 */
export const getUsersPaginated = new PreparedQuery<GetUsersPaginatedParams,GetUsersPaginatedResult>(getUsersPaginatedIR);


/** 'GetUsersCount' parameters type */
export interface GetUsersCountParams {
  branchId: string;
  role?: string | null | void;
}

/** 'GetUsersCount' return type */
export interface GetUsersCountResult {
  total: number | null;
}

/** 'GetUsersCount' query type */
export interface GetUsersCountQuery {
  params: GetUsersCountParams;
  result: GetUsersCountResult;
}

const getUsersCountIR: any = {"usedParamSet":{"branchId":true,"role":true},"params":[{"name":"branchId","required":true,"transform":{"type":"scalar"},"locs":[{"a":64,"b":73}]},{"name":"role","required":false,"transform":{"type":"scalar"},"locs":[{"a":82,"b":86},{"a":114,"b":118}]}],"statement":"SELECT COUNT(*)::int as total\nFROM \"user\" u\nWHERE u.branch_id = :branchId!\n  AND (:role::text IS NULL OR u.role = :role::user_role)"};

/**
 * Query generated from SQL:
 * ```
 * SELECT COUNT(*)::int as total
 * FROM "user" u
 * WHERE u.branch_id = :branchId!
 *   AND (:role::text IS NULL OR u.role = :role::user_role)
 * ```
 */
export const getUsersCount = new PreparedQuery<GetUsersCountParams,GetUsersCountResult>(getUsersCountIR);


/** 'GetAllPackageTemplates' parameters type */
export interface GetAllPackageTemplatesParams {
  branchId: string;
}

/** 'GetAllPackageTemplates' return type */
export interface GetAllPackageTemplatesResult {
  branch_id: string;
  class_count: number;
  created_at: Date | null;
  description: string | null;
  id: string;
  is_active: boolean | null;
  name: string;
  price: string;
  updated_at: Date | null;
  validity_period: number | null;
  validity_type: string;
}

/** 'GetAllPackageTemplates' query type */
export interface GetAllPackageTemplatesQuery {
  params: GetAllPackageTemplatesParams;
  result: GetAllPackageTemplatesResult;
}

const getAllPackageTemplatesIR: any = {"usedParamSet":{"branchId":true},"params":[{"name":"branchId","required":true,"transform":{"type":"scalar"},"locs":[{"a":196,"b":205}]}],"statement":"SELECT\n  id,\n  branch_id,\n  name,\n  description,\n  price,\n  class_count,\n  validity_type,\n  validity_period,\n  is_active,\n  created_at,\n  updated_at\nFROM class_package_templates\nWHERE branch_id = :branchId!\nORDER BY is_active DESC, display_order, created_at DESC"};

/**
 * Query generated from SQL:
 * ```
 * SELECT
 *   id,
 *   branch_id,
 *   name,
 *   description,
 *   price,
 *   class_count,
 *   validity_type,
 *   validity_period,
 *   is_active,
 *   created_at,
 *   updated_at
 * FROM class_package_templates
 * WHERE branch_id = :branchId!
 * ORDER BY is_active DESC, display_order, created_at DESC
 * ```
 */
export const getAllPackageTemplates = new PreparedQuery<GetAllPackageTemplatesParams,GetAllPackageTemplatesResult>(getAllPackageTemplatesIR);


/** 'GetPackageInvitations' parameters type */
export interface GetPackageInvitationsParams {
  branchId: string;
}

/** 'GetPackageInvitations' return type */
export interface GetPackageInvitationsResult {
  code: string;
  created_at: Date | null;
  created_by_name: string | null;
  expires_at: Date | null;
  id: string;
  is_active: boolean | null;
  package_name: string;
}

/** 'GetPackageInvitations' query type */
export interface GetPackageInvitationsQuery {
  params: GetPackageInvitationsParams;
  result: GetPackageInvitationsResult;
}

const getPackageInvitationsIR: any = {"usedParamSet":{"branchId":true},"params":[{"name":"branchId","required":true,"transform":{"type":"scalar"},"locs":[{"a":312,"b":321}]}],"statement":"SELECT\n  pi.id,\n  pi.code,\n  pi.expires_at,\n  pi.is_active,\n  pi.created_at,\n  cpt.name as package_name,\n  u.first_name || ' ' || u.last_name as created_by_name\nFROM package_invitations pi\nJOIN class_package_templates cpt ON pi.package_id = cpt.id\nLEFT JOIN \"user\" u ON pi.created_by = u.id\nWHERE pi.branch_id = :branchId!\nORDER BY pi.created_at DESC\nLIMIT 50"};

/**
 * Query generated from SQL:
 * ```
 * SELECT
 *   pi.id,
 *   pi.code,
 *   pi.expires_at,
 *   pi.is_active,
 *   pi.created_at,
 *   cpt.name as package_name,
 *   u.first_name || ' ' || u.last_name as created_by_name
 * FROM package_invitations pi
 * JOIN class_package_templates cpt ON pi.package_id = cpt.id
 * LEFT JOIN "user" u ON pi.created_by = u.id
 * WHERE pi.branch_id = :branchId!
 * ORDER BY pi.created_at DESC
 * LIMIT 50
 * ```
 */
export const getPackageInvitations = new PreparedQuery<GetPackageInvitationsParams,GetPackageInvitationsResult>(getPackageInvitationsIR);


/** 'GetClientPackages' parameters type */
export interface GetClientPackagesParams {
  userId: string;
}

/** 'GetClientPackages' return type */
export interface GetClientPackagesResult {
  classes_remaining: number;
  created_at: Date | null;
  expires_at: Date | null;
  id: string;
  package_name: string;
  package_template_id: string;
  purchased_at: Date | null;
  status: string | null;
  total_classes: number;
  validity_type: string;
}

/** 'GetClientPackages' query type */
export interface GetClientPackagesQuery {
  params: GetClientPackagesParams;
  result: GetClientPackagesResult;
}

const getClientPackagesIR: any = {"usedParamSet":{"userId":true},"params":[{"name":"userId","required":true,"transform":{"type":"scalar"},"locs":[{"a":326,"b":333}]}],"statement":"SELECT\n  ucp.id,\n  ucp.package_template_id,\n  ucp.purchased_at,\n  ucp.expires_at,\n  ucp.classes_remaining,\n  ucp.total_classes,\n  ucp.status,\n  ucp.created_at,\n  cpt.name as package_name,\n  cpt.validity_type\nFROM user_class_packages ucp\nJOIN class_package_templates cpt ON ucp.package_template_id = cpt.id\nWHERE ucp.user_id = :userId!\nORDER BY ucp.purchased_at DESC"};

/**
 * Query generated from SQL:
 * ```
 * SELECT
 *   ucp.id,
 *   ucp.package_template_id,
 *   ucp.purchased_at,
 *   ucp.expires_at,
 *   ucp.classes_remaining,
 *   ucp.total_classes,
 *   ucp.status,
 *   ucp.created_at,
 *   cpt.name as package_name,
 *   cpt.validity_type
 * FROM user_class_packages ucp
 * JOIN class_package_templates cpt ON ucp.package_template_id = cpt.id
 * WHERE ucp.user_id = :userId!
 * ORDER BY ucp.purchased_at DESC
 * ```
 */
export const getClientPackages = new PreparedQuery<GetClientPackagesParams,GetClientPackagesResult>(getClientPackagesIR);


/** 'GetClientBookings' parameters type */
export interface GetClientBookingsParams {
  userId: string;
}

/** 'GetClientBookings' return type */
export interface GetClientBookingsResult {
  booked_at: Date | null;
  cancelled_at: Date | null;
  class_id: string;
  class_name: string;
  created_at: Date | null;
  duration_minutes: number;
  id: string;
  instructor_name: string | null;
  scheduled_at: Date;
  status: booking_status;
  waitlist_position: number | null;
}

/** 'GetClientBookings' query type */
export interface GetClientBookingsQuery {
  params: GetClientBookingsParams;
  result: GetClientBookingsResult;
}

const getClientBookingsIR: any = {"usedParamSet":{"userId":true},"params":[{"name":"userId","required":true,"transform":{"type":"scalar"},"locs":[{"a":281,"b":288}]}],"statement":"SELECT\n  b.id,\n  b.class_id,\n  b.status,\n  b.waitlist_position,\n  b.booked_at,\n  b.cancelled_at,\n  b.created_at,\n  c.name as class_name,\n  c.instructor as instructor_name,\n  c.scheduled_at,\n  c.duration_minutes\nFROM bookings b\nJOIN classes c ON b.class_id = c.id\nWHERE b.user_id = :userId!\nORDER BY c.scheduled_at DESC"};

/**
 * Query generated from SQL:
 * ```
 * SELECT
 *   b.id,
 *   b.class_id,
 *   b.status,
 *   b.waitlist_position,
 *   b.booked_at,
 *   b.cancelled_at,
 *   b.created_at,
 *   c.name as class_name,
 *   c.instructor as instructor_name,
 *   c.scheduled_at,
 *   c.duration_minutes
 * FROM bookings b
 * JOIN classes c ON b.class_id = c.id
 * WHERE b.user_id = :userId!
 * ORDER BY c.scheduled_at DESC
 * ```
 */
export const getClientBookings = new PreparedQuery<GetClientBookingsParams,GetClientBookingsResult>(getClientBookingsIR);


/** 'GetAllPayments' parameters type */
export interface GetAllPaymentsParams {
  branchId: string;
}

/** 'GetAllPayments' return type */
export interface GetAllPaymentsResult {
  amount: string;
  created_at: Date | null;
  email: string;
  first_name: string | null;
  id: string;
  last_name: string | null;
  notes: string | null;
  payment_date: Date;
  recorded_by_name: string | null;
  user_id: string;
}

/** 'GetAllPayments' query type */
export interface GetAllPaymentsQuery {
  params: GetAllPaymentsParams;
  result: GetAllPaymentsResult;
}

const getAllPaymentsIR: any = {"usedParamSet":{"branchId":true},"params":[{"name":"branchId","required":true,"transform":{"type":"scalar"},"locs":[{"a":346,"b":355}]}],"statement":"SELECT\n  p.id,\n  p.user_id,\n  p.amount,\n  p.payment_date,\n  p.notes,\n  p.created_at,\n  u.first_name,\n  u.last_name,\n  u.email,\n  COALESCE(recorder.first_name || ' ' || recorder.last_name, 'Sistema') as recorded_by_name\nFROM payments p\nJOIN \"user\" u ON p.user_id = u.id\nLEFT JOIN \"user\" recorder ON p.recorded_by = recorder.id\nWHERE u.branch_id = :branchId!\nORDER BY p.payment_date DESC"};

/**
 * Query generated from SQL:
 * ```
 * SELECT
 *   p.id,
 *   p.user_id,
 *   p.amount,
 *   p.payment_date,
 *   p.notes,
 *   p.created_at,
 *   u.first_name,
 *   u.last_name,
 *   u.email,
 *   COALESCE(recorder.first_name || ' ' || recorder.last_name, 'Sistema') as recorded_by_name
 * FROM payments p
 * JOIN "user" u ON p.user_id = u.id
 * LEFT JOIN "user" recorder ON p.recorded_by = recorder.id
 * WHERE u.branch_id = :branchId!
 * ORDER BY p.payment_date DESC
 * ```
 */
export const getAllPayments = new PreparedQuery<GetAllPaymentsParams,GetAllPaymentsResult>(getAllPaymentsIR);


/** 'GetCurrentBranchContext' parameters type */
export interface GetCurrentBranchContextParams {
  userId: string;
}

/** 'GetCurrentBranchContext' return type */
export interface GetCurrentBranchContextResult {
  branch_id: string | null;
  branch_name: string;
  id: string;
  role: user_role;
}

/** 'GetCurrentBranchContext' query type */
export interface GetCurrentBranchContextQuery {
  params: GetCurrentBranchContextParams;
  result: GetCurrentBranchContextResult;
}

const getCurrentBranchContextIR: any = {"usedParamSet":{"userId":true},"params":[{"name":"userId","required":true,"transform":{"type":"scalar"},"locs":[{"a":134,"b":141}]}],"statement":"SELECT\n  u.id,\n  u.role,\n  u.branch_id,\n  b.name as branch_name\nFROM \"user\" u\nLEFT JOIN branches b ON u.branch_id = b.id\nWHERE u.id = :userId!"};

/**
 * Query generated from SQL:
 * ```
 * SELECT
 *   u.id,
 *   u.role,
 *   u.branch_id,
 *   b.name as branch_name
 * FROM "user" u
 * LEFT JOIN branches b ON u.branch_id = b.id
 * WHERE u.id = :userId!
 * ```
 */
export const getCurrentBranchContext = new PreparedQuery<GetCurrentBranchContextParams,GetCurrentBranchContextResult>(getCurrentBranchContextIR);


/** 'GetUserDetails' parameters type */
export interface GetUserDetailsParams {
  branchId: string;
  userId: string;
}

/** 'GetUserDetails' return type */
export interface GetUserDetailsResult {
  address: string | null;
  created_at: Date | null;
  date_of_birth: Date | null;
  email: string;
  first_name: string | null;
  id: string;
  id_number: string | null;
  last_name: string | null;
  phone: string | null;
}

/** 'GetUserDetails' query type */
export interface GetUserDetailsQuery {
  params: GetUserDetailsParams;
  result: GetUserDetailsResult;
}

const getUserDetailsIR: any = {"usedParamSet":{"userId":true,"branchId":true},"params":[{"name":"userId","required":true,"transform":{"type":"scalar"},"locs":[{"a":150,"b":157}]},{"name":"branchId","required":true,"transform":{"type":"scalar"},"locs":[{"a":175,"b":184}]}],"statement":"SELECT\n  id,\n  email,\n  first_name,\n  last_name,\n  phone,\n  date_of_birth,\n  id_number,\n  address,\n  \"createdAt\" as created_at\nFROM \"user\"\nWHERE id = :userId! AND branch_id = :branchId!"};

/**
 * Query generated from SQL:
 * ```
 * SELECT
 *   id,
 *   email,
 *   first_name,
 *   last_name,
 *   phone,
 *   date_of_birth,
 *   id_number,
 *   address,
 *   "createdAt" as created_at
 * FROM "user"
 * WHERE id = :userId! AND branch_id = :branchId!
 * ```
 */
export const getUserDetails = new PreparedQuery<GetUserDetailsParams,GetUserDetailsResult>(getUserDetailsIR);


/** 'CreateAdminClass' parameters type */
export interface CreateAdminClassParams {
  bookingHoursBefore?: number | null | void;
  branchId: string;
  capacity: number;
  durationMinutes: number;
  instructor: string;
  name: string;
  scheduledAt: DateOrString;
  waitlistCapacity: number;
}

/** 'CreateAdminClass' return type */
export interface CreateAdminClassResult {
  /** Minimum hours before class start time that users can book. NULL = use branch default */
  booking_hours_before: number | null;
  capacity: number;
  duration_minutes: number;
  id: string;
  instructor: string | null;
  name: string;
  scheduled_at: Date;
  waitlist_capacity: number;
}

/** 'CreateAdminClass' query type */
export interface CreateAdminClassQuery {
  params: CreateAdminClassParams;
  result: CreateAdminClassResult;
}

const createAdminClassIR: any = {"usedParamSet":{"branchId":true,"name":true,"instructor":true,"scheduledAt":true,"durationMinutes":true,"capacity":true,"waitlistCapacity":true,"bookingHoursBefore":true},"params":[{"name":"branchId","required":true,"transform":{"type":"scalar"},"locs":[{"a":162,"b":171}]},{"name":"name","required":true,"transform":{"type":"scalar"},"locs":[{"a":176,"b":181}]},{"name":"instructor","required":true,"transform":{"type":"scalar"},"locs":[{"a":186,"b":197}]},{"name":"scheduledAt","required":true,"transform":{"type":"scalar"},"locs":[{"a":202,"b":214}]},{"name":"durationMinutes","required":true,"transform":{"type":"scalar"},"locs":[{"a":219,"b":235}]},{"name":"capacity","required":true,"transform":{"type":"scalar"},"locs":[{"a":240,"b":249}]},{"name":"waitlistCapacity","required":true,"transform":{"type":"scalar"},"locs":[{"a":254,"b":271}]},{"name":"bookingHoursBefore","required":false,"transform":{"type":"scalar"},"locs":[{"a":276,"b":294}]}],"statement":"INSERT INTO classes (\n  branch_id,\n  name,\n  instructor,\n  scheduled_at,\n  duration_minutes,\n  capacity,\n  waitlist_capacity,\n  booking_hours_before\n) VALUES (\n  :branchId!,\n  :name!,\n  :instructor!,\n  :scheduledAt!,\n  :durationMinutes!,\n  :capacity!,\n  :waitlistCapacity!,\n  :bookingHoursBefore\n)\nRETURNING id, name, instructor, scheduled_at, duration_minutes, capacity, waitlist_capacity, booking_hours_before"};

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
 *   waitlist_capacity,
 *   booking_hours_before
 * ) VALUES (
 *   :branchId!,
 *   :name!,
 *   :instructor!,
 *   :scheduledAt!,
 *   :durationMinutes!,
 *   :capacity!,
 *   :waitlistCapacity!,
 *   :bookingHoursBefore
 * )
 * RETURNING id, name, instructor, scheduled_at, duration_minutes, capacity, waitlist_capacity, booking_hours_before
 * ```
 */
export const createAdminClass = new PreparedQuery<CreateAdminClassParams,CreateAdminClassResult>(createAdminClassIR);


/** 'UpdateAdminClass' parameters type */
export interface UpdateAdminClassParams {
  bookingHoursBefore?: number | null | void;
  branchId: string;
  capacity: number;
  classId: string;
  durationMinutes: number;
  instructor: string;
  name: string;
  scheduledAt: DateOrString;
  waitlistCapacity: number;
}

/** 'UpdateAdminClass' return type */
export interface UpdateAdminClassResult {
  id: string;
}

/** 'UpdateAdminClass' query type */
export interface UpdateAdminClassQuery {
  params: UpdateAdminClassParams;
  result: UpdateAdminClassResult;
}

const updateAdminClassIR: any = {"usedParamSet":{"name":true,"instructor":true,"scheduledAt":true,"durationMinutes":true,"capacity":true,"waitlistCapacity":true,"bookingHoursBefore":true,"classId":true,"branchId":true},"params":[{"name":"name","required":true,"transform":{"type":"scalar"},"locs":[{"a":28,"b":33}]},{"name":"instructor","required":true,"transform":{"type":"scalar"},"locs":[{"a":51,"b":62}]},{"name":"scheduledAt","required":true,"transform":{"type":"scalar"},"locs":[{"a":82,"b":94}]},{"name":"durationMinutes","required":true,"transform":{"type":"scalar"},"locs":[{"a":118,"b":134}]},{"name":"capacity","required":true,"transform":{"type":"scalar"},"locs":[{"a":150,"b":159}]},{"name":"waitlistCapacity","required":true,"transform":{"type":"scalar"},"locs":[{"a":184,"b":201}]},{"name":"bookingHoursBefore","required":false,"transform":{"type":"scalar"},"locs":[{"a":229,"b":247}]},{"name":"classId","required":true,"transform":{"type":"scalar"},"locs":[{"a":294,"b":302}]},{"name":"branchId","required":true,"transform":{"type":"scalar"},"locs":[{"a":322,"b":331}]}],"statement":"UPDATE classes\nSET\n  name = :name!,\n  instructor = :instructor!,\n  scheduled_at = :scheduledAt!,\n  duration_minutes = :durationMinutes!,\n  capacity = :capacity!,\n  waitlist_capacity = :waitlistCapacity!,\n  booking_hours_before = :bookingHoursBefore,\n  updated_at = CURRENT_TIMESTAMP\nWHERE id = :classId!\n  AND branch_id = :branchId!\nRETURNING id"};

/**
 * Query generated from SQL:
 * ```
 * UPDATE classes
 * SET
 *   name = :name!,
 *   instructor = :instructor!,
 *   scheduled_at = :scheduledAt!,
 *   duration_minutes = :durationMinutes!,
 *   capacity = :capacity!,
 *   waitlist_capacity = :waitlistCapacity!,
 *   booking_hours_before = :bookingHoursBefore,
 *   updated_at = CURRENT_TIMESTAMP
 * WHERE id = :classId!
 *   AND branch_id = :branchId!
 * RETURNING id
 * ```
 */
export const updateAdminClass = new PreparedQuery<UpdateAdminClassParams,UpdateAdminClassResult>(updateAdminClassIR);


/** 'DeleteAdminClass' parameters type */
export interface DeleteAdminClassParams {
  branchId: string;
  classId: string;
}

/** 'DeleteAdminClass' return type */
export interface DeleteAdminClassResult {
  id: string;
}

/** 'DeleteAdminClass' query type */
export interface DeleteAdminClassQuery {
  params: DeleteAdminClassParams;
  result: DeleteAdminClassResult;
}

const deleteAdminClassIR: any = {"usedParamSet":{"classId":true,"branchId":true},"params":[{"name":"classId","required":true,"transform":{"type":"scalar"},"locs":[{"a":31,"b":39}]},{"name":"branchId","required":true,"transform":{"type":"scalar"},"locs":[{"a":59,"b":68}]}],"statement":"DELETE FROM classes\nWHERE id = :classId!\n  AND branch_id = :branchId!\nRETURNING id"};

/**
 * Query generated from SQL:
 * ```
 * DELETE FROM classes
 * WHERE id = :classId!
 *   AND branch_id = :branchId!
 * RETURNING id
 * ```
 */
export const deleteAdminClass = new PreparedQuery<DeleteAdminClassParams,DeleteAdminClassResult>(deleteAdminClassIR);


/** 'GetAdminClassesByMonth' parameters type */
export interface GetAdminClassesByMonthParams {
  branchId: string;
  month: NumberOrString;
  year: NumberOrString;
}

/** 'GetAdminClassesByMonth' return type */
export interface GetAdminClassesByMonthResult {
  capacity: number;
  confirmed_count: number | null;
  duration_minutes: number;
  id: string;
  instructor: string | null;
  name: string;
  scheduled_at: Date | null;
  waitlist_capacity: number;
  waitlist_count: number | null;
}

/** 'GetAdminClassesByMonth' query type */
export interface GetAdminClassesByMonthQuery {
  params: GetAdminClassesByMonthParams;
  result: GetAdminClassesByMonthResult;
}

const getAdminClassesByMonthIR: any = {"usedParamSet":{"branchId":true,"year":true,"month":true},"params":[{"name":"branchId","required":true,"transform":{"type":"scalar"},"locs":[{"a":425,"b":434}]},{"name":"year","required":true,"transform":{"type":"scalar"},"locs":[{"a":511,"b":516}]},{"name":"month","required":true,"transform":{"type":"scalar"},"locs":[{"a":594,"b":600}]}],"statement":"SELECT\n  c.id,\n  c.name,\n  c.instructor,\n  (c.scheduled_at AT TIME ZONE 'America/Guayaquil') as scheduled_at,\n  c.duration_minutes,\n  c.capacity,\n  c.waitlist_capacity,\n  COUNT(DISTINCT CASE WHEN b.status = 'confirmed' THEN b.id END)::int as confirmed_count,\n  COUNT(DISTINCT CASE WHEN b.status = 'waitlisted' THEN b.id END)::int as waitlist_count\nFROM classes c\nLEFT JOIN bookings b ON c.id = b.class_id\nWHERE c.branch_id = :branchId!\n  AND EXTRACT(YEAR FROM c.scheduled_at AT TIME ZONE 'America/Guayaquil') = :year!\n  AND EXTRACT(MONTH FROM c.scheduled_at AT TIME ZONE 'America/Guayaquil') = :month!\nGROUP BY c.id, c.name, c.instructor, c.scheduled_at, c.duration_minutes, c.capacity, c.waitlist_capacity\nORDER BY c.scheduled_at"};

/**
 * Query generated from SQL:
 * ```
 * SELECT
 *   c.id,
 *   c.name,
 *   c.instructor,
 *   (c.scheduled_at AT TIME ZONE 'America/Guayaquil') as scheduled_at,
 *   c.duration_minutes,
 *   c.capacity,
 *   c.waitlist_capacity,
 *   COUNT(DISTINCT CASE WHEN b.status = 'confirmed' THEN b.id END)::int as confirmed_count,
 *   COUNT(DISTINCT CASE WHEN b.status = 'waitlisted' THEN b.id END)::int as waitlist_count
 * FROM classes c
 * LEFT JOIN bookings b ON c.id = b.class_id
 * WHERE c.branch_id = :branchId!
 *   AND EXTRACT(YEAR FROM c.scheduled_at AT TIME ZONE 'America/Guayaquil') = :year!
 *   AND EXTRACT(MONTH FROM c.scheduled_at AT TIME ZONE 'America/Guayaquil') = :month!
 * GROUP BY c.id, c.name, c.instructor, c.scheduled_at, c.duration_minutes, c.capacity, c.waitlist_capacity
 * ORDER BY c.scheduled_at
 * ```
 */
export const getAdminClassesByMonth = new PreparedQuery<GetAdminClassesByMonthParams,GetAdminClassesByMonthResult>(getAdminClassesByMonthIR);


