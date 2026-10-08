import React, { useEffect, useState } from 'react';
import { ColumnMapping, DataSourceCategory } from '../../types/dataImport';
import { Wand2, ArrowRight, CheckCircle2 } from 'lucide-react';

interface ColumnMapperProps {
  category: DataSourceCategory;
  headers: string[];
  mapping: Record<string, string>; // uploadedHeader -> growzField
  onMappingChange: (mapping: Record<string, string>) => void;
}

const GROWZ_FIELD_OPTIONS: Record<DataSourceCategory, string[]> = {
  'Orders & Sales': ['Customer', 'Order Date', 'Product', 'Quantity', 'Unit Price', 'Order Total', 'Payment Method', 'Discount', 'Status'],
  'Customers': ['Customer', 'Email', 'Phone', 'City', 'Total Orders', 'Lifetime Spend', 'Signup Date', 'Loyalty Tier'],
  'Products': ['Product', 'SKU', 'Category', 'Unit Cost', 'Selling Price', 'Current Stock', 'Reorder Point'],
  'Expenses': ['Expense Date', 'Category', 'Vendor', 'Amount', 'Payment Method', 'Tax', 'Notes'],
  'Inventory': ['SKU', 'Product', 'Current Stock', 'Reorder Point', 'Unit Cost', 'Supplier', 'Warehouse Location'],
  'Marketing': ['Campaign Name', 'Channel', 'Ad Spend', 'Impressions', 'Clicks', 'Conversions', 'ROAS'],
};

export const autoDetectField = (uploadedHeader: string, category: DataSourceCategory): string => {
  const norm = uploadedHeader.toLowerCase().replace(/[^a-z0-9]/g, '_');

  if (norm.includes('customer') || norm.includes('client') || norm.includes('name')) return 'Customer';
  if (norm.includes('order_date') || norm.includes('purchase_date') || norm.includes('date')) return 'Order Date';
  if (norm.includes('product') || norm.includes('item')) return 'Product';
  if (norm.includes('qty') || norm.includes('quantity') || norm.includes('units')) return 'Quantity';
  if (norm.includes('unit_price') || norm.includes('price') || norm.includes('rate')) return 'Unit Price';
  if (norm.includes('order_total') || norm.includes('total') || norm.includes('amount') || norm.includes('revenue')) return 'Order Total';
  if (norm.includes('email')) return 'Email';
  if (norm.includes('phone') || norm.includes('mobile')) return 'Phone';
  if (norm.includes('sku') || norm.includes('code')) return 'SKU';
  if (norm.includes('category')) return 'Category';
  if (norm.includes('vendor') || norm.includes('supplier')) return 'Vendor';
  if (norm.includes('cost')) return 'Unit Cost';
  if (norm.includes('channel')) return 'Channel';
  if (norm.includes('spend') || norm.includes('ad_spend')) return 'Ad Spend';

  const availableFields = GROWZ_FIELD_OPTIONS[category] || GROWZ_FIELD_OPTIONS['Orders & Sales'];
  return availableFields[0] || 'Ignore Column';
};

export const ColumnMapper: React.FC<ColumnMapperProps> = ({
  category,
  headers,
  mapping,
  onMappingChange,
}) => {
  const fieldOptions = GROWZ_FIELD_OPTIONS[category] || GROWZ_FIELD_OPTIONS['Orders & Sales'];

  // Run auto detect on initial load if mapping is empty
  useEffect(() => {
    if (Object.keys(mapping).length === 0 && headers.length > 0) {
      handleAutoDetect();
    }
  }, [headers]);

  const handleAutoDetect = () => {
    const newMapping: Record<string, string> = {};
    headers.forEach((h) => {
      newMapping[h] = autoDetectField(h, category);
    });
    onMappingChange(newMapping);
  };

  const handleSelectField = (header: string, field: string) => {
    onMappingChange({
      ...mapping,
      [header]: field,
    });
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6 backdrop-blur-xl">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
        <div>
          <h3 className="text-base font-extrabold text-white tracking-tight">Column Mapping</h3>
          <p className="text-xs text-slate-400">Map your uploaded spreadsheet headers to Growz data fields</p>
        </div>

        <button
          type="button"
          onClick={handleAutoDetect}
          className="px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 font-bold text-xs transition-all flex items-center space-x-2"
        >
          <Wand2 className="h-4 w-4" />
          <span>Auto Detect Fields</span>
        </button>
      </div>

      {/* Mapping Rows Grid */}
      <div className="space-y-3">
        {headers.map((header) => {
          const currentField = mapping[header] || autoDetectField(header, category);

          return (
            <div
              key={header}
              className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="flex items-center space-x-3 sm:w-1/2">
                <span className="text-xs font-mono text-emerald-400 font-bold bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl truncate max-w-[200px]">
                  {header}
                </span>
                <ArrowRight className="h-4 w-4 text-slate-600 shrink-0" />
              </div>

              <div className="sm:w-1/2">
                <select
                  value={currentField}
                  onChange={(e) => handleSelectField(header, e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-semibold focus:outline-none focus:border-emerald-500/50"
                >
                  {fieldOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                  <option value="Ignore Column">-- Ignore Column --</option>
                </select>
              </div>
            </div>
          );
        })}
      </div>

      <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 leading-relaxed flex items-center gap-2">
        <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
        <span>Growz never silently alters your data. Review mapped targets before confirming import.</span>
      </div>
    </div>
  );
};
