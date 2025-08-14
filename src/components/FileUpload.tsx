import React, { useCallback, useState } from 'react';
import { Upload, Image, Loader2 } from 'lucide-react';

interface FileUploadProps {
  onFileUpload: (files: FileList) => void;
  isProcessing: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload, isProcessing }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [dragCounter, setDragCounter] = useState(0);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    console.log('Drag enter event');
    e.preventDefault();
    e.stopPropagation();
    setDragCounter(prev => prev + 1);
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    console.log('Drag leave event');
    e.preventDefault();
    e.stopPropagation();
    setDragCounter(prev => prev - 1);
    if (dragCounter === 1) {
      setIsDragOver(false);
    }
  }, [dragCounter]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    console.log('Drop event triggered');
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    setDragCounter(0);

    const files = e.dataTransfer.files;
    console.log('Dropped files:', files.length, 'files');
    if (files.length > 0) {
      onFileUpload(files);
    }
  }, [onFileUpload]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('File select event triggered');
    const files = e.target.files;
    console.log('Selected files:', files?.length, 'files');
    if (files && files.length > 0) {
      onFileUpload(files);
    }
  };

  return (
    <div className="card p-6">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Upload Images
      </h2>

      <div
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
          isDragOver
            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
        }`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {isProcessing ? (
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="w-8 h-8 text-primary-600 dark:text-primary-400 animate-spin" />
            <p className="text-gray-600 dark:text-gray-400">
              Processing images...
            </p>
          </div>
        ) : (
          <>
            <Upload className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
            <div className="space-y-2">
              <p className="text-lg font-medium text-gray-900 dark:text-white">
                {isDragOver ? 'Drop images here' : 'Drag & drop images here'}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                or click to select files
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500">
                Supports JPEG, PNG, HEIC, RAW, and more
              </p>
            </div>

            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileSelect}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              disabled={isProcessing}
            />
          </>
        )}
      </div>

      {!isProcessing && (
        <div className="mt-4 flex items-center justify-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
          <Image className="w-4 h-4" />
          <span>Batch upload supported</span>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
