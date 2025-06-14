
import { Youtube, Linkedin, Github, ArrowRight } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-white text-slate-600 py-16 px-6 border-t border-slate-200">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Left column - Copyright and legal */}
          <div className="col-span-2 md:col-span-1">
            <p className="text-sm mb-4">© 2025 1iQ Technologies Inc.</p>
            <p className="text-sm mb-8">All rights reserved.</p>
            
            <div className="border-t border-slate-200 pt-4 mb-8">
              <a href="#" className="text-sm relative group transition-colors">
                <span className="absolute -top-1 left-0 w-full h-0.5 bg-slate-900 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                Do Not Sell or Share My Personal Information
              </a>
            </div>
            
            <div className="border-t border-slate-200 pt-4 mb-8">
              <div className="flex flex-wrap gap-2 text-sm">
                <span>US</span>
                <span>UK</span>
                <span>JP</span>
                <span>KR</span>
              </div>
            </div>
            
            <div className="space-y-3">
              <button className="w-full max-w-[140px] border border-slate-300 rounded-full py-2 px-4 text-sm hover:bg-slate-50 transition-colors">
                YOUTUBE
              </button>
              <button className="w-full max-w-[140px] border border-slate-300 rounded-full py-2 px-4 text-sm hover:bg-slate-50 transition-colors">
                X
              </button>
              <button className="w-full max-w-[140px] border border-slate-300 rounded-full py-2 px-4 text-sm hover:bg-slate-50 transition-colors">
                LINKEDIN
              </button>
              <button className="w-full max-w-[140px] border border-slate-300 rounded-full py-2 px-4 text-sm hover:bg-slate-50 transition-colors">
                GITHUB
              </button>
            </div>
          </div>
          
          {/* Platforms Column */}
          <div>
            <h4 className="font-medium text-slate-400 text-sm mb-4 uppercase tracking-wider">PLATFORMS</h4>
            <ul className="space-y-3 text-xs">
              <li><a href="#" className="relative group transition-colors"><span className="absolute -top-1 left-0 w-full h-0.5 bg-slate-900 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>1iQ Core</a></li>
              <li><a href="#" className="relative group transition-colors"><span className="absolute -top-1 left-0 w-full h-0.5 bg-slate-900 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>1iQ Field</a></li>
              <li><a href="#" className="relative group transition-colors"><span className="absolute -top-1 left-0 w-full h-0.5 bg-slate-900 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>1iQ Intel</a></li>
              <li><a href="#" className="relative group transition-colors"><span className="absolute -top-1 left-0 w-full h-0.5 bg-slate-900 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>1iQ Cloud</a></li>
              <li><a href="#" className="relative group transition-colors"><span className="absolute -top-1 left-0 w-full h-0.5 bg-slate-900 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>Developer Tools</a></li>
              <li><a href="#" className="relative group transition-colors"><span className="absolute -top-1 left-0 w-full h-0.5 bg-slate-900 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>AI Command Center</a></li>
            </ul>
          </div>
          
          {/* Impact Studies Column */}
          <div>
            <h4 className="font-medium text-slate-400 text-sm mb-4 uppercase tracking-wider">IMPACT STUDIES</h4>
            <ul className="space-y-3 text-xs">
              <li><a href="#" className="relative group transition-colors"><span className="absolute -top-1 left-0 w-full h-0.5 bg-slate-900 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>Airbus</a></li>
              <li><a href="#" className="relative group transition-colors"><span className="absolute -top-1 left-0 w-full h-0.5 bg-slate-900 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>Axel Springer</a></li>
              <li><a href="#" className="relative group transition-colors"><span className="absolute -top-1 left-0 w-full h-0.5 bg-slate-900 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>Cleveland Clinic</a></li>
              <li><a href="#" className="relative group transition-colors"><span className="absolute -top-1 left-0 w-full h-0.5 bg-slate-900 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>Concordance</a></li>
              <li><a href="#" className="relative group transition-colors"><span className="absolute -top-1 left-0 w-full h-0.5 bg-slate-900 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>Doosan Infracore</a></li>
              <li><a href="#" className="relative group transition-colors"><span className="absolute -top-1 left-0 w-full h-0.5 bg-slate-900 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>Fujitsu</a></li>
              <li><a href="#" className="relative group transition-colors"><span className="absolute -top-1 left-0 w-full h-0.5 bg-slate-900 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>HHS & CDC</a></li>
              <li><a href="#" className="relative group transition-colors"><span className="absolute -top-1 left-0 w-full h-0.5 bg-slate-900 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>Jacobs</a></li>
              <li><a href="#" className="relative group transition-colors"><span className="absolute -top-1 left-0 w-full h-0.5 bg-slate-900 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>Kinder Morgan</a></li>
              <li><a href="#" className="relative group transition-colors"><span className="absolute -top-1 left-0 w-full h-0.5 bg-slate-900 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>NHS</a></li>
              <li><a href="#" className="relative group transition-colors"><span className="absolute -top-1 left-0 w-full h-0.5 bg-slate-900 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>Pacific Gas & Electric</a></li>
              <li><a href="#" className="relative group transition-colors"><span className="absolute -top-1 left-0 w-full h-0.5 bg-slate-900 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>Ringler</a></li>
              <li><a href="#" className="relative group transition-colors"><span className="absolute -top-1 left-0 w-full h-0.5 bg-slate-900 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>Sonnedix</a></li>
              <li><a href="#" className="relative group transition-colors"><span className="absolute -top-1 left-0 w-full h-0.5 bg-slate-900 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>SOMPO</a></li>
              <li><a href="#" className="relative group transition-colors"><span className="absolute -top-1 left-0 w-full h-0.5 bg-slate-900 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>Swiss Re</a></li>
              <li><a href="#" className="relative group transition-colors"><span className="absolute -top-1 left-0 w-full h-0.5 bg-slate-900 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>Tampa General Hospital</a></li>
              <li><a href="#" className="relative group transition-colors"><span className="absolute -top-1 left-0 w-full h-0.5 bg-slate-900 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>World Food Programme</a></li>
            </ul>
          </div>
          
          {/* Capabilities Column */}
          <div>
            <h4 className="font-medium text-slate-400 text-sm mb-4 uppercase tracking-wider">CAPABILITIES</h4>
            <ul className="space-y-3 text-xs mb-8">
              <li><a href="#" className="relative group transition-colors"><span className="absolute -top-1 left-0 w-full h-0.5 bg-slate-900 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>AI + ML</a></li>
              <li><a href="#" className="relative group transition-colors"><span className="absolute -top-1 left-0 w-full h-0.5 bg-slate-900 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>AIP for Developers</a></li>
              <li><a href="#" className="relative group transition-colors"><span className="absolute -top-1 left-0 w-full h-0.5 bg-slate-900 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>Data Integration</a></li>
              <li><a href="#" className="relative group transition-colors"><span className="absolute -top-1 left-0 w-full h-0.5 bg-slate-900 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>Digital Twin</a></li>
              <li><a href="#" className="relative group transition-colors"><span className="absolute -top-1 left-0 w-full h-0.5 bg-slate-900 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>Dynamic Scheduling</a></li>
              <li><a href="#" className="relative group transition-colors"><span className="absolute -top-1 left-0 w-full h-0.5 bg-slate-900 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>Edge AI</a></li>
              <li><a href="#" className="relative group transition-colors"><span className="absolute -top-1 left-0 w-full h-0.5 bg-slate-900 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>Marketplace</a></li>
              <li><a href="#" className="relative group transition-colors"><span className="absolute -top-1 left-0 w-full h-0.5 bg-slate-900 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>MetaConstellation</a></li>
              <li><a href="#" className="relative group transition-colors"><span className="absolute -top-1 left-0 w-full h-0.5 bg-slate-900 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>Pipeline Builder</a></li>
              <li><a href="#" className="relative group transition-colors"><span className="absolute -top-1 left-0 w-full h-0.5 bg-slate-900 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>Process Mining</a></li>
              <li><a href="#" className="relative group transition-colors"><span className="absolute -top-1 left-0 w-full h-0.5 bg-slate-900 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>Real-Time Alerting</a></li>
              <li><a href="#" className="relative group transition-colors"><span className="absolute -top-1 left-0 w-full h-0.5 bg-slate-900 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>Streaming</a></li>
              <li><a href="#" className="relative group transition-colors"><span className="absolute -top-1 left-0 w-full h-0.5 bg-slate-900 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>Titanium</a></li>
              <li><a href="#" className="relative group transition-colors"><span className="absolute -top-1 left-0 w-full h-0.5 bg-slate-900 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>Warp Speed</a></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
