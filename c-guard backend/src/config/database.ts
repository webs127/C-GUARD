import { Pool, type PoolClient, type QueryResult, type QueryResultRow } from 'pg';
import { env } from './env';
import { logger } from './logger';

export const pool = new Pool({
  connectionString: env.DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 5_000,
});

pool.on('error', (err) => {
  logger.error({ err }, 'Unexpected idle PostgreSQL client error');
});

export async function query<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params?: readonly unknown[],
): Promise<QueryResult<T>> {
  const startedAt = Date.now();
  const result = await pool.query<T>(text, params as unknown[] | undefined);
  logger.debug(
    { durationMs: Date.now() - startedAt, rowCount: result.rowCount },
    'Database query executed',
  );
  return result;
}

export async function withTransaction<T>(
  fn: (client: PoolClient) => Promise<T>,
): Promise<T> {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await fn(client);
    await client.query('COMMIT');
    return result;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    await pool.query('SELECT 1');
    return true;
  } catch (err) {
    logger.error({ err }, 'Database health check failed');
    return false;
  }
}

export async function closePool(): Promise<void> {
  await pool.end();
}
