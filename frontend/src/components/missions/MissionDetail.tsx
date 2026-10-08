import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMissionsStore } from '../../stores/useMissionsStore';
import { MissionChecklist } from './MissionChecklist';
import { MissionResult } from './MissionResult';
import { MissionInsightPanel } from './MissionInsightPanel';
import { 
  ArrowLeft, 
  Play, 
  Pause, 
  CheckCircle2, 
  Clock, 
  Gauge, 
  Sparkles, 
  AlertTriangle, 
  Info,
  HelpCircle,
  Flame,
  ShieldCheck,
  X
} from 'lucide-react';
import { MissionStatus, MissionPriority } from '../../types/missions';

export const MissionDetail: React.FC = () => {
  const { missionId } = useParams<{ missionId: string }>();
  const navigate = useNavigate();

  const { missions, updateMissionStatus, toggleChecklistItem, saveMissionResult } = useMissionsStore();
  const [showCompleteConfirm, setShowCompleteConfirm] = useState(false);

  const mission = missions.find((m) => m.id === missionId);

  if (!mission) {
    return (
      <div className="p-8 max-w-4xl mx-auto space-y-6 text-center">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 space-y-4">
          <AlertTriangle className="h-12 w-12 text-amber-400 mx-auto" />
          <h2 className="text-xl font-bold text-white">Mission Not Found</h2>
          <p className="text-slate-400 text-xs">The requested growth mission ID does not exist or was removed.</p>
          <button
            onClick={() => navigate('/app/missions')}
            className="px-5 py-2.5 bg-emerald-500 text-slate-950 font-bold rounded-xl text-xs hover:brightness-110 transition-all inline-flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Growth Missions</span>
          </button>
        </div>
      </div>
    );
  }

  const priorityStyles: Record<MissionPriority, { bg: string; text: string; border: string }> = {
    High: { bg: 'bg-rose-500/10', text: 'text-rose-400', border: 'border-rose-500/30' },
    Medium: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/30' },
    Low: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/30' },
  };

  const statusStyles: Record<MissionStatus, { bg: string; text: string; border: string }> = {
    Recommended: { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/30' },
    'Not Started': { bg: 'bg-slate-800/80', text: 'text-slate-300', border: 'border-slate-700' },
    'In Progress': { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30' },
    Completed: { bg: 'bg-teal-500/10', text: 'text-teal-400', border: 'border-teal-500/30' },
    Paused: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/30' },
  };

  const pStyle = priorityStyles[mission.priority];
  const sStyle = statusStyles[mission.status];

  const handleStartMission = () => {
    updateMissionStatus(mission.id, 'In Progress');
  };

  const handlePauseMission = () => {
    updateMissionStatus(mission.id, 'Paused');
  };

  const handleConfirmComplete = () => {
    updateMissionStatus(mission.id, 'Completed');
    setShowCompleteConfirm(false);
  };

  return (
    <div className="p-6 sm:p-8 space-y-8 max-w-6xl mx-auto font-sans">
      
      {/* Navigation & Header */}
      <div className="space-y-4">
        <button
          onClick={() => navigate('/app/missions')}
          className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-400 hover:text-emerald-400 transition-colors bg-slate-900/80 border border-slate-800 px-3.5 py-2 rounded-xl"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to All Missions</span>
        </button>

        <div className="bg-gradient-to-r from-slate-900/90 via-slate-900/80 to-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className={`text-xs font-extrabold uppercase tracking-wider px-3 py-1 rounded-full border ${pStyle.bg} ${pStyle.text} ${pStyle.border}`}>
                {mission.priority} Priority
              </span>
              <span className="text-xs font-bold text-slate-300 bg-slate-950 px-3 py-1 rounded-full border border-slate-800">
                {mission.category}
              </span>
              <span className={`text-xs font-bold px-3 py-1 rounded-full border ${sStyle.bg} ${sStyle.text} ${sStyle.border}`}>
                Status: {mission.status}
              </span>
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-400">
              <span className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-xl">
                <Gauge className="h-4 w-4 text-amber-400" />
                <span>Difficulty: <strong className="text-white">{mission.difficulty}</strong></span>
              </span>
              <span className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-xl">
                <Clock className="h-4 w-4 text-teal-400" />
                <span>Est. Time: <strong className="text-white">{mission.estimatedTime}</strong></span>
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              {mission.title}
            </h1>
            <p className="text-slate-300 text-sm max-w-3xl leading-relaxed">
              <strong className="text-emerald-400">Recommended Action:</strong> {mission.recommendedAction}
            </p>
          </div>

          {/* Action Buttons: Start, Pause, Complete */}
          <div className="pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {mission.status !== 'In Progress' && mission.status !== 'Completed' && (
                <button
                  onClick={handleStartMission}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 hover:brightness-110 active:scale-95 transition-all flex items-center space-x-2"
                >
                  <Play className="h-4 w-4 fill-slate-950" />
                  <span>Start Mission</span>
                </button>
              )}

              {mission.status === 'In Progress' && (
                <button
                  onClick={handlePauseMission}
                  className="px-5 py-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500/20 font-bold text-xs transition-all flex items-center space-x-2"
                >
                  <Pause className="h-4 w-4" />
                  <span>Pause Mission</span>
                </button>
              )}

              {mission.status !== 'Completed' && (
                <button
                  onClick={() => setShowCompleteConfirm(true)}
                  className="px-5 py-2.5 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-400 hover:bg-teal-500/20 font-bold text-xs transition-all flex items-center space-x-2"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Complete Mission</span>
                </button>
              )}

              {mission.status === 'Completed' && (
                <span className="text-xs font-bold text-teal-400 bg-teal-500/15 border border-teal-500/30 px-4 py-2 rounded-xl flex items-center space-x-2">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Mission Completed</span>
                </span>
              )}
            </div>

            <div className="text-xs text-slate-400 flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-emerald-400" />
              <span>Expected Impact: <strong className="text-slate-200">{mission.expectedImpact}</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* Why Growz Recommended This & Key Diagnostics */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6 backdrop-blur-xl">
        <div className="flex items-center space-x-3 border-b border-slate-800/80 pb-4">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <HelpCircle className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-white">Why Growz Recommended This</h2>
            <p className="text-xs text-slate-400">Diagnostic context and empirical data indicators</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-2">
            <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider block">Problem</span>
            <p className="text-xs text-slate-300 leading-relaxed font-medium">{mission.problem}</p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-2">
            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">Evidence</span>
            <p className="text-xs text-slate-300 leading-relaxed font-medium">{mission.evidence}</p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-2">
            <span className="text-[10px] font-bold text-teal-400 uppercase tracking-wider block">AI Reasoning</span>
            <p className="text-xs text-slate-300 leading-relaxed font-medium">{mission.aiReasoning}</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 flex items-start space-x-3">
          <Info className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <span className="font-bold text-slate-200 block">Why it matters:</span>
            <p className="text-slate-400 leading-relaxed">{mission.whyItMatters}</p>
          </div>
        </div>
      </div>

      {/* Action Checklist Component */}
      <MissionChecklist
        checklist={mission.checklist}
        onToggleItem={(itemId) => toggleChecklistItem(mission.id, itemId)}
      />

      {/* Measure Results Component (Shown when Completed or when editing results) */}
      <MissionResult
        initialResultData={mission.resultData}
        onSaveResult={(resultData) => saveMissionResult(mission.id, resultData)}
      />

      {/* AI Mission Insight Panel */}
      <MissionInsightPanel insight={mission.insight} />

      {/* Confirmation Dialog for Completing Mission */}
      {showCompleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-teal-400" />
                Complete Growth Mission?
              </h3>
              <button
                onClick={() => setShowCompleteConfirm(false)}
                className="p-1 rounded text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Are you sure you want to mark <strong className="text-white">"{mission.title}"</strong> as completed? You will be prompted to record the before/after results to train your Growz intelligence.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowCompleteConfirm(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-slate-950 border border-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmComplete}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-950 font-bold text-xs shadow-md shadow-teal-500/20 hover:brightness-110 transition-all"
              >
                Confirm Completion
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
