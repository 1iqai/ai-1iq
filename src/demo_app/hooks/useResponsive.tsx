import { useState, useEffect } from "react";

// Define a type for the dimensions object to ensure type safety.
interface Dimensions {
  width: number;
  height: number;
}


// Define a type for the possible breakpoint values.
type Breakpoint = 'mobile' | 'sm' | 'md' | 'lg' | 'xl';

// Define the return type of the hook.
export interface ResponsiveState extends Dimensions {
  breakpoint: Breakpoint | 'desktop'; // Add 'desktop' to the Breakpoint type
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
}

export function useResponsive(): ResponsiveState {
  const [dimensions, setDimensions] = useState<Dimensions>({
    width: typeof window !== "undefined" ? window.innerWidth : 0,
    height: typeof window !== "undefined" ? window.innerHeight : 0,
  });

  const [breakpoint, setBreakpoint] = useState<Breakpoint | 'desktop'>('desktop');

  useEffect(() => {
    function handleResize() {
      const width: number = window.innerWidth;
      const height: number = window.innerHeight;

      setDimensions({ width, height });

      // Set breakpoints
      if (width < 640) setBreakpoint('mobile');
      else if (width < 768) setBreakpoint('sm');
      else if (width < 1024) setBreakpoint('md');
      else if (width < 1280) setBreakpoint('lg');
      else setBreakpoint('xl');
    }

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return {
    ...dimensions,
    breakpoint,
    isMobile: dimensions.width < 768,
    isTablet: dimensions.width >= 768 && dimensions.width < 1024,
    isDesktop: dimensions.width >= 1024
  };
}