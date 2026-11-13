import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import request from 'supertest';
import type { Express } from 'express';

const emailPrefix = `auth-test-${Date.now()}`;
let emailCounter = 0;
let callUpCounter = 0;

let app: Express;
let db: typeof import('../../src/config/database');
let campId: string;

function nextEmail(): string {
  emailCounter += 1;
  return `${emailPrefix}-${emailCounter}@example.com`;
}

function nextCallUp(): string {
  callUpCounter += 1;
  return `TEST-${Date.now()}-${callUpCounter}`;
}

function registrationPayload(email: string) {
  return {
    email,
    password: 'Password123!',
    firstName: 'Test',
    lastName: 'Corps',
    phone: '08012345678',
    callUpNumber: nextCallUp(),
    stateCode: 'FC',
    campId,
  };
}

async function registerUser() {
  const email = nextEmail();
  const response = await request(app)
    .post('/api/v1/auth/register')
    .send(registrationPayload(email));

  expect(response.status).toBe(201);
  return response.body.data as {
    user: { id: string; email: string };
    tokens: { accessToken: string; refreshToken: string };
  };
}

beforeAll(async () => {
  process.env.NODE_ENV = 'test';
  process.env.DATABASE_URL =
    process.env.TEST_DATABASE_URL ??
    'postgresql://postgres:david_123@localhost:5432/c_guard_test';
  process.env.JWT_ACCESS_SECRET =
    'test-access-secret-0123456789abcdef0123456789abcdef';
  process.env.JWT_REFRESH_SECRET =
    'test-refresh-secret-0123456789abcdef0123456789abcdef';
  process.env.ACCESS_TOKEN_TTL = '15m';
  process.env.REFRESH_TOKEN_TTL_DAYS = '30';
  process.env.RATE_LIMIT_MAX = '10000';
  process.env.AUTH_RATE_LIMIT_MAX = '10000';
  process.env.LOG_LEVEL = 'silent';

  db = await import('../../src/config/database');
  const { createApp } = await import('../../src/app');
  app = createApp();

  await db.query(`DELETE FROM users WHERE email LIKE $1`, [`${emailPrefix}%`]);

  const camps = await db.query<{ id: string }>(
    `SELECT id FROM camps WHERE is_active = TRUE ORDER BY state LIMIT 1`,
  );
  campId = camps.rows[0]?.id ?? '';
  if (!campId) {
    throw new Error(
      'Test database has no active camps. Run npm.cmd run seed against c_guard_test.',
    );
  }
});

afterAll(async () => {
  await db.query(`DELETE FROM users WHERE email LIKE $1`, [`${emailPrefix}%`]);
  await db.closePool();
});

describe('POST /api/v1/auth/register', () => {
  it('registers a corps member and returns tokens', async () => {
    const email = nextEmail();
    const response = await request(app)
      .post('/api/v1/auth/register')
      .send(registrationPayload(email));

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.user.email).toBe(email);
    expect(response.body.data.user.profileType).toBe('corps_member');
    expect(response.body.data.user.profile.campId).toBe(campId);
    expect(response.body.data.tokens.accessToken).toEqual(expect.any(String));
    expect(response.body.data.tokens.refreshToken).toEqual(expect.any(String));
    expect(response.body.data.tokens.tokenType).toBe('Bearer');
  });

  it('rejects a duplicate email', async () => {
    const email = nextEmail();
    const first = await request(app)
      .post('/api/v1/auth/register')
      .send(registrationPayload(email));
    expect(first.status).toBe(201);

    const second = await request(app)
      .post('/api/v1/auth/register')
      .send(registrationPayload(email));

    expect(second.status).toBe(409);
    expect(second.body.success).toBe(false);
  });

  it('rejects an unknown camp', async () => {
    const response = await request(app)
      .post('/api/v1/auth/register')
      .send({
        ...registrationPayload(nextEmail()),
        campId: '00000000-0000-4000-8000-000000000000',
      });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });

  it('rejects invalid input', async () => {
    const response = await request(app)
      .post('/api/v1/auth/register')
      .send({ email: 'not-an-email' });

    expect(response.status).toBe(422);
    expect(response.body.success).toBe(false);
  });
});

describe('POST /api/v1/auth/login', () => {
  it('logs in with valid credentials', async () => {
    const email = nextEmail();
    const password = 'Password123!';
    const registration = await request(app)
      .post('/api/v1/auth/register')
      .send({ ...registrationPayload(email), password });
    expect(registration.status).toBe(201);

    const response = await request(app)
      .post('/api/v1/auth/login')
      .send({ email, password });

    expect(response.status).toBe(200);
    expect(response.body.data.user.email).toBe(email);
    expect(response.body.data.tokens.accessToken).toEqual(expect.any(String));
  });

  it('rejects a wrong password', async () => {
    const email = nextEmail();
    await request(app)
      .post('/api/v1/auth/register')
      .send(registrationPayload(email));

    const response = await request(app)
      .post('/api/v1/auth/login')
      .send({ email, password: 'WrongPassword123!' });

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
  });

  it('rejects an unknown email', async () => {
    const response = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: nextEmail(), password: 'Password123!' });

    expect(response.status).toBe(401);
  });
});

describe('GET /api/v1/auth/me', () => {
  it('returns the authenticated user', async () => {
    const { user, tokens } = await registerUser();

    const response = await request(app)
      .get('/api/v1/auth/me')
      .set('Authorization', `Bearer ${tokens.accessToken}`);

    expect(response.status).toBe(200);
    expect(response.body.data.id).toBe(user.id);
    expect(response.body.data.email).toBe(user.email);
  });

  it('rejects a missing or invalid token', async () => {
    const missing = await request(app).get('/api/v1/auth/me');
    expect(missing.status).toBe(401);

    const invalid = await request(app)
      .get('/api/v1/auth/me')
      .set('Authorization', 'Bearer not-a-token');
    expect(invalid.status).toBe(401);
  });
});

describe('POST /api/v1/auth/refresh', () => {
  it('rotates refresh tokens and rejects reuse of the old token', async () => {
    const { tokens } = await registerUser();

    const refreshed = await request(app)
      .post('/api/v1/auth/refresh')
      .send({ refreshToken: tokens.refreshToken });

    expect(refreshed.status).toBe(200);
    expect(refreshed.body.data.tokens.refreshToken).not.toBe(
      tokens.refreshToken,
    );

    const reuse = await request(app)
      .post('/api/v1/auth/refresh')
      .send({ refreshToken: tokens.refreshToken });

    expect(reuse.status).toBe(401);

    const afterReuse = await request(app)
      .post('/api/v1/auth/refresh')
      .send({ refreshToken: refreshed.body.data.tokens.refreshToken });

    expect(afterReuse.status).toBe(401);
  });
});

describe('POST /api/v1/auth/logout', () => {
  it('revokes the refresh token', async () => {
    const { tokens } = await registerUser();

    const logout = await request(app)
      .post('/api/v1/auth/logout')
      .send({ refreshToken: tokens.refreshToken });
    expect(logout.status).toBe(200);

    const refreshed = await request(app)
      .post('/api/v1/auth/refresh')
      .send({ refreshToken: tokens.refreshToken });
    expect(refreshed.status).toBe(401);
  });
});

describe('RBAC', () => {
  it('denies role management without permissions and allows it after assignment', async () => {
    const { user, tokens } = await registerUser();
    const authorization = `Bearer ${tokens.accessToken}`;

    const denied = await request(app)
      .get('/api/v1/rbac/roles')
      .set('Authorization', authorization);
    expect(denied.status).toBe(403);

    const roleResult = await db.query<{ id: string }>(
      `SELECT id FROM roles WHERE name = 'system_admin'`,
    );
    const adminRoleId = roleResult.rows[0]?.id;
    expect(adminRoleId).toEqual(expect.any(String));

    await db.query(
      `INSERT INTO user_roles (user_id, role_id)
       VALUES ($1, $2)
       ON CONFLICT DO NOTHING`,
      [user.id, adminRoleId],
    );

    const roles = await request(app)
      .get('/api/v1/rbac/roles')
      .set('Authorization', authorization);
    expect(roles.status).toBe(200);
    expect(Array.isArray(roles.body.data)).toBe(true);

    const permissions = await request(app)
      .get('/api/v1/rbac/permissions')
      .set('Authorization', authorization);
    expect(permissions.status).toBe(200);

    const update = await request(app)
      .put(`/api/v1/rbac/users/${user.id}/roles`)
      .set('Authorization', authorization)
      .send({ roleIds: [adminRoleId] });
    expect(update.status).toBe(200);
    expect(update.body.data).toEqual([
      expect.objectContaining({ id: adminRoleId, name: 'system_admin' }),
    ]);

    const clear = await request(app)
      .put(`/api/v1/rbac/users/${user.id}/roles`)
      .set('Authorization', authorization)
      .send({ roleIds: [] });
    expect(clear.status).toBe(200);

    const deniedAgain = await request(app)
      .get('/api/v1/rbac/roles')
      .set('Authorization', authorization);
    expect(deniedAgain.status).toBe(403);
  });
});
