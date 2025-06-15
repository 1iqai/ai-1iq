
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface GetStartedModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const GetStartedModal = ({ isOpen, onClose }: GetStartedModalProps) => {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  
  // Same video sources as Hero component
  const videoSources = [
    "https://www.dropbox.com/scl/fi/am3hd59bu19kow7z6ab6d/istockphoto-1556270667-640_adpp_is.mp4?rlkey=bhe9e0qjfmawy5ug4jizo6mmz&dl=1",
    "https://www.dropbox.com/scl/fi/magy7156bh6q900e6vkbg/8328042-uhd_3840_2160_25fps.mp4?rlkey=csegaoa737hfv4ej5kjgdqxfh&dl=1",
    "https://www.dropbox.com/scl/fi/b6odzp4ki9q7d9u34hjwt/istockphoto-2156301199-640_adpp_is.mp4?rlkey=wubnwer2cpru6zyzy9jwl3se6&dl=1",
    "https://www.dropbox.com/scl/fi/q1bgsagocslaicd3aswok/3195703-uhd_3840_2160_25fps.mp4?rlkey=zui6xgbsxnd2t0hye72vjltvw&dl=1",
    "https://www.dropbox.com/scl/fi/riooctlcde9453q2jg6u0/2835998-uhd_3840_2160_24fps.mp4?rlkey=n531908bbghhtlwrjisy67lfy&dl=1",
  ];

  useEffect(() => {
    if (isOpen && videoSources.length > 1) {
      const interval = setInterval(() => {
        setCurrentVideoIndex((prevIndex) => 
          (prevIndex + 1) % videoSources.length
        );
      }, 10000);

      return () => clearInterval(interval);
    }
  }, [isOpen, videoSources.length]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Left side - Video Background */}
      <div className="w-1/2 relative overflow-hidden">
        {videoSources.map((src, index) => (
          <video
            key={index}
            autoPlay
            loop
            muted
            playsInline
            className={`absolute w-full h-full object-cover transition-opacity duration-1000 ${
              index === currentVideoIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <source src={src} type="video/mp4" />
          </video>
        ))}
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
              <p className="text-gray-700 leading-relaxed">
                Our team of experts is ready to help you transform your data into actionable insights. 
                Let's discuss how 1iQ can accelerate your decision-making process.
              </p>
              
              <div className="space-y-4">
                <button className="w-full bg-black text-white py-4 px-6 text-left hover:bg-gray-800 transition-colors">
                  Schedule a Demo
                </button>
                <button className="w-full border border-gray-300 text-gray-900 py-4 px-6 text-left hover:bg-gray-50 transition-colors">
                  Contact Sales
                </button>
                <button className="w-full border border-gray-300 text-gray-900 py-4 px-6 text-left hover:bg-gray-50 transition-colors">
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
