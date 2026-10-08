export type SalesChannel = 'Website' | 'Physical Store' | 'WhatsApp' | 'Instagram' | 'Marketplace' | 'Other';
export type CustomerLocation = 'Local' | 'Regional' | 'National' | 'International';
export type OperationalTool = 'Excel' | 'Google Sheets' | 'POS' | 'Accounting Software' | 'ERP' | 'None' | 'Other';
export type BusinessGoal = 
  | 'Increase revenue'
  | 'Increase profit'
  | 'Get more customers'
  | 'Increase repeat customers'
  | 'Reduce expenses'
  | 'Improve inventory'
  | 'Improve marketing'
  | 'Expand to new locations'
  | 'Improve online presence'
  | 'Other';

export interface BusinessProfile {
  // Step 2 — Business Basics
  businessName: string;
  businessType: string;
  industry: string;
  location: string;
  yearStarted: string;
  employeeCount: string;

  // Step 3 — What You Sell
  offeringType: string;
  mainOffering: string;
  avgSellingPrice: string;
  offeringCount: string;
  primarySalesChannels: SalesChannel[];

  // Step 4 — Customers
  targetCustomerType: string;
  activeCustomersCount: string;
  newCustomersPerMonth: string;
  repeatCustomersPercentage: string;
  mainCustomerLocation: CustomerLocation | '';

  // Step 5 — Business Numbers (Optional)
  avgMonthlyRevenue: string;
  avgMonthlyExpenses: string;
  approxMonthlyProfit: string;
  monthlySalesGrowth: string;
  avgOrderValue: string;
  skippedFinancials: boolean;

  // Step 6 — Operations
  maintainsInventory: 'Yes' | 'No' | '';
  locationCount: string;
  supplierCount: string;
  mainOperationalChallenge: string;
  currentTools: OperationalTool[];

  // Step 7 — Marketing
  hasInstagram: boolean;
  hasFacebook: boolean;
  hasGoogleBusiness: boolean;
  hasWebsite: boolean;
  hasWhatsAppBusiness: boolean;
  mainMarketingChannels: string[];
  monthlyMarketingSpend: string;

  // Step 8 — Goals
  goals: BusinessGoal[];
  biggestChallenge: string;

  // Status
  isCompleted: boolean;
  updatedAt?: string;
}

export const initialBusinessProfile: BusinessProfile = {
  businessName: '',
  businessType: '',
  industry: '',
  location: '',
  yearStarted: '',
  employeeCount: '',

  offeringType: 'Products & Services',
  mainOffering: '',
  avgSellingPrice: '',
  offeringCount: '',
  primarySalesChannels: [],

  targetCustomerType: 'B2C (Consumers)',
  activeCustomersCount: '',
  newCustomersPerMonth: '',
  repeatCustomersPercentage: '',
  mainCustomerLocation: '',

  avgMonthlyRevenue: '',
  avgMonthlyExpenses: '',
  approxMonthlyProfit: '',
  monthlySalesGrowth: '',
  avgOrderValue: '',
  skippedFinancials: false,

  maintainsInventory: '',
  locationCount: '1',
  supplierCount: '',
  mainOperationalChallenge: '',
  currentTools: [],

  hasInstagram: false,
  hasFacebook: false,
  hasGoogleBusiness: false,
  hasWebsite: false,
  hasWhatsAppBusiness: false,
  mainMarketingChannels: [],
  monthlyMarketingSpend: '',

  goals: [],
  biggestChallenge: '',
  isCompleted: false,
};
