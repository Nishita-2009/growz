import { 
  auth, 
  googleProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as firebaseSignOut 
} from '../lib/firebase';
import { UserProfile } from '../types/auth';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

export const authService = {
  /**
   * Fetch authenticated user details from FastAPI backend
   */
  async getMe(idToken: string): Promise<UserProfile> {
    const response = await fetch(`${API_BASE_URL}/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${idToken}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: 'Failed to fetch user profile' }));
      throw new Error(errorData.detail || 'Failed to authenticate with backend');
    }

    return response.json();
  },

  /**
   * Sign in using Email and Password
   */
  async loginWithEmail(email: string, pass: string) {
    return signInWithEmailAndPassword(auth, email, pass);
  },

  /**
   * Register user using Email and Password
   */
  async signUpWithEmail(email: string, pass: string) {
    return createUserWithEmailAndPassword(auth, email, pass);
  },

  /**
   * Sign in using Google Provider
   */
  async loginWithGoogle() {
    return signInWithPopup(auth, googleProvider);
  },

  /**
   * Sign out current user
   */
  async logout() {
    return firebaseSignOut(auth);
  },

  /**
   * Get current Firebase ID Token
   */
  async getIdToken(): Promise<string | null> {
    const user = auth.currentUser;
    if (!user) return null;
    return user.getIdToken();
  }
};
