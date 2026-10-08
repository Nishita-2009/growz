import React from 'react';
import { RevenueDriverItem } from '../../types/customers';
import { Crown, TrendingUp, BarChart3 } from 'lucide-react';

interface CustomerValueSectionProps {
  revenueDrivers: RevenueDriverItem[];
}

export const CustomerValueSection: React.FC<CustomerValueSectionProps> = ({ revenueDrivers }) => {
  return (
    <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div>
          <div className="flex items-center space-x-2">
            <Crown className="w-4 h-4 text-amber-400" />
            <h3 className="text-base font-extrabold text-white tracking-tight">Who Drives Your Revenue?</h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Top customer segments and accounts generating the highest revenue concentration.
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-slate-950/80 border border-slate-800 px-3 py-1.5 rounded-xl text-xs text-slate-300">
          <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
          <span>Top 20% generate <strong>69.3%</strong> total revenue</span>
        </div>
      </div>

      {/* Revenue Contributors Breakdown & Visualization */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Table/List View */}
        <div className="lg:col-span-2 space-y-3">
          <div className="overflow-x-auto rounded-xl border border-slate-800/80">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/90 text-slate-400 font-bold border-b border-slate-800 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Customer / Segment</th>
                  <th className="py-3 px-4">Orders</th>
                  <th className="py-3 px-4">Total Revenue</th>
                  <th className="py-3 px-4">Avg Order Value</th>
                  <th className="py-3 px-4">Last Purchase</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 bg-slate-900/40 font-mono">
                {revenueDrivers.map((driver) => (
                  <tr key={driver.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 font-sans">
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${driver.type === 'Segment' ? 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/30' : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'}`}>
                          {driver.type}
                        </span>
                        <span className="font-bold text-slate-200">{driver.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-300 font-semibold">{driver.orders.toLocaleString()}</td>
                    <td className="py-3 px-4 text-emerald-400 font-extrabold">${driver.totalRevenue.toLocaleString()}</td>
                    <td className="py-3 px-4 text-slate-300">${driver.avgOrderValue.toFixed(2)}</td>
                    <td className="py-3 px-4 font-sans text-slate-400">{driver.lastPurchase}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Simple Revenue Share Visualization */}
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-5 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold text-slate-200 mb-3">
              <BarChart3 className="w-4 h-4 text-emerald-400" />
              <span>Revenue Distribution Share</span>
            </div>

            <div className="space-y-3.5">
              {revenueDrivers.map((driver) => (
                <div key={driver.id} className="space-y-1 text-xs">
                  <div className="flex justify-between font-medium">
                    <span className="text-slate-300 truncate max-w-[160px]">{driver.name}</span>
                    <span className="font-mono font-bold text-emerald-400">{driver.sharePercentage}%</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-emerald-500 to-teal-400 h-2 rounded-full" 
                      style={{ width: `${Math.min(100, driver.sharePercentage * 2.2)}%` }} 
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800/80 text-[11px] text-slate-400">
            High value accounts are prioritized for dedicated support and loyalty incentives.
          </div>
        </div>

      </div>
    </div>
  );
};
