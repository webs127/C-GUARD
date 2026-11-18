import { Router } from 'express';
import { authenticate } from '../../common/middleware/auth.middleware';
import { requirePermissions } from '../../common/middleware/rbac.middleware';
import {
  createCamp,
  getCamp,
  listCamps,
  updateCamp,
} from './camp.controller';

export const campRouter = Router();

campRouter.use(authenticate);

campRouter.get('/', listCamps);
campRouter.get('/:id', getCamp);
campRouter.post('/', requirePermissions('camps:manage'), createCamp);
campRouter.patch('/:id', requirePermissions('camps:manage'), updateCamp);
