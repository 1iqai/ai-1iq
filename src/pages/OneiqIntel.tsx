import { useState, useEffect } from "react";
import { ArrowLeft, Share2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const OneiqIntel = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Header */}
      <div className="relative z-10 bg-transparent">
        <div className="container-custom py-6">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-foreground hover:bg-white/10"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <Button variant="ghost" size="icon" className="text-foreground hover:bg-white/10">
              <Share2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container-custom py-16">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/50 border border-primary/20 rounded-full text-sm font-medium text-accent-foreground">
                <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                1iQ Intel Platform
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight">
                <span className="block text-foreground mb-2">
                  Business Intelligence
                </span>
                <span className="block gradient-text">
                  Transformed
                </span>
              </h1>
              
              <p className="text-xl lg:text-2xl text-muted-foreground leading-relaxed font-light">
                Unlock the power of your data with advanced analytics, predictive modeling, and intelligent insights. 1iQ Intel transforms raw information into strategic advantages that drive informed decision-making.
              </p>
            </div>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <Button 
                size="lg" 
                className="group text-lg px-8 py-4 premium-button shadow-glow hover:shadow-glow hover:scale-[1.02] transition-all duration-300"
                onClick={() => navigate('/get-started')}
              >
                Get Started
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                className="group text-lg px-8 py-4 border-2 border-primary/20 hover:border-primary/40 bg-white/80 backdrop-blur-sm hover:bg-white/90 text-primary hover:text-primary shadow-elegant hover:shadow-premium transition-all duration-300"
                onClick={() => navigate('/schedule-demo')}
              >
                Schedule Demo
              </Button>
            </div>
          </div>
          
          {/* Right Content - Single Image */}
          <div className="relative lg:h-[600px]">
            <div className="absolute inset-0 bg-gradient-primary/10 rounded-3xl backdrop-blur-sm"></div>
            <div className="absolute -inset-4 bg-gradient-primary/5 rounded-[2rem] blur-xl"></div>
            <div className="relative h-full glass-effect rounded-3xl p-8 border border-primary/10 overflow-hidden">
              <img
                src="/lovable-uploads/40a39c64-1583-4424-b99e-27a52826f869.png"
                alt="1iQ Intel Analytics Dashboard"
                className="w-full h-full object-cover rounded-2xl shadow-elegant"
              />
            </div>
          </div>
          
        </div>
      </div>

      {/* Features Section */}
      <div className="container-custom py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Intelligence Features
            </h2>
            <p className="text-xl text-muted-foreground">
              Advanced analytics and insights for data-driven decisions
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="premium-card p-6 space-y-4">
              <h3 className="text-xl font-semibold text-foreground">
                Predictive Analytics
              </h3>
              <p className="text-muted-foreground">
                Advanced machine learning models analyze patterns and trends to forecast future outcomes and identify optimization opportunities.
              </p>
            </div>
            
            <div className="premium-card p-6 space-y-4">
              <h3 className="text-xl font-semibold text-foreground">
                Custom Dashboards
              </h3>
              <p className="text-muted-foreground">
                Flexible visualization tools allow you to create personalized dashboards that highlight the metrics most important to your operations.
              </p>
            </div>
            
            <div className="premium-card p-6 space-y-4">
              <h3 className="text-xl font-semibold text-foreground">
                Data Integration
              </h3>
              <p className="text-muted-foreground">
                Seamlessly connect and analyze data from multiple sources, creating a unified view of your business operations and performance.
              </p>
            </div>
            
            <div className="premium-card p-6 space-y-4">
              <h3 className="text-xl font-semibold text-foreground">
                Automated Reporting
              </h3>
              <p className="text-muted-foreground">
                Intelligent reporting systems generate comprehensive insights and deliver them to stakeholders automatically on customizable schedules.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OneiqIntel;