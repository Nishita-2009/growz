import React from 'react';
import { INVENTORY_DEMO_DATA } from '../../data/inventoryDemoData';
import { InventoryKpiCard } from './InventoryKpiCard';
import { InventoryHealth } from './InventoryHealth';
import { StockRiskCard } from './StockRiskCard';
import { InventoryMovementChart } from './InventoryMovementChart';
import { ProductMovementList } from './ProductMovementList';
import { InventoryTable } from './InventoryTable';
import { InventoryInsightPanel } from './InventoryInsightPanel';

import { useAnalytics } from '../../hooks/useAnalytics';
import { AnalyticsLoading, AnalyticsError, AnalyticsEmptyState } from '../analytics/AnalyticsStates';
import { RefreshCw, Database } from 'lucide-react';

const formatCurrency = (val: number | null) => {
  if (val === null || val === undefined) return '₹0';
  return `₹${val.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
};

const formatNumber = (val: number | null) => {
  if (val === null || val === undefined) return '0';
  return val.toLocaleString('en-US');
};

export const InventoryModule: React.FC = () => {
  const { analytics, loading, error, refetch } = useAnalytics();
  const data = INVENTORY_DEMO_DATA;

  if (loading) {
    return (
      <div className="p-6 sm:p-8 max-w-7xl mx-auto font-sans">
        <AnalyticsLoading message="Calculating stock and inventory metrics..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 sm:p-8 max-w-7xl mx-auto font-sans">
        <AnalyticsError message={error} onRetry={refetch} />
      </div>
    );
  }

  if (analytics?.data_status === 'no_data') {
    return (
      <div className="p-6 sm:p-8 max-w-7xl mx-auto font-sans">
        <AnalyticsEmptyState
          title="No Inventory Data Found"
          message="Import product listings and stock snapshots to unlock low-stock alerts, turnover metrics, and working capital optimization."
        />
      </div>
    );
  }

  const invData = analytics?.inventory;
  const totalProducts = invData ? formatNumber(invData.total_products) : `${data.products.length} SKUs`;
  const totalStockValue = invData ? formatCurrency(invData.total_inventory_value) : `₹${data.products.reduce((acc, curr) => acc + curr.stockValue, 0).toLocaleString()}`;
  const lowStockCount = invData ? formatNumber(invData.low_stock_count) : `${data.products.filter((p) => p.status === 'Low Stock').length} Items`;
  const outOfStockCount = invData ? formatNumber(invData.out_of_stock_count) : `${data.products.filter((p) => p.currentStock === 0).length} Items`;
  const totalStockUnits = invData ? formatNumber(invData.total_stock) : 'N/A';

  const fastMovingProducts = data.products.filter((p) => p.salesVelocity === 'Fast');

  return (
    <div className="p-6 sm:p-8 space-y-8 max-w-7xl mx-auto font-sans selection:bg-emerald-500 selection:text-slate-950">
      
      {/* 1. Header */}
      <div className="bg-gradient-to-r from-slate-900/90 via-slate-900/80 to-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-extrabold uppercase tracking-wider bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full">
                Stock Intelligence
              </span>
              <span className="text-[11px] font-extrabold uppercase tracking-wider bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full">
                {analytics?.data_status === 'sufficient_data' ? 'POSTGRESQL LIVE' : 'INSUFFICIENT DATA BASELINE'}
              </span>

            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight pt-1">
              Inventory & Stock
            </h1>
            <p className="text-slate-400 text-sm max-w-xl">
              Know what to stock, what to sell, and what needs attention.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={refetch}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-950 border border-slate-800 text-slate-300 hover:text-white flex items-center space-x-2 transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
              <span>Refresh Stock</span>
            </button>
          </div>
        </div>
      </div>

      <>
        {/* 2. Inventory KPI Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <InventoryKpiCard
            title="Total Products"
            value={totalProducts.includes('SKU') ? totalProducts : `${totalProducts} SKUs`}
            iconName="Package"
            badgeText="Catalog Active"
            badgeType="success"
          />
          <InventoryKpiCard
            title="Total Stock Value"
            value={totalStockValue}
            iconName="DollarSign"
            badgeText="Working Capital"
            badgeType="neutral"
          />
          <InventoryKpiCard
            title="Low Stock Items"
            value={lowStockCount.includes('Item') ? lowStockCount : `${lowStockCount} Items`}
            iconName="AlertTriangle"
            badgeText="Action Required"
            badgeType="warning"
          />
          <InventoryKpiCard
            title="Out of Stock Items"
            value={outOfStockCount.includes('Item') ? outOfStockCount : `${outOfStockCount} Items`}
            iconName="XCircle"
            badgeText="Lost Sales Risk"
            badgeType="danger"
          />
          <InventoryKpiCard
            title="Total Stock Units"
            value={`${totalStockUnits} Units`}
            iconName="Flame"
            badgeText="Physical Inventory"
            badgeType="success"
          />
          <InventoryKpiCard
            title="Stock Turnover"
            value={invData?.turnover_rate !== null && invData?.turnover_rate !== undefined ? `${invData.turnover_rate.toFixed(2)}x` : '0.00x'}
            iconName="Clock"
            badgeText="Annual Velocity"
            badgeType="warning"
          />
        </div>

        {/* 3. Inventory Health Index Card */}
        <InventoryHealth health={data.health} />

        {/* 5. Stock Risk Section ("Needs Your Attention") */}
        <StockRiskCard alerts={data.riskAlerts} />

        {/* 6. Inventory Movement Chart */}
        <InventoryMovementChart movementData={data.movementData} />

        {/* 7 & 8. Top Moving & Slow Moving Products */}
        <ProductMovementList fastMoving={fastMovingProducts} slowMoving={data.slowMovingItems} />

        {/* 4. Product Inventory Table */}
        <InventoryTable products={data.products} />

        {/* 9. AI Inventory Insights Panel */}
        <InventoryInsightPanel insight={data.insight} />
      </>

    </div>
  );
};

