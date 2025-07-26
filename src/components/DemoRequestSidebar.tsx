
import React from 'react';
import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface DemoRequestSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const DemoRequestSidebar = ({ isOpen, onClose }: DemoRequestSidebarProps) => {
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
        className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Side Panel */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 transform transition-transform duration-300 ease-in-out shadow-2xl">
        {/* Header */}
        <div className="flex justify-between items-start p-6 border-b border-gray-200">
          <div className="text-sm text-gray-500 uppercase tracking-wider">
            CONTACT / DEMO REQUEST + PARTNERSHIP INQUIRY
          </div>
          <button 
            onClick={onClose}
            className="text-gray-600 hover:text-gray-800 transition-colors p-1"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-8">
          <div>
            <h1 className="text-2xl font-light text-gray-900 leading-tight">
              Interested in solving your problems with 1iQ software?
            </h1>
          </div>
          
          <div className="space-y-4">
            <button 
              onClick={() => handleNavigation('/schedule-demo')}
              className="w-full bg-black text-white py-4 px-6 text-left hover:bg-gray-800 transition-colors font-medium"
            >
              Schedule a Demo
            </button>
            <button 
              onClick={() => handleNavigation('/contact-sales')}
              className="w-full border border-gray-300 text-gray-900 py-4 px-6 text-left hover:bg-gray-50 transition-colors font-medium"
            >
              Contact Sales
            </button>
            <button 
              onClick={() => handleNavigation('/partnership-inquiry')}
              className="w-full border border-gray-300 text-gray-900 py-4 px-6 text-left hover:bg-gray-50 transition-colors font-medium"
            >
              Partnership Inquiry
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default DemoRequestSidebar;
