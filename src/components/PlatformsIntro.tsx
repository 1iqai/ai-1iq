
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SquareQ from "./SquareQ";

const PlatformsIntro = () => {
  const navigate = useNavigate();
  const [hoveredPlatform, setHoveredPlatform] = useState<string | null>(null);

  const platforms = [
    {
      id: 'core',
      name: 'AIP',
      description: 'Automate operations, from the factory floor to the front lines',
      number: '/0.1',
      image: "/lovable-uploads/fa93c37f-1e57-44c1-9e26-943038c4aa33.png"
    },
    {
      id: 'field',
      name: 'Gotham',
      description: 'Achieve AI-driven combat superiority, from space to mud',
      number: '/0.2',
      image: "/lovable-uploads/fa93c37f-1e57-44c1-9e26-943038c4aa33.png"
    },
    {
      id: 'intel',
      name: 'Foundry',
      description: 'Build and manage secure software applications at scale',
      number: '/0.3',
      image: "/lovable-uploads/fa93c37f-1e57-44c1-9e26-943038c4aa33.png"
    }
  ];

  return (
    <section className="py-24 px-6 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="text-center space-y-6 mb-20">
          <h2 className="text-4xl lg:text-5xl font-light text-gray-900 leading-tight">
            <SquareQ>Three platforms. Infinite possibilities.</SquareQ>
          </h2>
        </div>

        <div className="space-y-32">
          {platforms.map((platform, index) => (
            <div key={platform.id} className="grid lg:grid-cols-12 gap-12 items-center">
              {/* Left Side - Description */}
              <div className="lg:col-span-3 space-y-6">
                <div className="text-sm text-gray-400 font-mono">
                  {platform.number}
                </div>
                <p className="text-lg text-gray-900 leading-relaxed font-light">
                  <SquareQ>{platform.description}</SquareQ>
                </p>
              </div>

              {/* Middle - Image Display */}
              <div className="lg:col-span-6 flex justify-center">
                <div 
                  className="relative w-full max-w-md aspect-[4/3] cursor-pointer"
                  onMouseEnter={() => setHoveredPlatform(platform.id)}
                  onMouseLeave={() => setHoveredPlatform(null)}
                  onClick={() => {
                    if (platform.id === 'core') {
                      navigate('/1iq-core');
                    }
                  }}
                >
                  <div className="w-full h-full bg-gray-100 rounded-lg overflow-hidden">
                    <img 
                      src={platform.image}
                      alt={`${platform.name} platform`}
                      className="w-full h-full object-cover transition-opacity duration-300"
                      style={{
                        opacity: hoveredPlatform === platform.id ? 1 : 0.7
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Right Side - Platform Name */}
              <div className="lg:col-span-3 flex items-center">
                <h3 
                  className="text-8xl lg:text-9xl font-bold text-gray-900 cursor-pointer hover:text-gray-700 transition-colors"
                  onMouseEnter={() => setHoveredPlatform(platform.id)}
                  onMouseLeave={() => setHoveredPlatform(null)}
                  onClick={() => {
                    if (platform.id === 'core') {
                      navigate('/1iq-core');
                    }
                  }}
                >
                  <SquareQ>{platform.name}</SquareQ>
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PlatformsIntro;
