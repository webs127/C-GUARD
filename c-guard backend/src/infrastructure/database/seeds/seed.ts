import { closePool, withTransaction } from '../../../config/database';
import { logger } from '../../../config/logger';
import { seedRolesAndPermissions } from './001_roles_permissions';
import { seedCamps } from './002_camps';
import { seedPersonnel } from './003_personnel';

export async function runSeeds(): Promise<void> {
  await withTransaction(async (client) => {
    await seedRolesAndPermissions(client);
    await seedCamps(client);
    await seedPersonnel(client);
  });
}

async function main(): Promise<void> {
  try {
    await runSeeds();
    logger.info('Seed data applied successfully');
  } catch (err) {
    logger.error({ err }, 'Seeding failed');
    process.exitCode = 1;
  } finally {
    await closePool();
  }
}

if (require.main === module) {
  void main();
}
