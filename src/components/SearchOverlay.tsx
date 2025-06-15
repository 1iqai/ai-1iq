
import React, { useState } from 'react';
import { X } from 'lucide-react';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchOverlay = ({ isOpen, onClose }: SearchOverlayProps) => {
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const popularSearches = [
    'Foundry',
    'Gotham', 
    'Apollo',
    'Ontology',
    'Artificial Intelligence (AI)'
  ];

  return (
    <div className="fixed inset-0 bg-slate-900 z-50">
      {/* Header */}
      <div className="flex justify-between items-center p-6">
        <div className="flex items-center space-x-3">
          <img 
            src="/lovable-uploads/b5b303f6-c418-4625-bb79-dc96bb3cfbe6.png" 
            alt="1iQ Logo" 
            className="w-8 h-8 object-contain"
          />
          <span className="text-xl font-medium text-white tracking-tight">1iQ</span>
        </div>
        <button 
          onClick={onClose}
          className="text-white hover:text-gray-300 transition-colors"
        >
          <X size={24} />
        </button>
      </div>

      {/* Search Content */}
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-8">
        <div className="w-full max-w-4xl">
          {/* Search Input */}
          <div className="relative mb-16">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Start typing to search"
              className="w-full bg-transparent text-white text-6xl font-light placeholder-gray-400 border-none outline-none tracking-tight"
              autoFocus
            />
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gray-600"></div>
          </div>

          {/* Popular Searches */}
          <div className="space-y-8">
            <div className="text-gray-400 text-sm font-medium uppercase tracking-wider">
              POPULAR SEARCHES
            </div>
            <div className="flex flex-wrap gap-x-8 gap-y-4">
              {popularSearches.map((search, index) => (
                <button
                  key={index}
                  className="text-white text-lg font-light hover:text-gray-300 transition-colors underline decoration-gray-600 hover:decoration-gray-300"
                  onClick={() => setSearchQuery(search)}
                >
                  {search}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchOverlay;
