import React from 'react';

interface MissionProgressProps {
  completedCount: number;
  totalCount: number;
  showLabel?: boolean;
}

export const MissionProgress: React.FC<MissionProgressProps> = ({
  completedCount,
  totalCount,
  showLabel = true,
}) => {
  const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="space-y-1.5 w-full">
      {showLabel && (
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-400 font-medium">
            Progress: <strong className="text-slate-200">{completedCount} / {totalCount} completed</strong>
          </span>
          <span className="text-emerald-400 font-bold font-mono">
            {percentage}%
          </span>
        </div>
      )}
      
      <div className="w-full bg-slate-950 border border-slate-800 rounded-full h-2 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
