import { create } from 'zustand';
import { useBusinessProfileStore } from './useBusinessProfileStore';
import { calculateGrowthScore } from '../services/intelligence/growthScoreEngine';
import { detectOpportunities } from '../services/intelligence/opportunityDetector';
import { GrowthScoreResult, Opportunity } from '../types/intelligence';

interface IntelligenceState {
  growthScoreResult: GrowthScoreResult;
  opportunities: Opportunity[];
  recalculateIntelligence: () => void;
}

export const useIntelligenceStore = create<IntelligenceState>((set) => {
  const profile = useBusinessProfileStore.getState().profile;
  const initialScore = calculateGrowthScore(profile);
  const initialOpps = detectOpportunities(profile, initialScore);

  return {
    growthScoreResult: initialScore,
    opportunities: initialOpps,
    recalculateIntelligence: () => {
      const currentProfile = useBusinessProfileStore.getState().profile;
      const score = calculateGrowthScore(currentProfile);
      const opps = detectOpportunities(currentProfile, score);
      set({ growthScoreResult: score, opportunities: opps });
    }
  };
});

// Subscribe to business profile store changes
useBusinessProfileStore.subscribe(() => {
  useIntelligenceStore.getState().recalculateIntelligence();
});
