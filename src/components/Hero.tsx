
import { ArrowRight, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [videoError, setVideoError] = useState(false);
  
  // Same video sources as GetStartedModal
  const videoSources = [
    "https://www.dropbox.com/scl/fi/am3hd59bu19kow7z6ab6d/istockphoto-1556270667-640_adpp_is.mp4?rlkey=bhe9e0qjfmawy5ug4jizo6mmz&dl=1",
    "https://www.dropbox.com/scl/fi/magy7156bh6q900e6vkbg/8328042-uhd_3840_2160_25fps.mp4?rlkey=csegaoa737hfv4ej5kjgdqxfh&dl=1",
    "https://www.dropbox.com/scl/fi/b6odzp4ki9q7d9u34hjwt/istockphoto-2156301199-640_adpp_is.mp4?rlkey=wubnwer2cpru6zyzy9jwl3se6&dl=1",
    "https://www.dropbox.com/scl/fi/q1bgsagocslaicd3aswok/3195703-uhd_3840_2160_25fps.mp4?rlkey=zui6xgbsxnd2t0hye72vjltvw&dl=1",
    "https://www.dropbox.com/scl/fi/riooctlcde9453q2jg6u0/2835998-uhd_3840_2160_24fps.mp4?rlkey=n531908bbghhtlwrjisy67lfy&dl=1",
  ];

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

  const handleVideoError = () => {
    setVideoError(true);
  };

  return (
    <section className="min-h-screen bg-gradient-hero flex items-center relative overflow-hidden pt-20">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-blue/5 via-transparent to-brand-indigo/5"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(59,130,246,0.1),transparent_50%)]"></div>
      
      {/* Content Container */}
      <div className="container-custom relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[calc(100vh-5rem)] py-8">
          
          {/* Left Content */}
          <div className="space-y-6 animate-fade-in">
            <div className="space-y-6">
              
              <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-[1.1] tracking-tight">
                <span className="block text-foreground mb-2 drop-shadow-sm">
                  Transform Your
                </span>
                <span className="block gradient-text mb-2 drop-shadow-lg">
                  Decision Making
                </span>
                <span className="block text-foreground mb-2 drop-shadow-sm">
                  with AI-Powered
                </span>
                <span className="block text-foreground drop-shadow-sm">
                  Automation
                </span>
              </h1>
              
              <p className="text-lg lg:text-xl text-muted-foreground max-w-2xl leading-relaxed font-light drop-shadow-sm">
                1iQ delivers mission-critical execution for complex projects, driving precision and performance across construction, infrastructure, and enterprise operations.
              </p>
            </div>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button 
                size="lg" 
                className="group text-base px-8 py-3 premium-button shadow-glow hover:shadow-glow hover:scale-[1.02] transition-all duration-300 font-semibold"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onClick={() => navigate('/get-started')}
              >
                Get Started
                <ArrowRight className={`ml-2 h-5 w-5 transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}`} />
              </Button>
              
            </div>
            
            {/* Trust Indicators */}
            <div className="pt-6 space-y-3">
              <p className="text-sm text-muted-foreground font-medium">
                Trusted by 500+ organizations worldwide
              </p>
            </div>
          </div>
          
          {/* Right Content - Video Dashboard Preview */}
          <div className="relative lg:h-[400px] animate-slide-up">
            <div className="absolute inset-0 bg-gradient-primary/10 rounded-3xl backdrop-blur-sm"></div>
            <div className="absolute -inset-6 bg-gradient-primary/5 rounded-[3rem] blur-2xl"></div>
            <div className="relative glass-effect rounded-3xl p-8 border border-primary/10 overflow-hidden shadow-2xl">
              <div className="bg-white/95 rounded-2xl p-4 shadow-inner">
                {!videoError ? (
                  <div className="relative">
                    {videoSources.map((src, index) => (
                      <video
                        key={`hero-${index}-${src}`}
                        autoPlay
                        loop
                        muted
                        playsInline
                        onError={handleVideoError}
                        className={`w-full h-auto rounded-xl shadow-lg transform hover:scale-[1.02] transition-all duration-500 ${
                          index === currentVideoIndex ? 'opacity-100' : 'opacity-0 absolute top-0 left-0'
                        }`}
                      >
                        <source src={src} type="video/mp4" />
                      </video>
                    ))}
                  </div>
                ) : (
                  <img
                    src="/lovable-uploads/4ff089d9-32f4-4316-aacc-8ac8f22d910f.png"
                    alt="1iQ Enterprise Dashboard"
                    className="w-full h-auto rounded-xl shadow-lg transform hover:scale-[1.02] transition-transform duration-500"
                  />
                )}
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
};

export default Hero;
