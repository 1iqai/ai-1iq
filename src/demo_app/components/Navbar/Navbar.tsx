import { useState, useEffect, Fragment, type ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Trash2 } from "lucide-react";
import {
  Box,
  IconButton,
  useMediaQuery,
  useTheme,
  Avatar,
  Typography,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Badge,
  List,
  ListItem,
  ListItemButton,
  Divider,
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
} from "@mui/material";
import ThemeToggle from "../ThemeToggle/ThemeToggle";
import ProfilePage from "../ProfileCards/Profile";
import { useAuth } from "../../hooks/useAuth";
import { useNotification } from "../../hooks/useNotification";
import "./Navbar.scss";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";

interface NavbarProps {
  sidebarOpen?: boolean;
  onToggleDrawer?: () => void;
  showDrawerToggle?: boolean;
  setMobileDrawerOpen?: (open: boolean) => void;
  filterContent?: ReactNode;
}

export default function Navbar({
  setMobileDrawerOpen,
  sidebarOpen = true,
  onToggleDrawer,
  showDrawerToggle = false,
  filterContent,
}: NavbarProps = {}) {
  const navigate = useNavigate();
  const { user, setUser, logout, setIsLoggingOut } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));
  const { notifications, markAllAsRead, markAsRead } = useNotification();

  // MUI Menu anchor state for avatar dropdown
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const menuOpen = Boolean(anchorEl);

  // MUI Menu anchor state for notifications
  const [notificationAnchorEl, setNotificationAnchorEl] = useState<null | HTMLElement>(null);
  const notificationOpen = Boolean(notificationAnchorEl);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationClick = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationAnchorEl(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchorEl(null);
  };

  // Logout handlers
  const handleLogoutClick = () => {
    setLogoutDialogOpen(true);
    handleMenuClose();
  };

  const handleConfirmLogout = async () => {
    setIsButtonLoading(true); // For button disabled state
    setLogoutDialogOpen(false);
    setIsLoggingOut(true); // Context - show LoadingScreen

    try {
      await logout();
      localStorage.removeItem("token");
      // Navigation will happen automatically via ProtectedRoute
      // LoadingScreen will stay visible until component unmounts during navigation
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Logout failed. Please try again.");
      setIsButtonLoading(false);
      setIsLoggingOut(false); // Hide LoadingScreen
    }
  };

  const handleCancelLogout = () => {
    setLogoutDialogOpen(false);
  };

  // Load user from localStorage
  useEffect(() => {
    const userString = localStorage.getItem("user");
    if (userString) {
      try {
        setUser(JSON.parse(userString));
      } catch (error) {
        // console.error("Failed to parse user data from localStorage:", error);
      }
    }
  }, []);

  // Navigate based on role
  // const goDashboard = () => {
  //   const role = user.role;
  //   switch (role) {
  //     case "Admin":
  //       navigate("/admin/dashboard");
  //       break;
  //     case "Project Manager":
  //       navigate("/pm/dashboard");
  //       break;
  //     default:
  //       navigate("/");
  //       break;
  //   }
  // };
  // Close mobile menu on window resize to desktop
  useEffect(() => {
    if (!mobileOpen) return;
    const handler = () => {
      setMobileOpen(false);
    };
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, [mobileOpen]);

  const handleEditProfileClick = () => {
    setIsEditProfileOpen(true);
  };

  const getRole = () => {
    if (user?.role === "Super Admin") return "Super Admin";
    if (user?.role === "Admin") return "Admin";
    if (user?.role === "Project Manager") return "Project Manager";
    if (user?.role === "Laborer") return "Laborer";
    return "User";
  };

  // const handleMobileMenuToggle = () => {
  //   setMobileOpen((prev) => !prev);
  // };

  const handleOnClose = () => {
    setIsEditProfileOpen(false);
  };

  return (
    <>
      <nav className="top-nav">
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            px: { xs: 1.5, md: 2 },
            justifyContent: "space-between",
          }}
        >
          {/* Left section: Hamburger menu */}
          <Box sx={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
            {isMobile && (
              <IconButton
                disableRipple
                sx={{
                  p: 0,
                }}
                onClick={() => setMobileDrawerOpen?.(true)}
                aria-label="Open navigation menu"
              >
                <MenuRoundedIcon
                  sx={() => ({
                    color: "text.primary",
                    fontSize: 24,
                    p: 0,
                  })}
                />
              </IconButton>
            )}

            {/* Desktop menu toggle */}
            {!isMobile && showDrawerToggle && (
              <IconButton
                disableRipple
                onClick={onToggleDrawer}
                aria-label={sidebarOpen ? "Hide sidebar" : "Show sidebar"}
                sx={{
                  p: 0,
                }}
              >
                <MenuRoundedIcon
                  sx={() => ({
                    color: "text.primary",
                    fontSize: 24,
                    p: 0,
                  })}
                />
              </IconButton>
            )}
          </Box>

          {/* Center section: Filter content (desktop only) */}
          {!isMobile && filterContent && (
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", flex: 1, mx: 2 }}>
              {filterContent}
            </Box>
          )}

          {/* Right section: User menu */}
          <div className="flex">
            {user ? (
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                {/* Theme Toggle Button */}
                <ThemeToggle />

                {/* MUI Notification Button with Badge */}
                <IconButton
                  disableRipple
                  onClick={handleNotificationClick}
                  aria-label="Notifications"
                  aria-controls={notificationOpen ? "notification-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={notificationOpen ? "true" : undefined}
                  sx={{
                    color: "text.primary",
                  }}
                >
                  <Badge
                    badgeContent={notifications.length}
                    color="error"
                    sx={{
                      "& .MuiBadge-badge": {
                        fontSize: "10px",
                        height: "18px",
                        minWidth: "18px",
                        fontWeight: 600,
                      },
                    }}
                  >
                    <NotificationsNoneOutlinedIcon />
                  </Badge>
                </IconButton>

                {/* MUI Notification Menu */}
                <Menu
                  id="notification-menu"
                  anchorEl={notificationAnchorEl}
                  open={notificationOpen}
                  onClose={handleNotificationClose}
                  disableScrollLock
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  slotProps={{
                    paper: {
                      elevation: 3,
                      sx: {
                        width: 360,
                        maxHeight: 480,
                        mt: 1,
                        borderRadius: "6px",
                      },
                    },
                    list: {
                      sx: {
                        py: 0,
                      },
                    },
                  }}
                >
                  {notifications.length > 0 ? (
                    <>
                      {/* Header */}
                      <Box
                        sx={{
                          backgroundColor: "background.surface",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          px: 2,
                          py: 1.5,
                          borderBottom: 1,
                          borderColor: "divider",
                        }}
                      >
                        <Typography variant="subtitle2" fontWeight={600}>
                          Notifications
                        </Typography>
                        <IconButton
                          size="small"
                          onClick={() => {
                            markAllAsRead();
                          }}
                          aria-label="Mark all as read"
                          sx={{
                            width: 24,
                            height: 24,
                            bgcolor: "error.main",
                            color: "white",
                            "&:hover": {
                              bgcolor: "error.dark",
                            },
                          }}
                        >
                          <Trash2 size={14} />
                        </IconButton>
                      </Box>

                      {/* Notification List */}
                      <List sx={{ py: 0 }}>
                        {notifications.map((notification, index) => (
                          <Fragment key={notification.id}>
                            <ListItem
                              disablePadding
                              secondaryAction={
                                <Checkbox
                                  edge="end"
                                  onChange={() => markAsRead(notification.id)}
                                  size="small"
                                  sx={{
                                    color: "action.active",
                                    "&.Mui-checked": {
                                      color: "success.main",
                                    },
                                  }}
                                />
                              }
                            >
                              <ListItemButton
                                sx={{
                                  py: 1.5,
                                  px: 2,
                                }}
                                onClick={() => {
                                  // Build the navigation URL based on notification data
                                  let url = "/pm/approvals";
                                  const params = new URLSearchParams();

                                  // Always include projectId for proper filtering
                                  if (notification.projectId) {
                                    params.append("projectId", notification.projectId);
                                  }

                                  if (notification.issueId) {
                                    params.append("issueId", notification.issueId);
                                    params.append("issueStatus", "NotResolved");
                                  } else if (notification.taskId) {
                                    params.append("taskId", notification.taskId);
                                  }

                                  if (params.toString()) {
                                    url += `?${params.toString()}`;
                                  }

                                  // Close menu, mark as read, and navigate
                                  handleNotificationClose();
                                  markAsRead(notification.id);
                                  navigate(url);
                                }}
                              >
                                <ListItemText
                                  primary={notification.title}
                                  secondary={notification.body}
                                  primaryTypographyProps={{
                                    variant: "body2",
                                    fontWeight: 500,
                                    noWrap: true,
                                  }}
                                  secondaryTypographyProps={{
                                    variant: "caption",
                                    color: "text.secondary",
                                    sx: {
                                      overflow: "hidden",
                                      textOverflow: "ellipsis",
                                      display: "-webkit-box",
                                      WebkitLineClamp: 2,
                                      WebkitBoxOrient: "vertical",
                                    },
                                  }}
                                />
                              </ListItemButton>
                            </ListItem>
                            {index < notifications.length - 1 && <Divider component="li" />}
                          </Fragment>
                        ))}
                      </List>
                    </>
                  ) : (
                    <Box sx={{ px: 3, py: 4 }}>
                      <Typography variant="body2" color="text.secondary" textAlign="center">
                        No new notifications
                      </Typography>
                    </Box>
                  )}
                </Menu>

                {/* MUI Avatar Button */}
                <Box
                  onClick={handleMenuClick}
                  sx={{
                    backgroundColor: "rgba(0, 0, 0, 0.05)",
                    borderRadius: 0,
                    py: 1.5,
                    px: 2,
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: { xs: 0, md: 1.5 },
                    cursor: "pointer",
                    transition: "background-color 0.2s",
                    borderLeft: "1px solid",
                    borderRight: "1px solid",
                    borderColor: "divider",
                    "&:hover": {
                      backgroundColor: "action.hover",
                    },
                  }}
                  aria-controls={menuOpen ? "avatar-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={menuOpen ? "true" : undefined}
                >
                  <Avatar
                    alt={user.username}
                    src={user.image}
                    sx={{
                      width: 36,
                      height: 36,
                      fontSize: "1rem",
                      fontWeight: 600,
                    }}
                    slotProps={{
                      img: {
                        onError: (e: React.SyntheticEvent<HTMLImageElement>) => {
                          e.currentTarget.style.display = "none";
                        },
                      },
                    }}
                  >
                    {user.username?.substring(0, 2).toUpperCase()}
                  </Avatar>

                  {/* User Info - Hidden on mobile */}
                  <Box
                    sx={{
                      display: { xs: "none", md: "flex" },
                      flexDirection: "column",
                      alignItems: "flex-start",
                    }}
                  >
                    <Typography
                      variant="subtitle2"
                      sx={{
                        fontWeight: 500,
                        lineHeight: 1.2,
                        mb: 0.6,
                        color: "text.primary",
                        textTransform: "capitalize",
                      }}
                    >
                      {user.username}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        color: "text.secondary",
                        lineHeight: 1.2,
                      }}
                    >
                      {getRole()}
                    </Typography>
                  </Box>
                </Box>

                {/* MUI Menu Dropdown */}
                <Menu
                  id="avatar-menu"
                  anchorEl={anchorEl}
                  open={menuOpen}
                  onClose={handleMenuClose}
                  disableScrollLock
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  slotProps={{
                    paper: {
                      elevation: 3,
                      sx: {
                        minWidth: 210,
                        mt: 1,
                        borderRadius: "6px",
                        boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.15)", // Custom shadow
                      },
                    },
                  }}
                >
                  <MenuItem
                    onClick={() => {
                      handleEditProfileClick();
                      handleMenuClose();
                    }}
                  >
                    <ListItemIcon>
                      <AccountCircleOutlinedIcon fontSize="small" sx={{ color: "text.secondary" }} />
                    </ListItemIcon>
                    <ListItemText>My Account</ListItemText>
                  </MenuItem>

                  <MenuItem onClick={handleLogoutClick}>
                    <ListItemIcon>
                      <LogoutOutlinedIcon fontSize="small" sx={{ color: "text.secondary" }} />
                    </ListItemIcon>
                    <ListItemText>Logout</ListItemText>
                  </MenuItem>
                </Menu>
              </Box>
            ) : (
              <>
                <Link to="/login" className="btn-primary">
                  Login
                </Link>
                <ThemeToggle />
              </>
            )}
          </div>
        </Box>
      </nav>

      {isEditProfileOpen && (
        <ProfilePage
          initialProfile={user}
          onClose={() => handleOnClose()}
          // onUpdated={handleProfileUpdated}
        />
      )}

      {/* Logout Confirmation Dialog */}
      <Dialog
        open={logoutDialogOpen}
        onClose={handleCancelLogout}
        maxWidth="xs"
        fullWidth
        slotProps={{
          paper: {
            sx: {
              borderRadius: 2,
              p: 1,
            },
          },
        }}
      >
        <DialogTitle
          component="div"
          sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, pb: 1 }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 62,
              height: 62,
              borderRadius: "50%",
              backgroundColor: "warning.light",
            }}
          >
            <WarningAmberRoundedIcon sx={{ fontSize: 38, color: "#fff" }} />
          </Box>
          <Typography variant="h6" fontWeight={600}>
            Confirm Logout
          </Typography>
        </DialogTitle>

        <DialogContent sx={{ textAlign: "center", pb: 2 }}>
          <Typography variant="body1" color="text.secondary">
            Are you sure you want to sign out?
          </Typography>
        </DialogContent>

        <DialogActions sx={{ display: "flex", justifyContent: "center", px: 3, pb: 2, gap: 1 }}>
          <Button onClick={handleCancelLogout} variant="outlined" color="inherit" disabled={isButtonLoading}>
            No
          </Button>
          <Button
            onClick={handleConfirmLogout}
            variant="contained"
            color="error"
            disabled={isButtonLoading}
            startIcon={isButtonLoading ? <CircularProgress size={16} color="inherit" /> : null}
          >
            {isButtonLoading ? "Logging out..." : "Yes"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
