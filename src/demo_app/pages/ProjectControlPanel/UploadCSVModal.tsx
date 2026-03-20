import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Typography,
  Box,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  CircularProgress,
} from "@mui/material";
import { Close as CloseIcon, UploadFileRounded } from "@mui/icons-material";
import type { Project } from "../types";

type UploadCSVProps = {
  open: boolean;
  onClose: () => void;
  setFileSelected: (value: boolean) => void;
  fileLoading: boolean;
  fileSelected: boolean;
  onUpload: () => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  mode: "new" | "existing" | null;
  projects: Project[];
  newProjectName: string;
  setNewProjectName: (value: string) => void;
  selectedProjectId: string;
  setSelectedProjectId: (value: string) => void;
  managerId?: string;
  setManagerId?: (value: string) => void;
  isAdmin?: boolean;
};

interface ProjectManager {
  id: string;
  name: string;
  email: string;
}

const UploadCSVModal: React.FC<UploadCSVProps> = ({
  open,
  onClose,
  setFileSelected,
  onChange,
  fileLoading,
  fileSelected,
  onUpload,
  mode,
  projects,
  newProjectName,
  setNewProjectName,
  selectedProjectId,
  setSelectedProjectId,
  managerId,
  setManagerId,
  isAdmin = false
}) => {
  const [projectManagers, setProjectManagers] = React.useState<ProjectManager[]>([]);
  const [loadingManagers, setLoadingManagers] = React.useState(false);

  React.useEffect(() => {
    if (open && mode === 'new') {
      const fetchProjectManagers = async () => {
        setLoadingManagers(true);
        try {
          const token = localStorage.getItem("token");
          const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/user/project-managers`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const result = await response.json();
            setProjectManagers(result.data || []);
          }
        } catch (error) {
          console.error("Error fetching project managers:", error);
        } finally {
          setLoadingManagers(false);
        }
      };

      fetchProjectManagers();
    }
  }, [open, mode]);

  const handleClose = () => {
    setFileSelected(false);
    onClose();
  };

  const getTitle = () => {
    if (mode === "new") return "Import CSV (New Project)";
    if (mode === "existing") return "Import CSV (Existing Project)";
    return "Upload CSV File";
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: 1,
          borderColor: "divider",
          pb: 2,
        }}
      >
        <Typography variant="h6" fontWeight={600} sx={{ fontSize: { xs: '18px', sm: '20px', md: '22px' } }}>
          {getTitle()}
        </Typography>
        <IconButton onClick={handleClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ py: { xs: 2, sm: 3 }, px: { xs: 2, sm: 3 } }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {/* Mode Specific Inputs */}
          {mode === "new" && (
            <Box sx={{ display: "flex", gap: 2, flexDirection: { xs: "column", md: "row" } }}>
              <TextField
                fullWidth
                label="Project Name"
                variant="outlined"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                placeholder="Enter new project name"
                helperText="This name will override the project name in the CSV file"
              />
              {isAdmin && (
                <FormControl fullWidth>
                  <InputLabel id="manager-select-label">Project Manager *</InputLabel>
                  <Select
                    labelId="manager-select-label"
                    value={managerId || ''}
                    label="Project Manager *"
                    onChange={(e: any) => setManagerId && setManagerId(e.target.value)}
                    disabled={loadingManagers}
                    MenuProps={{
                      disableScrollLock: true,
                      style: { zIndex: 1400 }
                    }}
                  >
                    {loadingManagers ? (
                      <MenuItem disabled value="">Loading...</MenuItem>
                    ) : projectManagers.length === 0 ? (
                      <MenuItem disabled value="">No Project Managers available</MenuItem>
                    ) : (
                      projectManagers.map((pm) => (
                        <MenuItem key={pm.id} value={pm.id}>
                          {pm.name} ({pm.email})
                        </MenuItem>
                      ))
                    )}
                  </Select>
                </FormControl>
              )}
            </Box>
          )}

          {mode === "existing" && (
            <FormControl fullWidth>
              <InputLabel id="project-select-label">Select Project</InputLabel>
              <Select
                labelId="project-select-label"
                value={selectedProjectId}
                label="Select Project"
                onChange={(e) => setSelectedProjectId(e.target.value)}
              >
                {projects.map((p) => (
                  <MenuItem key={p.id} value={p.id}>
                    {p.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          {/* Instructions */}
          <Typography variant="body1" fontWeight={500} textAlign="center" color="text.primary">
            Please read the instructions carefully before uploading your CSV file
          </Typography>

          {/* Do's and Don'ts */}

          <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 2 }}>
            {/* Do's */}
            <Box
              sx={{
                bgcolor: "success.50",
                border: 1,
                borderColor: "status.complete.text",
                borderRadius: 2,
                p: 2.5,
                height: "100%",
                flex: 1,
                backgroundColor: "status.complete.bg",
              }}
            >
              <Typography variant="subtitle1" fontWeight={700} color="status.complete.text" sx={{ mb: 2 }}>
                Do's
              </Typography>
              <Box
                component="ul"
                sx={{
                  m: 0,
                  pl: 2,

                  "& li": {
                    fontSize: "0.875rem",
                    lineHeight: 1.6,
                    mb: 1,
                    color: "status.complete.text",
                    position: "relative",

                    "&::before": {
                      content: '"•"',
                      color: "status.complete.text",
                      fontWeight: "bold",
                      display: "inline-block",
                      width: "1em",
                      marginLeft: "-1em",
                    },
                  },
                }}
              >
                <li>Use the official 1iQ template</li>
                <li>
                  Fill all required columns (Project Name, Task Name, Milestone Name, Team Responsible, Anticipated
                  Start Date, Anticipated days - consider weekdays)
                </li>
                <li>Format dates as MM/DD/YY</li>
                <li>Enter budget & change order as whole numbers only</li>
                <li>Assign valid team members only</li>
                <li>Conflicting team members will be neglected</li>
                <li>
                  Before assigning any team or task, it is mandatory to ensure that all team members are enrolled in 1iQ
                </li>
                <li>Failure to enroll a member will result in the assigned task being automatically unassigned</li>
              </Box>
            </Box>

            {/* Don'ts */}
            <Box
              sx={{
                border: 1,
                borderColor: "status.rejected.text",
                borderRadius: 2,
                p: 3,
                height: "100%",
                flex: 1,
                backgroundColor: "status.rejected.bg",
              }}
            >
              <Typography variant="subtitle1" fontWeight={700} color="status.rejected.text" sx={{ mb: 2 }}>
                Don'ts
              </Typography>
              <Box
                component="ul"
                sx={{
                  m: 0,
                  pl: 2,
                  "& li": {
                    color: "text.secondary",
                    fontSize: "0.875rem",
                    lineHeight: 1.6,
                    mb: 1,
                    position: "relative",

                    "&::before": {
                      content: '"•"',
                      color: "status.rejected.text",
                      fontWeight: "bold",
                      display: "inline-block",
                      width: "1em",
                      marginLeft: "-1em",
                    },
                  },
                }}
              >
                <li>Don't modify or delete column headers</li>
                <li>Don't leave required fields empty</li>
                <li>Don't use special characters in budgets</li>
                <li>Don't upload duplicate task names for single project. It can override the data</li>
              </Box>
            </Box>
          </Box>

          {/* File Upload Zone */}
          <Box
            sx={{
              mt: 2,
              border: "2px dashed",
              borderColor: fileSelected ? "primary.main" : "divider",
              borderRadius: 2,
              p: 4,
              textAlign: "center",
              bgcolor: fileSelected ? "primary.50" : "background.default",
              cursor: "pointer",
              transition: "all 0.2s ease",
              "&:hover": {
                borderColor: "primary.main",
                bgcolor: "action.hover",
              },
            }}
            component="label"
          >
            <input type="file" accept=".csv" onChange={onChange} style={{ display: "none" }} />
            <UploadFileRounded
              sx={{
                fontSize: 48,
                color: fileSelected ? "primary.main" : "text.secondary",
                mb: 1,
              }}
            />
            <Typography variant="body1" fontWeight={500} color="text.primary">
              {fileSelected ? "File Selected" : "Click to upload or drag and drop"}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              CSV files only
            </Typography>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2, borderTop: 1, borderColor: "divider" }}>
        <Button onClick={handleClose} variant="outlined" color="inherit">
          Cancel
        </Button>
        <Button
          onClick={onUpload}
          variant="contained"
          disabled={!fileSelected || fileLoading}
          startIcon={fileLoading ? <CircularProgress size={18} color="inherit" /> : undefined}
        >
          {fileLoading ? "Uploading..." : fileSelected ? "Upload CSV" : "Please Select a File"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UploadCSVModal;
