
import { Button } from "@/components/ui/button";
import { useState } from "react";

const Hero = () => {
  const [email, setEmail] = useState("");

  return (
    <section className="bg-gradient-to-b from-[#c8a2c8] via-[#e6c7d8] to-[#d4e3f0] py-20 px-6 min-h-[80vh] flex items-center">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        {/* Left side - Content */}
        <div className="max-w-xl">
          <h1 className="text-5xl lg:text-6xl font-bold text-slate-900 mb-6 leading-tight">
            AI Analytics
            <br />
            <span className="text-slate-700">Built on Trust</span>
          </h1>
          
          <p className="text-xl text-slate-600 mb-8 leading-relaxed">
            AI analytics powered by your data governance — complete 
            with built-in lineage, cataloging, metadata, access and data 
            quality to ensure trustworthy, accurate insights.
          </p>
          
          <div className="flex gap-4 mb-8">
            <div className="flex-1">
              <input
                type="email"
                placeholder="What's your work email?"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-6 py-3 rounded-full border border-slate-300 text-lg focus:outline-none focus:ring-2 focus:ring-slate-400"
              />
            </div>
            <Button className="bg-slate-900 hover:bg-slate-800 text-white rounded-full px-8 py-3 text-lg">
              Start free trial
            </Button>
          </div>
        </div>
        
        {/* Right side - AI Chat Interface */}
        <div className="relative">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-md mx-auto">
            <div className="bg-slate-50 rounded-lg p-4 mb-4">
              <div className="text-sm text-slate-600 mb-2">What's our logic for identifying gross margin?</div>
              <div className="text-xs text-slate-400 mb-3">Writing SQL query...</div>
              <div className="text-sm text-slate-700 mb-3">Based on your finance table, here's the most common logic:</div>
              
              <div className="bg-slate-800 rounded-lg p-3 font-mono text-sm">
                <div className="text-pink-400">SELECT</div>
                <div className="text-blue-400 ml-4">CASE</div>
                <div className="text-purple-400 ml-8">WHEN <span className="text-white">revenue = 0</span> THEN <span className="text-yellow-400">NULL</span></div>
                <div className="text-purple-400 ml-8">ELSE <span className="text-white">(revenue - cost_of_goods_sold) / revenue</span></div>
                <div className="text-blue-400 ml-4">END AS <span className="text-green-400">gross_margin</span></div>
                <div className="text-pink-400">FROM</div>
                <div className="text-white ml-4">financials</div>
              </div>
              
              <div className="flex gap-2 mt-3">
                <button className="text-xs px-3 py-1 bg-slate-200 rounded text-slate-600 hover:bg-slate-300">
                  📋 Copy
                </button>
                <button className="text-xs px-3 py-1 bg-slate-200 rounded text-slate-600 hover:bg-slate-300">
                  📚 Save to glossary
                </button>
              </div>
            </div>
            
            <div className="border-t pt-4">
              <input
                type="text"
                placeholder="Ask Secoda AI..."
                className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <div className="flex gap-2 mt-2 text-slate-400">
                <span className="text-sm">@</span>
                <span className="text-sm">📎</span>
                <span className="text-sm">🌐</span>
                <span className="text-sm">📊</span>
              </div>
            </div>
          </div>
          
          {/* Floating animation dots */}
          <div className="absolute -top-4 -right-4 w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
          <div className="absolute top-1/2 -left-6 w-2 h-2 bg-purple-400 rounded-full animate-pulse delay-1000"></div>
          <div className="absolute -bottom-6 left-1/3 w-4 h-4 bg-pink-400 rounded-full animate-pulse delay-500"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
