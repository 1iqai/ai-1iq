import { useState, useEffect, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  IconButton,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { useAuth } from "../../../hooks/useAuth";
import type { Project } from "../../types";

interface AddProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProject: (newProject: Omit<Project, "id">) => Promise<boolean | string>;
}

interface AddProjectFormData {
  name: string;
  description: string;
  managerId?: string;
}

interface ProjectManager {
  id: string;
  name: string;
  email: string;
}

export const AddProjectModal: React.FC<AddProjectModalProps> = ({ isOpen, onClose, onAddProject }) => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [projectManagers, setProjectManagers] = useState<ProjectManager[]>([]);
  const [loadingManagers, setLoadingManagers] = useState(false);
  const dialogContentRef = useRef<HTMLDivElement>(null);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
  } = useForm<AddProjectFormData>({
    defaultValues: {
      name: "",
      description: "",
      managerId: user.id || "",
    },
    mode: "onChange",
  });

  // Fetch Project Managers if user is Admin or Super Admin
  useEffect(() => {
    const fetchProjectManagers = async () => {
      if ((user.role === "Admin" || user.role === "Super Admin") && isOpen) {
        setLoadingManagers(true);
        try {
          const token = localStorage.getItem("token");
          const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/user/project-managers`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const data = await response.json();
            if (data.success && Array.isArray(data.data)) {
              setProjectManagers(data.data);
            }
          }
        } catch (error) {
          // console.error("Failed to fetch project managers", error);
        } finally {
          setLoadingManagers(false);
        }
      }
    };

    fetchProjectManagers();
  }, [user.role, isOpen]);

  // Set default managerId to current user if they are in the list, or if valid
  useEffect(() => {
    if (user.id) {
      setValue("managerId", user.id);
    }
  }, [user.id, setValue]);


  useEffect(() => {
    if (submitError && dialogContentRef.current) {
      dialogContentRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [submitError]);

  const handleClose = () => {
    reset();
    setSubmitError(null);
    onClose();
  };

  const onSubmit = async (data: AddProjectFormData) => {
    try {
      setSubmitError(null);
      setIsSubmitting(true);

      const now = new Date().toISOString();
      const futureDate = new Date();
      futureDate.setMonth(futureDate.getMonth() + 3); // 3 months from now

      // If user is Admin, use selected managerId, otherwise fallback to user.id
      const finalManagerId = data.managerId || user.id;

      // Find the selected manager to populate manager details (optional for UI update)
      // If none found (e.g. self assignment not in list), fallback to current user details
      const selectedManager = projectManagers.find(pm => pm.id === finalManagerId) ||
        (finalManagerId === user.id ? { name: user.name, email: user.email, image: user.image } : null);

      const completeProject: Omit<Project, "id"> = {
        name: data.name,
        description: data.description,
        managerId: finalManagerId,
        startDate: now,
        endDate: futureDate.toISOString(),
        percentComplete: 0,
        totalTasks: 0,
        completedTasks: 0,
        totalIssues: 0,
        dateCreated: now,
        dateUpdated: now,
        active: "Active",
        manager: {
          name: selectedManager?.name || "Unknown",
          email: selectedManager?.email || "",
          image: (selectedManager as any)?.image,
        },
        milestones: [],
        teams: [],
      };

      const result = await onAddProject(completeProject);

      if (result === true) {
        reset();
        setSubmitError(null);
        onClose();
      } else if (typeof result === "string") {
        setSubmitError(result);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to add project";
      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: 2,
          },
        },
      }}
    >
      <DialogTitle
        sx={{
          m: 0,
          p: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="h6" component="span" fontWeight={600}>
          Create New Project
        </Typography>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            color: "text.secondary",
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers ref={dialogContentRef}>
        {submitError && (
          <Alert severity="error" onClose={() => setSubmitError(null)} sx={{ mt: 0, mb: 2 }}>
            {submitError}
          </Alert>
        )}
        <Box component="form" id="add-project-form" onSubmit={handleSubmit(onSubmit)} autoComplete="off" noValidate>
          <Controller
            name="name"
            control={control}
            rules={{
              required: "Project name is required",
            }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Project Name"
                required
                margin="normal"
                variant="outlined"
                error={!!errors.name}
                helperText={errors.name?.message}
              />
            )}
          />

          <Controller
            name="description"
            control={control}
            rules={{
              required: "Description is required",
            }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Description"
                required
                margin="normal"
                variant="outlined"
                multiline
                rows={4}
                error={!!errors.description}
                helperText={errors.description?.message}
              />
            )}
          />

          {(user.role === "Admin" || user.role === "Super Admin") && (
            <Controller
              name="managerId"
              control={control}
              rules={{ required: "Project Manager is required" }}
              render={({ field }) => (
                <FormControl
                  fullWidth
                  margin="normal"
                  error={!!errors.managerId}
                >
                  <InputLabel id="manager-select-label">Project Manager</InputLabel>
                  <Select
                    {...field}
                    labelId="manager-select-label"
                    label="Project Manager"
                    disabled={loadingManagers}
                  >
                    {projectManagers.map((pm) => (
                      <MenuItem key={pm.id} value={pm.id}>
                        {pm.name} ({pm.email})
                      </MenuItem>
                    ))}
                    {/* Include self if not in list? Or assume API returns self if applicable */}
                    {!projectManagers.find(pm => pm.id === user.id) && (
                      <MenuItem value={user.id}>
                        {user.name} ({user.email}) (Me)
                      </MenuItem>
                    )}
                  </Select>
                  {loadingManagers && <FormHelperText>Loading managers...</FormHelperText>}
                  {errors.managerId && <FormHelperText>{errors.managerId.message}</FormHelperText>}
                </FormControl>
              )}
            />
          )}

        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={handleClose} color="inherit" disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" form="add-project-form" variant="contained" color="primary" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <CircularProgress size={18} color="inherit" /> <span style={{ marginLeft: 8 }}>Creating Project...</span>
            </>
          ) : (
            "Create Project"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
