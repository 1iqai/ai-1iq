import { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Typography,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Chip,
  CircularProgress,
  LinearProgress,
  InputAdornment,
  Divider,
} from "@mui/material";
import {
  CloseRounded,
  EditRounded,
  FlagRounded,
  AddRounded,
} from "@mui/icons-material";
import { toast } from "react-toastify";
import { capitalCase } from "change-case";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { formatDate } from "../../utility/dateCalculations";
import { calculateProgress } from "../../utility/analyticsCalculations";
import { stringToColor } from "../../utility/uiUtility";
import type { Milestone, Task, Organization, TaskPriority } from "./ControlPanel.types";

interface TaskDetailsModalProps {
  open: boolean;
  onClose: () => void;
  task: Task | null;
  organizations: Organization[];
  milestones: Milestone[];
  tasksList: Task[];
  organizationUsers: any[];
  onSave: (taskId: string, payload: FormData) => Promise<void>;
  isProjectManager: boolean;
  onMilestoneCreated?: (milestone: Milestone) => void;
}

interface FormData {
  name: string;
  description: string;
  assignee: string;
  startDate: string;
  endDate: string;
  anticipatedBudget: string;
  changeOrder: string;
  milestone: string;
  selectedTeam: string;
  selectedOrganization: string;
  selectedDependency: string;
  status: string;
  priority: TaskPriority | "";
}

const TaskDetailsModal: React.FC<TaskDetailsModalProps> = ({
  open,
  onClose,
  task,
  organizations,
  milestones,
  tasksList,
  onSave,
  isProjectManager,
  onMilestoneCreated,
  // organizationUsers,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<FormData | null>(null);
  const [saving, setSaving] = useState(false);
  const [showAddMilestone, setShowAddMilestone] = useState(false);
  const [newMilestoneName, setNewMilestoneName] = useState("");
  const [creatingMilestone, setCreatingMilestone] = useState(false);
  const [orgUsers, setOrgUsers] = useState<any[]>([]);
  const [fetchingOrgUsers, setFetchingOrgUsers] = useState(false);
  const token = localStorage.getItem("token");

  const handleCreateMilestone = async () => {
    if (!newMilestoneName.trim() || !task?.milestone?.projectId) {
      toast.error("Please enter a milestone name");
      return;
    }

    setCreatingMilestone(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/milestone/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            projectId: task.milestone.projectId,
            name: newMilestoneName.trim(),
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create milestone");
      }

      const data = await response.json();
      const newMilestone = data.data;

      toast.success("Milestone created successfully");
      setNewMilestoneName("");
      setShowAddMilestone(false);

      if (onMilestoneCreated) {
        onMilestoneCreated(newMilestone);
      }
      if (formData) {
        handleFormChange("milestone", newMilestone.id);
      }
    } catch (error) {
      console.error("Failed to create milestone:", error);
      toast.error("Failed to create milestone");
    } finally {
      setCreatingMilestone(false);
    }
  };

  // Initialize form data when task changes
  useEffect(() => {
    if (task) {
      setFormData({
        name: task.name,
        description: task.description || "",
        assignee: task.assignee || "",
        startDate: task.startDate,
        endDate: task.endDate,
        anticipatedBudget: task.anticipatedBudget?.toString() || "0",
        changeOrder: task.changeOrder?.toString() || "0",
        milestone: task.milestone?.id || "",
        selectedTeam: task.teamResponsibleId || "",
        selectedOrganization: task.organizationId || "",
        selectedDependency: task.dependentDetails?.[0]?.id || "",
        status: task.status,
        priority: task.priority || "",
      });
      setIsEditing(false);
    }
  }, [task]);

  const handleSave = async () => {
    if (!task || !formData) return;
    setSaving(true);
    try {
      await onSave(task.id, formData);
      setIsEditing(false);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    setIsEditing(false);
    onClose();
  };

  const handleFormChange = (field: keyof FormData, value: string) => {
    if (!formData) return;
    const updated = { ...formData, [field]: value };
    if (field === "selectedOrganization" && formData.assignee) {
      // Clear assignee when organization changes since users will be different
      updated.assignee = "";
    }
    setFormData(updated);
  };

  // Fetch users when selected organization changes
  useEffect(() => {
    const fetchOrgUsers = async () => {
      if (!formData?.selectedOrganization) {
        setOrgUsers([]);
        return;
      }
      setFetchingOrgUsers(true);
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/project-external-user/${task?.milestone?.projectId}/organizations/${formData.selectedOrganization}/users`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (response.ok) {
          const data = await response.json();
          setOrgUsers(data.data || []);
        }
      } catch (error) {
        console.error("Failed to fetch organization users:", error);
      } finally {
        setFetchingOrgUsers(false);
      }
    };
    fetchOrgUsers();
  }, [formData?.selectedOrganization, task?.milestone?.projectId, token]);

  // Get assignee options from organization users
  const assigneeOptions = useMemo(() => {
    return orgUsers.map((u: any) => ({ value: u.id, label: u.name }));
  }, [orgUsers]);

  const dependentTaskOptions = useMemo(() => {
    return tasksList
      .filter((t) => t.id !== task?.id)
      .map((t) => ({ value: t.id, label: t.name }));
  }, [tasksList, task?.id]);

  const milestoneOptions = useMemo(() => {
    return milestones.map((m) => ({ value: m.id, label: m.name }));
  }, [milestones]);

  const orgOptions = useMemo(() => {
    return organizations.map((o) => ({ value: o.id, label: o.name }));
  }, [organizations]);

  if (!task) return null;

  const progress = calculateProgress(task.startDate, task.endDate);

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
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box
            sx={{
              width: 4,
              height: 40,
              borderRadius: 1,
              bgcolor: stringToColor(task.milestoneId),
            }}
          />
          <Typography variant="h6" fontWeight={600}>
            {isEditing ? "Edit Task" : "Task Details"}
          </Typography>
        </Box>
        <IconButton onClick={handleClose} size="small">
          <CloseRounded />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ py: 3 }}>
        {isEditing && formData ? (
          // Edit Form
          <Grid container spacing={3}>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Task Name"
                value={formData.name}
                onChange={(e) => handleFormChange("name", e.target.value)}
                required
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Description"
                value={formData.description}
                onChange={(e) => handleFormChange("description", e.target.value)}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth required>
                <InputLabel>Organization</InputLabel>
                <Select
                  value={formData.selectedOrganization}
                  label="Organization"
                  onChange={(e) =>
                    handleFormChange("selectedOrganization", e.target.value)
                  }
                >
                  {orgOptions.map((o) => (
                    <MenuItem key={o.value} value={o.value}>
                      {o.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth>
                <InputLabel>Assignee</InputLabel>
                <Select
                  value={formData.assignee}
                  label="Assignee"
                  disabled={!formData.selectedOrganization || fetchingOrgUsers}
                  onChange={(e) => handleFormChange("assignee", e.target.value)}
                  endAdornment={fetchingOrgUsers ? <CircularProgress size={20} sx={{ mr: 2 }} /> : null}
                >
                  <MenuItem value="">Unassigned</MenuItem>
                  {assigneeOptions.map((a) => (
                    <MenuItem key={a.value} value={a.value}>
                      {a.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth required>
                <InputLabel>Milestone</InputLabel>
                <Select
                  value={formData.milestone}
                  label="Milestone"
                  onChange={(e) => {
                    if (e.target.value !== "__add_new__") {
                      handleFormChange("milestone", e.target.value);
                    }
                  }}
                >
                  {milestoneOptions.map((m) => (
                    <MenuItem key={m.value} value={m.value}>
                      {m.label}
                    </MenuItem>
                  ))}
                  <Divider />
                  <MenuItem
                    value="__add_new__"
                    onClick={() => setShowAddMilestone(true)}
                    sx={{ color: "primary.main" }}
                  >
                    <AddRounded fontSize="small" sx={{ mr: 1 }} />
                    Add New Milestone
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Add Milestone Dialog */}
            <Dialog
              open={showAddMilestone}
              onClose={() => {
                setShowAddMilestone(false);
                setNewMilestoneName("");
              }}
              maxWidth="xs"
              fullWidth
            >
              <DialogTitle>Add New Milestone</DialogTitle>
              <DialogContent>
                <TextField
                  autoFocus
                  fullWidth
                  label="Milestone Name"
                  value={newMilestoneName}
                  onChange={(e) => setNewMilestoneName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !creatingMilestone) {
                      handleCreateMilestone();
                    }
                  }}
                  sx={{ mt: 1 }}
                />
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={() => {
                    setShowAddMilestone(false);
                    setNewMilestoneName("");
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateMilestone}
                  variant="contained"
                  disabled={creatingMilestone || !newMilestoneName.trim()}
                >
                  {creatingMilestone ? <CircularProgress size={20} /> : "Create"}
                </Button>
              </DialogActions>
            </Dialog>

            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth>
                <InputLabel>Dependency</InputLabel>
                <Select
                  value={formData.selectedDependency}
                  label="Dependency"
                  onChange={(e) =>
                    handleFormChange("selectedDependency", e.target.value)
                  }
                >
                  <MenuItem value="">None</MenuItem>
                  {dependentTaskOptions.map((t) => (
                    <MenuItem key={t.value} value={t.value}>
                      {t.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth>
                <InputLabel>Priority</InputLabel>
                <Select
                  value={formData.priority}
                  label="Priority"
                  onChange={(e) =>
                    handleFormChange("priority", e.target.value)
                  }
                >
                  <MenuItem value="">Not Set</MenuItem>
                  <MenuItem value="Critical">Critical</MenuItem>
                  <MenuItem value="High">High</MenuItem>
                  <MenuItem value="Medium">Medium</MenuItem>
                  <MenuItem value="Low">Low</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Box>
                <Typography variant="body2" color="text.secondary" mb={1}>
                  Start Date *
                </Typography>
                <DatePicker
                  selected={
                    formData.startDate ? new Date(formData.startDate + "T00:00:00") : null
                  }
                  onChange={(date) => {
                    if (date) {
                      const year = date.getFullYear();
                      const month = String(date.getMonth() + 1).padStart(2, "0");
                      const day = String(date.getDate()).padStart(2, "0");
                      handleFormChange("startDate", `${year}-${month}-${day}`);
                    } else {
                      handleFormChange("startDate", "");
                    }
                  }}
                  dateFormat="MM/dd/yyyy"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm"
                  placeholderText="Select start date"
                />
              </Box>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Box>
                <Typography variant="body2" color="text.secondary" mb={1}>
                  Due Date *
                </Typography>
                <DatePicker
                  selected={formData.endDate ? new Date(formData.endDate + "T00:00:00") : null}
                  onChange={(date) => {
                    if (date) {
                      const year = date.getFullYear();
                      const month = String(date.getMonth() + 1).padStart(2, "0");
                      const day = String(date.getDate()).padStart(2, "0");
                      handleFormChange("endDate", `${year}-${month}-${day}`);
                    } else {
                      handleFormChange("endDate", "");
                    }
                  }}
                  dateFormat="MM/dd/yyyy"
                  minDate={
                    formData.startDate ? new Date(formData.startDate + "T00:00:00") : undefined
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm"
                  placeholderText="Select due date"
                />
              </Box>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                type="number"
                label="Budget"
                value={formData.anticipatedBudget}
                onChange={(e) =>
                  handleFormChange("anticipatedBudget", e.target.value)
                }
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">$</InputAdornment>
                    ),
                  },
                }}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                type="number"
                label="Change Order"
                value={formData.changeOrder}
                onChange={(e) => handleFormChange("changeOrder", e.target.value)}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">$</InputAdornment>
                    ),
                  },
                }}
              />
            </Grid>
          </Grid>
        ) : (
          // Read-only display
          <Grid container spacing={3}>
            <Grid size={{ xs: 12 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Task Name
              </Typography>
              <Typography variant="body1" fontWeight={500}>
                {task.name}
              </Typography>
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Project
              </Typography>
              <Typography variant="body1">
                {task.milestone?.project?.name || "-"}
              </Typography>
            </Grid>

            {task.description && (
              <Grid size={{ xs: 12 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Description
                </Typography>
                <Typography variant="body1">{task.description}</Typography>
              </Grid>
            )}

            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Status
              </Typography>
              <Chip
                label={capitalCase(task.status)}
                size="small"
                sx={{
                  mt: 0.5,
                  ...getStatusChipStyles(task.status),
                }}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Priority
              </Typography>
              {task.priority ? (
                <Chip
                  label={task.priority}
                  size="small"
                  sx={{
                    mt: 0.5,
                    ...getPriorityChipStyles(task.priority),
                  }}
                />
              ) : (
                <Typography variant="body1" color="text.secondary">
                  Not Set
                </Typography>
              )}
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Progress
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}>
                <LinearProgress
                  variant="determinate"
                  value={progress}
                  sx={{ flex: 1, height: 8, borderRadius: 4 }}
                />
                <Typography variant="body2" fontWeight={500}>
                  {progress}%
                </Typography>
              </Box>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Organization
              </Typography>
              <Typography variant="body1">
                {task.organizationName || "Unassigned"}
              </Typography>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Assignee
              </Typography>
              <Typography variant="body1">
                {task.assigneeUser || "Unassigned"}
              </Typography>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Milestone
              </Typography>
              <Typography variant="body1">
                {task.milestone?.name || "Unassigned"}
              </Typography>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Dependency
              </Typography>
              <Typography variant="body1">
                {task.dependentDetails?.[0]?.name || "-"}
              </Typography>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Issues
              </Typography>
              {task.issues && task.issues.length > 0 ? (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <FlagRounded color="error" fontSize="small" />
                  <Typography variant="body1" color="error.main">
                    {task.issues.length} issue(s)
                  </Typography>
                </Box>
              ) : (
                <Typography variant="body1">No issues</Typography>
              )}
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Start Date
              </Typography>
              <Typography variant="body1">{formatDate(task.startDate)}</Typography>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Due Date
              </Typography>
              <Typography variant="body1">{formatDate(task.endDate)}</Typography>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Budget
              </Typography>
              <Typography variant="body1">
                ${task.anticipatedBudget?.toLocaleString() || 0}
              </Typography>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Change Order
              </Typography>
              <Typography variant="body1">
                ${task.changeOrder?.toLocaleString() || 0}
              </Typography>
            </Grid>
          </Grid>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2, borderTop: 1, borderColor: "divider" }}>
        {isEditing ? (
          <>
            <Button onClick={() => setIsEditing(false)} variant="outlined">
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              variant="contained"
              disabled={saving || !formData?.name.trim() || !formData?.selectedOrganization || !formData?.milestone}
            >
              {saving ? <CircularProgress size={20} /> : "Save"}
            </Button>
          </>
        ) : (
          <>
            <Button onClick={handleClose} variant="outlined">
              Close
            </Button>
            {isProjectManager && (
              <Button
                onClick={() => setIsEditing(true)}
                variant="contained"
                startIcon={<EditRounded />}
              >
                Edit
              </Button>
            )}
          </>
        )}
      </DialogActions>
    </Dialog>
  );
};

// Helper function to get status chip styles
const getStatusChipStyles = (status: string) => {
  const statusLower = status.toLowerCase();
  if (statusLower.includes("complete") && !statusLower.includes("reject")) {
    return {
      bgcolor: "success.light",
      color: "success.dark",
    };
  }
  if (statusLower.includes("progress")) {
    return {
      bgcolor: "info.light",
      color: "info.dark",
    };
  }
  if (statusLower.includes("reject")) {
    return {
      bgcolor: "error.light",
      color: "error.dark",
    };
  }
  return {
    bgcolor: "grey.200",
    color: "grey.700",
  };
};

// Helper function to get priority chip styles
const getPriorityChipStyles = (priority: string) => {
  switch (priority) {
    case "Critical":
      return {
        bgcolor: "#fef2f2",
        color: "#dc2626",
        border: "1px solid #fecaca",
      };
    case "High":
      return {
        bgcolor: "#fff7ed",
        color: "#ea580c",
        border: "1px solid #fed7aa",
      };
    case "Medium":
      return {
        bgcolor: "#eff6ff",
        color: "#2563eb",
        border: "1px solid #bfdbfe",
      };
    case "Low":
      return {
        bgcolor: "#f0fdf4",
        color: "#16a34a",
        border: "1px solid #bbf7d0",
      };
    default:
      return {
        bgcolor: "#f3f4f6",
        color: "#6b7280",
        border: "1px solid #e5e7eb",
      };
  }
};

export default TaskDetailsModal;
