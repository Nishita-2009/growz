import { Mission } from '../types/missions';

export const INITIAL_DEMO_MISSIONS: Mission[] = [
  {
    id: 'mission-repeat-customers',
    title: 'Increase Repeat Customers',
    category: 'Customers',
    priority: 'High',
    status: 'In Progress',
    isFeatured: true,
    problem: 'Your repeat customer rate has declined.',
    evidence: 'Repeat customer activity has decreased over the last 3 months from 28% to 21%.',
    whyItMatters: 'Returning customers can contribute significantly to revenue stability and have 3x higher conversion rate than new visitors.',
    aiReasoning: 'Cohort analysis reveals customers who purchased 60-90 days ago have not placed a repeat order. A targeted re-engagement incentive triggers high response rates for this segment.',
    recommendedAction: 'Launch a targeted re-engagement campaign for recent customers.',
    expectedImpact: 'Potential improvement in repeat purchases (+4-6% repeat purchase rate).',
    difficulty: 'Medium',
    estimatedTime: '7 days',
    createdAt: '2026-10-01',
    checklist: [
      { id: 'task-1', text: 'Identify target customers from 60-90 day purchase cohort', completed: true },
      { id: 'task-2', text: 'Create customized 15% discount campaign email with product recommendations', completed: true },
      { id: 'task-3', text: 'Launch campaign via email & SMS channels', completed: true },
      { id: 'task-4', text: 'Monitor customer coupon redemptions & open rates', completed: false },
      { id: 'task-5', text: 'Measure 30-day repeat purchase rate and net ROI', completed: false }
    ],
    insight: {
      problem: 'Repeat customer retention rate dropped by 7% over Q3.',
      evidence: 'Fact: 340 customers with >$150 initial order value have not returned in 75+ days.',
      reasoning: 'Recommendation: Re-engaging warm leads is 5x more cost-effective than acquiring cold traffic.',
      action: 'Send automated personalized re-engagement campaign with time-bound incentive.',
      expectedImpact: 'Estimated +$4,200 incremental revenue within 30 days.',
      confidence: 'High'
    },
    resultData: {
      beforeValue: 'Repeat customer rate = 21%',
      afterValue: 'Repeat customer rate = 25%',
      resultRating: 'Improved',
      userNotes: 'Campaign launched on Oct 3rd. Re-engagement email achieved a 38% open rate and generated 42 repeat orders in week 1.',
      completedDate: '',
      impactSummary: '+4 percentage points in repeat customer rate'
    }
  },
  {
    id: 'mission-slow-stock',
    title: 'Optimize Slow-Moving Stock',
    category: 'Inventory',
    priority: 'High',
    status: 'Recommended',
    isFeatured: false,
    problem: 'Over 18% of warehouse inventory has zero sales velocity in the last 60 days.',
    evidence: 'Holding costs for stagnant SKUs are compressing monthly operating margin by ~3.2%.',
    whyItMatters: 'Clearing dead stock unlocks tied-up capital, reduces warehouse holding expenses, and frees up shelf capacity for high-demand goods.',
    aiReasoning: 'Inventory audits highlight 14 SKUs with >60 days turnover. Bundling low-turnover items with top sellers accelerates liquidation without eroding brand prestige.',
    recommendedAction: 'Bundle low-turnover items with top sellers as limited-time promo packages.',
    expectedImpact: 'Capital recovery of ~$4,500 and reduction in holding expenses.',
    difficulty: 'Medium',
    estimatedTime: '5 days',
    createdAt: '2026-10-04',
    checklist: [
      { id: 'task-s1', text: 'Export inventory report filtered by low sales velocity (<2 units/month)', completed: false },
      { id: 'task-s2', text: 'Pair slow-moving accessories with top 3 hero products at a 20% bundle discount', completed: false },
      { id: 'task-s3', text: 'Update online store product pages and promotional banners', completed: false },
      { id: 'task-s4', text: 'Send promotional highlight email to active subscribers', completed: false },
      { id: 'task-s5', text: 'Review inventory clearance rates after 14 days', completed: false }
    ],
    insight: {
      problem: 'Stagnant inventory tied up in warehouse location B.',
      evidence: 'Fact: 14 SKUs representing $6,800 in valuation have had 0 sales in 60 days.',
      reasoning: 'Recommendation: Cross-merchandising stagnant stock as high-value add-ons converts dormant assets to cash flow.',
      action: 'Create dynamic bundle promotions on checkout page.',
      expectedImpact: 'Liquidation of 65% of stagnant stock within 14 days.',
      confidence: 'High'
    }
  },
  {
    id: 'mission-abandoned-cart',
    title: 'Recover Abandoned Cart Revenue',
    category: 'Revenue',
    priority: 'High',
    status: 'Recommended',
    isFeatured: false,
    problem: 'Checkout drop-off rate spiked to 68% this month.',
    evidence: 'Analytics indicate cart abandonment triggered primarily at the shipping fee calculation step.',
    whyItMatters: 'Recovering even 10% of abandoned carts yields immediate high-margin revenue without additional ad spend.',
    aiReasoning: 'Automated 2-stage reminder emails sent 1 hour and 24 hours post-checkout failure recover up to 15% of lost revenue according to industry benchmarks.',
    recommendedAction: 'Set up automated 2-stage cart recovery email/SMS sequence with free shipping incentive.',
    expectedImpact: 'Estimated +$3,200 monthly incremental revenue lift.',
    difficulty: 'Easy',
    estimatedTime: '3 days',
    createdAt: '2026-10-05',
    checklist: [
      { id: 'task-ac1', text: 'Configure 1-hour post-abandonment automated reminder email', completed: false },
      { id: 'task-ac2', text: 'Configure 24-hour reminder email offering free shipping coupon code', completed: false },
      { id: 'task-ac3', text: 'Test cart recovery link routing across mobile and desktop browsers', completed: false },
      { id: 'task-ac4', text: 'Monitor 14-day cart recovery conversion rate in dashboard analytics', completed: false }
    ],
    insight: {
      problem: 'High cart abandonment rate at final checkout step.',
      evidence: 'Fact: 184 shoppers added items to cart last week but abandoned before payment completion.',
      reasoning: 'Recommendation: Timely automated friction-reduction nudges recover high-intent shoppers.',
      action: 'Deploy automated 2-step cart recovery flow.',
      expectedImpact: 'Recovery of 12-15% of abandoned carts ($3,200/mo value).',
      confidence: 'High'
    }
  },
  {
    id: 'mission-social-ad',
    title: 'Launch High-ROI Social Ad Campaign',
    category: 'Marketing',
    priority: 'Medium',
    status: 'Not Started',
    isFeatured: false,
    problem: 'Customer acquisition cost (CAC) increased by 14% over Q2.',
    evidence: 'Ad spend efficiency dropped due to ad creative fatigue and unsegmented audience targeting.',
    whyItMatters: 'Lowering CAC directly expands net profit margins and increases marketing spend efficiency.',
    aiReasoning: 'User-generated content (UGC) video testimonials outperform static image ads by 2.4x in click-through rate while lowering cost per acquisition.',
    recommendedAction: 'A/B test video testimonials targeting lookalike customer audiences.',
    expectedImpact: 'Potential 15-20% decrease in overall CAC.',
    difficulty: 'Medium',
    estimatedTime: '10 days',
    createdAt: '2026-10-03',
    checklist: [
      { id: 'task-ad1', text: 'Collect top 3 authentic customer video review clips', completed: false },
      { id: 'task-ad2', text: 'Create 2 ad variations (Social Proof focus vs Value Proposition focus)', completed: false },
      { id: 'task-ad3', text: 'Set initial $50/day test budget targeting top customer lookalikes', completed: false },
      { id: 'task-ad4', text: 'Track CTR and Cost Per Lead for 7 days', completed: false },
      { id: 'task-ad5', text: 'Scale budget to winning ad creative variant', completed: false }
    ],
    insight: {
      problem: 'Rising customer acquisition costs on social channels.',
      evidence: 'Fact: Meta CAC rose from $18.50 to $21.10 over the past 60 days.',
      reasoning: 'Recommendation: Testing video proof creatives improves CTR and reduces ad auction cost penalties.',
      action: 'Deploy UGC video ad campaign with lookalike targeting.',
      expectedImpact: 'CAC reduction to ~$16.80.',
      confidence: 'Medium'
    }
  },
  {
    id: 'mission-supplier-pricing',
    title: 'Renegotiate Supplier Pricing',
    category: 'Profitability',
    priority: 'Medium',
    status: 'Not Started',
    isFeatured: false,
    problem: 'Cost of Goods Sold (COGS) has increased by 4.5% due to raw material price inflation.',
    evidence: 'Supplier contract terms have not been reviewed in over 12 months despite total order volume doubling.',
    whyItMatters: 'A 3% reduction in COGS directly expands gross margin by $2,800 monthly.',
    aiReasoning: 'Leveraging doubled purchasing volume provides leverage to request volume tier discounts or Net-60 payment terms.',
    recommendedAction: 'Request volume tier pricing discount or extended payment terms from primary suppliers.',
    expectedImpact: 'Gross profit margin expansion of 2-3%.',
    difficulty: 'Hard',
    estimatedTime: '14 days',
    createdAt: '2026-09-29',
    checklist: [
      { id: 'task-sp1', text: 'Summarize 12-month total purchase volume per vendor', completed: false },
      { id: 'task-sp2', text: 'Prepare vendor negotiation proposal highlighting steady order growth', completed: false },
      { id: 'task-sp3', text: 'Schedule review call with top 2 primary supplier account managers', completed: false },
      { id: 'task-sp4', text: 'Finalize updated master service agreement with new volume tiers', completed: false }
    ],
    insight: {
      problem: 'COGS margin erosion from static vendor pricing.',
      evidence: 'Fact: Purchased 4,500 units in 2026 vs 2,100 units in 2025 at the same per-unit rate.',
      reasoning: 'Recommendation: Higher volume justifies 5-8% tiered wholesale price reduction.',
      action: 'Renegotiate tier 2 volume discount with key suppliers.',
      expectedImpact: '+$2,800 monthly gross margin improvement.',
      confidence: 'Medium'
    }
  },
  {
    id: 'mission-loyalty-program',
    title: 'Implement Customer Loyalty Program',
    category: 'Customers',
    priority: 'High',
    status: 'Completed',
    isFeatured: false,
    problem: 'Customer lifetime value (LTV) plateaued at $240.',
    evidence: 'First-time buyers were not incentivized to make subsequent purchases within 30 days.',
    whyItMatters: 'Higher LTV allows higher sustainable ad spend and strengthens long-term business equity.',
    aiReasoning: 'Point-based rewards systems drive habituation and increase purchase frequency by 22%.',
    recommendedAction: 'Launch points-for-purchases rewards program with VIP perks.',
    expectedImpact: 'Increased customer LTV and repeat purchase rate.',
    difficulty: 'Medium',
    estimatedTime: '7 days',
    createdAt: '2026-09-10',
    checklist: [
      { id: 'task-lp1', text: 'Define reward tier structure (Bronze, Silver, Gold)', completed: true },
      { id: 'task-lp2', text: 'Integrate loyalty widget on web store checkout', completed: true },
      { id: 'task-lp3', text: 'Send program launch announcement email to customer database', completed: true },
      { id: 'task-lp4', text: 'Monitor program enrollment and repeat order frequency', completed: true }
    ],
    insight: {
      problem: 'Low post-purchase customer engagement.',
      evidence: 'Fact: Only 12% of first-time buyers placed a second order within 90 days.',
      reasoning: 'Recommendation: Gamified rewards encourage repeat touchpoints.',
      action: 'Deploy automated post-purchase loyalty points onboarding.',
      expectedImpact: 'Estimated +18% 90-day repeat purchase rate.',
      confidence: 'High'
    },
    resultData: {
      beforeValue: 'Repeat Customer Rate: 18%',
      afterValue: 'Repeat Customer Rate: 24%',
      resultRating: 'Improved',
      userNotes: 'Launched loyalty rewards program on Sept 15. Over 450 customers enrolled in 2 weeks. Repeat purchase rate grew by 6 percentage points.',
      completedDate: '2026-09-28',
      impactSummary: '+6 percentage points in repeat customer rate ($6,800 added revenue)'
    }
  },
  {
    id: 'mission-meta-reallocate',
    title: 'Optimize Meta Ad Spend Allocation',
    category: 'Marketing',
    priority: 'Medium',
    status: 'Completed',
    isFeatured: false,
    problem: 'Ad budget was fragmented across low-converting targeting channels.',
    evidence: '3 of 5 ad sets yielded ROAS below 1.2x while top ad set achieved 3.8x.',
    whyItMatters: 'Reallocating budget to proven ad sets boosts overall ad profitability without increasing total budget.',
    aiReasoning: 'Budget optimization shifts funds dynamically toward top converting creative variations.',
    recommendedAction: 'Consolidate ad spend into top 2 performing campaigns.',
    expectedImpact: 'Overall campaign ROAS increase.',
    difficulty: 'Easy',
    estimatedTime: '2 days',
    createdAt: '2026-09-01',
    checklist: [
      { id: 'task-ma1', text: 'Audit past 30 days campaign performance by ad set', completed: true },
      { id: 'task-ma2', text: 'Pause ad sets with ROAS < 1.5x', completed: true },
      { id: 'task-ma3', text: 'Shift 80% of daily budget to top performing lookalike audience', completed: true }
    ],
    insight: {
      problem: 'Inefficient budget allocation in Meta Ads Manager.',
      evidence: 'Fact: Ad set #3 consumed $450 with only 2 conversions ($225 CPA).',
      reasoning: 'Recommendation: Pruning underperforming segments maximizes aggregate ROAS.',
      action: 'Reallocate ad spend to top 2 converting campaign audiences.',
      expectedImpact: 'ROAS improvement from 2.1x to >3.0x.',
      confidence: 'High'
    },
    resultData: {
      beforeValue: 'Blended ROAS: 2.1x',
      afterValue: 'Blended ROAS: 3.4x',
      resultRating: 'Improved',
      userNotes: 'Shifted $1,200/mo from broad targeting to Instagram Reels video ad set. Overall ROAS surged to 3.4x within 10 days.',
      completedDate: '2026-09-15',
      impactSummary: 'Blended ROAS increased from 2.1x to 3.4x'
    }
  }
];
