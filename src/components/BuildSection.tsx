
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import SquareQ from "./SquareQ";

const BuildSection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-20 px-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          {/* Left side - Image */}
          <div className="relative">
            <img 
              src="/lovable-uploads/e9d5b0fc-0ed1-4899-91d6-180731263b5b.png" 
              alt="Team collaboration"
              className="w-full h-auto rounded-lg"
            />
          </div>
          
          {/* Right side - Content */}
          <div className="flex flex-col items-center text-center space-y-12">
            <h2 className="font-inter text-2xl lg:text-3xl xl:text-4xl font-normal text-slate-900 leading-none">
              <SquareQ>There is so much left to build</SquareQ>
            </h2>
            
            <p className="font-inter text-lg lg:text-xl text-slate-600 leading-relaxed max-w-lg">
              <SquareQ>1iQ delivers mission-critical execution for the world's most complex projects—driving precision and performance across construction, infrastructure, and enterprise operations.</SquareQ>
            </p>
            
            <div className="pt-4">
              <Button 
                onClick={() => navigate('/learn-more')}
                variant="outline"
                className="border border-slate-300 text-slate-700 px-8 py-3 text-sm font-medium tracking-wide hover:bg-slate-50 transition-colors"
              >
                <SquareQ>LEARN MORE</SquareQ>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BuildSection;
