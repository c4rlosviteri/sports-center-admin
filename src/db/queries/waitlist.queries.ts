/** Types generated for queries found in "src/db/queries/waitlist.sql" */
import { PreparedQuery } from '@pgtyped/runtime';

export type booking_status = 'cancelled' | 'confirmed' | 'waitlisted';

export type DateOrString = Date | string;

export type Json = null | boolean | number | string | Json[] | { [key: string]: Json };

export type NumberOrString = number | string;

/** 'CreateWaitlistNotification' parameters type */
export interface CreateWaitlistNotificationParams {
  bookingId: string;
  branchId: string;
  classId: string;
  metadata?: Json | null | void;
  notificationType: string;
  responseDeadline?: DateOrString | null | void;
  sentVia: string;
  status: string;
  userId: string;
}

/** 'CreateWaitlistNotification' return type */
export interface CreateWaitlistNotificationResult {
  booking_id: string;
  branch_id: string;
  class_id: string;
  created_at: Date | null;
  id: string;
  metadata: Json | null;
  notification_type: string;
  responded_at: Date | null;
  response_action: string | null;
  response_deadline: Date | null;
  sent_at: Date | null;
  sent_via: string | null;
  status: string | null;
  user_id: string;
}

/** 'CreateWaitlistNotification' query type */
export interface CreateWaitlistNotificationQuery {
  params: CreateWaitlistNotificationParams;
  result: CreateWaitlistNotificationResult;
}

const createWaitlistNotificationIR: any = {"usedParamSet":{"bookingId":true,"userId":true,"classId":true,"branchId":true,"notificationType":true,"sentVia":true,"status":true,"responseDeadline":true,"metadata":true},"params":[{"name":"bookingId","required":true,"transform":{"type":"scalar"},"locs":[{"a":175,"b":185}]},{"name":"userId","required":true,"transform":{"type":"scalar"},"locs":[{"a":190,"b":197}]},{"name":"classId","required":true,"transform":{"type":"scalar"},"locs":[{"a":202,"b":210}]},{"name":"branchId","required":true,"transform":{"type":"scalar"},"locs":[{"a":215,"b":224}]},{"name":"notificationType","required":true,"transform":{"type":"scalar"},"locs":[{"a":229,"b":246}]},{"name":"sentVia","required":true,"transform":{"type":"scalar"},"locs":[{"a":251,"b":259}]},{"name":"status","required":true,"transform":{"type":"scalar"},"locs":[{"a":264,"b":271}]},{"name":"responseDeadline","required":false,"transform":{"type":"scalar"},"locs":[{"a":276,"b":292}]},{"name":"metadata","required":false,"transform":{"type":"scalar"},"locs":[{"a":297,"b":305}]}],"statement":"INSERT INTO waitlist_notifications (\n  booking_id,\n  user_id,\n  class_id,\n  branch_id,\n  notification_type,\n  sent_via,\n  status,\n  response_deadline,\n  metadata\n) VALUES (\n  :bookingId!,\n  :userId!,\n  :classId!,\n  :branchId!,\n  :notificationType!,\n  :sentVia!,\n  :status!,\n  :responseDeadline,\n  :metadata\n)\nRETURNING *"};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO waitlist_notifications (
 *   booking_id,
 *   user_id,
 *   class_id,
 *   branch_id,
 *   notification_type,
 *   sent_via,
 *   status,
 *   response_deadline,
 *   metadata
 * ) VALUES (
 *   :bookingId!,
 *   :userId!,
 *   :classId!,
 *   :branchId!,
 *   :notificationType!,
 *   :sentVia!,
 *   :status!,
 *   :responseDeadline,
 *   :metadata
 * )
 * RETURNING *
 * ```
 */
export const createWaitlistNotification = new PreparedQuery<CreateWaitlistNotificationParams,CreateWaitlistNotificationResult>(createWaitlistNotificationIR);


/** 'GetWaitlistNotifications' parameters type */
export interface GetWaitlistNotificationsParams {
  branchId: string;
  limit?: NumberOrString | null | void;
  startDate: DateOrString;
}

/** 'GetWaitlistNotifications' return type */
export interface GetWaitlistNotificationsResult {
  booking_id: string;
  branch_id: string;
  class_id: string;
  created_at: Date | null;
  email: string;
  first_name: string | null;
  id: string;
  instructor: string | null;
  last_name: string | null;
  metadata: Json | null;
  notification_type: string;
  phone: string | null;
  responded_at: Date | null;
  response_action: string | null;
  response_deadline: Date | null;
  scheduled_at: Date;
  sent_at: Date | null;
  sent_via: string | null;
  status: string | null;
  user_id: string;
}

/** 'GetWaitlistNotifications' query type */
export interface GetWaitlistNotificationsQuery {
  params: GetWaitlistNotificationsParams;
  result: GetWaitlistNotificationsResult;
}

const getWaitlistNotificationsIR: any = {"usedParamSet":{"branchId":true,"startDate":true,"limit":true},"params":[{"name":"branchId","required":true,"transform":{"type":"scalar"},"locs":[{"a":225,"b":234}]},{"name":"startDate","required":true,"transform":{"type":"scalar"},"locs":[{"a":256,"b":266}]},{"name":"limit","required":false,"transform":{"type":"scalar"},"locs":[{"a":299,"b":304}]}],"statement":"SELECT\n  wn.*,\n  u.first_name,\n  u.last_name,\n  u.email,\n  u.phone,\n  c.scheduled_at,\n  c.instructor\nFROM waitlist_notifications wn\nJOIN \"user\" u ON wn.user_id = u.id\nJOIN classes c ON wn.class_id = c.id\nWHERE wn.branch_id = :branchId!\n  AND wn.sent_at >= :startDate!\nORDER BY wn.sent_at DESC\nLIMIT :limit"};

/**
 * Query generated from SQL:
 * ```
 * SELECT
 *   wn.*,
 *   u.first_name,
 *   u.last_name,
 *   u.email,
 *   u.phone,
 *   c.scheduled_at,
 *   c.instructor
 * FROM waitlist_notifications wn
 * JOIN "user" u ON wn.user_id = u.id
 * JOIN classes c ON wn.class_id = c.id
 * WHERE wn.branch_id = :branchId!
 *   AND wn.sent_at >= :startDate!
 * ORDER BY wn.sent_at DESC
 * LIMIT :limit
 * ```
 */
export const getWaitlistNotifications = new PreparedQuery<GetWaitlistNotificationsParams,GetWaitlistNotificationsResult>(getWaitlistNotificationsIR);


/** 'GetUserWaitlistNotifications' parameters type */
export interface GetUserWaitlistNotificationsParams {
  branchId: string;
  limit?: NumberOrString | null | void;
  userId: string;
}

/** 'GetUserWaitlistNotifications' return type */
export interface GetUserWaitlistNotificationsResult {
  booking_id: string;
  branch_id: string;
  class_id: string;
  created_at: Date | null;
  id: string;
  instructor: string | null;
  metadata: Json | null;
  notification_type: string;
  responded_at: Date | null;
  response_action: string | null;
  response_deadline: Date | null;
  scheduled_at: Date;
  sent_at: Date | null;
  sent_via: string | null;
  status: string | null;
  user_id: string;
}

/** 'GetUserWaitlistNotifications' query type */
export interface GetUserWaitlistNotificationsQuery {
  params: GetUserWaitlistNotificationsParams;
  result: GetUserWaitlistNotificationsResult;
}

const getUserWaitlistNotificationsIR: any = {"usedParamSet":{"userId":true,"branchId":true,"limit":true},"params":[{"name":"userId","required":true,"transform":{"type":"scalar"},"locs":[{"a":135,"b":142}]},{"name":"branchId","required":true,"transform":{"type":"scalar"},"locs":[{"a":165,"b":174}]},{"name":"limit","required":false,"transform":{"type":"scalar"},"locs":[{"a":207,"b":212}]}],"statement":"SELECT\n  wn.*,\n  c.scheduled_at,\n  c.instructor\nFROM waitlist_notifications wn\nJOIN classes c ON wn.class_id = c.id\nWHERE wn.user_id = :userId!\n  AND wn.branch_id = :branchId!\nORDER BY wn.sent_at DESC\nLIMIT :limit"};

/**
 * Query generated from SQL:
 * ```
 * SELECT
 *   wn.*,
 *   c.scheduled_at,
 *   c.instructor
 * FROM waitlist_notifications wn
 * JOIN classes c ON wn.class_id = c.id
 * WHERE wn.user_id = :userId!
 *   AND wn.branch_id = :branchId!
 * ORDER BY wn.sent_at DESC
 * LIMIT :limit
 * ```
 */
export const getUserWaitlistNotifications = new PreparedQuery<GetUserWaitlistNotificationsParams,GetUserWaitlistNotificationsResult>(getUserWaitlistNotificationsIR);


/** 'UpdateNotificationStatus' parameters type */
export interface UpdateNotificationStatusParams {
  branchId: string;
  notificationId: string;
  respondedAt?: DateOrString | null | void;
  responseAction?: string | null | void;
  status: string;
}

/** 'UpdateNotificationStatus' return type */
export interface UpdateNotificationStatusResult {
  booking_id: string;
  branch_id: string;
  class_id: string;
  created_at: Date | null;
  id: string;
  metadata: Json | null;
  notification_type: string;
  responded_at: Date | null;
  response_action: string | null;
  response_deadline: Date | null;
  sent_at: Date | null;
  sent_via: string | null;
  status: string | null;
  user_id: string;
}

/** 'UpdateNotificationStatus' query type */
export interface UpdateNotificationStatusQuery {
  params: UpdateNotificationStatusParams;
  result: UpdateNotificationStatusResult;
}

const updateNotificationStatusIR: any = {"usedParamSet":{"status":true,"responseAction":true,"respondedAt":true,"notificationId":true,"branchId":true},"params":[{"name":"status","required":true,"transform":{"type":"scalar"},"locs":[{"a":45,"b":52}]},{"name":"responseAction","required":false,"transform":{"type":"scalar"},"locs":[{"a":75,"b":89}]},{"name":"respondedAt","required":false,"transform":{"type":"scalar"},"locs":[{"a":109,"b":120}]},{"name":"notificationId","required":true,"transform":{"type":"scalar"},"locs":[{"a":133,"b":148}]},{"name":"branchId","required":true,"transform":{"type":"scalar"},"locs":[{"a":168,"b":177}]}],"statement":"UPDATE waitlist_notifications\nSET\n  status = :status!,\n  response_action = :responseAction,\n  responded_at = :respondedAt\nWHERE id = :notificationId!\n  AND branch_id = :branchId!\nRETURNING *"};

/**
 * Query generated from SQL:
 * ```
 * UPDATE waitlist_notifications
 * SET
 *   status = :status!,
 *   response_action = :responseAction,
 *   responded_at = :respondedAt
 * WHERE id = :notificationId!
 *   AND branch_id = :branchId!
 * RETURNING *
 * ```
 */
export const updateNotificationStatus = new PreparedQuery<UpdateNotificationStatusParams,UpdateNotificationStatusResult>(updateNotificationStatusIR);


/** 'CreateWaitlistOffer' parameters type */
export interface CreateWaitlistOfferParams {
  bookingId: string;
  branchId: string;
  classId: string;
  expiresAt: DateOrString;
  userId: string;
}

/** 'CreateWaitlistOffer' return type */
export interface CreateWaitlistOfferResult {
  accepted_at: Date | null;
  booking_id: string;
  branch_id: string;
  class_id: string;
  created_at: Date | null;
  declined_at: Date | null;
  escalated_at: Date | null;
  expired_at: Date | null;
  expires_at: Date;
  id: string;
  next_offer_id: string | null;
  offered_at: Date | null;
  status: string | null;
  updated_at: Date | null;
  user_id: string;
}

/** 'CreateWaitlistOffer' query type */
export interface CreateWaitlistOfferQuery {
  params: CreateWaitlistOfferParams;
  result: CreateWaitlistOfferResult;
}

const createWaitlistOfferIR: any = {"usedParamSet":{"bookingId":true,"userId":true,"classId":true,"branchId":true,"expiresAt":true},"params":[{"name":"bookingId","required":true,"transform":{"type":"scalar"},"locs":[{"a":106,"b":116}]},{"name":"userId","required":true,"transform":{"type":"scalar"},"locs":[{"a":121,"b":128}]},{"name":"classId","required":true,"transform":{"type":"scalar"},"locs":[{"a":133,"b":141}]},{"name":"branchId","required":true,"transform":{"type":"scalar"},"locs":[{"a":146,"b":155}]},{"name":"expiresAt","required":true,"transform":{"type":"scalar"},"locs":[{"a":160,"b":170}]}],"statement":"INSERT INTO waitlist_offers (\n  booking_id,\n  user_id,\n  class_id,\n  branch_id,\n  expires_at\n) VALUES (\n  :bookingId!,\n  :userId!,\n  :classId!,\n  :branchId!,\n  :expiresAt!\n)\nRETURNING *"};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO waitlist_offers (
 *   booking_id,
 *   user_id,
 *   class_id,
 *   branch_id,
 *   expires_at
 * ) VALUES (
 *   :bookingId!,
 *   :userId!,
 *   :classId!,
 *   :branchId!,
 *   :expiresAt!
 * )
 * RETURNING *
 * ```
 */
export const createWaitlistOffer = new PreparedQuery<CreateWaitlistOfferParams,CreateWaitlistOfferResult>(createWaitlistOfferIR);


/** 'GetWaitlistOfferById' parameters type */
export interface GetWaitlistOfferByIdParams {
  branchId: string;
  offerId: string;
}

/** 'GetWaitlistOfferById' return type */
export interface GetWaitlistOfferByIdResult {
  accepted_at: Date | null;
  booking_id: string;
  booking_status: booking_status;
  branch_id: string;
  capacity: number;
  class_id: string;
  created_at: Date | null;
  declined_at: Date | null;
  email: string;
  escalated_at: Date | null;
  expired_at: Date | null;
  expires_at: Date;
  first_name: string | null;
  id: string;
  instructor: string | null;
  last_name: string | null;
  next_offer_id: string | null;
  offered_at: Date | null;
  phone: string | null;
  scheduled_at: Date;
  status: string | null;
  updated_at: Date | null;
  user_id: string;
}

/** 'GetWaitlistOfferById' query type */
export interface GetWaitlistOfferByIdQuery {
  params: GetWaitlistOfferByIdParams;
  result: GetWaitlistOfferByIdResult;
}

const getWaitlistOfferByIdIR: any = {"usedParamSet":{"offerId":true,"branchId":true},"params":[{"name":"offerId","required":true,"transform":{"type":"scalar"},"locs":[{"a":295,"b":303}]},{"name":"branchId","required":true,"transform":{"type":"scalar"},"locs":[{"a":326,"b":335}]}],"statement":"SELECT\n  wo.*,\n  u.first_name,\n  u.last_name,\n  u.email,\n  u.phone,\n  c.scheduled_at,\n  c.instructor,\n  c.capacity,\n  b.status as booking_status\nFROM waitlist_offers wo\nJOIN \"user\" u ON wo.user_id = u.id\nJOIN classes c ON wo.class_id = c.id\nJOIN bookings b ON wo.booking_id = b.id\nWHERE wo.id = :offerId!\n  AND wo.branch_id = :branchId!"};

/**
 * Query generated from SQL:
 * ```
 * SELECT
 *   wo.*,
 *   u.first_name,
 *   u.last_name,
 *   u.email,
 *   u.phone,
 *   c.scheduled_at,
 *   c.instructor,
 *   c.capacity,
 *   b.status as booking_status
 * FROM waitlist_offers wo
 * JOIN "user" u ON wo.user_id = u.id
 * JOIN classes c ON wo.class_id = c.id
 * JOIN bookings b ON wo.booking_id = b.id
 * WHERE wo.id = :offerId!
 *   AND wo.branch_id = :branchId!
 * ```
 */
export const getWaitlistOfferById = new PreparedQuery<GetWaitlistOfferByIdParams,GetWaitlistOfferByIdResult>(getWaitlistOfferByIdIR);


/** 'GetPendingWaitlistOffers' parameters type */
export interface GetPendingWaitlistOffersParams {
  branchId: string;
}

/** 'GetPendingWaitlistOffers' return type */
export interface GetPendingWaitlistOffersResult {
  accepted_at: Date | null;
  booking_id: string;
  booking_status: booking_status;
  branch_id: string;
  class_id: string;
  created_at: Date | null;
  declined_at: Date | null;
  email: string;
  escalated_at: Date | null;
  expired_at: Date | null;
  expires_at: Date;
  first_name: string | null;
  id: string;
  instructor: string | null;
  last_name: string | null;
  next_offer_id: string | null;
  offered_at: Date | null;
  phone: string | null;
  scheduled_at: Date;
  status: string | null;
  updated_at: Date | null;
  user_id: string;
}

/** 'GetPendingWaitlistOffers' query type */
export interface GetPendingWaitlistOffersQuery {
  params: GetPendingWaitlistOffersParams;
  result: GetPendingWaitlistOffersResult;
}

const getPendingWaitlistOffersIR: any = {"usedParamSet":{"branchId":true},"params":[{"name":"branchId","required":true,"transform":{"type":"scalar"},"locs":[{"a":288,"b":297}]}],"statement":"SELECT\n  wo.*,\n  u.first_name,\n  u.last_name,\n  u.email,\n  u.phone,\n  c.scheduled_at,\n  c.instructor,\n  b.status as booking_status\nFROM waitlist_offers wo\nJOIN \"user\" u ON wo.user_id = u.id\nJOIN classes c ON wo.class_id = c.id\nJOIN bookings b ON wo.booking_id = b.id\nWHERE wo.branch_id = :branchId!\n  AND wo.status = 'pending'\n  AND wo.expires_at > CURRENT_TIMESTAMP\nORDER BY wo.offered_at ASC"};

/**
 * Query generated from SQL:
 * ```
 * SELECT
 *   wo.*,
 *   u.first_name,
 *   u.last_name,
 *   u.email,
 *   u.phone,
 *   c.scheduled_at,
 *   c.instructor,
 *   b.status as booking_status
 * FROM waitlist_offers wo
 * JOIN "user" u ON wo.user_id = u.id
 * JOIN classes c ON wo.class_id = c.id
 * JOIN bookings b ON wo.booking_id = b.id
 * WHERE wo.branch_id = :branchId!
 *   AND wo.status = 'pending'
 *   AND wo.expires_at > CURRENT_TIMESTAMP
 * ORDER BY wo.offered_at ASC
 * ```
 */
export const getPendingWaitlistOffers = new PreparedQuery<GetPendingWaitlistOffersParams,GetPendingWaitlistOffersResult>(getPendingWaitlistOffersIR);


/** 'GetUserWaitlistOffers' parameters type */
export interface GetUserWaitlistOffersParams {
  branchId: string;
  limit?: NumberOrString | null | void;
  userId: string;
}

/** 'GetUserWaitlistOffers' return type */
export interface GetUserWaitlistOffersResult {
  accepted_at: Date | null;
  booking_id: string;
  booking_status: booking_status;
  branch_id: string;
  capacity: number;
  class_id: string;
  created_at: Date | null;
  declined_at: Date | null;
  escalated_at: Date | null;
  expired_at: Date | null;
  expires_at: Date;
  id: string;
  instructor: string | null;
  next_offer_id: string | null;
  offered_at: Date | null;
  scheduled_at: Date;
  status: string | null;
  updated_at: Date | null;
  user_id: string;
}

/** 'GetUserWaitlistOffers' query type */
export interface GetUserWaitlistOffersQuery {
  params: GetUserWaitlistOffersParams;
  result: GetUserWaitlistOffersResult;
}

const getUserWaitlistOffersIR: any = {"usedParamSet":{"userId":true,"branchId":true,"limit":true},"params":[{"name":"userId","required":true,"transform":{"type":"scalar"},"locs":[{"a":212,"b":219}]},{"name":"branchId","required":true,"transform":{"type":"scalar"},"locs":[{"a":242,"b":251}]},{"name":"limit","required":false,"transform":{"type":"scalar"},"locs":[{"a":287,"b":292}]}],"statement":"SELECT\n  wo.*,\n  c.scheduled_at,\n  c.instructor,\n  c.capacity,\n  b.status as booking_status\nFROM waitlist_offers wo\nJOIN classes c ON wo.class_id = c.id\nJOIN bookings b ON wo.booking_id = b.id\nWHERE wo.user_id = :userId!\n  AND wo.branch_id = :branchId!\nORDER BY wo.offered_at DESC\nLIMIT :limit"};

/**
 * Query generated from SQL:
 * ```
 * SELECT
 *   wo.*,
 *   c.scheduled_at,
 *   c.instructor,
 *   c.capacity,
 *   b.status as booking_status
 * FROM waitlist_offers wo
 * JOIN classes c ON wo.class_id = c.id
 * JOIN bookings b ON wo.booking_id = b.id
 * WHERE wo.user_id = :userId!
 *   AND wo.branch_id = :branchId!
 * ORDER BY wo.offered_at DESC
 * LIMIT :limit
 * ```
 */
export const getUserWaitlistOffers = new PreparedQuery<GetUserWaitlistOffersParams,GetUserWaitlistOffersResult>(getUserWaitlistOffersIR);


/** 'AcceptWaitlistOffer' parameters type */
export interface AcceptWaitlistOfferParams {
  branchId: string;
  offerId: string;
  userId: string;
}

/** 'AcceptWaitlistOffer' return type */
export interface AcceptWaitlistOfferResult {
  accepted_at: Date | null;
  booking_id: string;
  branch_id: string;
  class_id: string;
  created_at: Date | null;
  declined_at: Date | null;
  escalated_at: Date | null;
  expired_at: Date | null;
  expires_at: Date;
  id: string;
  next_offer_id: string | null;
  offered_at: Date | null;
  status: string | null;
  updated_at: Date | null;
  user_id: string;
}

/** 'AcceptWaitlistOffer' query type */
export interface AcceptWaitlistOfferQuery {
  params: AcceptWaitlistOfferParams;
  result: AcceptWaitlistOfferResult;
}

const acceptWaitlistOfferIR: any = {"usedParamSet":{"offerId":true,"userId":true,"branchId":true},"params":[{"name":"offerId","required":true,"transform":{"type":"scalar"},"locs":[{"a":95,"b":103}]},{"name":"userId","required":true,"transform":{"type":"scalar"},"locs":[{"a":121,"b":128}]},{"name":"branchId","required":true,"transform":{"type":"scalar"},"locs":[{"a":148,"b":157}]}],"statement":"UPDATE waitlist_offers\nSET\n  status = 'accepted',\n  accepted_at = CURRENT_TIMESTAMP\nWHERE id = :offerId!\n  AND user_id = :userId!\n  AND branch_id = :branchId!\n  AND status = 'pending'\n  AND expires_at > CURRENT_TIMESTAMP\nRETURNING *"};

/**
 * Query generated from SQL:
 * ```
 * UPDATE waitlist_offers
 * SET
 *   status = 'accepted',
 *   accepted_at = CURRENT_TIMESTAMP
 * WHERE id = :offerId!
 *   AND user_id = :userId!
 *   AND branch_id = :branchId!
 *   AND status = 'pending'
 *   AND expires_at > CURRENT_TIMESTAMP
 * RETURNING *
 * ```
 */
export const acceptWaitlistOffer = new PreparedQuery<AcceptWaitlistOfferParams,AcceptWaitlistOfferResult>(acceptWaitlistOfferIR);


/** 'DeclineWaitlistOffer' parameters type */
export interface DeclineWaitlistOfferParams {
  branchId: string;
  offerId: string;
  userId: string;
}

/** 'DeclineWaitlistOffer' return type */
export interface DeclineWaitlistOfferResult {
  accepted_at: Date | null;
  booking_id: string;
  branch_id: string;
  class_id: string;
  created_at: Date | null;
  declined_at: Date | null;
  escalated_at: Date | null;
  expired_at: Date | null;
  expires_at: Date;
  id: string;
  next_offer_id: string | null;
  offered_at: Date | null;
  status: string | null;
  updated_at: Date | null;
  user_id: string;
}

/** 'DeclineWaitlistOffer' query type */
export interface DeclineWaitlistOfferQuery {
  params: DeclineWaitlistOfferParams;
  result: DeclineWaitlistOfferResult;
}

const declineWaitlistOfferIR: any = {"usedParamSet":{"offerId":true,"userId":true,"branchId":true},"params":[{"name":"offerId","required":true,"transform":{"type":"scalar"},"locs":[{"a":95,"b":103}]},{"name":"userId","required":true,"transform":{"type":"scalar"},"locs":[{"a":121,"b":128}]},{"name":"branchId","required":true,"transform":{"type":"scalar"},"locs":[{"a":148,"b":157}]}],"statement":"UPDATE waitlist_offers\nSET\n  status = 'declined',\n  declined_at = CURRENT_TIMESTAMP\nWHERE id = :offerId!\n  AND user_id = :userId!\n  AND branch_id = :branchId!\n  AND status = 'pending'\nRETURNING *"};

/**
 * Query generated from SQL:
 * ```
 * UPDATE waitlist_offers
 * SET
 *   status = 'declined',
 *   declined_at = CURRENT_TIMESTAMP
 * WHERE id = :offerId!
 *   AND user_id = :userId!
 *   AND branch_id = :branchId!
 *   AND status = 'pending'
 * RETURNING *
 * ```
 */
export const declineWaitlistOffer = new PreparedQuery<DeclineWaitlistOfferParams,DeclineWaitlistOfferResult>(declineWaitlistOfferIR);


/** 'ExpireWaitlistOffer' parameters type */
export interface ExpireWaitlistOfferParams {
  branchId: string;
  offerId: string;
}

/** 'ExpireWaitlistOffer' return type */
export interface ExpireWaitlistOfferResult {
  accepted_at: Date | null;
  booking_id: string;
  branch_id: string;
  class_id: string;
  created_at: Date | null;
  declined_at: Date | null;
  escalated_at: Date | null;
  expired_at: Date | null;
  expires_at: Date;
  id: string;
  next_offer_id: string | null;
  offered_at: Date | null;
  status: string | null;
  updated_at: Date | null;
  user_id: string;
}

/** 'ExpireWaitlistOffer' query type */
export interface ExpireWaitlistOfferQuery {
  params: ExpireWaitlistOfferParams;
  result: ExpireWaitlistOfferResult;
}

const expireWaitlistOfferIR: any = {"usedParamSet":{"offerId":true,"branchId":true},"params":[{"name":"offerId","required":true,"transform":{"type":"scalar"},"locs":[{"a":93,"b":101}]},{"name":"branchId","required":true,"transform":{"type":"scalar"},"locs":[{"a":121,"b":130}]}],"statement":"UPDATE waitlist_offers\nSET\n  status = 'expired',\n  expired_at = CURRENT_TIMESTAMP\nWHERE id = :offerId!\n  AND branch_id = :branchId!\nRETURNING *"};

/**
 * Query generated from SQL:
 * ```
 * UPDATE waitlist_offers
 * SET
 *   status = 'expired',
 *   expired_at = CURRENT_TIMESTAMP
 * WHERE id = :offerId!
 *   AND branch_id = :branchId!
 * RETURNING *
 * ```
 */
export const expireWaitlistOffer = new PreparedQuery<ExpireWaitlistOfferParams,ExpireWaitlistOfferResult>(expireWaitlistOfferIR);


/** 'MarkOfferAsEscalated' parameters type */
export interface MarkOfferAsEscalatedParams {
  branchId: string;
  nextOfferId?: string | null | void;
  offerId: string;
}

/** 'MarkOfferAsEscalated' return type */
export interface MarkOfferAsEscalatedResult {
  accepted_at: Date | null;
  booking_id: string;
  branch_id: string;
  class_id: string;
  created_at: Date | null;
  declined_at: Date | null;
  escalated_at: Date | null;
  expired_at: Date | null;
  expires_at: Date;
  id: string;
  next_offer_id: string | null;
  offered_at: Date | null;
  status: string | null;
  updated_at: Date | null;
  user_id: string;
}

/** 'MarkOfferAsEscalated' query type */
export interface MarkOfferAsEscalatedQuery {
  params: MarkOfferAsEscalatedParams;
  result: MarkOfferAsEscalatedResult;
}

const markOfferAsEscalatedIR: any = {"usedParamSet":{"nextOfferId":true,"offerId":true,"branchId":true},"params":[{"name":"nextOfferId","required":false,"transform":{"type":"scalar"},"locs":[{"a":110,"b":121}]},{"name":"offerId","required":true,"transform":{"type":"scalar"},"locs":[{"a":134,"b":142}]},{"name":"branchId","required":true,"transform":{"type":"scalar"},"locs":[{"a":162,"b":171}]}],"statement":"UPDATE waitlist_offers\nSET\n  status = 'auto_escalated',\n  escalated_at = CURRENT_TIMESTAMP,\n  next_offer_id = :nextOfferId\nWHERE id = :offerId!\n  AND branch_id = :branchId!\nRETURNING *"};

/**
 * Query generated from SQL:
 * ```
 * UPDATE waitlist_offers
 * SET
 *   status = 'auto_escalated',
 *   escalated_at = CURRENT_TIMESTAMP,
 *   next_offer_id = :nextOfferId
 * WHERE id = :offerId!
 *   AND branch_id = :branchId!
 * RETURNING *
 * ```
 */
export const markOfferAsEscalated = new PreparedQuery<MarkOfferAsEscalatedParams,MarkOfferAsEscalatedResult>(markOfferAsEscalatedIR);


/** 'GetExpiredOffers' parameters type */
export interface GetExpiredOffersParams {
  branchId: string;
  limit?: NumberOrString | null | void;
}

/** 'GetExpiredOffers' return type */
export interface GetExpiredOffersResult {
  accepted_at: Date | null;
  booking_id: string;
  branch_id: string;
  class_id: string;
  created_at: Date | null;
  declined_at: Date | null;
  email: string;
  escalated_at: Date | null;
  expired_at: Date | null;
  expires_at: Date;
  first_name: string | null;
  id: string;
  instructor: string | null;
  last_name: string | null;
  next_offer_id: string | null;
  offered_at: Date | null;
  scheduled_at: Date;
  status: string | null;
  updated_at: Date | null;
  user_id: string;
}

/** 'GetExpiredOffers' query type */
export interface GetExpiredOffersQuery {
  params: GetExpiredOffersParams;
  result: GetExpiredOffersResult;
}

const getExpiredOffersIR: any = {"usedParamSet":{"branchId":true,"limit":true},"params":[{"name":"branchId","required":true,"transform":{"type":"scalar"},"locs":[{"a":207,"b":216}]},{"name":"limit","required":false,"transform":{"type":"scalar"},"locs":[{"a":320,"b":325}]}],"statement":"SELECT\n  wo.*,\n  u.first_name,\n  u.last_name,\n  u.email,\n  c.scheduled_at,\n  c.instructor\nFROM waitlist_offers wo\nJOIN \"user\" u ON wo.user_id = u.id\nJOIN classes c ON wo.class_id = c.id\nWHERE wo.branch_id = :branchId!\n  AND wo.status = 'pending'\n  AND wo.expires_at <= CURRENT_TIMESTAMP\nORDER BY wo.expires_at ASC\nLIMIT :limit"};

/**
 * Query generated from SQL:
 * ```
 * SELECT
 *   wo.*,
 *   u.first_name,
 *   u.last_name,
 *   u.email,
 *   c.scheduled_at,
 *   c.instructor
 * FROM waitlist_offers wo
 * JOIN "user" u ON wo.user_id = u.id
 * JOIN classes c ON wo.class_id = c.id
 * WHERE wo.branch_id = :branchId!
 *   AND wo.status = 'pending'
 *   AND wo.expires_at <= CURRENT_TIMESTAMP
 * ORDER BY wo.expires_at ASC
 * LIMIT :limit
 * ```
 */
export const getExpiredOffers = new PreparedQuery<GetExpiredOffersParams,GetExpiredOffersResult>(getExpiredOffersIR);


/** 'GetNotificationPreferences' parameters type */
export interface GetNotificationPreferencesParams {
  userId: string;
}

/** 'GetNotificationPreferences' return type */
export interface GetNotificationPreferencesResult {
  booking_confirmation_enabled: boolean | null;
  cancellation_notification_enabled: boolean | null;
  created_at: Date | null;
  email_enabled: boolean | null;
  id: string;
  push_enabled: boolean | null;
  reminder_notification_enabled: boolean | null;
  sms_enabled: boolean | null;
  updated_at: Date | null;
  user_id: string;
  waitlist_notification_enabled: boolean | null;
}

/** 'GetNotificationPreferences' query type */
export interface GetNotificationPreferencesQuery {
  params: GetNotificationPreferencesParams;
  result: GetNotificationPreferencesResult;
}

const getNotificationPreferencesIR: any = {"usedParamSet":{"userId":true},"params":[{"name":"userId","required":true,"transform":{"type":"scalar"},"locs":[{"a":55,"b":62}]}],"statement":"SELECT *\nFROM notification_preferences\nWHERE user_id = :userId!"};

/**
 * Query generated from SQL:
 * ```
 * SELECT *
 * FROM notification_preferences
 * WHERE user_id = :userId!
 * ```
 */
export const getNotificationPreferences = new PreparedQuery<GetNotificationPreferencesParams,GetNotificationPreferencesResult>(getNotificationPreferencesIR);


/** 'CreateNotificationPreferences' parameters type */
export interface CreateNotificationPreferencesParams {
  bookingConfirmationEnabled: boolean;
  cancellationNotificationEnabled: boolean;
  emailEnabled: boolean;
  pushEnabled: boolean;
  reminderNotificationEnabled: boolean;
  smsEnabled: boolean;
  userId: string;
  waitlistNotificationEnabled: boolean;
}

/** 'CreateNotificationPreferences' return type */
export interface CreateNotificationPreferencesResult {
  booking_confirmation_enabled: boolean | null;
  cancellation_notification_enabled: boolean | null;
  created_at: Date | null;
  email_enabled: boolean | null;
  id: string;
  push_enabled: boolean | null;
  reminder_notification_enabled: boolean | null;
  sms_enabled: boolean | null;
  updated_at: Date | null;
  user_id: string;
  waitlist_notification_enabled: boolean | null;
}

/** 'CreateNotificationPreferences' query type */
export interface CreateNotificationPreferencesQuery {
  params: CreateNotificationPreferencesParams;
  result: CreateNotificationPreferencesResult;
}

const createNotificationPreferencesIR: any = {"usedParamSet":{"userId":true,"emailEnabled":true,"smsEnabled":true,"pushEnabled":true,"waitlistNotificationEnabled":true,"bookingConfirmationEnabled":true,"cancellationNotificationEnabled":true,"reminderNotificationEnabled":true},"params":[{"name":"userId","required":true,"transform":{"type":"scalar"},"locs":[{"a":245,"b":252}]},{"name":"emailEnabled","required":true,"transform":{"type":"scalar"},"locs":[{"a":257,"b":270}]},{"name":"smsEnabled","required":true,"transform":{"type":"scalar"},"locs":[{"a":275,"b":286}]},{"name":"pushEnabled","required":true,"transform":{"type":"scalar"},"locs":[{"a":291,"b":303}]},{"name":"waitlistNotificationEnabled","required":true,"transform":{"type":"scalar"},"locs":[{"a":308,"b":336}]},{"name":"bookingConfirmationEnabled","required":true,"transform":{"type":"scalar"},"locs":[{"a":341,"b":368}]},{"name":"cancellationNotificationEnabled","required":true,"transform":{"type":"scalar"},"locs":[{"a":373,"b":405}]},{"name":"reminderNotificationEnabled","required":true,"transform":{"type":"scalar"},"locs":[{"a":410,"b":438}]}],"statement":"INSERT INTO notification_preferences (\n  user_id,\n  email_enabled,\n  sms_enabled,\n  push_enabled,\n  waitlist_notification_enabled,\n  booking_confirmation_enabled,\n  cancellation_notification_enabled,\n  reminder_notification_enabled\n) VALUES (\n  :userId!,\n  :emailEnabled!,\n  :smsEnabled!,\n  :pushEnabled!,\n  :waitlistNotificationEnabled!,\n  :bookingConfirmationEnabled!,\n  :cancellationNotificationEnabled!,\n  :reminderNotificationEnabled!\n)\nON CONFLICT (user_id) DO UPDATE SET\n  email_enabled = EXCLUDED.email_enabled,\n  sms_enabled = EXCLUDED.sms_enabled,\n  push_enabled = EXCLUDED.push_enabled,\n  waitlist_notification_enabled = EXCLUDED.waitlist_notification_enabled,\n  booking_confirmation_enabled = EXCLUDED.booking_confirmation_enabled,\n  cancellation_notification_enabled = EXCLUDED.cancellation_notification_enabled,\n  reminder_notification_enabled = EXCLUDED.reminder_notification_enabled\nRETURNING *"};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO notification_preferences (
 *   user_id,
 *   email_enabled,
 *   sms_enabled,
 *   push_enabled,
 *   waitlist_notification_enabled,
 *   booking_confirmation_enabled,
 *   cancellation_notification_enabled,
 *   reminder_notification_enabled
 * ) VALUES (
 *   :userId!,
 *   :emailEnabled!,
 *   :smsEnabled!,
 *   :pushEnabled!,
 *   :waitlistNotificationEnabled!,
 *   :bookingConfirmationEnabled!,
 *   :cancellationNotificationEnabled!,
 *   :reminderNotificationEnabled!
 * )
 * ON CONFLICT (user_id) DO UPDATE SET
 *   email_enabled = EXCLUDED.email_enabled,
 *   sms_enabled = EXCLUDED.sms_enabled,
 *   push_enabled = EXCLUDED.push_enabled,
 *   waitlist_notification_enabled = EXCLUDED.waitlist_notification_enabled,
 *   booking_confirmation_enabled = EXCLUDED.booking_confirmation_enabled,
 *   cancellation_notification_enabled = EXCLUDED.cancellation_notification_enabled,
 *   reminder_notification_enabled = EXCLUDED.reminder_notification_enabled
 * RETURNING *
 * ```
 */
export const createNotificationPreferences = new PreparedQuery<CreateNotificationPreferencesParams,CreateNotificationPreferencesResult>(createNotificationPreferencesIR);


/** 'UpdateNotificationPreferences' parameters type */
export interface UpdateNotificationPreferencesParams {
  bookingConfirmationEnabled: boolean;
  cancellationNotificationEnabled: boolean;
  emailEnabled: boolean;
  pushEnabled: boolean;
  reminderNotificationEnabled: boolean;
  smsEnabled: boolean;
  userId: string;
  waitlistNotificationEnabled: boolean;
}

/** 'UpdateNotificationPreferences' return type */
export interface UpdateNotificationPreferencesResult {
  booking_confirmation_enabled: boolean | null;
  cancellation_notification_enabled: boolean | null;
  created_at: Date | null;
  email_enabled: boolean | null;
  id: string;
  push_enabled: boolean | null;
  reminder_notification_enabled: boolean | null;
  sms_enabled: boolean | null;
  updated_at: Date | null;
  user_id: string;
  waitlist_notification_enabled: boolean | null;
}

/** 'UpdateNotificationPreferences' query type */
export interface UpdateNotificationPreferencesQuery {
  params: UpdateNotificationPreferencesParams;
  result: UpdateNotificationPreferencesResult;
}

const updateNotificationPreferencesIR: any = {"usedParamSet":{"emailEnabled":true,"smsEnabled":true,"pushEnabled":true,"waitlistNotificationEnabled":true,"bookingConfirmationEnabled":true,"cancellationNotificationEnabled":true,"reminderNotificationEnabled":true,"userId":true},"params":[{"name":"emailEnabled","required":true,"transform":{"type":"scalar"},"locs":[{"a":54,"b":67}]},{"name":"smsEnabled","required":true,"transform":{"type":"scalar"},"locs":[{"a":86,"b":97}]},{"name":"pushEnabled","required":true,"transform":{"type":"scalar"},"locs":[{"a":117,"b":129}]},{"name":"waitlistNotificationEnabled","required":true,"transform":{"type":"scalar"},"locs":[{"a":166,"b":194}]},{"name":"bookingConfirmationEnabled","required":true,"transform":{"type":"scalar"},"locs":[{"a":230,"b":257}]},{"name":"cancellationNotificationEnabled","required":true,"transform":{"type":"scalar"},"locs":[{"a":298,"b":330}]},{"name":"reminderNotificationEnabled","required":true,"transform":{"type":"scalar"},"locs":[{"a":367,"b":395}]},{"name":"userId","required":true,"transform":{"type":"scalar"},"locs":[{"a":413,"b":420}]}],"statement":"UPDATE notification_preferences\nSET\n  email_enabled = :emailEnabled!,\n  sms_enabled = :smsEnabled!,\n  push_enabled = :pushEnabled!,\n  waitlist_notification_enabled = :waitlistNotificationEnabled!,\n  booking_confirmation_enabled = :bookingConfirmationEnabled!,\n  cancellation_notification_enabled = :cancellationNotificationEnabled!,\n  reminder_notification_enabled = :reminderNotificationEnabled!\nWHERE user_id = :userId!\nRETURNING *"};

/**
 * Query generated from SQL:
 * ```
 * UPDATE notification_preferences
 * SET
 *   email_enabled = :emailEnabled!,
 *   sms_enabled = :smsEnabled!,
 *   push_enabled = :pushEnabled!,
 *   waitlist_notification_enabled = :waitlistNotificationEnabled!,
 *   booking_confirmation_enabled = :bookingConfirmationEnabled!,
 *   cancellation_notification_enabled = :cancellationNotificationEnabled!,
 *   reminder_notification_enabled = :reminderNotificationEnabled!
 * WHERE user_id = :userId!
 * RETURNING *
 * ```
 */
export const updateNotificationPreferences = new PreparedQuery<UpdateNotificationPreferencesParams,UpdateNotificationPreferencesResult>(updateNotificationPreferencesIR);


/** 'GetBranchWaitlistSettings' parameters type */
export interface GetBranchWaitlistSettingsParams {
  branchId: string;
}

/** 'GetBranchWaitlistSettings' return type */
export interface GetBranchWaitlistSettingsResult {
  enable_auto_waitlist: boolean | null;
  waitlist_acceptance_hours: number | null;
  waitlist_cutoff_hours: number | null;
  waitlist_reminder_count: number | null;
}

/** 'GetBranchWaitlistSettings' query type */
export interface GetBranchWaitlistSettingsQuery {
  params: GetBranchWaitlistSettingsParams;
  result: GetBranchWaitlistSettingsResult;
}

const getBranchWaitlistSettingsIR: any = {"usedParamSet":{"branchId":true},"params":[{"name":"branchId","required":true,"transform":{"type":"scalar"},"locs":[{"a":150,"b":159}]}],"statement":"SELECT\n  waitlist_acceptance_hours,\n  enable_auto_waitlist,\n  waitlist_reminder_count,\n  waitlist_cutoff_hours\nFROM branch_settings\nWHERE branch_id = :branchId!"};

/**
 * Query generated from SQL:
 * ```
 * SELECT
 *   waitlist_acceptance_hours,
 *   enable_auto_waitlist,
 *   waitlist_reminder_count,
 *   waitlist_cutoff_hours
 * FROM branch_settings
 * WHERE branch_id = :branchId!
 * ```
 */
export const getBranchWaitlistSettings = new PreparedQuery<GetBranchWaitlistSettingsParams,GetBranchWaitlistSettingsResult>(getBranchWaitlistSettingsIR);


/** 'GetClassWaitlistStatus' parameters type */
export interface GetClassWaitlistStatusParams {
  branchId: string;
  classId: string;
}

/** 'GetClassWaitlistStatus' return type */
export interface GetClassWaitlistStatusResult {
  capacity: number;
  class_id: string;
  confirmed_count: string | null;
  has_available_spots: boolean | null;
  has_waitlist: boolean | null;
  instructor: string | null;
  pending_offers_count: string | null;
  scheduled_at: Date;
  waitlist_capacity: number;
  waitlisted_count: string | null;
}

/** 'GetClassWaitlistStatus' query type */
export interface GetClassWaitlistStatusQuery {
  params: GetClassWaitlistStatusParams;
  result: GetClassWaitlistStatusResult;
}

const getClassWaitlistStatusIR: any = {"usedParamSet":{"classId":true,"branchId":true},"params":[{"name":"classId","required":true,"transform":{"type":"scalar"},"locs":[{"a":702,"b":710}]},{"name":"branchId","required":true,"transform":{"type":"scalar"},"locs":[{"a":732,"b":741}]}],"statement":"SELECT\n  c.id as class_id,\n  c.scheduled_at,\n  c.instructor,\n  c.capacity,\n  c.waitlist_capacity,\n  COUNT(b.id) FILTER (WHERE b.status = 'confirmed') as confirmed_count,\n  COUNT(b.id) FILTER (WHERE b.status = 'waitlisted') as waitlisted_count,\n  COUNT(wo.id) FILTER (WHERE wo.status = 'pending') as pending_offers_count,\n  CASE\n    WHEN COUNT(b.id) FILTER (WHERE b.status = 'confirmed') < c.capacity\n    THEN true\n    ELSE false\n  END as has_available_spots,\n  CASE\n    WHEN COUNT(b.id) FILTER (WHERE b.status = 'waitlisted') > 0\n    THEN true\n    ELSE false\n  END as has_waitlist\nFROM classes c\nLEFT JOIN bookings b ON c.id = b.class_id\nLEFT JOIN waitlist_offers wo ON c.id = wo.class_id\nWHERE c.id = :classId!\n  AND c.branch_id = :branchId!\nGROUP BY c.id, c.scheduled_at, c.instructor, c.capacity, c.waitlist_capacity"};

/**
 * Query generated from SQL:
 * ```
 * SELECT
 *   c.id as class_id,
 *   c.scheduled_at,
 *   c.instructor,
 *   c.capacity,
 *   c.waitlist_capacity,
 *   COUNT(b.id) FILTER (WHERE b.status = 'confirmed') as confirmed_count,
 *   COUNT(b.id) FILTER (WHERE b.status = 'waitlisted') as waitlisted_count,
 *   COUNT(wo.id) FILTER (WHERE wo.status = 'pending') as pending_offers_count,
 *   CASE
 *     WHEN COUNT(b.id) FILTER (WHERE b.status = 'confirmed') < c.capacity
 *     THEN true
 *     ELSE false
 *   END as has_available_spots,
 *   CASE
 *     WHEN COUNT(b.id) FILTER (WHERE b.status = 'waitlisted') > 0
 *     THEN true
 *     ELSE false
 *   END as has_waitlist
 * FROM classes c
 * LEFT JOIN bookings b ON c.id = b.class_id
 * LEFT JOIN waitlist_offers wo ON c.id = wo.class_id
 * WHERE c.id = :classId!
 *   AND c.branch_id = :branchId!
 * GROUP BY c.id, c.scheduled_at, c.instructor, c.capacity, c.waitlist_capacity
 * ```
 */
export const getClassWaitlistStatus = new PreparedQuery<GetClassWaitlistStatusParams,GetClassWaitlistStatusResult>(getClassWaitlistStatusIR);


/** Query 'GetWaitlistQueue' is invalid, so its result is assigned type 'never'.
 *  */
export type GetWaitlistQueueResult = never;

/** Query 'GetWaitlistQueue' is invalid, so its parameters are assigned type 'never'.
 *  */
export type GetWaitlistQueueParams = never;

const getWaitlistQueueIR: any = {"usedParamSet":{"classId":true,"branchId":true},"params":[{"name":"classId","required":true,"transform":{"type":"scalar"},"locs":[{"a":393,"b":401}]},{"name":"branchId","required":true,"transform":{"type":"scalar"},"locs":[{"a":423,"b":432}]}],"statement":"SELECT\n  b.id as booking_id,\n  b.user_id,\n  b.waitlist_position,\n  b.booked_at,\n  u.first_name,\n  u.last_name,\n  u.email,\n  u.phone,\n  wo.id as active_offer_id,\n  wo.status as offer_status,\n  wo.expires_at as offer_expires_at\nFROM bookings b\nJOIN \"user\" u ON b.user_id = u.id\nLEFT JOIN waitlist_offers wo ON\n  b.id = wo.booking_id\n  AND wo.status IN ('pending', 'accepted')\nWHERE b.class_id = :classId!\n  AND b.branch_id = :branchId!\n  AND b.status = 'waitlisted'\nORDER BY b.waitlist_position ASC, b.booked_at ASC"};

/**
 * Query generated from SQL:
 * ```
 * SELECT
 *   b.id as booking_id,
 *   b.user_id,
 *   b.waitlist_position,
 *   b.booked_at,
 *   u.first_name,
 *   u.last_name,
 *   u.email,
 *   u.phone,
 *   wo.id as active_offer_id,
 *   wo.status as offer_status,
 *   wo.expires_at as offer_expires_at
 * FROM bookings b
 * JOIN "user" u ON b.user_id = u.id
 * LEFT JOIN waitlist_offers wo ON
 *   b.id = wo.booking_id
 *   AND wo.status IN ('pending', 'accepted')
 * WHERE b.class_id = :classId!
 *   AND b.branch_id = :branchId!
 *   AND b.status = 'waitlisted'
 * ORDER BY b.waitlist_position ASC, b.booked_at ASC
 * ```
 */
export const getWaitlistQueue = new PreparedQuery<GetWaitlistQueueParams,GetWaitlistQueueResult>(getWaitlistQueueIR);


/** 'GetWaitlistStats' parameters type */
export interface GetWaitlistStatsParams {
  branchId: string;
  endDate: DateOrString;
  startDate: DateOrString;
}

/** 'GetWaitlistStats' return type */
export interface GetWaitlistStatsResult {
  acceptance_rate: string | null;
  accepted_count: string | null;
  avg_hours_to_accept: string | null;
  class_id: string;
  declined_count: string | null;
  escalated_count: string | null;
  expired_count: string | null;
  instructor: string | null;
  scheduled_at: Date;
  total_offers_sent: string | null;
}

/** 'GetWaitlistStats' query type */
export interface GetWaitlistStatsQuery {
  params: GetWaitlistStatsParams;
  result: GetWaitlistStatsResult;
}

const getWaitlistStatsIR: any = {"usedParamSet":{"branchId":true,"startDate":true,"endDate":true},"params":[{"name":"branchId","required":true,"transform":{"type":"scalar"},"locs":[{"a":819,"b":828}]},{"name":"startDate","required":true,"transform":{"type":"scalar"},"locs":[{"a":854,"b":864}]},{"name":"endDate","required":true,"transform":{"type":"scalar"},"locs":[{"a":890,"b":898}]}],"statement":"SELECT\n  c.id as class_id,\n  c.scheduled_at,\n  c.instructor,\n  COUNT(DISTINCT wo.id) as total_offers_sent,\n  COUNT(DISTINCT wo.id) FILTER (WHERE wo.status = 'accepted') as accepted_count,\n  COUNT(DISTINCT wo.id) FILTER (WHERE wo.status = 'declined') as declined_count,\n  COUNT(DISTINCT wo.id) FILTER (WHERE wo.status = 'expired') as expired_count,\n  COUNT(DISTINCT wo.id) FILTER (WHERE wo.status = 'auto_escalated') as escalated_count,\n  ROUND(\n    (COUNT(DISTINCT wo.id) FILTER (WHERE wo.status = 'accepted')::numeric /\n     NULLIF(COUNT(DISTINCT wo.id), 0)) * 100,\n    2\n  ) as acceptance_rate,\n  AVG(\n    EXTRACT(EPOCH FROM (wo.accepted_at - wo.offered_at)) / 3600\n  ) FILTER (WHERE wo.status = 'accepted') as avg_hours_to_accept\nFROM classes c\nLEFT JOIN waitlist_offers wo ON c.id = wo.class_id\nWHERE c.branch_id = :branchId!\n  AND c.scheduled_at >= :startDate!\n  AND c.scheduled_at <= :endDate!\nGROUP BY c.id, c.scheduled_at, c.instructor\nHAVING COUNT(DISTINCT wo.id) > 0\nORDER BY c.scheduled_at DESC"};

/**
 * Query generated from SQL:
 * ```
 * SELECT
 *   c.id as class_id,
 *   c.scheduled_at,
 *   c.instructor,
 *   COUNT(DISTINCT wo.id) as total_offers_sent,
 *   COUNT(DISTINCT wo.id) FILTER (WHERE wo.status = 'accepted') as accepted_count,
 *   COUNT(DISTINCT wo.id) FILTER (WHERE wo.status = 'declined') as declined_count,
 *   COUNT(DISTINCT wo.id) FILTER (WHERE wo.status = 'expired') as expired_count,
 *   COUNT(DISTINCT wo.id) FILTER (WHERE wo.status = 'auto_escalated') as escalated_count,
 *   ROUND(
 *     (COUNT(DISTINCT wo.id) FILTER (WHERE wo.status = 'accepted')::numeric /
 *      NULLIF(COUNT(DISTINCT wo.id), 0)) * 100,
 *     2
 *   ) as acceptance_rate,
 *   AVG(
 *     EXTRACT(EPOCH FROM (wo.accepted_at - wo.offered_at)) / 3600
 *   ) FILTER (WHERE wo.status = 'accepted') as avg_hours_to_accept
 * FROM classes c
 * LEFT JOIN waitlist_offers wo ON c.id = wo.class_id
 * WHERE c.branch_id = :branchId!
 *   AND c.scheduled_at >= :startDate!
 *   AND c.scheduled_at <= :endDate!
 * GROUP BY c.id, c.scheduled_at, c.instructor
 * HAVING COUNT(DISTINCT wo.id) > 0
 * ORDER BY c.scheduled_at DESC
 * ```
 */
export const getWaitlistStats = new PreparedQuery<GetWaitlistStatsParams,GetWaitlistStatsResult>(getWaitlistStatsIR);


