import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowLeft, Download, Eye, Heart, Clock, Filter, Grid, List } from 'lucide-react';
import MemeCard from './MemeCard';
import FilterBar from './FilterBar';
import DownloadModal from './DownloadModal';
import { memeStore, MemeEntry } from '../utils/memeStore';

interface MemeGridWallProps {
  onNavigateToHome: () => void;
}

const MemeGridWall: React.FC<MemeGridWallProps> = ({ onNavigateToHome }) => {
  const [memes, setMemes] = useState<MemeEntry[]>([]);
  const [filteredMemes, setFilteredMemes] = useState<MemeEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'trending' | 'recent' | 'most-downloaded'>('all');
  const [selectedMeme, setSelectedMeme] = useState<MemeEntry | null>(null);
  const [showDownloadModal, setShowDownloadModal] = useState(false);

  useEffect(() => {
    // Initialize sample data for demo
    memeStore.initializeSampleData();
    
    // Get initial memes
    const allMemes = memeStore.getProcessedMemes();
    setMemes(allMemes);
    setFilteredMemes(allMemes);

    // Subscribe to updates
    const unsubscribe = memeStore.subscribe(() => {
      const updatedMemes = memeStore.getProcessedMemes();
      setMemes(updatedMemes);
      
      // Apply current filter to updated memes
      if (activeFilter === 'all') {
        setFilteredMemes(updatedMemes);
      } else {
        setFilteredMemes(memeStore.getMemesByCategory(activeFilter));
      }
    });

    return unsubscribe;
  }, []);

  // Filter memes based on active filter
  useEffect(() => {
    if (activeFilter === 'all') {
      setFilteredMemes(memes);
    } else {
      setFilteredMemes(memeStore.getMemesByCategory(activeFilter));
    }
  }, [memes, activeFilter]);

  const handleDownload = (meme: MemeEntry) => {
    setSelectedMeme(meme);
    setShowDownloadModal(true);
  };

  const handleFilterChange = (filter: 'all' | 'trending' | 'recent' | 'most-downloaded') => {
    setActiveFilter(filter);
  };

  const handleActualDownload = (meme: MemeEntry) => {
    // Increment download count in store
    memeStore.incrementDownloadCount(meme.id);
    
    // Simulate actual download
    const link = document.createElement('a');
    link.href = meme.videoUrl;
    link.download = `${meme.title.replace(/[^a-zA-Z0-9]/g, '_')}.${meme.format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (memes.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white/90 backdrop-blur-md sticky top-0 z-50 border-b border-gray-200 transition-smooth">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={onNavigateToHome}
                  className="flex items-center space-x-2 text-gray-700 hover:text-purple-600 transition-smooth"
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span className="font-medium">Back to Home</span>
                </button>
                <div className="h-6 w-px bg-gray-300"></div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Meme <span className="text-purple-600">Grid Wall</span>
                </h1>
              </div>
            </div>
          </div>
        </header>

        {/* Empty State */}
        <main className="container mx-auto px-4 py-16">
          <div className="text-center max-w-md mx-auto">
            <div className="bg-white rounded-2xl p-12 shadow-lg">
              <Grid className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-4">No Memes Yet</h2>
              <p className="text-gray-600 mb-6">
                Our content library is being built! Check back soon for fresh memes, or contact the admin to upload content.
              </p>
              <button
                onClick={onNavigateToHome}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-smooth"
              >
                Back to Home
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md sticky top-0 z-50 border-b border-gray-200 transition-smooth">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={onNavigateToHome}
                className="flex items-center space-x-2 text-gray-700 hover:text-purple-600 transition-smooth"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="font-medium">Back to Home</span>
              </button>
              <div className="h-6 w-px bg-gray-300"></div>
              <h1 className="text-2xl font-bold text-gray-900">
                Meme <span className="text-purple-600">Grid Wall</span>
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                {filteredMemes.length} memes loaded
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Filter Bar */}
      <FilterBar activeFilter={activeFilter} onFilterChange={handleFilterChange} />

      {/* Meme Grid */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 auto-rows-max">
          {filteredMemes.map((meme, index) => (
            <MemeCard
              key={meme.id}
              meme={{
                id: meme.id,
                title: meme.title,
                views: meme.viewCount.toLocaleString(),
                likes: Math.floor(meme.viewCount * 0.1).toString(),
                duration: meme.duration,
                thumbnail: meme.thumbnail,
                videoUrl: meme.videoUrl,
                format: meme.format,
                category: meme.category,
                aspectRatio: meme.aspectRatio,
                size: meme.fileSize
              }}
              onDownload={() => handleDownload(meme)}
              animationDelay={index * 0.05}
            />
          ))}
        </div>

        {/* End of content */}
        {filteredMemes.length > 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>You've seen all the memes in this category! Check back later for more content.</p>
          </div>
        )}
      </main>

      {/* Download Modal */}
      {showDownloadModal && selectedMeme && (
        <DownloadModal
          meme={{
            id: selectedMeme.id,
            title: selectedMeme.title,
            views: selectedMeme.viewCount.toLocaleString(),
            likes: Math.floor(selectedMeme.viewCount * 0.1).toString(),
            duration: selectedMeme.duration,
            thumbnail: selectedMeme.thumbnail,
            videoUrl: selectedMeme.videoUrl,
            format: selectedMeme.format,
            category: selectedMeme.category,
            aspectRatio: selectedMeme.aspectRatio,
            size: selectedMeme.fileSize
          }}
          onClose={() => setShowDownloadModal(false)}
          onDownload={() => handleActualDownload(selectedMeme)}
        />
      )}
    </div>
  );
};

export default MemeGridWall;