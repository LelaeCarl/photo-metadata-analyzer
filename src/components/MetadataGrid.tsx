import React, { useState } from 'react';
import { ImageMetadata } from '../types/metadata';
import MetadataCard from './MetadataCard';
import { Grid, List, Search, Filter } from 'lucide-react';

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
      <div className="card p-12 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No images uploaded yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Upload some images to start analyzing their metadata
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center space-x-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Images ({filteredMetadata.length})
          </h2>
          {metadata.length !== filteredMetadata.length && (
            <span className="text-sm text-gray-600 dark:text-gray-400">
              of {metadata.length}
            </span>
          )}
        </div>

        <div className="flex items-center space-x-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search images..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* View mode toggle */}
          <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-colors duration-200 ${
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
              className={`p-2 rounded-md transition-colors duration-200 ${
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

      {/* Grid/List */}
      {filteredMetadata.length === 0 ? (
        <div className="card p-8 text-center">
          <Filter className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No images found
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Try adjusting your search terms or filters
          </p>
        </div>
      ) : (
        <div
          className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'
              : 'space-y-4'
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
