import React, { useState } from 'react';
import { ImageMetadata } from '../types/metadata';
import MetadataCard from './MetadataCard';
import { Grid, List, Search, Filter, Image as ImageIcon } from 'lucide-react';

interface MetadataGridProps {
  metadata: ImageMetadata[];
  onRemoveImage: (id: string) => void;
}

type ViewMode = 'grid' | 'list';

const MetadataGrid: React.FC<MetadataGridProps> = ({ metadata, onRemoveImage }) => {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredMetadata = metadata.filter(img =>
    img.basicInfo.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    img.exif.camera?.make?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    img.exif.camera?.model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    img.iptc.caption?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (metadata.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="mb-4">
          <div className="w-16 h-16 bg-slate-100 dark:bg-gray-700 rounded-xl flex items-center justify-center">
            <ImageIcon className="w-8 h-8 text-gray-400" />
          </div>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          No images uploaded yet
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 text-center max-w-sm">
          Upload some images to start analyzing their metadata and unlock powerful insights
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header with controls */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-slate-100 dark:bg-gray-700 rounded-lg">
              <ImageIcon className="w-4 h-4 text-slate-600 dark:text-slate-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Images ({filteredMetadata.length})
              </h2>
              {metadata.length !== filteredMetadata.length && (
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  of {metadata.length} total
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search images..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            {/* View mode toggle */}
            <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-md transition-colors duration-200 ${
                  viewMode === 'grid'
                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
                aria-label="Grid view"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-md transition-colors duration-200 ${
                  viewMode === 'list'
                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
                aria-label="List view"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Grid/List */}
      {filteredMetadata.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 text-center">
          <div className="w-12 h-12 bg-slate-100 dark:bg-gray-700 rounded-lg flex items-center justify-center mx-auto mb-3">
            <Filter className="w-6 h-6 text-gray-400" />
          </div>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
            No images found
          </h3>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Try adjusting your search terms or filters
          </p>
        </div>
      ) : (
        <div
          className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4'
              : 'space-y-3'
          }
        >
          {filteredMetadata.map((img) => (
            <MetadataCard
              key={img.id}
              metadata={img}
              onRemove={onRemoveImage}
              viewMode={viewMode}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MetadataGrid;
