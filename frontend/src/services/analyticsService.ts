export interface FinancialMetrics {
  total_revenue: number;
  total_expenses: number;
  net_profit: number;
  profit_margin: number | null;
  revenue_growth: number | null;
  expense_growth: number | null;
  average_order_value: number;
}

export interface CustomerMetrics {
  total_customers: number;
  new_customers: number;
  repeat_customers: number;
  repeat_customer_rate: number | null;
  average_revenue_per_customer: number | null;
  customer_growth_rate: number | null;
}

export interface TopProductItem {
  product_id: string | null;
  name: string;
  units_sold: number;
  revenue: number;
}

export interface PeriodSalesItem {
  period: string;
  orders_count: number;
  revenue: number;
}

export interface SalesMetrics {
  total_orders: number;
  total_units_sold: number;
  average_order_value: number;
  top_products: TopProductItem[];
  sales_by_period: PeriodSalesItem[];
}

export interface InventoryMetrics {
  total_products: number;
  total_stock: number;
  low_stock_count: number;
  out_of_stock_count: number;
  total_inventory_value: number;
  turnover_rate: number | null;
}

export interface MarketingMetrics {
  total_spend: number;
  total_leads: number;
  total_conversions: number;
  conversion_rate: number | null;
  marketing_attributed_revenue: number;
  roas: number | null;
}

export interface BusinessAnalytics {
  business_id: string;
  generated_at: string;
  data_status: 'sufficient_data' | 'insufficient_data' | 'no_data';
  financials: FinancialMetrics;
  customers: CustomerMetrics;
  sales: SalesMetrics;
  inventory: InventoryMetrics;
  marketing: MarketingMetrics;
}


const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

export const analyticsService = {
  /**
   * Fetches deterministic business analytics calculated from PostgreSQL database.
   */
  async getBusinessAnalytics(businessId?: string): Promise<BusinessAnalytics> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (businessId) {
      headers['X-Business-ID'] = businessId;
    }

    const endpoint = BASE_URL.includes('/api/v1')
      ? `${BASE_URL}/analytics/overview`
      : `${BASE_URL}/api/analytics/overview`;

    const response = await fetch(endpoint, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: 'Failed to fetch business analytics' }));
      throw new Error(errorData.detail || 'Failed to fetch business analytics from backend.');
    }

    return response.json();
  },
};
