import type { PoolClient } from 'pg';
import { env } from '../../config/env';
import { withTransaction } from '../../config/database';
import {
  BadRequestError,
  ConflictError,
  ForbiddenError,
  UnauthorizedError,
} from '../../common/errors/AppError';
import { hashPassword, verifyPassword } from './auth.passwords';
import {
  generateRefreshToken,
  hashRefreshToken,
  refreshTokenExpiry,
  signAccessToken,
} from './auth.tokens';
import type {
  AuthContextRow,
  CorpsMemberProfileRow,
  PersonnelProfileRow,
} from './auth.repository';
import * as authRepository from './auth.repository';
import type { LoginInput, RegisterInput } from './auth.schemas';
import type {
  AuthResult,
  AuthTokens,
  CorpsMemberProfile,
  CurrentUser,
  PersonnelProfile,
  ProfileType,
  RequestMetadata,
} from './auth.types';

interface LoadedProfile {
  profile: CorpsMemberProfile | PersonnelProfile | null;
  profileType: ProfileType | null;
}

function mapCorpsMemberProfile(row: CorpsMemberProfileRow): CorpsMemberProfile {
  return {
    userId: row.user_id,
    firstName: row.first_name,
    lastName: row.last_name,
    phone: row.phone,
    callUpNumber: row.call_up_number,
    stateCode: row.state_code,
    campId: row.camp_id,
    campName: row.camp_name,
    campState: row.camp_state,
  };
}

function mapPersonnelProfile(row: PersonnelProfileRow): PersonnelProfile {
  return {
    userId: row.user_id,
    firstName: row.first_name,
    lastName: row.last_name,
    phone: row.phone,
    jobTitle: row.job_title,
  };
}

function toCurrentUser(
  context: AuthContextRow,
  loadedProfile: LoadedProfile,
): CurrentUser {
  return {
    id: context.id,
    email: context.email,
    status: context.status,
    roles: context.roles,
    permissions: context.permissions,
    emailVerifiedAt: context.email_verified_at?.toISOString() ?? null,
    lastLoginAt: context.last_login_at?.toISOString() ?? null,
    createdAt: context.created_at.toISOString(),
    updatedAt: context.updated_at.toISOString(),
    profileType: loadedProfile.profileType,
    profile: loadedProfile.profile,
  };
}

async function loadProfile(
  userId: string,
  client?: PoolClient,
): Promise<LoadedProfile> {
  const corpsMember = await authRepository.getCorpsMemberProfile(userId, client);
  if (corpsMember) {
    return {
      profile: mapCorpsMemberProfile(corpsMember),
      profileType: 'corps_member',
    };
  }

  const personnel = await authRepository.getPersonnelProfile(userId, client);
  if (personnel) {
    return {
      profile: mapPersonnelProfile(personnel),
      profileType: 'personnel',
    };
  }

  return { profile: null, profileType: null };
}

async function issueTokens(
  client: PoolClient,
  userId: string,
  metadata: RequestMetadata,
): Promise<AuthTokens> {
  const accessToken = signAccessToken(userId);
  const refreshToken = generateRefreshToken();
  const refreshTokenExpiresAt = refreshTokenExpiry();

  await authRepository.insertRefreshToken(client, {
    userId,
    tokenHash: hashRefreshToken(refreshToken),
    expiresAt: refreshTokenExpiresAt,
    userAgent: metadata.userAgent,
    ipAddress: metadata.ipAddress,
  });

  return {
    accessToken,
    refreshToken,
    tokenType: 'Bearer',
    accessTokenExpiresIn: env.ACCESS_TOKEN_TTL,
    refreshTokenExpiresAt: refreshTokenExpiresAt.toISOString(),
  };
}

interface PgError {
  code?: string;
  constraint?: string;
}

function isPgError(err: unknown): err is PgError {
  return typeof err === 'object' && err !== null && 'code' in err;
}

function mapUniqueViolation(err: unknown): Error {
  if (isPgError(err) && err.code === '23505') {
    if (err.constraint === 'users_email_lower_unique') {
      return new ConflictError('An account with this email already exists');
    }
    if (err.constraint === 'corps_members_call_up_lower_unique') {
      return new ConflictError('This call-up number is already registered');
    }
    return new ConflictError('Account already exists');
  }

  return err instanceof Error ? err : new Error('Unexpected database error');
}

export async function register(
  input: RegisterInput,
  metadata: RequestMetadata,
): Promise<AuthResult> {
  const passwordHash = await hashPassword(input.password);

  return withTransaction(async (client) => {
    const campIsActive = await authRepository.findActiveCamp(
      input.campId,
      client,
    );
    if (!campIsActive) {
      throw new BadRequestError('Camp not found or inactive');
    }

    let userId: string;
    try {
      userId = await authRepository.createCorpsMemberUser(client, {
        email: input.email,
        passwordHash,
        firstName: input.firstName,
        lastName: input.lastName,
        phone: input.phone ?? null,
        callUpNumber: input.callUpNumber,
        stateCode: input.stateCode,
        campId: input.campId,
      });
    } catch (err) {
      throw mapUniqueViolation(err);
    }

    const context = await authRepository.findAuthContext(userId, client);
    if (!context) {
      throw new Error('Failed to load newly created user');
    }

    const loadedProfile = await loadProfile(userId, client);
    const tokens = await issueTokens(client, userId, metadata);

    return {
      user: toCurrentUser(context, loadedProfile),
      tokens,
    };
  });
}

export async function login(
  input: LoginInput,
  metadata: RequestMetadata,
): Promise<AuthResult> {
  const user = await authRepository.findUserByEmail(input.email);
  if (!user) {
    throw new UnauthorizedError('Invalid email or password');
  }

  const passwordIsValid = await verifyPassword(
    user.password_hash,
    input.password,
  );
  if (!passwordIsValid) {
    throw new UnauthorizedError('Invalid email or password');
  }

  if (user.status !== 'active') {
    throw new ForbiddenError('Account is not active');
  }

  return withTransaction(async (client) => {
    await authRepository.touchLastLogin(user.id, client);

    const context = await authRepository.findAuthContext(user.id, client);
    if (!context) {
      throw new UnauthorizedError('Account not found');
    }

    const loadedProfile = await loadProfile(user.id, client);
    const tokens = await issueTokens(client, user.id, metadata);

    return {
      user: toCurrentUser(context, loadedProfile),
      tokens,
    };
  });
}

type RefreshOutcome =
  | { status: 'ok'; result: AuthResult }
  | { status: 'invalid' }
  | { status: 'reused' }
  | { status: 'expired' };

export async function refresh(
  refreshToken: string,
  metadata: RequestMetadata,
): Promise<AuthResult> {
  const tokenHash = hashRefreshToken(refreshToken);

  const outcome = await withTransaction<RefreshOutcome>(async (client) => {
    const storedToken = await authRepository.findRefreshTokenByHash(
      client,
      tokenHash,
      true,
    );

    if (!storedToken) {
      return { status: 'invalid' };
    }

    if (storedToken.revoked_at) {
      await authRepository.revokeAllRefreshTokens(client, storedToken.user_id);
      return { status: 'reused' };
    }

    if (storedToken.expires_at.getTime() <= Date.now()) {
      await authRepository.revokeRefreshToken(client, storedToken.id);
      return { status: 'expired' };
    }

    const context = await authRepository.findAuthContext(
      storedToken.user_id,
      client,
    );
    if (!context) {
      throw new UnauthorizedError('Account not found');
    }
    if (context.status !== 'active') {
      throw new ForbiddenError('Account is not active');
    }

    const nextRefreshToken = generateRefreshToken();
    const nextExpiresAt = refreshTokenExpiry();
    const nextTokenId = await authRepository.insertRefreshToken(client, {
      userId: storedToken.user_id,
      tokenHash: hashRefreshToken(nextRefreshToken),
      expiresAt: nextExpiresAt,
      userAgent: metadata.userAgent,
      ipAddress: metadata.ipAddress,
    });

    await authRepository.revokeRefreshToken(
      client,
      storedToken.id,
      nextTokenId,
    );

    const loadedProfile = await loadProfile(storedToken.user_id, client);
    const accessToken = signAccessToken(storedToken.user_id);

    return {
      status: 'ok',
      result: {
        user: toCurrentUser(context, loadedProfile),
        tokens: {
          accessToken,
          refreshToken: nextRefreshToken,
          tokenType: 'Bearer',
          accessTokenExpiresIn: env.ACCESS_TOKEN_TTL,
          refreshTokenExpiresAt: nextExpiresAt.toISOString(),
        },
      },
    };
  });

  if (outcome.status === 'invalid') {
    throw new UnauthorizedError('Invalid refresh token');
  }
  if (outcome.status === 'reused') {
    throw new UnauthorizedError('Refresh token has already been used');
  }
  if (outcome.status === 'expired') {
    throw new UnauthorizedError('Refresh token has expired');
  }

  return outcome.result;
}

export async function logout(refreshToken: string): Promise<void> {
  const tokenHash = hashRefreshToken(refreshToken);

  await withTransaction(async (client) => {
    await authRepository.revokeRefreshTokenByHash(client, tokenHash);
  });
}

export async function getCurrentUser(userId: string): Promise<CurrentUser> {
  const context = await authRepository.findAuthContext(userId);
  if (!context) {
    throw new UnauthorizedError('Account not found');
  }
  if (context.status !== 'active') {
    throw new ForbiddenError('Account is not active');
  }

  const loadedProfile = await loadProfile(userId);
  return toCurrentUser(context, loadedProfile);
}
