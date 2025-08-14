import React from 'react';
import { MapPin, ExternalLink } from 'lucide-react';

interface MapViewProps {
  latitude: number;
  longitude: number;
}

const MapView: React.FC<MapViewProps> = ({ latitude, longitude }) => {
  const openInMaps = () => {
    const url = `https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}&zoom=15`;
    window.open(url, '_blank');
  };

  return (
    <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-3 bg-gray-50 dark:bg-gray-700">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <MapPin className="w-4 h-4 text-gray-400" />
          <span className="text-sm font-medium text-gray-900 dark:text-white">Location</span>
        </div>
        <button
          onClick={openInMaps}
          className="flex items-center space-x-1 text-xs text-primary-600 dark:text-primary-400 hover:underline"
        >
          <ExternalLink className="w-3 h-3" />
          <span>Open Map</span>
        </button>
      </div>
      
      <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
        <div>Latitude: {latitude.toFixed(6)}</div>
        <div>Longitude: {longitude.toFixed(6)}</div>
      </div>
      
      <div className="mt-2 p-2 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-600 text-center">
        <div className="text-xs text-gray-500 dark:text-gray-400">
          Click "Open Map" to view location
        </div>
      </div>
    </div>
  );
};

export default MapView;
