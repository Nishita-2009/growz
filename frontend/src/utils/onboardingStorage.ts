import { BusinessProfile } from '../types/businessProfile';

export const getProfileKey = (uid?: string | null) => uid ? `growz_business_profile_${uid}` : 'growz_business_profile';
export const getCompletedKey = (uid?: string | null) => uid ? `growz_onboarding_completed_${uid}` : 'growz_onboarding_completed';

export interface StoredOnboardingState {
  profile: BusinessProfile | null;
  isCompleted: boolean;
  currentStep?: number;
}

/**
 * Safely loads persisted onboarding business profile and completion state from localStorage, scoped by user UID.
 */
export const loadOnboardingState = (uid?: string | null): StoredOnboardingState => {
  if (!uid) {
    return { profile: null, isCompleted: false };
  }
  try {
    const isCompletedRaw = localStorage.getItem(getCompletedKey(uid));
    const profileRaw = localStorage.getItem(getProfileKey(uid));

    if (!profileRaw) {
      return { profile: null, isCompleted: false };
    }

    const parsed = JSON.parse(profileRaw) as BusinessProfile & { currentStep?: number };
    const isCompleted = isCompletedRaw === 'true';

    // Basic structure validation
    if (!parsed || typeof parsed !== 'object') {
      clearOnboardingStorage(uid);
      return { profile: null, isCompleted: false };
    }

    return { 
      profile: parsed, 
      isCompleted,
      currentStep: parsed.currentStep || 1
    };
  } catch (err) {
    console.warn('Failed to parse Growz onboarding data from localStorage. Clearing corrupted cache:', err);
    clearOnboardingStorage(uid);
    return { profile: null, isCompleted: false };
  }
};

/**
 * Saves draft onboarding state (including current step) in localStorage scoped by UID.
 */
export const saveDraftOnboardingState = (profile: BusinessProfile, uid: string, currentStep: number): void => {
  if (!uid) return;
  try {
    const draftData = {
      ...profile,
      currentStep,
      updatedAt: new Date().toISOString()
    };
    localStorage.setItem(getProfileKey(uid), JSON.stringify(draftData));
  } catch (err) {
    console.error('Failed to save draft onboarding state to localStorage:', err);
  }
};

/**
 * Saves completed business profile and sets onboarding completed flag in localStorage scoped by UID.
 */
export const saveOnboardingState = (profile: BusinessProfile, uid?: string | null): void => {
  if (!uid) return;
  try {
    const updatedProfile: BusinessProfile = {
      ...profile,
      isCompleted: true,
      updatedAt: new Date().toISOString()
    };
    localStorage.setItem(getProfileKey(uid), JSON.stringify(updatedProfile));
    localStorage.setItem(getCompletedKey(uid), 'true');
  } catch (err) {
    console.error('Failed to save Growz onboarding profile to localStorage:', err);
  }
};

/**
 * Clears onboarding profile and completion state from localStorage for a specific UID.
 */
export const clearOnboardingStorage = (uid?: string | null): void => {
  if (!uid) return;
  try {
    localStorage.removeItem(getProfileKey(uid));
    localStorage.removeItem(getCompletedKey(uid));
  } catch (err) {
    console.error('Failed to clear Growz onboarding storage:', err);
  }
};
