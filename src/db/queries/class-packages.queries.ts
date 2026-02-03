/** Types generated for queries found in "src/db/queries/class-packages.sql" */
import { PreparedQuery } from '@pgtyped/runtime';

export type DateOrString = Date | string;

export type Json = null | boolean | number | string | Json[] | { [key: string]: Json };

export type NumberOrString = number | string;

export type stringArray = (string)[];

/** 'CreatePackageTemplate' parameters type */
export interface CreatePackageTemplateParams {
  allowedClassTypes?: stringArray | null | void;
  allowsWaitlist: boolean;
  blackoutDates?: Json | null | void;
  branchId: string;
  classCount: number;
  description?: string | null | void;
  displayOrder?: number | null | void;
  isActive: boolean;
  isGiftEligible: boolean;
  isShareable: boolean;
  maxClassesPerDay?: number | null | void;
  maxClassesPerWeek?: number | null | void;
  name: string;
  price: NumberOrString;
  priorityBooking: boolean;
  validityPeriod?: number | null | void;
  validityType: string;
}

/** 'CreatePackageTemplate' return type */
export interface CreatePackageTemplateResult {
  allowed_class_types: stringArray | null;
  allows_waitlist: boolean | null;
  blackout_dates: Json | null;
  branch_id: string;
  class_count: number;
  created_at: Date | null;
  description: string | null;
  display_order: number | null;
  id: string;
  is_active: boolean | null;
  is_gift_eligible: boolean | null;
  is_shareable: boolean | null;
  max_classes_per_day: number | null;
  max_classes_per_week: number | null;
  name: string;
  price: string;
  priority_booking: boolean | null;
  updated_at: Date | null;
  validity_period: number | null;
  validity_type: string;
}

/** 'CreatePackageTemplate' query type */
export interface CreatePackageTemplateQuery {
  params: CreatePackageTemplateParams;
  result: CreatePackageTemplateResult;
}

const createPackageTemplateIR: any = {"usedParamSet":{"branchId":true,"name":true,"description":true,"classCount":true,"price":true,"validityType":true,"validityPeriod":true,"isGiftEligible":true,"isShareable":true,"allowsWaitlist":true,"priorityBooking":true,"allowedClassTypes":true,"blackoutDates":true,"maxClassesPerDay":true,"maxClassesPerWeek":true,"isActive":true,"displayOrder":true},"params":[{"name":"branchId","required":true,"transform":{"type":"scalar"},"locs":[{"a":339,"b":348}]},{"name":"name","required":true,"transform":{"type":"scalar"},"locs":[{"a":353,"b":358}]},{"name":"description","required":false,"transform":{"type":"scalar"},"locs":[{"a":363,"b":374}]},{"name":"classCount","required":true,"transform":{"type":"scalar"},"locs":[{"a":379,"b":390}]},{"name":"price","required":true,"transform":{"type":"scalar"},"locs":[{"a":395,"b":401}]},{"name":"validityType","required":true,"transform":{"type":"scalar"},"locs":[{"a":406,"b":419}]},{"name":"validityPeriod","required":false,"transform":{"type":"scalar"},"locs":[{"a":424,"b":438}]},{"name":"isGiftEligible","required":true,"transform":{"type":"scalar"},"locs":[{"a":443,"b":458}]},{"name":"isShareable","required":true,"transform":{"type":"scalar"},"locs":[{"a":463,"b":475}]},{"name":"allowsWaitlist","required":true,"transform":{"type":"scalar"},"locs":[{"a":480,"b":495}]},{"name":"priorityBooking","required":true,"transform":{"type":"scalar"},"locs":[{"a":500,"b":516}]},{"name":"allowedClassTypes","required":false,"transform":{"type":"scalar"},"locs":[{"a":521,"b":538}]},{"name":"blackoutDates","required":false,"transform":{"type":"scalar"},"locs":[{"a":543,"b":556}]},{"name":"maxClassesPerDay","required":false,"transform":{"type":"scalar"},"locs":[{"a":561,"b":577}]},{"name":"maxClassesPerWeek","required":false,"transform":{"type":"scalar"},"locs":[{"a":582,"b":599}]},{"name":"isActive","required":true,"transform":{"type":"scalar"},"locs":[{"a":604,"b":613}]},{"name":"displayOrder","required":false,"transform":{"type":"scalar"},"locs":[{"a":618,"b":630}]}],"statement":"INSERT INTO class_package_templates (\n  branch_id,\n  name,\n  description,\n  class_count,\n  price,\n  validity_type,\n  validity_period,\n  is_gift_eligible,\n  is_shareable,\n  allows_waitlist,\n  priority_booking,\n  allowed_class_types,\n  blackout_dates,\n  max_classes_per_day,\n  max_classes_per_week,\n  is_active,\n  display_order\n) VALUES (\n  :branchId!,\n  :name!,\n  :description,\n  :classCount!,\n  :price!,\n  :validityType!,\n  :validityPeriod,\n  :isGiftEligible!,\n  :isShareable!,\n  :allowsWaitlist!,\n  :priorityBooking!,\n  :allowedClassTypes,\n  :blackoutDates,\n  :maxClassesPerDay,\n  :maxClassesPerWeek,\n  :isActive!,\n  :displayOrder\n)\nRETURNING *"};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO class_package_templates (
 *   branch_id,
 *   name,
 *   description,
 *   class_count,
 *   price,
 *   validity_type,
 *   validity_period,
 *   is_gift_eligible,
 *   is_shareable,
 *   allows_waitlist,
 *   priority_booking,
 *   allowed_class_types,
 *   blackout_dates,
 *   max_classes_per_day,
 *   max_classes_per_week,
 *   is_active,
 *   display_order
 * ) VALUES (
 *   :branchId!,
 *   :name!,
 *   :description,
 *   :classCount!,
 *   :price!,
 *   :validityType!,
 *   :validityPeriod,
 *   :isGiftEligible!,
 *   :isShareable!,
 *   :allowsWaitlist!,
 *   :priorityBooking!,
 *   :allowedClassTypes,
 *   :blackoutDates,
 *   :maxClassesPerDay,
 *   :maxClassesPerWeek,
 *   :isActive!,
 *   :displayOrder
 * )
 * RETURNING *
 * ```
 */
export const createPackageTemplate = new PreparedQuery<CreatePackageTemplateParams,CreatePackageTemplateResult>(createPackageTemplateIR);


/** 'GetPackageTemplates' parameters type */
export interface GetPackageTemplatesParams {
  branchId: string;
}

/** 'GetPackageTemplates' return type */
export interface GetPackageTemplatesResult {
  allowed_class_types: stringArray | null;
  allows_waitlist: boolean | null;
  blackout_dates: Json | null;
  branch_id: string;
  class_count: number;
  created_at: Date | null;
  description: string | null;
  display_order: number | null;
  id: string;
  is_active: boolean | null;
  is_gift_eligible: boolean | null;
  is_shareable: boolean | null;
  max_classes_per_day: number | null;
  max_classes_per_week: number | null;
  name: string;
  price: string;
  priority_booking: boolean | null;
  updated_at: Date | null;
  validity_period: number | null;
  validity_type: string;
}

/** 'GetPackageTemplates' query type */
export interface GetPackageTemplatesQuery {
  params: GetPackageTemplatesParams;
  result: GetPackageTemplatesResult;
}

const getPackageTemplatesIR: any = {"usedParamSet":{"branchId":true},"params":[{"name":"branchId","required":true,"transform":{"type":"scalar"},"locs":[{"a":376,"b":385}]}],"statement":"SELECT\n  id,\n  branch_id,\n  name,\n  description,\n  class_count,\n  price,\n  validity_type,\n  validity_period,\n  is_gift_eligible,\n  is_shareable,\n  allows_waitlist,\n  priority_booking,\n  allowed_class_types,\n  blackout_dates,\n  max_classes_per_day,\n  max_classes_per_week,\n  is_active,\n  display_order,\n  created_at,\n  updated_at\nFROM class_package_templates\nWHERE branch_id = :branchId!\n  AND is_active = true\nORDER BY display_order, class_count"};

/**
 * Query generated from SQL:
 * ```
 * SELECT
 *   id,
 *   branch_id,
 *   name,
 *   description,
 *   class_count,
 *   price,
 *   validity_type,
 *   validity_period,
 *   is_gift_eligible,
 *   is_shareable,
 *   allows_waitlist,
 *   priority_booking,
 *   allowed_class_types,
 *   blackout_dates,
 *   max_classes_per_day,
 *   max_classes_per_week,
 *   is_active,
 *   display_order,
 *   created_at,
 *   updated_at
 * FROM class_package_templates
 * WHERE branch_id = :branchId!
 *   AND is_active = true
 * ORDER BY display_order, class_count
 * ```
 */
export const getPackageTemplates = new PreparedQuery<GetPackageTemplatesParams,GetPackageTemplatesResult>(getPackageTemplatesIR);


/** 'GetAllPackageTemplatesByBranch' parameters type */
export interface GetAllPackageTemplatesByBranchParams {
  branchId: string;
}

/** 'GetAllPackageTemplatesByBranch' return type */
export interface GetAllPackageTemplatesByBranchResult {
  allowed_class_types: stringArray | null;
  allows_waitlist: boolean | null;
  blackout_dates: Json | null;
  branch_id: string;
  class_count: number;
  created_at: Date | null;
  description: string | null;
  display_order: number | null;
  id: string;
  is_active: boolean | null;
  is_gift_eligible: boolean | null;
  is_shareable: boolean | null;
  max_classes_per_day: number | null;
  max_classes_per_week: number | null;
  name: string;
  price: string;
  priority_booking: boolean | null;
  updated_at: Date | null;
  validity_period: number | null;
  validity_type: string;
}

/** 'GetAllPackageTemplatesByBranch' query type */
export interface GetAllPackageTemplatesByBranchQuery {
  params: GetAllPackageTemplatesByBranchParams;
  result: GetAllPackageTemplatesByBranchResult;
}

const getAllPackageTemplatesByBranchIR: any = {"usedParamSet":{"branchId":true},"params":[{"name":"branchId","required":true,"transform":{"type":"scalar"},"locs":[{"a":376,"b":385}]}],"statement":"SELECT\n  id,\n  branch_id,\n  name,\n  description,\n  class_count,\n  price,\n  validity_type,\n  validity_period,\n  is_gift_eligible,\n  is_shareable,\n  allows_waitlist,\n  priority_booking,\n  allowed_class_types,\n  blackout_dates,\n  max_classes_per_day,\n  max_classes_per_week,\n  is_active,\n  display_order,\n  created_at,\n  updated_at\nFROM class_package_templates\nWHERE branch_id = :branchId!\nORDER BY is_active DESC, display_order, class_count"};

/**
 * Query generated from SQL:
 * ```
 * SELECT
 *   id,
 *   branch_id,
 *   name,
 *   description,
 *   class_count,
 *   price,
 *   validity_type,
 *   validity_period,
 *   is_gift_eligible,
 *   is_shareable,
 *   allows_waitlist,
 *   priority_booking,
 *   allowed_class_types,
 *   blackout_dates,
 *   max_classes_per_day,
 *   max_classes_per_week,
 *   is_active,
 *   display_order,
 *   created_at,
 *   updated_at
 * FROM class_package_templates
 * WHERE branch_id = :branchId!
 * ORDER BY is_active DESC, display_order, class_count
 * ```
 */
export const getAllPackageTemplatesByBranch = new PreparedQuery<GetAllPackageTemplatesByBranchParams,GetAllPackageTemplatesByBranchResult>(getAllPackageTemplatesByBranchIR);


/** 'GetAllPackageTemplatesWithBranch' parameters type */
export type GetAllPackageTemplatesWithBranchParams = void;

/** 'GetAllPackageTemplatesWithBranch' return type */
export interface GetAllPackageTemplatesWithBranchResult {
  allowed_class_types: stringArray | null;
  allows_waitlist: boolean | null;
  blackout_dates: Json | null;
  branch_id: string;
  branch_name: string;
  class_count: number;
  created_at: Date | null;
  description: string | null;
  display_order: number | null;
  id: string;
  is_active: boolean | null;
  is_gift_eligible: boolean | null;
  is_shareable: boolean | null;
  max_classes_per_day: number | null;
  max_classes_per_week: number | null;
  name: string;
  price: string;
  priority_booking: boolean | null;
  updated_at: Date | null;
  validity_period: number | null;
  validity_type: string;
}

/** 'GetAllPackageTemplatesWithBranch' query type */
export interface GetAllPackageTemplatesWithBranchQuery {
  params: GetAllPackageTemplatesWithBranchParams;
  result: GetAllPackageTemplatesWithBranchResult;
}

const getAllPackageTemplatesWithBranchIR: any = {"usedParamSet":{},"params":[],"statement":"SELECT\n  cpt.id,\n  cpt.branch_id,\n  cpt.name,\n  cpt.description,\n  cpt.class_count,\n  cpt.price,\n  cpt.validity_type,\n  cpt.validity_period,\n  cpt.is_gift_eligible,\n  cpt.is_shareable,\n  cpt.allows_waitlist,\n  cpt.priority_booking,\n  cpt.allowed_class_types,\n  cpt.blackout_dates,\n  cpt.max_classes_per_day,\n  cpt.max_classes_per_week,\n  cpt.is_active,\n  cpt.display_order,\n  cpt.created_at,\n  cpt.updated_at,\n  b.name as branch_name\nFROM class_package_templates cpt\nJOIN branches b ON cpt.branch_id = b.id\nORDER BY b.name, cpt.is_active DESC, cpt.display_order, cpt.class_count"};

/**
 * Query generated from SQL:
 * ```
 * SELECT
 *   cpt.id,
 *   cpt.branch_id,
 *   cpt.name,
 *   cpt.description,
 *   cpt.class_count,
 *   cpt.price,
 *   cpt.validity_type,
 *   cpt.validity_period,
 *   cpt.is_gift_eligible,
 *   cpt.is_shareable,
 *   cpt.allows_waitlist,
 *   cpt.priority_booking,
 *   cpt.allowed_class_types,
 *   cpt.blackout_dates,
 *   cpt.max_classes_per_day,
 *   cpt.max_classes_per_week,
 *   cpt.is_active,
 *   cpt.display_order,
 *   cpt.created_at,
 *   cpt.updated_at,
 *   b.name as branch_name
 * FROM class_package_templates cpt
 * JOIN branches b ON cpt.branch_id = b.id
 * ORDER BY b.name, cpt.is_active DESC, cpt.display_order, cpt.class_count
 * ```
 */
export const getAllPackageTemplatesWithBranch = new PreparedQuery<GetAllPackageTemplatesWithBranchParams,GetAllPackageTemplatesWithBranchResult>(getAllPackageTemplatesWithBranchIR);


/** 'GetPackageTemplateByIdAny' parameters type */
export interface GetPackageTemplateByIdAnyParams {
  templateId: string;
}

/** 'GetPackageTemplateByIdAny' return type */
export interface GetPackageTemplateByIdAnyResult {
  allowed_class_types: stringArray | null;
  allows_waitlist: boolean | null;
  blackout_dates: Json | null;
  branch_id: string;
  class_count: number;
  created_at: Date | null;
  description: string | null;
  display_order: number | null;
  id: string;
  is_active: boolean | null;
  is_gift_eligible: boolean | null;
  is_shareable: boolean | null;
  max_classes_per_day: number | null;
  max_classes_per_week: number | null;
  name: string;
  price: string;
  priority_booking: boolean | null;
  updated_at: Date | null;
  validity_period: number | null;
  validity_type: string;
}

/** 'GetPackageTemplateByIdAny' query type */
export interface GetPackageTemplateByIdAnyQuery {
  params: GetPackageTemplateByIdAnyParams;
  result: GetPackageTemplateByIdAnyResult;
}

const getPackageTemplateByIdAnyIR: any = {"usedParamSet":{"templateId":true},"params":[{"name":"templateId","required":true,"transform":{"type":"scalar"},"locs":[{"a":369,"b":380}]}],"statement":"SELECT\n  id,\n  branch_id,\n  name,\n  description,\n  class_count,\n  price,\n  validity_type,\n  validity_period,\n  is_gift_eligible,\n  is_shareable,\n  allows_waitlist,\n  priority_booking,\n  allowed_class_types,\n  blackout_dates,\n  max_classes_per_day,\n  max_classes_per_week,\n  is_active,\n  display_order,\n  created_at,\n  updated_at\nFROM class_package_templates\nWHERE id = :templateId!"};

/**
 * Query generated from SQL:
 * ```
 * SELECT
 *   id,
 *   branch_id,
 *   name,
 *   description,
 *   class_count,
 *   price,
 *   validity_type,
 *   validity_period,
 *   is_gift_eligible,
 *   is_shareable,
 *   allows_waitlist,
 *   priority_booking,
 *   allowed_class_types,
 *   blackout_dates,
 *   max_classes_per_day,
 *   max_classes_per_week,
 *   is_active,
 *   display_order,
 *   created_at,
 *   updated_at
 * FROM class_package_templates
 * WHERE id = :templateId!
 * ```
 */
export const getPackageTemplateByIdAny = new PreparedQuery<GetPackageTemplateByIdAnyParams,GetPackageTemplateByIdAnyResult>(getPackageTemplateByIdAnyIR);


/** 'GetActivePackageTemplateById' parameters type */
export interface GetActivePackageTemplateByIdParams {
  templateId: string;
}

/** 'GetActivePackageTemplateById' return type */
export interface GetActivePackageTemplateByIdResult {
  allowed_class_types: stringArray | null;
  allows_waitlist: boolean | null;
  blackout_dates: Json | null;
  branch_id: string;
  class_count: number;
  created_at: Date | null;
  description: string | null;
  display_order: number | null;
  id: string;
  is_active: boolean | null;
  is_gift_eligible: boolean | null;
  is_shareable: boolean | null;
  max_classes_per_day: number | null;
  max_classes_per_week: number | null;
  name: string;
  price: string;
  priority_booking: boolean | null;
  updated_at: Date | null;
  validity_period: number | null;
  validity_type: string;
}

/** 'GetActivePackageTemplateById' query type */
export interface GetActivePackageTemplateByIdQuery {
  params: GetActivePackageTemplateByIdParams;
  result: GetActivePackageTemplateByIdResult;
}

const getActivePackageTemplateByIdIR: any = {"usedParamSet":{"templateId":true},"params":[{"name":"templateId","required":true,"transform":{"type":"scalar"},"locs":[{"a":369,"b":380}]}],"statement":"SELECT\n  id,\n  branch_id,\n  name,\n  description,\n  class_count,\n  price,\n  validity_type,\n  validity_period,\n  is_gift_eligible,\n  is_shareable,\n  allows_waitlist,\n  priority_booking,\n  allowed_class_types,\n  blackout_dates,\n  max_classes_per_day,\n  max_classes_per_week,\n  is_active,\n  display_order,\n  created_at,\n  updated_at\nFROM class_package_templates\nWHERE id = :templateId!\n  AND is_active = true"};

/**
 * Query generated from SQL:
 * ```
 * SELECT
 *   id,
 *   branch_id,
 *   name,
 *   description,
 *   class_count,
 *   price,
 *   validity_type,
 *   validity_period,
 *   is_gift_eligible,
 *   is_shareable,
 *   allows_waitlist,
 *   priority_booking,
 *   allowed_class_types,
 *   blackout_dates,
 *   max_classes_per_day,
 *   max_classes_per_week,
 *   is_active,
 *   display_order,
 *   created_at,
 *   updated_at
 * FROM class_package_templates
 * WHERE id = :templateId!
 *   AND is_active = true
 * ```
 */
export const getActivePackageTemplateById = new PreparedQuery<GetActivePackageTemplateByIdParams,GetActivePackageTemplateByIdResult>(getActivePackageTemplateByIdIR);


/** 'GetPackageTemplateById' parameters type */
export interface GetPackageTemplateByIdParams {
  branchId: string;
  templateId: string;
}

/** 'GetPackageTemplateById' return type */
export interface GetPackageTemplateByIdResult {
  allowed_class_types: stringArray | null;
  allows_waitlist: boolean | null;
  blackout_dates: Json | null;
  branch_id: string;
  class_count: number;
  created_at: Date | null;
  description: string | null;
  display_order: number | null;
  id: string;
  is_active: boolean | null;
  is_gift_eligible: boolean | null;
  is_shareable: boolean | null;
  max_classes_per_day: number | null;
  max_classes_per_week: number | null;
  name: string;
  price: string;
  priority_booking: boolean | null;
  updated_at: Date | null;
  validity_period: number | null;
  validity_type: string;
}

/** 'GetPackageTemplateById' query type */
export interface GetPackageTemplateByIdQuery {
  params: GetPackageTemplateByIdParams;
  result: GetPackageTemplateByIdResult;
}

const getPackageTemplateByIdIR: any = {"usedParamSet":{"templateId":true,"branchId":true},"params":[{"name":"templateId","required":true,"transform":{"type":"scalar"},"locs":[{"a":369,"b":380}]},{"name":"branchId","required":true,"transform":{"type":"scalar"},"locs":[{"a":400,"b":409}]}],"statement":"SELECT\n  id,\n  branch_id,\n  name,\n  description,\n  class_count,\n  price,\n  validity_type,\n  validity_period,\n  is_gift_eligible,\n  is_shareable,\n  allows_waitlist,\n  priority_booking,\n  allowed_class_types,\n  blackout_dates,\n  max_classes_per_day,\n  max_classes_per_week,\n  is_active,\n  display_order,\n  created_at,\n  updated_at\nFROM class_package_templates\nWHERE id = :templateId!\n  AND branch_id = :branchId!"};

/**
 * Query generated from SQL:
 * ```
 * SELECT
 *   id,
 *   branch_id,
 *   name,
 *   description,
 *   class_count,
 *   price,
 *   validity_type,
 *   validity_period,
 *   is_gift_eligible,
 *   is_shareable,
 *   allows_waitlist,
 *   priority_booking,
 *   allowed_class_types,
 *   blackout_dates,
 *   max_classes_per_day,
 *   max_classes_per_week,
 *   is_active,
 *   display_order,
 *   created_at,
 *   updated_at
 * FROM class_package_templates
 * WHERE id = :templateId!
 *   AND branch_id = :branchId!
 * ```
 */
export const getPackageTemplateById = new PreparedQuery<GetPackageTemplateByIdParams,GetPackageTemplateByIdResult>(getPackageTemplateByIdIR);


/** 'UpdatePackageTemplateStatus' parameters type */
export interface UpdatePackageTemplateStatusParams {
  isActive: boolean;
  templateId: string;
}

/** 'UpdatePackageTemplateStatus' return type */
export interface UpdatePackageTemplateStatusResult {
  allowed_class_types: stringArray | null;
  allows_waitlist: boolean | null;
  blackout_dates: Json | null;
  branch_id: string;
  class_count: number;
  created_at: Date | null;
  description: string | null;
  display_order: number | null;
  id: string;
  is_active: boolean | null;
  is_gift_eligible: boolean | null;
  is_shareable: boolean | null;
  max_classes_per_day: number | null;
  max_classes_per_week: number | null;
  name: string;
  price: string;
  priority_booking: boolean | null;
  updated_at: Date | null;
  validity_period: number | null;
  validity_type: string;
}

/** 'UpdatePackageTemplateStatus' query type */
export interface UpdatePackageTemplateStatusQuery {
  params: UpdatePackageTemplateStatusParams;
  result: UpdatePackageTemplateStatusResult;
}

const updatePackageTemplateStatusIR: any = {"usedParamSet":{"isActive":true,"templateId":true},"params":[{"name":"isActive","required":true,"transform":{"type":"scalar"},"locs":[{"a":49,"b":58}]},{"name":"templateId","required":true,"transform":{"type":"scalar"},"locs":[{"a":105,"b":116}]}],"statement":"UPDATE class_package_templates\nSET\n  is_active = :isActive!,\n  updated_at = CURRENT_TIMESTAMP\nWHERE id = :templateId!\nRETURNING *"};

/**
 * Query generated from SQL:
 * ```
 * UPDATE class_package_templates
 * SET
 *   is_active = :isActive!,
 *   updated_at = CURRENT_TIMESTAMP
 * WHERE id = :templateId!
 * RETURNING *
 * ```
 */
export const updatePackageTemplateStatus = new PreparedQuery<UpdatePackageTemplateStatusParams,UpdatePackageTemplateStatusResult>(updatePackageTemplateStatusIR);


/** 'GetPackagePurchasesCount' parameters type */
export interface GetPackagePurchasesCountParams {
  templateId: string;
}

/** 'GetPackagePurchasesCount' return type */
export interface GetPackagePurchasesCountResult {
  count: number | null;
}

/** 'GetPackagePurchasesCount' query type */
export interface GetPackagePurchasesCountQuery {
  params: GetPackagePurchasesCountParams;
  result: GetPackagePurchasesCountResult;
}

const getPackagePurchasesCountIR: any = {"usedParamSet":{"templateId":true},"params":[{"name":"templateId","required":true,"transform":{"type":"scalar"},"locs":[{"a":83,"b":94}]}],"statement":"SELECT COUNT(*)::int as count\nFROM user_class_packages\nWHERE package_template_id = :templateId!"};

/**
 * Query generated from SQL:
 * ```
 * SELECT COUNT(*)::int as count
 * FROM user_class_packages
 * WHERE package_template_id = :templateId!
 * ```
 */
export const getPackagePurchasesCount = new PreparedQuery<GetPackagePurchasesCountParams,GetPackagePurchasesCountResult>(getPackagePurchasesCountIR);


/** 'DeletePackageTemplateById' parameters type */
export interface DeletePackageTemplateByIdParams {
  templateId: string;
}

/** 'DeletePackageTemplateById' return type */
export interface DeletePackageTemplateByIdResult {
  id: string;
}

/** 'DeletePackageTemplateById' query type */
export interface DeletePackageTemplateByIdQuery {
  params: DeletePackageTemplateByIdParams;
  result: DeletePackageTemplateByIdResult;
}

const deletePackageTemplateByIdIR: any = {"usedParamSet":{"templateId":true},"params":[{"name":"templateId","required":true,"transform":{"type":"scalar"},"locs":[{"a":47,"b":58}]}],"statement":"DELETE FROM class_package_templates\nWHERE id = :templateId!\nRETURNING id"};

/**
 * Query generated from SQL:
 * ```
 * DELETE FROM class_package_templates
 * WHERE id = :templateId!
 * RETURNING id
 * ```
 */
export const deletePackageTemplateById = new PreparedQuery<DeletePackageTemplateByIdParams,DeletePackageTemplateByIdResult>(deletePackageTemplateByIdIR);


/** 'UpdatePackageTemplate' parameters type */
export interface UpdatePackageTemplateParams {
  allowedClassTypes?: stringArray | null | void;
  allowsWaitlist: boolean;
  blackoutDates?: Json | null | void;
  branchId: string;
  classCount: number;
  description?: string | null | void;
  displayOrder?: number | null | void;
  isActive: boolean;
  isGiftEligible: boolean;
  isShareable: boolean;
  maxClassesPerDay?: number | null | void;
  maxClassesPerWeek?: number | null | void;
  name: string;
  price: NumberOrString;
  priorityBooking: boolean;
  templateId: string;
  validityPeriod?: number | null | void;
  validityType: string;
}

/** 'UpdatePackageTemplate' return type */
export interface UpdatePackageTemplateResult {
  allowed_class_types: stringArray | null;
  allows_waitlist: boolean | null;
  blackout_dates: Json | null;
  branch_id: string;
  class_count: number;
  created_at: Date | null;
  description: string | null;
  display_order: number | null;
  id: string;
  is_active: boolean | null;
  is_gift_eligible: boolean | null;
  is_shareable: boolean | null;
  max_classes_per_day: number | null;
  max_classes_per_week: number | null;
  name: string;
  price: string;
  priority_booking: boolean | null;
  updated_at: Date | null;
  validity_period: number | null;
  validity_type: string;
}

/** 'UpdatePackageTemplate' query type */
export interface UpdatePackageTemplateQuery {
  params: UpdatePackageTemplateParams;
  result: UpdatePackageTemplateResult;
}

const updatePackageTemplateIR: any = {"usedParamSet":{"name":true,"description":true,"classCount":true,"price":true,"validityType":true,"validityPeriod":true,"isGiftEligible":true,"isShareable":true,"allowsWaitlist":true,"priorityBooking":true,"allowedClassTypes":true,"blackoutDates":true,"maxClassesPerDay":true,"maxClassesPerWeek":true,"isActive":true,"displayOrder":true,"templateId":true,"branchId":true},"params":[{"name":"name","required":true,"transform":{"type":"scalar"},"locs":[{"a":44,"b":49}]},{"name":"description","required":false,"transform":{"type":"scalar"},"locs":[{"a":68,"b":79}]},{"name":"classCount","required":true,"transform":{"type":"scalar"},"locs":[{"a":98,"b":109}]},{"name":"price","required":true,"transform":{"type":"scalar"},"locs":[{"a":122,"b":128}]},{"name":"validityType","required":true,"transform":{"type":"scalar"},"locs":[{"a":149,"b":162}]},{"name":"validityPeriod","required":false,"transform":{"type":"scalar"},"locs":[{"a":185,"b":199}]},{"name":"isGiftEligible","required":true,"transform":{"type":"scalar"},"locs":[{"a":223,"b":238}]},{"name":"isShareable","required":true,"transform":{"type":"scalar"},"locs":[{"a":258,"b":270}]},{"name":"allowsWaitlist","required":true,"transform":{"type":"scalar"},"locs":[{"a":293,"b":308}]},{"name":"priorityBooking","required":true,"transform":{"type":"scalar"},"locs":[{"a":332,"b":348}]},{"name":"allowedClassTypes","required":false,"transform":{"type":"scalar"},"locs":[{"a":375,"b":392}]},{"name":"blackoutDates","required":false,"transform":{"type":"scalar"},"locs":[{"a":414,"b":427}]},{"name":"maxClassesPerDay","required":false,"transform":{"type":"scalar"},"locs":[{"a":454,"b":470}]},{"name":"maxClassesPerWeek","required":false,"transform":{"type":"scalar"},"locs":[{"a":498,"b":515}]},{"name":"isActive","required":true,"transform":{"type":"scalar"},"locs":[{"a":532,"b":541}]},{"name":"displayOrder","required":false,"transform":{"type":"scalar"},"locs":[{"a":562,"b":574}]},{"name":"templateId","required":true,"transform":{"type":"scalar"},"locs":[{"a":587,"b":598}]},{"name":"branchId","required":true,"transform":{"type":"scalar"},"locs":[{"a":618,"b":627}]}],"statement":"UPDATE class_package_templates\nSET\n  name = :name!,\n  description = :description,\n  class_count = :classCount!,\n  price = :price!,\n  validity_type = :validityType!,\n  validity_period = :validityPeriod,\n  is_gift_eligible = :isGiftEligible!,\n  is_shareable = :isShareable!,\n  allows_waitlist = :allowsWaitlist!,\n  priority_booking = :priorityBooking!,\n  allowed_class_types = :allowedClassTypes,\n  blackout_dates = :blackoutDates,\n  max_classes_per_day = :maxClassesPerDay,\n  max_classes_per_week = :maxClassesPerWeek,\n  is_active = :isActive!,\n  display_order = :displayOrder\nWHERE id = :templateId!\n  AND branch_id = :branchId!\nRETURNING *"};

/**
 * Query generated from SQL:
 * ```
 * UPDATE class_package_templates
 * SET
 *   name = :name!,
 *   description = :description,
 *   class_count = :classCount!,
 *   price = :price!,
 *   validity_type = :validityType!,
 *   validity_period = :validityPeriod,
 *   is_gift_eligible = :isGiftEligible!,
 *   is_shareable = :isShareable!,
 *   allows_waitlist = :allowsWaitlist!,
 *   priority_booking = :priorityBooking!,
 *   allowed_class_types = :allowedClassTypes,
 *   blackout_dates = :blackoutDates,
 *   max_classes_per_day = :maxClassesPerDay,
 *   max_classes_per_week = :maxClassesPerWeek,
 *   is_active = :isActive!,
 *   display_order = :displayOrder
 * WHERE id = :templateId!
 *   AND branch_id = :branchId!
 * RETURNING *
 * ```
 */
export const updatePackageTemplate = new PreparedQuery<UpdatePackageTemplateParams,UpdatePackageTemplateResult>(updatePackageTemplateIR);


/** 'PurchasePackage' parameters type */
export interface PurchasePackageParams {
  branchId: string;
  classesRemaining: number;
  expiresAt?: DateOrString | null | void;
  giftFromUserId?: string | null | void;
  giftMessage?: string | null | void;
  isGift: boolean;
  packageTemplateId: string;
  paymentId?: string | null | void;
  purchasePrice: NumberOrString;
  status: string;
  totalClasses: number;
  userId: string;
}

/** 'PurchasePackage' return type */
export interface PurchasePackageResult {
  activated_at: Date | null;
  branch_id: string;
  classes_remaining: number;
  created_at: Date | null;
  expires_at: Date | null;
  frozen_until: Date | null;
  gift_from_user_id: string | null;
  gift_message: string | null;
  gift_redeemed_at: Date | null;
  id: string;
  is_gift: boolean | null;
  is_shareable: boolean | null;
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
}

/** 'PurchasePackage' query type */
export interface PurchasePackageQuery {
  params: PurchasePackageParams;
  result: PurchasePackageResult;
}

const purchasePackageIR: any = {"usedParamSet":{"userId":true,"branchId":true,"packageTemplateId":true,"totalClasses":true,"classesRemaining":true,"expiresAt":true,"status":true,"isGift":true,"giftFromUserId":true,"giftMessage":true,"paymentId":true,"purchasePrice":true},"params":[{"name":"userId","required":true,"transform":{"type":"scalar"},"locs":[{"a":235,"b":242}]},{"name":"branchId","required":true,"transform":{"type":"scalar"},"locs":[{"a":247,"b":256}]},{"name":"packageTemplateId","required":true,"transform":{"type":"scalar"},"locs":[{"a":261,"b":279}]},{"name":"totalClasses","required":true,"transform":{"type":"scalar"},"locs":[{"a":284,"b":297}]},{"name":"classesRemaining","required":true,"transform":{"type":"scalar"},"locs":[{"a":302,"b":319}]},{"name":"expiresAt","required":false,"transform":{"type":"scalar"},"locs":[{"a":324,"b":333}]},{"name":"status","required":true,"transform":{"type":"scalar"},"locs":[{"a":338,"b":345}]},{"name":"isGift","required":true,"transform":{"type":"scalar"},"locs":[{"a":350,"b":357}]},{"name":"giftFromUserId","required":false,"transform":{"type":"scalar"},"locs":[{"a":362,"b":376}]},{"name":"giftMessage","required":false,"transform":{"type":"scalar"},"locs":[{"a":381,"b":392}]},{"name":"paymentId","required":false,"transform":{"type":"scalar"},"locs":[{"a":397,"b":406}]},{"name":"purchasePrice","required":true,"transform":{"type":"scalar"},"locs":[{"a":411,"b":425}]}],"statement":"INSERT INTO user_class_packages (\n  user_id,\n  branch_id,\n  package_template_id,\n  total_classes,\n  classes_remaining,\n  expires_at,\n  status,\n  is_gift,\n  gift_from_user_id,\n  gift_message,\n  payment_id,\n  purchase_price\n) VALUES (\n  :userId!,\n  :branchId!,\n  :packageTemplateId!,\n  :totalClasses!,\n  :classesRemaining!,\n  :expiresAt,\n  :status!,\n  :isGift!,\n  :giftFromUserId,\n  :giftMessage,\n  :paymentId,\n  :purchasePrice!\n)\nRETURNING *"};

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
 *   gift_from_user_id,
 *   gift_message,
 *   payment_id,
 *   purchase_price
 * ) VALUES (
 *   :userId!,
 *   :branchId!,
 *   :packageTemplateId!,
 *   :totalClasses!,
 *   :classesRemaining!,
 *   :expiresAt,
 *   :status!,
 *   :isGift!,
 *   :giftFromUserId,
 *   :giftMessage,
 *   :paymentId,
 *   :purchasePrice!
 * )
 * RETURNING *
 * ```
 */
export const purchasePackage = new PreparedQuery<PurchasePackageParams,PurchasePackageResult>(purchasePackageIR);


/** 'GetUserPackages' parameters type */
export interface GetUserPackagesParams {
  branchId: string;
  userId: string;
}

/** 'GetUserPackages' return type */
export interface GetUserPackagesResult {
  activated_at: Date | null;
  allowed_class_types: stringArray | null;
  branch_id: string;
  classes_remaining: number;
  created_at: Date | null;
  expires_at: Date | null;
  frozen_until: Date | null;
  gift_from_user_id: string | null;
  gift_message: string | null;
  gift_redeemed_at: Date | null;
  id: string;
  is_gift: boolean | null;
  is_shareable: boolean | null;
  max_classes_per_day: number | null;
  max_classes_per_week: number | null;
  package_template_id: string;
  payment_id: string | null;
  purchase_price: string;
  purchased_at: Date | null;
  refund_amount: string | null;
  refund_reason: string | null;
  refunded_at: Date | null;
  shared_with_user_ids: stringArray | null;
  status: string | null;
  template_description: string | null;
  template_name: string;
  total_classes: number;
  updated_at: Date | null;
  user_id: string;
  validity_type: string;
}

/** 'GetUserPackages' query type */
export interface GetUserPackagesQuery {
  params: GetUserPackagesParams;
  result: GetUserPackagesResult;
}

const getUserPackagesIR: any = {"usedParamSet":{"userId":true,"branchId":true},"params":[{"name":"userId","required":true,"transform":{"type":"scalar"},"locs":[{"a":308,"b":315}]},{"name":"branchId","required":true,"transform":{"type":"scalar"},"locs":[{"a":339,"b":348}]}],"statement":"SELECT\n  ucp.*,\n  cpt.name as template_name,\n  cpt.description as template_description,\n  cpt.validity_type,\n  cpt.allowed_class_types,\n  cpt.max_classes_per_day,\n  cpt.max_classes_per_week\nFROM user_class_packages ucp\nJOIN class_package_templates cpt ON ucp.package_template_id = cpt.id\nWHERE ucp.user_id = :userId!\n  AND ucp.branch_id = :branchId!\nORDER BY ucp.status = 'active' DESC, ucp.purchased_at DESC"};

/**
 * Query generated from SQL:
 * ```
 * SELECT
 *   ucp.*,
 *   cpt.name as template_name,
 *   cpt.description as template_description,
 *   cpt.validity_type,
 *   cpt.allowed_class_types,
 *   cpt.max_classes_per_day,
 *   cpt.max_classes_per_week
 * FROM user_class_packages ucp
 * JOIN class_package_templates cpt ON ucp.package_template_id = cpt.id
 * WHERE ucp.user_id = :userId!
 *   AND ucp.branch_id = :branchId!
 * ORDER BY ucp.status = 'active' DESC, ucp.purchased_at DESC
 * ```
 */
export const getUserPackages = new PreparedQuery<GetUserPackagesParams,GetUserPackagesResult>(getUserPackagesIR);


/** 'GetActivePackages' parameters type */
export interface GetActivePackagesParams {
  branchId: string;
  userId: string;
}

/** 'GetActivePackages' return type */
export interface GetActivePackagesResult {
  activated_at: Date | null;
  allowed_class_types: stringArray | null;
  branch_id: string;
  classes_remaining: number;
  created_at: Date | null;
  expires_at: Date | null;
  frozen_until: Date | null;
  gift_from_user_id: string | null;
  gift_message: string | null;
  gift_redeemed_at: Date | null;
  id: string;
  is_gift: boolean | null;
  is_shareable: boolean | null;
  max_classes_per_day: number | null;
  max_classes_per_week: number | null;
  package_template_id: string;
  payment_id: string | null;
  purchase_price: string;
  purchased_at: Date | null;
  refund_amount: string | null;
  refund_reason: string | null;
  refunded_at: Date | null;
  shared_with_user_ids: stringArray | null;
  status: string | null;
  template_name: string;
  total_classes: number;
  updated_at: Date | null;
  user_id: string;
}

/** 'GetActivePackages' query type */
export interface GetActivePackagesQuery {
  params: GetActivePackagesParams;
  result: GetActivePackagesResult;
}

const getActivePackagesIR: any = {"usedParamSet":{"userId":true,"branchId":true},"params":[{"name":"userId","required":true,"transform":{"type":"scalar"},"locs":[{"a":244,"b":251}]},{"name":"branchId","required":true,"transform":{"type":"scalar"},"locs":[{"a":275,"b":284}]}],"statement":"SELECT\n  ucp.*,\n  cpt.name as template_name,\n  cpt.allowed_class_types,\n  cpt.max_classes_per_day,\n  cpt.max_classes_per_week\nFROM user_class_packages ucp\nJOIN class_package_templates cpt ON ucp.package_template_id = cpt.id\nWHERE ucp.user_id = :userId!\n  AND ucp.branch_id = :branchId!\n  AND ucp.status = 'active'\n  AND ucp.classes_remaining > 0\n  AND (ucp.expires_at IS NULL OR ucp.expires_at > CURRENT_TIMESTAMP)\n  AND (ucp.frozen_until IS NULL OR ucp.frozen_until < CURRENT_DATE)\nORDER BY ucp.expires_at NULLS LAST"};

/**
 * Query generated from SQL:
 * ```
 * SELECT
 *   ucp.*,
 *   cpt.name as template_name,
 *   cpt.allowed_class_types,
 *   cpt.max_classes_per_day,
 *   cpt.max_classes_per_week
 * FROM user_class_packages ucp
 * JOIN class_package_templates cpt ON ucp.package_template_id = cpt.id
 * WHERE ucp.user_id = :userId!
 *   AND ucp.branch_id = :branchId!
 *   AND ucp.status = 'active'
 *   AND ucp.classes_remaining > 0
 *   AND (ucp.expires_at IS NULL OR ucp.expires_at > CURRENT_TIMESTAMP)
 *   AND (ucp.frozen_until IS NULL OR ucp.frozen_until < CURRENT_DATE)
 * ORDER BY ucp.expires_at NULLS LAST
 * ```
 */
export const getActivePackages = new PreparedQuery<GetActivePackagesParams,GetActivePackagesResult>(getActivePackagesIR);


/** 'GetPackageById' parameters type */
export interface GetPackageByIdParams {
  branchId: string;
  packageId: string;
}

/** 'GetPackageById' return type */
export interface GetPackageByIdResult {
  activated_at: Date | null;
  allowed_class_types: stringArray | null;
  branch_id: string;
  classes_remaining: number;
  created_at: Date | null;
  expires_at: Date | null;
  frozen_until: Date | null;
  gift_from_user_id: string | null;
  gift_message: string | null;
  gift_redeemed_at: Date | null;
  id: string;
  is_gift: boolean | null;
  is_shareable: boolean | null;
  package_template_id: string;
  payment_id: string | null;
  purchase_price: string;
  purchased_at: Date | null;
  refund_amount: string | null;
  refund_reason: string | null;
  refunded_at: Date | null;
  shared_with_user_ids: stringArray | null;
  status: string | null;
  template_description: string | null;
  template_name: string;
  total_classes: number;
  updated_at: Date | null;
  user_id: string;
  validity_type: string;
}

/** 'GetPackageById' query type */
export interface GetPackageByIdQuery {
  params: GetPackageByIdParams;
  result: GetPackageByIdResult;
}

const getPackageByIdIR: any = {"usedParamSet":{"packageId":true,"branchId":true},"params":[{"name":"packageId","required":true,"transform":{"type":"scalar"},"locs":[{"a":248,"b":258}]},{"name":"branchId","required":true,"transform":{"type":"scalar"},"locs":[{"a":282,"b":291}]}],"statement":"SELECT\n  ucp.*,\n  cpt.name as template_name,\n  cpt.description as template_description,\n  cpt.validity_type,\n  cpt.allowed_class_types\nFROM user_class_packages ucp\nJOIN class_package_templates cpt ON ucp.package_template_id = cpt.id\nWHERE ucp.id = :packageId!\n  AND ucp.branch_id = :branchId!"};

/**
 * Query generated from SQL:
 * ```
 * SELECT
 *   ucp.*,
 *   cpt.name as template_name,
 *   cpt.description as template_description,
 *   cpt.validity_type,
 *   cpt.allowed_class_types
 * FROM user_class_packages ucp
 * JOIN class_package_templates cpt ON ucp.package_template_id = cpt.id
 * WHERE ucp.id = :packageId!
 *   AND ucp.branch_id = :branchId!
 * ```
 */
export const getPackageById = new PreparedQuery<GetPackageByIdParams,GetPackageByIdResult>(getPackageByIdIR);


/** 'CheckPackageEligibility' parameters type */
export interface CheckPackageEligibilityParams {
  classId: string;
  packageId: string;
  userId: string;
}

/** 'CheckPackageEligibility' return type */
export interface CheckPackageEligibilityResult {
  can_book: boolean | null;
}

/** 'CheckPackageEligibility' query type */
export interface CheckPackageEligibilityQuery {
  params: CheckPackageEligibilityParams;
  result: CheckPackageEligibilityResult;
}

const checkPackageEligibilityIR: any = {"usedParamSet":{"packageId":true,"classId":true,"userId":true},"params":[{"name":"packageId","required":true,"transform":{"type":"scalar"},"locs":[{"a":29,"b":39}]},{"name":"classId","required":true,"transform":{"type":"scalar"},"locs":[{"a":42,"b":50}]},{"name":"userId","required":true,"transform":{"type":"scalar"},"locs":[{"a":53,"b":60}]}],"statement":"SELECT can_book_with_package(:packageId!, :classId!, :userId!) as can_book"};

/**
 * Query generated from SQL:
 * ```
 * SELECT can_book_with_package(:packageId!, :classId!, :userId!) as can_book
 * ```
 */
export const checkPackageEligibility = new PreparedQuery<CheckPackageEligibilityParams,CheckPackageEligibilityResult>(checkPackageEligibilityIR);


/** 'UsePackageCredit' parameters type */
export interface UsePackageCreditParams {
  bookingId: string;
  classId: string;
  packageId: string;
  userId: string;
}

/** 'UsePackageCredit' return type */
export interface UsePackageCreditResult {
  success: boolean | null;
}

/** 'UsePackageCredit' query type */
export interface UsePackageCreditQuery {
  params: UsePackageCreditParams;
  result: UsePackageCreditResult;
}

const usePackageCreditIR: any = {"usedParamSet":{"packageId":true,"bookingId":true,"classId":true,"userId":true},"params":[{"name":"packageId","required":true,"transform":{"type":"scalar"},"locs":[{"a":26,"b":36}]},{"name":"bookingId","required":true,"transform":{"type":"scalar"},"locs":[{"a":39,"b":49}]},{"name":"classId","required":true,"transform":{"type":"scalar"},"locs":[{"a":52,"b":60}]},{"name":"userId","required":true,"transform":{"type":"scalar"},"locs":[{"a":63,"b":70}]}],"statement":"SELECT use_package_credit(:packageId!, :bookingId!, :classId!, :userId!) as success"};

/**
 * Query generated from SQL:
 * ```
 * SELECT use_package_credit(:packageId!, :bookingId!, :classId!, :userId!) as success
 * ```
 */
export const usePackageCredit = new PreparedQuery<UsePackageCreditParams,UsePackageCreditResult>(usePackageCreditIR);


/** 'RecordPackageUsage' parameters type */
export interface RecordPackageUsageParams {
  bookingId: string;
  branchId: string;
  classId: string;
  creditsUsed: number;
  userId: string;
  userPackageId: string;
}

/** 'RecordPackageUsage' return type */
export interface RecordPackageUsageResult {
  booking_id: string;
  branch_id: string;
  class_id: string;
  created_at: Date | null;
  credits_used: number | null;
  id: string;
  refund_reason: string | null;
  refunded: boolean | null;
  refunded_at: Date | null;
  used_at: Date | null;
  user_id: string;
  user_package_id: string;
}

/** 'RecordPackageUsage' query type */
export interface RecordPackageUsageQuery {
  params: RecordPackageUsageParams;
  result: RecordPackageUsageResult;
}

const recordPackageUsageIR: any = {"usedParamSet":{"userPackageId":true,"bookingId":true,"userId":true,"classId":true,"branchId":true,"creditsUsed":true},"params":[{"name":"userPackageId","required":true,"transform":{"type":"scalar"},"locs":[{"a":131,"b":145}]},{"name":"bookingId","required":true,"transform":{"type":"scalar"},"locs":[{"a":150,"b":160}]},{"name":"userId","required":true,"transform":{"type":"scalar"},"locs":[{"a":165,"b":172}]},{"name":"classId","required":true,"transform":{"type":"scalar"},"locs":[{"a":177,"b":185}]},{"name":"branchId","required":true,"transform":{"type":"scalar"},"locs":[{"a":190,"b":199}]},{"name":"creditsUsed","required":true,"transform":{"type":"scalar"},"locs":[{"a":204,"b":216}]}],"statement":"INSERT INTO package_class_usage (\n  user_package_id,\n  booking_id,\n  user_id,\n  class_id,\n  branch_id,\n  credits_used\n) VALUES (\n  :userPackageId!,\n  :bookingId!,\n  :userId!,\n  :classId!,\n  :branchId!,\n  :creditsUsed!\n)\nRETURNING *"};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO package_class_usage (
 *   user_package_id,
 *   booking_id,
 *   user_id,
 *   class_id,
 *   branch_id,
 *   credits_used
 * ) VALUES (
 *   :userPackageId!,
 *   :bookingId!,
 *   :userId!,
 *   :classId!,
 *   :branchId!,
 *   :creditsUsed!
 * )
 * RETURNING *
 * ```
 */
export const recordPackageUsage = new PreparedQuery<RecordPackageUsageParams,RecordPackageUsageResult>(recordPackageUsageIR);


/** 'GetPackageUsageHistory' parameters type */
export interface GetPackageUsageHistoryParams {
  branchId: string;
  packageId: string;
}

/** 'GetPackageUsageHistory' return type */
export interface GetPackageUsageHistoryResult {
  booking_id: string;
  branch_id: string;
  class_id: string;
  class_name: string;
  created_at: Date | null;
  credits_used: number | null;
  id: string;
  instructor: string | null;
  refund_reason: string | null;
  refunded: boolean | null;
  refunded_at: Date | null;
  scheduled_at: Date;
  used_at: Date | null;
  user_id: string;
  user_package_id: string;
}

/** 'GetPackageUsageHistory' query type */
export interface GetPackageUsageHistoryQuery {
  params: GetPackageUsageHistoryParams;
  result: GetPackageUsageHistoryResult;
}

const getPackageUsageHistoryIR: any = {"usedParamSet":{"packageId":true,"branchId":true},"params":[{"name":"packageId","required":true,"transform":{"type":"scalar"},"locs":[{"a":168,"b":178}]},{"name":"branchId","required":true,"transform":{"type":"scalar"},"locs":[{"a":202,"b":211}]}],"statement":"SELECT\n  pcu.*,\n  c.scheduled_at,\n  c.name as class_name,\n  c.instructor\nFROM package_class_usage pcu\nJOIN classes c ON pcu.class_id = c.id\nWHERE pcu.user_package_id = :packageId!\n  AND pcu.branch_id = :branchId!\n  AND pcu.refunded = false\nORDER BY pcu.used_at DESC"};

/**
 * Query generated from SQL:
 * ```
 * SELECT
 *   pcu.*,
 *   c.scheduled_at,
 *   c.name as class_name,
 *   c.instructor
 * FROM package_class_usage pcu
 * JOIN classes c ON pcu.class_id = c.id
 * WHERE pcu.user_package_id = :packageId!
 *   AND pcu.branch_id = :branchId!
 *   AND pcu.refunded = false
 * ORDER BY pcu.used_at DESC
 * ```
 */
export const getPackageUsageHistory = new PreparedQuery<GetPackageUsageHistoryParams,GetPackageUsageHistoryResult>(getPackageUsageHistoryIR);


/** 'RefundPackageCredit' parameters type */
export interface RefundPackageCreditParams {
  branchId: string;
  refundReason?: string | null | void;
  usageId: string;
}

/** 'RefundPackageCredit' return type */
export interface RefundPackageCreditResult {
  booking_id: string;
  branch_id: string;
  class_id: string;
  created_at: Date | null;
  credits_used: number | null;
  id: string;
  refund_reason: string | null;
  refunded: boolean | null;
  refunded_at: Date | null;
  used_at: Date | null;
  user_id: string;
  user_package_id: string;
}

/** 'RefundPackageCredit' query type */
export interface RefundPackageCreditQuery {
  params: RefundPackageCreditParams;
  result: RefundPackageCreditResult;
}

const refundPackageCreditIR: any = {"usedParamSet":{"refundReason":true,"usageId":true,"branchId":true},"params":[{"name":"refundReason","required":false,"transform":{"type":"scalar"},"locs":[{"a":103,"b":115}]},{"name":"usageId","required":true,"transform":{"type":"scalar"},"locs":[{"a":128,"b":136}]},{"name":"branchId","required":true,"transform":{"type":"scalar"},"locs":[{"a":156,"b":165}]}],"statement":"UPDATE package_class_usage\nSET\n  refunded = true,\n  refunded_at = CURRENT_TIMESTAMP,\n  refund_reason = :refundReason\nWHERE id = :usageId!\n  AND branch_id = :branchId!\nRETURNING *"};

/**
 * Query generated from SQL:
 * ```
 * UPDATE package_class_usage
 * SET
 *   refunded = true,
 *   refunded_at = CURRENT_TIMESTAMP,
 *   refund_reason = :refundReason
 * WHERE id = :usageId!
 *   AND branch_id = :branchId!
 * RETURNING *
 * ```
 */
export const refundPackageCredit = new PreparedQuery<RefundPackageCreditParams,RefundPackageCreditResult>(refundPackageCreditIR);


/** 'RestorePackageCredit' parameters type */
export interface RestorePackageCreditParams {
  branchId: string;
  creditsToRestore: number;
  packageId: string;
}

/** 'RestorePackageCredit' return type */
export interface RestorePackageCreditResult {
  activated_at: Date | null;
  branch_id: string;
  classes_remaining: number;
  created_at: Date | null;
  expires_at: Date | null;
  frozen_until: Date | null;
  gift_from_user_id: string | null;
  gift_message: string | null;
  gift_redeemed_at: Date | null;
  id: string;
  is_gift: boolean | null;
  is_shareable: boolean | null;
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
}

/** 'RestorePackageCredit' query type */
export interface RestorePackageCreditQuery {
  params: RestorePackageCreditParams;
  result: RestorePackageCreditResult;
}

const restorePackageCreditIR: any = {"usedParamSet":{"creditsToRestore":true,"packageId":true,"branchId":true},"params":[{"name":"creditsToRestore","required":true,"transform":{"type":"scalar"},"locs":[{"a":71,"b":88}]},{"name":"packageId","required":true,"transform":{"type":"scalar"},"locs":[{"a":101,"b":111}]},{"name":"branchId","required":true,"transform":{"type":"scalar"},"locs":[{"a":131,"b":140}]}],"statement":"UPDATE user_class_packages\nSET classes_remaining = classes_remaining + :creditsToRestore!\nWHERE id = :packageId!\n  AND branch_id = :branchId!\nRETURNING *"};

/**
 * Query generated from SQL:
 * ```
 * UPDATE user_class_packages
 * SET classes_remaining = classes_remaining + :creditsToRestore!
 * WHERE id = :packageId!
 *   AND branch_id = :branchId!
 * RETURNING *
 * ```
 */
export const restorePackageCredit = new PreparedQuery<RestorePackageCreditParams,RestorePackageCreditResult>(restorePackageCreditIR);


/** 'FreezePackage' parameters type */
export interface FreezePackageParams {
  branchId: string;
  frozenUntil: DateOrString;
  packageId: string;
}

/** 'FreezePackage' return type */
export interface FreezePackageResult {
  activated_at: Date | null;
  branch_id: string;
  classes_remaining: number;
  created_at: Date | null;
  expires_at: Date | null;
  frozen_until: Date | null;
  gift_from_user_id: string | null;
  gift_message: string | null;
  gift_redeemed_at: Date | null;
  id: string;
  is_gift: boolean | null;
  is_shareable: boolean | null;
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
}

/** 'FreezePackage' query type */
export interface FreezePackageQuery {
  params: FreezePackageParams;
  result: FreezePackageResult;
}

const freezePackageIR: any = {"usedParamSet":{"frozenUntil":true,"packageId":true,"branchId":true},"params":[{"name":"frozenUntil","required":true,"transform":{"type":"scalar"},"locs":[{"a":69,"b":81}]},{"name":"packageId","required":true,"transform":{"type":"scalar"},"locs":[{"a":94,"b":104}]},{"name":"branchId","required":true,"transform":{"type":"scalar"},"locs":[{"a":124,"b":133}]}],"statement":"UPDATE user_class_packages\nSET\n  status = 'frozen',\n  frozen_until = :frozenUntil!\nWHERE id = :packageId!\n  AND branch_id = :branchId!\nRETURNING *"};

/**
 * Query generated from SQL:
 * ```
 * UPDATE user_class_packages
 * SET
 *   status = 'frozen',
 *   frozen_until = :frozenUntil!
 * WHERE id = :packageId!
 *   AND branch_id = :branchId!
 * RETURNING *
 * ```
 */
export const freezePackage = new PreparedQuery<FreezePackageParams,FreezePackageResult>(freezePackageIR);


/** 'UnfreezePackage' parameters type */
export interface UnfreezePackageParams {
  branchId: string;
  packageId: string;
}

/** 'UnfreezePackage' return type */
export interface UnfreezePackageResult {
  activated_at: Date | null;
  branch_id: string;
  classes_remaining: number;
  created_at: Date | null;
  expires_at: Date | null;
  frozen_until: Date | null;
  gift_from_user_id: string | null;
  gift_message: string | null;
  gift_redeemed_at: Date | null;
  id: string;
  is_gift: boolean | null;
  is_shareable: boolean | null;
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
}

/** 'UnfreezePackage' query type */
export interface UnfreezePackageQuery {
  params: UnfreezePackageParams;
  result: UnfreezePackageResult;
}

const unfreezePackageIR: any = {"usedParamSet":{"packageId":true,"branchId":true},"params":[{"name":"packageId","required":true,"transform":{"type":"scalar"},"locs":[{"a":85,"b":95}]},{"name":"branchId","required":true,"transform":{"type":"scalar"},"locs":[{"a":115,"b":124}]}],"statement":"UPDATE user_class_packages\nSET\n  status = 'active',\n  frozen_until = NULL\nWHERE id = :packageId!\n  AND branch_id = :branchId!\nRETURNING *"};

/**
 * Query generated from SQL:
 * ```
 * UPDATE user_class_packages
 * SET
 *   status = 'active',
 *   frozen_until = NULL
 * WHERE id = :packageId!
 *   AND branch_id = :branchId!
 * RETURNING *
 * ```
 */
export const unfreezePackage = new PreparedQuery<UnfreezePackageParams,UnfreezePackageResult>(unfreezePackageIR);


/** 'RefundPackage' parameters type */
export interface RefundPackageParams {
  branchId: string;
  packageId: string;
  refundAmount: NumberOrString;
  refundReason?: string | null | void;
}

/** 'RefundPackage' return type */
export interface RefundPackageResult {
  activated_at: Date | null;
  branch_id: string;
  classes_remaining: number;
  created_at: Date | null;
  expires_at: Date | null;
  frozen_until: Date | null;
  gift_from_user_id: string | null;
  gift_message: string | null;
  gift_redeemed_at: Date | null;
  id: string;
  is_gift: boolean | null;
  is_shareable: boolean | null;
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
}

/** 'RefundPackage' query type */
export interface RefundPackageQuery {
  params: RefundPackageParams;
  result: RefundPackageResult;
}

const refundPackageIR: any = {"usedParamSet":{"refundAmount":true,"refundReason":true,"packageId":true,"branchId":true},"params":[{"name":"refundAmount","required":true,"transform":{"type":"scalar"},"locs":[{"a":72,"b":85}]},{"name":"refundReason","required":false,"transform":{"type":"scalar"},"locs":[{"a":141,"b":153}]},{"name":"packageId","required":true,"transform":{"type":"scalar"},"locs":[{"a":166,"b":176}]},{"name":"branchId","required":true,"transform":{"type":"scalar"},"locs":[{"a":196,"b":205}]}],"statement":"UPDATE user_class_packages\nSET\n  status = 'refunded',\n  refund_amount = :refundAmount!,\n  refunded_at = CURRENT_TIMESTAMP,\n  refund_reason = :refundReason\nWHERE id = :packageId!\n  AND branch_id = :branchId!\nRETURNING *"};

/**
 * Query generated from SQL:
 * ```
 * UPDATE user_class_packages
 * SET
 *   status = 'refunded',
 *   refund_amount = :refundAmount!,
 *   refunded_at = CURRENT_TIMESTAMP,
 *   refund_reason = :refundReason
 * WHERE id = :packageId!
 *   AND branch_id = :branchId!
 * RETURNING *
 * ```
 */
export const refundPackage = new PreparedQuery<RefundPackageParams,RefundPackageResult>(refundPackageIR);


/** 'SharePackage' parameters type */
export interface SharePackageParams {
  branchId: string;
  packageId: string;
  sharedWithUserIds: stringArray;
}

/** 'SharePackage' return type */
export interface SharePackageResult {
  activated_at: Date | null;
  branch_id: string;
  classes_remaining: number;
  created_at: Date | null;
  expires_at: Date | null;
  frozen_until: Date | null;
  gift_from_user_id: string | null;
  gift_message: string | null;
  gift_redeemed_at: Date | null;
  id: string;
  is_gift: boolean | null;
  is_shareable: boolean | null;
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
}

/** 'SharePackage' query type */
export interface SharePackageQuery {
  params: SharePackageParams;
  result: SharePackageResult;
}

const sharePackageIR: any = {"usedParamSet":{"sharedWithUserIds":true,"packageId":true,"branchId":true},"params":[{"name":"sharedWithUserIds","required":true,"transform":{"type":"scalar"},"locs":[{"a":54,"b":72}]},{"name":"packageId","required":true,"transform":{"type":"scalar"},"locs":[{"a":85,"b":95}]},{"name":"branchId","required":true,"transform":{"type":"scalar"},"locs":[{"a":115,"b":124}]}],"statement":"UPDATE user_class_packages\nSET shared_with_user_ids = :sharedWithUserIds!\nWHERE id = :packageId!\n  AND branch_id = :branchId!\n  AND is_shareable = true\nRETURNING *"};

/**
 * Query generated from SQL:
 * ```
 * UPDATE user_class_packages
 * SET shared_with_user_ids = :sharedWithUserIds!
 * WHERE id = :packageId!
 *   AND branch_id = :branchId!
 *   AND is_shareable = true
 * RETURNING *
 * ```
 */
export const sharePackage = new PreparedQuery<SharePackageParams,SharePackageResult>(sharePackageIR);


/** 'CreateGiftCode' parameters type */
export interface CreateGiftCodeParams {
  branchId: string;
  expiresAt?: DateOrString | null | void;
  giftMessage?: string | null | void;
  packageTemplateId: string;
  paymentId?: string | null | void;
  purchasedBy: string;
  purchasePrice: NumberOrString;
  recipientEmail?: string | null | void;
  recipientName?: string | null | void;
}

/** 'CreateGiftCode' return type */
export interface CreateGiftCodeResult {
  branch_id: string;
  code: string;
  created_at: Date | null;
  expires_at: Date | null;
  gift_message: string | null;
  id: string;
  package_template_id: string;
  payment_id: string | null;
  purchase_price: string;
  purchased_at: Date | null;
  purchased_by: string | null;
  recipient_email: string | null;
  recipient_name: string | null;
  redeemed: boolean | null;
  redeemed_at: Date | null;
  redeemed_by: string | null;
  user_package_id: string | null;
}

/** 'CreateGiftCode' query type */
export interface CreateGiftCodeQuery {
  params: CreateGiftCodeParams;
  result: CreateGiftCodeResult;
}

const createGiftCodeIR: any = {"usedParamSet":{"packageTemplateId":true,"branchId":true,"purchasedBy":true,"purchasePrice":true,"paymentId":true,"recipientEmail":true,"recipientName":true,"giftMessage":true,"expiresAt":true},"params":[{"name":"packageTemplateId","required":true,"transform":{"type":"scalar"},"locs":[{"a":228,"b":246}]},{"name":"branchId","required":true,"transform":{"type":"scalar"},"locs":[{"a":251,"b":260}]},{"name":"purchasedBy","required":true,"transform":{"type":"scalar"},"locs":[{"a":265,"b":277}]},{"name":"purchasePrice","required":true,"transform":{"type":"scalar"},"locs":[{"a":282,"b":296}]},{"name":"paymentId","required":false,"transform":{"type":"scalar"},"locs":[{"a":301,"b":310}]},{"name":"recipientEmail","required":false,"transform":{"type":"scalar"},"locs":[{"a":315,"b":329}]},{"name":"recipientName","required":false,"transform":{"type":"scalar"},"locs":[{"a":334,"b":347}]},{"name":"giftMessage","required":false,"transform":{"type":"scalar"},"locs":[{"a":352,"b":363}]},{"name":"expiresAt","required":false,"transform":{"type":"scalar"},"locs":[{"a":368,"b":377}]}],"statement":"INSERT INTO gift_package_codes (\n  code,\n  package_template_id,\n  branch_id,\n  purchased_by,\n  purchase_price,\n  payment_id,\n  recipient_email,\n  recipient_name,\n  gift_message,\n  expires_at\n) VALUES (\n  generate_gift_code(),\n  :packageTemplateId!,\n  :branchId!,\n  :purchasedBy!,\n  :purchasePrice!,\n  :paymentId,\n  :recipientEmail,\n  :recipientName,\n  :giftMessage,\n  :expiresAt\n)\nRETURNING *"};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO gift_package_codes (
 *   code,
 *   package_template_id,
 *   branch_id,
 *   purchased_by,
 *   purchase_price,
 *   payment_id,
 *   recipient_email,
 *   recipient_name,
 *   gift_message,
 *   expires_at
 * ) VALUES (
 *   generate_gift_code(),
 *   :packageTemplateId!,
 *   :branchId!,
 *   :purchasedBy!,
 *   :purchasePrice!,
 *   :paymentId,
 *   :recipientEmail,
 *   :recipientName,
 *   :giftMessage,
 *   :expiresAt
 * )
 * RETURNING *
 * ```
 */
export const createGiftCode = new PreparedQuery<CreateGiftCodeParams,CreateGiftCodeResult>(createGiftCodeIR);


/** 'GetGiftCodeByCode' parameters type */
export interface GetGiftCodeByCodeParams {
  code: string;
}

/** 'GetGiftCodeByCode' return type */
export interface GetGiftCodeByCodeResult {
  branch_id: string;
  class_count: number;
  code: string;
  created_at: Date | null;
  expires_at: Date | null;
  gift_message: string | null;
  id: string;
  package_description: string | null;
  package_name: string;
  package_template_id: string;
  payment_id: string | null;
  purchase_price: string;
  purchased_at: Date | null;
  purchased_by: string | null;
  recipient_email: string | null;
  recipient_name: string | null;
  redeemed: boolean | null;
  redeemed_at: Date | null;
  redeemed_by: string | null;
  user_package_id: string | null;
  validity_period: number | null;
  validity_type: string;
}

/** 'GetGiftCodeByCode' query type */
export interface GetGiftCodeByCodeQuery {
  params: GetGiftCodeByCodeParams;
  result: GetGiftCodeByCodeResult;
}

const getGiftCodeByCodeIR: any = {"usedParamSet":{"code":true},"params":[{"name":"code","required":true,"transform":{"type":"scalar"},"locs":[{"a":262,"b":267}]}],"statement":"SELECT\n  gpc.*,\n  cpt.name as package_name,\n  cpt.description as package_description,\n  cpt.class_count,\n  cpt.validity_type,\n  cpt.validity_period\nFROM gift_package_codes gpc\nJOIN class_package_templates cpt ON gpc.package_template_id = cpt.id\nWHERE gpc.code = :code!"};

/**
 * Query generated from SQL:
 * ```
 * SELECT
 *   gpc.*,
 *   cpt.name as package_name,
 *   cpt.description as package_description,
 *   cpt.class_count,
 *   cpt.validity_type,
 *   cpt.validity_period
 * FROM gift_package_codes gpc
 * JOIN class_package_templates cpt ON gpc.package_template_id = cpt.id
 * WHERE gpc.code = :code!
 * ```
 */
export const getGiftCodeByCode = new PreparedQuery<GetGiftCodeByCodeParams,GetGiftCodeByCodeResult>(getGiftCodeByCodeIR);


/** 'RedeemGiftCode' parameters type */
export interface RedeemGiftCodeParams {
  code: string;
  redeemedBy: string;
  userPackageId: string;
}

/** 'RedeemGiftCode' return type */
export interface RedeemGiftCodeResult {
  branch_id: string;
  code: string;
  created_at: Date | null;
  expires_at: Date | null;
  gift_message: string | null;
  id: string;
  package_template_id: string;
  payment_id: string | null;
  purchase_price: string;
  purchased_at: Date | null;
  purchased_by: string | null;
  recipient_email: string | null;
  recipient_name: string | null;
  redeemed: boolean | null;
  redeemed_at: Date | null;
  redeemed_by: string | null;
  user_package_id: string | null;
}

/** 'RedeemGiftCode' query type */
export interface RedeemGiftCodeQuery {
  params: RedeemGiftCodeParams;
  result: RedeemGiftCodeResult;
}

const redeemGiftCodeIR: any = {"usedParamSet":{"redeemedBy":true,"userPackageId":true,"code":true},"params":[{"name":"redeemedBy","required":true,"transform":{"type":"scalar"},"locs":[{"a":65,"b":76}]},{"name":"userPackageId","required":true,"transform":{"type":"scalar"},"locs":[{"a":134,"b":148}]},{"name":"code","required":true,"transform":{"type":"scalar"},"locs":[{"a":163,"b":168}]}],"statement":"UPDATE gift_package_codes\nSET\n  redeemed = true,\n  redeemed_by = :redeemedBy!,\n  redeemed_at = CURRENT_TIMESTAMP,\n  user_package_id = :userPackageId!\nWHERE code = :code!\n  AND redeemed = false\n  AND (expires_at IS NULL OR expires_at > CURRENT_TIMESTAMP)\nRETURNING *"};

/**
 * Query generated from SQL:
 * ```
 * UPDATE gift_package_codes
 * SET
 *   redeemed = true,
 *   redeemed_by = :redeemedBy!,
 *   redeemed_at = CURRENT_TIMESTAMP,
 *   user_package_id = :userPackageId!
 * WHERE code = :code!
 *   AND redeemed = false
 *   AND (expires_at IS NULL OR expires_at > CURRENT_TIMESTAMP)
 * RETURNING *
 * ```
 */
export const redeemGiftCode = new PreparedQuery<RedeemGiftCodeParams,RedeemGiftCodeResult>(redeemGiftCodeIR);


/** 'GetUserGiftCodes' parameters type */
export interface GetUserGiftCodesParams {
  branchId: string;
  userId: string;
}

/** 'GetUserGiftCodes' return type */
export interface GetUserGiftCodesResult {
  branch_id: string;
  class_count: number;
  code: string;
  created_at: Date | null;
  expires_at: Date | null;
  gift_message: string | null;
  id: string;
  package_name: string;
  package_template_id: string;
  payment_id: string | null;
  purchase_price: string;
  purchased_at: Date | null;
  purchased_by: string | null;
  recipient_email: string | null;
  recipient_name: string | null;
  redeemed: boolean | null;
  redeemed_at: Date | null;
  redeemed_by: string | null;
  user_package_id: string | null;
}

/** 'GetUserGiftCodes' query type */
export interface GetUserGiftCodesQuery {
  params: GetUserGiftCodesParams;
  result: GetUserGiftCodesResult;
}

const getUserGiftCodesIR: any = {"usedParamSet":{"userId":true,"branchId":true},"params":[{"name":"userId","required":true,"transform":{"type":"scalar"},"locs":[{"a":184,"b":191}]},{"name":"branchId","required":true,"transform":{"type":"scalar"},"locs":[{"a":215,"b":224}]}],"statement":"SELECT\n  gpc.*,\n  cpt.name as package_name,\n  cpt.class_count\nFROM gift_package_codes gpc\nJOIN class_package_templates cpt ON gpc.package_template_id = cpt.id\nWHERE gpc.purchased_by = :userId!\n  AND gpc.branch_id = :branchId!\nORDER BY gpc.purchased_at DESC"};

/**
 * Query generated from SQL:
 * ```
 * SELECT
 *   gpc.*,
 *   cpt.name as package_name,
 *   cpt.class_count
 * FROM gift_package_codes gpc
 * JOIN class_package_templates cpt ON gpc.package_template_id = cpt.id
 * WHERE gpc.purchased_by = :userId!
 *   AND gpc.branch_id = :branchId!
 * ORDER BY gpc.purchased_at DESC
 * ```
 */
export const getUserGiftCodes = new PreparedQuery<GetUserGiftCodesParams,GetUserGiftCodesResult>(getUserGiftCodesIR);


/** 'GetPackageSalesReport' parameters type */
export interface GetPackageSalesReportParams {
  branchId: string;
  endDate: DateOrString;
  startDate: DateOrString;
}

/** 'GetPackageSalesReport' return type */
export interface GetPackageSalesReportResult {
  avg_classes_used_per_package: string | null;
  class_count: number;
  classes_used: string | null;
  package_name: string;
  packages_sold: string | null;
  price: string;
  template_id: string;
  total_classes_sold: string | null;
  total_revenue: string | null;
}

/** 'GetPackageSalesReport' query type */
export interface GetPackageSalesReportQuery {
  params: GetPackageSalesReportParams;
  result: GetPackageSalesReportResult;
}

const getPackageSalesReportIR: any = {"usedParamSet":{"startDate":true,"endDate":true,"branchId":true},"params":[{"name":"startDate","required":true,"transform":{"type":"scalar"},"locs":[{"a":494,"b":504}]},{"name":"endDate","required":true,"transform":{"type":"scalar"},"locs":[{"a":532,"b":540}]},{"name":"branchId","required":true,"transform":{"type":"scalar"},"locs":[{"a":564,"b":573}]}],"statement":"SELECT\n  cpt.id as template_id,\n  cpt.name as package_name,\n  cpt.class_count,\n  cpt.price,\n  COUNT(ucp.id) as packages_sold,\n  SUM(ucp.total_classes) as total_classes_sold,\n  SUM(ucp.total_classes - ucp.classes_remaining) as classes_used,\n  SUM(ucp.purchase_price) as total_revenue,\n  AVG(ucp.total_classes - ucp.classes_remaining) as avg_classes_used_per_package\nFROM class_package_templates cpt\nLEFT JOIN user_class_packages ucp ON cpt.id = ucp.package_template_id\n  AND ucp.purchased_at >= :startDate!\n  AND ucp.purchased_at <= :endDate!\nWHERE cpt.branch_id = :branchId!\n  AND cpt.is_active = true\nGROUP BY cpt.id, cpt.name, cpt.class_count, cpt.price\nORDER BY total_revenue DESC NULLS LAST"};

/**
 * Query generated from SQL:
 * ```
 * SELECT
 *   cpt.id as template_id,
 *   cpt.name as package_name,
 *   cpt.class_count,
 *   cpt.price,
 *   COUNT(ucp.id) as packages_sold,
 *   SUM(ucp.total_classes) as total_classes_sold,
 *   SUM(ucp.total_classes - ucp.classes_remaining) as classes_used,
 *   SUM(ucp.purchase_price) as total_revenue,
 *   AVG(ucp.total_classes - ucp.classes_remaining) as avg_classes_used_per_package
 * FROM class_package_templates cpt
 * LEFT JOIN user_class_packages ucp ON cpt.id = ucp.package_template_id
 *   AND ucp.purchased_at >= :startDate!
 *   AND ucp.purchased_at <= :endDate!
 * WHERE cpt.branch_id = :branchId!
 *   AND cpt.is_active = true
 * GROUP BY cpt.id, cpt.name, cpt.class_count, cpt.price
 * ORDER BY total_revenue DESC NULLS LAST
 * ```
 */
export const getPackageSalesReport = new PreparedQuery<GetPackageSalesReportParams,GetPackageSalesReportResult>(getPackageSalesReportIR);


/** 'GetExpiringPackages' parameters type */
export interface GetExpiringPackagesParams {
  branchId: string;
  daysAhead: number;
}

/** 'GetExpiringPackages' return type */
export interface GetExpiringPackagesResult {
  activated_at: Date | null;
  branch_id: string;
  classes_remaining: number;
  created_at: Date | null;
  email: string;
  expires_at: Date | null;
  first_name: string | null;
  frozen_until: Date | null;
  gift_from_user_id: string | null;
  gift_message: string | null;
  gift_redeemed_at: Date | null;
  id: string;
  is_gift: boolean | null;
  is_shareable: boolean | null;
  last_name: string | null;
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
}

/** 'GetExpiringPackages' query type */
export interface GetExpiringPackagesQuery {
  params: GetExpiringPackagesParams;
  result: GetExpiringPackagesResult;
}

const getExpiringPackagesIR: any = {"usedParamSet":{"branchId":true,"daysAhead":true},"params":[{"name":"branchId","required":true,"transform":{"type":"scalar"},"locs":[{"a":241,"b":250}]},{"name":"daysAhead","required":true,"transform":{"type":"scalar"},"locs":[{"a":384,"b":394}]}],"statement":"SELECT\n  ucp.*,\n  u.first_name,\n  u.last_name,\n  u.email,\n  cpt.name as package_name\nFROM user_class_packages ucp\nJOIN \"user\" u ON ucp.user_id = u.id\nJOIN class_package_templates cpt ON ucp.package_template_id = cpt.id\nWHERE ucp.branch_id = :branchId!\n  AND ucp.status = 'active'\n  AND ucp.expires_at IS NOT NULL\n  AND ucp.expires_at BETWEEN CURRENT_TIMESTAMP AND CURRENT_TIMESTAMP + :daysAhead! * INTERVAL '1 day'\n  AND ucp.classes_remaining > 0\nORDER BY ucp.expires_at"};

/**
 * Query generated from SQL:
 * ```
 * SELECT
 *   ucp.*,
 *   u.first_name,
 *   u.last_name,
 *   u.email,
 *   cpt.name as package_name
 * FROM user_class_packages ucp
 * JOIN "user" u ON ucp.user_id = u.id
 * JOIN class_package_templates cpt ON ucp.package_template_id = cpt.id
 * WHERE ucp.branch_id = :branchId!
 *   AND ucp.status = 'active'
 *   AND ucp.expires_at IS NOT NULL
 *   AND ucp.expires_at BETWEEN CURRENT_TIMESTAMP AND CURRENT_TIMESTAMP + :daysAhead! * INTERVAL '1 day'
 *   AND ucp.classes_remaining > 0
 * ORDER BY ucp.expires_at
 * ```
 */
export const getExpiringPackages = new PreparedQuery<GetExpiringPackagesParams,GetExpiringPackagesResult>(getExpiringPackagesIR);


/** 'ExpireOldPackages' parameters type */
export interface ExpireOldPackagesParams {
  branchId: string;
}

/** 'ExpireOldPackages' return type */
export interface ExpireOldPackagesResult {
  activated_at: Date | null;
  branch_id: string;
  classes_remaining: number;
  created_at: Date | null;
  expires_at: Date | null;
  frozen_until: Date | null;
  gift_from_user_id: string | null;
  gift_message: string | null;
  gift_redeemed_at: Date | null;
  id: string;
  is_gift: boolean | null;
  is_shareable: boolean | null;
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
}

/** 'ExpireOldPackages' query type */
export interface ExpireOldPackagesQuery {
  params: ExpireOldPackagesParams;
  result: ExpireOldPackagesResult;
}

const expireOldPackagesIR: any = {"usedParamSet":{"branchId":true},"params":[{"name":"branchId","required":true,"transform":{"type":"scalar"},"locs":[{"a":68,"b":77}]}],"statement":"UPDATE user_class_packages\nSET status = 'expired'\nWHERE branch_id = :branchId!\n  AND status = 'active'\n  AND expires_at < CURRENT_TIMESTAMP\nRETURNING *"};

/**
 * Query generated from SQL:
 * ```
 * UPDATE user_class_packages
 * SET status = 'expired'
 * WHERE branch_id = :branchId!
 *   AND status = 'active'
 *   AND expires_at < CURRENT_TIMESTAMP
 * RETURNING *
 * ```
 */
export const expireOldPackages = new PreparedQuery<ExpireOldPackagesParams,ExpireOldPackagesResult>(expireOldPackagesIR);


/** 'GetPackageStats' parameters type */
export interface GetPackageStatsParams {
  branchId: string;
  userId: string;
}

/** 'GetPackageStats' return type */
export interface GetPackageStatsResult {
  active_count: string | null;
  avg_credits_used_per_package: string | null;
  exhausted_count: string | null;
  expired_count: string | null;
  total_credits_available: string | null;
  total_credits_used: string | null;
}

/** 'GetPackageStats' query type */
export interface GetPackageStatsQuery {
  params: GetPackageStatsParams;
  result: GetPackageStatsResult;
}

const getPackageStatsIR: any = {"usedParamSet":{"branchId":true,"userId":true},"params":[{"name":"branchId","required":true,"transform":{"type":"scalar"},"locs":[{"a":474,"b":483}]},{"name":"userId","required":true,"transform":{"type":"scalar"},"locs":[{"a":501,"b":508}]}],"statement":"SELECT\n  COUNT(*) FILTER (WHERE status = 'active') as active_count,\n  COUNT(*) FILTER (WHERE status = 'expired') as expired_count,\n  COUNT(*) FILTER (WHERE status = 'exhausted') as exhausted_count,\n  SUM(classes_remaining) FILTER (WHERE status = 'active') as total_credits_available,\n  SUM(total_classes - classes_remaining) as total_credits_used,\n  ROUND(AVG(total_classes - classes_remaining), 2) as avg_credits_used_per_package\nFROM user_class_packages\nWHERE branch_id = :branchId!\n  AND user_id = :userId!"};

/**
 * Query generated from SQL:
 * ```
 * SELECT
 *   COUNT(*) FILTER (WHERE status = 'active') as active_count,
 *   COUNT(*) FILTER (WHERE status = 'expired') as expired_count,
 *   COUNT(*) FILTER (WHERE status = 'exhausted') as exhausted_count,
 *   SUM(classes_remaining) FILTER (WHERE status = 'active') as total_credits_available,
 *   SUM(total_classes - classes_remaining) as total_credits_used,
 *   ROUND(AVG(total_classes - classes_remaining), 2) as avg_credits_used_per_package
 * FROM user_class_packages
 * WHERE branch_id = :branchId!
 *   AND user_id = :userId!
 * ```
 */
export const getPackageStats = new PreparedQuery<GetPackageStatsParams,GetPackageStatsResult>(getPackageStatsIR);


