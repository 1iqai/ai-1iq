
import { Separator } from "@/components/ui/separator";

const PartnersSection = () => {
  const partners = [
    {
      name: "RED BULL",
      quote: "We manage dozens of activations across the country at any given time. With 1iQ, we finally have a scheduling and tasking system that keeps our entire operations team synced in real time. What used to take hours to coordinate now takes minutes—and we've never had this level of visibility before."
    },
    {
      name: "HALIFAX CONSTRUCTION & DEVELOPMENT",
      quote: "1iQ completely transformed how we manage field operations. It replaced three platforms and our manual Excel process overnight. We now have real-time updates from job sites, instant schedule adjustments, and a live dashboard that keeps us on top of costs and crews. This is the future of construction coordination."
    },
    {
      name: "JTW SERVICES INC",
      quote: "As a fast-growing company, staying organized was starting to feel impossible. 1iQ gave us a system that scales with us. We've cut reporting time in half, caught issues before they became costly, and improved visibility across all projects. Most importantly—it's directly contributed to increased revenue and better client confidence."
    },
    {
      name: "DREW'S LIMO SERVICES",
      quote: "For a fleet-based business, timing is everything. 1iQ helped us streamline dispatching, track every service in real time, and reduce idle hours. Our team runs smoother, and our clients notice the difference. It's like having a real-time operations manager in your pocket."
    },
    {
      name: "THE WATERING HOPE\nFOUNDATION",
      quote: "Our projects span rural and urban communities—and communication used to be a challenge. With 1iQ, our teams now operate with full transparency. From resource allocation to task tracking, everything runs smoother. It's helped us stay accountable and scale impact without adding admin overhead."
    }
  ];

  return (
    <section className="py-20 px-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <Separator className="mb-12 bg-slate-300" />
        <h2 className="text-4xl lg:text-5xl font-normal text-slate-900 mb-20">
          What our partners say about us
        </h2>
        
        <div className="overflow-hidden">
          <div className="flex animate-scroll-left gap-8">
            {/* First set of testimonials */}
            {partners.map((partner, index) => (
              <div key={`first-${index}`} className="flex-shrink-0 w-80 bg-gray-200 p-8 rounded-lg">
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-slate-900 mb-4 whitespace-pre-line">
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
                  <h3 className="text-lg font-bold text-slate-900 mb-4 whitespace-pre-line">
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
