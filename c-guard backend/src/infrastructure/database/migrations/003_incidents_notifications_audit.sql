-- 003_incidents_notifications_audit.sql
-- Emergency incidents, notification records, refresh tokens, and audit logging.

CREATE TYPE incident_type AS ENUM ('sos', 'risk_indicator', 'manual');
CREATE TYPE incident_status AS ENUM (
  'new',
  'acknowledged',
  'assigned',
  'escalated',
  'resolved',
  'closed'
);
CREATE TYPE incident_severity AS ENUM ('low', 'medium', 'high', 'critical');

CREATE TABLE incidents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  journey_id UUID REFERENCES journeys (id) ON DELETE SET NULL,
  corps_member_id UUID NOT NULL REFERENCES corps_members (user_id) ON DELETE CASCADE,
  type incident_type NOT NULL,
  status incident_status NOT NULL DEFAULT 'new',
  severity incident_severity NOT NULL DEFAULT 'medium',
  title TEXT NOT NULL,
  description TEXT,
  assigned_to UUID REFERENCES personnel (user_id) ON DELETE SET NULL,
  location_id UUID REFERENCES journey_locations (id) ON DELETE SET NULL,
  location_is_current BOOLEAN NOT NULL DEFAULT FALSE,
  dedupe_key TEXT,
  acknowledged_at TIMESTAMPTZ,
  resolved_at TIMESTAMPTZ,
  closed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX incidents_status_created_idx ON incidents (status, created_at DESC);
CREATE INDEX incidents_assigned_idx ON incidents (assigned_to);
CREATE INDEX incidents_journey_idx ON incidents (journey_id);
CREATE INDEX incidents_member_idx ON incidents (corps_member_id);

-- Idempotency for repeated SOS submissions.
CREATE UNIQUE INDEX incidents_dedupe_key_unique
  ON incidents (dedupe_key)
  WHERE dedupe_key IS NOT NULL;

CREATE TRIGGER incidents_set_updated_at
BEFORE UPDATE ON incidents
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE incident_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  incident_id UUID NOT NULL REFERENCES incidents (id) ON DELETE CASCADE,
  actor_user_id UUID REFERENCES users (id) ON DELETE SET NULL,
  event_type TEXT NOT NULL,
  from_status incident_status,
  to_status incident_status,
  note TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX incident_events_incident_created_idx
  ON incident_events (incident_id, created_at);

CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  channel TEXT NOT NULL DEFAULT 'in_app',
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX notifications_user_created_idx ON notifications (user_id, created_at DESC);
CREATE INDEX notifications_user_unread_idx ON notifications (user_id) WHERE read_at IS NULL;

CREATE TABLE refresh_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL,
  revoked_at TIMESTAMPTZ,
  replaced_by UUID REFERENCES refresh_tokens (id) ON DELETE SET NULL,
  user_agent TEXT,
  ip_address INET,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX refresh_tokens_user_idx ON refresh_tokens (user_id);
CREATE INDEX refresh_tokens_expires_idx ON refresh_tokens (expires_at);
CREATE INDEX refresh_tokens_active_idx ON refresh_tokens (user_id) WHERE revoked_at IS NULL;

CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_user_id UUID REFERENCES users (id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT,
  entity_id UUID,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX audit_logs_actor_created_idx ON audit_logs (actor_user_id, created_at DESC);
CREATE INDEX audit_logs_entity_idx ON audit_logs (entity_type, entity_id);
CREATE INDEX audit_logs_created_idx ON audit_logs (created_at DESC);
