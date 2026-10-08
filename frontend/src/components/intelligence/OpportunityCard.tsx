import React from 'react';
import { Opportunity, OpportunityPriority } from '../../types/intelligence';
import { useMissionsStore } from '../../stores/useMissionsStore';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ShieldCheck, PlusCircle, ArrowRight, AlertTriangle } from 'lucide-react';

interface OpportunityCardProps {
  opportunity: Opportunity;
  onOpportunityClick?: (opp: Opportunity) => void;
}

export const OpportunityCard: React.FC<OpportunityCardProps> = ({
  opportunity,
  onOpportunityClick,
}) => {
  const navigate = useNavigate();
  const turnOpportunityIntoMission = useMissionsStore((state) => state.turnOpportunityIntoMission);

  const priorityStyles: Record<OpportunityPriority, { bg: string; text: string; border: string }> = {
    High: { bg: 'bg-rose-500/10', text: 'text-rose-400', border: 'border-rose-500/30' },
    Medium: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/30' },
    Low: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/30' },
  };

  const pStyle = priorityStyles[opportunity.priority];

  const handleTurnIntoMission = (e: React.MouseEvent) => {
    e.stopPropagation();
    const createdMission = turnOpportunityIntoMission(
      opportunity.title,
      opportunity.category,
      opportunity.priority,
      opportunity.problem,
      opportunity.recommendedAction
    );
    navigate(`/app/missions/${createdMission.id}`);
  };

  return (
    <div
      onClick={() => onOpportunityClick && onOpportunityClick(opportunity)}
      className="bg-slate-900/80 border border-slate-800 hover:border-emerald-500/40 rounded-3xl p-6 shadow-xl backdrop-blur-xl transition-all duration-300 flex flex-col justify-between space-y-5 cursor-pointer group hover:shadow-2xl hover:shadow-emerald-500/5"
    >
      {/* Top Header & Priority */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${pStyle.bg} ${pStyle.text} ${pStyle.border}`}>
            {opportunity.priority} PRIORITY
          </span>
          <span className="text-[10px] font-bold text-slate-400 bg-slate-950 px-2.5 py-0.5 rounded-full border border-slate-800">
            {opportunity.category}
          </span>
        </div>

        <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full flex items-center gap-1">
          <ShieldCheck className="h-3 w-3" />
          <span>{opportunity.confidence} Confidence</span>
        </span>
      </div>

      {/* Main Title & Problem */}
      <div className="space-y-2">
        <h3 className="text-lg font-bold text-white tracking-tight group-hover:text-emerald-400 transition-colors">
          {opportunity.title}
        </h3>
        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
          <strong className="text-slate-300">Problem:</strong> {opportunity.problem}
        </p>
      </div>

      {/* Evidence */}
      <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-1">
        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block flex items-center gap-1">
          <AlertTriangle className="h-3 w-3" /> Evidence
        </span>
        <p className="text-xs text-slate-300 leading-relaxed font-medium">
          "{opportunity.evidence}"
        </p>
      </div>

      {/* Recommended Action & Expected Impact */}
      <div className="space-y-2">
        <div className="text-xs text-slate-300 font-medium">
          <strong className="text-emerald-400">Action:</strong> {opportunity.recommendedAction}
        </div>
        <div className="text-[11px] text-teal-400 font-semibold flex items-center gap-1">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Expected Impact: {opportunity.expectedImpact}</span>
        </div>
      </div>

      {/* Footer CTA: Turn into Mission */}
      <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between gap-3">
        <button
          onClick={handleTurnIntoMission}
          className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center space-x-2"
        >
          <PlusCircle className="h-4 w-4" />
          <span>Turn into Mission</span>
        </button>
      </div>
    </div>
  );
};
