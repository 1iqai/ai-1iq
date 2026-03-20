import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Box, Typography, Grid, Skeleton, Alert, Button, Card, CardContent } from "@mui/material";
import { FolderOpenRounded, RefreshRounded } from "@mui/icons-material";
import type { ArchiveProject } from "../../types";
import ArchiveProjectCard from "../../ProjectControlPanel/ArchivedProjects/ArchiveProjectCard";
import type { Project } from "../../ProjectManager/Components/ArchivedProjects/ArchiveProjectCard";

interface PaginatedResponse {
  projects: ArchiveProject[];
  total: number;
  currentPage: number;
  limit: number;
}

const ArchivedProjects = () => {
  const [archivedProjects, setArchivedProjects] = useState<ArchiveProject[]>([]);
  const [archivedLoading, setArchivedLoading] = useState<boolean>(false);
  const [archivedError, setArchivedError] = useState<Error | null>(null);

  const token = localStorage.getItem("token");

  const refetchArchived = useCallback(async () => {
    setArchivedLoading(true);
    setArchivedError(null);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/project/get-archived-projects`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch archived projects");
      }
      const data: PaginatedResponse = await response.json();
      setArchivedProjects(data.projects);
    } catch (err) {
      if (err instanceof Error) {
        setArchivedError(err);
      }
    } finally {
      setArchivedLoading(false);
    }
  }, [token]);

  useEffect(() => {
    refetchArchived();
  }, [refetchArchived]);

  // Skeleton Card Component
  const SkeletonCard = () => (
    <Card sx={{ borderRadius: 2, height: "100%" }}>
      <CardContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Skeleton variant="text" width="70%" height={32} />
        <Box sx={{ display: "flex", gap: 2 }}>
          <Box sx={{ flex: 1 }}>
            <Skeleton variant="text" width="60%" height={20} />
            <Skeleton variant="text" width="80%" height={20} />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Skeleton variant="text" width="60%" height={20} />
            <Skeleton variant="text" width="80%" height={20} />
          </Box>
        </Box>
        <Box sx={{ display: "flex", gap: 1.5, mt: 1 }}>
          <Skeleton variant="rounded" width="100%" height={40} sx={{ borderRadius: 2 }} />
          <Skeleton variant="rounded" width="100%" height={40} sx={{ borderRadius: 2 }} />
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        
        overflow: "auto",
      }}
    >
      <motion.div
        key="archived-modal"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.3 }}
      >
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            px: 2,
            py: 1.5,
            borderBottom: 1,
            borderColor: "divider",
          }}
        >
          <Typography variant="h6" fontWeight={600}>
            Archived Projects
          </Typography>
        </Box>

        {/* Error State */}
        {archivedError ? (
          <Box sx={{ p: 3 }}>
            <Alert
              severity="error"
              action={
                <Button
                  color="inherit"
                  size="small"
                  startIcon={<RefreshRounded />}
                  onClick={() => refetchArchived()}
                >
                  Try Again
                </Button>
              }
            >
              {archivedError.message || "An unexpected error occurred"}
            </Alert>
          </Box>
        ) : (
          <Box sx={{ p: 2 }}>
            <Grid container spacing={3}>
              {archivedLoading && archivedProjects.length === 0 ? (
                // Loading Skeletons
                Array(5)
                  .fill(null)
                  .map((_, i) => (
                    <Grid size={{ xs: 12, sm: 6, lg: 4, xl: 3 }} key={i}>
                      <SkeletonCard />
                    </Grid>
                  ))
              ) : archivedProjects.length === 0 ? (
                // Empty State
                <Grid size={12}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      py: 10,
                    }}
                  >
                    <FolderOpenRounded sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
                    <Typography variant="body1" color="text.secondary">
                      No archived projects found
                    </Typography>
                  </Box>
                </Grid>
              ) : (
                // Project Cards
                archivedProjects.map((project, index) => (
                  <Grid size={{ xs: 12, sm: 6, lg: 4, xl: 3 }} key={project.id}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      style={{ height: "100%" }}
                    >
                      <ArchiveProjectCard project={project as Project} refetch={refetchArchived} />
                    </motion.div>
                  </Grid>
                ))
              )}
            </Grid>
          </Box>
        )}
      </motion.div>
    </Box>
  );
};

export default ArchivedProjects;
