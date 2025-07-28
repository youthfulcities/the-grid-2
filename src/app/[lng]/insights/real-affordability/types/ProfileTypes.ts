export interface ProfileData {
  key: string;
  city: string | null;
  gender: string | null;
  occupation: string | null;
  age: number | null;
  customized: boolean;
}

export interface PrecomputedProfileData {
  gender: string | null;
  occupation: string | null;
  age: number | null;
  customized: boolean;
}

// Type for an array of profiles
export type Profiles = ProfileData[];
