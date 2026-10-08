import React from 'react';
import { StockRiskItem } from '../../types/inventory';
import { AlertTriangle, PackageX, Layers, ArrowRight } from 'lucide-react';

interface StockRiskCardProps {
  alerts: StockRiskItem[];
}

export const StockRiskCard: React.FC<StockRiskCardProps> = ({ alerts }) => {
  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6 backdrop-blur-xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">Needs Your Attention</h3>
            <p className="text-xs text-slate-400">Stock risks, impending stockouts, and clearance warnings</p>
          </div>
        </div>
        <span className="text-xs font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full">
          {alerts.length} Action Items
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {alerts.map((item) => {
          const isCritical = item.type === 'critical';
          const isLow = item.type === 'low_stock';
          
          return (
            <div
              key={item.id}
              className={`p-5 rounded-2xl border flex flex-col justify-between space-y-4 transition-all ${
                isCritical
                  ? 'bg-rose-500/5 border-rose-500/30 text-rose-200 hover:border-rose-500/50'
                  : isLow
                  ? 'bg-amber-500/5 border-amber-500/30 text-amber-200 hover:border-amber-500/50'
                  : 'bg-indigo-500/5 border-indigo-500/30 text-indigo-200 hover:border-indigo-500/50'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md border ${
                      isCritical
                        ? 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                        : isLow
                        ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                        : 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30'
                    }`}
                  >
                    {item.type.replace('_', ' ')}
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">{item.sku}</span>
                </div>

                <h4 className="text-sm font-bold text-white leading-tight">{item.productName}</h4>
                <p className="text-xs text-slate-300 leading-relaxed">{item.detail}</p>
              </div>

              <div className="pt-3 border-t border-slate-800/80 space-y-2">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Recommended Action</span>
                <p className="text-xs font-medium text-emerald-400 flex items-center gap-1.5">
                  <ArrowRight className="h-3.5 w-3.5 shrink-0" />
                  <span>{item.recommendedAction}</span>
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
