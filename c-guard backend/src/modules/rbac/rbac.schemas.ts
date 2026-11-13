import { z } from 'zod';

export const setUserRolesSchema = z
  .object({
    roleIds: z.array(z.uuid('Each role ID must be a valid UUID')).max(50),
  })
  .strict();
