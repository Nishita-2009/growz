import React from 'react';
import { MissionFilterType } from '../../types/missions';
import { Search, PlusCircle, RotateCcw } from 'lucide-react';

interface MissionFiltersProps {
  selectedFilter: MissionFilterType;
  searchQuery: string;
  onFilterChange: (filter: MissionFilterType) => void;
  onSearchChange: (query: string) => void;
  onOpenOpportunityModal: () => void;
  onResetDemoData: () => void;
}

const FILTER_OPTIONS: MissionFilterType[] = [
  'All',
  'High Priority',
  'In Progress',
  'Completed',
  'Revenue',
  'Customers',
  'Marketing',
  'Inventory',
  'Profitability',
];

export const MissionFilters: React.FC<MissionFiltersProps> = ({
  selectedFilter,
  searchQuery,
  onFilterChange,
  onSearchChange,
  onOpenOpportunityModal,
  onResetDemoData,
}) => {
  return (
    <div className="bg-gradient-to-r from-slate-900/90 via-slate-900/80 to-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl space-y-6">
      
      {/* Header section */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-extrabold uppercase tracking-wider bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full">
              Growth Execution Engine
            </span>
            <span className="text-[11px] font-extrabold uppercase tracking-wider bg-amber-500/10 border border-amber-500/20 text-amber-400 px-3 py-1 rounded-full">
              DEMO MODE
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight pt-1">
            Growth Missions
          </h1>
          <p className="text-slate-400 text-sm max-w-2xl leading-relaxed">
            Turn business insights into actions that move your business forward.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenOpportunityModal}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 hover:brightness-110 active:scale-95 transition-all flex items-center space-x-2"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Turn Opportunity into Mission</span>
          </button>

          <button
            onClick={onResetDemoData}
            title="Reset to original demo missions"
            className="px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-white text-xs font-semibold transition-all flex items-center gap-1.5"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Reset Demo Data</span>
          </button>
        </div>
      </div>

      {/* Search and Filters row */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 pt-2 border-t border-slate-800/80">
        {/* Search input */}
        <div className="relative min-w-[260px] md:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search missions..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar">
          {FILTER_OPTIONS.map((filter) => (
            <button
              key={filter}
              onClick={() => onFilterChange(filter)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 ${
                selectedFilter === filter
                  ? 'bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 shadow-sm shadow-emerald-500/10'
                  : 'bg-slate-950/70 border border-slate-800/80 text-slate-400 hover:border-slate-700 hover:text-slate-200'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
