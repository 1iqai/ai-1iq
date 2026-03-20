import { useRef, useState, useEffect, useCallback } from "react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import OneiQCore from "../CommandCenter/1iQCore";
import {
  Box,
  Button,
  Paper,
  Typography,
  CircularProgress,
  FormControlLabel,
  Checkbox,
  FormGroup,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
} from "@mui/material";

import DOMPurify from "dompurify";
import { useTheme } from "../../../../hooks/useTheme";
import OneiQGantt from "../CommandCenter/1iQGantt";
import ProjectTaskDetails from "../CommandCenter/ProjectTaskDetails";
import TaskOverview from "../CommandCenter/TaskOverview";
import { formatDate } from "../../../../utility/dateCalculations";
import { usePM } from "../../../../contexts/PMContext";

// Logo is loaded from public folder at runtime
const logoSrc = "/1iQ.webp";

type DashboardSection = "core" | "intel" | "gantt" | "taskDetails" | "taskOverview" | "summary";

type ReportingProps = {
  overallProjectStatus: any;
  selectedProject: any;
  selectedMilestone: string | null;
  selectedTeam: string | null;
  selectedTask: string | null;
  selectProject: (projectId: string) => void;
  teamData: any;
  milestoneData: any;
  organizationData: any;
  budgetData1: any;
  taskStatusOverview: any;
  statusByStartDate: any;
  statusByEndDate: any;
  taskPriorityOverview: any;
  issueData: any;
  projectList: any[];
  availableMilestones: any[];
  chartLoading?: boolean;
  taskDetailRefreshKey?: number;
};

type TaskStatusType = "Not Started" | "In Progress" | "Pending" | "Finished" | "Rejected";

interface TaskDetail {
  id: string;
  projectName: string;
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
  issueCount: number;
  priority: "Low" | "Medium" | "High" | "Critical" | null;
}

const DASHBOARD_OPTIONS: { key: DashboardSection; label: string }[] = [
  { key: "core", label: "Core" },
  { key: "intel", label: "Intel" },
  { key: "gantt", label: "Gantt" },
  { key: "taskOverview", label: "Field" },
  { key: "summary", label: "Project Summary" },
];

// Status colors - all with white text for PDF export
const STATUS_COLORS: Record<TaskStatusType, { bg: string; text: string }> = {
  "Not Started": { bg: "#6b7280", text: "#ffffff" },
  "In Progress": { bg: "#4fa2b5", text: "#ffffff" },
  "Pending": { bg: "#66bb6a", text: "#ffffff" },
  "Finished": { bg: "#2e7d32", text: "#ffffff" },
  "Rejected": { bg: "#e07a62", text: "#ffffff" },
};

// Priority colors
const PRIORITY_COLORS: Record<string, { bg: string; text: string }> = {
  "Critical": { bg: "#dc2626", text: "#ffffff" },
  "High": { bg: "#ea580c", text: "#ffffff" },
  "Medium": { bg: "#2563eb", text: "#ffffff" },
  "Low": { bg: "#16a34a", text: "#ffffff" },
};

// Date status colors
const DATE_STATUS_COLORS: Record<number, { bg: string; text: string; label: string }> = {
  1: { bg: "#6b9b4e", text: "#ffffff", label: "Early" },
  0: { bg: "#3d8a9c", text: "#ffffff", label: "On Time" },
  [-1]: { bg: "#c75a42", text: "#ffffff", label: "Delayed" },
};



// Format currency for PDF
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

// Printable Task Table Component - matches DataGrid UI exactly
const PrintableTaskTable = ({
  tasks,
  isDark,
}: {
  tasks: TaskDetail[];
  isDark: boolean;
}) => {
  return (
    <TableContainer
      component={Paper}
      sx={{
        bgcolor: isDark ? "#1e293b" : "#ffffff",
        borderRadius: 2,
        border: 1,
        borderColor: isDark ? "#334155" : "#e2e8f0",
      }}
    >
      <Table size="small" sx={{ width: 1050, tableLayout: "fixed" }}>
        <TableHead>
          <TableRow
            sx={{
              bgcolor: isDark ? "#0f172a" : "#f1f5f9",
              "& th": {
                fontWeight: 600,
                fontSize: "8px",
                color: isDark ? "#e2e8f0" : "#334155",
                borderBottom: `2px solid ${isDark ? "#334155" : "#cbd5e1"}`,
                py: 0.5,
                px: 0.5,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              },
            }}
          >
            <TableCell sx={{ width: 65 }}>Milestone</TableCell>
            <TableCell sx={{ width: 80 }}>Task</TableCell>
            {/* <TableCell sx={{ width: 60 }}>Team</TableCell> */}
            <TableCell sx={{ width: 50 }} align="center">Progress</TableCell>
            <TableCell sx={{ width: 30 }} align="center">Issues</TableCell>
            <TableCell sx={{ width: 55 }}>Start</TableCell>
            <TableCell sx={{ width: 55 }}>End</TableCell>
            <TableCell sx={{ width: 55 }} align="center">Status</TableCell>
            <TableCell sx={{ width: 50 }} align="center">Priority</TableCell>
            <TableCell sx={{ width: 50 }} align="center">Start St.</TableCell>
            <TableCell sx={{ width: 50 }} align="center">End St.</TableCell>
            <TableCell sx={{ width: 45 }} align="center">+/- Days</TableCell>
            <TableCell sx={{ width: 60 }} align="right">Budget</TableCell>
            <TableCell sx={{ width: 60 }} align="right">Chg Order</TableCell>
            <TableCell sx={{ width: 60 }} align="right">New Budget</TableCell>
            <TableCell sx={{ width: 60 }} align="right">Utilized</TableCell>
            <TableCell sx={{ width: 65 }} align="right">Remaining</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tasks.map((task, index) => {
            const budgetUtilized = Math.round(((task.progress / 100) * task.newBudget + Number.EPSILON) * 100) / 100;
            const budgetRemaining = Math.round((task.newBudget - budgetUtilized + Number.EPSILON) * 100) / 100;

            return (
              <TableRow
                key={task.id || index}
                sx={{
                  bgcolor: index % 2 === 0
                    ? (isDark ? "#1e293b" : "#ffffff")
                    : (isDark ? "#0f172a" : "#f8fafc"),
                  "& td": {
                    fontSize: "8px",
                    color: isDark ? "#e2e8f0" : "#334155",
                    borderBottom: `1px solid ${isDark ? "#334155" : "#e2e8f0"}`,
                    py: 0.5,
                    px: 0.5,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    verticalAlign: "top",
                  },
                }}
              >
                {/* Milestone */}
                <TableCell sx={{ width: 65, maxWidth: 65 }}>
                  {task.milestone || "-"}
                </TableCell>
                {/* Task */}
                <TableCell sx={{ width: 80, maxWidth: 80, fontWeight: 500 }}>
                  {task.taskName || "-"}
                </TableCell>
                {/* Team - hidden
                <TableCell sx={{ width: 60, maxWidth: 60 }}>
                  {task.teamResponsible || "-"}
                </TableCell> */}
                {/* Progress */}
                <TableCell sx={{ width: 50 }} align="center">
                  <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0.25 }}>
                    <LinearProgress
                      variant="determinate"
                      value={Math.min(task.progress || 0, 100)}
                      sx={{
                        width: "100%",
                        height: 5,
                        borderRadius: 2,
                        bgcolor: isDark ? "#334155" : "#e2e8f0",
                        "& .MuiLinearProgress-bar": {
                          bgcolor: task.progress >= 100 ? "#22c55e" : task.progress >= 50 ? "#3b82f6" : "#f59e0b",
                          borderRadius: 2,
                        },
                      }}
                    />
                    <Typography sx={{ fontSize: "7px", fontWeight: 500 }}>
                      {Math.round(task.progress || 0)}%
                    </Typography>
                  </Box>
                </TableCell>
                {/* Issues */}
                <TableCell sx={{ width: 30 }} align="center">
                  {task.issueCount > 0 ? (
                    <Box sx={{ color: "#ef4444", fontSize: "10px" }}>⚑</Box>
                  ) : (
                    <Typography sx={{ color: "#94a3b8", fontSize: "8px" }}>-</Typography>
                  )}
                </TableCell>
                {/* Start Date */}
                <TableCell sx={{ width: 55, whiteSpace: "nowrap" }}>
                  {task.startDate ? formatDate(task.startDate) : "-"}
                </TableCell>
                {/* End Date */}
                <TableCell sx={{ width: 55, whiteSpace: "nowrap" }}>
                  {task.endDate ? formatDate(task.endDate) : "-"}
                </TableCell>
                {/* Status */}
                <TableCell
                  sx={{
                    width: 55,
                    textAlign: "center",
                    bgcolor: STATUS_COLORS[task.taskStatus]?.bg || "#6b7280",
                    color: STATUS_COLORS[task.taskStatus]?.text || "#ffffff",
                    fontWeight: 600,
                    fontSize: "8px",
                  }}
                >
                  {task.taskStatus}
                </TableCell>
                {/* Priority */}
                <TableCell
                  sx={{
                    width: 50,
                    textAlign: "center",
                    bgcolor: task.priority ? (PRIORITY_COLORS[task.priority]?.bg || "#6b7280") : "transparent",
                    color: task.priority ? (PRIORITY_COLORS[task.priority]?.text || "#ffffff") : "#94a3b8",
                    fontWeight: 600,
                    fontSize: "8px",
                  }}
                >
                  {task.priority || "-"}
                </TableCell>
                {/* Start Status */}
                <TableCell
                  sx={{
                    width: 50,
                    textAlign: "center",
                    bgcolor: task.taskStartStatus !== null && task.taskStartStatus !== undefined
                      ? (DATE_STATUS_COLORS[task.taskStartStatus]?.bg || "#6b7280")
                      : "transparent",
                    color: task.taskStartStatus !== null && task.taskStartStatus !== undefined
                      ? (DATE_STATUS_COLORS[task.taskStartStatus]?.text || "#ffffff")
                      : "#94a3b8",
                    fontWeight: 600,
                    fontSize: "8px",
                  }}
                >
                  {task.taskStartStatus !== null && task.taskStartStatus !== undefined
                    ? (DATE_STATUS_COLORS[task.taskStartStatus]?.label || "")
                    : "-"}
                </TableCell>
                {/* End Status */}
                <TableCell
                  sx={{
                    width: 50,
                    textAlign: "center",
                    bgcolor: (task.taskEndStatus !== null && task.taskEndStatus !== undefined && task.taskStatus !== "In Progress")
                      ? (DATE_STATUS_COLORS[task.taskEndStatus]?.bg || "#6b7280")
                      : "transparent",
                    color: (task.taskEndStatus !== null && task.taskEndStatus !== undefined && task.taskStatus !== "In Progress")
                      ? (DATE_STATUS_COLORS[task.taskEndStatus]?.text || "#ffffff")
                      : "#94a3b8",
                    fontWeight: 600,
                    fontSize: "8px",
                  }}
                >
                  {(task.taskEndStatus !== null && task.taskEndStatus !== undefined && task.taskStatus !== "In Progress")
                    ? (DATE_STATUS_COLORS[task.taskEndStatus]?.label || "")
                    : "-"}
                </TableCell>
                {/* +/- Days */}
                <TableCell sx={{ width: 45 }} align="center">
                  <Typography
                    sx={{
                      fontSize: "8px",
                      fontWeight: 600,
                      color: (task.daysAdjusted || 0) < 0
                        ? "#22c55e"
                        : (task.daysAdjusted || 0) > 0
                          ? "#ef4444"
                          : (isDark ? "#94a3b8" : "#64748b"),
                    }}
                  >
                    {(task.daysAdjusted || 0) > 0 ? `+${task.daysAdjusted}` : task.daysAdjusted || 0}
                  </Typography>
                </TableCell>
                {/* Budget */}
                <TableCell sx={{ width: 60 }} align="right">
                  {formatCurrency(task.originalBudget || 0)}
                </TableCell>
                {/* Change Order */}
                <TableCell sx={{ width: 60 }} align="right">
                  {formatCurrency(task.changeOrderToDate || 0)}
                </TableCell>
                {/* New Budget */}
                <TableCell sx={{ width: 60 }} align="right">
                  {formatCurrency(task.newBudget || 0)}
                </TableCell>
                {/* Budget Utilized */}
                <TableCell sx={{ width: 60 }} align="right">
                  {formatCurrency(budgetUtilized)}
                </TableCell>
                {/* Budget Remaining */}
                <TableCell sx={{ width: 65 }} align="right">
                  {formatCurrency(budgetRemaining)}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

const Reporting: React.FC<ReportingProps> = (props) => {
  const { projectTasks } = usePM();
  const coreRef = useRef<HTMLDivElement | null>(null);
  const ganttRef = useRef<HTMLDivElement | null>(null);
  const taskOverviewRef = useRef<HTMLDivElement | null>(null);
  const summaryRef = useRef<HTMLDivElement | null>(null);
  const printableTableRef = useRef<HTMLDivElement | null>(null);

  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState("");
  const [ganttTaskCount, setGanttTaskCount] = useState(0);
  const [taskData, setTaskData] = useState<TaskDetail[]>([]);

  // Dashboard section visibility
  const [visibleSections, setVisibleSections] = useState<Record<DashboardSection, boolean>>({
    core: true,
    intel: true,
    gantt: true,
    taskDetails: true,
    taskOverview: true,
    summary: true,
  });

  const { isDark } = useTheme();

  // Calculate dynamic Gantt height
  const ganttHeight = Math.max(300, 160 + ganttTaskCount * 36);

  const handleSectionToggle = (section: DashboardSection) => {
    setVisibleSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  // Build task data for PDF export from local PMContext state
  useEffect(() => {
    if (!props.selectedProject?.id) return;

    const statusMap: Record<string, TaskStatusType> = {
      NotStarted: "Not Started",
      InProgress: "In Progress",
      MarkedComplete: "Pending",
      TaskComplete: "Finished",
      TaskRejected: "Rejected",
    };

    let rawTasks: any[] = [];
    if (props.selectedProject.id === "all") {
      rawTasks = Object.values(projectTasks).flat();
    } else {
      rawTasks = projectTasks[props.selectedProject.id] ?? [];
    }

    if (props.selectedMilestone && props.selectedMilestone !== "all") {
      rawTasks = rawTasks.filter((t: any) => t.milestoneId === props.selectedMilestone);
    }
    if (props.selectedTeam && props.selectedTeam !== "all") {
      rawTasks = rawTasks.filter((t: any) => t.teamId === props.selectedTeam || t.teamResponsibleId === props.selectedTeam);
    }

    const mappedTasks = rawTasks.map((task: any) => ({
      ...task,
      taskStatus: statusMap[task.taskStatus || task.status] || "Not Started",
      taskName: task.name,
      milestone: task.milestoneName || "",
      originalBudget: task.taskBudget || 0,
      changeOrderToDate: task.changeOrder || 0,
      newBudget: (task.taskBudget || 0) + (task.changeOrder || 0),
    }));
    setTaskData(mappedTasks);
  }, [props.selectedProject?.id, props.selectedMilestone, props.selectedTeam, props.taskDetailRefreshKey, projectTasks]);

  // Helper to yield to main thread
  const yieldToMain = (): Promise<void> => {
    return new Promise((resolve) => setTimeout(resolve, 0));
  };

  // Capture element to canvas for charts
  const captureElementToCanvas = useCallback(
    async (element: HTMLElement): Promise<HTMLCanvasElement> => {
      const isPrintableTaskTable =
        element.getAttribute("data-export-root") === "printable-task-table";

      if (document.fonts?.ready) {
        try {
          await document.fonts.ready;
        } catch {
          // ignore
        }
      }
      const canvas = await html2canvas(element, {
        scale: 1.5,
        useCORS: true,
        backgroundColor: isDark ? "#0f172a" : "#ffffff",
        logging: false,
        allowTaint: true,
        scrollX: 0,
        scrollY: 0,
        onclone: (clonedDoc: Document) => {
          // Fix printable task table positioning
          if (isPrintableTaskTable) {
            const exportRoot = clonedDoc.querySelector(
              '[data-export-root="printable-task-table"]'
            ) as HTMLElement | null;

            if (exportRoot) {
              exportRoot.style.position = "fixed";
              exportRoot.style.left = "0";
              exportRoot.style.top = "0";
              exportRoot.style.visibility = "visible";
              exportRoot.style.opacity = "1";
              exportRoot.style.display = "block";
            }
          }

          // Hide zoom/magnifying icons in PDF export
          const zoomIcons = clonedDoc.querySelectorAll('[data-testid="ZoomInIcon"]');
          zoomIcons.forEach((icon) => {
            // Hide the icon's parent button and its container
            let parent = icon.parentElement;
            while (parent && parent !== clonedDoc.body) {
              if (parent.classList?.contains("MuiIconButton-root")) {
                (parent as HTMLElement).style.display = "none";
                // Also hide the wrapper Box if it exists
                const wrapper = parent.parentElement as HTMLElement;
                if (wrapper) {
                  wrapper.style.display = "none";
                }
                break;
              }
              parent = parent.parentElement;
            }
          });

          // Replace Gantt toolbar with simple HTML for PDF export
          // Find the Gantt toolbar (Paper element with the filter legend)
          const ganttToolbars = clonedDoc.querySelectorAll(".MuiPaper-root");
          ganttToolbars.forEach((paper) => {
            const htmlPaper = paper as HTMLElement;
            // Check if this is the Gantt filter toolbar by looking for filter-related content
            const hasToggleButtons = paper.querySelector(".MuiToggleButtonGroup-root");
            const hasFilterText = paper.textContent?.includes("Filter:");

            if (hasToggleButtons && hasFilterText) {
              // Replace the entire toolbar content with simple HTML
              const bgColor = isDark ? "#1e293b" : "#f8fafc";
              const mutedColor = isDark ? "#94a3b8" : "#64748b";
              const borderColor = isDark ? "#334155" : "#e2e8f0";

              htmlPaper.innerHTML = `
                <div style="display: flex; align-items: center; padding: 8px 16px; background: ${bgColor}; border-radius: 8px; border: 1px solid ${borderColor}; width: 100%; box-sizing: border-box;">
                  <span style="font-size: 12px; color: ${mutedColor}; font-weight: 500; margin-right: 16px;">Filter:</span>
                  <span style="font-size: 12px; color: #9ca3af; font-weight: 600; margin-right: 16px;">Not Started</span>
                  <span style="font-size: 12px; color: #3b82f6; font-weight: 600; margin-right: 16px;">In Progress</span>
                  <span style="font-size: 12px; color: #10b981; font-weight: 600; margin-right: 16px;">Completed</span>
                  <span style="font-size: 12px; color: #ef4444; font-weight: 600;">Issue</span>
                  <div style="display: inline-block; margin-left: auto;">
                    <span style="font-size: 12px; color: ${mutedColor}; font-weight: 500; padding: 4px 12px; border: 1px solid ${borderColor}; border-radius: 4px 0 0 4px; display: inline-block;">Day</span><span style="font-size: 12px; color: ${mutedColor}; font-weight: 500; padding: 4px 12px; border-top: 1px solid ${borderColor}; border-bottom: 1px solid ${borderColor}; display: inline-block;">Week</span><span style="font-size: 12px; color: #ffffff; font-weight: 500; padding: 4px 12px; background: #1976d2; border-radius: 0 4px 4px 0; display: inline-block;">Month</span>
                  </div>
                </div>
              `;
              htmlPaper.style.width = "100%";
              htmlPaper.style.display = "block";
              htmlPaper.style.padding = "0";
              htmlPaper.style.border = "none";
              htmlPaper.style.background = "transparent";
            }
          });

          // Find all ApexCharts and ensure they fit within their containers
          const apexCanvases = clonedDoc.querySelectorAll(".apexcharts-canvas");
          apexCanvases.forEach((canvas) => {
            const htmlCanvas = canvas as HTMLElement;
            const svg = canvas.querySelector("svg") as SVGElement;

            // Check chart type
            const isBarChart = svg?.querySelector(".apexcharts-bar-area, .apexcharts-bar-series");
            const isRadialChart = svg?.querySelector(".apexcharts-radialbar, .apexcharts-radialbar-track");
            const isDonutChart = svg?.querySelector(".apexcharts-pie");

            // Find the GlassCard or container parent
            let containerParent = htmlCanvas.parentElement;
            while (containerParent && !containerParent.className?.includes("GlassCard") && !containerParent.className?.includes("MuiPaper")) {
              containerParent = containerParent.parentElement;
            }

            if (isBarChart) {
              // Bar chart (Project Budget) - scale to fit within container
              htmlCanvas.style.transform = "scale(0.65)";
              htmlCanvas.style.transformOrigin = "top center";
              htmlCanvas.style.marginTop = "35px";
            } else if (isRadialChart) {
              // Radial chart (Project Status) - scale to fit within container
              htmlCanvas.style.transform = "scale(0.60)";
              htmlCanvas.style.transformOrigin = "top center";
              htmlCanvas.style.marginTop = "35px";
            } else if (isDonutChart) {
              // Donut/pie charts (Task Status, Task Priority, etc.) - scale to fit within container
              htmlCanvas.style.transform = "scale(0.55)";
              htmlCanvas.style.transformOrigin = "top center";
              htmlCanvas.style.marginTop = "35px";
            } else {
              // Other charts
              htmlCanvas.style.marginTop = "30px";
            }
          });


          // Set overflow visible on all containers to prevent title clipping
          const allContainers = clonedDoc.querySelectorAll('.MuiPaper-root, [class*="MuiBox-root"]');
          allContainers.forEach((el) => {
            (el as HTMLElement).style.overflow = "visible";
          });

          // Fix GlassCard titles for PDF export - ensure they're visible
          const glassCardTitles = clonedDoc.querySelectorAll(".glass-card-title");
          glassCardTitles.forEach((title) => {
            const htmlTitle = title as HTMLElement;
            htmlTitle.style.fontSize = "9px";
            htmlTitle.style.fontWeight = "600";
            htmlTitle.style.textAlign = "center";
            htmlTitle.style.marginBottom = "10px";
            htmlTitle.style.paddingTop = "5px";
            htmlTitle.style.paddingBottom = "5px";
            htmlTitle.style.display = "block";
            htmlTitle.style.width = "100%";
            htmlTitle.style.minHeight = "18px";
            htmlTitle.style.position = "relative";
            htmlTitle.style.zIndex = "999";
            htmlTitle.style.backgroundColor = "inherit";

            // Add padding to the parent container
            const parent = htmlTitle.parentElement as HTMLElement;
            if (parent) {
              parent.style.paddingTop = "10px";
              parent.style.overflow = "visible";
            }
          });

          // Add top margin to ApexCharts to prevent overlap with titles
          const apexCanvasParents = clonedDoc.querySelectorAll(".apexcharts-canvas");
          apexCanvasParents.forEach((canvas) => {
            const htmlCanvas = canvas as HTMLElement;
            // Ensure all charts have margin from title
            if (!htmlCanvas.style.marginTop) {
              htmlCanvas.style.marginTop = "30px";
            }
            // Also add padding to the parent element
            const parent = htmlCanvas.parentElement as HTMLElement;
            if (parent) {
              parent.style.paddingTop = "15px";
            }
          });

          // Fix progress bar text (Team Progress, Milestone Progress) for PDF export
          const progressTexts = clonedDoc.querySelectorAll(".MuiTypography-body2, .MuiTypography-caption");
          progressTexts.forEach((text) => {
            const htmlText = text as HTMLElement;
            htmlText.style.overflow = "visible";
            htmlText.style.whiteSpace = "nowrap";
            htmlText.style.fontSize = "7px";
          });

          // Fix Stack containers for progress bars
          const stacks = clonedDoc.querySelectorAll(".MuiStack-root");
          stacks.forEach((stack) => {
            const htmlStack = stack as HTMLElement;
            htmlStack.style.overflow = "visible";
            htmlStack.style.gap = "8px";
          });

          // Fix LinearProgress bars
          const linearProgress = clonedDoc.querySelectorAll(".MuiLinearProgress-root");
          linearProgress.forEach((bar) => {
            const htmlBar = bar as HTMLElement;
            htmlBar.style.height = "6px";
          });

          // Fix ApexCharts legends for PDF export
          const apexLegends = clonedDoc.querySelectorAll(".apexcharts-legend");
          apexLegends.forEach((legend) => {
            const htmlLegend = legend as HTMLElement;
            htmlLegend.style.fontSize = "7px";
          });

          // Hide legend markers (colored dots) and color the text instead
          const legendMarkers = clonedDoc.querySelectorAll(".apexcharts-legend-marker");
          legendMarkers.forEach((marker) => {
            const htmlMarker = marker as HTMLElement;
            // Get the marker's background color before hiding
            const markerColor = htmlMarker.style.backgroundColor || window.getComputedStyle(htmlMarker).backgroundColor;
            // Hide the marker
            htmlMarker.style.display = "none";
            // Find the sibling text element and color it
            const legendText = htmlMarker.nextElementSibling as HTMLElement;
            if (legendText && markerColor) {
              legendText.style.color = markerColor;
              legendText.style.fontWeight = "600";
            }
          });

          // Also handle legend series elements
          const legendSeries = clonedDoc.querySelectorAll(".apexcharts-legend-series");
          legendSeries.forEach((series) => {
            const marker = series.querySelector(".apexcharts-legend-marker") as HTMLElement;
            const text = series.querySelector(".apexcharts-legend-text") as HTMLElement;
            if (marker && text) {
              const markerColor = marker.style.backgroundColor || window.getComputedStyle(marker).backgroundColor;
              if (markerColor) {
                text.style.color = markerColor;
                text.style.fontWeight = "600";
              }
              marker.style.display = "none";
            }
          });

        },
      } as any);
      return canvas;
    },
    [isDark]
  );

  const handleExport = async () => {
    alert("Demo product does not have this function. (Export)");
    return;
    setExporting(true);
    setExportProgress("Preparing export...");
    await yieldToMain();

    try {
      // PDF in landscape orientation with compression
      const pdf = new jsPDF({ orientation: "l", unit: "mm", format: "a4", compress: true });
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      // Margins
      const marginTop = 20;
      const marginBottom = 15;
      const marginX = 5;

      // Load logo
      let logoDataUrl: string | null = null;
      try {
        const logoImg = new Image();
        logoImg.crossOrigin = "anonymous";
        await new Promise<void>((resolve, reject) => {
          logoImg.onload = () => resolve();
          logoImg.onerror = reject;
          logoImg.src = logoSrc;
        });
        const logoCanvas = document.createElement("canvas");
        logoCanvas.width = logoImg.width;
        logoCanvas.height = logoImg.height;
        const ctx = logoCanvas.getContext("2d");
        if (ctx) {
          ctx!.drawImage(logoImg, 0, 0);
          logoDataUrl = logoCanvas.toDataURL("image/png");
        }
      } catch {
        console.warn("Could not load logo for PDF header");
      }

      // Helper to add header
      const addHeader = () => {
        // Logo
        if (logoDataUrl) {
          pdf.addImage(logoDataUrl, "PNG", marginX, 5, 20, 10);
        }

        // Title
        pdf.setFontSize(14);
        pdf.setTextColor(isDark ? 255 : 30, isDark ? 255 : 41, isDark ? 255 : 59);
        const projectName = props.selectedProject?.name || "Project Report";
        pdf.text(projectName, pdfWidth / 2, 12, { align: "center" });

        // Date
        const dateStr = new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
        pdf.setFontSize(9);
        pdf.text(dateStr, pdfWidth - marginX, 12, { align: "right" });

        // Line under header
        pdf.setDrawColor(200, 200, 200);
        pdf.line(marginX, 17, pdfWidth - marginX, 17);
      };

      // Helper to add footer
      const addFooter = (pageNum: number, totalPages: number) => {
        pdf.setFontSize(8);
        pdf.setTextColor(128, 128, 128);
        pdf.text(`Page ${pageNum} of ${totalPages}`, pdfWidth / 2, pdfHeight - 5, { align: "center" });
        pdf.text("Generated by 1iQ.Ai", marginX, pdfHeight - 5);
      };

      let currentY = marginTop;
      let pageCount = 1;

      // Add first page header
      addHeader();

      // ============ CORE SECTION (Charts) ============
      if (visibleSections.core && coreRef.current) {
        setExportProgress("Capturing Core Dashboard...");
        await yieldToMain();

        try {
          const canvas = await captureElementToCanvas(coreRef.current!);
          const imgData = canvas.toDataURL("image/jpeg", 0.9);

          // Calculate available space on current page
          const availableHeight = pdfHeight - currentY - marginBottom;
          const maxWidth = pdfWidth - marginX * 2;

          // Calculate image dimensions maintaining aspect ratio
          let imgWidth = maxWidth;
          let imgHeight = (canvas.height * imgWidth) / canvas.width;

          // Scale down to fit on available page space if needed
          if (imgHeight > availableHeight) {
            const scale = availableHeight / imgHeight;
            imgHeight = availableHeight;
            imgWidth = imgWidth * scale;
          }

          // Center the image if it's narrower than the page
          const xOffset = marginX + (maxWidth - imgWidth) / 2;

          pdf.addImage(imgData, "JPEG", xOffset, currentY, imgWidth, imgHeight);
          currentY += imgHeight + 5;
        } catch (err) {
          console.error("Error capturing core section:", err);
        }
      }

      // ============ INTEL SECTION (Task Table) ============
      if (visibleSections.intel && taskData.length > 0 && printableTableRef.current) {
        setExportProgress("Capturing Task Details Table...");
        await yieldToMain();

        try {
          // Capture the printable table with html2canvas
          const canvas = await captureElementToCanvas(printableTableRef.current!);
          const imgWidth = pdfWidth - marginX * 2;
          const imgHeight = (canvas.height * imgWidth) / canvas.width;

          // Calculate how many pages we need for the table
          const safetyPadMm = 2;
          // Approximate row height in canvas pixels at scale 1.5 (base ~20px * 1.5 = ~30px)
          const rowHeightPx = 30;
          // Header row is slightly taller
          const headerHeightPx = 36;
          let remainingCanvasHeight = canvas.height;
          let sourceYPx = 0;

          // Minimum height needed to start the section (title + some content)
          const minStartHeight = 30;
          let isFirstSlice = true;

          while (remainingCanvasHeight > 0) {
            // For first slice, only add new page if we can't fit minimum content
            // For subsequent slices, always add a new page
            if (!isFirstSlice) {
              pdf.addPage();
              pageCount++;
              addHeader();
              currentY = marginTop;
            } else if (currentY + minStartHeight > pdfHeight - marginBottom) {
              // First slice: only add page if we can't fit minimum content
              pdf.addPage();
              pageCount++;
              addHeader();
              currentY = marginTop;
            }

            // Add section title only on the first page of the table
            if (isFirstSlice) {
              pdf.setFontSize(12);
              pdf.setTextColor(isDark ? 255 : 30, isDark ? 255 : 41, isDark ? 255 : 59);
              pdf.text("Task Details (Intel)", marginX, currentY);
              currentY += 7;
            }

            const availableHeightMm = pdfHeight - currentY - marginBottom - safetyPadMm;
            // Convert available mm to pixels
            let availableHeightPx = Math.round((availableHeightMm / imgHeight) * canvas.height);

            // Round down to nearest row boundary to avoid cutting through rows
            // Account for header on first slice
            if (isFirstSlice) {
              // First slice includes header, so subtract header then round to rows
              const contentHeightPx = availableHeightPx - headerHeightPx;
              const wholeRows = Math.floor(contentHeightPx / rowHeightPx);
              availableHeightPx = headerHeightPx + (wholeRows * rowHeightPx);
            } else {
              // Subsequent slices - just round to row boundaries
              const wholeRows = Math.floor(availableHeightPx / rowHeightPx);
              availableHeightPx = wholeRows * rowHeightPx;
            }

            // Take the minimum of available space and remaining content
            const sliceHeightPx = Math.min(remainingCanvasHeight, availableHeightPx);

            // If this is the last slice, just take whatever remains
            const finalSliceHeightPx = remainingCanvasHeight <= availableHeightPx
              ? remainingCanvasHeight
              : sliceHeightPx;

            // Convert to mm for PDF
            const sliceHeightMm = (finalSliceHeightPx / canvas.height) * imgHeight;

            // Create a temporary canvas for this slice
            const sliceCanvas = document.createElement("canvas");
            sliceCanvas.width = canvas.width;
            sliceCanvas.height = finalSliceHeightPx;
            const sliceCtx = sliceCanvas.getContext("2d");
            if (sliceCtx) {
              sliceCtx!.drawImage(
                canvas,
                0, sourceYPx, canvas.width, finalSliceHeightPx,
                0, 0, canvas.width, finalSliceHeightPx
              );
              const sliceImgData = sliceCanvas.toDataURL("image/jpeg", 0.85);
              pdf.addImage(sliceImgData, "JPEG", marginX, currentY, imgWidth, sliceHeightMm);
            }

            sourceYPx += finalSliceHeightPx;
            remainingCanvasHeight -= finalSliceHeightPx;
            currentY += sliceHeightMm + 3;
            isFirstSlice = false;
          }

          currentY += 5;
        } catch (err) {
          console.error("Error capturing task table:", err);
        }
      }

      // ============ GANTT SECTION ============
      if (visibleSections.gantt && ganttRef.current) {
        setExportProgress("Capturing Gantt Chart...");
        await yieldToMain();

        try {
          const canvas = await captureElementToCanvas(ganttRef.current!);
          const imgWidth = pdfWidth - marginX * 2;
          const imgHeight = (canvas.height * imgWidth) / canvas.width;

          // Calculate how many pages we need for the Gantt chart
          const safetyPadMm = 2;
          // Gantt row height is 36px at normal scale, so at scale 1.5 = ~54px
          const rowHeightPx = 54;
          // Header area is approximately 160px at normal scale * 1.5 = ~240px
          const headerHeightPx = 240;
          let remainingCanvasHeight = canvas.height;
          let sourceYPx = 0;

          // Minimum height needed to start the section (title + some content)
          const minStartHeight = 30;
          let isFirstSlice = true;

          while (remainingCanvasHeight > 0) {
            // For first slice, only add new page if we can't fit minimum content
            // For subsequent slices, always add a new page
            if (!isFirstSlice) {
              pdf.addPage();
              pageCount++;
              addHeader();
              currentY = marginTop;
            } else if (currentY + minStartHeight > pdfHeight - marginBottom) {
              // First slice: only add page if we can't fit minimum content
              pdf.addPage();
              pageCount++;
              addHeader();
              currentY = marginTop;
            }

            // Add section title only on the first page of the Gantt
            if (isFirstSlice) {
              pdf.setFontSize(12);
              pdf.setTextColor(isDark ? 255 : 30, isDark ? 255 : 41, isDark ? 255 : 59);
              pdf.text("Gantt Chart", marginX, currentY);
              currentY += 7;
            }

            const availableHeightMm = pdfHeight - currentY - marginBottom - safetyPadMm;
            // Convert available mm to pixels
            let availableHeightPx = Math.round((availableHeightMm / imgHeight) * canvas.height);

            // Round down to nearest row boundary to avoid cutting through rows
            if (isFirstSlice) {
              // First slice includes header
              const contentHeightPx = availableHeightPx - headerHeightPx;
              const wholeRows = Math.floor(contentHeightPx / rowHeightPx);
              availableHeightPx = headerHeightPx + (wholeRows * rowHeightPx);
            } else {
              const wholeRows = Math.floor(availableHeightPx / rowHeightPx);
              availableHeightPx = wholeRows * rowHeightPx;
            }

            // Take the minimum of available space and remaining content
            const sliceHeightPx = Math.min(remainingCanvasHeight, availableHeightPx);

            // If this is the last slice, just take whatever remains
            const finalSliceHeightPx = remainingCanvasHeight <= availableHeightPx
              ? remainingCanvasHeight
              : sliceHeightPx;

            // Convert to mm for PDF
            const sliceHeightMm = (finalSliceHeightPx / canvas.height) * imgHeight;

            // Create a temporary canvas for this slice
            const sliceCanvas = document.createElement("canvas");
            sliceCanvas.width = canvas.width;
            sliceCanvas.height = finalSliceHeightPx;
            const sliceCtx = sliceCanvas.getContext("2d");
            if (sliceCtx) {
              sliceCtx!.drawImage(
                canvas,
                0, sourceYPx, canvas.width, finalSliceHeightPx,
                0, 0, canvas.width, finalSliceHeightPx
              );
              const sliceImgData = sliceCanvas.toDataURL("image/jpeg", 0.85);
              pdf.addImage(sliceImgData, "JPEG", marginX, currentY, imgWidth, sliceHeightMm);
            }

            sourceYPx += finalSliceHeightPx;
            remainingCanvasHeight -= finalSliceHeightPx;
            currentY += sliceHeightMm + 3;
            isFirstSlice = false;
          }

          currentY += 5;
        } catch (err) {
          console.error("Error capturing gantt section:", err);
        }
      }

      // ============ TASK OVERVIEW SECTION ============
      if (visibleSections.taskOverview && taskOverviewRef.current) {
        setExportProgress("Capturing Task Overview...");
        await yieldToMain();

        try {
          if (currentY + 50 > pdfHeight - marginBottom) {
            pdf.addPage();
            pageCount++;
            addHeader();
            currentY = marginTop;
          }

          pdf.setFontSize(12);
          pdf.setTextColor(isDark ? 255 : 30, isDark ? 255 : 41, isDark ? 255 : 59);
          pdf.text("Task Overview", marginX, currentY);
          currentY += 7;

          const canvas = await captureElementToCanvas(taskOverviewRef.current!);
          const imgData = canvas.toDataURL("image/jpeg", 0.9);
          const maxWidth = pdfWidth - marginX * 2;
          const imgHeight = (canvas.height * maxWidth) / canvas.width;

          const maxImgHeight = pdfHeight - currentY - marginBottom;
          const finalHeight = Math.min(imgHeight, maxImgHeight);
          const finalWidth = (finalHeight / imgHeight) * maxWidth;

          // Center the image horizontally
          const xOffset = marginX + (maxWidth - finalWidth) / 2;
          pdf.addImage(imgData, "JPEG", xOffset, currentY, finalWidth, finalHeight);
          currentY += finalHeight + 10;
        } catch (err) {
          console.error("Error capturing task overview section:", err);
        }
      }

      // ============ SUMMARY SECTION ============
      if (visibleSections.summary && aiSummary && summaryRef.current) {
        setExportProgress("Capturing Project Summary...");
        await yieldToMain();

        try {
          const canvas = await captureElementToCanvas(summaryRef.current!);
          const imgWidth = pdfWidth - marginX * 2;
          const imgHeight = (canvas.height * imgWidth) / canvas.width;

          // Calculate how many pages we need for the summary
          const safetyPadMm = 2;
          // Approximate line height in canvas pixels at scale 1.5 (text lines ~20px * 1.5 = ~30px)
          const lineHeightPx = 30;
          let remainingCanvasHeight = canvas.height;
          let sourceYPx = 0;

          // Minimum height needed to start the section
          const minStartHeight = 30;
          let isFirstSlice = true;

          while (remainingCanvasHeight > 0) {
            if (!isFirstSlice) {
              pdf.addPage();
              pageCount++;
              addHeader();
              currentY = marginTop;
            } else if (currentY + minStartHeight > pdfHeight - marginBottom) {
              pdf.addPage();
              pageCount++;
              addHeader();
              currentY = marginTop;
            }

            const availableHeightMm = pdfHeight - currentY - marginBottom - safetyPadMm;
            // Convert available mm to pixels
            let availableHeightPx = Math.round((availableHeightMm / imgHeight) * canvas.height);

            // Round down to nearest line boundary to avoid cutting through text
            const wholeLines = Math.floor(availableHeightPx / lineHeightPx);
            availableHeightPx = wholeLines * lineHeightPx;

            // Take the minimum of available space and remaining content
            const sliceHeightPx = Math.min(remainingCanvasHeight, availableHeightPx);

            // If this is the last slice, just take whatever remains
            const finalSliceHeightPx = remainingCanvasHeight <= availableHeightPx
              ? remainingCanvasHeight
              : sliceHeightPx;

            // Convert to mm for PDF
            const sliceHeightMm = (finalSliceHeightPx / canvas.height) * imgHeight;

            // Create a temporary canvas for this slice
            const sliceCanvas = document.createElement("canvas");
            sliceCanvas.width = canvas.width;
            sliceCanvas.height = finalSliceHeightPx;
            const sliceCtx = sliceCanvas.getContext("2d");
            if (sliceCtx) {
              sliceCtx!.drawImage(
                canvas,
                0, sourceYPx, canvas.width, finalSliceHeightPx,
                0, 0, canvas.width, finalSliceHeightPx
              );
              const sliceImgData = sliceCanvas.toDataURL("image/jpeg", 0.85);
              pdf.addImage(sliceImgData, "JPEG", marginX, currentY, imgWidth, sliceHeightMm);
            }

            sourceYPx += finalSliceHeightPx;
            remainingCanvasHeight -= finalSliceHeightPx;
            currentY += sliceHeightMm + 3;
            isFirstSlice = false;
          }
        } catch (err) {
          console.error("Error capturing summary section:", err);
        }
      }

      // Add footers to all pages
      const totalPages = pdf.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i);
        addFooter(i, totalPages);
      }

      setExportProgress("Saving PDF...");
      await yieldToMain();
      pdf.save(`1iQ-Report-${props.selectedProject?.name || "Project"}-${new Date().toISOString().split("T")[0]}.pdf`);
    } catch (err) {
      console.error("Failed to export 1iQ report", err);
    } finally {
      setExporting(false);
      setExportProgress("");
    }
  };

  // Automatically fetch summary when the selected project changes
  useEffect(() => {
    if (!props.selectedProject) {
      setAiSummary(null);
      setGenerating(false);
      return;
    }

    const fetchSummary = async () => {
      setGenerating(true);
      setAiSummary("Demo product does not have this function. (AI)");
      setGenerating(false);
      return;
      try {
        const params = new URLSearchParams();
        const token = localStorage.getItem("token");
        if (props.selectedProject && props.selectedProject.id && props.selectedProject.id !== "all") {
          params.append("projectId", props.selectedProject.id);
        }
        if (props.selectedMilestone) {
          params.append("milestoneId", props.selectedMilestone || "");
        }
        if (props.selectedTeam) {
          params.append("teamId", props.selectedTeam || "");
        }
        if (props.selectedTask) {
          params.append("taskId", props.selectedTask || "");
        }
        params.append(
          "prompt",
          "Generate a concise, professional project summary. Do not use any emojis. Structure the response with these HTML sections: <h3>Executive Overview</h3> (2-3 sentences on project health), <h3>Status</h3> (current progress and key metrics), <h3>Team Performance</h3> (team utilization and productivity), <h3>Milestones</h3> (upcoming and completed milestones), <h3>Budget</h3> (budget status if available), <h3>Risks & Issues</h3> (any blockers or concerns). Use <ul><li> for bullet points within each section. Keep content concise and actionable. If multiple projects, separate each with <hr> and include the project name as <h2>."
        );

        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/dashboard/getSummary?${params.toString()}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
        });

        if (!res.ok) throw new Error("Failed to generate summary");
        const data = await res.json();
        const content = data?.data?.data ?? data?.data ?? data?.summary ?? data?.reply ?? "";
        setAiSummary(String(content));
      } catch (err) {
        console.error("Error generating summary", err);
        setAiSummary("Failed to generate summary. Check console for details.");
      } finally {
        setGenerating(false);
      }
    };

    void fetchSummary();
  }, [props.selectedProject, props.selectedMilestone, props.selectedTeam, props.selectedTask]);

  return (
    <Box
      sx={{
        height: "100%",
        overflow: "auto",
      }}
      className={isDark ? "scrollbar-custom" : "scrollbar-custom-dark"}
    >
      {/* If 'all' projects are selected, prompt the user to pick a single project */}
      {!props.selectedProject ? (
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: 256 }}>
          <Paper
            elevation={3}
            sx={{
              textAlign: "center",
              p: 3,
              borderRadius: 1,
              bgcolor: "background.paper",
            }}
          >
            <Typography variant="body1" fontWeight={500} color="text.primary">
              Please select a project to export its summary
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Select a single project from the side panel to view and export its project report.
            </Typography>
          </Paper>
        </Box>
      ) : (
        <>
          {/* Controls Bar */}
          <Paper
            elevation={0}
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              alignItems: { xs: "stretch", md: "center" },
              justifyContent: "space-between",
              gap: 2,
              p: 2,
              mb: 2,
              borderRadius: 2,
              border: 1,
              borderColor: "divider",
              backgroundColor: "background.paper",
            }}
          >
            {/* Dashboard Section Filters */}
            <Box>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                Include in Report:
              </Typography>
              <FormGroup row sx={{ gap: 1 }}>
                {DASHBOARD_OPTIONS.map((option) => (
                  <FormControlLabel
                    key={option.key}
                    control={
                      <Checkbox
                        checked={visibleSections[option.key]}
                        onChange={() => handleSectionToggle(option.key)}
                        size="small"
                      />
                    }
                    label={option.label}
                    sx={{
                      "& .MuiFormControlLabel-label": {
                        fontSize: "0.875rem",
                      },
                    }}
                  />
                ))}
              </FormGroup>
            </Box>

            {/* Export Button */}
            <Button
              variant="contained"
              color="primary"
              onClick={handleExport}
              disabled={exporting || generating}
              aria-busy={exporting}
              startIcon={exporting ? <CircularProgress size={16} color="inherit" /> : undefined}
              sx={{ minWidth: 150, alignSelf: { xs: "stretch", md: "center" } }}
            >
              {exporting ? exportProgress || "Exporting..." : "Export Report"}
            </Button>
          </Paper>

          {/* Filter Info Banner */}
          {(props.selectedMilestone || props.selectedTeam || props.selectedTask) && (
            <Paper
              sx={{
                p: 1.5,
                mb: 2,
                borderRadius: 1,
                bgcolor: "info.main",
                color: "info.contrastText",
              }}
            >
              <Typography variant="body2">
                Filtered by:{" "}
                {[
                  props.selectedMilestone && `Milestone`,
                  props.selectedTeam && `Team`,
                  props.selectedTask && `Task`,
                ]
                  .filter(Boolean)
                  .join(", ")}
              </Typography>
            </Paper>
          )}

          {/* Hidden Printable Table for PDF Export - rendered off-screen */}
          {taskData.length > 0 && (
            <Box
              ref={printableTableRef}
              data-export-root="printable-task-table"
              sx={{
                position: "absolute",
                left: "-9999px",
                top: 0,
                width: 1080,
                bgcolor: isDark ? "#0f172a" : "#ffffff",
                p: 1,
              }}
            >
              <PrintableTaskTable tasks={taskData} isDark={isDark} />
            </Box>
          )}

          {/* Core Dashboard */}
          {visibleSections.core && (
            <Box ref={coreRef} sx={{ mt: 1 }}>
              <OneiQCore
                overallProjectStatus={props.overallProjectStatus}
                selectedProject={props.selectedProject}
                teamData={props.teamData}
                milestoneData={props.milestoneData}
                organizationData={props.organizationData}
                budgetData1={props.budgetData1}
                taskStatusOverview={props.taskStatusOverview}
                statusByStartDate={props.statusByStartDate}
                statusByEndDate={props.statusByEndDate}
                issueData={props.issueData}
                taskPriorityOverview={props.taskPriorityOverview || []}
                chartLoading={props.chartLoading}
                isReport
              />
            </Box>
          )}

          {/* Intel (Task Details) */}
          {visibleSections.intel && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" fontWeight={600} color="text.primary" sx={{ mb: 1 }}>
                Task Details (Intel)
              </Typography>
              <ProjectTaskDetails
                selectedProject={props.selectedProject}
                selectedMilestone={props.selectedMilestone}
                selectedTeam={props.selectedTeam}
                overallProjectStatus={props.overallProjectStatus}
                taskStatusOverview={props.taskStatusOverview}
                statusByStartDate={props.statusByStartDate}
                statusByEndDate={props.statusByEndDate}
                isReport
              />
            </Box>
          )}

          {/* Gantt Chart */}
          {visibleSections.gantt && (
            <Box ref={ganttRef} sx={{ mt: 2, height: ganttHeight }}>
              <Typography variant="h6" fontWeight={600} color="text.primary" sx={{ mb: 1 }}>
                Gantt Chart
              </Typography>
              <OneiQGantt
                selectedProject={props.selectedProject}
                selectedMilestone={props.selectedMilestone}
                selectedTeam={props.selectedTeam}
                selectedTask={props.selectedTask}
                overallProjectStatus={props.overallProjectStatus}
                taskStatusOverview={props.taskStatusOverview}
                statusByStartDate={props.statusByStartDate}
                statusByEndDate={props.statusByEndDate}
                isReport
                onTaskCountChange={setGanttTaskCount}
              />
            </Box>
          )}

          {/* Task Overview */}
          {visibleSections.taskOverview && (
            <Box ref={taskOverviewRef} sx={{ mt: 2 }}>
              <Typography variant="h6" fontWeight={600} color="text.primary" sx={{ mb: 1 }}>
                Task Overview
              </Typography>
              <TaskOverview isReport />
            </Box>
          )}

          {/* Project summary section */}
          {visibleSections.summary && (
            <Paper
              ref={summaryRef}
              elevation={3}
              sx={{
                mt: 3,
                p: 2,
                borderRadius: 1,
                border: 1,
                borderColor: "divider",
                bgcolor: "background.paper",
              }}
            >
              <Typography variant="h6" fontWeight={600} color="text.primary" sx={{ mb: 1 }}>
                Project Summary
              </Typography>

              {/* AI generated summary (HTML or text) */}
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" fontWeight={500} color="text.primary">
                  AI Generated Summary
                </Typography>
                <Box
                  sx={{
                    mt: 1,
                    p: 1.5,
                    bgcolor: "background.default",
                    borderRadius: 1,
                    minHeight: 120,
                  }}
                >
                  {generating ? (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, justifyContent: "center" }}>
                      <CircularProgress size={24} color="primary" />
                      <Typography variant="body2" color="text.secondary">
                        Generating summary...
                      </Typography>
                    </Box>
                  ) : aiSummary ? (
                    <Box
                      className="prose prose-sm dark:prose-invert"
                      sx={{ fontSize: "0.875rem" }}
                      dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(aiSummary) }}
                    />
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No summary available for the selected project.
                    </Typography>
                  )}
                </Box>
              </Box>
            </Paper>
          )}
        </>
      )}
    </Box>
  );
};

export default Reporting;
