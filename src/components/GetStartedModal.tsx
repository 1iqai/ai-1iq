
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface GetStartedModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const GetStartedModal = ({ isOpen, onClose }: GetStartedModalProps) => {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const navigate = useNavigate();
  
  // Same video sources as Hero component
  const videoSources = [
    "https://www.dropbox.com/scl/fi/am3hd59bu19kow7z6ab6d/istockphoto-1556270667-640_adpp_is.mp4?rlkey=bhe9e0qjfmawy5ug4jizo6mmz&dl=1",
    "https://www.dropbox.com/scl/fi/magy7156bh6q900e6vkbg/8328042-uhd_3840_2160_25fps.mp4?rlkey=csegaoa737hfv4ej5kjgdqxfh&dl=1",
    "https://www.dropbox.com/scl/fi/b6odzp4ki9q7d9u34hjwt/istockphoto-2156301199-640_adpp_is.mp4?rlkey=wubnwer2cpru6zyzy9jwl3se6&dl=1",
    "https://www.dropbox.com/scl/fi/q1bgsagocslaicd3aswok/3195703-uhd_3840_2160_25fps.mp4?rlkey=zui6xgbsxnd2t0hye72vjltvw&dl=1",
    "https://www.dropbox.com/scl/fi/riooctlcde9453q2jg6u0/2835998-uhd_3840_2160_24fps.mp4?rlkey=n531908bbghhtlwrjisy67lfy&dl=1",
  ];

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const isMobileDevice = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/.test(userAgent);
      const isSmallScreen = window.innerWidth <= 768;
      setIsMobile(isMobileDevice || isSmallScreen);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Video cycling logic
  useEffect(() => {
    if (isOpen && videoSources.length > 1 && !videoError) {
      const interval = setInterval(() => {
        setCurrentVideoIndex((prevIndex) => 
          (prevIndex + 1) % videoSources.length
        );
      }, 10000);

      return () => clearInterval(interval);
    }
  }, [isOpen, videoSources.length, videoError]);

  // Video event handlers
  const handleVideoLoad = () => {
    console.log('Modal video loaded successfully');
    setVideoLoaded(true);
    setVideoError(false);
  };

  const handleVideoError = (error: any) => {
    console.error('Modal video failed to load:', error);
    setVideoError(true);
  };

  const handleNavigation = (path: string) => {
    onClose();
    navigate(path);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Left side - Video Background with Mobile Optimization */}
      <div className="w-1/2 relative overflow-hidden">
        {!videoError && videoSources.map((src, index) => (
          <video
            key={`modal-${index}-${src}`}
            autoPlay={!isMobile}
            loop
            muted
            playsInline
            preload={isMobile ? "metadata" : "auto"}
            webkit-playsinline="true"
            x-webkit-airplay="allow"
            onLoadedData={handleVideoLoad}
            onError={handleVideoError}
            className={`absolute w-full h-full object-cover transition-opacity duration-1000 ${
              index === currentVideoIndex ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              WebkitTransform: 'translateZ(0)',
              transform: 'translateZ(0)',
            }}
          >
            <source src={src} type="video/mp4" />
          </video>
        ))}
        
        {/* Fallback Background for Mobile or Video Errors */}
        {(videoError || (isMobile && !videoLoaded)) && (
          <div 
            className="absolute inset-0 bg-gradient-to-br from-slate-800 via-slate-900 to-black"
            style={{
              backgroundImage: `
                radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
                radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.15) 0%, transparent 50%),
                radial-gradient(circle at 40% 40%, rgba(120, 200, 255, 0.1) 0%, transparent 50%)
              `
            }}
          />
        )}
        
        <div className="absolute inset-0 bg-black/30"></div>
      </div>

      {/* Right side - Content */}
      <div className="w-1/2 bg-white flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-8">
          <div className="text-sm text-gray-500 uppercase tracking-wider">
            CONTACT / DEMO REQUEST + PARTNERSHIP INQUIRY
          </div>
          <button 
            onClick={onClose}
            className="text-gray-600 hover:text-gray-800 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col justify-center px-8 pb-16">
          <div className="max-w-lg">
            <h1 className="text-4xl font-light text-gray-900 leading-tight mb-8">
              Interested in solving your problems with 1iQ software?
            </h1>
            
            <div className="space-y-6">
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
        </div>
      </div>
    </div>
  );
};

export default GetStartedModal;
