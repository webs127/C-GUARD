import { ConflictError, NotFoundError } from '../../common/errors/AppError';
import type {
  CreateCampInput,
  ListCampsQuery,
  UpdateCampInput,
} from './camp.schemas';
import * as campRepository from './camp.repository';
import type { Camp } from './camp.types';

function mapCamp(row: campRepository.CampRow): Camp {
  return {
    id: row.id,
    name: row.name,
    address: row.address,
    state: row.state,
    latitude: row.latitude,
    longitude: row.longitude,
    isActive: row.is_active,
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
    err.constraint === 'camps_name_state_lower_unique'
  ) {
    return new ConflictError('A camp with this name already exists in this state');
  }

  return err instanceof Error ? err : new Error('Unexpected database error');
}

export async function listCamps(filters: ListCampsQuery): Promise<Camp[]> {
  const rows = await campRepository.listCamps({
    ...filters,
    isActive: filters.isActive ?? true,
  });
  return rows.map(mapCamp);
}

export async function getCamp(campId: string): Promise<Camp> {
  const row = await campRepository.findCampById(campId);
  if (!row) {
    throw new NotFoundError('Camp not found');
  }
  return mapCamp(row);
}

export async function createCamp(input: CreateCampInput): Promise<Camp> {
  try {
    const row = await campRepository.createCamp(input);
    return mapCamp(row);
  } catch (err) {
    throw mapUniqueViolation(err);
  }
}

export async function updateCamp(
  campId: string,
  input: UpdateCampInput,
): Promise<Camp> {
  try {
    const row = await campRepository.updateCamp(campId, input);
    if (!row) {
      throw new NotFoundError('Camp not found');
    }
    return mapCamp(row);
  } catch (err) {
    throw mapUniqueViolation(err);
  }
}
