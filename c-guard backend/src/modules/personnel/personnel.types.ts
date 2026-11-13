import type { UserStatus } from '../auth/auth.types';

export interface PersonnelProfile {
  userId: string;
  email: string;
  status: UserStatus;
  firstName: string;
  lastName: string;
  phone: string | null;
  jobTitle: string | null;
  roles: string[];
  createdAt: string;
  updatedAt: string;
}
