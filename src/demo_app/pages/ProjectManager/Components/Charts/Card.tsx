import { useEffect, useMemo, useState } from "react";
import { addBusinessDays, isValid, max, min, parseISO } from "date-fns";
import { Box, LinearProgress, Typography } from "@mui/material";
import getWorkdaysBetween from "../../../../utility/analyticsCalculations";
import { useTheme } from "../../../../hooks/useTheme";

interface Task {
  startDate: string | Date | null;
  endDate: string | Date | null;
  dateStarted: string | Date | null;
  dateEnded: string | Date | null;
}

interface LineNoteCardProps {
  data: {
    startDate?: string | Date | null;
    endDate?: string | Date | null;
    milestones: { tasks: Task[] }[];
  };
}

const LineNoteCard: React.FC<LineNoteCardProps> = ({ data }) => {
  const { isDark } = useTheme();
  const [daysRemaining, setDaysRemaining] = useState<number | null>(null);
  const [totalDays, setTotalDays] = useState<number | null>(null);
  const [isNotStarted, setIsNotStarted] = useState(false);
  const [isOverdue, setIsOverdue] = useState(false);

  const calculateDates = useMemo(() => {
    const taskStartDates: Date[] = [];
    const taskEndDates: Date[] = [];

    data?.milestones?.forEach((milestone) => {
      milestone?.tasks?.forEach((task) => {
        let start: Date | null = null;
        let end: Date | null = null;

        if (task.dateStarted) {
          start = typeof task.dateStarted === "string" ? parseISO(task.dateStarted) : task.dateStarted;

          if (task.dateEnded) {
            end = typeof task.dateEnded === "string" ? parseISO(task.dateEnded) : task.dateEnded;
          } else if (task.startDate && task.endDate) {
            const days = getWorkdaysBetween(task.startDate, task.endDate);
            end = addBusinessDays(start, days - 1);
          }
        } else if (task.startDate && task.endDate) {
          start = typeof task.startDate === "string" ? parseISO(task.startDate) : task.startDate;
          end = typeof task.endDate === "string" ? parseISO(task.endDate) : task.endDate;
        }

        if (start && isValid(start)) taskStartDates.push(start);
        if (end && isValid(end)) taskEndDates.push(end);
      });
    });

    const earliestStart = taskStartDates.length
      ? min(taskStartDates)
      : data?.startDate
      ? parseISO(data.startDate as string)
      : null;

    const latestEnd = taskEndDates.length ? max(taskEndDates) : data?.endDate ? parseISO(data.endDate as string) : null;

    return { startDate: earliestStart, endDate: latestEnd };
  }, [data]);

  // Compute days remaining and total days
  useEffect(() => {
    const today = new Date();
    const { startDate, endDate } = calculateDates;

    if (endDate && isValid(endDate) && startDate && isValid(startDate)) {
      const total = getWorkdaysBetween(startDate, endDate);
      setTotalDays(total > 0 ? total : null);

      if (startDate > today) {
        setIsNotStarted(true);
        setIsOverdue(false);
        setDaysRemaining(total);
      } else if (today > endDate) {
        setIsNotStarted(false);
        setIsOverdue(true);
        const overdueDays = getWorkdaysBetween(endDate, today);
        setDaysRemaining(overdueDays);
      } else {
        setIsNotStarted(false);
        setIsOverdue(false);
        const remaining = getWorkdaysBetween(today, endDate);
        setDaysRemaining(remaining);
      }
    } else {
      setDaysRemaining(null);
      setTotalDays(null);
      setIsNotStarted(false);
      setIsOverdue(false);
    }
  }, [data, calculateDates]);

  // Calculate percentage elapsed for gauge
  const percentageElapsed = useMemo(() => {
    if (totalDays === null || daysRemaining === null || totalDays === 0) return 0;
    if (isNotStarted) return 0;
    if (isOverdue) return 100;
    const elapsed = totalDays - daysRemaining;
    return Math.min(100, Math.max(0, Math.round((elapsed / totalDays) * 100)));
  }, [totalDays, daysRemaining, isNotStarted, isOverdue]);

  const barColor = isOverdue ? "#ef4444" : isNotStarted ? (isDark ? "#9ca3af" : "#6b7280") : "#22c55e";

  // No data available
  if (daysRemaining === null || totalDays === null) {
    return (
      <Box sx={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Typography variant="body2" color="text.secondary">No date data available</Typography>
      </Box>
    );
  }

  const displayValue = isOverdue ? `-${daysRemaining}` : `${daysRemaining}`;
  const statusLabel = isNotStarted ? "Not Started" : isOverdue ? "Overdue" : `of ${totalDays} days`;

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        gap: 1,
        px: 1,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "baseline", justifyContent: "center", gap: 0.75 }}>
        <Typography
          sx={{
            fontSize: "1.5rem",
            fontWeight: 700,
            lineHeight: 1,
            color: isOverdue ? "#ef4444" : isDark ? "#fff" : "#1f2937",
          }}
        >
          {displayValue}
        </Typography>
        <Typography
          sx={{
            fontSize: "0.75rem",
            fontWeight: 500,
            color: isDark ? "#9ca3af" : "#6b7280",
          }}
        >
          {statusLabel}
        </Typography>
      </Box>

      <LinearProgress
        variant="determinate"
        value={percentageElapsed}
        sx={{
          height: 8,
          borderRadius: 4,
          backgroundColor: isDark ? "#374151" : "#e5e7eb",
          "& .MuiLinearProgress-bar": {
            borderRadius: 4,
            backgroundColor: barColor,
          },
        }}
      />

      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography sx={{ fontSize: "0.625rem", color: isDark ? "#9ca3af" : "#6b7280" }}>
          {percentageElapsed}% elapsed
        </Typography>
        <Typography sx={{ fontSize: "0.625rem", color: isDark ? "#9ca3af" : "#6b7280" }}>
          {totalDays} total days
        </Typography>
      </Box>
    </Box>
  );
};

export default LineNoteCard;
