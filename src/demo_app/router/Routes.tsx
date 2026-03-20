import React, { lazy } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import ForgotPassword from "../pages/Auth/ForgotPassword";
import Unauthorized from "../pages/Unauthorized/Unauthorized";
import ResetPassword from "../pages/Auth/ResetPassword";
import ResetForgotPassword from "../pages/Auth/ResetForgotPassword";
import SetNewPassword from "../pages/Auth/SetNewPassword";
import NotFound from "../pages/Unauthorized/NotFound";
import PrivacyPolicyPage from "../pages/PrivacyPolicy/PrivacyPolicyPage";
import AuthLayout from "../layout/AuthLayout/AuthLayout";
import MainLayout from "../layout/MainLayout/MainLayout";

// Lazy load dashboard shells
const AdminDashboard = lazy(() => import("../pages/Admin/AdminDashboard"));
const PMDashboard = lazy(() => import("../pages/ProjectManager/PMDashboard"));
const SuperAdminDashboard = lazy(() => import("../pages/SuperAdmin/SuperAdminDashboard"));

const Router: React.FC = () => {
  return (

    <Routes>
      {/* Public routes - use AuthLayout (no navbar) */}
      <Route element={<AuthLayout />}>
        <Route path="/" element={<Navigate to="/pm/control-panel" replace />} />
        <Route path="/login" element={<Navigate to="/pm/control-panel" replace />} />
        <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-forgot-password" element={<ResetForgotPassword />} />
        <Route path="/set-new-password" element={<SetNewPassword />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      {/* Protected routes - use MainLayout (with navbar) */}
      <Route element={<MainLayout />}>
        {/* Reset password (protected) */}
        <Route
          path="/reset-password"
          element={
            <ProtectedRoute allowedRoles={["Admin", "Project Manager"]}>
              <ResetPassword />
            </ProtectedRoute>
          }
        />

        {/* Admin routes */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Project Manager routes */}
        <Route
          path="/pm/*"
          element={
            <ProtectedRoute allowedRoles={["Project Manager"]}>
              <PMDashboard />
            </ProtectedRoute>
          }
        />

        {/* Super Admin routes */}
        <Route
          path="/super-admin/*"
          element={
            <ProtectedRoute allowedRoles={["Super Admin"]}>
              <SuperAdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Backward compatibility redirects */}
        <Route path="/admindashboard" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="/analyticsDashboard" element={<Navigate to="/pm/dashboard" replace />} />
        <Route path="/superadmindashboard" element={<Navigate to="/super-admin/dashboard" replace />} />
      </Route>
    </Routes>

  );
};

export default Router;
