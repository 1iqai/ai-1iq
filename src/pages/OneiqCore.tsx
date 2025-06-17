
import { useState, useEffect } from "react";
import { ArrowLeft, Share2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import SquareQ from "@/components/SquareQ";

const OneiqCore = () => {
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Placeholder images - you can replace these with your 4 images
  const reelImages = [
    "/lovable-uploads/fa93c37f-1e57-44c1-9e26-943038c4aa33.png",
    "/lovable-uploads/fa93c37f-1e57-44c1-9e26-943038c4aa33.png",
    "/lovable-uploads/fa93c37f-1e57-44c1-9e26-943038c4aa33.png",
    "/lovable-uploads/fa93c37f-1e57-44c1-9e26-943038c4aa33.png"
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
              <span className="text-gray-900 font-medium"><SquareQ>1iQ Core</SquareQ></span>
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
              <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">1Q</span>
              </div>
              <span className="text-lg font-medium text-gray-900">
                <SquareQ>1iQ Core Now</SquareQ>
              </span>
            </div>

            <div className="space-y-6">
              <h1 className="text-4xl lg:text-5xl font-light text-gray-900 leading-tight">
                <SquareQ>1iQ Core Connected Construction Command Center</SquareQ>
              </h1>
              
              <p className="text-lg text-gray-700 leading-relaxed">
                <SquareQ>Elevate your construction project management with a single platform that integrates schedules, designs, and financials. Experience the power of AI with real-time updates, predictive planning, and smart automations that enhance your strategic decision-making.</SquareQ>
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
                  alt="1iQ Core Interface"
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
              <SquareQ>1iQ Core Connected Construction Command Center provides a unified view of your construction projects, merging critical aspects like schedules, designs, and budgets into a user-friendly interface. Designed specifically for the construction industry's unique needs, it enables flexible and efficient project management.</SquareQ>
            </p>
            
            <p>
              <SquareQ>With the integration of Building Information Modeling (BIM) and Work Orders, the application offers a series of dynamic and interconnected workflows for teams focused on the full spectrum of construction operations - from initial design through project completion and maintenance.</SquareQ>
            </p>

            <p>
              <SquareQ>The platform leverages advanced AI algorithms to provide predictive insights, automated scheduling optimization, and real-time resource allocation recommendations, ensuring your projects stay on time and within budget while maintaining the highest quality standards.</SquareQ>
            </p>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-16 grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">
              <SquareQ>Real-Time Project Tracking</SquareQ>
            </h3>
            <p className="text-gray-600">
              <SquareQ>Monitor project progress with live updates from field teams, automated milestone tracking, and instant notifications for critical path changes.</SquareQ>
            </p>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">
              <SquareQ>AI-Powered Scheduling</SquareQ>
            </h3>
            <p className="text-gray-600">
              <SquareQ>Optimize project timelines with machine learning algorithms that predict delays, suggest alternative workflows, and automatically adjust schedules.</SquareQ>
            </p>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">
              <SquareQ>Integrated Financial Management</SquareQ>
            </h3>
            <p className="text-gray-600">
              <SquareQ>Track costs, manage budgets, and forecast expenses with comprehensive financial tools designed for construction project complexity.</SquareQ>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OneiqCore;
