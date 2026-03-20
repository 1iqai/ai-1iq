// Base sizes at 1280px (lg breakpoint minimum)
const BASE_VIEWPORT = 1280;

// Scale factor: how much fonts scale per 100px of viewport width
const SCALE_FACTOR = 0.05; // 5% per 100px

export const getResponsiveChartFontSize = (
  baseSize: number,
  viewportWidth: number,
  minSize?: number,
  maxSize?: number
): string => {
  // Only apply scaling for lg+ devices (>= 1280px)
  if (viewportWidth < BASE_VIEWPORT) {
    return `${baseSize}px`;
  }

  const scale = 1 + ((viewportWidth - BASE_VIEWPORT) / 100) * SCALE_FACTOR;
  let scaledSize = Math.round(baseSize * scale);

  if (minSize) scaledSize = Math.max(minSize, scaledSize);
  if (maxSize) scaledSize = Math.min(maxSize, scaledSize);

  return `${scaledSize}px`;
};

// Preset configurations for chart elements
export const getChartFontSizes = (viewportWidth: number) => ({
  // Compact view (dashboard)
  compact: {
    dataLabel: getResponsiveChartFontSize(8, viewportWidth, 8, 12),
    legend: getResponsiveChartFontSize(8, viewportWidth, 8, 11),
    centerName: getResponsiveChartFontSize(8, viewportWidth, 8, 11),
    centerValue: getResponsiveChartFontSize(12, viewportWidth, 12, 16),
    axisLabel: getResponsiveChartFontSize(8, viewportWidth, 8, 11),
  },
  // Dialog/Expanded view
  expanded: {
    dataLabel: getResponsiveChartFontSize(12, viewportWidth, 12, 16),
    legend: getResponsiveChartFontSize(12, viewportWidth, 12, 16),
    centerName: getResponsiveChartFontSize(12, viewportWidth, 12, 16),
    centerValue: getResponsiveChartFontSize(20, viewportWidth, 20, 28),
    axisLabel: getResponsiveChartFontSize(12, viewportWidth, 12, 16),
  },
});
