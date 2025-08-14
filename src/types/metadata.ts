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
  // File Integrity
  fileIntegrity: {
    md5Hash: string;
    sha256Hash: string;
    crc32Hash: string;
    isCorrupted: boolean;
    securityChecks: {
      hasExecutableCode: boolean;
      hasSuspiciousHeaders: boolean;
      isValidFormat: boolean;
    };
  };
}

export interface ExifData {
  camera?: {
    make: string;
    model: string;
    serialNumber?: string;
    firmwareVersion?: string;
    lensMount?: string;
  };
  settings?: {
    aperture: number;
    shutterSpeed: string;
    iso: number;
    focalLength: number;
    lens: string;
    // Advanced Camera Settings
    exposureCompensation?: number;
    exposureBias?: number;
    maxAperture?: number;
    minAperture?: number;
    flashMode?: string;
    flashFired?: boolean;
    flashReturn?: string;
    flashRedEye?: boolean;
    meteringMode?: string;
    whiteBalance?: string;
    exposureMode?: string;
    sceneType?: string;
    digitalZoom?: number;
    digitalZoomRatio?: number;
    contrast?: string;
    saturation?: string;
    sharpness?: string;
    gainControl?: string;
    subjectDistance?: number;
    subjectDistanceRange?: string;
    colorSpace?: string;
    customRendered?: string;
    exposureProgram?: string;
    sensingMethod?: string;
    fileSource?: string;
    sceneCaptureType?: string;
    imageUniqueID?: string;
    ownerName?: string;
    bodySerialNumber?: string;
    lensSpecification?: string;
    lensMake?: string;
    lensModel?: string;
    lensSerialNumber?: string;
    lensFirmwareVersion?: string;
    compositeImage?: string;
    sourceImageNumberOfCompositeImage?: number;
    sourceExposureTimesOfCompositeImage?: string;
    focalLengthIn35mmFilm?: number;
  };
  datetime?: {
    original: string;
    digitized: string;
    modified: string;
    subsecTime?: string;
    subsecTimeOriginal?: string;
    subsecTimeDigitized?: string;
    timeZoneOffset?: number;
  };
  gps?: {
    latitude: number;
    longitude: number;
    altitude?: number;
    heading?: number;
    // Enhanced GPS Data
    speed?: number;
    speedRef?: string;
    track?: number;
    trackRef?: string;
    imgDirection?: number;
    imgDirectionRef?: string;
    gpsTimeStamp?: string;
    gpsDateStamp?: string;
    gpsProcessingMethod?: string;
    gpsAreaInformation?: string;
    gpsDifferential?: number;
    gpsHPositioningError?: number;
    // Reverse Geocoding
    location?: {
      country?: string;
      state?: string;
      city?: string;
      address?: string;
      postalCode?: string;
      timezone?: string;
      accuracy?: number;
      placeId?: string;
    };
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
  // Enhanced IPTC
  byline?: string;
  bylineTitle?: string;
  credit?: string;
  source?: string;
  objectName?: string;
  dateCreated?: string;
  city?: string;
  subLocation?: string;
  provinceState?: string;
  countryPrimaryLocationName?: string;
  originalTransmissionReference?: string;
  specialInstructions?: string;
  supplementalCategories?: string[];
  urgency?: string;
  releaseDate?: string;
  releaseTime?: string;
  expirationDate?: string;
  expirationTime?: string;
  referenceService?: string;
  referenceDate?: string;
  referenceNumber?: string;
  timeCreated?: string;
  subTime?: string;
  editStatus?: string;
  editorialUpdate?: string;
  subjectReference?: string;
  fixtureIdentifier?: string;
  contentLocationCode?: string;
  contentLocationName?: string;
  actionAdvised?: string;
  digitalCreationDate?: string;
  digitalCreationTime?: string;
  originatingProgram?: string;
  programVersion?: string;
  objectCycle?: string;
  countryPrimaryLocationCode?: string;
  copyrightNotice?: string;
  contact?: string;
  captionAbstract?: string;
  writerEditor?: string;
  rasterizedCaption?: string;
  imageType?: string;
  imageOrientation?: string;
  languageIdentifier?: string;
  audioType?: string;
  audioSamplingRate?: string;
  audioSamplingResolution?: string;
  audioDuration?: string;
  audioOutcue?: string;
  jobID?: string;
  masterDocumentID?: string;
  shortDocumentID?: string;
  uniqueDocumentID?: string;
  ownerID?: string;
  objectPreviewFileFormat?: string;
  objectPreviewFileVersion?: string;
  objectPreviewData?: string;
  prefixedObjectArray?: string;
  recordVersion?: string;
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
  // Enhanced XMP
  createDate?: string;
  modifyDate?: string;
  metadataDate?: string;
  creatorTool?: string;
  label?: string;
  usageTerms?: string;
  webStatement?: string;
  instructions?: string;
  provenance?: string;
  copyright?: string;
  copyrightStatus?: string;
  copyrightOwner?: string[];
  copyrightInfoURL?: string;
  copyrightYear?: number;
  copyrightNotice?: string;
  // Professional Photo Data
  professionalData?: {
    colorProfile?: string;
    colorSpace?: string;
    colorMode?: string;
    bitDepth?: number;
    compression?: string;
    quality?: number;
    format?: string;
    dimensions?: {
      width: number;
      height: number;
      unit?: string;
    };
    resolution?: {
      x: number;
      y: number;
      unit?: string;
    };
    aspectRatio?: number;
    megapixels?: number;
    fileFormat?: string;
    mimeType?: string;
    hasAlpha?: boolean;
    isTransparent?: boolean;
    hasColorProfile?: boolean;
    isSrgb?: boolean;
    hasIccProfile?: boolean;
    iccProfileName?: string;
    iccProfileDescription?: string;
    iccProfileCopyright?: string;
    iccProfileManufacturer?: string;
    iccProfileModel?: string;
    iccProfileVersion?: string;
    iccProfileClass?: string;
    iccProfileColorSpace?: string;
    iccProfileConnectionSpace?: string;
    iccProfileRenderingIntent?: string;
    iccProfileIlluminant?: string;
    iccProfileCreator?: string;
    iccProfileAttributes?: string;
    iccProfileTagCount?: number;
    iccProfileTags?: Record<string, any>;
  };
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
  // Professional Analysis
  analysis?: {
    qualityScore?: number;
    technicalScore?: number;
    compositionScore?: number;
    lightingAnalysis?: {
      isLowLight: boolean;
      isHighDynamicRange: boolean;
      exposureLevel: 'under' | 'normal' | 'over';
      contrastLevel: 'low' | 'medium' | 'high';
    };
    cameraAnalysis?: {
      isProfessional: boolean;
      sensorSize?: string;
      cropFactor?: number;
      effectiveFocalLength?: number;
      depthOfField?: 'shallow' | 'medium' | 'deep';
      motionBlur?: boolean;
      cameraShake?: boolean;
    };
    locationAnalysis?: {
      timeOfDay?: 'dawn' | 'day' | 'dusk' | 'night';
      season?: 'spring' | 'summer' | 'autumn' | 'winter';
      weatherConditions?: string[];
      lightingConditions?: string[];
    };
  };
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
  // Enhanced Filters
  qualityScore?: {
    min: number;
    max: number;
  };
  fileSize?: {
    min: number;
    max: number;
  };
  resolution?: {
    min: number;
    max: number;
  };
  lensType?: string[];
  exposureMode?: string[];
  meteringMode?: string[];
  whiteBalance?: string[];
  flashUsed?: boolean | null;
  hasLocation?: boolean | null;
  fileIntegrity?: 'valid' | 'corrupted' | 'all';
}

export interface ExportFormat {
  id: string;
  name: string;
  extension: string;
  mimeType: string;
}
