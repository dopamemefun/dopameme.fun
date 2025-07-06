import React, { useState } from 'react';
import { X, Download, FileVideo, Image, Film } from 'lucide-react';

interface MemeVideo {
  id: string;
  title: string;
  views: string;
  likes: string;
  duration: string;
  thumbnail: string;
  videoUrl: string;
  format: 'mp4' | 'webm' | 'gif';
  category: 'trending' | 'recent' | 'most-downloaded';
  aspectRatio: number;
  size: string;
}

interface DownloadModalProps {
  meme: MemeVideo;
  onClose: () => void;
  onDownload?: () => void;
}

const DownloadModal: React.FC<DownloadModalProps> = ({ meme, onClose, onDownload }) => {
  const [selectedFormat, setSelectedFormat] = useState<'mp4' | 'webm' | 'gif'>('mp4');
  const [selectedQuality, setSelectedQuality] = useState<'720p' | '1080p' | 'original'>('1080p');
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);

  const formatOptions = [
    { value: 'mp4' as const, label: 'MP4', icon: FileVideo, description: 'Best compatibility' },
    { value: 'webm' as const, label: 'WebM', icon: Film, description: 'Smaller file size' },
    { value: 'gif' as const, label: 'GIF', icon: Image, description: 'Universal support' }
  ];

  const qualityOptions = [
    { value: '720p' as const, label: '720p HD', size: '2.1MB' },
    { value: '1080p' as const, label: '1080p Full HD', size: '4.8MB' },
    { value: 'original' as const, label: 'Original Quality', size: meme.size }
  ];

  const handleDownload = async () => {
    setIsDownloading(true);
    setDownloadProgress(0);

    // Simulate download progress
    const interval = setInterval(() => {
      setDownloadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsDownloading(false);
          
          // Call the onDownload callback to update download count
          if (onDownload) {
            onDownload();
          }
          
          // Simulate actual download
          const link = document.createElement('a');
          link.href = meme.videoUrl;
          link.download = `${meme.title.replace(/[^a-zA-Z0-9]/g, '_')}.${selectedFormat}`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          
          onClose();
          return 100;
        }
        return prev + Math.random() * 15 + 5;
      });
    }, 200);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 modal-backdrop show">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto modal-content show">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Download Meme</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-smooth"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Preview */}
          <div className="relative">
            <img
              src={meme.thumbnail}
              alt={meme.title}
              className="w-full h-48 object-cover rounded-lg"
            />
            <div className="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
              {meme.duration}
            </div>
          </div>

          {/* Title */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">{meme.title}</h3>
            <p className="text-sm text-gray-600">{meme.views} views • {meme.likes} likes</p>
          </div>

          {/* Format Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Choose Format
            </label>
            <div className="grid grid-cols-3 gap-2">
              {formatOptions.map((format) => {
                const Icon = format.icon;
                return (
                  <button
                    key={format.value}
                    onClick={() => setSelectedFormat(format.value)}
                    className={`p-3 rounded-lg border-2 transition-smooth text-center ${
                      selectedFormat === format.value
                        ? 'border-purple-600 bg-purple-50 text-purple-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-5 h-5 mx-auto mb-1" />
                    <div className="text-sm font-medium">{format.label}</div>
                    <div className="text-xs text-gray-500">{format.description}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quality Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Choose Quality
            </label>
            <div className="space-y-2">
              {qualityOptions.map((quality) => (
                <button
                  key={quality.value}
                  onClick={() => setSelectedQuality(quality.value)}
                  className={`w-full p-3 rounded-lg border-2 transition-smooth text-left ${
                    selectedQuality === quality.value
                      ? 'border-purple-600 bg-purple-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{quality.label}</span>
                    <span className="text-sm text-gray-500">{quality.size}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Download Progress */}
          {isDownloading && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Downloading...</span>
                <span>{Math.round(downloadProgress)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full transition-smooth"
                  style={{ width: `${downloadProgress}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Download Button */}
          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className={`w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-medium transition-smooth flex items-center justify-center space-x-2 ${
              isDownloading ? 'opacity-50 cursor-not-allowed' : 'hover:from-purple-700 hover:to-pink-700'
            }`}
          >
            {isDownloading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Downloading...</span>
              </>
            ) : (
              <>
                <Download className="w-5 h-5" />
                <span>Download {selectedFormat.toUpperCase()} ({selectedQuality})</span>
              </>
            )}
          </button>

          {/* Info */}
          <div className="text-xs text-gray-500 text-center">
            By downloading, you agree to our terms of service. This content is for personal use only.
          </div>
        </div>
      </div>
    </div>
  );
};

export default DownloadModal;