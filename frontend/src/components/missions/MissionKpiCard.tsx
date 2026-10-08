import React from 'react';
import { Target, AlertTriangle, CheckCircle2, TrendingUp, Sparkles } from 'lucide-react';

interface MissionKpiCardProps {
  activeCount: number;
  highPriorityCount: number;
  completedCount: number;
  successRate: string;
  opportunitiesCount: number;
}

export const MissionKpiCard: React.FC<MissionKpiCardProps> = ({
  activeCount,
  highPriorityCount,
  completedCount,
  successRate,
  opportunitiesCount,
}) => {
  const kpis = [
    {
      id: 'active',
      title: 'Active Missions',
      value: activeCount,
      subtext: 'In progress or queued',
      icon: Target,
      color: 'emerald',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/20',
      textColor: 'text-emerald-400',
    },
    {
      id: 'high-priority',
      title: 'High Priority',
      value: highPriorityCount,
      subtext: 'Critical growth impact',
      icon: AlertTriangle,
      color: 'amber',
      bgColor: 'bg-amber-500/10',
      borderColor: 'border-amber-500/20',
      textColor: 'text-amber-400',
    },
    {
      id: 'completed',
      title: 'Completed',
      value: completedCount,
      subtext: 'Executed growth actions',
      icon: CheckCircle2,
      color: 'teal',
      bgColor: 'bg-teal-500/10',
      borderColor: 'border-teal-500/20',
      textColor: 'text-teal-400',
    },
    {
      id: 'success-rate',
      title: 'Success Rate',
      value: successRate,
      subtext: 'Missions with positive lift',
      icon: TrendingUp,
      color: 'emerald',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/20',
      textColor: 'text-emerald-400',
    },
    {
      id: 'opportunities',
      title: 'Estimated Opportunities',
      value: opportunitiesCount,
      subtext: 'Ready to convert to missions',
      icon: Sparkles,
      color: 'purple',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/20',
      textColor: 'text-purple-400',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {kpis.map((kpi) => {
        const Icon = kpi.icon;
        return (
          <div
            key={kpi.id}
            className="bg-slate-900/80 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 shadow-lg backdrop-blur-md transition-all duration-300 flex flex-col justify-between space-y-3 group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                {kpi.title}
              </span>
              <div className={`p-2 rounded-xl ${kpi.bgColor} border ${kpi.borderColor} ${kpi.textColor} group-hover:scale-110 transition-transform`}>
                <Icon className="h-4 w-4" />
              </div>
            </div>

            <div className="space-y-0.5">
              <div className="text-2xl font-black text-white tracking-tight">
                {kpi.value}
              </div>
              <div className="text-[11px] font-medium text-slate-500 truncate">
                {kpi.subtext}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
