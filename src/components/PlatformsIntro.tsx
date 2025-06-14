
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
          
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            {/* Left side - Description */}
            <div className="space-y-8">
              <h4 className="font-inter text-2xl lg:text-3xl text-slate-700 font-normal leading-relaxed">
                Turn chaos into coordination
              </h4>
              <div className="text-slate-400 text-lg font-normal">
                /0.1
              </div>
            </div>
            
            {/* Right side - AIP Logo */}
            <div className="flex items-center justify-center lg:justify-end">
              <div className="text-9xl lg:text-[12rem] xl:text-[14rem] font-bold text-slate-900 tracking-tight leading-none">
                AIP
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PlatformsIntro;
