import { create } from 'zustand';
import { BusinessDataSource, DataImportRecord, DataSourceCategory } from '../types/dataImport';
import { INITIAL_DATA_SOURCES } from '../data/dataImportDemoData';

const LOCAL_STORAGE_KEY = 'growz_data_imports';

function loadSourcesFromStorage(): BusinessDataSource[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Failed to load data imports from localStorage:', err);
  }
  return INITIAL_DATA_SOURCES;
}

function saveSourcesToStorage(sources: BusinessDataSource[]): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(sources));
  } catch (err) {
    console.error('Failed to save data imports to localStorage:', err);
  }
}

interface DataImportState {
  sources: BusinessDataSource[];
  importedRecords: DataImportRecord[];
  importDataset: (
    category: DataSourceCategory,
    fileName: string,
    rows: Record<string, any>[],
    mappedColumns: Record<string, string>,
    qualityScore: number
  ) => void;
  resetSourceStatus: (sourceId: string) => void;
  resetToDemoData: () => void;
}

export const useDataImportStore = create<DataImportState>((set, get) => ({
  sources: loadSourcesFromStorage(),
  importedRecords: [],

  importDataset: (category, fileName, rows, mappedColumns, qualityScore) => {
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);
    
    const newRecord: DataImportRecord = {
      id: `import-${Date.now()}`,
      category,
      fileName,
      importedAt: nowStr,
      totalRows: rows.length,
      validRows: Math.round(rows.length * (qualityScore / 100)),
      qualityScore,
      mappedColumns,
      normalizedData: rows,
    };

    const updatedSources = get().sources.map((s) => {
      if (s.category === category) {
        return {
          ...s,
          status: 'Imported' as const,
          fileName,
          recordCount: rows.length,
          lastImported: nowStr,
          dataQualityScore: qualityScore,
        };
      }
      return s;
    });

    saveSourcesToStorage(updatedSources);
    set({
      sources: updatedSources,
      importedRecords: [newRecord, ...get().importedRecords],
    });
  },

  resetSourceStatus: (sourceId) => {
    const updatedSources = get().sources.map((s) => {
      if (s.id === sourceId) {
        return {
          ...s,
          status: 'Not Uploaded' as const,
          recordCount: undefined,
          lastImported: undefined,
          fileName: undefined,
          dataQualityScore: 0,
        };
      }
      return s;
    });
    saveSourcesToStorage(updatedSources);
    set({ sources: updatedSources });
  },

  resetToDemoData: () => {
    saveSourcesToStorage(INITIAL_DATA_SOURCES);
    set({ sources: INITIAL_DATA_SOURCES, importedRecords: [] });
  },
}));
