import { BusinessProfile } from '../types/businessProfile';
import { 
  DashboardConfig, 
  KPICardConfig, 
  DashboardSectionConfig, 
  SidebarModuleConfig, 
  GrowthScoreCategory, 
  GrowthMission 
} from '../types/dashboard';

export function getDashboardConfig(profile: BusinessProfile): DashboardConfig {
  const businessName = profile.businessName || 'My Business';
  const rawCategory = (profile.businessType || '').toLowerCase();

  // Determine normalized category
  let categoryKey: 'Retail' | 'Restaurant' | 'Manufacturing' | 'Service Business' | 'E-commerce' | 'Professional Services' | 'Other' = 'Other';

  if (rawCategory.includes('retail')) {
    categoryKey = 'Retail';
  } else if (rawCategory.includes('food') || rawCategory.includes('restaurant') || rawCategory.includes('beverage')) {
    categoryKey = 'Restaurant';
  } else if (rawCategory.includes('manufacturing') || rawCategory.includes('production')) {
    categoryKey = 'Manufacturing';
  } else if (rawCategory.includes('e-commerce') || rawCategory.includes('online store')) {
    categoryKey = 'E-commerce';
  } else if (rawCategory.includes('consulting') || rawCategory.includes('software') || rawCategory.includes('technology')) {
    categoryKey = 'Professional Services';
  } else if (rawCategory.includes('service')) {
    categoryKey = 'Service Business';
  }

  // 1. Title & Welcome Message
  const title = `${businessName} Dashboard`;
  const welcomeMessage = `Welcome back! Here is your AI-curated growth overview tailored for ${businessName} (${categoryKey}).`;

  // 2. Base KPI Cards by Category
  let kpiCards: KPICardConfig[] = [];

  switch (categoryKey) {
    case 'Retail':
      kpiCards = [
        { id: 'rev', title: 'Monthly Revenue', value: profile.avgMonthlyRevenue || '₹4.2 Lakhs', change: '+12.5%', isPositive: true, period: 'vs last month', iconName: 'DollarSign', category: 'revenue' },
        { id: 'orders', title: 'Total Store Orders', value: '340 Orders', change: '+8.2%', isPositive: true, period: 'vs last month', iconName: 'ShoppingBag', category: 'operations' },
        { id: 'cust', title: 'Total Customers', value: profile.activeCustomersCount || '1,240', change: '+15.4%', isPositive: true, period: 'vs last month', iconName: 'Users', category: 'customers' },
        { id: 'repeat', title: 'Repeat Customer Rate', value: profile.repeatCustomersPercentage || '42%', change: '+4.1%', isPositive: true, period: 'vs last month', iconName: 'Target', category: 'customers' },
        { id: 'inv', title: 'Active Inventory SKUs', value: profile.offeringCount || '1,850 SKUs', change: '-2.0%', isPositive: false, period: 'stock rotation', iconName: 'Package', category: 'operations' },
        { id: 'exp', title: 'Monthly Expenses', value: profile.avgMonthlyExpenses || '₹1.8 Lakhs', change: '-3.2%', isPositive: true, period: 'optimized', iconName: 'PieChart', category: 'expenses' },
      ];
      break;

    case 'Restaurant':
      kpiCards = [
        { id: 'rev', title: 'Monthly Sales', value: profile.avgMonthlyRevenue || '₹5.8 Lakhs', change: '+14.2%', isPositive: true, period: 'vs last month', iconName: 'DollarSign', category: 'revenue' },
        { id: 'orders', title: 'Total Food Orders', value: '1,450 Orders', change: '+9.6%', isPositive: true, period: 'vs last month', iconName: 'Utensils', category: 'operations' },
        { id: 'aov', title: 'Avg Order Value (AOV)', value: profile.avgOrderValue || '₹400', change: '+2.5%', isPositive: true, period: 'per order', iconName: 'TrendingUp', category: 'revenue' },
        { id: 'repeat', title: 'Repeat Diner Rate', value: profile.repeatCustomersPercentage || '68%', change: '+5.0%', isPositive: true, period: 'loyalty rate', iconName: 'Target', category: 'customers' },
        { id: 'food_cost', title: 'Food & Inventory Cost', value: '32% of Rev', change: '-1.5%', isPositive: true, period: 'margin health', iconName: 'Package', category: 'expenses' },
        { id: 'mktg', title: 'Local Promo Spend', value: profile.monthlyMarketingSpend || '₹25,000', change: '+10.0%', isPositive: true, period: 'vs last month', iconName: 'Share2', category: 'marketing' },
      ];
      break;

    case 'Manufacturing':
      kpiCards = [
        { id: 'rev', title: 'Gross Revenue', value: profile.avgMonthlyRevenue || '₹18.5 Lakhs', change: '+18.0%', isPositive: true, period: 'vs last month', iconName: 'DollarSign', category: 'revenue' },
        { id: 'orders', title: 'Production Batches', value: '42 Batches', change: '+12.0%', isPositive: true, period: 'vs last month', iconName: 'Factory', category: 'operations' },
        { id: 'raw_stock', title: 'Raw Material Stock', value: '₹6.5 Lakhs', change: '+3.5%', isPositive: true, period: 'warehouse stock', iconName: 'Package', category: 'operations' },
        { id: 'suppliers', title: 'Active Suppliers', value: profile.supplierCount || '12 Suppliers', change: 'Stable', isPositive: true, period: 'active contracts', iconName: 'Users', category: 'operations' },
        { id: 'exp', title: 'Operating Expenses', value: profile.avgMonthlyExpenses || '₹11.2 Lakhs', change: '-4.0%', isPositive: true, period: 'vs last month', iconName: 'PieChart', category: 'expenses' },
        { id: 'profit', title: 'Gross Margin', value: profile.approxMonthlyProfit || '39.5%', change: '+2.1%', isPositive: true, period: 'net margin', iconName: 'TrendingUp', category: 'revenue' },
      ];
      break;

    case 'Service Business':
      kpiCards = [
        { id: 'rev', title: 'Monthly Revenue', value: profile.avgMonthlyRevenue || '₹6.4 Lakhs', change: '+15.8%', isPositive: true, period: 'vs last month', iconName: 'DollarSign', category: 'revenue' },
        { id: 'bookings', title: 'Completed Bookings', value: '88 Services', change: '+11.2%', isPositive: true, period: 'vs last month', iconName: 'Calendar', category: 'operations' },
        { id: 'cust', title: 'Active Service Clients', value: profile.activeCustomersCount || '210 Clients', change: '+14.0%', isPositive: true, period: 'total active', iconName: 'Users', category: 'customers' },
        { id: 'repeat', title: 'Repeat Retainer Rate', value: profile.repeatCustomersPercentage || '58%', change: '+6.2%', isPositive: true, period: 'renewal rate', iconName: 'Target', category: 'customers' },
        { id: 'asv', title: 'Avg Service Contract', value: profile.avgSellingPrice || '₹7,200', change: '+5.0%', isPositive: true, period: 'per booking', iconName: 'TrendingUp', category: 'revenue' },
        { id: 'exp', title: 'Monthly Overhead', value: profile.avgMonthlyExpenses || '₹2.1 Lakhs', change: '-2.0%', isPositive: true, period: 'vs last month', iconName: 'PieChart', category: 'expenses' },
      ];
      break;

    case 'E-commerce':
      kpiCards = [
        { id: 'rev', title: 'Online Revenue', value: profile.avgMonthlyRevenue || '₹9.2 Lakhs', change: '+22.4%', isPositive: true, period: 'vs last month', iconName: 'DollarSign', category: 'revenue' },
        { id: 'orders', title: 'Website Orders', value: '1,120 Orders', change: '+18.5%', isPositive: true, period: 'vs last month', iconName: 'ShoppingBag', category: 'operations' },
        { id: 'aov', title: 'Average Order Value', value: profile.avgOrderValue || '₹820', change: '+4.8%', isPositive: true, period: 'per checkout', iconName: 'TrendingUp', category: 'revenue' },
        { id: 'cust', title: 'Registered Customers', value: profile.activeCustomersCount || '3,400', change: '+20.1%', isPositive: true, period: 'vs last month', iconName: 'Users', category: 'customers' },
        { id: 'repeat', title: 'Repeat Purchase Rate', value: profile.repeatCustomersPercentage || '34%', change: '+2.1%', isPositive: true, period: 'vs last month', iconName: 'Target', category: 'customers' },
        { id: 'mktg', title: 'Ad Spend (ROAS 4.2x)', value: profile.monthlyMarketingSpend || '₹45,000', change: '+15.0%', isPositive: true, period: 'meta & search', iconName: 'Share2', category: 'marketing' },
      ];
      break;

    case 'Professional Services':
      kpiCards = [
        { id: 'rev', title: 'Monthly Retainers', value: profile.avgMonthlyRevenue || '₹12.0 Lakhs', change: '+10.5%', isPositive: true, period: 'vs last month', iconName: 'DollarSign', category: 'revenue' },
        { id: 'clients', title: 'Active Retainer Clients', value: '18 Clients', change: '+2 Client', isPositive: true, period: 'vs last month', iconName: 'Users', category: 'customers' },
        { id: 'projects', title: 'Active Deliverables', value: '14 Projects', change: 'On Track', isPositive: true, period: 'current milestone', iconName: 'Calendar', category: 'operations' },
        { id: 'repeat', title: 'Client Retention', value: profile.repeatCustomersPercentage || '75%', change: '+2.0%', isPositive: true, period: 'renewal rate', iconName: 'Target', category: 'customers' },
        { id: 'acv', title: 'Avg Account Value', value: profile.avgSellingPrice || '₹66,000', change: '+8.5%', isPositive: true, period: 'per retainer', iconName: 'TrendingUp', category: 'revenue' },
        { id: 'exp', title: 'Team & Operating Costs', value: profile.avgMonthlyExpenses || '₹3.5 Lakhs', change: '-1.8%', isPositive: true, period: 'vs last month', iconName: 'PieChart', category: 'expenses' },
      ];
      break;

    default:
      kpiCards = [
        { id: 'rev', title: 'Total Revenue', value: profile.avgMonthlyRevenue || '₹5.0 Lakhs', change: '+10.0%', isPositive: true, period: 'vs last month', iconName: 'DollarSign', category: 'revenue' },
        { id: 'cust', title: 'Active Customers', value: profile.activeCustomersCount || '450', change: '+8.5%', isPositive: true, period: 'vs last month', iconName: 'Users', category: 'customers' },
        { id: 'orders', title: 'Transactions / Orders', value: '230', change: '+5.4%', isPositive: true, period: 'vs last month', iconName: 'ShoppingBag', category: 'operations' },
        { id: 'profit', title: 'Profit Margin', value: profile.approxMonthlyProfit || '25.0%', change: '+1.5%', isPositive: true, period: 'vs last month', iconName: 'TrendingUp', category: 'revenue' },
        { id: 'exp', title: 'Operating Expenses', value: profile.avgMonthlyExpenses || '₹2.2 Lakhs', change: '-2.5%', isPositive: true, period: 'vs last month', iconName: 'PieChart', category: 'expenses' },
      ];
      break;
  }

  // 3. Goal Prioritization on KPIs & Sections
  const userGoals = profile.goals || [];
  let primaryFocus = 'Balanced Business Growth';

  if (userGoals.includes('Increase revenue')) {
    primaryFocus = 'Revenue & Sales Growth';
    kpiCards.sort((a, b) => (a.category === 'revenue' ? -1 : 1));
  } else if (userGoals.includes('Increase profit')) {
    primaryFocus = 'Profitability & Expense Optimization';
    kpiCards.sort((a, b) => (a.category === 'expenses' || a.title.includes('Margin') ? -1 : 1));
  } else if (userGoals.includes('Get more customers')) {
    primaryFocus = 'Customer Acquisition & Marketing';
    kpiCards.sort((a, b) => (a.category === 'customers' || a.category === 'marketing' ? -1 : 1));
  } else if (userGoals.includes('Improve inventory')) {
    primaryFocus = 'Inventory & Operational Efficiency';
    kpiCards.sort((a, b) => (a.category === 'operations' ? -1 : 1));
  }

  // 4. Dashboard Sections
  const sections: DashboardSectionConfig[] = [
    {
      id: 'sec_metrics',
      title: 'Key Performance Indicators',
      subtitle: `Curated KPIs prioritized for ${primaryFocus}`,
      priority: 1,
      type: 'metrics_grid',
    },
    {
      id: 'sec_growth',
      title: 'AI Growth Opportunities',
      subtitle: `Identified growth levers for ${profile.mainOffering || businessName}`,
      priority: 2,
      type: 'growth_opportunities',
    },
    {
      id: 'sec_ops',
      title: 'Operational Health & Inventory',
      subtitle: `Tracking ${profile.locationCount || '1'} location(s) and supplier relationships`,
      priority: 3,
      type: 'operations_summary',
    },
    {
      id: 'sec_marketing',
      title: 'Marketing & Channel Reach',
      subtitle: `Active reach across ${profile.primarySalesChannels.length || 1} sales channel(s)`,
      priority: 4,
      type: 'marketing_roi',
    },
  ];

  // Sort sections by priority
  sections.sort((a, b) => a.priority - b.priority);

  // 5. Sidebar Modules
  const hasDigitalMarketing = profile.hasInstagram || profile.hasFacebook || profile.hasWebsite || profile.hasGoogleBusiness || profile.hasWhatsAppBusiness;
  const hasInventory = profile.maintainsInventory === 'Yes' || ['Retail', 'Manufacturing', 'E-commerce', 'Restaurant'].includes(categoryKey);

  const sidebarModules: SidebarModuleConfig[] = [
    { id: 'overview', label: 'Overview Dashboard', iconName: 'LayoutDashboard', enabled: true },
    { id: 'analytics', label: 'Financial Analytics', iconName: 'BarChart2', enabled: true },
    { id: 'inventory', label: 'Inventory & Stock', iconName: 'Package', badge: hasInventory ? 'Active' : undefined, enabled: hasInventory },
    { id: 'customers', label: 'Customers & CRM', iconName: 'Users', enabled: true },
    { id: 'marketing', label: 'Marketing Channels', iconName: 'Share2', badge: hasDigitalMarketing ? 'Active' : undefined, enabled: true },
    { id: 'goals', label: 'Growth Missions', iconName: 'Target', badge: `${userGoals.length} Goals`, enabled: true },
    { id: 'settings', label: 'Business Settings', iconName: 'Settings', enabled: true },
  ];

  // 6. Growth Score & Missions
  const growthScore = {
    overallScore: 82,
    categories: [
      {
        name: 'Financial Health',
        score: profile.skippedFinancials ? 60 : 85,
        maxScore: 100,
        status: (profile.skippedFinancials ? 'needs_attention' : 'excellent') as 'excellent' | 'good' | 'needs_attention',
        recommendation: profile.skippedFinancials ? 'Add revenue and expense metrics to unlock AI profit margin alerts.' : 'Strong gross profit margin relative to industry benchmark.',
      },
      {
        name: 'Customer Retention',
        score: 78,
        maxScore: 100,
        status: 'good' as 'excellent' | 'good' | 'needs_attention',
        recommendation: `Repeat customer rate is ${profile.repeatCustomersPercentage || 'solid'}. Launch automated WhatsApp re-engagement.`,
      },
      {
        name: 'Inventory Efficiency',
        score: hasInventory ? 88 : 95,
        maxScore: 100,
        status: 'excellent' as 'excellent' | 'good' | 'needs_attention',
        recommendation: hasInventory ? 'Stock turnover is optimal. Keep 15-day safety stock for top SKUs.' : 'Service-based model has zero inventory carrying cost overhead.',
      },
      {
        name: 'Digital & Marketing Reach',
        score: hasDigitalMarketing ? 80 : 55,
        maxScore: 100,
        status: (hasDigitalMarketing ? 'good' : 'needs_attention') as 'excellent' | 'good' | 'needs_attention',
        recommendation: hasDigitalMarketing ? 'Multi-channel presence detected. Focus on conversion tracking.' : 'Activate WhatsApp Business or Google Profile to double local lead flow.',
      },
    ],
  };

  const growthMissions: GrowthMission[] = [
    {
      id: 'm1',
      title: 'Automate Repeat Customer Outreach',
      category: 'Customer Retention',
      impact: 'High',
      effort: 'Easy',
      description: `Target existing ${profile.targetCustomerType || 'customers'} with post-purchase offers via WhatsApp.`,
    },
    {
      id: 'm2',
      title: `Optimize ${profile.mainOffering || 'Main Offering'} Margin`,
      category: 'Financial Health',
      impact: 'Critical',
      effort: 'Medium',
      description: `Review supplier prices and bundle complementary products to increase average order value above ${profile.avgSellingPrice || 'current tier'}.`,
    },
    {
      id: 'm3',
      title: 'Expand Primary Sales Channels',
      category: 'Sales Expansion',
      impact: 'High',
      effort: 'Medium',
      description: `Leverage ${profile.primarySalesChannels[0] || 'Digital Channels'} to double weekly order volume.`,
    },
  ];

  return {
    businessName,
    businessType: categoryKey,
    title,
    welcomeMessage,
    primaryFocus,
    kpiCards,
    sections,
    sidebarModules,
    growthScore,
    growthMissions,
  };
}
