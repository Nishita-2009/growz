import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useMissionsStore } from '../../stores/useMissionsStore';
import { MissionFilters } from './MissionFilters';
import { MissionKpiCard } from './MissionKpiCard';
import { FeaturedMission } from './FeaturedMission';
import { MissionCard } from './MissionCard';
import { MissionHistory } from './MissionHistory';
import { MissionEmptyState } from './MissionEmptyState';
import { MissionDetail } from './MissionDetail';
import { TurnOpportunityModal } from './TurnOpportunityModal';
import { MissionFilterType } from '../../types/missions';

export const MissionsListView: React.FC = () => {
  const {
    missions,
    selectedFilter,
    searchQuery,
    setSelectedFilter,
    setSearchQuery,
    updateMissionStatus,
    turnOpportunityIntoMission,
    resetToDemoData,
  } = useMissionsStore();

  const [isOpportunityModalOpen, setIsOpportunityModalOpen] = useState(false);

  // KPI Calculations
  const activeCount = missions.filter((m) => m.status === 'In Progress' || m.status === 'Not Started').length;
  const highPriorityCount = missions.filter(
    (m) => m.priority === 'High' && m.status !== 'Completed'
  ).length;
  const completedMissions = missions.filter((m) => m.status === 'Completed');
  const completedCount = completedMissions.length;

  const improvedCount = completedMissions.filter(
    (m) => m.resultData?.resultRating === 'Improved'
  ).length;
  const successRate = completedCount > 0 ? `${Math.round((improvedCount / completedCount) * 100)}%` : '100%';
  const opportunitiesCount = missions.filter((m) => m.status === 'Recommended').length + 3;

  // Featured Mission Selection
  const featuredMission = missions.find((m) => m.isFeatured && m.status !== 'Completed') || 
    missions.find((m) => m.priority === 'High' && m.status !== 'Completed') ||
    missions[0];

  // Filtering Logic
  const filteredMissions = missions.filter((m) => {
    // 1. Search Query Filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchesTitle = m.title.toLowerCase().includes(q);
      const matchesProblem = m.problem.toLowerCase().includes(q);
      const matchesCategory = m.category.toLowerCase().includes(q);
      if (!matchesTitle && !matchesProblem && !matchesCategory) return false;
    }

    // 2. Filter Tab
    if (selectedFilter === 'All') return true;
    if (selectedFilter === 'High Priority') return m.priority === 'High';
    if (selectedFilter === 'In Progress') return m.status === 'In Progress';
    if (selectedFilter === 'Completed') return m.status === 'Completed';

    // Category Filters
    return m.category === selectedFilter;
  });

  const handleStartMission = (id: string) => {
    updateMissionStatus(id, 'In Progress');
  };

  const handleExploreOpportunities = () => {
    setSelectedFilter('All');
    setSearchQuery('');
    setIsOpportunityModalOpen(true);
  };

  return (
    <div className="p-6 sm:p-8 space-y-8 max-w-7xl mx-auto font-sans">
      {/* 1. Header & Filters */}
      <MissionFilters
        selectedFilter={selectedFilter}
        searchQuery={searchQuery}
        onFilterChange={setSelectedFilter}
        onSearchChange={setSearchQuery}
        onOpenOpportunityModal={() => setIsOpportunityModalOpen(true)}
        onResetDemoData={resetToDemoData}
      />

      {/* 2. Mission Summary KPI Cards */}
      <MissionKpiCard
        activeCount={activeCount}
        highPriorityCount={highPriorityCount}
        completedCount={completedCount}
        successRate={successRate}
        opportunitiesCount={opportunitiesCount}
      />

      {/* 3. Featured Mission Card (only show if viewing 'All' or 'High Priority' and featured exists) */}
      {featuredMission && (selectedFilter === 'All' || selectedFilter === 'High Priority') && !searchQuery && (
        <FeaturedMission
          mission={featuredMission}
          onStartMission={handleStartMission}
        />
      )}

      {/* 4. Missions Grid or Empty State */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-extrabold text-white tracking-tight">
            {selectedFilter} Growth Missions ({filteredMissions.length})
          </h2>
          <span className="text-xs text-slate-400">
            Click any mission card to inspect AI details & checklist
          </span>
        </div>

        {filteredMissions.length === 0 ? (
          <MissionEmptyState onExploreOpportunities={handleExploreOpportunities} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMissions.map((mission) => (
              <MissionCard key={mission.id} mission={mission} />
            ))}
          </div>
        )}
      </div>

      {/* 5. Mission History (Completed Missions Section) */}
      <MissionHistory completedMissions={completedMissions} />

      {/* Opportunity -> Mission Creator Modal */}
      <TurnOpportunityModal
        isOpen={isOpportunityModalOpen}
        onClose={() => setIsOpportunityModalOpen(false)}
        onCreateMission={(title, category, priority, problem, action) => {
          turnOpportunityIntoMission(title, category, priority, problem, action);
        }}
      />
    </div>
  );
};

export const MissionsModule: React.FC = () => {
  return (
    <Routes>
      <Route path="" element={<MissionsListView />} />
      <Route path=":missionId" element={<MissionDetail />} />
    </Routes>
  );
};
