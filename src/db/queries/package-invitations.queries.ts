/** Types generated for queries found in "src/db/queries/package-invitations.sql" */
import { PreparedQuery } from '@pgtyped/runtime';

export type DateOrString = Date | string;

export type NumberOrString = number | string;

/** 'GetPackageTemplateForInvitation' parameters type */
export interface GetPackageTemplateForInvitationParams {
  branchId: string;
  packageId: string;
}

/** 'GetPackageTemplateForInvitation' return type */
export interface GetPackageTemplateForInvitationResult {
  branch_id: string;
  id: string;
  name: string;
}

/** 'GetPackageTemplateForInvitation' query type */
export interface GetPackageTemplateForInvitationQuery {
  params: GetPackageTemplateForInvitationParams;
  result: GetPackageTemplateForInvitationResult;
}

const getPackageTemplateForInvitationIR: any = {"usedParamSet":{"packageId":true,"branchId":true},"params":[{"name":"packageId","required":true,"transform":{"type":"scalar"},"locs":[{"a":73,"b":83}]},{"name":"branchId","required":true,"transform":{"type":"scalar"},"locs":[{"a":103,"b":112}]}],"statement":"SELECT\n  id,\n  name,\n  branch_id\nFROM class_package_templates\nWHERE id = :packageId!\n  AND branch_id = :branchId!"};

/**
 * Query generated from SQL:
 * ```
 * SELECT
 *   id,
 *   name,
 *   branch_id
 * FROM class_package_templates
 * WHERE id = :packageId!
 *   AND branch_id = :branchId!
 * ```
 */
export const getPackageTemplateForInvitation = new PreparedQuery<GetPackageTemplateForInvitationParams,GetPackageTemplateForInvitationResult>(getPackageTemplateForInvitationIR);


/** 'CreatePackageInvitation' parameters type */
export interface CreatePackageInvitationParams {
  branchId: string;
  code: string;
  createdBy: string;
  packageId: string;
}

/** 'CreatePackageInvitation' return type */
export interface CreatePackageInvitationResult {
  id: string;
}

/** 'CreatePackageInvitation' query type */
export interface CreatePackageInvitationQuery {
  params: CreatePackageInvitationParams;
  result: CreatePackageInvitationResult;
}

const createPackageInvitationIR: any = {"usedParamSet":{"packageId":true,"branchId":true,"code":true,"createdBy":true},"params":[{"name":"packageId","required":true,"transform":{"type":"scalar"},"locs":[{"a":108,"b":118}]},{"name":"branchId","required":true,"transform":{"type":"scalar"},"locs":[{"a":123,"b":132}]},{"name":"code","required":true,"transform":{"type":"scalar"},"locs":[{"a":137,"b":142}]},{"name":"createdBy","required":true,"transform":{"type":"scalar"},"locs":[{"a":147,"b":157}]}],"statement":"INSERT INTO package_invitations (\n  package_id,\n  branch_id,\n  code,\n  created_by,\n  is_active\n) VALUES (\n  :packageId!,\n  :branchId!,\n  :code!,\n  :createdBy!,\n  true\n)\nON CONFLICT (code) DO NOTHING\nRETURNING id"};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO package_invitations (
 *   package_id,
 *   branch_id,
 *   code,
 *   created_by,
 *   is_active
 * ) VALUES (
 *   :packageId!,
 *   :branchId!,
 *   :code!,
 *   :createdBy!,
 *   true
 * )
 * ON CONFLICT (code) DO NOTHING
 * RETURNING id
 * ```
 */
export const createPackageInvitation = new PreparedQuery<CreatePackageInvitationParams,CreatePackageInvitationResult>(createPackageInvitationIR);


/** 'GetLatestPackageInvitation' parameters type */
export interface GetLatestPackageInvitationParams {
  branchId: string;
  packageId: string;
}

/** 'GetLatestPackageInvitation' return type */
export interface GetLatestPackageInvitationResult {
  code: string;
  created_at: Date | null;
}

/** 'GetLatestPackageInvitation' query type */
export interface GetLatestPackageInvitationQuery {
  params: GetLatestPackageInvitationParams;
  result: GetLatestPackageInvitationResult;
}

const getLatestPackageInvitationIR: any = {"usedParamSet":{"packageId":true,"branchId":true},"params":[{"name":"packageId","required":true,"transform":{"type":"scalar"},"locs":[{"a":72,"b":82}]},{"name":"branchId","required":true,"transform":{"type":"scalar"},"locs":[{"a":102,"b":111}]}],"statement":"SELECT\n  code,\n  created_at\nFROM package_invitations\nWHERE package_id = :packageId!\n  AND branch_id = :branchId!\n  AND is_active = true\nORDER BY created_at DESC\nLIMIT 1"};

/**
 * Query generated from SQL:
 * ```
 * SELECT
 *   code,
 *   created_at
 * FROM package_invitations
 * WHERE package_id = :packageId!
 *   AND branch_id = :branchId!
 *   AND is_active = true
 * ORDER BY created_at DESC
 * LIMIT 1
 * ```
 */
export const getLatestPackageInvitation = new PreparedQuery<GetLatestPackageInvitationParams,GetLatestPackageInvitationResult>(getLatestPackageInvitationIR);


/** 'RevokePackageInvitation' parameters type */
export interface RevokePackageInvitationParams {
  branchId: string;
  code: string;
}

/** 'RevokePackageInvitation' return type */
export type RevokePackageInvitationResult = void;

/** 'RevokePackageInvitation' query type */
export interface RevokePackageInvitationQuery {
  params: RevokePackageInvitationParams;
  result: RevokePackageInvitationResult;
}

const revokePackageInvitationIR: any = {"usedParamSet":{"code":true,"branchId":true},"params":[{"name":"code","required":true,"transform":{"type":"scalar"},"locs":[{"a":98,"b":103}]},{"name":"branchId","required":true,"transform":{"type":"scalar"},"locs":[{"a":123,"b":132}]}],"statement":"UPDATE package_invitations\nSET\n  is_active = false,\n  updated_at = CURRENT_TIMESTAMP\nWHERE code = :code!\n  AND branch_id = :branchId!"};

/**
 * Query generated from SQL:
 * ```
 * UPDATE package_invitations
 * SET
 *   is_active = false,
 *   updated_at = CURRENT_TIMESTAMP
 * WHERE code = :code!
 *   AND branch_id = :branchId!
 * ```
 */
export const revokePackageInvitation = new PreparedQuery<RevokePackageInvitationParams,RevokePackageInvitationResult>(revokePackageInvitationIR);


/** 'GetInvitationWithPackageDetails' parameters type */
export interface GetInvitationWithPackageDetailsParams {
  code: string;
}

/** 'GetInvitationWithPackageDetails' return type */
export interface GetInvitationWithPackageDetailsResult {
  branch_id: string;
  class_count: number;
  description: string | null;
  name: string;
  package_id: string;
  price: string;
  validity_period: number | null;
  validity_type: string;
}

/** 'GetInvitationWithPackageDetails' query type */
export interface GetInvitationWithPackageDetailsQuery {
  params: GetInvitationWithPackageDetailsParams;
  result: GetInvitationWithPackageDetailsResult;
}

const getInvitationWithPackageDetailsIR: any = {"usedParamSet":{"code":true},"params":[{"name":"code","required":true,"transform":{"type":"scalar"},"locs":[{"a":249,"b":254}]}],"statement":"SELECT\n  pi.package_id,\n  pi.branch_id,\n  cpt.name,\n  cpt.description,\n  cpt.class_count,\n  cpt.price,\n  cpt.validity_type,\n  cpt.validity_period\nFROM package_invitations pi\nJOIN class_package_templates cpt ON pi.package_id = cpt.id\nWHERE pi.code = :code!\n  AND pi.is_active = true\n  AND cpt.is_active = true"};

/**
 * Query generated from SQL:
 * ```
 * SELECT
 *   pi.package_id,
 *   pi.branch_id,
 *   cpt.name,
 *   cpt.description,
 *   cpt.class_count,
 *   cpt.price,
 *   cpt.validity_type,
 *   cpt.validity_period
 * FROM package_invitations pi
 * JOIN class_package_templates cpt ON pi.package_id = cpt.id
 * WHERE pi.code = :code!
 *   AND pi.is_active = true
 *   AND cpt.is_active = true
 * ```
 */
export const getInvitationWithPackageDetails = new PreparedQuery<GetInvitationWithPackageDetailsParams,GetInvitationWithPackageDetailsResult>(getInvitationWithPackageDetailsIR);


/** 'CreateUserPackageFromInvitation' parameters type */
export interface CreateUserPackageFromInvitationParams {
  branchId: string;
  classesRemaining: number;
  expiresAt?: DateOrString | null | void;
  packageTemplateId: string;
  purchasePrice: NumberOrString;
  totalClasses: number;
  userId: string;
}

/** 'CreateUserPackageFromInvitation' return type */
export interface CreateUserPackageFromInvitationResult {
  id: string;
}

/** 'CreateUserPackageFromInvitation' query type */
export interface CreateUserPackageFromInvitationQuery {
  params: CreateUserPackageFromInvitationParams;
  result: CreateUserPackageFromInvitationResult;
}

const createUserPackageFromInvitationIR: any = {"usedParamSet":{"userId":true,"branchId":true,"packageTemplateId":true,"totalClasses":true,"classesRemaining":true,"expiresAt":true,"purchasePrice":true},"params":[{"name":"userId","required":true,"transform":{"type":"scalar"},"locs":[{"a":184,"b":191}]},{"name":"branchId","required":true,"transform":{"type":"scalar"},"locs":[{"a":196,"b":205}]},{"name":"packageTemplateId","required":true,"transform":{"type":"scalar"},"locs":[{"a":210,"b":228}]},{"name":"totalClasses","required":true,"transform":{"type":"scalar"},"locs":[{"a":233,"b":246}]},{"name":"classesRemaining","required":true,"transform":{"type":"scalar"},"locs":[{"a":251,"b":268}]},{"name":"expiresAt","required":false,"transform":{"type":"scalar"},"locs":[{"a":273,"b":282}]},{"name":"purchasePrice","required":true,"transform":{"type":"scalar"},"locs":[{"a":308,"b":322}]}],"statement":"INSERT INTO user_class_packages (\n  user_id,\n  branch_id,\n  package_template_id,\n  total_classes,\n  classes_remaining,\n  expires_at,\n  status,\n  is_gift,\n  purchase_price\n) VALUES (\n  :userId!,\n  :branchId!,\n  :packageTemplateId!,\n  :totalClasses!,\n  :classesRemaining!,\n  :expiresAt,\n  'active',\n  false,\n  :purchasePrice!\n)\nRETURNING id"};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO user_class_packages (
 *   user_id,
 *   branch_id,
 *   package_template_id,
 *   total_classes,
 *   classes_remaining,
 *   expires_at,
 *   status,
 *   is_gift,
 *   purchase_price
 * ) VALUES (
 *   :userId!,
 *   :branchId!,
 *   :packageTemplateId!,
 *   :totalClasses!,
 *   :classesRemaining!,
 *   :expiresAt,
 *   'active',
 *   false,
 *   :purchasePrice!
 * )
 * RETURNING id
 * ```
 */
export const createUserPackageFromInvitation = new PreparedQuery<CreateUserPackageFromInvitationParams,CreateUserPackageFromInvitationResult>(createUserPackageFromInvitationIR);


