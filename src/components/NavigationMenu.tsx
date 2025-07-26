import React from 'react';
import { X, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface NavigationMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const NavigationMenu = ({ isOpen, onClose }: NavigationMenuProps) => {
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    onClose();
    navigate(path);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/80 z-40 transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Side Panel */}
      <div className="fixed right-0 top-0 h-full w-full bg-black z-50 transform transition-transform duration-300 ease-in-out text-white overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-4 sm:p-6 border-b border-gray-800">
          <span className="text-lg sm:text-xl font-medium text-white tracking-tight">1iQ</span>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-2"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-8 sm:space-y-12">
          {/* Main Navigation */}
          <div className="space-y-6 sm:space-y-8">
            <div className="space-y-4 sm:space-y-6">
              <h2 className="text-sm text-gray-400 uppercase tracking-wider font-medium">
                Generate Alpha
              </h2>
              
              <h2 className="text-sm text-gray-400 uppercase tracking-wider font-medium">
                Our Platforms
              </h2>
              
              <div className="space-y-4">
                <button 
                  onClick={() => handleNavigation('/1iq-core')}
                  className="flex items-center justify-between w-full text-left py-2 hover:text-gray-300 transition-colors"
                >
                  <span className="text-base sm:text-lg font-light">1iQ Core</span>
                  <ArrowRight size={16} className="text-gray-500" />
                </button>
                <button 
                  onClick={() => handleNavigation('/1iq-field')}
                  className="flex items-center justify-between w-full text-left py-2 hover:text-gray-300 transition-colors"
                >
                  <span className="text-base sm:text-lg font-light">1iQ Field</span>
                  <ArrowRight size={16} className="text-gray-500" />
                </button>
                <button 
                  onClick={() => handleNavigation('/1iq-intel')}
                  className="flex items-center justify-between w-full text-left py-2 hover:text-gray-300 transition-colors"
                >
                  <span className="text-base sm:text-lg font-light">1iQ Intel</span>
                  <ArrowRight size={16} className="text-gray-500" />
                </button>
              </div>
              
              <div className="space-y-4">
                <span className="text-base sm:text-lg font-light">Offerings</span>
              </div>
              <div className="space-y-4">
                <span className="text-base sm:text-lg font-light">Impact Studies</span>
              </div>
              <div className="space-y-4">
                <span className="text-base sm:text-lg font-light">Documentation</span>
              </div>
              <div className="space-y-4">
                <span className="text-base sm:text-lg font-light">Careers</span>
              </div>
              <div className="space-y-4">
                <span className="text-base sm:text-lg font-light">Newsroom</span>
              </div>
              <div className="space-y-4">
                <span className="text-base sm:text-lg font-light">1iQ Explained</span>
              </div>
            </div>

            {/* News Section - Simplified */}
            <div className="border-t border-gray-800 pt-6 sm:pt-8">
              <h3 className="text-sm text-gray-400 uppercase tracking-wider font-medium mb-4">
                Latest News
              </h3>
              <button onClick={() => handleNavigation('/learn-more')} className="text-sm text-gray-400 hover:text-white transition-colors">
                NEWSROOM →
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NavigationMenu;