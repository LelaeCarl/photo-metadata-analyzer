export interface BasicInfo {
  fileName: string;
  fileSize: number;
  fileSizeFormatted: string;
  format: string;
  dimensions: {
    width: number;
    height: number;
  };
  resolution: {
    x: number;
    y: number;
  };
  checksum?: string;
  encoding?: string;
  compression?: string;
}

export interface ExifData {
  camera?: {
    make: string;
    model: string;
  };
  settings?: {
    aperture: number;
    shutterSpeed: string;
    iso: number;
    focalLength: number;
    lens: string;
  };
  datetime?: {
    original: string;
    digitized: string;
    modified: string;
  };
  gps?: {
    latitude: number;
    longitude: number;
    altitude?: number;
    heading?: number;
  };
  flash?: boolean;
  meteringMode?: string;
  whiteBalance?: string;
  exposureMode?: string;
  sceneType?: string;
}

export interface IptcData {
  caption?: string;
  keywords?: string[];
  copyright?: string;
  creator?: string;
  location?: string;
  usageRights?: string;
  headline?: string;
  description?: string;
  category?: string;
  subcategory?: string;
}

export interface XmpData {
  rating?: number;
  colorLabels?: string[];
  keywords?: string[];
  creator?: string;
  rights?: string;
  description?: string;
  title?: string;
  subject?: string[];
  lightroomEdits?: Record<string, any>;
  adobeData?: Record<string, any>;
}

export interface ImageMetadata {
  id: string;
  file: File;
  preview: string;
  basicInfo: BasicInfo;
  exif: ExifData;
  iptc: IptcData;
  xmp: XmpData;
  processingStatus: 'pending' | 'processing' | 'completed' | 'error';
  error?: string;
}

export interface FilterOptions {
  category: string[];
  dateRange: {
    start: Date | null;
    end: Date | null;
  };
  cameraModel: string[];
  hasGps: boolean | null;
  hasExif: boolean | null;
}

export interface ExportFormat {
  id: string;
  name: string;
  extension: string;
  mimeType: string;
}
