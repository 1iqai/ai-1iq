import { motion } from "framer-motion";
import "react-confirm-alert/src/react-confirm-alert.css";
import { Box } from "@mui/material";
import { UserProfile } from "../../components/Settings/UserProfile";
import DashboardHeader from "../../components/shared/DashboardHeader";
import { useAuth } from "../../hooks/useAuth";

const SettingsPage = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === "Admin";
  const isSuperAdmin = user?.role === "Super Admin";

  const getDashboardPath = () => {
    if (isAdmin) return "/admin/dashboard";
    if (isSuperAdmin) return "/super-admin/dashboard";
    return "/pm/dashboard";
  };

  return (
    <Box sx={{ p: isAdmin ? 2 : 0 }}>
      <DashboardHeader
        title="Settings"
        subtitle="Manage your account preferences"
        breadcrumbs={[{ label: "Dashboard", path: getDashboardPath() }, { label: "Settings" }]}
      />
      <Box
        sx={{
          padding: { xs: 1.5, md: 2 },
          backgroundColor: "background.default",
          borderRadius: 2
        }}
      >
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Box>
            <Box>
              <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                <UserProfile />
              </motion.div>
            </Box>
          </Box>
        </motion.div>
      </Box>
    </Box>
  );
};

export default SettingsPage;
