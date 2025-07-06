import React from 'react';
import { Play, Mail, MessageCircle, Twitter, Instagram } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white page-transition">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="animate-fade-in-up">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center hover-lift">
                <Play className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-bold">Dopameme.fun</h3>
            </div>
            <p className="text-gray-400 mb-4 transition-smooth">
              Your daily dose of viral entertainment. Making the internet a funnier place, one meme at a time.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-smooth hover-lift">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-smooth hover-lift">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-smooth hover-lift">
                <MessageCircle className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          <div className="animate-fade-in-up animate-delay-100">
            <h4 className="text-lg font-semibold mb-4">Browse</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition-smooth">Trending Memes</a></li>
              <li><a href="#" className="hover:text-white transition-smooth">Latest Videos</a></li>
              <li><a href="#" className="hover:text-white transition-smooth">Categories</a></li>
              <li><a href="#" className="hover:text-white transition-smooth">Top Rated</a></li>
            </ul>
          </div>
          
          <div className="animate-fade-in-up animate-delay-200">
            <h4 className="text-lg font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition-smooth">FAQ</a></li>
              <li><a href="#" className="hover:text-white transition-smooth">Contact Us</a></li>
              <li><a href="#" className="hover:text-white transition-smooth">Report Content</a></li>
              <li><a href="#" className="hover:text-white transition-smooth">Feedback</a></li>
            </ul>
          </div>
          
          <div className="animate-fade-in-up animate-delay-300">
            <h4 className="text-lg font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition-smooth">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-smooth">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white transition-smooth">DMCA</a></li>
              <li><a href="#" className="hover:text-white transition-smooth">Cookie Policy</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 animate-fade-in animate-delay-400">
          <p>&copy; 2024 Dopameme.fun. All rights reserved. Made with ❤️ for meme lovers everywhere.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;