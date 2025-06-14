
import { ArrowDown } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative bg-slate-900 py-20 px-6 min-h-[80vh] flex items-center overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-70"
        >
          <source src="/lovable-uploads/e93dd749-d087-4daf-8f07-ba9de354ebde.png" type="video/mp4" />
          {/* Fallback for browsers that don't support video */}
          <div className="w-full h-full bg-slate-800"></div>
        </video>
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto w-full flex items-center justify-center">
        {/* Centered Content matching reference layout */}
        <div className="text-center max-w-4xl">
          <h1 className="font-inter text-6xl lg:text-7xl xl:text-8xl font-normal text-white mb-12 leading-tight tracking-normal">
            AI-Powered Automation
            <br />
            for Every Decision
          </h1>
        </div>
      </div>

      {/* Scroll to Explore - positioned at bottom center */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex flex-col items-center">
        <span className="text-white text-lg font-inter mb-2 opacity-80">
          Scroll to Explore
        </span>
        <ArrowDown className="w-6 h-6 text-white animate-bounce-down opacity-80" />
      </div>
    </section>
  );
};

export default Hero;
