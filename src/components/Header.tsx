import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Book, Headphones, ShieldCheck, Briefcase, Settings } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white py-4 px-6">
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
                  <div className="w-[600px] p-0 bg-white border border-border rounded-lg shadow-lg relative">
                    {/* Dropdown line design matching the image */}
                    <div className="absolute top-0 left-0 right-0">
                      <div className="h-1 bg-black"></div>
                      <div className="h-1 bg-green-200"></div>
                      <div className="h-px bg-black"></div>
                    </div>
                    
                    <div className="grid grid-cols-2 pt-3">
                      {/* Features Column */}
                      <div className="p-6 bg-green-50 rounded-bl-lg">
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
                      <div className="p-6 bg-white rounded-br-lg">
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
                  <div className="w-[400px] p-0 bg-white border-2 border-black rounded-none shadow-lg relative">
                    {/* Resources header with green underline */}
                    <div className="px-6 py-3 border-b-2 border-green-500">
                      <h3 className="text-lg font-semibold text-gray-900">Resources</h3>
                    </div>
                    
                    <div className="grid grid-cols-2">
                      {/* Left Column */}
                      <div className="p-6 border-r border-black">
                        <div className="space-y-4">
                          <div className="flex items-center space-x-3">
                            <Book className="w-5 h-5 text-green-500" />
                            <span className="text-gray-900 font-medium">Blog</span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <Headphones className="w-5 h-5 text-green-500" />
                            <span className="text-gray-900 font-medium">Help Guides</span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                              <div className="w-2 h-2 bg-white rounded-full"></div>
                            </div>
                            <span className="text-gray-900 font-medium">What's New</span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <div className="w-5 h-5 text-green-500">
                              <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.9 1 3 1.9 3 3V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V9ZM19 19H5V3H15V9H19Z"/>
                              </svg>
                            </div>
                            <span className="text-gray-900 font-medium">Find an Expert</span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <ShieldCheck className="w-5 h-5 text-green-500" />
                            <span className="text-gray-900 font-medium">Security</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Right Column */}
                      <div className="p-6">
                        <div className="space-y-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                              <div className="w-2 h-2 bg-white rounded-full"></div>
                            </div>
                            <span className="text-gray-900 font-medium">Brand</span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <Briefcase className="w-5 h-5 text-green-500" />
                            <span className="text-gray-900 font-medium">Jobs</span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <Settings className="w-5 h-5 text-green-500" />
                            <span className="text-gray-900 font-medium">System Status</span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <div className="w-5 h-5 text-green-500">
                              <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2Z"/>
                              </svg>
                            </div>
                            <span className="text-gray-900 font-medium">Affiliates Program</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Bottom border and Read More */}
                    <div className="border-t-2 border-black p-4">
                      <a href="#" className="text-gray-900 font-semibold hover:text-gray-700 flex items-center">
                        Read More
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </a>
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
