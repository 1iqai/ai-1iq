
import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import SquareQ from './SquareQ';
import DemoRequestSidebar from './DemoRequestSidebar';

const CTASection = () => {
  const [isDemoSidebarOpen, setIsDemoSidebarOpen] = useState(false);

  return (
    <>
      <section className="py-24 px-6 bg-white">
        <div className="max-w-4xl mx-auto text-center space-y-12">
          <div className="space-y-6">
            <h2 className="text-5xl lg:text-6xl font-light text-gray-900 leading-tight">
              <SquareQ>Ready to transform your construction operations?</SquareQ>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              <SquareQ>Join thousands of construction professionals who trust 1iQ to optimize their projects and drive success.</SquareQ>
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <button 
              onClick={() => setIsDemoSidebarOpen(true)}
              className="group bg-gray-100 text-gray-900 px-8 py-4 text-lg font-medium hover:bg-gray-200 transition-all duration-200 flex items-center gap-3"
            >
              <SquareQ>Request a Demo</SquareQ>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            
            <a 
              href="#platforms" 
              className="text-gray-600 hover:text-gray-900 transition-colors text-lg font-medium underline underline-offset-4"
            >
              <SquareQ>Learn More About Our Platforms</SquareQ>
            </a>
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
