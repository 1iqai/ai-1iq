
import { Youtube, Linkedin, Github, ArrowRight } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-white text-slate-600 py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Left column - Copyright and legal */}
          <div className="col-span-2 md:col-span-1">
            <p className="text-base mb-4">© 2025 1iQ Technologies Inc.</p>
            <p className="text-base mb-8">All rights reserved.</p>
            
            <div className="border-t border-slate-200 pt-4 mb-8">
              <a href="#" className="text-base relative group transition-colors">
                <span className="absolute -top-1 left-0 w-full h-0.5 bg-slate-900 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                Do Not Sell or Share My Personal Information
              </a>
            </div>
            
            <div className="border-t border-slate-200 pt-4 mb-8">
              <div className="flex flex-wrap gap-2 text-base">
                <span>US</span>
                <span>UK</span>
                <span>JP</span>
                <span>KR</span>
              </div>
            </div>
            
            <div className="space-y-3">
              <button className="w-full max-w-[140px] border border-slate-300 rounded-full py-2 px-4 text-base hover:bg-slate-50 transition-colors">
                YOUTUBE
              </button>
              <button className="w-full max-w-[140px] border border-slate-300 rounded-full py-2 px-4 text-base hover:bg-slate-50 transition-colors">
                X
              </button>
              <button className="w-full max-w-[140px] border border-slate-300 rounded-full py-2 px-4 text-base hover:bg-slate-50 transition-colors">
                LINKEDIN
              </button>
              <button className="w-full max-w-[140px] border border-slate-300 rounded-full py-2 px-4 text-base hover:bg-slate-50 transition-colors">
                GITHUB
              </button>
            </div>
          </div>
          
          {/* Platforms Column */}
          <div>
            <h4 className="font-medium text-slate-400 text-base mb-4 uppercase tracking-wider">PLATFORMS</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="relative group transition-colors"><span className="absolute -top-1 left-0 w-full h-0.5 bg-slate-900 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>1iQ Core</a></li>
              <li><a href="#" className="relative group transition-colors"><span className="absolute -top-1 left-0 w-full h-0.5 bg-slate-900 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>1iQ Field</a></li>
              <li><a href="#" className="relative group transition-colors"><span className="absolute -top-1 left-0 w-full h-0.5 bg-slate-900 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>1iQ Intel</a></li>
              <li><a href="#" className="relative group transition-colors"><span className="absolute -top-1 left-0 w-full h-0.5 bg-slate-900 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>1iQ Cloud</a></li>
              <li><a href="#" className="relative group transition-colors"><span className="absolute -top-1 left-0 w-full h-0.5 bg-slate-900 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>Developer Tools</a></li>
              <li><a href="#" className="relative group transition-colors"><span className="absolute -top-1 left-0 w-full h-0.5 bg-slate-900 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>AI Command Center</a></li>
            </ul>
          </div>
          
          {/* Industries Served Column */}
          <div>
            <h4 className="font-medium text-slate-400 text-base mb-4 uppercase tracking-wider">INDUSTRIES SERVED</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="relative group transition-colors"><span className="absolute -top-1 left-0 w-full h-0.5 bg-slate-900 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>Commercial Construction</a></li>
              <li><a href="#" className="relative group transition-colors"><span className="absolute -top-1 left-0 w-full h-0.5 bg-slate-900 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>Industrial & Infrastructure</a></li>
              <li><a href="#" className="relative group transition-colors"><span className="absolute -top-1 left-0 w-full h-0.5 bg-slate-900 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>Real Estate Development</a></li>
              <li><a href="#" className="relative group transition-colors"><span className="absolute -top-1 left-0 w-full h-0.5 bg-slate-900 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>Public Sector & Smart Cities</a></li>
              <li><a href="#" className="relative group transition-colors"><span className="absolute -top-1 left-0 w-full h-0.5 bg-slate-900 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>Healthcare Facilities</a></li>
              <li><a href="#" className="relative group transition-colors"><span className="absolute -top-1 left-0 w-full h-0.5 bg-slate-900 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>Energy & Utilities</a></li>
              <li><a href="#" className="relative group transition-colors"><span className="absolute -top-1 left-0 w-full h-0.5 bg-slate-900 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>Transportation & Rail</a></li>
              <li><a href="#" className="relative group transition-colors"><span className="absolute -top-1 left-0 w-full h-0.5 bg-slate-900 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>Data Centers & Tech Campuses</a></li>
            </ul>
          </div>
          
          {/* Capabilities Column */}
          <div>
            <h4 className="font-medium text-slate-400 text-base mb-4 uppercase tracking-wider">CAPABILITIES</h4>
            <ul className="space-y-3 text-sm mb-8">
              <li><a href="#" className="relative group transition-colors"><span className="absolute -top-1 left-0 w-full h-0.5 bg-slate-900 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>AI-Powered Scheduling</a></li>
              <li><a href="#" className="relative group transition-colors"><span className="absolute -top-1 left-0 w-full h-0.5 bg-slate-900 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>Real-Time Data Sync</a></li>
              <li><a href="#" className="relative group transition-colors"><span className="absolute -top-1 left-0 w-full h-0.5 bg-slate-900 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>Digital Twin Integration</a></li>
              <li><a href="#" className="relative group transition-colors"><span className="absolute -top-1 left-0 w-full h-0.5 bg-slate-900 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>Predictive Conflict Resolution</a></li>
              <li><a href="#" className="relative group transition-colors"><span className="absolute -top-1 left-0 w-full h-0.5 bg-slate-900 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>Workflow Automation</a></li>
              <li><a href="#" className="relative group transition-colors"><span className="absolute -top-1 left-0 w-full h-0.5 bg-slate-900 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>Project Portfolio Intelligence</a></li>
              <li><a href="#" className="relative group transition-colors"><span className="absolute -top-1 left-0 w-full h-0.5 bg-slate-900 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>Developer API Access</a></li>
              <li><a href="#" className="relative group transition-colors"><span className="absolute -top-1 left-0 w-full h-0.5 bg-slate-900 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>Multi-Project Control</a></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
