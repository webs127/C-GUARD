export const JOURNEY_STATUSES = [
  'scheduled',
  'active',
  'completed',
  'cancelled',
] as const;

export type JourneyStatus = (typeof JOURNEY_STATUSES)[number];

export interface Journey {
  id: string;
  corpsMemberId: string;
  campId: string | null;
  originLabel: string | null;
  originLatitude: number | null;
  originLongitude: number | null;
  destinationLabel: string | null;
  destinationLatitude: number | null;
  destinationLongitude: number | null;
  plannedDepartureAt: string | null;
  expectedArrivalAt: string | null;
  status: JourneyStatus;
  startedAt: string | null;
  endedAt: string | null;
  cancelledAt: string | null;
  createdAt: string;
  updatedAt: string;
}
