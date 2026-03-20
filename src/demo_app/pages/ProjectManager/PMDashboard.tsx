import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { Box, Drawer, IconButton, useMediaQuery, useTheme, CircularProgress, Typography } from "@mui/material";
import { lazy, useState, useEffect } from "react";
import { AlertCircle, Filter, X } from "lucide-react";
import { PMProvider, usePM } from "../../contexts/PMContext";
import { useNavbarFilterOptional } from "../../contexts/NavbarFilterContext";
import SidePanel from "./Components/Charts/SidePanel";
const OneiQCore = lazy(() => import("./Dashboards/CommandCenter/1iQCore"));
const OneiQChat = lazy(() => import("./Dashboards/CommandCenter/1iQChat"));
const OneiQGantt = lazy(() => import("./Dashboards/CommandCenter/1iQGantt"));
const TaskOverview = lazy(() => import("./Dashboards/CommandCenter/TaskOverview"));
const ControlPanel = lazy(() => import("../ProjectControlPanel/ControlPanel"));
const Approvals = lazy(() => import("./Dashboards/ProjectManagement/Approvals"));
const Reporting = lazy(() => import("./Dashboards/Reporting/Reporting"));
const ArchiveProjects = lazy(() => import("../ProjectControlPanel/ArchiveProjects").then(m => ({ default: m.ArchiveProjectsContent })));
const ArchivedProjects = lazy(() => import("./Dashboards/FileManagement/ArchivedProjects"));
const ProjectTaskDetails = lazy(() => import("./Dashboards/CommandCenter/ProjectTaskDetails"));

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

// Layout component with persistent SidePanel
const PMLayout = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));
  const navbarFilter = useNavbarFilterOptional();

  const {
    loading,
    organizationList,
    selectedOrganization,
    selectOrganization,
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

  const sidePanelProps = {
    organizationList,
    selectOrganization,
    selectedOrganization,
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
    // hideAllProjectsOption: true,
  };

  // Set filter content in navbar on mount (desktop only), clear on unmount
  useEffect(() => {
    if (navbarFilter && !isMobile && !loading) {
      navbarFilter.setFilterContent(<SidePanel {...sidePanelProps} compact />);
    }
    return () => {
      if (navbarFilter) {
        navbarFilter.setFilterContent(null);
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isMobile,
    loading,
    organizationList,
    selectedOrganization,
    projectList,
    selectedProject,
    selectedMilestone,
    selectedTeam,
    selectedTask,
    availableMilestones,
    availableTeams,
    taskCandidates,
  ]);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
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

  return (
    <>
      <Box
        className="pm-dashboard-container"
        sx={{ backgroundColor: "background.surface", px: 0, py: 0, height: "100%", boxSizing: "border-box", display: "flex", flexDirection: "column" }}
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

        {/* Route outlet - child routes render here */}
        <Box
          className="pm-dashboard-outlet"
          sx={{
            py: 1,
            px: 2,
            flex: 1,
            overflow: { xs: "auto", lg: "auto" },
            backgroundColor: "background.surface",
            display: "flex",
            flexDirection: "column",
            minHeight: 0,
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </>
  );
};

// Page wrapper components that pass context data to lazy-loaded components
const CorePage = () => {
  const pm = usePM();
  return (
    <OneiQCore
      milestoneData={pm.milestoneData}
      teamData={pm.teamData}
      organizationData={pm.organizationData}
      budgetData1={pm.budgetData1}
      overallProjectStatus={pm.overallProjectStatus}
      selectedProject={pm.selectedProject}
      taskStatusOverview={pm.taskStatusOverview}
      statusByEndDate={pm.statusByEndDate}
      statusByStartDate={pm.statusByStartDate}
      taskPriorityOverview={pm.taskPriorityOverview}
      issueData={pm.issueData}
      chartLoading={pm.chartLoading}
    />
  );
};

const ChatPage = () => {
  const pm = usePM();
  return (
    <OneiQChat
      selectedProject={pm.selectedProject}
      selectedMilestone={pm.selectedMilestone}
      selectedTask={pm.selectedTask}
      selectedTeam={pm.selectedTeam}
    />
  );
};

const ControlPanelPage = () => {
  const pm = usePM();
  return (
    <ControlPanel
      selectedProject={pm.selectedProject}
      selectedMilestone={pm.selectedMilestone}
      selectedTask={pm.selectedTask}
      selectedTeam={pm.selectedTeam}
      projectList={pm.projectList}
    />
  );
};

const ApprovalsPage = () => {
  const pm = usePM();
  return (
    <Approvals
      taskOverviewData={pm.taskStatusOverview}
      selectedProject={pm.selectedProject}
      selectedMilestone={pm.selectedMilestone}
      selectedTask={pm.selectedTask}
      selectedTeam={pm.selectedTeam}
    />
  );
};

const ReportingPage = () => {
  const pm = usePM();
  return (
    <Reporting
      milestoneData={pm.milestoneData}
      teamData={pm.teamData}
      organizationData={pm.organizationData}
      budgetData1={pm.budgetData1}
      overallProjectStatus={pm.overallProjectStatus}
      selectedProject={pm.selectedProject}
      selectedMilestone={pm.selectedMilestone}
      selectedTeam={pm.selectedTeam}
      selectedTask={pm.selectedTask}
      taskStatusOverview={pm.taskStatusOverview}
      statusByEndDate={pm.statusByEndDate}
      statusByStartDate={pm.statusByStartDate}
      taskPriorityOverview={pm.taskPriorityOverview}
      issueData={pm.issueData}
      projectList={pm.projectList}
      selectProject={pm.selectProject}
      availableMilestones={pm.availableMilestones}
      chartLoading={pm.chartLoading}
      taskDetailRefreshKey={pm.taskDetailRefreshKey}
    />
  );
};

const GanttPage = () => {
  const pm = usePM();

  return (
    <OneiQGantt
      selectedProject={pm.selectedProject}
      selectedMilestone={pm.selectedMilestone}
      selectedTeam={pm.selectedTeam}
      selectedTask={pm.selectedTask}
      overallProjectStatus={pm.overallProjectStatus}
      taskStatusOverview={pm.taskStatusOverview}
      statusByStartDate={pm.statusByStartDate}
      statusByEndDate={pm.statusByEndDate}
    />
  );
};

const TaskDetailsPage = () => {
  const pm = usePM();
  return (
    <ProjectTaskDetails
      selectedProject={pm.selectedProject}
      selectedMilestone={pm.selectedMilestone}
      selectedTeam={pm.selectedTeam}
      overallProjectStatus={pm.overallProjectStatus}
      taskStatusOverview={pm.taskStatusOverview}
      statusByStartDate={pm.statusByStartDate}
      statusByEndDate={pm.statusByEndDate}
    />
  );
};

const TaskOverviewPage = () => {
  return <TaskOverview />;
};

const PMDashboard = () => {
  return (
    <PMProvider>
      <Routes>
        {/* Pages without SidePanel */}
        <Route path="archived" element={<ArchiveProjects />} />
        <Route path="archived-projects" element={<ArchivedProjects />} />

        {/* Pages with SidePanel */}
        <Route element={<PMLayout />}>
          <Route path="/" element={<Navigate to="control-panel" replace />} />
          <Route path="dashboard" element={<Navigate to="/pm/control-panel" replace />} />
          <Route path="core" element={<CorePage />} />
          <Route path="chat" element={<ChatPage />} />
          <Route path="gantt" element={<GanttPage />} />
          <Route path="control-panel" element={<ControlPanelPage />} />
          <Route path="approvals" element={<ApprovalsPage />} />
          <Route path="reporting" element={<ReportingPage />} />
          <Route path="intel" element={<TaskDetailsPage />} />
          <Route path="field" element={<TaskOverviewPage />} />
        </Route>
      </Routes>
    </PMProvider>
  );
};

export default PMDashboard;
