import React from 'react';
import { X, ArrowRight, ExternalLink, Sparkles, Users, Building2, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import logoImage from '@/assets/1iq-logo.png';

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
        className="fixed inset-0 bg-black/60 backdrop-blur-lg z-40 transition-all duration-500"
        onClick={onClose}
      />
      
      {/* Side Panel */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-background/95 backdrop-blur-xl z-50 transform transition-all duration-500 ease-in-out border-l border-border/50 shadow-2xl overflow-y-auto">
        
        {/* Header */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-primary/10"></div>
          <div className="relative flex justify-between items-center p-6 border-b border-border/30">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center overflow-hidden">
                <img src="/lovable-uploads/4bf04b70-cf1b-4ce5-a342-4ac107a5f076.png" alt="1iQ Logo" className="w-full h-full object-contain" />
              </div>
              <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">1iQ</span>
            </div>
            <button 
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground transition-colors p-2 rounded-xl hover:bg-accent/50"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-10">
          
          {/* Generate Alpha Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-6 h-6 bg-gradient-primary rounded-md flex items-center justify-center">
                <Sparkles size={14} className="text-white" />
              </div>
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                CONNECT WITH US
              </h2>
            </div>
            
            <div className="premium-card p-1 hover-lift">
              <button 
                onClick={() => handleNavigation('/get-started')}
                className="flex items-center justify-between w-full text-left p-4 rounded-lg hover:bg-gradient-primary/5 transition-all duration-300 group"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-primary/10 rounded-lg flex items-center justify-center group-hover:bg-gradient-primary/20 transition-all">
                    <ArrowRight size={16} className="text-primary" />
                  </div>
                  <div>
                    <span className="text-base font-medium text-foreground block">Get Started</span>
                    <span className="text-sm text-muted-foreground">Begin your journey</span>
                  </div>
                </div>
                <ArrowRight size={16} className="text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </button>
            </div>
          </div>

          {/* Our Platforms Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-6 h-6 bg-brand-indigo rounded-md flex items-center justify-center">
                <Building2 size={14} className="text-white" />
              </div>
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                Our Platforms
              </h2>
            </div>
            
            <div className="space-y-3">
              {[
                { name: '1iQ Core & Field', path: '/1iq-platform', desc: 'Complete operations platform' },
                { name: '1iQ Intel', path: '/1iq-intel', desc: 'Intelligence & analytics' }
              ].map((platform, index) => (
                <div key={platform.name} className="premium-card p-1 hover-lift">
                  <button 
                    onClick={() => handleNavigation(platform.path)}
                    className="flex items-center justify-between w-full text-left p-4 rounded-lg hover:bg-gradient-primary/5 transition-all duration-300 group"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-primary/10 rounded-lg flex items-center justify-center group-hover:bg-gradient-primary/20 transition-all">
                        <span className="text-primary text-sm font-bold">{index + 1}</span>
                      </div>
                      <div>
                        <span className="text-base font-medium text-foreground block">{platform.name}</span>
                        <span className="text-sm text-muted-foreground">{platform.desc}</span>
                      </div>
                    </div>
                    <ArrowRight size={16} className="text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Company Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-6 h-6 bg-brand-purple rounded-md flex items-center justify-center">
                <Users size={14} className="text-white" />
              </div>
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                Company
              </h2>
            </div>
            
            <div className="space-y-3">
              {[
                { name: 'Contact Sales', path: '/contact-sales', desc: 'Speak with our team', external: false },
                { name: 'Partnerships', path: '/partnership-inquiry', desc: 'Collaboration opportunities', external: false }
              ].map((item) => (
                <div key={item.name} className="premium-card p-1 hover-lift">
                  <button 
                    onClick={() => item.external ? window.open(item.path, '_blank') : handleNavigation(item.path)}
                    className="flex items-center justify-between w-full text-left p-4 rounded-lg hover:bg-gradient-primary/5 transition-all duration-300 group"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-primary/10 rounded-lg flex items-center justify-center group-hover:bg-gradient-primary/20 transition-all">
                        {item.external ? (
                          <ExternalLink size={16} className="text-primary" />
                        ) : (
                          <ArrowRight size={16} className="text-primary" />
                        )}
                      </div>
                      <div>
                        <span className="text-base font-medium text-foreground block">{item.name}</span>
                        <span className="text-sm text-muted-foreground">{item.desc}</span>
                      </div>
                    </div>
                    {item.external ? (
                      <ExternalLink size={16} className="text-muted-foreground group-hover:text-primary transition-colors" />
                    ) : (
                      <ArrowRight size={16} className="text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Resources Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-6 h-6 bg-success rounded-md flex items-center justify-center">
                <BookOpen size={14} className="text-white" />
              </div>
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                Resources
              </h2>
            </div>
            
            <div className="space-y-3">
              {[
                { name: 'Newsroom', path: '/learn-more', desc: 'Latest updates & insights', external: false }
              ].map((item) => (
                <div key={item.name} className="premium-card p-1 hover-lift">
                  <button 
                    onClick={() => item.external ? window.open(item.path, '_blank') : handleNavigation(item.path)}
                    className="flex items-center justify-between w-full text-left p-4 rounded-lg hover:bg-gradient-primary/5 transition-all duration-300 group"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-primary/10 rounded-lg flex items-center justify-center group-hover:bg-gradient-primary/20 transition-all">
                        {item.external ? (
                          <ExternalLink size={16} className="text-primary" />
                        ) : (
                          <ArrowRight size={16} className="text-primary" />
                        )}
                      </div>
                      <div>
                        <span className="text-base font-medium text-foreground block">{item.name}</span>
                        <span className="text-sm text-muted-foreground">{item.desc}</span>
                      </div>
                    </div>
                    {item.external ? (
                      <ExternalLink size={16} className="text-muted-foreground group-hover:text-primary transition-colors" />
                    ) : (
                      <ArrowRight size={16} className="text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="border-t border-border/30 pt-8">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-primary/10 border border-primary/20 p-6 backdrop-blur-sm">
              <div className="absolute inset-0 bg-gradient-primary/5"></div>
              <div className="relative">
                <div className="flex items-center space-x-2 mb-4">
                  <Sparkles size={20} className="text-primary" />
                  <h3 className="text-lg font-bold text-foreground">
                    Ready to transform?
                  </h3>
                </div>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Join thousands of organizations using 1iQ to revolutionize their operations.
                </p>
                <div className="space-y-3">
                  <button 
                    onClick={() => handleNavigation('/get-started')}
                    className="w-full premium-button py-4 px-6 text-sm font-semibold rounded-xl transition-all duration-300 hover:shadow-glow"
                  >
                    Start Your Journey
                  </button>
                  <button 
                    onClick={() => handleNavigation('/schedule-demo')}
                    className="w-full border border-primary/30 hover:border-primary/50 bg-background/80 hover:bg-background/90 text-foreground py-4 px-6 text-sm font-semibold rounded-xl transition-all duration-300 backdrop-blur-sm"
                  >
                    Schedule Demo
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NavigationMenu;