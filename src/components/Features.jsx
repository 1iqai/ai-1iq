import { Brain, Zap, Shield, BarChart3, Users, Cog } from "lucide-react";

export function BrutalistFeatures(){
  const features = [
    {
      id: "ai-intelligence",
      icon: Brain,
      title: "AI-Powered Intelligence",
      description: "Advanced machine learning algorithms that adapt and optimize your workflows in real-time.",
      badge: "#AI",
      color: "bg-blue-500"
    },
    {
      id: "automation",
      icon: Zap,
      title: "Smart Automation",
      description: "Automate complex processes with intelligent triggers and seamless integrations.",
      badge: "#Automation",
      color: "bg-green-500"
    },
    {
      id: "security",
      icon: Shield,
      title: "Enterprise Security",
      description: "Bank-grade security with end-to-end encryption and compliance standards.",
      badge: "#Security",
      color: "bg-red-500"
    },
    {
      id: "analytics",
      icon: BarChart3,
      title: "Real-time Analytics",
      description: "Comprehensive insights and reporting with customizable dashboards.",
      badge: "#Analytics",
      color: "bg-orange-500"
    },
    {
      id: "collaboration",
      icon: Users,
      title: "Team Collaboration",
      description: "Seamless collaboration tools that keep your team connected and productive.",
      badge: "#Teams",
      color: "bg-purple-500"
    },
    {
      id: "integration",
      icon: Cog,
      title: "Easy Integration",
      description: "Connect with 500+ tools and platforms through our robust API ecosystem.",
      badge: "#API",
      color: "bg-gray-700"
    }
  ];

  return (
    <div className="brutalist-features container mx-auto px-4 py-12">
      <h2 className="brutalist-features__title text-4xl font-extrabold uppercase pb-2 mb-8">
        Platform Features
      </h2>

      {/* Vertical stacked layout using the transparent rounded card style provided */}
      <div className="brutalist-features__list flex flex-col gap-6 items-center">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <div
              key={feature.id}
              className="brutalist-features__card max-w-sm w-full rounded overflow-hidden shadow-lg bg-white/5 backdrop-blur-sm transition-transform duration-200 hover:translate-y-0.5"
            >
              <div className="brutalist-features__card-content px-6 py-4">
                {/* Icon + Title */}
                <div className="brutalist-features__card-header flex items-center gap-3 mb-4">
                  <div className={`brutalist-features__icon w-12 h-12 ${feature.color} bg-opacity-90 flex items-center justify-center rounded-full`}>
                    <Icon className="brutalist-features__icon-symbol text-white w-6 h-6" />
                  </div>
                  <h3 className="brutalist-features__card-title font-black text-xl uppercase">{feature.title}</h3>
                </div>

                {/* Description */}
                <p className="brutalist-features__card-description text-black-200 text-base mb-4 leading-snug">
                  {feature.description}
                </p>

                {/* Tags */}
                <div className="brutalist-features__tags px-6 pt-4 pb-2 -mx-6 -mb-4">
                  <div className="brutalist-features__tags-container px-6 pt-4 pb-2">
                    <span className="brutalist-features__tag brutalist-features__tag--primary inline-block bg-gray-200/30 text-black-100 rounded-full px-3 py-1 text-sm font-semibold mr-2 mb-2">
                      {feature.badge}
                    </span>
                    <span className="brutalist-features__tag brutalist-features__tag--secondary inline-block bg-gray-200/20 text-black-100 rounded-full px-3 py-1 text-sm font-semibold mr-2 mb-2">
                      {feature.id.replace("-", " ")}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BrutalistFeatures;