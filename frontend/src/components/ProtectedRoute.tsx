import React from 'react';
import { useAuthStore } from '../stores/useAuthStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, fallback }) => {
  // TODO: Restore authentication guard before production.
  // Temporarily bypass auth check for local development:
  return <>{children}</>;

  /*
  const { firebaseUser, userProfile, loading } = useAuthStore();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-900 text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (!firebaseUser || !userProfile) {
    return fallback ? <>{fallback}</> : (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 text-slate-100 p-4">
        <div className="max-w-md w-full bg-slate-900 p-8 rounded-xl border border-slate-800 text-center shadow-xl">
          <h2 className="text-2xl font-bold mb-2 text-white">Authentication Required</h2>
          <p className="text-slate-400 mb-6">Please sign in to access your Growz workspace.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
  */
};
