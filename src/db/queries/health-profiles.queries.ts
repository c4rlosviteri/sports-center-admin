/** Types generated for queries found in "src/db/queries/health-profiles.sql" */
import { PreparedQuery } from '@pgtyped/runtime';

export type DateOrString = Date | string;

export type Json = null | boolean | number | string | Json[] | { [key: string]: Json };

export type NumberOrString = number | string;

export type stringArray = (string)[];

/** 'CreateHealthProfile' parameters type */
export interface CreateHealthProfileParams {
  allergies?: stringArray | null | void;
  branchId: string;
  currentInjuries?: Json | null | void;
  doctorName?: string | null | void;
  doctorPhone?: string | null | void;
  exerciseRestrictions?: string | null | void;
  fitnessGoals?: stringArray | null | void;
  fitnessLevel?: string | null | void;
  heightCm?: NumberOrString | null | void;
  liabilityWaiverDate?: DateOrString | null | void;
  liabilityWaiverSigned: boolean;
  medicalConditions?: Json | null | void;
  medicalReleaseDate?: DateOrString | null | void;
  medicalReleaseSigned: boolean;
  medications?: stringArray | null | void;
  notes?: string | null | void;
  previousInjuries?: Json | null | void;
  surgeryHistory?: Json | null | void;
  userId: string;
  weightKg?: NumberOrString | null | void;
}

/** 'CreateHealthProfile' return type */
export interface CreateHealthProfileResult {
  allergies: stringArray | null;
  branch_id: string;
  created_at: Date | null;
  current_injuries: Json | null;
  doctor_name: string | null;
  doctor_phone: string | null;
  exercise_restrictions: string | null;
  fitness_goals: stringArray | null;
  fitness_level: string | null;
  height_cm: string | null;
  id: string;
  liability_waiver_date: Date | null;
  liability_waiver_signed: boolean | null;
  medical_conditions: Json | null;
  medical_release_date: Date | null;
  medical_release_signed: boolean | null;
  medications: stringArray | null;
  notes: string | null;
  previous_injuries: Json | null;
  surgery_history: Json | null;
  updated_at: Date | null;
  user_id: string;
  weight_kg: string | null;
}

/** 'CreateHealthProfile' query type */
export interface CreateHealthProfileQuery {
  params: CreateHealthProfileParams;
  result: CreateHealthProfileResult;
}

const createHealthProfileIR: any = {"usedParamSet":{"userId":true,"branchId":true,"medicalConditions":true,"currentInjuries":true,"medications":true,"allergies":true,"fitnessLevel":true,"fitnessGoals":true,"exerciseRestrictions":true,"heightCm":true,"weightKg":true,"previousInjuries":true,"surgeryHistory":true,"medicalReleaseSigned":true,"medicalReleaseDate":true,"liabilityWaiverSigned":true,"liabilityWaiverDate":true,"doctorName":true,"doctorPhone":true,"notes":true},"params":[{"name":"userId","required":true,"transform":{"type":"scalar"},"locs":[{"a":410,"b":417}]},{"name":"branchId","required":true,"transform":{"type":"scalar"},"locs":[{"a":422,"b":431}]},{"name":"medicalConditions","required":false,"transform":{"type":"scalar"},"locs":[{"a":436,"b":453}]},{"name":"currentInjuries","required":false,"transform":{"type":"scalar"},"locs":[{"a":458,"b":473}]},{"name":"medications","required":false,"transform":{"type":"scalar"},"locs":[{"a":478,"b":489}]},{"name":"allergies","required":false,"transform":{"type":"scalar"},"locs":[{"a":494,"b":503}]},{"name":"fitnessLevel","required":false,"transform":{"type":"scalar"},"locs":[{"a":508,"b":520}]},{"name":"fitnessGoals","required":false,"transform":{"type":"scalar"},"locs":[{"a":525,"b":537}]},{"name":"exerciseRestrictions","required":false,"transform":{"type":"scalar"},"locs":[{"a":542,"b":562}]},{"name":"heightCm","required":false,"transform":{"type":"scalar"},"locs":[{"a":567,"b":575}]},{"name":"weightKg","required":false,"transform":{"type":"scalar"},"locs":[{"a":580,"b":588}]},{"name":"previousInjuries","required":false,"transform":{"type":"scalar"},"locs":[{"a":593,"b":609}]},{"name":"surgeryHistory","required":false,"transform":{"type":"scalar"},"locs":[{"a":614,"b":628}]},{"name":"medicalReleaseSigned","required":true,"transform":{"type":"scalar"},"locs":[{"a":633,"b":654}]},{"name":"medicalReleaseDate","required":false,"transform":{"type":"scalar"},"locs":[{"a":659,"b":677}]},{"name":"liabilityWaiverSigned","required":true,"transform":{"type":"scalar"},"locs":[{"a":682,"b":704}]},{"name":"liabilityWaiverDate","required":false,"transform":{"type":"scalar"},"locs":[{"a":709,"b":728}]},{"name":"doctorName","required":false,"transform":{"type":"scalar"},"locs":[{"a":733,"b":743}]},{"name":"doctorPhone","required":false,"transform":{"type":"scalar"},"locs":[{"a":748,"b":759}]},{"name":"notes","required":false,"transform":{"type":"scalar"},"locs":[{"a":764,"b":769}]}],"statement":"INSERT INTO client_health_profiles (\n  user_id,\n  branch_id,\n  medical_conditions,\n  current_injuries,\n  medications,\n  allergies,\n  fitness_level,\n  fitness_goals,\n  exercise_restrictions,\n  height_cm,\n  weight_kg,\n  previous_injuries,\n  surgery_history,\n  medical_release_signed,\n  medical_release_date,\n  liability_waiver_signed,\n  liability_waiver_date,\n  doctor_name,\n  doctor_phone,\n  notes\n) VALUES (\n  :userId!,\n  :branchId!,\n  :medicalConditions,\n  :currentInjuries,\n  :medications,\n  :allergies,\n  :fitnessLevel,\n  :fitnessGoals,\n  :exerciseRestrictions,\n  :heightCm,\n  :weightKg,\n  :previousInjuries,\n  :surgeryHistory,\n  :medicalReleaseSigned!,\n  :medicalReleaseDate,\n  :liabilityWaiverSigned!,\n  :liabilityWaiverDate,\n  :doctorName,\n  :doctorPhone,\n  :notes\n)\nON CONFLICT (user_id) DO UPDATE SET\n  medical_conditions = EXCLUDED.medical_conditions,\n  current_injuries = EXCLUDED.current_injuries,\n  medications = EXCLUDED.medications,\n  allergies = EXCLUDED.allergies,\n  fitness_level = EXCLUDED.fitness_level,\n  fitness_goals = EXCLUDED.fitness_goals,\n  exercise_restrictions = EXCLUDED.exercise_restrictions,\n  height_cm = EXCLUDED.height_cm,\n  weight_kg = EXCLUDED.weight_kg,\n  previous_injuries = EXCLUDED.previous_injuries,\n  surgery_history = EXCLUDED.surgery_history,\n  medical_release_signed = EXCLUDED.medical_release_signed,\n  medical_release_date = EXCLUDED.medical_release_date,\n  liability_waiver_signed = EXCLUDED.liability_waiver_signed,\n  liability_waiver_date = EXCLUDED.liability_waiver_date,\n  doctor_name = EXCLUDED.doctor_name,\n  doctor_phone = EXCLUDED.doctor_phone,\n  notes = EXCLUDED.notes,\n  updated_at = CURRENT_TIMESTAMP\nRETURNING *"};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO client_health_profiles (
 *   user_id,
 *   branch_id,
 *   medical_conditions,
 *   current_injuries,
 *   medications,
 *   allergies,
 *   fitness_level,
 *   fitness_goals,
 *   exercise_restrictions,
 *   height_cm,
 *   weight_kg,
 *   previous_injuries,
 *   surgery_history,
 *   medical_release_signed,
 *   medical_release_date,
 *   liability_waiver_signed,
 *   liability_waiver_date,
 *   doctor_name,
 *   doctor_phone,
 *   notes
 * ) VALUES (
 *   :userId!,
 *   :branchId!,
 *   :medicalConditions,
 *   :currentInjuries,
 *   :medications,
 *   :allergies,
 *   :fitnessLevel,
 *   :fitnessGoals,
 *   :exerciseRestrictions,
 *   :heightCm,
 *   :weightKg,
 *   :previousInjuries,
 *   :surgeryHistory,
 *   :medicalReleaseSigned!,
 *   :medicalReleaseDate,
 *   :liabilityWaiverSigned!,
 *   :liabilityWaiverDate,
 *   :doctorName,
 *   :doctorPhone,
 *   :notes
 * )
 * ON CONFLICT (user_id) DO UPDATE SET
 *   medical_conditions = EXCLUDED.medical_conditions,
 *   current_injuries = EXCLUDED.current_injuries,
 *   medications = EXCLUDED.medications,
 *   allergies = EXCLUDED.allergies,
 *   fitness_level = EXCLUDED.fitness_level,
 *   fitness_goals = EXCLUDED.fitness_goals,
 *   exercise_restrictions = EXCLUDED.exercise_restrictions,
 *   height_cm = EXCLUDED.height_cm,
 *   weight_kg = EXCLUDED.weight_kg,
 *   previous_injuries = EXCLUDED.previous_injuries,
 *   surgery_history = EXCLUDED.surgery_history,
 *   medical_release_signed = EXCLUDED.medical_release_signed,
 *   medical_release_date = EXCLUDED.medical_release_date,
 *   liability_waiver_signed = EXCLUDED.liability_waiver_signed,
 *   liability_waiver_date = EXCLUDED.liability_waiver_date,
 *   doctor_name = EXCLUDED.doctor_name,
 *   doctor_phone = EXCLUDED.doctor_phone,
 *   notes = EXCLUDED.notes,
 *   updated_at = CURRENT_TIMESTAMP
 * RETURNING *
 * ```
 */
export const createHealthProfile = new PreparedQuery<CreateHealthProfileParams,CreateHealthProfileResult>(createHealthProfileIR);


/** 'GetHealthProfile' parameters type */
export interface GetHealthProfileParams {
  branchId: string;
  userId: string;
}

/** 'GetHealthProfile' return type */
export interface GetHealthProfileResult {
  allergies: stringArray | null;
  branch_id: string;
  created_at: Date | null;
  current_injuries: Json | null;
  doctor_name: string | null;
  doctor_phone: string | null;
  exercise_restrictions: string | null;
  fitness_goals: stringArray | null;
  fitness_level: string | null;
  height_cm: string | null;
  id: string;
  liability_waiver_date: Date | null;
  liability_waiver_signed: boolean | null;
  medical_conditions: Json | null;
  medical_release_date: Date | null;
  medical_release_signed: boolean | null;
  medications: stringArray | null;
  notes: string | null;
  previous_injuries: Json | null;
  surgery_history: Json | null;
  updated_at: Date | null;
  user_id: string;
  weight_kg: string | null;
}

/** 'GetHealthProfile' query type */
export interface GetHealthProfileQuery {
  params: GetHealthProfileParams;
  result: GetHealthProfileResult;
}

const getHealthProfileIR: any = {"usedParamSet":{"userId":true,"branchId":true},"params":[{"name":"userId","required":true,"transform":{"type":"scalar"},"locs":[{"a":445,"b":452}]},{"name":"branchId","required":true,"transform":{"type":"scalar"},"locs":[{"a":472,"b":481}]}],"statement":"SELECT\n  id,\n  user_id,\n  branch_id,\n  medical_conditions,\n  current_injuries,\n  medications,\n  allergies,\n  fitness_level,\n  fitness_goals,\n  exercise_restrictions,\n  height_cm,\n  weight_kg,\n  previous_injuries,\n  surgery_history,\n  medical_release_signed,\n  medical_release_date,\n  liability_waiver_signed,\n  liability_waiver_date,\n  doctor_name,\n  doctor_phone,\n  notes,\n  created_at,\n  updated_at\nFROM client_health_profiles\nWHERE user_id = :userId!\n  AND branch_id = :branchId!"};

/**
 * Query generated from SQL:
 * ```
 * SELECT
 *   id,
 *   user_id,
 *   branch_id,
 *   medical_conditions,
 *   current_injuries,
 *   medications,
 *   allergies,
 *   fitness_level,
 *   fitness_goals,
 *   exercise_restrictions,
 *   height_cm,
 *   weight_kg,
 *   previous_injuries,
 *   surgery_history,
 *   medical_release_signed,
 *   medical_release_date,
 *   liability_waiver_signed,
 *   liability_waiver_date,
 *   doctor_name,
 *   doctor_phone,
 *   notes,
 *   created_at,
 *   updated_at
 * FROM client_health_profiles
 * WHERE user_id = :userId!
 *   AND branch_id = :branchId!
 * ```
 */
export const getHealthProfile = new PreparedQuery<GetHealthProfileParams,GetHealthProfileResult>(getHealthProfileIR);


/** 'GetHealthSummaryForInstructor' parameters type */
export interface GetHealthSummaryForInstructorParams {
  userId: string;
}

/** 'GetHealthSummaryForInstructor' return type */
export interface GetHealthSummaryForInstructorResult {
  emergency_contact_name: string | null;
  emergency_contact_phone: string | null;
  fitness_level: string | null;
  has_current_injuries: boolean | null;
  has_medical_conditions: boolean | null;
  medical_clearance: boolean | null;
  restrictions: string | null;
}

/** 'GetHealthSummaryForInstructor' query type */
export interface GetHealthSummaryForInstructorQuery {
  params: GetHealthSummaryForInstructorParams;
  result: GetHealthSummaryForInstructorResult;
}

const getHealthSummaryForInstructorIR: any = {"usedParamSet":{"userId":true},"params":[{"name":"userId","required":true,"transform":{"type":"scalar"},"locs":[{"a":194,"b":201}]}],"statement":"SELECT\n  has_medical_conditions,\n  has_current_injuries,\n  fitness_level,\n  restrictions,\n  medical_clearance,\n  emergency_contact_name,\n  emergency_contact_phone\nFROM get_client_health_summary(:userId!)"};

/**
 * Query generated from SQL:
 * ```
 * SELECT
 *   has_medical_conditions,
 *   has_current_injuries,
 *   fitness_level,
 *   restrictions,
 *   medical_clearance,
 *   emergency_contact_name,
 *   emergency_contact_phone
 * FROM get_client_health_summary(:userId!)
 * ```
 */
export const getHealthSummaryForInstructor = new PreparedQuery<GetHealthSummaryForInstructorParams,GetHealthSummaryForInstructorResult>(getHealthSummaryForInstructorIR);


/** 'CheckMedicalClearance' parameters type */
export interface CheckMedicalClearanceParams {
  userId: string;
}

/** 'CheckMedicalClearance' return type */
export interface CheckMedicalClearanceResult {
  has_clearance: boolean | null;
}

/** 'CheckMedicalClearance' query type */
export interface CheckMedicalClearanceQuery {
  params: CheckMedicalClearanceParams;
  result: CheckMedicalClearanceResult;
}

const checkMedicalClearanceIR: any = {"usedParamSet":{"userId":true},"params":[{"name":"userId","required":true,"transform":{"type":"scalar"},"locs":[{"a":29,"b":36}]}],"statement":"SELECT has_medical_clearance(:userId!) as has_clearance"};

/**
 * Query generated from SQL:
 * ```
 * SELECT has_medical_clearance(:userId!) as has_clearance
 * ```
 */
export const checkMedicalClearance = new PreparedQuery<CheckMedicalClearanceParams,CheckMedicalClearanceResult>(checkMedicalClearanceIR);


/** 'CreateEmergencyContact' parameters type */
export interface CreateEmergencyContactParams {
  branchId: string;
  contactName: string;
  email?: string | null | void;
  isPrimary: boolean;
  notes?: string | null | void;
  phonePrimary: string;
  phoneSecondary?: string | null | void;
  relationship?: string | null | void;
  userId: string;
}

/** 'CreateEmergencyContact' return type */
export interface CreateEmergencyContactResult {
  branch_id: string;
  contact_name: string;
  created_at: Date | null;
  email: string | null;
  id: string;
  is_primary: boolean | null;
  notes: string | null;
  phone_primary: string;
  phone_secondary: string | null;
  relationship: string | null;
  updated_at: Date | null;
  user_id: string;
}

/** 'CreateEmergencyContact' query type */
export interface CreateEmergencyContactQuery {
  params: CreateEmergencyContactParams;
  result: CreateEmergencyContactResult;
}

const createEmergencyContactIR: any = {"usedParamSet":{"userId":true,"branchId":true,"contactName":true,"relationship":true,"phonePrimary":true,"phoneSecondary":true,"email":true,"isPrimary":true,"notes":true},"params":[{"name":"userId","required":true,"transform":{"type":"scalar"},"locs":[{"a":169,"b":176}]},{"name":"branchId","required":true,"transform":{"type":"scalar"},"locs":[{"a":181,"b":190}]},{"name":"contactName","required":true,"transform":{"type":"scalar"},"locs":[{"a":195,"b":207}]},{"name":"relationship","required":false,"transform":{"type":"scalar"},"locs":[{"a":212,"b":224}]},{"name":"phonePrimary","required":true,"transform":{"type":"scalar"},"locs":[{"a":229,"b":242}]},{"name":"phoneSecondary","required":false,"transform":{"type":"scalar"},"locs":[{"a":247,"b":261}]},{"name":"email","required":false,"transform":{"type":"scalar"},"locs":[{"a":266,"b":271}]},{"name":"isPrimary","required":true,"transform":{"type":"scalar"},"locs":[{"a":276,"b":286}]},{"name":"notes","required":false,"transform":{"type":"scalar"},"locs":[{"a":291,"b":296}]}],"statement":"INSERT INTO emergency_contacts (\n  user_id,\n  branch_id,\n  contact_name,\n  relationship,\n  phone_primary,\n  phone_secondary,\n  email,\n  is_primary,\n  notes\n) VALUES (\n  :userId!,\n  :branchId!,\n  :contactName!,\n  :relationship,\n  :phonePrimary!,\n  :phoneSecondary,\n  :email,\n  :isPrimary!,\n  :notes\n)\nRETURNING *"};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO emergency_contacts (
 *   user_id,
 *   branch_id,
 *   contact_name,
 *   relationship,
 *   phone_primary,
 *   phone_secondary,
 *   email,
 *   is_primary,
 *   notes
 * ) VALUES (
 *   :userId!,
 *   :branchId!,
 *   :contactName!,
 *   :relationship,
 *   :phonePrimary!,
 *   :phoneSecondary,
 *   :email,
 *   :isPrimary!,
 *   :notes
 * )
 * RETURNING *
 * ```
 */
export const createEmergencyContact = new PreparedQuery<CreateEmergencyContactParams,CreateEmergencyContactResult>(createEmergencyContactIR);


/** 'GetEmergencyContacts' parameters type */
export interface GetEmergencyContactsParams {
  branchId: string;
  userId: string;
}

/** 'GetEmergencyContacts' return type */
export interface GetEmergencyContactsResult {
  branch_id: string;
  contact_name: string;
  created_at: Date | null;
  email: string | null;
  id: string;
  is_primary: boolean | null;
  notes: string | null;
  phone_primary: string;
  phone_secondary: string | null;
  relationship: string | null;
  updated_at: Date | null;
  user_id: string;
}

/** 'GetEmergencyContacts' query type */
export interface GetEmergencyContactsQuery {
  params: GetEmergencyContactsParams;
  result: GetEmergencyContactsResult;
}

const getEmergencyContactsIR: any = {"usedParamSet":{"userId":true,"branchId":true},"params":[{"name":"userId","required":true,"transform":{"type":"scalar"},"locs":[{"a":204,"b":211}]},{"name":"branchId","required":true,"transform":{"type":"scalar"},"locs":[{"a":231,"b":240}]}],"statement":"SELECT\n  id,\n  user_id,\n  branch_id,\n  contact_name,\n  relationship,\n  phone_primary,\n  phone_secondary,\n  email,\n  is_primary,\n  notes,\n  created_at,\n  updated_at\nFROM emergency_contacts\nWHERE user_id = :userId!\n  AND branch_id = :branchId!\nORDER BY is_primary DESC, created_at"};

/**
 * Query generated from SQL:
 * ```
 * SELECT
 *   id,
 *   user_id,
 *   branch_id,
 *   contact_name,
 *   relationship,
 *   phone_primary,
 *   phone_secondary,
 *   email,
 *   is_primary,
 *   notes,
 *   created_at,
 *   updated_at
 * FROM emergency_contacts
 * WHERE user_id = :userId!
 *   AND branch_id = :branchId!
 * ORDER BY is_primary DESC, created_at
 * ```
 */
export const getEmergencyContacts = new PreparedQuery<GetEmergencyContactsParams,GetEmergencyContactsResult>(getEmergencyContactsIR);


/** 'UpdateEmergencyContact' parameters type */
export interface UpdateEmergencyContactParams {
  branchId: string;
  contactId: string;
  contactName: string;
  email?: string | null | void;
  isPrimary: boolean;
  notes?: string | null | void;
  phonePrimary: string;
  phoneSecondary?: string | null | void;
  relationship?: string | null | void;
}

/** 'UpdateEmergencyContact' return type */
export interface UpdateEmergencyContactResult {
  branch_id: string;
  contact_name: string;
  created_at: Date | null;
  email: string | null;
  id: string;
  is_primary: boolean | null;
  notes: string | null;
  phone_primary: string;
  phone_secondary: string | null;
  relationship: string | null;
  updated_at: Date | null;
  user_id: string;
}

/** 'UpdateEmergencyContact' query type */
export interface UpdateEmergencyContactQuery {
  params: UpdateEmergencyContactParams;
  result: UpdateEmergencyContactResult;
}

const updateEmergencyContactIR: any = {"usedParamSet":{"contactName":true,"relationship":true,"phonePrimary":true,"phoneSecondary":true,"email":true,"isPrimary":true,"notes":true,"contactId":true,"branchId":true},"params":[{"name":"contactName","required":true,"transform":{"type":"scalar"},"locs":[{"a":47,"b":59}]},{"name":"relationship","required":false,"transform":{"type":"scalar"},"locs":[{"a":79,"b":91}]},{"name":"phonePrimary","required":true,"transform":{"type":"scalar"},"locs":[{"a":112,"b":125}]},{"name":"phoneSecondary","required":false,"transform":{"type":"scalar"},"locs":[{"a":148,"b":162}]},{"name":"email","required":false,"transform":{"type":"scalar"},"locs":[{"a":175,"b":180}]},{"name":"isPrimary","required":true,"transform":{"type":"scalar"},"locs":[{"a":198,"b":208}]},{"name":"notes","required":false,"transform":{"type":"scalar"},"locs":[{"a":221,"b":226}]},{"name":"contactId","required":true,"transform":{"type":"scalar"},"locs":[{"a":239,"b":249}]},{"name":"branchId","required":true,"transform":{"type":"scalar"},"locs":[{"a":269,"b":278}]}],"statement":"UPDATE emergency_contacts\nSET\n  contact_name = :contactName!,\n  relationship = :relationship,\n  phone_primary = :phonePrimary!,\n  phone_secondary = :phoneSecondary,\n  email = :email,\n  is_primary = :isPrimary!,\n  notes = :notes\nWHERE id = :contactId!\n  AND branch_id = :branchId!\nRETURNING *"};

/**
 * Query generated from SQL:
 * ```
 * UPDATE emergency_contacts
 * SET
 *   contact_name = :contactName!,
 *   relationship = :relationship,
 *   phone_primary = :phonePrimary!,
 *   phone_secondary = :phoneSecondary,
 *   email = :email,
 *   is_primary = :isPrimary!,
 *   notes = :notes
 * WHERE id = :contactId!
 *   AND branch_id = :branchId!
 * RETURNING *
 * ```
 */
export const updateEmergencyContact = new PreparedQuery<UpdateEmergencyContactParams,UpdateEmergencyContactResult>(updateEmergencyContactIR);


/** 'DeleteEmergencyContact' parameters type */
export interface DeleteEmergencyContactParams {
  branchId: string;
  contactId: string;
}

/** 'DeleteEmergencyContact' return type */
export interface DeleteEmergencyContactResult {
  branch_id: string;
  contact_name: string;
  created_at: Date | null;
  email: string | null;
  id: string;
  is_primary: boolean | null;
  notes: string | null;
  phone_primary: string;
  phone_secondary: string | null;
  relationship: string | null;
  updated_at: Date | null;
  user_id: string;
}

/** 'DeleteEmergencyContact' query type */
export interface DeleteEmergencyContactQuery {
  params: DeleteEmergencyContactParams;
  result: DeleteEmergencyContactResult;
}

const deleteEmergencyContactIR: any = {"usedParamSet":{"contactId":true,"branchId":true},"params":[{"name":"contactId","required":true,"transform":{"type":"scalar"},"locs":[{"a":42,"b":52}]},{"name":"branchId","required":true,"transform":{"type":"scalar"},"locs":[{"a":72,"b":81}]}],"statement":"DELETE FROM emergency_contacts\nWHERE id = :contactId!\n  AND branch_id = :branchId!\nRETURNING *"};

/**
 * Query generated from SQL:
 * ```
 * DELETE FROM emergency_contacts
 * WHERE id = :contactId!
 *   AND branch_id = :branchId!
 * RETURNING *
 * ```
 */
export const deleteEmergencyContact = new PreparedQuery<DeleteEmergencyContactParams,DeleteEmergencyContactResult>(deleteEmergencyContactIR);


/** 'SetPrimaryEmergencyContact' parameters type */
export interface SetPrimaryEmergencyContactParams {
  branchId: string;
  contactId: string;
  userId: string;
}

/** 'SetPrimaryEmergencyContact' return type */
export interface SetPrimaryEmergencyContactResult {
  branch_id: string;
  contact_name: string;
  created_at: Date | null;
  email: string | null;
  id: string;
  is_primary: boolean | null;
  notes: string | null;
  phone_primary: string;
  phone_secondary: string | null;
  relationship: string | null;
  updated_at: Date | null;
  user_id: string;
}

/** 'SetPrimaryEmergencyContact' query type */
export interface SetPrimaryEmergencyContactQuery {
  params: SetPrimaryEmergencyContactParams;
  result: SetPrimaryEmergencyContactResult;
}

const setPrimaryEmergencyContactIR: any = {"usedParamSet":{"contactId":true,"userId":true,"branchId":true},"params":[{"name":"contactId","required":true,"transform":{"type":"scalar"},"locs":[{"a":58,"b":68}]},{"name":"userId","required":true,"transform":{"type":"scalar"},"locs":[{"a":111,"b":118}]},{"name":"branchId","required":true,"transform":{"type":"scalar"},"locs":[{"a":138,"b":147}]}],"statement":"UPDATE emergency_contacts\nSET is_primary = CASE WHEN id = :contactId! THEN true ELSE false END\nWHERE user_id = :userId!\n  AND branch_id = :branchId!\nRETURNING *"};

/**
 * Query generated from SQL:
 * ```
 * UPDATE emergency_contacts
 * SET is_primary = CASE WHEN id = :contactId! THEN true ELSE false END
 * WHERE user_id = :userId!
 *   AND branch_id = :branchId!
 * RETURNING *
 * ```
 */
export const setPrimaryEmergencyContact = new PreparedQuery<SetPrimaryEmergencyContactParams,SetPrimaryEmergencyContactResult>(setPrimaryEmergencyContactIR);


/** 'CreateHealthAssessment' parameters type */
export interface CreateHealthAssessmentParams {
  assessmentDate: DateOrString;
  bloodPressureDiastolic?: number | null | void;
  bloodPressureSystolic?: number | null | void;
  bodyFatPercentage?: NumberOrString | null | void;
  branchId: string;
  conductedBy?: string | null | void;
  enduranceScore?: number | null | void;
  fitnessLevel?: string | null | void;
  flexibilityScore?: number | null | void;
  goalsSet?: Json | null | void;
  maxHeartRate?: number | null | void;
  muscleMassKg?: NumberOrString | null | void;
  notes?: string | null | void;
  previousAssessmentId?: string | null | void;
  recommendations?: string | null | void;
  restingHeartRate?: number | null | void;
  strengthScore?: number | null | void;
  userId: string;
  vo2Max?: NumberOrString | null | void;
  weightKg?: NumberOrString | null | void;
}

/** 'CreateHealthAssessment' return type */
export interface CreateHealthAssessmentResult {
  assessment_date: Date;
  blood_pressure_diastolic: number | null;
  blood_pressure_systolic: number | null;
  body_fat_percentage: string | null;
  branch_id: string;
  conducted_by: string | null;
  created_at: Date | null;
  endurance_score: number | null;
  fitness_level: string | null;
  flexibility_score: number | null;
  goals_set: Json | null;
  id: string;
  max_heart_rate: number | null;
  muscle_mass_kg: string | null;
  notes: string | null;
  previous_assessment_id: string | null;
  recommendations: string | null;
  resting_heart_rate: number | null;
  strength_score: number | null;
  user_id: string;
  vo2_max: string | null;
  weight_kg: string | null;
}

/** 'CreateHealthAssessment' query type */
export interface CreateHealthAssessmentQuery {
  params: CreateHealthAssessmentParams;
  result: CreateHealthAssessmentResult;
}

const createHealthAssessmentIR: any = {"usedParamSet":{"userId":true,"branchId":true,"assessmentDate":true,"conductedBy":true,"restingHeartRate":true,"bloodPressureSystolic":true,"bloodPressureDiastolic":true,"weightKg":true,"bodyFatPercentage":true,"muscleMassKg":true,"maxHeartRate":true,"vo2Max":true,"flexibilityScore":true,"strengthScore":true,"enduranceScore":true,"fitnessLevel":true,"recommendations":true,"goalsSet":true,"previousAssessmentId":true,"notes":true},"params":[{"name":"userId","required":true,"transform":{"type":"scalar"},"locs":[{"a":406,"b":413}]},{"name":"branchId","required":true,"transform":{"type":"scalar"},"locs":[{"a":418,"b":427}]},{"name":"assessmentDate","required":true,"transform":{"type":"scalar"},"locs":[{"a":432,"b":447}]},{"name":"conductedBy","required":false,"transform":{"type":"scalar"},"locs":[{"a":452,"b":463}]},{"name":"restingHeartRate","required":false,"transform":{"type":"scalar"},"locs":[{"a":468,"b":484}]},{"name":"bloodPressureSystolic","required":false,"transform":{"type":"scalar"},"locs":[{"a":489,"b":510}]},{"name":"bloodPressureDiastolic","required":false,"transform":{"type":"scalar"},"locs":[{"a":515,"b":537}]},{"name":"weightKg","required":false,"transform":{"type":"scalar"},"locs":[{"a":542,"b":550}]},{"name":"bodyFatPercentage","required":false,"transform":{"type":"scalar"},"locs":[{"a":555,"b":572}]},{"name":"muscleMassKg","required":false,"transform":{"type":"scalar"},"locs":[{"a":577,"b":589}]},{"name":"maxHeartRate","required":false,"transform":{"type":"scalar"},"locs":[{"a":594,"b":606}]},{"name":"vo2Max","required":false,"transform":{"type":"scalar"},"locs":[{"a":611,"b":617}]},{"name":"flexibilityScore","required":false,"transform":{"type":"scalar"},"locs":[{"a":622,"b":638}]},{"name":"strengthScore","required":false,"transform":{"type":"scalar"},"locs":[{"a":643,"b":656}]},{"name":"enduranceScore","required":false,"transform":{"type":"scalar"},"locs":[{"a":661,"b":675}]},{"name":"fitnessLevel","required":false,"transform":{"type":"scalar"},"locs":[{"a":680,"b":692}]},{"name":"recommendations","required":false,"transform":{"type":"scalar"},"locs":[{"a":697,"b":712}]},{"name":"goalsSet","required":false,"transform":{"type":"scalar"},"locs":[{"a":717,"b":725}]},{"name":"previousAssessmentId","required":false,"transform":{"type":"scalar"},"locs":[{"a":730,"b":750}]},{"name":"notes","required":false,"transform":{"type":"scalar"},"locs":[{"a":755,"b":760}]}],"statement":"INSERT INTO health_assessments (\n  user_id,\n  branch_id,\n  assessment_date,\n  conducted_by,\n  resting_heart_rate,\n  blood_pressure_systolic,\n  blood_pressure_diastolic,\n  weight_kg,\n  body_fat_percentage,\n  muscle_mass_kg,\n  max_heart_rate,\n  vo2_max,\n  flexibility_score,\n  strength_score,\n  endurance_score,\n  fitness_level,\n  recommendations,\n  goals_set,\n  previous_assessment_id,\n  notes\n) VALUES (\n  :userId!,\n  :branchId!,\n  :assessmentDate!,\n  :conductedBy,\n  :restingHeartRate,\n  :bloodPressureSystolic,\n  :bloodPressureDiastolic,\n  :weightKg,\n  :bodyFatPercentage,\n  :muscleMassKg,\n  :maxHeartRate,\n  :vo2Max,\n  :flexibilityScore,\n  :strengthScore,\n  :enduranceScore,\n  :fitnessLevel,\n  :recommendations,\n  :goalsSet,\n  :previousAssessmentId,\n  :notes\n)\nRETURNING *"};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO health_assessments (
 *   user_id,
 *   branch_id,
 *   assessment_date,
 *   conducted_by,
 *   resting_heart_rate,
 *   blood_pressure_systolic,
 *   blood_pressure_diastolic,
 *   weight_kg,
 *   body_fat_percentage,
 *   muscle_mass_kg,
 *   max_heart_rate,
 *   vo2_max,
 *   flexibility_score,
 *   strength_score,
 *   endurance_score,
 *   fitness_level,
 *   recommendations,
 *   goals_set,
 *   previous_assessment_id,
 *   notes
 * ) VALUES (
 *   :userId!,
 *   :branchId!,
 *   :assessmentDate!,
 *   :conductedBy,
 *   :restingHeartRate,
 *   :bloodPressureSystolic,
 *   :bloodPressureDiastolic,
 *   :weightKg,
 *   :bodyFatPercentage,
 *   :muscleMassKg,
 *   :maxHeartRate,
 *   :vo2Max,
 *   :flexibilityScore,
 *   :strengthScore,
 *   :enduranceScore,
 *   :fitnessLevel,
 *   :recommendations,
 *   :goalsSet,
 *   :previousAssessmentId,
 *   :notes
 * )
 * RETURNING *
 * ```
 */
export const createHealthAssessment = new PreparedQuery<CreateHealthAssessmentParams,CreateHealthAssessmentResult>(createHealthAssessmentIR);


/** 'GetHealthAssessments' parameters type */
export interface GetHealthAssessmentsParams {
  branchId: string;
  limit?: NumberOrString | null | void;
  userId: string;
}

/** 'GetHealthAssessments' return type */
export interface GetHealthAssessmentsResult {
  assessment_date: Date;
  blood_pressure_diastolic: number | null;
  blood_pressure_systolic: number | null;
  body_fat_percentage: string | null;
  branch_id: string;
  conducted_by: string | null;
  conducted_by_first_name: string | null;
  conducted_by_last_name: string | null;
  created_at: Date | null;
  endurance_score: number | null;
  fitness_level: string | null;
  flexibility_score: number | null;
  goals_set: Json | null;
  id: string;
  max_heart_rate: number | null;
  muscle_mass_kg: string | null;
  notes: string | null;
  previous_assessment_id: string | null;
  recommendations: string | null;
  resting_heart_rate: number | null;
  strength_score: number | null;
  user_id: string;
  vo2_max: string | null;
  weight_kg: string | null;
}

/** 'GetHealthAssessments' query type */
export interface GetHealthAssessmentsQuery {
  params: GetHealthAssessmentsParams;
  result: GetHealthAssessmentsResult;
}

const getHealthAssessmentsIR: any = {"usedParamSet":{"userId":true,"branchId":true,"limit":true},"params":[{"name":"userId","required":true,"transform":{"type":"scalar"},"locs":[{"a":189,"b":196}]},{"name":"branchId","required":true,"transform":{"type":"scalar"},"locs":[{"a":219,"b":228}]},{"name":"limit","required":false,"transform":{"type":"scalar"},"locs":[{"a":269,"b":274}]}],"statement":"SELECT\n  ha.*,\n  u.first_name as conducted_by_first_name,\n  u.last_name as conducted_by_last_name\nFROM health_assessments ha\nLEFT JOIN \"user\" u ON ha.conducted_by = u.id\nWHERE ha.user_id = :userId!\n  AND ha.branch_id = :branchId!\nORDER BY ha.assessment_date DESC\nLIMIT :limit"};

/**
 * Query generated from SQL:
 * ```
 * SELECT
 *   ha.*,
 *   u.first_name as conducted_by_first_name,
 *   u.last_name as conducted_by_last_name
 * FROM health_assessments ha
 * LEFT JOIN "user" u ON ha.conducted_by = u.id
 * WHERE ha.user_id = :userId!
 *   AND ha.branch_id = :branchId!
 * ORDER BY ha.assessment_date DESC
 * LIMIT :limit
 * ```
 */
export const getHealthAssessments = new PreparedQuery<GetHealthAssessmentsParams,GetHealthAssessmentsResult>(getHealthAssessmentsIR);


/** 'GetLatestHealthAssessment' parameters type */
export interface GetLatestHealthAssessmentParams {
  branchId: string;
  userId: string;
}

/** 'GetLatestHealthAssessment' return type */
export interface GetLatestHealthAssessmentResult {
  assessment_date: Date;
  blood_pressure_diastolic: number | null;
  blood_pressure_systolic: number | null;
  body_fat_percentage: string | null;
  branch_id: string;
  conducted_by: string | null;
  conducted_by_first_name: string | null;
  conducted_by_last_name: string | null;
  created_at: Date | null;
  endurance_score: number | null;
  fitness_level: string | null;
  flexibility_score: number | null;
  goals_set: Json | null;
  id: string;
  max_heart_rate: number | null;
  muscle_mass_kg: string | null;
  notes: string | null;
  previous_assessment_id: string | null;
  recommendations: string | null;
  resting_heart_rate: number | null;
  strength_score: number | null;
  user_id: string;
  vo2_max: string | null;
  weight_kg: string | null;
}

/** 'GetLatestHealthAssessment' query type */
export interface GetLatestHealthAssessmentQuery {
  params: GetLatestHealthAssessmentParams;
  result: GetLatestHealthAssessmentResult;
}

const getLatestHealthAssessmentIR: any = {"usedParamSet":{"userId":true,"branchId":true},"params":[{"name":"userId","required":true,"transform":{"type":"scalar"},"locs":[{"a":189,"b":196}]},{"name":"branchId","required":true,"transform":{"type":"scalar"},"locs":[{"a":219,"b":228}]}],"statement":"SELECT\n  ha.*,\n  u.first_name as conducted_by_first_name,\n  u.last_name as conducted_by_last_name\nFROM health_assessments ha\nLEFT JOIN \"user\" u ON ha.conducted_by = u.id\nWHERE ha.user_id = :userId!\n  AND ha.branch_id = :branchId!\nORDER BY ha.assessment_date DESC\nLIMIT 1"};

/**
 * Query generated from SQL:
 * ```
 * SELECT
 *   ha.*,
 *   u.first_name as conducted_by_first_name,
 *   u.last_name as conducted_by_last_name
 * FROM health_assessments ha
 * LEFT JOIN "user" u ON ha.conducted_by = u.id
 * WHERE ha.user_id = :userId!
 *   AND ha.branch_id = :branchId!
 * ORDER BY ha.assessment_date DESC
 * LIMIT 1
 * ```
 */
export const getLatestHealthAssessment = new PreparedQuery<GetLatestHealthAssessmentParams,GetLatestHealthAssessmentResult>(getLatestHealthAssessmentIR);


/** 'CreateInjuryReport' parameters type */
export interface CreateInjuryReportParams {
  activityAtTime?: string | null | void;
  branchId: string;
  classId?: string | null | void;
  description: string;
  emergencyServicesCalled: boolean;
  firstAidAdministered: boolean;
  firstAidDetails?: string | null | void;
  followUpNotes?: string | null | void;
  followUpRequired: boolean;
  hospitalVisit: boolean;
  incidentDate: DateOrString;
  injuryLocation?: string | null | void;
  injuryType: string;
  reportedBy: string;
  severity?: string | null | void;
  userId: string;
  witnesses?: Json | null | void;
}

/** 'CreateInjuryReport' return type */
export interface CreateInjuryReportResult {
  activity_at_time: string | null;
  branch_id: string;
  class_id: string | null;
  cleared_by: string | null;
  cleared_date: Date | null;
  cleared_to_return: boolean | null;
  created_at: Date | null;
  description: string;
  emergency_services_called: boolean | null;
  first_aid_administered: boolean | null;
  first_aid_details: string | null;
  follow_up_notes: string | null;
  follow_up_required: boolean | null;
  hospital_visit: boolean | null;
  id: string;
  incident_date: Date;
  injury_location: string | null;
  injury_type: string;
  reported_by: string;
  severity: string | null;
  updated_at: Date | null;
  user_id: string;
  witnesses: Json | null;
}

/** 'CreateInjuryReport' query type */
export interface CreateInjuryReportQuery {
  params: CreateInjuryReportParams;
  result: CreateInjuryReportResult;
}

const createInjuryReportIR: any = {"usedParamSet":{"userId":true,"branchId":true,"classId":true,"incidentDate":true,"injuryType":true,"injuryLocation":true,"severity":true,"description":true,"activityAtTime":true,"firstAidAdministered":true,"firstAidDetails":true,"emergencyServicesCalled":true,"hospitalVisit":true,"reportedBy":true,"witnesses":true,"followUpRequired":true,"followUpNotes":true},"params":[{"name":"userId","required":true,"transform":{"type":"scalar"},"locs":[{"a":338,"b":345}]},{"name":"branchId","required":true,"transform":{"type":"scalar"},"locs":[{"a":350,"b":359}]},{"name":"classId","required":false,"transform":{"type":"scalar"},"locs":[{"a":364,"b":371}]},{"name":"incidentDate","required":true,"transform":{"type":"scalar"},"locs":[{"a":376,"b":389}]},{"name":"injuryType","required":true,"transform":{"type":"scalar"},"locs":[{"a":394,"b":405}]},{"name":"injuryLocation","required":false,"transform":{"type":"scalar"},"locs":[{"a":410,"b":424}]},{"name":"severity","required":false,"transform":{"type":"scalar"},"locs":[{"a":429,"b":437}]},{"name":"description","required":true,"transform":{"type":"scalar"},"locs":[{"a":442,"b":454}]},{"name":"activityAtTime","required":false,"transform":{"type":"scalar"},"locs":[{"a":459,"b":473}]},{"name":"firstAidAdministered","required":true,"transform":{"type":"scalar"},"locs":[{"a":478,"b":499}]},{"name":"firstAidDetails","required":false,"transform":{"type":"scalar"},"locs":[{"a":504,"b":519}]},{"name":"emergencyServicesCalled","required":true,"transform":{"type":"scalar"},"locs":[{"a":524,"b":548}]},{"name":"hospitalVisit","required":true,"transform":{"type":"scalar"},"locs":[{"a":553,"b":567}]},{"name":"reportedBy","required":true,"transform":{"type":"scalar"},"locs":[{"a":572,"b":583}]},{"name":"witnesses","required":false,"transform":{"type":"scalar"},"locs":[{"a":588,"b":597}]},{"name":"followUpRequired","required":true,"transform":{"type":"scalar"},"locs":[{"a":602,"b":619}]},{"name":"followUpNotes","required":false,"transform":{"type":"scalar"},"locs":[{"a":624,"b":637}]}],"statement":"INSERT INTO injury_reports (\n  user_id,\n  branch_id,\n  class_id,\n  incident_date,\n  injury_type,\n  injury_location,\n  severity,\n  description,\n  activity_at_time,\n  first_aid_administered,\n  first_aid_details,\n  emergency_services_called,\n  hospital_visit,\n  reported_by,\n  witnesses,\n  follow_up_required,\n  follow_up_notes\n) VALUES (\n  :userId!,\n  :branchId!,\n  :classId,\n  :incidentDate!,\n  :injuryType!,\n  :injuryLocation,\n  :severity,\n  :description!,\n  :activityAtTime,\n  :firstAidAdministered!,\n  :firstAidDetails,\n  :emergencyServicesCalled!,\n  :hospitalVisit!,\n  :reportedBy!,\n  :witnesses,\n  :followUpRequired!,\n  :followUpNotes\n)\nRETURNING *"};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO injury_reports (
 *   user_id,
 *   branch_id,
 *   class_id,
 *   incident_date,
 *   injury_type,
 *   injury_location,
 *   severity,
 *   description,
 *   activity_at_time,
 *   first_aid_administered,
 *   first_aid_details,
 *   emergency_services_called,
 *   hospital_visit,
 *   reported_by,
 *   witnesses,
 *   follow_up_required,
 *   follow_up_notes
 * ) VALUES (
 *   :userId!,
 *   :branchId!,
 *   :classId,
 *   :incidentDate!,
 *   :injuryType!,
 *   :injuryLocation,
 *   :severity,
 *   :description!,
 *   :activityAtTime,
 *   :firstAidAdministered!,
 *   :firstAidDetails,
 *   :emergencyServicesCalled!,
 *   :hospitalVisit!,
 *   :reportedBy!,
 *   :witnesses,
 *   :followUpRequired!,
 *   :followUpNotes
 * )
 * RETURNING *
 * ```
 */
export const createInjuryReport = new PreparedQuery<CreateInjuryReportParams,CreateInjuryReportResult>(createInjuryReportIR);


/** 'GetInjuryReports' parameters type */
export interface GetInjuryReportsParams {
  branchId: string;
  limit?: NumberOrString | null | void;
  startDate: DateOrString;
}

/** 'GetInjuryReports' return type */
export interface GetInjuryReportsResult {
  activity_at_time: string | null;
  branch_id: string;
  class_date: Date;
  class_id: string | null;
  class_name: string;
  cleared_by: string | null;
  cleared_date: Date | null;
  cleared_to_return: boolean | null;
  created_at: Date | null;
  description: string;
  emergency_services_called: boolean | null;
  first_aid_administered: boolean | null;
  first_aid_details: string | null;
  follow_up_notes: string | null;
  follow_up_required: boolean | null;
  hospital_visit: boolean | null;
  id: string;
  incident_date: Date;
  injury_location: string | null;
  injury_type: string;
  reported_by: string;
  reported_by_first_name: string | null;
  reported_by_last_name: string | null;
  severity: string | null;
  updated_at: Date | null;
  user_id: string;
  witnesses: Json | null;
}

/** 'GetInjuryReports' query type */
export interface GetInjuryReportsQuery {
  params: GetInjuryReportsParams;
  result: GetInjuryReportsResult;
}

const getInjuryReportsIR: any = {"usedParamSet":{"branchId":true,"startDate":true,"limit":true},"params":[{"name":"branchId","required":true,"transform":{"type":"scalar"},"locs":[{"a":277,"b":286}]},{"name":"startDate","required":true,"transform":{"type":"scalar"},"locs":[{"a":314,"b":324}]},{"name":"limit","required":false,"transform":{"type":"scalar"},"locs":[{"a":363,"b":368}]}],"statement":"SELECT\n  ir.*,\n  u.first_name as reported_by_first_name,\n  u.last_name as reported_by_last_name,\n  c.scheduled_at as class_date,\n  c.name as class_name\nFROM injury_reports ir\nJOIN \"user\" u ON ir.reported_by = u.id\nLEFT JOIN classes c ON ir.class_id = c.id\nWHERE ir.branch_id = :branchId!\n  AND ir.incident_date >= :startDate!\nORDER BY ir.incident_date DESC\nLIMIT :limit"};

/**
 * Query generated from SQL:
 * ```
 * SELECT
 *   ir.*,
 *   u.first_name as reported_by_first_name,
 *   u.last_name as reported_by_last_name,
 *   c.scheduled_at as class_date,
 *   c.name as class_name
 * FROM injury_reports ir
 * JOIN "user" u ON ir.reported_by = u.id
 * LEFT JOIN classes c ON ir.class_id = c.id
 * WHERE ir.branch_id = :branchId!
 *   AND ir.incident_date >= :startDate!
 * ORDER BY ir.incident_date DESC
 * LIMIT :limit
 * ```
 */
export const getInjuryReports = new PreparedQuery<GetInjuryReportsParams,GetInjuryReportsResult>(getInjuryReportsIR);


/** 'GetUserInjuryReports' parameters type */
export interface GetUserInjuryReportsParams {
  branchId: string;
  userId: string;
}

/** 'GetUserInjuryReports' return type */
export interface GetUserInjuryReportsResult {
  activity_at_time: string | null;
  branch_id: string;
  class_date: Date;
  class_id: string | null;
  class_name: string;
  cleared_by: string | null;
  cleared_date: Date | null;
  cleared_to_return: boolean | null;
  created_at: Date | null;
  description: string;
  emergency_services_called: boolean | null;
  first_aid_administered: boolean | null;
  first_aid_details: string | null;
  follow_up_notes: string | null;
  follow_up_required: boolean | null;
  hospital_visit: boolean | null;
  id: string;
  incident_date: Date;
  injury_location: string | null;
  injury_type: string;
  reported_by: string;
  reported_by_first_name: string | null;
  reported_by_last_name: string | null;
  severity: string | null;
  updated_at: Date | null;
  user_id: string;
  witnesses: Json | null;
}

/** 'GetUserInjuryReports' query type */
export interface GetUserInjuryReportsQuery {
  params: GetUserInjuryReportsParams;
  result: GetUserInjuryReportsResult;
}

const getUserInjuryReportsIR: any = {"usedParamSet":{"userId":true,"branchId":true},"params":[{"name":"userId","required":true,"transform":{"type":"scalar"},"locs":[{"a":275,"b":282}]},{"name":"branchId","required":true,"transform":{"type":"scalar"},"locs":[{"a":305,"b":314}]}],"statement":"SELECT\n  ir.*,\n  u.first_name as reported_by_first_name,\n  u.last_name as reported_by_last_name,\n  c.scheduled_at as class_date,\n  c.name as class_name\nFROM injury_reports ir\nJOIN \"user\" u ON ir.reported_by = u.id\nLEFT JOIN classes c ON ir.class_id = c.id\nWHERE ir.user_id = :userId!\n  AND ir.branch_id = :branchId!\nORDER BY ir.incident_date DESC"};

/**
 * Query generated from SQL:
 * ```
 * SELECT
 *   ir.*,
 *   u.first_name as reported_by_first_name,
 *   u.last_name as reported_by_last_name,
 *   c.scheduled_at as class_date,
 *   c.name as class_name
 * FROM injury_reports ir
 * JOIN "user" u ON ir.reported_by = u.id
 * LEFT JOIN classes c ON ir.class_id = c.id
 * WHERE ir.user_id = :userId!
 *   AND ir.branch_id = :branchId!
 * ORDER BY ir.incident_date DESC
 * ```
 */
export const getUserInjuryReports = new PreparedQuery<GetUserInjuryReportsParams,GetUserInjuryReportsResult>(getUserInjuryReportsIR);


/** 'UpdateInjuryReport' parameters type */
export interface UpdateInjuryReportParams {
  branchId: string;
  clearedBy?: string | null | void;
  clearedDate?: DateOrString | null | void;
  clearedToReturn: boolean;
  followUpNotes?: string | null | void;
  followUpRequired: boolean;
  reportId: string;
}

/** 'UpdateInjuryReport' return type */
export interface UpdateInjuryReportResult {
  activity_at_time: string | null;
  branch_id: string;
  class_id: string | null;
  cleared_by: string | null;
  cleared_date: Date | null;
  cleared_to_return: boolean | null;
  created_at: Date | null;
  description: string;
  emergency_services_called: boolean | null;
  first_aid_administered: boolean | null;
  first_aid_details: string | null;
  follow_up_notes: string | null;
  follow_up_required: boolean | null;
  hospital_visit: boolean | null;
  id: string;
  incident_date: Date;
  injury_location: string | null;
  injury_type: string;
  reported_by: string;
  severity: string | null;
  updated_at: Date | null;
  user_id: string;
  witnesses: Json | null;
}

/** 'UpdateInjuryReport' query type */
export interface UpdateInjuryReportQuery {
  params: UpdateInjuryReportParams;
  result: UpdateInjuryReportResult;
}

const updateInjuryReportIR: any = {"usedParamSet":{"followUpRequired":true,"followUpNotes":true,"clearedToReturn":true,"clearedDate":true,"clearedBy":true,"reportId":true,"branchId":true},"params":[{"name":"followUpRequired","required":true,"transform":{"type":"scalar"},"locs":[{"a":49,"b":66}]},{"name":"followUpNotes","required":false,"transform":{"type":"scalar"},"locs":[{"a":89,"b":102}]},{"name":"clearedToReturn","required":true,"transform":{"type":"scalar"},"locs":[{"a":127,"b":143}]},{"name":"clearedDate","required":false,"transform":{"type":"scalar"},"locs":[{"a":163,"b":174}]},{"name":"clearedBy","required":false,"transform":{"type":"scalar"},"locs":[{"a":192,"b":201}]},{"name":"reportId","required":true,"transform":{"type":"scalar"},"locs":[{"a":214,"b":223}]},{"name":"branchId","required":true,"transform":{"type":"scalar"},"locs":[{"a":243,"b":252}]}],"statement":"UPDATE injury_reports\nSET\n  follow_up_required = :followUpRequired!,\n  follow_up_notes = :followUpNotes,\n  cleared_to_return = :clearedToReturn!,\n  cleared_date = :clearedDate,\n  cleared_by = :clearedBy\nWHERE id = :reportId!\n  AND branch_id = :branchId!\nRETURNING *"};

/**
 * Query generated from SQL:
 * ```
 * UPDATE injury_reports
 * SET
 *   follow_up_required = :followUpRequired!,
 *   follow_up_notes = :followUpNotes,
 *   cleared_to_return = :clearedToReturn!,
 *   cleared_date = :clearedDate,
 *   cleared_by = :clearedBy
 * WHERE id = :reportId!
 *   AND branch_id = :branchId!
 * RETURNING *
 * ```
 */
export const updateInjuryReport = new PreparedQuery<UpdateInjuryReportParams,UpdateInjuryReportResult>(updateInjuryReportIR);


/** 'CreateParqQuestionnaire' parameters type */
export interface CreateParqQuestionnaireParams {
  bloodPressureMedication: boolean;
  boneJointProblem: boolean;
  branchId: string;
  chestPainActivity: boolean;
  chestPainRest: boolean;
  clientSignatureData?: string | null | void;
  dizzinessBalance: boolean;
  heartCondition: boolean;
  otherReason: boolean;
  otherReasonDetails?: string | null | void;
  physicianApprovalDate?: DateOrString | null | void;
  physicianApprovalReceived: boolean;
  physicianApprovalRequired: boolean;
  staffSignatureData?: string | null | void;
  submissionDate: DateOrString;
  userId: string;
}

/** 'CreateParqQuestionnaire' return type */
export interface CreateParqQuestionnaireResult {
  blood_pressure_medication: boolean | null;
  bone_joint_problem: boolean | null;
  branch_id: string;
  chest_pain_activity: boolean | null;
  chest_pain_rest: boolean | null;
  client_signature_data: string | null;
  created_at: Date | null;
  dizziness_balance: boolean | null;
  heart_condition: boolean | null;
  id: string;
  other_reason: boolean | null;
  other_reason_details: string | null;
  physician_approval_date: Date | null;
  physician_approval_received: boolean | null;
  physician_approval_required: boolean | null;
  staff_signature_data: string | null;
  submission_date: Date;
  user_id: string;
}

/** 'CreateParqQuestionnaire' query type */
export interface CreateParqQuestionnaireQuery {
  params: CreateParqQuestionnaireParams;
  result: CreateParqQuestionnaireResult;
}

const createParqQuestionnaireIR: any = {"usedParamSet":{"userId":true,"branchId":true,"submissionDate":true,"heartCondition":true,"chestPainActivity":true,"chestPainRest":true,"dizzinessBalance":true,"boneJointProblem":true,"bloodPressureMedication":true,"otherReason":true,"otherReasonDetails":true,"physicianApprovalRequired":true,"physicianApprovalReceived":true,"physicianApprovalDate":true,"clientSignatureData":true,"staffSignatureData":true},"params":[{"name":"userId","required":true,"transform":{"type":"scalar"},"locs":[{"a":400,"b":407}]},{"name":"branchId","required":true,"transform":{"type":"scalar"},"locs":[{"a":412,"b":421}]},{"name":"submissionDate","required":true,"transform":{"type":"scalar"},"locs":[{"a":426,"b":441}]},{"name":"heartCondition","required":true,"transform":{"type":"scalar"},"locs":[{"a":446,"b":461}]},{"name":"chestPainActivity","required":true,"transform":{"type":"scalar"},"locs":[{"a":466,"b":484}]},{"name":"chestPainRest","required":true,"transform":{"type":"scalar"},"locs":[{"a":489,"b":503}]},{"name":"dizzinessBalance","required":true,"transform":{"type":"scalar"},"locs":[{"a":508,"b":525}]},{"name":"boneJointProblem","required":true,"transform":{"type":"scalar"},"locs":[{"a":530,"b":547}]},{"name":"bloodPressureMedication","required":true,"transform":{"type":"scalar"},"locs":[{"a":552,"b":576}]},{"name":"otherReason","required":true,"transform":{"type":"scalar"},"locs":[{"a":581,"b":593}]},{"name":"otherReasonDetails","required":false,"transform":{"type":"scalar"},"locs":[{"a":598,"b":616}]},{"name":"physicianApprovalRequired","required":true,"transform":{"type":"scalar"},"locs":[{"a":621,"b":647}]},{"name":"physicianApprovalReceived","required":true,"transform":{"type":"scalar"},"locs":[{"a":652,"b":678}]},{"name":"physicianApprovalDate","required":false,"transform":{"type":"scalar"},"locs":[{"a":683,"b":704}]},{"name":"clientSignatureData","required":false,"transform":{"type":"scalar"},"locs":[{"a":709,"b":728}]},{"name":"staffSignatureData","required":false,"transform":{"type":"scalar"},"locs":[{"a":733,"b":751}]}],"statement":"INSERT INTO parq_questionnaires (\n  user_id,\n  branch_id,\n  submission_date,\n  heart_condition,\n  chest_pain_activity,\n  chest_pain_rest,\n  dizziness_balance,\n  bone_joint_problem,\n  blood_pressure_medication,\n  other_reason,\n  other_reason_details,\n  physician_approval_required,\n  physician_approval_received,\n  physician_approval_date,\n  client_signature_data,\n  staff_signature_data\n) VALUES (\n  :userId!,\n  :branchId!,\n  :submissionDate!,\n  :heartCondition!,\n  :chestPainActivity!,\n  :chestPainRest!,\n  :dizzinessBalance!,\n  :boneJointProblem!,\n  :bloodPressureMedication!,\n  :otherReason!,\n  :otherReasonDetails,\n  :physicianApprovalRequired!,\n  :physicianApprovalReceived!,\n  :physicianApprovalDate,\n  :clientSignatureData,\n  :staffSignatureData\n)\nRETURNING *"};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO parq_questionnaires (
 *   user_id,
 *   branch_id,
 *   submission_date,
 *   heart_condition,
 *   chest_pain_activity,
 *   chest_pain_rest,
 *   dizziness_balance,
 *   bone_joint_problem,
 *   blood_pressure_medication,
 *   other_reason,
 *   other_reason_details,
 *   physician_approval_required,
 *   physician_approval_received,
 *   physician_approval_date,
 *   client_signature_data,
 *   staff_signature_data
 * ) VALUES (
 *   :userId!,
 *   :branchId!,
 *   :submissionDate!,
 *   :heartCondition!,
 *   :chestPainActivity!,
 *   :chestPainRest!,
 *   :dizzinessBalance!,
 *   :boneJointProblem!,
 *   :bloodPressureMedication!,
 *   :otherReason!,
 *   :otherReasonDetails,
 *   :physicianApprovalRequired!,
 *   :physicianApprovalReceived!,
 *   :physicianApprovalDate,
 *   :clientSignatureData,
 *   :staffSignatureData
 * )
 * RETURNING *
 * ```
 */
export const createParqQuestionnaire = new PreparedQuery<CreateParqQuestionnaireParams,CreateParqQuestionnaireResult>(createParqQuestionnaireIR);


/** 'GetLatestParq' parameters type */
export interface GetLatestParqParams {
  branchId: string;
  userId: string;
}

/** 'GetLatestParq' return type */
export interface GetLatestParqResult {
  blood_pressure_medication: boolean | null;
  bone_joint_problem: boolean | null;
  branch_id: string;
  chest_pain_activity: boolean | null;
  chest_pain_rest: boolean | null;
  client_signature_data: string | null;
  created_at: Date | null;
  dizziness_balance: boolean | null;
  heart_condition: boolean | null;
  id: string;
  other_reason: boolean | null;
  other_reason_details: string | null;
  physician_approval_date: Date | null;
  physician_approval_received: boolean | null;
  physician_approval_required: boolean | null;
  staff_signature_data: string | null;
  submission_date: Date;
  user_id: string;
}

/** 'GetLatestParq' query type */
export interface GetLatestParqQuery {
  params: GetLatestParqParams;
  result: GetLatestParqResult;
}

const getLatestParqIR: any = {"usedParamSet":{"userId":true,"branchId":true},"params":[{"name":"userId","required":true,"transform":{"type":"scalar"},"locs":[{"a":421,"b":428}]},{"name":"branchId","required":true,"transform":{"type":"scalar"},"locs":[{"a":448,"b":457}]}],"statement":"SELECT\n  id,\n  user_id,\n  branch_id,\n  submission_date,\n  heart_condition,\n  chest_pain_activity,\n  chest_pain_rest,\n  dizziness_balance,\n  bone_joint_problem,\n  blood_pressure_medication,\n  other_reason,\n  other_reason_details,\n  physician_approval_required,\n  physician_approval_received,\n  physician_approval_date,\n  client_signature_data,\n  staff_signature_data,\n  created_at\nFROM parq_questionnaires\nWHERE user_id = :userId!\n  AND branch_id = :branchId!\nORDER BY submission_date DESC\nLIMIT 1"};

/**
 * Query generated from SQL:
 * ```
 * SELECT
 *   id,
 *   user_id,
 *   branch_id,
 *   submission_date,
 *   heart_condition,
 *   chest_pain_activity,
 *   chest_pain_rest,
 *   dizziness_balance,
 *   bone_joint_problem,
 *   blood_pressure_medication,
 *   other_reason,
 *   other_reason_details,
 *   physician_approval_required,
 *   physician_approval_received,
 *   physician_approval_date,
 *   client_signature_data,
 *   staff_signature_data,
 *   created_at
 * FROM parq_questionnaires
 * WHERE user_id = :userId!
 *   AND branch_id = :branchId!
 * ORDER BY submission_date DESC
 * LIMIT 1
 * ```
 */
export const getLatestParq = new PreparedQuery<GetLatestParqParams,GetLatestParqResult>(getLatestParqIR);


/** 'UpdateParqApproval' parameters type */
export interface UpdateParqApprovalParams {
  branchId: string;
  parqId: string;
  physicianApprovalDate?: DateOrString | null | void;
  physicianApprovalReceived: boolean;
}

/** 'UpdateParqApproval' return type */
export interface UpdateParqApprovalResult {
  blood_pressure_medication: boolean | null;
  bone_joint_problem: boolean | null;
  branch_id: string;
  chest_pain_activity: boolean | null;
  chest_pain_rest: boolean | null;
  client_signature_data: string | null;
  created_at: Date | null;
  dizziness_balance: boolean | null;
  heart_condition: boolean | null;
  id: string;
  other_reason: boolean | null;
  other_reason_details: string | null;
  physician_approval_date: Date | null;
  physician_approval_received: boolean | null;
  physician_approval_required: boolean | null;
  staff_signature_data: string | null;
  submission_date: Date;
  user_id: string;
}

/** 'UpdateParqApproval' query type */
export interface UpdateParqApprovalQuery {
  params: UpdateParqApprovalParams;
  result: UpdateParqApprovalResult;
}

const updateParqApprovalIR: any = {"usedParamSet":{"physicianApprovalReceived":true,"physicianApprovalDate":true,"parqId":true,"branchId":true},"params":[{"name":"physicianApprovalReceived","required":true,"transform":{"type":"scalar"},"locs":[{"a":63,"b":89}]},{"name":"physicianApprovalDate","required":false,"transform":{"type":"scalar"},"locs":[{"a":120,"b":141}]},{"name":"parqId","required":true,"transform":{"type":"scalar"},"locs":[{"a":154,"b":161}]},{"name":"branchId","required":true,"transform":{"type":"scalar"},"locs":[{"a":181,"b":190}]}],"statement":"UPDATE parq_questionnaires\nSET\n  physician_approval_received = :physicianApprovalReceived!,\n  physician_approval_date = :physicianApprovalDate\nWHERE id = :parqId!\n  AND branch_id = :branchId!\nRETURNING *"};

/**
 * Query generated from SQL:
 * ```
 * UPDATE parq_questionnaires
 * SET
 *   physician_approval_received = :physicianApprovalReceived!,
 *   physician_approval_date = :physicianApprovalDate
 * WHERE id = :parqId!
 *   AND branch_id = :branchId!
 * RETURNING *
 * ```
 */
export const updateParqApproval = new PreparedQuery<UpdateParqApprovalParams,UpdateParqApprovalResult>(updateParqApprovalIR);


/** 'GetClientsRequiringMedicalClearance' parameters type */
export interface GetClientsRequiringMedicalClearanceParams {
  branchId: string;
}

/** 'GetClientsRequiringMedicalClearance' return type */
export interface GetClientsRequiringMedicalClearanceResult {
  email: string;
  first_name: string | null;
  last_name: string | null;
  liability_waiver_signed: boolean | null;
  medical_release_signed: boolean | null;
  physician_approval_received: boolean | null;
  physician_approval_required: boolean | null;
  user_id: string;
}

/** 'GetClientsRequiringMedicalClearance' query type */
export interface GetClientsRequiringMedicalClearanceQuery {
  params: GetClientsRequiringMedicalClearanceParams;
  result: GetClientsRequiringMedicalClearanceResult;
}

const getClientsRequiringMedicalClearanceIR: any = {"usedParamSet":{"branchId":true},"params":[{"name":"branchId","required":true,"transform":{"type":"scalar"},"locs":[{"a":488,"b":497}]}],"statement":"SELECT\n  u.id as user_id,\n  u.first_name,\n  u.last_name,\n  u.email,\n  chp.medical_release_signed,\n  chp.liability_waiver_signed,\n  pq.physician_approval_required,\n  pq.physician_approval_received\nFROM \"user\" u\nLEFT JOIN client_health_profiles chp ON u.id = chp.user_id\nLEFT JOIN LATERAL (\n  SELECT\n    physician_approval_required,\n    physician_approval_received\n  FROM parq_questionnaires\n  WHERE user_id = u.id\n  ORDER BY submission_date DESC\n  LIMIT 1\n) pq ON true\nWHERE u.branch_id = :branchId!\n  AND u.role = 'client'\n  AND (\n    chp.medical_release_signed = false\n    OR chp.liability_waiver_signed = false\n    OR (pq.physician_approval_required = true AND pq.physician_approval_received = false)\n  )\nORDER BY u.\"createdAt\" DESC"};

/**
 * Query generated from SQL:
 * ```
 * SELECT
 *   u.id as user_id,
 *   u.first_name,
 *   u.last_name,
 *   u.email,
 *   chp.medical_release_signed,
 *   chp.liability_waiver_signed,
 *   pq.physician_approval_required,
 *   pq.physician_approval_received
 * FROM "user" u
 * LEFT JOIN client_health_profiles chp ON u.id = chp.user_id
 * LEFT JOIN LATERAL (
 *   SELECT
 *     physician_approval_required,
 *     physician_approval_received
 *   FROM parq_questionnaires
 *   WHERE user_id = u.id
 *   ORDER BY submission_date DESC
 *   LIMIT 1
 * ) pq ON true
 * WHERE u.branch_id = :branchId!
 *   AND u.role = 'client'
 *   AND (
 *     chp.medical_release_signed = false
 *     OR chp.liability_waiver_signed = false
 *     OR (pq.physician_approval_required = true AND pq.physician_approval_received = false)
 *   )
 * ORDER BY u."createdAt" DESC
 * ```
 */
export const getClientsRequiringMedicalClearance = new PreparedQuery<GetClientsRequiringMedicalClearanceParams,GetClientsRequiringMedicalClearanceResult>(getClientsRequiringMedicalClearanceIR);


