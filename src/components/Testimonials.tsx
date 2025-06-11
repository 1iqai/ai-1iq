
const Testimonials = () => {
  const testimonials = [
    {
      quote: "Secoda has transformed how our team discovers and uses data. What used to take hours now takes minutes.",
      author: "Sarah Chen",
      role: "Head of Data",
      company: "TechCorp"
    },
    {
      quote: "The AI-powered search is incredible. Our analysts can find the exact datasets they need instantly.",
      author: "Michael Rodriguez",
      role: "Data Engineer",
      company: "DataFlow"
    },
    {
      quote: "Finally, a tool that bridges the gap between our data team and business stakeholders.",
      author: "Emily Johnson",
      role: "VP of Analytics",
      company: "GrowthCo"
    }
  ];

  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            Loved by data teams everywhere
          </h2>
          <p className="text-xl text-slate-600">
            See what our customers have to say about Secoda
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-slate-50 p-8 rounded-xl">
              <blockquote className="text-slate-700 mb-6 leading-relaxed">
                "{testimonial.quote}"
              </blockquote>
              <div>
                <div className="font-semibold text-slate-900">{testimonial.author}</div>
                <div className="text-slate-600">{testimonial.role}</div>
                <div className="text-slate-500 text-sm">{testimonial.company}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
