import React from 'react';
import { ChannelPerformanceItem } from '../../types/marketing';
import { 
  Search, 
  Globe, 
  MessageSquare, 
  Megaphone, 
  Layers, 
  TrendingUp,
  Share2
} from 'lucide-react';

const InstagramIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const FacebookIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path>
  </svg>
);

const iconMap: Record<string, React.FC<{ className?: string }>> = {
  Instagram: InstagramIcon,
  Facebook: FacebookIcon,
  Search,
  Globe,
  MessageSquare,
  Megaphone
};

interface ChannelPerformanceProps {
  channels: ChannelPerformanceItem[];
}

export const ChannelPerformance: React.FC<ChannelPerformanceProps> = ({ channels }) => {
  return (
    <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-sm space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div>
          <div className="flex items-center space-x-2">
            <Layers className="w-4 h-4 text-emerald-400" />
            <h3 className="text-base font-extrabold text-white tracking-tight">Channel Performance Breakdown</h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Comparing audience reach, engagement quality, leads generated, customer conversion, spend & ROI across key channels.
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-slate-950/80 border border-slate-800 px-3 py-1.5 rounded-xl text-xs text-slate-300">
          <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
          <span>Top Performing: <strong className="text-emerald-400">Google Business (5.2x ROI)</strong></span>
        </div>
      </div>

      {/* Table view for channel metrics */}
      <div className="overflow-x-auto rounded-xl border border-slate-800/80">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950/90 text-slate-400 font-bold border-b border-slate-800 uppercase tracking-wider text-[10px]">
            <tr>
              <th className="py-3.5 px-4">Channel</th>
              <th className="py-3.5 px-4">Reach / Visitors</th>
              <th className="py-3.5 px-4">Engagement</th>
              <th className="py-3.5 px-4">Leads</th>
              <th className="py-3.5 px-4">Customers</th>
              <th className="py-3.5 px-4">Conv. Rate</th>
              <th className="py-3.5 px-4">Spend</th>
              <th className="py-3.5 px-4">ROI</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 bg-slate-900/40 font-mono">
            {channels.map((ch) => {
              const Icon = iconMap[ch.iconName] || Globe;
              return (
                <tr key={ch.id} className="hover:bg-slate-800/40 transition-colors group">
                  <td className="py-3.5 px-4 font-sans">
                    <div className="flex items-center space-x-2.5">
                      <div 
                        className="p-1.5 rounded-lg border flex items-center justify-center shrink-0"
                        style={{ 
                          backgroundColor: `${ch.color}15`, 
                          borderColor: `${ch.color}40`,
                          color: ch.color 
                        }}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="font-bold text-slate-100 group-hover:text-emerald-400 transition-colors">
                        {ch.name}
                      </span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-200 font-bold">{ch.reach.toLocaleString()}</td>
                  <td className="py-3.5 px-4 text-slate-300">{ch.engagement.toLocaleString()}</td>
                  <td className="py-3.5 px-4 text-sky-400 font-bold">{ch.leads}</td>
                  <td className="py-3.5 px-4 text-emerald-400 font-bold">{ch.customers}</td>
                  <td className="py-3.5 px-4 font-sans">
                    <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-950 border border-slate-800 text-slate-200">
                      {ch.conversionRate.toFixed(1)}%
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-300">
                    {ch.spend ? `$${ch.spend}` : '—'}
                  </td>
                  <td className="py-3.5 px-4 font-sans">
                    {ch.roi ? (
                      <span className={`px-2 py-0.5 rounded text-[11px] font-extrabold ${ch.roi >= 3 ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800 text-slate-400'}`}>
                        {ch.roi}x
                      </span>
                    ) : '—'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
