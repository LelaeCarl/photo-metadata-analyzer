import { ImageMetadata } from '../types/metadata';

/**
 * Professional camera database
 */
const PROFESSIONAL_CAMERAS: Record<string, string[]> = {
  'Canon': ['EOS R5', 'EOS R6', 'EOS 5D Mark IV', 'EOS 1D X Mark III'],
  'Nikon': ['Z9', 'Z8', 'D850', 'D6', 'Z7 II'],
  'Sony': ['A1', 'A7R V', 'A7S III', 'A9 II', 'A7 IV'],
  'Fujifilm': ['GFX 100S', 'X-T4', 'X-Pro3', 'X100V'],
  'Leica': ['M11', 'Q3', 'SL3', 'M10-R']
};

/**
 * Calculate quality score
 */
export function calculateQualityScore(metadata: ImageMetadata): number {
  let score = 0;
  const maxScore = 100;

  // Resolution quality (0-25 points)
  const megapixels = (metadata.basicInfo.dimensions.width * metadata.basicInfo.dimensions.height) / 1000000;
  if (megapixels >= 50) score += 25;
  else if (megapixels >= 24) score += 20;
  else if (megapixels >= 12) score += 15;
  else if (megapixels >= 6) score += 10;
  else score += 5;

  // Camera quality (0-25 points)
  if (metadata.exif.camera) {
    const make = metadata.exif.camera.make;
    const model = metadata.exif.camera.model;
    
    if (PROFESSIONAL_CAMERAS[make]?.includes(model)) {
      score += 25;
    } else if (PROFESSIONAL_CAMERAS[make]) {
      score += 15;
    } else if (make) {
      score += 10;
    }
  }

  // Technical settings (0-30 points)
  if (metadata.exif.settings) {
    const { iso, aperture } = metadata.exif.settings;
    
    // ISO quality
    if (iso <= 100) score += 15;
    else if (iso <= 400) score += 12;
    else if (iso <= 1600) score += 8;
    else if (iso <= 6400) score += 4;
    
    // Aperture quality
    if (aperture <= 2.8) score += 15;
    else if (aperture <= 5.6) score += 10;
    else if (aperture <= 11) score += 5;
  }

  // File integrity (0-20 points)
  if (metadata.basicInfo.fileIntegrity && !metadata.basicInfo.fileIntegrity.isCorrupted) {
    score += 20;
  }

  return Math.min(score, maxScore);
}

/**
 * Calculate technical score
 */
export function calculateTechnicalScore(metadata: ImageMetadata): number {
  let score = 0;
  const maxScore = 100;

  if (!metadata.exif.settings) return 0;

  const { iso, aperture, shutterSpeed } = metadata.exif.settings;

  // ISO performance (0-40 points)
  if (iso <= 100) score += 40;
  else if (iso <= 400) score += 35;
  else if (iso <= 1600) score += 25;
  else if (iso <= 6400) score += 15;
  else score += 5;

  // Aperture control (0-30 points)
  if (aperture <= 2.8) score += 30;
  else if (aperture <= 5.6) score += 20;
  else if (aperture <= 11) score += 10;

  // Shutter speed control (0-30 points)
  const shutterSpeedNum = parseFloat(shutterSpeed.replace(/[^\d.]/g, ''));
  if (shutterSpeedNum >= 1/1000) score += 30;
  else if (shutterSpeedNum >= 1/250) score += 20;
  else if (shutterSpeedNum >= 1/60) score += 10;

  return Math.min(score, maxScore);
}

/**
 * Analyze lighting conditions
 */
export function analyzeLighting(metadata: ImageMetadata): ImageMetadata['analysis']['lightingAnalysis'] {
  const { exif } = metadata;
  
  if (!exif.settings) {
    return {
      isLowLight: false,
      isHighDynamicRange: false,
      exposureLevel: 'normal',
      contrastLevel: 'medium'
    };
  }

  const { iso, aperture, shutterSpeed } = exif.settings;
  
  // Determine if low light
  const shutterSpeedNum = parseFloat(shutterSpeed.replace(/[^\d.]/g, ''));
  const isLowLight = iso > 800 || shutterSpeedNum < 1/60;
  
  // Determine exposure level
  let exposureLevel: 'under' | 'normal' | 'over' = 'normal';
  if (iso > 3200 || shutterSpeedNum < 1/30) exposureLevel = 'under';
  else if (iso < 100 || shutterSpeedNum > 1/1000) exposureLevel = 'over';
  
  // Determine contrast level
  let contrastLevel: 'low' | 'medium' | 'high' = 'medium';
  if (aperture <= 2.8) contrastLevel = 'high';
  else if (aperture >= 8.0) contrastLevel = 'low';
  
  // Determine if high dynamic range
  const isHighDynamicRange = iso > 1600 && aperture <= 4.0;

  return {
    isLowLight,
    isHighDynamicRange,
    exposureLevel,
    contrastLevel
  };
}

/**
 * Analyze camera characteristics
 */
export function analyzeCamera(metadata: ImageMetadata): ImageMetadata['analysis']['cameraAnalysis'] {
  const { exif } = metadata;
  
  if (!exif.camera || !exif.settings) {
    return {
      isProfessional: false,
      depthOfField: 'medium',
      motionBlur: false,
      cameraShake: false
    };
  }

  const { make, model } = exif.camera;
  const { aperture, shutterSpeed, focalLength } = exif.settings;
  
  // Determine if professional camera
  const isProfessional = PROFESSIONAL_CAMERAS[make]?.includes(model) || false;
  
  // Determine depth of field
  let depthOfField: 'shallow' | 'medium' | 'deep' = 'medium';
  if (aperture <= 2.8) depthOfField = 'shallow';
  else if (aperture >= 8.0) depthOfField = 'deep';
  
  // Determine motion blur
  const shutterSpeedNum = parseFloat(shutterSpeed.replace(/[^\d.]/g, ''));
  const motionBlur = shutterSpeedNum < 1/focalLength;
  
  // Determine camera shake
  const cameraShake = shutterSpeedNum < 1/(focalLength * 2);

  return {
    isProfessional,
    depthOfField,
    motionBlur,
    cameraShake
  };
}

/**
 * Perform comprehensive photo analysis
 */
export function performPhotoAnalysis(metadata: ImageMetadata): ImageMetadata['analysis'] {
  const qualityScore = calculateQualityScore(metadata);
  const technicalScore = calculateTechnicalScore(metadata);
  const compositionScore = Math.round((qualityScore + technicalScore) / 2);
  
  const lightingAnalysis = analyzeLighting(metadata);
  const cameraAnalysis = analyzeCamera(metadata);

  return {
    qualityScore,
    technicalScore,
    compositionScore,
    lightingAnalysis,
    cameraAnalysis
  };
}
