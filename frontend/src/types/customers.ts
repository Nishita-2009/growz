export type CustomerSegment = 
  | 'All Customers'
  | 'New'
  | 'Returning'
  | 'High Value'
  | 'At Risk'
  | 'Inactive';

export type CustomerStatus = 'Active' | 'Loyal' | 'At Risk' | 'Inactive';

export type RiskLevel = 'High' | 'Medium' | 'Low';

export type SuggestedAction = 
  | 'Send Reminder'
  | 'Offer Personalized Promotion'
  | 'Check Customer Experience'
  | 'Re-engage';

export interface CustomerListItem {
  id: string;
  name: string;
  email: string;
  phone?: string;
  location: string;
  orders: number;
  totalSpent: number;
  lastPurchase: string; // e.g. "2 days ago" or "2026-10-02"
  avgOrderValue: number;
  segment: 'New' | 'Returning' | 'Loyal' | 'High Value' | 'At Risk' | 'Inactive';
  status: CustomerStatus;
  avatarColor?: string;
}

export interface CustomerKpi {
  id: string;
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  indicator: string;
  iconName: string;
}

export interface CustomerHealthFactor {
  name: string;
  score: number;
  maxScore: number;
  description: string;
  status: 'good' | 'warning' | 'critical';
}

export interface CustomerHealthScore {
  overallScore: number;
  statusText: string;
  explanation: string;
  factors: CustomerHealthFactor[];
}

export interface CustomerSegmentItem {
  id: string;
  name: CustomerSegment;
  count: number;
  percentage: number;
  avgValue: number;
  color: string;
  description: string;
}

export interface RevenueDriverItem {
  id: string;
  name: string;
  type: 'Customer' | 'Segment';
  orders: number;
  totalRevenue: number;
  avgOrderValue: number;
  lastPurchase: string;
  sharePercentage: number;
}

export interface RetentionDataPoint {
  month: string;
  repeatRate: number;
  firstTime: number;
  returning: number;
}

export interface AtRiskCustomerItem {
  id: string;
  customerName: string;
  email: string;
  lastPurchase: string;
  daysSinceLastPurchase: number;
  previousFrequency: string;
  riskLevel: RiskLevel;
  suggestedAction: SuggestedAction;
  estimatedLostRevenue: number;
}

export interface CustomerInsight {
  id: string;
  whatWeFound: string;
  whyItMatters: string;
  whatToDo: string;
  category: 'Retention' | 'Value' | 'Engagement';
}

export interface CustomerOpportunity {
  id: string;
  title: string;
  potentialOpportunity: string;
  targetAudience: string;
  recommendedAction: string;
  expectedImpact: string; // explicitly marked as estimated
}
