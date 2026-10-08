import { 
  CustomerListItem, 
  CustomerKpi, 
  CustomerHealthScore, 
  CustomerSegmentItem, 
  RevenueDriverItem, 
  RetentionDataPoint, 
  AtRiskCustomerItem, 
  CustomerInsight, 
  CustomerOpportunity 
} from '../types/customers';

export const CUSTOMER_KPIS_DEMO: CustomerKpi[] = [
  {
    id: 'total_customers',
    title: 'Total Customers',
    value: '1,428',
    change: '+12.4%',
    isPositive: true,
    indicator: 'vs. previous 30 days',
    iconName: 'Users'
  },
  {
    id: 'new_customers',
    title: 'New Customers',
    value: '184',
    change: '+8.1%',
    isPositive: true,
    indicator: '30-day new acquisitions',
    iconName: 'UserPlus'
  },
  {
    id: 'returning_customers',
    title: 'Returning Customers',
    value: '642',
    change: '+15.2%',
    isPositive: true,
    indicator: 'active repeat diners & regulars',
    iconName: 'UserCheck'
  },
  {
    id: 'repeat_rate',
    title: 'Repeat Customer Rate',
    value: '44.9%',
    change: '+3.5%',
    isPositive: true,
    indicator: 'industry benchmark: 35%',
    iconName: 'Repeat'
  },
  {
    id: 'avg_customer_value',
    title: 'Average Customer Value',
    value: '₹4,850',
    change: '+₹340',
    isPositive: true,
    indicator: 'LTV lifetime estimate',
    iconName: 'DollarSign'
  },
  {
    id: 'at_risk_customers',
    title: 'At-Risk Customers',
    value: '24',
    change: '-5 count',
    isPositive: true, // fewer at risk is good
    indicator: 'pending re-engagement',
    iconName: 'AlertTriangle'
  }
];

export const CUSTOMER_HEALTH_DEMO: CustomerHealthScore = {
  overallScore: 82,
  statusText: 'Healthy Cafe Dynamics',
  explanation: 'Nish Cafe exhibits a high repeat diner rate (44.9%) with steady weekday office traffic and strong weekend family brunch visits.',
  factors: [
    {
      name: 'Customer Growth',
      score: 20,
      maxScore: 25,
      description: 'Acquisition velocity is steady with 184 new customers this month.',
      status: 'good'
    },
    {
      name: 'Customer Retention',
      score: 21,
      maxScore: 25,
      description: '68% of 90-day diners return within 30 days.',
      status: 'good'
    },
    {
      name: 'Repeat Purchases',
      score: 22,
      maxScore: 25,
      description: 'Repeat customer rate of 44.9% exceeds restaurant benchmarks.',
      status: 'good'
    },
    {
      name: 'Customer Value',
      score: 19,
      maxScore: 25,
      description: 'Average Order Value is ₹420, with top 10% contributing 38% revenue.',
      status: 'good'
    }
  ]
};

export const CUSTOMER_SEGMENTS_DEMO: CustomerSegmentItem[] = [
  {
    id: 'seg_new',
    name: 'New',
    count: 184,
    percentage: 12.9,
    avgValue: 350.00,
    color: '#38bdf8', // sky-400
    description: 'First order within the last 30 days'
  },
  {
    id: 'seg_returning',
    name: 'Returning',
    count: 642,
    percentage: 44.9,
    avgValue: 850.00,
    color: '#10b981', // emerald-500
    description: '2-4 visits in customer lifetime'
  },
  {
    id: 'seg_loyal',
    name: 'High Value',
    count: 215,
    percentage: 15.1,
    avgValue: 4850.00,
    color: '#8b5cf6', // violet-500
    description: '5+ visits with total spend > ₹4,000'
  },
  {
    id: 'seg_at_risk',
    name: 'At Risk',
    count: 24,
    percentage: 1.7,
    avgValue: 1200.00,
    color: '#f59e0b', // amber-500
    description: 'No visit in past 45+ days'
  },
  {
    id: 'seg_inactive',
    name: 'Inactive',
    count: 363,
    percentage: 25.4,
    avgValue: 320.00,
    color: '#64748b', // slate-500
    description: 'No visit in past 180+ days'
  }
];

export const CUSTOMERS_LIST_DEMO: CustomerListItem[] = [
  {
    id: 'cust_101',
    name: 'Rahul Sharma',
    email: 'rahul.sharma@hitec-tech.com',
    phone: '+91 98765 43210',
    location: 'HITEC City, Hyderabad',
    orders: 28,
    totalSpent: 14200.00,
    lastPurchase: '2 days ago',
    avgOrderValue: 507.14,
    segment: 'High Value',
    status: 'Loyal',
    avatarColor: 'bg-violet-500/20 text-violet-400 border-violet-500/40'
  },
  {
    id: 'cust_102',
    name: 'Ananya Reddy',
    email: 'ananya.reddy@jubileedesigns.in',
    phone: '+91 98123 45678',
    location: 'Jubilee Hills, Hyderabad',
    orders: 19,
    totalSpent: 9800.00,
    lastPurchase: '3 days ago',
    avgOrderValue: 515.78,
    segment: 'High Value',
    status: 'Loyal',
    avatarColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
  },
  {
    id: 'cust_103',
    name: 'Vikram Varma',
    email: 'vikram@hydstartups.io',
    phone: '+91 97012 34567',
    location: 'Madhapur, Hyderabad',
    orders: 34,
    totalSpent: 16500.00,
    lastPurchase: '1 day ago',
    avgOrderValue: 485.29,
    segment: 'High Value',
    status: 'Loyal',
    avatarColor: 'bg-teal-500/20 text-teal-400 border-teal-500/40'
  },
  {
    id: 'cust_104',
    name: 'Priya Rao',
    email: 'priya.rao@infodev.com',
    phone: '+91 96543 21098',
    location: 'Gachibowli, Hyderabad',
    orders: 6,
    totalSpent: 4800.00,
    lastPurchase: '48 days ago',
    avgOrderValue: 800.00,
    segment: 'At Risk',
    status: 'At Risk',
    avatarColor: 'bg-amber-500/20 text-amber-400 border-amber-500/40'
  },
  {
    id: 'cust_105',
    name: 'Sai Teja',
    email: 'saiteja@banjarahills.in',
    phone: '+91 95432 10987',
    location: 'Banjara Hills, Hyderabad',
    orders: 2,
    totalSpent: 850.00,
    lastPurchase: '4 days ago',
    avgOrderValue: 425.00,
    segment: 'New',
    status: 'Active',
    avatarColor: 'bg-sky-500/20 text-sky-400 border-sky-500/40'
  },
  {
    id: 'cust_106',
    name: 'Sneha Kulkarni',
    email: 'sneha.k@kondapurdev.in',
    phone: '+91 94321 09876',
    location: 'Kondapur, Hyderabad',
    orders: 22,
    totalSpent: 12400.00,
    lastPurchase: '5 days ago',
    avgOrderValue: 563.63,
    segment: 'High Value',
    status: 'Loyal',
    avatarColor: 'bg-rose-500/20 text-rose-400 border-rose-500/40'
  },
  {
    id: 'cust_107',
    name: 'Arjun Mehta',
    email: 'arjun.mehta@fin-district.com',
    phone: '+91 93210 98765',
    location: 'Financial District, Hyderabad',
    orders: 18,
    totalSpent: 11200.00,
    lastPurchase: '6 days ago',
    avgOrderValue: 622.22,
    segment: 'High Value',
    status: 'Loyal',
    avatarColor: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/40'
  },
  {
    id: 'cust_108',
    name: 'Kavya Nambiar',
    email: 'kavya@hiteccity.io',
    phone: '+91 92109 87654',
    location: 'HITEC City, Hyderabad',
    orders: 11,
    totalSpent: 6500.00,
    lastPurchase: '14 days ago',
    avgOrderValue: 590.90,
    segment: 'Returning',
    status: 'Active',
    avatarColor: 'bg-teal-500/20 text-teal-400 border-teal-500/40'
  }
];

export const REVENUE_DRIVERS_DEMO: RevenueDriverItem[] = [
  {
    id: 'rd_1',
    name: 'High-Value VIP Segment',
    type: 'Segment',
    orders: 1240,
    totalRevenue: 268750,
    avgOrderValue: 216.73,
    lastPurchase: 'Today',
    sharePercentage: 42.5
  },
  {
    id: 'rd_2',
    name: 'Eleanor Vance',
    type: 'Customer',
    orders: 14,
    totalRevenue: 1840.50,
    avgOrderValue: 131.46,
    lastPurchase: '2 days ago',
    sharePercentage: 2.9
  },
  {
    id: 'rd_3',
    name: 'Marcus Sterling',
    type: 'Customer',
    orders: 9,
    totalRevenue: 1420.00,
    avgOrderValue: 157.77,
    lastPurchase: '5 days ago',
    sharePercentage: 2.2
  },
  {
    id: 'rd_4',
    name: 'Returning Regulars',
    type: 'Segment',
    orders: 1980,
    totalRevenue: 169800,
    avgOrderValue: 85.75,
    lastPurchase: 'Yesterday',
    sharePercentage: 26.8
  },
  {
    id: 'rd_5',
    name: 'Sophia Chen',
    type: 'Customer',
    orders: 6,
    totalRevenue: 780.25,
    avgOrderValue: 130.04,
    lastPurchase: '12 days ago',
    sharePercentage: 1.2
  }
];

export const RETENTION_TREND_DEMO: RetentionDataPoint[] = [
  { month: 'May', repeatRate: 38.2, firstTime: 140, returning: 410 },
  { month: 'Jun', repeatRate: 39.5, firstTime: 152, returning: 445 },
  { month: 'Jul', repeatRate: 41.0, firstTime: 165, returning: 490 },
  { month: 'Aug', repeatRate: 42.4, firstTime: 172, returning: 535 },
  { month: 'Sep', repeatRate: 43.8, firstTime: 178, returning: 590 },
  { month: 'Oct', repeatRate: 44.9, firstTime: 184, returning: 642 }
];

export const AT_RISK_CUSTOMERS_DEMO: AtRiskCustomerItem[] = [
  {
    id: 'risk_1',
    customerName: 'David Miller',
    email: 'd.miller@techlink.net',
    lastPurchase: '62 days ago',
    daysSinceLastPurchase: 62,
    previousFrequency: 'Every 18 days',
    riskLevel: 'High',
    suggestedAction: 'Send Reminder',
    estimatedLostRevenue: 240.00
  },
  {
    id: 'risk_2',
    customerName: 'Robert Thorne',
    email: 'r.thorne@globalcraft.org',
    lastPurchase: '75 days ago',
    daysSinceLastPurchase: 75,
    previousFrequency: 'Every 21 days',
    riskLevel: 'High',
    suggestedAction: 'Offer Personalized Promotion',
    estimatedLostRevenue: 300.00
  },
  {
    id: 'risk_3',
    customerName: 'Elena Rostova',
    email: 'elena.r@northwind.com',
    lastPurchase: '48 days ago',
    daysSinceLastPurchase: 48,
    previousFrequency: 'Every 14 days',
    riskLevel: 'Medium',
    suggestedAction: 'Check Customer Experience',
    estimatedLostRevenue: 180.00
  },
  {
    id: 'risk_4',
    customerName: 'Harrison Ford',
    email: 'h.ford@skybound.net',
    lastPurchase: '40 days ago',
    daysSinceLastPurchase: 40,
    previousFrequency: 'Every 15 days',
    riskLevel: 'Low',
    suggestedAction: 'Re-engage',
    estimatedLostRevenue: 135.00
  }
];

export const AI_CUSTOMER_INSIGHTS_DEMO: CustomerInsight[] = [
  {
    id: 'insight_1',
    category: 'Retention',
    whatWeFound: 'Returning customers generate significantly higher average order values ($130+) than first-time buyers ($85).',
    whyItMatters: 'Improving repeat purchases by 5% could increase total monthly revenue by over 14% without incurring additional customer acquisition costs.',
    whatToDo: 'Create an automated post-purchase email onboarding sequence for recent first-time buyers within 7 days of their initial order.'
  },
  {
    id: 'insight_2',
    category: 'Value',
    whatWeFound: '24 customers who previously purchased every 2-3 weeks have exceeded their expected purchase window by 30+ days.',
    whyItMatters: 'At-risk high-frequency customers represent $1,850 in monthly recurring revenue currently at danger of churning.',
    whatToDo: 'Deploy a win-back campaign offering a 15% personalized incentive or reach out via VIP support for direct feedback.'
  }
];

export const CUSTOMER_OPPORTUNITY_DEMO: CustomerOpportunity = {
  id: 'opp_1',
  title: 'Growth Opportunity',
  potentialOpportunity: 'Convert first-time customers into repeat customers',
  targetAudience: '184 recent first-time buyers (past 30 days)',
  recommendedAction: 'Trigger a 14-day post-purchase automated re-engagement campaign offering personalized product recommendations.',
  expectedImpact: 'Estimated +$4,200 to +$6,500 monthly recurring revenue gain based on standard 18% repeat conversion lift.'
};
