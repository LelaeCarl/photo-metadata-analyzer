import exifr from 'exifr';
import { BasicInfo, ExifData, IptcData, XmpData, ImageMetadata } from '../types/metadata';

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const getImageDimensions = (file: File): Promise<{ width: number; height: number }> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.onerror = () => {
      resolve({ width: 0, height: 0 });
    };
    img.src = URL.createObjectURL(file);
  });
};

export const extractBasicInfo = async (file: File): Promise<BasicInfo> => {
  const dimensions = await getImageDimensions(file);
  
  return {
    fileName: file.name,
    fileSize: file.size,
    fileSizeFormatted: formatFileSize(file.size),
    format: file.type || 'Unknown',
    dimensions,
    resolution: {
      x: dimensions.width,
      y: dimensions.height,
    },
  };
};

export const extractExifData = async (file: File): Promise<ExifData> => {
  try {
    const exif = await exifr.parse(file, {
      gps: true,
      exif: true,
      ifd0: true,
      ifd1: true,
      interop: true,
      iptc: true,
      xmp: true,
      icc: true,
      ihdr: true,
    });

    if (!exif) return {};

    const exifData: ExifData = {};

    // Camera information
    if (exif.Make || exif.Model) {
      exifData.camera = {
        make: exif.Make || '',
        model: exif.Model || '',
      };
    }

    // Camera settings
    if (exif.FNumber || exif.ExposureTime || exif.ISO || exif.FocalLength) {
      exifData.settings = {
        aperture: exif.FNumber || 0,
        shutterSpeed: exif.ExposureTime ? `${exif.ExposureTime}s` : '',
        iso: exif.ISO || 0,
        focalLength: exif.FocalLength || 0,
        lens: exif.LensModel || exif.Lens || '',
      };
    }

    // Date and time
    if (exif.DateTimeOriginal || exif.DateTimeDigitized || exif.DateTime) {
      exifData.datetime = {
        original: exif.DateTimeOriginal || '',
        digitized: exif.DateTimeDigitized || '',
        modified: exif.DateTime || '',
      };
    }

    // GPS data
    if (exif.latitude && exif.longitude) {
      exifData.gps = {
        latitude: exif.latitude,
        longitude: exif.longitude,
        altitude: exif.GPSAltitude,
        heading: exif.GPSImgDirection,
      };
    }

    // Other EXIF data
    exifData.flash = exif.Flash;
    exifData.meteringMode = exif.MeteringMode;
    exifData.whiteBalance = exif.WhiteBalance;
    exifData.exposureMode = exif.ExposureMode;
    exifData.sceneType = exif.SceneType;

    return exifData;
  } catch (error) {
    console.error('Error extracting EXIF data:', error);
    return {};
  }
};

export const extractIptcData = async (file: File): Promise<IptcData> => {
  try {
    const iptc = await exifr.iptc(file);
    
    if (!iptc) return {};

    return {
      caption: iptc.CaptionAbstract || iptc.ObjectName,
      keywords: iptc.Keywords,
      copyright: iptc.Copyright,
      creator: iptc.ByLine,
      location: iptc.SubLocation || iptc.City || iptc.Country,
      usageRights: iptc.UsageTerms,
      headline: iptc.Headline,
      description: iptc.Description,
      category: iptc.Category,
      subcategory: iptc.SubCategory,
    };
  } catch (error) {
    console.error('Error extracting IPTC data:', error);
    return {};
  }
};

export const extractXmpData = async (file: File): Promise<XmpData> => {
  try {
    const xmp = await exifr.xmp(file);
    
    if (!xmp) return {};

    return {
      rating: xmp.Rating,
      colorLabels: xmp.ColorLabels,
      keywords: xmp.Keywords,
      creator: xmp.Creator,
      rights: xmp.Rights,
      description: xmp.Description,
      title: xmp.Title,
      subject: xmp.Subject,
      lightroomEdits: xmp.LightroomEdits || {},
      adobeData: xmp.AdobeData || {},
    };
  } catch (error) {
    console.error('Error extracting XMP data:', error);
    return {};
  }
};

export const extractAllMetadata = async (file: File): Promise<Omit<ImageMetadata, 'id' | 'preview' | 'processingStatus'>> => {
  const [basicInfo, exif, iptc, xmp] = await Promise.all([
    extractBasicInfo(file),
    extractExifData(file),
    extractIptcData(file),
    extractXmpData(file),
  ]);

  return {
    file,
    basicInfo,
    exif,
    iptc,
    xmp,
  };
};

export const generatePreview = (file: File): Promise<string> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      resolve(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  });
};
