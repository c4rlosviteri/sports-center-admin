/* @name CreateHealthProfile */
INSERT INTO client_health_profiles (
  user_id,
  branch_id,
  medical_conditions,
  current_injuries,
  medications,
  allergies,
  fitness_level,
  fitness_goals,
  exercise_restrictions,
  height_cm,
  weight_kg,
  previous_injuries,
  surgery_history,
  medical_release_signed,
  medical_release_date,
  liability_waiver_signed,
  liability_waiver_date,
  doctor_name,
  doctor_phone,
  notes
) VALUES (
  :userId!,
  :branchId!,
  :medicalConditions,
  :currentInjuries,
  :medications,
  :allergies,
  :fitnessLevel,
  :fitnessGoals,
  :exerciseRestrictions,
  :heightCm,
  :weightKg,
  :previousInjuries,
  :surgeryHistory,
  :medicalReleaseSigned!,
  :medicalReleaseDate,
  :liabilityWaiverSigned!,
  :liabilityWaiverDate,
  :doctorName,
  :doctorPhone,
  :notes
)
ON CONFLICT (user_id) DO UPDATE SET
  medical_conditions = EXCLUDED.medical_conditions,
  current_injuries = EXCLUDED.current_injuries,
  medications = EXCLUDED.medications,
  allergies = EXCLUDED.allergies,
  fitness_level = EXCLUDED.fitness_level,
  fitness_goals = EXCLUDED.fitness_goals,
  exercise_restrictions = EXCLUDED.exercise_restrictions,
  height_cm = EXCLUDED.height_cm,
  weight_kg = EXCLUDED.weight_kg,
  previous_injuries = EXCLUDED.previous_injuries,
  surgery_history = EXCLUDED.surgery_history,
  medical_release_signed = EXCLUDED.medical_release_signed,
  medical_release_date = EXCLUDED.medical_release_date,
  liability_waiver_signed = EXCLUDED.liability_waiver_signed,
  liability_waiver_date = EXCLUDED.liability_waiver_date,
  doctor_name = EXCLUDED.doctor_name,
  doctor_phone = EXCLUDED.doctor_phone,
  notes = EXCLUDED.notes,
  updated_at = CURRENT_TIMESTAMP
RETURNING *;

/* @name GetHealthProfile */
SELECT *
FROM client_health_profiles
WHERE user_id = :userId!
  AND branch_id = :branchId!;

/* @name GetHealthSummaryForInstructor */
SELECT * FROM get_client_health_summary(:userId!);

/* @name CheckMedicalClearance */
SELECT has_medical_clearance(:userId!) as has_clearance;

/* @name CreateEmergencyContact */
INSERT INTO emergency_contacts (
  user_id,
  branch_id,
  contact_name,
  relationship,
  phone_primary,
  phone_secondary,
  email,
  is_primary,
  notes
) VALUES (
  :userId!,
  :branchId!,
  :contactName!,
  :relationship,
  :phonePrimary!,
  :phoneSecondary,
  :email,
  :isPrimary!,
  :notes
)
RETURNING *;

/* @name GetEmergencyContacts */
SELECT *
FROM emergency_contacts
WHERE user_id = :userId!
  AND branch_id = :branchId!
ORDER BY is_primary DESC, created_at;

/* @name UpdateEmergencyContact */
UPDATE emergency_contacts
SET
  contact_name = :contactName!,
  relationship = :relationship,
  phone_primary = :phonePrimary!,
  phone_secondary = :phoneSecondary,
  email = :email,
  is_primary = :isPrimary!,
  notes = :notes
WHERE id = :contactId!
  AND branch_id = :branchId!
RETURNING *;

/* @name DeleteEmergencyContact */
DELETE FROM emergency_contacts
WHERE id = :contactId!
  AND branch_id = :branchId!
RETURNING *;

/* @name SetPrimaryEmergencyContact */
UPDATE emergency_contacts
SET is_primary = CASE WHEN id = :contactId! THEN true ELSE false END
WHERE user_id = :userId!
  AND branch_id = :branchId!
RETURNING *;

/* @name CreateHealthAssessment */
INSERT INTO health_assessments (
  user_id,
  branch_id,
  assessment_date,
  conducted_by,
  resting_heart_rate,
  blood_pressure_systolic,
  blood_pressure_diastolic,
  weight_kg,
  body_fat_percentage,
  muscle_mass_kg,
  max_heart_rate,
  vo2_max,
  flexibility_score,
  strength_score,
  endurance_score,
  fitness_level,
  recommendations,
  goals_set,
  previous_assessment_id,
  notes
) VALUES (
  :userId!,
  :branchId!,
  :assessmentDate!,
  :conductedBy,
  :restingHeartRate,
  :bloodPressureSystolic,
  :bloodPressureDiastolic,
  :weightKg,
  :bodyFatPercentage,
  :muscleMassKg,
  :maxHeartRate,
  :vo2Max,
  :flexibilityScore,
  :strengthScore,
  :enduranceScore,
  :fitnessLevel,
  :recommendations,
  :goalsSet,
  :previousAssessmentId,
  :notes
)
RETURNING *;

/* @name GetHealthAssessments */
SELECT
  ha.*,
  u.first_name as conducted_by_first_name,
  u.last_name as conducted_by_last_name
FROM health_assessments ha
LEFT JOIN "user" u ON ha.conducted_by = u.id
WHERE ha.user_id = :userId!
  AND ha.branch_id = :branchId!
ORDER BY ha.assessment_date DESC
LIMIT :limit;

/* @name GetLatestHealthAssessment */
SELECT
  ha.*,
  u.first_name as conducted_by_first_name,
  u.last_name as conducted_by_last_name
FROM health_assessments ha
LEFT JOIN "user" u ON ha.conducted_by = u.id
WHERE ha.user_id = :userId!
  AND ha.branch_id = :branchId!
ORDER BY ha.assessment_date DESC
LIMIT 1;

/* @name CreateInjuryReport */
INSERT INTO injury_reports (
  user_id,
  branch_id,
  class_id,
  incident_date,
  injury_type,
  injury_location,
  severity,
  description,
  activity_at_time,
  first_aid_administered,
  first_aid_details,
  emergency_services_called,
  hospital_visit,
  reported_by,
  witnesses,
  follow_up_required,
  follow_up_notes
) VALUES (
  :userId!,
  :branchId!,
  :classId,
  :incidentDate!,
  :injuryType!,
  :injuryLocation,
  :severity,
  :description!,
  :activityAtTime,
  :firstAidAdministered!,
  :firstAidDetails,
  :emergencyServicesCalled!,
  :hospitalVisit!,
  :reportedBy!,
  :witnesses,
  :followUpRequired!,
  :followUpNotes
)
RETURNING *;

/* @name GetInjuryReports */
SELECT
  ir.*,
  u.first_name as reported_by_first_name,
  u.last_name as reported_by_last_name,
  c.scheduled_at as class_date,
  c.name as class_name
FROM injury_reports ir
JOIN "user" u ON ir.reported_by = u.id
LEFT JOIN classes c ON ir.class_id = c.id
WHERE ir.branch_id = :branchId!
  AND ir.incident_date >= :startDate!
ORDER BY ir.incident_date DESC
LIMIT :limit;

/* @name GetUserInjuryReports */
SELECT
  ir.*,
  u.first_name as reported_by_first_name,
  u.last_name as reported_by_last_name,
  c.scheduled_at as class_date,
  c.name as class_name
FROM injury_reports ir
JOIN "user" u ON ir.reported_by = u.id
LEFT JOIN classes c ON ir.class_id = c.id
WHERE ir.user_id = :userId!
  AND ir.branch_id = :branchId!
ORDER BY ir.incident_date DESC;

/* @name UpdateInjuryReport */
UPDATE injury_reports
SET
  follow_up_required = :followUpRequired!,
  follow_up_notes = :followUpNotes,
  cleared_to_return = :clearedToReturn!,
  cleared_date = :clearedDate,
  cleared_by = :clearedBy
WHERE id = :reportId!
  AND branch_id = :branchId!
RETURNING *;

/* @name CreateParqQuestionnaire */
INSERT INTO parq_questionnaires (
  user_id,
  branch_id,
  submission_date,
  heart_condition,
  chest_pain_activity,
  chest_pain_rest,
  dizziness_balance,
  bone_joint_problem,
  blood_pressure_medication,
  other_reason,
  other_reason_details,
  physician_approval_required,
  physician_approval_received,
  physician_approval_date,
  client_signature_data,
  staff_signature_data
) VALUES (
  :userId!,
  :branchId!,
  :submissionDate!,
  :heartCondition!,
  :chestPainActivity!,
  :chestPainRest!,
  :dizzinessBalance!,
  :boneJointProblem!,
  :bloodPressureMedication!,
  :otherReason!,
  :otherReasonDetails,
  :physicianApprovalRequired!,
  :physicianApprovalReceived!,
  :physicianApprovalDate,
  :clientSignatureData,
  :staffSignatureData
)
RETURNING *;

/* @name GetLatestParq */
SELECT *
FROM parq_questionnaires
WHERE user_id = :userId!
  AND branch_id = :branchId!
ORDER BY submission_date DESC
LIMIT 1;

/* @name UpdateParqApproval */
UPDATE parq_questionnaires
SET
  physician_approval_received = :physicianApprovalReceived!,
  physician_approval_date = :physicianApprovalDate
WHERE id = :parqId!
  AND branch_id = :branchId!
RETURNING *;

/* @name GetClientsRequiringMedicalClearance */
SELECT
  u.id as user_id,
  u.first_name,
  u.last_name,
  u.email,
  chp.medical_release_signed,
  chp.liability_waiver_signed,
  pq.physician_approval_required,
  pq.physician_approval_received
FROM "user" u
LEFT JOIN client_health_profiles chp ON u.id = chp.user_id
LEFT JOIN LATERAL (
  SELECT * FROM parq_questionnaires
  WHERE user_id = u.id
  ORDER BY submission_date DESC
  LIMIT 1
) pq ON true
WHERE u.branch_id = :branchId!
  AND u.role = 'client'
  AND (
    chp.medical_release_signed = false
    OR chp.liability_waiver_signed = false
    OR (pq.physician_approval_required = true AND pq.physician_approval_received = false)
  )
ORDER BY u.created_at DESC;
