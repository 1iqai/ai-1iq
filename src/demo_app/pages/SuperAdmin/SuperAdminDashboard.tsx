import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import UserManagement from "./DashBoards/UserManagement";
import IndustryManagement from "./DashBoards/IndustryManagement";
import OrganizationManagement from "./DashBoards/OrganizationManagement/OrganizationManagement";
// import DivisionManagement from "./DashBoards/OrganizationManagement/DivisionManagement";
import SettingsPage from "../Settings/SettingsPage";
import SuperAdminOverview from "./SuperAdminOverview";
import { Box } from "@mui/material";

const SuperAdminLayout = () => {
  return (
    <>
      <Box
        className="super-admin-dashboard-container"
        sx={{ px: 2, py: 2, minHeight: "calc(100dvh - 61px)", backgroundColor: "background.surface", overflow: "auto" }}
      >
        <Outlet />
      </Box>
    </>
  );
};

const SuperAdminDashboard = () => {
  return (
    <Routes>
      <Route element={<SuperAdminLayout />}>
        <Route path="/" element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<SuperAdminOverview />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="industries" element={<IndustryManagement />} />
        <Route path="organizations" element={<OrganizationManagement />} />
        {/* <Route path="divisions" element={<DivisionManagement />} /> */}
        <Route path="settings" element={<SettingsPage />} />
      </Route>
    </Routes>
  );
};

export default SuperAdminDashboard;
