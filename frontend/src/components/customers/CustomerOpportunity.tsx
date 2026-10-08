import React from 'react';
import { CustomerOpportunity as CustomerOpportunityType } from '../../types/customers';
import { Target, ArrowUpRight, CheckCircle2, ShieldCheck } from 'lucide-react';

interface CustomerOpportunityProps {
  opportunity: CustomerOpportunityType;
}

export const CustomerOpportunity: React.FC<CustomerOpportunityProps> = ({ opportunity }) => {
  return (
    <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-sm space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div>
          <div className="flex items-center space-x-2">
            <Target className="w-4 h-4 text-emerald-400" />
            <h3 className="text-base font-extrabold text-white tracking-tight">{opportunity.title}</h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            High-leverage growth tactic tailored to current customer behavior patterns.
          </p>
        </div>

        <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 self-start sm:self-auto">
          High Impact Priority
        </span>
      </div>

      {/* Opportunity Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Potential Opportunity */}
        <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 space-y-2">
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
            POTENTIAL OPPORTUNITY
          </span>
          <h4 className="text-sm font-bold text-slate-100">{opportunity.potentialOpportunity}</h4>
        </div>

        {/* Target Audience */}
        <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 space-y-2">
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
            TARGET AUDIENCE
          </span>
          <p className="text-xs font-medium text-slate-300">{opportunity.targetAudience}</p>
        </div>

        {/* Recommended Action */}
        <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 space-y-2">
          <span className="text-[10px] font-extrabold text-emerald-400 uppercase tracking-wider block">
            RECOMMENDED ACTION
          </span>
          <p className="text-xs text-slate-200 leading-snug">{opportunity.recommendedAction}</p>
        </div>

        {/* Expected Impact */}
        <div className="bg-emerald-950/40 border border-emerald-500/40 rounded-xl p-4 space-y-2 relative overflow-hidden">
          <span className="text-[10px] font-extrabold text-emerald-300 uppercase tracking-wider block">
            ESTIMATED EXPECTED IMPACT
          </span>
          <p className="text-xs font-bold text-emerald-200 leading-snug">
            {opportunity.expectedImpact}
          </p>
          <div className="pt-2 text-[10px] text-emerald-400/80 italic">
            *Projections based on industry benchmarks; actual results vary.
          </div>
        </div>

      </div>
    </div>
  );
};
