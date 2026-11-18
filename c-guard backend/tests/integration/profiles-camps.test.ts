import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import request from 'supertest';
import type { Express } from 'express';

const prefix = `profiles-test-${Date.now()}`;
let emailCounter = 0;
let callUpCounter = 0;
let phoneCounter = 0;

let app: Express;
let db: typeof import('../../src/config/database');
let campId1: string;
let campId2: string;
let systemAdminRoleId: string;
let adminToken: string;
let corpsToken: string;
let corpsUserId: string;
let otherCorpsToken: string;
let personnelToken: string;
let personnelUserId: string;
let personnelEmail: string;
let createdCampId: string;
let campName: string;
let campState: string;

function nextEmail(label: string): string {
  emailCounter += 1;
  return `${prefix}-${label}-${emailCounter}@example.com`;
}

function nextCallUp(): string {
  callUpCounter += 1;
  return `PROF-${Date.now()}-${callUpCounter}`;
}

function nextPhone(): string {
  phoneCounter += 1;
  return `080${String(phoneCounter).padStart(8, '0')}`;
}

function registrationPayload(email: string) {
  return {
    email,
    password: 'Password123!',
    firstName: 'Profile',
    lastName: 'Tester',
    phone: nextPhone(),
    callUpNumber: nextCallUp(),
    stateCode: 'FC',
    campId: campId1,
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

  await db.query(`DELETE FROM camps WHERE name LIKE $1`, [`${prefix}%`]);
  await db.query(`DELETE FROM users WHERE email LIKE $1`, [`${prefix}%`]);

  const camps = await db.query<{ id: string }>(
    `SELECT id FROM camps WHERE is_active = TRUE ORDER BY state LIMIT 2`,
  );
  campId1 = camps.rows[0]?.id ?? '';
  campId2 = camps.rows[1]?.id ?? '';
  if (!campId1 || !campId2) {
    throw new Error(
      'Test database needs at least two active camps. Run npm.cmd run seed against c_guard_test.',
    );
  }

  const role = await db.query<{ id: string }>(
    `SELECT id FROM roles WHERE name = 'system_admin'`,
  );
  systemAdminRoleId = role.rows[0]?.id ?? '';
  if (!systemAdminRoleId) {
    throw new Error(
      'Test database has no system_admin role. Run npm.cmd run seed against c_guard_test.',
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

  personnelEmail = nextEmail('personnel');
  const provisioned = await request(app)
    .post('/api/v1/personnel')
    .set('Authorization', authHeader(adminToken))
    .send({
      email: personnelEmail,
      password: 'Personnel123!',
      firstName: 'Pat',
      lastName: 'Personnel',
      phone: nextPhone(),
      jobTitle: 'Monitoring Officer',
      roleIds: [],
    });
  expect(provisioned.status).toBe(201);
  personnelUserId = provisioned.body.data.userId;

  const personnelLogin = await request(app)
    .post('/api/v1/auth/login')
    .send({ email: personnelEmail, password: 'Personnel123!' });
  expect(personnelLogin.status).toBe(200);
  personnelToken = personnelLogin.body.data.tokens.accessToken;

  campName = `Camp ${prefix}`;
  campState = `State ${prefix}`;
});

afterAll(async () => {
  await db.query(`DELETE FROM camps WHERE name LIKE $1`, [`${prefix}%`]);
  await db.query(`DELETE FROM users WHERE email LIKE $1`, [`${prefix}%`]);
  await db.closePool();
});

describe('Corps member profiles', () => {
  it('returns and updates the authenticated corps member profile', async () => {
    const initial = await request(app)
      .get('/api/v1/corps-members/me')
      .set('Authorization', authHeader(corpsToken));

    expect(initial.status).toBe(200);
    expect(initial.body.data.userId).toBe(corpsUserId);
    expect(initial.body.data.campId).toBe(campId1);
    expect(initial.body.data.callUpNumber).toEqual(expect.any(String));

    const updated = await request(app)
      .patch('/api/v1/corps-members/me')
      .set('Authorization', authHeader(corpsToken))
      .send({
        firstName: 'Updated',
        lastName: 'Member',
        phone: '+2348012345678',
      });

    expect(updated.status).toBe(200);
    expect(updated.body.data.firstName).toBe('Updated');
    expect(updated.body.data.lastName).toBe('Member');
    expect(updated.body.data.phone).toBe('+2348012345678');

    const fetched = await request(app)
      .get('/api/v1/corps-members/me')
      .set('Authorization', authHeader(corpsToken));
    expect(fetched.body.data.firstName).toBe('Updated');
  });

  it('rejects non-editable and empty profile updates', async () => {
    const nonEditable = await request(app)
      .patch('/api/v1/corps-members/me')
      .set('Authorization', authHeader(corpsToken))
      .send({ callUpNumber: 'HACKED-001' });
    expect(nonEditable.status).toBe(422);

    const empty = await request(app)
      .patch('/api/v1/corps-members/me')
      .set('Authorization', authHeader(corpsToken))
      .send({});
    expect(empty.status).toBe(422);
  });

  it('rejects personnel accounts from corps member profile routes', async () => {
    const response = await request(app)
      .get('/api/v1/corps-members/me')
      .set('Authorization', authHeader(personnelToken));
    expect(response.status).toBe(403);
  });
});

describe('Emergency contacts', () => {
  let primaryContactId: string;
  let secondaryContactId: string;
  let primaryPhone: string;

  it('starts with an empty contact list', async () => {
    const response = await request(app)
      .get('/api/v1/corps-members/me/emergency-contacts')
      .set('Authorization', authHeader(corpsToken));

    expect(response.status).toBe(200);
    expect(response.body.data).toEqual([]);
  });

  it('creates contacts and enforces a single primary contact', async () => {
    primaryPhone = nextPhone();
    const primary = await request(app)
      .post('/api/v1/corps-members/me/emergency-contacts')
      .set('Authorization', authHeader(corpsToken))
      .send({
        name: 'Primary Contact',
        phone: primaryPhone,
        relationship: 'Parent',
        isPrimary: true,
      });

    expect(primary.status).toBe(201);
    expect(primary.body.data.isPrimary).toBe(true);
    primaryContactId = primary.body.data.id;

    const secondary = await request(app)
      .post('/api/v1/corps-members/me/emergency-contacts')
      .set('Authorization', authHeader(corpsToken))
      .send({
        name: 'Secondary Contact',
        phone: nextPhone(),
        relationship: 'Sibling',
        isPrimary: true,
      });

    expect(secondary.status).toBe(201);
    expect(secondary.body.data.isPrimary).toBe(true);
    secondaryContactId = secondary.body.data.id;

    const contacts = await request(app)
      .get('/api/v1/corps-members/me/emergency-contacts')
      .set('Authorization', authHeader(corpsToken));

    expect(contacts.status).toBe(200);
    expect(contacts.body.data).toHaveLength(2);
    expect(
      contacts.body.data.find(
        (contact: { id: string }) => contact.id === primaryContactId,
      ).isPrimary,
    ).toBe(false);
    expect(
      contacts.body.data.find(
        (contact: { id: string }) => contact.id === secondaryContactId,
      ).isPrimary,
    ).toBe(true);
  });

  it('rejects duplicate contact phone numbers', async () => {
    const response = await request(app)
      .post('/api/v1/corps-members/me/emergency-contacts')
      .set('Authorization', authHeader(corpsToken))
      .send({ name: 'Duplicate', phone: primaryPhone });

    expect(response.status).toBe(409);
  });

  it('updates only contacts owned by the authenticated corps member', async () => {
    const updated = await request(app)
      .patch(`/api/v1/emergency-contacts/${primaryContactId}`)
      .set('Authorization', authHeader(corpsToken))
      .send({ relationship: 'Guardian' });
    expect(updated.status).toBe(200);
    expect(updated.body.data.relationship).toBe('Guardian');

    const notOwned = await request(app)
      .patch(`/api/v1/emergency-contacts/${primaryContactId}`)
      .set('Authorization', authHeader(otherCorpsToken))
      .send({ relationship: 'Not allowed' });
    expect(notOwned.status).toBe(404);
  });

  it('deletes owned contacts and rejects personnel access', async () => {
    const deleted = await request(app)
      .delete(`/api/v1/emergency-contacts/${primaryContactId}`)
      .set('Authorization', authHeader(corpsToken));
    expect(deleted.status).toBe(200);

    const missing = await request(app)
      .delete(`/api/v1/emergency-contacts/${primaryContactId}`)
      .set('Authorization', authHeader(corpsToken));
    expect(missing.status).toBe(404);

    const personnelAccess = await request(app)
      .get('/api/v1/corps-members/me/emergency-contacts')
      .set('Authorization', authHeader(personnelToken));
    expect(personnelAccess.status).toBe(403);
  });
});

describe('Camps', () => {
  it('lists and retrieves camps for authenticated users', async () => {
    const list = await request(app)
      .get('/api/v1/camps')
      .set('Authorization', authHeader(corpsToken));

    expect(list.status).toBe(200);
    expect(Array.isArray(list.body.data)).toBe(true);
    expect(
      list.body.data.some((camp: { id: string }) => camp.id === campId1),
    ).toBe(true);

    const detail = await request(app)
      .get(`/api/v1/camps/${campId1}`)
      .set('Authorization', authHeader(corpsToken));

    expect(detail.status).toBe(200);
    expect(detail.body.data.id).toBe(campId1);
  });

  it('validates camp identifiers and coordinates', async () => {
    const invalidId = await request(app)
      .get('/api/v1/camps/not-a-uuid')
      .set('Authorization', authHeader(corpsToken));
    expect(invalidId.status).toBe(422);

    const invalidCoordinates = await request(app)
      .post('/api/v1/camps')
      .set('Authorization', authHeader(adminToken))
      .send({
        name: `Invalid ${prefix}`,
        state: campState,
        latitude: 91,
        longitude: 3.4,
      });
    expect(invalidCoordinates.status).toBe(422);
  });

  it('denies camp management to users without the permission', async () => {
    const response = await request(app)
      .post('/api/v1/camps')
      .set('Authorization', authHeader(corpsToken))
      .send({
        name: campName,
        state: campState,
        latitude: 6.5,
        longitude: 3.3,
      });
    expect(response.status).toBe(403);
  });

  it('creates, updates, and filters camps for authorized personnel', async () => {
    const created = await request(app)
      .post('/api/v1/camps')
      .set('Authorization', authHeader(adminToken))
      .send({
        name: campName,
        address: '1 Test Road',
        state: campState,
        latitude: 6.5,
        longitude: 3.3,
      });

    expect(created.status).toBe(201);
    expect(created.body.data.isActive).toBe(true);
    createdCampId = created.body.data.id;

    const duplicate = await request(app)
      .post('/api/v1/camps')
      .set('Authorization', authHeader(adminToken))
      .send({
        name: campName,
        state: campState,
        latitude: 6.6,
        longitude: 3.4,
      });
    expect(duplicate.status).toBe(409);

    const deniedUpdate = await request(app)
      .patch(`/api/v1/camps/${createdCampId}`)
      .set('Authorization', authHeader(corpsToken))
      .send({ address: 'Nope' });
    expect(deniedUpdate.status).toBe(403);

    const updated = await request(app)
      .patch(`/api/v1/camps/${createdCampId}`)
      .set('Authorization', authHeader(adminToken))
      .send({ name: `${campName} Updated`, isActive: false });

    expect(updated.status).toBe(200);
    expect(updated.body.data.name).toBe(`${campName} Updated`);
    expect(updated.body.data.isActive).toBe(false);

    const activeOnly = await request(app)
      .get('/api/v1/camps')
      .query({ state: campState })
      .set('Authorization', authHeader(corpsToken));
    expect(activeOnly.status).toBe(200);
    expect(activeOnly.body.data).toEqual([]);

    const inactive = await request(app)
      .get('/api/v1/camps')
      .query({ state: campState, isActive: 'false' })
      .set('Authorization', authHeader(corpsToken));
    expect(inactive.status).toBe(200);
    expect(inactive.body.data).toHaveLength(1);
    expect(inactive.body.data[0].id).toBe(createdCampId);
  });

  it('assigns corps members to active camps for authorized personnel', async () => {
    const denied = await request(app)
      .patch(`/api/v1/corps-members/${corpsUserId}/camp`)
      .set('Authorization', authHeader(corpsToken))
      .send({ campId: campId2 });
    expect(denied.status).toBe(403);

    const assigned = await request(app)
      .patch(`/api/v1/corps-members/${corpsUserId}/camp`)
      .set('Authorization', authHeader(adminToken))
      .send({ campId: campId2 });

    expect(assigned.status).toBe(200);
    expect(assigned.body.data.campId).toBe(campId2);

    const profile = await request(app)
      .get('/api/v1/corps-members/me')
      .set('Authorization', authHeader(corpsToken));
    expect(profile.body.data.campId).toBe(campId2);

    const inactiveCamp = await request(app)
      .patch(`/api/v1/corps-members/${corpsUserId}/camp`)
      .set('Authorization', authHeader(adminToken))
      .send({ campId: createdCampId });
    expect(inactiveCamp.status).toBe(400);

    const unknownMember = await request(app)
      .patch('/api/v1/corps-members/00000000-0000-4000-8000-000000000000/camp')
      .set('Authorization', authHeader(adminToken))
      .send({ campId: campId1 });
    expect(unknownMember.status).toBe(404);

    const unassigned = await request(app)
      .patch(`/api/v1/corps-members/${corpsUserId}/camp`)
      .set('Authorization', authHeader(adminToken))
      .send({ campId: null });
    expect(unassigned.status).toBe(200);
    expect(unassigned.body.data.campId).toBeNull();
  });
});

describe('Personnel profiles', () => {
  it('returns and updates the authenticated personnel profile', async () => {
    const initial = await request(app)
      .get('/api/v1/personnel/me')
      .set('Authorization', authHeader(personnelToken));

    expect(initial.status).toBe(200);
    expect(initial.body.data.userId).toBe(personnelUserId);
    expect(initial.body.data.email).toBe(personnelEmail);
    expect(initial.body.data.roles).toEqual([]);

    const updated = await request(app)
      .patch('/api/v1/personnel/me')
      .set('Authorization', authHeader(personnelToken))
      .send({ firstName: 'Updated', jobTitle: 'Senior Officer', phone: null });

    expect(updated.status).toBe(200);
    expect(updated.body.data.firstName).toBe('Updated');
    expect(updated.body.data.jobTitle).toBe('Senior Officer');
    expect(updated.body.data.phone).toBeNull();
  });

  it('rejects corps members from personnel self-service routes', async () => {
    const read = await request(app)
      .get('/api/v1/personnel/me')
      .set('Authorization', authHeader(corpsToken));
    expect(read.status).toBe(403);

    const update = await request(app)
      .patch('/api/v1/personnel/me')
      .set('Authorization', authHeader(corpsToken))
      .send({ firstName: 'Nope' });
    expect(update.status).toBe(403);
  });

  it('provisions personnel with assigned roles', async () => {
    const role = await db.query<{ id: string }>(
      `SELECT id FROM roles WHERE name = 'monitoring_officer'`,
    );
    const monitoringRoleId = role.rows[0]?.id;
    expect(monitoringRoleId).toEqual(expect.any(String));

    const email = nextEmail('monitoring');
    const provisioned = await request(app)
      .post('/api/v1/personnel')
      .set('Authorization', authHeader(adminToken))
      .send({
        email,
        password: 'Personnel123!',
        firstName: 'Monitoring',
        lastName: 'Officer',
        phone: nextPhone(),
        jobTitle: 'Monitoring Officer',
        roleIds: [monitoringRoleId],
      });

    expect(provisioned.status).toBe(201);
    expect(provisioned.body.data.roles).toEqual(['monitoring_officer']);

    const login = await request(app)
      .post('/api/v1/auth/login')
      .send({ email, password: 'Personnel123!' });
    expect(login.status).toBe(200);

    const token = login.body.data.tokens.accessToken;
    const me = await request(app)
      .get('/api/v1/auth/me')
      .set('Authorization', authHeader(token));
    expect(me.status).toBe(200);
    expect(me.body.data.roles).toContain('monitoring_officer');

    const camps = await request(app)
      .get('/api/v1/camps')
      .set('Authorization', authHeader(token));
    expect(camps.status).toBe(200);

    const createCamp = await request(app)
      .post('/api/v1/camps')
      .set('Authorization', authHeader(token))
      .send({
        name: `Monitoring Denied ${prefix}`,
        state: campState,
        latitude: 6.5,
        longitude: 3.3,
      });
    expect(createCamp.status).toBe(403);
  });

  it('restricts personnel provisioning to authorized personnel', async () => {
    const denied = await request(app)
      .post('/api/v1/personnel')
      .set('Authorization', authHeader(corpsToken))
      .send({
        email: nextEmail('denied'),
        password: 'Personnel123!',
        firstName: 'Denied',
        lastName: 'User',
      });
    expect(denied.status).toBe(403);

    const duplicate = await request(app)
      .post('/api/v1/personnel')
      .set('Authorization', authHeader(adminToken))
      .send({
        email: personnelEmail,
        password: 'Personnel123!',
        firstName: 'Duplicate',
        lastName: 'User',
      });
    expect(duplicate.status).toBe(409);

    const invalidRole = await request(app)
      .post('/api/v1/personnel')
      .set('Authorization', authHeader(adminToken))
      .send({
        email: nextEmail('invalid-role'),
        password: 'Personnel123!',
        firstName: 'Invalid',
        lastName: 'Role',
        roleIds: ['00000000-0000-4000-8000-000000000000'],
      });
    expect(invalidRole.status).toBe(400);
  });
});
