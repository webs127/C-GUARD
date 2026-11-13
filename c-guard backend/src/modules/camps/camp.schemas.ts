import { z } from 'zod';

const booleanQuerySchema = z
  .enum(['true', 'false'])
  .transform((value) => value === 'true');

const nameSchema = z.string().trim().min(1, 'Camp name is required').max(150);
const addressSchema = z.string().trim().max(255);
const stateSchema = z.string().trim().min(2, 'State is required').max(50);

function hasAtLeastOneKey(value: object): boolean {
  return Object.keys(value).length > 0;
}

export const listCampsQuerySchema = z
  .object({
    state: stateSchema.optional(),
    isActive: booleanQuerySchema.optional(),
  })
  .strict();

export const createCampSchema = z
  .object({
    name: nameSchema,
    address: addressSchema.nullable().optional(),
    state: stateSchema,
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
    isActive: z.boolean().optional(),
  })
  .strict();

export const updateCampSchema = z
  .object({
    name: nameSchema.optional(),
    address: addressSchema.nullable().optional(),
    state: stateSchema.optional(),
    latitude: z.number().min(-90).max(90).optional(),
    longitude: z.number().min(-180).max(180).optional(),
    isActive: z.boolean().optional(),
  })
  .strict()
  .refine(hasAtLeastOneKey, {
    message: 'At least one camp field is required',
  });

export type ListCampsQuery = z.infer<typeof listCampsQuerySchema>;
export type CreateCampInput = z.infer<typeof createCampSchema>;
export type UpdateCampInput = z.infer<typeof updateCampSchema>;
