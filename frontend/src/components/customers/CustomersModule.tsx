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
import { CustomerSegment } from '../../types/customers';

import { 
  Users, 
  Search, 
  Filter, 
  Sparkles, 
  Info, 
  Database, 
  RefreshCw 
} from 'lucide-react';

export const CustomersModule: React.FC = () => {
  const [selectedSegment, setSelectedSegment] = useState<CustomerSegment>('All Customers');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showEmptyState, setShowEmptyState] = useState<boolean>(false);

  const segmentOptions: CustomerSegment[] = [
    'All Customers',
    'New',
    'Returning',
    'High Value',
    'At Risk',
    'Inactive'
  ];

  return (
    <div className="p-4 sm:p-8 space-y-8 max-w-7xl mx-auto selection:bg-emerald-500 selection:text-slate-950">
      
      {/* 1. Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl font-black text-white tracking-tight">Customers & CRM</h1>
            <span className="bg-emerald-500/10 text-emerald-400 text-xs font-bold px-2.5 py-0.5 rounded-full border border-emerald-500/30">
              Customer Intelligence
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Understand who your customers are, what they buy, and who needs your attention.
          </p>
        </div>

        {/* Demo Data / Empty State Switcher for testing */}
        <div className="flex items-center space-x-3 shrink-0">
          <button
            onClick={() => setShowEmptyState(!showEmptyState)}
            className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold flex items-center space-x-1.5 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
            <span>{showEmptyState ? 'Show Demo Intelligence' : 'Simulate Empty State'}</span>
          </button>

          <div className="hidden sm:flex items-center space-x-1 text-[11px] bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl text-slate-400">
            <Database className="w-3.5 h-3.5 text-teal-400" />
            <span>DEMO MODE ACTIVE</span>
          </div>
        </div>
      </div>

      {showEmptyState ? (
        <CustomerEmptyState onSimulateData={() => setShowEmptyState(false)} />
      ) : (
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
            {CUSTOMER_KPIS_DEMO.map((kpi) => (
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

          {/* 6. Customer Value Section ("Who drives your revenue?") */}
          <CustomerValueSection revenueDrivers={REVENUE_DRIVERS_DEMO} />

          {/* 7. Retention Intelligence (Recharts Trend) */}
          <RetentionChart retentionData={RETENTION_TREND_DEMO} />

          {/* 8. At-Risk Customers */}
          <AtRiskCustomers atRiskCustomers={AT_RISK_CUSTOMERS_DEMO} />

          {/* 9. AI Customer Insights Panel */}
          <CustomerInsightPanel insights={AI_CUSTOMER_INSIGHTS_DEMO} />

          {/* 10. Customer Opportunity */}
          <CustomerOpportunity opportunity={CUSTOMER_OPPORTUNITY_DEMO} />
        </>
      )}
    </div>
  );
};
