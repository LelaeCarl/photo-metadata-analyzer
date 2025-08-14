import React, { useState } from 'react';
import { ImageMetadata } from '../types/metadata';
import { MapPin, Camera, Settings, Calendar, FileText, Star, X, ChevronDown, ChevronRight, AlertCircle, Loader2 } from 'lucide-react';

interface MetadataCardProps {
  metadata: ImageMetadata;
  onRemove: (id: string) => void;
  viewMode: 'grid' | 'list';
}

const MetadataCard: React.FC<MetadataCardProps> = ({ metadata, onRemove, viewMode }) => {
  const [expandedSections, setExpandedSections] = useState<string[]>(['basic']);

  const toggleSection = (section: string) => {
    setExpandedSections((prev: string[]) =>
      prev.includes(section)
        ? prev.filter((s: string) => s !== section)
        : [...prev, section]
    );
  };

  const isExpanded = (section: string) => expandedSections.includes(section);

  const renderStatus = () => {
    switch (metadata.processingStatus) {
      case 'pending':
        return <div className="text-yellow-600">Pending</div>;
      case 'processing':
        return <div className="text-blue-600">Processing</div>;
      case 'error':
        return <div className="text-red-600">Error</div>;
      default:
        return null;
    }
  };

  return (
    <div className="card p-4 space-y-4">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium text-gray-900 dark:text-white truncate">
              {metadata.basicInfo.fileName}
            </span>
            <button onClick={() => onRemove(metadata.id)}>
              <X className="w-4 h-4 text-gray-400 hover:text-red-500" />
            </button>
          </div>
          
          <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 dark:text-gray-400">
            <div>Size: {metadata.basicInfo.fileSizeFormatted}</div>
            <div>Format: {metadata.basicInfo.format}</div>
            <div>Dimensions: {metadata.basicInfo.dimensions.width} × {metadata.basicInfo.dimensions.height}</div>
          </div>
        </div>
        {renderStatus()}
      </div>

      {metadata.preview && (
        <img
          src={metadata.preview}
          alt={metadata.basicInfo.fileName}
          className="w-full h-48 object-cover rounded-lg"
        />
      )}

      {metadata.processingStatus === 'completed' && (
        <div className="space-y-3">
          {metadata.exif.camera && (
            <div className="flex items-center space-x-2">
              <Camera className="w-4 h-4 text-gray-400" />
              <span className="text-sm">
                {metadata.exif.camera.make} {metadata.exif.camera.model}
              </span>
            </div>
          )}
          
          {metadata.exif.settings && (
            <div className="text-sm space-y-1">
              <div>Aperture: f/{metadata.exif.settings.aperture}</div>
              <div>ISO: {metadata.exif.settings.iso}</div>
              <div>Focal Length: {metadata.exif.settings.focalLength}mm</div>
            </div>
          )}
          
          {metadata.exif.gps && (
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-gray-400" />
              <span className="text-sm">
                {metadata.exif.gps.latitude.toFixed(4)}, {metadata.exif.gps.longitude.toFixed(4)}
              </span>
            </div>
          )}
          
          {metadata.iptc.caption && (
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {metadata.iptc.caption}
            </div>
          )}
          
          {metadata.xmp.rating && (
            <div className="flex items-center space-x-2">
              <Star className="w-4 h-4 text-yellow-500" />
              <span className="text-sm">Rating: {metadata.xmp.rating}/5</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MetadataCard;
