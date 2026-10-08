import { 
  MarketingKpi, 
  MarketingHealthScore, 
  ChannelPerformanceItem, 
  FunnelStage, 
  MarketingTrendDataPoint, 
  MarketingInsight, 
  MarketingOpportunityItem, 
  DigitalPresenceChannel, 
  CampaignItem 
} from '../types/marketing';

export const MARKETING_KPIS_DEMO: MarketingKpi[] = [
  {
    id: 'kpi_spend',
    title: 'Total Marketing Spend',
    value: '₹26,500',
    change: '-8.2%',
    isPositive: true,
    indicator: 'vs. previous 30 days',
    iconName: 'DollarSign'
  },
  {
    id: 'kpi_leads',
    title: 'Leads & Inquiries Generated',
    value: '482',
    change: '+18.4%',
    isPositive: true,
    indicator: 'WhatsApp chats & website visits',
    iconName: 'Users'
  },
  {
    id: 'kpi_customers',
    title: 'New Diners Acquired',
    value: '184',
    change: '+14.2%',
    isPositive: true,
    indicator: 'first-time Cafe & delivery orders',
    iconName: 'UserCheck'
  },
  {
    id: 'kpi_cac',
    title: 'Customer Acquisition Cost',
    value: '₹144.00',
    change: '-₹24.00',
    isPositive: true,
    indicator: 'blended CAC across channels',
    iconName: 'Target'
  },
  {
    id: 'kpi_roi',
    title: 'Marketing ROAS',
    value: '18.3x',
    change: '+2.5x',
    isPositive: true,
    indicator: 'revenue generated per ₹1 spent',
    iconName: 'TrendingUp'
  },
  {
    id: 'kpi_conversion',
    title: 'Conversion Rate',
    value: '38.2%',
    change: '+4.1%',
    isPositive: true,
    indicator: 'inquiry to order conversion',
    iconName: 'Zap'
  }
];

export const MARKETING_HEALTH_DEMO: MarketingHealthScore = {
  overallScore: 84,
  statusText: 'High ROI Local Acquisition',
  explanation: 'Nish Cafe Marketing Health score is 84/100. Google Local Maps and WhatsApp Direct generate high-intent cafe visits and orders (ROAS 32x-40x). Swiggy/Zomato promos drive volume but compress margins due to 22% platform fees.',
  factors: [
    {
      name: 'Channel Performance',
      score: 18,
      maxScore: 20,
      description: 'Multi-channel coverage across Instagram Reels, Google Maps, WhatsApp, and delivery apps.',
      status: 'good'
    },
    {
      name: 'Customer Acquisition',
      score: 17,
      maxScore: 20,
      description: '184 new cafe diners acquired at an efficient ₹144 blended CAC.',
      status: 'good'
    },
    {
      name: 'Conversion',
      score: 16,
      maxScore: 20,
      description: 'High WhatsApp & phone reservation conversion rate (38.2%).',
      status: 'good'
    },
    {
      name: 'Digital Presence',
      score: 17,
      maxScore: 20,
      description: 'Google Business 4.8★ profile active; Instagram reels reaching 24k local foodies.',
      status: 'good'
    },
    {
      name: 'Marketing Efficiency',
      score: 16,
      maxScore: 20,
      description: 'Outstanding 18.3x aggregate ROAS with low monthly ad budget.',
      status: 'good'
    }
  ]
};

export const CHANNELS_PERFORMANCE_DEMO: ChannelPerformanceItem[] = [
  {
    id: 'ch_ig',
    name: 'Instagram',
    iconName: 'Instagram',
    reach: 24500,
    engagement: 3820,
    leads: 112,
    customers: 14,
    conversionRate: 12.5,
    spend: 600,
    roi: 2.8,
    color: '#e1306c'
  },
  {
    id: 'ch_fb',
    name: 'Facebook',
    iconName: 'Facebook',
    reach: 18200,
    engagement: 1940,
    leads: 78,
    customers: 9,
    conversionRate: 11.5,
    spend: 450,
    roi: 2.4,
    color: '#1877f2'
  },
  {
    id: 'ch_gb',
    name: 'Google Business',
    iconName: 'Search',
    reach: 14800,
    engagement: 2650,
    leads: 145,
    customers: 26,
    conversionRate: 17.9,
    spend: 300,
    roi: 5.2,
    color: '#4285f4'
  },
  {
    id: 'ch_web',
    name: 'Website',
    iconName: 'Globe',
    reach: 19400,
    engagement: 4100,
    leads: 84,
    customers: 11,
    conversionRate: 13.1,
    spend: 200,
    roi: 3.6,
    color: '#10b981'
  },
  {
    id: 'ch_wa',
    name: 'WhatsApp',
    iconName: 'MessageSquare',
    reach: 3200,
    engagement: 2100,
    leads: 45,
    customers: 8,
    conversionRate: 17.8,
    spend: 100,
    roi: 4.8,
    color: '#25d366'
  },
  {
    id: 'ch_ads',
    name: 'Paid Advertising',
    iconName: 'Megaphone',
    reach: 38000,
    engagement: 1450,
    leads: 18,
    customers: 0,
    conversionRate: 0.0,
    spend: 1800,
    roi: 1.1,
    color: '#f59e0b'
  }
];

export const FUNNEL_STAGES_DEMO: FunnelStage[] = [
  {
    id: 'f_reach',
    name: 'Reach / Impressions',
    count: 118100,
    conversionFromPrevious: 100
  },
  {
    id: 'f_eng',
    name: 'Engagement / Clicks',
    count: 16060,
    conversionFromPrevious: 13.6
  },
  {
    id: 'f_leads',
    name: 'Leads Generated',
    count: 482,
    conversionFromPrevious: 3.0,
    isDropoffBottleneck: true,
    dropoffReason: 'High drop-off (97%) between social engagement and landing page inquiry.'
  },
  {
    id: 'f_customers',
    name: 'First-Time Customers',
    count: 68,
    conversionFromPrevious: 14.1
  },
  {
    id: 'f_repeat',
    name: 'Repeat Customers',
    count: 31,
    conversionFromPrevious: 45.6
  }
];

export const MARKETING_TREND_DEMO: Record<string, MarketingTrendDataPoint[]> = {
  '7 Days': [
    { date: 'Mon', leads: 14, customers: 2, spend: 110 },
    { date: 'Tue', leads: 18, customers: 3, spend: 120 },
    { date: 'Wed', leads: 15, customers: 2, spend: 105 },
    { date: 'Thu', leads: 22, customers: 4, spend: 130 },
    { date: 'Fri', leads: 26, customers: 5, spend: 145 },
    { date: 'Sat', leads: 31, customers: 6, spend: 160 },
    { date: 'Sun', leads: 20, customers: 3, spend: 115 }
  ],
  '30 Days': [
    { date: 'Week 1', leads: 95, customers: 14, spend: 780 },
    { date: 'Week 2', leads: 115, customers: 16, spend: 820 },
    { date: 'Week 3', leads: 132, customers: 18, spend: 890 },
    { date: 'Week 4', leads: 140, customers: 20, spend: 960 }
  ],
  '90 Days': [
    { date: 'Month 1', leads: 340, customers: 48, spend: 2800 },
    { date: 'Month 2', leads: 410, customers: 58, spend: 3100 },
    { date: 'Month 3', leads: 482, customers: 68, spend: 3450 }
  ]
};

export const AI_MARKETING_INSIGHTS_DEMO: MarketingInsight[] = [
  {
    id: 'msg_1',
    channelTag: 'Instagram vs Google',
    whatWeFound: 'Instagram generates the highest engagement (3,820 clicks/likes), but Google Business generates 30% more qualified leads with a much higher conversion rate (17.9%).',
    whyItMatters: 'Engagement on social media does not automatically translate into customer purchases without high-intent landing offers.',
    whatToDo: 'Shift 20% of low-performing paid social budget toward Google Business profile optimization and local search promotions.'
  },
  {
    id: 'msg_2',
    channelTag: 'Paid Advertising CAC',
    whatWeFound: 'Paid Advertising generated 38,000 impressions but yielded only 18 leads with a 1.1x ROI.',
    whyItMatters: 'Broad paid ad targeting is inflating overall CAC ($50.73) while retargeting and Google Search yield 4.5x higher return.',
    whatToDo: 'Refine paid ad audience parameters to focus on retargeting past website visitors rather than cold broad audiences.'
  }
];

export const MARKETING_OPPORTUNITIES_DEMO: MarketingOpportunityItem[] = [
  {
    id: 'opp_1',
    title: 'Improve Instagram → Customer Conversion',
    evidence: '3,820 engagement actions yielded only 14 paying customers (0.36% conversion).',
    recommendedAction: 'Add a direct WhatsApp booking link or clear offer link in bio and stories.',
    expectedImpact: 'Estimated +8 to +15 monthly additional sales from existing social traffic.',
    difficulty: 'Low',
    category: 'Social Media'
  },
  {
    id: 'opp_2',
    title: 'Increase Google Business Reviews',
    evidence: 'Google Business yields the highest lead conversion (17.9%) but has only 24 total reviews.',
    recommendedAction: 'Automate post-purchase review requests via SMS/WhatsApp for satisfied customers.',
    expectedImpact: 'Projected +25% increase in local search discovery inquiries.',
    difficulty: 'Low',
    category: 'Local SEO'
  },
  {
    id: 'opp_3',
    title: 'Re-engage Website Visitors',
    evidence: '19,400 website visitors led to 84 inquiries, leaving over 19,000 uncaptured.',
    recommendedAction: 'Deploy a subtle exit-intent offer popup capturing emails for a 10% first order discount.',
    expectedImpact: 'Potential +30 to +50 new leads per month.',
    difficulty: 'Medium',
    category: 'Website Optim'
  },
  {
    id: 'opp_4',
    title: 'Reduce Customer Acquisition Cost',
    evidence: 'Paid Advertising CAC is $100+ compared to organic Google CAC of $11.50.',
    recommendedAction: 'Reallocate $500 monthly paid budget to hyper-targeted search ads.',
    expectedImpact: 'Estimated reduction of overall CAC by $8.50 per acquired customer.',
    difficulty: 'Medium',
    category: 'Budget Allocation'
  }
];

export const DIGITAL_PRESENCE_DEMO: DigitalPresenceChannel[] = [
  {
    id: 'dp_web',
    name: 'Website',
    iconName: 'Globe',
    status: 'Connected',
    handleOrUrl: 'www.mybusiness.com',
    lastSynced: '10 mins ago',
    detail: 'SSL Active, Google Analytics & Pixel tracking verified.'
  },
  {
    id: 'dp_gb',
    name: 'Google Business Profile',
    iconName: 'Search',
    status: 'Connected',
    handleOrUrl: 'My Business - Downtown',
    lastSynced: '1 hour ago',
    detail: 'Claimed profile, 4.8 star average rating across 24 reviews.'
  },
  {
    id: 'dp_ig',
    name: 'Instagram Business',
    iconName: 'Instagram',
    status: 'Connected',
    handleOrUrl: '@mybusiness_official',
    lastSynced: '25 mins ago',
    detail: 'Professional Creator account connected, 4.2k followers.'
  },
  {
    id: 'dp_wa',
    name: 'WhatsApp Business',
    iconName: 'MessageSquare',
    status: 'Connected',
    handleOrUrl: '+1 (555) 019-2831',
    lastSynced: 'Live',
    detail: 'Automated greeting enabled, 18 active chat conversations.'
  },
  {
    id: 'dp_fb',
    name: 'Facebook Page',
    iconName: 'Facebook',
    status: 'Needs Attention',
    handleOrUrl: 'facebook.com/mybusiness',
    lastSynced: '3 days ago',
    detail: 'Access token expiring soon. Re-authenticate to resume sync.'
  }
];

export const CAMPAIGNS_DEMO: CampaignItem[] = [
  {
    id: 'camp_1',
    name: 'Spring Season Discount Promo',
    channel: 'Instagram',
    spend: 400,
    leads: 78,
    customers: 11,
    conversionRate: 14.1,
    roi: 3.2,
    status: 'Active'
  },
  {
    id: 'camp_2',
    name: 'Local Search Lead Capture',
    channel: 'Google Business',
    spend: 300,
    leads: 145,
    customers: 26,
    conversionRate: 17.9,
    roi: 5.2,
    status: 'Active'
  },
  {
    id: 'camp_3',
    name: 'Brand Awareness Video Campaign',
    channel: 'Paid Advertising',
    spend: 1200,
    leads: 12,
    customers: 0,
    conversionRate: 0.0,
    roi: 0.8,
    status: 'Needs Attention'
  },
  {
    id: 'camp_4',
    name: 'VIP Customer Re-engagement',
    channel: 'WhatsApp',
    spend: 100,
    leads: 45,
    customers: 8,
    conversionRate: 17.8,
    roi: 4.8,
    status: 'Completed'
  }
];
