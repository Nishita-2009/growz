import React from 'react';
import { BusinessDataSource, ImportStatus } from '../../types/dataImport';
import { 
  Users, 
  ShoppingBag, 
  Package, 
  CreditCard, 
  Layers, 
  Share2, 
  UploadCloud, 
  CheckCircle2, 
  AlertCircle, 
  Clock,
  RotateCcw,
  Sparkles
} from 'lucide-react';

interface DataSourceCardProps {
  source: BusinessDataSource;
  onUploadClick: (source: BusinessDataSource) => void;
  onResetClick: (sourceId: string) => void;
}

const CATEGORY_ICONS: Record<string, React.FC<{ className?: string }>> = {
  Customers: Users,
  'Orders & Sales': ShoppingBag,
  Products: Package,
  Expenses: CreditCard,
  Inventory: Layers,
  Marketing: Share2,
};

export const DataSourceCard: React.FC<DataSourceCardProps> = ({
  source,
  onUploadClick,
  onResetClick,
}) => {
  const IconComponent = CATEGORY_ICONS[source.category] || UploadCloud;

  const statusStyles: Record<ImportStatus, { bg: string; text: string; border: string; icon: any }> = {
    'Not Uploaded': { bg: 'bg-slate-950', text: 'text-slate-400', border: 'border-slate-800', icon: Clock },
    Uploaded: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20', icon: UploadCloud },
    'Needs Review': { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20', icon: AlertCircle },
    Ready: { bg: 'bg-teal-500/10', text: 'text-teal-400', border: 'border-teal-500/20', icon: Sparkles },
    Imported: { bg: 'bg-emerald-500/15', text: 'text-emerald-400', border: 'border-emerald-500/30', icon: CheckCircle2 },
  };

  const sStyle = statusStyles[source.status];
  const StatusIcon = sStyle.icon;

  return (
    <div className="bg-slate-900/80 border border-slate-800 hover:border-emerald-500/40 rounded-3xl p-6 shadow-xl backdrop-blur-xl transition-all duration-300 flex flex-col justify-between space-y-5 group">
      
      {/* Header: Icon, Title & Status */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-emerald-400 group-hover:scale-105 transition-all">
            <IconComponent className="h-5 w-5" />
          </div>

          <span className={`text-[11px] font-bold inline-flex items-center gap-1.5 px-3 py-1 rounded-full border ${sStyle.bg} ${sStyle.text} ${sStyle.border}`}>
            <StatusIcon className="h-3 w-3" />
            <span>{source.status}</span>
          </span>
        </div>

        <div className="space-y-1">
          <h3 className="text-lg font-extrabold text-white tracking-tight group-hover:text-emerald-400 transition-colors">
            {source.category}
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
            {source.description}
          </p>
        </div>
      </div>

      {/* Meta & Supported formats */}
      <div className="space-y-2 pt-2 border-t border-slate-800/60">
        <div className="flex items-center justify-between text-[11px] text-slate-400">
          <span>Supported Formats:</span>
          <div className="flex gap-1">
            {source.supportedFormats.map((fmt) => (
              <span key={fmt} className="bg-slate-950 border border-slate-800 px-2 py-0.5 rounded text-slate-300 font-mono text-[10px]">
                .{fmt.toLowerCase()}
              </span>
            ))}
          </div>
        </div>

        {source.status === 'Imported' && (
          <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-1 text-xs">
            <div className="flex justify-between font-semibold text-slate-200">
              <span>{source.fileName || 'data_export.csv'}</span>
              <span className="text-emerald-400 font-mono">{source.recordCount?.toLocaleString()} Records</span>
            </div>
            {source.lastImported && (
              <div className="text-[10px] text-slate-500">
                Last updated: {source.lastImported}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Action CTA */}
      <div className="pt-1 flex items-center justify-between gap-2">
        {source.status === 'Imported' ? (
          <>
            <button
              onClick={() => onUploadClick(source)}
              className="flex-1 py-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-emerald-500/40 text-slate-200 hover:text-white font-bold text-xs transition-all flex items-center justify-center space-x-1.5"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Replace Data</span>
            </button>

            <button
              onClick={() => onUploadClick(source)}
              className="px-4 py-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 font-bold text-xs transition-all"
            >
              View Data
            </button>
          </>
        ) : (
          <button
            onClick={() => onUploadClick(source)}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center space-x-2"
          >
            <UploadCloud className="h-4 w-4" />
            <span>Upload {source.category}</span>
          </button>
        )}
      </div>
    </div>
  );
};
