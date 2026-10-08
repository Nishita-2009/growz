import { create } from 'zustand';
import { HealthStatus } from '../types';

interface AppState {
  healthStatus: HealthStatus | null;
  isLoadingHealth: boolean;
  healthError: string | null;
  activeTab: 'landing' | 'app';
  setActiveTab: (tab: 'landing' | 'app') => void;
  fetchHealth: () => Promise<void>;
}

export const useAppStore = create<AppState>((set) => ({
  healthStatus: null,
  isLoadingHealth: false,
  healthError: null,
  activeTab: 'landing',
  setActiveTab: (tab) => set({ activeTab: tab }),
  fetchHealth: async () => {
    set({ isLoadingHealth: true, healthError: null });
    try {
      const response = await fetch('/api/v1/health');
      if (!response.ok) {
        throw new Error(`Health check failed with status: ${response.status}`);
      }
      const data: HealthStatus = await response.json();
      set({ healthStatus: data, isLoadingHealth: false });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to connect to Growz API backend';
      set({ healthError: message, isLoadingHealth: false });
    }
  },
}));
