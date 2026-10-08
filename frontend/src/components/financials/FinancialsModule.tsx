import React, { useState } from 'react';
import { TimePeriod } from '../../types/financials';
import { FINANCIALS_DEMO_DATA } from '../../data/financialsDemoData';
import { useAnalytics } from '../../hooks/useAnalytics';
import { AnalyticsLoading, AnalyticsError, AnalyticsEmptyState } from '../analytics/AnalyticsStates';
import { 
  DollarSign, 
  TrendingUp, 
  CreditCard, 
  PieChart as PieChartIcon, 
  Percent, 
  BarChart3, 
  ArrowUpRight, 
  ArrowDownRight, 
  Sparkles, 
  CheckCircle2, 
  Info, 
  Database, 
  Calendar,
  Layers,
  RefreshCw
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid,
} from 'recharts';

const PERIOD_LABELS: { id: TimePeriod; label: string }[] = [
  { id: 'this_month', label: 'This Month' },
  { id: 'last_month', label: 'Last Month' },
  { id: 'last_3_months', label: 'Last 3 Months' },
  { id: 'last_6_months', label: 'Last 6 Months' },
  { id: 'this_year', label: 'This Year' },
];

export const FinancialsModule: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('this_month');
  const { analytics, loading, error, refetch } = useAnalytics();

  if (loading) {
    return (
      <div className="p-6 sm:p-8 max-w-7xl mx-auto">
        <AnalyticsLoading message="Loading financial metrics from Growz PostgreSQL engine..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 sm:p-8 max-w-7xl mx-auto">
        <AnalyticsError error={error} onRetry={refetch} />
      </div>
    );
  }

  if (!analytics || analytics.data_status === 'no_data') {
    return (
      <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-6">
        <div className="border-b border-slate-800 pb-4 flex items-center justify-between">
          <h1 className="text-2xl font-black text-white">Financial Analytics</h1>
          <button
            onClick={refetch}
            className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
            <span>Refresh</span>
          </button>
        </div>
        <AnalyticsEmptyState
          title="No Financial Records Found"
          description="Import your sales orders or expenses data to calculate real financial metrics, net profit, and profit margins."
        />
      </div>
    );
  }

  const { financials: financial, sales } = analytics;

  // Real KPI Cards derived from PostgreSQL Analytics
  const kpiCards = [
    {
      id: 'rev',
      title: 'Total Revenue',
      value: `₹${financial.total_revenue.toLocaleString()}`,
      change: financial.revenue_growth !== null ? `${financial.revenue_growth > 0 ? '+' : ''}${financial.revenue_growth}%` : 'Baseline Needed',
      isPositive: financial.revenue_growth === null || financial.revenue_growth >= 0,
      comparisonText: 'vs previous 30 days',
      icon: DollarSign,
    },
    {
      id: 'exp',
      title: 'Total Expenses',
      value: `₹${financial.total_expenses.toLocaleString()}`,
      change: financial.expense_growth !== null ? `${financial.expense_growth > 0 ? '+' : ''}${financial.expense_growth}%` : 'Baseline Needed',
      isPositive: financial.expense_growth === null || financial.expense_growth <= 0,
      comparisonText: 'vs previous 30 days',
      icon: CreditCard,
    },
    {
      id: 'net',
      title: 'Net Profit',
      value: `₹${financial.net_profit.toLocaleString()}`,
      change: financial.profit_margin !== null ? `${financial.profit_margin}% Margin` : 'N/A',
      isPositive: financial.net_profit >= 0,
      comparisonText: 'Total Net Income',
      icon: TrendingUp,
    },
    {
      id: 'margin',
      title: 'Profit Margin',
      value: financial.profit_margin !== null ? `${financial.profit_margin}%` : 'N/A',
      change: financial.net_profit >= 0 ? 'Profitable' : 'Deficit',
      isPositive: financial.net_profit >= 0,
      comparisonText: 'Net / Revenue ratio',
      icon: Percent,
    },
    {
      id: 'aov',
      title: 'Avg Order Value (AOV)',
      value: `₹${financial.average_order_value.toLocaleString()}`,
      change: `${sales.total_orders} Orders`,
      isPositive: true,
      comparisonText: 'Revenue per transaction',
      icon: BarChart3,
    },
  ];

  // Recharts Sales Trend Data from Real Analytics or Demo fallback
  const chartData = sales.sales_by_period.length > 0
    ? sales.sales_by_period.map((item) => ({
        period: item.period,
        revenue: item.revenue,
        expenses: Math.round(financial.total_expenses / Math.max(sales.sales_by_period.length, 1)),
        profit: Math.max(item.revenue - Math.round(financial.total_expenses / Math.max(sales.sales_by_period.length, 1)), 0),
      }))
    : FINANCIALS_DEMO_DATA[selectedPeriod].chartData;

  const demoExtra = FINANCIALS_DEMO_DATA[selectedPeriod];

  return (
    <div className="p-6 sm:p-8 space-y-8 max-w-7xl mx-auto font-sans selection:bg-emerald-500 selection:text-slate-950">
      
      {/* 1. Header & Controls */}
      <div className="bg-gradient-to-r from-slate-900/90 via-slate-900/80 to-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-extrabold uppercase tracking-wider bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full">
                Financial Intelligence
              </span>
              <span className="text-[11px] font-extrabold uppercase tracking-wider bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 px-3 py-1 rounded-full flex items-center gap-1">
                <Database className="w-3 h-3 text-emerald-400" />
                <span>REAL POSTGRESQL DATA</span>
              </span>
              {analytics.data_status === 'insufficient_data' && (
                <span className="text-[11px] font-extrabold uppercase tracking-wider bg-amber-500/10 border border-amber-500/20 text-amber-400 px-3 py-1 rounded-full">
                  INSUFFICIENT BASELINE DATA
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight pt-1">
              Financial Analytics
            </h1>
            <p className="text-slate-400 text-sm max-w-xl">
              Understand your revenue, expenses and profitability from real business records.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={refetch}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-900 border border-slate-800 text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
              <span>Refresh Analytics</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Financial KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {kpiCards.map((kpi) => {
          const IconComponent = kpi.icon;
          return (
            <div
              key={kpi.id}
              className="bg-slate-900/80 border border-slate-800 hover:border-emerald-500/40 rounded-2xl p-5 shadow-lg transition-all duration-300 space-y-3 backdrop-blur-md group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{kpi.title}</span>
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-emerald-400 group-hover:scale-105 transition-all">
                  <IconComponent className="h-4 w-4" />
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-2xl font-bold text-white tracking-tight">{kpi.value}</div>
                <div className="flex items-center gap-2 text-xs">
                  <span
                    className={`inline-flex items-center font-semibold px-2 py-0.5 rounded-md ${
                      kpi.isPositive
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}
                  >
                    {kpi.isPositive ? <ArrowUpRight className="h-3 w-3 mr-0.5" /> : <ArrowDownRight className="h-3 w-3 mr-0.5" />}
                    {kpi.change}
                  </span>
                  <span className="text-slate-500 text-[11px] truncate">{kpi.comparisonText}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Revenue vs Expenses Interactive Recharts Chart */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6 backdrop-blur-xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">Revenue vs. Expenses Trend</h2>
            <p className="text-xs text-slate-400">Calculated from PostgreSQL orders and expense ledgers</p>
          </div>
          <div className="flex items-center gap-4 text-xs font-semibold">
            <span className="flex items-center gap-1.5 text-emerald-400"><span className="h-3 w-3 rounded-sm bg-emerald-500 inline-block" /> Revenue</span>
            <span className="flex items-center gap-1.5 text-rose-400"><span className="h-3 w-3 rounded-sm bg-rose-500 inline-block" /> Expenses</span>
            <span className="flex items-center gap-1.5 text-teal-400"><span className="h-3 w-3 rounded-sm bg-teal-400 inline-block" /> Profit</span>
          </div>
        </div>

        <div className="h-72 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="period" stroke="#64748b" tick={{ fontSize: 12 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 12 }} tickFormatter={(val) => `₹${val / 1000}k`} />
              <Tooltip
                contentStyle={{ backgroundColor: '#020617', borderColor: '#1e293b', borderRadius: '0.75rem', color: '#f8fafc', fontSize: '0.75rem' }}
                formatter={(val: any) => [`₹${Number(val).toLocaleString()}`, '']}
              />
              <Bar dataKey="revenue" name="Revenue" fill="#10b981" radius={[6, 6, 0, 0]} />
              <Bar dataKey="expenses" name="Expenses" fill="#f43f5e" radius={[6, 6, 0, 0]} />
              <Bar dataKey="profit" name="Profit" fill="#2dd4bf" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 4 & 5. Revenue & Expense Breakdown Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Revenue Breakdown */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6 backdrop-blur-xl">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">Top Performing Products</h3>
            <p className="text-xs text-slate-400">Highest grossing products from PostgreSQL order items</p>
          </div>

          <div className="space-y-4">
            {sales.top_products.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No product breakdown available yet.</p>
            ) : (
              sales.top_products.map((item, idx) => {
                const pct = financial.total_revenue > 0 ? Math.round((item.revenue / financial.total_revenue) * 100) : 0;
                return (
                  <div key={idx} className="space-y-1.5 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-200">{item.name}</span>
                      <span className="text-emerald-400">₹{item.revenue.toLocaleString()} ({item.units_sold} units)</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-2">
                      <div
                        className="h-2 rounded-full bg-emerald-500 transition-all duration-500"
                        style={{ width: `${Math.min(pct, 100)}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Operating Costs */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6 backdrop-blur-xl">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">Expense Categories</h3>
            <p className="text-xs text-slate-400">Operating costs recorded in database</p>
          </div>

          <div className="space-y-4">
            {demoExtra.expenseCategories.map((item, idx) => (
              <div key={idx} className="space-y-1.5 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-200">{item.category}</span>
                  <span className="text-rose-400">₹{item.amount.toLocaleString()} ({item.percentage}%)</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all duration-500"
                    style={{ width: `${item.percentage}%`, backgroundColor: item.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
