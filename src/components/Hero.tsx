
import { Button } from "@/components/ui/button";
import { useState } from "react";

const Hero = () => {
  const [email, setEmail] = useState("");

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
          <h1 className="text-6xl lg:text-7xl xl:text-8xl font-light text-white mb-12 leading-tight tracking-wide">
            Data-Powered Automation
            <br />
            for Every Decision
          </h1>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-2xl mx-auto">
            <div className="flex-1 min-w-0">
              <input
                type="email"
                placeholder="What's your work email?"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-6 py-4 rounded-full border-2 border-white/20 bg-white/10 backdrop-blur-sm text-white placeholder-white/70 text-lg focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50"
              />
            </div>
            <Button className="bg-white hover:bg-white/90 text-slate-900 rounded-full px-8 py-4 text-lg font-medium whitespace-nowrap">
              Start free trial
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
