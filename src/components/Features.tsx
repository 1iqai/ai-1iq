
import { Search, Database, Shield, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRef, useState, useEffect } from "react";

const Features = () => {
  const mainFeatures = [
    {
      icon: Search,
      title: "Discover",
      description: "AI powered search across your entire data landscape.",
      color: "bg-purple-100",
      iconColor: "text-purple-600"
    },
    {
      icon: Database,
      title: "Catalog",
      description: "Single source of truth for all data lineage, context, and docs.",
      color: "bg-red-100",
      iconColor: "text-red-600"
    },
    {
      icon: Shield,
      title: "Monitor",
      description: "Reduce risk and ensure the integrity of your data.",
      color: "bg-green-100",
      iconColor: "text-green-600"
    },
    {
      icon: Users,
      title: "Govern",
      description: "Enforce policies and enable secure access to data at scale.",
      color: "bg-blue-100",
      iconColor: "text-blue-600"
    }
  ];

  // Image gallery data
  const galleryImages = [
    {
      id: 1,
      title: "Puratos",
      subtitle: "Data Platform Integration",
      bgColor: "bg-gradient-to-br from-amber-100 to-orange-200",
      image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=400&h=300&fit=crop"
    },
    {
      id: 2,
      title: "Analytics Dashboard",
      subtitle: "Real-time Data Visualization",
      bgColor: "bg-gradient-to-br from-blue-500 to-purple-600",
      image: "https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=400&h=300&fit=crop"
    },
    {
      id: 3,
      title: "Stad Sint-Niklaas",
      subtitle: "Highlighting urban redevelopment in virtual reality",
      bgColor: "bg-gradient-to-br from-purple-500 to-pink-500",
      image: "https://images.unsplash.com/photo-1472396961693-142e6e269027?w=400&h=300&fit=crop",
      tags: "WEB • 360° PHOTOGRAPHY • 360° VIDEO"
    }
  ];

  // Mouse drag functionality
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [showDragHint, setShowDragHint] = useState(true);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
    setShowDragHint(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowDragHint(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="py-20 px-6 bg-slate-50">
      <div className="max-w-7xl mx-auto">
        {/* Main heading */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
            The data governance platform for the AI era
          </h2>
          <p className="text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed">
            Search and AI built from the ground up with data governance at its core to 
            enable secure data access and decisions across your business.
          </p>
        </div>
        
        {/* Main feature cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {mainFeatures.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div key={index} className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <div className={`w-12 h-12 ${feature.color} rounded-lg flex items-center justify-center mb-6`}>
                  <IconComponent className={`h-6 w-6 ${feature.iconColor}`} />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Image Gallery Section */}
        <div className="mb-20">
          <div className="relative">
            {/* Drag hint */}
            {showDragHint && (
              <div className="absolute top-4 right-4 z-10 bg-purple-500 text-white rounded-full w-24 h-24 flex items-center justify-center text-sm font-medium animate-pulse">
                Drag
                <br />
                or click
              </div>
            )}

            {/* Scrollable gallery */}
            <div
              ref={scrollRef}
              className="flex gap-6 overflow-x-auto pb-4 cursor-grab active:cursor-grabbing"
              style={{ 
                scrollbarWidth: 'none', 
                msOverflowStyle: 'none'
              }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseLeave}
            >
              {galleryImages.map((item) => (
                <div
                  key={item.id}
                  className={`relative flex-shrink-0 w-96 h-64 rounded-2xl overflow-hidden ${item.bgColor} group hover:scale-105 transition-transform duration-300`}
                >
                  {/* Background Image */}
                  <div
                    className="absolute inset-0 bg-cover bg-center opacity-80"
                    style={{ backgroundImage: `url(${item.image})` }}
                  />
                  
                  {/* Content overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  
                  {/* Text content */}
                  <div className="absolute bottom-6 left-6 right-6 text-white">
                    <h3 className="text-2xl font-bold mb-2">{item.title}</h3>
                    <p className="text-sm opacity-90 mb-2">{item.subtitle}</p>
                    {item.tags && (
                      <p className="text-xs opacity-75 uppercase tracking-wider">
                        {item.tags}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Add CSS to hide scrollbar */}
            <style>
              {`
                .overflow-x-auto::-webkit-scrollbar {
                  display: none;
                }
              `}
            </style>
          </div>

          {/* Discover more button */}
          <div className="flex justify-center mt-8">
            <Button 
              variant="outline" 
              className="rounded-full px-8 py-3 text-lg border-slate-300 hover:bg-slate-100"
            >
              Discover more of our work
            </Button>
          </div>
        </div>

        {/* Bottom section with AI and Search */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Content */}
          <div className="space-y-8">
            {/* AI Section */}
            <div className="bg-white p-8 rounded-2xl shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-semibold text-slate-900">AI</h3>
                <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              <p className="text-slate-600 mb-6 leading-relaxed">
                Let Secoda AI take the grunt work out of your day. Uncover insights, automate repetitive 
                tasks, and focus on what really matters.
              </p>
              <Button variant="outline" className="rounded-full px-6">
                Learn more
              </Button>
            </div>

            {/* Search Section */}
            <div className="bg-white p-8 rounded-2xl shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-semibold text-slate-900">Search</h3>
                <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Lineage Section */}
            <div className="bg-white p-8 rounded-2xl shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-semibold text-slate-900">Lineage</h3>
                <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Right side - Dashboard mockup */}
          <div className="relative">
            <div className="bg-slate-900 rounded-2xl p-6 shadow-2xl">
              <div className="bg-white rounded-lg p-6">
                {/* Mock dashboard header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-8 h-8 bg-purple-500 rounded"></div>
                    <span className="font-medium">Truffle Shop Demo</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-slate-200 rounded"></div>
                    <div className="w-6 h-6 bg-slate-200 rounded"></div>
                  </div>
                </div>

                {/* Key insights section */}
                <div className="mb-6">
                  <h4 className="font-semibold mb-3">Key Insights:</h4>
                  <div className="space-y-2 text-sm text-slate-600">
                    <div className="flex items-start space-x-2">
                      <div className="w-1 h-1 bg-slate-400 rounded-full mt-2"></div>
                      <p>The data covers the period from September 2022 to August 2023 (most recent data available in our system)</p>
                    </div>
                    <div className="flex items-start space-x-2">
                      <div className="w-1 h-1 bg-slate-400 rounded-full mt-2"></div>
                      <p>Our MRR shows a strong upward trend over this period, with particularly strong growth in Q2 2023</p>
                    </div>
                    <div className="flex items-start space-x-2">
                      <div className="w-1 h-1 bg-slate-400 rounded-full mt-2"></div>
                      <p>Peak MRR was achieved in July 2023 at $39,232.06, which represents a 305% increase from September 2022</p>
                    </div>
                  </div>
                </div>

                {/* Chart mockup */}
                <div className="bg-slate-50 rounded-lg p-4">
                  <h5 className="font-medium mb-4 text-sm">Monthly Recurring Revenue (Sep 2022 - Aug 2023)</h5>
                  <div className="flex items-end space-x-1 h-32">
                    {Array.from({ length: 12 }, (_, i) => (
                      <div
                        key={i}
                        className="bg-blue-500 rounded-t"
                        style={{
                          height: `${Math.random() * 80 + 20}%`,
                          width: '8%'
                        }}
                      ></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
