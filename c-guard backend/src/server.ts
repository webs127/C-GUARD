import http from 'node:http';
import { createApp } from './app';
import { env } from './config/env';
import { logger } from './config/logger';
import { closePool, pool } from './config/database';

async function start(): Promise<void> {
  const app = createApp();
  const server = http.createServer(app);

  try {
    await pool.query('SELECT 1');
    logger.info('Connected to PostgreSQL');
  } catch (err) {
    logger.fatal({ err }, 'Unable to connect to PostgreSQL');
    process.exit(1);
  }

  server.listen(env.PORT, () => {
    logger.info(
      { port: env.PORT, environment: env.NODE_ENV },
      'C-GUARD backend listening',
    );
  });

  const shutdown = (signal: NodeJS.Signals): void => {
    logger.info({ signal }, 'Shutting down gracefully');

    const forceExitTimer = setTimeout(() => {
      logger.error('Forced shutdown after timeout');
      process.exit(1);
    }, 10_000);
    forceExitTimer.unref();

    server.close(() => {
      void closePool()
        .then(() => {
          logger.info('Shutdown complete');
          process.exit(0);
        })
        .catch((err: unknown) => {
          logger.error({ err }, 'Error closing database pool');
          process.exit(1);
        });
    });
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

void start();
