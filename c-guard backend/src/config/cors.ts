import cors from 'cors';
import { corsOrigins } from './env';
import { ForbiddenError } from '../common/errors/AppError';

export const corsMiddleware = cors({
  origin(origin, callback) {
    if (!origin || corsOrigins.includes(origin)) {
      callback(null, true);
      return;
    }
    callback(new ForbiddenError(`Origin ${origin} is not allowed by CORS`));
  },
  credentials: true,
});
