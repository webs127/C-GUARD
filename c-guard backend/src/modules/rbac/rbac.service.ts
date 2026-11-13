import { withTransaction } from '../../config/database';
import { BadRequestError, NotFoundError } from '../../common/errors/AppError';
import * as rbacRepository from './rbac.repository';
import type { Permission, Role, UserRole } from './rbac.types';

function mapRole(row: rbacRepository.RoleRow): Role {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    permissions: row.permissions,
  };
}

function mapPermission(row: rbacRepository.PermissionRow): Permission {
  return {
    id: row.id,
    key: row.key,
    description: row.description,
  };
}

function mapUserRole(row: rbacRepository.UserRoleRow): UserRole {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
  };
}

export async function getRoles(): Promise<Role[]> {
  const rows = await rbacRepository.listRoles();
  return rows.map(mapRole);
}

export async function getPermissions(): Promise<Permission[]> {
  const rows = await rbacRepository.listPermissions();
  return rows.map(mapPermission);
}

export async function getUserRoles(userId: string): Promise<UserRole[]> {
  const exists = await rbacRepository.userExists(userId);
  if (!exists) {
    throw new NotFoundError('User not found');
  }

  const rows = await rbacRepository.getUserRoles(userId);
  return rows.map(mapUserRole);
}

export async function setUserRoles(
  userId: string,
  roleIds: string[],
): Promise<UserRole[]> {
  const uniqueRoleIds = Array.from(new Set(roleIds));

  return withTransaction(async (client) => {
    const exists = await rbacRepository.userExists(userId, client);
    if (!exists) {
      throw new NotFoundError('User not found');
    }

    const roles = await rbacRepository.findRolesByIds(uniqueRoleIds, client);
    if (roles.length !== uniqueRoleIds.length) {
      throw new BadRequestError('One or more roles do not exist');
    }

    await rbacRepository.replaceUserRoles(client, userId, uniqueRoleIds);
    return roles.map(mapUserRole);
  });
}
