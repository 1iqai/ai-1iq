
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import SquareQ from "./SquareQ";

const PlatformsIntro = () => {
  const navigate = useNavigate();
  const [hoveredPlatform, setHoveredPlatform] = useState<string | null>(null);

  const platformImages = {
    core: "/lovable-uploads/fa93c37f-1e57-44c1-9e26-943038c4aa33.png",
    field: "/lovable-uploads/fa93c37f-1e57-44c1-9e26-943038c4aa33.png",
    intel: "/lovable-uploads/fa93c37f-1e57-44c1-9e26-943038c4aa33.png"
  };

  return (
    <section className="py-24 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center space-y-6 mb-20">
          <h2 className="text-4xl lg:text-5xl font-light text-gray-900 leading-tight">
            <SquareQ>Three platforms. Infinite possibilities.</SquareQ>
          </h2>
        </div>

        <div className="grid lg:grid-cols-12 gap-12 items-center">
          {/* Left Side - Description */}
          <div className="lg:col-span-3 space-y-6">
            <p className="text-lg text-gray-600 leading-relaxed">
              <SquareQ>1iQ provides AI-powered construction management solutions that integrate seamlessly across your entire project lifecycle, from planning to completion.</SquareQ>
            </p>
          </div>

          {/* Middle - Image Display */}
          <div className="lg:col-span-6 flex justify-center">
            <div className="relative w-full max-w-md aspect-square">
              {hoveredPlatform && (
                <div className="absolute inset-0 bg-gray-100 rounded-2xl overflow-hidden">
                  <img 
                    src={platformImages[hoveredPlatform as keyof typeof platformImages]}
                    alt={`${hoveredPlatform} platform`}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              {!hoveredPlatform && (
                <div className="w-full h-full bg-gray-50 rounded-2xl flex items-center justify-center">
                  <span className="text-gray-400 text-lg">
                    <SquareQ>Hover over a platform to see preview</SquareQ>
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Right Side - Platform Cards */}
          <div className="lg:col-span-3 space-y-6">
            {/* 1iQ Core */}
            <div 
              className="group cursor-pointer p-6 rounded-xl hover:bg-blue-50 transition-all duration-300"
              onClick={() => navigate('/1iq-core')}
              onMouseEnter={() => setHoveredPlatform('core')}
              onMouseLeave={() => setHoveredPlatform(null)}
            >
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <div className="w-4 h-4 bg-white rounded"></div>
                </div>
                <h3 className="text-xl font-light text-gray-900">
                  <SquareQ>1iQ Core</SquareQ>
                </h3>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed mb-3">
                <SquareQ>Unified project management platform integrating schedules, designs, and budgets with AI-powered insights.</SquareQ>
              </p>
              <div className="flex items-center text-blue-600 group-hover:text-blue-700 transition-colors">
                <span className="text-sm font-medium mr-2"><SquareQ>Learn more</SquareQ></span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* 1iQ Field */}
            <div 
              className="group cursor-pointer p-6 rounded-xl hover:bg-orange-50 transition-all duration-300"
              onMouseEnter={() => setHoveredPlatform('field')}
              onMouseLeave={() => setHoveredPlatform(null)}
            >
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                  <div className="w-4 h-4 bg-white rounded"></div>
                </div>
                <h3 className="text-xl font-light text-gray-900">
                  <SquareQ>1iQ Field</SquareQ>
                </h3>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed mb-3">
                <SquareQ>Mobile-first solution for real-time data collection, task management, and on-site team collaboration.</SquareQ>
              </p>
              <div className="flex items-center text-orange-500 group-hover:text-orange-600 transition-colors">
                <span className="text-sm font-medium mr-2"><SquareQ>Learn more</SquareQ></span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* 1iQ Intel */}
            <div 
              className="group cursor-pointer p-6 rounded-xl hover:bg-purple-50 transition-all duration-300"
              onMouseEnter={() => setHoveredPlatform('intel')}
              onMouseLeave={() => setHoveredPlatform(null)}
            >
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                  <div className="w-4 h-4 bg-white rounded"></div>
                </div>
                <h3 className="text-xl font-light text-gray-900">
                  <SquareQ>1iQ Intel</SquareQ>
                </h3>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed mb-3">
                <SquareQ>Advanced analytics platform providing predictive insights, risk assessment, and strategic decision support.</SquareQ>
              </p>
              <div className="flex items-center text-purple-500 group-hover:text-purple-600 transition-colors">
                <span className="text-sm font-medium mr-2"><SquareQ>Learn more</SquareQ></span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PlatformsIntro;
