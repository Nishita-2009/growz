import React from 'react';
import { Mission } from '../../types/missions';
import { CheckCircle2, Calendar, TrendingUp, ArrowRight, MessageSquareText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface MissionHistoryProps {
  completedMissions: Mission[];
}

export const MissionHistory: React.FC<MissionHistoryProps> = ({ completedMissions }) => {
  const navigate = useNavigate();

  if (completedMissions.length === 0) {
    return null;
  }

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6 backdrop-blur-xl">
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-white tracking-tight">Mission History</h2>
            <p className="text-xs text-slate-400">Archive of completed growth missions & recorded outcomes</p>
          </div>
        </div>

        <span className="text-xs font-bold text-teal-400 bg-teal-500/10 border border-teal-500/20 px-3 py-1 rounded-full">
          {completedMissions.length} Executed
        </span>
      </div>

      <div className="space-y-4">
        {completedMissions.map((mission) => {
          const res = mission.resultData;
          const resultRating = res?.resultRating || 'Improved';

          const ratingBadge = 
            resultRating === 'Improved'
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
              : resultRating === 'Declined'
              ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
              : 'bg-teal-500/10 text-teal-400 border-teal-500/20';

          return (
            <div
              key={mission.id}
              onClick={() => navigate(`/app/missions/${mission.id}`)}
              className="bg-slate-950/70 border border-slate-800/80 hover:border-teal-500/30 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300 space-y-3 cursor-pointer group"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-bold text-slate-400 bg-slate-900 border border-slate-800 px-2.5 py-0.5 rounded-md">
                    {mission.category}
                  </span>
                  <h3 className="text-sm font-bold text-white group-hover:text-teal-400 transition-colors">
                    {mission.title}
                  </h3>
                </div>

                <div className="flex items-center gap-3 text-xs">
                  {res?.completedDate && (
                    <span className="flex items-center gap-1 text-[11px] text-slate-400">
                      <Calendar className="h-3 w-3 text-slate-500" />
                      <span>{res.completedDate}</span>
                    </span>
                  )}

                  <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${ratingBadge}`}>
                    Result: {resultRating}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Goal</span>
                  <p className="text-slate-300 font-medium leading-relaxed">{mission.recommendedAction}</p>
                </div>

                {res?.impactSummary && (
                  <div className="space-y-1 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/60">
                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      Impact Recorded
                    </span>
                    <p className="text-slate-200 font-semibold">{res.impactSummary}</p>
                  </div>
                )}
              </div>

              {res?.userNotes && (
                <div className="flex items-start space-x-2 text-[11px] text-slate-400 bg-slate-900/40 p-2.5 rounded-xl border border-slate-800/40">
                  <MessageSquareText className="h-3.5 w-3.5 text-slate-500 shrink-0 mt-0.5" />
                  <span className="italic leading-relaxed">"{res.userNotes}"</span>
                </div>
              )}

              <div className="flex justify-end pt-1">
                <span className="text-[11px] font-semibold text-slate-400 group-hover:text-teal-400 flex items-center gap-1">
                  <span>View Details</span>
                  <ArrowRight className="h-3 w-3" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
