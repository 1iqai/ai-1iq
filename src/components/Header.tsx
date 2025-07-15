
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
      <header className="fixed top-0 left-0 right-0 z-50 py-4 sm:py-6 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto bg-white/10 backdrop-blur-md border border-white/20 rounded-lg px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <button 
            onClick={handleLogoClick}
            className="flex items-center space-x-2 sm:space-x-3 transition-all duration-200 hover:bg-white/10 hover:shadow-lg rounded-lg px-2 sm:px-3 py-2 min-h-[44px]"
          >
            <div className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center transition-all duration-200 rounded">
              <img 
                src="/lovable-uploads/b5b303f6-c418-4625-bb79-dc96bb3cfbe6.png" 
                alt="1iQ Logo" 
                className="w-6 h-6 sm:w-8 sm:h-8 object-contain"
              />
            </div>
            <span className="text-lg sm:text-xl font-medium tracking-tight text-white">1iQ</span>
          </button>
          
          <div className="flex items-center space-x-2 sm:space-x-4">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setIsGetStartedOpen(true)}
              className="bg-white/10 hover:bg-white/20 text-white hover:text-white border border-white/30 hover:border-white/50 rounded-md px-3 sm:px-6 py-2 font-medium text-sm transition-all duration-200 h-10 sm:h-10 min-h-[44px]"
            >
              <span className="hidden sm:inline">Get Started</span>
              <span className="sm:hidden">Start</span>
            </Button>
            <div className="flex">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setIsSearchOpen(true)}
                className="h-10 w-10 sm:h-10 sm:w-10 text-white hover:text-white hover:bg-white/20 border border-white/30 hover:border-white/50 rounded-md transition-all duration-200 border-r-0 rounded-r-none min-h-[44px] min-w-[44px]"
              >
                <Search className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setIsMenuOpen(true)}
                className="h-10 w-10 sm:h-10 sm:w-10 text-white hover:text-white hover:bg-white/20 border border-white/30 hover:border-white/50 rounded-md transition-all duration-200 rounded-l-none min-h-[44px] min-w-[44px]"
              >
                <Menu className="h-4 w-4 sm:h-5 sm:w-5" />
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
