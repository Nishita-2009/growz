import React, { useState } from 'react';
import { useDataImportStore } from '../../stores/useDataImportStore';
import { DataSourceCard } from './DataSourceCard';
import { DataManagement } from './DataManagement';
import { DataEmptyState } from './DataEmptyState';
import { DataImportWizardModal } from './DataImportWizardModal';
import { BusinessDataSource, UploadedFile, DataValidationResult } from '../../types/dataImport';
import { Database, RotateCcw, Sparkles } from 'lucide-react';

export const DataImportModule: React.FC = () => {
  const { sources, importDataset, resetSourceStatus, resetToDemoData } = useDataImportStore();

  const [activeSource, setActiveSource] = useState<BusinessDataSource | null>(null);
  const [isWizardOpen, setIsWizardOpen] = useState(false);

  const importedCount = sources.filter((s) => s.status === 'Imported' || s.status === 'Ready').length;

  const handleUploadClick = (source: BusinessDataSource) => {
    setActiveSource(source);
    setIsWizardOpen(true);
  };

  const handleConfirmImport = (
    source: BusinessDataSource,
    file: UploadedFile,
    mapping: Record<string, string>,
    validation: DataValidationResult
  ) => {
    importDataset(source.category, file.name, file.parsedRows, mapping, validation.qualityScore);
  };

  return (
    <div className="p-6 sm:p-8 space-y-8 max-w-7xl mx-auto font-sans">
      
      {/* 1. Header & Overview */}
      <div className="bg-gradient-to-r from-slate-900/90 via-slate-900/80 to-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-extrabold uppercase tracking-wider bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full flex items-center gap-1.5">
                <Database className="h-3.5 w-3.5" />
                <span>Growz Data Pipeline</span>
              </span>
              <span className="text-[11px] font-extrabold uppercase tracking-wider bg-amber-500/10 border border-amber-500/20 text-amber-400 px-3 py-1 rounded-full">
                LOCAL STATE ENGINE
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight pt-1">
              Connect Your Business Data
            </h1>
            <p className="text-slate-400 text-sm max-w-2xl leading-relaxed">
              Upload your existing business data and let Growz turn it into actionable intelligence.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={resetToDemoData}
              title="Reset data sources to initial state"
              className="px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold transition-all flex items-center gap-1.5"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset Demo State</span>
            </button>
          </div>
        </div>

        {/* Supported Data Types Badges */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800/80 text-xs">
          <span className="font-bold text-slate-400 mr-1">Supported Data Streams:</span>
          {['Customers', 'Orders / Sales', 'Products', 'Expenses', 'Inventory', 'Marketing Data'].map((stream) => (
            <span key={stream} className="bg-slate-950/80 border border-slate-800 text-slate-300 px-3 py-1 rounded-xl text-[11px] font-semibold">
              • {stream}
            </span>
          ))}
        </div>
      </div>

      {/* 2. Data Management Section (Show if any source imported) */}
      <DataManagement
        sources={sources}
        onSelectSource={handleUploadClick}
        onResetSource={resetSourceStatus}
      />

      {/* 3. Upload Data Source Cards Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-extrabold text-white tracking-tight">Data Upload Channels</h2>
            <p className="text-xs text-slate-400">Select a business category to upload your CSV or Excel export</p>
          </div>
          <span className="text-xs text-emerald-400 font-semibold bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
            {importedCount} / {sources.length} Connected
          </span>
        </div>

        {sources.length === 0 ? (
          <DataEmptyState onUploadFirstFile={() => handleUploadClick(sources[0])} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sources.map((source) => (
              <DataSourceCard
                key={source.id}
                source={source}
                onUploadClick={handleUploadClick}
                onResetClick={resetSourceStatus}
              />
            ))}
          </div>
        )}
      </div>

      {/* 4. Guided Import Wizard Modal */}
      <DataImportWizardModal
        source={activeSource}
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        onConfirmImport={handleConfirmImport}
      />

    </div>
  );
};
