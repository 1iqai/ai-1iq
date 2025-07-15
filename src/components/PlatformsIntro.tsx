
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Infinity } from "lucide-react";
import SquareQ from "./SquareQ";

const PlatformsIntro = () => {
  const navigate = useNavigate();
  const [hoveredPlatform, setHoveredPlatform] = useState<string | null>(null);

  const platforms = [
    {
      id: 'core',
      name: '1iQ Core',
      description: '1iQ Core connects every moving part of your construction project scheduling, resources, field updates, and stakeholder visibility into a single, unified platform. Real-time data syncs across teams, giving project managers and clients unprecedented control and situational awareness from day one.',
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

  return (
    <section className="py-24 px-6 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="text-center space-y-6 mb-20">
          <h2 className="text-6xl lg:text-7xl font-bold text-gray-900 leading-tight animate-zoom-pulse text-center">
            <div className="text-center">
              <SquareQ>Three platforms</SquareQ>
            </div>
            <div className="text-center my-2">
              <Infinity className="w-12 h-12 lg:w-16 lg:h-16 text-gray-400 mx-auto" />
            </div>
            <div className="text-center">
              <SquareQ>Infinite possibilities.</SquareQ>
            </div>
          </h2>
        </div>

        <div className="space-y-32">
          {platforms.map((platform, index) => (
            <div key={platform.id} className="relative">
              <div className="grid lg:grid-cols-12 gap-12 items-center min-h-[400px]">
                {/* Left Side - Description */}
                <div className="lg:col-span-4 space-y-6">
                  <div className="text-sm text-gray-400 font-mono">
                    {platform.number}
                  </div>
                  <h3 className="text-2xl lg:text-3xl font-light text-gray-900 leading-relaxed">
                    <SquareQ>{platform.shortDescription}</SquareQ>
                  </h3>
                  {hoveredPlatform === platform.id && (
                    <div className="transition-all duration-300 ease-in-out">
                      <p className="text-base text-gray-700 leading-relaxed font-light">
                        <SquareQ>{platform.description}</SquareQ>
                      </p>
                    </div>
                  )}
                </div>

                {/* Middle - Image Display (appears on hover) */}
                <div className="lg:col-span-4 flex justify-center">
                  <div className="relative w-full max-w-md aspect-[4/3]">
                    {hoveredPlatform === platform.id && (
                      <div className="w-full h-full bg-gray-100 rounded-lg overflow-hidden transition-all duration-300 ease-in-out animate-fade-in">
                        <img 
                          src={platform.image}
                          alt={`${platform.name} platform`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Side - Platform Name */}
                <div className="lg:col-span-4 flex items-center justify-end">
                  <h3 
                    className="text-6xl lg:text-8xl font-bold text-gray-900 cursor-pointer hover:text-gray-700 transition-colors text-right"
                    onMouseEnter={() => setHoveredPlatform(platform.id)}
                    onMouseLeave={() => setHoveredPlatform(null)}
                    onClick={() => {
                      if (platform.id === 'core') {
                        navigate('/1iq-core');
                      } else if (platform.id === 'field') {
                        navigate('/1iq-field');
                      }
                    }}
                  >
                    <SquareQ>{platform.name}</SquareQ>
                  </h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PlatformsIntro;
