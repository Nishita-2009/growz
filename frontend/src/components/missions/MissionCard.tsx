import React from 'react';
import { Mission, MissionStatus, MissionPriority } from '../../types/missions';
import { MissionProgress } from './MissionProgress';
import { useNavigate } from 'react-router-dom';
import { Clock, Gauge, ArrowRight, CheckCircle2, PauseCircle, PlayCircle, Sparkles } from 'lucide-react';

interface MissionCardProps {
  mission: Mission;
  onStatusChange?: (id: string, status: MissionStatus) => void;
}

export const MissionCard: React.FC<MissionCardProps> = ({ mission }) => {
  const navigate = useNavigate();

  const completedTasks = mission.checklist.filter((item) => item.completed).length;

  const priorityStyles: Record<MissionPriority, { bg: string; text: string; border: string }> = {
    High: { bg: 'bg-rose-500/10', text: 'text-rose-400', border: 'border-rose-500/30' },
    Medium: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/30' },
    Low: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/30' },
  };

  const statusStyles: Record<MissionStatus, { bg: string; text: string; border: string; icon: any }> = {
    Recommended: { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/30', icon: Sparkles },
    'Not Started': { bg: 'bg-slate-800/80', text: 'text-slate-300', border: 'border-slate-700', icon: Clock },
    'In Progress': { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30', icon: PlayCircle },
    Completed: { bg: 'bg-teal-500/10', text: 'text-teal-400', border: 'border-teal-500/30', icon: CheckCircle2 },
    Paused: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/30', icon: PauseCircle },
  };

  const pStyle = priorityStyles[mission.priority];
  const sStyle = statusStyles[mission.status];
  const StatusIcon = sStyle.icon;

  const handleClick = () => {
    navigate(`/app/missions/${mission.id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="bg-slate-900/80 border border-slate-800 hover:border-emerald-500/40 rounded-3xl p-6 shadow-xl backdrop-blur-xl transition-all duration-300 flex flex-col justify-between space-y-5 cursor-pointer group hover:shadow-2xl hover:shadow-emerald-500/5"
    >
      {/* Top badges: Priority, Category, Status */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${pStyle.bg} ${pStyle.text} ${pStyle.border}`}>
            {mission.priority} Priority
          </span>
          <span className="text-[10px] font-bold text-slate-400 bg-slate-950 px-2.5 py-0.5 rounded-full border border-slate-800">
            {mission.category}
          </span>
        </div>

        <span className={`text-[11px] font-bold inline-flex items-center gap-1.5 px-3 py-1 rounded-full border ${sStyle.bg} ${sStyle.text} ${sStyle.border}`}>
          <StatusIcon className="h-3 w-3" />
          <span>{mission.status}</span>
        </span>
      </div>

      {/* Main info */}
      <div className="space-y-2">
        <h3 className="text-lg font-bold text-white tracking-tight group-hover:text-emerald-400 transition-colors">
          {mission.title}
        </h3>
        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
          <strong className="text-slate-300">Problem:</strong> {mission.problem}
        </p>
      </div>

      {/* Expected Impact */}
      <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-1">
        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block">
          Expected Impact
        </span>
        <p className="text-xs text-slate-300 font-medium">
          {mission.expectedImpact}
        </p>
      </div>

      {/* Meta: Difficulty & Time */}
      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800/60">
        <span className="flex items-center gap-1">
          <Gauge className="h-3.5 w-3.5 text-amber-400" />
          <span>Difficulty: <strong className="text-slate-200">{mission.difficulty}</strong></span>
        </span>
        <span className="flex items-center gap-1">
          <Clock className="h-3.5 w-3.5 text-teal-400" />
          <span>Time: <strong className="text-slate-200">{mission.estimatedTime}</strong></span>
        </span>
      </div>

      {/* Progress & Action button */}
      <div className="space-y-3 pt-1">
        <MissionProgress completedCount={completedTasks} totalCount={mission.checklist.length} />

        <div className="flex items-center justify-between pt-1 text-xs text-slate-300 font-semibold group-hover:text-emerald-400">
          <span>View Mission Details</span>
          <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </div>
  );
};
