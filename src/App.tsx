import { useState, useEffect } from 'react';
import { ImageMetadata, FilterOptions } from './types/metadata';
import { extractAllMetadata, generatePreview } from './utils/metadataExtractor';
import { filterMetadata } from './utils/filterUtils';
import Header from './components/Header';
import FileUpload from './components/FileUpload';
import MetadataGrid from './components/MetadataGrid';
import FilterPanel from './components/FilterPanel';
import StatsPanel from './components/StatsPanel';
import ExportPanel from './components/ExportPanel';

function App() {
  const [metadata, setMetadata] = useState<ImageMetadata[]>([]);
  const [filteredMetadata, setFilteredMetadata] = useState<ImageMetadata[]>([]);
  const [filters, setFilters] = useState<FilterOptions>({
    category: [],
    dateRange: { start: null, end: null },
    cameraModel: [],
    hasGps: null,
    hasExif: null,
  });
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Dark mode toggle
  useEffect(() => {
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode) {
      setIsDarkMode(savedMode === 'true');
    } else {
      setIsDarkMode(window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', isDarkMode.toString());
  }, [isDarkMode]);

  // Apply filters when metadata or filters change
  useEffect(() => {
    setFilteredMetadata(filterMetadata(metadata, filters));
  }, [metadata, filters]);

  const handleFileUpload = async (files: FileList) => {
    console.log('File upload started with', files.length, 'files');
    setIsProcessing(true);
    const newMetadata: ImageMetadata[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      console.log('Processing file:', file.name, file.type, file.size);
      
      // Check if file is an image
      if (!file.type.startsWith('image/')) {
        console.log('Skipping non-image file:', file.name);
        continue;
      }

      const id = `${file.name}-${Date.now()}-${i}`;
      console.log('Creating entry with ID:', id);
      
      // Add pending entry
      const pendingEntry: ImageMetadata = {
        id,
        file,
        preview: '',
        basicInfo: {
          fileName: file.name,
          fileSize: file.size,
          fileSizeFormatted: '0 Bytes',
          format: file.type,
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
        },
        exif: {},
        iptc: {},
        xmp: {},
        processingStatus: 'pending',
      };

      newMetadata.push(pendingEntry);
    }

    console.log('Adding', newMetadata.length, 'entries to metadata');
    setMetadata(prev => [...prev, ...newMetadata]);

    // Process each file
    for (let i = 0; i < newMetadata.length; i++) {
      const entry = newMetadata[i];
      console.log('Processing entry:', entry.id);
      
      try {
        // Update status to processing
        setMetadata(prev => 
          prev.map(item => 
            item.id === entry.id 
              ? { ...item, processingStatus: 'processing' }
              : item
          )
        );

        console.log('Extracting metadata for:', entry.file.name);
        // Extract metadata and generate preview
        const [extractedData, preview] = await Promise.all([
          extractAllMetadata(entry.file),
          generatePreview(entry.file),
        ]);

        console.log('Metadata extracted successfully:', extractedData);

        // Update with extracted data
        setMetadata(prev => 
          prev.map(item => 
            item.id === entry.id 
              ? { 
                  ...item, 
                  ...extractedData,
                  preview,
                  processingStatus: 'completed' 
                }
              : item
          )
        );
      } catch (error) {
        console.error(`Error processing ${entry.file.name}:`, error);
        setMetadata(prev => 
          prev.map(item => 
            item.id === entry.id 
              ? { 
                  ...item, 
                  processingStatus: 'error',
                  error: error instanceof Error ? error.message : 'Unknown error'
                }
              : item
          )
        );
      }
    }

    console.log('File upload processing completed');
    setIsProcessing(false);
  };

  const handleRemoveImage = (id: string) => {
    setMetadata(prev => prev.filter(item => item.id !== id));
  };

  const handleClearAll = () => {
    setMetadata([]);
    setFilters({
      category: [],
      dateRange: { start: null, end: null },
      cameraModel: [],
      hasGps: null,
      hasExif: null,
    });
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <Header 
        isDarkMode={isDarkMode}
        onToggleDarkMode={toggleDarkMode}
      />
      
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <FileUpload 
              onFileUpload={handleFileUpload}
              isProcessing={isProcessing}
            />
            
            <StatsPanel metadata={filteredMetadata} />
            
            <FilterPanel 
              filters={filters}
              onFiltersChange={setFilters}
              metadata={metadata}
            />
            
            <ExportPanel 
              metadata={filteredMetadata}
              onClearAll={handleClearAll}
            />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <MetadataGrid 
              metadata={filteredMetadata}
              onRemoveImage={handleRemoveImage}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
