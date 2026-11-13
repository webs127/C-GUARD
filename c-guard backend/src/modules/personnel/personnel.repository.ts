import type { PoolClient, QueryResultRow } from 'pg';
import { exec } from '../../infrastructure/database/queryable';
import type { UserStatus } from '../auth/auth.types';
import type {
  CreatePersonnelInput,
  UpdatePersonnelProfileInput,
} from './personnel.schemas';

export interface PersonnelProfileRow extends QueryResultRow {
  user_id: string;
  email: string;
  status: UserStatus;
  first_name: string;
  last_name: string;
  phone: string | null;
  job_title: string | null;
  roles: string[];
  created_at: Date;
  updated_at: Date;
}

const PROFILE_SELECT = `
  SELECT
    u.id AS user_id,
    u.email,
    u.status,
    p.first_name,
    p.last_name,
    p.phone,
    p.job_title,
    COALESCE(
      array_agg(DISTINCT r.name) FILTER (WHERE r.name IS NOT NULL),
      ARRAY[]::text[]
    ) AS roles,
    p.created_at,
    p.updated_at
  FROM personnel p
  JOIN users u ON u.id = p.user_id
  LEFT JOIN user_roles ur ON ur.user_id = u.id
  LEFT JOIN roles r ON r.id = ur.role_id
`;

export async function findProfileByUserId(
  userId: string,
  client?: PoolClient,
): Promise<PersonnelProfileRow | null> {
  const result = await exec<PersonnelProfileRow>(
    client,
    `${PROFILE_SELECT}
     WHERE p.user_id = $1
     GROUP BY u.id, p.user_id`,
    [userId],
  );
  return result.rows[0] ?? null;
}

export async function createPersonnelUser(
  client: PoolClient,
  input: CreatePersonnelInput,
  passwordHash: string,
): Promise<string> {
  const userResult = await client.query<{ id: string }>(
    `INSERT INTO users (email, password_hash, status)
     VALUES ($1, $2, 'active')
     RETURNING id`,
    [input.email, passwordHash],
  );

  const userId = userResult.rows[0]?.id;
  if (!userId) {
    throw new Error('Failed to create personnel user');
  }

  await client.query(
    `INSERT INTO personnel (
       user_id, first_name, last_name, phone, job_title
     )
     VALUES ($1, $2, $3, $4, $5)`,
    [
      userId,
      input.firstName,
      input.lastName,
      input.phone ?? null,
      input.jobTitle ?? null,
    ],
  );

  return userId;
}

export async function updateProfile(
  userId: string,
  input: UpdatePersonnelProfileInput,
  client?: PoolClient,
): Promise<PersonnelProfileRow | null> {
  const sets: string[] = [];
  const values: unknown[] = [];

  if (input.firstName !== undefined) {
    values.push(input.firstName);
    sets.push(`first_name = $${values.length}`);
  }
  if (input.lastName !== undefined) {
    values.push(input.lastName);
    sets.push(`last_name = $${values.length}`);
  }
  if (input.phone !== undefined) {
    values.push(input.phone);
    sets.push(`phone = $${values.length}`);
  }
  if (input.jobTitle !== undefined) {
    values.push(input.jobTitle);
    sets.push(`job_title = $${values.length}`);
  }

  if (sets.length === 0) {
    return findProfileByUserId(userId, client);
  }

  values.push(userId);
  const result = await exec<PersonnelProfileRow>(
    client,
    `WITH updated AS (
       UPDATE personnel
       SET ${sets.join(', ')}
       WHERE user_id = $${values.length}
       RETURNING *
     )
     SELECT
       u.id AS user_id,
       u.email,
       u.status,
       p.first_name,
       p.last_name,
       p.phone,
       p.job_title,
       COALESCE(
         array_agg(DISTINCT r.name) FILTER (WHERE r.name IS NOT NULL),
         ARRAY[]::text[]
       ) AS roles,
       p.created_at,
       p.updated_at
     FROM updated p
     JOIN users u ON u.id = p.user_id
     LEFT JOIN user_roles ur ON ur.user_id = u.id
     LEFT JOIN roles r ON r.id = ur.role_id
     GROUP BY u.id, p.user_id`,
    values,
  );
  return result.rows[0] ?? null;
}
