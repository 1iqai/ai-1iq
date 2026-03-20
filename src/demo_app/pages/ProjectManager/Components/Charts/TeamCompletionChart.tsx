import { memo, useMemo, useState, useRef, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  IconButton,
  LinearProgress,
  Stack,
  Tooltip,
  useTheme,
  linearProgressClasses,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import CloseIcon from "@mui/icons-material/Close";

interface TeamCompletionProps {
  teamData: Array<{
    team: string;
    progress: number;
  }>;
  isReport?: boolean;
}

// Height per item (including spacing) - approximately 24px per item + 16px spacing
const ITEM_HEIGHT = 32;
const HEADER_HEIGHT = 40;
const MIN_ITEMS = 2;
const MAX_ITEMS = 5;

// 1. Color Logic based on your screenshot
// < 50% = Red, 50-65% = Yellow, > 65% = Green
const getBarColor = (progress: number): string => {
  if (progress >= 65) return "#10b981"; // Emerald Green
  if (progress >= 50) return "#f59e0b"; // Amber Yellow
  return "#ef4444"; // Red
};

const TeamCompletion: React.FC<TeamCompletionProps> = ({ teamData, isReport = false }) => {
  const theme = useTheme();
  const [showTop, setShowTop] = useState(true);
  const [expandOpen, setExpandOpen] = useState(false);
  const [visibleItems, setVisibleItems] = useState(MAX_ITEMS);
  const containerRef = useRef<HTMLDivElement>(null);

  // Calculate visible items based on container height
  const calculateVisibleItems = useCallback(() => {
    if (containerRef.current) {
      const containerHeight = containerRef.current.clientHeight;
      const availableHeight = containerHeight - HEADER_HEIGHT;
      const calculatedItems = Math.floor(availableHeight / ITEM_HEIGHT);
      const clampedItems = Math.min(MAX_ITEMS, Math.max(MIN_ITEMS, calculatedItems));
      setVisibleItems(clampedItems);
    }
  }, []);

  // Set up resize observer
  useEffect(() => {
    calculateVisibleItems();

    const resizeObserver = new ResizeObserver(() => {
      calculateVisibleItems();
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => resizeObserver.disconnect();
  }, [calculateVisibleItems]);

  // Sort and limit teams based on toggle and available space
  const data = useMemo(() => {
    if (!teamData) return [];
    const sorted = [...teamData].sort((a, b) =>
      showTop ? b.progress - a.progress : a.progress - b.progress
    );
    // For report mode, always show max 3 items
    const itemsToShow = isReport ? Math.min(3, sorted.length) : visibleItems;
    return sorted.slice(0, itemsToShow);
  }, [teamData, showTop, visibleItems, isReport]);

  // Full data for expanded view (all teams, sorted)
  const fullData = useMemo(() => {
    if (!teamData) return [];
    return [...teamData].sort((a, b) =>
      showTop ? b.progress - a.progress : a.progress - b.progress
    );
  }, [teamData, showTop]);

  if (!data.length) {
    return (
      <Box sx={{ width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <Typography color="text.secondary">No team data available</Typography>
      </Box>
    );
  }

  return (
    <Box ref={containerRef} sx={{ width: "100%", height: isReport ? "auto" : "100%", display: "flex", flexDirection: "column", p: isReport ? 0.5 : 1 }}>
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: isReport ? 0.5 : 1, flexShrink: 0 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, fontSize: isReport ? "0.7rem" : "0.8rem" }}>
          Team Progress
        </Typography>
        {!isReport && (
          <Box sx={{ display: "flex", gap: 0.5 }}>
            <IconButton onClick={() => setShowTop(!showTop)} size="small">
              <FilterListIcon fontSize="small" color="primary" />
            </IconButton>
            <IconButton onClick={() => setExpandOpen(true)} size="small">
              <ZoomInIcon fontSize="small" color="primary" />
            </IconButton>
          </Box>
        )}
      </Box>

      {/* List Container */}
      <Stack sx={{ flex: 1, minHeight: 0, justifyContent: isReport ? "flex-start" : "space-evenly", gap: isReport ? 0.5 : 0, pr: 1 }}>
        {data.map((item) => (
          // Uniquely identify the row to fix the "Key" error
          <Box
            key={item.team}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: isReport ? 1 : 2, // Space between columns
            }}
          >
            {/* Column 1: Team Name (Fixed Width or Flex) */}
            <Typography
              variant="body2"
              sx={{
                width: isReport ? "100px" : "120px",
                fontWeight: 600,
                color: "text.primary",
                fontSize: isReport ? "0.6rem" : "0.7rem",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis"
              }}
              title={item.team}
            >
              {item.team}
            </Typography>

            {/* Column 2: The Progress Bar */}
            <Tooltip title={`${item.team} - ${item.progress}%`} placement="top">
              <Box sx={{ flex: 1 }}>
                <LinearProgress
                  variant="determinate"
                  value={item.progress}
                  sx={{
                    height: isReport ? 6 : 8,
                    borderRadius: 5,
                    backgroundColor: theme.palette.mode === "dark" ? "#334155" : "#EDEFF1",
                    [`& .${linearProgressClasses.bar}`]: {
                      borderRadius: 5,
                      backgroundColor: getBarColor(item.progress),
                      transition: "transform 0.4s ease",
                    },
                  }}
                />
              </Box>
            </Tooltip>

            {/* Column 3: The Percentage (Aligned Right) */}
            <Typography
              variant="caption"
              sx={{
                width: isReport ? "30px" : "40px",
                textAlign: "right",
                fontWeight: 700,
                color: "text.primary",
                fontSize: isReport ? "0.55rem" : "0.65rem"
              }}
            >
              {item.progress}%
            </Typography>
          </Box>
        ))}
      </Stack>

      {/* Expanded View Dialog */}
      <Dialog
        open={expandOpen}
        onClose={() => setExpandOpen(false)}
        maxWidth="md"
        fullWidth
        slotProps={{
          paper: {
            sx: {
              borderRadius: 2,
              maxHeight: "80vh",
            },
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            pb: 1,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600, fontSize: "0.9rem" }}>
            Team Progress
          </Typography>
          <Box sx={{ display: "flex", gap: 0.5 }}>
            <IconButton onClick={() => setShowTop(!showTop)} size="small">
              <FilterListIcon fontSize="small" color="primary" />
            </IconButton>
            <IconButton onClick={() => setExpandOpen(false)} size="small">
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ py: 1 }}>
            {fullData.map((item) => (
              <Box
                key={item.team}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    width: "160px",
                    fontWeight: 600,
                    color: "text.primary",
                    fontSize: "0.7rem",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                  title={item.team}
                >
                  {item.team}
                </Typography>
                <Tooltip title={`${item.team} - ${item.progress}%`} placement="top">
                  <Box sx={{ flex: 1 }}>
                    <LinearProgress
                      variant="determinate"
                      value={item.progress}
                      sx={{
                        height: 8,
                        borderRadius: 5,
                        backgroundColor: theme.palette.mode === "dark" ? "#334155" : "#EDEFF1",
                        [`& .${linearProgressClasses.bar}`]: {
                          borderRadius: 5,
                          backgroundColor: getBarColor(item.progress),
                          transition: "transform 0.4s ease",
                        },
                      }}
                    />
                  </Box>
                </Tooltip>
                <Typography
                  variant="caption"
                  sx={{
                    width: "50px",
                    textAlign: "right",
                    fontWeight: 700,
                    color: "text.primary",
                    fontSize: "0.65rem"
                  }}
                >
                  {item.progress}%
                </Typography>
              </Box>
            ))}
          </Stack>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default memo(TeamCompletion);