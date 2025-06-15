
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
        <div className="max-w-7xl mx-auto bg-transparent backdrop-blur-sm border border-white/20 rounded-lg px-6 py-4 flex items-center justify-between">
          <button 
            onClick={handleLogoClick}
            className="flex items-center space-x-3 hover:bg-white hover:text-black transition-all duration-200 px-3 py-2 rounded"
          >
            <div className="w-8 h-8 flex items-center justify-center">
              <img 
                src="/lovable-uploads/b5b303f6-c418-4625-bb79-dc96bb3cfbe6.png" 
                alt="1iQ Logo" 
                className="w-8 h-8 object-contain"
              />
            </div>
            <span className="text-xl font-medium tracking-tight">1iQ</span>
          </button>
          
          <div className="flex items-center space-x-10">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setIsGetStartedOpen(true)}
              className="bg-transparent hover:bg-white/10 text-white hover:text-white border-2 border-white/40 hover:border-white/60 rounded-none px-6 py-2 font-medium text-sm transition-all duration-200 h-10"
            >
              Get Started
            </Button>
            <div className="flex">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setIsSearchOpen(true)}
                className="h-10 w-10 text-white hover:text-white hover:bg-white/10 border-2 border-white/40 hover:border-white/60 rounded-none transition-all duration-200 border-r-0"
              >
                <Search className="h-5 w-5" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setIsMenuOpen(true)}
                className="h-10 w-10 text-white hover:text-white hover:bg-white/10 border-2 border-white/40 hover:border-white/60 rounded-none transition-all duration-200"
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
