import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import UserManagement from "./DashBoards/UserManagement";
import ProjectManagement from "./DashBoards/ProjectManagement";
import ArchiveProjects from "../ProjectControlPanel/ArchiveProjects";
import ArchivedProjects from "./DashBoards/ArchivedProjects";
import SettingsPage from "../Settings/SettingsPage";
import AdminOverview from "./AdminOverview";
import { Box } from "@mui/material";

const AdminLayout = () => {
  return (
    <>
      <Box
        className="admin-dashboard-container"
        sx={{ minHeight: "calc(100dvh - 61px)", backgroundColor: "background.surface", overflow: "auto" }}
      >
        <Outlet />
      </Box>
    </>
  );
};

const AdminDashboard = () => {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route path="/" element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AdminOverview />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="projectmanagement" element={<ProjectManagement />} />
        <Route path="archived" element={<ArchiveProjects />} />
        <Route path="archived-projects" element={<ArchivedProjects />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
    </Routes>
  );
};

export default AdminDashboard;
