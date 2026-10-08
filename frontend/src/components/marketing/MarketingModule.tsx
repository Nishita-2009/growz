import React, { useState } from 'react';
import { MarketingKpiCard } from './MarketingKpiCard';
import { MarketingHealth } from './MarketingHealth';
import { ChannelPerformance } from './ChannelPerformance';
import { MarketingFunnel } from './MarketingFunnel';
import { ChannelComparison } from './ChannelComparison';
import { MarketingTrendChart } from './MarketingTrendChart';
import { MarketingInsightPanel } from './MarketingInsightPanel';
import { MarketingOpportunity } from './MarketingOpportunity';
import { DigitalPresence } from './DigitalPresence';
import { CampaignTable } from './CampaignTable';
import { MarketingEmptyState } from './MarketingEmptyState';

import { 
  MARKETING_KPIS_DEMO, 
  MARKETING_HEALTH_DEMO, 
  CHANNELS_PERFORMANCE_DEMO, 
  FUNNEL_STAGES_DEMO, 
  MARKETING_TREND_DEMO, 
  AI_MARKETING_INSIGHTS_DEMO, 
  MARKETING_OPPORTUNITIES_DEMO, 
  DIGITAL_PRESENCE_DEMO, 
  CAMPAIGNS_DEMO 
} from '../../data/marketingDemoData';
import { MarketingTimePeriod } from '../../types/marketing';

import { 
  Share2, 
  Calendar, 
  RefreshCw, 
  Database 
} from 'lucide-react';

export const MarketingModule: React.FC = () => {
  const [timePeriod, setTimePeriod] = useState<MarketingTimePeriod>('This Month');
  const [showEmptyState, setShowEmptyState] = useState<boolean>(false);

  const periods: MarketingTimePeriod[] = [
    'This Month',
    'Last Month',
    'Last 3 Months',
    'Last 6 Months'
  ];

  return (
    <div className="p-4 sm:p-8 space-y-8 max-w-7xl mx-auto selection:bg-emerald-500 selection:text-slate-950">
      
      {/* 1. Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl font-black text-white tracking-tight">Marketing Intelligence</h1>
            <span className="bg-emerald-500/10 text-emerald-400 text-xs font-bold px-2.5 py-0.5 rounded-full border border-emerald-500/30">
              Channel Workspace
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Understand which channels are creating attention, leads, and growth.
          </p>
        </div>

        {/* Time-Period Selector & Empty State Switcher */}
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <div className="flex items-center space-x-1 bg-slate-900 border border-slate-800 p-1.5 rounded-xl">
            <Calendar className="w-3.5 h-3.5 text-slate-400 ml-1.5" />
            {periods.map((p) => (
              <button
                key={p}
                onClick={() => setTimePeriod(p)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  timePeriod === p
                    ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-400'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowEmptyState(!showEmptyState)}
            className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold flex items-center space-x-1.5 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
            <span>{showEmptyState ? 'Show Demo Intelligence' : 'Simulate Empty State'}</span>
          </button>
        </div>
      </div>

      {showEmptyState ? (
        <MarketingEmptyState onSimulateData={() => setShowEmptyState(false)} />
      ) : (
        <>
          {/* 2. Marketing KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            {MARKETING_KPIS_DEMO.map((kpi) => (
              <MarketingKpiCard key={kpi.id} kpi={kpi} />
            ))}
          </div>

          {/* 3. Marketing Health Overview (78 / 100) */}
          <MarketingHealth health={MARKETING_HEALTH_DEMO} />

          {/* 4. Channel Performance Breakdown */}
          <ChannelPerformance channels={CHANNELS_PERFORMANCE_DEMO} />

          {/* 5. Marketing Acquisition Funnel */}
          <MarketingFunnel stages={FUNNEL_STAGES_DEMO} />

          {/* 6. Channel Comparison Recharts Visualization */}
          <ChannelComparison channels={CHANNELS_PERFORMANCE_DEMO} />

          {/* 7. Marketing Performance Trend Chart */}
          <MarketingTrendChart trendDataMap={MARKETING_TREND_DEMO} />

          {/* 8. AI Marketing Insights Panel */}
          <MarketingInsightPanel insights={AI_MARKETING_INSIGHTS_DEMO} />

          {/* 9. Marketing Growth Opportunities */}
          <MarketingOpportunity opportunities={MARKETING_OPPORTUNITIES_DEMO} />

          {/* 10. Digital Presence Status */}
          <DigitalPresence channels={DIGITAL_PRESENCE_DEMO} />

          {/* 11. Campaign Performance Table */}
          <CampaignTable campaigns={CAMPAIGNS_DEMO} />
        </>
      )}
    </div>
  );
};
