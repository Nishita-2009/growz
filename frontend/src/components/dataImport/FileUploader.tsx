import React, { useState, useRef } from 'react';
import { UploadedFile, DataSourceCategory } from '../../types/dataImport';
import { SAMPLE_CSV_DATA } from '../../data/dataImportDemoData';
import { UploadCloud, FileSpreadsheet, Trash2, CheckCircle2, Sparkles, FileText } from 'lucide-react';

interface FileUploaderProps {
  category: DataSourceCategory;
  file: UploadedFile | null;
  onFileSelected: (file: UploadedFile) => void;
  onFileRemoved: () => void;
}

export const FileUploader: React.FC<FileUploaderProps> = ({
  category,
  file,
  onFileSelected,
  onFileRemoved,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(100);

  const parseCSVContent = (content: string, fileName: string, sizeBytes: number): UploadedFile => {
    const lines = content.trim().split(/\r?\n/).filter((l) => l.trim().length > 0);
    if (lines.length === 0) {
      throw new Error('File is empty.');
    }

    const headers = lines[0].split(',').map((h) => h.trim().replace(/^"|"$/g, ''));
    const rows: Record<string, string>[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map((v) => v.trim().replace(/^"|"$/g, ''));
      const row: Record<string, string> = {};
      headers.forEach((h, idx) => {
        row[h] = values[idx] ?? '';
      });
      rows.push(row);
    }

    const ext = fileName.split('.').pop()?.toLowerCase() || 'csv';

    return {
      name: fileName,
      sizeBytes,
      type: ext,
      rawContent: content,
      parsedHeaders: headers,
      parsedRows: rows,
      totalRows: rows.length,
      totalColumns: headers.length,
    };
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setIsUploading(true);
    setUploadProgress(30);

    const reader = new FileReader();
    reader.onload = (event) => {
      setUploadProgress(80);
      setTimeout(() => {
        try {
          const content = (event.target?.result as string) || '';
          const parsed = parseCSVContent(content, selectedFile.name, selectedFile.size);
          setUploadProgress(100);
          setIsUploading(false);
          onFileSelected(parsed);
        } catch (err) {
          console.error(err);
          setIsUploading(false);
        }
      }, 400);
    };
    reader.readAsText(selectedFile);
  };

  const handleLoadSample = () => {
    const sample = SAMPLE_CSV_DATA[category] || SAMPLE_CSV_DATA['Orders & Sales'];
    setIsUploading(true);
    setUploadProgress(50);
    setTimeout(() => {
      const parsed = parseCSVContent(sample.csvContent, sample.fileName, sample.csvContent.length);
      setUploadProgress(100);
      setIsUploading(false);
      onFileSelected(parsed);
    }, 400);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-4">
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv,.xlsx,.xls"
        className="hidden"
        onChange={handleFileChange}
      />

      {file ? (
        /* Selected File Card */
        <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center space-x-3">
              <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <FileSpreadsheet className="h-6 w-6" />
              </div>
              <div>
                <h4 className="text-sm font-extrabold text-white">{file.name}</h4>
                <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                  <span>{formatFileSize(file.sizeBytes)}</span>
                  <span>•</span>
                  <span className="uppercase font-mono text-[10px] bg-slate-900 border border-slate-800 px-2 py-0.5 rounded text-emerald-400">
                    .{file.type} format
                  </span>
                  <span>•</span>
                  <span className="text-slate-300">{file.totalRows} rows, {file.totalColumns} columns</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white transition-all"
              >
                Replace
              </button>
              <button
                onClick={onFileRemoved}
                className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20 transition-all"
                title="Remove File"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 bg-emerald-500/5 border border-emerald-500/20 p-3 rounded-2xl">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>File loaded successfully! Ready for column mapping & preview.</span>
          </div>
        </div>
      ) : (
        /* Upload Area */
        <div className="space-y-3">
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-800 hover:border-emerald-500/50 bg-slate-950/60 hover:bg-slate-950 rounded-3xl p-8 text-center space-y-4 cursor-pointer transition-all duration-300 group shadow-inner"
          >
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-900 border border-slate-800 text-emerald-400 group-hover:scale-110 transition-transform">
              <UploadCloud className="h-8 w-8 stroke-[1.8]" />
            </div>

            <div className="space-y-1">
              <h4 className="text-base font-extrabold text-white group-hover:text-emerald-400 transition-colors">
                Drag and drop your file here, or browse
              </h4>
              <p className="text-xs text-slate-400">
                Supports <strong className="text-slate-200">.CSV, .XLSX, .XLS</strong> files up to 25MB
              </p>
            </div>

            {isUploading && (
              <div className="w-full max-w-xs mx-auto space-y-1.5 pt-2">
                <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
                  <div
                    className="h-2 bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <div className="text-[10px] text-slate-400 font-mono">Parsing file structure... {uploadProgress}%</div>
              </div>
            )}
          </div>

          {/* Quick Demo Pre-fill loader */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-emerald-400" />
              <span>Want to test with sample demo data?</span>
            </span>
            <button
              type="button"
              onClick={handleLoadSample}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 font-bold text-xs transition-all flex items-center space-x-1.5"
            >
              <FileText className="h-3.5 w-3.5" />
              <span>Load Sample CSV</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
