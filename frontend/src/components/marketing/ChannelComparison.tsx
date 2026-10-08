import React, { useState } from 'react';
import { ChannelPerformanceItem, ChannelComparisonMetric } from '../../types/marketing';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Cell 
} from 'recharts';
import { BarChart3 } from 'lucide-react';

interface ChannelComparisonProps {
  channels: ChannelPerformanceItem[];
}

export const ChannelComparison: React.FC<ChannelComparisonProps> = ({ channels }) => {
  const [selectedMetric, setSelectedMetric] = useState<ChannelComparisonMetric>('Leads');

  const metrics: ChannelComparisonMetric[] = [
    'Leads',
    'Customers',
    'Conversion Rate',
    'Marketing Spend',
    'ROI'
  ];

  const getMetricValue = (ch: ChannelPerformanceItem) => {
    switch (selectedMetric) {
      case 'Leads':
        return ch.leads;
      case 'Customers':
        return ch.customers;
      case 'Conversion Rate':
        return ch.conversionRate;
      case 'Marketing Spend':
        return ch.spend || 0;
      case 'ROI':
        return ch.roi || 0;
    }
  };

  const getMetricLabel = () => {
    switch (selectedMetric) {
      case 'Leads':
        return 'Leads Count';
      case 'Customers':
        return 'Customers Acquired';
      case 'Conversion Rate':
        return 'Conversion Rate (%)';
      case 'Marketing Spend':
        return 'Marketing Spend ($)';
      case 'ROI':
        return 'ROI Multiplier (x)';
    }
  };

  const chartData = channels.map((ch) => ({
    name: ch.name,
    value: getMetricValue(ch),
    color: ch.color
  }));

  return (
    <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-sm space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div>
          <div className="flex items-center space-x-2">
            <BarChart3 className="w-4 h-4 text-emerald-400" />
            <h3 className="text-base font-extrabold text-white tracking-tight">Channel Comparison</h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Compare performance across marketing channels by selecting your target metric below.
          </p>
        </div>

        {/* Metric Switcher Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-950/80 border border-slate-800 p-1.5 rounded-xl">
          {metrics.map((metric) => (
            <button
              key={metric}
              onClick={() => setSelectedMetric(metric)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                selectedMetric === metric
                  ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-400'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {metric}
            </button>
          ))}
        </div>
      </div>

      {/* Chart View */}
      <div className="h-72 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.4} />
            <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 11 }} />
            <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#090d16',
                borderColor: '#1e293b',
                borderRadius: '0.75rem',
                fontSize: '12px',
                color: '#f8fafc'
              }}
              formatter={(value: any) => [
                selectedMetric === 'Marketing Spend' ? `$${value}` :
                selectedMetric === 'Conversion Rate' ? `${value}%` :
                selectedMetric === 'ROI' ? `${value}x` : value,
                getMetricLabel()
              ]}
            />
            <Bar dataKey="value" radius={[6, 6, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
