
import { useState, useEffect } from "react";
import { ArrowLeft, Share2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import SquareQ from "@/components/SquareQ";

const OneiqIntel = () => {
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Placeholder images for 1iQ Intel; update with actual uploads as needed
  const reelImages = [
    "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=800&h=600&fit=crop"
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
              <span className="text-gray-900 font-medium"><SquareQ>1iQ Intel</SquareQ></span>
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
                <SquareQ>1iQ Intel Now</SquareQ>
              </span>
            </div>

            <div className="space-y-6">
              <h1 className="text-4xl lg:text-5xl font-light text-gray-900 leading-tight">
                <SquareQ>1iQ Intel Decisions Powered by Insight. Not Instinct.</SquareQ>
              </h1>
              
              <p className="text-lg text-gray-700 leading-relaxed">
                <SquareQ>1iQ Intel revolutionizes how you leverage your data—harnessing both historical records and real-time inputs to generate predictive intelligence that drives smarter decisions. From assessing project risks and anticipating delays to optimizing resource allocation, it equips you to shift from reactive management to proactive strategy, all supported by cutting-edge machine learning and comprehensive historical context.</SquareQ>
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
                  alt="1iQ Intel Interface"
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
              <SquareQ>1iQ Intel is the advanced analytics platform that converts your construction data into forward-looking intelligence—drawing from past projects, ongoing activities, and emerging trends to deliver insights that inform every decision. It eliminates guesswork by providing a clear view of potential outcomes, helping teams across the organization to plan with precision and adapt with agility.</SquareQ>
            </p>
            
            <p>
              <SquareQ>At the heart of 1iQ Intel is its machine learning-driven core, which analyzes complex datasets to produce predictive risk alerts, performance benchmarks, and resource forecasts. With seamless integrations to financial and ERP systems, it creates customized reports and dashboards that turn raw numbers into strategic advantages, accessible to executives and managers alike.</SquareQ>
            </p>

            <p>
              <SquareQ>This is more than data analysis. It's the intelligence that transforms instinct into insight, ensuring your projects are not just completed, but optimized for success.</SquareQ>
            </p>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-16 grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">
              <SquareQ>Predictive Scheduling Risk Alerts</SquareQ>
            </h3>
            <p className="text-gray-600">
              <SquareQ>Identify potential delays before they occur with AI-generated alerts based on historical patterns and current project data.</SquareQ>
            </p>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">
              <SquareQ>Historical Performance Analytics</SquareQ>
            </h3>
            <p className="text-gray-600">
              <SquareQ>Analyze past project data to uncover trends, benchmarks, and lessons learned for improved future performance.</SquareQ>
            </p>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">
              <SquareQ>AI-Driven Resource Modeling</SquareQ>
            </h3>
            <p className="text-gray-600">
              <SquareQ>Model and optimize resource allocation using machine learning to forecast needs and prevent bottlenecks.</SquareQ>
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">
              <SquareQ>Custom Reporting & Insights Dashboard</SquareQ>
            </h3>
            <p className="text-gray-600">
              <SquareQ>Create tailored reports and interactive dashboards for deep dives into key metrics and actionable insights.</SquareQ>
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">
              <SquareQ>Integration with Financial & ERP Systems</SquareQ>
            </h3>
            <p className="text-gray-600">
              <SquareQ>Connect seamlessly with existing financial and ERP tools for comprehensive data flow and unified analytics.</SquareQ>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OneiqIntel;
