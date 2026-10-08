export type MarketingTimePeriod = 'This Month' | 'Last Month' | 'Last 3 Months' | 'Last 6 Months';

export type MarketingTrendPeriod = '7 Days' | '30 Days' | '90 Days';

export type ChannelComparisonMetric = 'Leads' | 'Customers' | 'Conversion Rate' | 'Marketing Spend' | 'ROI';

export type DigitalPresenceStatus = 'Connected' | 'Not Connected' | 'Needs Attention';

export type CampaignStatus = 'Active' | 'Completed' | 'Needs Attention';

export type DifficultyLevel = 'Low' | 'Medium' | 'High';

export interface MarketingKpi {
  id: string;
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  indicator: string;
  iconName: string;
}

export interface MarketingHealthFactor {
  name: string;
  score: number;
  maxScore: number;
  description: string;
  status: 'good' | 'warning' | 'critical';
}

export interface MarketingHealthScore {
  overallScore: number;
  statusText: string;
  explanation: string;
  factors: MarketingHealthFactor[];
}

export interface ChannelPerformanceItem {
  id: string;
  name: string;
  iconName: string;
  reach: number;
  engagement: number;
  leads: number;
  customers: number;
  conversionRate: number; // percentage
  spend?: number;
  roi?: number; // ratio multiplier e.g. 3.4x
  color: string;
}

export interface FunnelStage {
  id: string;
  name: string;
  count: number;
  conversionFromPrevious: number; // percentage e.g. 15.4%
  isDropoffBottleneck?: boolean;
  dropoffReason?: string;
}

export interface MarketingTrendDataPoint {
  date: string;
  leads: number;
  customers: number;
  spend: number;
}

export interface MarketingInsight {
  id: string;
  whatWeFound: string;
  whyItMatters: string;
  whatToDo: string;
  channelTag: string;
}

export interface MarketingOpportunityItem {
  id: string;
  title: string;
  evidence: string;
  recommendedAction: string;
  expectedImpact: string; // explicitly non-guaranteed
  difficulty: DifficultyLevel;
  category: string;
}

export interface DigitalPresenceChannel {
  id: string;
  name: string;
  iconName: string;
  status: DigitalPresenceStatus;
  handleOrUrl?: string;
  lastSynced?: string;
  detail: string;
}

export interface CampaignItem {
  id: string;
  name: string;
  channel: string;
  spend: number;
  leads: number;
  customers: number;
  conversionRate: number;
  roi: number;
  status: CampaignStatus;
}
