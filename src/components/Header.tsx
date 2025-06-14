
import { Button } from "@/components/ui/button";
import { Search, Menu } from "lucide-react";
import { useState, useEffect } from "react";

const Header = () => {
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
    if (videoSources.length > 1) {
      const interval = setInterval(() => {
        setCurrentVideoIndex((prevIndex) => 
          (prevIndex + 1) % videoSources.length
        );
      }, 10000); // Change video every 10 seconds

      return () => clearInterval(interval);
    }
  }, [videoSources.length]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 overflow-hidden py-3 px-6 border-b border-white/20">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        {videoSources.map((src, index) => (
          <video
            key={index}
            autoPlay
            loop
            muted
            playsInline
            className={`absolute w-full h-full object-cover transition-opacity duration-1000 ${
              index === currentVideoIndex ? 'opacity-50' : 'opacity-0'
            }`}
          >
            <source src={src} type="video/mp4" />
            <div className="w-full h-full bg-slate-800"></div>
          </video>
        ))}
        {/* Backdrop blur overlay */}
        <div className="absolute inset-0 bg-white/10 backdrop-blur-md"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 flex items-center justify-center">
            <img 
              src="/lovable-uploads/b5b303f6-c418-4625-bb79-dc96bb3cfbe6.png" 
              alt="1iQ Logo" 
              className="w-8 h-8 object-contain"
            />
          </div>
          <span className="text-xl font-medium text-white tracking-tight">1iQ</span>
        </div>
        
        <div className="flex items-center space-x-10">
          <Button 
            variant="outline" 
            size="sm"
            className="bg-white hover:bg-gray-800 text-gray-700 hover:text-white border-2 border-gray-400 hover:border-gray-800 rounded-none px-6 py-2 font-medium text-sm transition-all duration-200 h-10"
          >
            Get Started
          </Button>
          <div className="flex">
            <Button 
              variant="ghost" 
              size="icon"
              className="h-10 w-10 text-white hover:text-white hover:bg-gray-800 border-2 border-gray-400 hover:border-gray-800 rounded-none transition-all duration-200 border-r-0"
            >
              <Search className="h-5 w-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              className="h-10 w-10 text-white hover:text-white hover:bg-gray-800 border-2 border-gray-400 hover:border-gray-800 rounded-none transition-all duration-200"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
