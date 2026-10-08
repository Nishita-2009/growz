import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, ShieldCheck, ArrowRight, BarChart3, Bot, Sparkles } from 'lucide-react';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-primary/30">
      {/* Navigation */}
      <nav className="border-b border-border/40 bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img src="/growz-logo.png" alt="Growz Logo" className="w-9 h-9 object-contain rounded-xl shadow-md shadow-emerald-500/20" />
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
              Growz
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-primary font-medium">
              MSME AI Platform
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/login')}
              className="px-4 py-2 text-sm font-medium rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/60 transition-all"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate('/login')}
              className="px-4 py-2 text-sm font-medium rounded-lg bg-primary hover:bg-primary/90 text-white transition-all shadow-md shadow-primary/25 hover:shadow-lg hover:shadow-primary/30 flex items-center space-x-2"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-24 pb-20 px-6 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/15 rounded-full blur-3xl pointer-events-none -z-10" />
        
        <div className="max-w-5xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-semibold tracking-wide uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI-Driven Business Intelligence for MSMEs</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight leading-tight">
            Empower Your Business Growth with{' '}
            <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">
              Autonomous Intelligence
            </span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Growz unifies financial analytics, demand forecasting, customer insights, and automated operations tailored specifically for Micro, Small, and Medium Enterprises.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={() => navigate('/login')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-primary hover:bg-primary/90 text-white font-semibold text-base transition-all shadow-xl shadow-primary/30 hover:scale-[1.02] flex items-center justify-center space-x-2"
            >
              <span>Get Started</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Highlights Grid */}
      <section className="py-16 px-6 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-card/60 border border-border/60 hover:border-primary/40 transition-all backdrop-blur-sm space-y-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <BarChart3 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold">Real-time Analytics</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Track revenue, expenses, profit margins, and cash flow forecasts effortlessly in one centralized hub.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-card/60 border border-border/60 hover:border-primary/40 transition-all backdrop-blur-sm space-y-4">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <Bot className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold">Google Gemini AI Engine</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Receive smart recommendations, automated inventory alerts, and actionable growth strategies.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-card/60 border border-border/60 hover:border-primary/40 transition-all backdrop-blur-sm space-y-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold">Enterprise Tech Stack</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Built with FastAPI, React, PostgreSQL, Firebase Auth & Storage, Redis, and Docker for max scalability.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-border/40 py-8 px-6 text-center text-xs text-muted-foreground">
        <p>© 2026 Growz Platform. Engineered for MSME Growth.</p>
      </footer>
    </div>
  );
};
