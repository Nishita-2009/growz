import React, { useState } from 'react';
import { MarketingTrendDataPoint, MarketingTrendPeriod } from '../../types/marketing';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Legend 
} from 'recharts';
import { TrendingUp, Calendar } from 'lucide-react';

interface MarketingTrendChartProps {
  trendDataMap: Record<string, MarketingTrendDataPoint[]>;
}

export const MarketingTrendChart: React.FC<MarketingTrendChartProps> = ({ trendDataMap }) => {
  const [period, setPeriod] = useState<MarketingTrendPeriod>('30 Days');
  const currentData = trendDataMap[period] || trendDataMap['30 Days'];

  const periods: MarketingTrendPeriod[] = ['7 Days', '30 Days', '90 Days'];

  return (
    <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div>
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <h3 className="text-base font-extrabold text-white tracking-tight">Marketing Performance Trend</h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Historical progression of lead acquisition, conversions, and ad spend.
          </p>
        </div>

        {/* Time Filter Switcher */}
        <div className="flex items-center space-x-1.5 bg-slate-950/80 border border-slate-800 p-1.5 rounded-xl self-start sm:self-auto">
          <Calendar className="w-3.5 h-3.5 text-slate-400 ml-1.5" />
          {periods.map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                period === p
                  ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-400'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Chart View */}
      <div className="h-72 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={currentData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.4} />
            <XAxis dataKey="date" stroke="#64748b" tick={{ fontSize: 11 }} />
            <YAxis yAxisId="left" stroke="#64748b" tick={{ fontSize: 11 }} />
            <YAxis yAxisId="right" orientation="right" stroke="#64748b" tick={{ fontSize: 11 }} />
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
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="leads"
              name="Leads Generated"
              stroke="#38bdf8"
              strokeWidth={2.5}
              dot={{ r: 4, fill: '#38bdf8' }}
            />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="customers"
              name="Customers Acquired"
              stroke="#10b981"
              strokeWidth={2.5}
              dot={{ r: 4, fill: '#10b981' }}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="spend"
              name="Spend ($)"
              stroke="#f59e0b"
              strokeWidth={2}
              strokeDasharray="4 4"
              dot={{ r: 3, fill: '#f59e0b' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
