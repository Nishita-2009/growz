export interface KPICardConfig {
  id: string;
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  period: string;
  iconName: 'DollarSign' | 'ShoppingBag' | 'Users' | 'TrendingUp' | 'Package' | 'Utensils' | 'Calendar' | 'Factory' | 'PieChart' | 'Share2' | 'Target';
  category: 'revenue' | 'customers' | 'operations' | 'expenses' | 'marketing';
}

export interface DashboardSectionConfig {
  id: string;
  title: string;
  subtitle: string;
  priority: number; // 1 (highest) to 5
  type: 'metrics_grid' | 'growth_opportunities' | 'operations_summary' | 'marketing_roi' | 'recent_orders';
}

export interface SidebarModuleConfig {
  id: string;
  label: string;
  iconName: string;
  badge?: string;
  enabled: boolean;
}

export interface GrowthScoreCategory {
  name: string;
  score: number;
  maxScore: number;
  status: 'excellent' | 'good' | 'needs_attention';
  recommendation: string;
}

export interface GrowthMission {
  id: string;
  title: string;
  category: string;
  impact: 'High' | 'Medium' | 'Critical';
  effort: 'Easy' | 'Medium' | 'Hard';
  description: string;
}

export interface DashboardConfig {
  businessName: string;
  businessType: string;
  title: string;
  welcomeMessage: string;
  primaryFocus: string;
  kpiCards: KPICardConfig[];
  sections: DashboardSectionConfig[];
  sidebarModules: SidebarModuleConfig[];
  growthScore: {
    overallScore: number;
    categories: GrowthScoreCategory[];
  };
  growthMissions: GrowthMission[];
}
