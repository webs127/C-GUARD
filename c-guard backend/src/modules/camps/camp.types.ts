export interface Camp {
  id: string;
  name: string;
  address: string | null;
  state: string;
  latitude: number;
  longitude: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
