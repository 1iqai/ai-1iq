
import { ArrowRight, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import SquareQ from "./SquareQ";

const Hero = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <section className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-muted flex items-center relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      {/* Content Container */}
      <div className="container-custom relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center min-h-screen py-20">
          
          {/* Left Content */}
          <div className="space-y-8 animate-fade-in">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight tracking-tight">
                <span className="block text-foreground">
                  <SquareQ>Transform Your</SquareQ>
                </span>
                <span className="block gradient-text">
                  <SquareQ>Decision Making</SquareQ>
                </span>
                <span className="block text-foreground">
                  <SquareQ>with AI-Powered</SquareQ>
                </span>
                <span className="block text-foreground">
                  <SquareQ>Automation</SquareQ>
                </span>
              </h1>
              
              <p className="text-xl lg:text-2xl text-muted-foreground max-w-2xl leading-relaxed">
                <SquareQ>1iQ delivers mission-critical execution for complex projects, driving precision and performance across construction, infrastructure, and enterprise operations.</SquareQ>
              </p>
            </div>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button 
                size="lg" 
                className="group text-lg px-8 py-4 bg-primary hover:bg-primary/90 text-primary-foreground"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                <SquareQ>Get Started Free</SquareQ>
                <ArrowRight className={`ml-2 h-5 w-5 transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}`} />
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                className="group text-lg px-8 py-4 border-2 hover:bg-muted/50"
              >
                <PlayCircle className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                <SquareQ>Watch Demo</SquareQ>
              </Button>
            </div>
            
            {/* Trust Indicators */}
            <div className="pt-8 space-y-4">
              <p className="text-sm text-muted-foreground font-medium">
                <SquareQ>Trusted by 500+ organizations worldwide</SquareQ>
              </p>
              <div className="flex items-center space-x-6 opacity-60">
                <div className="text-xs font-semibold tracking-wider">ENTERPRISE</div>
                <div className="text-xs font-semibold tracking-wider">SECURE</div>
                <div className="text-xs font-semibold tracking-wider">SCALABLE</div>
              </div>
            </div>
          </div>
          
          {/* Right Content - Visual Element */}
          <div className="relative lg:h-[600px] animate-slide-up">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-3xl backdrop-blur-sm"></div>
            <div className="relative h-full bg-card rounded-3xl shadow-large p-8 border border-border/50">
              {/* Dashboard Preview */}
              <div className="h-full flex flex-col space-y-4">
                <div className="flex items-center justify-between">
                  <div className="h-3 w-3 rounded-full bg-destructive"></div>
                  <div className="h-3 w-3 rounded-full bg-yellow-400"></div>
                  <div className="h-3 w-3 rounded-full bg-green-400"></div>
                </div>
                
                <div className="flex-1 space-y-4">
                  <div className="h-8 bg-muted rounded animate-pulse"></div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="h-20 bg-primary/10 rounded-lg animate-pulse"></div>
                    <div className="h-20 bg-accent/30 rounded-lg animate-pulse"></div>
                    <div className="h-20 bg-secondary/50 rounded-lg animate-pulse"></div>
                  </div>
                  <div className="h-32 bg-muted/50 rounded-lg animate-pulse"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-muted/30 rounded animate-pulse"></div>
                    <div className="h-4 bg-muted/20 rounded animate-pulse w-3/4"></div>
                    <div className="h-4 bg-muted/10 rounded animate-pulse w-1/2"></div>
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
