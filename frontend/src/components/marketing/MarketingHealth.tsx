import React from 'react';
import { MarketingHealthScore } from '../../types/marketing';
import { Activity, Info } from 'lucide-react';

interface MarketingHealthProps {
  health: MarketingHealthScore;
}

export const MarketingHealth: React.FC<MarketingHealthProps> = ({ health }) => {
  return (
    <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-sm relative overflow-hidden">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-800/80">
        
        {/* Score Ring & Header */}
        <div className="flex items-center space-x-5">
          <div className="relative flex items-center justify-center shrink-0">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-emerald-500/20 to-teal-500/10 border-2 border-emerald-500/40 flex items-center justify-center shadow-lg shadow-emerald-500/10">
              <div className="text-center">
                <span className="text-2xl font-black text-white leading-none block">{health.overallScore}</span>
                <span className="text-[10px] font-bold text-slate-400">/ 100</span>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              <h3 className="text-lg font-extrabold text-white tracking-tight">Marketing Health</h3>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                {health.statusText}
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-400 max-w-xl leading-relaxed">
              {health.explanation}
            </p>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 text-xs text-slate-400 max-w-sm flex items-start space-x-2 shrink-0">
          <Info className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
          <p className="text-[11px] leading-tight">
            Marketing health measures multi-channel reach, lead conversion speed, campaign ROI efficiency, and brand presence consistency.
          </p>
        </div>
      </div>

      {/* Factors Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mt-6">
        {health.factors.map((factor, index) => {
          const percent = Math.round((factor.score / factor.maxScore) * 100);
          return (
            <div key={index} className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-200">{factor.name}</span>
                  <span className="text-xs font-mono font-bold text-emerald-400">{factor.score}/{factor.maxScore}</span>
                </div>
                
                {/* Progress bar */}
                <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-emerald-500 to-teal-400 h-1.5 rounded-full transition-all duration-500" 
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>

              <p className="text-[11px] text-slate-400 leading-snug">
                {factor.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
