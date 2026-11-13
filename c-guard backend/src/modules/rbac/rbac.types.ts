export interface Role {
  id: string;
  name: string;
  description: string | null;
  permissions: string[];
}

export interface Permission {
  id: string;
  key: string;
  description: string | null;
}

export interface UserRole {
  id: string;
  name: string;
  description: string | null;
}
