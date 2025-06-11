
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

const Header = () => {
  return (
    <header className="bg-background border-b border-border py-4 px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <span className="text-xl font-semibold text-foreground">Secoda</span>
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
