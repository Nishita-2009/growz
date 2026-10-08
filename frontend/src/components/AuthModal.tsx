import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/useAuthStore';
import { Sparkles, UserCheck, LogOut, ArrowRight } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { firebaseUser, userProfile, loginWithEmail, signUpWithEmail, loginWithGoogle, logout, enterDemoMode, error, loading } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSignUp) {
      await signUpWithEmail(email, password);
    } else {
      await loginWithEmail(email, password);
    }
    navigate('/app');
  };

  const handleGoogleLogin = async () => {
    await loginWithGoogle();
    navigate('/app');
  };

  const handleDemoClick = () => {
    enterDemoMode();
    navigate('/app');
  };

  const handleContinueSession = () => {
    navigate('/app');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 p-4 text-slate-100 font-sans selection:bg-emerald-500 selection:text-slate-950">
      <div className="w-full max-w-md rounded-3xl bg-slate-900/90 border border-slate-800 p-8 shadow-2xl backdrop-blur-xl space-y-6">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <img src="/growz-logo.png" alt="Growz Logo" className="h-16 w-16 object-contain rounded-2xl mx-auto shadow-xl shadow-emerald-500/20" />
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Growz Platform</h1>
          <p className="text-xs text-slate-400">AI-Driven MSME Business Intelligence</p>
        </div>

        {error && (
          <div className="rounded-xl bg-rose-500/10 border border-rose-500/20 p-3 text-xs text-rose-400 font-medium">
            {error}
          </div>
        )}

        {/* Existing Persisted Session View */}
        {firebaseUser ? (
          <div className="space-y-4 pt-2">
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
              <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                <UserCheck className="h-4 w-4" />
                <span>Authenticated Session</span>
              </div>
              <p className="text-sm font-semibold text-white truncate">
                {firebaseUser.email || userProfile?.email || 'Authenticated User'}
              </p>
              <p className="text-xs text-slate-400">
                Session active. Continue to access your business analytics and missions.
              </p>
            </div>

            <button
              onClick={handleContinueSession}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/20 hover:brightness-110 active:scale-[0.99] transition-all flex items-center justify-center space-x-2"
            >
              <span>Continue to Growz Business</span>
              <ArrowRight className="h-4 w-4" />
            </button>

            <button
              onClick={() => logout()}
              className="w-full py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-rose-400 text-xs font-semibold transition-all flex items-center justify-center space-x-2"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Sign in with another account</span>
            </button>
          </div>
        ) : (
          /* Unauthenticated Login / Register Form */
          <>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="owner@business.com"
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 py-3.5 text-sm font-bold text-slate-950 shadow-lg shadow-emerald-500/25 hover:brightness-110 active:scale-[0.99] disabled:opacity-50 transition-all"
              >
                {loading ? 'Processing...' : isSignUp ? 'Create Account' : 'Sign In'}
              </button>
            </form>

            <div className="relative my-4 text-center">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-800"></div></div>
              <span className="relative bg-slate-900 px-3 text-[11px] text-slate-500 font-semibold tracking-wider uppercase">Or</span>
            </div>

            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-800 bg-slate-950 py-3 text-sm font-semibold text-slate-200 hover:bg-slate-800/80 transition-all mb-3"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.1 9 5 12 5z"/>
                <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"/>
                <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15s.7 5.3 1.9 7.7l3.7-2.9z"/>
                <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.1-6.4-5.1L1.9 16.1C3.7 19.8 7.5 23 12 23z"/>
              </svg>
              <span>Google Sign-In</span>
            </button>

            <button
              type="button"
              onClick={handleDemoClick}
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 py-3 text-sm font-semibold text-emerald-400 hover:bg-emerald-500/20 transition-all shadow-sm shadow-emerald-500/10"
            >
              <Sparkles className="h-4 w-4" />
              <span>View Demo Website / Try Demo</span>
            </button>

            <p className="mt-4 text-center text-xs text-slate-400">
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button
                onClick={() => setIsSignUp(!isSignUp)}
                className="font-semibold text-emerald-400 hover:underline ml-1"
              >
                {isSignUp ? 'Sign In' : 'Sign Up'}
              </button>
            </p>
          </>
        )}
      </div>
    </div>
  );
};
