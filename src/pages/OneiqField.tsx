
import { useState, useEffect } from "react";
import { ArrowLeft, Share2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import SquareQ from "@/components/SquareQ";

const OneiqField = () => {
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Updated with the new 1iQ Field dashboard image
  const reelImages = [
    "/lovable-uploads/8c40870e-03f4-4e78-8f28-4c980ae9c736.png",
    "/lovable-uploads/8c40870e-03f4-4e78-8f28-4c980ae9c736.png",
    "/lovable-uploads/8c40870e-03f4-4e78-8f28-4c980ae9c736.png",
    "/lovable-uploads/8c40870e-03f4-4e78-8f28-4c980ae9c736.png"
  ];

  useEffect(() => {
    if (reelImages.length > 1) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prevIndex) => 
          (prevIndex + 1) % reelImages.length
        );
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [reelImages.length]);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => navigate('/')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft size={20} className="text-gray-600" />
            </button>
            <div className="flex items-center space-x-2">
              <span className="text-gray-600 text-sm">1iQ</span>
              <span className="text-gray-400">/</span>
              <span className="text-gray-900 font-medium"><SquareQ>1iQ Field</SquareQ></span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="flex flex-col lg:flex-row gap-12 items-start">
          {/* Left Content */}
          <div className="lg:w-1/2 space-y-8">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 flex items-center justify-center">
                <img 
                  src="/lovable-uploads/eb743052-5345-4cca-bfdf-1935334b35f9.png" 
                  alt="1iQ Logo" 
                  className="w-8 h-8 object-contain"
                />
              </div>
              <span className="text-lg font-medium text-gray-900">
                <SquareQ>1iQ Field Now</SquareQ>
              </span>
            </div>

            <div className="space-y-6">
              <h1 className="text-4xl lg:text-5xl font-light text-gray-900 leading-tight">
                <SquareQ>1iQ Field Simplify the Site. Power the Team.</SquareQ>
              </h1>
              
              <p className="text-lg text-gray-700 leading-relaxed">
                <SquareQ>Built for the frontlines—foremen, trades, and field supervisors—1iQ Field delivers discipline-specific task checklists, time-stamped completions, and two-way updates that keep headquarters in perfect sync with every jobsite. Engineered for effortless adoption, it operates offline, withstands glove-friendly interactions, and provides real-time visibility, ensuring no detail falls through the cracks on even the most demanding projects.</SquareQ>
              </p>

              <div className="flex items-center space-x-4">
                <Button 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md"
                  onClick={() => navigate('/schedule-demo')}
                >
                  <SquareQ>Request</SquareQ>
                </Button>
                <button className="p-3 hover:bg-gray-100 rounded-md transition-colors">
                  <Share2 size={20} className="text-gray-600" />
                </button>
              </div>
            </div>
          </div>

          {/* Right Content - Image Reel */}
          <div className="lg:w-1/2">
            <div className="relative">
              {/* Main Display */}
              <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden">
                <img 
                  src={reelImages[currentImageIndex]}
                  alt="1iQ Field Interface"
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Thumbnail Reel */}
              <div className="flex space-x-2 mt-4">
                {reelImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`relative aspect-video w-24 rounded overflow-hidden border-2 transition-all ${
                      index === currentImageIndex 
                        ? 'border-blue-500 shadow-lg' 
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <img 
                      src={image}
                      alt={`Interface ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Overview Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-medium text-gray-900 mb-6">
            <SquareQ>Overview</SquareQ>
          </h2>
          
          <div className="space-y-6 text-gray-700 leading-relaxed">
            <p>
              <SquareQ>1iQ Field is the rugged, mobile powerhouse designed for the workers who make it happen—transforming chaotic jobsites into streamlined operations with trade-specific tools that sync seamlessly with the broader project ecosystem. It bridges the gap between field execution and office oversight, providing instant updates that eliminate delays and miscommunications.</SquareQ>
            </p>
            
            <p>
              <SquareQ>Core to 1iQ Field is its intuitive, AI-assisted task management. Tailored for real-world construction challenges, it offers customizable checklists that adapt to specific trades, automatic time-stamping for accountability, and offline capabilities that ensure productivity never halts. Whether handling daily logs or punch lists, it empowers teams to capture data on the go, with supervisor approvals and safety checks built right in for compliance and efficiency.</SquareQ>
            </p>

            <p>
              <SquareQ>This isn't just an app—it's the key to empowering your field teams, reducing friction, and delivering projects with precision and speed.</SquareQ>
            </p>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-16 grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">
              <SquareQ>Trade-Specific Smart Tasking</SquareQ>
            </h3>
            <p className="text-gray-600">
              <SquareQ>Customize checklists and workflows for different trades, with intelligent suggestions that streamline daily operations and reduce errors.</SquareQ>
            </p>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">
              <SquareQ>Mobile-First, Field-Friendly Interface</SquareQ>
            </h3>
            <p className="text-gray-600">
              <SquareQ>Designed for use in tough conditions—offline access, glove-compatible controls, and intuitive navigation for quick adoption by field crews.</SquareQ>
            </p>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">
              <SquareQ>Time-Stamped Completions + Supervisor Approvals</SquareQ>
            </h3>
            <p className="text-gray-600">
              <SquareQ>Record task completions with precise timestamps and secure approvals, ensuring accountability and real-time progress tracking.</SquareQ>
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">
              <SquareQ>Auto-Sync with Core Schedules</SquareQ>
            </h3>
            <p className="text-gray-600">
              <SquareQ>Seamlessly integrate field updates with central schedules, providing two-way synchronization for up-to-date project alignment.</SquareQ>
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">
              <SquareQ>Daily Logs, Punch Lists, and Safety Checks</SquareQ>
            </h3>
            <p className="text-gray-600">
              <SquareQ>Capture essential site data with built-in tools for logs, issue tracking, and safety protocols, all in one accessible platform.</SquareQ>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OneiqField;
