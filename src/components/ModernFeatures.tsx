import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Brain, Zap, Shield, BarChart3, Users, Cog } from "lucide-react";

const ModernFeatures = () => {
  const navigate = useNavigate();
  const [hoveredFeature, setHoveredFeature] = useState<string | null>(null);

  const features = [
    {
      id: "ai-intelligence",
      icon: Brain,
      title: "AI-Powered Intelligence",
      description: "Advanced machine learning algorithms that adapt and optimize your workflows in real-time.",
      badge: "AI Core",
      color: "from-blue-500 to-purple-600"
    },
    {
      id: "automation",
      icon: Zap,
      title: "Smart Automation",
      description: "Automate complex processes with intelligent triggers and seamless integrations.",
      badge: "Automation",
      color: "from-green-500 to-teal-600"
    },
    {
      id: "security",
      icon: Shield,
      title: "Enterprise Security",
      description: "Bank-grade security with end-to-end encryption and compliance standards.",
      badge: "Security",
      color: "from-red-500 to-pink-600"
    },
    {
      id: "analytics",
      icon: BarChart3,
      title: "Real-time Analytics",
      description: "Comprehensive insights and reporting with customizable dashboards.",
      badge: "Analytics",
      color: "from-orange-500 to-yellow-600"
    },
    {
      id: "collaboration",
      icon: Users,
      title: "Team Collaboration",
      description: "Seamless collaboration tools that keep your team connected and productive.",
      badge: "Teams",
      color: "from-purple-500 to-indigo-600"
    },
    {
      id: "integration",
      icon: Cog,
      title: "Easy Integration",
      description: "Connect with 500+ tools and platforms through our robust API ecosystem.",
      badge: "API",
      color: "from-gray-500 to-slate-600"
    }
  ];

  return (
    <section className="section-padding bg-background">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-muted-foreground mb-4 tracking-wide">
            Platform Features
          </h3>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Everything you need to{" "}
            <span className="gradient-text">
              accelerate growth
            </span>
          </h2>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Powerful features designed to transform how you work, with the flexibility to scale as you grow.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature) => {
            const IconComponent = feature.icon;
            return (
              <div
                key={feature.id}
                className={`group relative p-8 rounded-2xl border border-border/50 bg-card hover:bg-card/80 transition-all duration-300 hover-lift ${
                  hoveredFeature === feature.id ? 'shadow-large' : 'shadow-soft'
                }`}
                onMouseEnter={() => setHoveredFeature(feature.id)}
                onMouseLeave={() => setHoveredFeature(null)}
              >
                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300`}></div>
                
                <div className="relative z-10">
                  {/* Badge */}
                  <Badge variant="secondary" className="mb-4 text-xs">
                    {feature.badge}
                  </Badge>
                  
                  {/* Icon */}
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${feature.color} p-2.5 mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="w-full h-full text-white" />
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-xl font-semibold text-foreground mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                  
                  {/* Arrow Icon */}
                  <ArrowRight className={`w-5 h-5 text-muted-foreground mt-4 group-hover:text-primary group-hover:translate-x-1 transition-all duration-300 ${
                    hoveredFeature === feature.id ? 'opacity-100' : 'opacity-0'
                  }`} />
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <div className="inline-flex flex-col sm:flex-row gap-4">
            <Button 
              size="lg" 
              className="px-8 py-4 text-lg"
              onClick={() => {
                // Find and click the menu button in the header
                const menuButton = document.querySelector('header button:last-child') as HTMLButtonElement;
                if (menuButton) {
                  menuButton.click();
                }
              }}
            >
              Explore All Features
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="px-8 py-4 text-lg border-2"
              onClick={() => navigate('/schedule-demo')}
            >
              Schedule Demo
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ModernFeatures;