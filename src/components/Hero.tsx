import React from 'react';
import { Play, Download, Zap, TrendingUp } from 'lucide-react';
import BouncingText from './BouncingText';

interface HeroProps {
  onNavigateToGrid?: () => void;
}

const Hero: React.FC<HeroProps> = ({ onNavigateToGrid }) => {
  return (
    <section className="relative min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-pink-900 overflow-hidden page-transition">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse animate-delay-100"></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse animate-delay-200"></div>
      </div>

      <div className="container mx-auto px-4 pt-32 pb-12 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <div className="flex items-center justify-center mb-6 animate-fade-in">
            <div className="bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 flex items-center space-x-2 hover-lift">
              <TrendingUp className="w-4 h-4 text-yellow-400" />
              <span className="text-white/90 text-sm">Trending Now</span>
            </div>
          </div>
          
          <div className="mb-8 animate-fade-in-up animate-delay-100">
            <BouncingText />
          </div>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight animate-fade-in-up animate-delay-200">
            Your Daily Dose of
            <span className="bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400 bg-clip-text text-transparent block">
              Viral Memes
            </span>
          </h2>
          
          <p className="text-xl md:text-2xl text-white/80 mb-8 max-w-2xl mx-auto leading-relaxed animate-fade-in-up animate-delay-300">
            Discover the hottest memes before they blow up. Watch, laugh, and download with one click. 
            <span className="text-yellow-300 font-semibold">Fresh content every day!</span>
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 animate-fade-in-up animate-delay-400">
            <button 
              onClick={onNavigateToGrid}
              className="bg-gradient-to-r from-yellow-400 to-pink-500 text-black font-bold px-8 py-4 rounded-xl hover:from-yellow-500 hover:to-pink-600 transition-smooth transform hover:scale-105 shadow-2xl flex items-center space-x-2 hover-lift"
            >
              <Play className="w-6 h-6" />
              <span>Start Watching</span>
            </button>
            <button className="bg-white/10 backdrop-blur-sm text-white font-bold px-8 py-4 rounded-xl hover:bg-white/20 transition-smooth border border-white/20 flex items-center space-x-2 hover-lift">
              <Download className="w-6 h-6" />
              <span>Download Now</span>
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover-lift animate-fade-in-scale animate-delay-500">
              <div className="text-3xl font-bold text-yellow-400 mb-2">10K+</div>
              <div className="text-white/80">Viral Videos</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover-lift animate-fade-in-scale animate-delay-600">
              <div className="text-3xl font-bold text-pink-400 mb-2">Daily</div>
              <div className="text-white/80">Fresh Content</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover-lift animate-fade-in-scale animate-delay-700">
              <div className="text-3xl font-bold text-purple-400 mb-2">1-Click</div>
              <div className="text-white/80">Downloads</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;