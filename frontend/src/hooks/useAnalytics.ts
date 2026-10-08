import { useState, useEffect, useCallback } from 'react';
import { analyticsService, BusinessAnalytics } from '../services/analyticsService';

export interface UseAnalyticsReturn {
  analytics: BusinessAnalytics | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useAnalytics(businessId?: string): UseAnalyticsReturn {
  const [analytics, setAnalytics] = useState<BusinessAnalytics | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await analyticsService.getBusinessAnalytics(businessId);
      setAnalytics(data);
    } catch (err: any) {
      console.error('Analytics Service Error:', err);
      setError('Unable to load your business data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [businessId]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  return {
    analytics,
    loading,
    error,
    refetch: fetchAnalytics,
  };
}
