import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import request from 'supertest';
import type { Express } from 'express';

const prefix = `journeys-test-${Date.now()}`;
let emailCounter = 0;
let callUpCounter = 0;
let phoneCounter = 0;

let app: Express;
let db: typeof import('../../src/config/database');
let campId: string;
let adminToken: string;
let corpsToken: string;
let corpsUserId: string;
let otherCorpsToken: string;
let monitoringToken: string;
let noRoleToken: string;
let scheduledJourneyId: string;
let secondJourneyId: string;

function nextEmail(label: string): string {
  emailCounter += 1;
  return `${prefix}-${label}-${emailCounter}@example.com`;
}

function nextCallUp(): string {
  callUpCounter += 1;
  return `JRN-${Date.now()}-${callUpCounter}`;
}

function nextPhone(): string {
  phoneCounter += 1;
  return `081${String(phoneCounter).padStart(8, '0')}`;
}

function registrationPayload(email: string) {
  return {
    email,
    password: 'Password123!',
    firstName: 'Journey',
    lastName: 'Tester',
    phone: nextPhone(),
    callUpNumber: nextCallUp(),
    stateCode: 'FC',
    campId,
  };
}

async function registerUser(label: string) {
  const email = nextEmail(label);
  const response = await request(app)
    .post('/api/v1/auth/register')
    .send(registrationPayload(email));

  expect(response.status).toBe(201);
  return response.body.data as {
    user: { id: string; email: string };
    tokens: { accessToken: string; refreshToken: string };
  };
}

function authHeader(token: string): string {
  return `Bearer ${token}`;
}

function journeyPayload(overrides: Record<string, unknown> = {}) {
  return {
    originLabel: 'Lagos',
    originLatitude: 6.5244,
    originLongitude: 3.3792,
    destinationLabel: 'Abuja',
    destinationLatitude: 9.0765,
    destinationLongitude: 7.3986,
    plannedDepartureAt: '2026-11-19T08:00:00.000Z',
    expectedArrivalAt: '2026-11-19T14:00:00.000Z',
    ...overrides,
  };
}

async function createJourney(
  token: string,
  overrides: Record<string, unknown> = {},
) {
  return request(app)
    .post('/api/v1/journeys')
    .set('Authorization', authHeader(token))
    .send(journeyPayload(overrides));
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

  await db.query(`DELETE FROM users WHERE email LIKE $1`, [`${prefix}%`]);

  const camps = await db.query<{ id: string }>(
    `SELECT id FROM camps WHERE is_active = TRUE ORDER BY state LIMIT 1`,
  );
  campId = camps.rows[0]?.id ?? '';
  if (!campId) {
    throw new Error(
      'Test database has no active camps. Run npm.cmd run seed against c_guard_test.',
    );
  }

  const roles = await db.query<{ id: string; name: string }>(
    `SELECT id, name FROM roles WHERE name IN ('system_admin', 'monitoring_officer')`,
  );
  const systemAdminRoleId = roles.rows.find(
    (role) => role.name === 'system_admin',
  )?.id;
  const monitoringRoleId = roles.rows.find(
    (role) => role.name === 'monitoring_officer',
  )?.id;
  if (!systemAdminRoleId || !monitoringRoleId) {
    throw new Error(
      'Test database is missing required roles. Run npm.cmd run seed against c_guard_test.',
    );
  }

  const admin = await registerUser('admin');
  adminToken = admin.tokens.accessToken;
  await db.query(
    `INSERT INTO user_roles (user_id, role_id)
     VALUES ($1, $2)
     ON CONFLICT DO NOTHING`,
    [admin.user.id, systemAdminRoleId],
  );

  const corps = await registerUser('corps');
  corpsToken = corps.tokens.accessToken;
  corpsUserId = corps.user.id;

  const other = await registerUser('other');
  otherCorpsToken = other.tokens.accessToken;

  const monitoringEmail = nextEmail('monitoring');
  const monitoring = await request(app)
    .post('/api/v1/personnel')
    .set('Authorization', authHeader(adminToken))
    .send({
      email: monitoringEmail,
      password: 'Personnel123!',
      firstName: 'Monitoring',
      lastName: 'Officer',
      phone: nextPhone(),
      jobTitle: 'Monitoring Officer',
      roleIds: [monitoringRoleId],
    });
  expect(monitoring.status).toBe(201);

  const monitoringLogin = await request(app)
    .post('/api/v1/auth/login')
    .send({ email: monitoringEmail, password: 'Personnel123!' });
  expect(monitoringLogin.status).toBe(200);
  monitoringToken = monitoringLogin.body.data.tokens.accessToken;

  const noRoleEmail = nextEmail('no-role');
  const noRole = await request(app)
    .post('/api/v1/personnel')
    .set('Authorization', authHeader(adminToken))
    .send({
      email: noRoleEmail,
      password: 'Personnel123!',
      firstName: 'No',
      lastName: 'Role',
      roleIds: [],
    });
  expect(noRole.status).toBe(201);

  const noRoleLogin = await request(app)
    .post('/api/v1/auth/login')
    .send({ email: noRoleEmail, password: 'Personnel123!' });
  expect(noRoleLogin.status).toBe(200);
  noRoleToken = noRoleLogin.body.data.tokens.accessToken;
});

afterAll(async () => {
  await db.query(`DELETE FROM users WHERE email LIKE $1`, [`${prefix}%`]);
  await db.closePool();
});

describe('Journey registration', () => {
  it('registers a scheduled journey and defaults to the assigned camp', async () => {
    const response = await createJourney(corpsToken);

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.status).toBe('scheduled');
    expect(response.body.data.corpsMemberId).toBe(corpsUserId);
    expect(response.body.data.campId).toBe(campId);
    expect(response.body.data.originLabel).toBe('Lagos');
    expect(response.body.data.destinationLabel).toBe('Abuja');
    expect(response.body.data.startedAt).toBeNull();
    expect(response.body.data.endedAt).toBeNull();
    expect(response.body.data.cancelledAt).toBeNull();

    scheduledJourneyId = response.body.data.id;
  });

  it('validates payloads and camp references', async () => {
    const invalidCoordinates = await createJourney(corpsToken, {
      originLatitude: 91,
    });
    expect(invalidCoordinates.status).toBe(422);

    const mismatchedCoordinates = await createJourney(corpsToken, {
      destinationLongitude: null,
    });
    expect(mismatchedCoordinates.status).toBe(422);

    const invalidTimes = await createJourney(corpsToken, {
      expectedArrivalAt: '2026-11-19T07:00:00.000Z',
    });
    expect(invalidTimes.status).toBe(422);

    const unknownCamp = await createJourney(corpsToken, {
      campId: '00000000-0000-4000-8000-000000000000',
    });
    expect(unknownCamp.status).toBe(400);

    const personnel = await createJourney(monitoringToken);
    expect(personnel.status).toBe(403);

    const unauthenticated = await request(app)
      .post('/api/v1/journeys')
      .send(journeyPayload());
    expect(unauthenticated.status).toBe(401);
  });
});

describe('Journey retrieval', () => {
  it('returns history scoped to the authenticated corps member', async () => {
    const own = await request(app)
      .get('/api/v1/journeys')
      .set('Authorization', authHeader(corpsToken));
    expect(own.status).toBe(200);
    expect(own.body.data).toHaveLength(1);
    expect(own.body.data[0].id).toBe(scheduledJourneyId);

    const other = await request(app)
      .get('/api/v1/journeys')
      .set('Authorization', authHeader(otherCorpsToken));
    expect(other.status).toBe(200);
    expect(other.body.data).toEqual([]);

    const personnel = await request(app)
      .get('/api/v1/journeys')
      .set('Authorization', authHeader(monitoringToken));
    expect(personnel.status).toBe(200);
    expect(
      personnel.body.data.some(
        (journey: { id: string }) => journey.id === scheduledJourneyId,
      ),
    ).toBe(true);

    const filtered = await request(app)
      .get('/api/v1/journeys')
      .query({ status: 'scheduled', corpsMemberId: corpsUserId })
      .set('Authorization', authHeader(monitoringToken));
    expect(filtered.status).toBe(200);
    expect(filtered.body.data).toHaveLength(1);
    expect(filtered.body.data[0].id).toBe(scheduledJourneyId);

    const noRole = await request(app)
      .get('/api/v1/journeys')
      .set('Authorization', authHeader(noRoleToken));
    expect(noRole.status).toBe(403);
  });

  it('retrieves journey details for the owner or authorized readers', async () => {
    const owner = await request(app)
      .get(`/api/v1/journeys/${scheduledJourneyId}`)
      .set('Authorization', authHeader(corpsToken));
    expect(owner.status).toBe(200);
    expect(owner.body.data.id).toBe(scheduledJourneyId);

    const other = await request(app)
      .get(`/api/v1/journeys/${scheduledJourneyId}`)
      .set('Authorization', authHeader(otherCorpsToken));
    expect(other.status).toBe(403);

    const monitoring = await request(app)
      .get(`/api/v1/journeys/${scheduledJourneyId}`)
      .set('Authorization', authHeader(monitoringToken));
    expect(monitoring.status).toBe(200);

    const noRole = await request(app)
      .get(`/api/v1/journeys/${scheduledJourneyId}`)
      .set('Authorization', authHeader(noRoleToken));
    expect(noRole.status).toBe(403);

    const invalidId = await request(app)
      .get('/api/v1/journeys/not-a-uuid')
      .set('Authorization', authHeader(corpsToken));
    expect(invalidId.status).toBe(422);

    const missing = await request(app)
      .get('/api/v1/journeys/00000000-0000-4000-8000-000000000000')
      .set('Authorization', authHeader(corpsToken));
    expect(missing.status).toBe(404);
  });

  it('returns no active journey before a journey starts', async () => {
    const owner = await request(app)
      .get('/api/v1/journeys/active')
      .set('Authorization', authHeader(corpsToken));
    expect(owner.status).toBe(404);

    const personnel = await request(app)
      .get('/api/v1/journeys/active')
      .set('Authorization', authHeader(monitoringToken));
    expect(personnel.status).toBe(403);
  });
});

describe('Journey lifecycle', () => {
  it('starts a scheduled journey and rejects invalid transitions', async () => {
    const other = await request(app)
      .post(`/api/v1/journeys/${scheduledJourneyId}/start`)
      .set('Authorization', authHeader(otherCorpsToken));
    expect(other.status).toBe(403);

    const monitoring = await request(app)
      .post(`/api/v1/journeys/${scheduledJourneyId}/start`)
      .set('Authorization', authHeader(monitoringToken));
    expect(monitoring.status).toBe(403);

    const started = await request(app)
      .post(`/api/v1/journeys/${scheduledJourneyId}/start`)
      .set('Authorization', authHeader(corpsToken));
    expect(started.status).toBe(200);
    expect(started.body.data.status).toBe('active');
    expect(started.body.data.startedAt).toEqual(expect.any(String));
    expect(started.body.data.endedAt).toBeNull();
    expect(started.body.data.cancelledAt).toBeNull();

    const restart = await request(app)
      .post(`/api/v1/journeys/${scheduledJourneyId}/start`)
      .set('Authorization', authHeader(corpsToken));
    expect(restart.status).toBe(409);

    const active = await request(app)
      .get('/api/v1/journeys/active')
      .set('Authorization', authHeader(corpsToken));
    expect(active.status).toBe(200);
    expect(active.body.data.id).toBe(scheduledJourneyId);
  });

  it('prevents a second active journey and completes the active journey', async () => {
    const second = await createJourney(corpsToken, {
      destinationLabel: 'Ibadan',
      destinationLatitude: 7.3775,
      destinationLongitude: 3.947,
    });
    expect(second.status).toBe(201);
    secondJourneyId = second.body.data.id;

    const conflict = await request(app)
      .post(`/api/v1/journeys/${secondJourneyId}/start`)
      .set('Authorization', authHeader(corpsToken));
    expect(conflict.status).toBe(409);

    const ended = await request(app)
      .post(`/api/v1/journeys/${scheduledJourneyId}/end`)
      .set('Authorization', authHeader(corpsToken));
    expect(ended.status).toBe(200);
    expect(ended.body.data.status).toBe('completed');
    expect(ended.body.data.endedAt).toEqual(expect.any(String));

    const endAgain = await request(app)
      .post(`/api/v1/journeys/${scheduledJourneyId}/end`)
      .set('Authorization', authHeader(corpsToken));
    expect(endAgain.status).toBe(409);

    const cancelCompleted = await request(app)
      .post(`/api/v1/journeys/${scheduledJourneyId}/cancel`)
      .set('Authorization', authHeader(corpsToken));
    expect(cancelCompleted.status).toBe(409);

    const startSecond = await request(app)
      .post(`/api/v1/journeys/${secondJourneyId}/start`)
      .set('Authorization', authHeader(corpsToken));
    expect(startSecond.status).toBe(200);
    expect(startSecond.body.data.status).toBe('active');
  });

  it('cancels active and scheduled journeys', async () => {
    const cancelActive = await request(app)
      .post(`/api/v1/journeys/${secondJourneyId}/cancel`)
      .set('Authorization', authHeader(corpsToken));
    expect(cancelActive.status).toBe(200);
    expect(cancelActive.body.data.status).toBe('cancelled');
    expect(cancelActive.body.data.cancelledAt).toEqual(expect.any(String));
    expect(cancelActive.body.data.endedAt).toEqual(expect.any(String));

    const cancelAgain = await request(app)
      .post(`/api/v1/journeys/${secondJourneyId}/cancel`)
      .set('Authorization', authHeader(corpsToken));
    expect(cancelAgain.status).toBe(409);

    const scheduled = await createJourney(corpsToken, {
      destinationLabel: 'Enugu',
      destinationLatitude: 6.4402,
      destinationLongitude: 7.4943,
    });
    expect(scheduled.status).toBe(201);

    const cancelScheduled = await request(app)
      .post(`/api/v1/journeys/${scheduled.body.data.id}/cancel`)
      .set('Authorization', authHeader(corpsToken));
    expect(cancelScheduled.status).toBe(200);
    expect(cancelScheduled.body.data.status).toBe('cancelled');
    expect(cancelScheduled.body.data.cancelledAt).toEqual(expect.any(String));
    expect(cancelScheduled.body.data.endedAt).toBeNull();

    const active = await request(app)
      .get('/api/v1/journeys/active')
      .set('Authorization', authHeader(corpsToken));
    expect(active.status).toBe(404);
  });

  it('allows authorized personnel to manage journeys', async () => {
    const created = await createJourney(corpsToken, {
      destinationLabel: 'Kano',
      destinationLatitude: 12.0022,
      destinationLongitude: 8.592,
    });
    expect(created.status).toBe(201);

    const started = await request(app)
      .post(`/api/v1/journeys/${created.body.data.id}/start`)
      .set('Authorization', authHeader(adminToken));
    expect(started.status).toBe(200);
    expect(started.body.data.status).toBe('active');

    const ended = await request(app)
      .post(`/api/v1/journeys/${created.body.data.id}/end`)
      .set('Authorization', authHeader(adminToken));
    expect(ended.status).toBe(200);
    expect(ended.body.data.status).toBe('completed');
  });
});
