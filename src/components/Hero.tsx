
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
          
          {/* Right Content - Premium Dashboard Preview */}
          <div className="relative lg:h-[600px] animate-slide-up">
            <div className="absolute inset-0 bg-gradient-primary/10 rounded-3xl backdrop-blur-sm"></div>
            <div className="absolute -inset-4 bg-gradient-primary/5 rounded-[2rem] blur-xl"></div>
            <div className="relative h-full glass-effect rounded-3xl p-8 border border-primary/10 overflow-hidden">
              {/* Dashboard Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                    1iQ
                  </div>
                  <div className="text-sm font-semibold text-foreground">Enterprise Dashboard</div>
                </div>
                <div className="flex gap-2">
                  <div className="h-3 w-3 rounded-full bg-success/80"></div>
                  <div className="h-3 w-3 rounded-full bg-warning/80"></div>
                  <div className="h-3 w-3 rounded-full bg-destructive/80"></div>
                </div>
              </div>
              
              {/* Dashboard Content */}
              <div className="space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="premium-card p-4 space-y-2">
                    <div className="h-2 bg-gradient-primary rounded-full w-3/4"></div>
                    <div className="h-6 bg-primary/20 rounded w-1/2"></div>
                  </div>
                  <div className="premium-card p-4 space-y-2">
                    <div className="h-2 bg-gradient-to-r from-success to-info rounded-full w-2/3"></div>
                    <div className="h-6 bg-success/20 rounded w-3/4"></div>
                  </div>
                  <div className="premium-card p-4 space-y-2">
                    <div className="h-2 bg-gradient-to-r from-warning to-destructive rounded-full w-1/2"></div>
                    <div className="h-6 bg-warning/20 rounded w-1/3"></div>
                  </div>
                </div>
                
                {/* Main Chart Area */}
                <div className="premium-card p-6 space-y-4">
                  <div className="h-6 bg-gradient-primary/20 rounded w-1/4"></div>
                  <div className="h-32 bg-gradient-to-br from-primary/10 via-brand-indigo/10 to-brand-purple/10 rounded-lg relative overflow-hidden">
                    <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-primary/30 rounded-b-lg"></div>
                    <div className="absolute bottom-0 left-1/4 w-2 h-20 bg-primary rounded-t"></div>
                    <div className="absolute bottom-0 left-1/2 w-2 h-24 bg-brand-indigo rounded-t"></div>
                    <div className="absolute bottom-0 left-3/4 w-2 h-16 bg-brand-purple rounded-t"></div>
                  </div>
                </div>
                
                {/* Activity List */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 premium-card">
                    <div className="w-2 h-2 bg-success rounded-full"></div>
                    <div className="h-3 bg-muted/60 rounded flex-1"></div>
                  </div>
                  <div className="flex items-center gap-3 p-3 premium-card">
                    <div className="w-2 h-2 bg-warning rounded-full"></div>
                    <div className="h-3 bg-muted/40 rounded flex-1 w-3/4"></div>
                  </div>
                  <div className="flex items-center gap-3 p-3 premium-card">
                    <div className="w-2 h-2 bg-info rounded-full"></div>
                    <div className="h-3 bg-muted/20 rounded flex-1 w-1/2"></div>
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

export default Hero;
