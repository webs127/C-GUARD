export type UserStatus = 'pending' | 'active' | 'suspended' | 'deactivated';

export interface AuthUser {
  id: string;
  email: string;
  status: UserStatus;
  roles: string[];
  permissions: string[];
}

export interface CorpsMemberProfile {
  userId: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  callUpNumber: string;
  stateCode: string;
  campId: string | null;
  campName: string | null;
  campState: string | null;
}

export interface PersonnelProfile {
  userId: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  jobTitle: string | null;
}

export type ProfileType = 'corps_member' | 'personnel';

export interface CurrentUser extends AuthUser {
  emailVerifiedAt: string | null;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
  profileType: ProfileType | null;
  profile: CorpsMemberProfile | PersonnelProfile | null;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  tokenType: 'Bearer';
  accessTokenExpiresIn: string;
  refreshTokenExpiresAt: string;
}

export interface AuthResult {
  user: CurrentUser;
  tokens: AuthTokens;
}

export interface RequestMetadata {
  userAgent: string | null;
  ipAddress: string | null;
}
