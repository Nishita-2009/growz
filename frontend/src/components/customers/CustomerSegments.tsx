import React from 'react';
import { CustomerSegmentItem, CustomerSegment } from '../../types/customers';
import { Layers, ChevronRight, Filter } from 'lucide-react';

interface CustomerSegmentsProps {
  segments: CustomerSegmentItem[];
  selectedSegment: CustomerSegment;
  onSelectSegment: (segment: CustomerSegment) => void;
}

export const CustomerSegments: React.FC<CustomerSegmentsProps> = ({
  segments,
  selectedSegment,
  onSelectSegment
}) => {
  return (
    <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center space-x-2">
            <Layers className="w-4 h-4 text-emerald-400" />
            <h3 className="text-base font-extrabold text-white tracking-tight">Customer Segmentation</h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Categorized behavior groups driving your business. Click any segment to filter table below.
          </p>
        </div>

        {selectedSegment !== 'All Customers' && (
          <button
            onClick={() => onSelectSegment('All Customers')}
            className="self-start sm:self-auto text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition-colors flex items-center space-x-1.5"
          >
            <Filter className="w-3.5 h-3.5 text-emerald-400" />
            <span>Reset Segment Filter ({selectedSegment})</span>
          </button>
        )}
      </div>

      {/* Segment Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {segments.map((seg) => {
          const isSelected = selectedSegment === seg.name;

          return (
            <button
              key={seg.id}
              onClick={() => onSelectSegment(seg.name)}
              className={`text-left p-4 rounded-xl border transition-all relative overflow-hidden group ${
                isSelected
                  ? 'bg-slate-800/90 border-emerald-500/50 shadow-md shadow-emerald-500/10 ring-1 ring-emerald-500/30'
                  : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-800/40 hover:border-slate-700'
              }`}
            >
              {/* Top Accent line */}
              <div 
                className="absolute top-0 left-0 right-0 h-1"
                style={{ backgroundColor: seg.color }}
              />

              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-white tracking-tight">{seg.name}</span>
                <span 
                  className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border"
                  style={{ 
                    borderColor: `${seg.color}40`, 
                    color: seg.color, 
                    backgroundColor: `${seg.color}15` 
                  }}
                >
                  {seg.percentage}%
                </span>
              </div>

              <div className="mt-3">
                <div className="text-xl font-black text-slate-100">{seg.count.toLocaleString()}</div>
                <span className="text-[11px] text-slate-400">customers</span>
              </div>

              <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-500">Avg Value</span>
                <span className="font-mono font-bold text-slate-200">${seg.avgValue.toFixed(2)}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
