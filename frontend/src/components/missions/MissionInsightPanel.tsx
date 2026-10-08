import React from 'react';
import { MissionInsight } from '../../types/missions';
import { Sparkles, ShieldCheck, FileText, Lightbulb, Target, AlertCircle } from 'lucide-react';

interface MissionInsightPanelProps {
  insight: MissionInsight;
}

export const MissionInsightPanel: React.FC<MissionInsightPanelProps> = ({ insight }) => {
  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6 backdrop-blur-xl">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-white tracking-tight">Why This Mission?</h3>
            <p className="text-xs text-slate-400">AI reasoning & structured diagnostic breakdown</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Confidence: {insight.confidence}</span>
          </span>
          <span className="text-xs font-bold text-purple-400 bg-purple-500/10 border border-purple-500/20 px-3 py-1 rounded-full">
            AI Intelligence
          </span>
        </div>
      </div>

      {/* Facts vs Recommendations indicator */}
      <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-[11px] text-slate-400">
        <span className="font-bold text-white uppercase tracking-wider text-[10px]">Data Audit:</span>
        <span className="flex items-center gap-1 text-sky-400 font-semibold">
          <FileText className="h-3 w-3" /> Facts (Observed Metrics)
        </span>
        <span className="text-slate-600">•</span>
        <span className="flex items-center gap-1 text-emerald-400 font-semibold">
          <Lightbulb className="h-3 w-3" /> Recommendations (AI Suggestions)
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* PROBLEM - FACT */}
        <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-rose-400 block">
              PROBLEM
            </span>
            <span className="text-[9px] font-extrabold uppercase tracking-wider bg-rose-500/10 text-rose-400 px-2 py-0.5 rounded border border-rose-500/20">
              FACT / DIAGNOSTIC
            </span>
          </div>
          <p className="text-xs text-slate-200 leading-relaxed font-medium">
            {insight.problem}
          </p>
        </div>

        {/* EVIDENCE - FACT */}
        <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-sky-400 block">
              EVIDENCE
            </span>
            <span className="text-[9px] font-extrabold uppercase tracking-wider bg-sky-500/10 text-sky-400 px-2 py-0.5 rounded border border-sky-500/20">
              OBSERVED METRIC
            </span>
          </div>
          <p className="text-xs text-slate-200 leading-relaxed font-medium">
            {insight.evidence}
          </p>
        </div>

        {/* REASONING - RECOMMENDATION */}
        <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-400 block">
              REASONING
            </span>
            <span className="text-[9px] font-extrabold uppercase tracking-wider bg-purple-500/10 text-purple-400 px-2 py-0.5 rounded border border-purple-500/20">
              AI MODEL LOGIC
            </span>
          </div>
          <p className="text-xs text-slate-200 leading-relaxed font-medium">
            {insight.reasoning}
          </p>
        </div>

        {/* ACTION - RECOMMENDATION */}
        <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-400 block">
              RECOMMENDED ACTION
            </span>
            <span className="text-[9px] font-extrabold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20">
              ACTIONABLE RECOMMENDATION
            </span>
          </div>
          <p className="text-xs text-slate-200 leading-relaxed font-medium">
            {insight.action}
          </p>
        </div>
      </div>

      {/* EXPECTED IMPACT */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/40 to-slate-950 border border-emerald-500/30 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-teal-400 flex items-center gap-1">
            <Target className="h-3.5 w-3.5" />
            EXPECTED IMPACT (ESTIMATE)
          </span>
          <span className="text-[10px] text-slate-500 italic flex items-center gap-1">
            <AlertCircle className="h-3 w-3" /> Benchmark Estimate
          </span>
        </div>
        <p className="text-xs text-slate-200 font-semibold leading-relaxed">
          {insight.expectedImpact}
        </p>
      </div>
    </div>
  );
};
