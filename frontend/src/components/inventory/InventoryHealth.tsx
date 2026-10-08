import React from 'react';
import { InventoryHealthScore } from '../../types/inventory';
import { ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';

interface InventoryHealthProps {
  health: InventoryHealthScore;
}

export const InventoryHealth: React.FC<InventoryHealthProps> = ({ health }) => {
  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6 backdrop-blur-xl">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">
              Inventory Health Index: <span className="text-emerald-400 font-extrabold">{health.score} / 100</span>
            </h3>
            <p className="text-xs text-slate-400">Audited across turnover rate, stock availability & reorder risk</p>
          </div>
        </div>

        <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
          DEMO AUDIT MODE
        </span>
      </div>

      {/* Breakdown Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1.5">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Stock Availability</span>
          <div className="flex items-center justify-between">
            <span className="text-lg font-extrabold text-white">{health.availabilityScore}%</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="w-full bg-slate-800 rounded-full h-1.5 mt-1">
            <div className="bg-emerald-400 h-1.5 rounded-full" style={{ width: `${health.availabilityScore}%` }} />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1.5">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Inventory Turnover</span>
          <div className="flex items-center justify-between">
            <span className="text-lg font-extrabold text-white">{health.turnoverScore}%</span>
            <CheckCircle2 className="h-4 w-4 text-teal-400" />
          </div>
          <div className="w-full bg-slate-800 rounded-full h-1.5 mt-1">
            <div className="bg-teal-400 h-1.5 rounded-full" style={{ width: `${health.turnoverScore}%` }} />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1.5">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Dead Stock Safety</span>
          <div className="flex items-center justify-between">
            <span className="text-lg font-extrabold text-white">{health.deadStockRiskScore}%</span>
            <AlertCircle className="h-4 w-4 text-amber-400" />
          </div>
          <div className="w-full bg-slate-800 rounded-full h-1.5 mt-1">
            <div className="bg-amber-400 h-1.5 rounded-full" style={{ width: `${health.deadStockRiskScore}%` }} />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1.5">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Reorder Risk Index</span>
          <div className="flex items-center justify-between">
            <span className="text-lg font-extrabold text-white">{health.reorderRiskScore}%</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="w-full bg-slate-800 rounded-full h-1.5 mt-1">
            <div className="bg-emerald-400 h-1.5 rounded-full" style={{ width: `${health.reorderRiskScore}%` }} />
          </div>
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 text-xs text-slate-300 leading-relaxed">
        <span className="font-bold text-emerald-400 mr-1">Audit Score Reason:</span>
        {health.explanation}
      </div>
    </div>
  );
};
