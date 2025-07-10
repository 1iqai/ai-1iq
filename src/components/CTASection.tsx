
import { ArrowRight } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const CTASection = () => {
  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <Separator className="mb-12 bg-slate-300" />
        
        <div className="flex justify-center">
          {/* Request a Demo Button - Centered */}
          <div className="group bg-gray-100 hover:bg-gray-200 transition-colors duration-300 rounded-2xl p-8 cursor-pointer h-32 w-96 overflow-hidden relative">
            <div className="flex items-center justify-between h-full relative">
              <div className="overflow-hidden flex-1">
                <h3 className="text-3xl font-normal text-slate-900 whitespace-nowrap animate-scroll-left">
                  Request a Demo Request a Demo Request a Demo
                </h3>
              </div>
              <ArrowRight className="h-6 w-6 text-slate-900 animate-bounce-horizontal transition-transform duration-300 ml-4" />
            </div>
          </div>
        </div>

        <Separator className="mt-12 bg-slate-300" />
      </div>
    </section>
  );
};

export default CTASection;
