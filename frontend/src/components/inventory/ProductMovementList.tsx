import React from 'react';
import { ProductInventoryItem, SlowMovingItem } from '../../types/inventory';
import { Flame, Clock, ArrowUpRight, Tag } from 'lucide-react';

interface ProductMovementListProps {
  fastMoving: ProductInventoryItem[];
  slowMoving: SlowMovingItem[];
}

export const ProductMovementList: React.FC<ProductMovementListProps> = ({ fastMoving, slowMoving }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      
      {/* Top Fast-Moving Products */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6 backdrop-blur-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Flame className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">Top Moving Products</h3>
              <p className="text-xs text-slate-400">High velocity items driving customer volume</p>
            </div>
          </div>
          <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
            High Demand
          </span>
        </div>

        <div className="space-y-3">
          {fastMoving.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-center justify-between gap-4 transition-all hover:border-emerald-500/30"
            >
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-slate-400">{item.sku}</span>
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                    {item.salesGrowth}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-white truncate">{item.name}</h4>
                <p className="text-[11px] text-slate-400">
                  Category: {item.category} • Stock left: <span className="text-slate-200 font-semibold">{item.currentStock} units</span>
                </p>
              </div>

              <div className="text-right shrink-0">
                <div className="text-sm font-extrabold text-emerald-400">{item.unitsSold30d} sold</div>
                <div className="text-[11px] text-slate-400">last 30 days</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Slow-Moving / Dead Stock */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6 backdrop-blur-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">Slow-Moving & Clearance</h3>
              <p className="text-xs text-slate-400">Inventory with low turnover and tied-up capital</p>
            </div>
          </div>
          <span className="text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full">
            Clearance Candidates
          </span>
        </div>

        <div className="space-y-3">
          {slowMoving.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-center justify-between gap-4 transition-all hover:border-amber-500/30"
            >
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-slate-400">{item.sku}</span>
                  <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md">
                    {item.daysSinceLastSale}d since last sale
                  </span>
                </div>
                <h4 className="text-xs font-bold text-white truncate">{item.name}</h4>
                <p className="text-[11px] text-slate-400">
                  Stock: <span className="text-slate-200 font-semibold">{item.stockQuantity} units</span> (Value: ₹{item.stockValue.toLocaleString()})
                </p>
              </div>

              <div className="text-right shrink-0 space-y-1">
                <span className="inline-block text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2.5 py-1 rounded-md">
                  Action: {item.suggestedAction}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
