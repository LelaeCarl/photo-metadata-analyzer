import React from 'react';
import { ImageMetadata } from '../types/metadata';
import { BarChart3, Image, HardDrive, Camera, MapPin, Star } from 'lucide-react';

interface StatsPanelProps {
  metadata: ImageMetadata[];
}

const StatsPanel: React.FC<StatsPanelProps> = ({ metadata }) => {
  const getStats = () => {
    const stats = {
      totalImages: metadata.length,
      totalSize: 0,
      formats: {} as Record<string, number>,
      cameras: {} as Record<string, number>,
      hasGps: 0,
      hasExif: 0,
      averageRating: 0,
      dateRange: {
        earliest: null as Date | null,
        latest: null as Date | null,
      },
    };

    let totalRating = 0;
    let ratedImages = 0;

    metadata.forEach(img => {
      // File size
      stats.totalSize += img.basicInfo.fileSize;

      // Format
      const format = img.basicInfo.format;
      stats.formats[format] = (stats.formats[format] || 0) + 1;

      // Camera
      if (img.exif.camera?.model) {
        stats.cameras[img.exif.camera.model] = (stats.cameras[img.exif.camera.model] || 0) + 1;
      }

      // GPS
      if (img.exif.gps) {
        stats.hasGps++;
      }

      // EXIF
      if (img.exif.camera || img.exif.settings || img.exif.datetime) {
        stats.hasExif++;
      }

      // Rating
      if (img.xmp.rating) {
        totalRating += img.xmp.rating;
        ratedImages++;
      }

      // Date range
      if (img.exif.datetime?.original) {
        const date = new Date(img.exif.datetime.original);
        if (!stats.dateRange.earliest || date < stats.dateRange.earliest) {
          stats.dateRange.earliest = date;
        }
        if (!stats.dateRange.latest || date > stats.dateRange.latest) {
          stats.dateRange.latest = date;
        }
      }
    });

    if (ratedImages > 0) {
      stats.averageRating = totalRating / ratedImages;
    }

    return stats;
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const stats = getStats();

  if (metadata.length === 0) {
    return (
      <div className="card p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
          <BarChart3 className="w-5 h-5" />
          <span>Statistics</span>
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          Upload images to see statistics
        </p>
      </div>
    );
  }

  return (
    <div className="card p-6">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
        <BarChart3 className="w-5 h-5" />
        <span>Statistics</span>
      </h2>

      <div className="space-y-4">
        {/* Basic Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex items-center justify-center mb-2">
              <Image className="w-5 h-5 text-primary-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {stats.totalImages}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Images</div>
          </div>

          <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex items-center justify-center mb-2">
              <HardDrive className="w-5 h-5 text-primary-600" />
            </div>
            <div className="text-lg font-bold text-gray-900 dark:text-white">
              {formatFileSize(stats.totalSize)}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Total Size</div>
          </div>
        </div>

        {/* Camera Stats */}
        {stats.hasExif > 0 && (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Camera className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">Camera Info</span>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {stats.hasExif} of {stats.totalImages} images have EXIF data
            </div>
          </div>
        )}

        {/* GPS Stats */}
        {stats.hasGps > 0 && (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">GPS Data</span>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {stats.hasGps} of {stats.totalImages} images have GPS coordinates
            </div>
          </div>
        )}

        {/* Rating Stats */}
        {stats.averageRating > 0 && (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Star className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">Average Rating</span>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {stats.averageRating.toFixed(1)} / 5 stars
            </div>
          </div>
        )}

        {/* Date Range */}
        {stats.dateRange.earliest && stats.dateRange.latest && (
          <div className="space-y-2">
            <span className="text-sm font-medium text-gray-900 dark:text-white">Date Range</span>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {stats.dateRange.earliest.toLocaleDateString()} - {stats.dateRange.latest.toLocaleDateString()}
            </div>
          </div>
        )}

        {/* Format Distribution */}
        {Object.keys(stats.formats).length > 0 && (
          <div className="space-y-2">
            <span className="text-sm font-medium text-gray-900 dark:text-white">Formats</span>
            <div className="space-y-1">
              {Object.entries(stats.formats)
                .sort(([,a], [,b]) => b - a)
                .map(([format, count]) => (
                  <div key={format} className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">{format}</span>
                    <span className="text-gray-900 dark:text-white font-medium">{count}</span>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Camera Distribution */}
        {Object.keys(stats.cameras).length > 0 && (
          <div className="space-y-2">
            <span className="text-sm font-medium text-gray-900 dark:text-white">Cameras</span>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {Object.entries(stats.cameras)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 5)
                .map(([camera, count]) => (
                  <div key={camera} className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400 truncate">{camera}</span>
                    <span className="text-gray-900 dark:text-white font-medium">{count}</span>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatsPanel;
