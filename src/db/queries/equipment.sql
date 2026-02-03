/* @name CreateEquipmentType */
INSERT INTO equipment_types (
  branch_id,
  name,
  description,
  icon,
  requires_assignment
) VALUES (
  :branchId!,
  :name!,
  :description,
  :icon,
  :requiresAssignment!
)
RETURNING *;

/* @name GetEquipmentTypes */
SELECT
  id,
  branch_id,
  name,
  description,
  icon,
  requires_assignment,
  created_at
FROM equipment_types
WHERE branch_id = :branchId!
ORDER BY name;

/* @name CreateEquipment */
INSERT INTO equipment (
  branch_id,
  equipment_type_id,
  equipment_number,
  name,
  serial_number,
  manufacturer,
  model,
  purchase_date,
  purchase_price,
  status,
  condition,
  location,
  specifications,
  features,
  maintenance_interval_days,
  notes,
  internal_notes
) VALUES (
  :branchId!,
  :equipmentTypeId!,
  :equipmentNumber!,
  :name,
  :serialNumber,
  :manufacturer,
  :model,
  :purchaseDate,
  :purchasePrice,
  :status!,
  :condition,
  :location,
  :specifications,
  :features,
  :maintenanceIntervalDays,
  :notes,
  :internalNotes
)
RETURNING *;

/* @name GetEquipment */
SELECT
  e.*,
  et.name as equipment_type_name,
  et.requires_assignment
FROM equipment e
JOIN equipment_types et ON e.equipment_type_id = et.id
WHERE e.branch_id = :branchId!
ORDER BY e.equipment_number;

/* @name GetEquipmentById */
SELECT
  e.*,
  et.name as equipment_type_name,
  et.requires_assignment
FROM equipment e
JOIN equipment_types et ON e.equipment_type_id = et.id
WHERE e.id = :equipmentId!
  AND e.branch_id = :branchId!;

/* @name GetEquipmentByType */
SELECT
  e.*,
  et.name as equipment_type_name
FROM equipment e
JOIN equipment_types et ON e.equipment_type_id = et.id
WHERE e.equipment_type_id = :equipmentTypeId!
  AND e.branch_id = :branchId!
ORDER BY e.equipment_number;

/* @name GetAvailableEquipment */
SELECT
  e.*,
  et.name as equipment_type_name
FROM equipment e
JOIN equipment_types et ON e.equipment_type_id = et.id
WHERE e.branch_id = :branchId!
  AND e.status = 'available'
  AND NOT EXISTS (
    SELECT 1 FROM equipment_issues ei
    WHERE ei.equipment_id = e.id
      AND ei.status IN ('open', 'acknowledged', 'in_progress')
      AND ei.severity IN ('high', 'critical')
  )
ORDER BY e.equipment_number;

/* @name UpdateEquipment */
UPDATE equipment
SET
  name = :name,
  status = :status!,
  condition = :condition,
  location = :location,
  specifications = :specifications,
  features = :features,
  maintenance_interval_days = :maintenanceIntervalDays,
  notes = :notes,
  internal_notes = :internalNotes
WHERE id = :equipmentId!
  AND branch_id = :branchId!
RETURNING *;

/* @name UpdateEquipmentStatus */
UPDATE equipment
SET status = :status!
WHERE id = :equipmentId!
  AND branch_id = :branchId!
RETURNING *;

/* @name RecordMaintenanceDate */
UPDATE equipment
SET
  last_maintenance_date = :maintenanceDate!,
  next_maintenance_due = :nextMaintenanceDue!
WHERE id = :equipmentId!
  AND branch_id = :branchId!
RETURNING *;

/* @name GetAvailableEquipmentForClass */
SELECT
  equipment_id,
  equipment_number,
  equipment_name,
  condition,
  is_preferred
FROM get_available_equipment_for_class(:classId!, :equipmentTypeId!);

/* @name CreateEquipmentAssignment */
INSERT INTO equipment_assignments (
  equipment_id,
  class_id,
  user_id,
  branch_id,
  booking_id,
  assigned_by,
  assignment_type,
  status
) VALUES (
  :equipmentId!,
  :classId!,
  :userId!,
  :branchId!,
  :bookingId,
  :assignedBy,
  :assignmentType!,
  :status!
)
RETURNING *;

/* @name AutoAssignEquipment */
SELECT auto_assign_equipment(:classId!, :userId!, :equipmentTypeId!) as equipment_id;

/* @name GetClassEquipmentAssignments */
SELECT
  ea.*,
  e.equipment_number,
  e.name as equipment_name,
  et.name as equipment_type_name,
  u.first_name,
  u.last_name
FROM equipment_assignments ea
JOIN equipment e ON ea.equipment_id = e.id
JOIN equipment_types et ON e.equipment_type_id = et.id
JOIN "user" u ON ea.user_id = u.id
WHERE ea.class_id = :classId!
  AND ea.branch_id = :branchId!
ORDER BY e.equipment_number;

/* @name GetUserEquipmentAssignment */
SELECT
  ea.*,
  e.equipment_number,
  e.name as equipment_name,
  et.name as equipment_type_name
FROM equipment_assignments ea
JOIN equipment e ON ea.equipment_id = e.id
JOIN equipment_types et ON e.equipment_type_id = et.id
WHERE ea.class_id = :classId!
  AND ea.user_id = :userId!
  AND ea.branch_id = :branchId!;

/* @name UpdateAssignmentStatus */
UPDATE equipment_assignments
SET status = :status!
WHERE id = :assignmentId!
  AND branch_id = :branchId!
RETURNING *;

/* @name CheckInEquipment */
UPDATE equipment_assignments
SET
  status = 'checked_in',
  checked_in_at = CURRENT_TIMESTAMP
WHERE id = :assignmentId!
  AND branch_id = :branchId!
RETURNING *;

/* @name CheckOutEquipment */
UPDATE equipment_assignments
SET
  status = 'completed',
  checked_out_at = CURRENT_TIMESTAMP,
  usage_duration_minutes = EXTRACT(EPOCH FROM (CURRENT_TIMESTAMP - checked_in_at)) / 60
WHERE id = :assignmentId!
  AND branch_id = :branchId!
RETURNING *;

/* @name CreateEquipmentPreference */
INSERT INTO client_equipment_preferences (
  user_id,
  branch_id,
  equipment_type_id,
  preferred_equipment_ids,
  avoid_equipment_ids,
  auto_assign_preferred,
  notes
) VALUES (
  :userId!,
  :branchId!,
  :equipmentTypeId!,
  :preferredEquipmentIds,
  :avoidEquipmentIds,
  :autoAssignPreferred!,
  :notes
)
ON CONFLICT (user_id, equipment_type_id) DO UPDATE SET
  preferred_equipment_ids = EXCLUDED.preferred_equipment_ids,
  avoid_equipment_ids = EXCLUDED.avoid_equipment_ids,
  auto_assign_preferred = EXCLUDED.auto_assign_preferred,
  notes = EXCLUDED.notes,
  updated_at = CURRENT_TIMESTAMP
RETURNING *;

/* @name GetUserEquipmentPreferences */
SELECT
  cep.*,
  et.name as equipment_type_name
FROM client_equipment_preferences cep
JOIN equipment_types et ON cep.equipment_type_id = et.id
WHERE cep.user_id = :userId!
  AND cep.branch_id = :branchId!;

/* @name CreateMaintenanceLog */
INSERT INTO equipment_maintenance_logs (
  equipment_id,
  branch_id,
  maintenance_date,
  maintenance_type,
  performed_by,
  external_service_provider,
  description,
  parts_replaced,
  labor_hours,
  total_cost,
  condition_before,
  condition_after,
  next_maintenance_due,
  photos,
  documents,
  notes
) VALUES (
  :equipmentId!,
  :branchId!,
  :maintenanceDate!,
  :maintenanceType!,
  :performedBy,
  :externalServiceProvider,
  :description!,
  :partsReplaced,
  :laborHours,
  :totalCost,
  :conditionBefore,
  :conditionAfter,
  :nextMaintenanceDue,
  :photos,
  :documents,
  :notes
)
RETURNING *;

/* @name GetMaintenanceLogs */
SELECT
  eml.*,
  e.equipment_number,
  e.name as equipment_name,
  et.name as equipment_type_name,
  u.first_name as performed_by_first_name,
  u.last_name as performed_by_last_name
FROM equipment_maintenance_logs eml
JOIN equipment e ON eml.equipment_id = e.id
JOIN equipment_types et ON e.equipment_type_id = et.id
LEFT JOIN "user" u ON eml.performed_by = u.id
WHERE eml.branch_id = :branchId!
ORDER BY eml.maintenance_date DESC
LIMIT :limit;

/* @name GetEquipmentMaintenanceHistory */
SELECT
  eml.*,
  u.first_name as performed_by_first_name,
  u.last_name as performed_by_last_name
FROM equipment_maintenance_logs eml
LEFT JOIN "user" u ON eml.performed_by = u.id
WHERE eml.equipment_id = :equipmentId!
  AND eml.branch_id = :branchId!
ORDER BY eml.maintenance_date DESC;

/* @name GetUpcomingMaintenance */
SELECT
  e.*,
  et.name as equipment_type_name
FROM equipment e
JOIN equipment_types et ON e.equipment_type_id = et.id
WHERE e.branch_id = :branchId!
  AND e.next_maintenance_due IS NOT NULL
  AND e.next_maintenance_due <= :endDate!
ORDER BY e.next_maintenance_due;

/* @name ScheduleMaintenance */
SELECT schedule_equipment_maintenance(:equipmentId!, :maintenanceDate!, :durationDays!) as success;

/* @name CreateEquipmentIssue */
INSERT INTO equipment_issues (
  equipment_id,
  branch_id,
  reported_by,
  issue_type,
  severity,
  title,
  description,
  photos,
  status
) VALUES (
  :equipmentId!,
  :branchId!,
  :reportedBy!,
  :issueType!,
  :severity!,
  :title!,
  :description!,
  :photos,
  :status!
)
RETURNING *;

/* @name GetEquipmentIssues */
SELECT
  ei.*,
  e.equipment_number,
  e.name as equipment_name,
  et.name as equipment_type_name,
  u1.first_name as reported_by_first_name,
  u1.last_name as reported_by_last_name,
  u2.first_name as assigned_to_first_name,
  u2.last_name as assigned_to_last_name
FROM equipment_issues ei
JOIN equipment e ON ei.equipment_id = e.id
JOIN equipment_types et ON e.equipment_type_id = et.id
JOIN "user" u1 ON ei.reported_by = u1.id
LEFT JOIN "user" u2 ON ei.assigned_to = u2.id
WHERE ei.branch_id = :branchId!
  AND ei.status IN ('open', 'acknowledged', 'in_progress')
ORDER BY ei.severity DESC, ei.reported_at;

/* @name GetEquipmentIssuesByEquipment */
SELECT
  ei.*,
  u1.first_name as reported_by_first_name,
  u1.last_name as reported_by_last_name,
  u2.first_name as resolved_by_first_name,
  u2.last_name as resolved_by_last_name
FROM equipment_issues ei
JOIN "user" u1 ON ei.reported_by = u1.id
LEFT JOIN "user" u2 ON ei.resolved_by = u2.id
WHERE ei.equipment_id = :equipmentId!
  AND ei.branch_id = :branchId!
ORDER BY ei.reported_at DESC;

/* @name UpdateEquipmentIssue */
UPDATE equipment_issues
SET
  status = :status!,
  assigned_to = :assignedTo,
  resolution_notes = :resolutionNotes,
  resolved_by = :resolvedBy,
  resolved_at = :resolvedAt,
  maintenance_log_id = :maintenanceLogId
WHERE id = :issueId!
  AND branch_id = :branchId!
RETURNING *;

/* @name GetEquipmentUtilizationStats */
SELECT
  equipment_id,
  equipment_number,
  equipment_type,
  total_assignments,
  total_usage_hours,
  avg_usage_per_class,
  utilization_rate
FROM get_equipment_utilization_stats(:branchId!, :startDate!, :endDate!);

/* @name GetEquipmentSummary */
SELECT
  et.name as equipment_type,
  COUNT(e.id) as total_equipment,
  COUNT(e.id) FILTER (WHERE e.status = 'available') as available_count,
  COUNT(e.id) FILTER (WHERE e.status = 'in_use') as in_use_count,
  COUNT(e.id) FILTER (WHERE e.status = 'maintenance') as maintenance_count,
  COUNT(e.id) FILTER (WHERE e.status = 'out_of_service') as out_of_service_count,
  COUNT(ei.id) FILTER (WHERE ei.status IN ('open', 'acknowledged', 'in_progress')) as open_issues_count
FROM equipment_types et
LEFT JOIN equipment e ON et.id = e.equipment_type_id AND e.branch_id = :branchId!
LEFT JOIN equipment_issues ei ON e.id = ei.equipment_id
WHERE et.branch_id = :branchId!
GROUP BY et.id, et.name
ORDER BY et.name;
