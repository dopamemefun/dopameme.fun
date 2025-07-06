import React, { useState, useRef, useCallback } from 'react';
import { Upload, FileVideo, CheckCircle, AlertCircle, X, Clock, HardDrive } from 'lucide-react';
import { MemeEntry } from '../utils/memeStore';

interface FileUploadProps {
  onFileProcessed: (file: Omit<MemeEntry, 'id' | 'downloadCount'>) => void;
  onFileError: (filename: string, error: string) => void;
}

interface UploadingFile {
  id: string;
  file: File;
  progress: number;
  status: 'uploading' | 'processing' | 'completed' | 'error';
  error?: string;
  processedData?: any;
}

const FileUploader: React.FC<FileUploadProps> = ({ onFileProcessed, onFileError }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFilename = (filename: string): string => {
    // Remove extension
    const nameWithoutExt = filename.replace(/\.[^/.]+$/, '');
    
    // Remove special characters and underscores, replace with spaces
    const cleaned = nameWithoutExt.replace(/[_\-\.]/g, ' ');
    
    // Convert to proper case
    return cleaned.replace(/\w\S*/g, (txt) => 
      txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );
  };

  const validateFile = (file: File): string | null => {
    if (file.type !== 'video/mp4') {
      return 'Only MP4 files are allowed';
    }
    if (file.size > 100 * 1024 * 1024) { // 100MB limit
      return 'File size must be less than 100MB';
    }
    return null;
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const generateThumbnail = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const video = document.createElement('video');
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      video.onloadedmetadata = () => {
        canvas.width = 320;
        canvas.height = 180;
        video.currentTime = 1; // Capture frame at 1 second
      };
      
      video.onseeked = () => {
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL('image/jpeg', 0.8));
        }
      };
      
      video.src = URL.createObjectURL(file);
    });
  };

  const getVideoDuration = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const video = document.createElement('video');
      video.onloadedmetadata = () => {
        const duration = video.duration;
        const minutes = Math.floor(duration / 60);
        const seconds = Math.floor(duration % 60);
        resolve(`${minutes}:${seconds.toString().padStart(2, '0')}`);
      };
      video.src = URL.createObjectURL(file);
    });
  };

  const getVideoAspectRatio = (file: File): Promise<number> => {
    return new Promise((resolve) => {
      const video = document.createElement('video');
      video.onloadedmetadata = () => {
        resolve(video.videoWidth / video.videoHeight);
      };
      video.src = URL.createObjectURL(file);
    });
  };

  const processFile = async (uploadingFile: UploadingFile) => {
    try {
      setUploadingFiles(prev => prev.map(f => 
        f.id === uploadingFile.id 
          ? { ...f, status: 'processing', progress: 50 }
          : f
      ));

      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      const thumbnail = await generateThumbnail(uploadingFile.file);
      const duration = await getVideoDuration(uploadingFile.file);
      const aspectRatio = await getVideoAspectRatio(uploadingFile.file);

      const processedData: Omit<MemeEntry, 'id' | 'downloadCount'> = {
        title: processFilename(uploadingFile.file.name),
        originalFilename: uploadingFile.file.name,
        uploadDate: new Date().toISOString(),
        fileSize: formatFileSize(uploadingFile.file.size),
        duration,
        tags: [],
        viewCount: 0,
        trendingScore: Math.floor(Math.random() * 100),
        status: 'processed',
        thumbnail,
        videoUrl: URL.createObjectURL(uploadingFile.file), // In real app, this would be uploaded to storage
        format: 'mp4',
        category: 'recent',
        aspectRatio
      };

      setUploadingFiles(prev => prev.map(f => 
        f.id === uploadingFile.id 
          ? { ...f, status: 'completed', progress: 100, processedData }
          : f
      ));

      onFileProcessed(processedData);

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Processing failed';
      
      setUploadingFiles(prev => prev.map(f => 
        f.id === uploadingFile.id 
          ? { ...f, status: 'error', error: errorMessage }
          : f
      ));

      onFileError(uploadingFile.file.name, errorMessage);
    }
  };

  const handleFiles = useCallback(async (files: FileList) => {
    const validFiles: File[] = [];
    
    Array.from(files).forEach(file => {
      const error = validateFile(file);
      if (error) {
        onFileError(file.name, error);
      } else {
        validFiles.push(file);
      }
    });

    if (validFiles.length === 0) return;

    const newUploadingFiles: UploadingFile[] = validFiles.map(file => ({
      id: `upload-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      file,
      progress: 0,
      status: 'uploading'
    }));

    setUploadingFiles(prev => [...prev, ...newUploadingFiles]);

    // Simulate upload progress and then process
    for (const uploadingFile of newUploadingFiles) {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadingFiles(prev => prev.map(f => 
          f.id === uploadingFile.id && f.progress < 40
            ? { ...f, progress: f.progress + 10 }
            : f
        ));
      }, 200);

      setTimeout(() => {
        clearInterval(progressInterval);
        processFile(uploadingFile);
      }, 1000);
    }
  }, [onFileError, onFileProcessed]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  const removeFile = (id: string) => {
    setUploadingFiles(prev => prev.filter(f => f.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">File Upload</h2>
        
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`border-2 border-dashed rounded-xl p-12 text-center transition-smooth cursor-pointer ${
            isDragOver
              ? 'border-purple-500 bg-purple-50'
              : 'border-gray-300 hover:border-purple-400 hover:bg-gray-50'
          }`}
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className={`w-16 h-16 mx-auto mb-4 ${isDragOver ? 'text-purple-500' : 'text-gray-400'}`} />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {isDragOver ? 'Drop files here' : 'Upload MP4 Files'}
          </h3>
          <p className="text-gray-600 mb-4">
            Drag and drop your .mp4 files here, or click to browse
          </p>
          <div className="text-sm text-gray-500">
            <p>• Only MP4 format supported</p>
            <p>• Maximum file size: 100MB</p>
            <p>• Multiple files allowed</p>
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept=".mp4,video/mp4"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {/* Upload Progress */}
      {uploadingFiles.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Upload Progress</h3>
          <div className="space-y-4">
            {uploadingFiles.map(file => (
              <div key={file.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <FileVideo className="w-5 h-5 text-purple-600" />
                    <span className="font-medium text-gray-900">{file.file.name}</span>
                    <span className="text-sm text-gray-500">
                      ({formatFileSize(file.file.size)})
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {file.status === 'completed' && (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    )}
                    {file.status === 'error' && (
                      <AlertCircle className="w-5 h-5 text-red-600" />
                    )}
                    {file.status === 'processing' && (
                      <Clock className="w-5 h-5 text-blue-600" />
                    )}
                    <button
                      onClick={() => removeFile(file.id)}
                      className="text-gray-400 hover:text-red-600 transition-smooth"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {file.status !== 'error' && (
                  <div className="mb-2">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>
                        {file.status === 'uploading' && 'Uploading...'}
                        {file.status === 'processing' && 'Processing...'}
                        {file.status === 'completed' && 'Completed'}
                      </span>
                      <span>{file.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-smooth ${
                          file.status === 'completed'
                            ? 'bg-green-600'
                            : file.status === 'processing'
                            ? 'bg-blue-600'
                            : 'bg-purple-600'
                        }`}
                        style={{ width: `${file.progress}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {file.error && (
                  <div className="text-red-600 text-sm mt-2">
                    Error: {file.error}
                  </div>
                )}

                {file.processedData && (
                  <div className="mt-3 p-3 bg-green-50 rounded-lg">
                    <div className="text-sm text-green-800">
                      <p><strong>Processed Title:</strong> {file.processedData.title}</p>
                      <p><strong>Duration:</strong> {file.processedData.duration}</p>
                      <p><strong>Upload Date:</strong> {new Date(file.processedData.uploadDate).toLocaleString()}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUploader;