import { create } from 'zustand';
import { UserProfile } from '../types/auth';
import { auth, FirebaseUser, onAuthStateChanged } from '../lib/firebase';
import { authService } from '../services/authService';
import { useBusinessProfileStore } from './useBusinessProfileStore';

interface AuthState {
  firebaseUser: FirebaseUser | null;
  userProfile: UserProfile | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  isDemoMode: boolean;

  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  initAuth: () => () => void;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (email: string, pass: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  enterDemoMode: () => void;
  exitDemoMode: () => void;
}

function formatAuthError(err: any): string {
  const code = err?.code || '';
  const message = err?.message || String(err || '');

  if (code === 'auth/invalid-credential' || message.includes('auth/invalid-credential')) {
    return 'Invalid user credentials. Please check your email and password.';
  }
  if (code === 'auth/user-not-found' || message.includes('user-not-found')) {
    return 'User account not found. Please check your email or sign up.';
  }
  if (code === 'auth/wrong-password' || message.includes('wrong-password')) {
    return 'Invalid password. Please try again.';
  }
  if (code === 'auth/invalid-email' || message.includes('invalid-email')) {
    return 'Invalid email address format. Please enter a valid email.';
  }
  if (code === 'auth/email-already-in-use' || message.includes('email-already-in-use')) {
    return 'An account with this email already exists. Try signing in instead.';
  }
  if (code === 'auth/weak-password' || message.includes('weak-password')) {
    return 'Password is too weak. Please use at least 6 characters.';
  }
  if (code === 'auth/popup-closed-by-user' || message.includes('popup-closed-by-user')) {
    return 'Google sign-in was cancelled.';
  }
  if (code === 'auth/too-many-requests' || message.includes('too-many-requests')) {
    return 'Too many failed attempts. Please wait a moment and try again.';
  }
  if (code === 'auth/network-request-failed' || message.includes('network-request-failed')) {
    return 'Network error. Please check your internet connection and try again.';
  }

  if (message.toLowerCase().includes('auth') || message.toLowerCase().includes('firebase') || message.toLowerCase().includes('invalid')) {
    return 'Invalid user details. Please check your information and try again.';
  }

  return message || 'Unable to sign in. Please verify your details and try again.';
}

export const useAuthStore = create<AuthState>((set, get) => ({
  firebaseUser: null,
  userProfile: null,
  token: null,
  loading: true,
  error: null,
  isDemoMode: false,

  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  initAuth: () => {
    set({ loading: true });
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const token = await user.getIdToken();
          const profile = await authService.getMe(token);
          set({ firebaseUser: user, userProfile: profile, token, loading: false, error: null, isDemoMode: false });
          useBusinessProfileStore.getState().hydrateForUser(user.uid, false);
        } catch (err: any) {
          console.error('Failed to load user backend profile:', err);
          set({ firebaseUser: user, userProfile: null, token: null, loading: false, error: formatAuthError(err), isDemoMode: false });
          useBusinessProfileStore.getState().hydrateForUser(null, false);
        }
      } else {
        const isDemo = get().isDemoMode;
        if (!isDemo) {
          set({ firebaseUser: null, userProfile: null, token: null, loading: false, error: null });
          useBusinessProfileStore.getState().hydrateForUser(null, false);
        } else {
          set({ loading: false });
        }
      }
    });
    return unsubscribe;
  },

  loginWithEmail: async (email, pass) => {
    set({ loading: true, error: null, isDemoMode: false });
    try {
      await authService.loginWithEmail(email, pass);
    } catch (err: any) {
      set({ error: formatAuthError(err), loading: false });
    }
  },

  signUpWithEmail: async (email, pass) => {
    set({ loading: true, error: null, isDemoMode: false });
    try {
      await authService.signUpWithEmail(email, pass);
    } catch (err: any) {
      set({ error: formatAuthError(err), loading: false });
    }
  },

  loginWithGoogle: async () => {
    set({ loading: true, error: null, isDemoMode: false });
    try {
      await authService.loginWithGoogle();
    } catch (err: any) {
      set({ error: formatAuthError(err), loading: false });
    }
  },

  logout: async () => {
    set({ loading: true });
    try {
      if (!get().isDemoMode) {
        await authService.logout();
      }
      set({ firebaseUser: null, userProfile: null, token: null, loading: false, error: null, isDemoMode: false });
      useBusinessProfileStore.getState().hydrateForUser(null, false);
    } catch (err: any) {
      set({ error: formatAuthError(err), loading: false });
    }
  },

  enterDemoMode: () => {
    const demoUserProfile: UserProfile = {
      id: '00000000-0000-0000-0000-000000000000',
      firebase_uid: 'demo-user-uid',
      email: 'demo@growz.app',
      full_name: 'Growz Demo User',
      is_active: true,
      organizations: [
        {
          id: '00000000-0000-0000-0000-000000000001',
          name: 'Apex Retail (Demo)',
          slug: 'apex-retail-demo',
          business_type: 'Retail Store',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
      ],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    set({
      isDemoMode: true,
      firebaseUser: null,
      userProfile: demoUserProfile,
      token: null,
      loading: false,
      error: null
    });
    useBusinessProfileStore.getState().hydrateForUser('demo-user', true);
  },

  exitDemoMode: () => {
    set({
      isDemoMode: false,
      firebaseUser: null,
      userProfile: null,
      token: null,
      loading: false,
      error: null
    });
    useBusinessProfileStore.getState().hydrateForUser(null, false);
  }
}));
