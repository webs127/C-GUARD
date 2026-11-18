import { z } from 'zod';
import { JOURNEY_STATUSES } from './journey.types';

const labelSchema = z.string().trim().min(1, 'This field is required').max(255);
const latitudeSchema = z.number().min(-90).max(90);
const longitudeSchema = z.number().min(-180).max(180);
const dateTimeSchema = z.iso.datetime({ offset: true });

function hasCoordinatePair(
  latitude: number | null | undefined,
  longitude: number | null | undefined,
): boolean {
  const hasLatitude = latitude !== undefined && latitude !== null;
  const hasLongitude = longitude !== undefined && longitude !== null;
  return hasLatitude === hasLongitude;
}

export const createJourneySchema = z
  .object({
    originLabel: labelSchema,
    originLatitude: latitudeSchema.nullable().optional(),
    originLongitude: longitudeSchema.nullable().optional(),
    destinationLabel: labelSchema,
    destinationLatitude: latitudeSchema.nullable().optional(),
    destinationLongitude: longitudeSchema.nullable().optional(),
    campId: z.uuid('A valid camp ID is required').nullable().optional(),
    plannedDepartureAt: dateTimeSchema.optional(),
    expectedArrivalAt: dateTimeSchema.optional(),
  })
  .strict()
  .superRefine((value, ctx) => {
    if (!hasCoordinatePair(value.originLatitude, value.originLongitude)) {
      ctx.addIssue({
        code: 'custom',
        message: 'Origin latitude and longitude must be provided together',
        path: ['originLatitude'],
      });
    }

    if (
      !hasCoordinatePair(
        value.destinationLatitude,
        value.destinationLongitude,
      )
    ) {
      ctx.addIssue({
        code: 'custom',
        message: 'Destination latitude and longitude must be provided together',
        path: ['destinationLatitude'],
      });
    }

    if (
      value.plannedDepartureAt !== undefined &&
      value.expectedArrivalAt !== undefined &&
      Date.parse(value.expectedArrivalAt) <=
        Date.parse(value.plannedDepartureAt)
    ) {
      ctx.addIssue({
        code: 'custom',
        message: 'Expected arrival must be after planned departure',
        path: ['expectedArrivalAt'],
      });
    }
  });

export const listJourneysQuerySchema = z
  .object({
    status: z.enum(JOURNEY_STATUSES).optional(),
    campId: z.uuid('A valid camp ID is required').optional(),
    corpsMemberId: z.uuid('A valid corps member ID is required').optional(),
    limit: z.coerce.number().int().min(1).max(100).default(50),
    offset: z.coerce.number().int().min(0).default(0),
  })
  .strict();

export type CreateJourneyInput = z.infer<typeof createJourneySchema>;
export type ListJourneysQuery = z.infer<typeof listJourneysQuerySchema>;
