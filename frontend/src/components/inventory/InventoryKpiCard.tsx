import React from 'react';
import { Package, DollarSign, AlertTriangle, XCircle, Flame, Clock } from 'lucide-react';

interface InventoryKpiCardProps {
  title: string;
  value: string | number;
  iconName: 'Package' | 'DollarSign' | 'AlertTriangle' | 'XCircle' | 'Flame' | 'Clock';
  badgeText?: string;
  badgeType?: 'neutral' | 'warning' | 'danger' | 'success';
}

const IconMap = {
  Package,
  DollarSign,
  AlertTriangle,
  XCircle,
  Flame,
  Clock
};

export const InventoryKpiCard: React.FC<InventoryKpiCardProps> = ({
  title,
  value,
  iconName,
  badgeText,
  badgeType = 'neutral'
}) => {
  const Icon = IconMap[iconName] || Package;

  return (
    <div className="bg-slate-900/80 border border-slate-800 hover:border-emerald-500/40 rounded-2xl p-5 shadow-lg transition-all duration-300 space-y-3 backdrop-blur-md group">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{title}</span>
        <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-emerald-400 group-hover:scale-105 transition-all">
          <Icon className="h-4 w-4" />
        </div>
      </div>

      <div className="space-y-1">
        <div className="text-2xl font-bold text-white tracking-tight">{value}</div>
        {badgeText && (
          <div className="text-xs">
            <span
              className={`inline-flex items-center font-semibold px-2 py-0.5 rounded-md border ${
                badgeType === 'danger'
                  ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                  : badgeType === 'warning'
                  ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                  : badgeType === 'success'
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                  : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}
            >
              {badgeText}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
