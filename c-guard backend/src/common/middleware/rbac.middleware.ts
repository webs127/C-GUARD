import type { RequestHandler } from 'express';
import { ForbiddenError, UnauthorizedError } from '../errors/AppError';
import type { AuthUser } from '../../modules/auth/auth.types';

export function hasPermission(user: AuthUser, permission: string): boolean {
  return user.permissions.includes(permission);
}

export function requirePermissions(...required: string[]): RequestHandler {
  return (req, _res, next) => {
    const user = req.user;
    if (!user) {
      next(new UnauthorizedError());
      return;
    }

    const missing = required.filter(
      (permission) => !hasPermission(user, permission),
    );
    if (missing.length > 0) {
      next(
        new ForbiddenError('Insufficient permissions', [
          { required, missing },
        ]),
      );
      return;
    }

    next();
  };
}

export function requireAnyPermission(...required: string[]): RequestHandler {
  return (req, _res, next) => {
    const user = req.user;
    if (!user) {
      next(new UnauthorizedError());
      return;
    }

    const allowed = required.some((permission) =>
      hasPermission(user, permission),
    );
    if (!allowed) {
      next(
        new ForbiddenError('Insufficient permissions', [
          { requiredAnyOf: required },
        ]),
      );
      return;
    }

    next();
  };
}

export function requireRoles(...required: string[]): RequestHandler {
  return (req, _res, next) => {
    const user = req.user;
    if (!user) {
      next(new UnauthorizedError());
      return;
    }

    const allowed = required.some((role) => user.roles.includes(role));
    if (!allowed) {
      next(new ForbiddenError('Insufficient role', [{ requiredAnyOf: required }]));
      return;
    }

    next();
  };
}
