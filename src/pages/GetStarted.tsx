
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Header from '@/components/Header';

const GetStarted = () => {
  const navigate = useNavigate();

  const options = [
    {
      title: "Schedule a Demo",
      description: "Get a personalized demonstration of our platform",
      path: "/schedule-demo"
    },
    {
      title: "Contact Sales",
      description: "Speak with our sales team about your needs",
      path: "/contact-sales"
    },
    {
      title: "Partnership Inquiry",
      description: "Explore partnership opportunities with us",
      path: "/partnership-inquiry"
    },
    {
      title: "Learn More",
      description: "Discover more about our solutions and capabilities",
      path: "/learn-more"
    }
  ];

  return (
    <div className="min-h-screen bg-white relative">
      {/* Dark gradient background for header area */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-gray-900 to-transparent"></div>
      
      <Header />
      
      <div className="pt-32 pb-16 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16 max-w-2xl">
            <h1 className="text-8xl font-light text-black leading-tight tracking-tight mb-8">
              Get Started
            </h1>
            <h2 className="text-2xl font-normal text-black mb-6 leading-relaxed">
              Choose how you'd like to begin your journey with 1iQ
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
            {options.map((option, index) => (
              <div
                key={index}
                onClick={() => navigate(option.path)}
                className="group bg-gray-50 hover:bg-gray-100 transition-colors duration-300 rounded-2xl p-8 cursor-pointer border border-gray-200 hover:border-gray-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-normal text-slate-900">
                    {option.title}
                  </h3>
                  <ArrowRight className="h-5 w-5 text-slate-600 group-hover:text-slate-900 transition-colors" />
                </div>
                <p className="text-gray-600 leading-relaxed">
                  {option.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GetStarted;
