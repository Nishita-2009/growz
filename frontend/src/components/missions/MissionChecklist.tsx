import React from 'react';
import { MissionChecklistItem } from '../../types/missions';
import { MissionProgress } from './MissionProgress';
import { Check, Square } from 'lucide-react';

interface MissionChecklistProps {
  checklist: MissionChecklistItem[];
  onToggleItem: (itemId: string) => void;
}

export const MissionChecklist: React.FC<MissionChecklistProps> = ({
  checklist,
  onToggleItem,
}) => {
  const completedCount = checklist.filter((item) => item.completed).length;

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6 backdrop-blur-xl">
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
        <div>
          <h3 className="text-base font-extrabold text-white tracking-tight">Action Checklist</h3>
          <p className="text-xs text-slate-400">Step-by-step tasks to execute this growth mission</p>
        </div>
        
        <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
          {completedCount === checklist.length ? '100% Completed' : `${checklist.length - completedCount} Remaining`}
        </span>
      </div>

      {/* Progress Bar */}
      <MissionProgress completedCount={completedCount} totalCount={checklist.length} />

      {/* Checklist items */}
      <div className="space-y-2.5 pt-2">
        {checklist.map((item) => (
          <button
            key={item.id}
            onClick={() => onToggleItem(item.id)}
            className={`w-full flex items-center space-x-3.5 p-3.5 rounded-2xl border transition-all text-left group ${
              item.completed
                ? 'bg-emerald-500/10 border-emerald-500/30 text-slate-300'
                : 'bg-slate-950/70 border-slate-800/80 text-slate-200 hover:border-slate-700 hover:bg-slate-950'
            }`}
          >
            <div
              className={`h-5 w-5 rounded-lg flex items-center justify-center shrink-0 border transition-all ${
                item.completed
                  ? 'bg-emerald-500 border-emerald-400 text-slate-950 shadow-sm shadow-emerald-500/30'
                  : 'bg-slate-900 border-slate-700 group-hover:border-slate-500 text-transparent'
              }`}
            >
              <Check className="h-3.5 w-3.5 stroke-[3]" />
            </div>

            <span
              className={`text-xs font-semibold leading-relaxed transition-all ${
                item.completed ? 'line-through text-slate-400 font-normal' : 'text-slate-200'
              }`}
            >
              {item.text}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};
