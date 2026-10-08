import { create } from 'zustand';
import { BusinessProfile, initialBusinessProfile } from '../types/businessProfile';
import { loadOnboardingState, saveOnboardingState, clearOnboardingStorage } from '../utils/onboardingStorage';

interface BusinessProfileState {
  currentStep: number;
  profile: BusinessProfile;
  isCompleted: boolean;
  
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  updateProfile: (fields: Partial<BusinessProfile>) => void;
  completeOnboarding: () => void;
  resetOnboarding: () => void;
  hydrateFromStorage: () => void;
}

const initialSaved = loadOnboardingState();

export const useBusinessProfileStore = create<BusinessProfileState>((set, get) => ({
  currentStep: 1,
  profile: initialSaved.profile || initialBusinessProfile,
  isCompleted: initialSaved.isCompleted,

  setStep: (step) => set({ currentStep: Math.min(Math.max(step, 1), 9) }),
  nextStep: () => set((state) => ({ currentStep: Math.min(state.currentStep + 1, 9) })),
  prevStep: () => set((state) => ({ currentStep: Math.max(state.currentStep - 1, 1) })),
  
  updateProfile: (fields) =>
    set((state) => ({
      profile: { ...state.profile, ...fields },
    })),

  completeOnboarding: () => {
    const currentProfile = get().profile;
    const finalProfile: BusinessProfile = {
      ...currentProfile,
      isCompleted: true,
      updatedAt: new Date().toISOString()
    };
    saveOnboardingState(finalProfile);
    set({
      isCompleted: true,
      profile: finalProfile
    });
  },

  resetOnboarding: () => {
    clearOnboardingStorage();
    set({
      currentStep: 1,
      profile: initialBusinessProfile,
      isCompleted: false,
    });
  },

  hydrateFromStorage: () => {
    const saved = loadOnboardingState();
    if (saved.isCompleted && saved.profile) {
      set({
        profile: saved.profile,
        isCompleted: true
      });
    } else {
      set({
        profile: initialBusinessProfile,
        isCompleted: false
      });
    }
  }
}));
