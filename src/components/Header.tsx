import React from 'react';
import { Play, Download, TrendingUp, Settings } from 'lucide-react';
import BouncingText from './BouncingText';

interface HeaderProps {
  onNavigateToGrid?: () => void;
  onNavigateToAdmin?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onNavigateToGrid, onNavigateToAdmin }) => {
  return (
    <header className="bg-white/90 backdrop-blur-md fixed top-0 left-0 right-0 z-50 border-b border-gray-200 transition-smooth">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 animate-slide-in-left">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center animate-pulse hover-lift">
              <Play className="w-5 h-5 text-white" />
            </div>
            <BouncingText />
          </div>
          <nav className="hidden md:flex items-center space-x-6 animate-slide-in-right">
            <a href="#trending" className="text-gray-700 hover:text-purple-600 transition-smooth font-medium relative group">
              Trending
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-600 transition-smooth group-hover:w-full"></span>
            </a>
            <a href="#features" className="text-gray-700 hover:text-purple-600 transition-smooth font-medium relative group animate-delay-100">
              Features
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-600 transition-smooth group-hover:w-full"></span>
            </a>
            <a href="#how-it-works" className="text-gray-700 hover:text-purple-600 transition-smooth font-medium relative group animate-delay-200">
              How it Works
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-600 transition-smooth group-hover:w-full"></span>
            </a>
            <button 
              onClick={onNavigateToAdmin}
              className="text-gray-700 hover:text-purple-600 transition-smooth font-medium relative group animate-delay-250"
            >
              <Settings className="w-5 h-5" />
            </button>
            <button 
              onClick={onNavigateToGrid}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-smooth transform hover:scale-105 font-medium shadow-lg hover-lift animate-delay-300"
            >
              Start Browsing
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;