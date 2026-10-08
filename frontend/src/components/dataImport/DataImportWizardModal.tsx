import React, { useState } from 'react';
import { BusinessDataSource, UploadedFile, DataValidationResult } from '../../types/dataImport';
import { FileUploader } from './FileUploader';
import { DataPreview } from './DataPreview';
import { ColumnMapper } from './ColumnMapper';
import { DataQualityCheck, performDataValidation } from './DataQualityCheck';
import { X, UploadCloud, Eye, Wand2, ShieldCheck, CheckCircle2, ArrowRight, ArrowLeft } from 'lucide-react';

interface DataImportWizardModalProps {
  source: BusinessDataSource | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmImport: (
    source: BusinessDataSource,
    file: UploadedFile,
    mapping: Record<string, string>,
    validation: DataValidationResult
  ) => void;
}

type WizardStep = 'upload' | 'preview' | 'mapping' | 'validation' | 'confirmation';

const WIZARD_STEPS: { id: WizardStep; label: string; icon: any }[] = [
  { id: 'upload', label: 'Upload File', icon: UploadCloud },
  { id: 'preview', label: 'Preview Data', icon: Eye },
  { id: 'mapping', label: 'Column Mapping', icon: Wand2 },
  { id: 'validation', label: 'Quality Check', icon: ShieldCheck },
  { id: 'confirmation', label: 'Confirmation', icon: CheckCircle2 },
];

export const DataImportWizardModal: React.FC<DataImportWizardModalProps> = ({
  source,
  isOpen,
  onClose,
  onConfirmImport,
}) => {
  const [currentStep, setCurrentStep] = useState<WizardStep>('upload');
  const [file, setFile] = useState<UploadedFile | null>(null);
  const [columnMapping, setColumnMapping] = useState<Record<string, string>>({});
  const [validationResult, setValidationResult] = useState<DataValidationResult | null>(null);

  if (!isOpen || !source) return null;

  const handleFileSelected = (uploadedFile: UploadedFile) => {
    setFile(uploadedFile);
    const validation = performDataValidation(uploadedFile);
    setValidationResult(validation);
  };

  const handleFileRemoved = () => {
    setFile(null);
    setColumnMapping({});
    setValidationResult(null);
    setCurrentStep('upload');
  };

  const handleNext = () => {
    if (currentStep === 'upload' && file) {
      setCurrentStep('preview');
    } else if (currentStep === 'preview') {
      setCurrentStep('mapping');
    } else if (currentStep === 'mapping') {
      if (file && !validationResult) {
        setValidationResult(performDataValidation(file));
      }
      setCurrentStep('validation');
    } else if (currentStep === 'validation') {
      setCurrentStep('confirmation');
    }
  };

  const handleBack = () => {
    if (currentStep === 'preview') setCurrentStep('upload');
    else if (currentStep === 'mapping') setCurrentStep('preview');
    else if (currentStep === 'validation') setCurrentStep('mapping');
    else if (currentStep === 'confirmation') setCurrentStep('validation');
  };

  const handleCompleteImport = () => {
    if (file && validationResult) {
      onConfirmImport(source, file, columnMapping, validationResult);
      onClose();
      // Reset wizard state
      setCurrentStep('upload');
      setFile(null);
      setColumnMapping({});
      setValidationResult(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-3xl w-full shadow-2xl space-y-6 relative max-h-[92vh] overflow-y-auto custom-scrollbar">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
              {source.category} Data Import
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight pt-1">
              Connect {source.category}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Wizard Progress Steps Header */}
        <div className="grid grid-cols-5 gap-1 text-center border-b border-slate-800 pb-4">
          {WIZARD_STEPS.map((s, idx) => {
            const Icon = s.icon;
            const stepOrder = ['upload', 'preview', 'mapping', 'validation', 'confirmation'];
            const activeIdx = stepOrder.indexOf(currentStep);
            const isCompleted = stepOrder.indexOf(s.id) < activeIdx;
            const isActive = s.id === currentStep;

            return (
              <div
                key={s.id}
                onClick={() => {
                  if (file && stepOrder.indexOf(s.id) <= activeIdx) {
                    setCurrentStep(s.id);
                  }
                }}
                className={`p-2 rounded-xl border transition-all text-left flex flex-col items-center justify-center space-y-1 cursor-pointer ${
                  isActive
                    ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400'
                    : isCompleted
                    ? 'bg-slate-950 border-slate-800 text-teal-400'
                    : 'bg-slate-950/40 border-slate-800/40 text-slate-600'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="text-[10px] font-extrabold truncate hidden sm:block">{s.label}</span>
              </div>
            );
          })}
        </div>

        {/* Step Content */}
        <div className="space-y-6">
          {currentStep === 'upload' && (
            <FileUploader
              category={source.category}
              file={file}
              onFileSelected={handleFileSelected}
              onFileRemoved={handleFileRemoved}
            />
          )}

          {currentStep === 'preview' && file && (
            <DataPreview file={file} />
          )}

          {currentStep === 'mapping' && file && (
            <ColumnMapper
              category={source.category}
              headers={file.parsedHeaders}
              mapping={columnMapping}
              onMappingChange={setColumnMapping}
            />
          )}

          {currentStep === 'validation' && file && validationResult && (
            <DataQualityCheck
              file={file}
              validationResult={validationResult}
              onReviewIssues={() => setCurrentStep('mapping')}
            />
          )}

          {currentStep === 'confirmation' && file && validationResult && (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 text-center">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mx-auto">
                <CheckCircle2 className="h-8 w-8 text-emerald-400" />
              </div>

              <div className="space-y-2">
                <h4 className="text-xl font-black text-white">Import Confirmation</h4>
                <p className="text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
                  You are about to add <strong className="text-emerald-400 font-mono text-base">{validationResult.validRows.toLocaleString()} valid records</strong> from <strong className="text-white">"{file.name}"</strong> to your Growz business dataset.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-400 max-w-md mx-auto text-left space-y-1">
                <span className="font-bold text-slate-200 block">Dataset Summary:</span>
                <p>• Source: {source.category}</p>
                <p>• Data Quality Rating: {validationResult.qualityScore}%</p>
                <p>• Destination: Growz Normalized Store</p>
              </div>
            </div>
          )}
        </div>

        {/* Wizard Footer Controls */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
          <button
            type="button"
            onClick={currentStep === 'upload' ? onClose : handleBack}
            className="px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 hover:text-white font-semibold text-xs flex items-center space-x-1.5 transition-all"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>{currentStep === 'upload' ? 'Cancel' : 'Back'}</span>
          </button>

          {currentStep !== 'confirmation' ? (
            <button
              type="button"
              disabled={!file}
              onClick={handleNext}
              className={`px-6 py-2.5 rounded-xl font-bold text-xs shadow-md flex items-center space-x-2 transition-all ${
                file
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 hover:brightness-110 active:scale-95'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              <span>Continue to {currentStep === 'upload' ? 'Preview' : currentStep === 'preview' ? 'Column Mapping' : currentStep === 'mapping' ? 'Quality Check' : 'Confirmation'}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleCompleteImport}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-extrabold text-xs shadow-lg shadow-emerald-500/25 hover:brightness-110 active:scale-95 transition-all flex items-center space-x-2"
            >
              <CheckCircle2 className="h-4 w-4 fill-slate-950" />
              <span>Import Data</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
