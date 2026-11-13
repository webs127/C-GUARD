import type { PoolClient, QueryResultRow } from 'pg';
import { exec, type Queryable } from '../../infrastructure/database/queryable';
import type { UserStatus } from './auth.types';

export interface UserRow extends QueryResultRow {
  id: string;
  email: string;
  password_hash: string;
  status: UserStatus;
  email_verified_at: Date | null;
  last_login_at: Date | null;
  created_at: Date;
  updated_at: Date;
}

export interface AuthContextRow extends QueryResultRow {
  id: string;
  email: string;
  status: UserStatus;
  email_verified_at: Date | null;
  last_login_at: Date | null;
  created_at: Date;
  updated_at: Date;
  roles: string[];
  permissions: string[];
}

export interface CorpsMemberProfileRow extends QueryResultRow {
  user_id: string;
  first_name: string;
  last_name: string;
  phone: string | null;
  call_up_number: string;
  state_code: string;
  camp_id: string | null;
  camp_name: string | null;
  camp_state: string | null;
}

export interface PersonnelProfileRow extends QueryResultRow {
  user_id: string;
  first_name: string;
  last_name: string;
  phone: string | null;
  job_title: string | null;
}

export interface RefreshTokenRow extends QueryResultRow {
  id: string;
  user_id: string;
  expires_at: Date;
  revoked_at: Date | null;
}

export interface CreateCorpsMemberInput {
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  callUpNumber: string;
  stateCode: string;
  campId: string;
}

export interface InsertRefreshTokenInput {
  userId: string;
  tokenHash: string;
  expiresAt: Date;
  userAgent: string | null;
  ipAddress: string | null;
}

export async function findUserByEmail(email: string): Promise<UserRow | null> {
  const result = await exec<UserRow>(
    undefined,
    `SELECT id, email, password_hash, status, email_verified_at, last_login_at, created_at, updated_at
     FROM users
     WHERE lower(email) = lower($1)
     LIMIT 1`,
    [email],
  );
  return result.rows[0] ?? null;
}

export async function findAuthContext(
  userId: string,
  client?: PoolClient,
): Promise<AuthContextRow | null> {
  const result = await exec<AuthContextRow>(
    client,
    `SELECT
       u.id,
       u.email,
       u.status,
       u.email_verified_at,
       u.last_login_at,
       u.created_at,
       u.updated_at,
       COALESCE(
         array_agg(DISTINCT r.name) FILTER (WHERE r.name IS NOT NULL),
         ARRAY[]::text[]
       ) AS roles,
       COALESCE(
         array_agg(DISTINCT p.key) FILTER (WHERE p.key IS NOT NULL),
         ARRAY[]::text[]
       ) AS permissions
     FROM users u
     LEFT JOIN user_roles ur ON ur.user_id = u.id
     LEFT JOIN roles r ON r.id = ur.role_id
     LEFT JOIN role_permissions rp ON rp.role_id = r.id
     LEFT JOIN permissions p ON p.id = rp.permission_id
     WHERE u.id = $1
     GROUP BY u.id`,
    [userId],
  );
  return result.rows[0] ?? null;
}

export async function findActiveCamp(
  campId: string,
  client?: PoolClient,
): Promise<boolean> {
  const result = await exec<QueryResultRow>(
    client,
    `SELECT 1 FROM camps WHERE id = $1 AND is_active = TRUE`,
    [campId],
  );
  return result.rowCount !== null && result.rowCount > 0;
}

export async function createCorpsMemberUser(
  client: PoolClient,
  input: CreateCorpsMemberInput,
): Promise<string> {
  const userResult = await client.query<{ id: string }>(
    `INSERT INTO users (email, password_hash, status)
     VALUES ($1, $2, 'active')
     RETURNING id`,
    [input.email, input.passwordHash],
  );

  const userId = userResult.rows[0]?.id;
  if (!userId) {
    throw new Error('Failed to create user');
  }

  await client.query(
    `INSERT INTO corps_members (
       user_id, first_name, last_name, phone, call_up_number, state_code, camp_id
     )
     VALUES ($1, $2, $3, $4, $5, $6, $7)`,
    [
      userId,
      input.firstName,
      input.lastName,
      input.phone,
      input.callUpNumber,
      input.stateCode,
      input.campId,
    ],
  );

  return userId;
}

export async function touchLastLogin(
  userId: string,
  client?: PoolClient,
): Promise<void> {
  await exec(
    client,
    `UPDATE users SET last_login_at = now() WHERE id = $1`,
    [userId],
  );
}

export async function getCorpsMemberProfile(
  userId: string,
  client?: PoolClient,
): Promise<CorpsMemberProfileRow | null> {
  const result = await exec<CorpsMemberProfileRow>(
    client,
    `SELECT
       cm.user_id,
       cm.first_name,
       cm.last_name,
       cm.phone,
       cm.call_up_number,
       cm.state_code,
       cm.camp_id,
       c.name AS camp_name,
       c.state AS camp_state
     FROM corps_members cm
     LEFT JOIN camps c ON c.id = cm.camp_id
     WHERE cm.user_id = $1`,
    [userId],
  );
  return result.rows[0] ?? null;
}

export async function getPersonnelProfile(
  userId: string,
  client?: PoolClient,
): Promise<PersonnelProfileRow | null> {
  const result = await exec<PersonnelProfileRow>(
    client,
    `SELECT user_id, first_name, last_name, phone, job_title
     FROM personnel
     WHERE user_id = $1`,
    [userId],
  );
  return result.rows[0] ?? null;
}

export async function insertRefreshToken(
  client: PoolClient,
  input: InsertRefreshTokenInput,
): Promise<string> {
  const result = await client.query<{ id: string }>(
    `INSERT INTO refresh_tokens (
       user_id, token_hash, expires_at, user_agent, ip_address
     )
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id`,
    [
      input.userId,
      input.tokenHash,
      input.expiresAt,
      input.userAgent,
      input.ipAddress,
    ],
  );

  const id = result.rows[0]?.id;
  if (!id) {
    throw new Error('Failed to create refresh token');
  }
  return id;
}

export async function findRefreshTokenByHash(
  client: PoolClient,
  tokenHash: string,
  forUpdate = false,
): Promise<RefreshTokenRow | null> {
  const result = await client.query<RefreshTokenRow>(
    `SELECT id, user_id, expires_at, revoked_at
     FROM refresh_tokens
     WHERE token_hash = $1
     ${forUpdate ? 'FOR UPDATE' : ''}`,
    [tokenHash],
  );
  return result.rows[0] ?? null;
}

export async function revokeRefreshToken(
  client: PoolClient,
  tokenId: string,
  replacedBy: string | null = null,
): Promise<void> {
  await client.query(
    `UPDATE refresh_tokens
     SET revoked_at = now(), replaced_by = $2
     WHERE id = $1 AND revoked_at IS NULL`,
    [tokenId, replacedBy],
  );
}

export async function revokeRefreshTokenByHash(
  client: PoolClient,
  tokenHash: string,
): Promise<void> {
  await client.query(
    `UPDATE refresh_tokens
     SET revoked_at = now()
     WHERE token_hash = $1 AND revoked_at IS NULL`,
    [tokenHash],
  );
}

export async function revokeAllRefreshTokens(
  client: PoolClient,
  userId: string,
): Promise<void> {
  await client.query(
    `UPDATE refresh_tokens
     SET revoked_at = now()
     WHERE user_id = $1 AND revoked_at IS NULL`,
    [userId],
  );
}
