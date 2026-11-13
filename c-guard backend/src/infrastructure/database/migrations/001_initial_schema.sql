-- 001_initial_schema.sql
-- Core identity, access control, profiles, and camps.
-- Coordinates use DOUBLE PRECISION (no PostGIS), timestamps use TIMESTAMPTZ (UTC).

CREATE TYPE user_status AS ENUM ('pending', 'active', 'suspended', 'deactivated');

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  status user_status NOT NULL DEFAULT 'pending',
  email_verified_at TIMESTAMPTZ,
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX users_email_lower_unique ON users (lower(email));

CREATE TRIGGER users_set_updated_at
BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER roles_set_updated_at
BEFORE UPDATE ON roles
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE role_permissions (
  role_id UUID NOT NULL REFERENCES roles (id) ON DELETE CASCADE,
  permission_id UUID NOT NULL REFERENCES permissions (id) ON DELETE CASCADE,
  PRIMARY KEY (role_id, permission_id)
);

CREATE INDEX role_permissions_permission_idx ON role_permissions (permission_id);

CREATE TABLE user_roles (
  user_id UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  role_id UUID NOT NULL REFERENCES roles (id) ON DELETE CASCADE,
  assigned_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, role_id)
);

CREATE INDEX user_roles_role_idx ON user_roles (role_id);

CREATE TABLE camps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  address TEXT,
  state TEXT NOT NULL,
  latitude DOUBLE PRECISION NOT NULL CHECK (latitude BETWEEN -90 AND 90),
  longitude DOUBLE PRECISION NOT NULL CHECK (longitude BETWEEN -180 AND 180),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX camps_name_state_lower_unique ON camps (lower(name), lower(state));
CREATE INDEX camps_state_idx ON camps (state);

CREATE TRIGGER camps_set_updated_at
BEFORE UPDATE ON camps
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE corps_members (
  user_id UUID PRIMARY KEY REFERENCES users (id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  phone TEXT,
  call_up_number TEXT NOT NULL,
  state_code TEXT NOT NULL,
  camp_id UUID REFERENCES camps (id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX corps_members_call_up_lower_unique ON corps_members (upper(call_up_number));
CREATE INDEX corps_members_camp_idx ON corps_members (camp_id);

CREATE TRIGGER corps_members_set_updated_at
BEFORE UPDATE ON corps_members
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE personnel (
  user_id UUID PRIMARY KEY REFERENCES users (id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  phone TEXT,
  job_title TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER personnel_set_updated_at
BEFORE UPDATE ON personnel
FOR EACH ROW EXECUTE FUNCTION set_updated_at();
