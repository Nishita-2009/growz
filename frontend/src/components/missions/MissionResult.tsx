import React, { useState } from 'react';
import { MissionResultData, MissionResultRating } from '../../types/missions';
import { BarChart3, Save, Sparkles, CheckCircle2 } from 'lucide-react';

interface MissionResultProps {
  initialResultData?: MissionResultData;
  onSaveResult: (resultData: MissionResultData) => void;
}

export const MissionResult: React.FC<MissionResultProps> = ({
  initialResultData,
  onSaveResult,
}) => {
  const [beforeValue, setBeforeValue] = useState(initialResultData?.beforeValue || '');
  const [afterValue, setAfterValue] = useState(initialResultData?.afterValue || '');
  const [resultRating, setResultRating] = useState<MissionResultRating>(
    initialResultData?.resultRating || 'Improved'
  );
  const [userNotes, setUserNotes] = useState(initialResultData?.userNotes || '');
  const [isSaved, setIsSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let impactSummary = initialResultData?.impactSummary || '';
    if (beforeValue && afterValue) {
      impactSummary = `Changed from ${beforeValue} to ${afterValue}`;
    } else if (resultRating) {
      impactSummary = `Result rated as: ${resultRating}`;
    }

    onSaveResult({
      beforeValue,
      afterValue,
      resultRating,
      userNotes,
      completedDate: initialResultData?.completedDate || new Date().toISOString().split('T')[0],
      impactSummary,
    });

    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6 backdrop-blur-xl">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
            <BarChart3 className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-white tracking-tight">Measure Results</h3>
            <p className="text-xs text-slate-400">Did this action work? Track the outcome to train your Growz intelligence.</p>
          </div>
        </div>

        <span className="text-xs font-bold text-teal-400 bg-teal-500/10 border border-teal-500/20 px-3 py-1 rounded-full flex items-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Outcome Measurement</span>
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Before field */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              Before Metric Value
            </label>
            <input
              type="text"
              value={beforeValue}
              onChange={(e) => setBeforeValue(e.target.value)}
              placeholder="e.g. Repeat customer rate = 21%"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/50 transition-all"
            />
          </div>

          {/* After field */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              After Metric Value
            </label>
            <input
              type="text"
              value={afterValue}
              onChange={(e) => setAfterValue(e.target.value)}
              placeholder="e.g. Repeat customer rate = 25%"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/50 transition-all"
            />
          </div>
        </div>

        {/* Result dropdown */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
            Overall Result
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {(['Improved', 'No Significant Change', 'Declined', 'Unknown'] as MissionResultRating[]).map((rating) => (
              <button
                type="button"
                key={rating}
                onClick={() => setResultRating(rating)}
                className={`px-3 py-2.5 rounded-xl text-xs font-semibold border transition-all text-center ${
                  resultRating === rating
                    ? rating === 'Improved'
                      ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400'
                      : rating === 'Declined'
                      ? 'bg-rose-500/15 border-rose-500/40 text-rose-400'
                      : 'bg-teal-500/15 border-teal-500/40 text-teal-400'
                    : 'bg-slate-950/70 border-slate-800/80 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                {rating}
              </button>
            ))}
          </div>
        </div>

        {/* Short Note: What happened? */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
            What happened? (Short Note)
          </label>
          <textarea
            rows={3}
            value={userNotes}
            onChange={(e) => setUserNotes(e.target.value)}
            placeholder="Record what worked, customer feedback, or operational learnings..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/50 transition-all leading-relaxed"
          />
        </div>

        <div className="p-3.5 rounded-2xl bg-teal-500/5 border border-teal-500/20 text-[11px] text-slate-400 leading-relaxed">
          💡 <strong>Growth Learning Loop:</strong> Growz will use this recorded outcome to refine future mission recommendations for your business model.
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-end gap-3 pt-2">
          {isSaved && (
            <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 animate-fadeIn">
              <CheckCircle2 className="h-4 w-4" />
              <span>Result saved successfully!</span>
            </span>
          )}
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-950 font-bold text-xs shadow-md shadow-teal-500/20 hover:brightness-110 active:scale-95 transition-all flex items-center space-x-2"
          >
            <Save className="h-4 w-4" />
            <span>Save Mission Result</span>
          </button>
        </div>
      </form>
    </div>
  );
};
