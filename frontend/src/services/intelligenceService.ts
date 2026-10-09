export interface CategoryScore {
  category: string;
  score: number | null;
  status: 'excellent' | 'healthy' | 'attention' | 'critical' | 'insufficient_data';
  data_status: 'sufficient' | 'insufficient_data';
  explanation: string;
}

export interface GrowthScore {
  overall_score: number | null;
  data_status: 'sufficient_data' | 'insufficient_data' | 'no_data';
  categories_available: number;
  categories_missing: number;
  confidence: number;
  categories: CategoryScore[];
}

export interface OpportunityItem {
  id: string;
  title: string;
  category: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  problem: string;
  evidence: string;
  reasoning: string;
  recommended_action: string;
  expected_impact: string;
  difficulty: 'easy' | 'moderate' | 'hard';
  confidence: number;
  related_module: string;
}

export interface IntelligenceOverview {
  growth_score: GrowthScore;
  opportunities: OpportunityItem[];
}

import { useAuthStore } from '../stores/useAuthStore';

function getServiceHeaders(businessId?: string): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  const authState = useAuthStore.getState();

  if (authState.isDemoMode) {
    headers['X-Business-ID'] = 'demo-business-id';
    return headers;
  }

  if (authState.token) {
    headers['Authorization'] = `Bearer ${authState.token}`;
  }

  const activeId = businessId || authState.userProfile?.organizations?.[0]?.id;
  if (activeId) {
    headers['X-Business-ID'] = activeId;
  }

  return headers;
}

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

export const intelligenceService = {
  /**
   * Fetches Growth Score and detected business opportunities calculated from PostgreSQL.
   */
  async getIntelligenceOverview(businessId?: string): Promise<IntelligenceOverview> {
    const headers = getServiceHeaders(businessId);

    const cleanBase = BASE_URL.replace(/\/+$/, '');
    const endpoint = cleanBase.endsWith('/api/v1')
      ? `${cleanBase}/intelligence/overview`
      : `${cleanBase}/api/v1/intelligence/overview`;

    const response = await fetch(endpoint, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: 'Failed to fetch intelligence overview' }));
      throw new Error(errorData.detail || 'Failed to fetch Growth Score and Opportunities from backend.');
    }

    return response.json();
  },
};
