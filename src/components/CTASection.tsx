import { ArrowRight } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";

const CTASection = () => {
  const navigate = useNavigate();

  const handleRequestDemo = () => {
    navigate('/get-started');
  };

  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <Separator className="mb-12 bg-slate-300" />
        
        <div className="flex justify-center">
          {/* Request a Demo Button - Centered */}
          <div 
            className="group bg-gray-100 hover:bg-gray-200 transition-colors duration-300 rounded-2xl p-8 cursor-pointer h-32 w-96"
            onClick={handleRequestDemo}
          >
            <div className="flex items-center justify-between h-full">
              <h3 className="text-3xl font-normal text-slate-900">
                Request a Demo
              </h3>
              <ArrowRight className="h-6 w-6 text-slate-900 animate-bounce-horizontal transition-transform duration-300" />
            </div>
          </div>
        </div>

        <Separator className="mt-12 bg-slate-300" />
      </div>
    </section>
  );
};

export default CTASection;
