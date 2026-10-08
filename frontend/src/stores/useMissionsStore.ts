import { create } from 'zustand';
import { 
  Mission, 
  MissionStatus, 
  MissionResultData, 
  MissionFilterType,
  MissionCategory,
  MissionPriority
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
    action: string
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

  turnOpportunityIntoMission: (title, category, priority, problem, action) => {
    const newMissionId = `mission-${Date.now()}`;
    const newMission: Mission = {
      id: newMissionId,
      title,
      category,
      priority,
      status: 'Recommended',
      isFeatured: false,
      problem,
      evidence: `Identified by Growz Opportunity Detector based on recent business metrics.`,
      whyItMatters: `Addressing this opportunity could yield immediate efficiency improvements for your business.`,
      aiReasoning: `Automated diagnostic pattern matching indicates high impact potential with minimal operational friction.`,
      recommendedAction: action,
      expectedImpact: `Potential positive impact on ${category.toLowerCase()} metrics.`,
      difficulty: 'Medium',
      estimatedTime: '5 days',
      createdAt: new Date().toISOString().split('T')[0],
      checklist: [
        { id: `task-${Date.now()}-1`, text: 'Define execution parameters & goals', completed: false },
        { id: `task-${Date.now()}-2`, text: 'Assign resources or schedule tasks', completed: false },
        { id: `task-${Date.now()}-3`, text: 'Execute recommended action', completed: false },
        { id: `task-${Date.now()}-4`, text: 'Review performance & record impact', completed: false }
      ],
      insight: {
        problem,
        evidence: `Fact: Identified via automated Opportunity Detector rule evaluation.`,
        reasoning: `Recommendation: Executing structured steps yields predictable growth outcomes.`,
        action,
        expectedImpact: `Estimated positive lift in key revenue driver.`,
        confidence: 'High'
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
