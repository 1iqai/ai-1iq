import { useState } from "react";
import { toast } from "react-toastify";
import { formatDate } from "../../../../utility/dateCalculations";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from "@mui/material";
import { UndoRounded, DeleteRounded, WarningRounded } from "@mui/icons-material";
import { useAuth } from "../../../../hooks/useAuth";

export interface Project {
  id: string;
  name: string;
  description: string | null;
  startDate: string;
  endDate: string;
  status: string;
}

interface ArchiveProjectCardProps {
  project: Project;
  refetch: (page: number) => void;
}

const ArchiveProjectCard = ({ project, refetch }: ArchiveProjectCardProps) => {
  const { user } = useAuth();
  const isAdmin = user?.role === "Admin" || user?.role === "Super Admin";

  const [loading, setLoading] = useState<boolean>(false);
  const [deleting, setDeleting] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);

  const token = localStorage.getItem("token");

  const removeFromArchive = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/project/${project.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ archived: false }),
      });
      if (!response.ok) {
        throw new Error("Failed to unarchive project");
      }
      toast.success("Project unarchived successfully!");
      refetch(1);
    } catch (error) {
      if (error instanceof Error) toast.error(error.message || "Failed to unarchive project");
      console.error("Unarchive error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    setShowDeleteModal(false);
    setDeleting(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/project/${project.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to delete project");
      }
      toast.success("Project deleted successfully!");
      refetch(1);
    } catch (error) {
      if (error instanceof Error) toast.error(error.message || "Failed to delete project");
      console.error("Delete error:", error);
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
  };

  const deleteProject = () => {
    setShowDeleteModal(true);
  };

  return (
    <>
      <Card
        sx={{
          borderRadius: 2,
          height: "100%",
          backgroundColor: "background.default",
          boxShadow: "none",
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <CardContent sx={{ display: "flex", flexDirection: "column", height: "100%", gap: 2 }}>
          <Typography variant="h6" fontWeight={600} noWrap>
            {project.name}
          </Typography>

          <Grid container spacing={2}>
            <Grid size={6}>
              <Typography variant="body2" color="text.secondary" fontWeight={500}>
                Start Date
              </Typography>
              <Typography variant="body2">{formatDate(project.startDate)}</Typography>
            </Grid>
            <Grid size={6}>
              <Typography variant="body2" color="text.secondary" fontWeight={500}>
                End Date
              </Typography>
              <Typography variant="body2">{formatDate(project.endDate)}</Typography>
            </Grid>
          </Grid>

          <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 1.5, mt: "auto" }}>
            <Button
              variant="contained"
              startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <UndoRounded />}
              onClick={removeFromArchive}
              disabled={loading}
              fullWidth
              sx={{ borderRadius: 5 }}
            >
              {loading ? "Unarchiving..." : "Unarchive"}
            </Button>
            {isAdmin && (
              <Button
                variant="contained"
                color="error"
                startIcon={deleting ? <CircularProgress size={16} color="inherit" /> : <DeleteRounded />}
                onClick={deleteProject}
                disabled={deleting}
                fullWidth
                sx={{ borderRadius: 5 }}
              >
                {deleting ? "Deleting..." : "Delete"}
              </Button>
            )}
          </Box>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteModal} onClose={handleDeleteCancel} maxWidth="xs" fullWidth>
        <DialogTitle>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box
              sx={{
                bgcolor: "error.light",
                borderRadius: "50%",
                width: 48,
                height: 48,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <WarningRounded sx={{ color: "#fff" }} />
            </Box>
            <Typography variant="h6" fontWeight={600}>
              Delete Project?
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography color="text.secondary">
            Are you sure you want to delete <strong>"{project.name}"</strong>? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleDeleteCancel} variant="outlined" sx={{ borderRadius: 5 }}>
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            variant="contained"
            color="error"
            disabled={deleting}
            startIcon={deleting ? <CircularProgress size={16} color="inherit" /> : <DeleteRounded />}
            sx={{ borderRadius: 5 }}
          >
            {deleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ArchiveProjectCard;
