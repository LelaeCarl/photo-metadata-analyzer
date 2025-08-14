import React, { useState } from 'react';
import { ImageMetadata } from '../types/metadata';
import { BarChart3, Camera, MapPin, Clock } from 'lucide-react';

interface AnalyticsPanelProps {
  metadata: ImageMetadata[];
}

type AnalyticsTab = 'camera' | 'location' | 'time';

const AnalyticsPanel: React.FC<AnalyticsPanelProps> = ({ metadata }) => {
  const [activeTab, setActiveTab] = useState<AnalyticsTab>('camera');

  const getCameraStats = () => {
    const cameras = metadata.reduce((acc, img) => {
      const camera = `${img.exif.camera?.make || 'Unknown'} ${img.exif.camera?.model || ''}`.trim();
      acc[camera] = (acc[camera] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(cameras)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5);
  };

  const getLocationStats = () => {
    const locations = metadata.reduce((acc, img) => {
      const location = img.exif.gps?.location?.city || 'Unknown Location';
      acc[location] = (acc[location] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(locations)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5);
  };

  const getTimeStats = () => {
    const hours = metadata.reduce((acc, img) => {
      if (img.exif.datetime?.original) {
        const hour = new Date(img.exif.datetime.original).getHours();
        acc[hour] = (acc[hour] || 0) + 1;
      }
      return acc;
    }, {} as Record<number, number>);

    return hours;
  };

  const cameraStats = getCameraStats();
  const locationStats = getLocationStats();
  const timeStats = getTimeStats();

  const renderBar = (value: number, max: number, label: string) => {
    const percentage = max > 0 ? (value / max) * 100 : 0;
    return (
      <div className="space-y-1">
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-600 dark:text-gray-400 truncate">{label}</span>
          <span className="text-gray-900 dark:text-white font-medium">{value}</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="p-5">
        <div className="flex items-center space-x-3 mb-5">
          <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
            <BarChart3 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Analytics & Insights
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Professional photo analysis
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1 mb-5">
          <button
            onClick={() => setActiveTab('camera')}
            className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
              activeTab === 'camera'
                ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>Camera</span>
          </button>
          <button
            onClick={() => setActiveTab('location')}
            className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
              activeTab === 'location'
                ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Location</span>
          </button>
          <button
            onClick={() => setActiveTab('time')}
            className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
              activeTab === 'time'
                ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Time</span>
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4">
          {activeTab === 'camera' && (
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white">Camera Models</h4>
              <div className="space-y-3">
                {cameraStats.map(([camera, count]) => {
                  const max = Math.max(...cameraStats.map(([,c]) => c));
                  return renderBar(count, max, camera);
                })}
              </div>
            </div>
          )}

          {activeTab === 'location' && (
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white">Photo Locations</h4>
              <div className="space-y-3">
                {locationStats.map(([location, count]) => {
                  const max = Math.max(...locationStats.map(([,c]) => c));
                  return renderBar(count, max, location);
                })}
              </div>
            </div>
          )}

          {activeTab === 'time' && (
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white">Best Shooting Hours</h4>
              <div className="grid grid-cols-2 gap-3">
                {Array.from({ length: 24 }, (_, hour) => {
                  const hourLabel = `${hour.toString().padStart(2, '0')}:00`;
                  const count = timeStats[hour] || 0;
                  const max = Math.max(...Object.values(timeStats));
                  return (
                    <div key={hour} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-600 dark:text-gray-400">{hourLabel}</span>
                        <span className="text-gray-900 dark:text-white font-medium">{count}</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-purple-600 h-1.5 rounded-full transition-all duration-500"
                          style={{ width: `${max > 0 ? (count / max) * 100 : 0}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPanel;
