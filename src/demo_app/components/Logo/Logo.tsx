import React from "react";

import { useColorScheme } from "@mui/material";

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className }) => {
  const { mode } = useColorScheme();

  // Debug logs

  const logoSrc = mode === "dark" ? "/1iQ-White.webp" : "/1iQ.webp";

  return (
    <>
      <img src={logoSrc} alt="1iQ" className={`logo w-18 ${className ?? ''}`} />
    </>
  );
};

export default Logo;
