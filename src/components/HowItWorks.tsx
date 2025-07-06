import React from 'react';
import { Search, Play, Download, Coffee } from 'lucide-react';

const HowItWorks: React.FC = () => {
  const steps = [
    {
      icon: <Search className="w-8 h-8" />,
      title: 'Browse & Discover',
      description: 'Explore our curated collection of viral memes and trending videos.',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: <Play className="w-8 h-8" />,
      title: 'Watch & Enjoy',
      description: 'Preview memes instantly with our smooth video player.',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: <Download className="w-8 h-8" />,
      title: 'Download Instantly',
      description: 'One-click download after a quick ad. Fast, simple, and free.',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: <Coffee className="w-8 h-8" />,
      title: 'Support the Platform',
      description: 'Your engagement with ads helps us keep the service free and growing.',
      color: 'from-orange-500 to-red-500'
    }
  ];

  return (
    <section id="how-it-works" className="py-20 bg-gradient-to-br from-gray-50 to-gray-100 page-transition">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            How It Works
            <span className="text-purple-600"> (It's Super Easy!)</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We keep it simple and transparent. Here's exactly how Dopameme.fun works and why we show ads.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto mb-16">
          {steps.map((step, index) => (
            <div key={index} className={`text-center animate-fade-in-up`} style={{ animationDelay: `${index * 0.1}s` }}>
              <div className={`w-20 h-20 rounded-full bg-gradient-to-r ${step.color} flex items-center justify-center text-white mb-6 mx-auto shadow-lg hover-lift transition-smooth`}>
                {step.icon}
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-2">{index + 1}</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3 transition-smooth">{step.title}</h3>
              <p className="text-gray-600 transition-smooth">{step.description}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-xl max-w-4xl mx-auto hover-lift animate-fade-in-up animate-delay-400">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Why Do We Show Ads? (The Honest Truth)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="animate-slide-in-left animate-delay-500">
              <h4 className="text-lg font-semibold text-purple-600 mb-3">For You:</h4>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start transition-smooth hover:text-purple-600">
                  <span className="text-green-500 mr-2">✓</span>
                  100% free meme downloads
                </li>
                <li className="flex items-start transition-smooth hover:text-purple-600">
                  <span className="text-green-500 mr-2">✓</span>
                  High-quality content daily
                </li>
                <li className="flex items-start transition-smooth hover:text-purple-600">
                  <span className="text-green-500 mr-2">✓</span>
                  No subscription fees ever
                </li>
                <li className="flex items-start transition-smooth hover:text-purple-600">
                  <span className="text-green-500 mr-2">✓</span>
                  Quick 5-second ads only
                </li>
              </ul>
            </div>
            <div className="animate-slide-in-right animate-delay-600">
              <h4 className="text-lg font-semibold text-purple-600 mb-3">For Us:</h4>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start transition-smooth hover:text-purple-600">
                  <span className="text-blue-500 mr-2">→</span>
                  Server costs covered
                </li>
                <li className="flex items-start transition-smooth hover:text-purple-600">
                  <span className="text-blue-500 mr-2">→</span>
                  Content curation team paid
                </li>
                <li className="flex items-start transition-smooth hover:text-purple-600">
                  <span className="text-blue-500 mr-2">→</span>
                  Platform improvements funded
                </li>
                <li className="flex items-start transition-smooth hover:text-purple-600">
                  <span className="text-blue-500 mr-2">→</span>
                  More awesome features added
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl animate-fade-in-scale animate-delay-700">
            <p className="text-center text-gray-700 font-medium">
              It's a win-win! You get free memes, we keep the lights on. 
              <span className="text-purple-600 font-semibold"> Fair deal, right?</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;