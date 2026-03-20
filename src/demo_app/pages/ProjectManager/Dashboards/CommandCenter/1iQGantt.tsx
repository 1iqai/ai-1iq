import React, { useMemo, useCallback, useState, useEffect, useRef } from "react";
import {
  Box,
  Paper,
  Typography,
  CircularProgress,
  ToggleButtonGroup,
  ToggleButton,
  IconButton,
  Tooltip,
  Grid,
  Dialog,
  DialogContent,
  AppBar,
  Toolbar,
  Button,
} from "@mui/material";
import { FullscreenRounded, CloseRounded, TodayRounded } from "@mui/icons-material";
import { eachDayOfInterval, startOfDay, parseISO, isWeekend } from "date-fns";
import ProjectStatus from "../../Components/Charts/ProjectStatus";
import TaskPieChart from "../../Components/Charts/TaskPieChart";
import GanttChart from "./GanttChart";
import type { ProjectStatusType } from "../../AnalyticsDashboard.types";
import GlassCard from "../../../../components/shared/GlassCard";
import { useSocket } from "../../../../contexts/SocketContext";
import { useAuth } from "../../../../hooks/useAuth";
import { usePM } from "../../../../contexts/PMContext";

interface Project {
  id: string;
  name: string;
  milestones: { id: string; name: string; displayName?: string; tasks: any[] }[];
  teams?: { id: string; name: string }[];
}

interface GanttProps {
  selectedProject: Project | null;
  selectedMilestone: string | null;
  selectedTeam: string | null;
  selectedTask: string | null;
  overallProjectStatus: ProjectStatusType | null;
  taskStatusOverview: { id: string; value: number; color?: string }[];
  statusByStartDate: { id: string; value: number; color?: string }[];
  statusByEndDate: { id: string; value: number; color?: string }[];
  isReport?: boolean;
  onTaskCountChange?: (count: number) => void;
}

interface GanttTask {
  id: string;
  name: string;
  milestoneName: string;
  milestoneId: string;
  startDate: Date | null;
  endDate: Date | null;
  duration: number;
  status: string;
  dependentTasks: string[];
  issues?: any[];
  issueCount?: number;
}

const OneiQGantt: React.FC<GanttProps> = ({
  selectedProject,
  selectedMilestone,
  selectedTeam,
  selectedTask,
  overallProjectStatus,
  taskStatusOverview,
  statusByStartDate,
  statusByEndDate,
  isReport = false,
  onTaskCountChange,
}) => {
  const { socket, connected } = useSocket();
  const { user } = useAuth();
  const { projectTasks } = usePM();
  const [tasks, setTasks] = useState<GanttTask[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState<"day" | "week" | "month">(isReport ? "month" : "week");
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [scrollToTodayTrigger, setScrollToTodayTrigger] = useState(0);
  const initialLoadDoneRef = useRef(false);

  const handleScrollToToday = useCallback(() => {
    setScrollToTodayTrigger((prev) => prev + 1);
  }, []);

  const fetchTasks = useCallback(async () => {
    setIsLoading(true);
    try {
      // Get tasks from local PMContext state
      let rawTasks: any[] = [];
      if (!selectedProject?.id || selectedProject.id === "all") {
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
      if (selectedTask && selectedTask !== "all") {
        rawTasks = rawTasks.filter((t: any) => t.id === selectedTask);
      }

      // Build name→id map for dependency resolution
      const nameToId = new Map(rawTasks.map((t: any) => [t.name, t.id]));

      const formattedTasks: GanttTask[] = rawTasks.map((task: any) => ({
        ...task,
        startDate: task.startDate ? startOfDay(parseISO(task.startDate)) : null,
        endDate: task.endDate ? startOfDay(parseISO(task.endDate)) : null,
        milestoneName: task.milestoneName || "N/A",
        status: task.taskStatus || task.status || "NotStarted",
        duration:
          task.startDate && task.endDate
            ? eachDayOfInterval({ start: parseISO(task.startDate), end: parseISO(task.endDate) }).filter(
                (day: Date) => !isWeekend(day),
              ).length
            : 1,
        issues: task.issues || [],
        issueCount: task.issueCount ?? task.issues?.length ?? 0,
        dependentTasks: task.dependency
          ? task.dependency.split(",").map((n: string) => nameToId.get(n.trim())).filter(Boolean)
          : [],
      }));
      setTasks(formattedTasks);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
      initialLoadDoneRef.current = true;
    }
  }, [selectedProject, selectedMilestone, selectedTeam, selectedTask, projectTasks]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Socket listener for real-time updates - update tasks in-place without full refetch
  useEffect(() => {
    if (!socket || !connected || !user?.id) return;

    const handleTasksUpdated = (socketData: any) => {
      if (!socketData || socketData.managerId != user.id) return;
      if (!initialLoadDoneRef.current) return;

      // Update task status and issues in-place
      if (socketData.tasks && Array.isArray(socketData.tasks)) {
        setTasks((prevTasks) =>
          prevTasks.map((task) => {
            const updatedTask = socketData.tasks.find((t: any) => t.id === task.id);
            if (updatedTask) {
              return {
                ...task,
                status: updatedTask.taskStatus ?? task.status,
                issues: updatedTask.issues ?? task.issues,
                issueCount: updatedTask.issueCount ?? updatedTask.issues?.length ?? task.issueCount,
              };
            }
            return task;
          })
        );
      }
    };

    const handleTasksRescheduled = (socketData: any) => {
      if (!socketData || socketData.managerId !== user.id) return;
      if (!initialLoadDoneRef.current) return;

      // Update task dates in-place
      if (socketData.tasks && Array.isArray(socketData.tasks)) {
        setTasks((prevTasks) =>
          prevTasks.map((task) => {
            const rescheduledTask = socketData.tasks.find((t: any) => t.id === task.id);
            if (rescheduledTask) {
              const newStartDate = rescheduledTask.startDate ? startOfDay(parseISO(rescheduledTask.startDate)) : task.startDate;
              const newEndDate = rescheduledTask.endDate ? startOfDay(parseISO(rescheduledTask.endDate)) : task.endDate;
              const newDuration = newStartDate && newEndDate
                ? eachDayOfInterval({ start: newStartDate, end: newEndDate }).filter((day: Date) => !isWeekend(day)).length
                : task.duration;
              return {
                ...task,
                startDate: newStartDate,
                endDate: newEndDate,
                duration: newDuration,
                status: rescheduledTask.taskStatus ?? task.status,
              };
            }
            return task;
          })
        );
      }
    };

    socket.on("tasks_updated", handleTasksUpdated);
    socket.on("tasks_rescheduled", handleTasksRescheduled);

    return () => {
      socket.off("tasks_updated", handleTasksUpdated);
      socket.off("tasks_rescheduled", handleTasksRescheduled);
    };
  }, [socket, connected, user?.id]);

  const handleStatusClick = (status: string) => {
    setSelectedStatuses((prev) => (prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status]));
  };

  const handleToggleFullscreen = useCallback(() => {
    setIsFullscreen((prev) => !prev);
  }, []);

  const ganttTasks = tasks.filter((t) => t.startDate && t.endDate);

  const filteredGanttTasks = useMemo(() => {
    if (selectedStatuses.length === 0) {
      return ganttTasks;
    }
    const statusMapping: { [key: string]: string[] } = {
      Completed: ["TaskComplete", "MarkedComplete"],
      "In Progress": ["InProgress"],
      Issue: ["TaskRejected"],
      "Not Started": ["NotStarted"],
    };

    const activeStatuses = selectedStatuses.flatMap((s) => statusMapping[s] || []);
    const issueFilterSelected = selectedStatuses.includes("Issue");

    return ganttTasks.filter((task) => {
      // Check if task matches any selected status
      const matchesStatus = activeStatuses.includes(task.status);
      // If "Issue" filter is selected, also include tasks with unresolved issues
      const hasUnresolvedIssues = issueFilterSelected && ((task.issues && task.issues.length > 0) || (task.issueCount && task.issueCount > 0));
      return matchesStatus || hasUnresolvedIssues;
    });
  }, [ganttTasks, selectedStatuses]);

  const sortedGanttTasks = useMemo(() => {
    return [...filteredGanttTasks].sort((a, b) => a.milestoneName.localeCompare(b.milestoneName));
  }, [filteredGanttTasks]);

  // Notify parent of task count for dynamic height calculation
  useEffect(() => {
    if (onTaskCountChange) {
      onTaskCountChange(sortedGanttTasks.length);
    }
  }, [sortedGanttTasks.length, onTaskCountChange]);

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column", gap: 0, "& .glass-card-title": { filter: "blur(4px)", userSelect: "none" } }}>
      {!isReport && (
        <Grid container spacing={1} sx={{ mb: 1 }} minHeight={250}>
          <>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <GlassCard title="Project Status" minHeight={0}>
                <ProjectStatus data={overallProjectStatus} />
              </GlassCard>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <GlassCard title="Task Status" minHeight={0}>
                <TaskPieChart data={taskStatusOverview} title="Task Status" />
              </GlassCard>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <GlassCard title="Task Start Status" minHeight={0}>
                <TaskPieChart data={statusByStartDate} title="Task Start Status" />
              </GlassCard>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <GlassCard title="Task Completion" minHeight={0}>
                <TaskPieChart data={statusByEndDate} title="Task Completion" />
              </GlassCard>
            </Grid>
          </>
        </Grid>
      )}

      {/* Toolbar: Legend + View Toggle */}
      <Paper
        elevation={0}
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { xs: "stretch", sm: "center" },
          justifyContent: "space-between",
          gap: 2,
          p: 1.5,
          mb: 1,
          borderRadius: 2,
          border: 1,
          borderColor: "divider",
          backgroundColor: "background.default",
        }}
      >
        {/* Status Legend */}
        <Box
          sx={{
            display: "flex",
            gap: 1,
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <Typography variant="caption" color="text.secondary" sx={{ mr: 1, fontWeight: 500 }}>
            Filter:
          </Typography>
          {[
            { label: "Not Started", color: "#9ca3af" },
            { label: "In Progress", color: "#3b82f6" },
            { label: "Completed", color: "#10b981" },
            { label: "Issue", color: "#ef4444" },
          ].map((item) => {
            const isActive = selectedStatuses.length === 0 || selectedStatuses.includes(item.label);
            return (
              <Box
                key={item.label}
                onClick={() => handleStatusClick(item.label)}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.75,
                  px: 1.5,
                  py: 0.5,
                  borderRadius: 5,
                  cursor: "pointer",
                  border: `1px solid ${item.color}`,
                  backgroundColor: isActive ? `${item.color}35` : "transparent",
                  opacity: isActive ? 1 : 0.5,
                  transition: "all 0.2s ease",
                  "&:hover": {
                    backgroundColor: `${item.color}50`,
                    opacity: 1,
                  },
                }}
              >
                <Box
                  sx={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    backgroundColor: item.color,
                  }}
                />
                <Typography variant="caption" sx={{ fontWeight: 500, color: "text.primary" }}>
                  {item.label}
                </Typography>
              </Box>
            );
          })}
        </Box>

        {/* View Mode Toggle and Fullscreen */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Button
            onClick={handleScrollToToday}
            size="small"
            variant="outlined"
            startIcon={<TodayRounded fontSize="small" />}
            sx={{
              borderColor: "divider",
              color: "text.primary",
              textTransform: "none",
              fontSize: "0.75rem",
              fontWeight: 500,
              py: 0.5,
              px: 1.5,
            }}
          >
            Today
          </Button>

          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={(_event: React.MouseEvent<HTMLElement>, newViewMode: "day" | "week" | "month") => {
              if (newViewMode) setViewMode(newViewMode);
            }}
            aria-label="Gantt View Mode"
            size="small"
            sx={{
              "& .MuiToggleButtonGroup-grouped": {
                border: 1,
                borderColor: "divider",

                "&:not(:first-of-type)": {
                  border: 1,
                  borderColor: "divider",
                },
                "&:first-of-type": {
                  marginLeft: 0,
                },
              },
              "& .MuiToggleButton-root": {
                py: 0.5,
                px: 2,
                fontSize: "0.75rem",
                fontWeight: 500,
                textTransform: "none",
                "&.Mui-selected": {
                  backgroundColor: "primary.main",
                  color: "primary.contrastText",
                  "&:hover": {
                    backgroundColor: "primary.dark",
                  },
                },
              },
            }}
          >
            <ToggleButton value="day" aria-label="daily view">
              Day
            </ToggleButton>
            <ToggleButton value="week" aria-label="weekly view">
              Week
            </ToggleButton>
            <ToggleButton value="month" aria-label="monthly view">
              Month
            </ToggleButton>
          </ToggleButtonGroup>

          <Tooltip title="Fullscreen">
            <IconButton
              onClick={handleToggleFullscreen}
              size="small"
              sx={{
                border: 1,
                borderColor: "divider",
                borderRadius: 1,
              }}
            >
              <FullscreenRounded />
            </IconButton>
          </Tooltip>
        </Box>
      </Paper>

      {isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
          <CircularProgress />
        </Box>
      ) : filteredGanttTasks.length === 0 ? (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            minHeight: 300,
          }}
        >
          <Typography color="text.secondary">No tasks with dates found for this selection</Typography>
        </Box>
      ) : (
        !isFullscreen && <GanttChart key="main" viewMode={viewMode} tasks={sortedGanttTasks} scrollToTodayTrigger={scrollToTodayTrigger} />
      )}

      {/* Fullscreen Dialog */}
      <Dialog
        open={isFullscreen}
        onClose={() => setIsFullscreen(false)}
        fullScreen
        slotProps={{
          paper: { sx: { bgcolor: "background.default" } },
        }}
      >
        <AppBar sx={{ position: "relative" }} color="default" elevation={1}>
          <Toolbar sx={{ justifyContent: "space-between" }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Gantt Chart {selectedProject?.name ? `- ${selectedProject.name}` : ""}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              {/* Today Button */}
              <Button
                onClick={handleScrollToToday}
                size="small"
                variant="outlined"
                startIcon={<TodayRounded fontSize="small" />}
                sx={{
                  borderColor: "divider",
                  color: "text.primary",
                  textTransform: "none",
                  fontSize: "0.75rem",
                  fontWeight: 500,
                  py: 0.5,
                  px: 1.5,
                }}
              >
                Today
              </Button>

              {/* View Mode Toggle */}
              <ToggleButtonGroup
                value={viewMode}
                exclusive
                onChange={(_e: React.MouseEvent<HTMLElement>, newViewMode: "day" | "week" | "month") =>
                  newViewMode && setViewMode(newViewMode)
                }
                size="small"
                sx={{
                  "& .MuiToggleButton-root": {
                    py: 0.5,
                    px: 2,
                    fontSize: "0.75rem",
                    fontWeight: 500,
                    textTransform: "none",
                    "&.Mui-selected": {
                      backgroundColor: "primary.main",
                      color: "primary.contrastText",
                      "&:hover": {
                        backgroundColor: "primary.dark",
                      },
                    },
                  },
                }}
              >
                <ToggleButton value="day">Day</ToggleButton>
                <ToggleButton value="week">Week</ToggleButton>
                <ToggleButton value="month">Month</ToggleButton>
              </ToggleButtonGroup>
              <IconButton onClick={() => setIsFullscreen(false)} color="inherit">
                <CloseRounded />
              </IconButton>
            </Box>
          </Toolbar>
        </AppBar>
        <DialogContent sx={{ p: 0, display: "flex", flexDirection: "column" }}>
          <Box sx={{ flex: 1, minHeight: 0 }}>
            {filteredGanttTasks.length === 0 ? (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100%",
                }}
              >
                <Typography color="text.secondary">No tasks with dates found for this selection</Typography>
              </Box>
            ) : (
              isFullscreen && <GanttChart key="fullscreen" viewMode={viewMode} tasks={sortedGanttTasks} scrollToTodayTrigger={scrollToTodayTrigger} />
            )}
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default OneiQGantt;
