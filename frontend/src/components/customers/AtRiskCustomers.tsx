import React from 'react';
import { AtRiskCustomerItem, RiskLevel, SuggestedAction } from '../../types/customers';
import { AlertTriangle, Clock, Mail, ShieldAlert, ArrowRight, CheckCircle } from 'lucide-react';

interface AtRiskCustomersProps {
  atRiskCustomers: AtRiskCustomerItem[];
}

export const AtRiskCustomers: React.FC<AtRiskCustomersProps> = ({ atRiskCustomers }) => {
  const getRiskBadge = (level: RiskLevel) => {
    switch (level) {
      case 'High':
        return 'bg-rose-500/15 text-rose-400 border-rose-500/30';
      case 'Medium':
        return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
      case 'Low':
        return 'bg-sky-500/15 text-sky-400 border-sky-500/30';
    }
  };

  const getActionBadge = (action: SuggestedAction) => {
    switch (action) {
      case 'Send Reminder':
        return 'bg-sky-500/10 text-sky-300 border-sky-500/20 hover:bg-sky-500/20';
      case 'Offer Personalized Promotion':
        return 'bg-purple-500/10 text-purple-300 border-purple-500/20 hover:bg-purple-500/20';
      case 'Check Customer Experience':
        return 'bg-amber-500/10 text-amber-300 border-amber-500/20 hover:bg-amber-500/20';
      case 'Re-engage':
        return 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20 hover:bg-emerald-500/20';
    }
  };

  return (
    <div className="bg-slate-900/60 border border-amber-500/30 rounded-2xl p-6 backdrop-blur-sm space-y-6 relative overflow-hidden">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div>
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-extrabold text-white tracking-tight">Customers at Risk</h3>
            <span className="bg-amber-500/20 text-amber-300 text-[10px] font-extrabold px-2 py-0.5 rounded-md border border-amber-500/30 uppercase">
              DEMO INSIGHT
            </span>
          </div>
          <p className="text-xs text-amber-200/80 mt-1 leading-relaxed max-w-2xl">
            24 customers who previously purchased regularly have not returned within their expected purchase window.
          </p>
        </div>

        <div className="bg-slate-950/80 border border-slate-800 rounded-xl px-3.5 py-2 text-right shrink-0">
          <span className="text-[10px] text-slate-400 font-bold uppercase block">Est. Revenue at Risk</span>
          <span className="text-sm font-mono font-black text-rose-400">$1,850.00 / mo</span>
        </div>
      </div>

      {/* Grid of At-Risk Profiles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {atRiskCustomers.map((cust) => (
          <div 
            key={cust.id}
            className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 flex flex-col justify-between space-y-4 hover:border-slate-700 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-extrabold text-slate-100 text-sm">{cust.customerName}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getRiskBadge(cust.riskLevel)}`}>
                    {cust.riskLevel} Risk
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 block mt-0.5">{cust.email}</span>
              </div>

              <span className="font-mono text-xs font-bold text-rose-400 bg-rose-500/10 px-2 py-1 rounded border border-rose-500/20">
                -${cust.estimatedLostRevenue.toFixed(0)}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs py-2 px-3 bg-slate-900/60 rounded-lg border border-slate-800/80">
              <div>
                <span className="text-[10px] text-slate-400 block">Last Purchase</span>
                <span className="font-medium text-slate-200 flex items-center space-x-1 mt-0.5">
                  <Clock className="w-3 h-3 text-amber-400 shrink-0" />
                  <span>{cust.lastPurchase}</span>
                </span>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 block">Prior Frequency</span>
                <span className="font-medium text-slate-200">{cust.previousFrequency}</span>
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-2 flex items-center justify-between border-t border-slate-800/60">
              <span className="text-[10px] text-slate-400 uppercase font-bold">Suggested Action</span>
              <button className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-colors flex items-center space-x-1.5 ${getActionBadge(cust.suggestedAction)}`}>
                <span>{cust.suggestedAction}</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Demo Disclaimer */}
      <div className="text-[11px] text-slate-400 text-center pt-2">
        <span className="inline-flex items-center space-x-1 bg-slate-950/80 border border-slate-800 px-3 py-1 rounded-full">
          <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
          <span>These are demo recommendations generated for workspace preview.</span>
        </span>
      </div>
    </div>
  );
};
