import React from 'react';
import { BusinessDataSource } from '../../types/dataImport';
import { Database, CheckCircle2, RotateCcw, Eye, Clock } from 'lucide-react';

interface DataManagementProps {
  sources: BusinessDataSource[];
  onSelectSource: (source: BusinessDataSource) => void;
  onResetSource: (sourceId: string) => void;
}

export const DataManagement: React.FC<DataManagementProps> = ({
  sources,
  onSelectSource,
  onResetSource,
}) => {
  const importedSources = sources.filter((s) => s.status === 'Imported' || s.status === 'Ready');

  if (importedSources.length === 0) {
    return null;
  }

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6 backdrop-blur-xl">
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Database className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-white tracking-tight">Your Business Data</h2>
            <p className="text-xs text-slate-400">Active imported datasets powering your Growz intelligence layer</p>
          </div>
        </div>

        <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
          {importedSources.length} Datasets Connected
        </span>
      </div>

      <div className="space-y-3">
        {importedSources.map((source) => (
          <div
            key={source.id}
            className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800/80 hover:border-emerald-500/30 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-extrabold text-white group-hover:text-emerald-400 transition-colors">
                  {source.category}
                </span>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" />
                  {source.status}
                </span>
                {source.dataQualityScore ? (
                  <span className="text-[10px] font-bold text-slate-300 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded-md">
                    Quality: {source.dataQualityScore}%
                  </span>
                ) : null}
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 pt-0.5">
                <span>File: <strong className="text-slate-200">{source.fileName || 'data_export.csv'}</strong></span>
                <span>•</span>
                <span>Records: <strong className="text-emerald-400 font-mono">{source.recordCount?.toLocaleString() || 0}</strong></span>
                {source.lastImported && (
                  <>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-slate-500 text-[11px]">
                      <Clock className="h-3 w-3" />
                      <span>{source.lastImported}</span>
                    </span>
                  </>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onSelectSource(source)}
                className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500/40 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-all"
              >
                <Eye className="h-3.5 w-3.5" />
                <span>View Data</span>
              </button>

              <button
                type="button"
                onClick={() => onSelectSource(source)}
                className="px-3.5 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 text-xs font-bold transition-all flex items-center gap-1.5"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Replace</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
