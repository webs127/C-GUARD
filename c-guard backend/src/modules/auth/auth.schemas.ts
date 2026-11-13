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
  .regex(/^\+?[0-9\s-]{7,20}$/, 'Phone number is invalid')
  .optional();

export const registerSchema = z
  .object({
    email: emailSchema,
    password: passwordSchema,
    firstName: nameSchema,
    lastName: nameSchema,
    phone: phoneSchema,
    callUpNumber: z
      .string()
      .trim()
      .min(3, 'Call-up number is required')
      .max(50)
      .transform((value) => value.toUpperCase()),
    stateCode: z
      .string()
      .trim()
      .min(2, 'State code is required')
      .max(10)
      .transform((value) => value.toUpperCase()),
    campId: z.uuid('A valid camp ID is required'),
  })
  .strict();

export const loginSchema = z
  .object({
    email: emailSchema,
    password: z.string().min(1, 'Password is required').max(128),
  })
  .strict();

export const refreshSchema = z
  .object({
    refreshToken: z.string().min(1, 'Refresh token is required'),
  })
  .strict();

export const logoutSchema = refreshSchema;

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type RefreshInput = z.infer<typeof refreshSchema>;
export type LogoutInput = z.infer<typeof logoutSchema>;
