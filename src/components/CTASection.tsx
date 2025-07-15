
import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SquareQ from './SquareQ';
import DemoRequestSidebar from './DemoRequestSidebar';

const CTASection = () => {
  const [isDemoSidebarOpen, setIsDemoSidebarOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 bg-white">
        <div className="max-w-4xl mx-auto text-center space-y-8 sm:space-y-12">
          <div className="flex flex-col space-y-4 sm:space-y-6 items-center">
            {/* Primary CTA Button */}
            <button 
              onClick={() => setIsDemoSidebarOpen(true)}
              className="group bg-gray-100 text-gray-900 px-6 sm:px-8 lg:px-10 py-4 sm:py-5 text-lg sm:text-xl font-medium hover:bg-gray-200 transition-all duration-200 flex items-center gap-3 w-full sm:w-auto justify-center min-h-[56px] rounded-lg sm:rounded-none"
            >
              <SquareQ>Request a Demo</SquareQ>
              <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-1 transition-transform" />
            </button>
            
            {/* Secondary Navigation Links */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 lg:gap-8 w-full sm:w-auto">
              <button 
                onClick={() => navigate('/1iq-field')}
                className="text-gray-600 hover:text-gray-900 transition-colors text-base sm:text-lg font-medium underline underline-offset-4 min-h-[44px] flex items-center justify-center px-4 py-2 hover:bg-gray-50 rounded-lg sm:rounded-none sm:bg-transparent sm:hover:bg-transparent"
              >
                <SquareQ>1iQ Field</SquareQ>
              </button>

              <button 
                onClick={() => navigate('/1iq-core')}
                className="text-gray-600 hover:text-gray-900 transition-colors text-base sm:text-lg font-medium underline underline-offset-4 min-h-[44px] flex items-center justify-center px-4 py-2 hover:bg-gray-50 rounded-lg sm:rounded-none sm:bg-transparent sm:hover:bg-transparent"
              >
                <SquareQ>1iQ Core</SquareQ>
              </button>

              <button 
                onClick={() => navigate('/1iq-intel')}
                className="text-gray-600 hover:text-gray-900 transition-colors text-base sm:text-lg font-medium underline underline-offset-4 min-h-[44px] flex items-center justify-center px-4 py-2 hover:bg-gray-50 rounded-lg sm:rounded-none sm:bg-transparent sm:hover:bg-transparent"
              >
                <SquareQ>1iQ Intel</SquareQ>
              </button>
            </div>
          </div>
        </div>
      </section>

      <DemoRequestSidebar 
        isOpen={isDemoSidebarOpen} 
        onClose={() => setIsDemoSidebarOpen(false)} 
      />
    </>
  );
};

export default CTASection;
