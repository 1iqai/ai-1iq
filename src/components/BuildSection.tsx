
const BuildSection = () => {
  return (
    <section className="py-20 px-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          {/* Left side - Image */}
          <div className="relative">
            <img 
              src="/lovable-uploads/e9d5b0fc-0ed1-4899-91d6-180731263b5b.png" 
              alt="Team collaboration"
              className="w-full h-auto rounded-lg"
            />
          </div>
          
          {/* Right side - Content */}
          <div className="space-y-8">
            <h2 className="font-inter text-4xl lg:text-5xl xl:text-6xl font-normal text-slate-900 leading-tight">
              There is so much left to build
            </h2>
            
            <p className="font-inter text-lg lg:text-xl text-slate-600 leading-relaxed max-w-lg">
              Palantirians deliver mission-critical outcomes for the West's most important institutions.
            </p>
            
            <div className="pt-4">
              <button className="border border-slate-300 text-slate-700 px-8 py-3 text-sm font-medium tracking-wide hover:bg-slate-50 transition-colors">
                LEARN MORE
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BuildSection;
