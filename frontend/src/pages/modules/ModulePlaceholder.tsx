import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart2, 
  Package, 
  Users, 
  Share2, 
  Target, 
  Settings, 
  UserCheck, 
  ArrowLeft, 
  Sparkles, 
  Clock, 
  ShieldCheck, 
  ChevronRight, 
  Layers,
  Database
} from 'lucide-react';
import { useBusinessProfileStore } from '../../stores/useBusinessProfileStore';
import { getDashboardConfig } from '../../lib/dashboardConfig';

interface ModulePlaceholderProps {
  moduleId: 'financials' | 'inventory' | 'customers' | 'marketing' | 'missions' | 'settings' | 'profile';
}

const MODULE_META: Record<ModulePlaceholderProps['moduleId'], {
  title: string;
  subtitle: string;
  icon: React.FC<{ className?: string }>;
  features: string[];
  gradient: string;
}> = {
  financials: {
    title: 'Financial Analytics',
    subtitle: 'Real-time revenue, expense tracking, cash flow projections, and profit margin analysis.',
    icon: BarChart2,
    gradient: 'from-emerald-500 to-teal-400',
    features: ['Profit Margin Auditing', 'Automated Expense Categorization', 'Cash Flow 30-Day Forecast', 'Tax & Revenue Reports'],
  },
  inventory: {
    title: 'Inventory & Stock Management',
    subtitle: 'Track SKU rotation, reorder points, warehouse stock, and supplier delivery timelines.',
    icon: Package,
    gradient: 'from-teal-400 to-cyan-400',
    features: ['Low Stock Safety Alerts', 'Supplier Lead Time Tracker', 'Deadstock Identification', 'Multi-location Stock Sync'],
  },
  customers: {
    title: 'Customers & CRM',
    subtitle: 'Customer relationship tracking, repeat purchase habits, and retention intelligence.',
    icon: Users,
    gradient: 'from-cyan-500 to-blue-400',
    features: ['Customer Lifetime Value (LTV)', 'Automated Re-engagement Signals', 'Buyer Demographics', 'Churn Risk Scoring'],
  },
  marketing: {
    title: 'Marketing & Digital Reach',
    subtitle: 'Multi-channel ad performance, social media engagement, and ROI attribution.',
    icon: Share2,
    gradient: 'from-indigo-500 to-purple-400',
    features: ['ROAS Campaign Tracking', 'WhatsApp Direct Broadcasts', 'Google Profile Optimization', 'Social Media Analytics'],
  },
  missions: {
    title: 'Growth Missions & Strategy',
    subtitle: 'AI-generated tactical missions to expand revenue, optimize costs, and boost repeat orders.',
    icon: Target,
    gradient: 'from-purple-500 to-pink-400',
    features: ['Weekly Priority Tasks', 'Margin Optimization Missions', 'Competitor Benchmark Actions', 'Goal Progress Tracker'],
  },
  settings: {
    title: 'Business Settings',
    subtitle: 'Manage workspace access, currency preferences, integration keys, and notifications.',
    icon: Settings,
    gradient: 'from-slate-400 to-slate-200',
    features: ['Workspace Member Roles', 'API & Webhook Integrations', 'Currency & Tax Formats', 'Security & Backup Rules'],
  },
  profile: {
    title: 'Business Profile & Identity',
    subtitle: 'View and manage your completed Growz business configuration and industry parameters.',
    icon: UserCheck,
    gradient: 'from-emerald-400 to-emerald-600',
    features: ['Industry Sector Rules', 'Sales Channel Configuration', 'Financial Ranges Setup', 'Target Audience Definition'],
  },
};

export const ModulePlaceholder: React.FC<ModulePlaceholderProps> = ({ moduleId }) => {
  const navigate = useNavigate();
  const { profile, resetOnboarding } = useBusinessProfileStore();
  const config = getDashboardConfig(profile);
  const meta = MODULE_META[moduleId];
  const Icon = meta.icon;

  const handleEditProfile = () => {
    resetOnboarding();
    navigate('/app');
  };

  return (
    <div className="p-6 sm:p-8 space-y-8 max-w-6xl mx-auto font-sans">
      {/* Top Banner */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className={`h-14 w-14 rounded-2xl bg-gradient-to-tr ${meta.gradient} flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-emerald-500/10 shrink-0`}>
              <Icon className="h-7 w-7 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2.5 py-0.5 rounded-md">
                  {config.businessName} • {config.businessType}
                </span>
                <span className="text-[10px] font-extrabold uppercase tracking-wider bg-slate-800 text-slate-400 px-2.5 py-0.5 rounded-md">
                  Module Active
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight pt-1">
                {meta.title}
              </h1>
              <p className="text-slate-400 text-sm max-w-xl mt-1 leading-relaxed">
                {meta.subtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/app')}
              className="px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-2 transition-all shadow-sm"
            >
              <ArrowLeft className="h-4 w-4 text-emerald-400" />
              <span>Back to Overview</span>
            </button>
            {moduleId === 'profile' && (
              <button
                onClick={handleEditProfile}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-500/20 hover:brightness-110 transition-all"
              >
                <Sparkles className="h-4 w-4" />
                <span>Re-run Onboarding</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Special View for Profile Page */}
      {moduleId === 'profile' && (
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 backdrop-blur-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-lg font-bold text-white">Configured Business Profile</h2>
              <p className="text-xs text-slate-400">Current settings active in Growz state layer</p>
            </div>
            <button
              onClick={handleEditProfile}
              className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-xl hover:bg-emerald-500/20 transition-all flex items-center gap-1"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Edit Configuration</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Business Name</span>
              <span className="text-slate-200 font-semibold text-sm block">{profile.businessName || 'N/A'}</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Category & Industry</span>
              <span className="text-slate-200 font-semibold text-sm block">{profile.businessType || 'N/A'} ({profile.industry || 'General'})</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Main Offering</span>
              <span className="text-slate-200 font-semibold text-sm block">{profile.mainOffering || 'N/A'}</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Location & Scale</span>
              <span className="text-slate-200 font-semibold text-sm block">{profile.location || 'India'} • {profile.employeeCount || '1-5'} Employees</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Customer Reach</span>
              <span className="text-slate-200 font-semibold text-sm block">{profile.mainCustomerLocation || 'Local'} • {profile.targetCustomerType}</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Strategic Focus</span>
              <span className="text-emerald-400 font-semibold text-sm block">{profile.goals[0] || 'Business Growth'}</span>
            </div>
          </div>
        </div>
      )}

      {/* Module Ready State Card */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 shadow-xl text-center space-y-6 backdrop-blur-xl">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-950 border border-slate-800 text-emerald-400 mx-auto shadow-inner">
          <Clock className="h-8 w-8 text-emerald-400" />
        </div>

        <div className="space-y-2 max-w-md mx-auto">
          <h3 className="text-xl font-bold text-white tracking-tight">
            {meta.title} Module Ready for Data Connection
          </h3>
          <p className="text-slate-400 text-xs leading-relaxed">
            This workspace module is tailored for <span className="text-emerald-400 font-semibold">{config.businessName}</span>. Connect live data streams or import records to activate full intelligence analytics.
          </p>
        </div>

        <div className="pt-2 max-w-xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
          {meta.features.map((feature, idx) => (
            <div key={idx} className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-center space-x-3 text-xs text-slate-300">
              <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
              <span className="font-medium">{feature}</span>
            </div>
          ))}
        </div>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => navigate('/app')}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs font-semibold flex items-center justify-center gap-2 transition-all"
          >
            <span>Return to Overview Dashboard</span>
            <ChevronRight className="h-4 w-4 text-emerald-400" />
          </button>
        </div>
      </div>
    </div>
  );
};
