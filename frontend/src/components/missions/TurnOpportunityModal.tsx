import React, { useState } from 'react';
import { MissionCategory, MissionPriority } from '../../types/missions';
import { X, Sparkles, PlusCircle } from 'lucide-react';

interface TurnOpportunityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateMission: (
    title: string,
    category: MissionCategory,
    priority: MissionPriority,
    problem: string,
    action: string
  ) => void;
}

const PRESET_OPPORTUNITIES = [
  {
    title: 'Automate Lead Follow-Up Sequence',
    category: 'Marketing' as MissionCategory,
    priority: 'High' as MissionPriority,
    problem: '42% of website lead inquiries receive response after 24+ hours.',
    action: 'Set up instant automated SMS & Email drip sequence for new form submissions.'
  },
  {
    title: 'Clear Stagnant Warehouse Inventory',
    category: 'Inventory' as MissionCategory,
    priority: 'High' as MissionPriority,
    problem: 'Excess stock holding cost is eating 3.8% of monthly profit margin.',
    action: 'Run a 48-hour flash clearance bundle event for items with zero 60-day turnover.'
  },
  {
    title: 'Boost Checkout Conversion Rate',
    category: 'Revenue' as MissionCategory,
    priority: 'Medium' as MissionPriority,
    problem: 'High customer drop-off at checkout payment authorization step.',
    action: 'Integrate 1-click Apple Pay & Google Pay checkout options.'
  },
  {
    title: 'Implement Customer Loyalty Rewards',
    category: 'Customers' as MissionCategory,
    priority: 'High' as MissionPriority,
    problem: 'Repeat customer purchase frequency has dropped 5% quarter-over-quarter.',
    action: 'Launch VIP points program rewarding 2nd and 3rd purchase milestones.'
  }
];

export const TurnOpportunityModal: React.FC<TurnOpportunityModalProps> = ({
  isOpen,
  onClose,
  onCreateMission,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<MissionCategory>('Revenue');
  const [priority, setPriority] = useState<MissionPriority>('High');
  const [problem, setProblem] = useState('');
  const [action, setAction] = useState('');

  if (!isOpen) return null;

  const handleSelectPreset = (preset: typeof PRESET_OPPORTUNITIES[0]) => {
    setTitle(preset.title);
    setCategory(preset.category);
    setPriority(preset.priority);
    setProblem(preset.problem);
    setAction(preset.action);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !problem.trim() || !action.trim()) return;

    onCreateMission(title, category, priority, problem, action);
    setTitle('');
    setProblem('');
    setAction('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl space-y-6 relative max-h-[90vh] overflow-y-auto custom-scrollbar">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-white tracking-tight">Turn Opportunity into Mission</h3>
              <p className="text-xs text-slate-400">Convert detected insight into an actionable execution task</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Preset Opportunities */}
        <div className="space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 block">
            Select Detected Opportunity (Demo):
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {PRESET_OPPORTUNITIES.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectPreset(p)}
                className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-emerald-500/40 text-left transition-all space-y-1 group"
              >
                <div className="text-xs font-bold text-slate-200 group-hover:text-emerald-400 flex items-center justify-between">
                  <span className="truncate">{p.title}</span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
                    {p.category}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-1">{p.problem}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Custom Form */}
        <form onSubmit={handleSubmit} className="space-y-4 pt-2 border-t border-slate-800">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              Mission Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Launch Cart Abandonment Recovery Drip"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as MissionCategory)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500/50"
              >
                <option value="Revenue">Revenue</option>
                <option value="Customers">Customers</option>
                <option value="Marketing">Marketing</option>
                <option value="Inventory">Inventory</option>
                <option value="Profitability">Profitability</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as MissionPriority)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500/50"
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              Problem Statement
            </label>
            <textarea
              rows={2}
              required
              value={problem}
              onChange={(e) => setProblem(e.target.value)}
              placeholder="Describe the issue or drop in metric..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              Recommended Action
            </label>
            <textarea
              rows={2}
              required
              value={action}
              onChange={(e) => setAction(e.target.value)}
              placeholder="Describe the step-by-step action..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-slate-950 border border-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 hover:brightness-110 active:scale-95 transition-all flex items-center space-x-2"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Create Growth Mission</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
