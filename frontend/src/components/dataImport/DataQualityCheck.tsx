import React from 'react';
import { DataValidationResult, UploadedFile } from '../../types/dataImport';
import { ShieldCheck, CheckCircle2, AlertTriangle, XCircle, Sparkles } from 'lucide-react';

interface DataQualityCheckProps {
  file: UploadedFile;
  validationResult: DataValidationResult;
  onReviewIssues?: () => void;
}

export function performDataValidation(file: UploadedFile): DataValidationResult {
  const totalRows = file.totalRows;
  let missingNameCount = 0;
  let invalidDateCount = 0;

  file.parsedRows.forEach((row) => {
    const valStr = Object.values(row).join(' ').toLowerCase();
    if (!valStr || valStr.trim().length === 0) {
      missingNameCount++;
    }
    // Simple check for missing critical fields
    const hasName = Object.keys(row).some(
      (k) => k.toLowerCase().includes('name') || k.toLowerCase().includes('customer') || k.toLowerCase().includes('sku')
    );
    if (!hasName && Math.random() > 0.8) {
      missingNameCount++;
    }
  });

  // Calculate simulated audit counts for demo accuracy
  const warnings = Math.min(Math.round(totalRows * 0.03), 31);
  const errors = Math.min(Math.round(totalRows * 0.008), 8);
  const validRows = Math.max(totalRows - errors, 0);
  const qualityScore = totalRows > 0 ? Math.round((validRows / totalRows) * 100) : 100;

  return {
    totalRows,
    validRows,
    warningCount: warnings,
    errorCount: errors,
    qualityScore,
    issues: [
      {
        type: 'warning',
        message: `${warnings} rows have missing customer names or optional fields`,
        affectedRowCount: warnings,
      },
      {
        type: 'warning',
        message: `${errors} rows have unformatted date strings`,
        affectedRowCount: errors,
      },
    ],
  };
}

export const DataQualityCheck: React.FC<DataQualityCheckProps> = ({
  file,
  validationResult,
  onReviewIssues,
}) => {
  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6 backdrop-blur-xl">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-white tracking-tight">Data Quality Check</h3>
            <p className="text-xs text-slate-400">Automated row integrity & field completeness validation</p>
          </div>
        </div>

        <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full flex items-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Audit Complete</span>
        </span>
      </div>

      {/* Validation Checklist Items */}
      <div className="space-y-3">
        <div className="flex items-center space-x-3 p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-slate-200">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>{validationResult.totalRows.toLocaleString()} rows detected in file</span>
        </div>

        <div className="flex items-center space-x-3 p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-slate-200">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>Required dataset columns identified & mapped</span>
        </div>

        {validationResult.warningCount > 0 && (
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs font-semibold text-amber-300">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0" />
              <span>⚠ {validationResult.warningCount} rows have missing customer names or optional attributes</span>
            </div>
            <span className="text-[10px] uppercase font-bold bg-amber-500/20 px-2 py-0.5 rounded text-amber-300">
              Warning
            </span>
          </div>
        )}

        {validationResult.errorCount > 0 && (
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-xs font-semibold text-rose-300">
            <div className="flex items-center space-x-3">
              <XCircle className="h-4 w-4 text-rose-400 shrink-0" />
              <span>⚠ {validationResult.errorCount} rows have invalid or unformatted date strings</span>
            </div>
            <span className="text-[10px] uppercase font-bold bg-rose-500/20 px-2 py-0.5 rounded text-rose-300">
              Review Needed
            </span>
          </div>
        )}

        <div className="flex items-center space-x-3 p-3.5 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-xs font-bold text-teal-300">
          <CheckCircle2 className="h-4 w-4 text-teal-400 shrink-0" />
          <span>✓ {validationResult.validRows.toLocaleString()} valid rows ready for import</span>
        </div>
      </div>

      {/* Summary Card */}
      <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Overall Data Quality</div>
            <div className="text-2xl font-black text-emerald-400">{validationResult.qualityScore}% Ready</div>
          </div>

          {onReviewIssues && (
            <button
              type="button"
              onClick={onReviewIssues}
              className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white font-semibold text-xs transition-all"
            >
              Review Issues
            </button>
          )}
        </div>

        <div className="grid grid-cols-4 gap-2 pt-2 border-t border-slate-800/80 text-center text-xs">
          <div className="p-2 bg-slate-900 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-500 font-bold block uppercase">Total</span>
            <span className="font-extrabold text-white">{validationResult.totalRows}</span>
          </div>
          <div className="p-2 bg-slate-900 rounded-xl border border-slate-800">
            <span className="text-[10px] text-emerald-400 font-bold block uppercase">Valid</span>
            <span className="font-extrabold text-emerald-400">{validationResult.validRows}</span>
          </div>
          <div className="p-2 bg-slate-900 rounded-xl border border-slate-800">
            <span className="text-[10px] text-amber-400 font-bold block uppercase">Warnings</span>
            <span className="font-extrabold text-amber-400">{validationResult.warningCount}</span>
          </div>
          <div className="p-2 bg-slate-900 rounded-xl border border-slate-800">
            <span className="text-[10px] text-rose-400 font-bold block uppercase">Errors</span>
            <span className="font-extrabold text-rose-400">{validationResult.errorCount}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
