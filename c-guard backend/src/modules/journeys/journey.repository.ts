import type { PoolClient, QueryResultRow } from 'pg';
import { exec } from '../../infrastructure/database/queryable';
import type { CreateJourneyInput, ListJourneysQuery } from './journey.schemas';
import type { JourneyStatus } from './journey.types';

export interface JourneyRow extends QueryResultRow {
  id: string;
  corps_member_id: string;
  camp_id: string | null;
  origin_label: string | null;
  origin_latitude: number | null;
  origin_longitude: number | null;
  destination_label: string | null;
  destination_latitude: number | null;
  destination_longitude: number | null;
  planned_departure_at: Date | null;
  expected_arrival_at: Date | null;
  status: JourneyStatus;
  started_at: Date | null;
  ended_at: Date | null;
  cancelled_at: Date | null;
  created_at: Date;
  updated_at: Date;
}

export interface CreateJourneyRecord {
  corpsMemberId: string;
  campId: string | null;
  input: CreateJourneyInput;
}

const JOURNEY_COLUMNS = `
  id,
  corps_member_id,
  camp_id,
  origin_label,
  origin_latitude,
  origin_longitude,
  destination_label,
  destination_latitude,
  destination_longitude,
  planned_departure_at,
  expected_arrival_at,
  status,
  started_at,
  ended_at,
  cancelled_at,
  created_at,
  updated_at
`;

export async function createJourney(
  record: CreateJourneyRecord,
  client?: PoolClient,
): Promise<JourneyRow> {
  const { input } = record;
  const result = await exec<JourneyRow>(
    client,
    `INSERT INTO journeys (
       corps_member_id,
       camp_id,
       origin_label,
       origin_latitude,
       origin_longitude,
       destination_label,
       destination_latitude,
       destination_longitude,
       planned_departure_at,
       expected_arrival_at
     )
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
     RETURNING ${JOURNEY_COLUMNS}`,
    [
      record.corpsMemberId,
      record.campId,
      input.originLabel,
      input.originLatitude ?? null,
      input.originLongitude ?? null,
      input.destinationLabel,
      input.destinationLatitude ?? null,
      input.destinationLongitude ?? null,
      input.plannedDepartureAt ?? null,
      input.expectedArrivalAt ?? null,
    ],
  );

  const row = result.rows[0];
  if (!row) {
    throw new Error('Failed to create journey');
  }
  return row;
}

export async function findJourneyById(
  journeyId: string,
  client?: PoolClient,
  forUpdate = false,
): Promise<JourneyRow | null> {
  const lock = forUpdate ? ' FOR UPDATE' : '';
  const result = await exec<JourneyRow>(
    client,
    `SELECT ${JOURNEY_COLUMNS}
     FROM journeys
     WHERE id = $1${lock}`,
    [journeyId],
  );
  return result.rows[0] ?? null;
}

export async function findActiveJourneyByMember(
  corpsMemberId: string,
  client?: PoolClient,
): Promise<JourneyRow | null> {
  const result = await exec<JourneyRow>(
    client,
    `SELECT ${JOURNEY_COLUMNS}
     FROM journeys
     WHERE corps_member_id = $1 AND status = 'active'
     LIMIT 1`,
    [corpsMemberId],
  );
  return result.rows[0] ?? null;
}

export async function listJourneys(
  filters: ListJourneysQuery,
  client?: PoolClient,
): Promise<JourneyRow[]> {
  const conditions: string[] = [];
  const values: unknown[] = [];

  if (filters.status !== undefined) {
    values.push(filters.status);
    conditions.push(`status = $${values.length}`);
  }
  if (filters.campId !== undefined) {
    values.push(filters.campId);
    conditions.push(`camp_id = $${values.length}`);
  }
  if (filters.corpsMemberId !== undefined) {
    values.push(filters.corpsMemberId);
    conditions.push(`corps_member_id = $${values.length}`);
  }

  const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  values.push(filters.limit);
  const limitParam = values.length;
  values.push(filters.offset);
  const offsetParam = values.length;

  const result = await exec<JourneyRow>(
    client,
    `SELECT ${JOURNEY_COLUMNS}
     FROM journeys
     ${where}
     ORDER BY created_at DESC
     LIMIT $${limitParam} OFFSET $${offsetParam}`,
    values,
  );
  return result.rows;
}

export async function startJourney(
  client: PoolClient,
  journeyId: string,
): Promise<JourneyRow | null> {
  const result = await client.query<JourneyRow>(
    `UPDATE journeys
     SET status = 'active',
         started_at = now(),
         ended_at = NULL,
         cancelled_at = NULL
     WHERE id = $1
     RETURNING ${JOURNEY_COLUMNS}`,
    [journeyId],
  );
  return result.rows[0] ?? null;
}

export async function endJourney(
  client: PoolClient,
  journeyId: string,
): Promise<JourneyRow | null> {
  const result = await client.query<JourneyRow>(
    `UPDATE journeys
     SET status = 'completed',
         ended_at = now()
     WHERE id = $1
     RETURNING ${JOURNEY_COLUMNS}`,
    [journeyId],
  );
  return result.rows[0] ?? null;
}

export async function cancelJourney(
  client: PoolClient,
  journeyId: string,
): Promise<JourneyRow | null> {
  const result = await client.query<JourneyRow>(
    `UPDATE journeys
     SET status = 'cancelled',
         cancelled_at = now(),
         ended_at = CASE WHEN status = 'active' THEN now() ELSE ended_at END
     WHERE id = $1
     RETURNING ${JOURNEY_COLUMNS}`,
    [journeyId],
  );
  return result.rows[0] ?? null;
}
