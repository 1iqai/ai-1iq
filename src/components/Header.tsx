import { Button } from "@/components/ui/button";
import { Search, Menu } from "lucide-react";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/10 backdrop-blur-md py-3 px-6 border-b border-gray-200/20">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 flex items-center justify-center">
            <img 
              src="/lovable-uploads/b5b303f6-c418-4625-bb79-dc96bb3cfbe6.png" 
              alt="1iQ Logo" 
              className="w-8 h-8 object-contain"
            />
          </div>
          <span className="text-xl font-medium text-foreground tracking-tight">1iQ</span>
        </div>
        
        <div className="flex items-center space-x-4">
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
              className="h-10 w-10 text-gray-600 hover:text-white hover:bg-gray-800 border-2 border-gray-400 hover:border-gray-800 rounded-none transition-all duration-200 border-r-0"
            >
              <Search className="h-5 w-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              className="h-10 w-10 text-gray-600 hover:text-white hover:bg-gray-800 border-2 border-gray-400 hover:border-gray-800 rounded-none transition-all duration-200"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
