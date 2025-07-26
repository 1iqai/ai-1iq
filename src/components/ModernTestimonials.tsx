import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Quote } from "lucide-react";
const ModernTestimonials = () => {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const testimonials = [{
    quote: "1iQ transformed our project management completely. We've seen a 40% increase in efficiency and our decision-making is now data-driven across all departments.",
    author: "Sarah Chen",
    role: "VP of Operations",
    company: "TechCorp Industries",
    rating: 5,
    image: "/lovable-uploads/e411713f-6562-4770-af58-ca6273eb1f4b.png"
  }, {
    quote: "The automation capabilities are incredible. What used to take our team hours now happens automatically, allowing us to focus on strategic initiatives.",
    author: "Michael Rodriguez",
    role: "Head of Engineering",
    company: "BuildRight Construction",
    rating: 5,
    image: "/lovable-uploads/8c40870e-03f4-4e78-8f28-4c980ae9c736.png"
  }, {
    quote: "Implementation was seamless and the ROI was evident within the first month. The platform scales beautifully with our growing business needs.",
    author: "Emily Johnson",
    role: "Chief Technology Officer",
    company: "Infrastructure Solutions",
    rating: 5,
    image: "/lovable-uploads/b5b303f6-c418-4625-bb79-dc96bb3cfbe6.png"
  }];
  const stats = [{
    value: "500+",
    label: "Organizations Trust Us"
  }, {
    value: "40%",
    label: "Average Efficiency Gain"
  }, {
    value: "99.9%",
    label: "Platform Uptime"
  }, {
    value: "24/7",
    label: "Expert Support"
  }];
  return <section className="py-16 bg-muted/30">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Trusted by industry{" "}
            <span className="gradient-text">
              leaders worldwide
            </span>
          </h2>
          <p className="text-xl text-muted-foreground leading-relaxed">
            See how organizations are transforming their operations with 1iQ.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {stats.map((stat, index) => <div key={index} className="text-center">
              
            </div>)}
        </div>

        {/* Testimonials */}
        <div className="max-w-4xl mx-auto">
          <Card className="p-8 lg:p-12 border-border/50 shadow-large">
            <div className="flex flex-col lg:flex-row gap-8 items-center">
              {/* Quote Section */}
              <div className="flex-1 space-y-6">
                <Quote className="w-12 h-12 text-primary opacity-60" />
                <blockquote className="text-xl lg:text-2xl leading-relaxed text-foreground">
                  {`"${testimonials[activeTestimonial].quote}"`}
                </blockquote>
                
                {/* Rating */}
                <div className="flex items-center space-x-1">
                  {[...Array(testimonials[activeTestimonial].rating)].map((_, i) => <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />)}
                </div>
                
                {/* Author Info */}
                <div className="space-y-1">
                  <div className="font-semibold text-foreground text-lg">
                    {testimonials[activeTestimonial].author}
                  </div>
                  <div className="text-muted-foreground">
                    Business Intelligence
                  </div>
                  <div className="text-sm text-muted-foreground font-medium">
                    {testimonials[activeTestimonial].company}
                  </div>
                </div>
              </div>
              
              {/* Image */}
              <div className="flex-shrink-0">
                
              </div>
            </div>
          </Card>

          {/* Testimonial Navigation */}
          <div className="flex justify-center mt-6 space-x-2">
            {testimonials.map((_, index) => <button key={index} onClick={() => setActiveTestimonial(index)} className={`w-3 h-3 rounded-full transition-all duration-300 ${index === activeTestimonial ? 'bg-primary scale-125' : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'}`} />)}
          </div>
        </div>
      </div>
    </section>;
};
export default ModernTestimonials;