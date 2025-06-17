import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import SquareQ from "./SquareQ";

const PlatformsIntro = () => {
  const navigate = useNavigate();

  return (
    <section className="py-24 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center space-y-6 mb-20">
          <h2 className="text-4xl lg:text-5xl font-light text-gray-900 leading-tight">
            <SquareQ>Three platforms. Infinite possibilities.</SquareQ>
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto font-light leading-relaxed">
            <SquareQ>1iQ provides AI-powered construction management solutions that integrate seamlessly across your entire project lifecycle, from planning to completion.</SquareQ>
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* 1iQ Core */}
          <div className="group cursor-pointer" onClick={() => navigate('/1iq-core')}>
            <div className="aspect-square bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-8 mb-6 group-hover:shadow-xl transition-all duration-300">
              <div className="h-full flex flex-col justify-between">
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-6">
                  <div className="w-6 h-6 bg-white rounded"></div>
                </div>
                <div>
                  <h3 className="text-2xl font-light text-gray-900 mb-3">
                    <SquareQ>1iQ Core</SquareQ>
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    <SquareQ>Unified project management platform integrating schedules, designs, and budgets with AI-powered insights.</SquareQ>
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center text-blue-600 group-hover:text-blue-700 transition-colors">
              <span className="font-medium mr-2"><SquareQ>Learn more</SquareQ></span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* 1iQ Field */}
          <div className="group cursor-pointer">
            <div className="aspect-square bg-gradient-to-br from-orange-50 to-yellow-100 rounded-2xl p-8 mb-6 group-hover:shadow-xl transition-all duration-300">
              <div className="h-full flex flex-col justify-between">
                <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center mb-6">
                  <div className="w-6 h-6 bg-white rounded"></div>
                </div>
                <div>
                  <h3 className="text-2xl font-light text-gray-900 mb-3">
                    <SquareQ>1iQ Field</SquareQ>
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    <SquareQ>Mobile-first solution for real-time data collection, task management, and on-site team collaboration.</SquareQ>
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center text-orange-500 group-hover:text-orange-600 transition-colors">
              <span className="font-medium mr-2"><SquareQ>Learn more</SquareQ></span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* 1iQ Intel */}
          <div className="group cursor-pointer">
            <div className="aspect-square bg-gradient-to-br from-purple-50 to-pink-100 rounded-2xl p-8 mb-6 group-hover:shadow-xl transition-all duration-300">
              <div className="h-full flex flex-col justify-between">
                <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mb-6">
                  <div className="w-6 h-6 bg-white rounded"></div>
                </div>
                <div>
                  <h3 className="text-2xl font-light text-gray-900 mb-3">
                    <SquareQ>1iQ Intel</SquareQ>
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    <SquareQ>Advanced analytics platform providing predictive insights, risk assessment, and strategic decision support.</SquareQ>
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center text-purple-500 group-hover:text-purple-600 transition-colors">
              <span className="font-medium mr-2"><SquareQ>Learn more</SquareQ></span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PlatformsIntro;
