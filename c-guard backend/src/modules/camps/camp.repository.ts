import type { PoolClient, QueryResultRow } from 'pg';
import { exec } from '../../infrastructure/database/queryable';
import type {
  CreateCampInput,
  ListCampsQuery,
  UpdateCampInput,
} from './camp.schemas';

export interface CampRow extends QueryResultRow {
  id: string;
  name: string;
  address: string | null;
  state: string;
  latitude: number;
  longitude: number;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

const CAMP_COLUMNS = `
  id, name, address, state, latitude, longitude, is_active, created_at, updated_at
`;

export async function listCamps(
  filters: ListCampsQuery,
  client?: PoolClient,
): Promise<CampRow[]> {
  const conditions: string[] = [];
  const values: unknown[] = [];

  if (filters.state !== undefined) {
    values.push(filters.state);
    conditions.push(`lower(state) = lower($${values.length})`);
  }
  if (filters.isActive !== undefined) {
    values.push(filters.isActive);
    conditions.push(`is_active = $${values.length}`);
  }

  const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
  const result = await exec<CampRow>(
    client,
    `SELECT ${CAMP_COLUMNS}
     FROM camps
     ${where}
     ORDER BY state ASC, name ASC`,
    values,
  );
  return result.rows;
}

export async function findCampById(
  campId: string,
  client?: PoolClient,
): Promise<CampRow | null> {
  const result = await exec<CampRow>(
    client,
    `SELECT ${CAMP_COLUMNS}
     FROM camps
     WHERE id = $1`,
    [campId],
  );
  return result.rows[0] ?? null;
}

export async function createCamp(
  input: CreateCampInput,
  client?: PoolClient,
): Promise<CampRow> {
  const result = await exec<CampRow>(
    client,
    `INSERT INTO camps (name, address, state, latitude, longitude, is_active)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING ${CAMP_COLUMNS}`,
    [
      input.name,
      input.address ?? null,
      input.state,
      input.latitude,
      input.longitude,
      input.isActive ?? true,
    ],
  );

  const row = result.rows[0];
  if (!row) {
    throw new Error('Failed to create camp');
  }
  return row;
}

export async function updateCamp(
  campId: string,
  input: UpdateCampInput,
  client?: PoolClient,
): Promise<CampRow | null> {
  const sets: string[] = [];
  const values: unknown[] = [];

  if (input.name !== undefined) {
    values.push(input.name);
    sets.push(`name = $${values.length}`);
  }
  if (input.address !== undefined) {
    values.push(input.address);
    sets.push(`address = $${values.length}`);
  }
  if (input.state !== undefined) {
    values.push(input.state);
    sets.push(`state = $${values.length}`);
  }
  if (input.latitude !== undefined) {
    values.push(input.latitude);
    sets.push(`latitude = $${values.length}`);
  }
  if (input.longitude !== undefined) {
    values.push(input.longitude);
    sets.push(`longitude = $${values.length}`);
  }
  if (input.isActive !== undefined) {
    values.push(input.isActive);
    sets.push(`is_active = $${values.length}`);
  }

  if (sets.length === 0) {
    return findCampById(campId, client);
  }

  values.push(campId);
  const result = await exec<CampRow>(
    client,
    `UPDATE camps
     SET ${sets.join(', ')}
     WHERE id = $${values.length}
     RETURNING ${CAMP_COLUMNS}`,
    values,
  );
  return result.rows[0] ?? null;
}
