import { memo, useMemo } from "react";
import Chart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";
import { formatValue } from "../../../../utility/formatValue";
import { useTheme } from "../../../../hooks/useTheme";
import { useWindowSize } from "../../../../hooks/useWindowSize";
import { getChartFontSizes } from "../../../../utility/responsiveChartFonts";
import { Box, IconButton, Tooltip } from "@mui/material";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import toast from "react-hot-toast";

interface BudgetChartProps {
  data: Array<{
    category: string;
    value: number;
    color?: string;
  }>;
}

const BudgetChart: React.FC<BudgetChartProps> = ({ data }) => {
  const { isDark } = useTheme();
  const { width: viewportWidth } = useWindowSize();
  const fontSizes = useMemo(() => getChartFontSizes(viewportWidth), [viewportWidth]);

  const isEmpty = useMemo(() => !data || data.every((item) => item.value === 0), [data]);

  const chartOptions: ApexOptions = useMemo(
    () => ({
      chart: {
        type: "bar",
        toolbar: { show: false },
        fontFamily: "'Poppins', sans-serif",
      },
      plotOptions: {
        bar: {
          columnWidth: "30%",
          borderRadius: 2,
          dataLabels: {
            position: "top",
          },
        },
      },
      dataLabels: {
        enabled: true,
        formatter: (val: number) => formatValue(val) as string,
        offsetY: -30,
        style: {
          fontSize: fontSizes.compact.dataLabel,
          fontWeight: 600,
          colors: [isDark ? "#fff" : "#111827"],
        },
      },
      xaxis: {
        categories: data?.map((d) => d.category) || [],
        labels: {
          style: {
            colors: isDark ? "#fff" : "#000",
            fontSize: fontSizes.compact.axisLabel,
          },
          rotate: -45,
          rotateAlways: true,
          offsetY: 2,
        },
        axisBorder: { show: false },
        axisTicks: { show: false },
      },
      yaxis: {
        labels: {
          show: false,
        },
      },
      fill: {
        type: "gradient",
        gradient: {
          shade: "light",
          type: "vertical",
          shadeIntensity: 0.25,
          gradientToColors: ["#2563eb"],
          opacityFrom: 0.95,
          opacityTo: 0.85,
          stops: [0, 100],
        },
      },
      colors: ["#3b82f6"],
      grid: {
        strokeDashArray: 3,
        borderColor: isDark ? "#374151" : "#e5e7eb",
        xaxis: { lines: { show: false } },
        yaxis: { lines: { show: true } },
      },
      tooltip: {
        theme: isDark ? "dark" : "light",
        y: {
          formatter: (val: number) => formatValue(val) as string,
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
    [isDark, data, fontSizes]
  );

  const series = useMemo(
    () => [
      {
        name: "Budget",
        data: data?.map((d) => d.value) || [],
      },
    ],
    [data]
  );

  // Handle empty state after hooks
  if (isEmpty) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <p className="text-gray-600 dark:text-gray-300 text-sm">No Budget Data available</p>
      </div>
    );
  }

  return (
    <Box sx={{ width: "100%", height: "100%", display: 'flex', flexDirection: 'column' }} className="group">
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 1, flexShrink: 0 }}>
        <span style={{ marginRight: '8px', fontWeight: 'bold', fontSize: '0.875rem', filter: 'blur(4px)', userSelect: 'none' }}>Project Budget</span>
        <Tooltip title="Not available in demo" arrow>
          <span>
            <IconButton
              size="small"
              onClick={() => toast("Expanded view is not available in this demo.", { icon: "🛈", duration: 3000 })}
            >
              <ZoomInIcon fontSize="small" color="disabled" />
            </IconButton>
          </span>
        </Tooltip>
      </Box>
      <Box sx={{ flex: 1, minHeight: 0, '& .apexcharts-xaxis text': { filter: 'blur(4px)' }, '& .apexcharts-datalabels text': { filter: 'blur(4px)' } }}>
        <Chart options={chartOptions} series={series} type="bar" height="100%" width="100%" />
      </Box>
    </Box>
  );
};

export default memo(BudgetChart);
