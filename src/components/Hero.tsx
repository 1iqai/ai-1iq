
import { ArrowDown } from "lucide-react";
import { useState, useEffect } from "react";
import ScrollAnimatedText from "./ScrollAnimatedText";

const Hero = () => {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  
  // Array of video sources - you can add more video URLs here
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
    <section className="relative bg-slate-900 px-6 min-h-screen flex items-center overflow-hidden">
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
              index === currentVideoIndex ? 'opacity-70' : 'opacity-0'
            }`}
          >
            <source src={src} type="video/mp4" />
            {/* Fallback for browsers that don't support video */}
            <div className="w-full h-full bg-slate-800"></div>
          </video>
        ))}
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto w-full flex items-center justify-center">
        {/* Centered Content matching reference layout */}
        <div className="text-center max-w-4xl">
          <ScrollAnimatedText 
            as="h1" 
            className="font-inter text-6xl lg:text-7xl xl:text-8xl font-normal text-white mb-12 leading-tight tracking-normal"
            speed={0.3}
            direction="up"
          >
            Data-Powered Automation
            <br />
            for Every Decision
          </ScrollAnimatedText>
        </div>
      </div>

      {/* Scroll to Explore - positioned at bottom center */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex flex-col items-center">
        <ScrollAnimatedText 
          as="span" 
          className="text-white text-lg font-inter mb-2 opacity-80"
          speed={0.2}
          direction="down"
        >
          Scroll to Explore
        </ScrollAnimatedText>
        <ScrollAnimatedText speed={0.4} direction="up">
          <ArrowDown className="w-6 h-6 text-white animate-bounce-down opacity-80" />
        </ScrollAnimatedText>
      </div>
    </section>
  );
};

export default Hero;
