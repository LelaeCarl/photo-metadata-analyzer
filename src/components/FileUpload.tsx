import React, { useCallback, useState } from 'react';
import { Upload, Loader2, Camera, Image as ImageIcon } from 'lucide-react';

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

  const handleDrop = useCallback((e: React.DragEvent) => {
    console.log('Drop event triggered');
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    setDragCounter(0);
    
    const files = e.dataTransfer.files;
    console.log('Dropped files:', files.length, 'files');
    
    if (files.length > 0) {
      console.log('Calling onFileUpload with files');
      onFileUpload(files);
    }
  }, [onFileUpload]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('File select event triggered');
    const files = e.target.files;
    console.log('Selected files:', files?.length, 'files');
    
    if (files && files.length > 0) {
      console.log('Calling onFileUpload with selected files');
      onFileUpload(files);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="p-5">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-slate-100 dark:bg-gray-700 rounded-lg">
            <Camera className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Upload Images
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Analyze metadata from your photos
            </p>
          </div>
        </div>
        
        <div
          className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200 ${
            isDragOver
              ? 'border-slate-400 bg-slate-50 dark:bg-gray-700/50'
              : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700/30'
          }`}
          onDragEnter={handleDragEnter}
          onDragOver={(e) => e.preventDefault()}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {isProcessing ? (
            <div className="flex flex-col items-center space-y-3">
              <div className="relative">
                <Loader2 className="w-8 h-8 text-slate-600 dark:text-slate-400 animate-spin" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                  Processing Images
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Extracting metadata and analyzing your photos...
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-4">
                <div className="w-12 h-12 mx-auto bg-slate-100 dark:bg-gray-700 rounded-xl flex items-center justify-center">
                  <Upload className="w-6 h-6 text-slate-600 dark:text-slate-400" />
                </div>
              </div>
              
              <div className="space-y-3">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                    {isDragOver ? 'Drop your images here' : 'Drag & drop images here'}
                  </h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    or{' '}
                    <label className="text-slate-600 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300 cursor-pointer font-medium transition-colors duration-200">
                      browse files
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                    </label>
                  </p>
                </div>
                
                <div className="flex items-center justify-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                  <div className="flex items-center space-x-1">
                    <ImageIcon className="w-3 h-3" />
                    <span>JPEG</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <ImageIcon className="w-3 h-3" />
                    <span>PNG</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <ImageIcon className="w-3 h-3" />
                    <span>RAW</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
        
        {/* Features */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="flex items-center space-x-2 text-xs text-gray-600 dark:text-gray-400">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
            <span>Batch upload</span>
          </div>
          <div className="flex items-center space-x-2 text-xs text-gray-600 dark:text-gray-400">
            <div className="w-1.5 h-1.5 bg-slate-500 rounded-full"></div>
            <span>Privacy focused</span>
          </div>
          <div className="flex items-center space-x-2 text-xs text-gray-600 dark:text-gray-400">
            <div className="w-1.5 h-1.5 bg-slate-500 rounded-full"></div>
            <span>Advanced analysis</span>
          </div>
          <div className="flex items-center space-x-2 text-xs text-gray-600 dark:text-gray-400">
            <div className="w-1.5 h-1.5 bg-slate-500 rounded-full"></div>
            <span>Real-time processing</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
