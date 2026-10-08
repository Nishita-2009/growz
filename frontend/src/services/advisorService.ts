const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export interface AdvisorRequest {
  question: string;
}

export interface AdvisorResponse {
  question: string;
  answer: string;
  key_facts: string[];
  recommended_action: string;
  related_opportunity_id?: string | null;
  confidence: string;
}

export const advisorService = {
  async askAdvisor(question: string, businessId?: string): Promise<AdvisorResponse> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (businessId) {
      headers['X-Business-ID'] = businessId;
    }

    const endpoint = API_BASE_URL.includes('/api/v1')
      ? `${API_BASE_URL}/ai/advisor`
      : `${API_BASE_URL}/api/ai/advisor`;

    const response = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify({ question }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: 'Growz AI is temporarily unavailable.' }));
      throw new Error(errorData.detail || 'Growz AI is temporarily unavailable.');
    }

    return response.json();
  },
};
