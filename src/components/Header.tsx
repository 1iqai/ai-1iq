
import { Button } from "@/components/ui/button";
import { Search, Menu } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavigationMenu from "./NavigationMenu";
import SearchOverlay from "./SearchOverlay";
import GetStartedModal from "./GetStartedModal";

const Header = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isGetStartedOpen, setIsGetStartedOpen] = useState(false);

  const handleLogoClick = () => {
    navigate('/');
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 py-6 px-6">
        <div className="max-w-7xl mx-auto bg-white/95 backdrop-blur-sm border border-gray-200 rounded-lg px-6 py-4 flex items-center justify-between">
          <button 
            onClick={handleLogoClick}
            className="flex items-center space-x-3 transition-all duration-200"
          >
            <div className="w-8 h-8 flex items-center justify-center transition-all duration-200 rounded">
              <img 
                src="/lovable-uploads/b5b303f6-c418-4625-bb79-dc96bb3cfbe6.png" 
                alt="1iQ Logo" 
                className="w-8 h-8 object-contain"
              />
            </div>
            <span className="text-xl font-medium tracking-tight text-gray-900">1iQ</span>
          </button>
          
          <div className="flex items-center space-x-10">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setIsGetStartedOpen(true)}
              className="bg-transparent hover:bg-gray-50 text-gray-700 hover:text-gray-900 border border-gray-300 hover:border-gray-400 rounded-md px-6 py-2 font-medium text-sm transition-all duration-200 h-10"
            >
              Get Started
            </Button>
            <div className="flex">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setIsSearchOpen(true)}
                className="h-10 w-10 text-gray-600 hover:text-gray-900 hover:bg-gray-50 border border-gray-300 hover:border-gray-400 rounded-md transition-all duration-200 border-r-0 rounded-r-none"
              >
                <Search className="h-5 w-5" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setIsMenuOpen(true)}
                className="h-10 w-10 text-gray-600 hover:text-gray-900 hover:bg-gray-50 border border-gray-300 hover:border-gray-400 rounded-md transition-all duration-200 rounded-l-none"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>
      
      <NavigationMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <GetStartedModal isOpen={isGetStartedOpen} onClose={() => setIsGetStartedOpen(false)} />
    </>
  );
};

export default Header;
