import React from 'react';
import { CampaignItem, CampaignStatus } from '../../types/marketing';
import { Megaphone, ArrowUpRight } from 'lucide-react';

interface CampaignTableProps {
  campaigns: CampaignItem[];
}

export const CampaignTable: React.FC<CampaignTableProps> = ({ campaigns }) => {
  const getStatusBadge = (status: CampaignStatus) => {
    switch (status) {
      case 'Active':
        return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
      case 'Completed':
        return 'bg-slate-500/15 text-slate-400 border-slate-500/30';
      case 'Needs Attention':
        return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
    }
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-sm space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Megaphone className="w-4 h-4 text-emerald-400" />
            <h3 className="text-base font-extrabold text-white tracking-tight">Campaign Performance</h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Active and past marketing campaigns across channels with conversion and ROI tracking.
          </p>
        </div>

        <span className="text-xs text-slate-400 bg-slate-950 px-3 py-1 rounded-xl border border-slate-800">
          Showing {campaigns.length} Active & Recent Campaigns
        </span>
      </div>

      {/* Table View */}
      <div className="overflow-x-auto rounded-xl border border-slate-800/80">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950/90 text-slate-400 font-bold border-b border-slate-800 uppercase tracking-wider text-[10px]">
            <tr>
              <th className="py-3.5 px-4">Campaign Name</th>
              <th className="py-3.5 px-4">Channel</th>
              <th className="py-3.5 px-4">Spend</th>
              <th className="py-3.5 px-4">Leads</th>
              <th className="py-3.5 px-4">Customers</th>
              <th className="py-3.5 px-4">Conv. Rate</th>
              <th className="py-3.5 px-4">ROI</th>
              <th className="py-3.5 px-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 bg-slate-900/40 font-mono">
            {campaigns.map((camp) => (
              <tr key={camp.id} className="hover:bg-slate-800/40 transition-colors">
                <td className="py-3.5 px-4 font-sans font-bold text-slate-100">
                  {camp.name}
                </td>
                <td className="py-3.5 px-4 font-sans">
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-950 text-slate-300 border border-slate-800">
                    {camp.channel}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-slate-200 font-bold">${camp.spend}</td>
                <td className="py-3.5 px-4 text-sky-400 font-bold">{camp.leads}</td>
                <td className="py-3.5 px-4 text-emerald-400 font-bold">{camp.customers}</td>
                <td className="py-3.5 px-4 text-slate-200">{camp.conversionRate.toFixed(1)}%</td>
                <td className="py-3.5 px-4 font-sans">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${camp.roi >= 3 ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800 text-slate-400'}`}>
                    {camp.roi}x
                  </span>
                </td>
                <td className="py-3.5 px-4 font-sans">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadge(camp.status)}`}>
                    {camp.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
