import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, ArrowLeft, Home } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full bg-slate-900/90 border border-slate-800 rounded-3xl p-8 shadow-2xl text-center space-y-6 backdrop-blur-xl">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 mx-auto">
          <AlertCircle className="h-8 w-8 stroke-[2.2]" />
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold text-white tracking-tight">404 - Page Not Found</h1>
          <p className="text-slate-400 text-xs leading-relaxed">
            The requested Growz route does not exist or has been moved.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => navigate('/app')}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 hover:brightness-110 transition-all flex items-center justify-center gap-2"
          >
            <Home className="h-4 w-4" />
            <span>Go to Growz Overview</span>
          </button>
        </div>
      </div>
    </div>
  );
};
