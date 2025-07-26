import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Infinity, ChevronRight } from "lucide-react";


const PlatformsIntro = () => {
  const navigate = useNavigate();
  const [hoveredPlatform, setHoveredPlatform] = useState<string | null>(null);
  const [activePlatform, setActivePlatform] = useState<string | null>(null);

  const platforms = [
    {
      id: 'core',
      name: '1iQ Core',
      description: '1iQ Core connects every moving part of your construction project — scheduling, resources, field updates, and stakeholder visibility — into a single, unified platform. Real-time data syncs across teams, giving project managers and clients unprecedented control and situational awareness from day one.',
      shortDescription: 'Automate operations, from the factory floor to the front lines',
      number: '/0.1',
      image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=600&fit=crop"
    },
    {
      id: 'field',
      name: '1iQ Field',
      description: '1iQ Field puts intuitive task checklists, live progress tracking, and instant feedback loops directly in the hands of your workforce. Built for the boots on the ground, it\'s lightweight, mobile-friendly, and designed to eliminate guesswork while keeping everyone aligned, accountable, and on pace.',
      shortDescription: 'Achieve AI-driven combat superiority, from space to mud',
      number: '/0.2',
      image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=600&fit=crop"
    },
    {
      id: 'intel',
      name: '1iQ Intel',
      description: '1iQ Intel transforms raw project data into actionable intelligence through advanced analytics and AI-powered insights. Predict bottlenecks before they happen, optimize resource allocation in real-time, and make informed decisions that keep projects on track and profitable.',
      shortDescription: 'Decisions driven by data, not assumptions',
      number: '/0.3',
      image: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=800&h=600&fit=crop"
    }
  ];

  const handlePlatformClick = (platform: typeof platforms[0]) => {
    if (activePlatform === platform.id) {
      // If already active, navigate to the platform page
      if (platform.id === 'core') {
        navigate('/1iq-core');
      } else if (platform.id === 'field') {
        navigate('/1iq-field');
      } else if (platform.id === 'intel') {
        navigate('/1iq-intel');
      }
    } else {
      // Otherwise, set as active to show details
      setActivePlatform(platform.id);
    }
  };

  const displayedPlatform = hoveredPlatform || activePlatform;

  return (
    <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header Section - Optimized for mobile */}
        <div className="text-center space-y-3 sm:space-y-4 lg:space-y-6 mb-12 sm:mb-16 lg:mb-20">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 leading-tight animate-zoom-pulse">
            <div className="text-center">
              <SquareQ>Three platforms</SquareQ>
            </div>
            <div className="text-center my-1 sm:my-2">
              <Infinity className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 xl:w-16 xl:h-16 text-gray-400 mx-auto" />
            </div>
            <div className="text-center">
              <SquareQ>Infinite possibilities.</SquareQ>
            </div>
          </h2>
        </div>

        {/* Platforms Section - Enhanced mobile layout */}
        <div className="space-y-12 sm:space-y-16 lg:space-y-24">
          {platforms.map((platform, index) => (
            <div key={platform.id} className="relative">
              <button 
                className="w-full grid lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-12 items-start lg:items-center min-h-[250px] sm:min-h-[300px] lg:min-h-[400px] cursor-pointer hover:bg-gray-50 active:bg-gray-100 transition-colors duration-200 p-2 sm:p-4 lg:p-6 rounded-lg touch-manipulation focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
                onMouseEnter={() => setHoveredPlatform(platform.id)}
                onMouseLeave={() => setHoveredPlatform(null)}
                onClick={() => handlePlatformClick(platform)}
              >
                
                {/* Mobile-first layout: Platform Name at top */}
                <div className="lg:col-span-4 flex items-center justify-center lg:justify-end order-1 lg:order-3">
                  <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-7xl font-bold text-gray-900 hover:text-gray-700 transition-colors text-center lg:text-right min-h-[44px] w-full lg:w-auto flex items-center justify-center lg:justify-end">
                    <SquareQ>{platform.name}</SquareQ>
                  </div>
                </div>

                {/* Content Section - Better mobile typography */}
                <div className="lg:col-span-4 space-y-3 sm:space-y-4 lg:space-y-6 order-2 lg:order-1">
                  <div className="text-xs sm:text-sm text-gray-400 font-mono text-center lg:text-left">
                    {platform.number}
                  </div>
                  <h3 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-light text-gray-900 leading-relaxed text-center lg:text-left">
                    <SquareQ>{platform.shortDescription}</SquareQ>
                  </h3>
                  
                  {/* Expandable content - Always visible on mobile when platform is active */}
                  {displayedPlatform === platform.id && (
                    <div className="transition-all duration-300 ease-in-out animate-fade-in">
                      <p className="text-sm sm:text-base text-gray-700 leading-relaxed font-light text-center lg:text-left mb-4">
                        <SquareQ>{platform.description}</SquareQ>
                      </p>
                      <div className="flex justify-center lg:justify-start">
                        <span className="inline-flex items-center gap-2 text-gray-900 text-sm sm:text-base font-medium underline underline-offset-4 min-h-[44px] px-2 py-2">
                          Learn More
                          <ChevronRight className="w-4 h-4" />
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Image Display - Optimized mobile sizing */}
                <div className="lg:col-span-4 flex justify-center order-3 lg:order-2">
                  <div className="relative w-full max-w-xs sm:max-w-sm lg:max-w-md aspect-[4/3]">
                    {displayedPlatform === platform.id && (
                      <div className="w-full h-full bg-gray-100 rounded-lg overflow-hidden transition-all duration-300 ease-in-out animate-fade-in shadow-lg">
                        <img 
                          src={platform.image}
                          alt={`${platform.name} platform`}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </button>
            </div>
          ))}
        </div>

        {/* Mobile CTA Section */}
        <div className="mt-16 sm:mt-20 lg:mt-24 text-center lg:hidden">
          <p className="text-sm text-gray-600 mb-4">
            Tap any platform row above to explore
          </p>
        </div>
      </div>
    </section>
  );
};

export default PlatformsIntro;
