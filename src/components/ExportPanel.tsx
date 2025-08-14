import React, { useState } from 'react';
import { ImageMetadata } from '../types/metadata';
import { Download, Trash2, FileText, FileSpreadsheet, FileJson } from 'lucide-react';
import { exportFormats, exportMetadata } from '../utils/exportUtils';

interface ExportPanelProps {
  metadata: ImageMetadata[];
  onClearAll: () => void;
}

const ExportPanel: React.FC<ExportPanelProps> = ({ metadata, onClearAll }) => {
  const [selectedFormat, setSelectedFormat] = useState(exportFormats[0]);
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    if (metadata.length === 0) return;

    setIsExporting(true);
    try {
      const filename = `metadata_export_${new Date().toISOString().split('T')[0]}${selectedFormat.extension}`;
      exportMetadata(metadata, selectedFormat, filename);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const getFormatIcon = (formatId: string) => {
    switch (formatId) {
      case 'json':
        return <FileJson className="w-4 h-4" />;
      case 'csv':
        return <FileSpreadsheet className="w-4 h-4" />;
      case 'txt':
        return <FileText className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  if (metadata.length === 0) {
    return (
      <div className="card p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
          <Download className="w-5 h-5" />
          <span>Export</span>
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          Upload images to export metadata
        </p>
      </div>
    );
  }

  return (
    <div className="card p-6">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
        <Download className="w-5 h-5" />
        <span>Export</span>
      </h2>

      <div className="space-y-4">
        {/* Format Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
            Export Format
          </label>
          <div className="space-y-2">
            {exportFormats.map(format => (
              <label key={format.id} className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="exportFormat"
                  value={format.id}
                  checked={selectedFormat.id === format.id}
                  onChange={() => setSelectedFormat(format)}
                  className="text-primary-600 focus:ring-primary-500"
                />
                <div className="flex items-center space-x-2">
                  {getFormatIcon(format.id)}
                  <span className="text-sm text-gray-900 dark:text-white">{format.name}</span>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Export Button */}
        <button
          onClick={handleExport}
          disabled={isExporting || metadata.length === 0}
          className="w-full btn-primary flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isExporting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Exporting...</span>
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              <span>Export {metadata.length} images</span>
            </>
          )}
        </button>

        {/* Clear All Button */}
        <button
          onClick={onClearAll}
          className="w-full btn-secondary flex items-center justify-center space-x-2"
        >
          <Trash2 className="w-4 h-4" />
          <span>Clear All</span>
        </button>

        {/* Export Info */}
        <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
          <div>• JSON: Complete metadata with structure</div>
          <div>• CSV: Tabular data for spreadsheet analysis</div>
          <div>• Text: Human-readable format</div>
        </div>
      </div>
    </div>
  );
};

export default ExportPanel;
