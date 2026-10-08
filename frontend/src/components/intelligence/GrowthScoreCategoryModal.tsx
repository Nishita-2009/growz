import React from 'react';
import { GrowthCategoryResult } from '../../types/intelligence';
import { X, CheckCircle2, AlertTriangle, HelpCircle, ArrowRight, Database, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface GrowthScoreCategoryModalProps {
  category: GrowthCategoryResult | null;
  isOpen: boolean;
  onClose: () => void;
}

export const GrowthScoreCategoryModal: React.FC<GrowthScoreCategoryModalProps> = ({
  category,
  isOpen,
  onClose,
}) => {
  const navigate = useNavigate();

  if (!isOpen || !category) return null;

  const isInsufficient = category.score === null || category.status === 'Insufficient Data';

  const statusBadges: Record<string, { bg: string; text: string; border: string }> = {
    Excellent: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20' },
    Healthy: { bg: 'bg-teal-500/10', text: 'text-teal-400', border: 'border-teal-500/20' },
    'Needs Attention': { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20' },
    Critical: { bg: 'bg-rose-500/10', text: 'text-rose-400', border: 'border-rose-500/20' },
    'Insufficient Data': { bg: 'bg-slate-800', text: 'text-slate-400', border: 'border-slate-700' },
  };

  const badge = statusBadges[category.status] || statusBadges['Healthy'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl space-y-6 relative max-h-[90vh] overflow-y-auto custom-scrollbar">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="space-y-1">
            <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${badge.bg} ${badge.text} ${badge.border}`}>
              {category.status}
            </span>
            <h3 className="text-xl font-black text-white tracking-tight pt-1">
              {category.name} Analysis
            </h3>
          </div>

          <div className="flex items-center gap-3">
            {!isInsufficient && (
              <div className="text-right">
                <div className="text-2xl font-black text-white">{category.score}</div>
                <div className="text-[10px] text-slate-400">Score out of 100</div>
              </div>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Why the Score Exists */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block flex items-center gap-1.5">
            <HelpCircle className="h-4 w-4 text-emerald-400" />
            Why this score exists
          </span>
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 text-xs text-slate-200 leading-relaxed font-medium">
            {category.explanation}
          </div>
        </div>

        {/* Positive & Negative Signals */}
        {!isInsufficient && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Positive Signals */}
            {category.positiveSignals.length > 0 && (
              <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 space-y-2">
                <span className="text-[10px] font-extrabold text-emerald-400 uppercase tracking-wider block">
                  Positive Signals
                </span>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {category.positiveSignals.map((sig, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{sig}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Negative Signals */}
            {category.negativeSignals.length > 0 && (
              <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 space-y-2">
                <span className="text-[10px] font-extrabold text-amber-400 uppercase tracking-wider block">
                  Negative Signals
                </span>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {category.negativeSignals.map((sig, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <AlertTriangle className="h-3.5 w-3.5 text-amber-400 shrink-0 mt-0.5" />
                      <span>{sig}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Missing Data Info */}
        {category.missingData.length > 0 && (
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block flex items-center gap-1.5">
              <Database className="h-3.5 w-3.5 text-sky-400" />
              {isInsufficient ? 'Data Needed to Calculate' : 'Missing Data Points'}
            </span>
            <ul className="list-disc list-inside text-xs text-slate-400 space-y-1">
              {category.missingData.map((d, idx) => (
                <li key={idx}>{d}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Recommended Action Box */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/50 to-slate-950 border border-emerald-500/30 space-y-3">
          <div className="flex items-center space-x-2 text-xs font-bold text-emerald-400">
            <Sparkles className="h-4 w-4" />
            <span>Recommended Action</span>
          </div>
          <p className="text-xs text-slate-200 leading-relaxed font-medium">
            {category.recommendedAction}
          </p>
          <div className="pt-1 flex justify-end">
            <button
              onClick={() => {
                onClose();
                navigate('/app/missions');
              }}
              className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs shadow-md hover:brightness-110 transition-all flex items-center space-x-1.5"
            >
              <span>Explore Growth Missions</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
