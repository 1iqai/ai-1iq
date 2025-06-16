
import { Youtube, Linkedin, Github, ArrowRight } from "lucide-react";
import SquareQ from "./SquareQ";

const Footer = () => {
  return (
    <footer className="bg-white text-gray-500 py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Left column - Copyright and legal */}
          <div className="col-span-2 md:col-span-1">
            <p className="text-xs mb-4">© 2025 1iQ Technologies Inc.</p>
            <p className="text-xs mb-8">All rights reserved.</p>
            
            <div className="border-t border-gray-200 pt-4 mb-8">
              <a href="#" className="text-xs relative group transition-colors">
                <span className="absolute -top-1 left-0 w-full h-0.5 bg-gray-900 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                <SquareQ>Do Not Sell or Share My Personal Information</SquareQ>
              </a>
            </div>
            
            <div className="border-t border-gray-200 pt-4 mb-8">
              <div className="flex flex-wrap gap-2 text-xs">
                <span>US</span>
                <span>UK</span>
                <span>JP</span>
                <span>KR</span>
              </div>
            </div>
            
            <div className="space-y-3">
              <button className="w-full max-w-[100px] border border-gray-300 rounded-full py-1.5 px-3 text-xs hover:bg-gray-50 transition-colors">
                <SquareQ>YOUTUBE</SquareQ>
              </button>
              <button className="w-full max-w-[100px] border border-gray-300 rounded-full py-1.5 px-3 text-xs hover:bg-gray-50 transition-colors">
                X
              </button>
              <button className="w-full max-w-[100px] border border-gray-300 rounded-full py-1.5 px-3 text-xs hover:bg-gray-50 transition-colors">
                <SquareQ>LINKEDIN</SquareQ>
              </button>
              <button className="w-full max-w-[100px] border border-gray-300 rounded-full py-1.5 px-3 text-xs hover:bg-gray-50 transition-colors">
                <SquareQ>GITHUB</SquareQ>
              </button>
            </div>
          </div>
          
          {/* Platforms Column */}
          <div>
            <h4 className="font-medium text-gray-400 text-xs mb-4 uppercase tracking-wider"><SquareQ>PLATFORMS</SquareQ></h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#" className="relative group transition-colors"><span className="absolute -top-1 left-0 w-full h-0.5 bg-gray-900 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span><SquareQ>1iQ Core</SquareQ></a></li>
              <li><a href="#" className="relative group transition-colors"><span className="absolute -top-1 left-0 w-full h-0.5 bg-gray-900 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span><SquareQ>1iQ Field</SquareQ></a></li>
              <li><a href="#" className="relative group transition-colors"><span className="absolute -top-1 left-0 w-full h-0.5 bg-gray-900 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span><SquareQ>1iQ Intel</SquareQ></a></li>
              <li><a href="#" className="relative group transition-colors"><span className="absolute -top-1 left-0 w-full h-0.5 bg-gray-900 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span><SquareQ>1iQ Cloud</SquareQ></a></li>
              <li><a href="#" className="relative group transition-colors"><span className="absolute -top-1 left-0 w-full h-0.5 bg-gray-900 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span><SquareQ>Developer Tools</SquareQ></a></li>
              <li><a href="#" className="relative group transition-colors"><span className="absolute -top-1 left-0 w-full h-0.5 bg-gray-900 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span><SquareQ>AI Command Center</SquareQ></a></li>
            </ul>
          </div>
          
          {/* Industries Served Column */}
          <div>
            <h4 className="font-medium text-gray-400 text-xs mb-4 uppercase tracking-wider"><SquareQ>INDUSTRIES SERVED</SquareQ></h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#" className="relative group transition-colors"><span className="absolute -top-1 left-0 w-full h-0.5 bg-gray-900 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span><SquareQ>Commercial Construction</SquareQ></a></li>
              <li><a href="#" className="relative group transition-colors"><span className="absolute -top-1 left-0 w-full h-0.5 bg-gray-900 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span><SquareQ>Industrial & Infrastructure</SquareQ></a></li>
              <li><a href="#" className="relative group transition-colors"><span className="absolute -top-1 left-0 w-full h-0.5 bg-gray-900 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span><SquareQ>Real Estate Development</SquareQ></a></li>
              <li><a href="#" className="relative group transition-colors"><span className="absolute -top-1 left-0 w-full h-0.5 bg-gray-900 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span><SquareQ>Public Sector & Smart Cities</SquareQ></a></li>
              <li><a href="#" className="relative group transition-colors"><span className="absolute -top-1 left-0 w-full h-0.5 bg-gray-900 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span><SquareQ>Healthcare Facilities</SquareQ></a></li>
              <li><a href="#" className="relative group transition-colors"><span className="absolute -top-1 left-0 w-full h-0.5 bg-gray-900 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span><SquareQ>Energy & Utilities</SquareQ></a></li>
              <li><a href="#" className="relative group transition-colors"><span className="absolute -top-1 left-0 w-full h-0.5 bg-gray-900 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span><SquareQ>Transportation & Rail</SquareQ></a></li>
              <li><a href="#" className="relative group transition-colors"><span className="absolute -top-1 left-0 w-full h-0.5 bg-gray-900 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span><SquareQ>Data Centers & Tech Campuses</SquareQ></a></li>
            </ul>
          </div>
          
          {/* Capabilities Column */}
          <div>
            <h4 className="font-medium text-gray-400 text-xs mb-4 uppercase tracking-wider"><SquareQ>CAPABILITIES</SquareQ></h4>
            <ul className="space-y-2 text-xs mb-8">
              <li><a href="#" className="relative group transition-colors"><span className="absolute -top-1 left-0 w-full h-0.5 bg-gray-900 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span><SquareQ>AI-Powered Scheduling</SquareQ></a></li>
              <li><a href="#" className="relative group transition-colors"><span className="absolute -top-1 left-0 w-full h-0.5 bg-gray-900 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span><SquareQ>Real-Time Data Sync</SquareQ></a></li>
              <li><a href="#" className="relative group transition-colors"><span className="absolute -top-1 left-0 w-full h-0.5 bg-gray-900 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span><SquareQ>Digital Twin Integration</SquareQ></a></li>
              <li><a href="#" className="relative group transition-colors"><span className="absolute -top-1 left-0 w-full h-0.5 bg-gray-900 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span><SquareQ>Predictive Conflict Resolution</SquareQ></a></li>
              <li><a href="#" className="relative group transition-colors"><span className="absolute -top-1 left-0 w-full h-0.5 bg-gray-900 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span><SquareQ>Workflow Automation</SquareQ></a></li>
              <li><a href="#" className="relative group transition-colors"><span className="absolute -top-1 left-0 w-full h-0.5 bg-gray-900 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span><SquareQ>Project Portfolio Intelligence</SquareQ></a></li>
              <li><a href="#" className="relative group transition-colors"><span className="absolute -top-1 left-0 w-full h-0.5 bg-gray-900 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span><SquareQ>Developer API Access</SquareQ></a></li>
              <li><a href="#" className="relative group transition-colors"><span className="absolute -top-1 left-0 w-full h-0.5 bg-gray-900 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span><SquareQ>Multi-Project Control</SquareQ></a></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
