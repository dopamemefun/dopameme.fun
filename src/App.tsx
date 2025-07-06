import React, { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import TrendingGrid from './components/TrendingGrid';
import Features from './components/Features';
import HowItWorks from './components/HowItWorks';
import Footer from './components/Footer';
import MemeGridWall from './components/MemeGridWall';
import AdminPanel from './components/AdminPanel';

function App() {
  const [currentView, setCurrentView] = useState<'home' | 'grid' | 'admin'>('home');

  const navigateToGrid = () => {
    setCurrentView('grid');
  };

  const navigateToHome = () => {
    setCurrentView('home');
  };

  const navigateToAdmin = () => {
    setCurrentView('admin');
  };

  return (
    <div className="min-h-screen">
      {currentView === 'home' ? (
        <>
          <Header onNavigateToGrid={navigateToGrid} onNavigateToAdmin={navigateToAdmin} />
          <Hero onNavigateToGrid={navigateToGrid} />
          <TrendingGrid />
          <Features />
          <HowItWorks />
          <Footer />
        </>
      ) : currentView === 'grid' ? (
        <MemeGridWall onNavigateToHome={navigateToHome} />
      ) : (
        <AdminPanel onNavigateToHome={navigateToHome} />
      )}
    </div>
  );
}

export default App;