import { createHmac, randomBytes } from 'node:crypto';
import jwt, { type JwtPayload, type SignOptions } from 'jsonwebtoken';
import { env } from '../../config/env';
import { UnauthorizedError } from '../../common/errors/AppError';

const JWT_ISSUER = 'c-guard';
const JWT_AUDIENCE = 'c-guard-api';

interface AccessTokenPayload extends JwtPayload {
  type: 'access';
}

export function signAccessToken(userId: string): string {
  return jwt.sign({ sub: userId, type: 'access' }, env.JWT_ACCESS_SECRET, {
    algorithm: 'HS256',
    expiresIn: env.ACCESS_TOKEN_TTL as SignOptions['expiresIn'],
    issuer: JWT_ISSUER,
    audience: JWT_AUDIENCE,
  });
}

export function verifyAccessToken(token: string): string {
  try {
    const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET, {
      algorithms: ['HS256'],
      issuer: JWT_ISSUER,
      audience: JWT_AUDIENCE,
    });

    if (typeof decoded === 'string') {
      throw new Error('Invalid token payload');
    }

    const payload = decoded as AccessTokenPayload;
    if (
      payload.type !== 'access' ||
      typeof payload.sub !== 'string' ||
      payload.sub.length === 0
    ) {
      throw new Error('Invalid token payload');
    }

    return payload.sub;
  } catch {
    throw new UnauthorizedError('Invalid or expired access token');
  }
}

export function generateRefreshToken(): string {
  return randomBytes(48).toString('base64url');
}

export function hashRefreshToken(token: string): string {
  return createHmac('sha256', env.JWT_REFRESH_SECRET).update(token).digest('hex');
}

export function refreshTokenExpiry(): Date {
  return new Date(
    Date.now() + env.REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000,
  );
}
