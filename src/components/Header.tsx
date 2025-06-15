
import { Button } from "@/components/ui/button";
import { Search, Menu } from "lucide-react";
import { useState } from "react";
import NavigationMenu from "./NavigationMenu";
import SearchOverlay from "./SearchOverlay";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 py-6 px-6">
        <div className="max-w-7xl mx-auto bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 flex items-center justify-center">
              <img 
                src="/lovable-uploads/b5b303f6-c418-4625-bb79-dc96bb3cfbe6.png" 
                alt="1iQ Logo" 
                className="w-8 h-8 object-contain"
              />
            </div>
            <span className="text-xl font-medium text-white tracking-tight">1iQ</span>
          </div>
          
          <div className="flex items-center space-x-10">
            <Button 
              variant="outline" 
              size="sm"
              className="bg-white hover:bg-gray-800 text-gray-700 hover:text-white border-2 border-gray-400 hover:border-gray-800 rounded-none px-6 py-2 font-medium text-sm transition-all duration-200 h-10"
            >
              Get Started
            </Button>
            <div className="flex">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setIsSearchOpen(true)}
                className="h-10 w-10 text-white hover:text-white hover:bg-gray-800 border-2 border-gray-400 hover:border-gray-800 rounded-none transition-all duration-200 border-r-0"
              >
                <Search className="h-5 w-5" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setIsMenuOpen(true)}
                className="h-10 w-10 text-white hover:text-white hover:bg-gray-800 border-2 border-gray-400 hover:border-gray-800 rounded-none transition-all duration-200"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>
      
      <NavigationMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};

export default Header;
