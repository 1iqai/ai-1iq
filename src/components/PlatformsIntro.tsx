
import SquareQ from "./SquareQ";

const PlatformsIntro = () => {
  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-full mx-auto px-4 lg:px-8 xl:px-16">
        {/* Main headline */}
        <div className="text-center mb-32">
          <h2 className="font-inter text-5xl lg:text-6xl xl:text-7xl font-normal text-slate-900 leading-tight tracking-normal max-w-6xl mx-auto">
            <SquareQ>Our software powers real-time, AI-driven clarity and decisions to construction teams on every site, at every scale.</SquareQ>
          </h2>
        </div>

        {/* Our Platforms section */}
        <div className="mb-16">
          <h3 className="font-inter text-4xl lg:text-5xl font-normal text-slate-900 mb-20 px-4 lg:px-8">
            <SquareQ>Our Platforms</SquareQ>
          </h3>
          
          {/* Platform 1 - 1iQ Core */}
          <div className="group px-4 lg:px-8 py-12 mb-16 hover:bg-gray-50 transition-colors duration-300 cursor-pointer">
            <div className="grid lg:grid-cols-12 gap-8 items-start">
              {/* Left side - Description */}
              <div className="lg:col-span-4 space-y-8">
                <h4 className="font-inter text-2xl lg:text-3xl text-slate-700 font-normal leading-relaxed">
                  <SquareQ>Automate operations, from the factory floor to the front lines</SquareQ>
                </h4>
                <div className="text-slate-400 text-lg font-normal">
                  /0.1
                </div>
                {/* Description text - hidden by default, shown on hover */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <p className="text-lg text-slate-700 leading-relaxed font-inter">
                    <SquareQ>1iQ Core connects every moving part of your construction project scheduling, resources, field updates, and stakeholder visibility into a single, unified platform. Real-time data syncs across teams, giving project managers and clients unprecedented control and situational awareness from day one.</SquareQ>
                  </p>
                </div>
              </div>
              
              {/* Center - Image (hidden by default, shown on hover) */}
              <div className="lg:col-span-4 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <img 
                  src="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400&h=300&fit=crop" 
                  alt="1iQ Core Platform Interface" 
                  className="w-full max-w-sm h-auto rounded-lg shadow-lg"
                />
              </div>

              {/* Right side - 1iQ Core Logo */}
              <div className="lg:col-span-4 flex items-center justify-center lg:justify-end">
                <div className="text-6xl lg:text-[7.8rem] xl:text-[9.1rem] font-bold text-slate-900 tracking-tight leading-none">
                  <SquareQ>1iQ Core</SquareQ>
                </div>
              </div>
            </div>
          </div>

          {/* Platform 2 - 1iQ Field */}
          <div className="group px-4 lg:px-8 py-12 mb-16 hover:bg-gray-50 transition-colors duration-300 cursor-pointer">
            <div className="grid lg:grid-cols-12 gap-8 items-start">
              {/* Left side - Description */}
              <div className="lg:col-span-4 space-y-8">
                <h4 className="font-inter text-2xl lg:text-3xl text-slate-700 font-normal leading-relaxed">
                  <SquareQ>Achieve AI-driven combat superiority</SquareQ>
                </h4>
                <div className="text-slate-400 text-lg font-normal">
                  /0.2
                </div>
                {/* Description text - hidden by default, shown on hover */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <p className="text-lg text-slate-700 leading-relaxed font-inter">
                    <SquareQ>1iQ Field puts intuitive task checklists, live progress tracking, and instant feedback loops directly in the hands of your workforce. Built for the boots on the ground, it's lightweight, mobile-friendly, and designed to eliminate guesswork while keeping everyone aligned, accountable, and on pace.</SquareQ>
                  </p>
                </div>
              </div>
              
              {/* Center - Image (hidden by default, shown on hover) */}
              <div className="lg:col-span-4 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <img 
                  src="https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=300&fit=crop" 
                  alt="1iQ Field Platform Interface" 
                  className="w-full max-w-sm h-auto rounded-lg shadow-lg"
                />
              </div>

              {/* Right side - 1iQ Field Logo */}
              <div className="lg:col-span-4 flex items-center justify-center lg:justify-end">
                <div className="text-6xl lg:text-[7.8rem] xl:text-[9.1rem] font-bold text-slate-900 tracking-tight leading-none">
                  <SquareQ>1iQ Field</SquareQ>
                </div>
              </div>
            </div>
          </div>

          {/* Platform 3 - 1iQ Intel */}
          <div className="group px-4 lg:px-8 py-12 hover:bg-gray-50 transition-colors duration-300 cursor-pointer">
            <div className="grid lg:grid-cols-12 gap-8 items-start">
              {/* Left side - Description */}
              <div className="lg:col-span-4 space-y-8">
                <h4 className="font-inter text-2xl lg:text-3xl text-slate-700 font-normal leading-relaxed">
                  <SquareQ>Decisions driven by data, not assumptions</SquareQ>
                </h4>
                <div className="text-slate-400 text-lg font-normal">
                  /0.3
                </div>
                {/* Description text - hidden by default, shown on hover */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <p className="text-lg text-slate-700 leading-relaxed font-inter">
                    <SquareQ>1iQ Intel transforms raw project data into actionable intelligence through advanced analytics and AI-powered insights. Predict bottlenecks before they happen, optimize resource allocation in real-time, and make informed decisions that keep projects on track and profitable.</SquareQ>
                  </p>
                </div>
              </div>
              
              {/* Center - Image (hidden by default, shown on hover) */}
              <div className="lg:col-span-4 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <img 
                  src="https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=400&h=300&fit=crop" 
                  alt="1iQ Intel Analytics Dashboard" 
                  className="w-full max-w-sm h-auto rounded-lg shadow-lg"
                />
              </div>

              {/* Right side - 1iQ Intel Logo */}
              <div className="lg:col-span-4 flex items-center justify-center lg:justify-end">
                <div className="text-6xl lg:text-[7.8rem] xl:text-[9.1rem] font-bold text-slate-900 tracking-tight leading-none">
                  <SquareQ>1iQ Intel</SquareQ>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PlatformsIntro;
