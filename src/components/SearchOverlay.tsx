import React, { useState } from 'react';
import { X } from 'lucide-react';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchOverlay = ({ isOpen, onClose }: SearchOverlayProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const popularSearches = [
    'AI automation',
    'Project management',
    'Field operations',
    'Business intelligence',
    'Resource allocation'
  ];

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/80 z-40 transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Search Panel */}
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-20">
        <div className="w-full max-w-2xl mx-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-8 text-white">
            <span className="text-xl font-medium text-white tracking-tight">1iQ</span>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors p-2"
            >
              <X size={24} />
            </button>
          </div>

          {/* Search Input */}
          <div className="mb-8">
            <input
              type="text"
              placeholder="Search 1iQ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-6 py-4 text-xl bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50 backdrop-blur-sm"
              autoFocus
            />
          </div>

          {/* Popular Searches */}
          <div className="text-white">
            <h3 className="text-sm text-gray-400 uppercase tracking-wider font-medium mb-4">
              POPULAR SEARCHES
            </h3>
            <div className="space-y-2">
              {popularSearches.map((search, index) => (
                <button
                  key={index}
                  className="block w-full text-left px-4 py-2 text-gray-300 hover:text-white hover:bg-white/10 rounded transition-colors"
                >
                  {search}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SearchOverlay;