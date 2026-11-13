import { existsSync } from 'node:fs';
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { closePool, pool } from '../../config/database';
import { logger } from '../../config/logger';

const MIGRATION_LOCK_ID = 7_310_2026;

interface MigrationFile {
  name: string;
  fullPath: string;
}

function resolveMigrationsDir(): string {
  if (process.env.MIGRATIONS_DIR) {
    return path.resolve(process.env.MIGRATIONS_DIR);
  }

  const localDir = path.resolve(__dirname, 'migrations');
  if (existsSync(localDir)) {
    return localDir;
  }

  const sourceDir = path.resolve(
    process.cwd(),
    'src',
    'infrastructure',
    'database',
    'migrations',
  );
  if (existsSync(sourceDir)) {
    return sourceDir;
  }

  return localDir;
}

async function listMigrationFiles(): Promise<MigrationFile[]> {
  const dir = resolveMigrationsDir();
  const entries = await readdir(dir, { withFileTypes: true });

  return entries
    .filter((entry) => entry.isFile() && entry.name.endsWith('.sql'))
    .map((entry) => ({
      name: entry.name,
      fullPath: path.join(dir, entry.name),
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export async function runMigrations(): Promise<string[]> {
  const client = await pool.connect();
  const applied: string[] = [];

  try {
    await client.query('SELECT pg_advisory_lock($1)', [MIGRATION_LOCK_ID]);

    await client.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        name TEXT PRIMARY KEY,
        executed_at TIMESTAMPTZ NOT NULL DEFAULT now()
      );
    `);

    const executedResult = await client.query<{ name: string }>(
      'SELECT name FROM schema_migrations',
    );
    const executed = new Set(executedResult.rows.map((row) => row.name));

    const files = await listMigrationFiles();

    for (const file of files) {
      if (executed.has(file.name)) {
        logger.debug({ migration: file.name }, 'Migration already applied');
        continue;
      }

      const sql = await readFile(file.fullPath, 'utf8');

      await client.query('BEGIN');
      try {
        await client.query(sql);
        await client.query(
          'INSERT INTO schema_migrations (name) VALUES ($1)',
          [file.name],
        );
        await client.query('COMMIT');
      } catch (err) {
        await client.query('ROLLBACK');
        throw err;
      }

      applied.push(file.name);
      logger.info({ migration: file.name }, 'Migration applied');
    }
  } finally {
    try {
      await client.query('SELECT pg_advisory_unlock($1)', [MIGRATION_LOCK_ID]);
    } catch (err) {
      logger.warn({ err }, 'Failed to release migration advisory lock');
    }
    client.release();
  }

  return applied;
}

async function main(): Promise<void> {
  try {
    const applied = await runMigrations();
    if (applied.length === 0) {
      logger.info('No pending migrations');
    } else {
      logger.info({ applied }, 'Migrations completed');
    }
  } catch (err) {
    logger.error({ err }, 'Migration failed');
    process.exitCode = 1;
  } finally {
    await closePool();
  }
}

if (require.main === module) {
  void main();
}

export { listMigrationFiles, resolveMigrationsDir };
