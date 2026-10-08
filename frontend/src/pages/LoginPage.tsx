import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../stores/useAuthStore';
import { AuthModal } from '../components/AuthModal';

export const LoginPage: React.FC = () => {
  const { firebaseUser, userProfile, isDemoMode, loading } = useAuthStore();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950 text-white font-sans">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-emerald-500"></div>
          <span className="text-xs text-slate-400 font-medium">Authenticating with Growz...</span>
        </div>
      </div>
    );
  }

  if (isDemoMode || (firebaseUser && userProfile)) {
    return <Navigate to="/app" replace />;
  }

  return <AuthModal />;
};
