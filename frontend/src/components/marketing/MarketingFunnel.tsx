import React from 'react';
import { FunnelStage } from '../../types/marketing';
import { Filter, ArrowDown, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface MarketingFunnelProps {
  stages: FunnelStage[];
}

export const MarketingFunnel: React.FC<MarketingFunnelProps> = ({ stages }) => {
  return (
    <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div>
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-emerald-400" />
            <h3 className="text-base font-extrabold text-white tracking-tight">Marketing Acquisition Funnel</h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Stage-by-stage progression from raw reach to repeat customers. Highlighted bottlenecks reveal conversion gaps.
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-amber-500/10 border border-amber-500/30 px-3 py-1.5 rounded-xl text-xs text-amber-300">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
          <span>Major Drop-off: <strong>Engagement → Leads (97% drop)</strong></span>
        </div>
      </div>

      {/* Visual Funnel Stack */}
      <div className="space-y-3 max-w-3xl mx-auto py-2">
        {stages.map((stage, idx) => {
          const widthPercent = Math.max(25, 100 - idx * 17); // visual narrowing representation
          const isBottleneck = stage.isDropoffBottleneck;

          return (
            <div key={stage.id} className="flex flex-col items-center space-y-1.5">
              
              {/* Connector Arrow & Conversion Pill if not first stage */}
              {idx > 0 && (
                <div className="flex items-center space-x-2 text-xs my-0.5">
                  <ArrowDown className="w-3.5 h-3.5 text-slate-500" />
                  <span className={`font-mono text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${isBottleneck ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' : 'bg-slate-950 text-slate-400 border-slate-800'}`}>
                    {stage.conversionFromPrevious}% converted
                  </span>
                </div>
              )}

              {/* Stage Container */}
              <div 
                className={`w-full rounded-xl p-4 border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative overflow-hidden ${
                  isBottleneck 
                    ? 'bg-amber-950/30 border-amber-500/50 ring-1 ring-amber-500/20' 
                    : 'bg-slate-950/70 border-slate-800'
                }`}
                style={{ width: `${widthPercent}%` }}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono font-bold text-xs shrink-0 ${isBottleneck ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-slate-800 text-slate-300'}`}>
                    {idx + 1}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white tracking-tight flex items-center space-x-2">
                      <span>{stage.name}</span>
                      {isBottleneck && (
                        <span className="bg-amber-500/20 text-amber-300 text-[10px] font-black px-2 py-0.5 rounded border border-amber-500/40 uppercase">
                          BOTTLENECK
                        </span>
                      )}
                    </h4>
                    {stage.dropoffReason && (
                      <p className="text-[11px] text-amber-200/80 mt-0.5">{stage.dropoffReason}</p>
                    )}
                  </div>
                </div>

                <div className="font-mono text-base font-black text-emerald-400 shrink-0">
                  {stage.count.toLocaleString()}
                </div>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
};
