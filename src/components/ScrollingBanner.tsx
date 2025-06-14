
import ScrollAnimatedText from "./ScrollAnimatedText";

const ScrollingBanner = () => {
  const companies = [
    { name: "Red Bull", logo: "🔴" },
    { name: "Amazon", logo: "📦" },
    { name: "Shell", logo: "🐚" },
    { name: "G2", logo: "⭐" },
    { name: "DEEZER", logo: "🎵" },
    { name: "Kaufland", logo: "K" },
    { name: "AFG", logo: "AFG" },
    { name: "dailypay", logo: "💰" },
    { name: "loop", logo: "○" },
    { name: "6sense", logo: "6sense" },
  ];

  return (
    <div className="bg-white py-8 overflow-hidden">
      <div className="relative">
        <ScrollAnimatedText 
          className="flex animate-scroll gap-16"
          speed={0.8}
          direction="right"
        >
          {/* First set of logos */}
          {companies.map((company, index) => (
            <div key={`first-${index}`} className="flex items-center justify-center min-w-[120px]">
              <div className="text-slate-400 text-xl font-medium whitespace-nowrap">
                {company.logo} {company.name}
              </div>
            </div>
          ))}
          {/* Duplicate set for seamless loop */}
          {companies.map((company, index) => (
            <div key={`second-${index}`} className="flex items-center justify-center min-w-[120px]">
              <div className="text-slate-400 text-xl font-medium whitespace-nowrap">
                {company.logo} {company.name}
              </div>
            </div>
          ))}
        </ScrollAnimatedText>
      </div>
    </div>
  );
};

export default ScrollingBanner;
