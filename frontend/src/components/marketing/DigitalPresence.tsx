import React from 'react';
import { DigitalPresenceChannel, DigitalPresenceStatus } from '../../types/marketing';
import { 
  Globe, 
  Search, 
  MessageSquare, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Radio 
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
  Globe,
  Search,
  Instagram: InstagramIcon,
  MessageSquare,
  Facebook: FacebookIcon
};

interface DigitalPresenceProps {
  channels: DigitalPresenceChannel[];
}

export const DigitalPresence: React.FC<DigitalPresenceProps> = ({ channels }) => {
  const getStatusBadge = (status: DigitalPresenceStatus) => {
    switch (status) {
      case 'Connected':
        return {
          badgeClass: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
          icon: CheckCircle2
        };
      case 'Needs Attention':
        return {
          badgeClass: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
          icon: AlertTriangle
        };
      case 'Not Connected':
        return {
          badgeClass: 'bg-slate-500/10 text-slate-400 border-slate-500/30',
          icon: XCircle
        };
    }
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div>
          <div className="flex items-center space-x-2">
            <Radio className="w-4 h-4 text-emerald-400" />
            <h3 className="text-base font-extrabold text-white tracking-tight">Digital Presence & Integration Status</h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time connection status across your web domain, search listings, and social channels.
          </p>
        </div>

        <span className="text-xs font-semibold px-3 py-1 rounded-xl bg-slate-950 border border-slate-800 text-slate-300">
          UI Demo Integration State
        </span>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {channels.map((ch) => {
          const Icon = iconMap[ch.iconName] || Globe;
          const statusInfo = getStatusBadge(ch.status);
          const StatusIcon = statusInfo.icon;

          return (
            <div 
              key={ch.id} 
              className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 flex flex-col justify-between space-y-3 hover:border-slate-700 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-200">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-extrabold text-slate-100">{ch.name}</h4>
                    {ch.handleOrUrl && (
                      <span className="text-[11px] font-mono text-slate-400 block">{ch.handleOrUrl}</span>
                    )}
                  </div>
                </div>

                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border flex items-center space-x-1 ${statusInfo.badgeClass}`}>
                  <StatusIcon className="w-3 h-3" />
                  <span>{ch.status}</span>
                </span>
              </div>

              <p className="text-[11px] text-slate-400 leading-snug pt-2 border-t border-slate-900">
                {ch.detail}
              </p>

              {ch.lastSynced && (
                <div className="text-[10px] text-slate-500 font-mono">
                  Synced: {ch.lastSynced}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
