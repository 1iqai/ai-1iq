
const ScrollingBanner = () => {
  const sections = [
    {
      title: "Defense Reformation",
      industries: ["Aerospace", "Military Contractors", "Defense Systems"]
    },
    {
      title: "Warp Speed",
      industries: ["Logistics", "Supply Chain", "Transportation"]
    },
    {
      title: "Tariffs",
      industries: ["Manufacturing", "Trade", "Import/Export"]
    },
    {
      title: "DevCon2",
      industries: ["Technology", "Software", "Development"]
    },
    {
      title: "AIPCon 6",
      industries: ["Artificial Intelligence", "Machine Learning", "Automation"]
    },
    {
      title: "Cybernetic Enterprise",
      industries: ["Cybersecurity", "Enterprise", "Digital Infrastructure"]
    },
    {
      title: "Maven Smart System",
      industries: ["Smart Systems", "IoT", "Connected Devices"]
    },
    {
      title: "TITAN",
      industries: ["Heavy Industry", "Construction", "Manufacturing"]
    },
    {
      title: "Vantage",
      industries: ["Analytics", "Business Intelligence", "Strategic Planning"]
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
