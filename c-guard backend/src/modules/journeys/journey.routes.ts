import { Router } from 'express';
import { authenticate } from '../../common/middleware/auth.middleware';
import {
  cancelJourney,
  createJourney,
  endJourney,
  getActiveJourney,
  getJourney,
  listJourneys,
  startJourney,
} from './journey.controller';

export const journeyRouter = Router();

journeyRouter.use(authenticate);

journeyRouter.post('/', createJourney);
journeyRouter.get('/', listJourneys);
journeyRouter.get('/active', getActiveJourney);
journeyRouter.get('/:id', getJourney);
journeyRouter.post('/:id/start', startJourney);
journeyRouter.post('/:id/end', endJourney);
journeyRouter.post('/:id/cancel', cancelJourney);
