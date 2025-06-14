
import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white py-4 px-6 border-b border-gray-200">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 flex items-center justify-center">
            <img 
              src="/lovable-uploads/b5b303f6-c418-4625-bb79-dc96bb3cfbe6.png" 
              alt="1iQ Logo" 
              className="w-8 h-8 object-contain"
            />
          </div>
          <span className="text-xl font-semibold text-foreground">1iQ</span>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button className="bg-slate-900 hover:bg-slate-800 text-white rounded-md px-6">
            Get Started
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
