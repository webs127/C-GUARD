import type { PoolClient } from 'pg';
import { env } from '../../../config/env';
import { hashPassword } from '../../../modules/auth/auth.passwords';

interface ExistingUserRow {
  id: string;
  is_corps_member: boolean;
}

export async function seedPersonnel(client: PoolClient): Promise<void> {
  const email = env.SEED_ADMIN_EMAIL;
  const password = env.SEED_ADMIN_PASSWORD;
  if (!email || !password) {
    return;
  }

  const existing = await client.query<ExistingUserRow>(
    `SELECT
       u.id,
       EXISTS (
         SELECT 1 FROM corps_members cm WHERE cm.user_id = u.id
       ) AS is_corps_member
     FROM users u
     WHERE lower(u.email) = lower($1)
     LIMIT 1`,
    [email],
  );

  const existingUser = existing.rows[0];
  if (existingUser?.is_corps_member) {
    throw new Error(
      'SEED_ADMIN_EMAIL belongs to a corps member account and cannot be used for personnel seeding',
    );
  }

  let userId = existingUser?.id;
  if (!userId) {
    const passwordHash = await hashPassword(password);
    const inserted = await client.query<{ id: string }>(
      `INSERT INTO users (email, password_hash, status)
       VALUES ($1, $2, 'active')
       RETURNING id`,
      [email, passwordHash],
    );
    userId = inserted.rows[0]?.id;
    if (!userId) {
      throw new Error('Failed to create seed administrator user');
    }
  }

  await client.query(
    `INSERT INTO personnel (user_id, first_name, last_name, phone, job_title)
     VALUES ($1, $2, $3, $4, $5)
     ON CONFLICT (user_id) DO NOTHING`,
    [
      userId,
      env.SEED_ADMIN_FIRST_NAME ?? 'System',
      env.SEED_ADMIN_LAST_NAME ?? 'Administrator',
      env.SEED_ADMIN_PHONE ?? null,
      env.SEED_ADMIN_JOB_TITLE ?? 'System Administrator',
    ],
  );

  await client.query(
    `INSERT INTO user_roles (user_id, role_id)
     SELECT $1, id FROM roles WHERE name = 'system_admin'
     ON CONFLICT DO NOTHING`,
    [userId],
  );
}
