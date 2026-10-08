import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Database, AlertCircle, RefreshCw, Upload } from 'lucide-react';

export interface AnalyticsLoadingProps {
  message?: string;
}

export const AnalyticsLoading: React.FC<AnalyticsLoadingProps> = ({
  message = 'Fetching real business analytics from Growz database...',
}) => {
  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-12 shadow-2xl text-center space-y-4 backdrop-blur-xl max-w-xl mx-auto my-8">
      <div className="relative inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-950 border border-slate-800 text-emerald-400 mx-auto">
        <RefreshCw className="h-8 w-8 animate-spin text-emerald-400" />
      </div>
      <div className="space-y-1">
        <h3 className="text-lg font-bold text-white tracking-tight">Calculating Metrics</h3>
        <p className="text-xs text-slate-400 max-w-sm mx-auto">{message}</p>
      </div>
    </div>
  );
};

export interface AnalyticsErrorProps {
  message?: string;
  error?: string;
  onRetry: () => void;
}

export const AnalyticsError: React.FC<AnalyticsErrorProps> = ({ message, error, onRetry }) => {
  const displayMsg = message || error || 'Failed to communicate with Growz analytics backend.';

  return (
    <div className="bg-slate-900/80 border border-rose-500/30 rounded-3xl p-8 shadow-2xl text-center space-y-4 backdrop-blur-xl max-w-xl mx-auto my-8">
      <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 mx-auto">
        <AlertCircle className="h-8 w-8 text-rose-400" />
      </div>
      <div className="space-y-1">
        <h3 className="text-lg font-bold text-white tracking-tight">Unable to Load Analytics</h3>
        <p className="text-xs text-slate-400 max-w-md mx-auto">{displayMsg}</p>
      </div>
      <button
        onClick={onRetry}
        className="px-5 py-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 hover:bg-rose-500/20 font-semibold text-xs transition-all inline-flex items-center space-x-2"
      >
        <RefreshCw className="w-3.5 h-3.5" />
        <span>Retry Analytics Fetch</span>
      </button>
    </div>
  );
};

export interface AnalyticsEmptyStateProps {
  title?: string;
  message?: string;
  description?: string;
}

export const AnalyticsEmptyState: React.FC<AnalyticsEmptyStateProps> = ({
  title = 'No business data available yet.',
  message,
  description = 'Upload your customers, orders, products, or expenses data to unlock real business analytics calculated from PostgreSQL.',
}) => {
  const navigate = useNavigate();
  const displayDesc = message || description;

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-12 shadow-2xl text-center space-y-6 backdrop-blur-xl max-w-2xl mx-auto my-8">
      <div className="inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-slate-950 border border-slate-800 text-emerald-400 mx-auto shadow-inner">
        <Database className="h-10 w-10 text-emerald-400 stroke-[1.8]" />
      </div>

      <div className="space-y-2">
        <h2 className="text-2xl font-extrabold text-white tracking-tight">{title}</h2>
        <p className="text-slate-400 text-sm max-w-md mx-auto leading-relaxed">{displayDesc}</p>
      </div>

      <div className="pt-2 flex items-center justify-center gap-3">
        <button
          onClick={() => navigate('/app/data')}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 hover:brightness-110 transition-all flex items-center space-x-2"
        >
          <Upload className="w-4 h-4" />
          <span>Upload Business Data</span>
        </button>
      </div>
    </div>
  );
};

