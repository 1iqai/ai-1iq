
import { ArrowRight, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const Hero = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <section className="min-h-screen bg-gradient-hero flex items-center relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-blue/5 via-transparent to-brand-indigo/5"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(59,130,246,0.1),transparent_50%)]"></div>
      
      {/* Content Container */}
      <div className="container-custom relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center min-h-screen py-20">
          
          {/* Left Content */}
          <div className="space-y-8 animate-fade-in">
            <div className="space-y-8">
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.1] tracking-tight">
                <span className="block text-foreground mb-2">
                  Transform Your
                </span>
                <span className="block gradient-text mb-2">
                  Decision Making
                </span>
                <span className="block text-foreground mb-2">
                  with AI-Powered
                </span>
                <span className="block text-foreground">
                  Automation
                </span>
              </h1>
              
              <p className="text-xl lg:text-2xl text-muted-foreground max-w-2xl leading-relaxed font-light">
                1iQ delivers mission-critical execution for complex projects, driving precision and performance across construction, infrastructure, and enterprise operations.
              </p>
            </div>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <Button 
                size="lg" 
                className="group text-lg px-8 py-4 premium-button shadow-glow hover:shadow-glow hover:scale-[1.02] transition-all duration-300"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                Get Started Free
                <ArrowRight className={`ml-2 h-5 w-5 transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}`} />
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                className="group text-lg px-8 py-4 border-2 border-primary/20 hover:border-primary/40 bg-white/80 backdrop-blur-sm hover:bg-white/90 text-primary hover:text-primary shadow-elegant hover:shadow-premium transition-all duration-300"
              >
                <PlayCircle className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                Watch Demo
              </Button>
            </div>
            
            {/* Trust Indicators */}
            <div className="pt-8 space-y-4">
              <p className="text-sm text-muted-foreground font-medium">
                Trusted by 500+ organizations worldwide
              </p>
              <div className="flex items-center space-x-6 opacity-60">
                <div className="text-xs font-semibold tracking-wider">ENTERPRISE</div>
                <div className="text-xs font-semibold tracking-wider">SECURE</div>
                <div className="text-xs font-semibold tracking-wider">SCALABLE</div>
              </div>
            </div>
          </div>
          
          {/* Right Content - Video Dashboard Preview */}
          <div className="relative lg:h-[600px] animate-slide-up">
            <div className="absolute inset-0 bg-gradient-primary/10 rounded-3xl backdrop-blur-sm"></div>
            <div className="absolute -inset-6 bg-gradient-primary/5 rounded-[3rem] blur-2xl"></div>
            <div className="relative glass-effect rounded-3xl p-8 border border-primary/10 overflow-hidden shadow-2xl">
              <div className="bg-white/95 rounded-2xl p-4 shadow-inner">
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-auto rounded-xl shadow-lg transform hover:scale-[1.02] transition-transform duration-500"
                  poster="/lovable-uploads/4ff089d9-32f4-4316-aacc-8ac8f22d910f.png"
                >
                  <source src="/lovable-uploads/4ff089d9-32f4-4316-aacc-8ac8f22d910f.png" type="video/mp4" />
                  {/* Fallback image if video fails to load */}
                  <img
                    src="/lovable-uploads/4ff089d9-32f4-4316-aacc-8ac8f22d910f.png"
                    alt="1iQ Enterprise Dashboard"
                    className="w-full h-auto rounded-xl shadow-lg"
                  />
                </video>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
};

export default Hero;
