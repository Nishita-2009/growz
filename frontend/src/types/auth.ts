export interface Organization {
  id: string;
  name: string;
  slug: string;
  business_type?: string;
  created_at: string;
  updated_at: string;
}

export interface UserProfile {
  id: string;
  firebase_uid: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  organizations: Organization[];
}
