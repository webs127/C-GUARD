import type { PoolClient } from 'pg';
import { withTransaction } from '../../config/database';
import {
  BadRequestError,
  ConflictError,
  ForbiddenError,
  NotFoundError,
} from '../../common/errors/AppError';
import type {
  AssignCampInput,
  CreateEmergencyContactInput,
  UpdateCorpsMemberProfileInput,
  UpdateEmergencyContactInput,
} from './corps-member.schemas';
import * as corpsMemberRepository from './corps-member.repository';
import type { CorpsMemberProfile, EmergencyContact } from './corps-member.types';

function mapProfile(
  row: corpsMemberRepository.CorpsMemberProfileRow,
): CorpsMemberProfile {
  return {
    userId: row.user_id,
    firstName: row.first_name,
    lastName: row.last_name,
    phone: row.phone,
    callUpNumber: row.call_up_number,
    stateCode: row.state_code,
    campId: row.camp_id,
    campName: row.camp_name,
    campState: row.camp_state,
    createdAt: row.created_at.toISOString(),
    updatedAt: row.updated_at.toISOString(),
  };
}

function mapEmergencyContact(
  row: corpsMemberRepository.EmergencyContactRow,
): EmergencyContact {
  return {
    id: row.id,
    name: row.name,
    phone: row.phone,
    relationship: row.relationship,
    isPrimary: row.is_primary,
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
  if (isPgError(err) && err.code === '23505') {
    if (err.constraint === 'emergency_contacts_member_phone_unique') {
      return new ConflictError(
        'An emergency contact with this phone number already exists',
      );
    }
    if (err.constraint === 'emergency_contacts_one_primary_unique') {
      return new ConflictError('A primary emergency contact already exists');
    }
    return new ConflictError('Emergency contact already exists');
  }

  return err instanceof Error ? err : new Error('Unexpected database error');
}

async function requireCorpsMemberProfile(
  userId: string,
  client?: PoolClient,
): Promise<corpsMemberRepository.CorpsMemberProfileRow> {
  const profile = await corpsMemberRepository.findProfileByUserId(userId, client);
  if (!profile) {
    throw new ForbiddenError('This account is not a corps member');
  }
  return profile;
}

export async function getMyProfile(userId: string): Promise<CorpsMemberProfile> {
  const profile = await requireCorpsMemberProfile(userId);
  return mapProfile(profile);
}

export async function updateMyProfile(
  userId: string,
  input: UpdateCorpsMemberProfileInput,
): Promise<CorpsMemberProfile> {
  await requireCorpsMemberProfile(userId);
  const updated = await corpsMemberRepository.updateProfile(userId, input);
  if (!updated) {
    throw new NotFoundError('Corps member profile not found');
  }
  return mapProfile(updated);
}

export async function listMyEmergencyContacts(
  userId: string,
): Promise<EmergencyContact[]> {
  await requireCorpsMemberProfile(userId);
  const rows = await corpsMemberRepository.listEmergencyContacts(userId);
  return rows.map(mapEmergencyContact);
}

export async function createMyEmergencyContact(
  userId: string,
  input: CreateEmergencyContactInput,
): Promise<EmergencyContact> {
  return withTransaction(async (client) => {
    await requireCorpsMemberProfile(userId, client);

    if (input.isPrimary) {
      await corpsMemberRepository.clearPrimaryContact(client, userId);
    }

    try {
      const row = await corpsMemberRepository.createEmergencyContact(
        client,
        userId,
        input,
      );
      return mapEmergencyContact(row);
    } catch (err) {
      throw mapUniqueViolation(err);
    }
  });
}

export async function updateMyEmergencyContact(
  userId: string,
  contactId: string,
  input: UpdateEmergencyContactInput,
): Promise<EmergencyContact> {
  return withTransaction(async (client) => {
    await requireCorpsMemberProfile(userId, client);

    if (input.isPrimary === true) {
      await corpsMemberRepository.clearPrimaryContact(
        client,
        userId,
        contactId,
      );
    }

    try {
      const row = await corpsMemberRepository.updateEmergencyContact(
        client,
        contactId,
        userId,
        input,
      );
      if (!row) {
        throw new NotFoundError('Emergency contact not found');
      }
      return mapEmergencyContact(row);
    } catch (err) {
      throw mapUniqueViolation(err);
    }
  });
}

export async function deleteMyEmergencyContact(
  userId: string,
  contactId: string,
): Promise<void> {
  await withTransaction(async (client) => {
    await requireCorpsMemberProfile(userId, client);
    const deleted = await corpsMemberRepository.deleteEmergencyContact(
      client,
      contactId,
      userId,
    );
    if (!deleted) {
      throw new NotFoundError('Emergency contact not found');
    }
  });
}

export async function assignCorpsMemberCamp(
  userId: string,
  input: AssignCampInput,
): Promise<CorpsMemberProfile> {
  return withTransaction(async (client) => {
    const exists = await corpsMemberRepository.corpsMemberExists(userId, client);
    if (!exists) {
      throw new NotFoundError('Corps member not found');
    }

    if (input.campId !== null) {
      const campIsActive = await corpsMemberRepository.activeCampExists(
        input.campId,
        client,
      );
      if (!campIsActive) {
        throw new BadRequestError('Camp not found or inactive');
      }
    }

    const assigned = await corpsMemberRepository.assignCamp(
      userId,
      input.campId,
      client,
    );
    if (!assigned) {
      throw new NotFoundError('Corps member not found');
    }

    const profile = await corpsMemberRepository.findProfileByUserId(
      userId,
      client,
    );
    if (!profile) {
      throw new NotFoundError('Corps member profile not found');
    }
    return mapProfile(profile);
  });
}
