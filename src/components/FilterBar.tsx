import React from 'react';
import { TrendingUp, Clock, Download, Grid } from 'lucide-react';

interface FilterBarProps {
  activeFilter: 'all' | 'trending' | 'recent' | 'most-downloaded';
  onFilterChange: (filter: 'all' | 'trending' | 'recent' | 'most-downloaded') => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ activeFilter, onFilterChange }) => {
  const filters = [
    { key: 'all' as const, label: 'All Memes', icon: Grid },
    { key: 'trending' as const, label: 'Trending', icon: TrendingUp },
    { key: 'recent' as const, label: 'Recent', icon: Clock },
    { key: 'most-downloaded' as const, label: 'Most Downloaded', icon: Download }
  ];

  return (
    <div className="bg-white border-b border-gray-200 sticky top-16 z-40">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center space-x-2 overflow-x-auto scrollbar-hide">
          {filters.map((filter) => {
            const Icon = filter.icon;
            const isActive = activeFilter === filter.key;
            
            return (
              <button
                key={filter.key}
                onClick={() => onFilterChange(filter.key)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full font-medium transition-smooth whitespace-nowrap ${
                  isActive
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{filter.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FilterBar;