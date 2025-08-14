import exifr from 'exifr';
import { BasicInfo, ExifData, IptcData, XmpData, ImageMetadata } from '../types/metadata';
import { performFileIntegrityCheck } from './fileIntegrity';
import { reverseGeocode } from './geocoding';
import { performPhotoAnalysis } from './photoAnalysis';

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
      console.log('Image loaded, dimensions:', img.naturalWidth, 'x', img.naturalHeight);
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.onerror = () => {
      console.error('Failed to load image for dimension extraction');
      resolve({ width: 0, height: 0 });
    };
    img.src = URL.createObjectURL(file);
  });
};

export const extractBasicInfo = async (file: File): Promise<BasicInfo> => {
  console.log('Extracting basic info for:', file.name);
  
  try {
    const dimensions = await getImageDimensions(file);
    console.log('Image dimensions:', dimensions);
    
    // Perform actual file integrity check
    const fileIntegrity = await performFileIntegrityCheck(file);
    
    const basicInfo = {
      fileName: file.name,
      fileSize: file.size,
      fileSizeFormatted: formatFileSize(file.size),
      format: file.type || 'Unknown',
      dimensions,
      resolution: {
        x: dimensions.width,
        y: dimensions.height,
      },
      fileIntegrity,
    };
    
    console.log('Basic info extracted:', basicInfo);
    return basicInfo;
  } catch (error) {
    console.error('Error extracting basic info:', error);
    // Return minimal info on error
    return {
      fileName: file.name,
      fileSize: file.size,
      fileSizeFormatted: formatFileSize(file.size),
      format: file.type || 'Unknown',
      dimensions: { width: 0, height: 0 },
      resolution: { x: 0, y: 0 },
      fileIntegrity: {
        md5Hash: '',
        sha256Hash: '',
        crc32Hash: '',
        isCorrupted: false,
        securityChecks: {
          hasExecutableCode: false,
          hasSuspiciousHeaders: false,
          isValidFormat: true,
        },
      },
    };
  }
};

export const extractExifData = async (file: File): Promise<ExifData> => {
  console.log('Extracting EXIF data for:', file.name);
  
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
    } as any);

    console.log('Raw EXIF data:', exif);

    if (!exif) {
      console.log('No EXIF data found');
      return {};
    }

    const exifData: ExifData = {};

    // Camera information
    if (exif.Make || exif.Model) {
      exifData.camera = {
        make: exif.Make || '',
        model: exif.Model || '',
        serialNumber: exif.BodySerialNumber || exif.SerialNumber,
        firmwareVersion: exif.FirmwareVersion || exif.Software,
        lensMount: exif.LensMount,
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
        // Advanced Camera Settings
        exposureCompensation: exif.ExposureBiasValue,
        exposureBias: exif.ExposureBiasValue,
        maxAperture: exif.MaxApertureValue,
        minAperture: exif.MinApertureValue,
        flashMode: exif.FlashMode,
        flashFired: exif.FlashFired,
        flashReturn: exif.FlashReturn,
        flashRedEye: exif.FlashRedEye,
        meteringMode: exif.MeteringMode,
        whiteBalance: exif.WhiteBalance,
        exposureMode: exif.ExposureMode,
        sceneType: exif.SceneType,
        digitalZoom: exif.DigitalZoomRatio,
        contrast: exif.Contrast,
        saturation: exif.Saturation,
        sharpness: exif.Sharpness,
        gainControl: exif.GainControl,
        subjectDistance: exif.SubjectDistance,
        subjectDistanceRange: exif.SubjectDistanceRange,
        colorSpace: exif.ColorSpace,
        customRendered: exif.CustomRendered,
        exposureProgram: exif.ExposureProgram,
        sensingMethod: exif.SensingMethod,
        fileSource: exif.FileSource,
        sceneCaptureType: exif.SceneCaptureType,
        imageUniqueID: exif.ImageUniqueID,
        ownerName: exif.OwnerName,
        bodySerialNumber: exif.BodySerialNumber,
        lensSpecification: exif.LensSpecification,
        lensMake: exif.LensMake,
        lensModel: exif.LensModel,
        lensSerialNumber: exif.LensSerialNumber,
        lensFirmwareVersion: exif.LensFirmwareVersion,
        compositeImage: exif.CompositeImage,
        sourceImageNumberOfCompositeImage: exif.SourceImageNumberOfCompositeImage,
        sourceExposureTimesOfCompositeImage: exif.SourceExposureTimesOfCompositeImage,
        focalLengthIn35mmFilm: exif.FocalLengthIn35mmFilm,
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

    // GPS data with reverse geocoding
    if (exif.latitude && exif.longitude) {
      const location = await reverseGeocode(exif.latitude, exif.longitude);
      exifData.gps = {
        latitude: exif.latitude,
        longitude: exif.longitude,
        altitude: exif.GPSAltitude,
        heading: exif.GPSImgDirection,
        speed: exif.GPSSpeed,
        speedRef: exif.GPSSpeedRef,
        track: exif.GPSTrack,
        trackRef: exif.GPSTrackRef,
        imgDirection: exif.GPSImgDirection,
        imgDirectionRef: exif.GPSImgDirectionRef,
        gpsTimeStamp: exif.GPSTimeStamp,
        gpsDateStamp: exif.GPSDateStamp,
        gpsProcessingMethod: exif.GPSProcessingMethod,
        gpsAreaInformation: exif.GPSAreaInformation,
        gpsDifferential: exif.GPSDifferential,
        gpsHPositioningError: exif.GPSHPositioningError,
        location,
      };
    }

    // Other EXIF data
    exifData.flash = exif.Flash;
    exifData.meteringMode = exif.MeteringMode;
    exifData.whiteBalance = exif.WhiteBalance;
    exifData.exposureMode = exif.ExposureMode;
    exifData.sceneType = exif.SceneType;

    console.log('EXIF data extracted:', exifData);
    return exifData;
  } catch (error) {
    console.error('Error extracting EXIF data:', error);
    return {};
  }
};

export const extractIptcData = async (file: File): Promise<IptcData> => {
  try {
    const iptc = await exifr.parse(file, { iptc: true });
    
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
    const xmp = await exifr.parse(file, { xmp: true });
    
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
  console.log('Starting metadata extraction for:', file.name);
  
  try {
    const [basicInfo, exif, iptc, xmp] = await Promise.all([
      extractBasicInfo(file),
      extractExifData(file),
      extractIptcData(file),
      extractXmpData(file),
    ]);

    console.log('Basic metadata extracted:', { basicInfo, exif, iptc, xmp });

    // Create a temporary metadata object for analysis
    const tempMetadata: ImageMetadata = {
      id: '',
      file,
      preview: '',
      basicInfo,
      exif,
      iptc,
      xmp,
      processingStatus: 'completed'
    };

    // Perform professional photo analysis
    console.log('Starting photo analysis...');
    const analysis = performPhotoAnalysis(tempMetadata);
    console.log('Photo analysis completed:', analysis);

    return {
      file,
      basicInfo,
      exif,
      iptc,
      xmp,
      analysis,
    };
  } catch (error) {
    console.error('Error in extractAllMetadata:', error);
    throw error;
  }
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
