import React from 'react';
import { X, ArrowRight, ExternalLink } from 'lucide-react';
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
        className="fixed inset-0 bg-black/90 backdrop-blur-sm z-40 transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Side Panel */}
      <div className="fixed right-0 top-0 h-full w-full bg-gradient-hero z-50 transform transition-transform duration-300 ease-in-out text-foreground overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-primary/20">
          <span className="text-xl font-semibold text-foreground tracking-tight">1iQ</span>
          <button 
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors p-2 rounded-lg hover:bg-white/10"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-12">
          {/* Main Navigation */}
          <div className="space-y-8">
            {/* Generate Alpha Section */}
            <div className="space-y-6">
              <h2 className="text-sm text-accent-foreground uppercase tracking-wider font-medium">
                Generate Alpha
              </h2>
              
              <button 
                onClick={() => handleNavigation('/get-started')}
                className="flex items-center justify-between w-full text-left py-3 px-4 rounded-lg hover:bg-white/10 transition-all duration-200 group"
              >
                <span className="text-lg font-light text-foreground">Get Started</span>
                <ArrowRight size={16} className="text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all" />
              </button>
            </div>

            {/* Our Platforms Section */}
            <div className="space-y-6">
              <h2 className="text-sm text-accent-foreground uppercase tracking-wider font-medium">
                Our Platforms
              </h2>
              
              <div className="space-y-2">
                <button 
                  onClick={() => handleNavigation('/1iq-core')}
                  className="flex items-center justify-between w-full text-left py-3 px-4 rounded-lg hover:bg-white/10 transition-all duration-200 group"
                >
                  <span className="text-lg font-light text-foreground">1iQ Core</span>
                  <ArrowRight size={16} className="text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all" />
                </button>
                <button 
                  onClick={() => handleNavigation('/1iq-field')}
                  className="flex items-center justify-between w-full text-left py-3 px-4 rounded-lg hover:bg-white/10 transition-all duration-200 group"
                >
                  <span className="text-lg font-light text-foreground">1iQ Field</span>
                  <ArrowRight size={16} className="text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all" />
                </button>
                <button 
                  onClick={() => handleNavigation('/1iq-intel')}
                  className="flex items-center justify-between w-full text-left py-3 px-4 rounded-lg hover:bg-white/10 transition-all duration-200 group"
                >
                  <span className="text-lg font-light text-foreground">1iQ Intel</span>
                  <ArrowRight size={16} className="text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all" />
                </button>
              </div>
            </div>

            {/* Additional Navigation */}
            <div className="space-y-6">
              <h2 className="text-sm text-accent-foreground uppercase tracking-wider font-medium">
                Company
              </h2>
              
              <div className="space-y-2">
                <button 
                  onClick={() => handleNavigation('/contact-sales')}
                  className="flex items-center justify-between w-full text-left py-3 px-4 rounded-lg hover:bg-white/10 transition-all duration-200 group"
                >
                  <span className="text-lg font-light text-foreground">Contact Sales</span>
                  <ArrowRight size={16} className="text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all" />
                </button>
                <button 
                  onClick={() => handleNavigation('/partnership-inquiry')}
                  className="flex items-center justify-between w-full text-left py-3 px-4 rounded-lg hover:bg-white/10 transition-all duration-200 group"
                >
                  <span className="text-lg font-light text-foreground">Partnerships</span>
                  <ArrowRight size={16} className="text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all" />
                </button>
                <button 
                  onClick={() => window.open('https://careers.example.com', '_blank')}
                  className="flex items-center justify-between w-full text-left py-3 px-4 rounded-lg hover:bg-white/10 transition-all duration-200 group"
                >
                  <span className="text-lg font-light text-foreground">Careers</span>
                  <ExternalLink size={16} className="text-muted-foreground group-hover:text-foreground transition-colors" />
                </button>
              </div>
            </div>

            {/* Resources Section */}
            <div className="space-y-6">
              <h2 className="text-sm text-accent-foreground uppercase tracking-wider font-medium">
                Resources
              </h2>
              
              <div className="space-y-2">
                <button 
                  onClick={() => handleNavigation('/learn-more')}
                  className="flex items-center justify-between w-full text-left py-3 px-4 rounded-lg hover:bg-white/10 transition-all duration-200 group"
                >
                  <span className="text-lg font-light text-foreground">Newsroom</span>
                  <ArrowRight size={16} className="text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all" />
                </button>
                <button 
                  onClick={() => window.open('https://docs.example.com', '_blank')}
                  className="flex items-center justify-between w-full text-left py-3 px-4 rounded-lg hover:bg-white/10 transition-all duration-200 group"
                >
                  <span className="text-lg font-light text-foreground">Documentation</span>
                  <ExternalLink size={16} className="text-muted-foreground group-hover:text-foreground transition-colors" />
                </button>
                <button 
                  onClick={() => handleNavigation('/schedule-demo')}
                  className="flex items-center justify-between w-full text-left py-3 px-4 rounded-lg hover:bg-white/10 transition-all duration-200 group"
                >
                  <span className="text-lg font-light text-foreground">Schedule Demo</span>
                  <ArrowRight size={16} className="text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all" />
                </button>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="border-t border-primary/20 pt-8">
            <div className="glass-effect rounded-xl p-6 border border-primary/10">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Ready to get started?
              </h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Transform your operations with 1iQ's intelligent platforms.
              </p>
              <div className="space-y-3">
                <button 
                  onClick={() => handleNavigation('/get-started')}
                  className="w-full premium-button py-3 px-6 text-sm font-medium rounded-lg transition-all duration-200"
                >
                  Get Started
                </button>
                <button 
                  onClick={() => handleNavigation('/schedule-demo')}
                  className="w-full border border-primary/20 hover:border-primary/40 bg-white/10 hover:bg-white/20 text-foreground py-3 px-6 text-sm font-medium rounded-lg transition-all duration-200"
                >
                  Schedule Demo
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NavigationMenu;