
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import Header from "@/components/Header";
import SquareQ from "@/components/SquareQ";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-white relative">
      {/* Dark gradient background for header area */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-gray-900 to-transparent"></div>
      
      <Header />
      
      <div className="pt-32 flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">404</h1>
          <p className="text-xl text-gray-600 mb-4"><SquareQ>Oops! Page not found</SquareQ></p>
          <a href="/" className="text-blue-500 hover:text-blue-700 underline">
            <SquareQ>Return to Home</SquareQ>
          </a>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
