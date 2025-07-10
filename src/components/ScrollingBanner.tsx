

const ScrollingBanner = () => {
  const sections = [
    {
      title: "Field Services & Maintenance",
      industries: ["HVAC", "Plumbing", "Electrical", "Elevator Maintenance", "Facility Management", "Equipment Servicing"]
    },
    {
      title: "Fleet Management & Logistics",
      industries: ["Trucking", "Delivery Services", "Public Transit", "Field Service Dispatch", "Heavy Equipment Tracking", "Vehicle Maintenance"]
    },
    {
      title: "Renewable Energy & Utilities",
      industries: ["Solar Installation", "Wind Energy", "Battery Storage", "Utility Services (Power, Water, Gas)", "Grid Modernization"]
    },
    {
      title: "Industrial & Infrastructure Projects",
      industries: ["Oil & Gas", "Mining", "Water Treatment", "Waste Management", "Telecom Tower Servicing"]
    },
    {
      title: "Property Development & Asset Management",
      industries: ["Commercial Real Estate", "Retail Rollouts", "Mixed-Use Developments", "Residential Renovations", "Facility Upgrades"]
    },
    {
      title: "Healthcare Infrastructure & Operations",
      industries: ["Hospital Construction", "Medical Facility Expansion", "Equipment Installation", "Mobile Clinics"]
    },
    {
      title: "Manufacturing & Plant Operations",
      industries: ["Assembly Line Installations", "Factory Automation", "Plant Maintenance", "Turnarounds & Shutdowns"]
    },
    {
      title: "Energy & Smart Infrastructure",
      industries: ["EV Charging Station Installations", "Smart Grid Projects", "Infrastructure Resiliency", "Utility Modernization"]
    }
  ];

  return (
    <div className="bg-white py-8 overflow-hidden">
      <div className="relative">
        <div className="flex animate-scroll gap-16">
          {/* First set */}
          {sections.map((section, index) => (
            <div key={`first-${index}`} className="flex flex-col items-start justify-center min-w-[200px]">
              <div className="font-bold text-gray-900 text-base mb-1 whitespace-nowrap">
                {section.title}
              </div>
              <div className="text-gray-400 text-sm space-y-0.5">
                {section.industries.map((industry, industryIndex) => (
                  <div key={industryIndex} className="whitespace-nowrap">
                    {industry}
                  </div>
                ))}
              </div>
            </div>
          ))}
          {/* Duplicate set for seamless loop */}
          {sections.map((section, index) => (
            <div key={`second-${index}`} className="flex flex-col items-start justify-center min-w-[200px]">
              <div className="font-bold text-gray-900 text-base mb-1 whitespace-nowrap">
                {section.title}
              </div>
              <div className="text-gray-400 text-sm space-y-0.5">
                {section.industries.map((industry, industryIndex) => (
                  <div key={industryIndex} className="whitespace-nowrap">
                    {industry}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ScrollingBanner;

