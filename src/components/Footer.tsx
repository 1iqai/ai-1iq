
import { Youtube, Linkedin, Github, ArrowRight } from "lucide-react";
import ScrollAnimatedText from "./ScrollAnimatedText";

const Footer = () => {
  return (
    <footer className="bg-white text-gray-500 py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Left column - Copyright and legal */}
          <div className="col-span-2 md:col-span-1">
            <ScrollAnimatedText 
              as="p" 
              className="text-xs mb-4"
              speed={0.2}
              direction="up"
            >
              © 2025 1iQ Technologies Inc.
            </ScrollAnimatedText>
            <ScrollAnimatedText 
              as="p" 
              className="text-xs mb-8"
              speed={0.3}
              direction="up"
            >
              All rights reserved.
            </ScrollAnimatedText>
            
            <ScrollAnimatedText 
              className="border-t border-gray-200 pt-4 mb-8"
              speed={0.4}
              direction="up"
            >
              <a href="#" className="text-xs relative group transition-colors">
                <span className="absolute -top-1 left-0 w-full h-0.5 bg-gray-900 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                Do Not Sell or Share My Personal Information
              </a>
            </ScrollAnimatedText>
            
            <ScrollAnimatedText 
              className="border-t border-gray-200 pt-4 mb-8"
              speed={0.5}
              direction="up"
            >
              <div className="flex flex-wrap gap-2 text-xs">
                <span>US</span>
                <span>UK</span>
                <span>JP</span>
                <span>KR</span>
              </div>
            </ScrollAnimatedText>
            
            <ScrollAnimatedText 
              className="space-y-3"
              speed={0.6}
              direction="up"
            >
              <button className="w-full max-w-[100px] border border-gray-300 rounded-full py-1.5 px-3 text-xs hover:bg-gray-50 transition-colors">
                YOUTUBE
              </button>
              <button className="w-full max-w-[100px] border border-gray-300 rounded-full py-1.5 px-3 text-xs hover:bg-gray-50 transition-colors">
                X
              </button>
              <button className="w-full max-w-[100px] border border-gray-300 rounded-full py-1.5 px-3 text-xs hover:bg-gray-50 transition-colors">
                LINKEDIN
              </button>
              <button className="w-full max-w-[100px] border border-gray-300 rounded-full py-1.5 px-3 text-xs hover:bg-gray-50 transition-colors">
                GITHUB
              </button>
            </ScrollAnimatedText>
          </div>
          
          {/* Platforms Column */}
          <ScrollAnimatedText className="" speed={0.3} direction="down">
            <h4 className="font-medium text-gray-400 text-xs mb-4 uppercase tracking-wider">PLATFORMS</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#" className="relative group transition-colors"><span className="absolute -top-1 left-0 w-full h-0.5 bg-gray-900 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>1iQ Core</a></li>
              <li><a href="#" className="relative group transition-colors"><span className="absolute -top-1 left-0 w-full h-0.5 bg-gray-900 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>1iQ Field</a></li>
              <li><a href="#" className="relative group transition-colors"><span className="absolute -top-1 left-0 w-full h-0.5 bg-gray-900 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>1iQ Intel</a></li>
              <li><a href="#" className="relative group transition-colors"><span className="absolute -top-1 left-0 w-full h-0.5 bg-gray-900 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>1iQ Cloud</a></li>
              <li><a href="#" className="relative group transition-colors"><span className="absolute -top-1 left-0 w-full h-0.5 bg-gray-900 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>Developer Tools</a></li>
              <li><a href="#" className="relative group transition-colors"><span className="absolute -top-1 left-0 w-full h-0.5 bg-gray-900 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>AI Command Center</a></li>
            </ul>
          </ScrollAnimatedText>
          
          {/* Industries Served Column */}
          <ScrollAnimatedText className="" speed={0.4} direction="up">
            <h4 className="font-medium text-gray-400 text-xs mb-4 uppercase tracking-wider">INDUSTRIES SERVED</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#" className="relative group transition-colors"><span className="absolute -top-1 left-0 w-full h-0.5 bg-gray-900 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>Commercial Construction</a></li>
              <li><a href="#" className="relative group transition-colors"><span className="absolute -top-1 left-0 w-full h-0.5 bg-gray-900 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>Industrial & Infrastructure</a></li>
              <li><a href="#" className="relative group transition-colors"><span className="absolute -top-1 left-0 w-full h-0.5 bg-gray-900 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>Real Estate Development</a></li>
              <li><a href="#" className="relative group transition-colors"><span className="absolute -top-1 left-0 w-full h-0.5 bg-gray-900 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>Public Sector & Smart Cities</a></li>
              <li><a href="#" className="relative group transition-colors"><span className="absolute -top-1 left-0 w-full h-0.5 bg-gray-900 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>Healthcare Facilities</a></li>
              <li><a href="#" className="relative group transition-colors"><span className="absolute -top-1 left-0 w-full h-0.5 bg-gray-900 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>Energy & Utilities</a></li>
              <li><a href="#" className="relative group transition-colors"><span className="absolute -top-1 left-0 w-full h-0.5 bg-gray-900 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>Transportation & Rail</a></li>
              <li><a href="#" className="relative group transition-colors"><span className="absolute -top-1 left-0 w-full h-0.5 bg-gray-900 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>Data Centers & Tech Campuses</a></li>
            </ul>
          </ScrollAnimatedText>
          
          {/* Capabilities Column */}
          <ScrollAnimatedText className="" speed={0.5} direction="down">
            <h4 className="font-medium text-gray-400 text-xs mb-4 uppercase tracking-wider">CAPABILITIES</h4>
            <ul className="space-y-2 text-xs mb-8">
              <li><a href="#" className="relative group transition-colors"><span className="absolute -top-1 left-0 w-full h-0.5 bg-gray-900 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>AI-Powered Scheduling</a></li>
              <li><a href="#" className="relative group transition-colors"><span className="absolute -top-1 left-0 w-full h-0.5 bg-gray-900 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>Real-Time Data Sync</a></li>
              <li><a href="#" className="relative group transition-colors"><span className="absolute -top-1 left-0 w-full h-0.5 bg-gray-900 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>Digital Twin Integration</a></li>
              <li><a href="#" className="relative group transition-colors"><span className="absolute -top-1 left-0 w-full h-0.5 bg-gray-900 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>Predictive Conflict Resolution</a></li>
              <li><a href="#" className="relative group transition-colors"><span className="absolute -top-1 left-0 w-full h-0.5 bg-gray-900 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>Workflow Automation</a></li>
              <li><a href="#" className="relative group transition-colors"><span className="absolute -top-1 left-0 w-full h-0.5 bg-gray-900 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>Project Portfolio Intelligence</a></li>
              <li><a href="#" className="relative group transition-colors"><span className="absolute -top-1 left-0 w-full h-0.5 bg-gray-900 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>Developer API Access</a></li>
              <li><a href="#" className="relative group transition-colors"><span className="absolute -top-1 left-0 w-full h-0.5 bg-gray-900 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>Multi-Project Control</a></li>
            </ul>
          </ScrollAnimatedText>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
