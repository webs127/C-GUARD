import type { PoolClient } from 'pg';

interface SeedRole {
  name: string;
  description: string;
}

interface SeedPermission {
  key: string;
  description: string;
}

const ROLES: SeedRole[] = [
  { name: 'system_admin', description: 'Full system access and account management' },
  { name: 'operations_admin', description: 'Operational management of journeys, camps, and incidents' },
  { name: 'monitoring_officer', description: 'Monitors active journeys and alerts' },
  { name: 'incident_officer', description: 'Manages and responds to assigned incidents' },
  { name: 'read_only_viewer', description: 'Read-only access to permitted information' },
];

const PERMISSIONS: SeedPermission[] = [
  { key: 'journeys:read', description: 'View journeys' },
  { key: 'journeys:manage', description: 'Create and update journeys' },
  { key: 'tracking:read', description: 'View journey location data' },
  { key: 'tracking:write', description: 'Submit journey location data' },
  { key: 'incidents:read', description: 'View incidents' },
  { key: 'incidents:manage', description: 'Manage incidents' },
  { key: 'incidents:acknowledge', description: 'Acknowledge incidents' },
  { key: 'incidents:assign', description: 'Assign incidents to personnel' },
  { key: 'incidents:escalate', description: 'Escalate incidents' },
  { key: 'incidents:resolve', description: 'Resolve incidents' },
  { key: 'incidents:close', description: 'Close incidents' },
  { key: 'camps:read', description: 'View camps' },
  { key: 'camps:manage', description: 'Create and update camps' },
  { key: 'personnel:read', description: 'View personnel accounts' },
  { key: 'personnel:manage', description: 'Provision and manage personnel accounts' },
  { key: 'roles:manage', description: 'Manage roles and permissions' },
  { key: 'dashboard:read', description: 'Access dashboard operational data' },
  { key: 'notifications:read', description: 'View notifications' },
  { key: 'audit:read', description: 'View audit logs' },
];

const ROLE_PERMISSIONS: Record<string, string[]> = {
  system_admin: PERMISSIONS.map((permission) => permission.key),
  operations_admin: [
    'journeys:read',
    'journeys:manage',
    'tracking:read',
    'incidents:read',
    'incidents:manage',
    'camps:read',
    'camps:manage',
    'personnel:read',
    'dashboard:read',
    'notifications:read',
    'audit:read',
  ],
  monitoring_officer: [
    'journeys:read',
    'tracking:read',
    'incidents:read',
    'camps:read',
    'dashboard:read',
    'notifications:read',
  ],
  incident_officer: [
    'journeys:read',
    'tracking:read',
    'incidents:read',
    'incidents:manage',
    'incidents:acknowledge',
    'incidents:assign',
    'incidents:escalate',
    'incidents:resolve',
    'incidents:close',
    'dashboard:read',
    'notifications:read',
  ],
  read_only_viewer: [
    'journeys:read',
    'tracking:read',
    'incidents:read',
    'camps:read',
    'dashboard:read',
  ],
};

export async function seedRolesAndPermissions(client: PoolClient): Promise<void> {
  for (const role of ROLES) {
    await client.query(
      `INSERT INTO roles (name, description)
       VALUES ($1, $2)
       ON CONFLICT (name) DO UPDATE SET description = EXCLUDED.description`,
      [role.name, role.description],
    );
  }

  for (const permission of PERMISSIONS) {
    await client.query(
      `INSERT INTO permissions (key, description)
       VALUES ($1, $2)
       ON CONFLICT (key) DO UPDATE SET description = EXCLUDED.description`,
      [permission.key, permission.description],
    );
  }

  for (const [roleName, permissionKeys] of Object.entries(ROLE_PERMISSIONS)) {
    for (const permissionKey of permissionKeys) {
      await client.query(
        `INSERT INTO role_permissions (role_id, permission_id)
         SELECT r.id, p.id
         FROM roles r
         CROSS JOIN permissions p
         WHERE r.name = $1 AND p.key = $2
         ON CONFLICT DO NOTHING`,
        [roleName, permissionKey],
      );
    }
  }
}
