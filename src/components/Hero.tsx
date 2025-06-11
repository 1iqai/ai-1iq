
import { Button } from "@/components/ui/button";
import { PlayCircle, ArrowRight } from "lucide-react";

const Hero = () => {
  return (
    <section className="bg-gradient-to-br from-slate-50 to-blue-50 py-20 px-6">
      <div className="max-w-7xl mx-auto text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
            Turn your data team into
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> data champions</span>
          </h1>
          
          <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Secoda is the data enablement platform that empowers both data teams and data consumers 
            to efficiently discover, understand, and use data.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg">
              Book a demo
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button variant="outline" size="lg" className="px-8 py-3 text-lg border-slate-300">
              <PlayCircle className="mr-2 h-5 w-5" />
              Watch the demo
            </Button>
          </div>
          
          <div className="relative">
            <div className="bg-white rounded-xl shadow-2xl p-4 max-w-5xl mx-auto">
              <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg h-96 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-20 h-20 bg-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <PlayCircle className="h-10 w-10 text-white" />
                  </div>
                  <p className="text-slate-600">Demo Video Preview</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
