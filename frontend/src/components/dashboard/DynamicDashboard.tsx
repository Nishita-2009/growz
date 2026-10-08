import React from 'react';
import { useBusinessProfileStore } from '../../stores/useBusinessProfileStore';
import { useIntelligenceStore } from '../../stores/useIntelligenceStore';
import { getDashboardConfig } from '../../lib/dashboardConfig';
import { GrowthScoreCard } from '../intelligence/GrowthScoreCard';
import { OpportunitiesSection } from '../intelligence/OpportunitiesSection';
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

export const DynamicDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { profile } = useBusinessProfileStore();
  const { growthScoreResult, opportunities } = useIntelligenceStore();
  const config = getDashboardConfig(profile);

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
                Focus: {config.primaryFocus}
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
              {growthScoreResult.overallScore}
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Growth Index</div>
              <div className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">
                {growthScoreResult.overallScore >= 80 ? 'Excellent Growth' : 'Strong Health'}
              </div>
              <div className="text-[11px] text-emerald-400 flex items-center gap-1 mt-0.5 font-medium">
                <Sparkles className="h-3 w-3" />
                <span>{opportunities.length} Opportunities Detected</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Key Performance Indicators (KPIs) */}
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

                <div className="space-y-1">
                  <div className="text-2xl font-bold text-white tracking-tight">{kpi.value}</div>
                  <div className="flex items-center gap-2 text-xs">
                    <span
                      className={`inline-flex items-center font-semibold px-2 py-0.5 rounded-md ${
                        kpi.isPositive
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      }`}
                    >
                      {kpi.isPositive ? <ArrowUpRight className="h-3 w-3 mr-0.5" /> : <ArrowDownRight className="h-3 w-3 mr-0.5" />}
                      {kpi.change}
                    </span>
                    <span className="text-slate-500 text-[11px]">{kpi.period}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Reusable Growth Score Engine Card */}
      <GrowthScoreCard growthScore={growthScoreResult} />

      {/* 4. Top Strengths & Areas Needing Attention */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top Strengths */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4 backdrop-blur-xl">
          <div className="flex items-center space-x-2 text-emerald-400 border-b border-slate-800/80 pb-3">
            <CheckCircle2 className="h-5 w-5" />
            <h3 className="text-base font-extrabold text-white">Top Strengths</h3>
          </div>

          <div className="space-y-3">
            {growthScoreResult.strengths.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No specific strengths calculated yet.</p>
            ) : (
              growthScoreResult.strengths.map((str, idx) => (
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
            {growthScoreResult.weaknesses.length === 0 ? (
              <p className="text-xs text-slate-400 italic">All audited categories are operating at optimum health.</p>
            ) : (
              growthScoreResult.weaknesses.map((weak, idx) => (
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
      <OpportunitiesSection opportunities={opportunities} />

      {/* 6. Recommended Growth Missions Overview */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-5 backdrop-blur-xl">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <Target className="h-4 w-4 text-emerald-400" />
              <span>Recommended Growth Missions</span>
            </h3>
            <p className="text-xs text-slate-400">Actionable execution plans for {profile.businessName || 'your business'}</p>
          </div>
          
          <button
            onClick={() => navigate('/app/missions')}
            className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition-colors"
          >
            <span>Open Missions Engine</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="space-y-4">
          {config.growthMissions.map((mission) => (
            <div
              key={mission.id}
              onClick={() => navigate('/app/missions')}
              className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 hover:border-emerald-500/30 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group cursor-pointer"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-md">
                    {mission.category}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-800 text-slate-300 px-2 py-0.5 rounded-md">
                    Impact: {mission.impact}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-800 text-slate-400 px-2 py-0.5 rounded-md">
                    Effort: {mission.effort}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">{mission.title}</h4>
                <p className="text-xs text-slate-400">{mission.description}</p>
              </div>

              <button className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500/40 text-emerald-400 text-xs font-semibold flex items-center gap-1 whitespace-nowrap transition-all shrink-0">
                <span>Start Mission</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
