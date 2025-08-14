import React from 'react';
import { FilterOptions, ImageMetadata } from '../types/metadata';
import { Filter, Calendar, Camera, MapPin, FileText } from 'lucide-react';

interface FilterPanelProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  metadata: ImageMetadata[];
}

const FilterPanel: React.FC<FilterPanelProps> = ({ filters, onFiltersChange, metadata }) => {
  const getCameraModels = () => {
    const models = new Set<string>();
    metadata.forEach(img => {
      if (img.exif.camera?.model) {
        models.add(img.exif.camera.model);
      }
    });
    return Array.from(models).sort();
  };

  const getCategories = () => {
    const categories = new Set<string>();
    metadata.forEach(img => {
      if (img.iptc.category) {
        categories.add(img.iptc.category);
      }
    });
    return Array.from(categories).sort();
  };

  const handleCategoryChange = (category: string, checked: boolean) => {
    const newCategories = checked
      ? [...filters.category, category]
      : filters.category.filter(c => c !== category);
    
    onFiltersChange({ ...filters, category: newCategories });
  };

  const handleCameraModelChange = (model: string, checked: boolean) => {
    const newModels = checked
      ? [...filters.cameraModel, model]
      : filters.cameraModel.filter(m => m !== model);
    
    onFiltersChange({ ...filters, cameraModel: newModels });
  };

  const handleDateRangeChange = (field: 'start' | 'end', value: string | null) => {
    const date = value ? new Date(value) : null;
    onFiltersChange({
      ...filters,
      dateRange: { ...filters.dateRange, [field]: date }
    });
  };

  const handleGpsChange = (value: boolean | null) => {
    onFiltersChange({ ...filters, hasGps: value });
  };

  const handleExifChange = (value: boolean | null) => {
    onFiltersChange({ ...filters, hasExif: value });
  };

  const clearFilters = () => {
    onFiltersChange({
      category: [],
      dateRange: { start: null, end: null },
      cameraModel: [],
      hasGps: null,
      hasExif: null,
    });
  };

  const cameraModels = getCameraModels();
  const categories = getCategories();

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
          <Filter className="w-5 h-5" />
          <span>Filters</span>
        </h2>
        <button
          onClick={clearFilters}
          className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
        >
          Clear all
        </button>
      </div>

      <div className="space-y-6">
        {/* Date Range */}
        <div>
          <div className="flex items-center space-x-2 mb-3">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span className="text-sm font-medium text-gray-900 dark:text-white">Date Range</span>
          </div>
          <div className="space-y-2">
            <input
              type="date"
              value={filters.dateRange.start?.toISOString().split('T')[0] || ''}
              onChange={(e) => handleDateRangeChange('start', e.target.value || null)}
              className="input-field text-sm"
            />
            <input
              type="date"
              value={filters.dateRange.end?.toISOString().split('T')[0] || ''}
              onChange={(e) => handleDateRangeChange('end', e.target.value || null)}
              className="input-field text-sm"
            />
          </div>
        </div>

        {/* Camera Models */}
        {cameraModels.length > 0 && (
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <Camera className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">Camera Models</span>
            </div>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {cameraModels.map(model => (
                <label key={model} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={filters.cameraModel.includes(model)}
                    onChange={(e) => handleCameraModelChange(model, e.target.checked)}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-600 dark:text-gray-400">{model}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Categories */}
        {categories.length > 0 && (
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <FileText className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">Categories</span>
            </div>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {categories.map(category => (
                <label key={category} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={filters.category.includes(category)}
                    onChange={(e) => handleCategoryChange(category, e.target.checked)}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-600 dark:text-gray-400">{category}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* GPS Filter */}
        <div>
          <div className="flex items-center space-x-2 mb-3">
            <MapPin className="w-4 h-4 text-gray-400" />
            <span className="text-sm font-medium text-gray-900 dark:text-white">GPS Data</span>
          </div>
          <div className="space-y-2">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="gps"
                checked={filters.hasGps === true}
                onChange={() => handleGpsChange(true)}
                className="text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm text-gray-600 dark:text-gray-400">Has GPS</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="gps"
                checked={filters.hasGps === false}
                onChange={() => handleGpsChange(false)}
                className="text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm text-gray-600 dark:text-gray-400">No GPS</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="gps"
                checked={filters.hasGps === null}
                onChange={() => handleGpsChange(null)}
                className="text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm text-gray-600 dark:text-gray-400">All</span>
            </label>
          </div>
        </div>

        {/* EXIF Filter */}
        <div>
          <div className="flex items-center space-x-2 mb-3">
            <Camera className="w-4 h-4 text-gray-400" />
            <span className="text-sm font-medium text-gray-900 dark:text-white">EXIF Data</span>
          </div>
          <div className="space-y-2">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="exif"
                checked={filters.hasExif === true}
                onChange={() => handleExifChange(true)}
                className="text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm text-gray-600 dark:text-gray-400">Has EXIF</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="exif"
                checked={filters.hasExif === false}
                onChange={() => handleExifChange(false)}
                className="text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm text-gray-600 dark:text-gray-400">No EXIF</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="exif"
                checked={filters.hasExif === null}
                onChange={() => handleExifChange(null)}
                className="text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm text-gray-600 dark:text-gray-400">All</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;
