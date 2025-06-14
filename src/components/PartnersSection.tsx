
const PartnersSection = () => {
  const partners = [
    {
      name: "L3HARRIS",
      quote: "I did not want a dashboard to tell me I was in trouble. I know when I'm in trouble. I wanted someone to give me some predictives, and some ways to...get me not only technologically advanced, but decisionally be more agile and and able to maximize cost [savings] and efficiencies."
    },
    {
      name: "SOMPO JAPAN",
      quote: "So, what was the impact? Over the last three years, we have seen a $60 million improvement in profit. And we expect an additional $100M over the next three years."
    },
    {
      name: "GENERAL MILLS",
      quote: "We're saving on average about $40,000 a day, which is about $14M annually – and it's really only deployed to part of our network."
    },
    {
      name: "AARP",
      quote: "Foundry and AIP have been terrific for us. We launched the first prototype within 45 days. And that was just amazing from my perspective."
    },
    {
      name: "KRAFT",
      quote: "What we want to start scaling that autonomous if we were to rely...that would hit 384 billion a day. It would be impossible."
    }
  ];

  return (
    <section className="py-20 px-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl lg:text-5xl font-normal text-slate-900 mb-20">
          What our partners say about us
        </h2>
        
        <div className="overflow-hidden">
          <div className="flex animate-scroll-left gap-8">
            {/* First set of testimonials */}
            {partners.map((partner, index) => (
              <div key={`first-${index}`} className="flex-shrink-0 w-80 bg-gray-200 p-8 rounded-lg">
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">
                    {partner.name}
                  </h3>
                  <blockquote className="text-slate-700 leading-relaxed">
                    "{partner.quote}"
                  </blockquote>
                </div>
              </div>
            ))}
            {/* Duplicate set for seamless loop */}
            {partners.map((partner, index) => (
              <div key={`second-${index}`} className="flex-shrink-0 w-80 bg-gray-200 p-8 rounded-lg">
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">
                    {partner.name}
                  </h3>
                  <blockquote className="text-slate-700 leading-relaxed">
                    "{partner.quote}"
                  </blockquote>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PartnersSection;
