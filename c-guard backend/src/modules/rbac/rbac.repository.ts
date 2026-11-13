import type { PoolClient, QueryResultRow } from 'pg';
import { exec } from '../../infrastructure/database/queryable';

export interface RoleRow extends QueryResultRow {
  id: string;
  name: string;
  description: string | null;
  permissions: string[];
}

export interface PermissionRow extends QueryResultRow {
  id: string;
  key: string;
  description: string | null;
}

export interface UserRoleRow extends QueryResultRow {
  id: string;
  name: string;
  description: string | null;
}

export async function listRoles(client?: PoolClient): Promise<RoleRow[]> {
  const result = await exec<RoleRow>(
    client,
    `SELECT
       r.id,
       r.name,
       r.description,
       COALESCE(
         array_agg(DISTINCT p.key) FILTER (WHERE p.key IS NOT NULL),
         ARRAY[]::text[]
       ) AS permissions
     FROM roles r
     LEFT JOIN role_permissions rp ON rp.role_id = r.id
     LEFT JOIN permissions p ON p.id = rp.permission_id
     GROUP BY r.id
     ORDER BY r.name`,
  );
  return result.rows;
}

export async function listPermissions(
  client?: PoolClient,
): Promise<PermissionRow[]> {
  const result = await exec<PermissionRow>(
    client,
    `SELECT id, key, description
     FROM permissions
     ORDER BY key`,
  );
  return result.rows;
}

export async function userExists(
  userId: string,
  client?: PoolClient,
): Promise<boolean> {
  const result = await exec<QueryResultRow>(
    client,
    `SELECT 1 FROM users WHERE id = $1`,
    [userId],
  );
  return result.rowCount !== null && result.rowCount > 0;
}

export async function getUserRoles(
  userId: string,
  client?: PoolClient,
): Promise<UserRoleRow[]> {
  const result = await exec<UserRoleRow>(
    client,
    `SELECT r.id, r.name, r.description
     FROM user_roles ur
     JOIN roles r ON r.id = ur.role_id
     WHERE ur.user_id = $1
     ORDER BY r.name`,
    [userId],
  );
  return result.rows;
}

export async function findRolesByIds(
  roleIds: string[],
  client?: PoolClient,
): Promise<UserRoleRow[]> {
  const result = await exec<UserRoleRow>(
    client,
    `SELECT id, name, description
     FROM roles
     WHERE id = ANY($1::uuid[])
     ORDER BY name`,
    [roleIds],
  );
  return result.rows;
}

export async function replaceUserRoles(
  client: PoolClient,
  userId: string,
  roleIds: string[],
): Promise<void> {
  await client.query(`DELETE FROM user_roles WHERE user_id = $1`, [userId]);

  if (roleIds.length === 0) {
    return;
  }

  await client.query(
    `INSERT INTO user_roles (user_id, role_id)
     SELECT $1, unnest($2::uuid[])
     ON CONFLICT DO NOTHING`,
    [userId, roleIds],
  );
}
