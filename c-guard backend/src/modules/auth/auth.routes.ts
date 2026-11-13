import { Router } from 'express';
import { authenticate } from '../../common/middleware/auth.middleware';
import { authRateLimiter } from '../../common/middleware/rate-limit.middleware';
import { login, logout, me, refresh, register } from './auth.controller';

export const authRouter = Router();

authRouter.post('/register', authRateLimiter, register);
authRouter.post('/login', authRateLimiter, login);
authRouter.post('/refresh', authRateLimiter, refresh);
authRouter.post('/logout', logout);
authRouter.get('/me', authenticate, me);
