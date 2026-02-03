/** Types generated for queries found in "src/db/queries/auth.sql" */
import { PreparedQuery } from '@pgtyped/runtime';

export type user_role = 'admin' | 'client' | 'superuser';

export type DateOrString = Date | string;

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


/** 'GetInvitationByCode' parameters type */
export interface GetInvitationByCodeParams {
  code: string;
}

/** 'GetInvitationByCode' return type */
export interface GetInvitationByCodeResult {
  branch_id: string;
  branch_name: string;
  expires_at: Date | null;
  id: string;
  is_active: boolean | null;
  max_uses: number | null;
  usage_count: number | null;
}

/** 'GetInvitationByCode' query type */
export interface GetInvitationByCodeQuery {
  params: GetInvitationByCodeParams;
  result: GetInvitationByCodeResult;
}

const getInvitationByCodeIR: any = {"usedParamSet":{"code":true},"params":[{"name":"code","required":true,"transform":{"type":"scalar"},"locs":[{"a":205,"b":210}]}],"statement":"SELECT\n  pi.id,\n  pi.branch_id,\n  pi.is_active,\n  pi.usage_count,\n  pi.max_uses,\n  pi.expires_at,\n  b.name as branch_name\nFROM package_invitations pi\nJOIN branches b ON pi.branch_id = b.id\nWHERE pi.code = :code!"};

/**
 * Query generated from SQL:
 * ```
 * SELECT
 *   pi.id,
 *   pi.branch_id,
 *   pi.is_active,
 *   pi.usage_count,
 *   pi.max_uses,
 *   pi.expires_at,
 *   b.name as branch_name
 * FROM package_invitations pi
 * JOIN branches b ON pi.branch_id = b.id
 * WHERE pi.code = :code!
 * ```
 */
export const getInvitationByCode = new PreparedQuery<GetInvitationByCodeParams,GetInvitationByCodeResult>(getInvitationByCodeIR);


/** 'GetValidInvitationByCode' parameters type */
export interface GetValidInvitationByCodeParams {
  code: string;
}

/** 'GetValidInvitationByCode' return type */
export interface GetValidInvitationByCodeResult {
  branch_id: string;
  id: string;
}

/** 'GetValidInvitationByCode' query type */
export interface GetValidInvitationByCodeQuery {
  params: GetValidInvitationByCodeParams;
  result: GetValidInvitationByCodeResult;
}

const getValidInvitationByCodeIR: any = {"usedParamSet":{"code":true},"params":[{"name":"code","required":true,"transform":{"type":"scalar"},"locs":[{"a":63,"b":68}]}],"statement":"SELECT\n  id,\n  branch_id\nFROM package_invitations\nWHERE code = :code!\n  AND is_active = true\n  AND (max_uses IS NULL OR usage_count < max_uses)\n  AND (expires_at IS NULL OR expires_at > NOW())"};

/**
 * Query generated from SQL:
 * ```
 * SELECT
 *   id,
 *   branch_id
 * FROM package_invitations
 * WHERE code = :code!
 *   AND is_active = true
 *   AND (max_uses IS NULL OR usage_count < max_uses)
 *   AND (expires_at IS NULL OR expires_at > NOW())
 * ```
 */
export const getValidInvitationByCode = new PreparedQuery<GetValidInvitationByCodeParams,GetValidInvitationByCodeResult>(getValidInvitationByCodeIR);


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


/** 'GetUserIdByIdNumber' parameters type */
export interface GetUserIdByIdNumberParams {
  idNumber: string;
}

/** 'GetUserIdByIdNumber' return type */
export interface GetUserIdByIdNumberResult {
  id: string;
}

/** 'GetUserIdByIdNumber' query type */
export interface GetUserIdByIdNumberQuery {
  params: GetUserIdByIdNumberParams;
  result: GetUserIdByIdNumberResult;
}

const getUserIdByIdNumberIR: any = {"usedParamSet":{"idNumber":true},"params":[{"name":"idNumber","required":true,"transform":{"type":"scalar"},"locs":[{"a":40,"b":49}]}],"statement":"SELECT id\nFROM \"user\"\nWHERE id_number = :idNumber!"};

/**
 * Query generated from SQL:
 * ```
 * SELECT id
 * FROM "user"
 * WHERE id_number = :idNumber!
 * ```
 */
export const getUserIdByIdNumber = new PreparedQuery<GetUserIdByIdNumberParams,GetUserIdByIdNumberResult>(getUserIdByIdNumberIR);


/** 'GetUserIdByPhone' parameters type */
export interface GetUserIdByPhoneParams {
  phone: string;
}

/** 'GetUserIdByPhone' return type */
export interface GetUserIdByPhoneResult {
  id: string;
}

/** 'GetUserIdByPhone' query type */
export interface GetUserIdByPhoneQuery {
  params: GetUserIdByPhoneParams;
  result: GetUserIdByPhoneResult;
}

const getUserIdByPhoneIR: any = {"usedParamSet":{"phone":true},"params":[{"name":"phone","required":true,"transform":{"type":"scalar"},"locs":[{"a":36,"b":42}]}],"statement":"SELECT id\nFROM \"user\"\nWHERE phone = :phone!"};

/**
 * Query generated from SQL:
 * ```
 * SELECT id
 * FROM "user"
 * WHERE phone = :phone!
 * ```
 */
export const getUserIdByPhone = new PreparedQuery<GetUserIdByPhoneParams,GetUserIdByPhoneResult>(getUserIdByPhoneIR);


/** 'InsertUserWithInvite' parameters type */
export interface InsertUserWithInviteParams {
  address?: string | null | void;
  branchId: string;
  dateOfBirth?: DateOrString | null | void;
  email: string;
  emailVerified: boolean;
  firstName?: string | null | void;
  id: string;
  idNumber?: string | null | void;
  lastName?: string | null | void;
  name?: string | null | void;
  phone?: string | null | void;
  role: user_role;
}

/** 'InsertUserWithInvite' return type */
export interface InsertUserWithInviteResult {
  id: string;
}

/** 'InsertUserWithInvite' query type */
export interface InsertUserWithInviteQuery {
  params: InsertUserWithInviteParams;
  result: InsertUserWithInviteResult;
}

const insertUserWithInviteIR: any = {"usedParamSet":{"id":true,"email":true,"emailVerified":true,"name":true,"firstName":true,"lastName":true,"dateOfBirth":true,"idNumber":true,"address":true,"phone":true,"role":true,"branchId":true},"params":[{"name":"id","required":true,"transform":{"type":"scalar"},"locs":[{"a":194,"b":197}]},{"name":"email","required":true,"transform":{"type":"scalar"},"locs":[{"a":202,"b":208}]},{"name":"emailVerified","required":true,"transform":{"type":"scalar"},"locs":[{"a":213,"b":227}]},{"name":"name","required":false,"transform":{"type":"scalar"},"locs":[{"a":232,"b":236}]},{"name":"firstName","required":false,"transform":{"type":"scalar"},"locs":[{"a":241,"b":250}]},{"name":"lastName","required":false,"transform":{"type":"scalar"},"locs":[{"a":255,"b":263}]},{"name":"dateOfBirth","required":false,"transform":{"type":"scalar"},"locs":[{"a":268,"b":279}]},{"name":"idNumber","required":false,"transform":{"type":"scalar"},"locs":[{"a":284,"b":292}]},{"name":"address","required":false,"transform":{"type":"scalar"},"locs":[{"a":297,"b":304}]},{"name":"phone","required":false,"transform":{"type":"scalar"},"locs":[{"a":309,"b":314}]},{"name":"role","required":true,"transform":{"type":"scalar"},"locs":[{"a":319,"b":324}]},{"name":"branchId","required":true,"transform":{"type":"scalar"},"locs":[{"a":329,"b":338}]}],"statement":"INSERT INTO \"user\" (\n  id,\n  email,\n  \"emailVerified\",\n  name,\n  first_name,\n  last_name,\n  date_of_birth,\n  id_number,\n  address,\n  phone,\n  role,\n  branch_id,\n  terms_accepted_at\n) VALUES (\n  :id!,\n  :email!,\n  :emailVerified!,\n  :name,\n  :firstName,\n  :lastName,\n  :dateOfBirth,\n  :idNumber,\n  :address,\n  :phone,\n  :role!,\n  :branchId!,\n  NOW()\n)\nRETURNING id"};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO "user" (
 *   id,
 *   email,
 *   "emailVerified",
 *   name,
 *   first_name,
 *   last_name,
 *   date_of_birth,
 *   id_number,
 *   address,
 *   phone,
 *   role,
 *   branch_id,
 *   terms_accepted_at
 * ) VALUES (
 *   :id!,
 *   :email!,
 *   :emailVerified!,
 *   :name,
 *   :firstName,
 *   :lastName,
 *   :dateOfBirth,
 *   :idNumber,
 *   :address,
 *   :phone,
 *   :role!,
 *   :branchId!,
 *   NOW()
 * )
 * RETURNING id
 * ```
 */
export const insertUserWithInvite = new PreparedQuery<InsertUserWithInviteParams,InsertUserWithInviteResult>(insertUserWithInviteIR);


/** 'InsertAccountCredential' parameters type */
export interface InsertAccountCredentialParams {
  accountId: string;
  id: string;
  password: string;
  userId: string;
}

/** 'InsertAccountCredential' return type */
export interface InsertAccountCredentialResult {
  id: string;
}

/** 'InsertAccountCredential' query type */
export interface InsertAccountCredentialQuery {
  params: InsertAccountCredentialParams;
  result: InsertAccountCredentialResult;
}

const insertAccountCredentialIR: any = {"usedParamSet":{"id":true,"userId":true,"accountId":true,"password":true},"params":[{"name":"id","required":true,"transform":{"type":"scalar"},"locs":[{"a":97,"b":100}]},{"name":"userId","required":true,"transform":{"type":"scalar"},"locs":[{"a":105,"b":112}]},{"name":"accountId","required":true,"transform":{"type":"scalar"},"locs":[{"a":117,"b":127}]},{"name":"password","required":true,"transform":{"type":"scalar"},"locs":[{"a":148,"b":157}]}],"statement":"INSERT INTO \"account\" (\n  id,\n  \"userId\",\n  \"accountId\",\n  \"providerId\",\n  password\n) VALUES (\n  :id!,\n  :userId!,\n  :accountId!,\n  'credential',\n  :password!\n)\nRETURNING id"};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO "account" (
 *   id,
 *   "userId",
 *   "accountId",
 *   "providerId",
 *   password
 * ) VALUES (
 *   :id!,
 *   :userId!,
 *   :accountId!,
 *   'credential',
 *   :password!
 * )
 * RETURNING id
 * ```
 */
export const insertAccountCredential = new PreparedQuery<InsertAccountCredentialParams,InsertAccountCredentialResult>(insertAccountCredentialIR);


/** 'IncrementInvitationUsage' parameters type */
export interface IncrementInvitationUsageParams {
  code: string;
}

/** 'IncrementInvitationUsage' return type */
export type IncrementInvitationUsageResult = void;

/** 'IncrementInvitationUsage' query type */
export interface IncrementInvitationUsageQuery {
  params: IncrementInvitationUsageParams;
  result: IncrementInvitationUsageResult;
}

const incrementInvitationUsageIR: any = {"usedParamSet":{"code":true},"params":[{"name":"code","required":true,"transform":{"type":"scalar"},"locs":[{"a":74,"b":79}]}],"statement":"UPDATE package_invitations\nSET usage_count = usage_count + 1\nWHERE code = :code!"};

/**
 * Query generated from SQL:
 * ```
 * UPDATE package_invitations
 * SET usage_count = usage_count + 1
 * WHERE code = :code!
 * ```
 */
export const incrementInvitationUsage = new PreparedQuery<IncrementInvitationUsageParams,IncrementInvitationUsageResult>(incrementInvitationUsageIR);


/** 'DeleteSessionByUserId' parameters type */
export interface DeleteSessionByUserIdParams {
  userId: string;
}

/** 'DeleteSessionByUserId' return type */
export type DeleteSessionByUserIdResult = void;

/** 'DeleteSessionByUserId' query type */
export interface DeleteSessionByUserIdQuery {
  params: DeleteSessionByUserIdParams;
  result: DeleteSessionByUserIdResult;
}

const deleteSessionByUserIdIR: any = {"usedParamSet":{"userId":true},"params":[{"name":"userId","required":true,"transform":{"type":"scalar"},"locs":[{"a":39,"b":46}]}],"statement":"DELETE FROM \"session\"\nWHERE \"userId\" = :userId!"};

/**
 * Query generated from SQL:
 * ```
 * DELETE FROM "session"
 * WHERE "userId" = :userId!
 * ```
 */
export const deleteSessionByUserId = new PreparedQuery<DeleteSessionByUserIdParams,DeleteSessionByUserIdResult>(deleteSessionByUserIdIR);


