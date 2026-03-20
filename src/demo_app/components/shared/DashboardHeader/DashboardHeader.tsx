import { NavigateNext } from "@mui/icons-material";
import { Box, Breadcrumbs, Link, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import type { BreadcrumbItem, DashboardHeaderProps } from "./types";

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ title, subtitle, breadcrumbs }) => {
  const navigate = useNavigate();

  const handleBreadcrumbClick = (item: BreadcrumbItem) => {
    if (item.onClick) {
      item.onClick();
    } else if (item.path) {
      navigate(item.path);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, alignItems: "flex-end", justifyContent: "space-between", mb: 3 }}>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 600, marginBottom: 0.8 }}>
            {title}
          </Typography>
          <Typography variant="body2" className="mt-2 text-txt-secondary-light dark:text-txt-secondary-dark">
            {subtitle}
          </Typography>
        </Box>
        <Breadcrumbs separator={<NavigateNext fontSize="small" />} aria-label="breadcrumb">
          {breadcrumbs.map((item, index) => {
            const isLast = index === breadcrumbs.length - 1;

            if (isLast) {
              // Last item - render as Typography
              return (
                <Typography key={index} variant="body2" sx={{ color: "text.primary", fontWeight: 500 }}>
                  {item.label}
                </Typography>
              );
            }

            // Clickable items
            return (
              <Link
                key={index}
                component="button"
                variant="body2"
                onClick={() => handleBreadcrumbClick(item)}
                sx={{
                  textDecoration: "none",
                  color: "text.secondary",
                  "&:hover": {
                    textDecoration: "underline",
                    color: "primary.main",
                  },
                }}
              >
                {item.label}
              </Link>
            );
          })}
        </Breadcrumbs>
      </Box>
    </motion.div>
  );
};

export default DashboardHeader;
