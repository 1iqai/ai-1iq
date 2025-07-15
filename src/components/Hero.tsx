
import { ArrowDown } from "lucide-react";
import { useState, useEffect } from "react";
import SquareQ from "./SquareQ";

const Hero = () => {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  
  // Optimized video sources with better mobile compatibility
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
    if (videoSources.length > 1 && !videoError) {
      const interval = setInterval(() => {
        setCurrentVideoIndex((prevIndex) => 
          (prevIndex + 1) % videoSources.length
        );
      }, 10000);

      return () => clearInterval(interval);
    }
  }, [videoSources.length, videoError]);

  // Video event handlers
  const handleVideoLoad = () => {
    console.log('Video loaded successfully');
    setVideoLoaded(true);
    setVideoError(false);
  };

  const handleVideoError = (error: any) => {
    console.error('Video failed to load:', error);
    setVideoError(true);
  };

  const handleVideoPlay = () => {
    console.log('Video started playing');
  };

  return (
    <section className="relative bg-slate-900 px-4 sm:px-6 min-h-screen flex items-center overflow-hidden">
      {/* Video Background with Mobile Optimization */}
      <div className="absolute inset-0 z-0">
        {!videoError && videoSources.map((src, index) => (
          <video
            key={`${index}-${src}`}
            autoPlay={!isMobile}
            loop
            muted
            playsInline
            preload={isMobile ? "metadata" : "auto"}
            webkit-playsinline="true"
            x-webkit-airplay="allow"
            onLoadedData={handleVideoLoad}
            onError={handleVideoError}
            onPlay={handleVideoPlay}
            className={`absolute w-full h-full object-cover transition-opacity duration-1000 ${
              index === currentVideoIndex ? 'opacity-70' : 'opacity-0'
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
        
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto w-full flex items-center justify-center">
        {/* Centered Content with responsive text sizing */}
        <div className="text-center max-w-4xl px-4">
          <h1 className="font-inter text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-normal text-white mb-8 sm:mb-12 leading-tight tracking-normal">
            <SquareQ>Data-Powered Automation</SquareQ>
            <br />
            <SquareQ>for Every Decision</SquareQ>
          </h1>
        </div>
      </div>

      {/* Scroll to Explore - positioned at bottom center */}
      <div className="absolute bottom-6 sm:bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex flex-col items-center">
        <span className="text-white text-base sm:text-lg font-inter mb-2 opacity-80">
          <SquareQ>Scroll to Explore</SquareQ>
        </span>
        <ArrowDown className="w-5 h-5 sm:w-6 sm:h-6 text-white animate-bounce-down opacity-80" />
      </div>
    </section>
  );
};

export default Hero;
