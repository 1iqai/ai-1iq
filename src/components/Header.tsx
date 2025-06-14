
import { Button } from "@/components/ui/button";
import { Search, Menu } from "lucide-react";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white py-3 px-6 border-b border-gray-200">
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
        
        <div className="flex items-center space-x-3">
          <Button 
            variant="outline" 
            size="sm"
            className="bg-white hover:bg-gray-50 text-gray-700 border-gray-300 rounded-lg px-5 py-2 font-medium text-sm"
          >
            Get Started
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            className="h-9 w-9 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
          >
            <Search className="h-5 w-5" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            className="h-9 w-9 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
