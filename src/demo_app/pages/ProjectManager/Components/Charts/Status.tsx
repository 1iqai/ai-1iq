import { Box, Paper } from "@mui/material";
import DateCard1 from "./DateCard1";
import DateCard2 from "./DateCard2";
import { motion } from "framer-motion";

interface StatusProps {
  data: any;
  compact?: boolean;
}

const Status: React.FC<StatusProps> = ({ data, compact = false }) => {
  if (compact) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        style={{ height: "100%" }}
      >
        <Paper
          variant="outlined"
          sx={{
            p: 0.5,
            borderRadius: 1,
            backgroundColor: "background.default",
            display: "flex",
            flexDirection: "column",
            gap: 0.25,
          }}
        >
          <DateCard1 data={data} compact />
          <DateCard2 data={data} compact />
        </Paper>
      </motion.div>
    );
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <DateCard1 data={data} compact={false} />
      <DateCard2 data={data} compact={false} />
    </Box>
  );
};

export default Status;
