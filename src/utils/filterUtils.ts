import { ImageMetadata, FilterOptions } from '../types/metadata';

export const filterMetadata = (
  metadata: ImageMetadata[],
  filters: FilterOptions
): ImageMetadata[] => {
  return metadata.filter(img => {
    // Category filter
    if (filters.category.length > 0) {
      const imgCategory = img.iptc.category || img.xmp.subject?.[0] || 'Uncategorized';
      if (!filters.category.includes(imgCategory)) {
        return false;
      }
    }

    // Date range filter
    if (filters.dateRange.start || filters.dateRange.end) {
      const imgDate = img.exif.datetime?.original;
      if (imgDate) {
        const date = new Date(imgDate);
        if (filters.dateRange.start && date < filters.dateRange.start) {
          return false;
        }
        if (filters.dateRange.end && date > filters.dateRange.end) {
          return false;
        }
      }
    }

    // Camera model filter
    if (filters.cameraModel.length > 0) {
      const imgModel = img.exif.camera?.model;
      if (!imgModel || !filters.cameraModel.includes(imgModel)) {
        return false;
      }
    }

    // GPS filter
    if (filters.hasGps !== null) {
      const hasGps = !!img.exif.gps;
      if (hasGps !== filters.hasGps) {
        return false;
      }
    }

    // EXIF filter
    if (filters.hasExif !== null) {
      const hasExif = !!(img.exif.camera || img.exif.settings || img.exif.datetime);
      if (hasExif !== filters.hasExif) {
        return false;
      }
    }

    // Enhanced Filters
    // Quality score filter
    if (filters.qualityScore) {
      const score = img.analysis?.qualityScore || 0;
      if (filters.qualityScore.min && score < filters.qualityScore.min) {
        return false;
      }
      if (filters.qualityScore.max && score > filters.qualityScore.max) {
        return false;
      }
    }

    // File size filter
    if (filters.fileSize) {
      const size = img.basicInfo.fileSize;
      if (filters.fileSize.min && size < filters.fileSize.min) {
        return false;
      }
      if (filters.fileSize.max && size > filters.fileSize.max) {
        return false;
      }
    }

    // Resolution filter
    if (filters.resolution) {
      const megapixels = (img.basicInfo.dimensions.width * img.basicInfo.dimensions.height) / 1000000;
      if (filters.resolution.min && megapixels < filters.resolution.min) {
        return false;
      }
      if (filters.resolution.max && megapixels > filters.resolution.max) {
        return false;
      }
    }

    // Lens type filter
    if (filters.lensType && filters.lensType.length > 0) {
      const lens = img.exif.settings?.lens || '';
      if (!filters.lensType.some(type => lens.toLowerCase().includes(type.toLowerCase()))) {
        return false;
      }
    }

    // Exposure mode filter
    if (filters.exposureMode && filters.exposureMode.length > 0) {
      const mode = img.exif.settings?.exposureMode;
      if (!mode || !filters.exposureMode.includes(mode)) {
        return false;
      }
    }

    // Metering mode filter
    if (filters.meteringMode && filters.meteringMode.length > 0) {
      const mode = img.exif.settings?.meteringMode;
      if (!mode || !filters.meteringMode.includes(mode)) {
        return false;
      }
    }

    // White balance filter
    if (filters.whiteBalance && filters.whiteBalance.length > 0) {
      const wb = img.exif.settings?.whiteBalance;
      if (!wb || !filters.whiteBalance.includes(wb)) {
        return false;
      }
    }

    // Flash used filter
    if (filters.flashUsed !== null) {
      const flashUsed = img.exif.settings?.flashFired || false;
      if (flashUsed !== filters.flashUsed) {
        return false;
      }
    }

    // Has location filter
    if (filters.hasLocation !== null) {
      const hasLocation = !!(img.exif.gps?.location?.city || img.exif.gps?.location?.country);
      if (hasLocation !== filters.hasLocation) {
        return false;
      }
    }

    // File integrity filter
    if (filters.fileIntegrity && filters.fileIntegrity !== 'all') {
      const isCorrupted = img.basicInfo.fileIntegrity?.isCorrupted || false;
      if (filters.fileIntegrity === 'valid' && isCorrupted) {
        return false;
      }
      if (filters.fileIntegrity === 'corrupted' && !isCorrupted) {
        return false;
      }
    }

    return true;
  });
};

export const getUniqueValues = (metadata: ImageMetadata[], field: keyof ImageMetadata): string[] => {
  const values = new Set<string>();

  metadata.forEach(img => {
    switch (field) {
      case 'iptc':
        if (img.iptc.category) values.add(img.iptc.category);
        break;
      case 'exif':
        if (img.exif.camera?.model) values.add(img.exif.camera.model);
        break;
      default:
        break;
    }
  });

  return Array.from(values).sort();
};

export const getCameraModels = (metadata: ImageMetadata[]): string[] => {
  return getUniqueValues(metadata, 'exif');
};

export const getCategories = (metadata: ImageMetadata[]): string[] => {
  return getUniqueValues(metadata, 'iptc');
};

export const getStats = (metadata: ImageMetadata[]) => {
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
    // Enhanced Statistics
    professionalCameras: 0,
    corruptedFiles: 0,
    securityWarnings: 0,
    averageQualityScore: 0,
    averageTechnicalScore: 0,
    hasLocationData: 0,
    lensTypes: {} as Record<string, number>,
    exposureModes: {} as Record<string, number>,
    meteringModes: {} as Record<string, number>,
    whiteBalances: {} as Record<string, number>,
    flashUsage: 0,
    lowLightImages: 0,
    highDynamicRangeImages: 0,
  };

  let totalRating = 0;
  let ratedImages = 0;
  let totalQualityScore = 0;
  let totalTechnicalScore = 0;
  let scoredImages = 0;

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

    // Enhanced Statistics
    // Professional cameras
    if (img.analysis?.cameraAnalysis?.isProfessional) {
      stats.professionalCameras++;
    }

    // File integrity
    if (img.basicInfo.fileIntegrity?.isCorrupted) {
      stats.corruptedFiles++;
    }
    if (img.basicInfo.fileIntegrity?.securityChecks.hasExecutableCode || 
        img.basicInfo.fileIntegrity?.securityChecks.hasSuspiciousHeaders) {
      stats.securityWarnings++;
    }

    // Quality scores
    if (img.analysis?.qualityScore) {
      totalQualityScore += img.analysis.qualityScore;
      scoredImages++;
    }
    if (img.analysis?.technicalScore) {
      totalTechnicalScore += img.analysis.technicalScore;
    }

    // Location data
    if (img.exif.gps?.location?.city || img.exif.gps?.location?.country) {
      stats.hasLocationData++;
    }

    // Lens types
    if (img.exif.settings?.lens) {
      const lens = img.exif.settings.lens;
      stats.lensTypes[lens] = (stats.lensTypes[lens] || 0) + 1;
    }

    // Exposure modes
    if (img.exif.settings?.exposureMode) {
      const mode = img.exif.settings.exposureMode;
      stats.exposureModes[mode] = (stats.exposureModes[mode] || 0) + 1;
    }

    // Metering modes
    if (img.exif.settings?.meteringMode) {
      const mode = img.exif.settings.meteringMode;
      stats.meteringModes[mode] = (stats.meteringModes[mode] || 0) + 1;
    }

    // White balance
    if (img.exif.settings?.whiteBalance) {
      const wb = img.exif.settings.whiteBalance;
      stats.whiteBalances[wb] = (stats.whiteBalances[wb] || 0) + 1;
    }

    // Flash usage
    if (img.exif.settings?.flashFired) {
      stats.flashUsage++;
    }

    // Lighting conditions
    if (img.analysis?.lightingAnalysis?.isLowLight) {
      stats.lowLightImages++;
    }
    if (img.analysis?.lightingAnalysis?.isHighDynamicRange) {
      stats.highDynamicRangeImages++;
    }
  });

  if (ratedImages > 0) {
    stats.averageRating = totalRating / ratedImages;
  }

  if (scoredImages > 0) {
    stats.averageQualityScore = totalQualityScore / scoredImages;
    stats.averageTechnicalScore = totalTechnicalScore / scoredImages;
  }

  return stats;
};
