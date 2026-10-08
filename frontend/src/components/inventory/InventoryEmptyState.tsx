import React from 'react';
import { Package, Database, ArrowRight } from 'lucide-react';

interface InventoryEmptyStateProps {
  onToggleDemo: () => void;
}

export const InventoryEmptyState: React.FC<InventoryEmptyStateProps> = ({ onToggleDemo }) => {
  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-12 shadow-2xl text-center space-y-6 backdrop-blur-xl max-w-2xl mx-auto">
      <div className="inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-slate-950 border border-slate-800 text-teal-400 mx-auto shadow-inner">
        <Package className="h-10 w-10 text-teal-400 stroke-[1.8]" />
      </div>

      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-white tracking-tight">
          Your inventory intelligence is waiting.
        </h2>
        <p className="text-slate-400 text-sm max-w-md mx-auto leading-relaxed">
          Connect your inventory or upload your product data to start discovering stock opportunities, low-stock safety warnings, and automated reorder alerts.
        </p>
      </div>

      <div className="pt-4 flex items-center justify-center gap-3">
        <button
          onClick={onToggleDemo}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 hover:brightness-110 transition-all flex items-center gap-2"
        >
          <span>Load Demo Inventory Intelligence</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
