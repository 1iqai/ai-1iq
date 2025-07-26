import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ModernCTA = () => {
  const navigate = useNavigate();

  const benefits = [
    "No setup fees or hidden costs",
    "30-day money-back guarantee",
    "24/7 expert support included",
    "Free migration assistance"
  ];

  return (
    <section className="section-padding bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto text-center">
          {/* Header */}
          <Badge variant="outline" className="mb-6 text-sm font-medium border-primary/20">
            Ready to Transform?
          </Badge>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Start building the future
            <br />
            <span className="gradient-text">
              of your business today
            </span>
          </h2>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            Join thousands of organizations already transforming their operations with 1iQ. Get started in minutes, not months.
          </p>

          {/* Benefits List */}
          <div className="grid sm:grid-cols-2 gap-4 mb-8 max-w-2xl mx-auto">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center space-x-3 text-left">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span className="text-muted-foreground">
                  {benefit}
                </span>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg" 
              className="group text-lg px-8 py-4 bg-primary hover:bg-primary/90 text-primary-foreground shadow-large"
              onClick={() => navigate('/get-started')}
            >
              Start Free Trial
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Button>
            
            <Button 
              variant="outline" 
              size="lg"
              className="text-lg px-8 py-4 border-2 hover:bg-muted/50"
              onClick={() => navigate('/schedule-demo')}
            >
              Schedule Demo
            </Button>
          </div>

          {/* Trust Elements */}
          <div className="mt-8 pt-8 border-t border-border/50">
            <p className="text-sm text-muted-foreground mb-4">
              Join 500+ organizations already using 1iQ
            </p>
            <div className="flex justify-center items-center space-x-8 opacity-60">
              <div className="text-xs font-semibold tracking-wider">SOC 2 COMPLIANT</div>
              <div className="text-xs font-semibold tracking-wider">GDPR READY</div>
              <div className="text-xs font-semibold tracking-wider">99.9% UPTIME</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ModernCTA;