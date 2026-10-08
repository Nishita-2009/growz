import React from 'react';
import { MarketingOpportunityItem, DifficultyLevel } from '../../types/marketing';
import { Target, Zap, ShieldCheck } from 'lucide-react';

interface MarketingOpportunityProps {
  opportunities: MarketingOpportunityItem[];
}

export const MarketingOpportunity: React.FC<MarketingOpportunityProps> = ({ opportunities }) => {
  const getDifficultyBadge = (difficulty: DifficultyLevel) => {
    switch (difficulty) {
      case 'Low':
        return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
      case 'Medium':
        return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
      case 'High':
        return 'bg-rose-500/15 text-rose-400 border-rose-500/30';
    }
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div>
          <div className="flex items-center space-x-2">
            <Target className="w-4 h-4 text-emerald-400" />
            <h3 className="text-base font-extrabold text-white tracking-tight">Marketing Growth Opportunities</h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Prioritized tactical improvements to increase lead flow and reduce customer acquisition costs.
          </p>
        </div>

        <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 self-start sm:self-auto">
          {opportunities.length} High-Value Tactics
        </span>
      </div>

      {/* Grid of Opportunity Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {opportunities.map((opp) => (
          <div 
            key={opp.id}
            className="bg-slate-950/70 border border-slate-800 rounded-xl p-5 space-y-4 hover:border-slate-700 transition-colors flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-slate-900 text-slate-400 border border-slate-800 uppercase">
                    {opp.category}
                  </span>
                  <h4 className="text-sm font-extrabold text-slate-100">{opp.title}</h4>
                </div>

                <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold border shrink-0 ${getDifficultyBadge(opp.difficulty)}`}>
                  {opp.difficulty} Effort
                </span>
              </div>

              {/* Evidence */}
              <div className="bg-slate-900/60 border border-slate-800/60 rounded-lg p-3 text-xs text-slate-300">
                <strong className="text-slate-400 text-[10px] uppercase block mb-0.5">Evidence</strong>
                <p className="leading-snug">{opp.evidence}</p>
              </div>

              {/* Recommended Action */}
              <div className="text-xs text-slate-200">
                <strong className="text-emerald-400 text-[10px] uppercase block mb-0.5">Recommended Action</strong>
                <p className="leading-relaxed">{opp.recommendedAction}</p>
              </div>
            </div>

            {/* Expected Impact (Explicitly estimated / not guaranteed) */}
            <div className="pt-3 border-t border-slate-800/80 bg-emerald-950/30 border border-emerald-500/30 rounded-lg p-3 flex items-start space-x-2">
              <Zap className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] font-extrabold text-emerald-300 uppercase block">Projected Impact</span>
                <p className="text-xs font-semibold text-emerald-200 leading-snug">{opp.expectedImpact}</p>
                <span className="text-[10px] text-emerald-400/70 italic block mt-0.5">*Estimates based on benchmark models.</span>
              </div>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};
