import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import type { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { Box, Typography, LinearProgress, Chip, Grid, useMediaQuery } from "@mui/material";
import type { Theme } from "@mui/material/styles";
import { FlagRounded } from "@mui/icons-material";
import GlassCard from "../../../../components/shared/GlassCard";
import ProjectStatus from "../../Components/Charts/ProjectStatus";
import { TaskPieChart } from "../../Components/Charts/TaskPieChart";
import { useSocket } from "../../../../contexts/SocketContext";
import { formatDate } from "../../../../utility/dateCalculations";
import { usePM } from "../../../../contexts/PMContext";

type TaskStatusType = "Not Started" | "In Progress" | "Pending" | "Finished" | "Rejected";

interface TaskDetail {
  id: string;
  projectName: string;
  assigneeOrganizationName: string;
  teamResponsible: string;
  milestone: string;
  taskName: string;
  taskStatus: TaskStatusType;
  taskStartStatus: -1 | 0 | 1 | null;
  taskEndStatus: -1 | 0 | 1 | null;
  daysAdjusted: number;
  progress: number;
  originalBudget: number;
  changeOrderToDate: number;
  newBudget: number;
  startDate: string;
  endDate: string;
  dateStarted: string | null;
  dateEnded: string | null;
  issueCount: number;
  priority: "Low" | "Medium" | "High" | "Critical" | null;
}

type ProjectTaskDetailsProps = {
  selectedProject: { id: string; name: string } | null;
  selectedMilestone: string | null;
  selectedTeam: string | null;
  overallProjectStatus: any;
  taskStatusOverview: any[];
  statusByStartDate: any[];
  statusByEndDate: any[];
  isReport?: boolean;
};

// Status chip component showing actual task status from backend
const StatusChip = ({ status, isXl = false }: { status: TaskStatusType; isXl?: boolean }) => {
  const statusConfig: Record<TaskStatusType, { bgcolor: string; color: string; label: string; shortLabel: string }> = {
    "Not Started": { bgcolor: "#d1d5db", color: "#374151", label: "Not Started", shortLabel: "New" },
    "In Progress": { bgcolor: "#4fa2b5", color: "#fff", label: "In Progress", shortLabel: "Active" },
    "Pending": { bgcolor: "#66bb6a", color: "#fff", label: "Pending", shortLabel: "Pend" },
    "Finished": { bgcolor: "#2e7d32", color: "#fff", label: "Finished", shortLabel: "Done" },
    "Rejected": { bgcolor: "#e07a62", color: "#fff", label: "Rejected", shortLabel: "Rej" },
  };

  const config = statusConfig[status] || statusConfig["Not Started"];

  return (
    <Chip
      size="small"
      label={config.label}
      sx={{
        bgcolor: config.bgcolor,
        color: config.color,
        fontWeight: 500,
        fontSize: isXl ? "0.5vw" : undefined,
        height: isXl ? 20 : undefined,
        "& .MuiChip-label": {
          px: isXl ? 0.5 : undefined,
        },
      }}
    />
  );
};

// Date status chip component with colors matching Task Start Status graph
// 1 = Early, 0 = On Time, -1 = Delayed
const DateStatusChip = ({ status, isXl = false }: { status: -1 | 0 | 1; isXl?: boolean }) => {
  const chipSx = {
    fontWeight: 500,
    fontSize: isXl ? "0.5vw" : "0.75rem",
    height: isXl ? 20 : undefined,
    "& .MuiChip-label": {
      px: isXl ? 0.5 : undefined,
    },
  };

  if (status === 1) {
    return (
      <Chip
        size="small"
        label="Early"
        sx={{
          bgcolor: "#6b9b4e",
          color: "#fff",
          ...chipSx,
        }}
      />
    );
  }
  if (status === 0) {
    return (
      <Chip
        size="small"
        label="On Time"
        sx={{
          bgcolor: "#3d8a9c",
          color: "#fff",
          ...chipSx,
        }}
      />
    );
  }
  return (
    <Chip
      size="small"
      label="Delayed"
      sx={{
        bgcolor: "#c75a42",
        color: "#fff",
        ...chipSx,
      }}
    />
  );
};

// Format currency
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const ProjectTaskDetails: React.FC<ProjectTaskDetailsProps> = ({
  selectedProject,
  selectedMilestone,
  selectedTeam,
  overallProjectStatus,
  isReport = false,
}) => {
  const { socket, connected } = useSocket();
  const { projectTasks } = usePM();
  const [tasks, setTasks] = useState<TaskDetail[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isXl = useMediaQuery((theme: Theme) => theme.breakpoints.up("xl"));
  const [searchParams] = useSearchParams();
  const priorityFilter = searchParams.get("priority");

  // Filter tasks by priority if query param is present
  const filteredTasks = useMemo(() => {
    if (!priorityFilter) return tasks;
    return tasks.filter((task) => task.priority === priorityFilter);
  }, [tasks, priorityFilter]);

  // Compute pie chart data from tasks state for instant updates
  const computedTaskStatusOverview = useMemo(() => {
    const counts = { "Not Started": 0, "In Progress": 0, "Pending": 0, "Finished": 0, "Rejected": 0 };
    tasks.forEach((t) => {
      if (t.taskStatus in counts) {
        counts[t.taskStatus as keyof typeof counts]++;
      }
    });
    return [
      { id: "Finished", value: counts["Finished"], color: "#2e7d32" },
      { id: "Pending", value: counts["Pending"], color: "#66bb6a" },
      { id: "Started", value: counts["In Progress"], color: "#4fa2b5" },
      { id: "Not Started", value: counts["Not Started"], color: "#d1d5db" },
      { id: "Rejected", value: counts["Rejected"], color: "#e07a62" },
    ].filter((d) => d.value > 0);
  }, [tasks]);

  const computedStatusByStartDate = useMemo(() => {
    const counts = { Delayed: 0, "On Time": 0, Early: 0 };
    tasks.forEach((t) => {
      if (t.taskStartStatus === -1) counts.Delayed++;
      else if (t.taskStartStatus === 0) counts["On Time"]++;
      else if (t.taskStartStatus === 1) counts.Early++;
    });
    return [
      { id: "Delayed", value: counts.Delayed, color: "#c75a42" },
      { id: "On Time", value: counts["On Time"], color: "#3d8a9c" },
      { id: "Early", value: counts.Early, color: "#6b9b4e" },
    ].filter((d) => d.value > 0);
  }, [tasks]);

  const computedStatusByEndDate = useMemo(() => {
    const counts = { Delayed: 0, "On Time": 0, Early: 0 };
    tasks.forEach((t) => {
      if (t.taskEndStatus === -1) counts.Delayed++;
      else if (t.taskEndStatus === 0) counts["On Time"]++;
      else if (t.taskEndStatus === 1) counts.Early++;
    });
    return [
      { id: "Delayed", value: counts.Delayed, color: "#c75a42" },
      { id: "On Time", value: counts["On Time"], color: "#3d8a9c" },
      { id: "Early", value: counts.Early, color: "#6b9b4e" },
    ].filter((d) => d.value > 0);
  }, [tasks]);

  const fetchTaskDetails = useCallback((silent: boolean = false) => {
    if (!selectedProject?.id) {
      setTasks([]);
      return;
    }

    if (!silent) {
      setLoading(true);
      setError(null);
    }

    try {
      const statusMap: Record<string, TaskStatusType> = {
        NotStarted: "Not Started",
        InProgress: "In Progress",
        MarkedComplete: "Pending",
        TaskComplete: "Finished",
        TaskRejected: "Rejected",
      };

      // Get tasks from local PMContext state
      let rawTasks: any[] = [];
      const isAllProjects = selectedProject.id === "all";
      if (isAllProjects) {
        rawTasks = Object.values(projectTasks).flat();
      } else {
        rawTasks = projectTasks[selectedProject.id] ?? [];
      }

      // Apply filters
      if (selectedMilestone && selectedMilestone !== "all") {
        rawTasks = rawTasks.filter((t: any) => t.milestoneId === selectedMilestone);
      }
      if (selectedTeam && selectedTeam !== "all") {
        rawTasks = rawTasks.filter((t: any) => t.teamId === selectedTeam || t.teamResponsibleId === selectedTeam);
      }

      const mappedTasks: TaskDetail[] = rawTasks.map((task: any) => ({
        id: task.id,
        projectName: selectedProject.name || "745 18th St",
        assigneeOrganizationName: task.assigneeOrganizationName || "",
        teamResponsible: task.teamResponsible?.name || "",
        milestone: task.milestoneName || "",
        taskName: task.name,
        taskStatus: statusMap[task.taskStatus || task.status] || "Not Started",
        taskStartStatus: task.taskStartStatus ?? null,
        taskEndStatus: task.taskEndStatus ?? null,
        daysAdjusted: task.daysAdjusted || 0,
        progress: task.progress || 0,
        originalBudget: task.taskBudget || 0,
        changeOrderToDate: task.changeOrder || 0,
        newBudget: (task.taskBudget || 0) + (task.changeOrder || 0),
        startDate: task.startDate || "",
        endDate: task.endDate || "",
        dateStarted: task.dateStarted || null,
        dateEnded: task.dateEnded || null,
        issueCount: task.issueCount || 0,
        priority: task.priority || null,
      }));
      setTasks(mappedTasks);
    } catch (err) {
      console.error("Error loading task details:", err);
      if (!silent) {
        setError(err instanceof Error ? err.message : "An error occurred");
      }
      setTasks([]);
    } finally {
      if (!silent) {
        setLoading(false);
      }
    }
  }, [selectedProject?.id, selectedProject?.name, selectedMilestone, selectedTeam, projectTasks]);

  useEffect(() => {
    fetchTaskDetails();
  }, [fetchTaskDetails]);

  // Listen for real-time task updates via socket
  useEffect(() => {
    if (!socket || !connected) return;

    const statusMap: Record<string, TaskStatusType> = {
      NotStarted: "Not Started",
      InProgress: "In Progress",
      MarkedComplete: "Pending",
      TaskComplete: "Finished",
      TaskRejected: "Rejected",
    };

    const handleTasksUpdated = (data: { id: string; tasks: any[] }) => {
      // Only process if viewing this project or all projects
      const isAllProjects = selectedProject?.id === "all";
      if (!isAllProjects && data.id !== selectedProject?.id) return;

      // Update tasks in place without full refetch
      setTasks((prevTasks) => {
        const updatedTasksMap = new Map(
          data.tasks.map((t) => [t.id, t])
        );

        return prevTasks.map((task) => {
          const updatedTask = updatedTasksMap.get(task.id);
          if (updatedTask) {
            return {
              ...task,
              progress: updatedTask.progress,
              taskStatus: statusMap[updatedTask.taskStatus] || task.taskStatus,
              taskStartStatus: updatedTask.taskStartStatus ?? task.taskStartStatus,
              taskEndStatus: updatedTask.taskEndStatus ?? task.taskEndStatus,
              daysAdjusted: updatedTask.daysAdjusted ?? task.daysAdjusted,
              dateStarted: updatedTask.dateStarted ?? task.dateStarted,
              dateEnded: updatedTask.dateEnded ?? task.dateEnded,
            };
          }
          return task;
        });
      });
    };

    socket.on("tasks_updated", handleTasksUpdated);

    return () => {
      socket.off("tasks_updated", handleTasksUpdated);
    };
  }, [socket, connected, selectedProject?.id]);

  
  const columns: GridColDef[] = [
    {
      field: "milestone",
      headerName: "Milestone",
      flex: isXl ? 0.5 : 1,
      minWidth: isXl ? 60 : 140,
      maxWidth: isXl ? 150 : undefined,
    },
    {
      field: "taskName",
      headerName: "Task",
      flex: isXl ? 0.5 : 1.5,
      minWidth: isXl ? 60 : 180,
      maxWidth: isXl ? 150 : undefined,
    },
    {
      field: "assigneeOrganizationName",
      headerName: "Organization",
      flex: isXl ? 0.5 : 1,
      minWidth: isXl ? 60 : 140,
      maxWidth: isXl ? 150 : undefined,
    },
    // {
    //   field: "teamResponsible",
    //   headerName: "Team",
    //   flex: isXl ? 0.5 : 1,
    //   minWidth: isXl ? 60 : 140,
    //   maxWidth: isXl ? 150 : undefined,
    // },
    {
      field: "progress",
      headerName: "Progress",

      width: isXl ? 70 : 120,
      renderCell: (params: GridRenderCellParams<TaskDetail>) => {
        const value = params.value as number;
        return (
          <Box sx={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", gap: 0.5 }}>
            <LinearProgress
              variant="determinate"
              value={Math.min(value, 100)}
              sx={{
                width: "100%",
                height: 6,
                borderRadius: 4,
                bgcolor: "grey.200",
                "& .MuiLinearProgress-bar": {
                  borderRadius: 4,
                  bgcolor: value >= 100 ? "success.main" : value >= 50 ? "info.main" : "warning.main",
                },
              }}
            />
            <Typography variant="caption">{Math.round(value)}%</Typography>
          </Box>
        );
      },
    },
    {
      field: "issueCount",
      headerName: "Issues",
      width: isXl ? 40 : 80,

      align: "center",
      headerAlign: "center",
      renderCell: (params: GridRenderCellParams<TaskDetail>) =>
        params.value > 0 ? (
          <FlagRounded color="error" fontSize={isXl ? "small" : "medium"} />
        ) : (
          <Typography color="text.secondary">-</Typography>
        ),
    },
    {
      field: "startDate",
      headerName: "Start Date",
      flex: isXl ? 0.4 : undefined,
      width: isXl ? undefined : 110,
      minWidth: isXl ? 80 : undefined,
      valueFormatter: (value: string) => formatDate(value),
    },
    {
      field: "endDate",
      headerName: "End Date",
      flex: isXl ? 0.4 : undefined,
      width: isXl ? undefined : 110,
      minWidth: isXl ? 80 : undefined,
      valueFormatter: (value: string) => formatDate(value),
    },
    {
      field: "taskStatus",
      headerName: "Status",
      flex: isXl ? 0.4 : undefined,
      width: isXl ? undefined : 140,
      minWidth: isXl ? 75 : undefined,
      renderCell: (params: GridRenderCellParams<TaskDetail>) => (
        <StatusChip status={params.value as TaskStatusType} isXl={isXl} />
      ),
    },
    {
      field: "priority",
      headerName: "Priority",
      flex: isXl ? 0.35 : undefined,
      width: isXl ? undefined : 100,
      minWidth: isXl ? 70 : undefined,
      renderCell: (params: GridRenderCellParams<TaskDetail>) => {
        if (!params.value) return <Typography color="text.secondary">-</Typography>;
        const priorityColors: Record<string, string> = {
          Critical: "#dc2626",
          High: "#ea580c",
          Medium: "#2563eb",
          Low: "#16a34a",
        };
        return (
          <Chip
            size="small"
            label={params.value}
            sx={{
              bgcolor: priorityColors[params.value as string] || "#6b7280",
              color: "#fff",
              fontWeight: 500,
              fontSize: isXl ? "0.5vw" : undefined,
              height: isXl ? 20 : undefined,
              "& .MuiChip-label": {
                px: isXl ? 0.5 : undefined,
              },
            }}
          />
        );
      },
    },
    {
      field: "taskStartStatus",
      headerName: "Start Status",
      flex: isXl ? 0.35 : undefined,
      width: isXl ? undefined : 110,
      minWidth: isXl ? 65 : undefined,
      renderCell: (params: GridRenderCellParams<TaskDetail>) => {
        if (params.value === null || params.value === undefined) {
          return '';
        }
        return <DateStatusChip status={params.value as -1 | 0 | 1} isXl={isXl} />;
      },
    },
    {
      field: "taskEndStatus",
      headerName: "End Status",
      flex: isXl ? 0.35 : undefined,
      width: isXl ? undefined : 110,
      minWidth: isXl ? 65 : undefined,
      renderCell: (params: GridRenderCellParams<TaskDetail>) => {
        if (params.row.taskStatus === 'In Progress') {
          return '';
        }
        if (params.value === null || params.value === undefined) {
          return '';
        }
        return <DateStatusChip status={params.value as -1 | 0 | 1} isXl={isXl} />;
      },
    },
    {
      field: "daysAdjusted",
      headerName: "+/- Days",
      flex: isXl ? 0.3 : undefined,
      width: isXl ? undefined : 120,
      minWidth: isXl ? 50 : undefined,
      align: "center",
      headerAlign: "center",
      renderCell: (params: GridRenderCellParams<TaskDetail>) => {
        const value = params.value as number;
        const maxDays = 30;
        const percentage = Math.min((Math.abs(value) / maxDays) * 100, 100);

        return (
          <Box sx={{ width: "100%", display: "flex", alignItems: "center", gap: isXl ? 0.25 : 0.5 }}>
            <Box sx={{ flex: 1, display: "flex", justifyContent: "flex-end" }}>
              {value < 0 && (
                <Box
                  sx={{
                    width: `${percentage}%`,
                    height: isXl ? 6 : 8,
                    borderRadius: 4,
                    bgcolor: "success.main",
                  }}
                />
              )}
            </Box>
            <Typography
              variant="caption"
              sx={{ minWidth: isXl ? 25 : 35, textAlign: "center", fontSize: isXl ? "0.5vw" : undefined }}
            >
              {value > 0 ? `+${value}` : value}
            </Typography>
            <Box sx={{ flex: 1, display: "flex", justifyContent: "flex-start" }}>
              {value > 0 && (
                <Box
                  sx={{
                    width: `${percentage}%`,
                    height: isXl ? 6 : 8,
                    borderRadius: 4,
                    bgcolor: "error.main",
                  }}
                />
              )}
            </Box>
          </Box>
        );
      },
    },
    {
      field: "originalBudget",
      headerName: "Budget",
      flex: isXl ? 0.35 : undefined,
      width: isXl ? undefined : 110,
      minWidth: isXl ? 60 : undefined,
      align: "right",
      headerAlign: "right",
      valueFormatter: (value: number) => formatCurrency(value),
    },
    {
      field: "changeOrderToDate",
      headerName: "Change Order",
      flex: isXl ? 0.35 : undefined,
      width: isXl ? undefined : 120,
      minWidth: isXl ? 60 : undefined,
      align: "right",
      headerAlign: "right",
      valueFormatter: (value: number) => formatCurrency(value),
    },
    {
      field: "newBudget",
      headerName: "New Budget",
      flex: isXl ? 0.35 : undefined,
      width: isXl ? undefined : 120,
      minWidth: isXl ? 60 : undefined,
      align: "right",
      headerAlign: "right",
      valueFormatter: (value: number) => formatCurrency(value),
    },
    {
      field: "budgetUtilized",
      headerName: "Budget Utilized",
      flex: isXl ? 0.4 : undefined,
      width: isXl ? undefined : 130,
      minWidth: isXl ? 70 : undefined,
      align: "right",
      headerAlign: "right",
      valueGetter: (_value: unknown, row: TaskDetail) => {
        const rawValue = (row.progress / 100) * row.newBudget;
        const finalValue = Math.round((rawValue + Number.EPSILON) * 100) / 100;
        return finalValue;
      },
      valueFormatter: (value: number) => formatCurrency(value),
    },
    {
      field: "budgetRemaining",
      headerName: "Budget Remaining",
      flex: isXl ? 0.45 : undefined,
      width: isXl ? undefined : 150,
      minWidth: isXl ? 75 : undefined,
      align: "right",
      headerAlign: "right",
      valueGetter: (_value: unknown, row: TaskDetail) => {
        // 1. Calculate the exact unrounded amount used
        const rawUtilized = (row.progress / 100) * row.newBudget;

        // 2. Round that amount to the cent (Example: 1050.567 -> 1050.57)
        const utilized = Math.round((rawUtilized + Number.EPSILON) * 100) / 100;

        // 3. Subtract from the budget
        const remaining = row.newBudget - utilized;

        // 4. Return the result (rounding again ensures no floating point errors like 10.0000001)
        return Math.round((remaining + Number.EPSILON) * 100) / 100;
      },
      valueFormatter: (value: number) => formatCurrency(value),
    },
  ];

  // No rows overlay
  const NoRowsOverlay = () => (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        py: 4,
      }}
    >
      <Typography variant="body1" color="text.secondary">
        {!selectedProject ? "Select a project to view task details" : "No tasks found"}
      </Typography>
    </Box>
  );

  if (error) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: 400,
          gap: 2,
        }}
      >
        <Typography variant="body1" color="error">
          {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        mt: 0,
        display: "flex",
        gap: 1,
        flexDirection: "column",
        height: "100%",
        width: "100%",
        "& .glass-card-title": {
          filter: "blur(4px)",
          userSelect: "none",
        },
        "& .MuiDataGrid-columnHeaderTitle": {
          filter: "blur(4px)",
          userSelect: "none",
        },
      }}
    >
      {!isReport && (
        <Grid container spacing={1} sx={{ minHeight: { lg: 230 } }}>
          <Grid size={{ xs: 6, sm: 6, lg: 3 }}>
            <GlassCard title="Project Status" minHeight={0}>
              <ProjectStatus data={overallProjectStatus} />
            </GlassCard>
          </Grid>
          <Grid size={{ xs: 6, sm: 6, lg: 3 }}>
            <GlassCard title="Task Status" minHeight={0}>
              <TaskPieChart data={computedTaskStatusOverview} />
            </GlassCard>
          </Grid>
          <Grid size={{ xs: 6, sm: 6, lg: 3 }}>
            <GlassCard title="Task Start Status" minHeight={0}>
              <TaskPieChart data={computedStatusByStartDate} />
            </GlassCard>
          </Grid>
          <Grid size={{ xs: 6, sm: 6, lg: 3 }}>
            <GlassCard title="Task Completion" minHeight={0}>
              <TaskPieChart data={computedStatusByEndDate} />
            </GlassCard>
          </Grid>
        </Grid>
      )}

      {/* Task Details Table */}
      <Box sx={{ width: "100%", height: { lg: "calc(100% - 238px)" } }}>
        <DataGrid
          rows={filteredTasks}
          columns={columns}
          loading={loading}
          pageSizeOptions={[10, 25, 50, 100]}
          initialState={{
            pagination: { paginationModel: { pageSize: 100 } },
          }}
          slotProps={{
            loadingOverlay: {
              variant: "skeleton",
              noRowsVariant: "skeleton",
            },
          }}
          disableRowSelectionOnClick
          getRowHeight={() => "auto"}
          slots={{ noRowsOverlay: NoRowsOverlay }}
          sx={{
            //fontSize: "0.8125rem",
            fontSize: { xs: "0.8125rem", xl: "0.55vw" },
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: (theme: Theme) => theme.palette.background.default,
              borderBottom: 1,
              borderColor: "divider",
            },
            "& .MuiDataGrid-columnHeaderTitle": {
              whiteSpace: "normal",
              lineHeight: "normal",
              fontWeight: 600,
              //fontSize: "0.8125rem",
              fontSize: { xs: "0.8125rem", xl: "0.55vw" },
            },
            "& .MuiDataGrid-cell": {
              borderBottom: 1,
              borderTop: "none",
              borderColor: "divider",
              backgroundColor: "background.default",
              whiteSpace: "normal",
              lineHeight: "normal !important",
              alignItems: "center",
              py: { xs: "8px", xl: "4px" },
              px: { xs: 2, xl: 1 },
            },
            // Move footer to top using flexbox order
            display: "flex",
            flexDirection: "column",
            "& .MuiDataGrid-main": {
              order: 2,
            },
            "& .MuiDataGrid-footerContainer": {
              order: 1,
              borderBottom: 1,
              borderColor: "divider",
              borderTop: "none",
              backgroundColor: "background.default",
            },
            "& .MuiDataGrid-virtualScroller": {
              overflowY: "auto",
            },
            border: 1,
            borderColor: "divider",
            borderRadius: 2,
            "& .MuiDataGrid-cell:focus": { outline: "none" },
            "& .MuiDataGrid-row": {
              borderBottom: 1,
              borderColor: "divider",
            },
            "& .MuiDataGrid-row:hover": { backgroundColor: "action.hover" },
            "& .MuiDataGrid-columnHeader": {
              backgroundColor: "background.default",
              borderRight: "none",
              px: { xs: 2, xl: 1 },
            },
            "& .MuiDataGrid-columnSeparator": {
              display: "none",
            },
            "& .MuiDataGrid-filler": {
              backgroundColor: "background.default",
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default ProjectTaskDetails;
