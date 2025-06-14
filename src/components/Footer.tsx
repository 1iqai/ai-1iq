
import { Youtube, Linkedin, Github } from "lucide-react";

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
              <a href="#" className="text-sm hover:text-slate-900 transition-colors">
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
          
          {/* Offerings Column */}
          <div>
            <h4 className="font-medium text-slate-400 text-sm mb-4 uppercase tracking-wider">OFFERINGS</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="hover:text-slate-900 transition-colors">Anti-Money Laundering</a></li>
              <li><a href="#" className="hover:text-slate-900 transition-colors">Automotive & Mobility</a></li>
              <li><a href="#" className="hover:text-slate-900 transition-colors">Data Protection</a></li>
              <li><a href="#" className="hover:text-slate-900 transition-colors">Defense</a></li>
              <li><a href="#" className="hover:text-slate-900 transition-colors">Energy</a></li>
              <li><a href="#" className="hover:text-slate-900 transition-colors">Federal Health</a></li>
              <li><a href="#" className="hover:text-slate-900 transition-colors">FedStart</a></li>
              <li><a href="#" className="hover:text-slate-900 transition-colors">Financial Services</a></li>
              <li><a href="#" className="hover:text-slate-900 transition-colors">Food & Beverage</a></li>
              <li><a href="#" className="hover:text-slate-900 transition-colors">1iQ for Builders</a></li>
              <li><a href="#" className="hover:text-slate-900 transition-colors">Govt Financial Management</a></li>
              <li><a href="#" className="hover:text-slate-900 transition-colors text-slate-400">— Health & Life Sciences</a></li>
              <li><a href="#" className="hover:text-slate-900 transition-colors">Hospital Operations</a></li>
              <li><a href="#" className="hover:text-slate-900 transition-colors">Insurance</a></li>
              <li><a href="#" className="hover:text-slate-900 transition-colors">Intelligence</a></li>
              <li><a href="#" className="hover:text-slate-900 transition-colors">Mission Manager</a></li>
              <li><a href="#" className="hover:text-slate-900 transition-colors">Rail</a></li>
              <li><a href="#" className="hover:text-slate-900 transition-colors">Readiness</a></li>
              <li><a href="#" className="hover:text-slate-900 transition-colors">Retail</a></li>
              <li><a href="#" className="hover:text-slate-900 transition-colors">Secure Collaboration</a></li>
              <li><a href="#" className="hover:text-slate-900 transition-colors">Semiconductors</a></li>
              <li><a href="#" className="hover:text-slate-900 transition-colors">Supply Chain</a></li>
              <li><a href="#" className="hover:text-slate-900 transition-colors">Telecommunications</a></li>
              <li><a href="#" className="hover:text-slate-900 transition-colors">Utilities</a></li>
            </ul>
          </div>
          
          {/* Impact Studies Column */}
          <div>
            <h4 className="font-medium text-slate-400 text-sm mb-4 uppercase tracking-wider">IMPACT STUDIES</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="hover:text-slate-900 transition-colors">Airbus</a></li>
              <li><a href="#" className="hover:text-slate-900 transition-colors">Axel Springer</a></li>
              <li><a href="#" className="hover:text-slate-900 transition-colors">Cleveland Clinic</a></li>
              <li><a href="#" className="hover:text-slate-900 transition-colors">Concordance</a></li>
              <li><a href="#" className="hover:text-slate-900 transition-colors">Doosan Infracore</a></li>
              <li><a href="#" className="hover:text-slate-900 transition-colors">Fujitsu</a></li>
              <li><a href="#" className="hover:text-slate-900 transition-colors">HHS & CDC</a></li>
              <li><a href="#" className="hover:text-slate-900 transition-colors">Jacobs</a></li>
              <li><a href="#" className="hover:text-slate-900 transition-colors">Kinder Morgan</a></li>
              <li><a href="#" className="hover:text-slate-900 transition-colors">NHS</a></li>
              <li><a href="#" className="hover:text-slate-900 transition-colors">Pacific Gas & Electric</a></li>
              <li><a href="#" className="hover:text-slate-900 transition-colors">Ringler</a></li>
              <li><a href="#" className="hover:text-slate-900 transition-colors">Sonnedix</a></li>
              <li><a href="#" className="hover:text-slate-900 transition-colors">SOMPO</a></li>
              <li><a href="#" className="hover:text-slate-900 transition-colors">Swiss Re</a></li>
              <li><a href="#" className="hover:text-slate-900 transition-colors">Tampa General Hospital</a></li>
              <li><a href="#" className="hover:text-slate-900 transition-colors">World Food Programme</a></li>
            </ul>
          </div>
          
          {/* Capabilities and Documents Columns */}
          <div>
            <h4 className="font-medium text-slate-400 text-sm mb-4 uppercase tracking-wider">CAPABILITIES</h4>
            <ul className="space-y-3 text-sm mb-8">
              <li><a href="#" className="hover:text-slate-900 transition-colors">AI + ML</a></li>
              <li><a href="#" className="hover:text-slate-900 transition-colors">AIP for Developers</a></li>
              <li><a href="#" className="hover:text-slate-900 transition-colors">Data Integration</a></li>
              <li><a href="#" className="hover:text-slate-900 transition-colors">Digital Twin</a></li>
              <li><a href="#" className="hover:text-slate-900 transition-colors">Dynamic Scheduling</a></li>
              <li><a href="#" className="hover:text-slate-900 transition-colors">Edge AI</a></li>
              <li><a href="#" className="hover:text-slate-900 transition-colors">Marketplace</a></li>
              <li><a href="#" className="hover:text-slate-900 transition-colors">MetaConstellation</a></li>
              <li><a href="#" className="hover:text-slate-900 transition-colors">Pipeline Builder</a></li>
              <li><a href="#" className="hover:text-slate-900 transition-colors">Process Mining</a></li>
              <li><a href="#" className="hover:text-slate-900 transition-colors">Real-Time Alerting</a></li>
              <li><a href="#" className="hover:text-slate-900 transition-colors">Streaming</a></li>
              <li><a href="#" className="hover:text-slate-900 transition-colors">Titanium</a></li>
              <li><a href="#" className="hover:text-slate-900 transition-colors">Warp Speed</a></li>
            </ul>
            
            <h4 className="font-medium text-slate-400 text-sm mb-4 uppercase tracking-wider">DOCUMENTS</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="hover:text-slate-900 transition-colors">Developer Community</a></li>
              <li><a href="#" className="hover:text-slate-900 transition-colors">Platform Documentation</a></li>
              <li><a href="#" className="hover:text-slate-900 transition-colors">1iQ Developers</a></li>
              <li><a href="#" className="hover:text-slate-900 transition-colors">Trust Center</a></li>
              <li><a href="#" className="hover:text-slate-900 transition-colors">Modern Slavery Statement</a></li>
              <li><a href="#" className="hover:text-slate-900 transition-colors">Cookies</a></li>
              <li><a href="#" className="hover:text-slate-900 transition-colors">Privacy and Civil Liberties</a></li>
              <li><a href="#" className="hover:text-slate-900 transition-colors">1iQ Explained</a></li>
              <li><a href="#" className="hover:text-slate-900 transition-colors">Sustainability</a></li>
              <li><a href="#" className="hover:text-slate-900 transition-colors">Human Rights Policy</a></li>
              <li><a href="#" className="hover:text-slate-900 transition-colors">Privacy and Security Statement</a></li>
              <li><a href="#" className="hover:text-slate-900 transition-colors">Terms of Use</a></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
