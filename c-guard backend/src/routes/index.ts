import { Router } from 'express';
import { checkDatabaseConnection } from '../config/database';
import { ok } from '../common/utils/response';
import { authRouter } from '../modules/auth/auth.routes';
import { rbacRouter } from '../modules/rbac/rbac.routes';

export const apiRouter = Router();

apiRouter.use('/auth', authRouter);
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
