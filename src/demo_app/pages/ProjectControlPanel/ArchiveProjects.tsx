import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  Box,
  CircularProgress,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Tooltip,
} from "@mui/material";
import { ArchiveRounded, WarningRounded, EditRounded, GroupAddRounded } from "@mui/icons-material";
import { PMProvider, usePM } from "../../contexts/PMContext";
import { useAuth } from "../../hooks/useAuth";
import ManageExternalUsersModal from "./ManageExternalUsersModal";

export type UserStatus = "Active" | "Invited" | "Disabled" | "Deleted";

export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  uid: string;
  role: string;
  active: UserStatus;
  roleId: string;
  password?: string;
  lastLogin: string | null;
  image: string;
  divisions?: { id: string; name: string }[];
  organizationId?: string | null;
}

const ArchiveProjectsContent = () => {
  const { user } = useAuth();
  const isAdmin = user.role === "Admin";
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [archiving, setArchiving] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const token = localStorage.getItem("token");

  const { projectList, fetchProjects, loading, error } = usePM();

  const [showUpdateManagerDialog, setShowUpdateManagerDialog] = useState(false);
  const [projectToUpdate, setProjectToUpdate] = useState<any>(null);
  const [projectManagers, setProjectManagers] = useState<User[]>([]);
  const [selectedManager, setSelectedManager] = useState("");
  const [updatingManager, setUpdatingManager] = useState(false);
  const [externalUsersProject, setExternalUsersProject] = useState<any>(null);

  useEffect(() => {
    const fetchProjectManagers = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/user/list-search-users?limit=1000`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }
        const { data } = await response.json();
        const managers = data.filter((user: User) => user.role === "Project Manager");
        setProjectManagers(managers);
      } catch (error) {
        console.error("Error fetching project managers:", error);
        toast.error("Could not load project managers.");
      }
    };

    fetchProjectManagers();
  }, [token]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography color="error" gutterBottom>{error}</Typography>
        <Button variant="outlined" onClick={() => fetchProjects(false, true)}>Retry</Button>
      </Box>
    );
  }

  const handleArchiveClick = (project: any) => {
    setSelectedProject(project);
    setShowConfirmDialog(true);
  };

  const handleUpdateManagerClick = (project: any) => {
    setProjectToUpdate(project);
    setSelectedManager(project.managerId || "");
    setShowUpdateManagerDialog(true);
  };

  const handleArchive = async () => {
    if (!selectedProject?.id) {
      toast.error("Please select a project to archive");
      return;
    }

    setArchiving(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/project/${selectedProject.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ archived: true }),
      });

      if (!response.ok) throw new Error("Failed to archive project");

      const data = await response.json();
      if (data.success) {
        toast.success("Project archived successfully!");
        setShowConfirmDialog(false);
        setSelectedProject(null);
        fetchProjects(false, true);
      } else {
        toast.error(data.message || "Failed to archive project");
      }
    } catch {
      toast.error("Failed to archive project. Please try again.");
    } finally {
      setArchiving(false);
    }
  };

  const handleUpdateManager = async () => {
    if (!projectToUpdate?.id || !selectedManager) {
      toast.error("Please select a project and a manager.");
      return;
    }

    setUpdatingManager(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/project/${projectToUpdate.id}/update-manager`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ managerId: selectedManager }),
      });

      if (!response.ok) throw new Error("Failed to update project manager");

      const data = await response.json();
      if (data.success) {
        toast.success("Project manager updated successfully!");
        setShowUpdateManagerDialog(false);
        setProjectToUpdate(null);
        fetchProjects(false, true);
      } else {
        toast.error(data.message || "Failed to update project manager");
      }
    } catch {
      toast.error("Failed to update project manager. Please try again.");
    } finally {
      setUpdatingManager(false);
    }
  };

  const projects = projectList.filter((p: any) => p.id !== "all");

  return (
    <Box sx={{ p: 3, textAlign: "center" }}>
      <Typography variant="h5" fontWeight={600} gutterBottom>
        Manage Projects
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
Select a project to archive, update the manager, or manage external users. Archived projects can be restored at any time.      </Typography>

      <TableContainer component={Paper} sx={{ borderRadius: 2, mx: "auto" }}>
        <Table size="small">
                    <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 600 }}>Project Name</TableCell>
              {isAdmin && <TableCell sx={{ fontWeight: 600 }}>Project Manager</TableCell>}
              <TableCell sx={{ fontWeight: 600 }}>Start Date</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>End Date</TableCell>
              {isAdmin && (
                <TableCell sx={{ fontWeight: 600 }} align="center">
                  Action
                </TableCell>
              )}
              <TableCell sx={{ fontWeight: 600 }} align="right">
                Archive
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {projects.length === 0 ? (
              <TableRow>
                                <TableCell colSpan={isAdmin ? 7 : 5} align="center" sx={{ py: 4 }}>
                  <Typography color="text.secondary">No projects found</Typography>
                </TableCell>
              </TableRow>
            ) : (
              projects.map((project: any) => (
                                <TableRow key={project.id} hover>
                  <TableCell>{project.name}</TableCell>
                  {isAdmin && <TableCell>{projectManagers.find((manager) => manager.id === project.managerId)?.name || "N/A"}</TableCell>}
                  <TableCell>
                    {project.startDate ? new Date(project.startDate).toLocaleDateString() : "-"}
                  </TableCell>
                  <TableCell>
                    {project.endDate ? new Date(project.endDate).toLocaleDateString() : "-"}
                  </TableCell>
                  {isAdmin && (
                    <TableCell align="center">
                      <Box sx={{ display: "flex", gap: 0.5, justifyContent: "center", alignItems: "center" }}>
                        <Tooltip title="Update Manager">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => handleUpdateManagerClick(project)}
                          >
                            <EditRounded fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="External Users">
                          <IconButton
                            size="small"
                            color="success"
                            onClick={() => setExternalUsersProject(project)}
                          >
                            <GroupAddRounded fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  )}
                  <TableCell align="right">
                    <Tooltip title="Archive">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleArchiveClick(project)}
                      >
                        <ArchiveRounded fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Archive Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onClose={() => setShowConfirmDialog(false)} maxWidth="xs" fullWidth>
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
              Archive Project?
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography color="text.secondary">
            Are you sure you want to archive <strong>"{selectedProject?.name}"</strong>? The project will be moved to
            the archived projects list and can be restored later.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setShowConfirmDialog(false)} variant="outlined" sx={{ borderRadius: 5 }}>
            Cancel
          </Button>
          <Button
            onClick={handleArchive}
            variant="contained"
            color="error"
            disabled={archiving}
            startIcon={archiving ? <CircularProgress size={16} color="inherit" /> : <ArchiveRounded />}
            sx={{ borderRadius: 5 }}
          >
            {archiving ? "Archiving..." : "Archive"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Update Manager Dialog */}
      <Dialog open={showUpdateManagerDialog} onClose={() => setShowUpdateManagerDialog(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Update Project Manager</DialogTitle>
        <DialogContent>
          <Typography sx={{ mb: 2 }}>
            Select a new project manager for <strong>"{projectToUpdate?.name}"</strong>.
          </Typography>
          <FormControl fullWidth>
            <InputLabel id="manager-select-label">Project Manager</InputLabel>
            <Select
              labelId="manager-select-label"
              id="manager-select"
              value={selectedManager}
              label="Project Manager"
              onChange={(e) => setSelectedManager(e.target.value)}
            >
              {projectManagers.map((manager) => (
                <MenuItem key={manager.id} value={manager.id}>
                  {manager.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setShowUpdateManagerDialog(false)} variant="outlined" sx={{ borderRadius: 5 }}>
            Cancel
          </Button>
          <Button
            onClick={handleUpdateManager}
            variant="contained"
            color="primary"
            disabled={updatingManager}
            startIcon={updatingManager ? <CircularProgress size={16} color="inherit" /> : <EditRounded />}
            sx={{ borderRadius: 5 }}
          >
            {updatingManager ? "Updating..." : "Update"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Manage External Users Modal */}
      <ManageExternalUsersModal
        open={!!externalUsersProject}
        onClose={() => setExternalUsersProject(null)}
        projectId={externalUsersProject?.id || ""}
        projectName={externalUsersProject?.name || ""}
      />
    </Box>
  );
};

// Use this when PMProvider is already available (e.g., PM dashboard)
export { ArchiveProjectsContent };

// Use this when PMProvider is NOT available (e.g., Admin dashboard)
const ArchiveProjects = () => {
  return (
    <PMProvider>
      <ArchiveProjectsContent />
    </PMProvider>
  );
};

export default ArchiveProjects;
