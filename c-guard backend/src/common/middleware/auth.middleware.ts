import type { RequestHandler } from 'express';
import { ForbiddenError, UnauthorizedError } from '../errors/AppError';
import { verifyAccessToken } from '../../modules/auth/auth.tokens';
import { findAuthContext } from '../../modules/auth/auth.repository';

export const authenticate: RequestHandler = async (req, _res, next) => {
  try {
    const header = req.get('authorization');
    if (!header) {
      throw new UnauthorizedError('Authentication required');
    }

    if (!/^Bearer\s+\S+$/i.test(header)) {
      throw new UnauthorizedError('Invalid authorization header');
    }

    const token = header.replace(/^Bearer\s+/i, '').trim();
    const userId = verifyAccessToken(token);

    const context = await findAuthContext(userId);
    if (!context) {
      throw new UnauthorizedError('Account not found');
    }
    if (context.status !== 'active') {
      throw new ForbiddenError('Account is not active');
    }

    req.user = {
      id: context.id,
      email: context.email,
      status: context.status,
      roles: context.roles,
      permissions: context.permissions,
    };

    next();
  } catch (err) {
    next(err);
  }
};
