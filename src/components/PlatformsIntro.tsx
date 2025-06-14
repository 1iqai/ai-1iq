
const PlatformsIntro = () => {
  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Main headline */}
        <div className="text-center mb-20">
          <h2 className="font-inter text-5xl lg:text-6xl xl:text-7xl font-normal text-slate-900 leading-tight tracking-normal max-w-6xl mx-auto">
            Our software powers real-time, <span className="text-slate-400">AI-driven</span>
            <br />
            decisions in critical government and
            <br />
            commercial enterprises in the West, from the
            <br />
            factory floors to the front lines.
          </h2>
        </div>

        {/* Our Platforms section */}
        <div className="mb-16">
          <h3 className="font-inter text-4xl lg:text-5xl font-normal text-slate-900 mb-16">
            Our Platforms
          </h3>
          
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* Left side - Description */}
            <div>
              <h4 className="font-inter text-xl text-slate-700 mb-2 leading-relaxed">
                Automate operations,
                <br />
                from the factory floor
                <br />
                to the front lines
              </h4>
              <div className="text-slate-400 text-lg mt-8">
                /0.1
              </div>
            </div>
            
            {/* Right side - AIP Logo */}
            <div className="flex items-center justify-center lg:justify-end">
              <div className="text-8xl lg:text-9xl font-bold text-slate-900 tracking-wider">
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
