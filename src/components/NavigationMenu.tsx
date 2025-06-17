
import React from 'react';
import { X, ArrowRight } from 'lucide-react';
import SquareQ from './SquareQ';

interface NavigationMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const NavigationMenu = ({ isOpen, onClose }: NavigationMenuProps) => {
  if (!isOpen) return null;

  const handleLogoClick = () => {
    window.location.href = '/';
  };

  return (
    <div className="fixed inset-0 bg-slate-900 z-50 overflow-y-auto">
      {/* Header */}
      <div className="flex justify-between items-center p-6 border-b border-slate-700">
        <button 
          onClick={handleLogoClick}
          className="flex items-center space-x-3 transition-all duration-200"
        >
          <div className="w-8 h-8 flex items-center justify-center hover:shadow-[0_0_20px_rgba(255,255,255,0.8)] transition-all duration-200 rounded">
            <img 
              src="/lovable-uploads/b5b303f6-c418-4625-bb79-dc96bb3cfbe6.png" 
              alt="1iQ Logo" 
              className="w-8 h-8 object-contain"
            />
          </div>
          <span className="text-xl font-medium text-white tracking-tight"><SquareQ>1iQ</SquareQ></span>
        </button>
        <button 
          onClick={onClose}
          className="text-white hover:text-gray-300 transition-colors"
        >
          <X size={24} />
        </button>
      </div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-3 gap-16 p-8 lg:p-16">
        {/* Left Column - Navigation */}
        <div className="space-y-12">
          <div>
            <h2 className="text-4xl lg:text-5xl font-light text-white mb-2 tracking-tight">
              <SquareQ>Generate Alpha</SquareQ>
            </h2>
          </div>

          <div>
            <h3 className="text-2xl font-light text-gray-400 mb-8 tracking-wide">
              <SquareQ>Our Platforms</SquareQ>
            </h3>
            <nav className="space-y-6">
              <a href="#" className="flex items-center text-white hover:text-gray-300 transition-colors group">
                <ArrowRight className="w-4 h-4 mr-3 opacity-60" />
                <span className="text-lg font-light"><SquareQ>1iQ Core</SquareQ></span>
              </a>
              <a href="#" className="flex items-center text-white hover:text-gray-300 transition-colors group">
                <ArrowRight className="w-4 h-4 mr-3 opacity-60" />
                <span className="text-lg font-light"><SquareQ>1iQ Field</SquareQ></span>
              </a>
              <a href="#" className="flex items-center text-white hover:text-gray-300 transition-colors group">
                <ArrowRight className="w-4 h-4 mr-3 opacity-60" />
                <span className="text-lg font-light"><SquareQ>1iQ Intel</SquareQ></span>
              </a>
            </nav>
          </div>

          <div className="space-y-6">
            <a href="#" className="block text-white hover:text-gray-300 transition-colors">
              <span className="text-lg font-light"><SquareQ>Offerings</SquareQ></span>
            </a>
            <a href="#" className="block text-white hover:text-gray-300 transition-colors">
              <span className="text-lg font-light"><SquareQ>Impact Studies</SquareQ></span>
            </a>
            <a href="#" className="block text-white hover:text-gray-300 transition-colors">
              <span className="text-lg font-light"><SquareQ>Documentation</SquareQ></span>
            </a>
            <a href="#" className="block text-white hover:text-gray-300 transition-colors">
              <span className="text-lg font-light"><SquareQ>Careers</SquareQ></span>
            </a>
            <a href="#" className="block text-white hover:text-gray-300 transition-colors">
              <span className="text-lg font-light"><SquareQ>Newsroom</SquareQ></span>
            </a>
            <a href="#" className="block text-white hover:text-gray-300 transition-colors">
              <span className="text-lg font-light"><SquareQ>1iQ Explained</SquareQ></span>
            </a>
          </div>
        </div>

        {/* Middle Column - Latest News */}
        <div className="border-l border-slate-700 pl-8">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider">
              <SquareQ>Latest News</SquareQ>
            </h3>
            <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors underline">
              <SquareQ>NEWSROOM →</SquareQ>
            </a>
          </div>

          <div className="space-y-8">
            <article className="space-y-4">
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
              <h4 className="text-white text-base font-light leading-relaxed">
                <SquareQ>1iQ CEO talks construction technology advancement and the future of AI-driven project management</SquareQ>
              </h4>
              <p className="text-gray-400 text-sm leading-relaxed">
                <SquareQ>1iQ CEO spoke about revolutionary construction management solutions, the state of construction tech innovation, and AI integration in field operations.</SquareQ>
              </p>
              <a href="#" className="inline-flex items-center text-gray-400 hover:text-white transition-colors text-sm">
                <ArrowRight className="w-3 h-3 mr-1" />
                <SquareQ>Watch Here</SquareQ>
              </a>
            </article>

            <article className="space-y-4">
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
              <h4 className="text-white text-base font-light leading-relaxed">
                <SquareQ>1iQ's AI-powered construction management platform transforms project delivery</SquareQ>
              </h4>
              <p className="text-gray-400 text-sm leading-relaxed">
                <SquareQ>Construction teams now have access to real-time project intelligence through state-of-the-art AI systems that optimize workflow and resource allocation.</SquareQ>
              </p>
              <a href="#" className="inline-flex items-center text-gray-400 hover:text-white transition-colors text-sm">
                <ArrowRight className="w-3 h-3 mr-1" />
                <SquareQ>Read More</SquareQ>
              </a>
            </article>
          </div>
        </div>

        {/* Right Column - Offerings & Quick Links */}
        <div className="border-l border-slate-700 pl-8 space-y-12">
          <div>
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider">
                <SquareQ>Offerings</SquareQ>
              </h3>
              <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors underline">
                <SquareQ>VIEW ALL OFFERINGS →</SquareQ>
              </a>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed mb-6">
              <SquareQ>Our platforms are used throughout the construction industry to help organizations quickly implement solutions to the hardest problems they face.</SquareQ>
            </p>
            <a href="#" className="inline-flex items-center text-gray-400 hover:text-white transition-colors text-sm">
              <ArrowRight className="w-3 h-3 mr-1" />
              <SquareQ>Learn more about 1iQ</SquareQ>
            </a>
          </div>

          <div>
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider">
                <SquareQ>Latest Impact</SquareQ>
              </h3>
              <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors underline">
                <SquareQ>VIEW ALL IMPACT STUDIES →</SquareQ>
              </a>
            </div>
            
            <div className="space-y-4">
              <div className="text-xs text-gray-500 uppercase tracking-wider">
                <SquareQ>IMPACT STUDY // GENERAL CONSTRUCTION</SquareQ>
              </div>
              <div className="aspect-video bg-gray-800 rounded overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-800"></div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-6">
              <SquareQ>Quick Links</SquareQ>
            </h3>
            <div className="space-y-3">
              <a href="#" className="block text-gray-400 hover:text-white transition-colors text-sm">
                <SquareQ>About 1iQ</SquareQ>
              </a>
              <a href="#" className="block text-gray-400 hover:text-white transition-colors text-sm">
                <SquareQ>Blog</SquareQ>
              </a>
              <a href="#" className="block text-gray-400 hover:text-white transition-colors text-sm">
                <SquareQ>Investor Relations</SquareQ>
              </a>
              <a href="#" className="block text-gray-400 hover:text-white transition-colors text-sm">
                <SquareQ>Letters from the CEO</SquareQ>
              </a>
              <a href="#" className="block text-gray-400 hover:text-white transition-colors text-sm">
                <SquareQ>Privacy & Civil Liberties</SquareQ>
              </a>
              <a href="#" className="block text-gray-400 hover:text-white transition-colors text-sm">
                <SquareQ>Information Security</SquareQ>
              </a>
              <a href="#" className="block text-gray-400 hover:text-white transition-colors text-sm">
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
