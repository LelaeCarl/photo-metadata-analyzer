import React from 'react';
import { ImageMetadata } from '../types/metadata';
import { 
  X, 
  Camera, 
  Calendar, 
  MapPin, 
  Shield, 
  Settings, 
  Image as ImageIcon,
  Zap,
  Star,
  Target,
  Clock,
  Eye,
  TrendingUp,
  CheckCircle,
  AlertTriangle,
  Smartphone,
  Tablet
} from 'lucide-react';

interface MetadataCardProps {
  metadata: ImageMetadata;
  onRemove: (id: string) => void;
  viewMode: 'grid' | 'list';
}

const MetadataCard: React.FC<MetadataCardProps> = ({ metadata, onRemove, viewMode }) => {
  const getIntegrityStatus = () => {
    const integrity = metadata.basicInfo.fileIntegrity;
    if (integrity.isCorrupted) return { status: 'corrupted', icon: AlertTriangle, color: 'text-red-500' };
    if (integrity.securityChecks.hasExecutableCode || integrity.securityChecks.hasSuspiciousHeaders) {
      return { status: 'warning', icon: AlertTriangle, color: 'text-amber-500' };
    }
    return { status: 'valid', icon: CheckCircle, color: 'text-emerald-500' };
  };

  const getQualityScoreColor = (score: number) => {
    if (score >= 8) return 'text-emerald-600';
    if (score >= 6) return 'text-amber-600';
    return 'text-red-600';
  };

  const getDeviceIcon = (make?: string) => {
    if (!make) return Camera;
    const lowerMake = make.toLowerCase();
    if (lowerMake.includes('iphone') || lowerMake.includes('samsung') || lowerMake.includes('google')) {
      return Smartphone;
    }
    if (lowerMake.includes('ipad') || lowerMake.includes('tablet')) {
      return Tablet;
    }
    return Camera;
  };

  const integrityStatus = getIntegrityStatus();
  const DeviceIcon = getDeviceIcon(metadata.exif.camera?.make);

  return (
    <div className="group bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Image Header */}
      <div className="relative h-48 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-700 dark:to-gray-800">
        {metadata.preview && (
          <img 
            src={metadata.preview} 
            alt={metadata.basicInfo.fileName}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        )}
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent">
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex items-center justify-between text-white">
              <div className="flex items-center space-x-2 flex-1 min-w-0">
                <DeviceIcon className="w-4 h-4 flex-shrink-0" />
                <span className="font-medium text-sm truncate">
                  {metadata.basicInfo.fileName}
                </span>
              </div>
              <button
                onClick={() => onRemove(metadata.id)}
                className="p-1.5 rounded-full bg-white/20 hover:bg-white/30 transition-colors duration-200 backdrop-blur-sm flex-shrink-0 ml-2"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>

        {/* Quality Score Badge */}
        {metadata.analysis?.qualityScore && (
          <div className="absolute top-4 right-4">
            <div className="flex items-center space-x-1 px-2 py-1 rounded-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
              <Star className={`w-3 h-3 ${getQualityScoreColor(metadata.analysis.qualityScore)}`} />
              <span className={`text-xs font-semibold ${getQualityScoreColor(metadata.analysis.qualityScore)}`}>
                {metadata.analysis.qualityScore.toFixed(1)}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 space-y-5">
        {/* Basic Info */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white break-words">
            {metadata.basicInfo.fileName}
          </h3>
          
          <div className="grid grid-cols-2 gap-4 text-xs text-gray-600 dark:text-gray-400">
            <div className="flex items-center space-x-2">
              <ImageIcon className="w-3 h-3 flex-shrink-0" />
              <span className="truncate">{metadata.basicInfo.fileSizeFormatted}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Target className="w-3 h-3 flex-shrink-0" />
              <span>{metadata.basicInfo.dimensions.width} × {metadata.basicInfo.dimensions.height}</span>
            </div>
          </div>
        </div>

        {/* Camera Info */}
        {metadata.exif.camera && (
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Camera className="w-4 h-4 text-slate-600 dark:text-slate-400 flex-shrink-0" />
              <h4 className="text-sm font-medium text-gray-900 dark:text-white">Camera</h4>
            </div>
            <div className="space-y-2">
              {metadata.exif.camera.make && metadata.exif.camera.model && (
                <div className="flex items-start justify-between text-xs">
                  <span className="text-gray-500 dark:text-gray-400 flex-shrink-0 mr-3">Model</span>
                  <span className="font-medium text-gray-900 dark:text-white text-right break-words">
                    {metadata.exif.camera.make} {metadata.exif.camera.model}
                  </span>
                </div>
              )}
              {metadata.exif.settings?.lens && (
                <div className="flex items-start justify-between text-xs">
                  <span className="text-gray-500 dark:text-gray-400 flex-shrink-0 mr-3">Lens</span>
                  <span className="font-medium text-gray-900 dark:text-white text-right break-words">
                    {metadata.exif.settings.lens}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Camera Settings */}
        {metadata.exif.settings && (
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Settings className="w-4 h-4 text-slate-600 dark:text-slate-400 flex-shrink-0" />
              <h4 className="text-sm font-medium text-gray-900 dark:text-white">Settings</h4>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {metadata.exif.settings.aperture && (
                <div className="flex items-center space-x-2">
                  <Eye className="w-3 h-3 text-gray-400 flex-shrink-0" />
                  <div>
                    <div className="text-xs text-gray-500">f/{metadata.exif.settings.aperture}</div>
                  </div>
                </div>
              )}
              {metadata.exif.settings.shutterSpeed && (
                <div className="flex items-center space-x-2">
                  <Clock className="w-3 h-3 text-gray-400 flex-shrink-0" />
                  <div>
                    <div className="text-xs text-gray-500">
                      {typeof metadata.exif.settings.shutterSpeed === 'string' 
                        ? parseFloat(metadata.exif.settings.shutterSpeed).toFixed(3) + 's'
                        : metadata.exif.settings.shutterSpeed + 's'
                      }
                    </div>
                  </div>
                </div>
              )}
              {metadata.exif.settings.iso && (
                <div className="flex items-center space-x-2">
                  <Zap className="w-3 h-3 text-gray-400 flex-shrink-0" />
                  <div>
                    <div className="text-xs text-gray-500">ISO {metadata.exif.settings.iso}</div>
                  </div>
                </div>
              )}
              {metadata.exif.settings.focalLength && (
                <div className="flex items-center space-x-2">
                  <Target className="w-3 h-3 text-gray-400 flex-shrink-0" />
                  <div>
                    <div className="text-xs text-gray-500">
                      {typeof metadata.exif.settings.focalLength === 'string' 
                        ? parseFloat(metadata.exif.settings.focalLength).toFixed(1) + 'mm'
                        : metadata.exif.settings.focalLength + 'mm'
                      }
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Date & Location */}
        <div className="space-y-2">
          {metadata.exif.datetime?.original && (
            <div className="flex items-center space-x-2">
              <Calendar className="w-3 h-3 text-gray-400 flex-shrink-0" />
              <span className="text-xs text-gray-600 dark:text-gray-400">
                {new Date(metadata.exif.datetime.original).toLocaleDateString()}
              </span>
            </div>
          )}
          {metadata.exif.gps?.location?.city && (
            <div className="flex items-center space-x-2">
              <MapPin className="w-3 h-3 text-gray-400 flex-shrink-0" />
              <span className="text-xs text-gray-600 dark:text-gray-400 truncate">
                {metadata.exif.gps.location.city}, {metadata.exif.gps.location.country}
              </span>
            </div>
          )}
        </div>

        {/* File Integrity */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Shield className="w-4 h-4 text-slate-600 dark:text-slate-400 flex-shrink-0" />
            <h4 className="text-sm font-medium text-gray-900 dark:text-white">Integrity</h4>
            <integrityStatus.icon className={`w-3 h-3 ${integrityStatus.color} flex-shrink-0`} />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500">MD5</span>
              <span className="font-mono text-gray-600 dark:text-gray-300">
                {metadata.basicInfo.fileIntegrity.md5Hash.substring(0, 8)}...
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500">SHA256</span>
              <span className="font-mono text-gray-600 dark:text-gray-300">
                {metadata.basicInfo.fileIntegrity.sha256Hash.substring(0, 8)}...
              </span>
            </div>
          </div>
        </div>

        {/* Analysis Scores */}
        {metadata.analysis && (
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-slate-600 dark:text-slate-400 flex-shrink-0" />
              <h4 className="text-sm font-medium text-gray-900 dark:text-white">Analysis</h4>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {metadata.analysis.qualityScore && (
                <div className="text-center p-2 rounded-lg bg-slate-50 dark:bg-gray-700">
                  <div className={`text-sm font-bold ${getQualityScoreColor(metadata.analysis.qualityScore)}`}>
                    {metadata.analysis.qualityScore.toFixed(1)}
                  </div>
                  <div className="text-xs text-gray-500">Quality</div>
                </div>
              )}
              {metadata.analysis.technicalScore && (
                <div className="text-center p-2 rounded-lg bg-slate-50 dark:bg-gray-700">
                  <div className="text-sm font-bold text-slate-600 dark:text-slate-300">
                    {metadata.analysis.technicalScore.toFixed(1)}
                  </div>
                  <div className="text-xs text-gray-500">Technical</div>
                </div>
              )}
              {metadata.analysis.compositionScore && (
                <div className="text-center p-2 rounded-lg bg-slate-50 dark:bg-gray-700">
                  <div className="text-sm font-bold text-slate-600 dark:text-slate-300">
                    {metadata.analysis.compositionScore.toFixed(1)}
                  </div>
                  <div className="text-xs text-gray-500">Composition</div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MetadataCard;
