
const PlatformsIntro = () => {
  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Main headline */}
        <div className="text-center mb-32">
          <h2 className="font-inter text-5xl lg:text-6xl xl:text-7xl font-normal text-slate-900 leading-tight tracking-normal max-w-6xl mx-auto">
            Our software powers real-time, <span className="text-slate-400">AI-driven</span> clarity and decisions to construction teams on every site, at every scale.
          </h2>
        </div>

        {/* Our Platforms section */}
        <div className="mb-16">
          <h3 className="font-inter text-4xl lg:text-5xl font-normal text-slate-900 mb-20">
            Our Platforms
          </h3>
          
          {/* Platform 1 - 1iQ Core */}
          <div className="grid lg:grid-cols-2 gap-20 items-center mb-32">
            {/* Left side - Description */}
            <div className="space-y-8">
              <h4 className="font-inter text-2xl lg:text-3xl text-slate-700 font-normal leading-relaxed">
                Turn chaos into coordination
              </h4>
              <div className="text-slate-400 text-lg font-normal">
                /0.1
              </div>
            </div>
            
            {/* Right side - 1iQ Core Logo with hover effect */}
            <div className="flex items-center justify-center lg:justify-end">
              <div className="relative group cursor-pointer">
                <div className="text-6xl lg:text-[7.8rem] xl:text-[9.1rem] font-bold text-slate-900 tracking-tight leading-none transition-opacity duration-500 group-hover:opacity-0">
                  1iQ Core
                </div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <p className="text-lg lg:text-xl text-slate-700 leading-relaxed max-w-md text-center font-inter">
                    1iQ Core connects every moving part of your construction project scheduling, resources, field updates, and stakeholder visibility into a single, unified platform. Real-time data syncs across teams, giving project managers and clients unprecedented control and situational awareness from day one.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Platform 2 - 1iQ Field */}
          <div className="grid lg:grid-cols-2 gap-20 items-center mb-32">
            {/* Left side - Description */}
            <div className="space-y-8">
              <h4 className="font-inter text-2xl lg:text-3xl text-slate-700 font-normal leading-relaxed">
                The jobsite, reimagined
              </h4>
              <div className="text-slate-400 text-lg font-normal">
                /0.2
              </div>
            </div>
            
            {/* Right side - 1iQ Field Logo with hover effect */}
            <div className="flex items-center justify-center lg:justify-end">
              <div className="relative group cursor-pointer">
                <div className="text-6xl lg:text-[7.8rem] xl:text-[9.1rem] font-bold text-slate-900 tracking-tight leading-none transition-opacity duration-500 group-hover:opacity-0">
                  1iQ Field
                </div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <p className="text-lg lg:text-xl text-slate-700 leading-relaxed max-w-md text-center font-inter">
                    1iQ Field puts intuitive task checklists, live progress tracking, and instant feedback loops directly in the hands of your workforce. Built for the boots on the ground, it's lightweight, mobile-friendly, and designed to eliminate guesswork while keeping everyone aligned, accountable, and on pace.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Platform 3 - 1iQ Intel */}
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            {/* Left side - Description */}
            <div className="space-y-8">
              <h4 className="font-inter text-2xl lg:text-3xl text-slate-700 font-normal leading-relaxed">
                Decisions driven by data, not assumptions
              </h4>
              <div className="text-slate-400 text-lg font-normal">
                /0.3
              </div>
            </div>
            
            {/* Right side - 1iQ Intel Logo with hover effect */}
            <div className="flex items-center justify-center lg:justify-end">
              <div className="relative group cursor-pointer">
                <div className="text-6xl lg:text-[7.8rem] xl:text-[9.1rem] font-bold text-slate-900 tracking-tight leading-none transition-opacity duration-500 group-hover:opacity-0">
                  1iQ Intel
                </div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <p className="text-lg lg:text-xl text-slate-700 leading-relaxed max-w-md text-center font-inter">
                    1iQ Field puts intuitive task checklists, live progress tracking, and instant feedback loops directly in the hands of your workforce. Built for the boots on the ground, it's lightweight, mobile-friendly, and designed to eliminate guesswork while keeping everyone aligned, accountable, and on pace.
                  </p>
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
