-- 002_journeys_tracking.sql
-- Journey lifecycle, GPS location history, and emergency contacts.

CREATE TYPE journey_status AS ENUM ('scheduled', 'active', 'completed', 'cancelled');

CREATE TABLE journeys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  corps_member_id UUID NOT NULL REFERENCES corps_members (user_id) ON DELETE CASCADE,
  camp_id UUID REFERENCES camps (id) ON DELETE SET NULL,
  origin_label TEXT,
  origin_latitude DOUBLE PRECISION CHECK (origin_latitude IS NULL OR origin_latitude BETWEEN -90 AND 90),
  origin_longitude DOUBLE PRECISION CHECK (origin_longitude IS NULL OR origin_longitude BETWEEN -180 AND 180),
  destination_label TEXT,
  destination_latitude DOUBLE PRECISION CHECK (destination_latitude IS NULL OR destination_latitude BETWEEN -90 AND 90),
  destination_longitude DOUBLE PRECISION CHECK (destination_longitude IS NULL OR destination_longitude BETWEEN -180 AND 180),
  planned_departure_at TIMESTAMPTZ,
  expected_arrival_at TIMESTAMPTZ,
  status journey_status NOT NULL DEFAULT 'scheduled',
  started_at TIMESTAMPTZ,
  ended_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT journeys_end_after_start CHECK (
    ended_at IS NULL OR started_at IS NULL OR ended_at >= started_at
  )
);

-- A corps member may only have one active journey at a time.
CREATE UNIQUE INDEX journeys_one_active_per_member_unique
  ON journeys (corps_member_id)
  WHERE status = 'active';

CREATE INDEX journeys_member_created_idx ON journeys (corps_member_id, created_at DESC);
CREATE INDEX journeys_status_idx ON journeys (status);
CREATE INDEX journeys_camp_idx ON journeys (camp_id);

CREATE TRIGGER journeys_set_updated_at
BEFORE UPDATE ON journeys
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE journey_locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  journey_id UUID NOT NULL REFERENCES journeys (id) ON DELETE CASCADE,
  event_id UUID NOT NULL,
  latitude DOUBLE PRECISION NOT NULL CHECK (latitude BETWEEN -90 AND 90),
  longitude DOUBLE PRECISION NOT NULL CHECK (longitude BETWEEN -180 AND 180),
  accuracy_m DOUBLE PRECISION CHECK (accuracy_m IS NULL OR accuracy_m >= 0),
  speed_mps DOUBLE PRECISION CHECK (speed_mps IS NULL OR speed_mps >= 0),
  heading_deg DOUBLE PRECISION CHECK (
    heading_deg IS NULL OR (heading_deg >= 0 AND heading_deg < 360)
  ),
  recorded_at TIMESTAMPTZ NOT NULL,
  received_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT journey_locations_event_unique UNIQUE (journey_id, event_id)
);

-- Supports history retrieval and "latest location" lookups.
CREATE INDEX journey_locations_journey_recorded_idx
  ON journey_locations (journey_id, recorded_at DESC);

CREATE TABLE emergency_contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  corps_member_id UUID NOT NULL REFERENCES corps_members (user_id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  relationship TEXT,
  is_primary BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX emergency_contacts_member_phone_unique
  ON emergency_contacts (corps_member_id, phone);

-- At most one primary emergency contact per corps member.
CREATE UNIQUE INDEX emergency_contacts_one_primary_unique
  ON emergency_contacts (corps_member_id)
  WHERE is_primary;

CREATE INDEX emergency_contacts_member_idx ON emergency_contacts (corps_member_id);

CREATE TRIGGER emergency_contacts_set_updated_at
BEFORE UPDATE ON emergency_contacts
FOR EACH ROW EXECUTE FUNCTION set_updated_at();
