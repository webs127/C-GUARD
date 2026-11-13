import express from 'express';
import helmet from 'helmet';
import pinoHttp from 'pino-http';
import { corsMiddleware } from './config/cors';
import { logger } from './config/logger';
import { globalRateLimiter } from './common/middleware/rate-limit.middleware';
import { notFoundMiddleware } from './common/middleware/not-found.middleware';
import { errorMiddleware } from './common/middleware/error.middleware';
import { apiRouter } from './routes';

export function createApp(): express.Express {
  const app = express();

  app.disable('x-powered-by');
  app.set('trust proxy', 1);

  app.use(helmet());
  app.use(corsMiddleware);
  app.use(
    pinoHttp({
      logger,
      autoLogging: {
        ignore: (req) => req.url === '/api/v1/health',
      },
    }),
  );
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true }));
  app.use(globalRateLimiter);

  app.use('/api/v1', apiRouter);

  app.use(notFoundMiddleware);
  app.use(errorMiddleware);

  return app;
}
