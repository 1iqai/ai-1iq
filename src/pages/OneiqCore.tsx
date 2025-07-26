import { useState, useEffect } from "react";
import { ArrowLeft, Share2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";


const OneiqCore = () => {
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Updated with the new 1iQ Core dashboard image
  const reelImages = [
    "/lovable-uploads/40a39c64-1583-4424-b99e-27a52826f869.png",
    "/lovable-uploads/40a39c64-1583-4424-b99e-27a52826f869.png",
    "/lovable-uploads/40a39c64-1583-4424-b99e-27a52826f869.png",
    "/lovable-uploads/40a39c64-1583-4424-b99e-27a52826f869.png"
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
              <div className="w-8 h-8 flex items-center justify-center">
                <img 
                  src="/lovable-uploads/eb743052-5345-4cca-bfdf-1935334b35f9.png" 
                  alt="1iQ Logo" 
                  className="w-8 h-8 object-contain"
                />
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
                <SquareQ>From scheduling and budgeting to documentation and resource allocation, 1iQ Core connects every piece of your operation in real time. Nothing gets lost in translation. Built for speed, clarity, and control, it replaces disconnected tools with a single, AI-driven platform that gives everyone from field teams to executives a live, shared source of truth.</SquareQ>
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
              <SquareQ>1iQ Core is the intelligent engine behind construction's next generation—uniting schedules, budgets, documents, and team communication into a single, real-time command center. Built for high-stakes, fast-moving projects, it eliminates silos and guesswork by giving every stakeholder—from the field to the C-suite—immediate access to one powerful, dynamic source of truth.</SquareQ>
            </p>
            
            <p>
              <SquareQ>At the heart of 1iQ Core is its AI-powered scheduling system. Unlike rigid, manual tools of the past, it adapts in real time to changing conditions—automatically rebalancing timelines, adjusting task dependencies, and reallocating resources as your project evolves. Whether you're managing a single site or a national portfolio, 1iQ Core empowers you to spot risks before they become delays, fast-track approvals, and keep every moving part tightly aligned.</SquareQ>
            </p>

            <p>
              <SquareQ>This is more than just software. It's how you take control of complexity, cut through the noise, and deliver construction with confidence.</SquareQ>
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
