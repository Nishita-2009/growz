import React, { useState, useMemo } from 'react';
import { ProductInventoryItem, InventoryFilter, StockStatus } from '../../types/inventory';
import { Search, Filter, ArrowUpDown } from 'lucide-react';

interface InventoryTableProps {
  products: ProductInventoryItem[];
}

const STATUS_BADGE: Record<StockStatus, string> = {
  Healthy: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  'Low Stock': 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  Critical: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
  Overstocked: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
  'Dead Stock': 'bg-slate-800 text-slate-400 border-slate-700',
};

export const InventoryTable: React.FC<InventoryTableProps> = ({ products }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<InventoryFilter>('all');

  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase());

      if (!matchesSearch) return false;

      if (filterStatus === 'all') return true;
      if (filterStatus === 'fast_moving') return item.salesVelocity === 'Fast';
      if (filterStatus === 'slow_moving') return item.salesVelocity === 'Slow' || item.salesVelocity === 'Zero';
      if (filterStatus === 'low_stock') return item.status === 'Low Stock' || item.status === 'Critical';
      if (filterStatus === 'out_of_stock') return item.currentStock === 0;

      return true;
    });
  }, [products, searchTerm, filterStatus]);

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6 backdrop-blur-xl">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-white tracking-tight">Product Inventory Table</h3>
          <p className="text-xs text-slate-400">Search, filter and monitor SKU stock levels</p>
        </div>

        {/* Filter Pills & Search */}
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search product or SKU..."
              className="w-full rounded-xl bg-slate-950 border border-slate-800 pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none transition-all"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar pb-1 sm:pb-0">
            {[
              { id: 'all', label: 'All Products' },
              { id: 'fast_moving', label: 'Fast Moving' },
              { id: 'slow_moving', label: 'Slow Moving' },
              { id: 'low_stock', label: 'Low Stock' },
              { id: 'out_of_stock', label: 'Out of Stock' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilterStatus(f.id as InventoryFilter)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  filterStatus === f.id
                    ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 shadow-sm'
                    : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Responsive Table */}
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
              <th className="py-3 px-4">Product Name</th>
              <th className="py-3 px-4">SKU</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Stock</th>
              <th className="py-3 px-4">Reorder Level</th>
              <th className="py-3 px-4">Stock Value</th>
              <th className="py-3 px-4">Velocity</th>
              <th className="py-3 px-4 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-medium">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((item) => (
                <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4 text-white font-semibold">{item.name}</td>
                  <td className="py-3.5 px-4 font-mono text-slate-400">{item.sku}</td>
                  <td className="py-3.5 px-4 text-slate-300">{item.category}</td>
                  <td className="py-3.5 px-4 font-bold text-white">{item.currentStock} units</td>
                  <td className="py-3.5 px-4 text-slate-400">{item.reorderLevel} units</td>
                  <td className="py-3.5 px-4 font-semibold text-slate-200">₹{item.stockValue.toLocaleString()}</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`font-semibold text-[11px] ${
                        item.salesVelocity === 'Fast'
                          ? 'text-emerald-400'
                          : item.salesVelocity === 'Medium'
                          ? 'text-teal-400'
                          : 'text-amber-400'
                      }`}
                    >
                      {item.salesVelocity}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase border ${
                        STATUS_BADGE[item.status]
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="py-8 text-center text-slate-500 italic">
                  No inventory products matched your filter search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
