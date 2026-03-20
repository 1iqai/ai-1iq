import React from "react";
import { useTheme } from "../../hooks/useTheme";
import { IconButton } from "@mui/material";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";

interface ThemeToggleProps {
  fontSize?: number | string;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ fontSize = 24 }) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <>
      <IconButton
        disableRipple
        onClick={toggleTheme}
        sx={{
          p: 0,
        }}
      >
        {isDark ? (
          <DarkModeOutlinedIcon
            sx={() => ({
              color: "text.primary",
              fontSize: fontSize,
              p: 0,
            })}
          />
        ) : (
          <LightModeOutlinedIcon
            sx={() => ({
              color: "text.primary",
              fontSize: fontSize,
              p: 0,
            })}
          />
        )}
      </IconButton>
    </>
  );
};

export default ThemeToggle;
