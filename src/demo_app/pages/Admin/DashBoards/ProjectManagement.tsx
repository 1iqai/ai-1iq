import { useState } from "react";
import { Box, Drawer, IconButton, useMediaQuery, useTheme, CircularProgress, Typography } from "@mui/material";
import { AlertCircle, Filter, X } from "lucide-react";
import { PMProvider, usePM } from "../../../contexts/PMContext";
import SidePanel from "../../ProjectManager/Components/Charts/SidePanel";
import ControlPanel from "../../ProjectControlPanel/ControlPanel";

// Error display component
const ErrorDisplay = ({ error, onRetry }: { error: string; onRetry: () => void }) => (
  <div className="min-h-full bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
    <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg text-center max-w-md">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 text-red-600 mb-4">
        <AlertCircle className="w-8 h-8" />
      </div>
      <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">Error</h3>
      <p className="text-gray-600 dark:text-gray-300 mb-4">{error}</p>
      <button
        onClick={onRetry}
        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
      >
        Retry
      </button>
    </div>
  </div>
);

const AdminProjectLayout = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));

  const {
    loading,
    projectList,
    selectedProject,
    selectedMilestone,
    selectedTeam,
    selectedTask,
    selectProject,
    selectMilestone,
    selectTeam,
    selectTask,
    availableMilestones,
    availableTeams,
    taskCandidates,
    error,
    fetchProjects,
  } = usePM();

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "calc(100vh - 100px)",
          width: "100%",
          backgroundColor: "background.default",
          gap: 2,
        }}
      >
        <CircularProgress size={48} />
        <Typography variant="body1" color="text.secondary">
          Loading projects...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return <ErrorDisplay error={error} onRetry={() => fetchProjects(false, true)} />;
  }

  const sidePanelProps = {
    projectList,
    selectProject,
    selectedProject,
    selectedMilestone,
    selectMilestone,
    milestones: availableMilestones,
    selectedTeam,
    selectTeam,
    teams: availableTeams,
    selectedTask,
    selectTask,
    taskCandidates,
  };

  return (
    <Box
      className="pm-dashboard-container"
      sx={{ backgroundColor: "background.surface", px: 0, py: 0, minHeight: "100%", boxSizing: "border-box" }}
    >
      {/* Mobile: Compact filter trigger bar */}
      {isMobile && (
        <div className="sticky top-0 z-20 flex items-center justify-between px-4 py-2 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
            {selectedProject?.name || "Select Project"}
          </span>
          <IconButton onClick={() => setDrawerOpen(true)} size="small" sx={{ color: "text.primary" }}>
            <Filter className="w-5 h-5" />
          </IconButton>
        </div>
      )}

      {/* Desktop: Static SidePanel */}
      {!isMobile && (
        <div className="sticky top-0 z-20 flex-none h-auto">
          <SidePanel {...sidePanelProps} />
        </div>
      )}

      {/* Mobile: Drawer from top */}
      <Drawer
        anchor="top"
        open={drawerOpen && isMobile}
        onClose={() => setDrawerOpen(false)}
        sx={{
          display: { xs: "block", lg: "none" },
          "& .MuiDrawer-paper": {
            backgroundColor: "background.default",
            maxHeight: "80vh",
            borderBottomLeftRadius: 16,
            borderBottomRightRadius: 16,
          },
        }}
      >
        {/* Drawer header with close button */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
          <span className="font-medium text-gray-900 dark:text-gray-100">Filters</span>
          <IconButton onClick={() => setDrawerOpen(false)} size="small" sx={{ color: "text.primary" }}>
            <X className="w-5 h-5" />
          </IconButton>
        </div>

        {/* SidePanel content in drawer */}
        <div className="p-4 bg-gray-50 dark:bg-gray-900">
          <SidePanel {...sidePanelProps} forceVertical />
        </div>
      </Drawer>

      {/* Main Content Area */}
      <Box
        className="pm-dashboard-outlet"
        sx={{
          py: 2,
          px: 2,
          overflow: "auto",
          backgroundColor: "background.surface",
          minHeight: "calc(100vh - 140px)",
        }}
      >
        <ControlPanel
          selectedProject={selectedProject}
          selectedMilestone={selectedMilestone}
          selectedTask={selectedTask}
          selectedTeam={selectedTeam}
          projectList={projectList}
        />
      </Box>
    </Box>
  );
};

const ProjectManagement = () => {
  return (
    <>
      <Box>
        {/* <DashboardHeader
          title="Project Management"
          subtitle="Create and manage all projects."
          breadcrumbs={[{ label: "Dashboard", path: "/admin/dashboard" }, { label: "Project Management" }]}
        /> */}
        <PMProvider>
          <AdminProjectLayout />
        </PMProvider>
      </Box>
    </>
  );
};

export default ProjectManagement;
