/** Types generated for queries found in "src/db/queries/users.sql" */
import { PreparedQuery } from '@pgtyped/runtime';

export type user_role = 'admin' | 'client' | 'superuser';

/** 'GetUserByEmail' parameters type */
export interface GetUserByEmailParams {
  email: string;
}

/** 'GetUserByEmail' return type */
export interface GetUserByEmailResult {
  branch_id: string | null;
  created_at: Date | null;
  email: string;
  first_name: string | null;
  id: string;
  last_name: string | null;
  role: user_role;
}

/** 'GetUserByEmail' query type */
export interface GetUserByEmailQuery {
  params: GetUserByEmailParams;
  result: GetUserByEmailResult;
}

const getUserByEmailIR: any = {"usedParamSet":{"email":true},"params":[{"name":"email","required":true,"transform":{"type":"scalar"},"locs":[{"a":124,"b":130}]}],"statement":"SELECT\n  id,\n  email,\n  first_name,\n  last_name,\n  role,\n  branch_id,\n  \"createdAt\" as created_at\nFROM \"user\"\nWHERE email = :email!"};

/**
 * Query generated from SQL:
 * ```
 * SELECT
 *   id,
 *   email,
 *   first_name,
 *   last_name,
 *   role,
 *   branch_id,
 *   "createdAt" as created_at
 * FROM "user"
 * WHERE email = :email!
 * ```
 */
export const getUserByEmail = new PreparedQuery<GetUserByEmailParams,GetUserByEmailResult>(getUserByEmailIR);


