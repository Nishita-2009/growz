export type DataSourceCategory = 
  | 'Customers'
  | 'Orders & Sales'
  | 'Products'
  | 'Expenses'
  | 'Inventory'
  | 'Marketing';

export type ImportStatus = 
  | 'Not Uploaded'
  | 'Uploaded'
  | 'Needs Review'
  | 'Ready'
  | 'Imported';

export interface BusinessDataSource {
  id: string;
  category: DataSourceCategory;
  description: string;
  supportedFormats: string[];
  status: ImportStatus;
  recordCount?: number;
  lastImported?: string;
  fileName?: string;
  dataQualityScore?: number; // 0 - 100
}

export interface UploadedFile {
  name: string;
  sizeBytes: number;
  type: string; // 'csv' | 'xlsx' | 'xls'
  rawContent: string;
  parsedHeaders: string[];
  parsedRows: Record<string, string>[];
  totalRows: number;
  totalColumns: number;
}

export interface ColumnMapping {
  uploadedColumn: string;
  growzField: string;
  autoDetected: boolean;
}

export interface ValidationIssue {
  type: 'error' | 'warning';
  message: string;
  affectedRowCount: number;
}

export interface DataValidationResult {
  totalRows: number;
  validRows: number;
  warningCount: number;
  errorCount: number;
  qualityScore: number; // 0 - 100 percentage
  issues: ValidationIssue[];
}

export interface DataImportRecord {
  id: string;
  category: DataSourceCategory;
  fileName: string;
  importedAt: string;
  totalRows: number;
  validRows: number;
  qualityScore: number;
  mappedColumns: Record<string, string>;
  normalizedData: Record<string, any>[];
}
