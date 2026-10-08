import { create } from 'zustand';
import { 
  Mission, 
  MissionStatus, 
  MissionResultData, 
  MissionFilterType,
  MissionCategory,
  MissionPriority,
  MissionDifficulty
} from '../types/missions';
import { INITIAL_DEMO_MISSIONS } from '../data/missionsDemoData';

const LOCAL_STORAGE_KEY = 'growz_growth_missions';

function loadMissionsFromStorage(): Mission[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Failed to load missions from localStorage:', err);
  }
  return INITIAL_DEMO_MISSIONS;
}

function saveMissionsToStorage(missions: Mission[]): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(missions));
  } catch (err) {
    console.error('Failed to save missions to localStorage:', err);
  }
}

interface MissionsState {
  missions: Mission[];
  selectedFilter: MissionFilterType;
  searchQuery: string;
  setSelectedFilter: (filter: MissionFilterType) => void;
  setSearchQuery: (query: string) => void;
  updateMissionStatus: (id: string, status: MissionStatus) => void;
  toggleChecklistItem: (missionId: string, itemId: string) => void;
  saveMissionResult: (missionId: string, resultData: MissionResultData) => void;
  turnOpportunityIntoMission: (
    title: string, 
    category: MissionCategory, 
    priority: MissionPriority, 
    problem: string, 
    action: string,
    evidence?: string,
    expectedImpact?: string,
    difficulty?: string,
    confidence?: string,
    sourceOpportunityId?: string
  ) => Mission;
  resetToDemoData: () => void;
}

export const useMissionsStore = create<MissionsState>((set, get) => ({
  missions: loadMissionsFromStorage(),
  selectedFilter: 'All',
  searchQuery: '',

  setSelectedFilter: (filter) => set({ selectedFilter: filter }),
  setSearchQuery: (query) => set({ searchQuery: query }),

  updateMissionStatus: (id, status) => {
    const updated = get().missions.map((m) => {
      if (m.id === id) {
        const completedDate = status === 'Completed' ? (m.resultData?.completedDate || new Date().toISOString().split('T')[0]) : m.resultData?.completedDate;
        return {
          ...m,
          status,
          resultData: {
            ...m.resultData,
            completedDate
          }
        };
      }
      return m;
    });
    saveMissionsToStorage(updated);
    set({ missions: updated });
  },

  toggleChecklistItem: (missionId, itemId) => {
    const updated = get().missions.map((m) => {
      if (m.id === missionId) {
        const newChecklist = m.checklist.map((item) => 
          item.id === itemId ? { ...item, completed: !item.completed } : item
        );
        return { ...m, checklist: newChecklist };
      }
      return m;
    });
    saveMissionsToStorage(updated);
    set({ missions: updated });
  },

  saveMissionResult: (missionId, resultData) => {
    const updated = get().missions.map((m) => {
      if (m.id === missionId) {
        const completedDate = resultData.completedDate || m.resultData?.completedDate || new Date().toISOString().split('T')[0];
        return {
          ...m,
          status: 'Completed' as MissionStatus,
          resultData: {
            ...m.resultData,
            ...resultData,
            completedDate
          }
        };
      }
      return m;
    });
    saveMissionsToStorage(updated);
    set({ missions: updated });
  },

  turnOpportunityIntoMission: (title, category, priority, problem, action, evidence, expectedImpact, difficulty, confidence, sourceOpportunityId) => {
    const existing = get().missions.find((m) => 
      (sourceOpportunityId && m.sourceOpportunityId === sourceOpportunityId) ||
      (m.title === title && m.problem === problem)
    );
    if (existing) {
      return existing;
    }

    const newMissionId = sourceOpportunityId ? `mission-opp-${sourceOpportunityId}` : `mission-${Date.now()}`;
    
    let defaultChecklist = [
      { id: `task-${Date.now()}-1`, text: 'Identify and analyze current metrics', completed: false },
      { id: `task-${Date.now()}-2`, text: 'Formulate targeted action plan', completed: false },
      { id: `task-${Date.now()}-3`, text: 'Execute recommended strategy', completed: false },
      { id: `task-${Date.now()}-4`, text: 'Review performance and record results', completed: false }
    ];

    if (category === 'Customers' || category === 'Customer Retention' as any) {
      defaultChecklist = [
        { id: `task-${Date.now()}-1`, text: 'Identify top repeat-value customers', completed: false },
        { id: `task-${Date.now()}-2`, text: 'Create a retention offer', completed: false },
        { id: `task-${Date.now()}-3`, text: 'Contact selected customers', completed: false },
        { id: `task-${Date.now()}-4`, text: 'Measure repeat purchases', completed: false }
      ];
    } else if (category === 'Revenue') {
      defaultChecklist = [
        { id: `task-${Date.now()}-1`, text: 'Identify declining sales area', completed: false },
        { id: `task-${Date.now()}-2`, text: 'Review top products/customers', completed: false },
        { id: `task-${Date.now()}-3`, text: 'Create a recovery action', completed: false },
        { id: `task-${Date.now()}-4`, text: 'Measure revenue change', completed: false }
      ];
    } else if (category === 'Marketing') {
      defaultChecklist = [
        { id: `task-${Date.now()}-1`, text: 'Identify weak-performing channel', completed: false },
        { id: `task-${Date.now()}-2`, text: 'Review campaign/message', completed: false },
        { id: `task-${Date.now()}-3`, text: 'Adjust campaign', completed: false },
        { id: `task-${Date.now()}-4`, text: 'Measure conversion', completed: false }
      ];
    } else if (category === 'Inventory') {
      defaultChecklist = [
        { id: `task-${Date.now()}-1`, text: 'Identify affected products', completed: false },
        { id: `task-${Date.now()}-2`, text: 'Review recent demand', completed: false },
        { id: `task-${Date.now()}-3`, text: 'Reorder or rebalance stock', completed: false },
        { id: `task-${Date.now()}-4`, text: 'Measure stock availability', completed: false }
      ];
    }

    const newMission: Mission = {
      id: newMissionId,
      sourceOpportunityId: sourceOpportunityId || newMissionId,
      title,
      category,
      priority,
      status: 'Recommended',
      isFeatured: false,
      problem,
      evidence: evidence || `Identified by Growz Opportunity Detector based on recent business metrics.`,
      whyItMatters: `Addressing this opportunity could yield immediate efficiency improvements for your business.`,
      aiReasoning: `Automated diagnostic pattern matching indicates high impact potential with minimal operational friction.`,
      recommendedAction: action,
      expectedImpact: expectedImpact || `Potential positive impact on ${category.toLowerCase()} metrics.`,
      difficulty: (difficulty as MissionDifficulty) || 'Medium',
      estimatedTime: '5 days',
      createdAt: new Date().toISOString().split('T')[0],
      checklist: defaultChecklist,
      insight: {
        problem,
        evidence: evidence || `Fact: Identified via automated Opportunity Detector rule evaluation.`,
        reasoning: `Recommendation: Executing structured steps yields predictable growth outcomes.`,
        action,
        expectedImpact: expectedImpact || `Estimated positive lift in key revenue driver.`,
        confidence: (confidence as any) || 'High'
      }
    };

    const updated = [newMission, ...get().missions];
    saveMissionsToStorage(updated);
    set({ missions: updated });
    return newMission;
  },

  resetToDemoData: () => {
    saveMissionsToStorage(INITIAL_DEMO_MISSIONS);
    set({ missions: INITIAL_DEMO_MISSIONS });
  }
}));
