
import { Search, Users, Shield, Zap, Database, BarChart3 } from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: Search,
      title: "Data Discovery",
      description: "Find the data you need faster with AI-powered search across all your data sources."
    },
    {
      icon: Users,
      title: "Collaboration",
      description: "Enable seamless collaboration between data teams and business stakeholders."
    },
    {
      icon: Shield,
      title: "Data Governance",
      description: "Maintain data quality and compliance with automated governance workflows."
    },
    {
      icon: Zap,
      title: "Automation",
      description: "Automate documentation and lineage tracking to keep your data catalog up-to-date."
    },
    {
      icon: Database,
      title: "Universal Connectivity",
      description: "Connect to 100+ data sources including warehouses, BI tools, and SaaS platforms."
    },
    {
      icon: BarChart3,
      title: "Analytics",
      description: "Get insights into data usage patterns and optimize your data operations."
    }
  ];

  return (
    <section className="py-20 px-6 bg-slate-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            Everything you need to scale your data program
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            From discovery to governance, Secoda provides the tools your team needs 
            to build a world-class data program.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div key={index} className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <IconComponent className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;
