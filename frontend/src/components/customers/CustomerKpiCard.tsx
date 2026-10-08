import React from 'react';
import { CustomerKpi } from '../../types/customers';
import { 
  Users, 
  UserPlus, 
  UserCheck, 
  Repeat, 
  DollarSign, 
  AlertTriangle,
  TrendingUp,
  TrendingDown
} from 'lucide-react';

interface CustomerKpiCardProps {
  kpi: CustomerKpi;
}

const iconMap: Record<string, React.FC<{ className?: string }>> = {
  Users,
  UserPlus,
  UserCheck,
  Repeat,
  DollarSign,
  AlertTriangle
};

export const CustomerKpiCard: React.FC<CustomerKpiCardProps> = ({ kpi }) => {
  const Icon = iconMap[kpi.iconName] || Users;

  return (
    <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-sm relative overflow-hidden transition-all hover:border-slate-700/80 hover:shadow-lg hover:shadow-emerald-500/5 group">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-400 tracking-wide uppercase">{kpi.title}</span>
        <div className="p-2 rounded-xl bg-slate-800/60 border border-slate-700/50 text-slate-300 group-hover:border-emerald-500/40 group-hover:text-emerald-400 transition-colors">
          <Icon className="w-4 h-4" />
        </div>
      </div>

      <div className="mt-4 flex items-baseline justify-between">
        <h3 className="text-2xl font-black text-white tracking-tight">{kpi.value}</h3>
      </div>

      <div className="mt-3 flex items-center justify-between text-xs pt-2 border-t border-slate-800/60">
        <div className={`flex items-center space-x-1 font-semibold ${kpi.isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
          {kpi.isPositive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
          <span>{kpi.change}</span>
        </div>
        <span className="text-[11px] text-slate-500 truncate max-w-[140px]">{kpi.indicator}</span>
      </div>
    </div>
  );
};
