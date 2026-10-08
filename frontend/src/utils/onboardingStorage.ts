import { BusinessProfile } from '../types/businessProfile';

export const PROFILE_STORAGE_KEY = 'growz_business_profile';
export const COMPLETED_STORAGE_KEY = 'growz_onboarding_completed';

/**
 * Safely loads persisted onboarding business profile and completion state from localStorage.
 */
export const loadOnboardingState = (): { profile: BusinessProfile | null; isCompleted: boolean } => {
  try {
    const isCompletedRaw = localStorage.getItem(COMPLETED_STORAGE_KEY);
    const profileRaw = localStorage.getItem(PROFILE_STORAGE_KEY);

    if (!profileRaw || isCompletedRaw !== 'true') {
      return { profile: null, isCompleted: false };
    }

    const parsedProfile = JSON.parse(profileRaw) as BusinessProfile;

    // Basic structure validation
    if (!parsedProfile || typeof parsedProfile !== 'object' || !parsedProfile.businessName) {
      clearOnboardingStorage();
      return { profile: null, isCompleted: false };
    }

    return { profile: parsedProfile, isCompleted: true };
  } catch (err) {
    console.warn('Failed to parse Growz onboarding data from localStorage. Clearing corrupted cache:', err);
    clearOnboardingStorage();
    return { profile: null, isCompleted: false };
  }
};

/**
 * Saves completed business profile and sets onboarding completed flag in localStorage.
 */
export const saveOnboardingState = (profile: BusinessProfile): void => {
  try {
    const updatedProfile: BusinessProfile = {
      ...profile,
      isCompleted: true,
      updatedAt: new Date().toISOString()
    };
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(updatedProfile));
    localStorage.setItem(COMPLETED_STORAGE_KEY, 'true');
  } catch (err) {
    console.error('Failed to save Growz onboarding profile to localStorage:', err);
  }
};

/**
 * Clears onboarding profile and completion state from localStorage.
 */
export const clearOnboardingStorage = (): void => {
  try {
    localStorage.removeItem(PROFILE_STORAGE_KEY);
    localStorage.removeItem(COMPLETED_STORAGE_KEY);
  } catch (err) {
    console.error('Failed to clear Growz onboarding storage:', err);
  }
};
