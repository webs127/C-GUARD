import type { PoolClient, QueryResultRow } from 'pg';
import { exec } from '../../infrastructure/database/queryable';
import type {
  CreateEmergencyContactInput,
  UpdateCorpsMemberProfileInput,
  UpdateEmergencyContactInput,
} from './corps-member.schemas';

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
  created_at: Date;
  updated_at: Date;
}

export interface EmergencyContactRow extends QueryResultRow {
  id: string;
  name: string;
  phone: string;
  relationship: string | null;
  is_primary: boolean;
  created_at: Date;
  updated_at: Date;
}

const PROFILE_SELECT = `
  SELECT
    cm.user_id,
    cm.first_name,
    cm.last_name,
    cm.phone,
    cm.call_up_number,
    cm.state_code,
    cm.camp_id,
    c.name AS camp_name,
    c.state AS camp_state,
    cm.created_at,
    cm.updated_at
  FROM corps_members cm
  LEFT JOIN camps c ON c.id = cm.camp_id
`;

export async function findProfileByUserId(
  userId: string,
  client?: PoolClient,
): Promise<CorpsMemberProfileRow | null> {
  const result = await exec<CorpsMemberProfileRow>(
    client,
    `${PROFILE_SELECT}
     WHERE cm.user_id = $1`,
    [userId],
  );
  return result.rows[0] ?? null;
}

export async function corpsMemberExists(
  userId: string,
  client?: PoolClient,
): Promise<boolean> {
  const result = await exec<QueryResultRow>(
    client,
    `SELECT 1 FROM corps_members WHERE user_id = $1`,
    [userId],
  );
  return result.rowCount !== null && result.rowCount > 0;
}

export async function activeCampExists(
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

export async function updateProfile(
  userId: string,
  input: UpdateCorpsMemberProfileInput,
  client?: PoolClient,
): Promise<CorpsMemberProfileRow | null> {
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

  if (sets.length === 0) {
    return findProfileByUserId(userId, client);
  }

  values.push(userId);
  const result = await exec<CorpsMemberProfileRow>(
    client,
    `WITH updated AS (
       UPDATE corps_members
       SET ${sets.join(', ')}
       WHERE user_id = $${values.length}
       RETURNING *
     )
     SELECT
       u.user_id,
       u.first_name,
       u.last_name,
       u.phone,
       u.call_up_number,
       u.state_code,
       u.camp_id,
       c.name AS camp_name,
       c.state AS camp_state,
       u.created_at,
       u.updated_at
     FROM updated u
     LEFT JOIN camps c ON c.id = u.camp_id`,
    values,
  );
  return result.rows[0] ?? null;
}

export async function assignCamp(
  userId: string,
  campId: string | null,
  client?: PoolClient,
): Promise<boolean> {
  const result = await exec<QueryResultRow>(
    client,
    `UPDATE corps_members
     SET camp_id = $2
     WHERE user_id = $1
     RETURNING user_id`,
    [userId, campId],
  );
  return result.rowCount !== null && result.rowCount > 0;
}

export async function listEmergencyContacts(
  corpsMemberId: string,
  client?: PoolClient,
): Promise<EmergencyContactRow[]> {
  const result = await exec<EmergencyContactRow>(
    client,
    `SELECT id, name, phone, relationship, is_primary, created_at, updated_at
     FROM emergency_contacts
     WHERE corps_member_id = $1
     ORDER BY is_primary DESC, created_at ASC`,
    [corpsMemberId],
  );
  return result.rows;
}

export async function createEmergencyContact(
  client: PoolClient,
  corpsMemberId: string,
  input: CreateEmergencyContactInput,
): Promise<EmergencyContactRow> {
  const result = await client.query<EmergencyContactRow>(
    `INSERT INTO emergency_contacts (
       corps_member_id, name, phone, relationship, is_primary
     )
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, name, phone, relationship, is_primary, created_at, updated_at`,
    [
      corpsMemberId,
      input.name,
      input.phone,
      input.relationship ?? null,
      input.isPrimary ?? false,
    ],
  );

  const row = result.rows[0];
  if (!row) {
    throw new Error('Failed to create emergency contact');
  }
  return row;
}

export async function updateEmergencyContact(
  client: PoolClient,
  contactId: string,
  corpsMemberId: string,
  input: UpdateEmergencyContactInput,
): Promise<EmergencyContactRow | null> {
  const sets: string[] = [];
  const values: unknown[] = [];

  if (input.name !== undefined) {
    values.push(input.name);
    sets.push(`name = $${values.length}`);
  }
  if (input.phone !== undefined) {
    values.push(input.phone);
    sets.push(`phone = $${values.length}`);
  }
  if (input.relationship !== undefined) {
    values.push(input.relationship);
    sets.push(`relationship = $${values.length}`);
  }
  if (input.isPrimary !== undefined) {
    values.push(input.isPrimary);
    sets.push(`is_primary = $${values.length}`);
  }

  if (sets.length === 0) {
    return null;
  }

  values.push(contactId);
  const contactParam = values.length;
  values.push(corpsMemberId);
  const memberParam = values.length;

  const result = await client.query<EmergencyContactRow>(
    `UPDATE emergency_contacts
     SET ${sets.join(', ')}
     WHERE id = $${contactParam} AND corps_member_id = $${memberParam}
     RETURNING id, name, phone, relationship, is_primary, created_at, updated_at`,
    values,
  );
  return result.rows[0] ?? null;
}

export async function deleteEmergencyContact(
  client: PoolClient,
  contactId: string,
  corpsMemberId: string,
): Promise<boolean> {
  const result = await client.query<{ id: string }>(
    `DELETE FROM emergency_contacts
     WHERE id = $1 AND corps_member_id = $2
     RETURNING id`,
    [contactId, corpsMemberId],
  );
  return result.rowCount !== null && result.rowCount > 0;
}

export async function clearPrimaryContact(
  client: PoolClient,
  corpsMemberId: string,
  exceptContactId: string | null = null,
): Promise<void> {
  await client.query(
    `UPDATE emergency_contacts
     SET is_primary = FALSE
     WHERE corps_member_id = $1
       AND is_primary = TRUE
       AND ($2::uuid IS NULL OR id <> $2)`,
    [corpsMemberId, exceptContactId],
  );
}
