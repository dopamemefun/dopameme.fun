import React from 'react';
import { Download, RefreshCw, Smartphone, Zap, Shield, Heart } from 'lucide-react';

const Features: React.FC = () => {
  const features = [
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'Instant Downloads',
      description: 'One-click downloads with no waiting time. Get your favorite memes instantly.',
      color: 'from-yellow-400 to-orange-500'
    },
    {
      icon: <RefreshCw className="w-8 h-8" />,
      title: 'Fresh Daily Content',
      description: 'New viral memes added every day. Never run out of fresh entertainment.',
      color: 'from-green-400 to-blue-500'
    },
    {
      icon: <Smartphone className="w-8 h-8" />,
      title: 'Mobile Friendly',
      description: 'Perfect experience on any device. Watch and download anywhere, anytime.',
      color: 'from-purple-400 to-pink-500'
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Safe & Secure',
      description: 'All content is verified and safe. No malware, no viruses, just pure fun.',
      color: 'from-blue-400 to-indigo-500'
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: 'Curated Quality',
      description: 'Hand-picked memes that actually make you laugh. Quality over quantity.',
      color: 'from-pink-400 to-red-500'
    },
    {
      icon: <Download className="w-8 h-8" />,
      title: 'Multiple Formats',
      description: 'Download in various formats and resolutions. Perfect for any platform.',
      color: 'from-indigo-400 to-purple-500'
    }
  ];

  return (
    <section id="features" className="py-20 bg-white page-transition">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Why Choose
            <span className="text-purple-600"> Dopameme.fun?</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We're not just another meme site. We're your go-to destination for the best viral content on the internet.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`bg-white rounded-2xl p-8 border border-gray-100 hover:shadow-2xl transition-smooth group hover-lift animate-fade-in-up`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-smooth`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 transition-smooth group-hover:text-purple-600">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed transition-smooth">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;