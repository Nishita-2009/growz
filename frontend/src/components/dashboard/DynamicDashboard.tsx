import { useIntelligence } from '../../hooks/useIntelligence';

import { useBusinessProfileStore } from '../../stores/useBusinessProfileStore';
import { useIntelligenceStore } from '../../stores/useIntelligenceStore';
import { useMissionsStore } from '../../stores/useMissionsStore';
import { getDashboardConfig } from '../../lib/dashboardConfig';
import { GrowthScoreCard } from '../intelligence/GrowthScoreCard';
import { OpportunitiesSection } from '../intelligence/OpportunitiesSection';
import { AskGrowzAISection } from '../ai/AskGrowzAISection';
import { useAnalytics } from '../../hooks/useAnalytics';
import { 
  DollarSign, 
  ShoppingBag, 
  Users, 
  TrendingUp, 
  Package, 
  Utensils, 
  Calendar, 
  Factory, 
  PieChart, 
  Share2, 
  Target, 
  Sparkles, 
  ArrowUpRight, 
  ArrowDownRight, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle,
  Clock,
  Zap,
  ChevronRight,
  TrendingDown,
  ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Icon Map Helper
const IconMap: Record<string, React.FC<{ className?: string }>> = {
  DollarSign,
  ShoppingBag,
  Users,
  TrendingUp,
  Package,
  Utensils,
  Calendar,
  Factory,
  PieChart,
  Share2,
  Target
};

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

export const DynamicDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { profile } = useBusinessProfileStore();
  const { intelligence } = useIntelligence();
  const { analytics } = useAnalytics();
  const storeMissions = useMissionsStore((state) => state.missions);
  const turnOpportunityIntoMission = useMissionsStore((state) => state.turnOpportunityIntoMission);
  const config = getDashboardConfig(profile);

  // Real Growth Score from backend if available
  const realScoreVal = intelligence?.growth_score?.overall_score ?? null;
  const rawOpps = intelligence?.opportunities || [];

  const realOpportunities = rawOpps.map((opp) => ({
    id: opp.id,
    title: opp.title,
    category: opp.category as any,
    priority: (opp.priority.charAt(0).toUpperCase() + opp.priority.slice(1)) as any,
    problem: opp.problem,
    evidence: opp.evidence,
    recommendedAction: opp.recommended_action,
    expectedImpact: opp.expected_impact,
    difficulty: (opp.difficulty.charAt(0).toUpperCase() + opp.difficulty.slice(1)) as any,
    confidence: `${Math.round(opp.confidence * 100)}%`,
    relatedModule: opp.related_module as any
  }));

  const realGrowthScoreObj = {
    overallScore: intelligence?.growth_score?.overall_score ?? 0,
    dataCompleteness: Math.round((intelligence?.growth_score?.confidence ?? 0) * 100),
    categories: (intelligence?.growth_score?.categories || []).map((c) => ({
      name: c.category as any,
      score: c.score,
      status: (c.status.charAt(0).toUpperCase() + c.status.slice(1)) as any,
      explanation: c.explanation,
      availableData: [c.explanation],
      missingData: [],
      positiveSignals: [c.explanation],
      negativeSignals: [],
      recommendedAction: c.explanation
    })),
    strengths: (intelligence?.growth_score?.categories || [])
      .filter((c) => c.score !== null && c.score >= 75)
      .map((c) => ({
        name: c.category as any,
        score: c.score!,
        status: (c.status.charAt(0).toUpperCase() + c.status.slice(1)) as any,
        explanation: c.explanation,
        availableData: [c.explanation],
        missingData: [],
        positiveSignals: [c.explanation],
        negativeSignals: [],
        recommendedAction: c.explanation
      })),
    weaknesses: (intelligence?.growth_score?.categories || [])
      .filter((c) => c.score === null || c.score < 70)
      .map((c) => ({
        name: c.category as any,
        score: c.score,
        status: (c.status.charAt(0).toUpperCase() + c.status.slice(1)) as any,
        explanation: c.explanation,
        availableData: [],
        missingData: [c.explanation],
        positiveSignals: [],
        negativeSignals: [c.explanation],
        recommendedAction: c.explanation
      }))
  };


  // Function to override KPI card values with real PostgreSQL metrics if available
  const getRealKpiValue = (kpiId: string, defaultValue: string) => {
    if (!analytics || analytics.data_status === 'no_data') return defaultValue;

    if (kpiId === 'monthly-revenue' || kpiId === 'mrr' || kpiId === 'gross-revenue') {
      return formatCurrency(analytics.financials.total_revenue);
    }
    if (kpiId === 'net-margin' || kpiId === 'profit-margin') {
      return analytics.financials.profit_margin !== null ? `${analytics.financials.profit_margin.toFixed(1)}%` : defaultValue;
    }
    if (kpiId === 'aov' || kpiId === 'avg-order-val') {
      return formatCurrency(analytics.financials.average_order_value);
    }
    if (kpiId === 'total-customers' || kpiId === 'active-users' || kpiId === 'client-count') {
      return formatNumber(analytics.customers.total_customers);
    }
    if (kpiId === 'repeat-rate' || kpiId === 'retention-rate') {
      return analytics.customers.repeat_customer_rate !== null ? `${analytics.customers.repeat_customer_rate.toFixed(1)}%` : defaultValue;
    }
    if (kpiId === 'low-stock' || kpiId === 'low-stock-count') {
      return `${formatNumber(analytics.inventory.low_stock_count)} Items`;
    }
    if (kpiId === 'inventory-value' || kpiId === 'working-capital') {
      return formatCurrency(analytics.inventory.total_inventory_value);
    }
    if (kpiId === 'marketing-roas' || kpiId === 'roas') {
      return analytics.marketing.roas !== null ? `${analytics.marketing.roas.toFixed(2)}x` : defaultValue;
    }
    return defaultValue;
  };

  return (
    <div className="p-6 sm:p-8 space-y-8 max-w-7xl mx-auto font-sans selection:bg-emerald-500 selection:text-slate-950">
      
      {/* 1. Welcome Header & Business Badge */}
      <div className="bg-gradient-to-r from-slate-900/90 via-slate-900/80 to-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full">
                {config.businessType} Enterprise
              </span>
              <span className="text-xs font-semibold uppercase tracking-wider bg-slate-800 text-slate-300 px-3 py-1 rounded-full">
                {analytics?.data_status === 'sufficient_data' ? 'Database Connected' : `Focus: ${config.primaryFocus}`}
              </span>

            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight pt-1">
              {config.title}
            </h1>
            <p className="text-slate-400 text-sm max-w-2xl leading-relaxed">
              {config.welcomeMessage}
            </p>
          </div>

          <div 
            onClick={() => navigate('/app/opportunities')}
            className="bg-slate-950/80 border border-slate-800 p-4 rounded-2xl flex items-center gap-4 shadow-inner cursor-pointer hover:border-emerald-500/40 transition-all group"
          >
            <div className="relative h-14 w-14 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-black text-xl shadow-lg shadow-emerald-500/20">
              {realScoreVal !== null ? realScoreVal : '--'}
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Growth Index</div>
              <div className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">
                {realScoreVal === null ? 'Insufficient Data' : realScoreVal >= 80 ? 'Excellent Growth' : realScoreVal >= 60 ? 'Healthy Growth' : 'Attention Needed'}
              </div>
              <div className="text-[11px] text-emerald-400 flex items-center gap-1 mt-0.5 font-medium">
                <Sparkles className="h-3 w-3" />
                <span>{realOpportunities.length} Opportunities Detected</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Ask Growz AI Advisor Section */}
      <AskGrowzAISection />

      {/* 3. Key Performance Indicators (KPIs) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">Key Performance Indicators</h2>
            <p className="text-xs text-slate-400">Prioritized for {config.primaryFocus}</p>
          </div>
          <span className="text-xs font-medium text-slate-400">{config.kpiCards.length} Metrics Configured</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {config.kpiCards.map((kpi) => {
            const IconComponent = IconMap[kpi.iconName] || DollarSign;
            const displayValue = getRealKpiValue(kpi.id, kpi.value);

            return (
              <div
                key={kpi.id}
                className="bg-slate-900/80 border border-slate-800 hover:border-emerald-500/40 rounded-2xl p-5 shadow-lg transition-all duration-300 space-y-3 group backdrop-blur-md"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{kpi.title}</span>
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-emerald-400 group-hover:scale-105 transition-all">
                    <IconComponent className="h-4 w-4" />
                  </div>
                </div>

                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-black text-white tracking-tight">{displayValue}</span>
                  <span
                    className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full ${
                      kpi.isPositive
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    }`}
                  >
                    {kpi.isPositive ? (
                      <ArrowUpRight className="h-3 w-3" />
                    ) : (
                      <ArrowDownRight className="h-3 w-3" />
                    )}
                    {kpi.change}
                  </span>
                </div>

                <div className="text-[11px] text-slate-400 border-t border-slate-800/80 pt-2 flex items-center justify-between">
                  <span>{(kpi as any).target ? `Target: ${(kpi as any).target}` : 'Live Analytics'}</span>
                  <span className="font-semibold text-slate-400">{kpi.period}</span>
                </div>

              </div>
            );
          })}
        </div>
      </div>


      {/* 3. Reusable Growth Score Engine Card */}
      <GrowthScoreCard growthScore={realGrowthScoreObj} />

      {/* 4. Top Strengths & Areas Needing Attention */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top Strengths */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4 backdrop-blur-xl">
          <div className="flex items-center space-x-2 text-emerald-400 border-b border-slate-800/80 pb-3">
            <CheckCircle2 className="h-5 w-5" />
            <h3 className="text-base font-extrabold text-white">Top Strengths</h3>
          </div>

          <div className="space-y-3">
            {realGrowthScoreObj.strengths.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No specific strengths calculated yet.</p>
            ) : (
              realGrowthScoreObj.strengths.map((str: any, idx: number) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-200">{str.name}</span>
                    <span className="text-emerald-400">{str.score}/100</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-snug">{str.explanation}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Areas Needing Attention */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4 backdrop-blur-xl">
          <div className="flex items-center space-x-2 text-amber-400 border-b border-slate-800/80 pb-3">
            <AlertCircle className="h-5 w-5" />
            <h3 className="text-base font-extrabold text-white">Areas Needing Attention</h3>
          </div>

          <div className="space-y-3">
            {realGrowthScoreObj.weaknesses.length === 0 ? (
              <p className="text-xs text-slate-400 italic">All audited categories are operating at optimum health.</p>
            ) : (
              realGrowthScoreObj.weaknesses.map((weak: any, idx: number) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-200">{weak.name}</span>
                    <span className={weak.score === null ? 'text-amber-400' : 'text-rose-400'}>
                      {weak.score !== null ? `${weak.score}/100` : 'Missing Data'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-snug">{weak.explanation}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* 5. Opportunity Detector Section */}
      <OpportunitiesSection opportunities={realOpportunities as any} />

      {/* 6. Your Next Growth Mission / Recommended Growth Missions Overview */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-5 backdrop-blur-xl">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <Target className="h-4 w-4 text-emerald-400" />
              <span>Your Next Growth Mission</span>
            </h3>
            <p className="text-xs text-slate-400">Prioritized execution plan derived from live business intelligence</p>
          </div>
          
          <button
            onClick={() => navigate('/app/missions')}
            className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition-colors"
          >
            <span>Open Missions Engine</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        {(() => {
          // Find highest priority opportunity that hasn't been converted or pick top uncompleted mission
          const highestPriorityOpp = rawOpps.find((opp) => 
            !storeMissions.some((m) => m.sourceOpportunityId === opp.id || (m.title === opp.title && m.problem === opp.problem))
          );

          if (highestPriorityOpp) {
            return (
              <div
                onClick={() => {
                  const created = turnOpportunityIntoMission(
                    highestPriorityOpp.title,
                    highestPriorityOpp.category as any,
                    highestPriorityOpp.priority as any,
                    highestPriorityOpp.problem,
                    highestPriorityOpp.recommended_action,
                    highestPriorityOpp.evidence,
                    highestPriorityOpp.expected_impact,
                    highestPriorityOpp.difficulty,
                    `${Math.round(highestPriorityOpp.confidence * 100)}%`,
                    highestPriorityOpp.id
                  );
                  navigate(`/app/missions/${created.id}`);
                }}
                className="p-5 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-emerald-500/30 hover:border-emerald-500/60 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group cursor-pointer shadow-lg shadow-emerald-500/5"
              >
                <div className="space-y-1.5 max-w-2xl">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider bg-rose-500/10 border border-rose-500/20 text-rose-400 px-2.5 py-0.5 rounded-full">
                      {highestPriorityOpp.priority} PRIORITY
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 px-2.5 py-0.5 rounded-full">
                      {highestPriorityOpp.category}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-800 text-slate-300 px-2.5 py-0.5 rounded-full">
                      Impact: {highestPriorityOpp.expected_impact}
                    </span>
                  </div>
                  <h4 className="text-base font-extrabold text-white group-hover:text-emerald-400 transition-colors">
                    {highestPriorityOpp.title}
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    <strong className="text-emerald-400">Why it matters:</strong> {highestPriorityOpp.problem}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    <strong className="text-slate-300 font-semibold">Evidence:</strong> "{highestPriorityOpp.evidence}"
                  </p>
                </div>

                <button className="px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 hover:brightness-110 active:scale-95 transition-all flex items-center gap-1.5 shrink-0">
                  <Zap className="h-4 w-4 fill-slate-950" />
                  <span>Start Mission</span>
                </button>
              </div>
            );
          }

          // Fallback to active store missions if no new opp
          const nextActiveMission = storeMissions.find((m) => m.status !== 'Completed') || storeMissions[0];
          if (nextActiveMission) {
            return (
              <div
                onClick={() => navigate(`/app/missions/${nextActiveMission.id}`)}
                className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800/80 hover:border-emerald-500/30 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group cursor-pointer"
              >
                <div className="space-y-1.5 max-w-2xl">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-md">
                      {nextActiveMission.category}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-800 text-slate-300 px-2 py-0.5 rounded-md">
                      Status: {nextActiveMission.status}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">{nextActiveMission.title}</h4>
                  <p className="text-xs text-slate-400">{nextActiveMission.whyItMatters || nextActiveMission.problem}</p>
                </div>

                <button className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500/40 text-emerald-400 text-xs font-semibold flex items-center gap-1 whitespace-nowrap transition-all shrink-0">
                  <span>Continue Mission</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            );
          }

          return <p className="text-xs text-slate-400 italic">No missions available. Connect data to discover new growth opportunities.</p>;
        })()}
      </div>

    </div>
  );
};
