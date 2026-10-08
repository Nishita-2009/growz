export type TimePeriod = 'this_month' | 'last_month' | 'last_3_months' | 'last_6_months' | 'this_year';

export interface FinancialMetricCard {
  id: string;
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  comparisonText: string;
  iconName: 'DollarSign' | 'TrendingUp' | 'CreditCard' | 'PieChart' | 'Percent' | 'BarChart3';
}

export interface RevenueVsExpenseDataPoint {
  period: string;
  revenue: number;
  expenses: number;
  profit: number;
}

export interface RevenueBreakdownItem {
  name: string;
  value: number;
  percentage: number;
  color: string;
}

export interface ExpenseBreakdownItem {
  category: string;
  amount: number;
  percentage: number;
  color: string;
}

export interface AIInsight {
  id: string;
  whatChanged: string;
  whyItMatters: string;
  recommendedAction: string;
  type: 'positive' | 'warning' | 'info';
}

export interface FinancialHealthStatus {
  status: 'Healthy' | 'Needs Attention' | 'Critical';
  score: number;
  reason: string;
}

export interface PeriodFinancialData {
  metrics: FinancialMetricCard[];
  chartData: RevenueVsExpenseDataPoint[];
  revenueByProduct: RevenueBreakdownItem[];
  revenueByChannel: RevenueBreakdownItem[];
  expenseCategories: ExpenseBreakdownItem[];
  profitability: {
    grossProfit: string;
    grossMargin: string;
    netProfit: string;
    netMargin: string;
    explanation: string;
  };
  aiInsight: AIInsight;
  health: FinancialHealthStatus;
}
