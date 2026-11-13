import { Router } from 'express';
import { authenticate } from '../../common/middleware/auth.middleware';
import { requirePermissions } from '../../common/middleware/rbac.middleware';
import {
  getMyProfile,
  provisionPersonnel,
  updateMyProfile,
} from './personnel.controller';

export const personnelRouter = Router();

personnelRouter.use(authenticate);

personnelRouter.get('/me', getMyProfile);
personnelRouter.patch('/me', updateMyProfile);
personnelRouter.post(
  '/',
  requirePermissions('personnel:manage'),
  provisionPersonnel,
);
