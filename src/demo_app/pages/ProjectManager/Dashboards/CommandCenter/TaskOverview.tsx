import { useState, useEffect, useMemo, useRef } from "react";
import { Box, Typography, Grid, CircularProgress, IconButton, Dialog, DialogTitle, DialogContent, Tooltip } from "@mui/material";
import toast from "react-hot-toast";
import { useTheme } from "../../../../hooks/useTheme";
import FilterListIcon from "@mui/icons-material/FilterList";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import CloseIcon from "@mui/icons-material/Close";
import Chart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";
import GlassCard from "../../../../components/shared/GlassCard";
import { usePM } from "../../../../contexts/PMContext";
import { useSocket } from "../../../../contexts/SocketContext";
import { useAuth } from "../../../../hooks/useAuth";
import ProjectStatus from "../../Components/Charts/ProjectStatus";
import { useWindowSize } from "../../../../hooks/useWindowSize";
import { getChartFontSizes } from "../../../../utility/responsiveChartFonts";

// Color palette for milestone groups (used for x-axis milestone labels)
const MILESTONE_COLORS = [
  "#3b82f6", // Blue
  "#8b5cf6", // Purple
  "#ec4899", // Pink
  "#f97316", // Orange
  "#14b8a6", // Teal
  "#84cc16", // Lime
  "#f59e0b", // Amber
  "#06b6d4", // Cyan
  "#6366f1", // Indigo
  "#10b981", // Emerald
];

// Bottom to top gradient for Task Progress and Total Duration charts
const GRADIENT_COLORS = {
  light: {
    bottom: "#0369a1", // Darker blue at bottom
    top: "#7dd3fc", // Lighter blue at top
  },
  dark: {
    bottom: "#0ea5e9", // Darker cyan at bottom
    top: "#a5f3fc", // Lighter cyan at top
  },
};

interface TaskAdjustmentItem {
  taskId: string;
  taskName: string;
  daysAdjustedFromStart: number;
  currentDuration: number;
  milestoneName?: string;
  teamName?: string;
  issueRaisedDate?: string;
  daysSinceIssue?: number;
  projectId?: string;
  projectName?: string;
  startDate?: string;
}

interface TaskProgressItem {
  taskId: string;
  taskName: string;
  progress: number;
  milestoneName?: string;
  teamName?: string;
  projectId?: string;
  projectName?: string;
  startDate?: string;
}

interface TaskAdjustmentsData {
  daysAdjustedData: TaskAdjustmentItem[];
  durationData: TaskAdjustmentItem[];
  issueDurationData: TaskAdjustmentItem[];
}

interface TaskProgressData {
  taskProgressData: TaskProgressItem[];
}

interface TaskOverviewProps {
  isReport?: boolean;
}

const TaskOverview: React.FC<TaskOverviewProps> = ({ isReport = false }) => {
  const { isDark } = useTheme();
  const { selectedProject, selectedMilestone, selectedTeam, overallProjectStatus, projectTasks } = usePM();
  const { socket, connected } = useSocket();
  const { user } = useAuth();
  const { width: viewportWidth } = useWindowSize();
  const fontSizes = useMemo(() => getChartFontSizes(viewportWidth), [viewportWidth]);

  const [data, setData] = useState<TaskAdjustmentsData | null>(null);
  const [progressData, setProgressData] = useState<TaskProgressData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortAscending, setSortAscending] = useState(false);
  const [sortDurationAscending, setSortDurationAscending] = useState(false);
  const [sortProgressAscending, setSortProgressAscending] = useState(true);
  const [expandedChart, setExpandedChart] = useState<string | null>(null);

  // Track if we've done initial load to avoid refetch on socket updates
  const initialLoadDoneRef = useRef(false);
  // Trigger to refetch data when issues change
  const [refetchTrigger, setRefetchTrigger] = useState(0);

  // Theme-aware colors for chart text
  const textPrimaryColor = isDark ? "#fff" : "#111827";
  const textSecondaryColor = isDark ? "#9ca3af" : "#6b7280";

  useEffect(() => {
    // Only show loading on initial load, not on refetch
    if (!initialLoadDoneRef.current) {
      setLoading(true);
    }
    setError(null);

    try {
      // Get filtered tasks from local PMContext state
      let tasks: any[] = [];
      if (!selectedProject?.id || selectedProject.id === "all") {
        tasks = Object.values(projectTasks).flat();
      } else {
        tasks = projectTasks[selectedProject.id] ?? [];
      }

      if (selectedMilestone && selectedMilestone !== "all") {
        tasks = tasks.filter((t: any) => t.milestoneId === selectedMilestone);
      }
      if (selectedTeam && selectedTeam !== "all") {
        tasks = tasks.filter((t: any) => t.teamId === selectedTeam || t.teamResponsibleId === selectedTeam);
      }

      // Build daysAdjustedData — only include tasks with a non-zero adjustment
      const daysAdjustedData: TaskAdjustmentItem[] = tasks
        .filter((t: any) => (t.daysAdjusted || 0) !== 0)
        .map((t: any) => ({
          taskId: t.id,
          taskName: t.name,
          daysAdjustedFromStart: t.daysAdjusted || 0,
          currentDuration: t.duration || 1,
          milestoneName: t.milestoneName || "",
        }));

      // Build durationData (total duration per task)
      const durationData: TaskAdjustmentItem[] = tasks.map((t: any) => ({
        taskId: t.id,
        taskName: t.name,
        daysAdjustedFromStart: t.duration || 1,
        currentDuration: t.duration || 1,
        milestoneName: t.milestoneName || "",
      }));

      setData({
        daysAdjustedData,
        durationData,
        issueDurationData: [],
      });

      // Build taskProgressData
      const taskProgressData: TaskProgressItem[] = tasks.map((t: any) => ({
        taskId: t.id,
        taskName: t.name,
        progress: t.progress || 0,
        milestoneName: t.milestoneName || "",
      }));

      setProgressData({ taskProgressData });
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
      initialLoadDoneRef.current = true;
    }
  }, [selectedProject, selectedMilestone, selectedTeam, projectTasks, refetchTrigger]);

  // Socket listener for real-time updates - update data in-place without full refetch
  useEffect(() => {
    if (!socket || !connected || !user?.id) return;

    const handleTasksUpdated = (socketData: any) => {
      if (!socketData || socketData.managerId != user.id) return;
      if (!initialLoadDoneRef.current) return; // Don't update if initial load not done

      // Update progress data in-place
      if (socketData.tasks && Array.isArray(socketData.tasks) && progressData?.taskProgressData) {
        setProgressData((prev) => {
          if (!prev) return prev;
          const updatedTaskProgress = prev.taskProgressData.map((task) => {
            const updatedTask = socketData.tasks.find((t: any) => t.id === task.taskId);
            if (updatedTask && updatedTask.progress !== undefined) {
              return { ...task, progress: updatedTask.progress };
            }
            return task;
          });
          return { ...prev, taskProgressData: updatedTaskProgress };
        });
      }

      // Refetch data when issues change to update Issue Duration chart
      if (socketData.tasks && Array.isArray(socketData.tasks)) {
        const hasIssueChanges = socketData.tasks.some((t: any) => t.issues !== undefined);
        if (hasIssueChanges) {
          setRefetchTrigger((prev) => prev + 1);
        }
      }
    };

    const handleTasksRescheduled = (socketData: any) => {
      if (!socketData || socketData.managerId !== user.id) return;
      if (!initialLoadDoneRef.current) return;

      // Update days adjusted data in-place
      if (socketData.tasks && Array.isArray(socketData.tasks) && data?.daysAdjustedData) {
        setData((prev) => {
          if (!prev) return prev;
          const updatedDaysAdjusted = prev.daysAdjustedData.map((task) => {
            const rescheduledTask = socketData.tasks.find((t: any) => t.id === task.taskId);
            if (rescheduledTask) {
              return {
                ...task,
                daysAdjustedFromStart: rescheduledTask.daysAdjusted ?? task.daysAdjustedFromStart,
              };
            }
            return task;
          });
          return { ...prev, daysAdjustedData: updatedDaysAdjusted };
        });
      }
    };

    socket.on("tasks_updated", handleTasksUpdated);
    socket.on("tasks_rescheduled", handleTasksRescheduled);

    return () => {
      socket.off("tasks_updated", handleTasksUpdated);
      socket.off("tasks_rescheduled", handleTasksRescheduled);
    };
  }, [socket, connected, user?.id, data, progressData]);

  // Check if "All Projects" is selected
  const isAllProjects = selectedProject?.id === "all";

  // Sort data based on current sort state
  const sortedDaysAdjustedData = useMemo(() => {
    if (!data?.daysAdjustedData) return [];

    // If "All Projects" is selected, aggregate by project (average days adjusted)
    if (isAllProjects) {
      const projectMap = new Map<string, { totalDaysAdjusted: number; count: number; projectName: string }>();

      data.daysAdjustedData.forEach((task) => {
        const projectId = task.projectId || "unknown";
        const projectName = task.projectName || "Unknown Project";

        if (!projectMap.has(projectId)) {
          projectMap.set(projectId, { totalDaysAdjusted: 0, count: 0, projectName });
        }
        const entry = projectMap.get(projectId)!;
        entry.totalDaysAdjusted += task.daysAdjustedFromStart;
        entry.count += 1;
      });

      // Convert to array with average days adjusted per project
      const aggregated: TaskAdjustmentItem[] = Array.from(projectMap.entries()).map(([projectId, projectData]) => ({
        taskId: projectId,
        taskName: projectData.projectName,
        daysAdjustedFromStart: Math.round(projectData.totalDaysAdjusted / projectData.count),
        currentDuration: 0,
        projectId,
        projectName: projectData.projectName,
      }));

      return aggregated.sort((a, b) =>
        sortAscending
          ? a.daysAdjustedFromStart - b.daysAdjustedFromStart
          : b.daysAdjustedFromStart - a.daysAdjustedFromStart
      );
    }

    const sorted = [...data.daysAdjustedData].sort((a, b) =>
      sortAscending
        ? a.daysAdjustedFromStart - b.daysAdjustedFromStart
        : b.daysAdjustedFromStart - a.daysAdjustedFromStart,
    );
    return sorted;
  }, [data?.daysAdjustedData, sortAscending, isAllProjects]);

  const sortedDurationData = useMemo(() => {
    if (!data?.issueDurationData) return [];
    // Backend returns one entry per unresolved issue in issueDurationData
    const sorted = [...data.issueDurationData].sort((a, b) =>
      sortDurationAscending
        ? (a.daysSinceIssue || 0) - (b.daysSinceIssue || 0)
        : (b.daysSinceIssue || 0) - (a.daysSinceIssue || 0),
    );
    return sorted;
  }, [data?.issueDurationData, sortDurationAscending]);

  const sortedProgressData = useMemo(() => {
    if (!progressData?.taskProgressData) return [];

    // If "All Projects" is selected, aggregate by project
    if (isAllProjects) {
      const projectMap = new Map<string, { totalProgress: number; count: number; projectName: string }>();

      progressData.taskProgressData.forEach((task) => {
        const projectId = task.projectId || "unknown";
        const projectName = task.projectName || "Unknown Project";

        if (!projectMap.has(projectId)) {
          projectMap.set(projectId, { totalProgress: 0, count: 0, projectName });
        }
        const entry = projectMap.get(projectId)!;
        entry.totalProgress += task.progress;
        entry.count += 1;
      });

      // Convert to array with average progress per project
      const aggregated: TaskProgressItem[] = Array.from(projectMap.entries()).map(([projectId, data]) => ({
        taskId: projectId,
        taskName: data.projectName,
        progress: Math.round(data.totalProgress / data.count),
        projectId,
        projectName: data.projectName,
      }));

      return aggregated.sort((a, b) =>
        sortProgressAscending ? a.progress - b.progress : b.progress - a.progress
      );
    }

    // Sort by start date (earliest to latest)
    const sorted = [...progressData.taskProgressData].sort((a, b) => {
      const dateA = a.startDate ? new Date(a.startDate).getTime() : 0;
      const dateB = b.startDate ? new Date(b.startDate).getTime() : 0;
      return dateA - dateB;
    });
    return sorted;
  }, [progressData?.taskProgressData, isAllProjects]);

  // Create milestone-to-color mapping for progress chart (or project-to-color when All Projects)
  const milestoneColorMap = useMemo(() => {
    if (!sortedProgressData.length) return new Map<string, string>();

    // When "All Projects" is selected, use project names for color mapping
    const uniqueKeys = isAllProjects
      ? [...new Set(sortedProgressData.map((d) => d.projectName || d.taskName || "Unknown"))]
      : [...new Set(sortedProgressData.map((d) => d.milestoneName || "Unknown"))];
    const colorMap = new Map<string, string>();

    uniqueKeys.forEach((key, index) => {
      colorMap.set(key, MILESTONE_COLORS[index % MILESTONE_COLORS.length]);
    });

    return colorMap;
  }, [sortedProgressData, isAllProjects]);

  // Helper function to get min-width for horizontal scroll on small/tablet devices only
  // On large screens (lg+), always return 100% so all items fit without scroll
  const getExpandedChartMinWidth = (dataLength: number, threshold = 15, pxPerBar = 60) => {
    // Calculate min-width based on data length for horizontal scroll on mobile/tablet
    if (dataLength > threshold) {
      return { xs: dataLength * pxPerBar, lg: "100%" };
    }
    return "100%";
  };

  // ============ Helper Functions ============


  // ============ ApexCharts Options ============

  // Days Adjusted Chart Options (distributed colors)
  const daysAdjustedChartOptions: ApexOptions = useMemo(
    () => ({
      chart: {
        type: "bar",
        toolbar: { show: false },
        fontFamily: "'Poppins', sans-serif",
        parentHeightOffset: 0,
        foreColor: isDark ? "#fff" : "#111827",
      },
      plotOptions: {
        bar: {
          columnWidth: "75%",
          borderRadius: 2,
          borderRadiusApplication: "end",
          distributed: true,
          dataLabels: { position: "top" },
        },
      },
      dataLabels: {
        enabled: true,
        offsetY: -20,
        style: {
          fontSize: fontSizes.compact.dataLabel,
          fontWeight: 600,
          colors: [isDark ? "#fff" : "#111827"],
        },
      },
      colors: sortedDaysAdjustedData.map((d) => (d.daysAdjustedFromStart < 0 ? "#10b981" : "#ef4444")),
      xaxis: {
        categories: sortedDaysAdjustedData.map((d) => d.taskName),
        labels: {
          rotate: -45,
          rotateAlways: true,
          style: {
            colors: textSecondaryColor,
            fontSize: fontSizes.compact.axisLabel,
          },
          formatter: (val: string) => (val && val.length > 12 ? `${val.substring(0, 12)}...` : val),
        },
        axisBorder: { show: false },
        axisTicks: { show: false },
      },
      yaxis: {
        title: {
          text: "Days",
          style: { color: textSecondaryColor },
        },
        labels: {
          style: { colors: textSecondaryColor },
        },
      },
      grid: {
        strokeDashArray: 3,
        borderColor: isDark ? "#374151" : "#e5e7eb",
        xaxis: { lines: { show: false } },
        yaxis: { lines: { show: true } },
        padding: {
          top: 0,
        },
      },
      tooltip: {
        theme: isDark ? "dark" : "light",
        x: {
          formatter: (_val: string | number, opts?: { dataPointIndex?: number }) =>
            sortedDaysAdjustedData[opts?.dataPointIndex ?? 0]?.taskName || String(_val),
        },
        y: {
          formatter: (val: number) => `${val} days`,
        },
      },
      legend: { show: false },
      states: {
        hover: {
          filter: { type: "lighten", value: 0.1 },
        },
      },
    }),
    [sortedDaysAdjustedData, isDark, fontSizes, textPrimaryColor, textSecondaryColor],
  );

  const daysAdjustedSeries = useMemo(
    () => [{ name: "Days Adjusted", data: sortedDaysAdjustedData.map((d) => d.daysAdjustedFromStart) }],
    [sortedDaysAdjustedData],
  );

  // Duration Chart Options (gradient fill - same as Task Progress)
  const durationChartOptions: ApexOptions = useMemo(
    () => ({
      chart: {
        type: "bar",
        toolbar: { show: false },
        fontFamily: "'Poppins', sans-serif",
        parentHeightOffset: 0,
        foreColor: isDark ? "#fff" : "#111827",
      },
      plotOptions: {
        bar: {
          columnWidth: "75%",
          borderRadius: 4,
          borderRadiusApplication: "end",
          dataLabels: { position: "top" },
        },
      },
      dataLabels: {
        enabled: true,
        offsetY: -20,
        style: {
          fontSize: fontSizes.compact.dataLabel,
          fontWeight: 600,
          colors: isDark ? ["#fff"] : ["#111827"],
        },
      },
      fill: {
        type: "gradient",
        gradient: {
          shade: isDark ? "dark" : "light",
          type: "vertical",
          shadeIntensity: 0.25,
          gradientToColors: [isDark ? GRADIENT_COLORS.dark.top : GRADIENT_COLORS.light.top],
          opacityFrom: 1,
          opacityTo: 1,
          stops: [0, 100],
        },
      },
      colors: [isDark ? GRADIENT_COLORS.dark.bottom : GRADIENT_COLORS.light.bottom],
      xaxis: {
        categories: sortedDurationData.map((d) => d.taskName),
        labels: {
          rotate: -45,
          rotateAlways: true,
          style: {
            colors: textSecondaryColor,
            fontSize: fontSizes.compact.axisLabel,
          },
          formatter: (val: string) => (val && val.length > 12 ? `${val.substring(0, 12)}...` : val),
        },
        axisBorder: { show: false },
        axisTicks: { show: false },
      },
      yaxis: {
        labels: {
          style: { colors: textSecondaryColor },
          formatter: (val: number) => `${Math.round(val)}`,
          offsetX: 0,
        },
        min: 0,
        max: Math.ceil(Math.max(20, ...sortedDurationData.map(d => d.daysSinceIssue || 0)) / 20) * 20,
        tickAmount: 4,
      },
      grid: {
        strokeDashArray: 3,
        borderColor: isDark ? "#374151" : "#e5e7eb",
        xaxis: { lines: { show: false } },
        yaxis: { lines: { show: true } },
        padding: {
          top: 0,
          left: 20,
        },
      },
      tooltip: {
        theme: isDark ? "dark" : "light",
        custom: ({
          series,
          seriesIndex,
          dataPointIndex,
        }: {
          series: number[][];
          seriesIndex: number;
          dataPointIndex: number;
        }) => {
          const item = sortedDurationData[dataPointIndex];
          const issueDate = item?.issueRaisedDate ? new Date(item.issueRaisedDate).toLocaleDateString() : "N/A";
          const today = new Date().toLocaleDateString();
          return `<div style="padding: 8px 12px; background: ${isDark ? "#1f2937" : "#fff"}; border: 1px solid ${
            isDark ? "#374151" : "#e5e7eb"
          }; border-radius: 4px;">
            <div style="font-weight: 600; color: ${textPrimaryColor};">${item?.taskName || ""}</div>
            <div style="font-size: 12px; color: ${textSecondaryColor}; margin-top: 4px;">Issue Raised: ${issueDate}</div>
            <div style="font-size: 12px; color: ${textSecondaryColor};">Current Day: ${today}</div>
            <div style="font-weight: 600; color: ${textPrimaryColor}; margin-top: 4px;">${series[seriesIndex][dataPointIndex]} days since issue</div>
          </div>`;
        },
      },
      legend: { show: false },
      states: {
        hover: {
          filter: { type: "lighten", value: 0.1 },
        },
      },
    }),
    [sortedDurationData, isDark, fontSizes, textSecondaryColor, textPrimaryColor],
  );

  const durationSeries = useMemo(
    () => [{ name: "Days Since Issue", data: sortedDurationData.map((d) => d.daysSinceIssue || 0) }],
    [sortedDurationData],
  );

  // Task Progress Chart Options (gradient fill)
  const progressChartOptions: ApexOptions = useMemo(
    () => ({
      chart: {
        type: "bar",
        toolbar: { show: false },
        fontFamily: "'Poppins', sans-serif",
        parentHeightOffset: 0,
        foreColor: isDark ? "#fff" : "#111827",
      },
      plotOptions: {
        bar: {
          columnWidth: "75%",
          borderRadius: 4,
          borderRadiusApplication: "end",
          dataLabels: { position: "top" },
        },
      },
      dataLabels: {
        enabled: true,
        formatter: (val: number) => `${val}%`,
        offsetY: -20,
        style: {
          fontSize: fontSizes.compact.dataLabel,
          fontWeight: 600,
          colors: isDark ? ["#fff"] : ["#111827"],
        },
      },
      fill: {
        type: "gradient",
        gradient: {
          shade: isDark ? "dark" : "light",
          type: "vertical",
          shadeIntensity: 0.25,
          gradientToColors: [isDark ? GRADIENT_COLORS.dark.top : GRADIENT_COLORS.light.top],
          opacityFrom: 1,
          opacityTo: 1,
          stops: [0, 100],
        },
      },
      colors: [isDark ? GRADIENT_COLORS.dark.bottom : GRADIENT_COLORS.light.bottom],
      xaxis: {
        categories: sortedProgressData.map((d) =>
          d.taskName && d.taskName.length > 10 ? `${d.taskName.substring(0, 10)}…` : d.taskName,
        ),
        labels: {
          rotate: -45,
          rotateAlways: true,
          style: {
            colors: sortedProgressData.map((d) => milestoneColorMap.get(d.milestoneName || "") || textPrimaryColor),
            fontSize: "9px",
          },
        },
        axisBorder: { show: false },
        axisTicks: { show: false },
        offsetX: 10,
      },
      yaxis: {
        max: 120,
        title: {
          text: "Progress",
          style: { color: textSecondaryColor },
        },
        labels: { show: false },
      },
      grid: {
        strokeDashArray: 3,
        borderColor: isDark ? "#374151" : "#e5e7eb",
        xaxis: { lines: { show: false } },
        yaxis: { lines: { show: true } },
        padding: {
          left: 20,
          top: 0,
        },
      },
      tooltip: {
        theme: isDark ? "dark" : "light",
        custom: ({
          series,
          seriesIndex,
          dataPointIndex,
        }: {
          series: number[][];
          seriesIndex: number;
          dataPointIndex: number;
        }) => {
          const item = sortedProgressData[dataPointIndex];
          const fullName = item?.taskName || "";
          const milestoneColor = milestoneColorMap.get(item?.milestoneName || "Unknown") || "#6b7280";
          return `<div style="padding: 8px 12px; background: ${isDark ? "#1f2937" : "#fff"}; border: 1px solid ${
            isDark ? "#374151" : "#e5e7eb"
          }; border-radius: 4px; white-space: nowrap;">
            <div style="font-weight: 600; color: ${textPrimaryColor};">${fullName}</div>
            ${
              item?.milestoneName
                ? `<div style="color: ${milestoneColor}; font-size: 12px;">${item.milestoneName}</div>`
                : ""
            }
            <div style="font-weight: 600; color: ${textPrimaryColor};">${series[seriesIndex][dataPointIndex]}%</div>
          </div>`;
        },
      },
      legend: { show: false },
      states: {
        hover: {
          filter: { type: "lighten", value: 0.1 },
        },
      },
    }),
    [sortedProgressData, milestoneColorMap, isDark, fontSizes, textPrimaryColor, textSecondaryColor],
  );

  const progressSeries = useMemo(
    () => [{ name: "Progress", data: sortedProgressData.map((d) => d.progress) }],
    [sortedProgressData],
  );

  // ============ Modal Chart Options (Expanded) ============

  const modalDaysAdjustedChartOptions: ApexOptions = useMemo(() => {
    const newOptions: ApexOptions = JSON.parse(JSON.stringify(daysAdjustedChartOptions));

    // Adjust column width based on data count for better readability in expanded view
    if (newOptions.plotOptions?.bar) {
      const dataCount = sortedDaysAdjustedData.length;
      newOptions.plotOptions.bar.columnWidth = dataCount > 20 ? "50%" : dataCount > 10 ? "60%" : "70%";
      newOptions.plotOptions.bar.borderRadius = 6;
    }

    if (newOptions.dataLabels) {
      newOptions.dataLabels.offsetY = -30;
      if (newOptions.dataLabels.style) {
        newOptions.dataLabels.style.fontSize = fontSizes.expanded.dataLabel;
        newOptions.dataLabels.style.colors = isDark ? ["#fff"] : ["#111827"];
      }
    }
    if (newOptions.xaxis?.labels?.style) {
      newOptions.xaxis.labels.style.fontSize = fontSizes.expanded.axisLabel;
    }
    // Restore colors array (green for negative, red for positive)
    newOptions.colors = sortedDaysAdjustedData.map((d) => (d.daysAdjustedFromStart < 0 ? "#10b981" : "#ef4444"));
    // Restore formatter
    if (newOptions.xaxis?.labels) {
      newOptions.xaxis.labels.formatter = (val: string) =>
        val && val.length > 20 ? `${val.substring(0, 20)}...` : val;
    }
    if (newOptions.grid?.padding) {
      newOptions.grid.padding.left = 50;
    }

    if (newOptions.xaxis?.labels) {
      newOptions.xaxis.labels.maxHeight = 180;
    }

    if (newOptions.tooltip) {
      newOptions.tooltip.y = { formatter: (val: number) => `${val} days` };
    }
    return newOptions;
  }, [daysAdjustedChartOptions, fontSizes, sortedDaysAdjustedData, isDark]);

  const modalDurationChartOptions: ApexOptions = useMemo(() => {
    const newOptions: ApexOptions = JSON.parse(JSON.stringify(durationChartOptions));

    // Adjust column width based on data count for better readability in expanded view
    if (newOptions.plotOptions?.bar) {
      const dataCount = sortedDurationData.length;
      newOptions.plotOptions.bar.columnWidth = dataCount > 20 ? "50%" : dataCount > 10 ? "60%" : "70%";
      newOptions.plotOptions.bar.borderRadius = 6;
    }

    if (newOptions.dataLabels) {
      newOptions.dataLabels.offsetY = -30;
      if (newOptions.dataLabels.style) {
        newOptions.dataLabels.style.fontSize = fontSizes.expanded.dataLabel;
        newOptions.dataLabels.style.colors = isDark ? ["#fff"] : ["#111827"];
      }
    }
    if (newOptions.xaxis?.labels?.style) {
      newOptions.xaxis.labels.style.fontSize = fontSizes.expanded.axisLabel;
    }
    // Restore formatter
    if (newOptions.xaxis?.labels) {
      newOptions.xaxis.labels.formatter = (val: string) =>
        val && val.length > 20 ? `${val.substring(0, 20)}...` : val;
    }

    if (newOptions.xaxis?.labels) {
      newOptions.xaxis.labels.maxHeight = 180;
    }

    if (newOptions.grid?.padding) {
      newOptions.grid.padding.left = 50;
    }
    // Restore yaxis formatter (lost during JSON serialization)
    if (newOptions.yaxis && !Array.isArray(newOptions.yaxis)) {
      newOptions.yaxis.labels = {
        ...newOptions.yaxis.labels,
        formatter: (val: number) => Math.round(val).toString(),
      };
    }
    // Restore custom tooltip (lost during JSON serialization)
    if (newOptions.tooltip) {
      newOptions.tooltip.custom = ({
        series,
        seriesIndex,
        dataPointIndex,
      }: {
        series: number[][];
        seriesIndex: number;
        dataPointIndex: number;
      }) => {
        const item = sortedDurationData[dataPointIndex];
        const issueDate = item?.issueRaisedDate ? new Date(item.issueRaisedDate).toLocaleDateString() : "N/A";
        const today = new Date().toLocaleDateString();
        return `<div style="padding: 8px 12px; background: ${isDark ? "#1f2937" : "#fff"}; border: 1px solid ${
          isDark ? "#374151" : "#e5e7eb"
        }; border-radius: 4px;">
          <div style="font-weight: 600; color: ${textPrimaryColor};">${item?.taskName || ""}</div>
          <div style="font-size: 12px; color: ${textSecondaryColor}; margin-top: 4px;">Issue Raised: ${issueDate}</div>
          <div style="font-size: 12px; color: ${textSecondaryColor};">Current Day: ${today}</div>
          <div style="font-weight: 600; color: ${textPrimaryColor}; margin-top: 4px;">${series[seriesIndex][dataPointIndex]} days since issue</div>
        </div>`;
      };
    }
    return newOptions;
  }, [durationChartOptions, fontSizes, sortedDurationData, isDark, textPrimaryColor, textSecondaryColor]);

  const modalProgressChartOptions: ApexOptions = useMemo(() => {
    const newOptions: ApexOptions = JSON.parse(JSON.stringify(progressChartOptions));

    // Adjust column width based on data count for better readability in expanded view
    if (newOptions.plotOptions?.bar) {
      const dataCount = sortedProgressData.length;
      newOptions.plotOptions.bar.columnWidth = dataCount > 20 ? "50%" : dataCount > 10 ? "60%" : "70%";
      newOptions.plotOptions.bar.borderRadius = 6;
    }

    if (newOptions.dataLabels) {
      newOptions.dataLabels.formatter = (val: number) => `${val}%`;
      newOptions.dataLabels.offsetY = -30;
      if (newOptions.dataLabels.style) {
        newOptions.dataLabels.style.fontSize = fontSizes.expanded.dataLabel;
        newOptions.dataLabels.style.colors = isDark ? ["#fff"] : ["#111827"];
      }
    }
    if (newOptions.xaxis?.labels?.style) {
      newOptions.xaxis.labels.style.fontSize = fontSizes.expanded.axisLabel;
    }
    // Increase left padding to prevent y-axis label from being cropped in modal
    if (newOptions.grid?.padding) {
      newOptions.grid.padding.left = 50;
    }
    // Allow ApexCharts to auto-size x-axis label area based on content
    if (newOptions.xaxis?.labels) {
      newOptions.xaxis.labels.maxHeight = 180;
    }
    // Update categories with expanded truncation limits
    if (newOptions.xaxis) {
      newOptions.xaxis.categories = sortedProgressData.map((d) =>
        d.taskName && d.taskName.length > 16 ? `${d.taskName.substring(0, 16)}…` : d.taskName,
      );
    }
    // Restore custom tooltip
    if (newOptions.tooltip) {
      newOptions.tooltip.custom = ({
        series,
        seriesIndex,
        dataPointIndex,
      }: {
        series: number[][];
        seriesIndex: number;
        dataPointIndex: number;
      }) => {
        const item = sortedProgressData[dataPointIndex];
        const fullName = item?.taskName || "";
        const milestoneColor = milestoneColorMap.get(item?.milestoneName || "Unknown") || "#6b7280";
        return `<div style="padding: 8px 12px; background: ${isDark ? "#1f2937" : "#fff"}; border: 1px solid ${
          isDark ? "#374151" : "#e5e7eb"
        }; border-radius: 4px; white-space: nowrap;">
          <div style="font-weight: 600; color: ${textPrimaryColor};">${fullName}</div>
          ${
            item?.milestoneName
              ? `<div style="color: ${milestoneColor}; font-size: 12px;">${item.milestoneName}</div>`
              : ""
          }
          <div style="font-weight: 600; color: ${textPrimaryColor};">${series[seriesIndex][dataPointIndex]}%</div>
        </div>`;
      };
    }
    return newOptions;
  }, [progressChartOptions, fontSizes, sortedProgressData, milestoneColorMap, isDark, textPrimaryColor]);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "60vh",
          gap: 2,
        }}
      >
        <CircularProgress size={48} />
        <Typography variant="body1" color="text.secondary">
          Loading task overview...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "60vh",
          gap: 2,
        }}
      >
        <Typography variant="h6" color="error">
          Error loading data
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {error}
        </Typography>
      </Box>
    );
  }

  // Get title for expanded chart
  const getExpandedChartTitle = () => {
    switch (expandedChart) {
      case "days-adjusted":
        return "Days Adjusted from Initial Start Date";
      case "duration":
        return "Issues Duration";
      case "task-progress":
        return "Task Progress";
      default:
        return "";
    }
  };

  // Render expanded chart content
  const renderExpandedChart = () => {
    switch (expandedChart) {
      case "days-adjusted":
        return sortedDaysAdjustedData.length === 0 ? (
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
            <Typography color="text.secondary">No adjusted tasks found</Typography>
          </Box>
        ) : (
          <Box sx={{ height: 500, overflowX: { xs: "auto", lg: "hidden" }, overflowY: "hidden" }}>
            <Box sx={{ minWidth: getExpandedChartMinWidth(sortedDaysAdjustedData.length), height: "100%" }}>
              <Chart
                options={modalDaysAdjustedChartOptions}
                series={daysAdjustedSeries}
                type="bar"
                height="100%"
                width="100%"
              />
            </Box>
          </Box>
        );

      case "duration":
        return sortedDurationData.length === 0 ? (
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
            <Typography color="text.secondary">No unresolved issues found</Typography>
          </Box>
        ) : (
          <Box sx={{ height: 500, overflowX: { xs: "auto", lg: "hidden" }, overflowY: "hidden" }}>
            <Box sx={{ minWidth: getExpandedChartMinWidth(sortedDurationData.length), height: "100%" }}>
              <Chart
                options={modalDurationChartOptions}
                series={durationSeries}
                type="bar"
                height="100%"
                width="100%"
              />
            </Box>
          </Box>
        );

      case "task-progress":
        return sortedProgressData.length === 0 ? (
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
            <Typography color="text.secondary">No tasks found</Typography>
          </Box>
        ) : (
          <Box sx={{ height: 500, overflowX: { xs: "auto", lg: "hidden" }, overflowY: "hidden" }}>
            <Box sx={{ minWidth: getExpandedChartMinWidth(sortedProgressData.length, 4, 50), height: "100%" }}>
              <Chart
                options={modalProgressChartOptions}
                series={progressSeries}
                type="bar"
                height="100%"
                width="100%"
              />
            </Box>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Box sx={{ py: 0 }}>
      <Grid container spacing={1}>
        {/* Project Status Chart */}
        {!isReport && (
          <Grid size={{ xs: 12, md: 2, lg: 3 }}>
            <GlassCard title="Project Status" minHeight={300}>
              <ProjectStatus data={overallProjectStatus} />
            </GlassCard>
          </Grid>
        )}

        {/* Chart 1: Days Adjusted from Initial Start Date */}
        <Grid size={{ xs: 12, md: isReport ? 6 : 5, lg: isReport ? 6 : 4.5 }}>
          <GlassCard minHeight={300}>
            <Box sx={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", p: 1 }}>
              {/* Header */}
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, fontSize: "1rem", filter: "blur(4px)", userSelect: "none" }}>
                  Days Adjusted from Initial Start Date
                </Typography>
                <Box sx={{ display: "flex", gap: 0.5 }}>
                  <IconButton onClick={() => setSortAscending(!sortAscending)} size="small">
                    <FilterListIcon fontSize="small" color="primary" />
                  </IconButton>
                  <Tooltip title="Not available in demo" arrow>
                    <span>
                      <IconButton size="small" onClick={() => toast("Expanded view is not available in this demo.", { icon: "🛈", duration: 3000 })} disabled>
                        <ZoomInIcon fontSize="small" color="disabled" />
                      </IconButton>
                    </span>
                  </Tooltip>
                </Box>
              </Box>

              {/* Chart Content */}
              {sortedDaysAdjustedData.length === 0 ? (
                <Box
                  sx={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography color="text.secondary">No adjusted tasks found</Typography>
                </Box>
              ) : (
                <Box sx={{ flex: 1, minHeight: 300, overflowX: { xs: "auto", lg: "hidden" }, overflowY: "hidden" }}>
                  <Box
                    sx={{ minWidth: getExpandedChartMinWidth(sortedDaysAdjustedData.length, 10, 50), height: "100%", '& .apexcharts-xaxis text': { filter: 'blur(4px)' } }}
                  >
                    <Chart
                      options={daysAdjustedChartOptions}
                      series={daysAdjustedSeries}
                      type="bar"
                      height="100%"
                      width="100%"
                    />
                  </Box>
                </Box>
              )}

              {/* Info */}
              <Box sx={{ mt: 1, textAlign: "center" }}>
                <Typography variant="caption" color="text.secondary">
                  Showing {sortedDaysAdjustedData.length} adjusted tasks
                </Typography>
              </Box>
            </Box>
          </GlassCard>
        </Grid>

        {/* Chart 2: Tasks with Issues - Days Since Raised */}
        <Grid size={{ xs: 12, md: isReport ? 6 : 5, lg: isReport ? 6 : 4.5 }}>
          <GlassCard minHeight={300}>
            <Box sx={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", p: 1 }}>
              {/* Header */}
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, fontSize: "1rem", filter: "blur(4px)", userSelect: "none" }}>
                  Issue Duration
                </Typography>
                <Box sx={{ display: "flex", gap: 0.5 }}>
                  <IconButton onClick={() => setSortDurationAscending(!sortDurationAscending)} size="small">
                    <FilterListIcon fontSize="small" color="primary" />
                  </IconButton>
                  <Tooltip title="Not available in demo" arrow>
                    <span>
                      <IconButton size="small" onClick={() => toast("Expanded view is not available in this demo.", { icon: "🛈", duration: 3000 })} disabled>
                        <ZoomInIcon fontSize="small" color="disabled" />
                      </IconButton>
                    </span>
                  </Tooltip>
                </Box>
              </Box>

              {/* Chart Content */}
              {sortedDurationData.length === 0 ? (
                <Box
                  sx={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography color="text.secondary">No issues found</Typography>
                </Box>
              ) : (
                <Box sx={{ flex: 1, minHeight: 300, overflowX: { xs: "auto", lg: "hidden" }, overflowY: "hidden" }}>
                  <Box sx={{ minWidth: getExpandedChartMinWidth(sortedDurationData.length, 10, 50), height: "100%", '& .apexcharts-xaxis text': { filter: 'blur(4px)' } }}>
                    <Chart
                      options={durationChartOptions}
                      series={durationSeries}
                      type="bar"
                      height="100%"
                      width="100%"
                    />
                  </Box>
                </Box>
              )}

              {/* Info */}
              <Box sx={{ mt: 1, textAlign: "center" }}>
                <Typography variant="caption" color="text.secondary">
                  Showing {sortedDurationData.length} unresolved issues
                </Typography>
              </Box>
            </Box>
          </GlassCard>
        </Grid>

        {/* Chart 3: Task Progress */}
        <Grid size={{ xs: 12 }}>
          <GlassCard minHeight={300}>
            <Box sx={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", p: 1 }}>
              {/* Header */}
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 0 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, fontSize: "1rem", filter: "blur(4px)", userSelect: "none" }}>
                  Task Progress
                </Typography>
                <Box sx={{ display: "flex", gap: 0.5 }}>
                  <IconButton onClick={() => setSortProgressAscending(!sortProgressAscending)} size="small">
                    <FilterListIcon fontSize="small" color="primary" />
                  </IconButton>
                  <Tooltip title="Not available in demo" arrow>
                    <span>
                      <IconButton size="small" onClick={() => toast("Expanded view is not available in this demo.", { icon: "🛈", duration: 3000 })} disabled>
                        <ZoomInIcon fontSize="small" color="disabled" />
                      </IconButton>
                    </span>
                  </Tooltip>
                </Box>
              </Box>

              {/* Chart Content */}
              {sortedProgressData.length === 0 ? (
                <Box
                  sx={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography color="text.secondary">No tasks found</Typography>
                </Box>
              ) : (
                <Box sx={{ flex: 1, minHeight: 300, overflowX: { xs: "auto", lg: "hidden" }, overflowY: "hidden" }}>
                  <Box sx={{ minWidth: getExpandedChartMinWidth(sortedProgressData.length, 4, 50), height: "100%", '& .apexcharts-xaxis text': { filter: 'blur(4px)' } }}>
                    <Chart
                      options={progressChartOptions}
                      series={progressSeries}
                      type="bar"
                      height="100%"
                      width="100%"
                    />
                  </Box>
                </Box>
              )}

              {/* Info */}
              <Box sx={{ mt: 1, textAlign: "center" }}>
                <Typography variant="caption" color="text.secondary">
                  Showing {sortedProgressData.length} tasks by progress
                </Typography>
              </Box>
            </Box>
          </GlassCard>
        </Grid>

      </Grid>

      {/* Expanded Chart Modal */}
      <Dialog
        open={expandedChart !== null}
        onClose={() => setExpandedChart(null)}
        maxWidth={expandedChart === "project-status" ? "xs" : "xl"}
        fullWidth={expandedChart !== "project-status"}
        slotProps={{
          paper: {
            sx: {
              minHeight: expandedChart === "project-status" ? "auto" : "auto",
              borderRadius: 2,
            },
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: 1,
            borderColor: "divider",
          }}
        >
          <Typography variant="h6" fontWeight={600}>
            {getExpandedChartTitle()}
          </Typography>
          <IconButton onClick={() => setExpandedChart(null)} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: 3, overflow: "visible" }}>{renderExpandedChart()}</DialogContent>
      </Dialog>
    </Box>
  );
};

export default TaskOverview;
