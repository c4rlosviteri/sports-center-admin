/** Types generated for queries found in "src/db/queries/equipment.sql" */
import { PreparedQuery } from '@pgtyped/runtime';

export type DateOrString = Date | string;

export type Json = null | boolean | number | string | Json[] | { [key: string]: Json };

export type NumberOrString = number | string;

export type stringArray = (string)[];

/** 'CreateEquipmentType' parameters type */
export interface CreateEquipmentTypeParams {
  branchId: string;
  description?: string | null | void;
  icon?: string | null | void;
  name: string;
  requiresAssignment: boolean;
}

/** 'CreateEquipmentType' return type */
export interface CreateEquipmentTypeResult {
  branch_id: string;
  created_at: Date | null;
  description: string | null;
  icon: string | null;
  id: string;
  name: string;
  requires_assignment: boolean | null;
}

/** 'CreateEquipmentType' query type */
export interface CreateEquipmentTypeQuery {
  params: CreateEquipmentTypeParams;
  result: CreateEquipmentTypeResult;
}

const createEquipmentTypeIR: any = {"usedParamSet":{"branchId":true,"name":true,"description":true,"icon":true,"requiresAssignment":true},"params":[{"name":"branchId","required":true,"transform":{"type":"scalar"},"locs":[{"a":109,"b":118}]},{"name":"name","required":true,"transform":{"type":"scalar"},"locs":[{"a":123,"b":128}]},{"name":"description","required":false,"transform":{"type":"scalar"},"locs":[{"a":133,"b":144}]},{"name":"icon","required":false,"transform":{"type":"scalar"},"locs":[{"a":149,"b":153}]},{"name":"requiresAssignment","required":true,"transform":{"type":"scalar"},"locs":[{"a":158,"b":177}]}],"statement":"INSERT INTO equipment_types (\n  branch_id,\n  name,\n  description,\n  icon,\n  requires_assignment\n) VALUES (\n  :branchId!,\n  :name!,\n  :description,\n  :icon,\n  :requiresAssignment!\n)\nRETURNING *"};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO equipment_types (
 *   branch_id,
 *   name,
 *   description,
 *   icon,
 *   requires_assignment
 * ) VALUES (
 *   :branchId!,
 *   :name!,
 *   :description,
 *   :icon,
 *   :requiresAssignment!
 * )
 * RETURNING *
 * ```
 */
export const createEquipmentType = new PreparedQuery<CreateEquipmentTypeParams,CreateEquipmentTypeResult>(createEquipmentTypeIR);


/** 'GetEquipmentTypes' parameters type */
export interface GetEquipmentTypesParams {
  branchId: string;
}

/** 'GetEquipmentTypes' return type */
export interface GetEquipmentTypesResult {
  branch_id: string;
  created_at: Date | null;
  description: string | null;
  icon: string | null;
  id: string;
  name: string;
  requires_assignment: boolean | null;
}

/** 'GetEquipmentTypes' query type */
export interface GetEquipmentTypesQuery {
  params: GetEquipmentTypesParams;
  result: GetEquipmentTypesResult;
}

const getEquipmentTypesIR: any = {"usedParamSet":{"branchId":true},"params":[{"name":"branchId","required":true,"transform":{"type":"scalar"},"locs":[{"a":132,"b":141}]}],"statement":"SELECT\n  id,\n  branch_id,\n  name,\n  description,\n  icon,\n  requires_assignment,\n  created_at\nFROM equipment_types\nWHERE branch_id = :branchId!\nORDER BY name"};

/**
 * Query generated from SQL:
 * ```
 * SELECT
 *   id,
 *   branch_id,
 *   name,
 *   description,
 *   icon,
 *   requires_assignment,
 *   created_at
 * FROM equipment_types
 * WHERE branch_id = :branchId!
 * ORDER BY name
 * ```
 */
export const getEquipmentTypes = new PreparedQuery<GetEquipmentTypesParams,GetEquipmentTypesResult>(getEquipmentTypesIR);


/** 'CreateEquipment' parameters type */
export interface CreateEquipmentParams {
  branchId: string;
  condition?: string | null | void;
  equipmentNumber: string;
  equipmentTypeId: string;
  features?: stringArray | null | void;
  internalNotes?: string | null | void;
  location?: string | null | void;
  maintenanceIntervalDays?: number | null | void;
  manufacturer?: string | null | void;
  model?: string | null | void;
  name?: string | null | void;
  notes?: string | null | void;
  purchaseDate?: DateOrString | null | void;
  purchasePrice?: NumberOrString | null | void;
  serialNumber?: string | null | void;
  specifications?: Json | null | void;
  status: string;
}

/** 'CreateEquipment' return type */
export interface CreateEquipmentResult {
  branch_id: string;
  condition: string | null;
  created_at: Date | null;
  equipment_number: string;
  equipment_type_id: string;
  features: stringArray | null;
  id: string;
  internal_notes: string | null;
  last_maintenance_date: Date | null;
  location: string | null;
  maintenance_interval_days: number | null;
  manufacturer: string | null;
  model: string | null;
  name: string | null;
  next_maintenance_due: Date | null;
  notes: string | null;
  purchase_date: Date | null;
  purchase_price: string | null;
  serial_number: string | null;
  specifications: Json | null;
  status: string | null;
  total_usage_hours: string | null;
  updated_at: Date | null;
}

/** 'CreateEquipment' query type */
export interface CreateEquipmentQuery {
  params: CreateEquipmentParams;
  result: CreateEquipmentResult;
}

const createEquipmentIR: any = {"usedParamSet":{"branchId":true,"equipmentTypeId":true,"equipmentNumber":true,"name":true,"serialNumber":true,"manufacturer":true,"model":true,"purchaseDate":true,"purchasePrice":true,"status":true,"condition":true,"location":true,"specifications":true,"features":true,"maintenanceIntervalDays":true,"notes":true,"internalNotes":true},"params":[{"name":"branchId","required":true,"transform":{"type":"scalar"},"locs":[{"a":296,"b":305}]},{"name":"equipmentTypeId","required":true,"transform":{"type":"scalar"},"locs":[{"a":310,"b":326}]},{"name":"equipmentNumber","required":true,"transform":{"type":"scalar"},"locs":[{"a":331,"b":347}]},{"name":"name","required":false,"transform":{"type":"scalar"},"locs":[{"a":352,"b":356}]},{"name":"serialNumber","required":false,"transform":{"type":"scalar"},"locs":[{"a":361,"b":373}]},{"name":"manufacturer","required":false,"transform":{"type":"scalar"},"locs":[{"a":378,"b":390}]},{"name":"model","required":false,"transform":{"type":"scalar"},"locs":[{"a":395,"b":400}]},{"name":"purchaseDate","required":false,"transform":{"type":"scalar"},"locs":[{"a":405,"b":417}]},{"name":"purchasePrice","required":false,"transform":{"type":"scalar"},"locs":[{"a":422,"b":435}]},{"name":"status","required":true,"transform":{"type":"scalar"},"locs":[{"a":440,"b":447}]},{"name":"condition","required":false,"transform":{"type":"scalar"},"locs":[{"a":452,"b":461}]},{"name":"location","required":false,"transform":{"type":"scalar"},"locs":[{"a":466,"b":474}]},{"name":"specifications","required":false,"transform":{"type":"scalar"},"locs":[{"a":479,"b":493}]},{"name":"features","required":false,"transform":{"type":"scalar"},"locs":[{"a":498,"b":506}]},{"name":"maintenanceIntervalDays","required":false,"transform":{"type":"scalar"},"locs":[{"a":511,"b":534}]},{"name":"notes","required":false,"transform":{"type":"scalar"},"locs":[{"a":539,"b":544}]},{"name":"internalNotes","required":false,"transform":{"type":"scalar"},"locs":[{"a":549,"b":562}]}],"statement":"INSERT INTO equipment (\n  branch_id,\n  equipment_type_id,\n  equipment_number,\n  name,\n  serial_number,\n  manufacturer,\n  model,\n  purchase_date,\n  purchase_price,\n  status,\n  condition,\n  location,\n  specifications,\n  features,\n  maintenance_interval_days,\n  notes,\n  internal_notes\n) VALUES (\n  :branchId!,\n  :equipmentTypeId!,\n  :equipmentNumber!,\n  :name,\n  :serialNumber,\n  :manufacturer,\n  :model,\n  :purchaseDate,\n  :purchasePrice,\n  :status!,\n  :condition,\n  :location,\n  :specifications,\n  :features,\n  :maintenanceIntervalDays,\n  :notes,\n  :internalNotes\n)\nRETURNING *"};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO equipment (
 *   branch_id,
 *   equipment_type_id,
 *   equipment_number,
 *   name,
 *   serial_number,
 *   manufacturer,
 *   model,
 *   purchase_date,
 *   purchase_price,
 *   status,
 *   condition,
 *   location,
 *   specifications,
 *   features,
 *   maintenance_interval_days,
 *   notes,
 *   internal_notes
 * ) VALUES (
 *   :branchId!,
 *   :equipmentTypeId!,
 *   :equipmentNumber!,
 *   :name,
 *   :serialNumber,
 *   :manufacturer,
 *   :model,
 *   :purchaseDate,
 *   :purchasePrice,
 *   :status!,
 *   :condition,
 *   :location,
 *   :specifications,
 *   :features,
 *   :maintenanceIntervalDays,
 *   :notes,
 *   :internalNotes
 * )
 * RETURNING *
 * ```
 */
export const createEquipment = new PreparedQuery<CreateEquipmentParams,CreateEquipmentResult>(createEquipmentIR);


/** 'GetEquipment' parameters type */
export interface GetEquipmentParams {
  branchId: string;
}

/** 'GetEquipment' return type */
export interface GetEquipmentResult {
  branch_id: string;
  condition: string | null;
  created_at: Date | null;
  equipment_number: string;
  equipment_type_id: string;
  equipment_type_name: string;
  features: stringArray | null;
  id: string;
  internal_notes: string | null;
  last_maintenance_date: Date | null;
  location: string | null;
  maintenance_interval_days: number | null;
  manufacturer: string | null;
  model: string | null;
  name: string | null;
  next_maintenance_due: Date | null;
  notes: string | null;
  purchase_date: Date | null;
  purchase_price: string | null;
  requires_assignment: boolean | null;
  serial_number: string | null;
  specifications: Json | null;
  status: string | null;
  total_usage_hours: string | null;
  updated_at: Date | null;
}

/** 'GetEquipment' query type */
export interface GetEquipmentQuery {
  params: GetEquipmentParams;
  result: GetEquipmentResult;
}

const getEquipmentIR: any = {"usedParamSet":{"branchId":true},"params":[{"name":"branchId","required":true,"transform":{"type":"scalar"},"locs":[{"a":165,"b":174}]}],"statement":"SELECT\n  e.*,\n  et.name as equipment_type_name,\n  et.requires_assignment\nFROM equipment e\nJOIN equipment_types et ON e.equipment_type_id = et.id\nWHERE e.branch_id = :branchId!\nORDER BY e.equipment_number"};

/**
 * Query generated from SQL:
 * ```
 * SELECT
 *   e.*,
 *   et.name as equipment_type_name,
 *   et.requires_assignment
 * FROM equipment e
 * JOIN equipment_types et ON e.equipment_type_id = et.id
 * WHERE e.branch_id = :branchId!
 * ORDER BY e.equipment_number
 * ```
 */
export const getEquipment = new PreparedQuery<GetEquipmentParams,GetEquipmentResult>(getEquipmentIR);


/** 'GetEquipmentById' parameters type */
export interface GetEquipmentByIdParams {
  branchId: string;
  equipmentId: string;
}

/** 'GetEquipmentById' return type */
export interface GetEquipmentByIdResult {
  branch_id: string;
  condition: string | null;
  created_at: Date | null;
  equipment_number: string;
  equipment_type_id: string;
  equipment_type_name: string;
  features: stringArray | null;
  id: string;
  internal_notes: string | null;
  last_maintenance_date: Date | null;
  location: string | null;
  maintenance_interval_days: number | null;
  manufacturer: string | null;
  model: string | null;
  name: string | null;
  next_maintenance_due: Date | null;
  notes: string | null;
  purchase_date: Date | null;
  purchase_price: string | null;
  requires_assignment: boolean | null;
  serial_number: string | null;
  specifications: Json | null;
  status: string | null;
  total_usage_hours: string | null;
  updated_at: Date | null;
}

/** 'GetEquipmentById' query type */
export interface GetEquipmentByIdQuery {
  params: GetEquipmentByIdParams;
  result: GetEquipmentByIdResult;
}

const getEquipmentByIdIR: any = {"usedParamSet":{"equipmentId":true,"branchId":true},"params":[{"name":"equipmentId","required":true,"transform":{"type":"scalar"},"locs":[{"a":158,"b":170}]},{"name":"branchId","required":true,"transform":{"type":"scalar"},"locs":[{"a":192,"b":201}]}],"statement":"SELECT\n  e.*,\n  et.name as equipment_type_name,\n  et.requires_assignment\nFROM equipment e\nJOIN equipment_types et ON e.equipment_type_id = et.id\nWHERE e.id = :equipmentId!\n  AND e.branch_id = :branchId!"};

/**
 * Query generated from SQL:
 * ```
 * SELECT
 *   e.*,
 *   et.name as equipment_type_name,
 *   et.requires_assignment
 * FROM equipment e
 * JOIN equipment_types et ON e.equipment_type_id = et.id
 * WHERE e.id = :equipmentId!
 *   AND e.branch_id = :branchId!
 * ```
 */
export const getEquipmentById = new PreparedQuery<GetEquipmentByIdParams,GetEquipmentByIdResult>(getEquipmentByIdIR);


/** 'GetEquipmentByType' parameters type */
export interface GetEquipmentByTypeParams {
  branchId: string;
  equipmentTypeId: string;
}

/** 'GetEquipmentByType' return type */
export interface GetEquipmentByTypeResult {
  branch_id: string;
  condition: string | null;
  created_at: Date | null;
  equipment_number: string;
  equipment_type_id: string;
  equipment_type_name: string;
  features: stringArray | null;
  id: string;
  internal_notes: string | null;
  last_maintenance_date: Date | null;
  location: string | null;
  maintenance_interval_days: number | null;
  manufacturer: string | null;
  model: string | null;
  name: string | null;
  next_maintenance_due: Date | null;
  notes: string | null;
  purchase_date: Date | null;
  purchase_price: string | null;
  serial_number: string | null;
  specifications: Json | null;
  status: string | null;
  total_usage_hours: string | null;
  updated_at: Date | null;
}

/** 'GetEquipmentByType' query type */
export interface GetEquipmentByTypeQuery {
  params: GetEquipmentByTypeParams;
  result: GetEquipmentByTypeResult;
}

const getEquipmentByTypeIR: any = {"usedParamSet":{"equipmentTypeId":true,"branchId":true},"params":[{"name":"equipmentTypeId","required":true,"transform":{"type":"scalar"},"locs":[{"a":147,"b":163}]},{"name":"branchId","required":true,"transform":{"type":"scalar"},"locs":[{"a":185,"b":194}]}],"statement":"SELECT\n  e.*,\n  et.name as equipment_type_name\nFROM equipment e\nJOIN equipment_types et ON e.equipment_type_id = et.id\nWHERE e.equipment_type_id = :equipmentTypeId!\n  AND e.branch_id = :branchId!\nORDER BY e.equipment_number"};

/**
 * Query generated from SQL:
 * ```
 * SELECT
 *   e.*,
 *   et.name as equipment_type_name
 * FROM equipment e
 * JOIN equipment_types et ON e.equipment_type_id = et.id
 * WHERE e.equipment_type_id = :equipmentTypeId!
 *   AND e.branch_id = :branchId!
 * ORDER BY e.equipment_number
 * ```
 */
export const getEquipmentByType = new PreparedQuery<GetEquipmentByTypeParams,GetEquipmentByTypeResult>(getEquipmentByTypeIR);


/** 'GetAvailableEquipment' parameters type */
export interface GetAvailableEquipmentParams {
  branchId: string;
}

/** 'GetAvailableEquipment' return type */
export interface GetAvailableEquipmentResult {
  branch_id: string;
  condition: string | null;
  created_at: Date | null;
  equipment_number: string;
  equipment_type_id: string;
  equipment_type_name: string;
  features: stringArray | null;
  id: string;
  internal_notes: string | null;
  last_maintenance_date: Date | null;
  location: string | null;
  maintenance_interval_days: number | null;
  manufacturer: string | null;
  model: string | null;
  name: string | null;
  next_maintenance_due: Date | null;
  notes: string | null;
  purchase_date: Date | null;
  purchase_price: string | null;
  serial_number: string | null;
  specifications: Json | null;
  status: string | null;
  total_usage_hours: string | null;
  updated_at: Date | null;
}

/** 'GetAvailableEquipment' query type */
export interface GetAvailableEquipmentQuery {
  params: GetAvailableEquipmentParams;
  result: GetAvailableEquipmentResult;
}

const getAvailableEquipmentIR: any = {"usedParamSet":{"branchId":true},"params":[{"name":"branchId","required":true,"transform":{"type":"scalar"},"locs":[{"a":139,"b":148}]}],"statement":"SELECT\n  e.*,\n  et.name as equipment_type_name\nFROM equipment e\nJOIN equipment_types et ON e.equipment_type_id = et.id\nWHERE e.branch_id = :branchId!\n  AND e.status = 'available'\n  AND NOT EXISTS (\n    SELECT 1 FROM equipment_issues ei\n    WHERE ei.equipment_id = e.id\n      AND ei.status IN ('open', 'acknowledged', 'in_progress')\n      AND ei.severity IN ('high', 'critical')\n  )\nORDER BY e.equipment_number"};

/**
 * Query generated from SQL:
 * ```
 * SELECT
 *   e.*,
 *   et.name as equipment_type_name
 * FROM equipment e
 * JOIN equipment_types et ON e.equipment_type_id = et.id
 * WHERE e.branch_id = :branchId!
 *   AND e.status = 'available'
 *   AND NOT EXISTS (
 *     SELECT 1 FROM equipment_issues ei
 *     WHERE ei.equipment_id = e.id
 *       AND ei.status IN ('open', 'acknowledged', 'in_progress')
 *       AND ei.severity IN ('high', 'critical')
 *   )
 * ORDER BY e.equipment_number
 * ```
 */
export const getAvailableEquipment = new PreparedQuery<GetAvailableEquipmentParams,GetAvailableEquipmentResult>(getAvailableEquipmentIR);


/** 'UpdateEquipment' parameters type */
export interface UpdateEquipmentParams {
  branchId: string;
  condition?: string | null | void;
  equipmentId: string;
  features?: stringArray | null | void;
  internalNotes?: string | null | void;
  location?: string | null | void;
  maintenanceIntervalDays?: number | null | void;
  name?: string | null | void;
  notes?: string | null | void;
  specifications?: Json | null | void;
  status: string;
}

/** 'UpdateEquipment' return type */
export interface UpdateEquipmentResult {
  branch_id: string;
  condition: string | null;
  created_at: Date | null;
  equipment_number: string;
  equipment_type_id: string;
  features: stringArray | null;
  id: string;
  internal_notes: string | null;
  last_maintenance_date: Date | null;
  location: string | null;
  maintenance_interval_days: number | null;
  manufacturer: string | null;
  model: string | null;
  name: string | null;
  next_maintenance_due: Date | null;
  notes: string | null;
  purchase_date: Date | null;
  purchase_price: string | null;
  serial_number: string | null;
  specifications: Json | null;
  status: string | null;
  total_usage_hours: string | null;
  updated_at: Date | null;
}

/** 'UpdateEquipment' query type */
export interface UpdateEquipmentQuery {
  params: UpdateEquipmentParams;
  result: UpdateEquipmentResult;
}

const updateEquipmentIR: any = {"usedParamSet":{"name":true,"status":true,"condition":true,"location":true,"specifications":true,"features":true,"maintenanceIntervalDays":true,"notes":true,"internalNotes":true,"equipmentId":true,"branchId":true},"params":[{"name":"name","required":false,"transform":{"type":"scalar"},"locs":[{"a":30,"b":34}]},{"name":"status","required":true,"transform":{"type":"scalar"},"locs":[{"a":48,"b":55}]},{"name":"condition","required":false,"transform":{"type":"scalar"},"locs":[{"a":72,"b":81}]},{"name":"location","required":false,"transform":{"type":"scalar"},"locs":[{"a":97,"b":105}]},{"name":"specifications","required":false,"transform":{"type":"scalar"},"locs":[{"a":127,"b":141}]},{"name":"features","required":false,"transform":{"type":"scalar"},"locs":[{"a":157,"b":165}]},{"name":"maintenanceIntervalDays","required":false,"transform":{"type":"scalar"},"locs":[{"a":198,"b":221}]},{"name":"notes","required":false,"transform":{"type":"scalar"},"locs":[{"a":234,"b":239}]},{"name":"internalNotes","required":false,"transform":{"type":"scalar"},"locs":[{"a":261,"b":274}]},{"name":"equipmentId","required":true,"transform":{"type":"scalar"},"locs":[{"a":287,"b":299}]},{"name":"branchId","required":true,"transform":{"type":"scalar"},"locs":[{"a":319,"b":328}]}],"statement":"UPDATE equipment\nSET\n  name = :name,\n  status = :status!,\n  condition = :condition,\n  location = :location,\n  specifications = :specifications,\n  features = :features,\n  maintenance_interval_days = :maintenanceIntervalDays,\n  notes = :notes,\n  internal_notes = :internalNotes\nWHERE id = :equipmentId!\n  AND branch_id = :branchId!\nRETURNING *"};

/**
 * Query generated from SQL:
 * ```
 * UPDATE equipment
 * SET
 *   name = :name,
 *   status = :status!,
 *   condition = :condition,
 *   location = :location,
 *   specifications = :specifications,
 *   features = :features,
 *   maintenance_interval_days = :maintenanceIntervalDays,
 *   notes = :notes,
 *   internal_notes = :internalNotes
 * WHERE id = :equipmentId!
 *   AND branch_id = :branchId!
 * RETURNING *
 * ```
 */
export const updateEquipment = new PreparedQuery<UpdateEquipmentParams,UpdateEquipmentResult>(updateEquipmentIR);


/** 'UpdateEquipmentStatus' parameters type */
export interface UpdateEquipmentStatusParams {
  branchId: string;
  equipmentId: string;
  status: string;
}

/** 'UpdateEquipmentStatus' return type */
export interface UpdateEquipmentStatusResult {
  branch_id: string;
  condition: string | null;
  created_at: Date | null;
  equipment_number: string;
  equipment_type_id: string;
  features: stringArray | null;
  id: string;
  internal_notes: string | null;
  last_maintenance_date: Date | null;
  location: string | null;
  maintenance_interval_days: number | null;
  manufacturer: string | null;
  model: string | null;
  name: string | null;
  next_maintenance_due: Date | null;
  notes: string | null;
  purchase_date: Date | null;
  purchase_price: string | null;
  serial_number: string | null;
  specifications: Json | null;
  status: string | null;
  total_usage_hours: string | null;
  updated_at: Date | null;
}

/** 'UpdateEquipmentStatus' query type */
export interface UpdateEquipmentStatusQuery {
  params: UpdateEquipmentStatusParams;
  result: UpdateEquipmentStatusResult;
}

const updateEquipmentStatusIR: any = {"usedParamSet":{"status":true,"equipmentId":true,"branchId":true},"params":[{"name":"status","required":true,"transform":{"type":"scalar"},"locs":[{"a":30,"b":37}]},{"name":"equipmentId","required":true,"transform":{"type":"scalar"},"locs":[{"a":50,"b":62}]},{"name":"branchId","required":true,"transform":{"type":"scalar"},"locs":[{"a":82,"b":91}]}],"statement":"UPDATE equipment\nSET status = :status!\nWHERE id = :equipmentId!\n  AND branch_id = :branchId!\nRETURNING *"};

/**
 * Query generated from SQL:
 * ```
 * UPDATE equipment
 * SET status = :status!
 * WHERE id = :equipmentId!
 *   AND branch_id = :branchId!
 * RETURNING *
 * ```
 */
export const updateEquipmentStatus = new PreparedQuery<UpdateEquipmentStatusParams,UpdateEquipmentStatusResult>(updateEquipmentStatusIR);


/** 'RecordMaintenanceDate' parameters type */
export interface RecordMaintenanceDateParams {
  branchId: string;
  equipmentId: string;
  maintenanceDate: DateOrString;
  nextMaintenanceDue: DateOrString;
}

/** 'RecordMaintenanceDate' return type */
export interface RecordMaintenanceDateResult {
  branch_id: string;
  condition: string | null;
  created_at: Date | null;
  equipment_number: string;
  equipment_type_id: string;
  features: stringArray | null;
  id: string;
  internal_notes: string | null;
  last_maintenance_date: Date | null;
  location: string | null;
  maintenance_interval_days: number | null;
  manufacturer: string | null;
  model: string | null;
  name: string | null;
  next_maintenance_due: Date | null;
  notes: string | null;
  purchase_date: Date | null;
  purchase_price: string | null;
  serial_number: string | null;
  specifications: Json | null;
  status: string | null;
  total_usage_hours: string | null;
  updated_at: Date | null;
}

/** 'RecordMaintenanceDate' query type */
export interface RecordMaintenanceDateQuery {
  params: RecordMaintenanceDateParams;
  result: RecordMaintenanceDateResult;
}

const recordMaintenanceDateIR: any = {"usedParamSet":{"maintenanceDate":true,"nextMaintenanceDue":true,"equipmentId":true,"branchId":true},"params":[{"name":"maintenanceDate","required":true,"transform":{"type":"scalar"},"locs":[{"a":47,"b":63}]},{"name":"nextMaintenanceDue","required":true,"transform":{"type":"scalar"},"locs":[{"a":91,"b":110}]},{"name":"equipmentId","required":true,"transform":{"type":"scalar"},"locs":[{"a":123,"b":135}]},{"name":"branchId","required":true,"transform":{"type":"scalar"},"locs":[{"a":155,"b":164}]}],"statement":"UPDATE equipment\nSET\n  last_maintenance_date = :maintenanceDate!,\n  next_maintenance_due = :nextMaintenanceDue!\nWHERE id = :equipmentId!\n  AND branch_id = :branchId!\nRETURNING *"};

/**
 * Query generated from SQL:
 * ```
 * UPDATE equipment
 * SET
 *   last_maintenance_date = :maintenanceDate!,
 *   next_maintenance_due = :nextMaintenanceDue!
 * WHERE id = :equipmentId!
 *   AND branch_id = :branchId!
 * RETURNING *
 * ```
 */
export const recordMaintenanceDate = new PreparedQuery<RecordMaintenanceDateParams,RecordMaintenanceDateResult>(recordMaintenanceDateIR);


/** 'GetAvailableEquipmentForClass' parameters type */
export interface GetAvailableEquipmentForClassParams {
  classId: string;
  equipmentTypeId: string;
}

/** 'GetAvailableEquipmentForClass' return type */
export interface GetAvailableEquipmentForClassResult {
  condition: string | null;
  equipment_id: string | null;
  equipment_name: string | null;
  equipment_number: string | null;
  is_preferred: boolean | null;
}

/** 'GetAvailableEquipmentForClass' query type */
export interface GetAvailableEquipmentForClassQuery {
  params: GetAvailableEquipmentForClassParams;
  result: GetAvailableEquipmentForClassResult;
}

const getAvailableEquipmentForClassIR: any = {"usedParamSet":{"classId":true,"equipmentTypeId":true},"params":[{"name":"classId","required":true,"transform":{"type":"scalar"},"locs":[{"a":128,"b":136}]},{"name":"equipmentTypeId","required":true,"transform":{"type":"scalar"},"locs":[{"a":139,"b":155}]}],"statement":"SELECT\n  equipment_id,\n  equipment_number,\n  equipment_name,\n  condition,\n  is_preferred\nFROM get_available_equipment_for_class(:classId!, :equipmentTypeId!)"};

/**
 * Query generated from SQL:
 * ```
 * SELECT
 *   equipment_id,
 *   equipment_number,
 *   equipment_name,
 *   condition,
 *   is_preferred
 * FROM get_available_equipment_for_class(:classId!, :equipmentTypeId!)
 * ```
 */
export const getAvailableEquipmentForClass = new PreparedQuery<GetAvailableEquipmentForClassParams,GetAvailableEquipmentForClassResult>(getAvailableEquipmentForClassIR);


/** 'CreateEquipmentAssignment' parameters type */
export interface CreateEquipmentAssignmentParams {
  assignedBy?: string | null | void;
  assignmentType: string;
  bookingId?: string | null | void;
  branchId: string;
  classId: string;
  equipmentId: string;
  status: string;
  userId: string;
}

/** 'CreateEquipmentAssignment' return type */
export interface CreateEquipmentAssignmentResult {
  assigned_at: Date | null;
  assigned_by: string | null;
  assignment_type: string | null;
  booking_id: string | null;
  branch_id: string;
  checked_in_at: Date | null;
  checked_out_at: Date | null;
  class_id: string;
  created_at: Date | null;
  equipment_id: string;
  id: string;
  notes: string | null;
  status: string | null;
  usage_duration_minutes: number | null;
  user_id: string;
}

/** 'CreateEquipmentAssignment' query type */
export interface CreateEquipmentAssignmentQuery {
  params: CreateEquipmentAssignmentParams;
  result: CreateEquipmentAssignmentResult;
}

const createEquipmentAssignmentIR: any = {"usedParamSet":{"equipmentId":true,"classId":true,"userId":true,"branchId":true,"bookingId":true,"assignedBy":true,"assignmentType":true,"status":true},"params":[{"name":"equipmentId","required":true,"transform":{"type":"scalar"},"locs":[{"a":158,"b":170}]},{"name":"classId","required":true,"transform":{"type":"scalar"},"locs":[{"a":175,"b":183}]},{"name":"userId","required":true,"transform":{"type":"scalar"},"locs":[{"a":188,"b":195}]},{"name":"branchId","required":true,"transform":{"type":"scalar"},"locs":[{"a":200,"b":209}]},{"name":"bookingId","required":false,"transform":{"type":"scalar"},"locs":[{"a":214,"b":223}]},{"name":"assignedBy","required":false,"transform":{"type":"scalar"},"locs":[{"a":228,"b":238}]},{"name":"assignmentType","required":true,"transform":{"type":"scalar"},"locs":[{"a":243,"b":258}]},{"name":"status","required":true,"transform":{"type":"scalar"},"locs":[{"a":263,"b":270}]}],"statement":"INSERT INTO equipment_assignments (\n  equipment_id,\n  class_id,\n  user_id,\n  branch_id,\n  booking_id,\n  assigned_by,\n  assignment_type,\n  status\n) VALUES (\n  :equipmentId!,\n  :classId!,\n  :userId!,\n  :branchId!,\n  :bookingId,\n  :assignedBy,\n  :assignmentType!,\n  :status!\n)\nRETURNING *"};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO equipment_assignments (
 *   equipment_id,
 *   class_id,
 *   user_id,
 *   branch_id,
 *   booking_id,
 *   assigned_by,
 *   assignment_type,
 *   status
 * ) VALUES (
 *   :equipmentId!,
 *   :classId!,
 *   :userId!,
 *   :branchId!,
 *   :bookingId,
 *   :assignedBy,
 *   :assignmentType!,
 *   :status!
 * )
 * RETURNING *
 * ```
 */
export const createEquipmentAssignment = new PreparedQuery<CreateEquipmentAssignmentParams,CreateEquipmentAssignmentResult>(createEquipmentAssignmentIR);


/** 'AutoAssignEquipment' parameters type */
export interface AutoAssignEquipmentParams {
  classId: string;
  equipmentTypeId: string;
  userId: string;
}

/** 'AutoAssignEquipment' return type */
export interface AutoAssignEquipmentResult {
  equipment_id: string | null;
}

/** 'AutoAssignEquipment' query type */
export interface AutoAssignEquipmentQuery {
  params: AutoAssignEquipmentParams;
  result: AutoAssignEquipmentResult;
}

const autoAssignEquipmentIR: any = {"usedParamSet":{"classId":true,"userId":true,"equipmentTypeId":true},"params":[{"name":"classId","required":true,"transform":{"type":"scalar"},"locs":[{"a":29,"b":37}]},{"name":"userId","required":true,"transform":{"type":"scalar"},"locs":[{"a":40,"b":47}]},{"name":"equipmentTypeId","required":true,"transform":{"type":"scalar"},"locs":[{"a":50,"b":66}]}],"statement":"SELECT auto_assign_equipment(:classId!, :userId!, :equipmentTypeId!) as equipment_id"};

/**
 * Query generated from SQL:
 * ```
 * SELECT auto_assign_equipment(:classId!, :userId!, :equipmentTypeId!) as equipment_id
 * ```
 */
export const autoAssignEquipment = new PreparedQuery<AutoAssignEquipmentParams,AutoAssignEquipmentResult>(autoAssignEquipmentIR);


/** 'GetClassEquipmentAssignments' parameters type */
export interface GetClassEquipmentAssignmentsParams {
  branchId: string;
  classId: string;
}

/** 'GetClassEquipmentAssignments' return type */
export interface GetClassEquipmentAssignmentsResult {
  assigned_at: Date | null;
  assigned_by: string | null;
  assignment_type: string | null;
  booking_id: string | null;
  branch_id: string;
  checked_in_at: Date | null;
  checked_out_at: Date | null;
  class_id: string;
  created_at: Date | null;
  equipment_id: string;
  equipment_name: string | null;
  equipment_number: string;
  equipment_type_name: string;
  first_name: string | null;
  id: string;
  last_name: string | null;
  notes: string | null;
  status: string | null;
  usage_duration_minutes: number | null;
  user_id: string;
}

/** 'GetClassEquipmentAssignments' query type */
export interface GetClassEquipmentAssignmentsQuery {
  params: GetClassEquipmentAssignmentsParams;
  result: GetClassEquipmentAssignmentsResult;
}

const getClassEquipmentAssignmentsIR: any = {"usedParamSet":{"classId":true,"branchId":true},"params":[{"name":"classId","required":true,"transform":{"type":"scalar"},"locs":[{"a":312,"b":320}]},{"name":"branchId","required":true,"transform":{"type":"scalar"},"locs":[{"a":343,"b":352}]}],"statement":"SELECT\n  ea.*,\n  e.equipment_number,\n  e.name as equipment_name,\n  et.name as equipment_type_name,\n  u.first_name,\n  u.last_name\nFROM equipment_assignments ea\nJOIN equipment e ON ea.equipment_id = e.id\nJOIN equipment_types et ON e.equipment_type_id = et.id\nJOIN \"user\" u ON ea.user_id = u.id\nWHERE ea.class_id = :classId!\n  AND ea.branch_id = :branchId!\nORDER BY e.equipment_number"};

/**
 * Query generated from SQL:
 * ```
 * SELECT
 *   ea.*,
 *   e.equipment_number,
 *   e.name as equipment_name,
 *   et.name as equipment_type_name,
 *   u.first_name,
 *   u.last_name
 * FROM equipment_assignments ea
 * JOIN equipment e ON ea.equipment_id = e.id
 * JOIN equipment_types et ON e.equipment_type_id = et.id
 * JOIN "user" u ON ea.user_id = u.id
 * WHERE ea.class_id = :classId!
 *   AND ea.branch_id = :branchId!
 * ORDER BY e.equipment_number
 * ```
 */
export const getClassEquipmentAssignments = new PreparedQuery<GetClassEquipmentAssignmentsParams,GetClassEquipmentAssignmentsResult>(getClassEquipmentAssignmentsIR);


/** 'GetUserEquipmentAssignment' parameters type */
export interface GetUserEquipmentAssignmentParams {
  branchId: string;
  classId: string;
  userId: string;
}

/** 'GetUserEquipmentAssignment' return type */
export interface GetUserEquipmentAssignmentResult {
  assigned_at: Date | null;
  assigned_by: string | null;
  assignment_type: string | null;
  booking_id: string | null;
  branch_id: string;
  checked_in_at: Date | null;
  checked_out_at: Date | null;
  class_id: string;
  created_at: Date | null;
  equipment_id: string;
  equipment_name: string | null;
  equipment_number: string;
  equipment_type_name: string;
  id: string;
  notes: string | null;
  status: string | null;
  usage_duration_minutes: number | null;
  user_id: string;
}

/** 'GetUserEquipmentAssignment' query type */
export interface GetUserEquipmentAssignmentQuery {
  params: GetUserEquipmentAssignmentParams;
  result: GetUserEquipmentAssignmentResult;
}

const getUserEquipmentAssignmentIR: any = {"usedParamSet":{"classId":true,"userId":true,"branchId":true},"params":[{"name":"classId","required":true,"transform":{"type":"scalar"},"locs":[{"a":246,"b":254}]},{"name":"userId","required":true,"transform":{"type":"scalar"},"locs":[{"a":275,"b":282}]},{"name":"branchId","required":true,"transform":{"type":"scalar"},"locs":[{"a":305,"b":314}]}],"statement":"SELECT\n  ea.*,\n  e.equipment_number,\n  e.name as equipment_name,\n  et.name as equipment_type_name\nFROM equipment_assignments ea\nJOIN equipment e ON ea.equipment_id = e.id\nJOIN equipment_types et ON e.equipment_type_id = et.id\nWHERE ea.class_id = :classId!\n  AND ea.user_id = :userId!\n  AND ea.branch_id = :branchId!"};

/**
 * Query generated from SQL:
 * ```
 * SELECT
 *   ea.*,
 *   e.equipment_number,
 *   e.name as equipment_name,
 *   et.name as equipment_type_name
 * FROM equipment_assignments ea
 * JOIN equipment e ON ea.equipment_id = e.id
 * JOIN equipment_types et ON e.equipment_type_id = et.id
 * WHERE ea.class_id = :classId!
 *   AND ea.user_id = :userId!
 *   AND ea.branch_id = :branchId!
 * ```
 */
export const getUserEquipmentAssignment = new PreparedQuery<GetUserEquipmentAssignmentParams,GetUserEquipmentAssignmentResult>(getUserEquipmentAssignmentIR);


/** 'UpdateAssignmentStatus' parameters type */
export interface UpdateAssignmentStatusParams {
  assignmentId: string;
  branchId: string;
  status: string;
}

/** 'UpdateAssignmentStatus' return type */
export interface UpdateAssignmentStatusResult {
  assigned_at: Date | null;
  assigned_by: string | null;
  assignment_type: string | null;
  booking_id: string | null;
  branch_id: string;
  checked_in_at: Date | null;
  checked_out_at: Date | null;
  class_id: string;
  created_at: Date | null;
  equipment_id: string;
  id: string;
  notes: string | null;
  status: string | null;
  usage_duration_minutes: number | null;
  user_id: string;
}

/** 'UpdateAssignmentStatus' query type */
export interface UpdateAssignmentStatusQuery {
  params: UpdateAssignmentStatusParams;
  result: UpdateAssignmentStatusResult;
}

const updateAssignmentStatusIR: any = {"usedParamSet":{"status":true,"assignmentId":true,"branchId":true},"params":[{"name":"status","required":true,"transform":{"type":"scalar"},"locs":[{"a":42,"b":49}]},{"name":"assignmentId","required":true,"transform":{"type":"scalar"},"locs":[{"a":62,"b":75}]},{"name":"branchId","required":true,"transform":{"type":"scalar"},"locs":[{"a":95,"b":104}]}],"statement":"UPDATE equipment_assignments\nSET status = :status!\nWHERE id = :assignmentId!\n  AND branch_id = :branchId!\nRETURNING *"};

/**
 * Query generated from SQL:
 * ```
 * UPDATE equipment_assignments
 * SET status = :status!
 * WHERE id = :assignmentId!
 *   AND branch_id = :branchId!
 * RETURNING *
 * ```
 */
export const updateAssignmentStatus = new PreparedQuery<UpdateAssignmentStatusParams,UpdateAssignmentStatusResult>(updateAssignmentStatusIR);


/** 'CheckInEquipment' parameters type */
export interface CheckInEquipmentParams {
  assignmentId: string;
  branchId: string;
}

/** 'CheckInEquipment' return type */
export interface CheckInEquipmentResult {
  assigned_at: Date | null;
  assigned_by: string | null;
  assignment_type: string | null;
  booking_id: string | null;
  branch_id: string;
  checked_in_at: Date | null;
  checked_out_at: Date | null;
  class_id: string;
  created_at: Date | null;
  equipment_id: string;
  id: string;
  notes: string | null;
  status: string | null;
  usage_duration_minutes: number | null;
  user_id: string;
}

/** 'CheckInEquipment' query type */
export interface CheckInEquipmentQuery {
  params: CheckInEquipmentParams;
  result: CheckInEquipmentResult;
}

const checkInEquipmentIR: any = {"usedParamSet":{"assignmentId":true,"branchId":true},"params":[{"name":"assignmentId","required":true,"transform":{"type":"scalar"},"locs":[{"a":105,"b":118}]},{"name":"branchId","required":true,"transform":{"type":"scalar"},"locs":[{"a":138,"b":147}]}],"statement":"UPDATE equipment_assignments\nSET\n  status = 'checked_in',\n  checked_in_at = CURRENT_TIMESTAMP\nWHERE id = :assignmentId!\n  AND branch_id = :branchId!\nRETURNING *"};

/**
 * Query generated from SQL:
 * ```
 * UPDATE equipment_assignments
 * SET
 *   status = 'checked_in',
 *   checked_in_at = CURRENT_TIMESTAMP
 * WHERE id = :assignmentId!
 *   AND branch_id = :branchId!
 * RETURNING *
 * ```
 */
export const checkInEquipment = new PreparedQuery<CheckInEquipmentParams,CheckInEquipmentResult>(checkInEquipmentIR);


/** 'CheckOutEquipment' parameters type */
export interface CheckOutEquipmentParams {
  assignmentId: string;
  branchId: string;
}

/** 'CheckOutEquipment' return type */
export interface CheckOutEquipmentResult {
  assigned_at: Date | null;
  assigned_by: string | null;
  assignment_type: string | null;
  booking_id: string | null;
  branch_id: string;
  checked_in_at: Date | null;
  checked_out_at: Date | null;
  class_id: string;
  created_at: Date | null;
  equipment_id: string;
  id: string;
  notes: string | null;
  status: string | null;
  usage_duration_minutes: number | null;
  user_id: string;
}

/** 'CheckOutEquipment' query type */
export interface CheckOutEquipmentQuery {
  params: CheckOutEquipmentParams;
  result: CheckOutEquipmentResult;
}

const checkOutEquipmentIR: any = {"usedParamSet":{"assignmentId":true,"branchId":true},"params":[{"name":"assignmentId","required":true,"transform":{"type":"scalar"},"locs":[{"a":194,"b":207}]},{"name":"branchId","required":true,"transform":{"type":"scalar"},"locs":[{"a":227,"b":236}]}],"statement":"UPDATE equipment_assignments\nSET\n  status = 'completed',\n  checked_out_at = CURRENT_TIMESTAMP,\n  usage_duration_minutes = EXTRACT(EPOCH FROM (CURRENT_TIMESTAMP - checked_in_at)) / 60\nWHERE id = :assignmentId!\n  AND branch_id = :branchId!\nRETURNING *"};

/**
 * Query generated from SQL:
 * ```
 * UPDATE equipment_assignments
 * SET
 *   status = 'completed',
 *   checked_out_at = CURRENT_TIMESTAMP,
 *   usage_duration_minutes = EXTRACT(EPOCH FROM (CURRENT_TIMESTAMP - checked_in_at)) / 60
 * WHERE id = :assignmentId!
 *   AND branch_id = :branchId!
 * RETURNING *
 * ```
 */
export const checkOutEquipment = new PreparedQuery<CheckOutEquipmentParams,CheckOutEquipmentResult>(checkOutEquipmentIR);


/** 'CreateEquipmentPreference' parameters type */
export interface CreateEquipmentPreferenceParams {
  autoAssignPreferred: boolean;
  avoidEquipmentIds?: stringArray | null | void;
  branchId: string;
  equipmentTypeId: string;
  notes?: string | null | void;
  preferredEquipmentIds?: stringArray | null | void;
  userId: string;
}

/** 'CreateEquipmentPreference' return type */
export interface CreateEquipmentPreferenceResult {
  auto_assign_preferred: boolean | null;
  avoid_equipment_ids: stringArray | null;
  branch_id: string;
  created_at: Date | null;
  equipment_type_id: string;
  id: string;
  notes: string | null;
  preferred_equipment_ids: stringArray | null;
  updated_at: Date | null;
  user_id: string;
}

/** 'CreateEquipmentPreference' query type */
export interface CreateEquipmentPreferenceQuery {
  params: CreateEquipmentPreferenceParams;
  result: CreateEquipmentPreferenceResult;
}

const createEquipmentPreferenceIR: any = {"usedParamSet":{"userId":true,"branchId":true,"equipmentTypeId":true,"preferredEquipmentIds":true,"avoidEquipmentIds":true,"autoAssignPreferred":true,"notes":true},"params":[{"name":"userId","required":true,"transform":{"type":"scalar"},"locs":[{"a":184,"b":191}]},{"name":"branchId","required":true,"transform":{"type":"scalar"},"locs":[{"a":196,"b":205}]},{"name":"equipmentTypeId","required":true,"transform":{"type":"scalar"},"locs":[{"a":210,"b":226}]},{"name":"preferredEquipmentIds","required":false,"transform":{"type":"scalar"},"locs":[{"a":231,"b":252}]},{"name":"avoidEquipmentIds","required":false,"transform":{"type":"scalar"},"locs":[{"a":257,"b":274}]},{"name":"autoAssignPreferred","required":true,"transform":{"type":"scalar"},"locs":[{"a":279,"b":299}]},{"name":"notes","required":false,"transform":{"type":"scalar"},"locs":[{"a":304,"b":309}]}],"statement":"INSERT INTO client_equipment_preferences (\n  user_id,\n  branch_id,\n  equipment_type_id,\n  preferred_equipment_ids,\n  avoid_equipment_ids,\n  auto_assign_preferred,\n  notes\n) VALUES (\n  :userId!,\n  :branchId!,\n  :equipmentTypeId!,\n  :preferredEquipmentIds,\n  :avoidEquipmentIds,\n  :autoAssignPreferred!,\n  :notes\n)\nON CONFLICT (user_id, equipment_type_id) DO UPDATE SET\n  preferred_equipment_ids = EXCLUDED.preferred_equipment_ids,\n  avoid_equipment_ids = EXCLUDED.avoid_equipment_ids,\n  auto_assign_preferred = EXCLUDED.auto_assign_preferred,\n  notes = EXCLUDED.notes,\n  updated_at = CURRENT_TIMESTAMP\nRETURNING *"};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO client_equipment_preferences (
 *   user_id,
 *   branch_id,
 *   equipment_type_id,
 *   preferred_equipment_ids,
 *   avoid_equipment_ids,
 *   auto_assign_preferred,
 *   notes
 * ) VALUES (
 *   :userId!,
 *   :branchId!,
 *   :equipmentTypeId!,
 *   :preferredEquipmentIds,
 *   :avoidEquipmentIds,
 *   :autoAssignPreferred!,
 *   :notes
 * )
 * ON CONFLICT (user_id, equipment_type_id) DO UPDATE SET
 *   preferred_equipment_ids = EXCLUDED.preferred_equipment_ids,
 *   avoid_equipment_ids = EXCLUDED.avoid_equipment_ids,
 *   auto_assign_preferred = EXCLUDED.auto_assign_preferred,
 *   notes = EXCLUDED.notes,
 *   updated_at = CURRENT_TIMESTAMP
 * RETURNING *
 * ```
 */
export const createEquipmentPreference = new PreparedQuery<CreateEquipmentPreferenceParams,CreateEquipmentPreferenceResult>(createEquipmentPreferenceIR);


/** 'GetUserEquipmentPreferences' parameters type */
export interface GetUserEquipmentPreferencesParams {
  branchId: string;
  userId: string;
}

/** 'GetUserEquipmentPreferences' return type */
export interface GetUserEquipmentPreferencesResult {
  auto_assign_preferred: boolean | null;
  avoid_equipment_ids: stringArray | null;
  branch_id: string;
  created_at: Date | null;
  equipment_type_id: string;
  equipment_type_name: string;
  id: string;
  notes: string | null;
  preferred_equipment_ids: stringArray | null;
  updated_at: Date | null;
  user_id: string;
}

/** 'GetUserEquipmentPreferences' query type */
export interface GetUserEquipmentPreferencesQuery {
  params: GetUserEquipmentPreferencesParams;
  result: GetUserEquipmentPreferencesResult;
}

const getUserEquipmentPreferencesIR: any = {"usedParamSet":{"userId":true,"branchId":true},"params":[{"name":"userId","required":true,"transform":{"type":"scalar"},"locs":[{"a":164,"b":171}]},{"name":"branchId","required":true,"transform":{"type":"scalar"},"locs":[{"a":195,"b":204}]}],"statement":"SELECT\n  cep.*,\n  et.name as equipment_type_name\nFROM client_equipment_preferences cep\nJOIN equipment_types et ON cep.equipment_type_id = et.id\nWHERE cep.user_id = :userId!\n  AND cep.branch_id = :branchId!"};

/**
 * Query generated from SQL:
 * ```
 * SELECT
 *   cep.*,
 *   et.name as equipment_type_name
 * FROM client_equipment_preferences cep
 * JOIN equipment_types et ON cep.equipment_type_id = et.id
 * WHERE cep.user_id = :userId!
 *   AND cep.branch_id = :branchId!
 * ```
 */
export const getUserEquipmentPreferences = new PreparedQuery<GetUserEquipmentPreferencesParams,GetUserEquipmentPreferencesResult>(getUserEquipmentPreferencesIR);


/** 'CreateMaintenanceLog' parameters type */
export interface CreateMaintenanceLogParams {
  branchId: string;
  conditionAfter?: string | null | void;
  conditionBefore?: string | null | void;
  description: string;
  documents?: Json | null | void;
  equipmentId: string;
  externalServiceProvider?: string | null | void;
  laborHours?: NumberOrString | null | void;
  maintenanceDate: DateOrString;
  maintenanceType: string;
  nextMaintenanceDue?: DateOrString | null | void;
  notes?: string | null | void;
  partsReplaced?: Json | null | void;
  performedBy?: string | null | void;
  photos?: Json | null | void;
  totalCost?: NumberOrString | null | void;
}

/** 'CreateMaintenanceLog' return type */
export interface CreateMaintenanceLogResult {
  branch_id: string;
  condition_after: string | null;
  condition_before: string | null;
  created_at: Date | null;
  description: string;
  documents: Json | null;
  equipment_id: string;
  external_service_provider: string | null;
  id: string;
  labor_hours: string | null;
  maintenance_date: Date;
  maintenance_type: string;
  next_maintenance_due: Date | null;
  notes: string | null;
  parts_replaced: Json | null;
  performed_by: string | null;
  photos: Json | null;
  total_cost: string | null;
}

/** 'CreateMaintenanceLog' query type */
export interface CreateMaintenanceLogQuery {
  params: CreateMaintenanceLogParams;
  result: CreateMaintenanceLogResult;
}

const createMaintenanceLogIR: any = {"usedParamSet":{"equipmentId":true,"branchId":true,"maintenanceDate":true,"maintenanceType":true,"performedBy":true,"externalServiceProvider":true,"description":true,"partsReplaced":true,"laborHours":true,"totalCost":true,"conditionBefore":true,"conditionAfter":true,"nextMaintenanceDue":true,"photos":true,"documents":true,"notes":true},"params":[{"name":"equipmentId","required":true,"transform":{"type":"scalar"},"locs":[{"a":324,"b":336}]},{"name":"branchId","required":true,"transform":{"type":"scalar"},"locs":[{"a":341,"b":350}]},{"name":"maintenanceDate","required":true,"transform":{"type":"scalar"},"locs":[{"a":355,"b":371}]},{"name":"maintenanceType","required":true,"transform":{"type":"scalar"},"locs":[{"a":376,"b":392}]},{"name":"performedBy","required":false,"transform":{"type":"scalar"},"locs":[{"a":397,"b":408}]},{"name":"externalServiceProvider","required":false,"transform":{"type":"scalar"},"locs":[{"a":413,"b":436}]},{"name":"description","required":true,"transform":{"type":"scalar"},"locs":[{"a":441,"b":453}]},{"name":"partsReplaced","required":false,"transform":{"type":"scalar"},"locs":[{"a":458,"b":471}]},{"name":"laborHours","required":false,"transform":{"type":"scalar"},"locs":[{"a":476,"b":486}]},{"name":"totalCost","required":false,"transform":{"type":"scalar"},"locs":[{"a":491,"b":500}]},{"name":"conditionBefore","required":false,"transform":{"type":"scalar"},"locs":[{"a":505,"b":520}]},{"name":"conditionAfter","required":false,"transform":{"type":"scalar"},"locs":[{"a":525,"b":539}]},{"name":"nextMaintenanceDue","required":false,"transform":{"type":"scalar"},"locs":[{"a":544,"b":562}]},{"name":"photos","required":false,"transform":{"type":"scalar"},"locs":[{"a":567,"b":573}]},{"name":"documents","required":false,"transform":{"type":"scalar"},"locs":[{"a":578,"b":587}]},{"name":"notes","required":false,"transform":{"type":"scalar"},"locs":[{"a":592,"b":597}]}],"statement":"INSERT INTO equipment_maintenance_logs (\n  equipment_id,\n  branch_id,\n  maintenance_date,\n  maintenance_type,\n  performed_by,\n  external_service_provider,\n  description,\n  parts_replaced,\n  labor_hours,\n  total_cost,\n  condition_before,\n  condition_after,\n  next_maintenance_due,\n  photos,\n  documents,\n  notes\n) VALUES (\n  :equipmentId!,\n  :branchId!,\n  :maintenanceDate!,\n  :maintenanceType!,\n  :performedBy,\n  :externalServiceProvider,\n  :description!,\n  :partsReplaced,\n  :laborHours,\n  :totalCost,\n  :conditionBefore,\n  :conditionAfter,\n  :nextMaintenanceDue,\n  :photos,\n  :documents,\n  :notes\n)\nRETURNING *"};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO equipment_maintenance_logs (
 *   equipment_id,
 *   branch_id,
 *   maintenance_date,
 *   maintenance_type,
 *   performed_by,
 *   external_service_provider,
 *   description,
 *   parts_replaced,
 *   labor_hours,
 *   total_cost,
 *   condition_before,
 *   condition_after,
 *   next_maintenance_due,
 *   photos,
 *   documents,
 *   notes
 * ) VALUES (
 *   :equipmentId!,
 *   :branchId!,
 *   :maintenanceDate!,
 *   :maintenanceType!,
 *   :performedBy,
 *   :externalServiceProvider,
 *   :description!,
 *   :partsReplaced,
 *   :laborHours,
 *   :totalCost,
 *   :conditionBefore,
 *   :conditionAfter,
 *   :nextMaintenanceDue,
 *   :photos,
 *   :documents,
 *   :notes
 * )
 * RETURNING *
 * ```
 */
export const createMaintenanceLog = new PreparedQuery<CreateMaintenanceLogParams,CreateMaintenanceLogResult>(createMaintenanceLogIR);


/** 'GetMaintenanceLogs' parameters type */
export interface GetMaintenanceLogsParams {
  branchId: string;
  limit?: NumberOrString | null | void;
}

/** 'GetMaintenanceLogs' return type */
export interface GetMaintenanceLogsResult {
  branch_id: string;
  condition_after: string | null;
  condition_before: string | null;
  created_at: Date | null;
  description: string;
  documents: Json | null;
  equipment_id: string;
  equipment_name: string | null;
  equipment_number: string;
  equipment_type_name: string;
  external_service_provider: string | null;
  id: string;
  labor_hours: string | null;
  maintenance_date: Date;
  maintenance_type: string;
  next_maintenance_due: Date | null;
  notes: string | null;
  parts_replaced: Json | null;
  performed_by: string | null;
  performed_by_first_name: string | null;
  performed_by_last_name: string | null;
  photos: Json | null;
  total_cost: string | null;
}

/** 'GetMaintenanceLogs' query type */
export interface GetMaintenanceLogsQuery {
  params: GetMaintenanceLogsParams;
  result: GetMaintenanceLogsResult;
}

const getMaintenanceLogsIR: any = {"usedParamSet":{"branchId":true,"limit":true},"params":[{"name":"branchId","required":true,"transform":{"type":"scalar"},"locs":[{"a":386,"b":395}]},{"name":"limit","required":false,"transform":{"type":"scalar"},"locs":[{"a":438,"b":443}]}],"statement":"SELECT\n  eml.*,\n  e.equipment_number,\n  e.name as equipment_name,\n  et.name as equipment_type_name,\n  u.first_name as performed_by_first_name,\n  u.last_name as performed_by_last_name\nFROM equipment_maintenance_logs eml\nJOIN equipment e ON eml.equipment_id = e.id\nJOIN equipment_types et ON e.equipment_type_id = et.id\nLEFT JOIN \"user\" u ON eml.performed_by = u.id\nWHERE eml.branch_id = :branchId!\nORDER BY eml.maintenance_date DESC\nLIMIT :limit"};

/**
 * Query generated from SQL:
 * ```
 * SELECT
 *   eml.*,
 *   e.equipment_number,
 *   e.name as equipment_name,
 *   et.name as equipment_type_name,
 *   u.first_name as performed_by_first_name,
 *   u.last_name as performed_by_last_name
 * FROM equipment_maintenance_logs eml
 * JOIN equipment e ON eml.equipment_id = e.id
 * JOIN equipment_types et ON e.equipment_type_id = et.id
 * LEFT JOIN "user" u ON eml.performed_by = u.id
 * WHERE eml.branch_id = :branchId!
 * ORDER BY eml.maintenance_date DESC
 * LIMIT :limit
 * ```
 */
export const getMaintenanceLogs = new PreparedQuery<GetMaintenanceLogsParams,GetMaintenanceLogsResult>(getMaintenanceLogsIR);


/** 'GetEquipmentMaintenanceHistory' parameters type */
export interface GetEquipmentMaintenanceHistoryParams {
  branchId: string;
  equipmentId: string;
}

/** 'GetEquipmentMaintenanceHistory' return type */
export interface GetEquipmentMaintenanceHistoryResult {
  branch_id: string;
  condition_after: string | null;
  condition_before: string | null;
  created_at: Date | null;
  description: string;
  documents: Json | null;
  equipment_id: string;
  external_service_provider: string | null;
  id: string;
  labor_hours: string | null;
  maintenance_date: Date;
  maintenance_type: string;
  next_maintenance_due: Date | null;
  notes: string | null;
  parts_replaced: Json | null;
  performed_by: string | null;
  performed_by_first_name: string | null;
  performed_by_last_name: string | null;
  photos: Json | null;
  total_cost: string | null;
}

/** 'GetEquipmentMaintenanceHistory' query type */
export interface GetEquipmentMaintenanceHistoryQuery {
  params: GetEquipmentMaintenanceHistoryParams;
  result: GetEquipmentMaintenanceHistoryResult;
}

const getEquipmentMaintenanceHistoryIR: any = {"usedParamSet":{"equipmentId":true,"branchId":true},"params":[{"name":"equipmentId","required":true,"transform":{"type":"scalar"},"locs":[{"a":206,"b":218}]},{"name":"branchId","required":true,"transform":{"type":"scalar"},"locs":[{"a":242,"b":251}]}],"statement":"SELECT\n  eml.*,\n  u.first_name as performed_by_first_name,\n  u.last_name as performed_by_last_name\nFROM equipment_maintenance_logs eml\nLEFT JOIN \"user\" u ON eml.performed_by = u.id\nWHERE eml.equipment_id = :equipmentId!\n  AND eml.branch_id = :branchId!\nORDER BY eml.maintenance_date DESC"};

/**
 * Query generated from SQL:
 * ```
 * SELECT
 *   eml.*,
 *   u.first_name as performed_by_first_name,
 *   u.last_name as performed_by_last_name
 * FROM equipment_maintenance_logs eml
 * LEFT JOIN "user" u ON eml.performed_by = u.id
 * WHERE eml.equipment_id = :equipmentId!
 *   AND eml.branch_id = :branchId!
 * ORDER BY eml.maintenance_date DESC
 * ```
 */
export const getEquipmentMaintenanceHistory = new PreparedQuery<GetEquipmentMaintenanceHistoryParams,GetEquipmentMaintenanceHistoryResult>(getEquipmentMaintenanceHistoryIR);


/** 'GetUpcomingMaintenance' parameters type */
export interface GetUpcomingMaintenanceParams {
  branchId: string;
  endDate: DateOrString;
}

/** 'GetUpcomingMaintenance' return type */
export interface GetUpcomingMaintenanceResult {
  branch_id: string;
  condition: string | null;
  created_at: Date | null;
  equipment_number: string;
  equipment_type_id: string;
  equipment_type_name: string;
  features: stringArray | null;
  id: string;
  internal_notes: string | null;
  last_maintenance_date: Date | null;
  location: string | null;
  maintenance_interval_days: number | null;
  manufacturer: string | null;
  model: string | null;
  name: string | null;
  next_maintenance_due: Date | null;
  notes: string | null;
  purchase_date: Date | null;
  purchase_price: string | null;
  serial_number: string | null;
  specifications: Json | null;
  status: string | null;
  total_usage_hours: string | null;
  updated_at: Date | null;
}

/** 'GetUpcomingMaintenance' query type */
export interface GetUpcomingMaintenanceQuery {
  params: GetUpcomingMaintenanceParams;
  result: GetUpcomingMaintenanceResult;
}

const getUpcomingMaintenanceIR: any = {"usedParamSet":{"branchId":true,"endDate":true},"params":[{"name":"branchId","required":true,"transform":{"type":"scalar"},"locs":[{"a":139,"b":148}]},{"name":"endDate","required":true,"transform":{"type":"scalar"},"locs":[{"a":223,"b":231}]}],"statement":"SELECT\n  e.*,\n  et.name as equipment_type_name\nFROM equipment e\nJOIN equipment_types et ON e.equipment_type_id = et.id\nWHERE e.branch_id = :branchId!\n  AND e.next_maintenance_due IS NOT NULL\n  AND e.next_maintenance_due <= :endDate!\nORDER BY e.next_maintenance_due"};

/**
 * Query generated from SQL:
 * ```
 * SELECT
 *   e.*,
 *   et.name as equipment_type_name
 * FROM equipment e
 * JOIN equipment_types et ON e.equipment_type_id = et.id
 * WHERE e.branch_id = :branchId!
 *   AND e.next_maintenance_due IS NOT NULL
 *   AND e.next_maintenance_due <= :endDate!
 * ORDER BY e.next_maintenance_due
 * ```
 */
export const getUpcomingMaintenance = new PreparedQuery<GetUpcomingMaintenanceParams,GetUpcomingMaintenanceResult>(getUpcomingMaintenanceIR);


/** 'ScheduleMaintenance' parameters type */
export interface ScheduleMaintenanceParams {
  durationDays: number;
  equipmentId: string;
  maintenanceDate: DateOrString;
}

/** 'ScheduleMaintenance' return type */
export interface ScheduleMaintenanceResult {
  success: boolean | null;
}

/** 'ScheduleMaintenance' query type */
export interface ScheduleMaintenanceQuery {
  params: ScheduleMaintenanceParams;
  result: ScheduleMaintenanceResult;
}

const scheduleMaintenanceIR: any = {"usedParamSet":{"equipmentId":true,"maintenanceDate":true,"durationDays":true},"params":[{"name":"equipmentId","required":true,"transform":{"type":"scalar"},"locs":[{"a":38,"b":50}]},{"name":"maintenanceDate","required":true,"transform":{"type":"scalar"},"locs":[{"a":53,"b":69}]},{"name":"durationDays","required":true,"transform":{"type":"scalar"},"locs":[{"a":72,"b":85}]}],"statement":"SELECT schedule_equipment_maintenance(:equipmentId!, :maintenanceDate!, :durationDays!) as success"};

/**
 * Query generated from SQL:
 * ```
 * SELECT schedule_equipment_maintenance(:equipmentId!, :maintenanceDate!, :durationDays!) as success
 * ```
 */
export const scheduleMaintenance = new PreparedQuery<ScheduleMaintenanceParams,ScheduleMaintenanceResult>(scheduleMaintenanceIR);


/** 'CreateEquipmentIssue' parameters type */
export interface CreateEquipmentIssueParams {
  branchId: string;
  description: string;
  equipmentId: string;
  issueType: string;
  photos?: Json | null | void;
  reportedBy: string;
  severity: string;
  status: string;
  title: string;
}

/** 'CreateEquipmentIssue' return type */
export interface CreateEquipmentIssueResult {
  assigned_to: string | null;
  branch_id: string;
  created_at: Date | null;
  description: string;
  equipment_id: string;
  id: string;
  issue_type: string | null;
  maintenance_log_id: string | null;
  photos: Json | null;
  reported_at: Date | null;
  reported_by: string;
  resolution_notes: string | null;
  resolved_at: Date | null;
  resolved_by: string | null;
  severity: string | null;
  status: string | null;
  title: string;
  updated_at: Date | null;
}

/** 'CreateEquipmentIssue' query type */
export interface CreateEquipmentIssueQuery {
  params: CreateEquipmentIssueParams;
  result: CreateEquipmentIssueResult;
}

const createEquipmentIssueIR: any = {"usedParamSet":{"equipmentId":true,"branchId":true,"reportedBy":true,"issueType":true,"severity":true,"title":true,"description":true,"photos":true,"status":true},"params":[{"name":"equipmentId","required":true,"transform":{"type":"scalar"},"locs":[{"a":157,"b":169}]},{"name":"branchId","required":true,"transform":{"type":"scalar"},"locs":[{"a":174,"b":183}]},{"name":"reportedBy","required":true,"transform":{"type":"scalar"},"locs":[{"a":188,"b":199}]},{"name":"issueType","required":true,"transform":{"type":"scalar"},"locs":[{"a":204,"b":214}]},{"name":"severity","required":true,"transform":{"type":"scalar"},"locs":[{"a":219,"b":228}]},{"name":"title","required":true,"transform":{"type":"scalar"},"locs":[{"a":233,"b":239}]},{"name":"description","required":true,"transform":{"type":"scalar"},"locs":[{"a":244,"b":256}]},{"name":"photos","required":false,"transform":{"type":"scalar"},"locs":[{"a":261,"b":267}]},{"name":"status","required":true,"transform":{"type":"scalar"},"locs":[{"a":272,"b":279}]}],"statement":"INSERT INTO equipment_issues (\n  equipment_id,\n  branch_id,\n  reported_by,\n  issue_type,\n  severity,\n  title,\n  description,\n  photos,\n  status\n) VALUES (\n  :equipmentId!,\n  :branchId!,\n  :reportedBy!,\n  :issueType!,\n  :severity!,\n  :title!,\n  :description!,\n  :photos,\n  :status!\n)\nRETURNING *"};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO equipment_issues (
 *   equipment_id,
 *   branch_id,
 *   reported_by,
 *   issue_type,
 *   severity,
 *   title,
 *   description,
 *   photos,
 *   status
 * ) VALUES (
 *   :equipmentId!,
 *   :branchId!,
 *   :reportedBy!,
 *   :issueType!,
 *   :severity!,
 *   :title!,
 *   :description!,
 *   :photos,
 *   :status!
 * )
 * RETURNING *
 * ```
 */
export const createEquipmentIssue = new PreparedQuery<CreateEquipmentIssueParams,CreateEquipmentIssueResult>(createEquipmentIssueIR);


/** 'GetEquipmentIssues' parameters type */
export interface GetEquipmentIssuesParams {
  branchId: string;
}

/** 'GetEquipmentIssues' return type */
export interface GetEquipmentIssuesResult {
  assigned_to: string | null;
  assigned_to_first_name: string | null;
  assigned_to_last_name: string | null;
  branch_id: string;
  created_at: Date | null;
  description: string;
  equipment_id: string;
  equipment_name: string | null;
  equipment_number: string;
  equipment_type_name: string;
  id: string;
  issue_type: string | null;
  maintenance_log_id: string | null;
  photos: Json | null;
  reported_at: Date | null;
  reported_by: string;
  reported_by_first_name: string | null;
  reported_by_last_name: string | null;
  resolution_notes: string | null;
  resolved_at: Date | null;
  resolved_by: string | null;
  severity: string | null;
  status: string | null;
  title: string;
  updated_at: Date | null;
}

/** 'GetEquipmentIssues' query type */
export interface GetEquipmentIssuesQuery {
  params: GetEquipmentIssuesParams;
  result: GetEquipmentIssuesResult;
}

const getEquipmentIssuesIR: any = {"usedParamSet":{"branchId":true},"params":[{"name":"branchId","required":true,"transform":{"type":"scalar"},"locs":[{"a":497,"b":506}]}],"statement":"SELECT\n  ei.*,\n  e.equipment_number,\n  e.name as equipment_name,\n  et.name as equipment_type_name,\n  u1.first_name as reported_by_first_name,\n  u1.last_name as reported_by_last_name,\n  u2.first_name as assigned_to_first_name,\n  u2.last_name as assigned_to_last_name\nFROM equipment_issues ei\nJOIN equipment e ON ei.equipment_id = e.id\nJOIN equipment_types et ON e.equipment_type_id = et.id\nJOIN \"user\" u1 ON ei.reported_by = u1.id\nLEFT JOIN \"user\" u2 ON ei.assigned_to = u2.id\nWHERE ei.branch_id = :branchId!\n  AND ei.status IN ('open', 'acknowledged', 'in_progress')\nORDER BY ei.severity DESC, ei.reported_at"};

/**
 * Query generated from SQL:
 * ```
 * SELECT
 *   ei.*,
 *   e.equipment_number,
 *   e.name as equipment_name,
 *   et.name as equipment_type_name,
 *   u1.first_name as reported_by_first_name,
 *   u1.last_name as reported_by_last_name,
 *   u2.first_name as assigned_to_first_name,
 *   u2.last_name as assigned_to_last_name
 * FROM equipment_issues ei
 * JOIN equipment e ON ei.equipment_id = e.id
 * JOIN equipment_types et ON e.equipment_type_id = et.id
 * JOIN "user" u1 ON ei.reported_by = u1.id
 * LEFT JOIN "user" u2 ON ei.assigned_to = u2.id
 * WHERE ei.branch_id = :branchId!
 *   AND ei.status IN ('open', 'acknowledged', 'in_progress')
 * ORDER BY ei.severity DESC, ei.reported_at
 * ```
 */
export const getEquipmentIssues = new PreparedQuery<GetEquipmentIssuesParams,GetEquipmentIssuesResult>(getEquipmentIssuesIR);


/** 'GetEquipmentIssuesByEquipment' parameters type */
export interface GetEquipmentIssuesByEquipmentParams {
  branchId: string;
  equipmentId: string;
}

/** 'GetEquipmentIssuesByEquipment' return type */
export interface GetEquipmentIssuesByEquipmentResult {
  assigned_to: string | null;
  branch_id: string;
  created_at: Date | null;
  description: string;
  equipment_id: string;
  id: string;
  issue_type: string | null;
  maintenance_log_id: string | null;
  photos: Json | null;
  reported_at: Date | null;
  reported_by: string;
  reported_by_first_name: string | null;
  reported_by_last_name: string | null;
  resolution_notes: string | null;
  resolved_at: Date | null;
  resolved_by: string | null;
  resolved_by_first_name: string | null;
  resolved_by_last_name: string | null;
  severity: string | null;
  status: string | null;
  title: string;
  updated_at: Date | null;
}

/** 'GetEquipmentIssuesByEquipment' query type */
export interface GetEquipmentIssuesByEquipmentQuery {
  params: GetEquipmentIssuesByEquipmentParams;
  result: GetEquipmentIssuesByEquipmentResult;
}

const getEquipmentIssuesByEquipmentIR: any = {"usedParamSet":{"equipmentId":true,"branchId":true},"params":[{"name":"equipmentId","required":true,"transform":{"type":"scalar"},"locs":[{"a":318,"b":330}]},{"name":"branchId","required":true,"transform":{"type":"scalar"},"locs":[{"a":353,"b":362}]}],"statement":"SELECT\n  ei.*,\n  u1.first_name as reported_by_first_name,\n  u1.last_name as reported_by_last_name,\n  u2.first_name as resolved_by_first_name,\n  u2.last_name as resolved_by_last_name\nFROM equipment_issues ei\nJOIN \"user\" u1 ON ei.reported_by = u1.id\nLEFT JOIN \"user\" u2 ON ei.resolved_by = u2.id\nWHERE ei.equipment_id = :equipmentId!\n  AND ei.branch_id = :branchId!\nORDER BY ei.reported_at DESC"};

/**
 * Query generated from SQL:
 * ```
 * SELECT
 *   ei.*,
 *   u1.first_name as reported_by_first_name,
 *   u1.last_name as reported_by_last_name,
 *   u2.first_name as resolved_by_first_name,
 *   u2.last_name as resolved_by_last_name
 * FROM equipment_issues ei
 * JOIN "user" u1 ON ei.reported_by = u1.id
 * LEFT JOIN "user" u2 ON ei.resolved_by = u2.id
 * WHERE ei.equipment_id = :equipmentId!
 *   AND ei.branch_id = :branchId!
 * ORDER BY ei.reported_at DESC
 * ```
 */
export const getEquipmentIssuesByEquipment = new PreparedQuery<GetEquipmentIssuesByEquipmentParams,GetEquipmentIssuesByEquipmentResult>(getEquipmentIssuesByEquipmentIR);


/** 'UpdateEquipmentIssue' parameters type */
export interface UpdateEquipmentIssueParams {
  assignedTo?: string | null | void;
  branchId: string;
  issueId: string;
  maintenanceLogId?: string | null | void;
  resolutionNotes?: string | null | void;
  resolvedAt?: DateOrString | null | void;
  resolvedBy?: string | null | void;
  status: string;
}

/** 'UpdateEquipmentIssue' return type */
export interface UpdateEquipmentIssueResult {
  assigned_to: string | null;
  branch_id: string;
  created_at: Date | null;
  description: string;
  equipment_id: string;
  id: string;
  issue_type: string | null;
  maintenance_log_id: string | null;
  photos: Json | null;
  reported_at: Date | null;
  reported_by: string;
  resolution_notes: string | null;
  resolved_at: Date | null;
  resolved_by: string | null;
  severity: string | null;
  status: string | null;
  title: string;
  updated_at: Date | null;
}

/** 'UpdateEquipmentIssue' query type */
export interface UpdateEquipmentIssueQuery {
  params: UpdateEquipmentIssueParams;
  result: UpdateEquipmentIssueResult;
}

const updateEquipmentIssueIR: any = {"usedParamSet":{"status":true,"assignedTo":true,"resolutionNotes":true,"resolvedBy":true,"resolvedAt":true,"maintenanceLogId":true,"issueId":true,"branchId":true},"params":[{"name":"status","required":true,"transform":{"type":"scalar"},"locs":[{"a":39,"b":46}]},{"name":"assignedTo","required":false,"transform":{"type":"scalar"},"locs":[{"a":65,"b":75}]},{"name":"resolutionNotes","required":false,"transform":{"type":"scalar"},"locs":[{"a":99,"b":114}]},{"name":"resolvedBy","required":false,"transform":{"type":"scalar"},"locs":[{"a":133,"b":143}]},{"name":"resolvedAt","required":false,"transform":{"type":"scalar"},"locs":[{"a":162,"b":172}]},{"name":"maintenanceLogId","required":false,"transform":{"type":"scalar"},"locs":[{"a":198,"b":214}]},{"name":"issueId","required":true,"transform":{"type":"scalar"},"locs":[{"a":227,"b":235}]},{"name":"branchId","required":true,"transform":{"type":"scalar"},"locs":[{"a":255,"b":264}]}],"statement":"UPDATE equipment_issues\nSET\n  status = :status!,\n  assigned_to = :assignedTo,\n  resolution_notes = :resolutionNotes,\n  resolved_by = :resolvedBy,\n  resolved_at = :resolvedAt,\n  maintenance_log_id = :maintenanceLogId\nWHERE id = :issueId!\n  AND branch_id = :branchId!\nRETURNING *"};

/**
 * Query generated from SQL:
 * ```
 * UPDATE equipment_issues
 * SET
 *   status = :status!,
 *   assigned_to = :assignedTo,
 *   resolution_notes = :resolutionNotes,
 *   resolved_by = :resolvedBy,
 *   resolved_at = :resolvedAt,
 *   maintenance_log_id = :maintenanceLogId
 * WHERE id = :issueId!
 *   AND branch_id = :branchId!
 * RETURNING *
 * ```
 */
export const updateEquipmentIssue = new PreparedQuery<UpdateEquipmentIssueParams,UpdateEquipmentIssueResult>(updateEquipmentIssueIR);


/** 'GetEquipmentUtilizationStats' parameters type */
export interface GetEquipmentUtilizationStatsParams {
  branchId: string;
  endDate: DateOrString;
  startDate: DateOrString;
}

/** 'GetEquipmentUtilizationStats' return type */
export interface GetEquipmentUtilizationStatsResult {
  avg_usage_per_class: string | null;
  equipment_id: string | null;
  equipment_number: string | null;
  equipment_type: string | null;
  total_assignments: string | null;
  total_usage_hours: string | null;
  utilization_rate: string | null;
}

/** 'GetEquipmentUtilizationStats' query type */
export interface GetEquipmentUtilizationStatsQuery {
  params: GetEquipmentUtilizationStatsParams;
  result: GetEquipmentUtilizationStatsResult;
}

const getEquipmentUtilizationStatsIR: any = {"usedParamSet":{"branchId":true,"startDate":true,"endDate":true},"params":[{"name":"branchId","required":true,"transform":{"type":"scalar"},"locs":[{"a":182,"b":191}]},{"name":"startDate","required":true,"transform":{"type":"scalar"},"locs":[{"a":194,"b":204}]},{"name":"endDate","required":true,"transform":{"type":"scalar"},"locs":[{"a":207,"b":215}]}],"statement":"SELECT\n  equipment_id,\n  equipment_number,\n  equipment_type,\n  total_assignments,\n  total_usage_hours,\n  avg_usage_per_class,\n  utilization_rate\nFROM get_equipment_utilization_stats(:branchId!, :startDate!, :endDate!)"};

/**
 * Query generated from SQL:
 * ```
 * SELECT
 *   equipment_id,
 *   equipment_number,
 *   equipment_type,
 *   total_assignments,
 *   total_usage_hours,
 *   avg_usage_per_class,
 *   utilization_rate
 * FROM get_equipment_utilization_stats(:branchId!, :startDate!, :endDate!)
 * ```
 */
export const getEquipmentUtilizationStats = new PreparedQuery<GetEquipmentUtilizationStatsParams,GetEquipmentUtilizationStatsResult>(getEquipmentUtilizationStatsIR);


/** 'GetEquipmentSummary' parameters type */
export interface GetEquipmentSummaryParams {
  branchId: string;
}

/** 'GetEquipmentSummary' return type */
export interface GetEquipmentSummaryResult {
  available_count: string | null;
  equipment_type: string;
  in_use_count: string | null;
  maintenance_count: string | null;
  open_issues_count: string | null;
  out_of_service_count: string | null;
  total_equipment: string | null;
}

/** 'GetEquipmentSummary' query type */
export interface GetEquipmentSummaryQuery {
  params: GetEquipmentSummaryParams;
  result: GetEquipmentSummaryResult;
}

const getEquipmentSummaryIR: any = {"usedParamSet":{"branchId":true},"params":[{"name":"branchId","required":true,"transform":{"type":"scalar"},"locs":[{"a":565,"b":574},{"a":653,"b":662}]}],"statement":"SELECT\n  et.name as equipment_type,\n  COUNT(e.id) as total_equipment,\n  COUNT(e.id) FILTER (WHERE e.status = 'available') as available_count,\n  COUNT(e.id) FILTER (WHERE e.status = 'in_use') as in_use_count,\n  COUNT(e.id) FILTER (WHERE e.status = 'maintenance') as maintenance_count,\n  COUNT(e.id) FILTER (WHERE e.status = 'out_of_service') as out_of_service_count,\n  COUNT(ei.id) FILTER (WHERE ei.status IN ('open', 'acknowledged', 'in_progress')) as open_issues_count\nFROM equipment_types et\nLEFT JOIN equipment e ON et.id = e.equipment_type_id AND e.branch_id = :branchId!\nLEFT JOIN equipment_issues ei ON e.id = ei.equipment_id\nWHERE et.branch_id = :branchId!\nGROUP BY et.id, et.name\nORDER BY et.name"};

/**
 * Query generated from SQL:
 * ```
 * SELECT
 *   et.name as equipment_type,
 *   COUNT(e.id) as total_equipment,
 *   COUNT(e.id) FILTER (WHERE e.status = 'available') as available_count,
 *   COUNT(e.id) FILTER (WHERE e.status = 'in_use') as in_use_count,
 *   COUNT(e.id) FILTER (WHERE e.status = 'maintenance') as maintenance_count,
 *   COUNT(e.id) FILTER (WHERE e.status = 'out_of_service') as out_of_service_count,
 *   COUNT(ei.id) FILTER (WHERE ei.status IN ('open', 'acknowledged', 'in_progress')) as open_issues_count
 * FROM equipment_types et
 * LEFT JOIN equipment e ON et.id = e.equipment_type_id AND e.branch_id = :branchId!
 * LEFT JOIN equipment_issues ei ON e.id = ei.equipment_id
 * WHERE et.branch_id = :branchId!
 * GROUP BY et.id, et.name
 * ORDER BY et.name
 * ```
 */
export const getEquipmentSummary = new PreparedQuery<GetEquipmentSummaryParams,GetEquipmentSummaryResult>(getEquipmentSummaryIR);


