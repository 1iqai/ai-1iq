import React, { useEffect, useRef } from "react";
import { capitalCase } from "change-case";
import { gantt } from "dhtmlx-gantt";
import "dhtmlx-gantt/codebase/dhtmlxgantt.css";
import "./GanttChart.css";
import { format } from "date-fns";
import { Box } from "@mui/material";
import { calculateProgress } from "../../../../utility/analyticsCalculations";

interface GanttChartProps {
  tasks: any[];
  viewMode: "day" | "week" | "month";
  scrollToTodayTrigger?: number;
}

const GanttChart: React.FC<GanttChartProps> = ({ tasks, viewMode, scrollToTodayTrigger }) => {
  const ganttContainer = useRef<HTMLDivElement>(null);

  // Scroll to today when trigger changes
  useEffect(() => {
    if (scrollToTodayTrigger && scrollToTodayTrigger > 0) {
      // Small delay to ensure gantt is rendered
      setTimeout(() => {
        const today = new Date();
        gantt.showDate(today);
      }, 100);
    }
  }, [scrollToTodayTrigger]);

  useEffect(() => {
    let eventId: string | undefined;

    if (ganttContainer.current) {
      // Enable tooltip plugin
      gantt.plugins({ tooltip: true });

      gantt.config.date_format = "%Y-%m-%d";
      gantt.config.grid_header_height = 100;

      gantt.config.drag_move = false;
      gantt.config.drag_resize = false;
      gantt.config.drag_progress = false;
      gantt.config.show_progress = false;
      gantt.config.show_links = false;
      gantt.config.highlight = false;
      gantt.config.select_task = false;
      gantt.config.details_on_dblclick = false;
      gantt.config.sort = true;
      gantt.config.grid_resize = true;

      const dateToStr = gantt.date.date_to_str("%m/%d/%y");

      // Tooltip template - shows task name, start date, and end date
      gantt.templates.tooltip_text = function (start, end, task) {
        const endDateAdjusted = gantt.date.add(end, -1, "day");
        return `<b>${task.text || ""}</b>Start: ${dateToStr(start)}<br/>End: ${dateToStr(endDateAdjusted)}`;
      };

      // Detect dark mode from document class
      const isDark = document.documentElement.classList.contains("dark");

      // Theme-aware status chip colors (matching theme.tsx status palette)
      const getStatusChipStyles = (status: string) => {
        const statusLower = status.toLowerCase();
        if (statusLower.includes("complete") && !statusLower.includes("reject")) {
          return isDark
            ? "background-color: #166534; color: #dcfce7;" // dark: status.complete
            : "background-color: #dcfce7; color: #118D57;"; // light: status.complete
        }
        if (statusLower.includes("progress")) {
          return isDark
            ? "background-color: #1e40af; color: #dbeafe;" // dark: status.progress
            : "background-color: #dbeafe; color: #1e40af;"; // light: status.progress
        }
        if (statusLower.includes("reject")) {
          return isDark
            ? "background-color: #991b1b; color: #fee2e2;" // dark: status.rejected
            : "background-color: #fee2e2; color: #991b1b;"; // light: status.rejected
        }
        // Not Started
        return isDark
          ? "background-color: #374151; color: #f3f4f6;" // dark: status.notStarted
          : "background-color: #f3f4f6; color: #374151;"; // light: status.notStarted
      };

      gantt.config.columns = [
        {
          name: "status",
          label: "Health",
          width: 80,
          align: "center",
          sort: (a, b) => {
            const order = ["TaskComplete", "MarkedComplete", "InProgress", "NotStarted", "TaskRejected"];
            return order.indexOf(a.status) - order.indexOf(b.status);
          },
          template: (task: any) => {
            if (!task.status) return ""; // Do not render status for milestones
            const style = getStatusChipStyles(task.status);
            let statusText;
            const statusLower = task.status.toLowerCase();
            if (statusLower.includes("complete")) {
              statusText = "Completed";
            } else if (statusLower.includes("reject")) {
              statusText = "Issue";
            } else {
              statusText = capitalCase(task.status);
            }
            return `<span style="display: inline-block; padding: 0 4px; border-radius: 3px; font-size: 11px; line-height: 1.2; ${style}">${statusText}</span>`;
          },
        },
        { name: "milestoneName", label: "Milestone", width: 120, tree: false, sort: true },
        { name: "text", label: "Task", width: 180, tree: false, sort: true },
        {
          name: "dependency",
          label: "Dependent",
          width: 150,
          align: "left",
          sort: (a, b) => {
            const aHas = a.dependentTasks?.length > 0 ? 1 : 0;
            const bHas = b.dependentTasks?.length > 0 ? 1 : 0;
            return aHas - bHas;
          },
          template: (task: any) => {
            if (task.dependentTaskNames && task.dependentTaskNames.length > 0) {
              const names = task.dependentTaskNames.join(", ");
              return `<span style="font-size: 11px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; display: block;" title="${names}">${names}</span>`;
            }
            return "";
          },
        },
        {
          name: "start_date",
          label: "Start",
          width: 100,
          align: "center",
          sort: true,
          template: (task) => `<div class="gantt-date-cell">${dateToStr(task.start_date)}</div>`,
        },
        {
          name: "end_date",
          label: "End",
          width: 80,
          align: "center",
          sort: true,
          template: (task) => {
            if (!task.end_date) return "";
            const endDate = gantt.date.add(task.end_date, -1, "day");
            return `<div class="gantt-date-cell">${dateToStr(endDate)}</div>`;
          },
        },
        {
          name: "duration",
          label: '<div class="gantt-duration-header">Duration<br/>(days)</div>',
          width: 60,
          align: "center",
          sort: true,
        },
      ];

      gantt.templates.grid_header_class = (columnName) => {
        let baseClass = "gantt-grid-header-word-wrap";
        if (columnName !== "duration") {
          return `${baseClass} gantt-header-modified`;
        }
        return baseClass;
      };
      gantt.templates.task_text = () => "";

      gantt.init(ganttContainer.current);

      // Create a map of task IDs to names for dependency lookup
      const taskNameMap = new Map(tasks.map((t) => [t.id, t.name]));

      const formattedTasks = tasks.map((t) => {
        // Get dependent task names
        const dependentTaskNames = (t.dependentTasks || [])
          .map((depId: string) => taskNameMap.get(depId))
          .filter(Boolean);

        // Check if task has unresolved issues
        const hasIssues = (t.issues && t.issues.length > 0) || (t.issueCount && t.issueCount > 0);

        return {
          id: t.id,
          text: t.name,
          start_date: t.startDate ? format(t.startDate, "yyyy-MM-dd") : "",
          duration: t.duration,
          milestoneName: t.milestoneName,
          status: t.status,
          progress: calculateProgress(t.startDate, t.endDate) / 100,
          dependentTasks: t.dependentTasks,
          dependentTaskNames,
          hasIssues,
        };
      });

      const tasksWithColors = {
        data: formattedTasks.map((task: any) => {
          let color = "";
          // If task has issues, show it in red regardless of status
          if (task.hasIssues) {
            color = "#ef4444"; // Red for tasks with issues
          } else {
            switch (task.status) {
              case "TaskComplete":
              case "MarkedComplete":
                color = "#4ade80"; // TaskComplete
                break;
              case "InProgress":
                color = "#3b82f6"; // InProgress
                break;
              case "TaskRejected":
                color = "#ef4444"; // TaskRejected
                break;
              case "NotStarted":
              default:
                color = "#d1d5db"; // NotStarted
                break;
            }
          }
          return { ...task, color };
        }),
      };
      gantt.parse({ data: tasksWithColors.data });
      gantt.sort("start_date", false); // Sort by start date ascending (earliest to latest)

      // Scroll to today on initial load
      setTimeout(() => gantt.showDate(new Date()), 50);

      // Add today marker line after render
      const renderTodayMarker = () => {
        const taskArea = gantt.$task_data;
        if (!taskArea) return;

        // Remove existing marker if any
        const existingMarker = taskArea.querySelector(".gantt_today_marker");
        if (existingMarker) existingMarker.remove();

        const today = new Date();
        const todayPos = gantt.posFromDate(today);
        const areaHeight = taskArea.scrollHeight;

        const el = document.createElement("div");
        el.className = "gantt_today_marker";
        el.style.left = todayPos + "px";
        el.style.height = areaHeight + "px";

        taskArea.appendChild(el);
      };

      eventId = gantt.attachEvent("onGanttRender", renderTodayMarker);
      renderTodayMarker();

      const zoomConfig = {
        levels: [
          {
            name: "day",
            scale_height: 80,
            min_column_width: 20,
            scales: [{ unit: "day", step: 1, format: "%m/%d/%y", css: () => "gantt_scale_day_vertical" } as any],
          },
          {
            name: "week",
            scale_height: 80,
            min_column_width: 20,
            scales: [
              {
                unit: "week",
                step: 1,
                format: "%m/%d/%y",
                css: () => "gantt_scale_day_vertical",
              } as any,
            ],
          },
          {
            name: "month",
            scale_height: 120,
            min_column_width: 30,
            scales: [{ unit: "month", step: 1, format: "%M %Y", css: () => "gantt_scale_day_vertical" } as any],
          },
        ],
      };
      gantt.ext.zoom.init(zoomConfig as any);
      gantt.ext.zoom.setLevel(viewMode);
    }

    return () => {
      if (eventId) {
        gantt.detachEvent(eventId);
      }
      gantt.clearAll();
    };
  }, [tasks, viewMode]);

  return (
    <>
      <Box
        ref={ganttContainer}
        style={{ width: "100%", height: "100%" }}
      ></Box>
    </>
  );
};

export default GanttChart;
