import React, { useState, useMemo } from 'react';
import { Search, Filter, Grid, List, Eye, Download, Clock, Tag, TrendingUp, Edit, Trash2, Star } from 'lucide-react';
import { memeStore, MemeEntry } from '../utils/memeStore';

interface MemeDatabaseProps {
  memes: MemeEntry[];
}

const MemeDatabase: React.FC<MemeDatabaseProps> = ({ memes }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'uploadDate' | 'viewCount' | 'downloadCount' | 'trendingScore' | 'title'>('downloadCount');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [filterStatus, setFilterStatus] = useState<'all' | 'processed' | 'processing' | 'error'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [selectedMemes, setSelectedMemes] = useState<string[]>([]);
  const [editingMeme, setEditingMeme] = useState<string | null>(null);

  // Filter and sort memes
  const filteredAndSortedMemes = useMemo(() => {
    let filtered = memes.filter(meme => {
      const matchesSearch = meme.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           meme.originalFilename.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           meme.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesStatus = filterStatus === 'all' || meme.status === filterStatus;
      
      return matchesSearch && matchesStatus;
    });

    filtered.sort((a, b) => {
      let aValue: any = a[sortBy];
      let bValue: any = b[sortBy];

      if (sortBy === 'uploadDate') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }

      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [memes, searchTerm, sortBy, sortOrder, filterStatus]);

  const handleSelectMeme = (id: string) => {
    setSelectedMemes(prev => 
      prev.includes(id) 
        ? prev.filter(memeId => memeId !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedMemes.length === filteredAndSortedMemes.length) {
      setSelectedMemes([]);
    } else {
      setSelectedMemes(filteredAndSortedMemes.map(meme => meme.id));
    }
  };

  const handleDeleteSelected = () => {
    if (confirm(`Are you sure you want to delete ${selectedMemes.length} meme(s)?`)) {
      memeStore.deleteMemes(selectedMemes);
      setSelectedMemes([]);
    }
  };

  const handleEditMeme = (id: string, updates: Partial<MemeEntry>) => {
    memeStore.updateMeme(id, updates);
    setEditingMeme(null);
  };

  const handleDeleteMeme = (id: string) => {
    if (confirm('Are you sure you want to delete this meme?')) {
      memeStore.deleteMeme(id);
    }
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      processed: 'bg-green-100 text-green-800',
      processing: 'bg-blue-100 text-blue-800',
      error: 'bg-red-100 text-red-800'
    };
    return badges[status as keyof typeof badges] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Meme Database</h2>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">
              {filteredAndSortedMemes.length} of {memes.length} memes
            </span>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search memes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="downloadCount">Sort by Downloads</option>
            <option value="uploadDate">Sort by Upload Date</option>
            <option value="title">Sort by Title</option>
            <option value="viewCount">Sort by Views</option>
            <option value="trendingScore">Sort by Trending Score</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="processed">Processed</option>
            <option value="processing">Processing</option>
            <option value="error">Error</option>
          </select>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-smooth"
            >
              {sortOrder === 'asc' ? '↑' : '↓'}
            </button>
            <button
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-smooth"
            >
              {viewMode === 'grid' ? <List className="w-5 h-5" /> : <Grid className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedMemes.length > 0 && (
          <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg mb-6">
            <span className="text-purple-800 font-medium">
              {selectedMemes.length} meme(s) selected
            </span>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleDeleteSelected}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-smooth flex items-center space-x-2"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete Selected</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Meme Grid/List */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        {filteredAndSortedMemes.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Grid className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No memes found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredAndSortedMemes.map(meme => (
              <div key={meme.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-smooth">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={selectedMemes.includes(meme.id)}
                    onChange={() => handleSelectMeme(meme.id)}
                    className="absolute top-2 left-2 z-10"
                  />
                  <img
                    src={meme.thumbnail}
                    alt={meme.title}
                    className="w-full h-32 object-cover"
                  />
                  <div className={`absolute top-2 right-2 px-2 py-1 rounded text-xs font-medium ${getStatusBadge(meme.status)}`}>
                    {meme.status}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{meme.title}</h3>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4" />
                      <span>{meme.duration}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Eye className="w-4 h-4" />
                      <span>{meme.viewCount.toLocaleString()} views</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Download className="w-4 h-4" />
                      <span>{meme.downloadCount.toLocaleString()} downloads</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="w-4 h-4" />
                      <span>Score: {meme.trendingScore}</span>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      {new Date(meme.uploadDate).toLocaleDateString()}
                    </span>
                    <button
                      onClick={() => setEditingMeme(meme.id)}
                      className="text-purple-600 hover:text-purple-800 transition-smooth"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg font-medium text-gray-700">
              <input
                type="checkbox"
                checked={selectedMemes.length === filteredAndSortedMemes.length}
                onChange={handleSelectAll}
              />
              <div className="flex-1">Title</div>
              <div className="w-20">Duration</div>
              <div className="w-20">Views</div>
              <div className="w-24">Downloads</div>
              <div className="w-20">Score</div>
              <div className="w-24">Status</div>
              <div className="w-24">Actions</div>
            </div>
            {filteredAndSortedMemes.map(meme => (
              <div key={meme.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-smooth">
                <input
                  type="checkbox"
                  checked={selectedMemes.includes(meme.id)}
                  onChange={() => handleSelectMeme(meme.id)}
                />
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{meme.title}</h3>
                  <p className="text-sm text-gray-600">{meme.originalFilename}</p>
                </div>
                <div className="w-20 text-sm text-gray-600">{meme.duration}</div>
                <div className="w-20 text-sm text-gray-600">{meme.viewCount.toLocaleString()}</div>
                <div className="w-24 text-sm font-medium text-purple-600">{meme.downloadCount.toLocaleString()}</div>
                <div className="w-20 text-sm text-gray-600">{meme.trendingScore}</div>
                <div className="w-24">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusBadge(meme.status)}`}>
                    {meme.status}
                  </span>
                </div>
                <div className="w-24 flex items-center space-x-2">
                  <button
                    onClick={() => setEditingMeme(meme.id)}
                    className="text-purple-600 hover:text-purple-800 transition-smooth"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteMeme(meme.id)}
                    className="text-red-600 hover:text-red-800 transition-smooth"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editingMeme && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Edit Meme</h3>
            {(() => {
              const meme = memes.find(m => m.id === editingMeme);
              if (!meme) return null;
              
              return (
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  handleEditMeme(editingMeme, {
                    title: formData.get('title') as string,
                    tags: (formData.get('tags') as string).split(',').map(tag => tag.trim()).filter(Boolean),
                    viewCount: parseInt(formData.get('viewCount') as string) || 0,
                    downloadCount: parseInt(formData.get('downloadCount') as string) || 0,
                    trendingScore: parseInt(formData.get('trendingScore') as string) || 0
                  });
                }}>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                      <input
                        name="title"
                        type="text"
                        defaultValue={meme.title}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma-separated)</label>
                      <input
                        name="tags"
                        type="text"
                        defaultValue={meme.tags.join(', ')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">View Count</label>
                        <input
                          name="viewCount"
                          type="number"
                          defaultValue={meme.viewCount}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Download Count</label>
                        <input
                          name="downloadCount"
                          type="number"
                          defaultValue={meme.downloadCount}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Trending Score</label>
                      <input
                        name="trendingScore"
                        type="number"
                        defaultValue={meme.trendingScore}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-end space-x-3 mt-6">
                    <button
                      type="button"
                      onClick={() => setEditingMeme(null)}
                      className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-smooth"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-smooth"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
};

export default MemeDatabase;