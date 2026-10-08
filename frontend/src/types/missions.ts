export type MissionCategory = 'Revenue' | 'Customers' | 'Marketing' | 'Inventory' | 'Profitability' | 'Operations';

export type MissionPriority = 'High' | 'Medium' | 'Low';

export type MissionStatus = 'Recommended' | 'Not Started' | 'In Progress' | 'Completed' | 'Paused';

export type MissionDifficulty = 'Easy' | 'Medium' | 'Hard';

export type MissionResultRating = 'Improved' | 'No Significant Change' | 'Declined' | 'Unknown';

export interface MissionChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface MissionResultData {
  beforeValue?: string;
  afterValue?: string;
  resultRating?: MissionResultRating;
  userNotes?: string;
  completedDate?: string;
  impactSummary?: string;
}

export interface MissionInsight {
  problem: string;
  evidence: string;
  reasoning: string;
  action: string;
  expectedImpact: string;
  confidence: 'High' | 'Medium' | 'Low';
}

export interface Mission {
  id: string;
  title: string;
  category: MissionCategory;
  priority: MissionPriority;
  status: MissionStatus;
  isFeatured?: boolean;
  problem: string;
  evidence: string;
  whyItMatters: string;
  aiReasoning: string;
  recommendedAction: string;
  expectedImpact: string;
  difficulty: MissionDifficulty;
  estimatedTime: string;
  checklist: MissionChecklistItem[];
  resultData?: MissionResultData;
  insight: MissionInsight;
  sourceOpportunityId?: string;
  createdAt: string;
}

export type MissionFilterType = 
  | 'All' 
  | 'High Priority' 
  | 'In Progress' 
  | 'Completed' 
  | 'Revenue' 
  | 'Customers' 
  | 'Marketing' 
  | 'Inventory' 
  | 'Profitability';
