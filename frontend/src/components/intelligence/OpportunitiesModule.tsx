import React, { useState } from 'react';
import { useIntelligence } from '../../hooks/useIntelligence';
import { useMissionsStore } from '../../stores/useMissionsStore';
import { OpportunityCard } from './OpportunityCard';
import { OpportunityFilterType } from '../../types/intelligence';
import { OpportunityItem } from '../../services/intelligenceService';
import { AnalyticsLoading, AnalyticsError } from '../analytics/AnalyticsStates';
import { 
  Sparkles, 
  Search, 
  ShieldCheck, 
  X, 
  PlusCircle, 
  ArrowRight, 
  Database, 
  HelpCircle,
  ExternalLink,
  Flame,
  AlertTriangle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FILTER_OPTIONS: OpportunityFilterType[] = [
  'All',
  'High Priority',
  'Revenue',
  'Customers',
  'Marketing',
  'Inventory',
  'Profitability',
  'Operations',
];

export const OpportunitiesModule: React.FC = () => {
  const navigate = useNavigate();
  const { intelligence, loading, error, refetch } = useIntelligence();
  const turnOpportunityIntoMission = useMissionsStore((state) => state.turnOpportunityIntoMission);

  const [selectedFilter, setSelectedFilter] = useState<OpportunityFilterType>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOpportunity, setSelectedOpportunity] = useState<any | null>(null);

  if (loading) {
    return (
      <div className="p-6 sm:p-8 max-w-7xl mx-auto font-sans">
        <AnalyticsLoading message="Running Growth Opportunity Diagnostics..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 sm:p-8 max-w-7xl mx-auto font-sans">
        <AnalyticsError message={error} onRetry={refetch} />
      </div>
    );
  }

  const rawOpportunities = intelligence?.opportunities || [];

  // Adapt backend OpportunityItem shape to UI expected shape if needed
  const opportunities = rawOpportunities.map((opp) => ({
    id: opp.id,
    title: opp.title,
    category: opp.category as any,
    priority: (opp.priority.charAt(0).toUpperCase() + opp.priority.slice(1)) as any,
    problem: opp.problem,
    evidence: opp.evidence,
    recommendedAction: opp.recommended_action,
    expectedImpact: opp.expected_impact,
    difficulty: (opp.difficulty.charAt(0).toUpperCase() + opp.difficulty.slice(1)) as any,
    confidence: `${Math.round(opp.confidence * 100)}%`,
    relatedModule: opp.related_module as any
  }));

  // Filter Logic
  const filteredOpportunities = opportunities.filter((opp) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchesTitle = opp.title.toLowerCase().includes(q);
      const matchesProblem = opp.problem.toLowerCase().includes(q);
      const matchesCategory = opp.category.toLowerCase().includes(q);
      if (!matchesTitle && !matchesProblem && !matchesCategory) return false;
    }

    if (selectedFilter === 'All') return true;
    if (selectedFilter === 'High Priority') return opp.priority === 'High' || opp.priority === 'Critical';

    return opp.category === selectedFilter;
  });

  const handleTurnIntoMission = (opp: any) => {
    const createdMission = turnOpportunityIntoMission(
      opp.title,
      opp.category,
      opp.priority,
      opp.problem,
      opp.recommendedAction,
      opp.evidence,
      opp.expectedImpact,
      opp.difficulty,
      opp.confidence,
      opp.id
    );
    setSelectedOpportunity(null);
    navigate(`/app/missions/${createdMission.id}`);
  };

  return (
    <div className="p-6 sm:p-8 space-y-8 max-w-7xl mx-auto font-sans">
      
      {/* 1. Header & Controls */}
      <div className="bg-gradient-to-r from-slate-900/90 via-slate-900/80 to-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-extrabold uppercase tracking-wider bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Opportunity Detector</span>
              </span>
              <span className="text-[11px] font-extrabold uppercase tracking-wider bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full">
                POSTGRESQL REAL INTEL
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight pt-1">
              Business Growth Opportunities
            </h1>
            <p className="text-slate-400 text-sm max-w-2xl leading-relaxed">
              Automated diagnostics identifying high-margin growth levers from your business signals.
            </p>
          </div>

          <div className="bg-slate-950 border border-slate-800/80 px-4 py-2.5 rounded-2xl flex items-center gap-3">
            <div className="h-3 w-3 rounded-full bg-emerald-400 animate-pulse" />
            <div>
              <div className="text-[10px] font-bold text-slate-500 uppercase">Detection Engine</div>
              <div className="text-xs font-extrabold text-white">{opportunities.length} Levers Identified</div>
            </div>

          </div>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 pt-2 border-t border-slate-800/80">
          <div className="relative min-w-[260px] md:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search opportunities..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 transition-all"
            />
          </div>

          <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar">
            {FILTER_OPTIONS.map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
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

      {/* 2. Opportunities Grid or Empty State */}
      {filteredOpportunities.length === 0 ? (
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-12 shadow-2xl text-center space-y-4 backdrop-blur-xl max-w-2xl mx-auto my-8">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-950 border border-slate-800 text-amber-400 mx-auto shadow-inner">
            <Database className="h-8 w-8 text-amber-400 stroke-[1.8]" />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-extrabold text-white tracking-tight">
              Growz needs more data to discover opportunities.
            </h2>
            <p className="text-slate-400 text-xs max-w-md mx-auto leading-relaxed">
              No opportunities matched your active filter or search query. Connect additional data streams to allow Growz to discover high-priority growth opportunities.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-[11px] text-slate-300 max-w-md mx-auto text-left space-y-1">
            <span className="font-bold text-emerald-400 block">How to unlock more opportunities:</span>
            <p className="text-slate-400 leading-relaxed">
              • Connect sales data to identify revenue opportunities.<br />
              • Sync inventory stock ledger to prevent stockouts.<br />
              • Input monthly operational expenses to audit profit margins.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOpportunities.map((opp) => (
            <OpportunityCard
              key={opp.id}
              opportunity={opp}
              onOpportunityClick={(selected) => setSelectedOpportunity(selected)}
            />
          ))}
        </div>
      )}

      {/* 3. Detailed Opportunity Modal */}
      {selectedOpportunity && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl space-y-6 relative max-h-[90vh] overflow-y-auto custom-scrollbar">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                    selectedOpportunity.priority === 'High'
                      ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                      : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                  }`}>
                    {selectedOpportunity.priority} PRIORITY
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 bg-slate-950 px-2.5 py-0.5 rounded-full border border-slate-800">
                    {selectedOpportunity.category}
                  </span>
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <ShieldCheck className="h-3 w-3" />
                    <span>{selectedOpportunity.confidence} Confidence</span>
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight pt-1">
                  {selectedOpportunity.title}
                </h3>
              </div>

              <button
                onClick={() => setSelectedOpportunity(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors shrink-0"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Diagnostic Breakdown */}
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1">
                <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider block">Problem</span>
                <p className="text-xs text-slate-200 leading-relaxed font-medium">{selectedOpportunity.problem}</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1">
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block flex items-center gap-1">
                  <AlertTriangle className="h-3.5 w-3.5" /> Evidence
                </span>
                <p className="text-xs text-slate-200 leading-relaxed font-medium">"{selectedOpportunity.evidence}"</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1">
                <span className="text-[10px] font-bold text-teal-400 uppercase tracking-wider block flex items-center gap-1">
                  <HelpCircle className="h-3.5 w-3.5" /> Why it matters
                </span>
                <p className="text-xs text-slate-200 leading-relaxed font-medium">{selectedOpportunity.whyItMatters}</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1">
                <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider block">AI Reasoning</span>
                <p className="text-xs text-slate-200 leading-relaxed font-medium">{selectedOpportunity.reasoning}</p>
              </div>

              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/50 to-slate-950 border border-emerald-500/30 space-y-2">
                <span className="text-[10px] font-extrabold text-emerald-400 uppercase tracking-wider block">Recommended Action</span>
                <p className="text-xs text-slate-100 font-semibold leading-relaxed">{selectedOpportunity.recommendedAction}</p>
                <div className="text-[11px] text-emerald-400 font-medium pt-1">
                  Expected Impact: {selectedOpportunity.expectedImpact}
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <button
                onClick={() => navigate(selectedOpportunity.relatedModule)}
                className="text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors"
              >
                <span>Inspect in {selectedOpportunity.category} Module</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </button>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSelectedOpportunity(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-slate-950 border border-slate-800"
                >
                  Close
                </button>

                <button
                  onClick={() => handleTurnIntoMission(selectedOpportunity)}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 hover:brightness-110 active:scale-95 transition-all flex items-center space-x-2"
                >
                  <PlusCircle className="h-4 w-4" />
                  <span>Turn into Mission</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
