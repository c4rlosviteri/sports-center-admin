/** Types generated for queries found in "src/db/queries/recurring-classes.sql" */
import { PreparedQuery } from '@pgtyped/runtime';

export type DateOrString = Date | string;

export type NumberOrString = number | string;

/** 'CreateRecurringTemplate' parameters type */
export interface CreateRecurringTemplateParams {
  branchId: string;
  capacity: number;
  createdBy: string;
  dayOfWeek: number;
  durationMinutes: number;
  endDate?: DateOrString | null | void;
  instructor: string;
  isActive: boolean;
  name: string;
  startDate: DateOrString;
  startTime: DateOrString;
  waitlistCapacity: number;
}

/** 'CreateRecurringTemplate' return type */
export interface CreateRecurringTemplateResult {
  branch_id: string;
  capacity: number;
  created_at: Date | null;
  created_by: string | null;
  day_of_week: number;
  duration_minutes: number;
  end_date: Date | null;
  id: string;
  instructor: string | null;
  is_active: boolean | null;
  name: string;
  start_date: Date;
  start_time: Date;
  updated_at: Date | null;
  waitlist_capacity: number;
}

/** 'CreateRecurringTemplate' query type */
export interface CreateRecurringTemplateQuery {
  params: CreateRecurringTemplateParams;
  result: CreateRecurringTemplateResult;
}

const createRecurringTemplateIR: any = {"usedParamSet":{"branchId":true,"name":true,"instructor":true,"dayOfWeek":true,"startTime":true,"durationMinutes":true,"capacity":true,"waitlistCapacity":true,"isActive":true,"startDate":true,"endDate":true,"createdBy":true},"params":[{"name":"branchId","required":true,"transform":{"type":"scalar"},"locs":[{"a":222,"b":231}]},{"name":"name","required":true,"transform":{"type":"scalar"},"locs":[{"a":236,"b":241}]},{"name":"instructor","required":true,"transform":{"type":"scalar"},"locs":[{"a":246,"b":257}]},{"name":"dayOfWeek","required":true,"transform":{"type":"scalar"},"locs":[{"a":262,"b":272}]},{"name":"startTime","required":true,"transform":{"type":"scalar"},"locs":[{"a":277,"b":287}]},{"name":"durationMinutes","required":true,"transform":{"type":"scalar"},"locs":[{"a":292,"b":308}]},{"name":"capacity","required":true,"transform":{"type":"scalar"},"locs":[{"a":313,"b":322}]},{"name":"waitlistCapacity","required":true,"transform":{"type":"scalar"},"locs":[{"a":327,"b":344}]},{"name":"isActive","required":true,"transform":{"type":"scalar"},"locs":[{"a":349,"b":358}]},{"name":"startDate","required":true,"transform":{"type":"scalar"},"locs":[{"a":363,"b":373}]},{"name":"endDate","required":false,"transform":{"type":"scalar"},"locs":[{"a":378,"b":385}]},{"name":"createdBy","required":true,"transform":{"type":"scalar"},"locs":[{"a":390,"b":400}]}],"statement":"INSERT INTO recurring_class_templates (\n  branch_id,\n  name,\n  instructor,\n  day_of_week,\n  start_time,\n  duration_minutes,\n  capacity,\n  waitlist_capacity,\n  is_active,\n  start_date,\n  end_date,\n  created_by\n) VALUES (\n  :branchId!,\n  :name!,\n  :instructor!,\n  :dayOfWeek!,\n  :startTime!,\n  :durationMinutes!,\n  :capacity!,\n  :waitlistCapacity!,\n  :isActive!,\n  :startDate!,\n  :endDate,\n  :createdBy!\n)\nRETURNING *"};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO recurring_class_templates (
 *   branch_id,
 *   name,
 *   instructor,
 *   day_of_week,
 *   start_time,
 *   duration_minutes,
 *   capacity,
 *   waitlist_capacity,
 *   is_active,
 *   start_date,
 *   end_date,
 *   created_by
 * ) VALUES (
 *   :branchId!,
 *   :name!,
 *   :instructor!,
 *   :dayOfWeek!,
 *   :startTime!,
 *   :durationMinutes!,
 *   :capacity!,
 *   :waitlistCapacity!,
 *   :isActive!,
 *   :startDate!,
 *   :endDate,
 *   :createdBy!
 * )
 * RETURNING *
 * ```
 */
export const createRecurringTemplate = new PreparedQuery<CreateRecurringTemplateParams,CreateRecurringTemplateResult>(createRecurringTemplateIR);


/** 'GetRecurringTemplates' parameters type */
export interface GetRecurringTemplatesParams {
  branchId: string;
}

/** 'GetRecurringTemplates' return type */
export interface GetRecurringTemplatesResult {
  branch_id: string;
  capacity: number;
  created_at: Date | null;
  created_by: string | null;
  day_of_week: number;
  duration_minutes: number;
  end_date: Date | null;
  id: string;
  instructor: string | null;
  is_active: boolean | null;
  name: string;
  start_date: Date;
  start_time: Date;
  updated_at: Date | null;
  waitlist_capacity: number;
}

/** 'GetRecurringTemplates' query type */
export interface GetRecurringTemplatesQuery {
  params: GetRecurringTemplatesParams;
  result: GetRecurringTemplatesResult;
}

const getRecurringTemplatesIR: any = {"usedParamSet":{"branchId":true},"params":[{"name":"branchId","required":true,"transform":{"type":"scalar"},"locs":[{"a":58,"b":67}]}],"statement":"SELECT *\nFROM recurring_class_templates\nWHERE branch_id = :branchId!\n  AND is_active = true\nORDER BY day_of_week ASC, start_time ASC"};

/**
 * Query generated from SQL:
 * ```
 * SELECT *
 * FROM recurring_class_templates
 * WHERE branch_id = :branchId!
 *   AND is_active = true
 * ORDER BY day_of_week ASC, start_time ASC
 * ```
 */
export const getRecurringTemplates = new PreparedQuery<GetRecurringTemplatesParams,GetRecurringTemplatesResult>(getRecurringTemplatesIR);


/** 'GetRecurringTemplateById' parameters type */
export interface GetRecurringTemplateByIdParams {
  branchId: string;
  templateId: string;
}

/** 'GetRecurringTemplateById' return type */
export interface GetRecurringTemplateByIdResult {
  branch_id: string;
  capacity: number;
  created_at: Date | null;
  created_by: string | null;
  day_of_week: number;
  duration_minutes: number;
  end_date: Date | null;
  id: string;
  instructor: string | null;
  is_active: boolean | null;
  name: string;
  start_date: Date;
  start_time: Date;
  updated_at: Date | null;
  waitlist_capacity: number;
}

/** 'GetRecurringTemplateById' query type */
export interface GetRecurringTemplateByIdQuery {
  params: GetRecurringTemplateByIdParams;
  result: GetRecurringTemplateByIdResult;
}

const getRecurringTemplateByIdIR: any = {"usedParamSet":{"templateId":true,"branchId":true},"params":[{"name":"templateId","required":true,"transform":{"type":"scalar"},"locs":[{"a":51,"b":62}]},{"name":"branchId","required":true,"transform":{"type":"scalar"},"locs":[{"a":82,"b":91}]}],"statement":"SELECT *\nFROM recurring_class_templates\nWHERE id = :templateId!\n  AND branch_id = :branchId!"};

/**
 * Query generated from SQL:
 * ```
 * SELECT *
 * FROM recurring_class_templates
 * WHERE id = :templateId!
 *   AND branch_id = :branchId!
 * ```
 */
export const getRecurringTemplateById = new PreparedQuery<GetRecurringTemplateByIdParams,GetRecurringTemplateByIdResult>(getRecurringTemplateByIdIR);


/** 'UpdateRecurringTemplate' parameters type */
export interface UpdateRecurringTemplateParams {
  branchId: string;
  capacity: number;
  dayOfWeek: number;
  durationMinutes: number;
  endDate?: DateOrString | null | void;
  instructor: string;
  isActive: boolean;
  name: string;
  startDate: DateOrString;
  startTime: DateOrString;
  templateId: string;
  waitlistCapacity: number;
}

/** 'UpdateRecurringTemplate' return type */
export interface UpdateRecurringTemplateResult {
  branch_id: string;
  capacity: number;
  created_at: Date | null;
  created_by: string | null;
  day_of_week: number;
  duration_minutes: number;
  end_date: Date | null;
  id: string;
  instructor: string | null;
  is_active: boolean | null;
  name: string;
  start_date: Date;
  start_time: Date;
  updated_at: Date | null;
  waitlist_capacity: number;
}

/** 'UpdateRecurringTemplate' query type */
export interface UpdateRecurringTemplateQuery {
  params: UpdateRecurringTemplateParams;
  result: UpdateRecurringTemplateResult;
}

const updateRecurringTemplateIR: any = {"usedParamSet":{"name":true,"instructor":true,"dayOfWeek":true,"startTime":true,"durationMinutes":true,"capacity":true,"waitlistCapacity":true,"isActive":true,"startDate":true,"endDate":true,"templateId":true,"branchId":true},"params":[{"name":"name","required":true,"transform":{"type":"scalar"},"locs":[{"a":46,"b":51}]},{"name":"instructor","required":true,"transform":{"type":"scalar"},"locs":[{"a":69,"b":80}]},{"name":"dayOfWeek","required":true,"transform":{"type":"scalar"},"locs":[{"a":99,"b":109}]},{"name":"startTime","required":true,"transform":{"type":"scalar"},"locs":[{"a":127,"b":137}]},{"name":"durationMinutes","required":true,"transform":{"type":"scalar"},"locs":[{"a":161,"b":177}]},{"name":"capacity","required":true,"transform":{"type":"scalar"},"locs":[{"a":193,"b":202}]},{"name":"waitlistCapacity","required":true,"transform":{"type":"scalar"},"locs":[{"a":227,"b":244}]},{"name":"isActive","required":true,"transform":{"type":"scalar"},"locs":[{"a":261,"b":270}]},{"name":"startDate","required":true,"transform":{"type":"scalar"},"locs":[{"a":288,"b":298}]},{"name":"endDate","required":false,"transform":{"type":"scalar"},"locs":[{"a":314,"b":321}]},{"name":"templateId","required":true,"transform":{"type":"scalar"},"locs":[{"a":334,"b":345}]},{"name":"branchId","required":true,"transform":{"type":"scalar"},"locs":[{"a":365,"b":374}]}],"statement":"UPDATE recurring_class_templates\nSET\n  name = :name!,\n  instructor = :instructor!,\n  day_of_week = :dayOfWeek!,\n  start_time = :startTime!,\n  duration_minutes = :durationMinutes!,\n  capacity = :capacity!,\n  waitlist_capacity = :waitlistCapacity!,\n  is_active = :isActive!,\n  start_date = :startDate!,\n  end_date = :endDate\nWHERE id = :templateId!\n  AND branch_id = :branchId!\nRETURNING *"};

/**
 * Query generated from SQL:
 * ```
 * UPDATE recurring_class_templates
 * SET
 *   name = :name!,
 *   instructor = :instructor!,
 *   day_of_week = :dayOfWeek!,
 *   start_time = :startTime!,
 *   duration_minutes = :durationMinutes!,
 *   capacity = :capacity!,
 *   waitlist_capacity = :waitlistCapacity!,
 *   is_active = :isActive!,
 *   start_date = :startDate!,
 *   end_date = :endDate
 * WHERE id = :templateId!
 *   AND branch_id = :branchId!
 * RETURNING *
 * ```
 */
export const updateRecurringTemplate = new PreparedQuery<UpdateRecurringTemplateParams,UpdateRecurringTemplateResult>(updateRecurringTemplateIR);


/** 'DeactivateRecurringTemplate' parameters type */
export interface DeactivateRecurringTemplateParams {
  branchId: string;
  templateId: string;
}

/** 'DeactivateRecurringTemplate' return type */
export interface DeactivateRecurringTemplateResult {
  branch_id: string;
  capacity: number;
  created_at: Date | null;
  created_by: string | null;
  day_of_week: number;
  duration_minutes: number;
  end_date: Date | null;
  id: string;
  instructor: string | null;
  is_active: boolean | null;
  name: string;
  start_date: Date;
  start_time: Date;
  updated_at: Date | null;
  waitlist_capacity: number;
}

/** 'DeactivateRecurringTemplate' query type */
export interface DeactivateRecurringTemplateQuery {
  params: DeactivateRecurringTemplateParams;
  result: DeactivateRecurringTemplateResult;
}

const deactivateRecurringTemplateIR: any = {"usedParamSet":{"templateId":true,"branchId":true},"params":[{"name":"templateId","required":true,"transform":{"type":"scalar"},"locs":[{"a":66,"b":77}]},{"name":"branchId","required":true,"transform":{"type":"scalar"},"locs":[{"a":97,"b":106}]}],"statement":"UPDATE recurring_class_templates\nSET is_active = false\nWHERE id = :templateId!\n  AND branch_id = :branchId!\nRETURNING *"};

/**
 * Query generated from SQL:
 * ```
 * UPDATE recurring_class_templates
 * SET is_active = false
 * WHERE id = :templateId!
 *   AND branch_id = :branchId!
 * RETURNING *
 * ```
 */
export const deactivateRecurringTemplate = new PreparedQuery<DeactivateRecurringTemplateParams,DeactivateRecurringTemplateResult>(deactivateRecurringTemplateIR);


/** 'DeleteRecurringTemplate' parameters type */
export interface DeleteRecurringTemplateParams {
  branchId: string;
  templateId: string;
}

/** 'DeleteRecurringTemplate' return type */
export interface DeleteRecurringTemplateResult {
  branch_id: string;
  capacity: number;
  created_at: Date | null;
  created_by: string | null;
  day_of_week: number;
  duration_minutes: number;
  end_date: Date | null;
  id: string;
  instructor: string | null;
  is_active: boolean | null;
  name: string;
  start_date: Date;
  start_time: Date;
  updated_at: Date | null;
  waitlist_capacity: number;
}

/** 'DeleteRecurringTemplate' query type */
export interface DeleteRecurringTemplateQuery {
  params: DeleteRecurringTemplateParams;
  result: DeleteRecurringTemplateResult;
}

const deleteRecurringTemplateIR: any = {"usedParamSet":{"templateId":true,"branchId":true},"params":[{"name":"templateId","required":true,"transform":{"type":"scalar"},"locs":[{"a":49,"b":60}]},{"name":"branchId","required":true,"transform":{"type":"scalar"},"locs":[{"a":80,"b":89}]}],"statement":"DELETE FROM recurring_class_templates\nWHERE id = :templateId!\n  AND branch_id = :branchId!\nRETURNING *"};

/**
 * Query generated from SQL:
 * ```
 * DELETE FROM recurring_class_templates
 * WHERE id = :templateId!
 *   AND branch_id = :branchId!
 * RETURNING *
 * ```
 */
export const deleteRecurringTemplate = new PreparedQuery<DeleteRecurringTemplateParams,DeleteRecurringTemplateResult>(deleteRecurringTemplateIR);


/** Query 'CreateHolidayException' is invalid, so its result is assigned type 'never'.
 *  */
export type CreateHolidayExceptionResult = never;

/** Query 'CreateHolidayException' is invalid, so its parameters are assigned type 'never'.
 *  */
export type CreateHolidayExceptionParams = never;

const createHolidayExceptionIR: any = {"usedParamSet":{"branchId":true,"exceptionDate":true,"name":true,"description":true,"affectsAllClasses":true,"createdBy":true},"params":[{"name":"branchId","required":true,"transform":{"type":"scalar"},"locs":[{"a":136,"b":145}]},{"name":"exceptionDate","required":true,"transform":{"type":"scalar"},"locs":[{"a":150,"b":164}]},{"name":"name","required":true,"transform":{"type":"scalar"},"locs":[{"a":169,"b":174}]},{"name":"description","required":false,"transform":{"type":"scalar"},"locs":[{"a":179,"b":190}]},{"name":"affectsAllClasses","required":true,"transform":{"type":"scalar"},"locs":[{"a":195,"b":213}]},{"name":"createdBy","required":true,"transform":{"type":"scalar"},"locs":[{"a":218,"b":228}]}],"statement":"INSERT INTO holiday_exceptions (\n  branch_id,\n  exception_date,\n  name,\n  description,\n  affects_all_classes,\n  created_by\n) VALUES (\n  :branchId!,\n  :exceptionDate!,\n  :name!,\n  :description,\n  :affectsAllClasses!,\n  :createdBy!\n)\nRETURNING *"};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO holiday_exceptions (
 *   branch_id,
 *   exception_date,
 *   name,
 *   description,
 *   affects_all_classes,
 *   created_by
 * ) VALUES (
 *   :branchId!,
 *   :exceptionDate!,
 *   :name!,
 *   :description,
 *   :affectsAllClasses!,
 *   :createdBy!
 * )
 * RETURNING *
 * ```
 */
export const createHolidayException = new PreparedQuery<CreateHolidayExceptionParams,CreateHolidayExceptionResult>(createHolidayExceptionIR);


/** 'GetHolidayExceptions' parameters type */
export interface GetHolidayExceptionsParams {
  branchId: string;
  endDate: DateOrString;
  startDate: DateOrString;
}

/** 'GetHolidayExceptions' return type */
export interface GetHolidayExceptionsResult {
  branch_id: string;
  created_at: Date | null;
  created_by: string | null;
  exception_date: Date;
  id: string;
  is_closure: boolean | null;
  name: string;
  notes: string | null;
}

/** 'GetHolidayExceptions' query type */
export interface GetHolidayExceptionsQuery {
  params: GetHolidayExceptionsParams;
  result: GetHolidayExceptionsResult;
}

const getHolidayExceptionsIR: any = {"usedParamSet":{"branchId":true,"startDate":true,"endDate":true},"params":[{"name":"branchId","required":true,"transform":{"type":"scalar"},"locs":[{"a":51,"b":60}]},{"name":"startDate","required":true,"transform":{"type":"scalar"},"locs":[{"a":86,"b":96}]},{"name":"endDate","required":true,"transform":{"type":"scalar"},"locs":[{"a":122,"b":130}]}],"statement":"SELECT *\nFROM holiday_exceptions\nWHERE branch_id = :branchId!\n  AND exception_date >= :startDate!\n  AND exception_date <= :endDate!\nORDER BY exception_date ASC"};

/**
 * Query generated from SQL:
 * ```
 * SELECT *
 * FROM holiday_exceptions
 * WHERE branch_id = :branchId!
 *   AND exception_date >= :startDate!
 *   AND exception_date <= :endDate!
 * ORDER BY exception_date ASC
 * ```
 */
export const getHolidayExceptions = new PreparedQuery<GetHolidayExceptionsParams,GetHolidayExceptionsResult>(getHolidayExceptionsIR);


/** 'GetUpcomingHolidays' parameters type */
export interface GetUpcomingHolidaysParams {
  branchId: string;
  limit?: NumberOrString | null | void;
}

/** 'GetUpcomingHolidays' return type */
export interface GetUpcomingHolidaysResult {
  branch_id: string;
  created_at: Date | null;
  created_by: string | null;
  exception_date: Date;
  id: string;
  is_closure: boolean | null;
  name: string;
  notes: string | null;
}

/** 'GetUpcomingHolidays' query type */
export interface GetUpcomingHolidaysQuery {
  params: GetUpcomingHolidaysParams;
  result: GetUpcomingHolidaysResult;
}

const getUpcomingHolidaysIR: any = {"usedParamSet":{"branchId":true,"limit":true},"params":[{"name":"branchId","required":true,"transform":{"type":"scalar"},"locs":[{"a":51,"b":60}]},{"name":"limit","required":false,"transform":{"type":"scalar"},"locs":[{"a":133,"b":138}]}],"statement":"SELECT *\nFROM holiday_exceptions\nWHERE branch_id = :branchId!\n  AND exception_date >= CURRENT_DATE\nORDER BY exception_date ASC\nLIMIT :limit"};

/**
 * Query generated from SQL:
 * ```
 * SELECT *
 * FROM holiday_exceptions
 * WHERE branch_id = :branchId!
 *   AND exception_date >= CURRENT_DATE
 * ORDER BY exception_date ASC
 * LIMIT :limit
 * ```
 */
export const getUpcomingHolidays = new PreparedQuery<GetUpcomingHolidaysParams,GetUpcomingHolidaysResult>(getUpcomingHolidaysIR);


/** 'DeleteHolidayException' parameters type */
export interface DeleteHolidayExceptionParams {
  branchId: string;
  exceptionId: string;
}

/** 'DeleteHolidayException' return type */
export interface DeleteHolidayExceptionResult {
  branch_id: string;
  created_at: Date | null;
  created_by: string | null;
  exception_date: Date;
  id: string;
  is_closure: boolean | null;
  name: string;
  notes: string | null;
}

/** 'DeleteHolidayException' query type */
export interface DeleteHolidayExceptionQuery {
  params: DeleteHolidayExceptionParams;
  result: DeleteHolidayExceptionResult;
}

const deleteHolidayExceptionIR: any = {"usedParamSet":{"exceptionId":true,"branchId":true},"params":[{"name":"exceptionId","required":true,"transform":{"type":"scalar"},"locs":[{"a":42,"b":54}]},{"name":"branchId","required":true,"transform":{"type":"scalar"},"locs":[{"a":74,"b":83}]}],"statement":"DELETE FROM holiday_exceptions\nWHERE id = :exceptionId!\n  AND branch_id = :branchId!\nRETURNING *"};

/**
 * Query generated from SQL:
 * ```
 * DELETE FROM holiday_exceptions
 * WHERE id = :exceptionId!
 *   AND branch_id = :branchId!
 * RETURNING *
 * ```
 */
export const deleteHolidayException = new PreparedQuery<DeleteHolidayExceptionParams,DeleteHolidayExceptionResult>(deleteHolidayExceptionIR);


/** Query 'GetGenerationLog' is invalid, so its result is assigned type 'never'.
 *  */
export type GetGenerationLogResult = never;

/** Query 'GetGenerationLog' is invalid, so its parameters are assigned type 'never'.
 *  */
export type GetGenerationLogParams = never;

const getGenerationLogIR: any = {"usedParamSet":{"branchId":true,"limit":true},"params":[{"name":"branchId","required":true,"transform":{"type":"scalar"},"locs":[{"a":265,"b":274}]},{"name":"limit","required":false,"transform":{"type":"scalar"},"locs":[{"a":313,"b":318}]}],"statement":"SELECT\n  gcl.*,\n  rct.name as template_name,\n  u.first_name || ' ' || u.last_name as generated_by_name\nFROM generated_classes_log gcl\nJOIN recurring_class_templates rct ON gcl.template_id = rct.id\nLEFT JOIN \"user\" u ON gcl.generated_by = u.id\nWHERE gcl.branch_id = :branchId!\nORDER BY gcl.generated_at DESC\nLIMIT :limit"};

/**
 * Query generated from SQL:
 * ```
 * SELECT
 *   gcl.*,
 *   rct.name as template_name,
 *   u.first_name || ' ' || u.last_name as generated_by_name
 * FROM generated_classes_log gcl
 * JOIN recurring_class_templates rct ON gcl.template_id = rct.id
 * LEFT JOIN "user" u ON gcl.generated_by = u.id
 * WHERE gcl.branch_id = :branchId!
 * ORDER BY gcl.generated_at DESC
 * LIMIT :limit
 * ```
 */
export const getGenerationLog = new PreparedQuery<GetGenerationLogParams,GetGenerationLogResult>(getGenerationLogIR);


/** Query 'GetGenerationLogByTemplate' is invalid, so its result is assigned type 'never'.
 *  */
export type GetGenerationLogByTemplateResult = never;

/** Query 'GetGenerationLogByTemplate' is invalid, so its parameters are assigned type 'never'.
 *  */
export type GetGenerationLogByTemplateParams = never;

const getGenerationLogByTemplateIR: any = {"usedParamSet":{"templateId":true,"branchId":true,"limit":true},"params":[{"name":"templateId","required":true,"transform":{"type":"scalar"},"locs":[{"a":175,"b":186}]},{"name":"branchId","required":true,"transform":{"type":"scalar"},"locs":[{"a":210,"b":219}]},{"name":"limit","required":false,"transform":{"type":"scalar"},"locs":[{"a":258,"b":263}]}],"statement":"SELECT\n  gcl.*,\n  u.first_name || ' ' || u.last_name as generated_by_name\nFROM generated_classes_log gcl\nLEFT JOIN \"user\" u ON gcl.generated_by = u.id\nWHERE gcl.template_id = :templateId!\n  AND gcl.branch_id = :branchId!\nORDER BY gcl.generated_at DESC\nLIMIT :limit"};

/**
 * Query generated from SQL:
 * ```
 * SELECT
 *   gcl.*,
 *   u.first_name || ' ' || u.last_name as generated_by_name
 * FROM generated_classes_log gcl
 * LEFT JOIN "user" u ON gcl.generated_by = u.id
 * WHERE gcl.template_id = :templateId!
 *   AND gcl.branch_id = :branchId!
 * ORDER BY gcl.generated_at DESC
 * LIMIT :limit
 * ```
 */
export const getGenerationLogByTemplate = new PreparedQuery<GetGenerationLogByTemplateParams,GetGenerationLogByTemplateResult>(getGenerationLogByTemplateIR);


/** 'GetClassesByTemplate' parameters type */
export interface GetClassesByTemplateParams {
  branchId: string;
  endDate: DateOrString;
  startDate: DateOrString;
  templateId: string;
}

/** 'GetClassesByTemplate' return type */
export interface GetClassesByTemplateResult {
  /** Minimum hours before class start time that users can book. NULL = use branch default */
  booking_hours_before: number | null;
  branch_id: string;
  capacity: number;
  confirmed_count: string | null;
  created_at: Date | null;
  duration_minutes: number;
  id: string;
  instructor: string | null;
  is_recurring: boolean | null;
  name: string;
  scheduled_at: Date;
  template_id: string | null;
  updated_at: Date | null;
  waitlist_capacity: number;
  waitlist_count: string | null;
}

/** 'GetClassesByTemplate' query type */
export interface GetClassesByTemplateQuery {
  params: GetClassesByTemplateParams;
  result: GetClassesByTemplateResult;
}

const getClassesByTemplateIR: any = {"usedParamSet":{"templateId":true,"branchId":true,"startDate":true,"endDate":true},"params":[{"name":"templateId","required":true,"transform":{"type":"scalar"},"locs":[{"a":236,"b":247}]},{"name":"branchId","required":true,"transform":{"type":"scalar"},"locs":[{"a":269,"b":278}]},{"name":"startDate","required":true,"transform":{"type":"scalar"},"locs":[{"a":304,"b":314}]},{"name":"endDate","required":true,"transform":{"type":"scalar"},"locs":[{"a":340,"b":348}]}],"statement":"SELECT\n  c.*,\n  COUNT(b.id) FILTER (WHERE b.status = 'confirmed') as confirmed_count,\n  COUNT(b.id) FILTER (WHERE b.status = 'waitlisted') as waitlist_count\nFROM classes c\nLEFT JOIN bookings b ON c.id = b.class_id\nWHERE c.template_id = :templateId!\n  AND c.branch_id = :branchId!\n  AND c.scheduled_at >= :startDate!\n  AND c.scheduled_at <= :endDate!\nGROUP BY c.id\nORDER BY c.scheduled_at ASC"};

/**
 * Query generated from SQL:
 * ```
 * SELECT
 *   c.*,
 *   COUNT(b.id) FILTER (WHERE b.status = 'confirmed') as confirmed_count,
 *   COUNT(b.id) FILTER (WHERE b.status = 'waitlisted') as waitlist_count
 * FROM classes c
 * LEFT JOIN bookings b ON c.id = b.class_id
 * WHERE c.template_id = :templateId!
 *   AND c.branch_id = :branchId!
 *   AND c.scheduled_at >= :startDate!
 *   AND c.scheduled_at <= :endDate!
 * GROUP BY c.id
 * ORDER BY c.scheduled_at ASC
 * ```
 */
export const getClassesByTemplate = new PreparedQuery<GetClassesByTemplateParams,GetClassesByTemplateResult>(getClassesByTemplateIR);


/** 'BulkUpdateTemplateClasses' parameters type */
export interface BulkUpdateTemplateClassesParams {
  branchId: string;
  capacity: number;
  instructor: string;
  templateId: string;
  waitlistCapacity: number;
}

/** 'BulkUpdateTemplateClasses' return type */
export interface BulkUpdateTemplateClassesResult {
  /** Minimum hours before class start time that users can book. NULL = use branch default */
  booking_hours_before: number | null;
  branch_id: string;
  capacity: number;
  created_at: Date | null;
  duration_minutes: number;
  id: string;
  instructor: string | null;
  is_recurring: boolean | null;
  name: string;
  scheduled_at: Date;
  template_id: string | null;
  updated_at: Date | null;
  waitlist_capacity: number;
}

/** 'BulkUpdateTemplateClasses' query type */
export interface BulkUpdateTemplateClassesQuery {
  params: BulkUpdateTemplateClassesParams;
  result: BulkUpdateTemplateClassesResult;
}

const bulkUpdateTemplateClassesIR: any = {"usedParamSet":{"instructor":true,"capacity":true,"waitlistCapacity":true,"templateId":true,"branchId":true},"params":[{"name":"instructor","required":true,"transform":{"type":"scalar"},"locs":[{"a":34,"b":45}]},{"name":"capacity","required":true,"transform":{"type":"scalar"},"locs":[{"a":61,"b":70}]},{"name":"waitlistCapacity","required":true,"transform":{"type":"scalar"},"locs":[{"a":95,"b":112}]},{"name":"templateId","required":true,"transform":{"type":"scalar"},"locs":[{"a":134,"b":145}]},{"name":"branchId","required":true,"transform":{"type":"scalar"},"locs":[{"a":165,"b":174}]}],"statement":"UPDATE classes\nSET\n  instructor = :instructor!,\n  capacity = :capacity!,\n  waitlist_capacity = :waitlistCapacity!\nWHERE template_id = :templateId!\n  AND branch_id = :branchId!\n  AND scheduled_at >= CURRENT_TIMESTAMP\nRETURNING *"};

/**
 * Query generated from SQL:
 * ```
 * UPDATE classes
 * SET
 *   instructor = :instructor!,
 *   capacity = :capacity!,
 *   waitlist_capacity = :waitlistCapacity!
 * WHERE template_id = :templateId!
 *   AND branch_id = :branchId!
 *   AND scheduled_at >= CURRENT_TIMESTAMP
 * RETURNING *
 * ```
 */
export const bulkUpdateTemplateClasses = new PreparedQuery<BulkUpdateTemplateClassesParams,BulkUpdateTemplateClassesResult>(bulkUpdateTemplateClassesIR);


/** 'GetTemplateStats' parameters type */
export interface GetTemplateStatsParams {
  branchId: string;
}

/** 'GetTemplateStats' return type */
export interface GetTemplateStatsResult {
  avg_attendance_per_class: string | null;
  capacity: number;
  day_of_week: number;
  id: string;
  instructor: string | null;
  name: string;
  start_time: Date;
  total_bookings: string | null;
  total_classes_generated: string | null;
  utilization_rate: string | null;
}

/** 'GetTemplateStats' query type */
export interface GetTemplateStatsQuery {
  params: GetTemplateStatsParams;
  result: GetTemplateStatsResult;
}

const getTemplateStatsIR: any = {"usedParamSet":{"branchId":true},"params":[{"name":"branchId","required":true,"transform":{"type":"scalar"},"locs":[{"a":708,"b":717}]}],"statement":"SELECT\n  rct.id,\n  rct.name,\n  rct.instructor,\n  rct.day_of_week,\n  rct.start_time,\n  rct.capacity,\n  COUNT(DISTINCT c.id) as total_classes_generated,\n  COUNT(DISTINCT b.id) FILTER (WHERE b.status = 'confirmed') as total_bookings,\n  ROUND(\n    AVG(\n      (SELECT COUNT(*) FROM bookings WHERE class_id = c.id AND status = 'confirmed')::numeric\n    ),\n    2\n  ) as avg_attendance_per_class,\n  ROUND(\n    (COUNT(DISTINCT b.id) FILTER (WHERE b.status = 'confirmed')::numeric /\n     NULLIF(COUNT(DISTINCT c.id) * rct.capacity, 0)) * 100,\n    2\n  ) as utilization_rate\nFROM recurring_class_templates rct\nLEFT JOIN classes c ON rct.id = c.template_id\nLEFT JOIN bookings b ON c.id = b.class_id\nWHERE rct.branch_id = :branchId!\n  AND rct.is_active = true\nGROUP BY rct.id, rct.name, rct.instructor, rct.day_of_week, rct.start_time, rct.capacity\nORDER BY rct.day_of_week ASC, rct.start_time ASC"};

/**
 * Query generated from SQL:
 * ```
 * SELECT
 *   rct.id,
 *   rct.name,
 *   rct.instructor,
 *   rct.day_of_week,
 *   rct.start_time,
 *   rct.capacity,
 *   COUNT(DISTINCT c.id) as total_classes_generated,
 *   COUNT(DISTINCT b.id) FILTER (WHERE b.status = 'confirmed') as total_bookings,
 *   ROUND(
 *     AVG(
 *       (SELECT COUNT(*) FROM bookings WHERE class_id = c.id AND status = 'confirmed')::numeric
 *     ),
 *     2
 *   ) as avg_attendance_per_class,
 *   ROUND(
 *     (COUNT(DISTINCT b.id) FILTER (WHERE b.status = 'confirmed')::numeric /
 *      NULLIF(COUNT(DISTINCT c.id) * rct.capacity, 0)) * 100,
 *     2
 *   ) as utilization_rate
 * FROM recurring_class_templates rct
 * LEFT JOIN classes c ON rct.id = c.template_id
 * LEFT JOIN bookings b ON c.id = b.class_id
 * WHERE rct.branch_id = :branchId!
 *   AND rct.is_active = true
 * GROUP BY rct.id, rct.name, rct.instructor, rct.day_of_week, rct.start_time, rct.capacity
 * ORDER BY rct.day_of_week ASC, rct.start_time ASC
 * ```
 */
export const getTemplateStats = new PreparedQuery<GetTemplateStatsParams,GetTemplateStatsResult>(getTemplateStatsIR);


