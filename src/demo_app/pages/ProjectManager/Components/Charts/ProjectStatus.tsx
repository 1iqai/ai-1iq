import React, { useMemo } from "react";
import Chart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";
import { Box, Typography, IconButton, Tooltip } from "@mui/material";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import toast from "react-hot-toast";
import type { ProjectStatusType } from "../../AnalyticsDashboard.types";
import { useTheme } from "../../../../hooks/useTheme";

type ProjectStatusProps = {
  data: ProjectStatusType | null;
};

const ProjectStatus: React.FC<ProjectStatusProps> = ({ data }) => {
  const { isDark } = useTheme();
  const isEmpty = data?.isEmpty ?? true;

  const actualCompleted = Math.round((Number(data?.actualPercentComplete) || 0) * 10) / 10;
  const initialCompleted = Math.round((Number(data?.initialPercentComplete) || 0) * 10) / 10;

  const chartOptions: ApexOptions = useMemo(
    () => ({
      chart: {
        type: "radialBar",
        fontFamily: "'Poppins', sans-serif",
        toolbar: { show: false },
        sparkline: { enabled: false },
      },
      plotOptions: {
        radialBar: {
          offsetY: 0,
          startAngle: 0,
          endAngle: 360,
          hollow: {
            size: "50%",
            background: "transparent",
          },
          track: {
            background: isDark ? "#374151" : "#e5e7eb",
            strokeWidth: "100%",
            margin: 6,
          },
          dataLabels: {
            show: true,
            name: {
              show: false,
            },
            value: {
              show: true,
              fontSize: "18px",
              fontWeight: 700,
              color: isDark ? "#fff" : "#1f2937",
              offsetY: 7,
            },
            total: {
              show: true,
              label: " ",
              fontSize: "18px",
              fontWeight: 700,
              color: isDark ? "#fff" : "#1f2937",
              formatter: () => `${actualCompleted.toFixed(1)}%`,
            },
          },
        },
      },
      colors: isDark ? ["#4fa2b5", "#9ca3af"] : ["#0F2854", "#4988C4"],
      labels: ["Planned", "Field"],
      stroke: {
        lineCap: "round",
      },
      legend: {
        show: true,
        position: "bottom",
        horizontalAlign: "center",
        fontSize: "12px",
        fontFamily: "'Poppins', sans-serif",
        fontWeight: 400,
        labels: {
          colors: isDark ? "#9ca3af" : "#6b7280",
        },
        markers: {
          size: 4,
          strokeWidth: 0,
          offsetX: -4,
        },
        itemMargin: {
          horizontal: 8,
          vertical: 0,
        },
        formatter: (seriesName: string, opts: { seriesIndex: number }) => {
          const values = [initialCompleted, actualCompleted];
          return `${seriesName}: ${values[opts.seriesIndex].toFixed(1)}%`;
        },
      },
      tooltip: {
        enabled: true,
        theme: isDark ? "dark" : "light",
        style: {
          fontSize: "12px",
        },
        y: {
          formatter: (val: number) => `${val.toFixed(1)}%`,
        },
        fillSeriesColor: false,
        marker: {
          show: true,
        },
        custom: ({ seriesIndex }: { seriesIndex: number }) => {
          const labels = ["Planned", "Field"];
          const values = [initialCompleted, actualCompleted];
          const colors = ["#0369a1", "#9ca3af"];
          return `<div style="padding: 8px 12px; background: ${isDark ? "#1f2937" : "#fff"}; border: 1px solid ${isDark ? "#374151" : "#e5e7eb"}; border-radius: 4px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <div style="display: flex; align-items: center; gap: 6px;">
              <span style="width: 8px; height: 8px; border-radius: 50%; background: ${colors[seriesIndex]};"></span>
              <span style="color: ${isDark ? "#fff" : "#111827"}; font-weight: 500;">${labels[seriesIndex]}: ${values[seriesIndex].toFixed(1)}%</span>
            </div>
          </div>`;
        },
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            plotOptions: {
              radialBar: {
                dataLabels: {
                  value: {
                    fontSize: "14px",
                  },
                },
              },
            },
            legend: {
              fontSize: "10px",
            },
          },
        },
      ],
    }),
    [isDark, actualCompleted, initialCompleted],
  );


  if (isEmpty) {
    return (
      <Box sx={{ width: "100%", height: "100%", display: "flex", flexDirection: "column" }}>
        <Box sx={{ flex: 1, minHeight: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Typography variant="body2" color="text.secondary" fontWeight={600}>
            No tasks available.
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%", height: "100%", position: "relative", display: "flex", flexDirection: "column" }}>
      {/* Expand button */}
      <Box sx={{ position: "absolute", top: -4, right: -4, zIndex: 1 }}>
        <Tooltip title="Not available in demo" arrow>
          <span>
            <IconButton size="small" sx={{ p: 0.25 }} onClick={() => toast("Expanded view is not available in this demo.", { icon: "🛈", duration: 3000 })}>
              <ZoomInIcon sx={{ fontSize: 16 }} color="disabled" />
            </IconButton>
          </span>
        </Tooltip>
      </Box>

      {/* Compact Chart */}
      <Box sx={{ flex: 1, minHeight: 0 }}>
        <Chart
          key={`project-status-${initialCompleted}-${actualCompleted}`}
          options={chartOptions}
          series={[initialCompleted, actualCompleted]}
          type="radialBar"
          height="100%"
          width="100%"
        />
      </Box>
    </Box>
  );
};

export default ProjectStatus;
