import { useState, useEffect, useCallback } from 'react';
import { intelligenceService, IntelligenceOverview } from '../services/intelligenceService';

export const useIntelligence = (businessId?: string) => {
  const [intelligence, setIntelligence] = useState<IntelligenceOverview | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchIntelligence = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await intelligenceService.getIntelligenceOverview(businessId);
      setIntelligence(data);
    } catch (err: any) {
      setError(err.message || 'Failed to connect to Growz Intelligence Engine.');
    } finally {
      setLoading(false);
    }
  }, [businessId]);

  useEffect(() => {
    fetchIntelligence();
  }, [fetchIntelligence]);

  return {
    intelligence,
    loading,
    error,
    refetch: fetchIntelligence,
  };
};
