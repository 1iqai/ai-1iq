import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";
import { TurnstileProvider } from "../../contexts/TurnstileContext";
//import Logo from "../../components/Logo/Logo";
import ThemeToggle from "../../components/ThemeToggle/ThemeToggle";

/**
 * AuthLayout - Layout for unauthenticated pages
 *
 * Used for:
 * - Login
 * - Forgot Password
 * - Reset Forgot Password
 * - Privacy Policy
 * - Unauthorized
 * - Not Found
 *
 * Features:
 * - Full viewport height
 * - Centered content
 * - Gradient background
 * - No navigation components (navbar/sidebar)
 * - Cloudflare Turnstile for bot protection
 */
const AuthLayout: React.FC = () => {
  return (
    <TurnstileProvider>
      <Box
        sx={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)",
          ".dark &": {
            background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
          },
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background Image - Bottom Left */}
        <Box
          component="img"
          src="/building-construction.png"
          alt="Building Construction"
          sx={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: { xs: "200px", sm: "300px", md: "400px" },
            height: "auto",
            opacity: 0.15,
            pointerEvents: "none",
            zIndex: 0,
          }}
        />
        <Box
          sx={{
            width: "100%",
            position: "fixed",
            top: 0,
            left: 0,
            px: 4,
            py: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            zIndex: 10,
          }}
        >
          {/* <Logo /> */}
          <Box></Box>
          <ThemeToggle fontSize={32} />
        </Box>
        <Outlet />
      </Box>
    </TurnstileProvider>
  );
};

export default AuthLayout;
