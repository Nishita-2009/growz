export type GrowthScoreCategoryName = 
  | 'Revenue Growth'
  | 'Profitability'
  | 'Customer Growth'
  | 'Customer Retention'
  | 'Marketing'
  | 'Inventory'
  | 'Operations'
  | 'Cash Flow';

export type CategoryStatus = 
  | 'Excellent'
  | 'Healthy'
  | 'Needs Attention'
  | 'Critical'
  | 'Insufficient Data';

export interface GrowthCategoryResult {
  name: GrowthScoreCategoryName;
  score: number | null; // null when Insufficient Data
  status: CategoryStatus;
  explanation: string;
  availableData: string[];
  missingData: string[];
  positiveSignals: string[];
  negativeSignals: string[];
  recommendedAction: string;
}

export interface GrowthScoreResult {
  overallScore: number;
  categories: GrowthCategoryResult[];
  strengths: GrowthCategoryResult[];
  weaknesses: GrowthCategoryResult[];
  dataCompleteness: number; // Percentage 0 - 100
}

export type OpportunityCategory = 
  | 'Revenue'
  | 'Customers'
  | 'Marketing'
  | 'Inventory'
  | 'Profitability'
  | 'Operations';

export type OpportunityPriority = 'High' | 'Medium' | 'Low';

export interface Opportunity {
  id: string;
  title: string;
  category: OpportunityCategory;
  priority: OpportunityPriority;
  problem: string;
  evidence: string;
  reasoning: string;
  whyItMatters: string;
  recommendedAction: string;
  expectedImpact: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  confidence: 'High' | 'Medium' | 'Low';
  relatedModule: string; // Route link, e.g., '/app/customers'
  createdAt?: string;
}

export type OpportunityFilterType = 
  | 'All'
  | 'High Priority'
  | 'Revenue'
  | 'Customers'
  | 'Marketing'
  | 'Inventory'
  | 'Profitability'
  | 'Operations';
