import { useEffect, useState } from "react";
import { parseISO, isValid, format, min, max } from "date-fns";
import { motion } from "framer-motion";
import GlassCard from "../../../../components/shared/GlassCard";
import { Box, Typography } from "@mui/material";

interface Task {
  startDate: string | Date | null; // planned
  endDate: string | Date | null; // planned
  dateStarted: string | Date | null; // actual
  dateEnded: string | Date | null; // actual
}
interface DateCard1Props {
  data: {
    startDate?: string | Date | null;
    endDate?: string | Date | null;
    milestones: { tasks: Task[] }[];
  };
  compact?: boolean;
}
const DateCard1: React.FC<DateCard1Props> = ({ data, compact = false }) => {
  const [startDate, setStartDate] = useState("-");
  const [endDate, setEndDate] = useState("-");

  useEffect(() => {
    const fmt = (raw?: string | Date | null) => {
      if (!raw) return "-";
      const d = typeof raw === "string" ? parseISO(raw) : raw;
      return isValid(d) ? format(d, "dd MMM yyyy") : "-";
    };

    const taskStartDates: Date[] = [];
    const taskEndDates: Date[] = [];

    data?.milestones?.forEach((milestone) => {
      milestone?.tasks?.forEach((task) => {
        let start: Date | null = null;
        let end: Date | null = null;

        start = typeof task.startDate === "string" ? parseISO(task.startDate) : task.startDate;

        end = typeof task.endDate === "string" ? parseISO(task.endDate) : task.endDate;

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

    setStartDate(fmt(earliestStart));
    setEndDate(fmt(latestEnd));
  }, [data]);

  const cards = [
    { label: "Planned Project Start Date", value: startDate },
    { label: "Planned Project End Date", value: endDate },
  ];

  if (compact) {
    return (
      <Box sx={{ display: "flex", flexDirection: "row", gap: 0.5 }}>
        {cards.map((item, idx) => (
          <Box
            key={idx}
            sx={{
              flex: 1,
              py:1,
              px: 1,
              borderRadius: 1,
              backgroundColor: "action.hover",
              textAlign: "center",
            }}
          >
            <Typography variant="body2" sx={{ mb: 0.5, color: "text.secondary", display: "block", fontSize: "0.55rem", lineHeight: 1.2 }}>
              {item.label}
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600, fontSize: "0.65rem", lineHeight: 1.2 }}>
              {item.value}
            </Typography>
          </Box>
        ))}
      </Box>
    );
  }

  return (
    <>
      <Box className="DataCard1" sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 2 }}>
        {cards.map((item, idx) => (
          <Box key={idx} sx={{ flex: "1" }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <GlassCard title={item.label} minHeight={undefined}>
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

export default DateCard1;
