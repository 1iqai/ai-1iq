import { useRef, useState, useEffect, useCallback } from "react";
import { Box, CircularProgress, Paper, Skeleton, Typography } from "@mui/material";
import { motion } from "framer-motion";

interface GlassCardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  minHeight?: number | string;
  backgroundColor?: string;
  sx?: any;
  loading?: boolean;
  /** Enable lazy loading - only render children when card is visible in viewport */
  lazy?: boolean;
  /** Root margin for intersection observer (e.g., "100px" to start loading before visible) */
  lazyRootMargin?: string;
}

const GlassCard: React.FC<GlassCardProps> = ({
  title,
  children,
  className,
  minHeight,
  backgroundColor,
  sx,
  loading = false,
  lazy = false,
  lazyRootMargin = "100px",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [, setIsVisible] = useState(!lazy);
  const [hasBeenVisible, setHasBeenVisible] = useState(!lazy);

  // Use IntersectionObserver for lazy loading
  useEffect(() => {
    if (!lazy || hasBeenVisible) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          setHasBeenVisible(true);
          // Once visible, we can disconnect the observer
          observer.disconnect();
        }
      },
      {
        rootMargin: lazyRootMargin,
        threshold: 0,
      }
    );

    const currentRef = containerRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      observer.disconnect();
    };
  }, [lazy, hasBeenVisible, lazyRootMargin]);

  // Render skeleton placeholder when lazy loading and not yet visible
  const renderContent = useCallback(() => {
    if (lazy && !hasBeenVisible) {
      return (
        <Box sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 1, p: 1 }}>
          <Skeleton variant="rounded" width="100%" height="60%" animation="wave" />
          <Skeleton variant="rounded" width="80%" height="20%" animation="wave" />
          <Skeleton variant="rounded" width="60%" height="15%" animation="wave" />
        </Box>
      );
    }
    return children;
  }, [lazy, hasBeenVisible, children]);
  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      style={{ height: "100%" }}
    >
      <Paper
        variant="outlined"
        elevation={3}
        sx={{
          height: "100%",
          minHeight: minHeight,
          borderRadius: "8px",
          backgroundColor: backgroundColor || "background.default",
        }}
      >
        <Box
          sx={{
            padding: "8px 18px",
            height: "100%",
            minHeight: minHeight,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            position: "relative",
            ...sx,
          }}
          className={className}
        >
          {title && (
            <Typography
              className="glass-card-title"
              component="h6"
              variant="h6"
              sx={{
                fontWeight: 600,
                color: "text.primary",
                fontSize: "14px",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textAlign: "center",
                textOverflow: "ellipsis",
                mb: 1,
              }}
            >
              {title}
            </Typography>
          )}
          <Box sx={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }}>{renderContent()}</Box>

          {/* Loading overlay */}
          {loading && (
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: "rgba(255, 255, 255, 0.7)",
                backdropFilter: "blur(2px)",
                zIndex: 10,
                borderRadius: "8px",
              }}
            >
              <CircularProgress size={24} />
            </Box>
          )}
        </Box>
      </Paper>
    </motion.div>
  );
};

export default GlassCard;
