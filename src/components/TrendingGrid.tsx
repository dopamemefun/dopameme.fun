import React, { useState, useEffect } from 'react';
import { Play, Download, Eye, TrendingUp, Flame } from 'lucide-react';
import { memeStore, MemeEntry } from '../utils/memeStore';

const TrendingGrid: React.FC = () => {
  const [trendingMemes, setTrendingMemes] = useState<MemeEntry[]>([]);

  useEffect(() => {
    // Initialize sample data for demo
    memeStore.initializeSampleData();
    
    // Get initial trending memes
    setTrendingMemes(memeStore.getTrendingMemes());

    // Subscribe to updates
    const unsubscribe = memeStore.subscribe(() => {
      setTrendingMemes(memeStore.getTrendingMemes());
    });

    return unsubscribe;
  }, []);

  const handleDownload = (meme: MemeEntry) => {
    // Increment download count
    memeStore.incrementDownloadCount(meme.id);
    
    // Simulate download
    const link = document.createElement('a');
    link.href = meme.videoUrl;
    link.download = `${meme.title.replace(/[^a-zA-Z0-9]/g, '_')}.${meme.format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleView = (meme: MemeEntry) => {
    memeStore.incrementViewCount(meme.id);
  };

  if (trendingMemes.length === 0) {
    return (
      <section id="trending" className="py-20 bg-gray-50 page-transition">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-fade-in-up">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Trending Memes
              <span className="text-purple-600"> Right Now</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              No memes have been uploaded yet. Check back soon for fresh content!
            </p>
          </div>
          <div className="text-center">
            <div className="bg-white rounded-2xl p-12 shadow-lg max-w-md mx-auto">
              <TrendingUp className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Coming Soon</h3>
              <p className="text-gray-600">
                Our content team is working hard to bring you the best memes. 
                New uploads will appear here automatically!
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="trending" className="py-20 bg-gray-50 page-transition">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-fade-in-up">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Trending Memes
            <span className="text-purple-600"> Right Now</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            These are the most downloaded memes from our curated collection. Fresh content updated daily!
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {trendingMemes.slice(0, 6).map((meme, index) => (
            <div
              key={meme.id}
              className={`relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-smooth group cursor-pointer hover-lift animate-fade-in-up`}
              style={{ animationDelay: `${index * 0.1}s` }}
              onClick={() => handleView(meme)}
            >
              <div className="relative">
                <img
                  src={meme.thumbnail}
                  alt={meme.title}
                  className="w-full h-64 object-cover transition-smooth group-hover:scale-105"
                />
                
                {/* Badges */}
                <div className="absolute top-3 left-3 flex gap-2">
                  {meme.downloadCount > 300 && (
                    <div className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center transition-smooth hover:bg-red-600">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      Trending
                    </div>
                  )}
                  {meme.trendingScore > 90 && (
                    <div className="bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center transition-smooth hover:bg-orange-600">
                      <Flame className="w-3 h-3 mr-1" />
                      Hot
                    </div>
                  )}
                </div>

                {/* Duration */}
                <div className="absolute bottom-3 right-3 bg-black/70 text-white px-2 py-1 rounded text-xs transition-smooth">
                  {meme.duration}
                </div>

                {/* Play button overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-smooth flex items-center justify-center">
                  <div className="bg-white rounded-full p-4 transform scale-75 group-hover:scale-100 transition-smooth">
                    <Play className="w-8 h-8 text-purple-600" />
                  </div>
                </div>
              </div>

              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 transition-smooth group-hover:text-purple-600">
                  {meme.title}
                </h3>
                <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <Eye className="w-4 h-4 mr-1" />
                      {meme.viewCount.toLocaleString()} views
                    </div>
                    <div className="flex items-center">
                      <Download className="w-4 h-4 mr-1" />
                      {meme.downloadCount.toLocaleString()}
                    </div>
                  </div>
                </div>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDownload(meme);
                  }}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-smooth flex items-center justify-center space-x-2 hover-lift"
                >
                  <Download className="w-4 h-4" />
                  <span>Download</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12 animate-fade-in-up animate-delay-600">
          <button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-smooth transform hover:scale-105 hover-lift">
            View All Trending Memes
          </button>
        </div>
      </div>
    </section>
  );
};

export default TrendingGrid;