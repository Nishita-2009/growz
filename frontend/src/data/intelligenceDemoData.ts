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
      currentValue: '21%',
      trend: 'down',
      isPositive: false,
      benchmarkValue: '28%'
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
      currentValue: '48.5%',
      trend: 'flat',
      isPositive: true,
      benchmarkValue: '45.0%'
    },
    {
      metricKey: 'inventory_turnover',
      category: 'Inventory',
      name: 'Stagnant Stock Ratio',
      currentValue: '18%',
      trend: 'up',
      isPositive: false,
      benchmarkValue: '<10%'
    },
    {
      metricKey: 'ad_conversion_rate',
      category: 'Marketing',
      name: 'Marketing ROAS',
      currentValue: '2.4x',
      trend: 'down',
      isPositive: false,
      benchmarkValue: '3.5x'
    }
  ]
};

export const DEMO_OPPORTUNITIES: Opportunity[] = [
  {
    id: 'opp-repeat-customers',
    title: 'Increase Repeat Customers',
    category: 'Customers',
    priority: 'High',
    problem: 'Repeat customer activity is declining.',
    evidence: 'Repeat customer rate decreased over the last 3 months from 28% to 21%.',
    reasoning: '340 customer profiles with prior orders >$150 have had no repeat transaction in 75+ days. Re-engaging past buyers is 5x cheaper than acquiring new ones.',
    whyItMatters: 'Returning customers contribute disproportionately to steady cash flow and have higher average order values.',
    recommendedAction: 'Launch a re-engagement campaign for recent customers offering a 15% limited-time incentive.',
    expectedImpact: 'Potential +4-6% increase in repeat customer retention ($4,200 monthly lift).',
    difficulty: 'Medium',
    confidence: 'High',
    relatedModule: '/app/customers'
  },
  {
    id: 'opp-prevent-stockout',
    title: 'Prevent Product Stockout',
    category: 'Inventory',
    priority: 'High',
    problem: 'Fast-moving inventory is approaching reorder levels.',
    evidence: 'Hero SKU "Wireless Ergonomic Keyboard" has approximately 5 days of safety stock remaining at current burn rate.',
    reasoning: 'Supplier lead times average 8 days. Stockout will result in missed sales of ~$1,800 per week.',
    whyItMatters: 'Stockouts of top-selling items harm organic store rank and cause customer attrition to competitors.',
    recommendedAction: 'Review reorder quantity and expedite supplier purchase order.',
    expectedImpact: 'Prevented revenue loss of ~$2,500 and maintained delivery SLAs.',
    difficulty: 'Easy',
    confidence: 'High',
    relatedModule: '/app/inventory'
  },
  {
    id: 'opp-marketing-conversion',
    title: 'Improve Marketing Conversion',
    category: 'Marketing',
    priority: 'Medium',
    problem: 'Marketing engagement is strong but customer conversion is weak.',
    evidence: 'Social ad click-through rate is high (3.8%) but web store conversion rate dropped to 1.2%.',
    reasoning: 'Landing page copy does not match ad creative promises. Friction at checkout cart page is causing drop-offs.',
    whyItMatters: 'Low conversion efficiency inflates customer acquisition cost (CAC) and wastes marketing ad budget.',
    recommendedAction: 'Improve the conversion path from marketing channel to purchase by aligning landing page value proposition.',
    expectedImpact: 'Potential 20-30% improvement in checkout conversion rate.',
    difficulty: 'Medium',
    confidence: 'High',
    relatedModule: '/app/marketing'
  },
  {
    id: 'opp-cart-abandonment',
    title: 'Recover Abandoned Cart Revenue',
    category: 'Revenue',
    priority: 'High',
    problem: 'Checkout cart abandonment rate spiked to 68% this month.',
    evidence: 'Analytics indicate drop-off is triggered primarily at shipping fee calculation screen.',
    reasoning: 'Shoppers abandoned 184 carts in the last 14 days representing $9,400 in merchandise.',
    whyItMatters: 'Automated cart recovery flows recover high-intent shoppers with minimal cost.',
    recommendedAction: 'Deploy automated 2-stage cart recovery SMS & email sequence with free shipping threshold coupon.',
    expectedImpact: 'Estimated +$3,200 monthly recovered revenue lift.',
    difficulty: 'Easy',
    confidence: 'High',
    relatedModule: '/app/financials'
  },
  {
    id: 'opp-supplier-renegotiate',
    title: 'Renegotiate Supplier Pricing',
    category: 'Profitability',
    priority: 'Medium',
    problem: 'Cost of Goods Sold (COGS) increased by 4.5% due to unadjusted vendor tiering.',
    evidence: 'Annual order volume doubled over the last 12 months, but unit purchase price remained flat.',
    reasoning: 'Doubling volume without vendor price adjustments results in margin compression. Tier 2 discounts are standard for this order bracket.',
    whyItMatters: 'A 3% reduction in COGS expands gross operating margin directly.',
    recommendedAction: 'Leverage volume growth to request tier-2 wholesale pricing discount or Net-60 payment terms.',
    expectedImpact: 'Gross profit expansion of ~$2,800 monthly.',
    difficulty: 'Hard',
    confidence: 'Medium',
    relatedModule: '/app/financials'
  },
  {
    id: 'opp-labor-scheduling',
    title: 'Optimize Operational Staffing',
    category: 'Operations',
    priority: 'Low',
    problem: 'Staffing hours are misaligned with peak customer foot traffic hours.',
    evidence: 'Over-staffing detected on Tuesday mornings while Saturday afternoon wait times exceed 15 mins.',
    reasoning: 'Heatmap velocity analysis shows labor capacity is misallocated during low-demand time windows.',
    whyItMatters: 'Optimizing staff schedule improves customer satisfaction while controlling hourly labor overhead.',
    recommendedAction: 'Adjust shift schedules to match historical peak order velocity.',
    expectedImpact: '10% reduction in labor cost and improved service speed.',
    difficulty: 'Medium',
    confidence: 'Medium',
    relatedModule: '/app/settings'
  }
];
