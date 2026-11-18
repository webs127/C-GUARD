import 'dotenv/config';
import { z } from 'zod';

const emptyToUndefined = (value: unknown): unknown =>
  typeof value === 'string' && value.trim() === '' ? undefined : value;

const optionalEnvString = z.preprocess(
  emptyToUndefined,
  z.string().trim().optional(),
);

const optionalSeedPassword = z.preprocess(
  emptyToUndefined,
  z.string().min(8, 'SEED_ADMIN_PASSWORD must be at least 8 characters').max(128).optional(),
);

const optionalSeedEmail = z.preprocess(
  emptyToUndefined,
  z.email('SEED_ADMIN_EMAIL must be a valid email address').max(254).optional(),
);

const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),
  PORT: z.coerce.number().int().positive().default(3000),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  CORS_ORIGINS: z.string().default('http://localhost:3001'),
  LOG_LEVEL: z
    .enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent'])
    .default('info'),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(60_000),
  RATE_LIMIT_MAX: z.coerce.number().int().positive().default(100),
  JWT_ACCESS_SECRET: z
    .string()
    .min(32, 'JWT_ACCESS_SECRET must be at least 32 characters'),
  JWT_REFRESH_SECRET: z
    .string()
    .min(32, 'JWT_REFRESH_SECRET must be at least 32 characters'),
  ACCESS_TOKEN_TTL: z
    .string()
    .regex(/^\d+(ms|s|m|h|d)$/, 'ACCESS_TOKEN_TTL must be a duration such as 15m')
    .default('15m'),
  REFRESH_TOKEN_TTL_DAYS: z.coerce.number().int().positive().default(30),
  AUTH_RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(900_000),
  AUTH_RATE_LIMIT_MAX: z.coerce.number().int().positive().default(20),
  SEED_ADMIN_EMAIL: optionalSeedEmail,
  SEED_ADMIN_PASSWORD: optionalSeedPassword,
  SEED_ADMIN_FIRST_NAME: optionalEnvString,
  SEED_ADMIN_LAST_NAME: optionalEnvString,
  SEED_ADMIN_PHONE: optionalEnvString,
  SEED_ADMIN_JOB_TITLE: optionalEnvString,
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  const details = parsed.error.issues
    .map((issue) => `${issue.path.join('.') || 'env'}: ${issue.message}`)
    .join('\n');
  // eslint-disable-next-line no-console
  console.error(`Invalid environment configuration:\n${details}`);
  process.exit(1);
}

export const env = parsed.data;

export const corsOrigins = env.CORS_ORIGINS.split(',')
  .map((origin) => origin.trim())
  .filter((origin) => origin.length > 0);
