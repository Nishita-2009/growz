import React, { useState } from 'react';
import { useBusinessProfileStore } from '../../stores/useBusinessProfileStore';
import { useAppStore } from '../../stores/useAppStore';
import { 
  SalesChannel, 
  CustomerLocation, 
  OperationalTool, 
  BusinessGoal 
} from '../../types/businessProfile';
import { 
  Building2, 
  Sparkles, 
  Store, 
  Globe, 
  MessageSquare, 
  ShoppingBag, 
  MoreHorizontal, 
  MapPin, 
  Compass, 
  Flag, 
  Globe2, 
  DollarSign, 
  TrendingUp, 
  CheckCircle2, 
  ArrowLeft, 
  ArrowRight, 
  Edit3, 
  Check, 
  Layers, 
  Package, 
  Users, 
  Target, 
  FileSpreadsheet, 
  ShieldCheck, 
  Briefcase,
  Share2,
  Calendar,
  PieChart
} from 'lucide-react';

const InstagramIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

const SALES_CHANNELS: { id: SalesChannel; label: string; icon: React.FC<{ className?: string }> }[] = [
  { id: 'Website', label: 'Website', icon: Globe },
  { id: 'Physical Store', label: 'Physical Store', icon: Store },
  { id: 'WhatsApp', label: 'WhatsApp Business', icon: MessageSquare },
  { id: 'Instagram', label: 'Instagram Shop', icon: InstagramIcon },
  { id: 'Marketplace', label: 'Marketplace (Amazon/Flipkart)', icon: ShoppingBag },
  { id: 'Other', label: 'Other Channels', icon: MoreHorizontal },
];

const CUSTOMER_LOCATIONS: { id: CustomerLocation; label: string; desc: string; icon: React.FC<{ className?: string }> }[] = [
  { id: 'Local', label: 'Local City / Neighborhood', desc: 'Within 20 km of your base', icon: MapPin },
  { id: 'Regional', label: 'Regional / State', desc: 'Serving statewide customers', icon: Compass },
  { id: 'National', label: 'National', desc: 'Shipping across the entire country', icon: Flag },
  { id: 'International', label: 'International', desc: 'Global customer base', icon: Globe2 },
];

const OPERATIONAL_TOOLS: { id: OperationalTool; label: string }[] = [
  { id: 'Excel', label: 'Microsoft Excel' },
  { id: 'Google Sheets', label: 'Google Sheets' },
  { id: 'POS', label: 'POS Terminal' },
  { id: 'Accounting Software', label: 'Accounting (Tally / Zoho / QuickBooks)' },
  { id: 'ERP', label: 'ERP System' },
  { id: 'None', label: 'No Formal Tools' },
  { id: 'Other', label: 'Other Software' },
];

const GOALS_LIST: { id: BusinessGoal; label: string; icon: React.FC<{ className?: string }> }[] = [
  { id: 'Increase revenue', label: 'Increase Revenue', icon: TrendingUp },
  { id: 'Increase profit', label: 'Increase Profit Margins', icon: DollarSign },
  { id: 'Get more customers', label: 'Acquire New Customers', icon: Users },
  { id: 'Increase repeat customers', label: 'Boost Repeat Orders', icon: Target },
  { id: 'Reduce expenses', label: 'Cut Unnecessary Costs', icon: PieChart },
  { id: 'Improve inventory', label: 'Optimize Inventory', icon: Package },
  { id: 'Improve marketing', label: 'Improve Marketing ROI', icon: Share2 },
  { id: 'Expand to new locations', label: 'Expand Locations', icon: Building2 },
  { id: 'Improve online presence', label: 'Enhance Web/Social Presence', icon: Globe },
  { id: 'Other', label: 'Other Strategic Goals', icon: Sparkles },
];

export const BusinessOnboarding: React.FC = () => {
  const { currentStep, profile, setStep, nextStep, prevStep, updateProfile, completeOnboarding, isCompleted } = useBusinessProfileStore();
  const { setActiveTab } = useAppStore();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const toggleArrayItem = <T,>(array: T[], item: T): T[] => {
    return array.includes(item) ? array.filter((i) => i !== item) : [...array, item];
  };

  const validateAndNext = () => {
    setErrorMsg(null);
    if (currentStep === 2) {
      if (!profile.businessName.trim()) {
        setErrorMsg('Please enter your business name.');
        return;
      }
      if (!profile.businessType.trim()) {
        setErrorMsg('Please select or enter a business category.');
        return;
      }
    }
    if (currentStep === 3) {
      if (!profile.mainOffering.trim()) {
        setErrorMsg('Please mention your main product or service.');
        return;
      }
    }
    nextStep();
  };

  const handleFinish = () => {
    completeOnboarding();
  };

  const handleGoToDashboard = () => {
    setActiveTab('app');
  };

  // Completion Screen
  if (isCompleted) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 text-slate-100 font-sans">
        <div className="max-w-xl w-full bg-slate-900/90 border border-slate-800 rounded-3xl p-10 shadow-2xl text-center space-y-6 backdrop-blur-xl animate-fade-in">
          <div className="inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 shadow-xl shadow-emerald-500/20 mx-auto">
            <ShieldCheck className="h-10 w-10 stroke-[2.5]" />
          </div>

          <div className="space-y-2">
            <h2 className="text-3xl font-extrabold text-white tracking-tight">Your business profile is ready.</h2>
            <p className="text-slate-400 text-sm max-w-md mx-auto">
              Growz has structured your business profile for <span className="text-emerald-400 font-semibold">{profile.businessName || 'your business'}</span>. We are ready to generate custom growth insights.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 text-left bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 text-xs">
            <div>
              <span className="text-slate-500 block uppercase font-semibold">Business</span>
              <span className="text-slate-200 font-medium truncate block">{profile.businessName || 'MSME Enterprise'}</span>
            </div>
            <div>
              <span className="text-slate-500 block uppercase font-semibold">Industry</span>
              <span className="text-slate-200 font-medium truncate block">{profile.industry || profile.businessType || 'General'}</span>
            </div>
            <div>
              <span className="text-slate-500 block uppercase font-semibold">Primary Offering</span>
              <span className="text-slate-200 font-medium truncate block">{profile.mainOffering || 'Products/Services'}</span>
            </div>
            <div>
              <span className="text-slate-500 block uppercase font-semibold">Key Goal</span>
              <span className="text-emerald-400 font-medium truncate block">{profile.goals[0] || 'Business Growth'}</span>
            </div>
          </div>

          <button
            onClick={handleGoToDashboard}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-base shadow-lg shadow-emerald-500/25 hover:brightness-110 active:scale-[0.99] transition-all flex items-center justify-center gap-2"
          >
            <span>Go to Growz Dashboard</span>
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      {/* Top Header & Progress */}
      <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/growz-logo.png" alt="Growz Logo" className="h-9 w-9 object-contain rounded-xl shadow-md shadow-emerald-500/20" />
            <span className="font-bold text-white tracking-wide">Growz Onboarding</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
              Step {currentStep} of 9
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-800/50 h-1.5">
          <div
            className="bg-gradient-to-r from-emerald-500 to-teal-400 h-1.5 transition-all duration-500 ease-out"
            style={{ width: `${(currentStep / 9) * 100}%` }}
          />
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-3xl w-full mx-auto p-4 sm:p-6 md:p-8 flex flex-col justify-center">
        {errorMsg && (
          <div className="mb-6 bg-rose-500/10 border border-rose-500/30 text-rose-400 p-4 rounded-xl text-sm font-medium animate-shake">
            {errorMsg}
          </div>
        )}

        <div className="bg-slate-900/80 border border-slate-800/80 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-xl space-y-8">
          
          {/* STEP 1: WELCOME */}
          {currentStep === 1 && (
            <div className="text-center space-y-6 py-4 animate-fade-in">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 text-emerald-400 mx-auto shadow-inner">
                <Sparkles className="h-8 w-8" />
              </div>

              <div className="space-y-3">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                  Let's understand your business.
                </h1>
                <p className="text-slate-400 text-base max-w-xl mx-auto leading-relaxed">
                  Tell Growz a little about your business so we can identify opportunities that actually matter to you.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left pt-4 max-w-2xl mx-auto">
                <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-2">
                  <Building2 className="h-5 w-5 text-emerald-400" />
                  <h3 className="font-semibold text-sm text-white">Business Intelligence</h3>
                  <p className="text-xs text-slate-400">Custom tailored recommendations for your MSME model.</p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-2">
                  <TrendingUp className="h-5 w-5 text-teal-400" />
                  <h3 className="font-semibold text-sm text-white">Growth & Sales</h3>
                  <p className="text-xs text-slate-400">Identify high-margin products and customer expansion.</p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-2">
                  <PieChart className="h-5 w-5 text-emerald-400" />
                  <h3 className="font-semibold text-sm text-white">Smart Operations</h3>
                  <p className="text-xs text-slate-400">Optimize inventory, margins, and operational costs.</p>
                </div>
              </div>

              <div className="pt-4">
                <button
                  onClick={nextStep}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-base shadow-lg shadow-emerald-500/25 hover:brightness-110 active:scale-[0.99] transition-all inline-flex items-center justify-center gap-2"
                >
                  <span>Get Started</span>
                  <ArrowRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: BUSINESS BASICS */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Business Basics</h2>
                <p className="text-slate-400 text-sm mt-1">Tell us about your organization and structure.</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Business Name *</label>
                  <input
                    type="text"
                    value={profile.businessName}
                    onChange={(e) => updateProfile({ businessName: e.target.value })}
                    placeholder="e.g. Apex Traders, Urban Style Boutique"
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Business Type / Category *</label>
                    <select
                      value={profile.businessType}
                      onChange={(e) => updateProfile({ businessType: e.target.value })}
                      className="w-full rounded-xl bg-slate-950 border border-slate-800 px-4 py-3 text-sm text-white focus:border-emerald-500 focus:outline-none transition-all"
                    >
                      <option value="">Select Category...</option>
                      <option value="Retail Store">Retail Store</option>
                      <option value="E-Commerce">E-Commerce / Online Store</option>
                      <option value="Services / Consulting">Services / Consulting</option>
                      <option value="Manufacturing">Manufacturing & Production</option>
                      <option value="Food & Beverage">Food & Beverage / Restaurant</option>
                      <option value="Wholesale / B2B">Wholesale / Distribution</option>
                      <option value="Healthcare / Wellness">Healthcare & Wellness</option>
                      <option value="Technology / Software">Technology & IT Services</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Industry Sector</label>
                    <input
                      type="text"
                      value={profile.industry}
                      onChange={(e) => updateProfile({ industry: e.target.value })}
                      placeholder="e.g. Apparel, Electronics, Financial Services"
                      className="w-full rounded-xl bg-slate-950 border border-slate-800 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Location / City</label>
                    <input
                      type="text"
                      value={profile.location}
                      onChange={(e) => updateProfile({ location: e.target.value })}
                      placeholder="e.g. Mumbai, Bengaluru"
                      className="w-full rounded-xl bg-slate-950 border border-slate-800 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Year Started</label>
                    <input
                      type="number"
                      value={profile.yearStarted}
                      onChange={(e) => updateProfile({ yearStarted: e.target.value })}
                      placeholder="e.g. 2021"
                      className="w-full rounded-xl bg-slate-950 border border-slate-800 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Employees</label>
                    <select
                      value={profile.employeeCount}
                      onChange={(e) => updateProfile({ employeeCount: e.target.value })}
                      className="w-full rounded-xl bg-slate-950 border border-slate-800 px-4 py-3 text-sm text-white focus:border-emerald-500 focus:outline-none transition-all"
                    >
                      <option value="1-5">1 - 5 employees</option>
                      <option value="6-20">6 - 20 employees</option>
                      <option value="21-50">21 - 50 employees</option>
                      <option value="50+">50+ employees</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: WHAT YOU SELL */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">What You Sell</h2>
                <p className="text-slate-400 text-sm mt-1">Specify products, pricing tiers, and sales channels.</p>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Offering Type</label>
                  <div className="grid grid-cols-3 gap-3">
                    {['Products', 'Services', 'Products & Services'].map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => updateProfile({ offeringType: type })}
                        className={`p-3 rounded-xl border text-xs font-semibold transition-all text-center ${
                          profile.offeringType === type
                            ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400 shadow-md'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Main Product or Service Name *</label>
                  <input
                    type="text"
                    value={profile.mainOffering}
                    onChange={(e) => updateProfile({ mainOffering: e.target.value })}
                    placeholder="e.g. Handmade Leather Bags, Accounting Advisory, Organic Teas"
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Average Selling Price</label>
                    <select
                      value={profile.avgSellingPrice}
                      onChange={(e) => updateProfile({ avgSellingPrice: e.target.value })}
                      className="w-full rounded-xl bg-slate-950 border border-slate-800 px-4 py-3 text-sm text-white focus:border-emerald-500 focus:outline-none transition-all"
                    >
                      <option value="Under ₹500">Under ₹500</option>
                      <option value="₹500 - ₹2,000">₹500 - ₹2,000</option>
                      <option value="₹2,000 - ₹10,000">₹2,000 - ₹10,000</option>
                      <option value="₹10,000+">₹10,000+</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Total SKU / Service Count</label>
                    <select
                      value={profile.offeringCount}
                      onChange={(e) => updateProfile({ offeringCount: e.target.value })}
                      className="w-full rounded-xl bg-slate-950 border border-slate-800 px-4 py-3 text-sm text-white focus:border-emerald-500 focus:outline-none transition-all"
                    >
                      <option value="1 - 10">1 - 10 items</option>
                      <option value="11 - 50">11 - 50 items</option>
                      <option value="51 - 200">51 - 200 items</option>
                      <option value="200+">200+ items</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Primary Sales Channels (Select all that apply)</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {SALES_CHANNELS.map((ch) => {
                      const Icon = ch.icon;
                      const selected = profile.primarySalesChannels.includes(ch.id);
                      return (
                        <button
                          key={ch.id}
                          type="button"
                          onClick={() => updateProfile({ primarySalesChannels: toggleArrayItem(profile.primarySalesChannels, ch.id) })}
                          className={`p-3.5 rounded-xl border flex items-center gap-3 text-left transition-all ${
                            selected
                              ? 'bg-emerald-500/10 border-emerald-500 text-white shadow-md'
                              : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                          }`}
                        >
                          <Icon className={`h-5 w-5 ${selected ? 'text-emerald-400' : 'text-slate-500'}`} />
                          <span className="text-xs font-medium">{ch.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: CUSTOMERS */}
          {currentStep === 4 && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Customers & Reach</h2>
                <p className="text-slate-400 text-sm mt-1">Help us understand your audience size and market location.</p>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Target Customer Type</label>
                  <div className="grid grid-cols-3 gap-3">
                    {['B2C (Consumers)', 'B2B (Businesses)', 'Both B2C & B2B'].map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => updateProfile({ targetCustomerType: type })}
                        className={`p-3 rounded-xl border text-xs font-semibold transition-all text-center ${
                          profile.targetCustomerType === type
                            ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400 shadow-md'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Active Customers</label>
                    <select
                      value={profile.activeCustomersCount}
                      onChange={(e) => updateProfile({ activeCustomersCount: e.target.value })}
                      className="w-full rounded-xl bg-slate-950 border border-slate-800 px-4 py-3 text-sm text-white focus:border-emerald-500 focus:outline-none transition-all"
                    >
                      <option value="< 100">&lt; 100 customers</option>
                      <option value="100 - 500">100 - 500 customers</option>
                      <option value="500 - 2,000">500 - 2,000 customers</option>
                      <option value="2,000+">2,000+ customers</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">New Customers / Month</label>
                    <select
                      value={profile.newCustomersPerMonth}
                      onChange={(e) => updateProfile({ newCustomersPerMonth: e.target.value })}
                      className="w-full rounded-xl bg-slate-950 border border-slate-800 px-4 py-3 text-sm text-white focus:border-emerald-500 focus:outline-none transition-all"
                    >
                      <option value="< 20">&lt; 20 / month</option>
                      <option value="20 - 100">20 - 100 / month</option>
                      <option value="100 - 500">100 - 500 / month</option>
                      <option value="500+">500+ / month</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Repeat Customers %</label>
                    <select
                      value={profile.repeatCustomersPercentage}
                      onChange={(e) => updateProfile({ repeatCustomersPercentage: e.target.value })}
                      className="w-full rounded-xl bg-slate-950 border border-slate-800 px-4 py-3 text-sm text-white focus:border-emerald-500 focus:outline-none transition-all"
                    >
                      <option value="< 10%">&lt; 10% repeat</option>
                      <option value="10% - 30%">10% - 30% repeat</option>
                      <option value="30% - 60%">30% - 60% repeat</option>
                      <option value="60%+">60%+ repeat</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Main Customer Geography</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {CUSTOMER_LOCATIONS.map((loc) => {
                      const Icon = loc.icon;
                      const selected = profile.mainCustomerLocation === loc.id;
                      return (
                        <button
                          key={loc.id}
                          type="button"
                          onClick={() => updateProfile({ mainCustomerLocation: loc.id })}
                          className={`p-4 rounded-xl border text-left flex items-start gap-3 transition-all ${
                            selected
                              ? 'bg-emerald-500/10 border-emerald-500 text-white shadow-md'
                              : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                          }`}
                        >
                          <Icon className={`h-5 w-5 mt-0.5 ${selected ? 'text-emerald-400' : 'text-slate-500'}`} />
                          <div>
                            <div className="text-xs font-semibold text-slate-200">{loc.label}</div>
                            <div className="text-[11px] text-slate-400 mt-0.5">{loc.desc}</div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: BUSINESS NUMBERS (OPTIONAL) */}
          {currentStep === 5 && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Business Numbers (Optional)</h2>
                  <p className="text-slate-400 text-sm mt-1">Approximate ranges help Growz calculate unit economics & margin opportunities.</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    updateProfile({ skippedFinancials: true });
                    nextStep();
                  }}
                  className="text-xs text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-lg hover:bg-amber-500/20 transition-all"
                >
                  Skip for now
                </button>
              </div>

              <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-4 text-xs text-emerald-300 flex items-center gap-3">
                <ShieldCheck className="h-5 w-5 shrink-0 text-emerald-400" />
                <span>Financial estimations remain strictly private within your encrypted local session.</span>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Avg. Monthly Revenue</label>
                    <select
                      value={profile.avgMonthlyRevenue}
                      onChange={(e) => updateProfile({ avgMonthlyRevenue: e.target.value, skippedFinancials: false })}
                      className="w-full rounded-xl bg-slate-950 border border-slate-800 px-4 py-3 text-sm text-white focus:border-emerald-500 focus:outline-none transition-all"
                    >
                      <option value="< ₹1 Lakh">&lt; ₹1 Lakh</option>
                      <option value="₹1 - ₹5 Lakhs">₹1 - ₹5 Lakhs</option>
                      <option value="₹5 - ₹20 Lakhs">₹5 - ₹20 Lakhs</option>
                      <option value="₹20 - ₹50 Lakhs">₹20 - ₹50 Lakhs</option>
                      <option value="₹50 Lakhs+">₹50 Lakhs+</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Avg. Monthly Expenses</label>
                    <select
                      value={profile.avgMonthlyExpenses}
                      onChange={(e) => updateProfile({ avgMonthlyExpenses: e.target.value, skippedFinancials: false })}
                      className="w-full rounded-xl bg-slate-950 border border-slate-800 px-4 py-3 text-sm text-white focus:border-emerald-500 focus:outline-none transition-all"
                    >
                      <option value="< ₹50,000">&lt; ₹50,000</option>
                      <option value="₹50k - ₹2 Lakhs">₹50k - ₹2 Lakhs</option>
                      <option value="₹2 - ₹10 Lakhs">₹2 - ₹10 Lakhs</option>
                      <option value="₹10 Lakhs+">₹10 Lakhs+</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Approx. Profit Margin</label>
                    <select
                      value={profile.approxMonthlyProfit}
                      onChange={(e) => updateProfile({ approxMonthlyProfit: e.target.value, skippedFinancials: false })}
                      className="w-full rounded-xl bg-slate-950 border border-slate-800 px-4 py-3 text-sm text-white focus:border-emerald-500 focus:outline-none transition-all"
                    >
                      <option value="< 10%">&lt; 10% margin</option>
                      <option value="10% - 25%">10% - 25% margin</option>
                      <option value="25% - 40%">25% - 40% margin</option>
                      <option value="40%+">40%+ margin</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Monthly Sales Growth</label>
                    <select
                      value={profile.monthlySalesGrowth}
                      onChange={(e) => updateProfile({ monthlySalesGrowth: e.target.value, skippedFinancials: false })}
                      className="w-full rounded-xl bg-slate-950 border border-slate-800 px-4 py-3 text-sm text-white focus:border-emerald-500 focus:outline-none transition-all"
                    >
                      <option value="Flat / Declining">Flat / Declining (&lt;0%)</option>
                      <option value="0% - 10%">0% - 10% MoM</option>
                      <option value="10% - 25%">10% - 25% MoM</option>
                      <option value="25%+">25%+ MoM</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Average Order Value</label>
                    <select
                      value={profile.avgOrderValue}
                      onChange={(e) => updateProfile({ avgOrderValue: e.target.value, skippedFinancials: false })}
                      className="w-full rounded-xl bg-slate-950 border border-slate-800 px-4 py-3 text-sm text-white focus:border-emerald-500 focus:outline-none transition-all"
                    >
                      <option value="Under ₹500">Under ₹500</option>
                      <option value="₹500 - ₹2,500">₹500 - ₹2,500</option>
                      <option value="₹2,500 - ₹10,000">₹2,500 - ₹10,000</option>
                      <option value="₹10,000+">₹10,000+</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 6: OPERATIONS */}
          {currentStep === 6 && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Operations & Stack</h2>
                <p className="text-slate-400 text-sm mt-1">Tell us how your business handles inventory, suppliers & software.</p>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Do you maintain physical inventory?</label>
                  <div className="grid grid-cols-2 gap-3 max-w-sm">
                    {['Yes', 'No'].map((val) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => updateProfile({ maintainsInventory: val as 'Yes' | 'No' })}
                        className={`p-3.5 rounded-xl border text-xs font-semibold transition-all text-center ${
                          profile.maintainsInventory === val
                            ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400 shadow-md'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        {val}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Number of Outlets / Locations</label>
                    <select
                      value={profile.locationCount}
                      onChange={(e) => updateProfile({ locationCount: e.target.value })}
                      className="w-full rounded-xl bg-slate-950 border border-slate-800 px-4 py-3 text-sm text-white focus:border-emerald-500 focus:outline-none transition-all"
                    >
                      <option value="1">1 Location</option>
                      <option value="2-5">2 - 5 Locations</option>
                      <option value="6-10">6 - 10 Locations</option>
                      <option value="10+">10+ Locations</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Number of Suppliers / Vendors</label>
                    <select
                      value={profile.supplierCount}
                      onChange={(e) => updateProfile({ supplierCount: e.target.value })}
                      className="w-full rounded-xl bg-slate-950 border border-slate-800 px-4 py-3 text-sm text-white focus:border-emerald-500 focus:outline-none transition-all"
                    >
                      <option value="None">None (In-house / Service)</option>
                      <option value="1-5">1 - 5 Vendors</option>
                      <option value="6-20">6 - 20 Vendors</option>
                      <option value="20+">20+ Vendors</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Current Tools Used</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {OPERATIONAL_TOOLS.map((tool) => {
                      const selected = profile.currentTools.includes(tool.id);
                      return (
                        <button
                          key={tool.id}
                          type="button"
                          onClick={() => updateProfile({ currentTools: toggleArrayItem(profile.currentTools, tool.id) })}
                          className={`p-3 rounded-xl border text-left text-xs font-medium transition-all ${
                            selected
                              ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400 shadow-md'
                              : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                          }`}
                        >
                          {tool.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Main Operational Challenge</label>
                  <input
                    type="text"
                    value={profile.mainOperationalChallenge}
                    onChange={(e) => updateProfile({ mainOperationalChallenge: e.target.value })}
                    placeholder="e.g. Stockouts, slow delivery turnaround, manual invoice tracking"
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 7: MARKETING */}
          {currentStep === 7 && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Marketing & Online Channels</h2>
                <p className="text-slate-400 text-sm mt-1">Select your active digital profiles & monthly promotion budget.</p>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Active Digital Presence</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {[
                      { key: 'hasInstagram', label: 'Instagram Profile', icon: InstagramIcon },
                      { key: 'hasFacebook', label: 'Facebook Page', icon: Share2 },
                      { key: 'hasGoogleBusiness', label: 'Google Business Profile', icon: MapPin },
                      { key: 'hasWebsite', label: 'Own Website', icon: Globe },
                      { key: 'hasWhatsAppBusiness', label: 'WhatsApp Business', icon: MessageSquare },
                    ].map((item) => {
                      const Icon = item.icon;
                      const active = Boolean(profile[item.key as keyof typeof profile]);
                      return (
                        <button
                          key={item.key}
                          type="button"
                          onClick={() => updateProfile({ [item.key]: !active })}
                          className={`p-3.5 rounded-xl border flex items-center gap-3 text-left transition-all ${
                            active
                              ? 'bg-emerald-500/10 border-emerald-500 text-white shadow-md'
                              : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                          }`}
                        >
                          <Icon className={`h-5 w-5 ${active ? 'text-emerald-400' : 'text-slate-500'}`} />
                          <span className="text-xs font-medium">{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Main Marketing Channel</label>
                    <select
                      value={profile.mainMarketingChannels[0] || ''}
                      onChange={(e) => updateProfile({ mainMarketingChannels: [e.target.value] })}
                      className="w-full rounded-xl bg-slate-950 border border-slate-800 px-4 py-3 text-sm text-white focus:border-emerald-500 focus:outline-none transition-all"
                    >
                      <option value="">Select Channel...</option>
                      <option value="Social Media Ads">Social Media Ads (Meta / Instagram)</option>
                      <option value="Word of Mouth">Word of Mouth / Referrals</option>
                      <option value="Search Engine Marketing">Google Search / SEO</option>
                      <option value="Influencer Marketing">Influencers & Creators</option>
                      <option value="Local Print & Banners">Local Banners & Print</option>
                      <option value="WhatsApp Broadcasts">WhatsApp Direct Broadcasts</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Monthly Marketing Budget</label>
                    <select
                      value={profile.monthlyMarketingSpend}
                      onChange={(e) => updateProfile({ monthlyMarketingSpend: e.target.value })}
                      className="w-full rounded-xl bg-slate-950 border border-slate-800 px-4 py-3 text-sm text-white focus:border-emerald-500 focus:outline-none transition-all"
                    >
                      <option value="₹0 (Organic only)">₹0 (Organic / Word of Mouth)</option>
                      <option value="< ₹10,000">&lt; ₹10,000 / month</option>
                      <option value="₹10,000 - ₹50,000">₹10,000 - ₹50,000 / month</option>
                      <option value="₹50,000+">₹50,000+ / month</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 8: GOALS & CHALLENGES */}
          {currentStep === 8 && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  What do you want to achieve in the next 6–12 months?
                </h2>
                <p className="text-slate-400 text-sm mt-1">Select all key objectives for your business strategy.</p>
              </div>

              <div className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {GOALS_LIST.map((goal) => {
                    const Icon = goal.icon;
                    const selected = profile.goals.includes(goal.id);
                    return (
                      <button
                        key={goal.id}
                        type="button"
                        onClick={() => updateProfile({ goals: toggleArrayItem(profile.goals, goal.id) })}
                        className={`p-3.5 rounded-xl border flex items-center gap-3 text-left transition-all ${
                          selected
                            ? 'bg-emerald-500/10 border-emerald-500 text-white shadow-md'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <Icon className={`h-5 w-5 ${selected ? 'text-emerald-400' : 'text-slate-500'}`} />
                        <span className="text-xs font-semibold">{goal.label}</span>
                      </button>
                    );
                  })}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    What's the biggest challenge your business is facing right now?
                  </label>
                  <textarea
                    rows={3}
                    value={profile.biggestChallenge}
                    onChange={(e) => updateProfile({ biggestChallenge: e.target.value })}
                    placeholder="e.g. High customer acquisition cost, cash flow delays, scaling sales beyond local area..."
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 p-4 text-sm text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all resize-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 9: REVIEW */}
          {currentStep === 9 && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Review Your Business Profile</h2>
                <p className="text-slate-400 text-sm mt-1">Check your information below before creating your Growz profile.</p>
              </div>

              <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                {/* Basics Section */}
                <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 flex items-start justify-between">
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">Business Basics</span>
                    <h4 className="text-base font-bold text-white">{profile.businessName || 'Unnamed Business'}</h4>
                    <p className="text-xs text-slate-400">
                      {profile.businessType || 'N/A'} • {profile.industry || 'General Industry'} • {profile.location || 'India'}
                    </p>
                    <p className="text-xs text-slate-400">Started {profile.yearStarted || 'N/A'} • {profile.employeeCount || '1-5'} employees</p>
                  </div>
                  <button onClick={() => setStep(2)} className="p-2 text-slate-400 hover:text-emerald-400">
                    <Edit3 className="h-4 w-4" />
                  </button>
                </div>

                {/* Offerings Section */}
                <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 flex items-start justify-between">
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">What You Sell</span>
                    <h4 className="text-sm font-bold text-white">{profile.mainOffering || 'Main Offering'}</h4>
                    <p className="text-xs text-slate-400">
                      Type: {profile.offeringType} • Price: {profile.avgSellingPrice || 'N/A'} • SKUs: {profile.offeringCount || '1-10'}
                    </p>
                    <p className="text-xs text-slate-400">Channels: {profile.primarySalesChannels.join(', ') || 'Direct'}</p>
                  </div>
                  <button onClick={() => setStep(3)} className="p-2 text-slate-400 hover:text-emerald-400">
                    <Edit3 className="h-4 w-4" />
                  </button>
                </div>

                {/* Customers Section */}
                <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 flex items-start justify-between">
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">Target Customers</span>
                    <h4 className="text-sm font-bold text-white">{profile.targetCustomerType}</h4>
                    <p className="text-xs text-slate-400">Active: {profile.activeCustomersCount || 'N/A'} • Repeat: {profile.repeatCustomersPercentage || 'N/A'}</p>
                    <p className="text-xs text-slate-400">Geography: {profile.mainCustomerLocation || 'Local'}</p>
                  </div>
                  <button onClick={() => setStep(4)} className="p-2 text-slate-400 hover:text-emerald-400">
                    <Edit3 className="h-4 w-4" />
                  </button>
                </div>

                {/* Financials Section */}
                <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 flex items-start justify-between">
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">Business Numbers</span>
                    {profile.skippedFinancials ? (
                      <p className="text-xs text-amber-400 italic">Financial data skipped for now</p>
                    ) : (
                      <>
                        <h4 className="text-sm font-bold text-white">Revenue: {profile.avgMonthlyRevenue || 'Unspecified'}</h4>
                        <p className="text-xs text-slate-400">Expenses: {profile.avgMonthlyExpenses || 'N/A'} • Profit: {profile.approxMonthlyProfit || 'N/A'}</p>
                      </>
                    )}
                  </div>
                  <button onClick={() => setStep(5)} className="p-2 text-slate-400 hover:text-emerald-400">
                    <Edit3 className="h-4 w-4" />
                  </button>
                </div>

                {/* Operations & Marketing */}
                <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 flex items-start justify-between">
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">Operations & Marketing</span>
                    <p className="text-xs text-slate-400">Inventory: {profile.maintainsInventory || 'No'} • Locations: {profile.locationCount}</p>
                    <p className="text-xs text-slate-400">Tools: {profile.currentTools.join(', ') || 'Basic'}</p>
                    <p className="text-xs text-slate-400">Spend: {profile.monthlyMarketingSpend || 'Organic'}</p>
                  </div>
                  <button onClick={() => setStep(6)} className="p-2 text-slate-400 hover:text-emerald-400">
                    <Edit3 className="h-4 w-4" />
                  </button>
                </div>

                {/* Goals */}
                <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 flex items-start justify-between">
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">Key Goals</span>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {profile.goals.map((g) => (
                        <span key={g} className="text-[10px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-md">
                          {g}
                        </span>
                      ))}
                    </div>
                    {profile.biggestChallenge && (
                      <p className="text-xs text-slate-400 pt-1">Challenge: {profile.biggestChallenge}</p>
                    )}
                  </div>
                  <button onClick={() => setStep(8)} className="p-2 text-slate-400 hover:text-emerald-400">
                    <Edit3 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={handleFinish}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-base shadow-lg shadow-emerald-500/25 hover:brightness-110 active:scale-[0.99] transition-all flex items-center justify-center gap-2"
                >
                  <Sparkles className="h-5 w-5" />
                  <span>Create My Business Profile</span>
                </button>
              </div>
            </div>
          )}

          {/* Navigation Controls (Steps 2 to 8) */}
          {currentStep > 1 && currentStep < 9 && (
            <div className="flex items-center justify-between pt-6 border-t border-slate-800/80">
              <button
                type="button"
                onClick={prevStep}
                className="px-5 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-slate-300 font-medium text-xs hover:bg-slate-800/80 transition-all flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back</span>
              </button>

              <button
                type="button"
                onClick={validateAndNext}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 hover:brightness-110 active:scale-[0.99] transition-all flex items-center gap-2"
              >
                <span>Continue</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* Step 9 Back Control */}
          {currentStep === 9 && (
            <div className="pt-2">
              <button
                type="button"
                onClick={prevStep}
                className="w-full py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-slate-400 font-medium text-xs hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Edit Goals</span>
              </button>
            </div>
          )}

        </div>
      </main>
    </div>
  );
};
