import type { PoolClient } from 'pg';
import { withTransaction } from '../../config/database';
import {
  BadRequestError,
  ConflictError,
  ForbiddenError,
  NotFoundError,
} from '../../common/errors/AppError';
import type { AuthUser } from '../auth/auth.types';
import * as campService from '../camps/camp.service';
import * as corpsMemberService from '../corps-members/corps-member.service';
import type { CreateJourneyInput, ListJourneysQuery } from './journey.schemas';
import * as journeyRepository from './journey.repository';
import type { Journey } from './journey.types';

function mapJourney(row: journeyRepository.JourneyRow): Journey {
  return {
    id: row.id,
    corpsMemberId: row.corps_member_id,
    campId: row.camp_id,
    originLabel: row.origin_label,
    originLatitude: row.origin_latitude,
    originLongitude: row.origin_longitude,
    destinationLabel: row.destination_label,
    destinationLatitude: row.destination_latitude,
    destinationLongitude: row.destination_longitude,
    plannedDepartureAt: row.planned_departure_at?.toISOString() ?? null,
    expectedArrivalAt: row.expected_arrival_at?.toISOString() ?? null,
    status: row.status,
    startedAt: row.started_at?.toISOString() ?? null,
    endedAt: row.ended_at?.toISOString() ?? null,
    cancelledAt: row.cancelled_at?.toISOString() ?? null,
    createdAt: row.created_at.toISOString(),
    updatedAt: row.updated_at.toISOString(),
  };
}

interface PgError {
  code?: string;
  constraint?: string;
}

function isPgError(err: unknown): err is PgError {
  return typeof err === 'object' && err !== null && 'code' in err;
}

function mapUniqueViolation(err: unknown): Error {
  if (
    isPgError(err) &&
    err.code === '23505' &&
    err.constraint === 'journeys_one_active_per_member_unique'
  ) {
    return new ConflictError('Corps member already has an active journey');
  }

  return err instanceof Error ? err : new Error('Unexpected database error');
}

function hasPermission(user: AuthUser, permission: string): boolean {
  return user.permissions.includes(permission);
}

function canReadJourney(user: AuthUser, row: journeyRepository.JourneyRow): boolean {
  return (
    row.corps_member_id === user.id || hasPermission(user, 'journeys:read')
  );
}

function canManageJourney(
  user: AuthUser,
  row: journeyRepository.JourneyRow,
): boolean {
  return (
    row.corps_member_id === user.id || hasPermission(user, 'journeys:manage')
  );
}

async function findJourneyOrThrow(journeyId: string): Promise<journeyRepository.JourneyRow> {
  const row = await journeyRepository.findJourneyById(journeyId);
  if (!row) {
    throw new NotFoundError('Journey not found');
  }
  return row;
}

async function findJourneyForUpdateOrThrow(
  client: PoolClient,
  journeyId: string,
): Promise<journeyRepository.JourneyRow> {
  const row = await journeyRepository.findJourneyById(journeyId, client, true);
  if (!row) {
    throw new NotFoundError('Journey not found');
  }
  return row;
}

async function resolveCampId(
  requestedCampId: string | null | undefined,
  assignedCampId: string | null,
): Promise<string | null> {
  const campId =
    requestedCampId === undefined ? assignedCampId : requestedCampId;

  if (campId === null) {
    return null;
  }

  try {
    const camp = await campService.getCamp(campId);
    if (!camp.isActive) {
      throw new BadRequestError('Camp not found or inactive');
    }
    return camp.id;
  } catch (err) {
    if (err instanceof NotFoundError) {
      throw new BadRequestError('Camp not found or inactive');
    }
    throw err;
  }
}

export async function createJourney(
  user: AuthUser,
  input: CreateJourneyInput,
): Promise<Journey> {
  const profile = await corpsMemberService.getMyProfile(user.id);
  const campId = await resolveCampId(input.campId, profile.campId);

  const row = await journeyRepository.createJourney({
    corpsMemberId: user.id,
    campId,
    input,
  });
  return mapJourney(row);
}

export async function listJourneys(
  user: AuthUser,
  filters: ListJourneysQuery,
): Promise<Journey[]> {
  const isCorpsMember = await corpsMemberService.isCorpsMember(user.id);

  if (isCorpsMember) {
    const rows = await journeyRepository.listJourneys({
      ...filters,
      corpsMemberId: user.id,
    });
    return rows.map(mapJourney);
  }

  if (!hasPermission(user, 'journeys:read')) {
    throw new ForbiddenError('Insufficient permissions');
  }

  const rows = await journeyRepository.listJourneys(filters);
  return rows.map(mapJourney);
}

export async function getActiveJourney(user: AuthUser): Promise<Journey> {
  await corpsMemberService.getMyProfile(user.id);

  const row = await journeyRepository.findActiveJourneyByMember(user.id);
  if (!row) {
    throw new NotFoundError('No active journey found');
  }
  return mapJourney(row);
}

export async function getJourney(
  user: AuthUser,
  journeyId: string,
): Promise<Journey> {
  const row = await findJourneyOrThrow(journeyId);
  if (!canReadJourney(user, row)) {
    throw new ForbiddenError('You are not allowed to access this journey');
  }
  return mapJourney(row);
}

export async function startJourney(
  user: AuthUser,
  journeyId: string,
): Promise<Journey> {
  return withTransaction(async (client) => {
    const row = await findJourneyForUpdateOrThrow(client, journeyId);
    if (!canManageJourney(user, row)) {
      throw new ForbiddenError('You are not allowed to manage this journey');
    }
    if (row.status !== 'scheduled') {
      throw new ConflictError(
        `Journey cannot be started from ${row.status} status`,
      );
    }

    const active = await journeyRepository.findActiveJourneyByMember(
      row.corps_member_id,
      client,
    );
    if (active && active.id !== row.id) {
      throw new ConflictError('Corps member already has an active journey');
    }

    try {
      const updated = await journeyRepository.startJourney(client, journeyId);
      if (!updated) {
        throw new Error('Failed to start journey');
      }
      return mapJourney(updated);
    } catch (err) {
      throw mapUniqueViolation(err);
    }
  });
}

export async function endJourney(
  user: AuthUser,
  journeyId: string,
): Promise<Journey> {
  return withTransaction(async (client) => {
    const row = await findJourneyForUpdateOrThrow(client, journeyId);
    if (!canManageJourney(user, row)) {
      throw new ForbiddenError('You are not allowed to manage this journey');
    }
    if (row.status !== 'active') {
      throw new ConflictError(
        `Journey cannot be ended from ${row.status} status`,
      );
    }

    const updated = await journeyRepository.endJourney(client, journeyId);
    if (!updated) {
      throw new Error('Failed to end journey');
    }
    return mapJourney(updated);
  });
}

export async function cancelJourney(
  user: AuthUser,
  journeyId: string,
): Promise<Journey> {
  return withTransaction(async (client) => {
    const row = await findJourneyForUpdateOrThrow(client, journeyId);
    if (!canManageJourney(user, row)) {
      throw new ForbiddenError('You are not allowed to manage this journey');
    }
    if (row.status !== 'scheduled' && row.status !== 'active') {
      throw new ConflictError(
        `Journey cannot be cancelled from ${row.status} status`,
      );
    }

    const updated = await journeyRepository.cancelJourney(client, journeyId);
    if (!updated) {
      throw new Error('Failed to cancel journey');
    }
    return mapJourney(updated);
  });
}
