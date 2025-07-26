import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import Header from "@/components/Header";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gradient-hero">
      <Header />
      <div className="container-custom py-20">
        <div className="text-center space-y-8">
          <h1 className="text-6xl font-bold text-foreground">404</h1>
          <h2 className="text-3xl font-semibold text-foreground">Page Not Found</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;