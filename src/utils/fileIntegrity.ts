import { BasicInfo } from '../types/metadata';

// Crypto API for hash generation
const crypto = window.crypto;

/**
 * Generate MD5 hash of a file
 */
export async function generateMD5Hash(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest('MD5', buffer);
  return Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Generate SHA-256 hash of a file
 */
export async function generateSHA256Hash(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
  return Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Generate CRC32 hash of a file
 */
export async function generateCRC32Hash(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  let crc = 0xFFFFFFFF;
  
  for (let i = 0; i < bytes.length; i++) {
    crc = crc ^ bytes[i];
    for (let j = 0; j < 8; j++) {
      crc = (crc & 1) ? (0xEDB88320 ^ (crc >>> 1)) : (crc >>> 1);
    }
  }
  
  return (crc ^ 0xFFFFFFFF).toString(16).padStart(8, '0');
}

/**
 * Check if file has executable code
 */
export async function checkForExecutableCode(file: File): Promise<boolean> {
  const buffer = await file.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  
  // Check for common executable signatures
  const signatures = [
    [0x4D, 0x5A], // MZ (DOS/Windows executable)
    [0x7F, 0x45, 0x4C, 0x46], // ELF (Linux executable)
    [0xFE, 0xED, 0xFA, 0xCE], // Mach-O (macOS executable)
    [0xFE, 0xED, 0xFA, 0xCF], // Mach-O (macOS executable, reverse endian)
    [0xCF, 0xFA, 0xED, 0xFE], // Mach-O (macOS executable, 64-bit)
    [0xCE, 0xFA, 0xED, 0xFE], // Mach-O (macOS executable, 64-bit, reverse endian)
  ];
  
  for (const signature of signatures) {
    if (bytes.length >= signature.length) {
      let match = true;
      for (let i = 0; i < signature.length; i++) {
        if (bytes[i] !== signature[i]) {
          match = false;
          break;
        }
      }
      if (match) return true;
    }
  }
  
  return false;
}

/**
 * Check for suspicious headers in image files
 */
export async function checkForSuspiciousHeaders(file: File): Promise<boolean> {
  const buffer = await file.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  
  // Check for valid image signatures
  const imageSignatures = [
    [0xFF, 0xD8, 0xFF], // JPEG
    [0x89, 0x50, 0x4E, 0x47], // PNG
    [0x47, 0x49, 0x46], // GIF
    [0x42, 0x4D], // BMP
    [0x49, 0x49, 0x2A, 0x00], // TIFF (little endian)
    [0x4D, 0x4D, 0x00, 0x2A], // TIFF (big endian)
    [0x52, 0x49, 0x46, 0x46], // WebP
  ];
  
  let hasValidSignature = false;
  for (const signature of imageSignatures) {
    if (bytes.length >= signature.length) {
      let match = true;
      for (let i = 0; i < signature.length; i++) {
        if (bytes[i] !== signature[i]) {
          match = false;
          break;
        }
      }
      if (match) {
        hasValidSignature = true;
        break;
      }
    }
  }
  
  // Check for suspicious patterns
  const suspiciousPatterns = [
    [0x3C, 0x68, 0x74, 0x6D, 0x6C], // HTML
    [0x3C, 0x3F, 0x78, 0x6D, 0x6C], // XML
    [0x50, 0x4B, 0x03, 0x04], // ZIP
    [0x50, 0x4B, 0x05, 0x06], // ZIP
    [0x50, 0x4B, 0x07, 0x08], // ZIP
  ];
  
  for (const pattern of suspiciousPatterns) {
    if (bytes.length >= pattern.length) {
      let match = true;
      for (let i = 0; i < pattern.length; i++) {
        if (bytes[i] !== pattern[i]) {
          match = false;
          break;
        }
      }
      if (match) return true;
    }
  }
  
  return !hasValidSignature;
}

/**
 * Validate file format
 */
export function validateFileFormat(file: File): boolean {
  const validTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/bmp',
    'image/tiff',
    'image/webp',
    'image/heic',
    'image/heif',
    'image/raw',
    'image/cr2',
    'image/nef',
    'image/arw',
    'image/dng',
  ];
  
    return validTypes.includes(file.type.toLowerCase()) ||
         !!(file.name.toLowerCase().match(/\.(jpg|jpeg|png|gif|bmp|tiff|webp|heic|heif|raw|cr2|nef|arw|dng)$/));
}

/**
 * Check if file is corrupted
 */
export async function checkFileCorruption(file: File): Promise<boolean> {
  try {
    // Try to create an image object
    const url = URL.createObjectURL(file);
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        URL.revokeObjectURL(url);
        resolve(false); // Not corrupted
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        resolve(true); // Corrupted
      };
      img.src = url;
    });
  } catch (error) {
    return true; // Corrupted
  }
}

/**
 * Perform comprehensive file integrity check
 */
export async function performFileIntegrityCheck(file: File): Promise<BasicInfo['fileIntegrity']> {
  const [
    md5Hash,
    sha256Hash,
    crc32Hash,
    hasExecutableCode,
    hasSuspiciousHeaders,
    isValidFormat,
    isCorrupted
  ] = await Promise.all([
    generateMD5Hash(file),
    generateSHA256Hash(file),
    generateCRC32Hash(file),
    checkForExecutableCode(file),
    checkForSuspiciousHeaders(file),
    Promise.resolve(validateFileFormat(file)),
    checkFileCorruption(file)
  ]);

  return {
    md5Hash,
    sha256Hash,
    crc32Hash,
    isCorrupted,
    securityChecks: {
      hasExecutableCode,
      hasSuspiciousHeaders,
      isValidFormat
    }
  };
}
