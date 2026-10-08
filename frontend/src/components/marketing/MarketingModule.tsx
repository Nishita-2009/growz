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

import { useAnalytics } from '../../hooks/useAnalytics';
import { AnalyticsLoading, AnalyticsError, AnalyticsEmptyState } from '../analytics/AnalyticsStates';
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
import { MarketingTimePeriod, MarketingKpi } from '../../types/marketing';

import { 
  Calendar, 
  RefreshCw, 
  Database 
} from 'lucide-react';

const formatCurrency = (val: number | null) => {
  if (val === null || val === undefined) return '$0';
  return `$${val.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
};

const formatNumber = (val: number | null) => {
  if (val === null || val === undefined) return '0';
  return val.toLocaleString('en-US');
};

const formatPercent = (val: number | null) => {
  if (val === null || val === undefined) return '0%';
  return `${val >= 0 ? '+' : ''}${val.toFixed(1)}%`;
};

export const MarketingModule: React.FC = () => {
  const { analytics, loading, error, refetch } = useAnalytics();
  const [timePeriod, setTimePeriod] = useState<MarketingTimePeriod>('This Month');

  const periods: MarketingTimePeriod[] = [
    'This Month',
    'Last Month',
    'Last 3 Months',
    'Last 6 Months'
  ];

  if (loading) {
    return (
      <div className="p-4 sm:p-8 max-w-7xl mx-auto">
        <AnalyticsLoading message="Calculating marketing ROI and campaign performance..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 sm:p-8 max-w-7xl mx-auto">
        <AnalyticsError message={error} onRetry={refetch} />
      </div>
    );
  }

  if (analytics?.data_status === 'no_data') {
    return (
      <div className="p-4 sm:p-8 max-w-7xl mx-auto">
        <AnalyticsEmptyState
          title="No Marketing Data Found"
          message="Upload campaign spend logs, lead captures, and channel metrics to measure ROAS, conversion funnels, and customer acquisition costs."
        />
      </div>
    );
  }

  const mData = analytics?.marketing;
  const realKpis: MarketingKpi[] = mData ? [
    {
      id: 'mkt-spend',
      title: 'Marketing Spend',
      value: formatCurrency(mData.total_spend),
      change: '$0.00',
      isPositive: true,
      indicator: 'total invested',
      iconName: 'DollarSign'
    },
    {
      id: 'mkt-leads',
      title: 'Leads Generated',
      value: formatNumber(mData.total_leads),
      change: '+0',
      isPositive: true,
      indicator: 'prospects',
      iconName: 'Target'
    },
    {
      id: 'mkt-conversions',
      title: 'Conversions',
      value: formatNumber(mData.total_conversions),
      change: '+0',
      isPositive: true,
      indicator: 'closed sales',
      iconName: 'TrendingUp'
    },
    {
      id: 'mkt-conv-rate',
      title: 'Conversion Rate',
      value: mData.conversion_rate !== null ? `${mData.conversion_rate.toFixed(1)}%` : '0%',
      change: '0.0%',
      isPositive: true,
      indicator: 'lead conversion',
      iconName: 'Percent'
    },
    {
      id: 'mkt-rev',
      title: 'Marketing Revenue',
      value: formatCurrency(mData.marketing_attributed_revenue),
      change: '$0.00',
      isPositive: true,
      indicator: 'attributed sales',
      iconName: 'BarChart'
    },
    {
      id: 'mkt-roas',
      title: 'ROAS',
      value: mData.roas !== null ? `${mData.roas.toFixed(2)}x` : '0.00x',
      change: '0.0x',
      isPositive: (mData.roas ?? 0) >= 1,
      indicator: 'return on ad spend',
      iconName: 'Zap'
    }
  ] : MARKETING_KPIS_DEMO;

  return (
    <div className="p-4 sm:p-8 space-y-8 max-w-7xl mx-auto selection:bg-emerald-500 selection:text-slate-950">
      
      {/* 1. Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl font-black text-white tracking-tight">Marketing Intelligence</h1>
            <span className="bg-emerald-500/10 text-emerald-400 text-xs font-bold px-2.5 py-0.5 rounded-full border border-emerald-500/30">
              {analytics?.data_status === 'sufficient_data' ? 'Live Database' : 'Insufficient Data Baseline'}
            </span>

          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Understand which channels are creating attention, leads, and growth.
          </p>
        </div>

        {/* Time-Period Selector & Refresh Button */}
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
            onClick={refetch}
            className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold flex items-center space-x-1.5 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
            <span>Refresh Analytics</span>
          </button>
        </div>
      </div>

      <>
        {/* 2. Marketing KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {realKpis.map((kpi) => (
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
    </div>
  );
};

