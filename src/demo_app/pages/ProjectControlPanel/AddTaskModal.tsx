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
  CircularProgress,
  InputAdornment,
  Divider,
} from "@mui/material";
import { CloseRounded, CheckRounded } from "@mui/icons-material";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-toastify";
import type { Milestone, Task, Organization } from "./ControlPanel.types";

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
}

interface AddTaskModalProps {
  open: boolean;
  onClose: () => void;
  projectId: string;
  projectName: string;
  organizations: Organization[];
  milestones: Milestone[];
  tasksList: Task[];
  onSave: (payload: FormData & { projectId: string }) => Promise<void>;
  organizationUsers?: any[];
  onMilestoneCreated?: (milestone: Milestone) => void;
}

const initialFormData: FormData = {
  name: "",
  description: "",
  assignee: "",
  startDate: "",
  endDate: "",
  anticipatedBudget: "0",
  changeOrder: "0",
  milestone: "",
  selectedTeam: "",
  selectedOrganization: "",
  selectedDependency: "",
};

const AddTaskModal: React.FC<AddTaskModalProps> = ({
  open,
  onClose,
  projectId,
  projectName,
  tasksList,
  organizations,
  onSave,
  onMilestoneCreated,
}) => {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [saving, setSaving] = useState(false);
  const [newMilestoneName, setNewMilestoneName] = useState("");
  const [creatingMilestone, setCreatingMilestone] = useState(false);
  const [divisionMembers, setDivisionMembers] = useState<any[]>([]);
  const [fetchingMembers, setFetchingMembers] = useState(false);
  const [fetchedMilestones, setFetchedMilestones] = useState<Milestone[]>([]);
  const [fetchingMilestones, setFetchingMilestones] = useState(false);

  const token = localStorage.getItem("token");

  // Fetch milestones from API when modal opens
  useEffect(() => {
    const fetchMilestones = async () => {
      if (!open || !projectId) return;

      setFetchingMilestones(true);
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/milestone/all-milestone-by-project/${projectId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          setFetchedMilestones(data.data || []);
        }
      } catch (error) {
        console.error("Failed to fetch milestones:", error);
      } finally {
        setFetchingMilestones(false);
      }
    };

    fetchMilestones();
  }, [open, projectId, token]);

  // Fetch organization users when an organization is selected
  useEffect(() => {
    const fetchOrgUsers = async () => {
      if (!formData.selectedOrganization) {
        setDivisionMembers([]);
        return;
      }

      setFetchingMembers(true);
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/project-external-user/${projectId}/organizations/${formData.selectedOrganization}/users`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          setDivisionMembers(data.data || []);
        } else {
          setDivisionMembers([]);
        }
      } catch (error) {
        console.error("Failed to fetch organization users:", error);
        setDivisionMembers([]);
      } finally {
        setFetchingMembers(false);
      }
    };

    fetchOrgUsers();
  }, [formData.selectedOrganization, token]);


  const handleCreateMilestone = async () => {
    if (!newMilestoneName.trim()) {
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
            projectId,
            name: newMilestoneName.trim(),
            active: true
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

      // Add the new milestone to the fetched list
      setFetchedMilestones((prev) => [...prev, newMilestone]);

      // Notify parent to refresh milestones and auto-select the new one
      if (onMilestoneCreated) {
        onMilestoneCreated(newMilestone);
      }
      // Auto-select the newly created milestone
      handleFormChange("milestone", newMilestone.id);
    } catch (error) {
      console.error("Failed to create milestone:", error);
      toast.error("Failed to create milestone");
    } finally {
      setCreatingMilestone(false);
    }
  };

  const handleClose = () => {
    setFormData(initialFormData);
    onClose();
  };

  const handleFormChange = (field: keyof FormData, value: string) => {
    const updated = { ...formData, [field]: value };

    // Clear assignee and reset members when organization changes
    if (field === "selectedOrganization") {
      updated.assignee = "";
      setDivisionMembers([]);
    }
    setFormData(updated);
  };

  const handleSave = async () => {
    if (
      !formData.name.trim() ||
      !formData.selectedOrganization ||
      !formData.milestone ||
      !formData.startDate ||
      !formData.endDate
    ) {
      toast.error("Please fill all required fields");
      return;
    }
    setSaving(true);
    try {
      await onSave({ ...formData, projectId });
      handleClose();
    } finally {
      setSaving(false);
    }
  };


  // Organization options
  const orgOptions = useMemo(() => {
    return organizations.map((org) => ({ value: org.id, label: org.name }));
  }, [organizations]);

  // Show users from the selected organization
  const assigneeOptions = useMemo(() => {
    if (!formData.selectedOrganization) return [];
    return divisionMembers.map(u => ({ value: u.id, label: u.name }));
  }, [formData.selectedOrganization, divisionMembers]);


  const dependentTaskOptions = useMemo(() => {
    return tasksList.map((t) => ({ value: t.id, label: t.name }));
  }, [tasksList]);

  const milestoneOptions = useMemo(() => {
    return fetchedMilestones.map((m) => ({ value: m.id, label: m.name }));
  }, [fetchedMilestones]);


  const isFormValid =
    formData.name.trim().length > 0 &&
    !!formData.selectedOrganization &&
    !!formData.milestone &&
    !!formData.startDate &&
    !!formData.endDate;

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
        <Box>
          <Typography variant="h6" fontWeight={600}>
            Add New Task
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Project: {projectName}
          </Typography>
        </Box>
        <IconButton onClick={handleClose} size="small">
          <CloseRounded />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ py: 3 }}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              label="Task Name"
              value={formData.name}
              onChange={(e) => handleFormChange("name", e.target.value)}
              required
              placeholder="Enter task name"
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
              placeholder="Enter task description (optional)"
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <FormControl fullWidth required>
              <InputLabel>Organization</InputLabel>
              <Select
                value={formData.selectedOrganization}
                label="Organization"
                onChange={(e) => handleFormChange("selectedOrganization", e.target.value)}
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
            <FormControl fullWidth key={`assignee-form-${formData.selectedOrganization}`}>
              <InputLabel>Assignee</InputLabel>
              <Select
                value={formData.assignee}
                label="Assignee"
                disabled={!formData.selectedOrganization || fetchingMembers}
                onChange={(e) => handleFormChange("assignee", e.target.value)}
                endAdornment={fetchingMembers ? <CircularProgress size={20} sx={{ mr: 2 }} /> : null}
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
                disabled={fetchingMilestones}
                onChange={(e) => {
                  if (e.target.value !== "__add_new__") {
                    handleFormChange("milestone", e.target.value);
                  }
                }}
                MenuProps={{ autoFocus: false }}
                endAdornment={fetchingMilestones ? <CircularProgress size={20} sx={{ mr: 2 }} /> : null}
              >
                {milestoneOptions.map((m) => (
                  <MenuItem key={m.value} value={m.value}>
                    {m.label}
                  </MenuItem>
                ))}
                <Divider />
                <Box
                  sx={{ p: 1, display: "flex", alignItems: "center", gap: 1 }}
                  onKeyDown={(e) => e.stopPropagation()}
                >
                  <TextField
                    size="small"
                    placeholder="New Milestone"
                    value={newMilestoneName}
                    onChange={(e) => setNewMilestoneName(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    onKeyDown={(e) => {
                      e.stopPropagation();
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleCreateMilestone();
                      }
                    }}
                    fullWidth
                  />
                  <IconButton
                    size="small"
                    color="primary"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCreateMilestone();
                    }}
                    disabled={creatingMilestone || !newMilestoneName.trim()}
                  >
                    {creatingMilestone ? <CircularProgress size={20} /> : <CheckRounded />}
                  </IconButton>
                </Box>
              </Select>
            </FormControl>
          </Grid>

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
                  inputProps: { min: 0 },
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
                  inputProps: { min: 0 },
                },
              }}
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 2, borderTop: 1, borderColor: "divider" }}>
        <Button onClick={handleClose} variant="outlined">
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={saving || !isFormValid}
        >
          {saving ? <CircularProgress size={20} /> : "Create Task"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddTaskModal;
