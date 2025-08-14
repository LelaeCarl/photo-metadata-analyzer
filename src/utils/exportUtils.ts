import { ImageMetadata, ExportFormat } from '../types/metadata';

export const exportFormats: ExportFormat[] = [
  { id: 'json', name: 'JSON', extension: '.json', mimeType: 'application/json' },
  { id: 'csv', name: 'CSV', extension: '.csv', mimeType: 'text/csv' },
  { id: 'txt', name: 'Text', extension: '.txt', mimeType: 'text/plain' },
];

export const exportToJSON = (metadata: ImageMetadata[]): string => {
  const exportData = metadata.map(img => ({
    fileName: img.basicInfo.fileName,
    fileSize: img.basicInfo.fileSizeFormatted,
    format: img.basicInfo.format,
    dimensions: img.basicInfo.dimensions,
    exif: img.exif,
    iptc: img.iptc,
    xmp: img.xmp,
  }));
  
  return JSON.stringify(exportData, null, 2);
};

export const exportToCSV = (metadata: ImageMetadata[]): string => {
  const headers = [
    'FileName',
    'FileSize',
    'Format',
    'Width',
    'Height',
    'CameraMake',
    'CameraModel',
    'Aperture',
    'ShutterSpeed',
    'ISO',
    'FocalLength',
    'DateTimeOriginal',
    'Latitude',
    'Longitude',
    'Caption',
    'Keywords',
    'Copyright',
    'Creator',
    'Rating',
  ];

  const rows = metadata.map(img => [
    img.basicInfo.fileName,
    img.basicInfo.fileSizeFormatted,
    img.basicInfo.format,
    img.basicInfo.dimensions.width,
    img.basicInfo.dimensions.height,
    img.exif.camera?.make || '',
    img.exif.camera?.model || '',
    img.exif.settings?.aperture || '',
    img.exif.settings?.shutterSpeed || '',
    img.exif.settings?.iso || '',
    img.exif.settings?.focalLength || '',
    img.exif.datetime?.original || '',
    img.exif.gps?.latitude || '',
    img.exif.gps?.longitude || '',
    img.iptc.caption || '',
    (img.iptc.keywords || []).join('; '),
    img.iptc.copyright || '',
    img.iptc.creator || '',
    img.xmp.rating || '',
  ]);

  return [headers.join(','), ...rows.map(row => row.map(cell => `"${cell}"`).join(','))].join('\n');
};

export const exportToTXT = (metadata: ImageMetadata[]): string => {
  return metadata.map(img => {
    const lines = [
      `File: ${img.basicInfo.fileName}`,
      `Size: ${img.basicInfo.fileSizeFormatted}`,
      `Format: ${img.basicInfo.format}`,
      `Dimensions: ${img.basicInfo.dimensions.width} x ${img.basicInfo.dimensions.height}`,
      '',
    ];

    if (img.exif.camera) {
      lines.push(
        'Camera Information:',
        `  Make: ${img.exif.camera.make}`,
        `  Model: ${img.exif.camera.model}`,
        ''
      );
    }

    if (img.exif.settings) {
      lines.push(
        'Camera Settings:',
        `  Aperture: f/${img.exif.settings.aperture}`,
        `  Shutter Speed: ${img.exif.settings.shutterSpeed}`,
        `  ISO: ${img.exif.settings.iso}`,
        `  Focal Length: ${img.exif.settings.focalLength}mm`,
        `  Lens: ${img.exif.settings.lens}`,
        ''
      );
    }

    if (img.exif.datetime?.original) {
      lines.push(
        'Date & Time:',
        `  Original: ${img.exif.datetime.original}`,
        ''
      );
    }

    if (img.exif.gps) {
      lines.push(
        'GPS Coordinates:',
        `  Latitude: ${img.exif.gps.latitude}`,
        `  Longitude: ${img.exif.gps.longitude}`,
        ''
      );
    }

    if (img.iptc.caption) {
      lines.push(
        'IPTC Data:',
        `  Caption: ${img.iptc.caption}`,
        ''
      );
    }

    if (img.iptc.keywords?.length) {
      lines.push(`  Keywords: ${img.iptc.keywords.join(', ')}`);
    }

    if (img.xmp.rating) {
      lines.push(`  Rating: ${img.xmp.rating}/5`);
    }

    lines.push('='.repeat(50));
    return lines.join('\n');
  }).join('\n\n');
};

export const downloadFile = (content: string, filename: string, mimeType: string): void => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const exportMetadata = (
  metadata: ImageMetadata[],
  format: ExportFormat,
  filename?: string
): void => {
  let content: string;
  let defaultFilename: string;

  switch (format.id) {
    case 'json':
      content = exportToJSON(metadata);
      defaultFilename = `metadata_export_${new Date().toISOString().split('T')[0]}.json`;
      break;
    case 'csv':
      content = exportToCSV(metadata);
      defaultFilename = `metadata_export_${new Date().toISOString().split('T')[0]}.csv`;
      break;
    case 'txt':
      content = exportToTXT(metadata);
      defaultFilename = `metadata_export_${new Date().toISOString().split('T')[0]}.txt`;
      break;
    default:
      throw new Error(`Unsupported export format: ${format.id}`);
  }

  downloadFile(content, filename || defaultFilename, format.mimeType);
};
