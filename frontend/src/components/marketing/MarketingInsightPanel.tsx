import React from 'react';
import { MarketingInsight } from '../../types/marketing';
import { Sparkles, Lightbulb } from 'lucide-react';

interface MarketingInsightPanelProps {
  insights: MarketingInsight[];
}

export const MarketingInsightPanel: React.FC<MarketingInsightPanelProps> = ({ insights }) => {
  return (
    <div className="bg-gradient-to-br from-slate-900/90 via-slate-900/60 to-emerald-950/20 border border-emerald-500/30 rounded-2xl p-6 backdrop-blur-sm space-y-6 relative overflow-hidden">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-base font-extrabold text-white tracking-tight">Marketing Intelligence</h3>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 uppercase tracking-wider">
                DEMO INSIGHTS
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              AI-synthesized channel findings, ROI impact analysis, and tactical recommendations.
            </p>
          </div>
        </div>
      </div>

      {/* Structured Insights List */}
      <div className="space-y-6">
        {insights.map((item) => (
          <div 
            key={item.id}
            className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-5 space-y-4 relative"
          >
            {/* Channel Tag */}
            <div className="inline-block px-2.5 py-0.5 rounded-md text-[10px] font-extrabold bg-slate-900 text-emerald-400 border border-emerald-500/30 uppercase tracking-wider">
              {item.channelTag}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* WHAT WE FOUND */}
              <div className="bg-slate-900/60 border border-slate-800/60 rounded-lg p-3.5 space-y-1">
                <span className="text-[10px] font-black text-sky-400 uppercase tracking-wider block">
                  WHAT WE FOUND
                </span>
                <p className="text-xs text-slate-200 leading-relaxed">
                  "{item.whatWeFound}"
                </p>
              </div>

              {/* WHY IT MATTERS */}
              <div className="bg-slate-900/60 border border-slate-800/60 rounded-lg p-3.5 space-y-1">
                <span className="text-[10px] font-black text-purple-400 uppercase tracking-wider block">
                  WHY IT MATTERS
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {item.whyItMatters}
                </p>
              </div>

              {/* WHAT TO DO */}
              <div className="bg-emerald-950/30 border border-emerald-500/30 rounded-lg p-3.5 space-y-1">
                <span className="text-[10px] font-black text-emerald-400 uppercase tracking-wider block">
                  WHAT TO DO
                </span>
                <p className="text-xs text-emerald-200 font-medium leading-relaxed">
                  {item.whatToDo}
                </p>
              </div>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
