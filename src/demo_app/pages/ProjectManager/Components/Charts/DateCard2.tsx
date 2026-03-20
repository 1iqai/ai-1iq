import { useEffect, useState } from "react";
import { parseISO, isValid, format, min, max } from "date-fns";
import { motion } from "framer-motion";
import { Box, Typography } from "@mui/material";
import GlassCard from "../../../../components/shared/GlassCard";

interface Task {
  startDate: string | Date | null; // planned
  endDate: string | Date | null; // planned
  dateStarted: string | Date | null; // actual
  dateEnded: string | Date | null; // actual
}

interface DateCard2Props {
  data: {
    startDate?: string | Date | null;
    endDate?: string | Date | null;
    milestones: { tasks: Task[] }[];
  };
  compact?: boolean;
}

const DateCard2: React.FC<DateCard2Props> = ({ data, compact = false }) => {
  const [startDate, setStartDate] = useState("-");
  const [endDate, setEndDate] = useState("-");
  useEffect(() => {
    const fmt = (raw?: string | Date | null) => {
      if (!raw) return "-";
      const d = typeof raw === "string" ? parseISO(raw) : raw;
      return isValid(d) ? format(d, "dd MMM yyyy") : "-";
    };

    const toDateSafe = (raw: string | Date | null | undefined): Date | null => {
      if (!raw) return null;
      const d = typeof raw === "string" ? parseISO(raw) : raw;
      return isValid(d) ? d : null;
    };

    const taskStartDates: Date[] = [];
    const taskEndDates: Date[] = [];

    data?.milestones?.forEach((milestone) => {
      milestone?.tasks?.forEach((task) => {
        // For start: prefer actual dateStarted, fall back to planned startDate
        const start = toDateSafe(task.dateStarted) || toDateSafe(task.startDate);
        if (start) taskStartDates.push(start);

        // For end: use actual dateEnded if task is completed, otherwise use planned/rescheduled endDate
        const actualEnd = toDateSafe(task.dateEnded);
        const plannedEnd = toDateSafe(task.endDate);
        if (actualEnd) {
          taskEndDates.push(actualEnd);
        } else if (plannedEnd) {
          taskEndDates.push(plannedEnd);
        }
      });
    });

    const earliestStart = taskStartDates.length
      ? min(taskStartDates)
      : data?.startDate
      ? parseISO(data.startDate as string)
      : null;

    const latestEnd = taskEndDates.length ? max(taskEndDates) : data?.endDate ? parseISO(data.endDate as string) : null;

    setStartDate(fmt(earliestStart));
    setEndDate(fmt(latestEnd));
  }, [data]);

  const cards = [
    { label: "Current Project Start Date", value: startDate },
    { label: "Current Project End Date", value: endDate },
  ];

  if (compact) {
    return (
      <Box sx={{ display: "flex", flexDirection: "row", gap: 0.5 }}>
        {cards.map((item, idx) => (
          <Box
            key={idx}
            sx={{
              flex: 1,
              py: 1,
              px: 1,
              borderRadius: 1,
              backgroundColor: "action.selected",
              textAlign: "center",
            }}
          >
            <Typography variant="body2" sx={{ mb: 0.5, color: "text.secondary", display: "block", fontSize: "0.55rem" }}>
              {item.label}
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600, fontSize: "0.65rem" }}>
              {item.value}
            </Typography>
          </Box>
        ))}
      </Box>
    );
  }

  return (
    <>
      <Box className="DataCard2" sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 2 }}>
        {cards.map((item, idx) => (
          <Box key={idx} sx={{ flex: "1" }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <GlassCard title={item.label} backgroundColor="action.selected" minHeight={undefined}>
                <Box sx={{ marginTop: 1.5 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, textAlign: "center" }}>
                    {item.value}
                  </Typography>
                </Box>
              </GlassCard>
            </motion.div>
          </Box>
        ))}
      </Box>
    </>
  );
};
export default DateCard2;
