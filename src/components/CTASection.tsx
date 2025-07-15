
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
      <section className="py-24 px-6 bg-white">
        <div className="max-w-4xl mx-auto text-center space-y-12">
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <button 
              onClick={() => setIsDemoSidebarOpen(true)}
              className="group bg-gray-100 text-gray-900 px-10 py-5 text-xl font-medium hover:bg-gray-200 transition-all duration-200 flex items-center gap-3"
            >
              <SquareQ>Request a Demo</SquareQ>
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </button>
            
            <button 
              onClick={() => navigate('/1iq-field')}
              className="text-gray-600 hover:text-gray-900 transition-colors text-lg font-medium underline underline-offset-4"
            >
              <SquareQ>1iQ Field</SquareQ>
            </button>

            <button 
              onClick={() => navigate('/1iq-core')}
              className="text-gray-600 hover:text-gray-900 transition-colors text-lg font-medium underline underline-offset-4"
            >
              <SquareQ>1iQ Core</SquareQ>
            </button>
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
