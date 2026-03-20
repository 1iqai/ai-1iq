import { Box, Drawer, useMediaQuery, useTheme } from "@mui/material";
import DrawerHeader from "./DrawerHeader";
import NavigationList from "./NavigationList";
import type { NavigationDrawerProps } from "./types";

const NavigationDrawer: React.FC<NavigationDrawerProps> = ({ role, open, onClose }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));

  const drawerWidth = 330;

  // Mobile drawer content - closes on menu item click
  const mobileDrawerContent = (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <DrawerHeader collapsed={false} showToggle={false} />
      <Box sx={{ flexGrow: 1 }}>
        <NavigationList role={role} collapsed={false} onItemClick={onClose} />
      </Box>
    </Box>
  );

  // Desktop drawer content - does NOT close on menu item click
  const desktopDrawerContent = (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <DrawerHeader collapsed={false} showToggle={false} />
      <Box sx={{ flexGrow: 1 }}>
        <NavigationList role={role} collapsed={false} />
      </Box>
    </Box>
  );

  if (isMobile) {
    return (
      <Drawer
        variant="temporary"
        open={open}
        onClose={onClose}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: "block", lg: "none" },
          "& .MuiDrawer-paper": {
            width: 340,
            boxSizing: "border-box",
            backgroundColor: "background.default",
            backgroundImage: "none",
          },
        }}
      >
        {mobileDrawerContent}
      </Drawer>
    );
  }

  // Desktop: Use persistent drawer with slide animation
  return (
    <Drawer
      variant="persistent"
      anchor="left"
      open={open}
      sx={(theme) => ({
        display: { xs: "none", lg: "block" },
        width: open ? drawerWidth : 0,
        flexShrink: 0,
        whiteSpace: "nowrap",
        boxSizing: "border-box",

        transition: theme.transitions.create("width", {
          easing: theme.transitions.easing.sharp,
          duration: open
            ? theme.transitions.duration.enteringScreen
            : theme.transitions.duration.leavingScreen,
        }),

        "& .MuiDrawer-paper": {
          width: drawerWidth,
          backgroundColor: "background.default",
          borderRight: "1px solid",
          borderColor: "divider",
          overflowX: "hidden",
        },
      })}
    >
      {desktopDrawerContent}
    </Drawer>
  );
};

export default NavigationDrawer;
