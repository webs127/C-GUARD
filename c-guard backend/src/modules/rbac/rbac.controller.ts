import type { RequestHandler } from 'express';
import { z } from 'zod';
import { ok } from '../../common/utils/response';
import * as rbacService from './rbac.service';
import { setUserRolesSchema } from './rbac.schemas';

export const listRoles: RequestHandler = async (_req, res, next) => {
  try {
    const roles = await rbacService.getRoles();
    ok(res, roles, 'Roles retrieved successfully');
  } catch (err) {
    next(err);
  }
};

export const listPermissions: RequestHandler = async (_req, res, next) => {
  try {
    const permissions = await rbacService.getPermissions();
    ok(res, permissions, 'Permissions retrieved successfully');
  } catch (err) {
    next(err);
  }
};

export const getUserRoles: RequestHandler = async (req, res, next) => {
  try {
    const userId = z.uuid().parse(req.params.userId);
    const roles = await rbacService.getUserRoles(userId);
    ok(res, roles, 'User roles retrieved successfully');
  } catch (err) {
    next(err);
  }
};

export const setUserRoles: RequestHandler = async (req, res, next) => {
  try {
    const userId = z.uuid().parse(req.params.userId);
    const input = setUserRolesSchema.parse(req.body);
    const roles = await rbacService.setUserRoles(userId, input.roleIds);
    ok(res, roles, 'User roles updated successfully');
  } catch (err) {
    next(err);
  }
};
