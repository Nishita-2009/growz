import { create } from 'zustand';
import { UserProfile } from '../types/auth';
import { auth, FirebaseUser, onAuthStateChanged } from '../lib/firebase';
import { authService } from '../services/authService';

interface AuthState {
  firebaseUser: FirebaseUser | null;
  userProfile: UserProfile | null;
  token: string | null;
  loading: boolean;
  error: string | null;

  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  initAuth: () => () => void;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (email: string, pass: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  firebaseUser: null,
  userProfile: null,
  token: null,
  loading: true,
  error: null,

  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  initAuth: () => {
    set({ loading: true });
    const unsubscribe = onAuthStateChanged(auth, async (user) => {

      if (user) {
        try {
          const token = await user.getIdToken();
          const profile = await authService.getMe(token);
          set({ firebaseUser: user, userProfile: profile, token, loading: false, error: null });
        } catch (err: any) {
          console.error('Failed to load user backend profile:', err);
          set({ firebaseUser: user, userProfile: null, token: null, loading: false, error: err.message });
        }
      } else {
        set({ firebaseUser: null, userProfile: null, token: null, loading: false, error: null });
      }
    });
    return unsubscribe;
  },

  loginWithEmail: async (email, pass) => {
    set({ loading: true, error: null });
    try {
      await authService.loginWithEmail(email, pass);
    } catch (err: any) {
      set({ error: err.message || 'Login failed', loading: false });
      throw err;
    }
  },

  signUpWithEmail: async (email, pass) => {
    set({ loading: true, error: null });
    try {
      await authService.signUpWithEmail(email, pass);
    } catch (err: any) {
      set({ error: err.message || 'Signup failed', loading: false });
      throw err;
    }
  },

  loginWithGoogle: async () => {
    set({ loading: true, error: null });
    try {
      await authService.loginWithGoogle();
    } catch (err: any) {
      set({ error: err.message || 'Google sign-in failed', loading: false });
      throw err;
    }
  },

  logout: async () => {
    set({ loading: true });
    try {
      await authService.logout();
      set({ firebaseUser: null, userProfile: null, token: null, loading: false, error: null });
    } catch (err: any) {
      set({ error: err.message || 'Logout failed', loading: false });
    }
  }
}));
