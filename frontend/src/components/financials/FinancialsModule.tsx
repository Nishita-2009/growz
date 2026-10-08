import React, { useState } from 'react';
import { TimePeriod } from '../../types/financials';
import { FINANCIALS_DEMO_DATA } from '../../data/financialsDemoData';
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
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2, 
  HelpCircle, 
  Info, 
  Database, 
  Calendar,
  Layers
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  CartesianGrid,
  AreaChart,
  Area
} from 'recharts';

const IconMap: Record<string, React.FC<{ className?: string }>> = {
  DollarSign,
  TrendingUp,
  CreditCard,
  PieChart: PieChartIcon,
  Percent,
  BarChart3
};

const PERIOD_LABELS: { id: TimePeriod; label: string }[] = [
  { id: 'this_month', label: 'This Month' },
  { id: 'last_month', label: 'Last Month' },
  { id: 'last_3_months', label: 'Last 3 Months' },
  { id: 'last_6_months', label: 'Last 6 Months' },
  { id: 'this_year', label: 'This Year' },
];

export const FinancialsModule: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('this_month');
  const [isEmptyState, setIsEmptyState] = useState<boolean>(false);

  const data = FINANCIALS_DEMO_DATA[selectedPeriod];

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
              <span className="text-[11px] font-extrabold uppercase tracking-wider bg-amber-500/10 border border-amber-500/20 text-amber-400 px-3 py-1 rounded-full">
                DEMO DATA MODE
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight pt-1">
              Financial Analytics
            </h1>
            <p className="text-slate-400 text-sm max-w-xl">
              Understand your revenue, expenses and profitability.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Toggle Demo vs Empty State */}
            <button
              onClick={() => setIsEmptyState(!isEmptyState)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
                isEmptyState
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {isEmptyState ? 'Switch to Demo Data' : 'Simulate Empty State'}
            </button>
          </div>
        </div>

        {/* Time Period Selector */}
        {!isEmptyState && (
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800/80">
            <span className="text-xs font-semibold text-slate-400 mr-2 flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-emerald-400" />
              <span>Time Period:</span>
            </span>
            {PERIOD_LABELS.map((p) => (
              <button
                key={p.id}
                onClick={() => setSelectedPeriod(p.id)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                  selectedPeriod === p.id
                    ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 shadow-sm shadow-emerald-500/10'
                    : 'bg-slate-950 border border-slate-800/80 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 9. REUSABLE EMPTY DATA STATE */}
      {isEmptyState ? (
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-12 shadow-2xl text-center space-y-6 backdrop-blur-xl max-w-2xl mx-auto">
          <div className="inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-slate-950 border border-slate-800 text-amber-400 mx-auto shadow-inner">
            <Database className="h-10 w-10 text-amber-400 stroke-[1.8]" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Not enough financial data yet.
            </h2>
            <p className="text-slate-400 text-sm max-w-md mx-auto leading-relaxed">
              Connect your sales and expense data to unlock financial intelligence, profit margin auditing, and automated cash flow forecasting.
            </p>
          </div>

          <div className="pt-4 flex items-center justify-center gap-3">
            <button
              onClick={() => setIsEmptyState(false)}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 hover:brightness-110 transition-all"
            >
              Load Demo Financial Analytics
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* 2. Financial KPI Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.metrics.map((kpi) => {
              const IconComponent = IconMap[kpi.iconName] || DollarSign;
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
                <p className="text-xs text-slate-400">Comparing total income, cost of operations, and net profit over time</p>
              </div>
              <div className="flex items-center gap-4 text-xs font-semibold">
                <span className="flex items-center gap-1.5 text-emerald-400"><span className="h-3 w-3 rounded-sm bg-emerald-500 inline-block" /> Revenue</span>
                <span className="flex items-center gap-1.5 text-rose-400"><span className="h-3 w-3 rounded-sm bg-rose-500 inline-block" /> Expenses</span>
                <span className="flex items-center gap-1.5 text-teal-400"><span className="h-3 w-3 rounded-sm bg-teal-400 inline-block" /> Profit</span>
              </div>
            </div>

            <div className="h-72 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
                <h3 className="text-base font-bold text-white tracking-tight">Revenue Breakdown</h3>
                <p className="text-xs text-slate-400">Distribution by main product lines & sales channels</p>
              </div>

              <div className="space-y-4">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">By Sales Channel</span>
                {data.revenueByChannel.map((item, idx) => (
                  <div key={idx} className="space-y-1.5 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-200">{item.name}</span>
                      <span className="text-emerald-400">₹{item.value.toLocaleString()} ({item.percentage}%)</span>
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

            {/* Expense Breakdown */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6 backdrop-blur-xl">
              <div>
                <h3 className="text-base font-bold text-white tracking-tight">Expense Breakdown</h3>
                <p className="text-xs text-slate-400">Major operating cost categories & percentage contributions</p>
              </div>

              <div className="space-y-4">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Operating Costs</span>
                {data.expenseCategories.map((item, idx) => (
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

          {/* 6. Profitability Section & What's Happening Explanation */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Profit Metrics */}
            <div className="lg:col-span-2 bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6 backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white tracking-tight">Profitability Metrics</h3>
                  <p className="text-xs text-slate-400">Gross vs Net Margin calculations</p>
                </div>
                <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
                  DEMO DATA
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Gross Profit</span>
                  <span className="text-lg font-extrabold text-white block">{data.profitability.grossProfit}</span>
                </div>
                <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Gross Margin</span>
                  <span className="text-lg font-extrabold text-emerald-400 block">{data.profitability.grossMargin}</span>
                </div>
                <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Net Profit</span>
                  <span className="text-lg font-extrabold text-white block">{data.profitability.netProfit}</span>
                </div>
                <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Net Margin</span>
                  <span className="text-lg font-extrabold text-emerald-400 block">{data.profitability.netMargin}</span>
                </div>
              </div>

              {/* What's Happening Box */}
              <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                  <Info className="h-4 w-4 shrink-0" />
                  <span>What's Happening?</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {data.profitability.explanation}
                </p>
              </div>
            </div>

            {/* 8. Financial Health Status */}
            <div className="lg:col-span-1 bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6 backdrop-blur-xl flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-white tracking-tight">Financial Health</h3>
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
                    {data.health.status} ({data.health.score}/100)
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-6 w-6 text-emerald-400 shrink-0" />
                    <div>
                      <div className="text-sm font-bold text-white">Status: {data.health.status}</div>
                      <div className="text-xs text-slate-400">Based on cash reserve & margin benchmarks</div>
                    </div>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed pt-2 border-t border-slate-800">
                    {data.health.reason}
                  </p>
                </div>
              </div>

              <div className="pt-4 text-[11px] text-slate-500 text-center italic">
                Demo state indicator • Real audit unlocks with API connection
              </div>
            </div>

          </div>

          {/* 7. Financial Insights Panel (AI-Style) */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">AI Financial Insights</h3>
                  <p className="text-xs text-slate-400">Automated diagnostic breakdown based on financial trends</p>
                </div>
              </div>
              <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
                AI Diagnostic
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block">WHAT CHANGED</span>
                <p className="text-xs text-slate-300 leading-relaxed font-medium">
                  {data.aiInsight.whatChanged}
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-400 block">WHY IT MATTERS</span>
                <p className="text-xs text-slate-300 leading-relaxed font-medium">
                  {data.aiInsight.whyItMatters}
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 block">RECOMMENDED ACTION</span>
                <p className="text-xs text-slate-300 leading-relaxed font-medium">
                  {data.aiInsight.recommendedAction}
                </p>
              </div>
            </div>
          </div>

        </>
      )}

    </div>
  );
};
