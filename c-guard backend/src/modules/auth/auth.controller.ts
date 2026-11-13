import type { Request, RequestHandler } from 'express';
import { created, ok } from '../../common/utils/response';
import { UnauthorizedError } from '../../common/errors/AppError';
import * as authService from './auth.service';
import {
  loginSchema,
  logoutSchema,
  refreshSchema,
  registerSchema,
} from './auth.schemas';
import type { RequestMetadata } from './auth.types';

function getMetadata(req: Request): RequestMetadata {
  const ipAddress = req.ip
    ? req.ip.startsWith('::ffff:')
      ? req.ip.slice(7)
      : req.ip
    : null;

  return {
    userAgent: req.get('user-agent') ?? null,
    ipAddress,
  };
}

export const register: RequestHandler = async (req, res, next) => {
  try {
    const input = registerSchema.parse(req.body);
    const result = await authService.register(input, getMetadata(req));
    created(res, result, 'Registration successful');
  } catch (err) {
    next(err);
  }
};

export const login: RequestHandler = async (req, res, next) => {
  try {
    const input = loginSchema.parse(req.body);
    const result = await authService.login(input, getMetadata(req));
    ok(res, result, 'Login successful');
  } catch (err) {
    next(err);
  }
};

export const refresh: RequestHandler = async (req, res, next) => {
  try {
    const input = refreshSchema.parse(req.body);
    const result = await authService.refresh(
      input.refreshToken,
      getMetadata(req),
    );
    ok(res, result, 'Tokens refreshed successfully');
  } catch (err) {
    next(err);
  }
};

export const logout: RequestHandler = async (req, res, next) => {
  try {
    const input = logoutSchema.parse(req.body);
    await authService.logout(input.refreshToken);
    ok(res, null, 'Logged out successfully');
  } catch (err) {
    next(err);
  }
};

export const me: RequestHandler = async (req, res, next) => {
  try {
    if (!req.user) {
      throw new UnauthorizedError();
    }
    const user = await authService.getCurrentUser(req.user.id);
    ok(res, user, 'Authenticated user retrieved successfully');
  } catch (err) {
    next(err);
  }
};
