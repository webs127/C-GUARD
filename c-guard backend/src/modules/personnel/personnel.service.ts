import { withTransaction } from '../../config/database';
import {
  BadRequestError,
  ConflictError,
  ForbiddenError,
} from '../../common/errors/AppError';
import { hashPassword } from '../auth/auth.passwords';
import * as rbacRepository from '../rbac/rbac.repository';
import type {
  CreatePersonnelInput,
  UpdatePersonnelProfileInput,
} from './personnel.schemas';
import * as personnelRepository from './personnel.repository';
import type { PersonnelProfile } from './personnel.types';

function mapProfile(
  row: personnelRepository.PersonnelProfileRow,
): PersonnelProfile {
  return {
    userId: row.user_id,
    email: row.email,
    status: row.status,
    firstName: row.first_name,
    lastName: row.last_name,
    phone: row.phone,
    jobTitle: row.job_title,
    roles: row.roles,
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
    err.constraint === 'users_email_lower_unique'
  ) {
    return new ConflictError('An account with this email already exists');
  }

  return err instanceof Error ? err : new Error('Unexpected database error');
}

export async function getMyProfile(userId: string): Promise<PersonnelProfile> {
  const profile = await personnelRepository.findProfileByUserId(userId);
  if (!profile) {
    throw new ForbiddenError('This account is not personnel');
  }
  return mapProfile(profile);
}

export async function updateMyProfile(
  userId: string,
  input: UpdatePersonnelProfileInput,
): Promise<PersonnelProfile> {
  const updated = await personnelRepository.updateProfile(userId, input);
  if (!updated) {
    throw new ForbiddenError('This account is not personnel');
  }
  return mapProfile(updated);
}

export async function provisionPersonnel(
  input: CreatePersonnelInput,
): Promise<PersonnelProfile> {
  const uniqueRoleIds = Array.from(new Set(input.roleIds));
  const passwordHash = await hashPassword(input.password);

  return withTransaction(async (client) => {
    const roles = await rbacRepository.findRolesByIds(uniqueRoleIds, client);
    if (roles.length !== uniqueRoleIds.length) {
      throw new BadRequestError('One or more roles do not exist');
    }

    let userId: string;
    try {
      userId = await personnelRepository.createPersonnelUser(
        client,
        input,
        passwordHash,
      );
    } catch (err) {
      throw mapUniqueViolation(err);
    }

    await rbacRepository.replaceUserRoles(client, userId, uniqueRoleIds);

    const profile = await personnelRepository.findProfileByUserId(
      userId,
      client,
    );
    if (!profile) {
      throw new Error('Failed to load provisioned personnel profile');
    }
    return mapProfile(profile);
  });
}
