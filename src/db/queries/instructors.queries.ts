/** Types generated for queries found in "src/db/queries/instructors.sql" */
import { PreparedQuery } from '@pgtyped/runtime';

export type DateOrString = Date | string;

export type Json = null | boolean | number | string | Json[] | { [key: string]: Json };

export type NumberOrString = number | string;

export type stringArray = (string)[];

/** 'CreateInstructorProfile' parameters type */
export interface CreateInstructorProfileParams {
  bio?: string | null | void;
  branchId: string;
  certifications?: Json | null | void;
  hireDate?: DateOrString | null | void;
  hourlyRate?: NumberOrString | null | void;
  isActive: boolean;
  profileImageUrl?: string | null | void;
  specializations?: stringArray | null | void;
  userId: string;
}

/** 'CreateInstructorProfile' return type */
export interface CreateInstructorProfileResult {
  bio: string | null;
  branch_id: string;
  certifications: Json | null;
  created_at: Date | null;
  hire_date: Date | null;
  hourly_rate: string | null;
  id: string;
  is_active: boolean | null;
  profile_image_url: string | null;
  specializations: stringArray | null;
  updated_at: Date | null;
  user_id: string;
}

/** 'CreateInstructorProfile' query type */
export interface CreateInstructorProfileQuery {
  params: CreateInstructorProfileParams;
  result: CreateInstructorProfileResult;
}

const createInstructorProfileIR: any = {"usedParamSet":{"userId":true,"branchId":true,"bio":true,"specializations":true,"certifications":true,"hireDate":true,"hourlyRate":true,"isActive":true,"profileImageUrl":true},"params":[{"name":"userId","required":true,"transform":{"type":"scalar"},"locs":[{"a":176,"b":183}]},{"name":"branchId","required":true,"transform":{"type":"scalar"},"locs":[{"a":188,"b":197}]},{"name":"bio","required":false,"transform":{"type":"scalar"},"locs":[{"a":202,"b":205}]},{"name":"specializations","required":false,"transform":{"type":"scalar"},"locs":[{"a":210,"b":225}]},{"name":"certifications","required":false,"transform":{"type":"scalar"},"locs":[{"a":230,"b":244}]},{"name":"hireDate","required":false,"transform":{"type":"scalar"},"locs":[{"a":249,"b":257}]},{"name":"hourlyRate","required":false,"transform":{"type":"scalar"},"locs":[{"a":262,"b":272}]},{"name":"isActive","required":true,"transform":{"type":"scalar"},"locs":[{"a":277,"b":286}]},{"name":"profileImageUrl","required":false,"transform":{"type":"scalar"},"locs":[{"a":291,"b":306}]}],"statement":"INSERT INTO instructor_profiles (\n  user_id,\n  branch_id,\n  bio,\n  specializations,\n  certifications,\n  hire_date,\n  hourly_rate,\n  is_active,\n  profile_image_url\n) VALUES (\n  :userId!,\n  :branchId!,\n  :bio,\n  :specializations,\n  :certifications,\n  :hireDate,\n  :hourlyRate,\n  :isActive!,\n  :profileImageUrl\n)\nRETURNING *"};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO instructor_profiles (
 *   user_id,
 *   branch_id,
 *   bio,
 *   specializations,
 *   certifications,
 *   hire_date,
 *   hourly_rate,
 *   is_active,
 *   profile_image_url
 * ) VALUES (
 *   :userId!,
 *   :branchId!,
 *   :bio,
 *   :specializations,
 *   :certifications,
 *   :hireDate,
 *   :hourlyRate,
 *   :isActive!,
 *   :profileImageUrl
 * )
 * RETURNING *
 * ```
 */
export const createInstructorProfile = new PreparedQuery<CreateInstructorProfileParams,CreateInstructorProfileResult>(createInstructorProfileIR);


/** 'GetInstructorProfile' parameters type */
export interface GetInstructorProfileParams {
  branchId: string;
  instructorId: string;
}

/** 'GetInstructorProfile' return type */
export interface GetInstructorProfileResult {
  bio: string | null;
  branch_id: string;
  certifications: Json | null;
  created_at: Date | null;
  email: string;
  first_name: string | null;
  hire_date: Date | null;
  hourly_rate: string | null;
  id: string;
  is_active: boolean | null;
  last_name: string | null;
  phone: string | null;
  profile_image_url: string | null;
  specializations: stringArray | null;
  updated_at: Date | null;
  user_id: string;
}

/** 'GetInstructorProfile' query type */
export interface GetInstructorProfileQuery {
  params: GetInstructorProfileParams;
  result: GetInstructorProfileResult;
}

const getInstructorProfileIR: any = {"usedParamSet":{"instructorId":true,"branchId":true},"params":[{"name":"instructorId","required":true,"transform":{"type":"scalar"},"locs":[{"a":144,"b":157}]},{"name":"branchId","required":true,"transform":{"type":"scalar"},"locs":[{"a":180,"b":189}]}],"statement":"SELECT\n  ip.*,\n  u.first_name,\n  u.last_name,\n  u.email,\n  u.phone\nFROM instructor_profiles ip\nJOIN \"user\" u ON ip.user_id = u.id\nWHERE ip.id = :instructorId!\n  AND ip.branch_id = :branchId!"};

/**
 * Query generated from SQL:
 * ```
 * SELECT
 *   ip.*,
 *   u.first_name,
 *   u.last_name,
 *   u.email,
 *   u.phone
 * FROM instructor_profiles ip
 * JOIN "user" u ON ip.user_id = u.id
 * WHERE ip.id = :instructorId!
 *   AND ip.branch_id = :branchId!
 * ```
 */
export const getInstructorProfile = new PreparedQuery<GetInstructorProfileParams,GetInstructorProfileResult>(getInstructorProfileIR);


/** 'GetInstructorProfileByUserId' parameters type */
export interface GetInstructorProfileByUserIdParams {
  branchId: string;
  userId: string;
}

/** 'GetInstructorProfileByUserId' return type */
export interface GetInstructorProfileByUserIdResult {
  bio: string | null;
  branch_id: string;
  certifications: Json | null;
  created_at: Date | null;
  hire_date: Date | null;
  hourly_rate: string | null;
  id: string;
  is_active: boolean | null;
  profile_image_url: string | null;
  specializations: stringArray | null;
  updated_at: Date | null;
  user_id: string;
}

/** 'GetInstructorProfileByUserId' query type */
export interface GetInstructorProfileByUserIdQuery {
  params: GetInstructorProfileByUserIdParams;
  result: GetInstructorProfileByUserIdResult;
}

const getInstructorProfileByUserIdIR: any = {"usedParamSet":{"userId":true,"branchId":true},"params":[{"name":"userId","required":true,"transform":{"type":"scalar"},"locs":[{"a":211,"b":218}]},{"name":"branchId","required":true,"transform":{"type":"scalar"},"locs":[{"a":238,"b":247}]}],"statement":"SELECT\n  id,\n  user_id,\n  branch_id,\n  bio,\n  specializations,\n  certifications,\n  hire_date,\n  hourly_rate,\n  is_active,\n  profile_image_url,\n  created_at,\n  updated_at\nFROM instructor_profiles\nWHERE user_id = :userId!\n  AND branch_id = :branchId!"};

/**
 * Query generated from SQL:
 * ```
 * SELECT
 *   id,
 *   user_id,
 *   branch_id,
 *   bio,
 *   specializations,
 *   certifications,
 *   hire_date,
 *   hourly_rate,
 *   is_active,
 *   profile_image_url,
 *   created_at,
 *   updated_at
 * FROM instructor_profiles
 * WHERE user_id = :userId!
 *   AND branch_id = :branchId!
 * ```
 */
export const getInstructorProfileByUserId = new PreparedQuery<GetInstructorProfileByUserIdParams,GetInstructorProfileByUserIdResult>(getInstructorProfileByUserIdIR);


/** 'GetAllInstructors' parameters type */
export interface GetAllInstructorsParams {
  branchId: string;
}

/** 'GetAllInstructors' return type */
export interface GetAllInstructorsResult {
  bio: string | null;
  branch_id: string;
  certifications: Json | null;
  created_at: Date | null;
  email: string;
  first_name: string | null;
  hire_date: Date | null;
  hourly_rate: string | null;
  id: string;
  is_active: boolean | null;
  last_name: string | null;
  phone: string | null;
  profile_image_url: string | null;
  specializations: stringArray | null;
  updated_at: Date | null;
  user_id: string;
}

/** 'GetAllInstructors' query type */
export interface GetAllInstructorsQuery {
  params: GetAllInstructorsParams;
  result: GetAllInstructorsResult;
}

const getAllInstructorsIR: any = {"usedParamSet":{"branchId":true},"params":[{"name":"branchId","required":true,"transform":{"type":"scalar"},"locs":[{"a":151,"b":160}]}],"statement":"SELECT\n  ip.*,\n  u.first_name,\n  u.last_name,\n  u.email,\n  u.phone\nFROM instructor_profiles ip\nJOIN \"user\" u ON ip.user_id = u.id\nWHERE ip.branch_id = :branchId!\n  AND ip.is_active = true\nORDER BY u.first_name, u.last_name"};

/**
 * Query generated from SQL:
 * ```
 * SELECT
 *   ip.*,
 *   u.first_name,
 *   u.last_name,
 *   u.email,
 *   u.phone
 * FROM instructor_profiles ip
 * JOIN "user" u ON ip.user_id = u.id
 * WHERE ip.branch_id = :branchId!
 *   AND ip.is_active = true
 * ORDER BY u.first_name, u.last_name
 * ```
 */
export const getAllInstructors = new PreparedQuery<GetAllInstructorsParams,GetAllInstructorsResult>(getAllInstructorsIR);


/** 'UpdateInstructorProfile' parameters type */
export interface UpdateInstructorProfileParams {
  bio?: string | null | void;
  branchId: string;
  certifications?: Json | null | void;
  hourlyRate?: NumberOrString | null | void;
  instructorId: string;
  isActive: boolean;
  profileImageUrl?: string | null | void;
  specializations?: stringArray | null | void;
}

/** 'UpdateInstructorProfile' return type */
export interface UpdateInstructorProfileResult {
  bio: string | null;
  branch_id: string;
  certifications: Json | null;
  created_at: Date | null;
  hire_date: Date | null;
  hourly_rate: string | null;
  id: string;
  is_active: boolean | null;
  profile_image_url: string | null;
  specializations: stringArray | null;
  updated_at: Date | null;
  user_id: string;
}

/** 'UpdateInstructorProfile' query type */
export interface UpdateInstructorProfileQuery {
  params: UpdateInstructorProfileParams;
  result: UpdateInstructorProfileResult;
}

const updateInstructorProfileIR: any = {"usedParamSet":{"bio":true,"specializations":true,"certifications":true,"hourlyRate":true,"isActive":true,"profileImageUrl":true,"instructorId":true,"branchId":true},"params":[{"name":"bio","required":false,"transform":{"type":"scalar"},"locs":[{"a":39,"b":42}]},{"name":"specializations","required":false,"transform":{"type":"scalar"},"locs":[{"a":65,"b":80}]},{"name":"certifications","required":false,"transform":{"type":"scalar"},"locs":[{"a":102,"b":116}]},{"name":"hourlyRate","required":false,"transform":{"type":"scalar"},"locs":[{"a":135,"b":145}]},{"name":"isActive","required":true,"transform":{"type":"scalar"},"locs":[{"a":162,"b":171}]},{"name":"profileImageUrl","required":false,"transform":{"type":"scalar"},"locs":[{"a":196,"b":211}]},{"name":"instructorId","required":true,"transform":{"type":"scalar"},"locs":[{"a":224,"b":237}]},{"name":"branchId","required":true,"transform":{"type":"scalar"},"locs":[{"a":257,"b":266}]}],"statement":"UPDATE instructor_profiles\nSET\n  bio = :bio,\n  specializations = :specializations,\n  certifications = :certifications,\n  hourly_rate = :hourlyRate,\n  is_active = :isActive!,\n  profile_image_url = :profileImageUrl\nWHERE id = :instructorId!\n  AND branch_id = :branchId!\nRETURNING *"};

/**
 * Query generated from SQL:
 * ```
 * UPDATE instructor_profiles
 * SET
 *   bio = :bio,
 *   specializations = :specializations,
 *   certifications = :certifications,
 *   hourly_rate = :hourlyRate,
 *   is_active = :isActive!,
 *   profile_image_url = :profileImageUrl
 * WHERE id = :instructorId!
 *   AND branch_id = :branchId!
 * RETURNING *
 * ```
 */
export const updateInstructorProfile = new PreparedQuery<UpdateInstructorProfileParams,UpdateInstructorProfileResult>(updateInstructorProfileIR);


/** 'DeactivateInstructor' parameters type */
export interface DeactivateInstructorParams {
  branchId: string;
  instructorId: string;
}

/** 'DeactivateInstructor' return type */
export interface DeactivateInstructorResult {
  bio: string | null;
  branch_id: string;
  certifications: Json | null;
  created_at: Date | null;
  hire_date: Date | null;
  hourly_rate: string | null;
  id: string;
  is_active: boolean | null;
  profile_image_url: string | null;
  specializations: stringArray | null;
  updated_at: Date | null;
  user_id: string;
}

/** 'DeactivateInstructor' query type */
export interface DeactivateInstructorQuery {
  params: DeactivateInstructorParams;
  result: DeactivateInstructorResult;
}

const deactivateInstructorIR: any = {"usedParamSet":{"instructorId":true,"branchId":true},"params":[{"name":"instructorId","required":true,"transform":{"type":"scalar"},"locs":[{"a":60,"b":73}]},{"name":"branchId","required":true,"transform":{"type":"scalar"},"locs":[{"a":93,"b":102}]}],"statement":"UPDATE instructor_profiles\nSET is_active = false\nWHERE id = :instructorId!\n  AND branch_id = :branchId!\nRETURNING *"};

/**
 * Query generated from SQL:
 * ```
 * UPDATE instructor_profiles
 * SET is_active = false
 * WHERE id = :instructorId!
 *   AND branch_id = :branchId!
 * RETURNING *
 * ```
 */
export const deactivateInstructor = new PreparedQuery<DeactivateInstructorParams,DeactivateInstructorResult>(deactivateInstructorIR);


/** 'CreateAvailability' parameters type */
export interface CreateAvailabilityParams {
  branchId: string;
  dayOfWeek: number;
  effectiveDate?: DateOrString | null | void;
  endTime: DateOrString;
  instructorId: string;
  isRecurring: boolean;
  notes?: string | null | void;
  startTime: DateOrString;
}

/** 'CreateAvailability' return type */
export interface CreateAvailabilityResult {
  branch_id: string;
  created_at: Date | null;
  day_of_week: number;
  effective_date: Date | null;
  end_time: Date;
  id: string;
  instructor_id: string;
  is_recurring: boolean | null;
  notes: string | null;
  start_time: Date;
  updated_at: Date | null;
}

/** 'CreateAvailability' query type */
export interface CreateAvailabilityQuery {
  params: CreateAvailabilityParams;
  result: CreateAvailabilityResult;
}

const createAvailabilityIR: any = {"usedParamSet":{"instructorId":true,"branchId":true,"dayOfWeek":true,"startTime":true,"endTime":true,"isRecurring":true,"effectiveDate":true,"notes":true},"params":[{"name":"instructorId","required":true,"transform":{"type":"scalar"},"locs":[{"a":164,"b":177}]},{"name":"branchId","required":true,"transform":{"type":"scalar"},"locs":[{"a":182,"b":191}]},{"name":"dayOfWeek","required":true,"transform":{"type":"scalar"},"locs":[{"a":196,"b":206}]},{"name":"startTime","required":true,"transform":{"type":"scalar"},"locs":[{"a":211,"b":221}]},{"name":"endTime","required":true,"transform":{"type":"scalar"},"locs":[{"a":226,"b":234}]},{"name":"isRecurring","required":true,"transform":{"type":"scalar"},"locs":[{"a":239,"b":251}]},{"name":"effectiveDate","required":false,"transform":{"type":"scalar"},"locs":[{"a":256,"b":269}]},{"name":"notes","required":false,"transform":{"type":"scalar"},"locs":[{"a":274,"b":279}]}],"statement":"INSERT INTO instructor_availability (\n  instructor_id,\n  branch_id,\n  day_of_week,\n  start_time,\n  end_time,\n  is_recurring,\n  effective_date,\n  notes\n) VALUES (\n  :instructorId!,\n  :branchId!,\n  :dayOfWeek!,\n  :startTime!,\n  :endTime!,\n  :isRecurring!,\n  :effectiveDate,\n  :notes\n)\nRETURNING *"};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO instructor_availability (
 *   instructor_id,
 *   branch_id,
 *   day_of_week,
 *   start_time,
 *   end_time,
 *   is_recurring,
 *   effective_date,
 *   notes
 * ) VALUES (
 *   :instructorId!,
 *   :branchId!,
 *   :dayOfWeek!,
 *   :startTime!,
 *   :endTime!,
 *   :isRecurring!,
 *   :effectiveDate,
 *   :notes
 * )
 * RETURNING *
 * ```
 */
export const createAvailability = new PreparedQuery<CreateAvailabilityParams,CreateAvailabilityResult>(createAvailabilityIR);


/** 'GetInstructorAvailability' parameters type */
export interface GetInstructorAvailabilityParams {
  branchId: string;
  instructorId: string;
}

/** 'GetInstructorAvailability' return type */
export interface GetInstructorAvailabilityResult {
  branch_id: string;
  created_at: Date | null;
  day_of_week: number;
  effective_date: Date | null;
  end_time: Date;
  id: string;
  instructor_id: string;
  is_recurring: boolean | null;
  notes: string | null;
  start_time: Date;
  updated_at: Date | null;
}

/** 'GetInstructorAvailability' query type */
export interface GetInstructorAvailabilityQuery {
  params: GetInstructorAvailabilityParams;
  result: GetInstructorAvailabilityResult;
}

const getInstructorAvailabilityIR: any = {"usedParamSet":{"instructorId":true,"branchId":true},"params":[{"name":"instructorId","required":true,"transform":{"type":"scalar"},"locs":[{"a":205,"b":218}]},{"name":"branchId","required":true,"transform":{"type":"scalar"},"locs":[{"a":238,"b":247}]}],"statement":"SELECT\n  id,\n  instructor_id,\n  branch_id,\n  day_of_week,\n  start_time,\n  end_time,\n  is_recurring,\n  effective_date,\n  notes,\n  created_at,\n  updated_at\nFROM instructor_availability\nWHERE instructor_id = :instructorId!\n  AND branch_id = :branchId!\nORDER BY day_of_week, start_time"};

/**
 * Query generated from SQL:
 * ```
 * SELECT
 *   id,
 *   instructor_id,
 *   branch_id,
 *   day_of_week,
 *   start_time,
 *   end_time,
 *   is_recurring,
 *   effective_date,
 *   notes,
 *   created_at,
 *   updated_at
 * FROM instructor_availability
 * WHERE instructor_id = :instructorId!
 *   AND branch_id = :branchId!
 * ORDER BY day_of_week, start_time
 * ```
 */
export const getInstructorAvailability = new PreparedQuery<GetInstructorAvailabilityParams,GetInstructorAvailabilityResult>(getInstructorAvailabilityIR);


/** 'UpdateAvailability' parameters type */
export interface UpdateAvailabilityParams {
  availabilityId: string;
  branchId: string;
  dayOfWeek: number;
  effectiveDate?: DateOrString | null | void;
  endTime: DateOrString;
  isRecurring: boolean;
  notes?: string | null | void;
  startTime: DateOrString;
}

/** 'UpdateAvailability' return type */
export interface UpdateAvailabilityResult {
  branch_id: string;
  created_at: Date | null;
  day_of_week: number;
  effective_date: Date | null;
  end_time: Date;
  id: string;
  instructor_id: string;
  is_recurring: boolean | null;
  notes: string | null;
  start_time: Date;
  updated_at: Date | null;
}

/** 'UpdateAvailability' query type */
export interface UpdateAvailabilityQuery {
  params: UpdateAvailabilityParams;
  result: UpdateAvailabilityResult;
}

const updateAvailabilityIR: any = {"usedParamSet":{"dayOfWeek":true,"startTime":true,"endTime":true,"isRecurring":true,"effectiveDate":true,"notes":true,"availabilityId":true,"branchId":true},"params":[{"name":"dayOfWeek","required":true,"transform":{"type":"scalar"},"locs":[{"a":51,"b":61}]},{"name":"startTime","required":true,"transform":{"type":"scalar"},"locs":[{"a":79,"b":89}]},{"name":"endTime","required":true,"transform":{"type":"scalar"},"locs":[{"a":105,"b":113}]},{"name":"isRecurring","required":true,"transform":{"type":"scalar"},"locs":[{"a":133,"b":145}]},{"name":"effectiveDate","required":false,"transform":{"type":"scalar"},"locs":[{"a":167,"b":180}]},{"name":"notes","required":false,"transform":{"type":"scalar"},"locs":[{"a":193,"b":198}]},{"name":"availabilityId","required":true,"transform":{"type":"scalar"},"locs":[{"a":211,"b":226}]},{"name":"branchId","required":true,"transform":{"type":"scalar"},"locs":[{"a":246,"b":255}]}],"statement":"UPDATE instructor_availability\nSET\n  day_of_week = :dayOfWeek!,\n  start_time = :startTime!,\n  end_time = :endTime!,\n  is_recurring = :isRecurring!,\n  effective_date = :effectiveDate,\n  notes = :notes\nWHERE id = :availabilityId!\n  AND branch_id = :branchId!\nRETURNING *"};

/**
 * Query generated from SQL:
 * ```
 * UPDATE instructor_availability
 * SET
 *   day_of_week = :dayOfWeek!,
 *   start_time = :startTime!,
 *   end_time = :endTime!,
 *   is_recurring = :isRecurring!,
 *   effective_date = :effectiveDate,
 *   notes = :notes
 * WHERE id = :availabilityId!
 *   AND branch_id = :branchId!
 * RETURNING *
 * ```
 */
export const updateAvailability = new PreparedQuery<UpdateAvailabilityParams,UpdateAvailabilityResult>(updateAvailabilityIR);


/** 'DeleteAvailability' parameters type */
export interface DeleteAvailabilityParams {
  availabilityId: string;
  branchId: string;
}

/** 'DeleteAvailability' return type */
export interface DeleteAvailabilityResult {
  branch_id: string;
  created_at: Date | null;
  day_of_week: number;
  effective_date: Date | null;
  end_time: Date;
  id: string;
  instructor_id: string;
  is_recurring: boolean | null;
  notes: string | null;
  start_time: Date;
  updated_at: Date | null;
}

/** 'DeleteAvailability' query type */
export interface DeleteAvailabilityQuery {
  params: DeleteAvailabilityParams;
  result: DeleteAvailabilityResult;
}

const deleteAvailabilityIR: any = {"usedParamSet":{"availabilityId":true,"branchId":true},"params":[{"name":"availabilityId","required":true,"transform":{"type":"scalar"},"locs":[{"a":47,"b":62}]},{"name":"branchId","required":true,"transform":{"type":"scalar"},"locs":[{"a":82,"b":91}]}],"statement":"DELETE FROM instructor_availability\nWHERE id = :availabilityId!\n  AND branch_id = :branchId!\nRETURNING *"};

/**
 * Query generated from SQL:
 * ```
 * DELETE FROM instructor_availability
 * WHERE id = :availabilityId!
 *   AND branch_id = :branchId!
 * RETURNING *
 * ```
 */
export const deleteAvailability = new PreparedQuery<DeleteAvailabilityParams,DeleteAvailabilityResult>(deleteAvailabilityIR);


/** 'CreateTimeOffRequest' parameters type */
export interface CreateTimeOffRequestParams {
  branchId: string;
  endDate: DateOrString;
  instructorId: string;
  notes?: string | null | void;
  reason?: string | null | void;
  startDate: DateOrString;
  status: string;
}

/** 'CreateTimeOffRequest' return type */
export interface CreateTimeOffRequestResult {
  approved_at: Date | null;
  approved_by: string | null;
  branch_id: string;
  created_at: Date | null;
  end_date: Date;
  id: string;
  instructor_id: string;
  notes: string | null;
  reason: string | null;
  requested_at: Date | null;
  start_date: Date;
  status: string | null;
}

/** 'CreateTimeOffRequest' query type */
export interface CreateTimeOffRequestQuery {
  params: CreateTimeOffRequestParams;
  result: CreateTimeOffRequestResult;
}

const createTimeOffRequestIR: any = {"usedParamSet":{"instructorId":true,"branchId":true,"startDate":true,"endDate":true,"reason":true,"status":true,"notes":true},"params":[{"name":"instructorId","required":true,"transform":{"type":"scalar"},"locs":[{"a":131,"b":144}]},{"name":"branchId","required":true,"transform":{"type":"scalar"},"locs":[{"a":149,"b":158}]},{"name":"startDate","required":true,"transform":{"type":"scalar"},"locs":[{"a":163,"b":173}]},{"name":"endDate","required":true,"transform":{"type":"scalar"},"locs":[{"a":178,"b":186}]},{"name":"reason","required":false,"transform":{"type":"scalar"},"locs":[{"a":191,"b":197}]},{"name":"status","required":true,"transform":{"type":"scalar"},"locs":[{"a":202,"b":209}]},{"name":"notes","required":false,"transform":{"type":"scalar"},"locs":[{"a":214,"b":219}]}],"statement":"INSERT INTO instructor_time_off (\n  instructor_id,\n  branch_id,\n  start_date,\n  end_date,\n  reason,\n  status,\n  notes\n) VALUES (\n  :instructorId!,\n  :branchId!,\n  :startDate!,\n  :endDate!,\n  :reason,\n  :status!,\n  :notes\n)\nRETURNING *"};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO instructor_time_off (
 *   instructor_id,
 *   branch_id,
 *   start_date,
 *   end_date,
 *   reason,
 *   status,
 *   notes
 * ) VALUES (
 *   :instructorId!,
 *   :branchId!,
 *   :startDate!,
 *   :endDate!,
 *   :reason,
 *   :status!,
 *   :notes
 * )
 * RETURNING *
 * ```
 */
export const createTimeOffRequest = new PreparedQuery<CreateTimeOffRequestParams,CreateTimeOffRequestResult>(createTimeOffRequestIR);


/** 'GetInstructorTimeOff' parameters type */
export interface GetInstructorTimeOffParams {
  branchId: string;
  instructorId: string;
  startDate: DateOrString;
}

/** 'GetInstructorTimeOff' return type */
export interface GetInstructorTimeOffResult {
  approved_at: Date | null;
  approved_by: string | null;
  branch_id: string;
  created_at: Date | null;
  end_date: Date;
  id: string;
  instructor_id: string;
  notes: string | null;
  reason: string | null;
  requested_at: Date | null;
  start_date: Date;
  status: string | null;
}

/** 'GetInstructorTimeOff' query type */
export interface GetInstructorTimeOffQuery {
  params: GetInstructorTimeOffParams;
  result: GetInstructorTimeOffResult;
}

const getInstructorTimeOffIR: any = {"usedParamSet":{"instructorId":true,"branchId":true,"startDate":true},"params":[{"name":"instructorId","required":true,"transform":{"type":"scalar"},"locs":[{"a":204,"b":217}]},{"name":"branchId","required":true,"transform":{"type":"scalar"},"locs":[{"a":237,"b":246}]},{"name":"startDate","required":true,"transform":{"type":"scalar"},"locs":[{"a":266,"b":276}]}],"statement":"SELECT\n  id,\n  instructor_id,\n  branch_id,\n  start_date,\n  end_date,\n  reason,\n  status,\n  notes,\n  requested_at,\n  approved_by,\n  approved_at,\n  created_at\nFROM instructor_time_off\nWHERE instructor_id = :instructorId!\n  AND branch_id = :branchId!\n  AND end_date >= :startDate!\nORDER BY start_date"};

/**
 * Query generated from SQL:
 * ```
 * SELECT
 *   id,
 *   instructor_id,
 *   branch_id,
 *   start_date,
 *   end_date,
 *   reason,
 *   status,
 *   notes,
 *   requested_at,
 *   approved_by,
 *   approved_at,
 *   created_at
 * FROM instructor_time_off
 * WHERE instructor_id = :instructorId!
 *   AND branch_id = :branchId!
 *   AND end_date >= :startDate!
 * ORDER BY start_date
 * ```
 */
export const getInstructorTimeOff = new PreparedQuery<GetInstructorTimeOffParams,GetInstructorTimeOffResult>(getInstructorTimeOffIR);


/** 'ApproveTimeOff' parameters type */
export interface ApproveTimeOffParams {
  approvedBy: string;
  branchId: string;
  timeOffId: string;
}

/** 'ApproveTimeOff' return type */
export interface ApproveTimeOffResult {
  approved_at: Date | null;
  approved_by: string | null;
  branch_id: string;
  created_at: Date | null;
  end_date: Date;
  id: string;
  instructor_id: string;
  notes: string | null;
  reason: string | null;
  requested_at: Date | null;
  start_date: Date;
  status: string | null;
}

/** 'ApproveTimeOff' query type */
export interface ApproveTimeOffQuery {
  params: ApproveTimeOffParams;
  result: ApproveTimeOffResult;
}

const approveTimeOffIR: any = {"usedParamSet":{"approvedBy":true,"timeOffId":true,"branchId":true},"params":[{"name":"approvedBy","required":true,"transform":{"type":"scalar"},"locs":[{"a":70,"b":81}]},{"name":"timeOffId","required":true,"transform":{"type":"scalar"},"locs":[{"a":129,"b":139}]},{"name":"branchId","required":true,"transform":{"type":"scalar"},"locs":[{"a":159,"b":168}]}],"statement":"UPDATE instructor_time_off\nSET\n  status = 'approved',\n  approved_by = :approvedBy!,\n  approved_at = CURRENT_TIMESTAMP\nWHERE id = :timeOffId!\n  AND branch_id = :branchId!\nRETURNING *"};

/**
 * Query generated from SQL:
 * ```
 * UPDATE instructor_time_off
 * SET
 *   status = 'approved',
 *   approved_by = :approvedBy!,
 *   approved_at = CURRENT_TIMESTAMP
 * WHERE id = :timeOffId!
 *   AND branch_id = :branchId!
 * RETURNING *
 * ```
 */
export const approveTimeOff = new PreparedQuery<ApproveTimeOffParams,ApproveTimeOffResult>(approveTimeOffIR);


/** 'DenyTimeOff' parameters type */
export interface DenyTimeOffParams {
  approvedBy: string;
  branchId: string;
  timeOffId: string;
}

/** 'DenyTimeOff' return type */
export interface DenyTimeOffResult {
  approved_at: Date | null;
  approved_by: string | null;
  branch_id: string;
  created_at: Date | null;
  end_date: Date;
  id: string;
  instructor_id: string;
  notes: string | null;
  reason: string | null;
  requested_at: Date | null;
  start_date: Date;
  status: string | null;
}

/** 'DenyTimeOff' query type */
export interface DenyTimeOffQuery {
  params: DenyTimeOffParams;
  result: DenyTimeOffResult;
}

const denyTimeOffIR: any = {"usedParamSet":{"approvedBy":true,"timeOffId":true,"branchId":true},"params":[{"name":"approvedBy","required":true,"transform":{"type":"scalar"},"locs":[{"a":68,"b":79}]},{"name":"timeOffId","required":true,"transform":{"type":"scalar"},"locs":[{"a":127,"b":137}]},{"name":"branchId","required":true,"transform":{"type":"scalar"},"locs":[{"a":157,"b":166}]}],"statement":"UPDATE instructor_time_off\nSET\n  status = 'denied',\n  approved_by = :approvedBy!,\n  approved_at = CURRENT_TIMESTAMP\nWHERE id = :timeOffId!\n  AND branch_id = :branchId!\nRETURNING *"};

/**
 * Query generated from SQL:
 * ```
 * UPDATE instructor_time_off
 * SET
 *   status = 'denied',
 *   approved_by = :approvedBy!,
 *   approved_at = CURRENT_TIMESTAMP
 * WHERE id = :timeOffId!
 *   AND branch_id = :branchId!
 * RETURNING *
 * ```
 */
export const denyTimeOff = new PreparedQuery<DenyTimeOffParams,DenyTimeOffResult>(denyTimeOffIR);


/** 'CreateClassAssignment' parameters type */
export interface CreateClassAssignmentParams {
  assignedBy: string;
  assignmentStatus: string;
  branchId: string;
  classId: string;
  instructorId: string;
  notes?: string | null | void;
  paymentAmount?: NumberOrString | null | void;
  paymentStatus: string;
}

/** 'CreateClassAssignment' return type */
export interface CreateClassAssignmentResult {
  assigned_at: Date | null;
  assigned_by: string | null;
  assignment_status: string | null;
  branch_id: string;
  class_id: string;
  created_at: Date | null;
  id: string;
  instructor_id: string;
  notes: string | null;
  payment_amount: string | null;
  payment_status: string | null;
}

/** 'CreateClassAssignment' query type */
export interface CreateClassAssignmentQuery {
  params: CreateClassAssignmentParams;
  result: CreateClassAssignmentResult;
}

const createClassAssignmentIR: any = {"usedParamSet":{"instructorId":true,"classId":true,"branchId":true,"assignmentStatus":true,"assignedBy":true,"notes":true,"paymentAmount":true,"paymentStatus":true},"params":[{"name":"instructorId","required":true,"transform":{"type":"scalar"},"locs":[{"a":178,"b":191}]},{"name":"classId","required":true,"transform":{"type":"scalar"},"locs":[{"a":196,"b":204}]},{"name":"branchId","required":true,"transform":{"type":"scalar"},"locs":[{"a":209,"b":218}]},{"name":"assignmentStatus","required":true,"transform":{"type":"scalar"},"locs":[{"a":223,"b":240}]},{"name":"assignedBy","required":true,"transform":{"type":"scalar"},"locs":[{"a":245,"b":256}]},{"name":"notes","required":false,"transform":{"type":"scalar"},"locs":[{"a":261,"b":266}]},{"name":"paymentAmount","required":false,"transform":{"type":"scalar"},"locs":[{"a":271,"b":284}]},{"name":"paymentStatus","required":true,"transform":{"type":"scalar"},"locs":[{"a":289,"b":303}]}],"statement":"INSERT INTO instructor_class_assignments (\n  instructor_id,\n  class_id,\n  branch_id,\n  assignment_status,\n  assigned_by,\n  notes,\n  payment_amount,\n  payment_status\n) VALUES (\n  :instructorId!,\n  :classId!,\n  :branchId!,\n  :assignmentStatus!,\n  :assignedBy!,\n  :notes,\n  :paymentAmount,\n  :paymentStatus!\n)\nRETURNING *"};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO instructor_class_assignments (
 *   instructor_id,
 *   class_id,
 *   branch_id,
 *   assignment_status,
 *   assigned_by,
 *   notes,
 *   payment_amount,
 *   payment_status
 * ) VALUES (
 *   :instructorId!,
 *   :classId!,
 *   :branchId!,
 *   :assignmentStatus!,
 *   :assignedBy!,
 *   :notes,
 *   :paymentAmount,
 *   :paymentStatus!
 * )
 * RETURNING *
 * ```
 */
export const createClassAssignment = new PreparedQuery<CreateClassAssignmentParams,CreateClassAssignmentResult>(createClassAssignmentIR);


/** 'GetInstructorAssignments' parameters type */
export interface GetInstructorAssignmentsParams {
  branchId: string;
  endDate: DateOrString;
  instructorId: string;
  startDate: DateOrString;
}

/** 'GetInstructorAssignments' return type */
export interface GetInstructorAssignmentsResult {
  assigned_at: Date | null;
  assigned_by: string | null;
  assignment_status: string | null;
  branch_id: string;
  capacity: number;
  class_id: string;
  class_name: string;
  confirmed_count: string | null;
  created_at: Date | null;
  id: string;
  instructor_id: string;
  notes: string | null;
  payment_amount: string | null;
  payment_status: string | null;
  scheduled_at: Date;
}

/** 'GetInstructorAssignments' query type */
export interface GetInstructorAssignmentsQuery {
  params: GetInstructorAssignmentsParams;
  result: GetInstructorAssignmentsResult;
}

const getInstructorAssignmentsIR: any = {"usedParamSet":{"instructorId":true,"branchId":true,"startDate":true,"endDate":true},"params":[{"name":"instructorId","required":true,"transform":{"type":"scalar"},"locs":[{"a":287,"b":300}]},{"name":"branchId","required":true,"transform":{"type":"scalar"},"locs":[{"a":324,"b":333}]},{"name":"startDate","required":true,"transform":{"type":"scalar"},"locs":[{"a":359,"b":369}]},{"name":"endDate","required":true,"transform":{"type":"scalar"},"locs":[{"a":395,"b":403}]}],"statement":"SELECT\n  ica.*,\n  c.scheduled_at,\n  c.name as class_name,\n  c.capacity,\n  COUNT(b.id) FILTER (WHERE b.status = 'confirmed') as confirmed_count\nFROM instructor_class_assignments ica\nJOIN classes c ON ica.class_id = c.id\nLEFT JOIN bookings b ON c.id = b.class_id\nWHERE ica.instructor_id = :instructorId!\n  AND ica.branch_id = :branchId!\n  AND c.scheduled_at >= :startDate!\n  AND c.scheduled_at <= :endDate!\nGROUP BY ica.id, c.scheduled_at, c.name, c.capacity\nORDER BY c.scheduled_at"};

/**
 * Query generated from SQL:
 * ```
 * SELECT
 *   ica.*,
 *   c.scheduled_at,
 *   c.name as class_name,
 *   c.capacity,
 *   COUNT(b.id) FILTER (WHERE b.status = 'confirmed') as confirmed_count
 * FROM instructor_class_assignments ica
 * JOIN classes c ON ica.class_id = c.id
 * LEFT JOIN bookings b ON c.id = b.class_id
 * WHERE ica.instructor_id = :instructorId!
 *   AND ica.branch_id = :branchId!
 *   AND c.scheduled_at >= :startDate!
 *   AND c.scheduled_at <= :endDate!
 * GROUP BY ica.id, c.scheduled_at, c.name, c.capacity
 * ORDER BY c.scheduled_at
 * ```
 */
export const getInstructorAssignments = new PreparedQuery<GetInstructorAssignmentsParams,GetInstructorAssignmentsResult>(getInstructorAssignmentsIR);


/** 'UpdateAssignmentStatus' parameters type */
export interface UpdateAssignmentStatusParams {
  assignmentId: string;
  assignmentStatus: string;
  branchId: string;
}

/** 'UpdateAssignmentStatus' return type */
export interface UpdateAssignmentStatusResult {
  assigned_at: Date | null;
  assigned_by: string | null;
  assignment_status: string | null;
  branch_id: string;
  class_id: string;
  created_at: Date | null;
  id: string;
  instructor_id: string;
  notes: string | null;
  payment_amount: string | null;
  payment_status: string | null;
}

/** 'UpdateAssignmentStatus' query type */
export interface UpdateAssignmentStatusQuery {
  params: UpdateAssignmentStatusParams;
  result: UpdateAssignmentStatusResult;
}

const updateAssignmentStatusIR: any = {"usedParamSet":{"assignmentStatus":true,"assignmentId":true,"branchId":true},"params":[{"name":"assignmentStatus","required":true,"transform":{"type":"scalar"},"locs":[{"a":60,"b":77}]},{"name":"assignmentId","required":true,"transform":{"type":"scalar"},"locs":[{"a":90,"b":103}]},{"name":"branchId","required":true,"transform":{"type":"scalar"},"locs":[{"a":123,"b":132}]}],"statement":"UPDATE instructor_class_assignments\nSET assignment_status = :assignmentStatus!\nWHERE id = :assignmentId!\n  AND branch_id = :branchId!\nRETURNING *"};

/**
 * Query generated from SQL:
 * ```
 * UPDATE instructor_class_assignments
 * SET assignment_status = :assignmentStatus!
 * WHERE id = :assignmentId!
 *   AND branch_id = :branchId!
 * RETURNING *
 * ```
 */
export const updateAssignmentStatus = new PreparedQuery<UpdateAssignmentStatusParams,UpdateAssignmentStatusResult>(updateAssignmentStatusIR);


/** 'UpdateAssignmentPayment' parameters type */
export interface UpdateAssignmentPaymentParams {
  assignmentId: string;
  branchId: string;
  paymentAmount: NumberOrString;
  paymentStatus: string;
}

/** 'UpdateAssignmentPayment' return type */
export interface UpdateAssignmentPaymentResult {
  assigned_at: Date | null;
  assigned_by: string | null;
  assignment_status: string | null;
  branch_id: string;
  class_id: string;
  created_at: Date | null;
  id: string;
  instructor_id: string;
  notes: string | null;
  payment_amount: string | null;
  payment_status: string | null;
}

/** 'UpdateAssignmentPayment' query type */
export interface UpdateAssignmentPaymentQuery {
  params: UpdateAssignmentPaymentParams;
  result: UpdateAssignmentPaymentResult;
}

const updateAssignmentPaymentIR: any = {"usedParamSet":{"paymentAmount":true,"paymentStatus":true,"assignmentId":true,"branchId":true},"params":[{"name":"paymentAmount","required":true,"transform":{"type":"scalar"},"locs":[{"a":59,"b":73}]},{"name":"paymentStatus","required":true,"transform":{"type":"scalar"},"locs":[{"a":95,"b":109}]},{"name":"assignmentId","required":true,"transform":{"type":"scalar"},"locs":[{"a":122,"b":135}]},{"name":"branchId","required":true,"transform":{"type":"scalar"},"locs":[{"a":155,"b":164}]}],"statement":"UPDATE instructor_class_assignments\nSET\n  payment_amount = :paymentAmount!,\n  payment_status = :paymentStatus!\nWHERE id = :assignmentId!\n  AND branch_id = :branchId!\nRETURNING *"};

/**
 * Query generated from SQL:
 * ```
 * UPDATE instructor_class_assignments
 * SET
 *   payment_amount = :paymentAmount!,
 *   payment_status = :paymentStatus!
 * WHERE id = :assignmentId!
 *   AND branch_id = :branchId!
 * RETURNING *
 * ```
 */
export const updateAssignmentPayment = new PreparedQuery<UpdateAssignmentPaymentParams,UpdateAssignmentPaymentResult>(updateAssignmentPaymentIR);


/** 'CreateInstructorClientNote' parameters type */
export interface CreateInstructorClientNoteParams {
  branchId: string;
  clientId: string;
  instructorId: string;
  isPrivate: boolean;
  noteText: string;
  noteType?: string | null | void;
}

/** 'CreateInstructorClientNote' return type */
export interface CreateInstructorClientNoteResult {
  branch_id: string;
  client_id: string;
  created_at: Date | null;
  id: string;
  instructor_id: string;
  is_private: boolean | null;
  note_text: string;
  note_type: string | null;
  updated_at: Date | null;
}

/** 'CreateInstructorClientNote' query type */
export interface CreateInstructorClientNoteQuery {
  params: CreateInstructorClientNoteParams;
  result: CreateInstructorClientNoteResult;
}

const createInstructorClientNoteIR: any = {"usedParamSet":{"instructorId":true,"clientId":true,"branchId":true,"noteText":true,"noteType":true,"isPrivate":true},"params":[{"name":"instructorId","required":true,"transform":{"type":"scalar"},"locs":[{"a":133,"b":146}]},{"name":"clientId","required":true,"transform":{"type":"scalar"},"locs":[{"a":151,"b":160}]},{"name":"branchId","required":true,"transform":{"type":"scalar"},"locs":[{"a":165,"b":174}]},{"name":"noteText","required":true,"transform":{"type":"scalar"},"locs":[{"a":179,"b":188}]},{"name":"noteType","required":false,"transform":{"type":"scalar"},"locs":[{"a":193,"b":201}]},{"name":"isPrivate","required":true,"transform":{"type":"scalar"},"locs":[{"a":206,"b":216}]}],"statement":"INSERT INTO instructor_client_notes (\n  instructor_id,\n  client_id,\n  branch_id,\n  note_text,\n  note_type,\n  is_private\n) VALUES (\n  :instructorId!,\n  :clientId!,\n  :branchId!,\n  :noteText!,\n  :noteType,\n  :isPrivate!\n)\nRETURNING *"};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO instructor_client_notes (
 *   instructor_id,
 *   client_id,
 *   branch_id,
 *   note_text,
 *   note_type,
 *   is_private
 * ) VALUES (
 *   :instructorId!,
 *   :clientId!,
 *   :branchId!,
 *   :noteText!,
 *   :noteType,
 *   :isPrivate!
 * )
 * RETURNING *
 * ```
 */
export const createInstructorClientNote = new PreparedQuery<CreateInstructorClientNoteParams,CreateInstructorClientNoteResult>(createInstructorClientNoteIR);


/** 'GetInstructorNotesForClient' parameters type */
export interface GetInstructorNotesForClientParams {
  branchId: string;
  clientId: string;
  limit?: NumberOrString | null | void;
}

/** 'GetInstructorNotesForClient' return type */
export interface GetInstructorNotesForClientResult {
  branch_id: string;
  client_id: string;
  created_at: Date | null;
  id: string;
  instructor_first_name: string | null;
  instructor_id: string;
  instructor_last_name: string | null;
  instructor_user_id: string;
  is_private: boolean | null;
  note_text: string;
  note_type: string | null;
  updated_at: Date | null;
}

/** 'GetInstructorNotesForClient' query type */
export interface GetInstructorNotesForClientQuery {
  params: GetInstructorNotesForClientParams;
  result: GetInstructorNotesForClientResult;
}

const getInstructorNotesForClientIR: any = {"usedParamSet":{"clientId":true,"branchId":true,"limit":true},"params":[{"name":"clientId","required":true,"transform":{"type":"scalar"},"locs":[{"a":278,"b":287}]},{"name":"branchId","required":true,"transform":{"type":"scalar"},"locs":[{"a":311,"b":320}]},{"name":"limit","required":false,"transform":{"type":"scalar"},"locs":[{"a":357,"b":362}]}],"statement":"SELECT\n  icn.*,\n  ip.user_id as instructor_user_id,\n  u.first_name as instructor_first_name,\n  u.last_name as instructor_last_name\nFROM instructor_client_notes icn\nJOIN instructor_profiles ip ON icn.instructor_id = ip.id\nJOIN \"user\" u ON ip.user_id = u.id\nWHERE icn.client_id = :clientId!\n  AND icn.branch_id = :branchId!\nORDER BY icn.created_at DESC\nLIMIT :limit"};

/**
 * Query generated from SQL:
 * ```
 * SELECT
 *   icn.*,
 *   ip.user_id as instructor_user_id,
 *   u.first_name as instructor_first_name,
 *   u.last_name as instructor_last_name
 * FROM instructor_client_notes icn
 * JOIN instructor_profiles ip ON icn.instructor_id = ip.id
 * JOIN "user" u ON ip.user_id = u.id
 * WHERE icn.client_id = :clientId!
 *   AND icn.branch_id = :branchId!
 * ORDER BY icn.created_at DESC
 * LIMIT :limit
 * ```
 */
export const getInstructorNotesForClient = new PreparedQuery<GetInstructorNotesForClientParams,GetInstructorNotesForClientResult>(getInstructorNotesForClientIR);


/** 'GetInstructorStats' parameters type */
export interface GetInstructorStatsParams {
  endDate: DateOrString;
  instructorId: string;
  startDate: DateOrString;
}

/** 'GetInstructorStats' return type */
export interface GetInstructorStatsResult {
  avg_attendance_rate: string | null;
  cancelled_classes: string | null;
  completed_classes: string | null;
  no_show_classes: string | null;
  total_classes: string | null;
  total_earnings: string | null;
  total_students: string | null;
}

/** 'GetInstructorStats' query type */
export interface GetInstructorStatsQuery {
  params: GetInstructorStatsParams;
  result: GetInstructorStatsResult;
}

const getInstructorStatsIR: any = {"usedParamSet":{"instructorId":true,"startDate":true,"endDate":true},"params":[{"name":"instructorId","required":true,"transform":{"type":"scalar"},"locs":[{"a":169,"b":182}]},{"name":"startDate","required":true,"transform":{"type":"scalar"},"locs":[{"a":185,"b":195}]},{"name":"endDate","required":true,"transform":{"type":"scalar"},"locs":[{"a":198,"b":206}]}],"statement":"SELECT\n  total_classes,\n  completed_classes,\n  cancelled_classes,\n  no_show_classes,\n  total_students,\n  avg_attendance_rate,\n  total_earnings\nFROM get_instructor_stats(:instructorId!, :startDate!, :endDate!)"};

/**
 * Query generated from SQL:
 * ```
 * SELECT
 *   total_classes,
 *   completed_classes,
 *   cancelled_classes,
 *   no_show_classes,
 *   total_students,
 *   avg_attendance_rate,
 *   total_earnings
 * FROM get_instructor_stats(:instructorId!, :startDate!, :endDate!)
 * ```
 */
export const getInstructorStats = new PreparedQuery<GetInstructorStatsParams,GetInstructorStatsResult>(getInstructorStatsIR);


/** 'CheckInstructorAvailability' parameters type */
export interface CheckInstructorAvailabilityParams {
  date: DateOrString;
  endTime: DateOrString;
  instructorId: string;
  startTime: DateOrString;
}

/** 'CheckInstructorAvailability' return type */
export interface CheckInstructorAvailabilityResult {
  is_available: boolean | null;
}

/** 'CheckInstructorAvailability' query type */
export interface CheckInstructorAvailabilityQuery {
  params: CheckInstructorAvailabilityParams;
  result: CheckInstructorAvailabilityResult;
}

const checkInstructorAvailabilityIR: any = {"usedParamSet":{"instructorId":true,"date":true,"startTime":true,"endTime":true},"params":[{"name":"instructorId","required":true,"transform":{"type":"scalar"},"locs":[{"a":31,"b":44}]},{"name":"date","required":true,"transform":{"type":"scalar"},"locs":[{"a":47,"b":52}]},{"name":"startTime","required":true,"transform":{"type":"scalar"},"locs":[{"a":55,"b":65}]},{"name":"endTime","required":true,"transform":{"type":"scalar"},"locs":[{"a":68,"b":76}]}],"statement":"SELECT is_instructor_available(:instructorId!, :date!, :startTime!, :endTime!) as is_available"};

/**
 * Query generated from SQL:
 * ```
 * SELECT is_instructor_available(:instructorId!, :date!, :startTime!, :endTime!) as is_available
 * ```
 */
export const checkInstructorAvailability = new PreparedQuery<CheckInstructorAvailabilityParams,CheckInstructorAvailabilityResult>(checkInstructorAvailabilityIR);


/** 'GetInstructorDashboardStats' parameters type */
export interface GetInstructorDashboardStatsParams {
  branchId: string;
  instructorId: string;
}

/** 'GetInstructorDashboardStats' return type */
export interface GetInstructorDashboardStatsResult {
  completed_classes_month: string | null;
  earnings_month: string | null;
  unique_students_month: string | null;
  upcoming_classes_week: string | null;
}

/** 'GetInstructorDashboardStats' query type */
export interface GetInstructorDashboardStatsQuery {
  params: GetInstructorDashboardStatsParams;
  result: GetInstructorDashboardStatsResult;
}

const getInstructorDashboardStatsIR: any = {"usedParamSet":{"instructorId":true,"branchId":true},"params":[{"name":"instructorId","required":true,"transform":{"type":"scalar"},"locs":[{"a":822,"b":835}]},{"name":"branchId","required":true,"transform":{"type":"scalar"},"locs":[{"a":859,"b":868}]}],"statement":"SELECT\n  COUNT(DISTINCT ica.class_id) FILTER (\n    WHERE c.scheduled_at >= CURRENT_DATE\n    AND c.scheduled_at < CURRENT_DATE + INTERVAL '7 days'\n  ) as upcoming_classes_week,\n  COUNT(DISTINCT ica.class_id) FILTER (\n    WHERE ica.assignment_status = 'completed'\n    AND c.scheduled_at >= CURRENT_DATE - INTERVAL '30 days'\n  ) as completed_classes_month,\n  COUNT(DISTINCT b.user_id) FILTER (\n    WHERE c.scheduled_at >= CURRENT_DATE - INTERVAL '30 days'\n  ) as unique_students_month,\n  COALESCE(SUM(ica.payment_amount) FILTER (\n    WHERE ica.payment_status = 'paid'\n    AND c.scheduled_at >= CURRENT_DATE - INTERVAL '30 days'\n  ), 0) as earnings_month\nFROM instructor_class_assignments ica\nJOIN classes c ON ica.class_id = c.id\nLEFT JOIN bookings b ON c.id = b.class_id AND b.status = 'confirmed'\nWHERE ica.instructor_id = :instructorId!\n  AND ica.branch_id = :branchId!"};

/**
 * Query generated from SQL:
 * ```
 * SELECT
 *   COUNT(DISTINCT ica.class_id) FILTER (
 *     WHERE c.scheduled_at >= CURRENT_DATE
 *     AND c.scheduled_at < CURRENT_DATE + INTERVAL '7 days'
 *   ) as upcoming_classes_week,
 *   COUNT(DISTINCT ica.class_id) FILTER (
 *     WHERE ica.assignment_status = 'completed'
 *     AND c.scheduled_at >= CURRENT_DATE - INTERVAL '30 days'
 *   ) as completed_classes_month,
 *   COUNT(DISTINCT b.user_id) FILTER (
 *     WHERE c.scheduled_at >= CURRENT_DATE - INTERVAL '30 days'
 *   ) as unique_students_month,
 *   COALESCE(SUM(ica.payment_amount) FILTER (
 *     WHERE ica.payment_status = 'paid'
 *     AND c.scheduled_at >= CURRENT_DATE - INTERVAL '30 days'
 *   ), 0) as earnings_month
 * FROM instructor_class_assignments ica
 * JOIN classes c ON ica.class_id = c.id
 * LEFT JOIN bookings b ON c.id = b.class_id AND b.status = 'confirmed'
 * WHERE ica.instructor_id = :instructorId!
 *   AND ica.branch_id = :branchId!
 * ```
 */
export const getInstructorDashboardStats = new PreparedQuery<GetInstructorDashboardStatsParams,GetInstructorDashboardStatsResult>(getInstructorDashboardStatsIR);


/** 'GetInstructorClassHistory' parameters type */
export interface GetInstructorClassHistoryParams {
  branchId: string;
  instructorId: string;
  limit?: NumberOrString | null | void;
}

/** 'GetInstructorClassHistory' return type */
export interface GetInstructorClassHistoryResult {
  assignment_status: string | null;
  attendance_rate: string | null;
  capacity: number;
  class_id: string;
  class_name: string;
  confirmed_count: string | null;
  payment_amount: string | null;
  payment_status: string | null;
  present_count: string | null;
  scheduled_at: Date;
}

/** 'GetInstructorClassHistory' query type */
export interface GetInstructorClassHistoryQuery {
  params: GetInstructorClassHistoryParams;
  result: GetInstructorClassHistoryResult;
}

const getInstructorClassHistoryIR: any = {"usedParamSet":{"instructorId":true,"branchId":true,"limit":true},"params":[{"name":"instructorId","required":true,"transform":{"type":"scalar"},"locs":[{"a":669,"b":682}]},{"name":"branchId","required":true,"transform":{"type":"scalar"},"locs":[{"a":706,"b":715}]},{"name":"limit","required":false,"transform":{"type":"scalar"},"locs":[{"a":906,"b":911}]}],"statement":"SELECT\n  c.id as class_id,\n  c.scheduled_at,\n  c.name as class_name,\n  c.capacity,\n  ica.assignment_status,\n  ica.payment_amount,\n  ica.payment_status,\n  COUNT(b.id) FILTER (WHERE b.status = 'confirmed') as confirmed_count,\n  COUNT(ar.id) FILTER (WHERE ar.status = 'present') as present_count,\n  ROUND(\n    COUNT(ar.id) FILTER (WHERE ar.status = 'present')::NUMERIC /\n    NULLIF(COUNT(b.id) FILTER (WHERE b.status = 'confirmed'), 0) * 100,\n    2\n  ) as attendance_rate\nFROM instructor_class_assignments ica\nJOIN classes c ON ica.class_id = c.id\nLEFT JOIN bookings b ON c.id = b.class_id\nLEFT JOIN attendance_records ar ON b.id = ar.booking_id\nWHERE ica.instructor_id = :instructorId!\n  AND ica.branch_id = :branchId!\n  AND c.scheduled_at < CURRENT_TIMESTAMP\nGROUP BY c.id, c.scheduled_at, c.name, c.capacity, ica.assignment_status, ica.payment_amount, ica.payment_status\nORDER BY c.scheduled_at DESC\nLIMIT :limit"};

/**
 * Query generated from SQL:
 * ```
 * SELECT
 *   c.id as class_id,
 *   c.scheduled_at,
 *   c.name as class_name,
 *   c.capacity,
 *   ica.assignment_status,
 *   ica.payment_amount,
 *   ica.payment_status,
 *   COUNT(b.id) FILTER (WHERE b.status = 'confirmed') as confirmed_count,
 *   COUNT(ar.id) FILTER (WHERE ar.status = 'present') as present_count,
 *   ROUND(
 *     COUNT(ar.id) FILTER (WHERE ar.status = 'present')::NUMERIC /
 *     NULLIF(COUNT(b.id) FILTER (WHERE b.status = 'confirmed'), 0) * 100,
 *     2
 *   ) as attendance_rate
 * FROM instructor_class_assignments ica
 * JOIN classes c ON ica.class_id = c.id
 * LEFT JOIN bookings b ON c.id = b.class_id
 * LEFT JOIN attendance_records ar ON b.id = ar.booking_id
 * WHERE ica.instructor_id = :instructorId!
 *   AND ica.branch_id = :branchId!
 *   AND c.scheduled_at < CURRENT_TIMESTAMP
 * GROUP BY c.id, c.scheduled_at, c.name, c.capacity, ica.assignment_status, ica.payment_amount, ica.payment_status
 * ORDER BY c.scheduled_at DESC
 * LIMIT :limit
 * ```
 */
export const getInstructorClassHistory = new PreparedQuery<GetInstructorClassHistoryParams,GetInstructorClassHistoryResult>(getInstructorClassHistoryIR);


