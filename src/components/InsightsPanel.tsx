import React from 'react';
import { ImageMetadata } from '../types/metadata';
import { 
  Lightbulb, 
  TrendingUp, 
  Award, 
  Target, 
  Zap, 
  Star,
  Camera,
  MapPin,
  Clock
} from 'lucide-react';

interface InsightsPanelProps {
  metadata: ImageMetadata[];
}

const InsightsPanel: React.FC<InsightsPanelProps> = ({ metadata }) => {
  const getInsights = () => {
    if (metadata.length === 0) return [];

    const insights = [];

    // Camera insights
    const cameras = metadata.reduce((acc, img) => {
      const camera = `${img.exif.camera?.make || 'Unknown'} ${img.exif.camera?.model || ''}`.trim();
      acc[camera] = (acc[camera] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const mostUsedCamera = Object.entries(cameras).sort(([,a], [,b]) => b - a)[0];
    if (mostUsedCamera) {
      insights.push({
        type: 'camera',
        icon: Camera,
        title: 'Primary Camera',
        description: `${mostUsedCamera[0]} (${mostUsedCamera[1]} photos)`,
        color: 'text-blue-500'
      });
    }

    // Quality insights
    const qualityScores = metadata
      .map(img => img.analysis?.qualityScore)
      .filter(score => score !== undefined) as number[];

    if (qualityScores.length > 0) {
      const avgQuality = qualityScores.reduce((a, b) => a + b, 0) / qualityScores.length;
      const bestPhoto = metadata.find(img => img.analysis?.qualityScore === Math.max(...qualityScores));
      
      insights.push({
        type: 'quality',
        icon: Star,
        title: 'Average Quality',
        description: `${avgQuality.toFixed(1)}/10`,
        color: avgQuality >= 8 ? 'text-emerald-500' : avgQuality >= 6 ? 'text-amber-500' : 'text-red-500'
      });

      if (bestPhoto) {
        insights.push({
          type: 'best',
          icon: Award,
          title: 'Best Photo',
          description: `${bestPhoto.basicInfo.fileName}`,
          color: 'text-purple-500'
        });
      }
    }

    // Location insights
    const locations = metadata.reduce((acc, img) => {
      const location = img.exif.gps?.location?.city || 'Unknown';
      acc[location] = (acc[location] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const mostPhotographedLocation = Object.entries(locations).sort(([,a], [,b]) => b - a)[0];
    if (mostPhotographedLocation && mostPhotographedLocation[0] !== 'Unknown') {
      insights.push({
        type: 'location',
        icon: MapPin,
        title: 'Favorite Location',
        description: `${mostPhotographedLocation[0]} (${mostPhotographedLocation[1]} photos)`,
        color: 'text-green-500'
      });
    }

    // Time insights
    const hours = metadata.reduce((acc, img) => {
      if (img.exif.datetime?.original) {
        const hour = new Date(img.exif.datetime.original).getHours();
        acc[hour] = (acc[hour] || 0) + 1;
      }
      return acc;
    }, {} as Record<number, number>);

    if (Object.keys(hours).length > 0) {
      const bestHour = Object.entries(hours).sort(([,a], [,b]) => b - a)[0];
      insights.push({
        type: 'time',
        icon: Clock,
        title: 'Best Shooting Time',
        description: `${bestHour[0].toString().padStart(2, '0')}:00 (${bestHour[1]} photos)`,
        color: 'text-orange-500'
      });
    }

    // Technical insights
    const apertures = metadata
      .map(img => img.exif.settings?.aperture)
      .filter(aperture => aperture !== undefined) as string[];

    if (apertures.length > 0) {
      const mostUsedAperture = apertures.reduce((acc, aperture) => {
        acc[aperture] = (acc[aperture] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const favoriteAperture = Object.entries(mostUsedAperture).sort(([,a], [,b]) => b - a)[0];
      insights.push({
        type: 'technical',
        icon: Target,
        title: 'Favorite Aperture',
        description: `f/${favoriteAperture[0]} (${favoriteAperture[1]} photos)`,
        color: 'text-indigo-500'
      });
    }

    return insights;
  };

  const insights = getInsights();

  if (insights.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-5">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg">
              <Lightbulb className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Insights & Recommendations
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Professional photo analysis
              </p>
            </div>
          </div>
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Lightbulb className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Upload photos to see professional insights
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="p-5">
        <div className="flex items-center space-x-3 mb-5">
          <div className="p-2 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg">
            <Lightbulb className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Insights & Recommendations
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Professional photo analysis
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {insights.map((insight, index) => {
            const IconComponent = insight.icon;
            return (
              <div 
                key={index}
                className="flex items-start space-x-3 p-3 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-lg border border-gray-200 dark:border-gray-600"
              >
                <div className={`p-2 rounded-lg bg-white dark:bg-gray-600 shadow-sm`}>
                  <IconComponent className={`w-4 h-4 ${insight.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                    {insight.title}
                  </h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                    {insight.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Recommendations */}
        <div className="mt-5 pt-5 border-t border-gray-200 dark:border-gray-600">
          <div className="flex items-center space-x-2 mb-3">
            <TrendingUp className="w-4 h-4 text-emerald-500" />
            <h4 className="text-sm font-medium text-gray-900 dark:text-white">
              Recommendations
            </h4>
          </div>
          <div className="space-y-2">
            <div className="flex items-start space-x-2">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Try shooting during golden hour for better lighting
              </p>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Experiment with different apertures for creative depth of field
              </p>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Consider using a tripod for sharper images in low light
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InsightsPanel;
