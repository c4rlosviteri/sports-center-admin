/** Types generated for queries found in "src/db/queries/branches.sql" */
import { PreparedQuery } from '@pgtyped/runtime';

export type notification_type = 'booking_cancellation' | 'booking_confirmation' | 'package_expiration' | 'waitlist_promotion';

export type user_role = 'admin' | 'client' | 'superuser';

/** 'GetAllBranches' parameters type */
export type GetAllBranchesParams = void;

/** 'GetAllBranches' return type */
export interface GetAllBranchesResult {
  address: string | null;
  /** Minimum hours before class start time that users can book (0 = no restriction) */
  booking_hours_before: number;
  cancellation_hours_before: number;
  created_at: Date | null;
  email: string | null;
  id: string;
  is_active: boolean | null;
  name: string;
  phone: string | null;
  updated_at: Date | null;
}

/** 'GetAllBranches' query type */
export interface GetAllBranchesQuery {
  params: GetAllBranchesParams;
  result: GetAllBranchesResult;
}

const getAllBranchesIR: any = {"usedParamSet":{},"params":[],"statement":"SELECT\n  b.id,\n  b.name,\n  b.address,\n  b.phone,\n  b.email,\n  b.is_active,\n  b.created_at,\n  b.updated_at,\n  bs.cancellation_hours_before,\n  bs.booking_hours_before\nFROM branches b\nLEFT JOIN branch_settings bs ON b.id = bs.branch_id\nORDER BY b.name ASC"};

/**
 * Query generated from SQL:
 * ```
 * SELECT
 *   b.id,
 *   b.name,
 *   b.address,
 *   b.phone,
 *   b.email,
 *   b.is_active,
 *   b.created_at,
 *   b.updated_at,
 *   bs.cancellation_hours_before,
 *   bs.booking_hours_before
 * FROM branches b
 * LEFT JOIN branch_settings bs ON b.id = bs.branch_id
 * ORDER BY b.name ASC
 * ```
 */
export const getAllBranches = new PreparedQuery<GetAllBranchesParams,GetAllBranchesResult>(getAllBranchesIR);


/** 'GetAdminBranches' parameters type */
export interface GetAdminBranchesParams {
  adminId: string;
}

/** 'GetAdminBranches' return type */
export interface GetAdminBranchesResult {
  address: string | null;
  /** Minimum hours before class start time that users can book (0 = no restriction) */
  booking_hours_before: number;
  cancellation_hours_before: number;
  created_at: Date | null;
  email: string | null;
  id: string;
  is_active: boolean | null;
  is_primary: boolean | null;
  name: string;
  phone: string | null;
  updated_at: Date | null;
}

/** 'GetAdminBranches' query type */
export interface GetAdminBranchesQuery {
  params: GetAdminBranchesParams;
  result: GetAdminBranchesResult;
}

const getAdminBranchesIR: any = {"usedParamSet":{"adminId":true},"params":[{"name":"adminId","required":true,"transform":{"type":"scalar"},"locs":[{"a":336,"b":344}]}],"statement":"SELECT\n  b.id,\n  b.name,\n  b.address,\n  b.phone,\n  b.email,\n  b.is_active,\n  aba.is_primary,\n  b.created_at,\n  b.updated_at,\n  bs.cancellation_hours_before,\n  bs.booking_hours_before\nFROM branches b\nINNER JOIN admin_branch_assignments aba ON b.id = aba.branch_id\nLEFT JOIN branch_settings bs ON b.id = bs.branch_id\nWHERE aba.admin_id = :adminId! AND b.is_active = true\nORDER BY aba.is_primary DESC, b.name ASC"};

/**
 * Query generated from SQL:
 * ```
 * SELECT
 *   b.id,
 *   b.name,
 *   b.address,
 *   b.phone,
 *   b.email,
 *   b.is_active,
 *   aba.is_primary,
 *   b.created_at,
 *   b.updated_at,
 *   bs.cancellation_hours_before,
 *   bs.booking_hours_before
 * FROM branches b
 * INNER JOIN admin_branch_assignments aba ON b.id = aba.branch_id
 * LEFT JOIN branch_settings bs ON b.id = bs.branch_id
 * WHERE aba.admin_id = :adminId! AND b.is_active = true
 * ORDER BY aba.is_primary DESC, b.name ASC
 * ```
 */
export const getAdminBranches = new PreparedQuery<GetAdminBranchesParams,GetAdminBranchesResult>(getAdminBranchesIR);


/** 'GetBranch' parameters type */
export interface GetBranchParams {
  branchId: string;
}

/** 'GetBranch' return type */
export interface GetBranchResult {
  address: string | null;
  admin_count: string | null;
  /** Minimum hours before class start time that users can book (0 = no restriction) */
  booking_hours_before: number;
  cancellation_hours_before: number;
  client_count: string | null;
  created_at: Date | null;
  email: string | null;
  id: string;
  is_active: boolean | null;
  name: string;
  phone: string | null;
  timezone: string;
  upcoming_classes_count: string | null;
  updated_at: Date | null;
}

/** 'GetBranch' query type */
export interface GetBranchQuery {
  params: GetBranchParams;
  result: GetBranchResult;
}

const getBranchIR: any = {"usedParamSet":{"branchId":true},"params":[{"name":"branchId","required":true,"transform":{"type":"scalar"},"locs":[{"a":551,"b":560}]}],"statement":"SELECT\n  b.id,\n  b.name,\n  b.address,\n  b.phone,\n  b.email,\n  b.is_active,\n  b.created_at,\n  b.updated_at,\n  bs.cancellation_hours_before,\n  bs.booking_hours_before,\n  bs.timezone,\n  (SELECT COUNT(*) FROM \"user\" WHERE branch_id = b.id AND role = 'client') as client_count,\n  (SELECT COUNT(*) FROM \"user\" WHERE branch_id = b.id AND role = 'admin') as admin_count,\n  (SELECT COUNT(*) FROM classes WHERE branch_id = b.id AND scheduled_at > NOW()) as upcoming_classes_count\nFROM branches b\nLEFT JOIN branch_settings bs ON b.id = bs.branch_id\nWHERE b.id = :branchId!"};

/**
 * Query generated from SQL:
 * ```
 * SELECT
 *   b.id,
 *   b.name,
 *   b.address,
 *   b.phone,
 *   b.email,
 *   b.is_active,
 *   b.created_at,
 *   b.updated_at,
 *   bs.cancellation_hours_before,
 *   bs.booking_hours_before,
 *   bs.timezone,
 *   (SELECT COUNT(*) FROM "user" WHERE branch_id = b.id AND role = 'client') as client_count,
 *   (SELECT COUNT(*) FROM "user" WHERE branch_id = b.id AND role = 'admin') as admin_count,
 *   (SELECT COUNT(*) FROM classes WHERE branch_id = b.id AND scheduled_at > NOW()) as upcoming_classes_count
 * FROM branches b
 * LEFT JOIN branch_settings bs ON b.id = bs.branch_id
 * WHERE b.id = :branchId!
 * ```
 */
export const getBranch = new PreparedQuery<GetBranchParams,GetBranchResult>(getBranchIR);


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
  is_active: boolean | null;
  name: string;
  phone: string | null;
}

/** 'CreateBranch' query type */
export interface CreateBranchQuery {
  params: CreateBranchParams;
  result: CreateBranchResult;
}

const createBranchIR: any = {"usedParamSet":{"name":true,"address":true,"phone":true,"email":true},"params":[{"name":"name","required":true,"transform":{"type":"scalar"},"locs":[{"a":70,"b":75}]},{"name":"address","required":false,"transform":{"type":"scalar"},"locs":[{"a":78,"b":85}]},{"name":"phone","required":false,"transform":{"type":"scalar"},"locs":[{"a":88,"b":93}]},{"name":"email","required":false,"transform":{"type":"scalar"},"locs":[{"a":96,"b":101}]}],"statement":"INSERT INTO branches (name, address, phone, email, is_active)\nVALUES (:name!, :address, :phone, :email, true)\nRETURNING id, name, address, phone, email, is_active, created_at"};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO branches (name, address, phone, email, is_active)
 * VALUES (:name!, :address, :phone, :email, true)
 * RETURNING id, name, address, phone, email, is_active, created_at
 * ```
 */
export const createBranch = new PreparedQuery<CreateBranchParams,CreateBranchResult>(createBranchIR);


/** 'UpdateBranch' parameters type */
export interface UpdateBranchParams {
  address?: string | null | void;
  branchId: string;
  email?: string | null | void;
  isActive: boolean;
  name: string;
  phone?: string | null | void;
}

/** 'UpdateBranch' return type */
export interface UpdateBranchResult {
  address: string | null;
  email: string | null;
  id: string;
  is_active: boolean | null;
  name: string;
  phone: string | null;
  updated_at: Date | null;
}

/** 'UpdateBranch' query type */
export interface UpdateBranchQuery {
  params: UpdateBranchParams;
  result: UpdateBranchResult;
}

const updateBranchIR: any = {"usedParamSet":{"name":true,"address":true,"phone":true,"email":true,"isActive":true,"branchId":true},"params":[{"name":"name","required":true,"transform":{"type":"scalar"},"locs":[{"a":27,"b":32}]},{"name":"address","required":false,"transform":{"type":"scalar"},"locs":[{"a":49,"b":56}]},{"name":"phone","required":false,"transform":{"type":"scalar"},"locs":[{"a":71,"b":76}]},{"name":"email","required":false,"transform":{"type":"scalar"},"locs":[{"a":91,"b":96}]},{"name":"isActive","required":true,"transform":{"type":"scalar"},"locs":[{"a":115,"b":124}]},{"name":"branchId","required":true,"transform":{"type":"scalar"},"locs":[{"a":173,"b":182}]}],"statement":"UPDATE branches\nSET name = :name!,\n    address = :address,\n    phone = :phone,\n    email = :email,\n    is_active = :isActive!,\n    updated_at = CURRENT_TIMESTAMP\nWHERE id = :branchId!\nRETURNING id, name, address, phone, email, is_active, updated_at"};

/**
 * Query generated from SQL:
 * ```
 * UPDATE branches
 * SET name = :name!,
 *     address = :address,
 *     phone = :phone,
 *     email = :email,
 *     is_active = :isActive!,
 *     updated_at = CURRENT_TIMESTAMP
 * WHERE id = :branchId!
 * RETURNING id, name, address, phone, email, is_active, updated_at
 * ```
 */
export const updateBranch = new PreparedQuery<UpdateBranchParams,UpdateBranchResult>(updateBranchIR);


/** 'ToggleBranchStatus' parameters type */
export interface ToggleBranchStatusParams {
  branchId: string;
}

/** 'ToggleBranchStatus' return type */
export interface ToggleBranchStatusResult {
  is_active: boolean | null;
  name: string;
}

/** 'ToggleBranchStatus' query type */
export interface ToggleBranchStatusQuery {
  params: ToggleBranchStatusParams;
  result: ToggleBranchStatusResult;
}

const toggleBranchStatusIR: any = {"usedParamSet":{"branchId":true},"params":[{"name":"branchId","required":true,"transform":{"type":"scalar"},"locs":[{"a":93,"b":102}]}],"statement":"UPDATE branches\nSET is_active = NOT is_active,\n    updated_at = CURRENT_TIMESTAMP\nWHERE id = :branchId!\nRETURNING is_active, name"};

/**
 * Query generated from SQL:
 * ```
 * UPDATE branches
 * SET is_active = NOT is_active,
 *     updated_at = CURRENT_TIMESTAMP
 * WHERE id = :branchId!
 * RETURNING is_active, name
 * ```
 */
export const toggleBranchStatus = new PreparedQuery<ToggleBranchStatusParams,ToggleBranchStatusResult>(toggleBranchStatusIR);


/** 'DeleteBranch' parameters type */
export interface DeleteBranchParams {
  branchId: string;
}

/** 'DeleteBranch' return type */
export interface DeleteBranchResult {
  name: string;
}

/** 'DeleteBranch' query type */
export interface DeleteBranchQuery {
  params: DeleteBranchParams;
  result: DeleteBranchResult;
}

const deleteBranchIR: any = {"usedParamSet":{"branchId":true},"params":[{"name":"branchId","required":true,"transform":{"type":"scalar"},"locs":[{"a":32,"b":41}]}],"statement":"DELETE FROM branches WHERE id = :branchId! RETURNING name"};

/**
 * Query generated from SQL:
 * ```
 * DELETE FROM branches WHERE id = :branchId! RETURNING name
 * ```
 */
export const deleteBranch = new PreparedQuery<DeleteBranchParams,DeleteBranchResult>(deleteBranchIR);


/** 'CheckBranchData' parameters type */
export interface CheckBranchDataParams {
  branchId: string;
}

/** 'CheckBranchData' return type */
export interface CheckBranchDataResult {
  classes_count: string | null;
  users_count: string | null;
}

/** 'CheckBranchData' query type */
export interface CheckBranchDataQuery {
  params: CheckBranchDataParams;
  result: CheckBranchDataResult;
}

const checkBranchDataIR: any = {"usedParamSet":{"branchId":true},"params":[{"name":"branchId","required":true,"transform":{"type":"scalar"},"locs":[{"a":56,"b":65},{"a":134,"b":143}]}],"statement":"SELECT\n  (SELECT COUNT(*) FROM \"user\" WHERE branch_id = :branchId!) as users_count,\n  (SELECT COUNT(*) FROM classes WHERE branch_id = :branchId!) as classes_count"};

/**
 * Query generated from SQL:
 * ```
 * SELECT
 *   (SELECT COUNT(*) FROM "user" WHERE branch_id = :branchId!) as users_count,
 *   (SELECT COUNT(*) FROM classes WHERE branch_id = :branchId!) as classes_count
 * ```
 */
export const checkBranchData = new PreparedQuery<CheckBranchDataParams,CheckBranchDataResult>(checkBranchDataIR);


/** 'AssignAdminToBranch' parameters type */
export interface AssignAdminToBranchParams {
  adminId: string;
  branchId: string;
  isPrimary: boolean;
}

/** 'AssignAdminToBranch' return type */
export interface AssignAdminToBranchResult {
  admin_id: string;
  branch_id: string;
  is_primary: boolean | null;
}

/** 'AssignAdminToBranch' query type */
export interface AssignAdminToBranchQuery {
  params: AssignAdminToBranchParams;
  result: AssignAdminToBranchResult;
}

const assignAdminToBranchIR: any = {"usedParamSet":{"adminId":true,"branchId":true,"isPrimary":true},"params":[{"name":"adminId","required":true,"transform":{"type":"scalar"},"locs":[{"a":79,"b":87}]},{"name":"branchId","required":true,"transform":{"type":"scalar"},"locs":[{"a":90,"b":99}]},{"name":"isPrimary","required":true,"transform":{"type":"scalar"},"locs":[{"a":102,"b":112},{"a":176,"b":186}]}],"statement":"INSERT INTO admin_branch_assignments (admin_id, branch_id, is_primary)\nVALUES (:adminId!, :branchId!, :isPrimary!)\nON CONFLICT (admin_id, branch_id)\nDO UPDATE SET is_primary = :isPrimary!, updated_at = CURRENT_TIMESTAMP\nRETURNING admin_id, branch_id, is_primary"};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO admin_branch_assignments (admin_id, branch_id, is_primary)
 * VALUES (:adminId!, :branchId!, :isPrimary!)
 * ON CONFLICT (admin_id, branch_id)
 * DO UPDATE SET is_primary = :isPrimary!, updated_at = CURRENT_TIMESTAMP
 * RETURNING admin_id, branch_id, is_primary
 * ```
 */
export const assignAdminToBranch = new PreparedQuery<AssignAdminToBranchParams,AssignAdminToBranchResult>(assignAdminToBranchIR);


/** 'RemoveAdminFromBranch' parameters type */
export interface RemoveAdminFromBranchParams {
  adminId: string;
  branchId: string;
}

/** 'RemoveAdminFromBranch' return type */
export type RemoveAdminFromBranchResult = void;

/** 'RemoveAdminFromBranch' query type */
export interface RemoveAdminFromBranchQuery {
  params: RemoveAdminFromBranchParams;
  result: RemoveAdminFromBranchResult;
}

const removeAdminFromBranchIR: any = {"usedParamSet":{"adminId":true,"branchId":true},"params":[{"name":"adminId","required":true,"transform":{"type":"scalar"},"locs":[{"a":54,"b":62}]},{"name":"branchId","required":true,"transform":{"type":"scalar"},"locs":[{"a":80,"b":89}]}],"statement":"DELETE FROM admin_branch_assignments\nWHERE admin_id = :adminId! AND branch_id = :branchId!"};

/**
 * Query generated from SQL:
 * ```
 * DELETE FROM admin_branch_assignments
 * WHERE admin_id = :adminId! AND branch_id = :branchId!
 * ```
 */
export const removeAdminFromBranch = new PreparedQuery<RemoveAdminFromBranchParams,RemoveAdminFromBranchResult>(removeAdminFromBranchIR);


/** 'UnsetOtherPrimaryBranches' parameters type */
export interface UnsetOtherPrimaryBranchesParams {
  adminId: string;
}

/** 'UnsetOtherPrimaryBranches' return type */
export type UnsetOtherPrimaryBranchesResult = void;

/** 'UnsetOtherPrimaryBranches' query type */
export interface UnsetOtherPrimaryBranchesQuery {
  params: UnsetOtherPrimaryBranchesParams;
  result: UnsetOtherPrimaryBranchesResult;
}

const unsetOtherPrimaryBranchesIR: any = {"usedParamSet":{"adminId":true},"params":[{"name":"adminId","required":true,"transform":{"type":"scalar"},"locs":[{"a":72,"b":80}]}],"statement":"UPDATE admin_branch_assignments\nSET is_primary = false\nWHERE admin_id = :adminId!"};

/**
 * Query generated from SQL:
 * ```
 * UPDATE admin_branch_assignments
 * SET is_primary = false
 * WHERE admin_id = :adminId!
 * ```
 */
export const unsetOtherPrimaryBranches = new PreparedQuery<UnsetOtherPrimaryBranchesParams,UnsetOtherPrimaryBranchesResult>(unsetOtherPrimaryBranchesIR);


/** 'TransferClientToBranch' parameters type */
export interface TransferClientToBranchParams {
  newBranchId: string;
  userId: string;
}

/** 'TransferClientToBranch' return type */
export interface TransferClientToBranchResult {
  branch_id: string | null;
  id: string;
}

/** 'TransferClientToBranch' query type */
export interface TransferClientToBranchQuery {
  params: TransferClientToBranchParams;
  result: TransferClientToBranchResult;
}

const transferClientToBranchIR: any = {"usedParamSet":{"newBranchId":true,"userId":true},"params":[{"name":"newBranchId","required":true,"transform":{"type":"scalar"},"locs":[{"a":30,"b":42}]},{"name":"userId","required":true,"transform":{"type":"scalar"},"locs":[{"a":92,"b":99}]}],"statement":"UPDATE \"user\"\nSET branch_id = :newBranchId!,\n    \"updatedAt\" = CURRENT_TIMESTAMP\nWHERE id = :userId!\nRETURNING id, branch_id"};

/**
 * Query generated from SQL:
 * ```
 * UPDATE "user"
 * SET branch_id = :newBranchId!,
 *     "updatedAt" = CURRENT_TIMESTAMP
 * WHERE id = :userId!
 * RETURNING id, branch_id
 * ```
 */
export const transferClientToBranch = new PreparedQuery<TransferClientToBranchParams,TransferClientToBranchResult>(transferClientToBranchIR);


/** 'GetUserForTransfer' parameters type */
export interface GetUserForTransferParams {
  userId: string;
}

/** 'GetUserForTransfer' return type */
export interface GetUserForTransferResult {
  branch_id: string | null;
  first_name: string | null;
  last_name: string | null;
  role: user_role;
}

/** 'GetUserForTransfer' query type */
export interface GetUserForTransferQuery {
  params: GetUserForTransferParams;
  result: GetUserForTransferResult;
}

const getUserForTransferIR: any = {"usedParamSet":{"userId":true},"params":[{"name":"userId","required":true,"transform":{"type":"scalar"},"locs":[{"a":69,"b":76}]}],"statement":"SELECT role, branch_id, first_name, last_name\nFROM \"user\"\nWHERE id = :userId!"};

/**
 * Query generated from SQL:
 * ```
 * SELECT role, branch_id, first_name, last_name
 * FROM "user"
 * WHERE id = :userId!
 * ```
 */
export const getUserForTransfer = new PreparedQuery<GetUserForTransferParams,GetUserForTransferResult>(getUserForTransferIR);


/** 'CheckUserRole' parameters type */
export interface CheckUserRoleParams {
  userId: string;
}

/** 'CheckUserRole' return type */
export interface CheckUserRoleResult {
  role: user_role;
}

/** 'CheckUserRole' query type */
export interface CheckUserRoleQuery {
  params: CheckUserRoleParams;
  result: CheckUserRoleResult;
}

const checkUserRoleIR: any = {"usedParamSet":{"userId":true},"params":[{"name":"userId","required":true,"transform":{"type":"scalar"},"locs":[{"a":35,"b":42}]}],"statement":"SELECT role FROM \"user\" WHERE id = :userId!"};

/**
 * Query generated from SQL:
 * ```
 * SELECT role FROM "user" WHERE id = :userId!
 * ```
 */
export const checkUserRole = new PreparedQuery<CheckUserRoleParams,CheckUserRoleResult>(checkUserRoleIR);


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


/** 'CreateBranchSettings' parameters type */
export interface CreateBranchSettingsParams {
  bookingHoursBefore: number;
  branchId: string;
  cancellationHoursBefore: number;
  timezone: string;
}

/** 'CreateBranchSettings' return type */
export interface CreateBranchSettingsResult {
  /** Minimum hours before class start time that users can book (0 = no restriction) */
  booking_hours_before: number;
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

const createBranchSettingsIR: any = {"usedParamSet":{"branchId":true,"cancellationHoursBefore":true,"bookingHoursBefore":true,"timezone":true},"params":[{"name":"branchId","required":true,"transform":{"type":"scalar"},"locs":[{"a":120,"b":129}]},{"name":"cancellationHoursBefore","required":true,"transform":{"type":"scalar"},"locs":[{"a":134,"b":158}]},{"name":"bookingHoursBefore","required":true,"transform":{"type":"scalar"},"locs":[{"a":163,"b":182}]},{"name":"timezone","required":true,"transform":{"type":"scalar"},"locs":[{"a":187,"b":196}]}],"statement":"INSERT INTO branch_settings (\n  branch_id,\n  cancellation_hours_before,\n  booking_hours_before,\n  timezone\n) VALUES (\n  :branchId!,\n  :cancellationHoursBefore!,\n  :bookingHoursBefore!,\n  :timezone!\n) RETURNING id, branch_id, cancellation_hours_before, booking_hours_before, timezone, created_at"};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO branch_settings (
 *   branch_id,
 *   cancellation_hours_before,
 *   booking_hours_before,
 *   timezone
 * ) VALUES (
 *   :branchId!,
 *   :cancellationHoursBefore!,
 *   :bookingHoursBefore!,
 *   :timezone!
 * ) RETURNING id, branch_id, cancellation_hours_before, booking_hours_before, timezone, created_at
 * ```
 */
export const createBranchSettings = new PreparedQuery<CreateBranchSettingsParams,CreateBranchSettingsResult>(createBranchSettingsIR);


/** 'UpdateBranchSettings' parameters type */
export interface UpdateBranchSettingsParams {
  bookingHoursBefore: number;
  branchId: string;
  cancellationHoursBefore: number;
}

/** 'UpdateBranchSettings' return type */
export interface UpdateBranchSettingsResult {
  /** Minimum hours before class start time that users can book (0 = no restriction) */
  booking_hours_before: number;
  branch_id: string;
  cancellation_hours_before: number;
  id: string;
  updated_at: Date | null;
}

/** 'UpdateBranchSettings' query type */
export interface UpdateBranchSettingsQuery {
  params: UpdateBranchSettingsParams;
  result: UpdateBranchSettingsResult;
}

const updateBranchSettingsIR: any = {"usedParamSet":{"cancellationHoursBefore":true,"bookingHoursBefore":true,"branchId":true},"params":[{"name":"cancellationHoursBefore","required":true,"transform":{"type":"scalar"},"locs":[{"a":55,"b":79}]},{"name":"bookingHoursBefore","required":true,"transform":{"type":"scalar"},"locs":[{"a":109,"b":128}]},{"name":"branchId","required":true,"transform":{"type":"scalar"},"locs":[{"a":184,"b":193}]}],"statement":"UPDATE branch_settings\nSET cancellation_hours_before = :cancellationHoursBefore!,\n    booking_hours_before = :bookingHoursBefore!,\n    updated_at = CURRENT_TIMESTAMP\nWHERE branch_id = :branchId!\nRETURNING id, branch_id, cancellation_hours_before, booking_hours_before, updated_at"};

/**
 * Query generated from SQL:
 * ```
 * UPDATE branch_settings
 * SET cancellation_hours_before = :cancellationHoursBefore!,
 *     booking_hours_before = :bookingHoursBefore!,
 *     updated_at = CURRENT_TIMESTAMP
 * WHERE branch_id = :branchId!
 * RETURNING id, branch_id, cancellation_hours_before, booking_hours_before, updated_at
 * ```
 */
export const updateBranchSettings = new PreparedQuery<UpdateBranchSettingsParams,UpdateBranchSettingsResult>(updateBranchSettingsIR);


/** 'CreateNotificationSetting' parameters type */
export interface CreateNotificationSettingParams {
  branchId: string;
  isEnabled: boolean;
  notificationType: notification_type;
}

/** 'CreateNotificationSetting' return type */
export interface CreateNotificationSettingResult {
  branch_id: string;
  created_at: Date | null;
  id: string;
  is_enabled: boolean | null;
  notification_type: notification_type;
}

/** 'CreateNotificationSetting' query type */
export interface CreateNotificationSettingQuery {
  params: CreateNotificationSettingParams;
  result: CreateNotificationSettingResult;
}

const createNotificationSettingIR: any = {"usedParamSet":{"branchId":true,"notificationType":true,"isEnabled":true},"params":[{"name":"branchId","required":true,"transform":{"type":"scalar"},"locs":[{"a":96,"b":105}]},{"name":"notificationType","required":true,"transform":{"type":"scalar"},"locs":[{"a":110,"b":127}]},{"name":"isEnabled","required":true,"transform":{"type":"scalar"},"locs":[{"a":132,"b":142}]}],"statement":"INSERT INTO notification_settings (\n  branch_id,\n  notification_type,\n  is_enabled\n) VALUES (\n  :branchId!,\n  :notificationType!,\n  :isEnabled!\n) RETURNING id, branch_id, notification_type, is_enabled, created_at"};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO notification_settings (
 *   branch_id,
 *   notification_type,
 *   is_enabled
 * ) VALUES (
 *   :branchId!,
 *   :notificationType!,
 *   :isEnabled!
 * ) RETURNING id, branch_id, notification_type, is_enabled, created_at
 * ```
 */
export const createNotificationSetting = new PreparedQuery<CreateNotificationSettingParams,CreateNotificationSettingResult>(createNotificationSettingIR);


