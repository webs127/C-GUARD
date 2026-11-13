import { z } from 'zod';

const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .pipe(z.email('A valid email address is required').max(254));

const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(128, 'Password must be at most 128 characters');

const nameSchema = z.string().trim().min(1, 'This field is required').max(100);
const phoneSchema = z
  .string()
  .trim()
  .regex(/^\+?[0-9\s-]{7,20}$/, 'Phone number is invalid');
const jobTitleSchema = z.string().trim().max(100);

function hasAtLeastOneKey(value: object): boolean {
  return Object.keys(value).length > 0;
}

export const createPersonnelSchema = z
  .object({
    email: emailSchema,
    password: passwordSchema,
    firstName: nameSchema,
    lastName: nameSchema,
    phone: phoneSchema.nullable().optional(),
    jobTitle: jobTitleSchema.nullable().optional(),
    roleIds: z.array(z.uuid('Each role ID must be a valid UUID')).max(50).default([]),
  })
  .strict();

export const updatePersonnelProfileSchema = z
  .object({
    firstName: nameSchema.optional(),
    lastName: nameSchema.optional(),
    phone: phoneSchema.nullable().optional(),
    jobTitle: jobTitleSchema.nullable().optional(),
  })
  .strict()
  .refine(hasAtLeastOneKey, {
    message: 'At least one profile field is required',
  });

export type CreatePersonnelInput = z.infer<typeof createPersonnelSchema>;
export type UpdatePersonnelProfileInput = z.infer<
  typeof updatePersonnelProfileSchema
>;
