
import React from 'react';
import { X, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SquareQ from './SquareQ';

interface NavigationMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const NavigationMenu = ({ isOpen, onClose }: NavigationMenuProps) => {
  const navigate = useNavigate();
  
  if (!isOpen) return null;

  const handleLogoClick = () => {
    window.location.href = '/';
  };

  const handleNavigation = (path: string) => {
    onClose();
    navigate(path);
  };

  return (
    <div className="fixed inset-0 bg-slate-900 z-50 overflow-y-auto">
      {/* Header */}
      <div className="flex justify-between items-center p-4 sm:p-6 border-b border-slate-700">
        <button 
          onClick={handleLogoClick}
          className="flex items-center space-x-2 sm:space-x-3 transition-all duration-200 min-h-[44px]"
        >
          <div className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center hover:shadow-[0_0_20px_rgba(255,255,255,0.8)] transition-all duration-200 rounded">
            <img 
              src="/lovable-uploads/b5b303f6-c418-4625-bb79-dc96bb3cfbe6.png" 
              alt="1iQ Logo" 
              className="w-6 h-6 sm:w-8 sm:h-8 object-contain"
            />
          </div>
          <span className="text-lg sm:text-xl font-medium text-white tracking-tight"><SquareQ>1iQ</SquareQ></span>
        </button>
        <button 
          onClick={onClose}
          className="text-white hover:text-gray-300 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
        >
          <X size={20} className="sm:w-6 sm:h-6" />
        </button>
      </div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-3 gap-8 lg:gap-16 p-6 sm:p-8 lg:p-16">
        {/* Left Column - Navigation */}
        <div className="space-y-8 sm:space-y-12">
          <div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light text-white mb-2 tracking-tight">
              <SquareQ>Generate Alpha</SquareQ>
            </h2>
          </div>

          <div>
            <h3 className="text-xl sm:text-2xl font-light text-gray-400 mb-6 sm:mb-8 tracking-wide">
              <SquareQ>Our Platforms</SquareQ>
            </h3>
            <nav className="space-y-4 sm:space-y-6">
              <button 
                onClick={() => handleNavigation('/1iq-core')}
                className="flex items-center text-white hover:text-gray-300 transition-colors group w-full text-left min-h-[44px]"
              >
                <ArrowRight className="w-4 h-4 mr-3 opacity-60" />
                <span className="text-base sm:text-lg font-light"><SquareQ>1iQ Core</SquareQ></span>
              </button>
              <button 
                onClick={() => handleNavigation('/1iq-field')}
                className="flex items-center text-white hover:text-gray-300 transition-colors group w-full text-left min-h-[44px]"
              >
                <ArrowRight className="w-4 h-4 mr-3 opacity-60" />
                <span className="text-base sm:text-lg font-light"><SquareQ>1iQ Field</SquareQ></span>
              </button>
              <button 
                onClick={() => handleNavigation('/1iq-intel')}
                className="flex items-center text-white hover:text-gray-300 transition-colors group w-full text-left min-h-[44px]"
              >
                <ArrowRight className="w-4 h-4 mr-3 opacity-60" />
                <span className="text-base sm:text-lg font-light"><SquareQ>1iQ Intel</SquareQ></span>
              </button>
            </nav>
          </div>

          <div className="space-y-4 sm:space-y-6">
            <a href="#" className="block text-white hover:text-gray-300 transition-colors min-h-[44px] flex items-center">
              <span className="text-base sm:text-lg font-light"><SquareQ>Offerings</SquareQ></span>
            </a>
            <a href="#" className="block text-white hover:text-gray-300 transition-colors min-h-[44px] flex items-center">
              <span className="text-base sm:text-lg font-light"><SquareQ>Impact Studies</SquareQ></span>
            </a>
            <a href="#" className="block text-white hover:text-gray-300 transition-colors min-h-[44px] flex items-center">
              <span className="text-base sm:text-lg font-light"><SquareQ>Documentation</SquareQ></span>
            </a>
            <a href="#" className="block text-white hover:text-gray-300 transition-colors min-h-[44px] flex items-center">
              <span className="text-base sm:text-lg font-light"><SquareQ>Careers</SquareQ></span>
            </a>
            <a href="#" className="block text-white hover:text-gray-300 transition-colors min-h-[44px] flex items-center">
              <span className="text-base sm:text-lg font-light"><SquareQ>Newsroom</SquareQ></span>
            </a>
            <a href="#" className="block text-white hover:text-gray-300 transition-colors min-h-[44px] flex items-center">
              <span className="text-base sm:text-lg font-light"><SquareQ>1iQ Explained</SquareQ></span>
            </a>
          </div>
        </div>

        {/* Middle Column - Latest News */}
        <div className="border-l border-slate-700 pl-6 sm:pl-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 sm:mb-8 gap-2">
            <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider">
              <SquareQ>Latest News</SquareQ>
            </h3>
            <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors underline">
              <SquareQ>NEWSROOM →</SquareQ>
            </a>
          </div>

          <div className="space-y-6 sm:space-y-8">
            <article className="space-y-3 sm:space-y-4">
              <div className="aspect-video bg-gray-800 rounded overflow-hidden">
                <img 
                  src="/lovable-uploads/e93dd749-d087-4daf-8f07-ba9de354ebde.png" 
                  alt="News"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-xs text-gray-500 uppercase tracking-wider">
                <SquareQ>CONSTRUCTION TECH, FEBRUARY 19, 2025</SquareQ>
              </div>
              <h4 className="text-white text-sm sm:text-base font-light leading-relaxed">
                <SquareQ>1iQ CEO talks construction technology advancement and the future of AI-driven project management</SquareQ>
              </h4>
              <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
                <SquareQ>1iQ CEO spoke about revolutionary construction management solutions, the state of construction tech innovation, and AI integration in field operations.</SquareQ>
              </p>
              <a href="#" className="inline-flex items-center text-gray-400 hover:text-white transition-colors text-xs sm:text-sm min-h-[44px]">
                <ArrowRight className="w-3 h-3 mr-1" />
                <SquareQ>Watch Here</SquareQ>
              </a>
            </article>

            <article className="space-y-3 sm:space-y-4">
              <div className="aspect-video bg-gray-800 rounded overflow-hidden">
                <img 
                  src="/lovable-uploads/e9d5b0fc-0ed1-4899-91d6-180731263b5b.png" 
                  alt="News"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-xs text-gray-500 uppercase tracking-wider">
                <SquareQ>CONSTRUCTION WEEKLY, MARCH 12, 2025</SquareQ>
              </div>
              <h4 className="text-white text-sm sm:text-base font-light leading-relaxed">
                <SquareQ>1iQ's AI-powered construction management platform transforms project delivery</SquareQ>
              </h4>
              <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
                <SquareQ>Construction teams now have access to real-time project intelligence through state-of-the-art AI systems that optimize workflow and resource allocation.</SquareQ>
              </p>
              <a href="#" className="inline-flex items-center text-gray-400 hover:text-white transition-colors text-xs sm:text-sm min-h-[44px]">
                <ArrowRight className="w-3 h-3 mr-1" />
                <SquareQ>Read More</SquareQ>
              </a>
            </article>
          </div>
        </div>

        {/* Right Column - Offerings & Quick Links */}
        <div className="border-l border-slate-700 pl-6 sm:pl-8 space-y-8 sm:space-y-12">
          <div>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 sm:mb-8 gap-2">
              <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider">
                <SquareQ>Offerings</SquareQ>
              </h3>
              <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors underline">
                <SquareQ>VIEW ALL OFFERINGS →</SquareQ>
              </a>
            </div>
            <p className="text-gray-300 text-xs sm:text-sm leading-relaxed mb-4 sm:mb-6">
              <SquareQ>Our platforms are used throughout the construction industry to help organizations quickly implement solutions to the hardest problems they face.</SquareQ>
            </p>
            <a href="#" className="inline-flex items-center text-gray-400 hover:text-white transition-colors text-xs sm:text-sm min-h-[44px]">
              <ArrowRight className="w-3 h-3 mr-1" />
              <SquareQ>Learn more about 1iQ</SquareQ>
            </a>
          </div>

          <div>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 sm:mb-8 gap-2">
              <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider">
                <SquareQ>Latest Impact</SquareQ>
              </h3>
              <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors underline">
                <SquareQ>VIEW ALL IMPACT STUDIES →</SquareQ>
              </a>
            </div>
            
            <div className="space-y-3 sm:space-y-4">
              <div className="text-xs text-gray-500 uppercase tracking-wider">
                <SquareQ>IMPACT STUDY // GENERAL CONSTRUCTION</SquareQ>
              </div>
              <div className="aspect-video bg-gray-800 rounded overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-800"></div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4 sm:mb-6">
              <SquareQ>Quick Links</SquareQ>
            </h3>
            <div className="space-y-2 sm:space-y-3">
              <a href="#" className="block text-gray-400 hover:text-white transition-colors text-xs sm:text-sm min-h-[44px] flex items-center">
                <SquareQ>About 1iQ</SquareQ>
              </a>
              <a href="#" className="block text-gray-400 hover:text-white transition-colors text-xs sm:text-sm min-h-[44px] flex items-center">
                <SquareQ>Blog</SquareQ>
              </a>
              <a href="#" className="block text-gray-400 hover:text-white transition-colors text-xs sm:text-sm min-h-[44px] flex items-center">
                <SquareQ>Investor Relations</SquareQ>
              </a>
              <a href="#" className="block text-gray-400 hover:text-white transition-colors text-xs sm:text-sm min-h-[44px] flex items-center">
                <SquareQ>Letters from the CEO</SquareQ>
              </a>
              <a href="#" className="block text-gray-400 hover:text-white transition-colors text-xs sm:text-sm min-h-[44px] flex items-center">
                <SquareQ>Privacy & Civil Liberties</SquareQ>
              </a>
              <a href="#" className="block text-gray-400 hover:text-white transition-colors text-xs sm:text-sm min-h-[44px] flex items-center">
                <SquareQ>Information Security</SquareQ>
              </a>
              <a href="#" className="block text-gray-400 hover:text-white transition-colors text-xs sm:text-sm min-h-[44px] flex items-center">
                <SquareQ>Cloud Partners</SquareQ>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavigationMenu;
