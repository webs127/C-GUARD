import { z } from 'zod';

const nameSchema = z.string().trim().min(1, 'This field is required').max(100);
const phoneSchema = z
  .string()
  .trim()
  .regex(/^\+?[0-9\s-]{7,20}$/, 'Phone number is invalid');

function hasAtLeastOneKey(value: object): boolean {
  return Object.keys(value).length > 0;
}

export const updateCorpsMemberProfileSchema = z
  .object({
    firstName: nameSchema.optional(),
    lastName: nameSchema.optional(),
    phone: phoneSchema.nullable().optional(),
  })
  .strict()
  .refine(hasAtLeastOneKey, {
    message: 'At least one profile field is required',
  });

export const createEmergencyContactSchema = z
  .object({
    name: nameSchema,
    phone: phoneSchema,
    relationship: z.string().trim().max(100).nullable().optional(),
    isPrimary: z.boolean().optional(),
  })
  .strict();

export const updateEmergencyContactSchema = z
  .object({
    name: nameSchema.optional(),
    phone: phoneSchema.optional(),
    relationship: z.string().trim().max(100).nullable().optional(),
    isPrimary: z.boolean().optional(),
  })
  .strict()
  .refine(hasAtLeastOneKey, {
    message: 'At least one emergency contact field is required',
  });

export const assignCampSchema = z
  .object({
    campId: z.uuid('A valid camp ID is required').nullable(),
  })
  .strict();

export type UpdateCorpsMemberProfileInput = z.infer<
  typeof updateCorpsMemberProfileSchema
>;
export type CreateEmergencyContactInput = z.infer<
  typeof createEmergencyContactSchema
>;
export type UpdateEmergencyContactInput = z.infer<
  typeof updateEmergencyContactSchema
>;
export type AssignCampInput = z.infer<typeof assignCampSchema>;
