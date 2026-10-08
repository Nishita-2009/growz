import React from 'react';
import { Megaphone, Share2, ArrowRight } from 'lucide-react';

interface MarketingEmptyStateProps {
  onSimulateData?: () => void;
}

export const MarketingEmptyState: React.FC<MarketingEmptyStateProps> = ({ onSimulateData }) => {
  return (
    <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-12 backdrop-blur-sm text-center max-w-2xl mx-auto my-12 space-y-6">
      
      {/* Icon Badge */}
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500/20 to-teal-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400 shadow-xl shadow-emerald-500/10">
        <Share2 className="w-8 h-8" />
      </div>

      {/* Main Copy */}
      <div className="space-y-2">
        <h3 className="text-2xl font-black text-white tracking-tight">Your marketing intelligence is waiting.</h3>
        <p className="text-sm text-slate-400 leading-relaxed max-w-md mx-auto">
          Connect your marketing channels to understand where your customers come from and which activities drive growth.
        </p>
      </div>

      {/* CTA Button */}
      <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          onClick={() => {}}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-bold text-sm hover:opacity-95 transition-all shadow-lg shadow-emerald-500/20 flex items-center space-x-2 cursor-not-allowed opacity-80"
          title="Channel connections available in upcoming API integration"
        >
          <Megaphone className="w-4 h-4" />
          <span>Connect Marketing Channels</span>
        </button>

        {onSimulateData && (
          <button
            onClick={onSimulateData}
            className="px-5 py-3 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 font-semibold text-xs hover:bg-slate-700 transition-colors flex items-center space-x-1.5"
          >
            <span>Load Demo Marketing Dataset</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      <div className="text-[11px] text-slate-500 pt-4 border-t border-slate-800/60 max-w-sm mx-auto">
        Supports Instagram, Facebook, Google Business, Meta Ads, Google Ads & WhatsApp.
      </div>
    </div>
  );
};
