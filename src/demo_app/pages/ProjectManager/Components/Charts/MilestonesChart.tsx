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
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import toast from "react-hot-toast";

interface MilestoneChartProps {
  milestoneData: Array<{
    milestone: string;
    progress: number;
  }>;
  isReport?: boolean;
}

// Height per item (including spacing) - approximately 24px per item + 16px spacing
const ITEM_HEIGHT = 32;
const HEADER_HEIGHT = 40;
const MIN_ITEMS = 2;
const MAX_ITEMS = 5;

// Color logic based on progress percentage
// < 50% = Red, 50-65% = Yellow, > 65% = Green
const getBarColor = (_progress: number): string => {
  return "#10b981";
};

const MilestoneChart: React.FC<MilestoneChartProps> = ({ milestoneData, isReport = false }) => {
  const theme = useTheme();
  const [showTop, setShowTop] = useState(true);
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

  // Sort and limit milestones based on toggle and available space
  const data = useMemo(() => {
    if (!milestoneData) return [];
    const sorted = [...milestoneData].sort((a, b) =>
      showTop ? b.progress - a.progress : a.progress - b.progress
    );
    // For report mode, always show max 3 items
    const itemsToShow = isReport ? Math.min(3, sorted.length) : visibleItems;
    return sorted.slice(0, itemsToShow);
  }, [milestoneData, showTop, visibleItems, isReport]);


  if (!data.length) {
    return (
      <Box sx={{ width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <Typography color="text.secondary">No milestones available</Typography>
      </Box>
    );
  }

  return (
    <Box ref={containerRef} sx={{ width: "100%", height: isReport ? "auto" : "100%", display: "flex", flexDirection: "column", p: isReport ? 0.5 : 1 }}>
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: isReport ? 0.5 : 1, flexShrink: 0 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, fontSize: isReport ? "0.7rem" : "0.8rem" }}>
          Milestone Progress
        </Typography>
        {!isReport && (
          <Box sx={{ display: "flex", gap: 0.5 }}>
            <IconButton onClick={() => setShowTop(!showTop)} size="small">
              <FilterListIcon fontSize="small" color="primary" />
            </IconButton>
            <Tooltip title="Not available in demo" arrow>
              <span>
                <IconButton size="small" onClick={() => toast("Expanded view is not available in this demo.", { icon: "🛈", duration: 3000 })}>
                  <ZoomInIcon fontSize="small" color="disabled" />
                </IconButton>
              </span>
            </Tooltip>
          </Box>
        )}
      </Box>

      {/* List Container */}
      <Stack sx={{ flex: 1, minHeight: 0, justifyContent: isReport ? "flex-start" : "space-evenly", gap: isReport ? 0.5 : 0, pr: 1 }}>
        {data.map((item) => (
          <Box
            key={item.milestone}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: isReport ? 1 : 2,
            }}
          >
            {/* Column 1: Milestone Name */}
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
              title={item.milestone}
            >
              {item.milestone}
            </Typography>

            {/* Column 2: Progress Bar */}
            <Tooltip title={`${item.milestone} - ${item.progress}%`} placement="top">
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

            {/* Column 3: Percentage */}
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

    </Box>
  );
};

export default memo(MilestoneChart);
