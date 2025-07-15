
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
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 bg-white">
        <div className="max-w-4xl mx-auto text-center space-y-6 sm:space-y-8 lg:space-y-12">
          <div className="flex flex-col space-y-4 sm:space-y-6 items-center">
            {/* Primary CTA Button - Enhanced for mobile */}
            <button 
              onClick={() => setIsDemoSidebarOpen(true)}
              className="group bg-gray-100 text-gray-900 px-6 sm:px-8 lg:px-12 py-4 sm:py-5 lg:py-6 text-base sm:text-lg lg:text-xl font-medium hover:bg-gray-200 active:bg-gray-300 transition-all duration-200 flex items-center gap-3 w-full sm:w-auto justify-center min-h-[56px] rounded-xl sm:rounded-lg touch-manipulation shadow-sm hover:shadow-md"
            >
              <SquareQ>Request a Demo</SquareQ>
              <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-1 transition-transform" />
            </button>
            
            {/* Secondary Navigation Links - Better mobile layout */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 lg:gap-6 w-full sm:w-auto">
              <button 
                onClick={() => navigate('/1iq-field')}
                className="text-gray-600 hover:text-gray-900 active:text-gray-700 transition-colors text-sm sm:text-base lg:text-lg font-medium underline underline-offset-4 min-h-[44px] flex items-center justify-center px-4 py-3 hover:bg-gray-50 active:bg-gray-100 rounded-lg touch-manipulation"
              >
                <SquareQ>1iQ Field</SquareQ>
              </button>

              <button 
                onClick={() => navigate('/1iq-core')}
                className="text-gray-600 hover:text-gray-900 active:text-gray-700 transition-colors text-sm sm:text-base lg:text-lg font-medium underline underline-offset-4 min-h-[44px] flex items-center justify-center px-4 py-3 hover:bg-gray-50 active:bg-gray-100 rounded-lg touch-manipulation"
              >
                <SquareQ>1iQ Core</SquareQ>
              </button>

              <button 
                onClick={() => navigate('/1iq-intel')}
                className="text-gray-600 hover:text-gray-900 active:text-gray-700 transition-colors text-sm sm:text-base lg:text-lg font-medium underline underline-offset-4 min-h-[44px] flex items-center justify-center px-4 py-3 hover:bg-gray-50 active:bg-gray-100 rounded-lg touch-manipulation"
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
