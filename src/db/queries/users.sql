/* @name GetUserByEmail */
SELECT
  id,
  email,
  first_name,
  last_name,
  role,
  branch_id,
  "createdAt" as created_at
FROM "user"
WHERE email = :email!;
