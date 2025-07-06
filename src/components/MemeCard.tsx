import React, { useState, useRef } from 'react';
import { Download, Eye, Heart, Clock, Play } from 'lucide-react';

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

interface MemeCardProps {
  meme: MemeVideo;
  onDownload: (meme: MemeVideo) => void;
  animationDelay: number;
}

const MemeCard: React.FC<MemeCardProps> = ({ meme, onDownload, animationDelay }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (videoRef.current && meme.format !== 'gif') {
      videoRef.current.play().catch(() => {
        // Handle play error silently
      });
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (videoRef.current && meme.format !== 'gif') {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLoading(true);
    
    // Simulate download delay
    setTimeout(() => {
      setIsLoading(false);
      onDownload(meme);
    }, 500);
  };

  const getCategoryBadge = () => {
    switch (meme.category) {
      case 'trending':
        return (
          <div className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
            🔥 Trending
          </div>
        );
      case 'recent':
        return (
          <div className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
            ✨ New
          </div>
        );
      case 'most-downloaded':
        return (
          <div className="bg-purple-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
            ⭐ Popular
          </div>
        );
      default:
        return null;
    }
  };

  const cardHeight = meme.aspectRatio < 1 ? 'h-80' : meme.aspectRatio > 1.2 ? 'h-48' : 'h-64';

  return (
    <div
      className={`relative bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-smooth group cursor-pointer hover-lift animate-fade-in-up ${cardHeight}`}
      style={{ animationDelay: `${animationDelay}s` }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Video/Image Container */}
      <div className="relative w-full h-full overflow-hidden">
        {/* Thumbnail */}
        <img
          src={meme.thumbnail}
          alt={meme.title}
          className={`w-full h-full object-cover transition-smooth ${isHovered ? 'opacity-0' : 'opacity-100'}`}
          loading="lazy"
        />

        {/* Video (for hover preview) */}
        {meme.format !== 'gif' && (
          <video
            ref={videoRef}
            className={`absolute inset-0 w-full h-full object-cover transition-smooth ${isHovered ? 'opacity-100' : 'opacity-0'}`}
            muted
            loop
            playsInline
            preload="none"
          >
            <source src={meme.videoUrl} type={`video/${meme.format}`} />
          </video>
        )}

        {/* Play button overlay */}
        <div className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-smooth ${isHovered ? 'opacity-0' : 'opacity-100'}`}>
          <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
            <Play className="w-6 h-6 text-white" />
          </div>
        </div>

        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          {getCategoryBadge()}
        </div>

        {/* Duration */}
        <div className="absolute top-3 right-3 bg-black/70 text-white px-2 py-1 rounded text-xs font-medium">
          {meme.duration}
        </div>

        {/* Download Button */}
        <button
          onClick={handleDownload}
          disabled={isLoading}
          className={`absolute bottom-3 right-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white p-2 rounded-full hover:from-purple-700 hover:to-pink-700 transition-smooth transform hover:scale-110 shadow-lg ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isLoading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          ) : (
            <Download className="w-4 h-4" />
          )}
        </button>

        {/* Gradient Overlay for Text */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent h-24"></div>

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <h3 className="text-white font-semibold text-sm mb-2 line-clamp-2 transition-smooth">
            {meme.title}
          </h3>
          
          <div className="flex items-center justify-between text-xs text-white/80">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1">
                <Eye className="w-3 h-3" />
                <span>{meme.views}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Heart className="w-3 h-3" />
                <span>{meme.likes}</span>
              </div>
            </div>
            <div className="text-xs text-white/60">
              {meme.format.toUpperCase()} • {meme.size}
            </div>
          </div>
        </div>
      </div>

      {/* Hover Effects */}
      <div className={`absolute inset-0 bg-gradient-to-t from-purple-600/20 to-transparent transition-smooth ${isHovered ? 'opacity-100' : 'opacity-0'}`}></div>
    </div>
  );
};

export default MemeCard;