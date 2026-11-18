import { Router } from 'express';
import { checkDatabaseConnection } from '../config/database';
import { ok } from '../common/utils/response';
import { authRouter } from '../modules/auth/auth.routes';
import { campRouter } from '../modules/camps/camp.routes';
import {
  corpsMemberRouter,
  emergencyContactRouter,
} from '../modules/corps-members/corps-member.routes';
import { journeyRouter } from '../modules/journeys/journey.routes';
import { personnelRouter } from '../modules/personnel/personnel.routes';
import { rbacRouter } from '../modules/rbac/rbac.routes';

export const apiRouter = Router();

apiRouter.use('/auth', authRouter);
apiRouter.use('/corps-members', corpsMemberRouter);
apiRouter.use('/emergency-contacts', emergencyContactRouter);
apiRouter.use('/personnel', personnelRouter);
apiRouter.use('/camps', campRouter);
apiRouter.use('/journeys', journeyRouter);
apiRouter.use('/rbac', rbacRouter);

apiRouter.get('/health', async (_req, res, next) => {
  try {
    const databaseUp = await checkDatabaseConnection();
    ok(
      res,
      {
        status: databaseUp ? 'ok' : 'degraded',
        uptime: Math.floor(process.uptime()),
        database: databaseUp ? 'up' : 'down',
        timestamp: new Date().toISOString(),
      },
      databaseUp ? 'Service healthy' : 'Service degraded',
      databaseUp ? 200 : 503,
    );
  } catch (err) {
    next(err);
  }
});
