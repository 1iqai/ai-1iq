import React, { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "../../../../hooks/useAuth";
import { capitalCase } from "change-case";
import { useSocket } from "../../../../contexts/SocketContext";
import { usePM } from "../../../../contexts/PMContext";
import { InfoPieChart } from "../../Components/Charts/PieChart";
import IssueComponent from "../../Components/Approvals/IssueComponent";
import { TaskList } from "../../Components/Approvals/TaskList";
import {
  IssueStatusColours,
  TaskAcceptanceStatusColours,
  type IssueStatusType,
  type TaskAcceptanceStatusType,
} from "../../../../constants";

// MUI Imports
import {
  Box,
  Typography,
  CircularProgress,
  Tabs,
  Tab,
  Grid,
} from "@mui/material";
import { DescriptionRounded } from "@mui/icons-material";
import GlassCard from "../../../../components/shared/GlassCard";

export interface ITask {
  id: string;
  name: string;
  description?: string;
  project: string;
  createdByUser: string;
  assignedTo: string | string[];
  status: "TaskRejected" | "TaskComplete" | "MarkedComplete";
  startDate: string;
  assigneeUser?: string;
  endDate?: string;
  dateCreated?: string;
  submittedDate?: string;
  teamName?: string;
  milestone: {
    id: string;
    name: string;
    project: {
      name: string;
    };
    projectId: string;
  };
  dateUpdated: string;
  dateStarted: string;
  dateEnded: string;
}

type StatusCountType = {
  MarkedComplete: number;
  TaskComplete: number;
  TaskRejected: number;
};

type IssueCountType = {
  NotResolved: number;
  Resolved: number;
};

type ApprovalsProps = {
  selectedProject: any;
  taskOverviewData: any;
  selectedMilestone: any;
  selectedTeam: any;
  selectedTask: any;
};

const Approvals: React.FC<ApprovalsProps> = ({
  selectedMilestone,
  selectedProject,
  selectedTask,
  taskOverviewData,
  selectedTeam,
}) => {
  const { user } = useAuth();
  const { selectProject, projectTasks } = usePM();
  const [searchParams, setSearchParams] = useSearchParams();
  const issueStatusParam = searchParams.get("issueStatus");
  const issueIdParam = searchParams.get("issueId");
  const projectIdParam = searchParams.get("projectId");
  const projectSelectedRef = useRef(false);
  const [tasks, setTasks] = useState<ITask[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [statusCounts, setStatusCounts] = useState<StatusCountType>({
    MarkedComplete: 0,
    TaskComplete: 0,
    TaskRejected: 0,
  });
  const [issueCounts, setIssueCounts] = useState<IssueCountType>({ NotResolved: 0, Resolved: 0 });
  const [selectedTasks, setSelectedTasks] = useState<ITask | null>(null);
  const [searchQuery, _setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState<number>((issueStatusParam || issueIdParam) ? 1 : 0);

  // Select project from URL param when navigating from notification
  useEffect(() => {
    if (projectIdParam && !projectSelectedRef.current) {
      projectSelectedRef.current = true;
      selectProject(projectIdParam);
      // Clear projectId from URL after selecting
      setTimeout(() => {
        searchParams.delete("projectId");
        setSearchParams(searchParams, { replace: true });
      }, 500);
    }
  }, [projectIdParam, selectProject, searchParams, setSearchParams]);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [selectedStatus, _setSelectedStatus] = useState<string>("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const chartData = Object.entries(statusCounts)
    .map(([key, value]) => ({
      id: capitalCase(key),
      label: capitalCase(key.replace("Task", "")),
      value,
      color: TaskAcceptanceStatusColours[capitalCase(key) as TaskAcceptanceStatusType],
    }))
    .filter((item) => item.value > 0);

  const issueData = Object.entries(issueCounts)
    .map(([key, value]) => ({
      id: capitalCase(key),
      value,
      color: IssueStatusColours[capitalCase(key) as IssueStatusType],
    }))
    .filter((item) => item.value > 0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm, selectedStatus]);

  const fetchTasks = useCallback(() => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    try {
      // Get tasks from local PMContext state
      let allTasks: any[] = [];
      if (!selectedProject?.id || selectedProject.id === "all") {
        allTasks = Object.values(projectTasks).flat();
      } else {
        allTasks = projectTasks[selectedProject.id] ?? [];
      }

      // Filter by approval-relevant statuses
      const approvalStatuses = ["TaskComplete", "MarkedComplete", "TaskRejected"];
      let filtered = allTasks.filter((t: any) =>
        approvalStatuses.includes(t.taskStatus || t.status)
      );

      if (selectedMilestone && selectedMilestone !== "all") {
        filtered = filtered.filter((t: any) => t.milestoneId === selectedMilestone);
      }
      if (selectedTeam && selectedTeam !== "all") {
        filtered = filtered.filter((t: any) => t.teamId === selectedTeam || t.teamResponsibleId === selectedTeam);
      }
      if (selectedTask && selectedTask !== "all") {
        filtered = filtered.filter((t: any) => t.id === selectedTask);
      }
      if (selectedStatus && selectedStatus !== "All") {
        filtered = filtered.filter((t: any) => (t.taskStatus || t.status) === selectedStatus);
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        filtered = filtered.filter((t: any) => t.name?.toLowerCase().includes(q));
      }

      const mappedTasks: ITask[] = filtered.map((t: any) => ({
        id: t.id,
        name: t.name,
        project: selectedProject?.name || "745 18th St",
        createdByUser: "",
        assignedTo: t.assigneeEmail || "",
        status: (t.taskStatus || t.status) as ITask["status"],
        startDate: t.startDate || "",
        endDate: t.endDate || "",
        dateCreated: t.dateCreated || "",
        dateUpdated: t.dateUpdated || "",
        dateStarted: t.dateStarted || "",
        dateEnded: t.dateEnded || "",
        milestone: {
          id: t.milestoneId || "",
          name: t.milestoneName || "",
          project: { name: selectedProject?.name || "745 18th St" },
          projectId: selectedProject?.id || "",
        },
      }));

      setTasks(mappedTasks);

      const statusCounts: StatusCountType = { MarkedComplete: 0, TaskComplete: 0, TaskRejected: 0 };
      mappedTasks.forEach((t) => {
        if (t.status in statusCounts) statusCounts[t.status as keyof StatusCountType]++;
      });
      setStatusCounts(statusCounts);
      setIssueCounts({ NotResolved: 0, Resolved: 0 });

      setSelectedTasks(mappedTasks.length > 0 ? mappedTasks[0] : null);
    } catch (err) {
      console.error("Error loading tasks:", err);
    } finally {
      setLoading(false);
    }
  }, [
    user?.id,
    debouncedSearchTerm,
    currentPage,
    itemsPerPage,
    selectedStatus,
    selectedProject,
    selectedMilestone,
    selectedTask,
    selectedTeam,
    searchQuery,
    projectTasks,
  ]);

  const { socket, connected } = useSocket();

  useEffect(() => {
    if (!socket || !connected) return;
    const handleTasksUpdated = () => {
      fetchTasks();
    };
    socket.on("tasks_updated", handleTasksUpdated);
    return () => {
      socket.off("tasks_updated", handleTasksUpdated);
    };
  }, [socket, connected, fetchTasks]);

  useEffect(() => {
    setLoading(true);
    fetchTasks();
  }, [fetchTasks]);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
    // Clear the issueStatus query param when switching tabs
    if (issueStatusParam) {
      searchParams.delete("issueStatus");
      setSearchParams(searchParams, { replace: true });
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
          p: 4,
        }}
      >
        <CircularProgress size={48} />
        <Typography variant="body1" color="text.secondary">
          Loading tasks...
        </Typography>
      </Box>
    );
  }

  const filteredTasks = tasks || [];

  return (
    <Box
      sx={{
        minHeight: "100%",
        display: "flex",
        flexDirection: "column",
       
      }}
    >
      {/* Header */}
      {/* <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          px: 2,
          py: 1.5,
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <Typography variant="h6" fontWeight={600}>
          1iQ Approvals
        </Typography>
      </Box> */}

      {/* Main Content */}
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 2, }}>
        {/* Pie Charts Row */}
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 4 }}>
            <GlassCard title="Task Status By Progress" minHeight={280}>
              <InfoPieChart data={taskOverviewData} title="" category="Task" />
            </GlassCard>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <GlassCard title="Task Status By Acceptance" minHeight={280}>
              <InfoPieChart data={chartData} title="" category="Task" />
            </GlassCard>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <GlassCard title="Issue Status" minHeight={280}>
              <InfoPieChart data={issueData} title="" category="Issue" />
            </GlassCard>
          </Grid>
        </Grid>

        {/* Tabs */}
        <Box
          sx={{
            border: 1,
            borderColor: "divider",
            bgcolor: "background.default",
            borderRadius: 2,
          }}
        >
          <Tabs
            value={selectedTab}
            onChange={handleTabChange}
            sx={{
              "& .MuiTab-root": {
                textTransform: "none",
                fontWeight: 500,
                minWidth: 100,
              },
            }}
          >
            <Tab label="Tasks" />
            <Tab label="Issues" />
          </Tabs>
        </Box>

        {/* Tab Content */}
        <Box sx={{ flex: 1 }}>
          {selectedTab === 0 && (
            filteredTasks.length > 0 ? (
              <TaskList
                tasks={filteredTasks}
                onSelectTask={setSelectedTasks}
                selectedTaskId={selectedTasks?.id}
                refetch={fetchTasks}
              />
            ) : (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  py: 8,
                  textAlign: "center",
                }}
              >
                <Box
                  sx={{
                    width: 64,
                    height: 64,
                    borderRadius: "50%",
                    backgroundColor: "background.default",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 2,
                  }}
                >
                  <DescriptionRounded sx={{ fontSize: 32, color: "text.primary" }} />
                </Box>
                
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  No completed tasks to approve
                </Typography>
                

              </Box>
            )
          )}

          {selectedTab === 1 && (
            <IssueComponent
              selectedMilestone={selectedMilestone}
              selectedProject={selectedProject}
              selectedTeam={selectedTeam}
              selectedTask={selectedTask}
              statusFilter={issueStatusParam || undefined}
            />
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default Approvals;
