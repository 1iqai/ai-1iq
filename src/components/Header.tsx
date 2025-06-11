
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border py-4 px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-8">
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
          
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#" className="flex items-center space-x-1 text-muted-foreground hover:text-foreground transition-colors">
              <span>Products</span>
              <ChevronDown className="h-4 w-4" />
            </a>
            <a href="#" className="flex items-center space-x-1 text-muted-foreground hover:text-foreground transition-colors">
              <span>Resources</span>
              <ChevronDown className="h-4 w-4" />
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Integrations</a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Customers</a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Pricing</a>
          </nav>
        </div>
        
        <div className="flex items-center space-x-4">
          <a href="#" className="text-muted-foreground hover:text-foreground transition-colors hidden md:block">Log in</a>
          <Button className="bg-slate-900 hover:bg-slate-800 text-white rounded-full px-6">
            Start free trial
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
