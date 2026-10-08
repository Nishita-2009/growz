export interface HealthStatus {
  status: string;
  service: string;
  version?: string;
  timestamp?: string;
}

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

export interface BusinessMetric {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
}
