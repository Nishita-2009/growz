import { Opportunity } from '../types/intelligence';

export interface BusinessSignal {
  metricKey: string;
  category: string;
  name: string;
  currentValue: string;
  trend: 'up' | 'down' | 'flat';
  isPositive: boolean;
  benchmarkValue: string;
}

export const DEMO_BUSINESS_SIGNALS: Record<string, BusinessSignal[]> = {
  default: [
    {
      metricKey: 'repeat_customer_rate',
      category: 'Customer Retention',
      name: 'Repeat Customer Rate',
      currentValue: '44.9%',
      trend: 'up',
      isPositive: true,
      benchmarkValue: '35.0%'
    },
    {
      metricKey: 'monthly_revenue_growth',
      category: 'Revenue Growth',
      name: 'MoM Sales Growth',
      currentValue: '+14.2%',
      trend: 'up',
      isPositive: true,
      benchmarkValue: '+10.0%'
    },
    {
      metricKey: 'gross_profit_margin',
      category: 'Profitability',
      name: 'Gross Profit Margin',
      currentValue: '60.0%',
      trend: 'flat',
      isPositive: true,
      benchmarkValue: '55.0%'
    },
    {
      metricKey: 'delivery_commission_rate',
      category: 'Profitability',
      name: 'Delivery App Fee Burden',
      currentValue: '22%',
      trend: 'up',
      isPositive: false,
      benchmarkValue: '<12%'
    },
    {
      metricKey: 'ad_conversion_rate',
      category: 'Marketing',
      name: 'Marketing ROAS',
      currentValue: '18.3x',
      trend: 'up',
      isPositive: true,
      benchmarkValue: '10.0x'
    }
  ]
};

export const DEMO_OPPORTUNITIES: Opportunity[] = [
  {
    id: 'opp-shift-direct-delivery',
    title: 'Shift Delivery Orders to WhatsApp Direct',
    category: 'Profitability',
    priority: 'High',
    problem: 'Swiggy & Zomato platform fees (22%) compress delivery margins.',
    evidence: 'Delivery platforms generated ₹1,45,500 in sales last month but incurred ₹32,010 in commission fees.',
    reasoning: 'Converting 25% of existing delivery customers to direct WhatsApp ordering saves 22% in platform fees while building direct customer relationships.',
    whyItMatters: 'Direct ordering creates higher margin sales and enables automated WhatsApp customer retention marketing.',
    recommendedAction: 'Insert a "10% Off Direct WhatsApp Order" printed QR coupon inside every Swiggy/Zomato takeaway bag.',
    expectedImpact: 'Estimated +₹18,000 monthly profit recovery.',
    difficulty: 'Easy',
    confidence: 'High',
    relatedModule: '/app/customers'
  },
  {
    id: 'opp-prevent-stockout',
    title: 'Prevent Specialty Coffee Beans Stockout',
    category: 'Inventory',
    priority: 'High',
    problem: 'Fast-moving hero item "Arabica Coffee Beans" is near reorder threshold.',
    evidence: 'Stock level is down to 8 bags (4 days of safety stock) with supplier lead time of 5 days.',
    reasoning: 'Coffee sales represent 45% of morning revenue. Stockout over the upcoming weekend will cause lost sales of ~₹45,000.',
    whyItMatters: 'Coffee stockouts disappoint regular morning commuters and damage customer loyalty.',
    recommendedAction: 'Issue an immediate purchase order for 30 kg Arabica Coffee Beans.',
    expectedImpact: 'Prevented revenue loss of ~₹45,000 and guaranteed weekend supply.',
    difficulty: 'Easy',
    confidence: 'High',
    relatedModule: '/app/inventory'
  },
  {
    id: 'opp-afternoon-combo',
    title: 'Launch Afternoon "Chai & Snack" Combo for IT Offices',
    category: 'Revenue',
    priority: 'High',
    problem: 'Off-peak foot traffic drops significantly between 3 PM and 6 PM.',
    evidence: 'POS analytics show 3 PM - 6 PM revenue averages only ₹1,200/hour vs ₹4,800/hour during lunch peak.',
    reasoning: 'Nearby HITEC City office workers look for tea/snack breaks between 4 PM - 5 PM.',
    whyItMatters: 'Filling off-peak seating capacity maximizes fixed cafe rent & staff utility.',
    recommendedAction: 'Create a ₹199 "Irani Chai + Osmania Biscuit / Snack" combo and broadcast via WhatsApp to local corporate contacts.',
    expectedImpact: 'Potential +₹25,000 weekly revenue boost during off-peak hours.',
    difficulty: 'Medium',
    confidence: 'High',
    relatedModule: '/app/marketing'
  },
  {
    id: 'opp-reengage-lapsed-diners',
    title: 'Re-engage Lapsed Cafe Regulars',
    category: 'Customers',
    priority: 'Medium',
    problem: '142 repeat cafe customers have not ordered in over 45 days.',
    evidence: 'Lapsed diners previously generated an average of ₹1,850/month in cafe sales.',
    reasoning: 'Personalized WhatsApp outreach with a complimentary dessert coupon recovers high-intent local regulars efficiently.',
    whyItMatters: 'Re-activating past regular customers costs 5x less than acquiring new diners.',
    recommendedAction: 'Send automated WhatsApp voucher for a free dessert on orders above ₹499.',
    expectedImpact: 'Estimated +₹35,000 recovered monthly restaurant revenue.',
    difficulty: 'Medium',
    confidence: 'High',
    relatedModule: '/app/customers'
  },
  {
    id: 'opp-ingredient-bulk-discount',
    title: 'Negotiate Bulk Dairy & Ingredient Discount',
    category: 'Profitability',
    priority: 'Medium',
    problem: 'Dairy & poultry supplier costs rose 4.5% over the past quarter.',
    evidence: 'Nish Cafe monthly milk and dairy spend reached ₹45,000 across 3 separate suppliers.',
    reasoning: 'Consolidating dairy procurement with a single wholesale dairy vendor in Hyderabad enables 6-8% volume discount.',
    whyItMatters: 'Reducing food ingredient COGS directly expands net profit margin.',
    recommendedAction: 'Consolidate dairy orders under a master contract with 60-day payment terms.',
    expectedImpact: 'Gross margin improvement of ~₹3,500 monthly.',
    difficulty: 'Hard',
    confidence: 'Medium',
    relatedModule: '/app/financials'
  }
];
