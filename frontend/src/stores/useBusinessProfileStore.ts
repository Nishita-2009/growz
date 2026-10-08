import { create } from 'zustand';
import { BusinessProfile, initialBusinessProfile } from '../types/businessProfile';
import { loadOnboardingState, saveOnboardingState, saveDraftOnboardingState, clearOnboardingStorage } from '../utils/onboardingStorage';

export const demoBusinessProfile: BusinessProfile = {
  businessName: 'Nish Cafe',
  businessType: 'Restaurant & Cafe',
  industry: 'Food & Beverage',
  location: 'Jubilee Hills, Hyderabad, India',
  yearStarted: '2021',
  employeeCount: '10-15',

  offeringType: 'Food & Beverages',
  mainOffering: 'Specialty Coffee, Bakery, Hyderabadi Biryani & Fast Casual',
  avgSellingPrice: '350',
  offeringCount: '45',
  primarySalesChannels: ['Physical Store', 'WhatsApp', 'Website', 'Marketplace'],

  targetCustomerType: 'B2C (Consumers & Office Workers)',
  activeCustomersCount: '1428',
  newCustomersPerMonth: '184',
  repeatCustomersPercentage: '45',
  mainCustomerLocation: 'Local',

  avgMonthlyRevenue: '485000',
  avgMonthlyExpenses: '265000',
  approxMonthlyProfit: '220000',
  monthlySalesGrowth: '14.2',
  avgOrderValue: '420',
  skippedFinancials: false,

  maintainsInventory: 'Yes',
  locationCount: '1',
  supplierCount: '6',
  mainOperationalChallenge: 'Managing peak weekend rush & delivery platform fees',
  currentTools: ['POS', 'Google Sheets', 'Other'],

  hasInstagram: true,
  hasFacebook: true,
  hasGoogleBusiness: true,
  hasWebsite: true,
  hasWhatsAppBusiness: true,
  mainMarketingChannels: ['Instagram', 'Google Business', 'WhatsApp'],
  monthlyMarketingSpend: '26500',

  goals: ['Increase revenue', 'Increase profit', 'Increase repeat customers'],
  biggestChallenge: 'Delivery platform commissions and raw ingredient price volatility',
  isCompleted: true,
};

interface BusinessProfileState {
  currentUid: string | null;
  currentStep: number;
  profile: BusinessProfile;
  isCompleted: boolean;
  
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  updateProfile: (fields: Partial<BusinessProfile>) => void;
  completeOnboarding: (uidParam?: string | null) => void;
  resetOnboarding: (uidParam?: string | null) => void;
  hydrateFromStorage: () => void;
  hydrateForUser: (uid: string | null, isDemo?: boolean) => void;
}

export const useBusinessProfileStore = create<BusinessProfileState>((set, get) => ({
  currentUid: null,
  currentStep: 1,
  profile: initialBusinessProfile,
  isCompleted: false,

  setStep: (step) => {
    const nextS = Math.min(Math.max(step, 1), 9);
    set({ currentStep: nextS });
    const uid = get().currentUid;
    if (uid && !get().isCompleted) {
      saveDraftOnboardingState(get().profile, uid, nextS);
    }
  },

  nextStep: () => {
    const nextS = Math.min(get().currentStep + 1, 9);
    set({ currentStep: nextS });
    const uid = get().currentUid;
    if (uid && !get().isCompleted) {
      saveDraftOnboardingState(get().profile, uid, nextS);
    }
  },

  prevStep: () => {
    const prevS = Math.max(get().currentStep - 1, 1);
    set({ currentStep: prevS });
    const uid = get().currentUid;
    if (uid && !get().isCompleted) {
      saveDraftOnboardingState(get().profile, uid, prevS);
    }
  },
  
  updateProfile: (fields) => {
    const newProfile = { ...get().profile, ...fields };
    set({ profile: newProfile });
    const uid = get().currentUid;
    if (uid && !get().isCompleted) {
      saveDraftOnboardingState(newProfile, uid, get().currentStep);
    }
  },

  completeOnboarding: (uidParam) => {
    const uid = uidParam || get().currentUid;
    const currentProfile = get().profile;
    const finalProfile: BusinessProfile = {
      ...currentProfile,
      isCompleted: true,
      updatedAt: new Date().toISOString()
    };
    if (uid) {
      saveOnboardingState(finalProfile, uid);
    }
    set({
      isCompleted: true,
      profile: finalProfile
    });
  },

  resetOnboarding: (uidParam) => {
    const uid = uidParam || get().currentUid;
    if (uid) {
      clearOnboardingStorage(uid);
    }
    set({
      currentStep: 1,
      profile: initialBusinessProfile,
      isCompleted: false,
    });
  },

  hydrateFromStorage: () => {
    const uid = get().currentUid;
    if (!uid) {
      set({ profile: initialBusinessProfile, isCompleted: false, currentStep: 1 });
      return;
    }
    const saved = loadOnboardingState(uid);
    if (saved.profile) {
      set({
        profile: saved.profile,
        isCompleted: saved.isCompleted,
        currentStep: saved.currentStep || 1
      });
    } else {
      set({
        profile: initialBusinessProfile,
        isCompleted: false,
        currentStep: 1
      });
    }
  },

  hydrateForUser: (uid: string | null, isDemo: boolean = false) => {
    if (isDemo) {
      set({
        currentUid: 'demo-user',
        profile: demoBusinessProfile,
        isCompleted: true,
        currentStep: 1
      });
      return;
    }

    if (!uid) {
      set({
        currentUid: null,
        profile: initialBusinessProfile,
        isCompleted: false,
        currentStep: 1
      });
      return;
    }

    const saved = loadOnboardingState(uid);
    if (saved.profile) {
      set({
        currentUid: uid,
        profile: saved.profile,
        isCompleted: saved.isCompleted,
        currentStep: saved.currentStep || 1
      });
    } else {
      set({
        currentUid: uid,
        profile: initialBusinessProfile,
        isCompleted: false,
        currentStep: 1
      });
    }
  }
}));
