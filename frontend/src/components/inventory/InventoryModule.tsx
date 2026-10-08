import React, { useState } from 'react';
import { INVENTORY_DEMO_DATA } from '../../data/inventoryDemoData';
import { InventoryKpiCard } from './InventoryKpiCard';
import { InventoryHealth } from './InventoryHealth';
import { StockRiskCard } from './StockRiskCard';
import { InventoryMovementChart } from './InventoryMovementChart';
import { ProductMovementList } from './ProductMovementList';
import { InventoryTable } from './InventoryTable';
import { InventoryInsightPanel } from './InventoryInsightPanel';
import { InventoryEmptyState } from './InventoryEmptyState';

export const InventoryModule: React.FC = () => {
  const [isEmptyState, setIsEmptyState] = useState<boolean>(false);
  const data = INVENTORY_DEMO_DATA;

  const totalProducts = data.products.length;
  const totalStockValue = data.products.reduce((acc, curr) => acc + curr.stockValue, 0);
  const lowStockCount = data.products.filter((p) => p.status === 'Low Stock').length;
  const outOfStockCount = data.products.filter((p) => p.currentStock === 0).length;
  const fastMovingCount = data.products.filter((p) => p.salesVelocity === 'Fast').length;
  const slowMovingCount = data.products.filter((p) => p.salesVelocity === 'Slow' || p.salesVelocity === 'Zero').length;

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
              <span className="text-[11px] font-extrabold uppercase tracking-wider bg-amber-500/10 border border-amber-500/20 text-amber-400 px-3 py-1 rounded-full">
                DEMO DATA MODE
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
              onClick={() => setIsEmptyState(!isEmptyState)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
                isEmptyState
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {isEmptyState ? 'Switch to Demo Data' : 'Simulate Empty State'}
            </button>
          </div>
        </div>
      </div>

      {/* 10. REUSABLE EMPTY STATE */}
      {isEmptyState ? (
        <InventoryEmptyState onToggleDemo={() => setIsEmptyState(false)} />
      ) : (
        <>
          {/* 2. Inventory KPI Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <InventoryKpiCard
              title="Total Products"
              value={`${totalProducts} SKUs`}
              iconName="Package"
              badgeText="Catalog Active"
              badgeType="success"
            />
            <InventoryKpiCard
              title="Total Stock Value"
              value={`₹${totalStockValue.toLocaleString()}`}
              iconName="DollarSign"
              badgeText="Working Capital"
              badgeType="neutral"
            />
            <InventoryKpiCard
              title="Low Stock Items"
              value={`${lowStockCount} Items`}
              iconName="AlertTriangle"
              badgeText="Action Required"
              badgeType="warning"
            />
            <InventoryKpiCard
              title="Out of Stock Items"
              value={`${outOfStockCount} Items`}
              iconName="XCircle"
              badgeText="Lost Sales Risk"
              badgeType="danger"
            />
            <InventoryKpiCard
              title="Fast-Moving Products"
              value={`${fastMovingCount} Products`}
              iconName="Flame"
              badgeText="High Demand"
              badgeType="success"
            />
            <InventoryKpiCard
              title="Slow-Moving Products"
              value={`${slowMovingCount} Products`}
              iconName="Clock"
              badgeText="Clearance Candidate"
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
      )}

    </div>
  );
};
