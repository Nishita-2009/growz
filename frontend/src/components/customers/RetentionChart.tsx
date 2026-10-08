import React from 'react';
import { RetentionDataPoint } from '../../types/customers';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Legend 
} from 'recharts';
import { UserCheck, Repeat, Users, TrendingUp } from 'lucide-react';

interface RetentionChartProps {
  retentionData: RetentionDataPoint[];
}

export const RetentionChart: React.FC<RetentionChartProps> = ({ retentionData }) => {
  const currentRepeatRate = retentionData[retentionData.length - 1]?.repeatRate || 44.9;
  const currentFirstTime = retentionData[retentionData.length - 1]?.firstTime || 184;
  const currentReturning = retentionData[retentionData.length - 1]?.returning || 642;

  return (
    <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-sm space-y-6">
      
      {/* Retention Header & Stats */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-slate-800/80 pb-5">
        <div>
          <div className="flex items-center space-x-2">
            <Repeat className="w-4 h-4 text-emerald-400" />
            <h3 className="text-base font-extrabold text-white tracking-tight">Retention Intelligence</h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Tracks repeat buyers vs. first-time buyers over time to evaluate retention momentum.
          </p>
        </div>

        {/* Quick Stat Pill Display */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-center">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Repeat Rate</span>
            <span className="text-sm font-mono font-black text-emerald-400">{currentRepeatRate}%</span>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-center">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">First-Time</span>
            <span className="text-sm font-mono font-black text-sky-400">{currentFirstTime}</span>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-center">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Returning</span>
            <span className="text-sm font-mono font-black text-teal-300">{currentReturning}</span>
          </div>
        </div>
      </div>

      {/* Recharts Area Chart Visualization */}
      <div className="h-72 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={retentionData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorReturning" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="colorFirstTime" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.4} />
            <XAxis dataKey="month" stroke="#64748b" tick={{ fontSize: 11 }} />
            <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#090d16',
                borderColor: '#1e293b',
                borderRadius: '0.75rem',
                fontSize: '12px',
                color: '#f8fafc'
              }}
            />
            <Legend wrapperStyle={{ paddingTop: '10px', fontSize: '12px' }} />
            <Area
              type="monotone"
              dataKey="returning"
              name="Returning Customers"
              stroke="#10b981"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorReturning)"
            />
            <Area
              type="monotone"
              dataKey="firstTime"
              name="First-time Customers"
              stroke="#38bdf8"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorFirstTime)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="text-[11px] text-slate-400 bg-slate-950/60 border border-slate-800 rounded-xl p-3 flex items-center justify-between">
        <span>Retention rate improved by <strong>+6.7 percentage points</strong> over the last 6 months.</span>
        <span className="text-emerald-400 font-semibold flex items-center space-x-1">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Positive Trend</span>
        </span>
      </div>
    </div>
  );
};
