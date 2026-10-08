import React from 'react';
import { InventoryInsight } from '../../types/inventory';
import { Sparkles } from 'lucide-react';

interface InventoryInsightPanelProps {
  insight: InventoryInsight;
}

export const InventoryInsightPanel: React.FC<InventoryInsightPanelProps> = ({ insight }) => {
  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6 backdrop-blur-xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">Inventory Intelligence</h3>
            <p className="text-xs text-slate-400">Automated stockout diagnostics & turnover optimization</p>
          </div>
        </div>
        <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
          AI Audit
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block">WHAT WE FOUND</span>
          <p className="text-xs text-slate-300 leading-relaxed font-medium">
            {insight.whatWeFound}
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-teal-400 block">WHY IT MATTERS</span>
          <p className="text-xs text-slate-300 leading-relaxed font-medium">
            {insight.whyItMatters}
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 block">WHAT TO DO</span>
          <p className="text-xs text-slate-300 leading-relaxed font-medium">
            {insight.whatToDo}
          </p>
        </div>
      </div>
    </div>
  );
};
