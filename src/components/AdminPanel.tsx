import React, { useState, useEffect } from 'react';
import { ArrowLeft, Shield, Upload, Search, Grid, List, Filter, Eye, Download, Clock, FileVideo, AlertCircle, CheckCircle, X } from 'lucide-react';
import PinAuth from './PinAuth';
import FileUploader from './FileUploader';
import MemeDatabase from './MemeDatabase';
import { memeStore, MemeEntry } from '../utils/memeStore';

interface AdminPanelProps {
  onNavigateToHome: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onNavigateToHome }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [sessionExpiry, setSessionExpiry] = useState<Date | null>(null);
  const [activeTab, setActiveTab] = useState<'upload' | 'database' | 'logs'>('upload');
  const [memes, setMemes] = useState<MemeEntry[]>([]);
  const [logs, setLogs] = useState<Array<{
    id: string;
    timestamp: string;
    action: string;
    status: 'success' | 'error';
    message: string;
    user: string;
  }>>([]);

  // Session management
  useEffect(() => {
    if (isAuthenticated) {
      const expiry = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes
      setSessionExpiry(expiry);
      
      const timer = setTimeout(() => {
        handleLogout();
      }, 30 * 60 * 1000);

      return () => clearTimeout(timer);
    }
  }, [isAuthenticated]);

  // Load memes from store
  useEffect(() => {
    if (isAuthenticated) {
      setMemes(memeStore.getAllMemes());
      
      const unsubscribe = memeStore.subscribe((updatedMemes) => {
        setMemes(updatedMemes);
      });

      return unsubscribe;
    }
  }, [isAuthenticated]);

  // Activity tracker to reset session timer
  useEffect(() => {
    if (!isAuthenticated) return;

    const resetTimer = () => {
      const expiry = new Date(Date.now() + 30 * 60 * 1000);
      setSessionExpiry(expiry);
    };

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    events.forEach(event => {
      document.addEventListener(event, resetTimer, true);
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, resetTimer, true);
      });
    };
  }, [isAuthenticated]);

  const handleLogin = () => {
    setIsAuthenticated(true);
    addLog('User authenticated', 'success', 'PIN authentication successful');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setSessionExpiry(null);
    addLog('User logged out', 'success', 'Session ended');
  };

  const addLog = (action: string, status: 'success' | 'error', message: string) => {
    const newLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      action,
      status,
      message,
      user: 'Admin'
    };
    setLogs(prev => [newLog, ...prev].slice(0, 100)); // Keep last 100 logs
  };

  const handleFileProcessed = (processedFile: Omit<MemeEntry, 'id' | 'downloadCount'>) => {
    const newMeme: MemeEntry = {
      ...processedFile,
      id: `meme-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      downloadCount: 0,
      category: 'recent' // New uploads start as recent
    };
    
    memeStore.addMeme(newMeme);
    addLog('File processed', 'success', `Successfully processed: ${processedFile.originalFilename}`);
  };

  const handleFileError = (filename: string, error: string) => {
    addLog('File processing error', 'error', `Failed to process ${filename}: ${error}`);
  };

  if (!isAuthenticated) {
    return <PinAuth onAuthenticated={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
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
              <div className="flex items-center space-x-2">
                <Shield className="w-6 h-6 text-green-600" />
                <h1 className="text-2xl font-bold text-gray-900">
                  Admin <span className="text-purple-600">Panel</span>
                </h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {sessionExpiry && (
                <div className="text-sm text-gray-600">
                  Session expires: {sessionExpiry.toLocaleTimeString()}
                </div>
              )}
              <div className="text-sm text-gray-600">
                {memes.length} memes in database
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-smooth"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4">
          <nav className="flex space-x-8">
            {[
              { key: 'upload', label: 'File Upload', icon: Upload },
              { key: 'database', label: 'Database', icon: Grid },
              { key: 'logs', label: 'System Logs', icon: Clock }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium transition-smooth ${
                    activeTab === tab.key
                      ? 'border-purple-600 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Content */}
      <main className="container mx-auto px-4 py-8">
        {activeTab === 'upload' && (
          <FileUploader 
            onFileProcessed={handleFileProcessed}
            onFileError={handleFileError}
          />
        )}
        
        {activeTab === 'database' && (
          <MemeDatabase memes={memes} />
        )}
        
        {activeTab === 'logs' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">System Logs</h2>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {logs.map(log => (
                <div
                  key={log.id}
                  className={`p-4 rounded-lg border-l-4 ${
                    log.status === 'success'
                      ? 'bg-green-50 border-green-500'
                      : 'bg-red-50 border-red-500'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {log.status === 'success' ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-red-600" />
                      )}
                      <span className="font-medium">{log.action}</span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(log.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mt-1">{log.message}</p>
                </div>
              ))}
              {logs.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No logs available
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminPanel;