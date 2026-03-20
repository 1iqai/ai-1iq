import { memo, useMemo, useState } from "react";
import Chart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";
import { useTheme } from "../../../../hooks/useTheme";
import { useWindowSize } from "../../../../hooks/useWindowSize";
import { getChartFontSizes } from "../../../../utility/responsiveChartFonts";
import { Box, IconButton, Dialog, DialogTitle, DialogContent, Typography } from "@mui/material";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import CloseIcon from "@mui/icons-material/Close";

interface InfoPieChartProps {
  data: { id: string; value: number; color?: string }[];
  title: string;
  category: string;
}

const InfoPieChart: React.FC<InfoPieChartProps> = ({ data, title, category }) => {
  const { isDark } = useTheme();
  const [expandOpen, setExpandOpen] = useState(false);
  const { width: viewportWidth } = useWindowSize();
  const fontSizes = useMemo(() => getChartFontSizes(viewportWidth), [viewportWidth]);

  const filteredData = useMemo(() => data.filter((item) => item.value > 0), [data]);
  const total = useMemo(() => filteredData.reduce((sum, item) => sum + item.value, 0), [filteredData]);

  // Compact chart options (legend on bottom, smaller)
  const compactChartOptions: ApexOptions = useMemo(
    () => ({
      chart: {
        type: "donut",
        fontFamily: "'Poppins', sans-serif",
        sparkline: {
          enabled: false,
        },
      },
      labels: filteredData.map((d) => d.id),
      colors: filteredData.map((d) => d.color || "#3b82f6"),
      plotOptions: {
        pie: {
          donut: {
            size: "60%",
            labels: {
              show: true,
              name: {
                show: true,
                fontSize: fontSizes.compact.centerName,
                fontWeight: 400,
                color: isDark ? "#9ca3af" : "#6b7280",
                offsetY: -6,
              },
              value: {
                show: true,
                fontSize: fontSizes.compact.centerValue,
                fontWeight: 700,
                color: isDark ? "#fff" : "#374151",
                offsetY: -2,
                formatter: (val: string) => val,
              },
              total: {
                show: true,
                showAlways: false,
                label: "Total",
                fontSize: fontSizes.compact.centerName,
                fontWeight: 400,
                color: isDark ? "#9ca3af" : "#6b7280",
                formatter: (w) => {
                  return w.globals.seriesTotals.reduce((a: number, b: number) => a + b, 0).toString();
                },
              },
            },
          },
          offsetY: -5,
        },
      },
      dataLabels: {
        enabled: true,
        formatter: (_val: number, opts: { seriesIndex: number }) => {
          return String(filteredData[opts.seriesIndex].value);
        },
        style: {
          fontSize: fontSizes.compact.dataLabel,
          fontWeight: 600,
          colors: ["#fff"],
        },
        dropShadow: { enabled: false },
      },
      legend: {
        show: true,
        position: "bottom",
        horizontalAlign: "center",
        floating: false,
        fontSize: fontSizes.compact.legend,
        fontWeight: 400,
        fontFamily: "'Poppins', sans-serif",
        labels: {
          colors: isDark ? "#f9fafb" : "#4b5563",
        },
        markers: {
          size: 4,
          strokeWidth: 0,
          offsetX: -2,
        },
        itemMargin: {
          horizontal: 6,
          vertical: 0,
        },
        offsetY: 0,
      },
      stroke: {
        show: false,
      },
      tooltip: {
        theme: isDark ? "dark" : "light",
        y: {
          formatter: (val: number) => `${val}`,
        },
      },
      states: {
        hover: {
          filter: {
            type: "lighten",
            value: 0.1,
          },
        },
      },
    }),
    [isDark, filteredData, fontSizes]
  );

  // Full chart options for dialog (larger, legend at bottom)
  const fullChartOptions: ApexOptions = useMemo(
    () => ({
      chart: {
        type: "donut",
        fontFamily: "'Poppins', sans-serif",
      },
      labels: filteredData.map((d) => d.id),
      colors: filteredData.map((d) => d.color || "#3b82f6"),
      plotOptions: {
        pie: {
          donut: {
            size: "60%",
            labels: {
              show: true,
              name: {
                show: true,
                fontSize: fontSizes.expanded.centerName,
                fontWeight: 400,
                color: isDark ? "#9ca3af" : "#6b7280",
                offsetY: -12,
              },
              value: {
                show: true,
                fontSize: fontSizes.expanded.centerValue,
                fontWeight: 700,
                color: isDark ? "#fff" : "#374151",
                offsetY: 0,
                formatter: (val: string) => val,
              },
              total: {
                show: true,
                showAlways: false,
                label: "Total",
                fontSize: fontSizes.expanded.centerName,
                fontWeight: 400,
                color: isDark ? "#9ca3af" : "#6b7280",
                formatter: (w) => {
                  return w.globals.seriesTotals.reduce((a: number, b: number) => a + b, 0).toString();
                },
              },
            },
          },
        },
      },
      dataLabels: {
        enabled: true,
        formatter: (_val: number, opts: { seriesIndex: number }) => {
          return String(filteredData[opts.seriesIndex].value);
        },
        style: {
          fontSize: fontSizes.expanded.dataLabel,
          fontWeight: 600,
          colors: ["#fff"],
        },
        dropShadow: { enabled: false },
      },
      legend: {
        show: true,
        position: "bottom",
        horizontalAlign: "center",
        fontSize: fontSizes.expanded.legend,
        fontWeight: 500,
        fontFamily: "'Poppins', sans-serif",
        labels: {
          colors: isDark ? "#f9fafb" : "#4b5563",
        },
        markers: {
          size: 8,
          strokeWidth: 0,
          offsetX: -5,
        },
        itemMargin: {
          horizontal: 12,
          vertical: 4,
        },
      },
      stroke: {
        show: false,
      },
      tooltip: {
        theme: isDark ? "dark" : "light",
        y: {
          formatter: (val: number) => `${val}`,
        },
      },
      states: {
        hover: {
          filter: {
            type: "lighten",
            value: 0.1,
          },
        },
      },
    }),
    [isDark, filteredData, fontSizes]
  );

  const series = useMemo(() => filteredData.map((d) => d.value), [filteredData]);

  // Empty state
  if (filteredData.length === 0 || total === 0) {
    return (
      <Box sx={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Typography variant="body2" color="text.secondary">
          No {category} data available.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%", height: "100%", position: "relative", display: "flex", flexDirection: "column" }}>
      {/* Expand button */}
      <Box sx={{ position: "absolute", top: -4, right: -4, zIndex: 1 }}>
        <IconButton onClick={() => setExpandOpen(true)} size="small" sx={{ p: 0.25 }}>
          <ZoomInIcon sx={{ fontSize: 16 }} color="primary" />
        </IconButton>
      </Box>

      {/* Compact Chart */}
      <Box sx={{ flex: 1, minHeight: 0 }}>
        <Chart options={compactChartOptions} series={series} type="donut" height="100%" width="100%" />
      </Box>

      {/* Expanded Dialog */}
      <Dialog
        open={expandOpen}
        onClose={() => setExpandOpen(false)}
        maxWidth="sm"
        fullWidth
        slotProps={{
          paper: {
            sx: {
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
            pb: 1,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600, fontSize: "1rem" }}>
            {title || `${category} Status`}
          </Typography>
          <IconButton onClick={() => setExpandOpen(false)} size="small">
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ height: 350 }}>
            <Chart options={fullChartOptions} series={series} type="donut" height="100%" width="100%" />
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export { InfoPieChart };
export default memo(InfoPieChart);
