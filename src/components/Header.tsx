
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-border py-4 px-6">
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
          
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="flex items-center space-x-1 text-muted-foreground hover:text-foreground transition-colors bg-transparent">
                  <span>Products</span>
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="w-[600px] p-0 bg-white border border-border rounded-lg shadow-lg">
                    <div className="grid grid-cols-2">
                      {/* Features Column */}
                      <div className="p-6 bg-green-50 rounded-l-lg">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Features</h3>
                        <div className="space-y-4">
                          <div className="flex items-start space-x-3">
                            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                              <div className="w-4 h-4 bg-green-600 rounded"></div>
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900">Client Portal</h4>
                              <p className="text-sm text-gray-600">Deliver a branded client experience</p>
                            </div>
                          </div>
                          <div className="flex items-start space-x-3">
                            <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                              <div className="w-4 h-4 bg-orange-600 rounded"></div>
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900">Messaging</h4>
                              <p className="text-sm text-gray-600">Communicate with clients securely</p>
                            </div>
                          </div>
                          <div className="flex items-start space-x-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                              <div className="w-4 h-4 bg-blue-600 rounded"></div>
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900">Invoicing</h4>
                              <p className="text-sm text-gray-600">Invoice clients and get paid</p>
                            </div>
                          </div>
                          <div className="flex items-start space-x-3">
                            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                              <div className="w-4 h-4 bg-purple-600 rounded"></div>
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900">Tasks</h4>
                              <p className="text-sm text-gray-600">Assign tasks to clients and stay organized</p>
                            </div>
                          </div>
                          <div className="flex items-start space-x-3">
                            <div className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center">
                              <div className="w-4 h-4 bg-pink-600 rounded"></div>
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900">Contracts</h4>
                              <p className="text-sm text-gray-600">Create contracts and request eSignatures</p>
                            </div>
                          </div>
                          <div className="flex items-start space-x-3">
                            <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                              <div className="w-4 h-4 bg-indigo-600 rounded"></div>
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900">File Sharing</h4>
                              <p className="text-sm text-gray-600">Share and organize documents</p>
                            </div>
                          </div>
                          <div className="flex items-start space-x-3">
                            <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                              <div className="w-4 h-4 bg-yellow-600 rounded"></div>
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900">Forms</h4>
                              <p className="text-sm text-gray-600">Streamline data collection</p>
                            </div>
                          </div>
                        </div>
                        <div className="mt-6 pt-4 border-t border-green-200">
                          <a href="#" className="text-green-700 font-medium hover:text-green-800 flex items-center">
                            Go to App Store
                            <ChevronDown className="ml-2 h-4 w-4 rotate-[-90deg]" />
                          </a>
                        </div>
                      </div>
                      
                      {/* Platform Column */}
                      <div className="p-6 bg-white rounded-r-lg">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Platform</h3>
                        <div className="space-y-4">
                          <div className="flex items-start space-x-3">
                            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                              <div className="w-4 h-4 bg-gray-600 rounded"></div>
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900">Developer Home</h4>
                              <p className="text-sm text-gray-600">Resources for developers</p>
                            </div>
                          </div>
                          <div className="flex items-start space-x-3">
                            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                              <div className="w-4 h-4 bg-green-600 rounded"></div>
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900">Custom Apps</h4>
                              <p className="text-sm text-gray-600">Build Apps on our platform</p>
                            </div>
                          </div>
                          <div className="flex items-start space-x-3">
                            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                              <div className="w-4 h-4 bg-green-600 rounded"></div>
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900">1iQ on Zapier</h4>
                              <p className="text-sm text-gray-600">Discover Zapier automations</p>
                            </div>
                          </div>
                          <div className="flex items-start space-x-3">
                            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                              <div className="w-4 h-4 bg-green-600 rounded"></div>
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900">1iQ on Make</h4>
                              <p className="text-sm text-gray-600">Discover Make automations</p>
                            </div>
                          </div>
                        </div>
                        <div className="mt-6 pt-4 border-t border-gray-200">
                          <a href="#" className="text-gray-700 font-medium hover:text-gray-800 flex items-center">
                            Go to API Reference
                            <ChevronDown className="ml-2 h-4 w-4 rotate-[-90deg]" />
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger className="flex items-center space-x-1 text-muted-foreground hover:text-foreground transition-colors bg-transparent">
                  <span>Resources</span>
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="w-[400px] p-6 bg-white border border-border rounded-lg shadow-lg">
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          <div className="w-4 h-4 bg-blue-600 rounded"></div>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">Documentation</h4>
                          <p className="text-sm text-gray-600">Learn how to use 1iQ</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                          <div className="w-4 h-4 bg-green-600 rounded"></div>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">Blog</h4>
                          <p className="text-sm text-gray-600">Latest news and insights</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                          <div className="w-4 h-4 bg-purple-600 rounded"></div>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">Community</h4>
                          <p className="text-sm text-gray-600">Connect with other users</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Integrations</a>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Customers</a>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Pricing</a>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
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
