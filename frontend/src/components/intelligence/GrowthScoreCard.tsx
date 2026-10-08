import React, { useState } from 'react';
import { GrowthScoreResult, GrowthCategoryResult } from '../../types/intelligence';
import { GrowthScoreCategoryModal } from './GrowthScoreCategoryModal';
import { Zap, Sparkles, AlertCircle, ChevronRight, Info } from 'lucide-react';

interface GrowthScoreCardProps {
  growthScore: GrowthScoreResult;
}

export const GrowthScoreCard: React.FC<GrowthScoreCardProps> = ({ growthScore }) => {
  const [selectedCategory, setSelectedCategory] = useState<GrowthCategoryResult | null>(null);

  const getScoreColor = (score: number | null) => {
    if (score === null) return 'text-slate-500';
    if (score >= 80) return 'text-emerald-400';
    if (score >= 70) return 'text-teal-400';
    if (score >= 60) return 'text-amber-400';
    return 'text-rose-400';
  };

  const getBarGradient = (score: number | null) => {
    if (score === null) return 'bg-slate-800';
    if (score >= 80) return 'bg-gradient-to-r from-emerald-500 to-teal-400';
    if (score >= 70) return 'bg-teal-400';
    if (score >= 60) return 'bg-amber-400';
    return 'bg-rose-500';
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6 backdrop-blur-xl">
      {/* Header & Overall Score Ring */}
      <div className="flex flex-wrap items-center justify-between gap-6 border-b border-slate-800/80 pb-6">
        <div className="space-y-1 max-w-lg">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-extrabold uppercase tracking-wider bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full flex items-center gap-1.5">
              <Zap className="h-3.5 w-3.5" />
              <span>Growz Intelligence Engine</span>
            </span>
            <span className="text-[11px] font-bold text-slate-400 bg-slate-950 px-2.5 py-1 rounded-full border border-slate-800">
              Data Audit: {growthScore.dataCompleteness}% Complete
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight pt-1">
            Growth Score
          </h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            Multi-dimensional audit evaluating core drivers of your business model.
          </p>
        </div>

        {/* Big Overall Score Visual Indicator */}
        <div className="bg-slate-950 border border-slate-800/90 rounded-3xl p-5 sm:px-8 flex items-center gap-5 shadow-2xl">
          <div className="relative h-20 w-20 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 shadow-lg shadow-emerald-500/20 flex items-center justify-center">
            <div className="h-full w-full bg-slate-950 rounded-[14px] flex flex-col items-center justify-center">
              <span className="text-3xl font-black text-white leading-none">
                {growthScore.overallScore}
              </span>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">/ 100</span>
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Overall Health</div>
            <div className="text-base font-extrabold text-white">
              {growthScore.overallScore >= 80
                ? 'Excellent Growth'
                : growthScore.overallScore >= 70
                ? 'Strong Health'
                : 'Needs Optimization'}
            </div>
            <div className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
              <Sparkles className="h-3 w-3" />
              <span>{growthScore.categories.filter((c) => c.score !== null).length} Categories Audited</span>
            </div>
          </div>
        </div>
      </div>

      {/* Category Scores List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
          <span>Category Breakdown</span>
          <span>Click any category to inspect positive signals & recommendations</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {growthScore.categories.map((cat, idx) => {
            const isInsufficient = cat.score === null || cat.status === 'Insufficient Data';

            return (
              <button
                key={idx}
                onClick={() => setSelectedCategory(cat)}
                className="w-full bg-slate-950/70 border border-slate-800/80 hover:border-emerald-500/40 rounded-2xl p-4 transition-all duration-300 text-left space-y-2.5 group hover:bg-slate-950"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-white group-hover:text-emerald-400 transition-colors">
                    {cat.name}
                  </span>
                  
                  {isInsufficient ? (
                    <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      <span>Insufficient Data</span>
                    </span>
                  ) : (
                    <span className={`text-sm font-black ${getScoreColor(cat.score)}`}>
                      {cat.score} <span className="text-[10px] text-slate-500 font-normal">/ 100</span>
                    </span>
                  )}
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${getBarGradient(cat.score)}`}
                    style={{ width: `${cat.score ?? 0}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span className="truncate max-w-[85%] font-medium">
                    {isInsufficient ? 'Connect more business data' : cat.explanation}
                  </span>
                  <ChevronRight className="h-3.5 w-3.5 text-slate-500 group-hover:text-emerald-400 shrink-0 transform group-hover:translate-x-0.5 transition-transform" />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Category Detail Modal */}
      <GrowthScoreCategoryModal
        category={selectedCategory}
        isOpen={Boolean(selectedCategory)}
        onClose={() => setSelectedCategory(null)}
      />
    </div>
  );
};
