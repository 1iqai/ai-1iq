import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Infinity, ChevronRight } from "lucide-react";

const PlatformsIntro = () => {
  const navigate = useNavigate();
  const [hoveredPlatform, setHoveredPlatform] = useState<string | null>(null);
  const [activePlatform, setActivePlatform] = useState<string | null>(null);

  const platforms = [
    {
      id: "core",
      name: "1iQ Core",
      shortDescription: "AI-powered project coordination and management platform",
      description: "Comprehensive project management solution that leverages artificial intelligence to optimize resource allocation, predict potential issues, and streamline complex workflows across multiple departments and stakeholders.",
      path: "/1iq-core"
    },
    {
      id: "field",
      name: "1iQ Field",
      shortDescription: "Real-time field operations and workforce management",
      description: "Advanced field management system designed for real-time coordination of on-site operations, crew scheduling, equipment tracking, and seamless communication between field teams and central command.",
      path: "/1iq-field"
    },
    {
      id: "intel",
      name: "1iQ Intel", 
      shortDescription: "Business intelligence and predictive analytics engine",
      description: "Sophisticated analytics platform that transforms raw operational data into actionable insights, providing predictive modeling, performance forecasting, and strategic decision-making support.",
      path: "/1iq-intel"
    }
  ];

  const handlePlatformClick = (platform: any) => {
    if (activePlatform === platform.id) {
      // If clicking the same platform, navigate to its page
      navigate(platform.path);
    } else {
      // If clicking a different platform, expand it
      setActivePlatform(platform.id);
    }
  };

  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-20 items-start">
          {/* Left side - Heading */}
          <div className="space-y-6">
            <h2 className="text-4xl lg:text-5xl font-normal text-slate-900 leading-tight">
              Three platforms
            </h2>
            
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-normal text-slate-900 leading-tight">
              Infinite possibilities.
            </h2>
          </div>
          
          {/* Right side - Platform List */}
          <div className="space-y-6">
            {platforms.map((platform) => (
              <div 
                key={platform.id}
                className={`border-b border-slate-200 pb-6 cursor-pointer transition-all duration-300 ${
                  hoveredPlatform === platform.id ? 'transform translate-x-2' : ''
                }`}
                onMouseEnter={() => setHoveredPlatform(platform.id)}
                onMouseLeave={() => setHoveredPlatform(null)}
                onClick={() => handlePlatformClick(platform)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-2xl font-medium text-slate-900 mb-4 flex items-center gap-3">
                      {platform.name}
                      <ChevronRight 
                        className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${
                          activePlatform === platform.id ? 'rotate-90' : ''
                        }`} 
                      />
                    </h3>
                    
                    {/* Short Description - Always visible */}
                    <div className="mb-4">
                      <p className="text-lg text-slate-600 leading-relaxed">
                        {platform.shortDescription}
                      </p>
                    </div>
                    
                    {/* Detailed Description - Visible when expanded */}
                    {activePlatform === platform.id && (
                      <div className="border-t border-slate-200 pt-6 mt-6">
                        <p className="text-slate-700 leading-relaxed">
                          {platform.description}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Bottom instruction */}
        <div className="mt-16 text-center">
          <p className="text-slate-500 text-lg">
            Tap any platform row above to explore
          </p>
        </div>
      </div>
    </section>
  );
};

export default PlatformsIntro;