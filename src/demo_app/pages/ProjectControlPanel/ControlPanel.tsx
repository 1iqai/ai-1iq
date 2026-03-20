import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";

import { capitalCase } from "change-case";

import React from "react";

import "react-datepicker/dist/react-datepicker.css";
import type { Milestone, Task, Organization } from "./ControlPanel.types";

// MUI Imports
import { DataGrid, GridRowModes, GridActionsCellItem, GridRowEditStopReasons, GridFooterContainer, GridPagination } from "@mui/x-data-grid";
import type {
  GridColDef,
  GridRenderCellParams,
  GridRowModesModel,
  GridRowId,
  GridEventListener,
} from "@mui/x-data-grid";

// Extend FooterPropsOverrides to allow custom props
declare module "@mui/x-data-grid" {
  interface FooterPropsOverrides {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    selectedProject: any;
    settingPriorities: boolean;
    handleSetPriorities: () => void;
  }
}

import {
  Box,
  Typography,
  Button,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
  Chip,
  CircularProgress,
  useTheme as useMuiTheme,
  Select,
  MenuItem,
  Menu,
  ListItemIcon,
  ListItemText,
  Divider,
  TextField,
  IconButton,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import type { Theme } from "@mui/material/styles";
import {
  AddRounded,
  UploadFileRounded,
  EditRounded,
  DeleteRounded,
  SaveRounded,
  CancelRounded,
  OpenInNewRounded,
  FileDownloadRounded,
  FlagRounded,
  DescriptionRounded,
  KeyboardArrowDown,
  WarningRounded,
  CheckRounded,
  CalendarMonthRounded,
  AutoAwesomeRounded,
} from "@mui/icons-material";
import { useAuth } from "../../hooks/useAuth";
import { useSocket } from "../../contexts/SocketContext";
import { stringToColor } from "../../utility/uiUtility";
import { formatDate } from "../../utility/dateCalculations";
import UploadCSVModal from "./UploadCSVModal";
import TaskDetailsModal from "./TaskDetailsModal";
import AddTaskModal from "./AddTaskModal";
import { usePM } from "../../contexts/PMContext";
import AddProjectModal from "./AddProjectModal";
import ScheduleGeneratorModal from "./ScheduleGeneratorModal";

type ControlPanelsProps = {
  selectedProject: any;
  selectedMilestone: any;
  selectedTeam: any;
  selectedTask: any;
  projectList: any[];
};

// Wrapper component for Milestone Edit Cell to handle local state for "new milestone" input
const MilestoneEditCell = ({
  id,
  value,
  api,
  selectedProject,
  setMilestones,
  currentMilestoneName,
}: {
  id: GridRowId;
  value: any;
  api: any;
  selectedProject: any;
  setMilestones: React.Dispatch<React.SetStateAction<Milestone[]>>;
  currentMilestoneName?: string;
}) => {
  const [newMilestoneName, setNewMilestoneName] = useState("");
  const [localMilestones, setLocalMilestones] = useState<Milestone[]>([]);
  const [loading, setLoading] = useState(true);

  // Load milestones from project data (no API call needed)
  useEffect(() => {
    if (!selectedProject?.id) {
      setLoading(false);
      return;
    }

    const projectMilestones = (selectedProject.milestones || []).map((m: any) => ({
      id: m.id,
      name: m.name,
      projectId: selectedProject.id,
    }));
    setLocalMilestones(projectMilestones);
    setMilestones(projectMilestones);
    setLoading(false);
  }, [selectedProject?.id, selectedProject?.milestones, setMilestones]);

  const handleCreate = async () => {
    // Demo mode: milestone creation not supported without backend
    toast.info("Milestone creation is not available in demo mode.");
  };

  // Build options list - ensure current value is always available as an option
  const options = useMemo(() => {
    const opts = [...localMilestones];
    // If current value exists but isn't in milestones list, add it as a temporary option
    if (value && !localMilestones.some((m) => m.id === value)) {
      opts.unshift({
        id: value,
        name: currentMilestoneName || "Loading...",
      });
    }
    return opts;
  }, [localMilestones, value, currentMilestoneName, selectedProject?.id]);

  return (
    <Select
      value={value || ""}
      onChange={(e) => api.setEditCellValue({ id, field: "milestoneId", value: e.target.value })}
      fullWidth
      size="small"
      sx={{ height: "100%" }}
      MenuProps={{ autoFocus: false }}
      endAdornment={loading ? <CircularProgress size={16} sx={{ mr: 2 }} /> : null}
    >
      {options.map((m) => (
        <MenuItem key={m.id} value={m.id}>
          {m.name}
        </MenuItem>
      ))}
      <Divider />
      <Box sx={{ p: 1, display: "flex", alignItems: "center", gap: 1 }} onKeyDown={(e) => e.stopPropagation()}>
        <TextField
          size="small"
          placeholder="New Milestone"
          value={newMilestoneName}
          onChange={(e) => setNewMilestoneName(e.target.value)}
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => {
            e.stopPropagation();
            if (e.key === "Enter") {
              e.preventDefault();
              handleCreate();
            }
          }}
          fullWidth
        />
        <IconButton
          size="small"
          color="primary"
          onClick={(e) => {
            e.stopPropagation();
            handleCreate();
          }}
          disabled={!newMilestoneName.trim()}
        >
          <CheckRounded />
        </IconButton>
      </Box>
    </Select>
  );
};

// Custom edit cell for Assignee that shows only users from the selected organization
const AssigneeEditCell = ({
  id,
  value,
  api,
  organizationId,
  projectId,
  currentAssigneeName,
}: {
  id: GridRowId;
  value: any;
  api: any;
  organizationId: string | null;
  projectId: string;
  currentAssigneeName?: string;
}) => {
  const [orgUsers, setOrgUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch users for selected organization in project context
  useEffect(() => {
    if (!organizationId || !projectId) {
      setLoading(false);
      setOrgUsers([]);
      return;
    }

    // Demo mode: no users to fetch
    setOrgUsers([]);
    setLoading(false);
  }, [organizationId, projectId]);

  // Build options list - ensure current value is always available as an option
  const options = useMemo(() => {
    const opts = [...orgUsers];
    // If current value exists but isn't in users list, add it as a temporary option
    if (value && !orgUsers.some((m) => m.id === value)) {
      opts.unshift({
        id: value,
        name: currentAssigneeName || "Loading...",
      });
    }
    return opts;
  }, [orgUsers, value, currentAssigneeName]);

  const isDisabled = loading || !organizationId;

  const selectComponent = (
    <Select
      value={value || ""}
      onChange={(e) => api.setEditCellValue({ id, field: "assignee", value: e.target.value })}
      fullWidth
      size="small"
      sx={{ height: "100%" }}
      disabled={isDisabled}
      endAdornment={loading ? <CircularProgress size={16} sx={{ mr: 2 }} /> : null}
    >
      {!organizationId ? (
        <MenuItem disabled>
          <Typography variant="body2" color="text.secondary">Select an organization first</Typography>
        </MenuItem>
      ) : loading ? (
        <MenuItem disabled>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <CircularProgress size={16} />
            <Typography variant="body2">Loading users...</Typography>
          </Box>
        </MenuItem>
      ) : (
        [
          <MenuItem key="unassigned" value="">Unassigned</MenuItem>,
          ...options.map((m) => (
            <MenuItem key={m.id} value={m.id}>
              {m.name}
            </MenuItem>
          ))
        ]
      )}
    </Select>
  );

  if (!organizationId) {
    return (
      <Tooltip title="Select an organization before selecting an assignee" arrow>
        <Box sx={{ width: "100%", height: "100%" }}>
          {selectComponent}
        </Box>
      </Tooltip>
    );
  }

  return selectComponent;
};

// Custom footer with Set Priority button on left, pagination on right
const CustomFooter = ({
  selectedProject: _selectedProject,
  settingPriorities: _settingPriorities,
  handleSetPriorities: _handleSetPriorities,
}: {
  selectedProject: any;
  settingPriorities: boolean;
  handleSetPriorities: () => void;
}) => {
  return (
    <GridFooterContainer>
      <Box sx={{ display: "flex", alignItems: "center", pl: 2 }}>
        <Tooltip title="Not available in this demo" arrow>
          <span>
            <Button
              disabled={true}
              startIcon={<AutoAwesomeRounded />}
              variant="contained"
              size="small"
              sx={{ borderRadius: 5, py: 0.7, px: { xs: 1.5, md: 2 } }}
            >
              Set Priority
            </Button>
          </span>
        </Tooltip>
      </Box>
      <GridPagination />
    </GridFooterContainer>
  );
};

const ControlPanel: React.FC<ControlPanelsProps> = ({
  selectedProject,
  selectedMilestone,
  selectedTask,
  selectedTeam,
  projectList = [],
}) => {

  const { user } = useAuth();
  const { createProject, fetchProjects, addTaskToProject, updateTaskInProject, removeTaskFromProject, projectTasks } = usePM();
  const muiTheme = useMuiTheme();
  const { socket, connected } = useSocket();
  const [showUploadModal, setUploadModal] = useState(false);
  const [showAddProjectModal, setShowAddProjectModal] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [tasksList, setTasksList] = useState<Task[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [deleting, setDeleting] = useState<boolean>(false);
  const [fileLoading, setFileLoading] = useState<boolean>(false);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [organizationUsers] = useState<any[]>([]);
  const [organizations] = useState<Organization[]>([]);
  const token = localStorage.getItem("token");
  const [userRole] = useState<string>(user.role);

  // const [userDivisions, setUserDivisions] = useState<any[]>([]);

  // const fetchUserDivisions = useCallback(async () => {
  //   if (!token) return;
  //   try {
  //     const endpoint = ["Admin", "Super Admin"].includes(userRole)
  //       ? `${import.meta.env.VITE_BACKEND_URL}/division`
  //       : `${import.meta.env.VITE_BACKEND_URL}/division/my-divisions`;

  //     const response = await fetch(endpoint, {
  //       method: "GET",
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //         "Content-Type": "application/json",
  //       },
  //     });
  //     if (response.ok) {
  //       const data = await response.json();
  //       setUserDivisions(data.data || []);
  //     }
  //   } catch (error) {
  //     console.error("Failed to fetch user divisions:", error);
  //   }
  // }, [token, userRole]);

  // useEffect(() => {
  //   fetchUserDivisions();
  // }, [fetchUserDivisions]);

  // Filter teams based on user role and divisions
  // using NAME matching because Team IDs (project-specific) vs Division IDs (org-wide) likely differ
  // const visibleTeams = useMemo(() => {
  //   if (["Admin", "Super Admin", "Project Manager"].includes(userRole)) {
  //     return teams;
  //   }

  //   // Normalize string helper
  //   const normalize = (str: string) => str.toLowerCase().trim();

  //   // Strategy 1: Match by ID if division ID matches team ID (less likely due to project scoping but possible)
  //   // Strategy 2: Match by Name (case-insensitive)

  //   let allowedNames = new Set<string>();
  //   let allowedIds = new Set<string>();

  //   if (userDivisions.length > 0) {
  //     userDivisions.forEach((d: any) => {
  //       if (d.name) allowedNames.add(normalize(d.name));
  //       if (d.id) allowedIds.add(d.id);
  //     });
  //   } else if (user.divisions && Array.isArray(user.divisions)) {
  //     // Fallback to auth context
  //     user.divisions.forEach((d: any) => {
  //       if (d.name) allowedNames.add(normalize(d.name));
  //       if (d.id) allowedIds.add(d.id);
  //     });
  //   }

  //   if (allowedNames.size === 0 && allowedIds.size === 0) {
  //     return [];
  //   }

  //   const filteredTeams = teams.filter((t) => {
  //     // Check ID match
  //     if (t.id && allowedIds.has(t.id)) {
  //       return true;
  //     }
  //     // Check Name match
  //     if (t.name && allowedNames.has(normalize(t.name))) {
  //       return true;
  //     }
  //     return false;
  //   });
  //   return filteredTeams;
  // }, [teams, userRole, userDivisions, user.divisions]);

  // Create merged team options for DataGrid dropdown (Project Teams + Divisions)
  // const teamOptions = useMemo(() => {
  //   // Start with visible Project Teams
  //   const options = visibleTeams.map((t) => ({ id: t.id, name: t.name, type: "team" }));

  //   // Add Divisions ensuring no duplicates by name (Project Team takes precedence)
  //   userDivisions.forEach((div) => {
  //     // Check if a team with this name already exists
  //     const exists = options.some((opt) => opt.name.trim().toLowerCase() === div.name.trim().toLowerCase());
  //     if (!exists) {
  //       options.push({ id: div.id, name: div.name, type: "division" });
  //     }
  //   });

  //   return options;
  // }, [visibleTeams, userDivisions]);

  // Allow explicit 'Project Manager' OR 'Admin' (or 'Super Admin')
  // Depending on exact role string for Admin. Usually 'Admin'.
  const isProjectManager = userRole === "Project Manager" || userRole === "Admin" || userRole === "Super Admin";
  const [file, setFile] = useState<File | null>(null);
  const [fileSelected, setFileSelected] = useState(false);

  // MUI DataGrid state
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});

  // Track the currently editing row's organization ID (for Assignee dropdown to react to Organization changes)
  const [editingRowOrgId, setEditingRowOrgId] = useState<{ rowId: GridRowId; orgId: string | null } | null>(null);

  // Pending tasks state (local-only rows not yet saved to database)
  const [pendingTasks, setPendingTasks] = useState<Task[]>([]);

  // Saving state - track which rows are currently being saved
  const [savingRowIds, setSavingRowIds] = useState<Set<string>>(new Set());

  // Modal states
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedTaskForDetails, setSelectedTaskForDetails] = useState<Task | null>(null);
  const [addTaskModalOpen, setAddTaskModalOpen] = useState(false);
  const [scheduleGeneratorModalOpen, setScheduleGeneratorModalOpen] = useState(false);

  // Dropdown Menu State
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [uploadMode, setUploadMode] = useState<"new" | "existing" | null>(null);
  const [newProjectName, setNewProjectName] = useState("");
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [newProjectManagerId, setNewProjectManagerId] = useState("");
  const [exportAnchorEl, setExportAnchorEl] = useState<null | HTMLElement>(null);

  // Priority setting state
  const [settingPriorities, setSettingPriorities] = useState(false);

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleUploadCSVClick = (mode: "new" | "existing") => {
    handleMenuClose();
    alert("Demo product does not have this function. (Import)");
    return;
    if (mode === "existing" && (!selectedProject?.id || selectedProject.id === "all")) {
      // If "existing" is chosen but no project selected, we might want to warn or let them select in modal?
      // Since we are passing [selectedProject] to modal, if selectedProject is null/"all", list is empty.
      // Let's assume for ControlPanel "Existing" means "Current Project".
      if (!selectedProject?.id || selectedProject.id === "all") {
        toast.error("Select a specific project first to import into it.");
        return;
      }
    }

    setFile(null);
    setFileSelected(false);
    setUploadMode(mode);
    setNewProjectName("");
    // Pre-select current project if in existing mode
    setSelectedProjectId(mode === "existing" && selectedProject?.id !== "all" ? selectedProject.id : "");
    setUploadModal(true);
  };

  const handleCreateProject = async (data: {
    name: string;
    description: string;
    managerId: string;
    startDate: string;
    endDate: string;
  }) => {
    const result = await createProject(data);
    if (result.success) {
      toast.success(result.message);
      // window.location.reload();
      return true;
    }
    return result.message;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
    }
  };

  const fetchMilestones = useCallback(
    (_projectId: string): Milestone[] => {
      return (selectedProject?.milestones || []).map((m: any) => ({ id: m.id, name: m.name }));
    },
    [selectedProject?.milestones],
  );

  const fetchProjectTasks = useCallback(
    (projectId: string): Task[] => {
      const statusMap: Record<string, Task["status"]> = {
        NotStarted: "Not Started", InProgress: "In Progress",
        TaskComplete: "Task Complete", MarkedComplete: "Marked Complete", TaskRejected: "Task Rejected",
      };
      return (projectTasks[projectId] ?? []).map((t: any) => ({
        id: t.id, milestoneId: t.milestoneId || "", name: t.name, description: t.description || "",
        project: selectedProject?.name || "745 18th St", assignee: t.assigneeEmail || "",
        status: statusMap[t.taskStatus || t.status] || "Not Started", priority: t.priority,
        startDate: t.startDate || "", endDate: t.endDate || "", remarks: "",
        assignName: t.assigneeName || "", assigneeUser: t.assigneeEmail || "",
        milestone: { id: t.milestoneId || "", name: t.milestoneName || "", projectId: selectedProject?.id || "", project: { name: selectedProject?.name || "745 18th St" } },
        issues: t.issues || [], dependentDetails: [],
        anticipatedBudget: t.taskBudget || 0, changeOrder: t.changeOrder || 0,
        teamResponsibleId: t.teamResponsibleId || "", teamName: t.teamName || "",
        taskStartStatus: t.taskStartStatus ?? 0, taskEndStatus: t.taskEndStatus ?? 0,
      }));
    },
    [projectTasks, selectedProject],
  );

  // Populate editing data from local mock state (no API calls)
  const fetchEditingData = useCallback(() => {
    if (!selectedProject?.id || selectedProject.id === "all") return;
    const milestonesData = fetchMilestones(selectedProject.id);
    const tasksData = fetchProjectTasks(selectedProject.id);
    setMilestones(milestonesData);
    setTasksList(tasksData);
  }, [selectedProject, fetchMilestones, fetchProjectTasks]);

  const fetchTasks = useCallback((silent: boolean = false) => {
    if (!silent) setLoading(true);
    try {
      let rawTasks: any[] = [];
      if (!selectedProject?.id || selectedProject.id === "all") {
        rawTasks = Object.values(projectTasks).flat();
      } else {
        rawTasks = projectTasks[selectedProject.id] ?? [];
      }
      if (selectedMilestone && selectedMilestone !== "all") {
        rawTasks = rawTasks.filter((t: any) => t.milestoneId === selectedMilestone);
      }
      if (selectedTeam && selectedTeam !== "all") {
        rawTasks = rawTasks.filter((t: any) => t.teamResponsibleId === selectedTeam || t.teamId === selectedTeam);
      }
      if (selectedTask && selectedTask !== "all") {
        rawTasks = rawTasks.filter((t: any) => t.id === selectedTask);
      }
      const statusMap: Record<string, Task["status"]> = {
        NotStarted: "Not Started", InProgress: "In Progress",
        TaskComplete: "Task Complete", MarkedComplete: "Marked Complete", TaskRejected: "Task Rejected",
      };
      const mappedTasks: Task[] = rawTasks.map((t: any) => ({
        id: t.id, milestoneId: t.milestoneId || "", name: t.name, description: t.description || "",
        project: selectedProject?.name || "745 18th St", assignee: t.assigneeEmail || "",
        status: statusMap[t.taskStatus || t.status] || "Not Started", priority: t.priority,
        startDate: t.startDate || "", endDate: t.endDate || "", remarks: "",
        assignName: t.assigneeName || "", assigneeUser: t.assigneeEmail || "",
        milestone: { id: t.milestoneId || "", name: t.milestoneName || "", projectId: selectedProject?.id || "", project: { name: selectedProject?.name || "745 18th St" } },
        issues: t.issues || [], dependentDetails: [],
        anticipatedBudget: t.taskBudget || 0, changeOrder: t.changeOrder || 0,
        teamResponsibleId: t.teamResponsibleId || "", teamName: t.teamName || "",
        taskStartStatus: t.taskStartStatus ?? 0, taskEndStatus: t.taskEndStatus ?? 0,
      }));
      setTasks(mappedTasks);
      if (selectedProject?.id && selectedProject.id !== "all") {
        setTasksList(mappedTasks);
      }
    } catch (err) {
      console.error("Failed to load tasks:", err);
    } finally {
      if (!silent) setLoading(false);
    }
  }, [selectedMilestone, selectedProject, selectedTask, selectedTeam, projectTasks]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Use ref to hold fetchTasks so socket listener doesn't need to re-register
  const fetchTasksRef = useRef(fetchTasks);
  useEffect(() => {
    fetchTasksRef.current = fetchTasks;
  }, [fetchTasks]);

  // Listen for real-time task updates via socket
  useEffect(() => {
    // console.log("🔌 ControlPanel socket effect - socket:", !!socket, "connected:", connected);
    if (!socket || !connected) return;

    const handleTasksUpdated = () => {
      // console.log("ControlPanel received tasks_updated:", data);
      // console.log("ControlPanel calling fetchTasks(true)...");
      fetchTasksRef.current(true); // silent refetch using ref
    };

    socket.on("tasks_updated", handleTasksUpdated);
    // console.log("ControlPanel registered tasks_updated listener");

    return () => {
      // console.log("🔌 ControlPanel unregistering tasks_updated listener");
      socket.off("tasks_updated", handleTasksUpdated);
    };
  }, [socket, connected]);


  // Handle AI-powered priority setting
  const handleSetPriorities = useCallback(async () => {
    if (!selectedProject?.id || selectedProject.id === "all") {
      toast.error("Select a specific project to set priorities");
      return;
    }

    setSettingPriorities(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/task/set-priorities/${selectedProject.id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to set priorities");
      }

      const data = await response.json();
      if (data.success) {
        toast.success("Task priorities set by AI successfully!");
        // Refresh tasks to show updated priorities
        fetchTasks();
      } else {
        toast.error(data.message || "Failed to set priorities");
      }
    } catch (err: any) {
      toast.error(err.message || "An error occurred while setting priorities");
    } finally {
      setSettingPriorities(false);
    }
  }, [selectedProject, token, fetchTasks]);

  // Pre-fetch editing data when project changes (for instant edit mode)
  useEffect(() => {
    if (selectedProject?.id && selectedProject.id !== "all") {
      fetchEditingData();
    }
  }, [selectedProject?.id, fetchEditingData]);

  // Warn user before leaving page if there are unsaved pending tasks
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (pendingTasks.length > 0) {
        e.preventDefault();
        e.returnValue = "You have unsaved tasks. Are you sure you want to leave?";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [pendingTasks.length]);

  const handleDeleteTask = (task: Task) => {
    setTaskToDelete(task);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!taskToDelete) return;
    setDeleting(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/task/${taskToDelete.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to delete task");
      }
      // Instant UI update - remove task from project for immediate status recalculation
      if (selectedProject?.id) {
        removeTaskFromProject(selectedProject.id, taskToDelete.id);
      }
      fetchTasks();
      toast.success("Task deleted successfully!");
    } catch (err) {
      toast.error("An error occurred while deleting the task.");
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
      setTaskToDelete(null);
    }
  };

  const handleDownloadData = useCallback(
    async (format: string) => {
      alert("Demo product does not have this function. (Export)");
      return;
      if (!selectedProject?.id) {
        toast.error("Cannot download data: Project data not loaded");
        return;
      }
      setFileLoading(true);
      try {
        const params = new URLSearchParams();
        if (selectedProject?.id !== "all") params.append("projectId", selectedProject.id);
        if (selectedMilestone !== "all" && selectedMilestone !== null) params.append("milestoneId", selectedMilestone);
        if (selectedTeam !== "all" && selectedTeam !== null) params.append("teamId", selectedTeam);
        if (selectedTask !== "all" && selectedTask !== null) params.append("taskId", selectedTask);
        params.append("format", format);

        const queryString = params.toString();
        const url = `${import.meta.env.VITE_BACKEND_URL}/dashboard/export-projects-data?${queryString}`;
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const blob = await response.blob();
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = downloadUrl;
        link.download = `project_${selectedProject.id || "data"}.${format}`;
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(downloadUrl);
        toast.success("Download started!");
      } catch (err: any) {
        if (err instanceof Error)
          toast.error("An error occurred while downloading data: " + (err.message || "Unknown error"));
      } finally {
        setFileLoading(false);
      }
    },
    [selectedMilestone, selectedProject, selectedTask, selectedTeam, token],
  );

  // Merge pending tasks (at top) with existing tasks for the grid
  const gridData = useMemo(() => {
    return [...pendingTasks, ...tasks];
  }, [pendingTasks, tasks]);


  interface TaskFormData {
    name: string;
    description: string;
    assignee: string;
    startDate: string;
    endDate: string;
    anticipatedBudget: string;
    changeOrder: string;
    milestone: string;
    selectedTeam: string;
    selectedDependency: string;
    status?: string;
    priority?: string;
  }

  const handleSaveNewTask = useCallback(
    async (formData: TaskFormData) => {
      try {
        const payload = {
          projectId: selectedProject.id,
          name: formData.name,
          description: formData.description || "",
          assignee: formData.assignee || undefined,
          startDate: formData.startDate,
          endDate: formData.endDate || undefined,
          createdBy: user.id,
          milestoneId: formData.milestone,
          teamResponsible: formData.selectedTeam || undefined,
          // organizationId: formData.selectedOrganization || undefined,
          dependentTasks: formData.selectedDependency ? [formData.selectedDependency] : [],
          taskBudget: parseFloat(formData.anticipatedBudget) || 0,
          changeOrder: parseFloat(formData.changeOrder) || 0,
        };

        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/task`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
        if (!response.ok) throw new Error("Failed to create task");
        const data = await response.json();
        if (data.success) {
          // Instant UI update - add task to project for immediate status recalculation
          // Spread data.data first, then our explicit values to ensure they take precedence
          addTaskToProject(selectedProject.id, {
            ...data.data,
            id: data.data?.id || `temp-${Date.now()}`,
            name: formData.name,
            status: "NotStarted",
            startDate: formData.startDate,
            endDate: formData.endDate || null,
            milestoneId: formData.milestone,
            teamId: formData.selectedTeam,
          });
          fetchTasks();
          toast.success("Task created successfully!");
        } else {
          toast.error(data.message || "Failed to create task");
        }
      } catch (err: unknown) {
        toast.error("Failed to create task. Please try again.");
        throw err;
      }
    },
    [selectedProject, token, fetchTasks, addTaskToProject, user.id],
  );

  // Open details modal - data is already pre-fetched by fetchEditingData() when project changes
  const handleOpenDetails = useCallback((task: Task) => {
    setSelectedTaskForDetails(task);
    setDetailsModalOpen(true);
  }, []);

  // Save task from details modal
  const handleSaveTask = useCallback(
    async (taskId: string, formData: TaskFormData) => {
      const userData = JSON.parse(localStorage.getItem("user") || "{}");
      const task = tasks.find((t) => t.id === taskId);

      try {
        const payload = {
          projectId: task?.milestone?.projectId,
          name: formData.name,
          description: formData.description || undefined,
          assignee: formData.assignee || undefined,
          startDate: formData.startDate,
          endDate: formData.endDate,
          assignedBy: formData.assignee && task?.assignee !== formData.assignee ? userData.id : undefined,
          milestoneId: formData.milestone,
          teamResponsibleId: formData.selectedTeam || undefined,
          // organizationId: formData.selectedOrganization || undefined,
          dependentTasks: formData.selectedDependency ? [formData.selectedDependency] : [],
          taskBudget: parseFloat(formData.anticipatedBudget) || 0,
          changeOrder: parseFloat(formData.changeOrder) || 0,
          status: formData.status,
          priority: formData.priority || null,
        };

        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/task/${taskId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Failed to update task");

        if (data.success) {
          // Instant UI update - update task status for immediate progress recalculation
          if (selectedProject?.id) {
            updateTaskInProject(selectedProject.id, taskId, {
              status: formData.status,
              startDate: formData.startDate,
              endDate: formData.endDate,
            });
          }
          fetchTasks();
          toast.success("Task updated successfully!");
        } else {
          toast.error(data.message || "Failed to update task");
        }
      } catch (err: unknown) {
        if (err instanceof Error && err.message) {
          toast.error(err.message);
        } else {
          toast.error("Failed to update task. Please try again.");
        }
        throw err;
      }
    },
    [token, fetchTasks, tasks, selectedProject, updateTaskInProject],
  );

  // DataGrid row editing handlers
  const handleEditClick = useCallback(
    (id: GridRowId) => () => {
      setRowModesModel((prev) => ({ ...prev, [id]: { mode: GridRowModes.Edit } }));
    },
    [],
  );

  const handleSaveClick = useCallback(
    (id: GridRowId) => () => {
      // Add to saving state before triggering the save
      setSavingRowIds((prev) => new Set(prev).add(String(id)));
      setRowModesModel((prev) => ({ ...prev, [id]: { mode: GridRowModes.View } }));
    },
    [],
  );

  const handleCancelClick = useCallback(
    (id: GridRowId) => () => {
      setRowModesModel((prev) => ({
        ...prev,
        [id]: { mode: GridRowModes.View, ignoreModifications: true },
      }));
    },
    [],
  );

  const handleRowEditStop: GridEventListener<"rowEditStop"> = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
    // Clear the editing row org ID when editing stops
    setEditingRowOrgId(null);
  };

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel);
    // Clear editing row org ID if the row is no longer in edit mode
    if (editingRowOrgId) {
      const rowMode = newRowModesModel[editingRowOrgId.rowId];
      if (!rowMode || rowMode.mode !== GridRowModes.Edit) {
        setEditingRowOrgId(null);
      }
    }
  };

  // Check if a row is a pending (unsaved) row
  const isPendingRow = useCallback((id: string) => {
    return id.startsWith("temp-");
  }, []);

  // Cancel a pending row (remove it without saving)
  const handleCancelPendingRow = useCallback((rowId: string) => {
    // First, set mode to View with ignoreModifications to prevent processRowUpdate from running
    setRowModesModel((prev) => ({
      ...prev,
      [rowId]: { mode: GridRowModes.View, ignoreModifications: true },
    }));
    // Then remove from pending tasks
    setPendingTasks((prev) => prev.filter((t) => t.id !== rowId));
  }, []);

  const processRowUpdate = async (newRow: Task & { dependentTaskId?: string; milestoneId?: string }, oldRow: Task) => {
    // Normalize date fields: convert Date objects to local date strings for API
    if ((newRow.startDate as any) instanceof Date) {
      const d = newRow.startDate as unknown as Date;
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      newRow.startDate = `${year}-${month}-${day}`;
    }
    if ((newRow.endDate as any) instanceof Date) {
      const d = newRow.endDate as unknown as Date;
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      newRow.endDate = `${year}-${month}-${day}`;
    }

    // For pending rows, validate and save to database
    if (isPendingRow(newRow.id)) {
      // Check if row was cancelled (no longer in pending tasks) - skip processing
      const rowExists = pendingTasks.some((t) => t.id === newRow.id);
      if (!rowExists) {
        return oldRow;
      }

      // Validation
      if (!newRow.name?.trim()) {
        toast.error("Task name is required");
        setSavingRowIds((prev) => {
          const next = new Set(prev);
          next.delete(newRow.id);
          return next;
        });
        throw new Error("Validation failed");
      }
      if (!newRow.milestoneId && !newRow.milestone?.id) {
        toast.error("Milestone is required");
        setSavingRowIds((prev) => {
          const next = new Set(prev);
          next.delete(newRow.id);
          return next;
        });
        throw new Error("Validation failed");
      }
      if (!newRow.organizationId) {
        toast.error("Organization is required");
        setSavingRowIds((prev) => {
          const next = new Set(prev);
          next.delete(newRow.id);
          return next;
        });
        throw new Error("Validation failed");
      }
      if (!newRow.startDate) {
        toast.error("Start date is required");
        setSavingRowIds((prev) => {
          const next = new Set(prev);
          next.delete(newRow.id);
          return next;
        });
        throw new Error("Validation failed");
      }
      if (!newRow.endDate) {
        toast.error("End date is required");
        setSavingRowIds((prev) => {
          const next = new Set(prev);
          next.delete(newRow.id);
          return next;
        });
        throw new Error("Validation failed");
      }

      if (newRow.startDate && newRow.endDate && new Date(newRow.endDate) < new Date(newRow.startDate)) {
        toast.error("End date cannot be before the start date");
        setSavingRowIds((prev) => {
          const next = new Set(prev);
          next.delete(newRow.id);
          return next;
        });
        throw new Error("Validation failed");
      }

      // Set saving state
      setSavingRowIds((prev) => new Set(prev).add(newRow.id));

      // Save to database
      try {
        const payload = {
          projectId: selectedProject.id,
          name: newRow.name,
          description: newRow.description || "",
          assignee: newRow.assignee || undefined,
          startDate: newRow.startDate,
          endDate: newRow.endDate,
          createdBy: user.id,
          milestoneId: newRow.milestoneId || newRow.milestone?.id,
          teamResponsible: newRow.organizationId,
          organizationId: newRow.organizationId || undefined,
          dependentTasks: newRow.dependentTaskId
            ? [newRow.dependentTaskId]
            : newRow.dependentDetails?.map((d) => d.id) || [],
          taskBudget: newRow.anticipatedBudget || 0,
          changeOrder: newRow.changeOrder || 0,
        };

        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/task`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });

        // Clear saving state
        setSavingRowIds((prev) => {
          const next = new Set(prev);
          next.delete(newRow.id);
          return next;
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            toast.success("Task created successfully");
            // Instant UI update - add task to project for immediate status recalculation
            // Spread data.data first, then our explicit values to ensure they take precedence
            addTaskToProject(selectedProject.id, {
              ...data.data,
              id: data.data?.id || newRow.id,
              name: newRow.name,
              status: newRow.status || "NotStarted",
              startDate: newRow.startDate,
              endDate: newRow.endDate || null,
              milestoneId: newRow.milestoneId || newRow.milestone?.id,
              teamId: newRow.organizationId,
            });
            // Remove from pending tasks
            setPendingTasks((prev) => prev.filter((t) => t.id !== newRow.id));
            // Refresh tasks from server
            fetchTasks();
            return newRow;
          } else {
            toast.error(data.message || "Failed to create task");
            throw new Error("API error");
          }
        } else {
          const error = await response.json();
          toast.error(error.message || "Failed to create task");
          throw new Error("API error");
        }
      } catch {
        // Clear saving state on error
        setSavingRowIds((prev) => {
          const next = new Set(prev);
          next.delete(newRow.id);
          return next;
        });
        throw new Error("Failed to create task");
      }
    }

    const userData = JSON.parse(localStorage.getItem("user") || "{}");

    try {
      // Handle milestoneId - use edited value or fall back to existing
      const milestoneId = newRow.milestoneId || newRow.milestone?.id;

      // Handle dependentTaskId - use edited value or fall back to existing
      const dependentTaskId =
        newRow.dependentTaskId !== undefined ? newRow.dependentTaskId : newRow.dependentDetails?.[0]?.id;

      const payload = {
        projectId: newRow.milestone?.projectId,
        name: newRow.name,
        description: newRow.description || undefined,
        assignee: newRow.assignee || undefined,
        startDate: newRow.startDate,
        endDate: newRow.endDate,
        assignedBy: newRow.assignee && oldRow.assignee !== newRow.assignee ? userData.id : undefined,
        milestoneId,
        teamResponsibleId: newRow.organizationId,
        organizationId: newRow.organizationId || undefined,
        dependentTasks: dependentTaskId ? [dependentTaskId] : [],
        taskBudget: newRow.anticipatedBudget || 0,
        changeOrder: newRow.changeOrder || 0,
        status: newRow.status,
        priority: newRow.priority || null,
      };

      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/task/${newRow.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to update task");

      // Clear saving state on success
      setSavingRowIds((prev) => {
        const next = new Set(prev);
        next.delete(newRow.id);
        return next;
      });

      // Instant UI update - update task status for immediate progress recalculation
      if (selectedProject?.id) {
        updateTaskInProject(selectedProject.id, newRow.id, {
          status: newRow.status,
          startDate: newRow.startDate,
          endDate: newRow.endDate,
        });
      }

      toast.success("Task updated successfully!");
      fetchTasks();
      return newRow;
    } catch (err: any) {
      // Clear saving state on error
      setSavingRowIds((prev) => {
        const next = new Set(prev);
        next.delete(newRow.id);
        return next;
      });
      // Put row back into edit mode on error
      setRowModesModel((prev) => ({ ...prev, [newRow.id]: { mode: GridRowModes.Edit } }));
      toast.error(err.message || "Failed to update task");
      throw err;
    }
  };

  const handleProcessRowUpdateError = (error: Error) => {
    // Don't show toast for validation errors - they're already handled with specific messages
    if (error.message === "Validation failed") return;
    toast.error(error.message);
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select file!!!");
      return;
    }

    if (uploadMode === "new" && !newProjectName.trim()) {
      toast.error("Please enter a project name");
      return;
    }

    // For existing mode in ControlPanel, we enforce selectedProjectId is set in handleUploadCSVClick
    if (uploadMode === "existing" && !selectedProjectId) {
      toast.error("No project selected.");
      return;
    }

    setFileLoading(true);
    const formData = new FormData();
    formData.append("csv", file);

    if (uploadMode === "new") {
      formData.append("projectName", newProjectName);
      if (newProjectManagerId) {
        formData.append("managerId", newProjectManagerId);
      }
    } else if (uploadMode === "existing") {
      formData.append("projectId", selectedProjectId);
    } else {
      // Fallback/Legacy: If no mode specifically set (e.g. from the icon button if still present), use selected project if available
      if (selectedProject?.id && selectedProject.id !== "all") {
        formData.append("projectId", selectedProject.id);
      }
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/project/upload-csv`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) {
        throw new Error(`File Upload Error : Please check file data once again`);
      }

      fetchTasks();
      toast.success("File Uploaded Successfully");

      await new Promise((resolve) => setTimeout(resolve, 1000));
      window.location.reload();
    } catch (error: any) {
      toast.error(error.message);
      console.error("Upload failed:", error.message);
    } finally {
      setFileLoading(false);
    }
  };

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleFileChange(event);
    setFileSelected(!!event.target.files?.length);
  };

  // const handleDownloadTemplate = () => {
  //   const link = document.createElement("a");
  //   link.href = "/1iq-template.csv";
  //   link.download = "1iq-template.csv";
  //   link.click();
  // };

  // Helper function to get priority chip styles
  const getPriorityChipStyles = (priority: string | undefined, theme: Theme) => {
    switch (priority) {
      case "Critical":
        return {
          backgroundColor: theme.palette.mode === "dark" ? "#7f1d1d" : "#fef2f2",
          color: theme.palette.mode === "dark" ? "#fca5a5" : "#dc2626",
          border: `1px solid ${theme.palette.mode === "dark" ? "#991b1b" : "#fecaca"}`,
        };
      case "High":
        return {
          backgroundColor: theme.palette.mode === "dark" ? "#78350f" : "#fff7ed",
          color: theme.palette.mode === "dark" ? "#fdba74" : "#ea580c",
          border: `1px solid ${theme.palette.mode === "dark" ? "#92400e" : "#fed7aa"}`,
        };
      case "Medium":
        return {
          backgroundColor: theme.palette.mode === "dark" ? "#1e3a5f" : "#eff6ff",
          color: theme.palette.mode === "dark" ? "#93c5fd" : "#2563eb",
          border: `1px solid ${theme.palette.mode === "dark" ? "#1e40af" : "#bfdbfe"}`,
        };
      case "Low":
        return {
          backgroundColor: theme.palette.mode === "dark" ? "#14532d" : "#f0fdf4",
          color: theme.palette.mode === "dark" ? "#86efac" : "#16a34a",
          border: `1px solid ${theme.palette.mode === "dark" ? "#166534" : "#bbf7d0"}`,
        };
      default:
        return {
          backgroundColor: theme.palette.mode === "dark" ? "#374151" : "#f3f4f6",
          color: theme.palette.mode === "dark" ? "#9ca3af" : "#6b7280",
          border: `1px solid ${theme.palette.mode === "dark" ? "#4b5563" : "#e5e7eb"}`,
        };
    }
  };

  // DataGrid columns
  const columns: GridColDef[] = useMemo(() => {
    const baseColumns: GridColDef[] = [
      {
        field: "priority",
        headerName: "Priority",
        width: 85,
        editable: true,
        renderCell: (params: GridRenderCellParams) => {
          const priority = params.value;
          if (!priority) {
            return <Typography color="text.secondary" variant="caption">-</Typography>;
          }
          return (
            <Chip
              label={priority}
              size="small"
              sx={{
                ...getPriorityChipStyles(priority, muiTheme),
                fontWeight: 500,
                fontSize: "0.75rem",
              }}
            />
          );
        },
        renderEditCell: (params: GridRenderCellParams) => {
          const currentValue = params.value ?? "";
          return (
            <Select
              value={currentValue}
              onChange={(e) => {
                params.api.setEditCellValue({
                  id: params.id,
                  field: params.field,
                  value: e.target.value,
                });
              }}
              size="small"
              fullWidth
              autoFocus
              sx={{ height: "100%" }}
            >
              <MenuItem value="">
                <em>Not Set</em>
              </MenuItem>
              <MenuItem value="Critical">Critical</MenuItem>
              <MenuItem value="High">High</MenuItem>
              <MenuItem value="Medium">Medium</MenuItem>
              <MenuItem value="Low">Low</MenuItem>
            </Select>
          );
        },
      },
      {
        field: "name",
        headerName: "Task Name",
        flex: 1,
        minWidth: 200,
        editable: true,
        renderCell: (params: GridRenderCellParams) => (
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 1.5,

              overflow: "hidden",
              width: "100%",
              height: "100%",
            }}
          >
            <Box
              sx={{
                width: 4,
                minWidth: 4,
                height: "70%",
                borderRadius: 1,
                backgroundColor: stringToColor(params.row.milestoneId),
              }}
            />

            <Box sx={{ overflow: "hidden", flex: 1 }}>
              <Typography
                variant="body2"
                fontWeight={500}
                sx={{
                  lineHeight: 1.4,
                  mb: "4px",
                }}
              >
                {params.value}
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{
                  lineHeight: 1.3,
                  display: "block",
                }}
              >
                {params.row.milestone?.project?.name}
              </Typography>
            </Box>
          </Box>
        ),
      },
      {
        field: "dependentTask",
        headerName: "Dependency",
        width: 150,
        editable: true,
        valueGetter: (_value, row) => {
          const details = row.dependentDetails;
          return (Array.isArray(details) && details.length > 0) ? details[0]?.id || "" : "";
        },
        valueSetter: (value, row) => ({ ...row, dependentTaskId: value }),
        renderCell: (params: GridRenderCellParams) => {
          const details = params.row.dependentDetails;
          return (Array.isArray(details) && details.length > 0) ? details[0]?.name || "-" : "-";
        },
        renderEditCell: (params: GridRenderCellParams) => {
          // Read edited value first, fall back to original data
          const details = params.row.dependentDetails;
          const fallbackId = (Array.isArray(details) && details.length > 0) ? details[0]?.id : "";
          const currentValue = params.value ?? fallbackId ?? "";
          return (
            <Select
              value={currentValue}
              onChange={(e) => {
                params.api.setEditCellValue({
                  id: params.id,
                  field: params.field,
                  value: e.target.value,
                });
              }}
              fullWidth
              size="small"
              sx={{ height: "100%" }}
            >
              <MenuItem value="">None</MenuItem>
              {(tasksList || [])
                .filter((t) => t.id !== params.id)
                .map((t) => (
                  <MenuItem key={t.id} value={t.id}>
                    {t.name}
                  </MenuItem>
                ))}
            </Select>
          );
        },
      },
      {
        field: "issues",
        headerName: "Issues",
        width: 80,
        align: "center",
        headerAlign: "center",
        renderCell: (params: GridRenderCellParams) => {
          const issues = params.value;
          const hasIssues = Array.isArray(issues) && issues.length > 0;
          return hasIssues ? <FlagRounded color="error" /> : <Typography color="text.secondary">-</Typography>;
        },
      },
      {
        field: "progress",
        headerName: "Progress",
        width: 160,
        valueGetter: (_value, row) => row.percentComplete ?? 0,
        renderCell: (params: GridRenderCellParams) => {
          const progress = params.row.percentComplete ?? 0;
          return (
            <Box
              sx={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                height: "100%",
              }}
            >
              <LinearProgress variant="determinate" value={progress} sx={{ height: 8, borderRadius: 4, mb: 0.5 }} />
              <Typography variant="caption" textAlign="center">
                {progress}%
              </Typography>
            </Box>
          );
        },
      },
      {
        field: "status",
        headerName: "Status",
        width: 140,
        renderCell: (params: GridRenderCellParams) => {
          const statusLabelMap: Record<string, string> = {
            "Marked Complete": "Pending",
            "MarkedComplete": "Pending",
            "Task Complete": "Finished",
            "TaskComplete": "Finished",
            "Task Rejected": "Rejected",
            "TaskRejected": "Rejected",
            "Not Started": "Not Started",
            "NotStarted": "Not Started",
            "In Progress": "In Progress",
            "InProgress": "In Progress",
          };
          const statusLabel = statusLabelMap[params.value] || capitalCase(params.value);
          return (
            <Chip
              label={statusLabel}
              size="small"
              sx={{ ...getStatusChipStyles(params.value, muiTheme) }}
            />
          );
        },
      },
      {
        field: "organizationId",
        headerName: "Organization",
        width: 180,
        editable: true,
        renderCell: (params: GridRenderCellParams) => {
          const org = organizations.find((o) => o.id === params.row.organizationId);
          const internalOrg = organizations.find((o) => o.type === "internal");
          return org?.name || params.row.organizationName || internalOrg?.name || "Unassigned";
        },
        renderEditCell: (params: GridRenderCellParams) => {
          // Get current value - use editingRowOrgId if available for this row, otherwise use row value
          const currentValue = editingRowOrgId?.rowId === params.id
            ? (editingRowOrgId.orgId || "")
            : (params.row.organizationId || "");

          return (
            <Select
              value={currentValue}
              onChange={(e) => {
                const newValue = e.target.value;
                params.api.setEditCellValue({ id: params.id, field: "organizationId", value: newValue });
                // Update shared state so Assignee dropdown can react
                setEditingRowOrgId({ rowId: params.id, orgId: newValue || null });
                // Clear assignee when organization changes
                params.api.setEditCellValue({ id: params.id, field: "assignee", value: "" });
              }}
              fullWidth
              size="small"
              sx={{ height: "100%" }}
            >
              <MenuItem value="">Unassigned</MenuItem>
              {organizations.map((o) => (
                <MenuItem key={o.id} value={o.id}>
                  {o.name}
                </MenuItem>
              ))}
            </Select>
          );
        },
      },
      {
        field: "assignee",
        headerName: "Assignee",
        width: 150,
        editable: true,
        renderCell: (params: GridRenderCellParams) => (
          <span style={{ filter: "blur(4px)", userSelect: "none" }}>{params.row.assigneeUser || "Unassigned"}</span>
        ),
        renderEditCell: (params: GridRenderCellParams) => {
          // Use the shared editing org ID if this row is being edited, otherwise use row value
          const effectiveOrgId = editingRowOrgId?.rowId === params.id
            ? editingRowOrgId.orgId
            : params.row.organizationId;

          return (
            <AssigneeEditCell
              id={params.id}
              value={params.value}
              api={params.api}
              organizationId={effectiveOrgId}
              projectId={selectedProject?.id || ""}
              currentAssigneeName={params.row.assigneeUser}
            />
          );
        },
      },
      {
        field: "milestoneId",
        headerName: "Milestone",
        width: 150,
        editable: true,
        valueGetter: (_value: unknown, row: Task) => row.milestone?.id,
        renderCell: (params: GridRenderCellParams) => params.row.milestone?.name || "Unassigned",
        renderEditCell: (params: GridRenderCellParams) => (
          <MilestoneEditCell
            id={params.id}
            value={params.value}
            api={params.api}
            selectedProject={selectedProject}
            setMilestones={setMilestones}
            currentMilestoneName={params.row.milestone?.name}
          />
        ),
      },
      {
        field: "startDate",
        headerName: "Start Date",
        type: "date",
        width: 180,
        editable: true,
        valueGetter: (value: string) => (value ? new Date(value) : null),
        renderCell: (params: GridRenderCellParams) => formatDate(params.row.startDate),
        renderEditCell: (params: GridRenderCellParams) => (
          <Box sx={{ width: "100%", height: "100%", display: "flex", alignItems: "center" }}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                value={params.value ? new Date(params.value) : null}
                onChange={(date: Date | null) =>
                  params.api.setEditCellValue({
                    id: params.id,
                    field: "startDate",
                    value: date || null,
                  })
                }
                slotProps={{
                  textField: {
                    size: "small",
                    fullWidth: true,
                    sx: { height: "100%", "& .MuiPickersInputBase-root": { height: "100%" } },
                  },
                }}
              />
            </LocalizationProvider>
          </Box>
        ),
      },
      {
        field: "endDate",
        headerName: "Due Date",
        type: "date",
        width: 180,
        editable: true,
        valueGetter: (value: string) => (value ? new Date(value) : null),
        renderCell: (params: GridRenderCellParams) => formatDate(params.row.endDate),
        renderEditCell: (params: GridRenderCellParams) => {
          const { id, api, row } = params;
          const startDateValue = row.startDate;
          const minDate = startDateValue ? new Date(startDateValue) : undefined;

          return (
            <Box sx={{ width: "100%", height: "100%", display: "flex", alignItems: "center" }}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  value={params.value ? new Date(params.value) : null}
                  onChange={(date: Date | null) =>
                    api.setEditCellValue({
                      id,
                      field: "endDate",
                      value: date || null,
                    })
                  }
                  minDate={minDate}
                  slotProps={{
                    textField: {
                      size: "small",
                      fullWidth: true,
                      sx: { height: "100%", "& .MuiPickersInputBase-root": { height: "100%" } },
                    },
                  }}
                />
              </LocalizationProvider>
            </Box>
          );
        },
      },
      {
        field: "anticipatedBudget",
        headerName: "Budget",
        width: 120,
        editable: true,
        type: "number",
        renderCell: (params: GridRenderCellParams) => `$${params.value?.toLocaleString() || 0}`,
      },
      {
        field: "changeOrder",
        headerName: "Change Order",
        width: 120,
        editable: true,
        type: "number",
        renderCell: (params: GridRenderCellParams) => `$${params.value?.toLocaleString() || 0}`,
      },
    ];

    if (isProjectManager) {
      baseColumns.push({
        field: "actions",
        headerName: "Actions",
        width: 120,
        renderCell: (params: GridRenderCellParams) => {
          const { id, row } = params;
          const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;
          const isPending = isPendingRow(String(id));
          const isSaving = savingRowIds.has(String(id));

          if (isPending) {
            if (isSaving) {
              return (
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%" }}>
                  <CircularProgress size={20} />
                </Box>
              );
            }
            return (
              <Box>
                <GridActionsCellItem
                  icon={<SaveRounded color="success" />}
                  label="Save"
                  onClick={handleSaveClick(id)}
                  color="inherit"
                />
                <GridActionsCellItem
                  icon={<CancelRounded color="error" />}
                  label="Cancel"
                  onClick={() => handleCancelPendingRow(String(id))}
                  color="inherit"
                />
              </Box>
            );
          }

          if (isSaving && !isPending) {
            return (
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%" }}>
                <CircularProgress size={20} />
              </Box>
            );
          }

          if (isInEditMode) {
            return (
              <Box>
                <GridActionsCellItem
                  icon={<SaveRounded />}
                  label="Save"
                  onClick={handleSaveClick(id)}
                  color="primary"
                />
                <GridActionsCellItem
                  icon={<CancelRounded />}
                  label="Cancel"
                  onClick={handleCancelClick(id)}
                  color="inherit"
                />
              </Box>
            );
          }

          return (
            <Box>
              <GridActionsCellItem
                icon={<OpenInNewRounded />}
                label="View Details"
                onClick={() => handleOpenDetails(row)}
                color="primary"
              />
              <GridActionsCellItem icon={<EditRounded />} label="Edit" onClick={handleEditClick(id)} color="primary" />
              <GridActionsCellItem
                icon={<DeleteRounded color="error" />}
                label="Delete"
                onClick={() => handleDeleteTask(row)}
              />
            </Box>
          );
        },
      });
    }

    return baseColumns;
  }, [
    isProjectManager,
    rowModesModel,
    handleOpenDetails,
    handleEditClick,
    handleSaveClick,
    handleCancelClick,
    muiTheme,
    tasksList,
    organizations,
    isPendingRow,
    handleCancelPendingRow,
    savingRowIds,
    selectedProject,
    setMilestones,
    editingRowOrgId,
  ]);

  // No rows overlay
  const NoRowsOverlay = () => (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        gap: 2,
      }}
    >
      <Box
        sx={{
          width: 64,
          height: 64,
          borderRadius: "50%",
          bgcolor: "primary.light",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <DescriptionRounded sx={{ fontSize: 32, color: "#fff" }} />
      </Box>
      <Box textAlign="center">
        <Typography variant="h6" fontWeight={600} gutterBottom>
          No Tasks Found
        </Typography>
        <Typography variant="body2" color="text.secondary">
          No tasks found for above selection
        </Typography>
      </Box>
    </Box>
  );

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          width: "100%",
          // height: {
          //   xs: "calc(100vh - 140px)",
          //   sm: "calc(100vh - 140px)",
          //   md: "calc(100vh - 172px)",
          // },
        }}
      >
        {/* Upload CSV Modal */}
        <UploadCSVModal
          open={showUploadModal}
          onClose={() => setUploadModal(false)}
          setFileSelected={setFileSelected}
          onChange={onFileChange}
          onUpload={handleUpload}
          fileLoading={fileLoading}
          fileSelected={fileSelected}
          mode={uploadMode}
          projects={projectList}
          newProjectName={newProjectName}
          setNewProjectName={setNewProjectName}
          selectedProjectId={selectedProjectId || selectedProject?.id || ""}
          setSelectedProjectId={setSelectedProjectId}
          managerId={newProjectManagerId}
          setManagerId={setNewProjectManagerId}
          isAdmin={userRole === "Admin"}
        />

        {/* Add Project Modal */}
        <AddProjectModal
          isOpen={showAddProjectModal}
          onClose={() => setShowAddProjectModal(false)}
          onCreateProject={handleCreateProject}
          isAdmin={userRole === "Admin" || userRole === "Super Admin"}
          currentUserId={user.id}
        />

        {/* Delete Confirmation Modal */}
        <Dialog open={showDeleteModal} onClose={() => setShowDeleteModal(false)} maxWidth="xs" fullWidth>
          <DialogTitle>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: "50%",
                  bgcolor: "error.light",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <WarningRounded sx={{ color: "#fff" }} />
              </Box>
              <Typography variant="h6" fontWeight={600}>
                Delete Task
              </Typography>
            </Box>
          </DialogTitle>
          <DialogContent>
            <Typography color="text.secondary">
              Are you sure you want to delete "{taskToDelete?.name}"? This action cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setShowDeleteModal(false)} variant="outlined" sx={{ borderRadius: 5 }}>
              Cancel
            </Button>
            <Button
              onClick={confirmDelete}
              variant="contained"
              color="error"
              disabled={deleting}
              startIcon={deleting ? <CircularProgress size={16} /> : <DeleteRounded />}
              sx={{ borderRadius: 5 }}
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>

        {/* Task Details Modal */}
        <TaskDetailsModal
          open={detailsModalOpen}
          onClose={() => {
            setDetailsModalOpen(false);
            setSelectedTaskForDetails(null);
          }}
          task={selectedTaskForDetails}
          organizations={organizations}
          milestones={milestones}
          tasksList={tasksList}
          organizationUsers={organizationUsers}
          onSave={handleSaveTask}
          isProjectManager={isProjectManager}
          onMilestoneCreated={(newMilestone) => {
            setMilestones((prev) => [...prev, newMilestone]);
          }}
        />

        {/* Add Task Modal */}
        <AddTaskModal
          open={addTaskModalOpen}
          onClose={() => setAddTaskModalOpen(false)}
          projectId={selectedProject?.id || ""}
          projectName={selectedProject?.name || ""}
          organizations={organizations}
          milestones={milestones}
          tasksList={tasksList}
          organizationUsers={organizationUsers}
          onSave={handleSaveNewTask}
          onMilestoneCreated={(newMilestone) => {
            setMilestones((prev) => [...prev, newMilestone]);
          }}
        />

        {/* Schedule Generator Modal */}
        <ScheduleGeneratorModal
          open={scheduleGeneratorModalOpen}
          onClose={() => setScheduleGeneratorModalOpen(false)}
          onProjectCreated={async (projectId: string) => {
            // console.log("onProjectCreated called with projectId:", projectId);
            await fetchProjects(false, false, projectId);
            // console.log("fetchProjects completed");
          }}
        />

        {/* Toolbar */}
        <Box
          className="toolbar"
          sx={{
            px: { xs: 1.5, sm: 2 },
            py: { xs: 1.5, sm: 2 },
            backgroundColor: "background.default",
            display: "flex",
            flexDirection: "column",
            gap: { xs: 1.5, sm: 2 },
            borderRadius: 2,
            border: 1,
            borderColor: "divider",
            mt: 1,
            mb: 2,
          }}
        >
          {/* Title Row */}
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              flexDirection: { xs: "column", md: "row" },
              justifyContent: { xs: "flex-start", sm: "space-between" },
              alignItems: { xs: "flex-start", sm: "center" },
              gap: { xs: 1.5, md: 2 },
            }}
          >
            <Box className="title-row" sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Typography variant="h6" sx={{ fontSize: { xs: "1rem", md: "1.25rem" } }}>
                {userRole === "Admin" || userRole === "Super Admin" ? "Tasks Overview" : "1iQ Mission Control"}
              </Typography>

              {(userRole === "Admin" || userRole === "Super Admin" || userRole === "Project Manager") && (
                <Tooltip title="Not available in this demo" arrow>
                  <span>
                    <Button
                      type="button"
                      variant="contained"
                      size="small"
                      startIcon={<AddRounded />}
                      disabled={true}
                      sx={{
                        borderRadius: 5,
                        px: { xs: 1.5, md: 2 },
                        py: 0.7,
                        fontSize: { xs: "0.75rem", md: "0.875rem" },
                      }}
                    >
                      Add Task
                    </Button>
                  </span>
                </Tooltip>
              )}
            </Box>

            {/* Action Buttons */}
            <Box
              className="action-buttons"
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 1,
              }}
            >
              {isProjectManager && (
                <>
                  {/* Export Dropdown with format options */}
                  <Tooltip title="Not available in this demo" arrow>
                    <span>
                      <Button
                        disabled={true}
                        startIcon={<FileDownloadRounded />}
                        endIcon={<KeyboardArrowDown />}
                        variant="contained"
                        size="small"
                        sx={{ borderRadius: 5, py: 0.7, px: { xs: 1.5, md: 2 } }}
                      >
                        Export
                      </Button>
                    </span>
                  </Tooltip>
                  <Menu
                    anchorEl={exportAnchorEl}
                    open={Boolean(exportAnchorEl)}
                    onClose={() => setExportAnchorEl(null)}
                  >
                    <MenuItem
                      onClick={() => {
                        handleDownloadData("csv");
                        setExportAnchorEl(null);
                      }}
                    >
                      <ListItemIcon>
                        <DescriptionRounded fontSize="small" />
                      </ListItemIcon>
                      <ListItemText>Export as CSV</ListItemText>
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        handleDownloadData("xml");
                        setExportAnchorEl(null);
                      }}
                    >
                      <ListItemIcon>
                        <DescriptionRounded fontSize="small" />
                      </ListItemIcon>
                      <ListItemText>Export as XML</ListItemText>
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        handleDownloadData("xlsx");
                        setExportAnchorEl(null);
                      }}
                    >
                      <ListItemIcon>
                        <DescriptionRounded fontSize="small" />
                      </ListItemIcon>
                      <ListItemText>Export as XLSX</ListItemText>
                    </MenuItem>
                  </Menu>

                  <Tooltip title="Not available in this demo" arrow>
                    <span>
                      <Button
                        disabled={true}
                        startIcon={<AddRounded />}
                        variant="contained"
                        size="small"
                        sx={{
                          borderRadius: 5,
                          fontSize: { xs: "0.75rem", md: "0.875rem" },
                          px: { xs: 1.5, md: 2 },
                          py: 0.7,
                        }}
                      >
                        New Project
                      </Button>
                    </span>
                  </Tooltip>

                  <Button
                    variant="contained"
                    startIcon={<CalendarMonthRounded />}
                    onClick={() => setScheduleGeneratorModalOpen(true)}
                    size="small"
                    sx={{
                      borderRadius: 5,
                      fontSize: { xs: "0.75rem", md: "0.875rem" },
                      px: { xs: 1.5, md: 2 },
                      py: 0.7,
                      "&:hover": {
                        backgroundColor: "primary.dark",
                      },
                    }}
                  >
                    Schedule Generator
                  </Button>

                  <Tooltip title="Not available in this demo" arrow>
                    <span>
                      <Button
                        disabled={true}
                        endIcon={<KeyboardArrowDown />}
                        variant="contained"
                        size="small"
                        sx={{
                          borderRadius: 5,
                          fontSize: { xs: "0.75rem", md: "0.875rem" },
                          py: 0.7,
                          px: { xs: 1.5, md: 2 },
                        }}
                      >
                        Import
                      </Button>
                    </span>
                  </Tooltip>

                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                    transformOrigin={{ vertical: "top", horizontal: "right" }}
                    PaperProps={{
                      elevation: 2,
                      sx: {
                        mt: 1,
                        minWidth: 200,
                        borderRadius: 2,
                        overflow: "visible",
                        filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.1))",
                        "&:before": {
                          content: '""',
                          display: "block",
                          position: "absolute",
                          top: 0,
                          right: 14,
                          width: 10,
                          height: 10,
                          bgcolor: "background.paper",
                          transform: "translateY(-50%) rotate(45deg)",
                          zIndex: 0,
                        },
                      },
                    }}
                  >
                    <MenuItem onClick={() => handleUploadCSVClick("new")}>
                      <ListItemIcon>
                        <UploadFileRounded fontSize="small" />
                      </ListItemIcon>
                      <ListItemText>Import CSV (New Project)</ListItemText>
                    </MenuItem>
                    <MenuItem onClick={() => handleUploadCSVClick("existing")}>
                      <ListItemIcon>
                        <UploadFileRounded fontSize="small" />
                      </ListItemIcon>
                      <ListItemText>Import CSV (Existing Project)</ListItemText>
                    </MenuItem>
                  </Menu>
                </>
              )}
            </Box>
          </Box>
        </Box>

        {/* DataGrid */}
        <Box className="data-grid-container" sx={{ flex: 1, width: "100%", minHeight: 400 }}>
          <DataGrid
            rows={gridData}
            columns={columns}
            loading={loading}
            getRowId={(row) => row.id}
            editMode="row"
            rowModesModel={rowModesModel}
            onRowModesModelChange={handleRowModesModelChange}
            onRowEditStop={handleRowEditStop}
            processRowUpdate={processRowUpdate}
            onProcessRowUpdateError={handleProcessRowUpdateError}
            getRowHeight={() => "auto"}
            pageSizeOptions={[10, 25, 50, 100]}
            initialState={{
              pagination: { paginationModel: { pageSize: 100 } },
              sorting: {
                sortModel: [{ field: "startDate", sort: "asc" }],
              },
            }}
            slots={{
              noRowsOverlay: NoRowsOverlay,
              footer: CustomFooter,
            }}
            slotProps={{
              footer: {
                selectedProject,
                settingPriorities,
                handleSetPriorities,
              },
            }}
            sx={{
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: "background.default",
                borderBottom: 1,
                borderColor: "divider",
              },
              "& .MuiDataGrid-columnHeaderTitle": {
                whiteSpace: "normal",
                lineHeight: "normal",
              },
              "& .MuiDataGrid-cell": {
                borderBottom: 1,
                borderTop: "none",
                borderColor: "divider",
                backgroundColor: "background.default",
                whiteSpace: "normal",
                lineHeight: "normal !important",
                alignItems: "center",
                py: "8px",
              },
              // Move footer to top using flexbox order
              display: "flex",
              flexDirection: "column",
              "& .MuiDataGrid-main": {
                order: 2,
              },
              "& .MuiDataGrid-footerContainer": {
                order: 1,
                borderBottom: 1,
                borderColor: "divider",
                borderTop: "none",
                backgroundColor: "background.default",
              },
              "& .MuiDataGrid-virtualScroller": {
                overflowY: "auto",
              },
              border: 1,
              borderColor: "divider",
              mb: 2,
              borderRadius: 2,
              "& .MuiDataGrid-cell:focus": { outline: "none" },
              "& .MuiDataGrid-row": {
                borderBottom: 1,
                borderColor: "divider",
              },
              "& .MuiDataGrid-row:hover": { backgroundColor: "action.hover" },
              "& .MuiDataGrid-columnHeader": {
                backgroundColor: "background.default",
                borderRight: "none",
                px: 2,
              },
              "& .MuiDataGrid-columnSeparator": {
                display: "none",
              },
              "& .MuiDataGrid-filler": {
                backgroundColor: "background.default",
              },
              // Pending (unsaved) row styling
              "& .pending-row": {
                backgroundColor: "rgba(25, 118, 210, 0.08)",
              },
              "& .pending-row:hover": {
                backgroundColor: "rgba(25, 118, 210, 0.12)",
              },
              // Saving row styling - dimmed with no interaction
              "& .saving-row": {
                opacity: 0.5,
                pointerEvents: "none",
              },
            }}
            disableRowSelectionOnClick
          />
        </Box>
      </Box>
    </>
  );
};

// Helper function to get status chip styles matching Intel page colors
const getStatusChipStyles = (status: string, _theme: Theme) => {
  const statusLower = status.toLowerCase();

  // In Progress
  if (statusLower.includes("progress")) {
    return {
      bgcolor: "#4fa2b5",
      color: "#fff",
    };
  }
  // Marked Complete (Pending)
  if (statusLower.includes("marked") && statusLower.includes("complete")) {
    return {
      bgcolor: "#66bb6a",
      color: "#fff",
    };
  }
  // Task Complete (Finished)
  if (statusLower.includes("task") && statusLower.includes("complete")) {
    return {
      bgcolor: "#2e7d32",
      color: "#fff",
    };
  }
  // Task Rejected (Rejected)
  if (statusLower.includes("reject")) {
    return {
      bgcolor: "#e07a62",
      color: "#fff",
    };
  }
  // Not Started (default)
  return {
    bgcolor: "#d1d5db",
    color: "#374151",
  };
};

export default ControlPanel;
