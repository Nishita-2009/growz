import React from 'react';
import { Opportunity } from '../../types/intelligence';
import { OpportunityCard } from './OpportunityCard';
import { Sparkles, Database, ArrowRight, Lightbulb } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface OpportunitiesSectionProps {
  opportunities: Opportunity[];
}

export const OpportunitiesSection: React.FC<OpportunitiesSectionProps> = ({ opportunities }) => {
  const navigate = useNavigate();

  // Show top 3 highest priority opportunities
  const topOpportunities = [...opportunities]
    .sort((a, b) => (a.priority === 'High' ? -1 : 1))
    .slice(0, 3);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-emerald-400" />
            <span>Discovered Opportunities</span>
          </h2>
          <p className="text-xs text-slate-400">Proactive growth recommendations based on your business signals</p>
        </div>

        {opportunities.length > 0 && (
          <button
            onClick={() => navigate('/app/opportunities')}
            className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition-colors"
          >
            <span>View All ({opportunities.length})</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {opportunities.length === 0 ? (
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 shadow-xl text-center space-y-4 backdrop-blur-xl max-w-2xl mx-auto my-4">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-950 border border-slate-800 text-amber-400 mx-auto shadow-inner">
            <Database className="h-7 w-7 text-amber-400 stroke-[1.8]" />
          </div>

          <div className="space-y-1.5">
            <h3 className="text-lg font-extrabold text-white tracking-tight">
              Growz needs more data to discover opportunities.
            </h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
              Connect sales, inventory, or expense data to allow Growz to run automated opportunity detection.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-[11px] text-slate-300 max-w-md mx-auto text-left space-y-1">
            <span className="font-bold text-emerald-400 block">Required Data Connection:</span>
            <p className="text-slate-400 leading-snug">
              • Connect sales data to identify revenue opportunities.<br />
              • Sync inventory stock ledger to prevent stockouts.<br />
              • Input monthly operational expenses to audit profit margins.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {topOpportunities.map((opp) => (
            <OpportunityCard key={opp.id} opportunity={opp} />
          ))}
        </div>
      )}
    </div>
  );
};
