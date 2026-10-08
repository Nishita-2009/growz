import React, { useState } from 'react';
import { MovementTimeRange, MovementDataPoint } from '../../types/inventory';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';
import { TrendingUp, Calendar } from 'lucide-react';

interface InventoryMovementChartProps {
  movementData: Record<MovementTimeRange, MovementDataPoint[]>;
}

export const InventoryMovementChart: React.FC<InventoryMovementChartProps> = ({ movementData }) => {
  const [timeRange, setTimeRange] = useState<MovementTimeRange>('7_days');
  const chartPoints = movementData[timeRange];

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6 backdrop-blur-xl">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-emerald-400" />
            <span>Inventory Stock Movement</span>
          </h3>
          <p className="text-xs text-slate-400">Comparing Stock Inflow vs. Stock Outflow volume</p>
        </div>

        <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
          {(['7_days', '30_days', '90_days'] as MovementTimeRange[]).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                timeRange === range
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {range.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      <div className="h-72 w-full pt-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartPoints} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="date" stroke="#64748b" tick={{ fontSize: 12 }} />
            <YAxis stroke="#64748b" tick={{ fontSize: 12 }} />
            <Tooltip
              contentStyle={{ backgroundColor: '#020617', borderColor: '#1e293b', borderRadius: '0.75rem', color: '#f8fafc', fontSize: '0.75rem' }}
            />
            <Bar dataKey="stockIn" name="Stock In (Units)" fill="#10b981" radius={[6, 6, 0, 0]} />
            <Bar dataKey="stockOut" name="Stock Out (Units)" fill="#f43f5e" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-center gap-6 text-xs font-medium text-slate-400 border-t border-slate-800/80 pt-4">
        <span className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-sm bg-emerald-500 inline-block" />
          <span>Stock In (Supplier Receiving)</span>
        </span>
        <span className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-sm bg-rose-500 inline-block" />
          <span>Stock Out (Customer Sales)</span>
        </span>
      </div>
    </div>
  );
};
