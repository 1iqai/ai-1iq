import { memo, useMemo } from "react";
import Chart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";
import { useTheme } from "../../../../hooks/useTheme";
import { useWindowSize } from "../../../../hooks/useWindowSize";
import { getChartFontSizes } from "../../../../utility/responsiveChartFonts";
import { Box, IconButton, Tooltip } from "@mui/material";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import toast from "react-hot-toast";

interface TaskPieChartProps {
  data: { id: string; value: number; color?: string }[];
  title?: string;
  onSegmentClick?: (label: string) => void;
}

const TaskPieChart: React.FC<TaskPieChartProps> = ({ data, title: _title, onSegmentClick }) => {
  const { isDark } = useTheme();
  const { width: viewportWidth } = useWindowSize();
  const fontSizes = useMemo(() => getChartFontSizes(viewportWidth), [viewportWidth]);

  const filteredData = useMemo(() => (data || []).filter((item) => item.value > 0), [data]);
  const total = useMemo(() => filteredData.reduce((sum, item) => sum + item.value, 0), [filteredData]);

  // Compact chart options (legend on bottom, smaller)
  const compactChartOptions: ApexOptions = useMemo(
    () => ({
      chart: {
        type: "donut",
        fontFamily: "'Poppins', sans-serif",
        toolbar: { show: false },
        sparkline: {
          enabled: false,
        },
        events: {
          dataPointSelection: (_event: unknown, _chartContext: unknown, config: { dataPointIndex: number }) => {
            if (onSegmentClick && filteredData[config.dataPointIndex]) {
              onSegmentClick(filteredData[config.dataPointIndex].id);
            }
          },
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
                color: isDark ? '#9ca3af' : '#6b7280',
                offsetY: -6,
              },
              value: {
                show: true,
                fontSize: fontSizes.compact.centerValue,
                fontWeight: 700,
                color: isDark ? '#fff' : '#374151',
                offsetY: -2,
                formatter: (val: string) => val,
              },
              total: {
                show: true,
                showAlways: false,
                label: 'Total',
                fontSize: fontSizes.compact.centerName,
                fontWeight: 400,
                color: isDark ? '#9ca3af' : '#6b7280',
                formatter: (w) => {
                  return w.globals.seriesTotals.reduce((a: number, b: number) => a + b, 0).toString();
                }
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
          colors: ['#fff'],
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
    [isDark, filteredData, fontSizes, onSegmentClick]
  );


  const series = useMemo(() => filteredData.map((d) => d.value), [filteredData]);

  if (filteredData.length === 0 || total === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <p className="text-gray-600 dark:text-gray-300 text-sm">No task data available.</p>
      </div>
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
        <Chart options={compactChartOptions} series={series} type="donut" height="100%" width="100%" />
      </Box>
    </Box>
  );
};

export { TaskPieChart };
export default memo(TaskPieChart);
