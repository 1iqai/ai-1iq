import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Box, useMediaQuery, useTheme } from "@mui/material";

import Navbar from "../../components/Navbar/Navbar";
import NavigationDrawer from "../../components/Navigation/NavigationDrawer";
import { NavbarFilterProvider, useNavbarFilterOptional } from "../../contexts/NavbarFilterContext";

/**
 * MainLayout - Traditional dashboard layout with sidebar
 *
 * Used for:
 * - All Admin routes (/admin/*)
 * - All PM routes (/pm/*)
 * - Reset Password (protected route)
 *
 * Layout Structure:
 * - Sticky Navbar at top
 * - NavigationDrawer on left (role-based menu)
 * - Main content area on right
 *
 * Features:
 * - Centralized layout management
 * - Role-based sidebar rendering
 * - Responsive design (mobile overlay, desktop static)
 * - Sticky navbar for better UX
 */

// Inner component that can access the NavbarFilterContext
const MainLayoutInner: React.FC = () => {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true); // Desktop sidebar starts open
  const [userRole, setUserRole] = useState<"Admin" | "Project Manager" | "Super Admin" | null>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));

  // Get filter content from context (may be null if no filters are set)
  const navbarFilter = useNavbarFilterOptional();
  const filterContent = navbarFilter?.filterContent ?? null;

  // Get user role from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setUserRole(user.role);
      } catch (error) {
        // // console.error("Failed to parse user data:", error);
      }
    }
  }, []);

  // If no role detected, just render outlet (fallback for edge cases)
  if (!userRole) {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <Box sx={{ position: "sticky", top: 0, zIndex: (theme) => theme.zIndex.appBar }}>
          <Navbar />
        </Box>
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Outlet />
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <NavigationDrawer
        role={userRole}
        open={isMobile ? mobileDrawerOpen : sidebarOpen}
        onClose={() => (isMobile ? setMobileDrawerOpen(false) : setSidebarOpen(false))}
      />
      <Box sx={{ width: "100%", height: "100vh", flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <Box
          sx={{
            position: "sticky",
            top: 0,
            zIndex: (theme) => theme.zIndex.appBar,
            backgroundColor: "background.default",
            flexShrink: 0,
          }}
        >
          <Navbar
            setMobileDrawerOpen={setMobileDrawerOpen}
            sidebarOpen={sidebarOpen}
            onToggleDrawer={() => setSidebarOpen(!sidebarOpen)}
            showDrawerToggle={!isMobile && userRole !== null}
            filterContent={filterContent}
          />
        </Box>

        {/* Page content renders here */}
        <Box
          component="main"
          sx={{
            // p: { xs: 1.5, md: 2 },
            flex: 1,
            minHeight: 0,
            overflow: { xs: "auto", lg: "hidden" },
            backgroundColor: "background.surface",
            display: "flex",
            flexDirection: "column",
            transition: theme.transitions.create(["width", "margin"], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

// Main layout wrapped with NavbarFilterProvider
const MainLayout: React.FC = () => {
  return (
    <NavbarFilterProvider>
      <MainLayoutInner />
    </NavbarFilterProvider>
  );
};

export default MainLayout;
