import { Router } from 'express';
import { authenticate } from '../../common/middleware/auth.middleware';
import { requirePermissions } from '../../common/middleware/rbac.middleware';
import {
  assignCamp,
  createMyEmergencyContact,
  deleteMyEmergencyContact,
  getMyProfile,
  listMyEmergencyContacts,
  updateMyEmergencyContact,
  updateMyProfile,
} from './corps-member.controller';

export const corpsMemberRouter = Router();
export const emergencyContactRouter = Router();

corpsMemberRouter.use(authenticate);
emergencyContactRouter.use(authenticate);

corpsMemberRouter.get('/me', getMyProfile);
corpsMemberRouter.patch('/me', updateMyProfile);
corpsMemberRouter.get('/me/emergency-contacts', listMyEmergencyContacts);
corpsMemberRouter.post('/me/emergency-contacts', createMyEmergencyContact);
corpsMemberRouter.patch(
  '/:userId/camp',
  requirePermissions('camps:manage'),
  assignCamp,
);

emergencyContactRouter.patch('/:id', updateMyEmergencyContact);
emergencyContactRouter.delete('/:id', deleteMyEmergencyContact);
