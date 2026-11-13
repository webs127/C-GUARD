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
  createdAt: string;
  updatedAt: string;
}

export interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  relationship: string | null;
  isPrimary: boolean;
  createdAt: string;
  updatedAt: string;
}
