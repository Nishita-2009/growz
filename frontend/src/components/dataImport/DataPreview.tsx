import React from 'react';
import { UploadedFile } from '../../types/dataImport';
import { Table, Eye } from 'lucide-react';

interface DataPreviewProps {
  file: UploadedFile;
}

export const DataPreview: React.FC<DataPreviewProps> = ({ file }) => {
  const previewRows = file.parsedRows.slice(0, 10);

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6 backdrop-blur-xl">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
            <Eye className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-white tracking-tight">Preview Your Data</h3>
            <p className="text-xs text-slate-400">Inspecting first 10 rows from uploaded file</p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="bg-slate-950 border border-slate-800 px-3 py-1 rounded-full text-slate-300 font-semibold">
            {file.totalRows.toLocaleString()} Total Rows
          </span>
          <span className="bg-slate-950 border border-slate-800 px-3 py-1 rounded-full text-teal-400 font-semibold">
            {file.totalColumns} Columns
          </span>
        </div>
      </div>

      {/* Responsive Data Table */}
      <div className="overflow-x-auto custom-scrollbar border border-slate-800 rounded-2xl bg-slate-950/80">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-900 border-b border-slate-800">
              <th className="p-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider w-12 text-center">
                #
              </th>
              {file.parsedHeaders.map((header, idx) => (
                <th key={idx} className="p-3 font-bold text-slate-200 uppercase tracking-wider whitespace-nowrap">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono">
            {previewRows.map((row, rIdx) => (
              <tr key={rIdx} className="hover:bg-slate-900/40 transition-colors">
                <td className="p-3 text-slate-600 text-[10px] text-center font-sans font-semibold">
                  {rIdx + 1}
                </td>
                {file.parsedHeaders.map((header, cIdx) => (
                  <td key={cIdx} className="p-3 text-slate-300 whitespace-nowrap">
                    {row[header] || <span className="text-slate-600 italic">null</span>}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="text-[11px] text-slate-500 text-center italic">
        Showing 10 of {file.totalRows.toLocaleString()} rows. Complete mapping below to validate full dataset.
      </div>
    </div>
  );
};
