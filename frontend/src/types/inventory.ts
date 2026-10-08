export type StockStatus = 'Healthy' | 'Low Stock' | 'Critical' | 'Overstocked' | 'Dead Stock';
export type InventoryFilter = 'all' | 'fast_moving' | 'slow_moving' | 'low_stock' | 'out_of_stock';
export type MovementTimeRange = '7_days' | '30_days' | '90_days';
export type SlowStockAction = 'Promote' | 'Bundle' | 'Discount' | 'Stop Reordering' | 'Review Product';

export interface ProductInventoryItem {
  id: string;
  name: string;
  sku: string;
  category: string;
  currentStock: number;
  reorderLevel: number;
  unitPrice: number;
  stockValue: number;
  salesVelocity: 'Fast' | 'Medium' | 'Slow' | 'Zero';
  status: StockStatus;
  daysRemaining?: number;
  daysSinceLastSale?: number;
  unitsSold30d: number;
  salesGrowth: string;
}

export interface StockRiskItem {
  id: string;
  type: 'low_stock' | 'overstock' | 'critical';
  productName: string;
  sku: string;
  detail: string;
  recommendedAction: string;
}

export interface MovementDataPoint {
  date: string;
  stockIn: number;
  stockOut: number;
}

export interface SlowMovingItem {
  id: string;
  name: string;
  sku: string;
  daysSinceLastSale: number;
  stockQuantity: number;
  stockValue: number;
  suggestedAction: SlowStockAction;
}

export interface InventoryHealthScore {
  score: number; // 0 - 100
  availabilityScore: number;
  turnoverScore: number;
  deadStockRiskScore: number;
  reorderRiskScore: number;
  explanation: string;
}

export interface InventoryInsight {
  id: string;
  whatWeFound: string;
  whyItMatters: string;
  whatToDo: string;
}

export interface InventoryData {
  products: ProductInventoryItem[];
  riskAlerts: StockRiskItem[];
  movementData: Record<MovementTimeRange, MovementDataPoint[]>;
  slowMovingItems: SlowMovingItem[];
  health: InventoryHealthScore;
  insight: InventoryInsight;
}
