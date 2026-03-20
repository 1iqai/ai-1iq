import React, { useEffect } from "react";
import { useTheme, useColorScheme } from "@mui/material";
import "./LoadingScreen.scss";

const LoadingScreen: React.FC = () => {
  const theme = useTheme();
  const { mode } = useColorScheme();

  // Debug logs
  useEffect(() => {
    // console.log("Theme palette mode:", theme.palette.mode);
    // console.log("Color scheme mode:", mode);
  }, [theme.palette.mode, mode]);

  const logoSrc = mode === "dark" ? "/1iQ-White.webp" : "/1iQ.webp";

  return (
    <div className="loading-screen">
      <div className="loading-content">
        <div className="logo-container w-full d-flex justify-center">
          <img src={logoSrc} alt="1iQ" className="logo mx-auto" />
        </div>
        <div className="loading-text">Loading intelligence...</div>
        <div className="loading-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
