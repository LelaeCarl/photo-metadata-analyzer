import React from 'react';
import { ImageMetadata } from '../types/metadata';
import { 
  MapPin, Camera, Settings, FileText, Star, X, 
  Shield, Hash, Award, Zap, 
  Building, CheckCircle, XCircle, AlertTriangle
} from 'lucide-react';

interface MetadataCardProps {
  metadata: ImageMetadata;
  onRemove: (id: string) => void;
  viewMode: 'grid' | 'list';
}

const MetadataCard: React.FC<MetadataCardProps> = ({ metadata, onRemove }) => {

  // File integrity status
  const getIntegrityStatus = () => {
    if (!metadata.basicInfo.fileIntegrity) return null;
    
    const { isCorrupted, securityChecks } = metadata.basicInfo.fileIntegrity;
    
    if (isCorrupted) {
      return { icon: <XCircle className="w-4 h-4 text-red-500" />, text: 'Corrupted', color: 'text-red-500' };
    }
    
    if (securityChecks.hasExecutableCode || securityChecks.hasSuspiciousHeaders) {
      return { icon: <AlertTriangle className="w-4 h-4 text-yellow-500" />, text: 'Security Warning', color: 'text-yellow-500' };
    }
    
    return { icon: <CheckCircle className="w-4 h-4 text-green-500" />, text: 'Valid', color: 'text-green-500' };
  };

  // Quality score display
  const getQualityScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

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
            {metadata.basicInfo.fileIntegrity && (
              <div className="flex items-center space-x-1">
                <Shield className="w-3 h-3" />
                <span>Integrity: {getIntegrityStatus()?.text}</span>
              </div>
            )}
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
        <div className="space-y-4">
          {/* Professional Analysis Scores */}
          {metadata.analysis && (
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-3 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Award className="w-4 h-4 text-blue-600" />
                <span className="font-medium text-sm">Professional Analysis</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="text-center">
                  <div className={`font-bold ${getQualityScoreColor(metadata.analysis.qualityScore || 0)}`}>
                    {metadata.analysis.qualityScore || 0}
                  </div>
                  <div className="text-gray-500">Quality</div>
                </div>
                <div className="text-center">
                  <div className={`font-bold ${getQualityScoreColor(metadata.analysis.technicalScore || 0)}`}>
                    {metadata.analysis.technicalScore || 0}
                  </div>
                  <div className="text-gray-500">Technical</div>
                </div>
                <div className="text-center">
                  <div className={`font-bold ${getQualityScoreColor(metadata.analysis.compositionScore || 0)}`}>
                    {metadata.analysis.compositionScore || 0}
                  </div>
                  <div className="text-gray-500">Overall</div>
                </div>
              </div>
            </div>
          )}

          {/* Camera Information */}
          {metadata.exif.camera && (
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Camera className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-medium">
                  {metadata.exif.camera.make} {metadata.exif.camera.model}
                </span>
                {metadata.analysis?.cameraAnalysis?.isProfessional && (
                  <Award className="w-4 h-4 text-yellow-500" />
                )}
              </div>
              {metadata.exif.camera.serialNumber && (
                <div className="text-xs text-gray-500">S/N: {metadata.exif.camera.serialNumber}</div>
              )}
            </div>
          )}
          
          {/* Advanced Camera Settings */}
          {metadata.exif.settings && (
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Settings className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-medium">Camera Settings</span>
              </div>
              <div className="grid grid-cols-2 gap-1 text-xs">
                <div>f/{metadata.exif.settings.aperture}</div>
                <div>ISO {metadata.exif.settings.iso}</div>
                <div>{metadata.exif.settings.focalLength}mm</div>
                <div>{metadata.exif.settings.shutterSpeed}</div>
                {metadata.exif.settings.exposureCompensation && (
                  <div>EV {metadata.exif.settings.exposureCompensation}</div>
                )}
                {metadata.exif.settings.whiteBalance && (
                  <div>{metadata.exif.settings.whiteBalance}</div>
                )}
              </div>
              
              {/* Lighting Analysis */}
              {metadata.analysis?.lightingAnalysis && (
                <div className="mt-2 p-2 bg-gray-50 dark:bg-gray-800 rounded text-xs">
                  <div className="flex items-center space-x-1 mb-1">
                    <Zap className="w-3 h-3 text-yellow-500" />
                    <span>Lighting: {metadata.analysis.lightingAnalysis.exposureLevel}</span>
                  </div>
                  {metadata.analysis.lightingAnalysis.isLowLight && (
                    <div className="text-orange-600">Low Light Conditions</div>
                  )}
                  {metadata.analysis.lightingAnalysis.isHighDynamicRange && (
                    <div className="text-blue-600">High Dynamic Range</div>
                  )}
                </div>
              )}
            </div>
          )}
          
          {/* Enhanced GPS Information */}
          {metadata.exif.gps && (
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-medium">Location</span>
              </div>
              <div className="text-xs space-y-1">
                <div>{metadata.exif.gps.latitude.toFixed(6)}, {metadata.exif.gps.longitude.toFixed(6)}</div>
                {metadata.exif.gps.location?.city && (
                  <div className="flex items-center space-x-1">
                    <Building className="w-3 h-3" />
                    <span>{metadata.exif.gps.location.city}, {metadata.exif.gps.location.country}</span>
                  </div>
                )}
                {metadata.exif.gps.altitude && (
                  <div>Altitude: {metadata.exif.gps.altitude}m</div>
                )}
                {metadata.exif.gps.speed && (
                  <div>Speed: {metadata.exif.gps.speed} {metadata.exif.gps.speedRef}</div>
                )}
              </div>
            </div>
          )}
          
          {/* File Integrity Details */}
          {metadata.basicInfo.fileIntegrity && (
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-medium">File Integrity</span>
                {getIntegrityStatus()?.icon}
              </div>
              <div className="text-xs space-y-1">
                <div className="flex items-center space-x-1">
                  <Hash className="w-3 h-3" />
                  <span>MD5: {metadata.basicInfo.fileIntegrity.md5Hash.substring(0, 8)}...</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Hash className="w-3 h-3" />
                  <span>SHA256: {metadata.basicInfo.fileIntegrity.sha256Hash.substring(0, 8)}...</span>
                </div>
                {metadata.basicInfo.fileIntegrity.securityChecks.hasExecutableCode && (
                  <div className="text-red-600 flex items-center space-x-1">
                    <AlertTriangle className="w-3 h-3" />
                    <span>Contains executable code</span>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* IPTC Information */}
          {metadata.iptc.caption && (
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center space-x-2 mb-1">
                <FileText className="w-4 h-4" />
                <span className="font-medium">Caption</span>
              </div>
              {metadata.iptc.caption}
            </div>
          )}
          
          {/* XMP Rating */}
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
