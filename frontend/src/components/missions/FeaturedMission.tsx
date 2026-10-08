import React from 'react';
import { Mission } from '../../types/missions';
import { Flame, Clock, Gauge, ArrowRight, Sparkles, AlertCircle, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface FeaturedMissionProps {
  mission: Mission;
  onStartMission: (id: string) => void;
}

export const FeaturedMission: React.FC<FeaturedMissionProps> = ({ mission, onStartMission }) => {
  const navigate = useNavigate();

  const handleStart = (e: React.MouseEvent) => {
    e.stopPropagation();
    onStartMission(mission.id);
    navigate(`/app/missions/${mission.id}`);
  };

  const handleView = () => {
    navigate(`/app/missions/${mission.id}`);
  };

  return (
    <div 
      onClick={handleView}
      className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-900/90 to-emerald-950/30 border border-emerald-500/30 hover:border-emerald-500/50 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl transition-all duration-300 cursor-pointer group space-y-6"
    >
      {/* Decorative background glow */}
      <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header section */}
      <div className="flex flex-wrap items-center justify-between gap-3 relative z-10">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider bg-rose-500/15 border border-rose-500/30 text-rose-400 px-3 py-1 rounded-full shadow-sm">
            <Flame className="h-3.5 w-3.5 fill-rose-500 text-rose-500 animate-pulse" />
            HIGH PRIORITY FEATURED MISSION
          </span>
          <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
            {mission.category}
          </span>
        </div>

        <div className="flex items-center gap-3 text-xs text-slate-400">
          <span className="flex items-center gap-1 bg-slate-950/70 border border-slate-800 px-2.5 py-1 rounded-lg">
            <Gauge className="h-3.5 w-3.5 text-amber-400" />
            <span>Difficulty: <strong className="text-slate-200">{mission.difficulty}</strong></span>
          </span>
          <span className="flex items-center gap-1 bg-slate-950/70 border border-slate-800 px-2.5 py-1 rounded-lg">
            <Clock className="h-3.5 w-3.5 text-teal-400" />
            <span>Est. Time: <strong className="text-slate-200">{mission.estimatedTime}</strong></span>
          </span>
        </div>
      </div>

      {/* Title & Description */}
      <div className="space-y-2 relative z-10">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight group-hover:text-emerald-400 transition-colors">
          {mission.title}
        </h2>
        <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
          <strong className="text-slate-200">Recommended Action:</strong> {mission.recommendedAction}
        </p>
      </div>

      {/* Grid of Key Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10">
        <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-4 space-y-1">
          <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider block">
            Problem Identified
          </span>
          <p className="text-xs text-slate-300 leading-relaxed font-medium">
            "{mission.problem}"
          </p>
        </div>

        <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-4 space-y-1">
          <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
            Evidence Observed
          </span>
          <p className="text-xs text-slate-300 leading-relaxed font-medium">
            "{mission.evidence}"
          </p>
        </div>

        <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-4 space-y-1">
          <span className="text-[10px] font-bold text-teal-400 uppercase tracking-wider block">
            Why It Matters
          </span>
          <p className="text-xs text-slate-300 leading-relaxed font-medium">
            "{mission.whyItMatters}"
          </p>
        </div>
      </div>

      {/* Expected Impact & CTA Footer */}
      <div className="pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4 relative z-10">
        <div className="space-y-1 max-w-xl">
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
            <Sparkles className="h-4 w-4" />
            <span>Expected Impact: {mission.expectedImpact}</span>
          </div>
          <p className="text-[11px] text-slate-500 italic flex items-center gap-1">
            <AlertCircle className="h-3 w-3 shrink-0" />
            <span>Note: Expected impact is an estimate based on benchmark data and is not guaranteed.</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleStart}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/25 hover:brightness-110 active:scale-95 transition-all flex items-center space-x-2"
          >
            <Play className="h-3.5 w-3.5 fill-slate-950" />
            <span>Start Mission</span>
          </button>
          
          <button
            onClick={handleView}
            className="px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 hover:text-white font-semibold text-xs transition-all flex items-center space-x-1.5"
          >
            <span>View Details</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
