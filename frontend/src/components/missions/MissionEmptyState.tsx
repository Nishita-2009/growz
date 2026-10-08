import React from 'react';
import { Target, Sparkles } from 'lucide-react';

interface MissionEmptyStateProps {
  onExploreOpportunities: () => void;
}

export const MissionEmptyState: React.FC<MissionEmptyStateProps> = ({ onExploreOpportunities }) => {
  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-12 shadow-2xl text-center space-y-6 backdrop-blur-xl max-w-2xl mx-auto my-8">
      <div className="inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-slate-950 border border-slate-800 text-emerald-400 mx-auto shadow-inner">
        <Target className="h-10 w-10 text-emerald-400 stroke-[1.8]" />
      </div>

      <div className="space-y-2">
        <h2 className="text-2xl font-extrabold text-white tracking-tight">
          No growth missions yet.
        </h2>
        <p className="text-slate-400 text-sm max-w-md mx-auto leading-relaxed">
          When Growz identifies an important business opportunity, it will turn it into an actionable mission here.
        </p>
      </div>

      <div className="pt-2 flex items-center justify-center gap-3">
        <button
          onClick={onExploreOpportunities}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 hover:brightness-110 active:scale-95 transition-all flex items-center space-x-2"
        >
          <Sparkles className="h-4 w-4" />
          <span>Explore Opportunities</span>
        </button>
      </div>
    </div>
  );
};
