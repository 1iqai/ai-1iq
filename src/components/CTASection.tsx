
import { ArrowRight } from "lucide-react";

const CTASection = () => {
  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Request a Demo Button - Light */}
          <div className="group bg-gray-100 hover:bg-gray-200 transition-colors duration-300 rounded-2xl p-8 cursor-pointer h-32">
            <div className="flex items-center justify-between h-full">
              <h3 className="text-3xl font-normal text-slate-900">
                Request a Demo
              </h3>
              <ArrowRight className="h-6 w-6 text-slate-900 group-hover:translate-x-2 transition-transform duration-300" />
            </div>
          </div>

          {/* Start Building Button - Dark */}
          <div className="group bg-slate-900 hover:bg-slate-800 transition-colors duration-300 rounded-2xl p-8 cursor-pointer h-32">
            <div className="flex items-center justify-between h-full">
              <h3 className="text-3xl font-normal text-white">
                Start Building
              </h3>
              <ArrowRight className="h-6 w-6 text-white group-hover:translate-x-2 transition-transform duration-300" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
