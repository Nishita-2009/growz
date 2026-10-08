import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/useAuthStore';
import { useBusinessProfileStore } from '../stores/useBusinessProfileStore';
import { getDashboardConfig } from '../lib/dashboardConfig';
import { DynamicDashboard } from '../components/dashboard/DynamicDashboard';
import { FinancialsModule } from '../components/financials/FinancialsModule';
import { InventoryModule } from '../components/inventory/InventoryModule';
import { CustomersModule } from '../components/customers/CustomersModule';
import { MarketingModule } from '../components/marketing/MarketingModule';
import { MissionsModule } from '../components/missions/MissionsModule';
import { OpportunitiesModule } from '../components/intelligence/OpportunitiesModule';
import { DataImportModule } from '../components/dataImport/DataImportModule';
import { ModulePlaceholder } from './modules/ModulePlaceholder';
import { NotFoundPage } from './NotFoundPage';
import { 
  LayoutDashboard, 
  BarChart2, 
  Package, 
  Users, 
  Share2, 
  Target, 
  Settings, 
  UserCheck, 
  LogOut, 
  Sparkles, 
  PanelLeftClose, 
  PanelLeftOpen, 
  Menu, 
  X,
  TrendingUp,
  Layers,
  Database
} from 'lucide-react';

interface SidebarItem {
  id: string;
  label: string;
  path: string;
  icon: React.FC<{ className?: string }>;
  badge?: string;
}

export const AppShell: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userProfile, logout, isDemoMode, exitDemoMode } = useAuthStore();
  const { profile, resetOnboarding } = useBusinessProfileStore();
  const config = getDashboardConfig(profile);

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Close mobile drawer on route change
  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

  const sidebarItems: SidebarItem[] = [
    { id: 'overview', label: 'Overview Dashboard', path: '/app', icon: LayoutDashboard },
    { id: 'data', label: 'Data & Integrations', path: '/app/data', icon: Database },
    { id: 'opportunities', label: 'Opportunity Detector', path: '/app/opportunities', icon: Sparkles },
    { id: 'financials', label: 'Financial Analytics', path: '/app/financials', icon: BarChart2 },
    { id: 'inventory', label: 'Inventory & Stock', path: '/app/inventory', icon: Package, badge: profile.maintainsInventory === 'Yes' ? 'Active' : undefined },
    { id: 'customers', label: 'Customers & CRM', path: '/app/customers', icon: Users },
    { id: 'marketing', label: 'Marketing Channels', path: '/app/marketing', icon: Share2 },
    { id: 'missions', label: 'Growth Missions', path: '/app/missions', icon: Target, badge: `${profile.goals.length} Goals` },
    { id: 'settings', label: 'Business Settings', path: '/app/settings', icon: Settings },
    { id: 'profile', label: 'Edit Business Profile', path: '/app/profile', icon: UserCheck },
  ];

  // Map route to current title for header
  const getCurrentTitle = () => {
    const currentPath = location.pathname.replace(/\/$/, '');
    if (currentPath === '/app' || currentPath === '/app/') return 'Overview Dashboard';
    if (currentPath.startsWith('/app/data')) return 'Connect Your Business Data';
    if (currentPath.startsWith('/app/opportunities')) return 'Opportunity Detector';
    if (currentPath.startsWith('/app/missions')) return 'Growth Missions';
    const match = sidebarItems.find((item) => item.path === currentPath);
    return match ? match.label : 'Growz Application';
  };

  const handleEditProfile = () => {
    resetOnboarding();
    navigate('/app');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex font-sans selection:bg-emerald-500 selection:text-slate-950">
      
      {/* Mobile Drawer Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`fixed md:sticky top-0 h-screen left-0 z-50 bg-slate-900/90 md:bg-slate-900/60 border-r border-slate-800/80 backdrop-blur-xl flex flex-col shrink-0 transition-all duration-300 ${
          isCollapsed ? 'md:w-20' : 'md:w-64'
        } ${isMobileOpen ? 'w-64 translate-x-0' : '-translate-x-full md:translate-x-0'}`}
      >
        {/* Brand Header */}
        <div className={`p-5 flex items-center border-b border-slate-800/80 ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
          <div className="flex items-center space-x-3 overflow-hidden">
            <img src="/growz-logo.png" alt="Growz" className="h-9 w-9 object-contain rounded-xl shadow-md shadow-emerald-500/20 shrink-0" />
            {!isCollapsed && (
              <div className="min-w-0">
                <span className="font-bold text-sm tracking-tight text-white block truncate leading-tight">{config.businessName}</span>
                <span className="text-[10px] text-emerald-400 font-semibold truncate block">{config.businessType}</span>
              </div>
            )}
          </div>

          {/* Desktop Collapse Toggle */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden md:flex p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {isCollapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
          </button>

          {/* Mobile Close Button */}
          <button
            onClick={() => setIsMobileOpen(false)}
            className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <div className="p-3 space-y-1 flex-1 overflow-y-auto custom-scrollbar">
          {!isCollapsed && (
            <div className="px-3 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Workspace Navigation
            </div>
          )}

          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const currentPath = location.pathname.replace(/\/$/, '');
            const isActive = item.path === '/app' ? currentPath === '/app' : currentPath === item.path;

            return (
              <button
                key={item.id}
                onClick={() => {
                  if (item.id === 'profile') {
                    navigate('/app/profile');
                  } else {
                    navigate(item.path);
                  }
                }}
                title={isCollapsed ? item.label : undefined}
                className={`w-full flex items-center ${isCollapsed ? 'justify-center py-3' : 'justify-between px-3.5 py-2.5'} rounded-xl text-xs font-semibold transition-all group ${
                  isActive
                    ? 'bg-gradient-to-r from-emerald-500/15 to-emerald-500/5 border border-emerald-500/30 text-emerald-300 shadow-sm shadow-emerald-500/10'
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
                }`}
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <Icon className={`h-4 w-4 shrink-0 transition-transform group-hover:scale-110 ${isActive ? 'text-emerald-400' : 'text-slate-400 group-hover:text-slate-200'}`} />
                  {!isCollapsed && <span className="truncate">{item.label}</span>}
                </div>

                {!isCollapsed && item.badge && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-md border shrink-0 transition-colors ${
                    isActive ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'bg-slate-950 text-slate-400 border-slate-800'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Architecture Info */}
        {!isCollapsed && (
          <div className="p-4 m-3 rounded-2xl bg-slate-950/80 border border-slate-800/80 space-y-1 text-xs">
            <div className="font-semibold text-slate-300 flex items-center space-x-1.5">
              <Layers className="w-3.5 h-3.5 text-emerald-400" />
              <span>Growz Workspace</span>
            </div>
            <p className="text-[11px] text-slate-500">
              Active configuration for {config.businessName}.
            </p>
          </div>
        )}
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-auto">
        {isDemoMode && (
          <div className="bg-amber-500/10 border-b border-amber-500/30 px-4 py-2 text-center text-xs text-amber-300 font-medium flex items-center justify-center gap-3 shrink-0">
            <span>✨ <strong>DEMO MODE:</strong> You are exploring Growz with sample business metrics. Real user data is protected.</span>
            <button
              onClick={() => exitDemoMode()}
              className="px-2.5 py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 text-xs font-bold transition-all border border-amber-500/40 ml-2"
            >
              Exit Demo & Sign In
            </button>
          </div>
        )}

        {/* Production SaaS Top Bar */}
        <header className="h-16 border-b border-slate-800/80 px-4 sm:px-8 flex items-center justify-between bg-slate-900/40 backdrop-blur-md sticky top-0 z-40">
          <div className="flex items-center space-x-3">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="md:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
            >
              <Menu className="h-5 w-5" />
            </button>

            <div>
              <h2 className="text-base font-extrabold text-white tracking-tight">{getCurrentTitle()}</h2>
              <span className="text-[11px] text-slate-400 hidden sm:inline-block">
                {config.businessName} • {config.businessType} {isDemoMode ? '(Demo Account)' : ''}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="hidden sm:flex items-center space-x-2 bg-slate-900/80 border border-slate-800 px-3 py-1.5 rounded-xl text-xs">
              <span className={`h-2 w-2 rounded-full ${isDemoMode ? 'bg-amber-400' : 'bg-emerald-400'} animate-pulse`} />
              <span className="text-slate-300 font-mono">{userProfile?.email || 'owner@business.com'}</span>
            </div>

            <button
              onClick={() => isDemoMode ? exitDemoMode() : logout()}
              className="px-3.5 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-semibold flex items-center space-x-1.5 transition-all border border-rose-500/20"
              title={isDemoMode ? "Exit Demo" : "Sign Out"}
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{isDemoMode ? "Exit Demo" : "Sign Out"}</span>
            </button>
          </div>
        </header>

        {/* Routed Dashboard & Module Views */}
        <div className="flex-1">
          <Routes>
            <Route path="" element={<DynamicDashboard />} />
            <Route path="data/*" element={<DataImportModule />} />
            <Route path="financials" element={<FinancialsModule />} />
            <Route path="inventory" element={<InventoryModule />} />
            <Route path="customers" element={<CustomersModule />} />
            <Route path="marketing" element={<MarketingModule />} />
            <Route path="missions/*" element={<MissionsModule />} />
            <Route path="opportunities/*" element={<OpportunitiesModule />} />
            <Route path="settings" element={<ModulePlaceholder moduleId="settings" />} />
            <Route path="profile" element={<ModulePlaceholder moduleId="profile" />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
      </main>
    </div>
  );
};
