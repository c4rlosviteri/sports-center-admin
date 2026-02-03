/** Types generated for queries found in "src/db/queries/auth.sql" */
import { PreparedQuery } from '@pgtyped/runtime';

export type user_role = 'admin' | 'client' | 'superuser';

/** 'GetUserByEmail' parameters type */
export interface GetUserByEmailParams {
  email: string;
}

/** 'GetUserByEmail' return type */
export interface GetUserByEmailResult {
  address: string | null;
  branch_id: string | null;
  created_at: Date | null;
  date_of_birth: Date | null;
  email: string;
  first_name: string | null;
  id: string;
  id_number: string | null;
  last_name: string | null;
  phone: string | null;
  role: user_role;
  terms_accepted_at: Date | null;
}

/** 'GetUserByEmail' query type */
export interface GetUserByEmailQuery {
  params: GetUserByEmailParams;
  result: GetUserByEmailResult;
}

const getUserByEmailIR: any = {"usedParamSet":{"email":true},"params":[{"name":"email","required":true,"transform":{"type":"scalar"},"locs":[{"a":195,"b":201}]}],"statement":"SELECT\n  id,\n  email,\n  first_name,\n  last_name,\n  date_of_birth,\n  id_number,\n  address,\n  phone,\n  role,\n  branch_id,\n  terms_accepted_at,\n  \"createdAt\" as created_at\nFROM \"user\"\nWHERE email = :email!"};

/**
 * Query generated from SQL:
 * ```
 * SELECT
 *   id,
 *   email,
 *   first_name,
 *   last_name,
 *   date_of_birth,
 *   id_number,
 *   address,
 *   phone,
 *   role,
 *   branch_id,
 *   terms_accepted_at,
 *   "createdAt" as created_at
 * FROM "user"
 * WHERE email = :email!
 * ```
 */
export const getUserByEmail = new PreparedQuery<GetUserByEmailParams,GetUserByEmailResult>(getUserByEmailIR);


/** 'GetUserById' parameters type */
export interface GetUserByIdParams {
  userId: string;
}

/** 'GetUserById' return type */
export interface GetUserByIdResult {
  address: string | null;
  branch_id: string | null;
  created_at: Date | null;
  date_of_birth: Date | null;
  email: string;
  first_name: string | null;
  id: string;
  id_number: string | null;
  last_name: string | null;
  phone: string | null;
  role: user_role;
  terms_accepted_at: Date | null;
}

/** 'GetUserById' query type */
export interface GetUserByIdQuery {
  params: GetUserByIdParams;
  result: GetUserByIdResult;
}

const getUserByIdIR: any = {"usedParamSet":{"userId":true},"params":[{"name":"userId","required":true,"transform":{"type":"scalar"},"locs":[{"a":192,"b":199}]}],"statement":"SELECT\n  id,\n  email,\n  first_name,\n  last_name,\n  date_of_birth,\n  id_number,\n  address,\n  phone,\n  role,\n  branch_id,\n  terms_accepted_at,\n  \"createdAt\" as created_at\nFROM \"user\"\nWHERE id = :userId!"};

/**
 * Query generated from SQL:
 * ```
 * SELECT
 *   id,
 *   email,
 *   first_name,
 *   last_name,
 *   date_of_birth,
 *   id_number,
 *   address,
 *   phone,
 *   role,
 *   branch_id,
 *   terms_accepted_at,
 *   "createdAt" as created_at
 * FROM "user"
 * WHERE id = :userId!
 * ```
 */
export const getUserById = new PreparedQuery<GetUserByIdParams,GetUserByIdResult>(getUserByIdIR);


/** 'GetUserWithBranch' parameters type */
export interface GetUserWithBranchParams {
  userId: string;
}

/** 'GetUserWithBranch' return type */
export interface GetUserWithBranchResult {
  address: string | null;
  branch_id: string | null;
  branch_name: string;
  created_at: Date | null;
  date_of_birth: Date | null;
  email: string;
  first_name: string | null;
  id: string;
  id_number: string | null;
  last_name: string | null;
  name: string | null;
  phone: string | null;
  role: user_role;
  terms_accepted_at: Date | null;
}

/** 'GetUserWithBranch' query type */
export interface GetUserWithBranchQuery {
  params: GetUserWithBranchParams;
  result: GetUserWithBranchResult;
}

const getUserWithBranchIR: any = {"usedParamSet":{"userId":true},"params":[{"name":"userId","required":true,"transform":{"type":"scalar"},"locs":[{"a":298,"b":305}]}],"statement":"SELECT\n  u.id,\n  u.email,\n  u.name,\n  u.first_name,\n  u.last_name,\n  u.date_of_birth,\n  u.id_number,\n  u.address,\n  u.phone,\n  u.role,\n  u.branch_id,\n  u.terms_accepted_at,\n  u.\"createdAt\" as created_at,\n  b.name as branch_name\nFROM \"user\" u\nLEFT JOIN branches b ON u.branch_id = b.id\nWHERE u.id = :userId!"};

/**
 * Query generated from SQL:
 * ```
 * SELECT
 *   u.id,
 *   u.email,
 *   u.name,
 *   u.first_name,
 *   u.last_name,
 *   u.date_of_birth,
 *   u.id_number,
 *   u.address,
 *   u.phone,
 *   u.role,
 *   u.branch_id,
 *   u.terms_accepted_at,
 *   u."createdAt" as created_at,
 *   b.name as branch_name
 * FROM "user" u
 * LEFT JOIN branches b ON u.branch_id = b.id
 * WHERE u.id = :userId!
 * ```
 */
export const getUserWithBranch = new PreparedQuery<GetUserWithBranchParams,GetUserWithBranchResult>(getUserWithBranchIR);


/** 'UpdateUserRole' parameters type */
export interface UpdateUserRoleParams {
  role: user_role;
  userId: string;
}

/** 'UpdateUserRole' return type */
export interface UpdateUserRoleResult {
  email: string;
  id: string;
  role: user_role;
}

/** 'UpdateUserRole' query type */
export interface UpdateUserRoleQuery {
  params: UpdateUserRoleParams;
  result: UpdateUserRoleResult;
}

const updateUserRoleIR: any = {"usedParamSet":{"role":true,"userId":true},"params":[{"name":"role","required":true,"transform":{"type":"scalar"},"locs":[{"a":25,"b":30}]},{"name":"userId","required":true,"transform":{"type":"scalar"},"locs":[{"a":80,"b":87}]}],"statement":"UPDATE \"user\"\nSET role = :role!,\n    \"updatedAt\" = CURRENT_TIMESTAMP\nWHERE id = :userId!\nRETURNING id, email, role"};

/**
 * Query generated from SQL:
 * ```
 * UPDATE "user"
 * SET role = :role!,
 *     "updatedAt" = CURRENT_TIMESTAMP
 * WHERE id = :userId!
 * RETURNING id, email, role
 * ```
 */
export const updateUserRole = new PreparedQuery<UpdateUserRoleParams,UpdateUserRoleResult>(updateUserRoleIR);


/** 'UpdateUserBranch' parameters type */
export interface UpdateUserBranchParams {
  branchId?: string | null | void;
  userId: string;
}

/** 'UpdateUserBranch' return type */
export interface UpdateUserBranchResult {
  branch_id: string | null;
  email: string;
  id: string;
}

/** 'UpdateUserBranch' query type */
export interface UpdateUserBranchQuery {
  params: UpdateUserBranchParams;
  result: UpdateUserBranchResult;
}

const updateUserBranchIR: any = {"usedParamSet":{"branchId":true,"userId":true},"params":[{"name":"branchId","required":false,"transform":{"type":"scalar"},"locs":[{"a":30,"b":38}]},{"name":"userId","required":true,"transform":{"type":"scalar"},"locs":[{"a":88,"b":95}]}],"statement":"UPDATE \"user\"\nSET branch_id = :branchId,\n    \"updatedAt\" = CURRENT_TIMESTAMP\nWHERE id = :userId!\nRETURNING id, email, branch_id"};

/**
 * Query generated from SQL:
 * ```
 * UPDATE "user"
 * SET branch_id = :branchId,
 *     "updatedAt" = CURRENT_TIMESTAMP
 * WHERE id = :userId!
 * RETURNING id, email, branch_id
 * ```
 */
export const updateUserBranch = new PreparedQuery<UpdateUserBranchParams,UpdateUserBranchResult>(updateUserBranchIR);


/** 'UpdateUserProfile' parameters type */
export interface UpdateUserProfileParams {
  address?: string | null | void;
  firstName?: string | null | void;
  lastName?: string | null | void;
  phone?: string | null | void;
  userId: string;
}

/** 'UpdateUserProfile' return type */
export interface UpdateUserProfileResult {
  address: string | null;
  email: string;
  first_name: string | null;
  id: string;
  last_name: string | null;
  phone: string | null;
}

/** 'UpdateUserProfile' query type */
export interface UpdateUserProfileQuery {
  params: UpdateUserProfileParams;
  result: UpdateUserProfileResult;
}

const updateUserProfileIR: any = {"usedParamSet":{"firstName":true,"lastName":true,"phone":true,"address":true,"userId":true},"params":[{"name":"firstName","required":false,"transform":{"type":"scalar"},"locs":[{"a":40,"b":49}]},{"name":"lastName","required":false,"transform":{"type":"scalar"},"locs":[{"a":90,"b":98}]},{"name":"phone","required":false,"transform":{"type":"scalar"},"locs":[{"a":134,"b":139}]},{"name":"address","required":false,"transform":{"type":"scalar"},"locs":[{"a":173,"b":180}]},{"name":"userId","required":true,"transform":{"type":"scalar"},"locs":[{"a":240,"b":247}]}],"statement":"UPDATE \"user\"\nSET first_name = COALESCE(:firstName, first_name),\n    last_name = COALESCE(:lastName, last_name),\n    phone = COALESCE(:phone, phone),\n    address = COALESCE(:address, address),\n    \"updatedAt\" = CURRENT_TIMESTAMP\nWHERE id = :userId!\nRETURNING id, email, first_name, last_name, phone, address"};

/**
 * Query generated from SQL:
 * ```
 * UPDATE "user"
 * SET first_name = COALESCE(:firstName, first_name),
 *     last_name = COALESCE(:lastName, last_name),
 *     phone = COALESCE(:phone, phone),
 *     address = COALESCE(:address, address),
 *     "updatedAt" = CURRENT_TIMESTAMP
 * WHERE id = :userId!
 * RETURNING id, email, first_name, last_name, phone, address
 * ```
 */
export const updateUserProfile = new PreparedQuery<UpdateUserProfileParams,UpdateUserProfileResult>(updateUserProfileIR);


/** 'GetPackageInvitationByCode' parameters type */
export interface GetPackageInvitationByCodeParams {
  code: string;
}

/** 'GetPackageInvitationByCode' return type */
export interface GetPackageInvitationByCodeResult {
  branch_id: string;
  branch_name: string;
  class_count: number;
  code: string;
  created_at: Date | null;
  expires_at: Date | null;
  id: string;
  is_active: boolean | null;
  package_id: string;
  package_name: string;
  price: string;
  validity_period: number | null;
  validity_type: string;
}

/** 'GetPackageInvitationByCode' query type */
export interface GetPackageInvitationByCodeQuery {
  params: GetPackageInvitationByCodeParams;
  result: GetPackageInvitationByCodeResult;
}

const getPackageInvitationByCodeIR: any = {"usedParamSet":{"code":true},"params":[{"name":"code","required":true,"transform":{"type":"scalar"},"locs":[{"a":380,"b":385}]}],"statement":"SELECT\n  pi.id,\n  pi.package_id,\n  pi.branch_id,\n  pi.code,\n  pi.is_active,\n  pi.expires_at,\n  pi.created_at,\n  b.name as branch_name,\n  cpt.name as package_name,\n  cpt.class_count,\n  cpt.validity_type,\n  cpt.validity_period,\n  cpt.price\nFROM package_invitations pi\nJOIN branches b ON pi.branch_id = b.id\nJOIN class_package_templates cpt ON pi.package_id = cpt.id\nWHERE pi.code = :code!\n  AND pi.is_active = true\n  AND cpt.is_active = true\n  AND (pi.expires_at IS NULL OR pi.expires_at > CURRENT_TIMESTAMP)"};

/**
 * Query generated from SQL:
 * ```
 * SELECT
 *   pi.id,
 *   pi.package_id,
 *   pi.branch_id,
 *   pi.code,
 *   pi.is_active,
 *   pi.expires_at,
 *   pi.created_at,
 *   b.name as branch_name,
 *   cpt.name as package_name,
 *   cpt.class_count,
 *   cpt.validity_type,
 *   cpt.validity_period,
 *   cpt.price
 * FROM package_invitations pi
 * JOIN branches b ON pi.branch_id = b.id
 * JOIN class_package_templates cpt ON pi.package_id = cpt.id
 * WHERE pi.code = :code!
 *   AND pi.is_active = true
 *   AND cpt.is_active = true
 *   AND (pi.expires_at IS NULL OR pi.expires_at > CURRENT_TIMESTAMP)
 * ```
 */
export const getPackageInvitationByCode = new PreparedQuery<GetPackageInvitationByCodeParams,GetPackageInvitationByCodeResult>(getPackageInvitationByCodeIR);


/** 'GetUsersByBranch' parameters type */
export interface GetUsersByBranchParams {
  branchId: string;
}

/** 'GetUsersByBranch' return type */
export interface GetUsersByBranchResult {
  branch_id: string | null;
  branch_name: string;
  created_at: Date | null;
  email: string;
  first_name: string | null;
  id: string;
  last_name: string | null;
  role: user_role;
}

/** 'GetUsersByBranch' query type */
export interface GetUsersByBranchQuery {
  params: GetUsersByBranchParams;
  result: GetUsersByBranchResult;
}

const getUsersByBranchIR: any = {"usedParamSet":{"branchId":true},"params":[{"name":"branchId","required":true,"transform":{"type":"scalar"},"locs":[{"a":214,"b":223}]}],"statement":"SELECT\n  u.id,\n  u.email,\n  u.first_name,\n  u.last_name,\n  u.role,\n  u.branch_id,\n  u.\"createdAt\" as created_at,\n  b.name as branch_name\nFROM \"user\" u\nLEFT JOIN branches b ON u.branch_id = b.id\nWHERE u.branch_id = :branchId!\nORDER BY u.\"createdAt\" DESC"};

/**
 * Query generated from SQL:
 * ```
 * SELECT
 *   u.id,
 *   u.email,
 *   u.first_name,
 *   u.last_name,
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
export const getUsersByBranch = new PreparedQuery<GetUsersByBranchParams,GetUsersByBranchResult>(getUsersByBranchIR);


/** 'GetUsersByRole' parameters type */
export interface GetUsersByRoleParams {
  role: user_role;
}

/** 'GetUsersByRole' return type */
export interface GetUsersByRoleResult {
  branch_id: string | null;
  branch_name: string;
  created_at: Date | null;
  email: string;
  first_name: string | null;
  id: string;
  last_name: string | null;
  role: user_role;
}

/** 'GetUsersByRole' query type */
export interface GetUsersByRoleQuery {
  params: GetUsersByRoleParams;
  result: GetUsersByRoleResult;
}

const getUsersByRoleIR: any = {"usedParamSet":{"role":true},"params":[{"name":"role","required":true,"transform":{"type":"scalar"},"locs":[{"a":209,"b":214}]}],"statement":"SELECT\n  u.id,\n  u.email,\n  u.first_name,\n  u.last_name,\n  u.role,\n  u.branch_id,\n  u.\"createdAt\" as created_at,\n  b.name as branch_name\nFROM \"user\" u\nLEFT JOIN branches b ON u.branch_id = b.id\nWHERE u.role = :role!\nORDER BY u.\"createdAt\" DESC"};

/**
 * Query generated from SQL:
 * ```
 * SELECT
 *   u.id,
 *   u.email,
 *   u.first_name,
 *   u.last_name,
 *   u.role,
 *   u.branch_id,
 *   u."createdAt" as created_at,
 *   b.name as branch_name
 * FROM "user" u
 * LEFT JOIN branches b ON u.branch_id = b.id
 * WHERE u.role = :role!
 * ORDER BY u."createdAt" DESC
 * ```
 */
export const getUsersByRole = new PreparedQuery<GetUsersByRoleParams,GetUsersByRoleResult>(getUsersByRoleIR);


/** 'GetAllClients' parameters type */
export type GetAllClientsParams = void;

/** 'GetAllClients' return type */
export interface GetAllClientsResult {
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

/** 'GetAllClients' query type */
export interface GetAllClientsQuery {
  params: GetAllClientsParams;
  result: GetAllClientsResult;
}

const getAllClientsIR: any = {"usedParamSet":{},"params":[],"statement":"SELECT\n  u.id,\n  u.email,\n  u.first_name,\n  u.last_name,\n  u.phone,\n  u.role,\n  u.branch_id,\n  u.\"createdAt\" as created_at,\n  b.name as branch_name\nFROM \"user\" u\nLEFT JOIN branches b ON u.branch_id = b.id\nWHERE u.role = 'client'\nORDER BY u.\"createdAt\" DESC"};

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
 * WHERE u.role = 'client'
 * ORDER BY u."createdAt" DESC
 * ```
 */
export const getAllClients = new PreparedQuery<GetAllClientsParams,GetAllClientsResult>(getAllClientsIR);


