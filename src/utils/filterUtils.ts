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
