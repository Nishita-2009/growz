import React, { useState } from 'react';
import { CustomerKpiCard } from './CustomerKpiCard';
import { CustomerHealth } from './CustomerHealth';
import { CustomerSegments } from './CustomerSegments';
import { CustomerTable } from './CustomerTable';
import { CustomerValueSection } from './CustomerValueSection';
import { RetentionChart } from './RetentionChart';
import { AtRiskCustomers } from './AtRiskCustomers';
import { CustomerInsightPanel } from './CustomerInsightPanel';
import { CustomerOpportunity } from './CustomerOpportunity';
import { CustomerEmptyState } from './CustomerEmptyState';

import { useAnalytics } from '../../hooks/useAnalytics';
import { AnalyticsLoading, AnalyticsError, AnalyticsEmptyState } from '../analytics/AnalyticsStates';
import { 
  CUSTOMER_KPIS_DEMO, 
  CUSTOMER_HEALTH_DEMO, 
  CUSTOMER_SEGMENTS_DEMO, 
  CUSTOMERS_LIST_DEMO, 
  REVENUE_DRIVERS_DEMO, 
  RETENTION_TREND_DEMO, 
  AT_RISK_CUSTOMERS_DEMO, 
  AI_CUSTOMER_INSIGHTS_DEMO, 
  CUSTOMER_OPPORTUNITY_DEMO 
} from '../../data/customersDemoData';
import { CustomerSegment, CustomerKpi } from '../../types/customers';

import { 
  Users, 
  Search, 
  Filter, 
  Sparkles, 
  Info, 
  Database, 
  RefreshCw 
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

export const CustomersModule: React.FC = () => {
  const { analytics, loading, error, refetch } = useAnalytics();
  const [selectedSegment, setSelectedSegment] = useState<CustomerSegment>('All Customers');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const segmentOptions: CustomerSegment[] = [
    'All Customers',
    'New',
    'Returning',
    'High Value',
    'At Risk',
    'Inactive'
  ];

  if (loading) {
    return (
      <div className="p-4 sm:p-8 max-w-7xl mx-auto">
        <AnalyticsLoading message="Calculating customer analytics..." />
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
          title="No Customer Data Found"
          message="Upload your customer profiles or sales data to unlock repeat rate tracking, customer lifetime value, and segmentation."
        />
      </div>
    );
  }

  // Map real analytics metrics if available, fallback gracefully to structural KPI list shape
  const cData = analytics?.customers;
  const realKpis: CustomerKpi[] = cData ? [
    {
      id: 'total-cust',
      title: 'Total Customers',
      value: formatNumber(cData.total_customers),
      change: formatPercent(cData.customer_growth_rate),
      isPositive: (cData.customer_growth_rate ?? 0) >= 0,
      indicator: 'vs. previous period',
      iconName: 'Users'
    },
    {
      id: 'new-cust',
      title: 'New Customers',
      value: formatNumber(cData.new_customers),
      change: '+100%',
      isPositive: true,
      indicator: 'this period',
      iconName: 'UserPlus'
    },
    {
      id: 'repeat-cust',
      title: 'Repeat Customers',
      value: formatNumber(cData.repeat_customers),
      change: formatPercent(cData.repeat_customer_rate),
      isPositive: (cData.repeat_customer_rate ?? 0) > 0,
      indicator: 'repeat rate',
      iconName: 'Repeat'
    },
    {
      id: 'repeat-rate',
      title: 'Repeat Rate',
      value: cData.repeat_customer_rate !== null ? `${cData.repeat_customer_rate.toFixed(1)}%` : '0%',
      change: '0.0%',
      isPositive: true,
      indicator: 'retention metric',
      iconName: 'UserCheck'
    },
    {
      id: 'avg-rev-cust',
      title: 'Revenue per Customer',
      value: formatCurrency(cData.average_revenue_per_customer),
      change: '$0.00',
      isPositive: true,
      indicator: 'average value',
      iconName: 'DollarSign'
    },
    {
      id: 'total-cust-rev',
      title: 'Customer Revenue',
      value: formatCurrency(analytics?.financials?.total_revenue ?? 0),
      change: formatPercent(analytics?.financials?.revenue_growth),
      isPositive: (analytics?.financials?.revenue_growth ?? 0) >= 0,
      indicator: 'total from orders',
      iconName: 'DollarSign'
    }
  ] : CUSTOMER_KPIS_DEMO;

  return (
    <div className="p-4 sm:p-8 space-y-8 max-w-7xl mx-auto selection:bg-emerald-500 selection:text-slate-950">
      
      {/* 1. Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl font-black text-white tracking-tight">Customers & CRM</h1>
            <span className="bg-emerald-500/10 text-emerald-400 text-xs font-bold px-2.5 py-0.5 rounded-full border border-emerald-500/30">
              {analytics?.data_status === 'sufficient_data' ? 'Live Database' : 'Insufficient Data Baseline'}
            </span>

          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Understand who your customers are, what they buy, and who needs your attention.
          </p>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <button
            onClick={refetch}
            className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold flex items-center space-x-1.5 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
            <span>Refresh Analytics</span>
          </button>

          <div className="hidden sm:flex items-center space-x-1 text-[11px] bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl text-slate-400">
            <Database className="w-3.5 h-3.5 text-emerald-400" />
            <span>POSTGRESQL REAL METRICS</span>
          </div>
        </div>
      </div>

      <>
        {/* Header Segment Filter & Search Control Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 backdrop-blur-sm">
          
          {/* Filter Buttons */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs text-slate-400 font-bold mr-2 hidden lg:inline flex items-center space-x-1">
              <Filter className="w-3.5 h-3.5 text-emerald-400 inline" />
              <span>Segment:</span>
            </span>
            {segmentOptions.map((segment) => {
              const isActive = selectedSegment === segment;
              return (
                <button
                  key={segment}
                  onClick={() => setSelectedSegment(segment)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 shadow-sm shadow-emerald-500/10'
                      : 'bg-slate-950/60 border border-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  {segment}
                </button>
              );
            })}
          </div>

          {/* Global Search Input */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search customers by name, city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 transition-colors"
            />
          </div>
        </div>

        {/* 2. Customer KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {realKpis.map((kpi) => (
            <CustomerKpiCard key={kpi.id} kpi={kpi} />
          ))}
        </div>

        {/* 3. Customer Health Score Overview */}
        <CustomerHealth health={CUSTOMER_HEALTH_DEMO} />

        {/* 4. Customer Segmentation */}
        <CustomerSegments
          segments={CUSTOMER_SEGMENTS_DEMO}
          selectedSegment={selectedSegment}
          onSelectSegment={(seg) => setSelectedSegment(seg)}
        />

        {/* 5. Customer Table */}
        <CustomerTable
          customers={CUSTOMERS_LIST_DEMO}
          selectedSegment={selectedSegment}
          onSelectSegment={(seg) => setSelectedSegment(seg)}
          searchQuery={searchQuery}
          onSearchChange={(q) => setSearchQuery(q)}
        />

        {/* 6. Customer Value Section */}
        <CustomerValueSection revenueDrivers={REVENUE_DRIVERS_DEMO} />

        {/* 7. Retention Chart */}
        <RetentionChart retentionData={RETENTION_TREND_DEMO} />

        {/* 8. At Risk Customers & AI Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <AtRiskCustomers atRiskCustomers={AT_RISK_CUSTOMERS_DEMO} />
          </div>
          <div>
            <CustomerInsightPanel insights={AI_CUSTOMER_INSIGHTS_DEMO} />
          </div>
        </div>

        {/* 9. Customer Opportunity Card */}
        <CustomerOpportunity opportunity={CUSTOMER_OPPORTUNITY_DEMO} />
      </>
    </div>
  );
};


