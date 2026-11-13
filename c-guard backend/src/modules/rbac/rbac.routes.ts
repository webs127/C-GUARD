import { Router } from 'express';
import { authenticate } from '../../common/middleware/auth.middleware';
import { requirePermissions } from '../../common/middleware/rbac.middleware';
import {
  getUserRoles,
  listPermissions,
  listRoles,
  setUserRoles,
} from './rbac.controller';

export const rbacRouter = Router();

rbacRouter.use(authenticate);
rbacRouter.use(requirePermissions('roles:manage'));

rbacRouter.get('/roles', listRoles);
rbacRouter.get('/permissions', listPermissions);
rbacRouter.get('/users/:userId/roles', getUserRoles);
rbacRouter.put('/users/:userId/roles', setUserRoles);
