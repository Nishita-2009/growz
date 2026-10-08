import { Mission } from '../types/missions';

export const INITIAL_DEMO_MISSIONS: Mission[] = [
  {
    id: 'mission-shift-direct-delivery',
    title: 'Shift Delivery Orders to WhatsApp Direct',
    category: 'Profitability',
    priority: 'High',
    status: 'In Progress',
    isFeatured: true,
    problem: 'Swiggy & Zomato platform commissions (22%) compress delivery profit margins.',
    evidence: 'Delivery platforms generated ₹1,45,500 in sales last month but cost ₹32,010 in commission fees.',
    whyItMatters: 'Converting 25% of existing delivery customers to direct WhatsApp ordering recovers 22% in platform fees while building direct customer relationships.',
    aiReasoning: 'Customers ordering delivery are warm leads. Including a physical packaging insert with a "10% off your next direct order via WhatsApp" QR code yields high conversion rates.',
    recommendedAction: 'Insert a "10% Off Direct WhatsApp Order" printed QR flyer in every takeaway packaging bag.',
    expectedImpact: 'Estimated +₹18,000 monthly profit recovery.',
    difficulty: 'Easy',
    estimatedTime: '5 days',
    createdAt: '2026-10-01',
    checklist: [
      { id: 'task-1', text: 'Design & print 1,000 QR flyers with "10% Off Next WhatsApp Direct Order"', completed: true },
      { id: 'task-2', text: 'Set up automated WhatsApp catalog and instant order greeting', completed: true },
      { id: 'task-3', text: 'Instruct kitchen & packaging staff to place flyer in every Swiggy/Zomato bag', completed: true },
      { id: 'task-4', text: 'Monitor direct WhatsApp order volume and promo code redemptions', completed: false },
      { id: 'task-5', text: 'Measure 30-day delivery platform fee savings and net profit lift', completed: false }
    ],
    insight: {
      problem: 'Delivery platform commission fees eroding cafe profit margins.',
      evidence: 'Fact: ₹32,010 paid in Swiggy/Zomato commission fees last month.',
      reasoning: 'Recommendation: Converting delivery customers to direct WhatsApp orders saves 22% platform fee.',
      action: 'Deploy packaging flyer campaign promoting direct WhatsApp takeaway.',
      expectedImpact: 'Estimated +₹18,000 monthly profit recovery.',
      confidence: 'High'
    },
    resultData: {
      beforeValue: 'Direct WhatsApp order share = 20%',
      afterValue: 'Direct WhatsApp order share = 32%',
      resultRating: 'Improved',
      userNotes: 'Packaging flyers launched on Oct 2nd. Over 110 customers scanned the QR code and placed direct WhatsApp orders in week 1.',
      completedDate: '',
      impactSummary: '+12 percentage points in direct order share'
    }
  },
  {
    id: 'mission-prevent-coffee-stockout',
    title: 'Prevent Specialty Coffee Beans Stockout',
    category: 'Inventory',
    priority: 'High',
    status: 'In Progress',
    isFeatured: false,
    problem: 'Hero SKU "Specialty Arabica Coffee Beans" is near reorder threshold.',
    evidence: 'Current stock is 8 bags (4 days of safety stock) with supplier lead time of 5 days in Hyderabad.',
    whyItMatters: 'Coffee sales represent 45% of Nish Cafe morning revenue. Stockout over the weekend will cause lost sales of ~₹45,000.',
    aiReasoning: 'Arabica coffee beans have high sales velocity (4.5 bags/day). Re-ordering immediately guarantees uninterrupted morning cafe operations.',
    recommendedAction: 'Issue an immediate purchase order for 30 kg Arabica Coffee Beans.',
    expectedImpact: 'Prevented revenue loss of ~₹45,000 and guaranteed weekend supply.',
    difficulty: 'Easy',
    estimatedTime: '2 days',
    createdAt: '2026-10-04',
    checklist: [
      { id: 'task-s1', text: 'Audit current Arabica Coffee Bean stock and weekly burn rate', completed: true },
      { id: 'task-s2', text: 'Issue purchase order for 30 kg Arabica Beans to Hyderabad roaster supplier', completed: true },
      { id: 'task-s3', text: 'Confirm delivery date and dispatch tracking with supplier', completed: false },
      { id: 'task-s4', text: 'Inspect received shipment and update inventory stock in POS', completed: false }
    ],
    insight: {
      problem: 'Low stock of hero Arabica Coffee Beans.',
      evidence: 'Fact: Only 4 days of safety stock remaining at current daily consumption rate.',
      reasoning: 'Recommendation: Expediting supplier purchase order prevents weekend stockout.',
      action: 'Issue immediate PO for 30 kg Arabica Beans.',
      expectedImpact: 'Prevented weekend coffee stockout loss of ~₹45,000.',
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
