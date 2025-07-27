import { useState, useEffect } from "react";
import { ArrowLeft, Share2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";

const OneiqPlatform = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-hero">
      <Header />
      
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

      {/* Main Hero Section */}
      <div className="container-custom py-16">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/50 border border-primary/20 rounded-full text-sm font-medium text-accent-foreground">
                <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                1iQ Core & Field
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight">
                <span className="block text-foreground mb-2">
                  Central Command
                </span>
                <span className="block gradient-text">
                  Intelligence
                </span>
              </h1>
              
              <p className="text-xl lg:text-2xl text-muted-foreground leading-relaxed font-light">
                Transform your entire operation with our comprehensive platform that combines project intelligence, field coordination, and AI-powered analytics. From strategic planning to field execution, 1iQ delivers unprecedented control and visibility.
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
          
          {/* Right Content - Platform Preview */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-primary/10 rounded-3xl backdrop-blur-sm"></div>
            <div className="absolute -inset-6 bg-gradient-primary/5 rounded-[3rem] blur-2xl"></div>
            <div className="relative glass-effect rounded-3xl p-8 border border-primary/10 overflow-hidden shadow-2xl">
              <div className="bg-white/95 rounded-2xl p-4 shadow-inner">
                <img
                  src="/lovable-uploads/8005dd27-23e3-4261-8a45-c07cc69a2996.png"
                  alt="1iQ Platform Dashboard"
                  className="w-full h-auto rounded-xl shadow-lg transform hover:scale-[1.02] transition-transform duration-500"
                />
              </div>
            </div>
          </div>
          
        </div>
      </div>

      {/* Core Capabilities Section */}
      <div className="container-custom py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Core Platform Capabilities
            </h2>
            <p className="text-xl text-muted-foreground">
              Powerful features for comprehensive project and field operations management
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="premium-card p-6 space-y-4">
              <h3 className="text-xl font-semibold text-foreground">
                AI-Powered Coordination
              </h3>
              <p className="text-muted-foreground">
                Advanced algorithms optimize resource allocation and predict potential bottlenecks before they impact project timelines.
              </p>
            </div>
            
            <div className="premium-card p-6 space-y-4">
              <h3 className="text-xl font-semibold text-foreground">
                Real-Time Analytics
              </h3>
              <p className="text-muted-foreground">
                Comprehensive dashboards provide instant visibility into project performance, resource utilization, and progress metrics.
              </p>
            </div>
            
            <div className="premium-card p-6 space-y-4">
              <h3 className="text-xl font-semibold text-foreground">
                Intelligent Automation
              </h3>
              <p className="text-muted-foreground">
                Automated workflows reduce manual overhead while ensuring critical tasks are completed on schedule and within budget.
              </p>
            </div>
            
            <div className="premium-card p-6 space-y-4">
              <h3 className="text-xl font-semibold text-foreground">
                Real-Time Scheduling
              </h3>
              <p className="text-muted-foreground">
                Dynamic scheduling that adapts to real-time conditions and automatically optimizes resource allocation across multiple job sites.
              </p>
            </div>
            
            <div className="premium-card p-6 space-y-4">
              <h3 className="text-xl font-semibold text-foreground">
                Team Communication
              </h3>
              <p className="text-muted-foreground">
                Seamless communication tools that keep field teams connected with real-time updates, messaging, and status reporting.
              </p>
            </div>
            
            <div className="premium-card p-6 space-y-4">
              <h3 className="text-xl font-semibold text-foreground">
                Predictive Insights
              </h3>
              <p className="text-muted-foreground">
                Machine learning models analyze historical data to forecast project outcomes and recommend optimization strategies.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Field Operations Showcase */}
      <div className="container-custom py-16">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* Left Content - Field Operations Image */}
          <div className="relative order-2 lg:order-1">
            <div className="absolute inset-0 bg-gradient-primary/10 rounded-3xl backdrop-blur-sm"></div>
            <div className="absolute -inset-6 bg-gradient-primary/5 rounded-[3rem] blur-2xl"></div>
            <div className="relative glass-effect rounded-3xl p-8 border border-primary/10 overflow-hidden shadow-2xl">
              <div className="bg-white/95 rounded-2xl p-4 shadow-inner">
                <img
                  src="/lovable-uploads/7d81da7b-2df8-46db-9e5b-695c1509856f.png"
                  alt="1iQ Field Operations Dashboard"
                  className="w-full h-auto rounded-xl shadow-lg transform hover:scale-[1.02] transition-transform duration-500"
                />
              </div>
            </div>
          </div>
          
          {/* Right Content */}
          <div className="space-y-8 order-1 lg:order-2">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                Field Operations Excellence
              </h2>
              
              <p className="text-xl text-muted-foreground leading-relaxed">
                Streamline field operations with real-time coordination, intelligent scheduling, and seamless communication between teams. From dispatch to completion, ensure every operation runs smoothly and efficiently.
              </p>
            </div>
            
            <div className="grid gap-6">
              <div className="premium-card p-6 space-y-3">
                <h3 className="text-lg font-semibold text-foreground">
                  Resource Management
                </h3>
                <p className="text-muted-foreground">
                  Intelligent resource tracking and allocation ensures the right equipment and personnel are available when and where needed.
                </p>
              </div>
              
              <div className="premium-card p-6 space-y-3">
                <h3 className="text-lg font-semibold text-foreground">
                  Progress Tracking
                </h3>
                <p className="text-muted-foreground">
                  Comprehensive progress monitoring with real-time updates, milestone tracking, and automated reporting capabilities.
                </p>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default OneiqPlatform;