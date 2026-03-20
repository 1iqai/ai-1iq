import { useState, useEffect } from "react";
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
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { useAuth } from "../../hooks/useAuth";

interface ProjectManager {
  id: string;
  name: string;
  email: string;
}

interface AddProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateProject: (data: {
    name: string;
    description: string;
    managerId: string;
    startDate: string;
    endDate: string;
  }) => Promise<boolean | string>;
  isAdmin?: boolean;
  currentUserId?: string;
}

interface AddProjectFormData {
  name: string;
  description: string;
  managerId: string;
  startDate: Date | null;
  endDate: Date | null;
}

export const AddProjectModal: React.FC<AddProjectModalProps> = ({
  isOpen,
  onClose,
  onCreateProject,
  currentUserId = "",
}) => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [projectManagers, setProjectManagers] = useState<ProjectManager[]>([]);
  const [loadingManagers, setLoadingManagers] = useState(false);

  // If user is Project Manager, force managerId to their ID
  const defaultManagerId = user?.role === "Project Manager" ? user.id : currentUserId;

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<AddProjectFormData>({
    defaultValues: {
      name: "",
      description: "",
      managerId: defaultManagerId,
      startDate: null,
      endDate: null,
    },
    mode: "onChange",
  });

  const startDate = watch("startDate");

  // Fetch project managers when modal opens (only if not PM)
  useEffect(() => {
    if (isOpen && user?.role !== "Project Manager") {
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
  }, [isOpen, user?.role]);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      reset({
        name: "",
        description: "",
        managerId: defaultManagerId,
        startDate: null,
        endDate: null,
      });
      setSubmitError(null);
    }
  }, [isOpen, reset, defaultManagerId]);

  const handleClose = () => {
    reset();
    setSubmitError(null);
    onClose();
  };

  const onSubmit = async (data: AddProjectFormData) => {
    try {
      setSubmitError(null);
      setIsSubmitting(true);

      const result = await onCreateProject({
        name: data.name,
        description: data.description || "",
        managerId: data.managerId,
        startDate: data.startDate ? data.startDate.toISOString() : new Date().toISOString(),
        endDate: data.endDate ? data.endDate.toISOString() : new Date().toISOString(),
      });

      if (result === true) {
        reset();
        setSubmitError(null);
        onClose();
      } else if (typeof result === "string") {
        setSubmitError(result);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to create project";
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

      <DialogContent dividers>
        {submitError && (
          <Alert severity="error" onClose={() => setSubmitError(null)} sx={{ mt: 0, mb: 2 }}>
            {submitError}
          </Alert>
        )}
        <Box component="form" id="add-project-form" onSubmit={handleSubmit(onSubmit)} autoComplete="off" noValidate>
          {/* Project Name */}
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

          {/* Project Manager Dropdown - Only show if NOT Project Manager */}
          {user?.role !== "Project Manager" && (
            <Controller
              name="managerId"
              control={control}
              rules={{
                required: "Project manager is required",
              }}
              render={({ field }) => (
                <FormControl fullWidth margin="normal" error={!!errors.managerId} required>
                  <InputLabel id="manager-select-label">Project Manager</InputLabel>
                  <Select
                    {...field}
                    labelId="manager-select-label"
                    label="Project Manager"
                    disabled={loadingManagers}
                  >
                    {loadingManagers ? (
                      <MenuItem disabled value="">
                        Loading...
                      </MenuItem>
                    ) : projectManagers.length === 0 ? (
                      <MenuItem disabled value="">
                        No Project Managers available
                      </MenuItem>
                    ) : (
                      projectManagers.map((pm) => (
                        <MenuItem key={pm.id} value={pm.id}>
                          {pm.name} ({pm.email})
                        </MenuItem>
                      ))
                    )}
                  </Select>
                  {errors.managerId && <FormHelperText>{errors.managerId.message}</FormHelperText>}
                </FormControl>
              )}
            />
          )}

          {/* Date Pickers Row */}
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
              {/* Start Date */}
              <Controller
                name="startDate"
                control={control}
                rules={{
                  required: "Start date is required",
                }}
                render={({ field }) => (
                  <DatePicker
                    {...field}
                    label="Start Date *"
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: !!errors.startDate,
                        helperText: errors.startDate?.message,
                      },
                    }}
                  />
                )}
              />

              {/* End Date */}
              <Controller
                name="endDate"
                control={control}
                rules={{
                  required: "End date is required",
                  validate: (value) => {
                    if (startDate && value && value < startDate) {
                      return "End date must be after start date";
                    }
                    return true;
                  },
                }}
                render={({ field }) => (
                  <DatePicker
                    {...field}
                    label="End Date *"
                    minDate={startDate || undefined}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: !!errors.endDate,
                        helperText: errors.endDate?.message,
                      },
                    }}
                  />
                )}
              />
            </Box>
          </LocalizationProvider>

          {/* Description (Optional) */}
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Description"
                margin="normal"
                variant="outlined"
                multiline
                rows={3}
              />
            )}
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={handleClose} color="inherit" disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" form="add-project-form" variant="contained" color="primary" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <CircularProgress size={18} color="inherit" /> <span style={{ marginLeft: 8 }}>Creating...</span>
            </>
          ) : (
            "Create Project"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddProjectModal;
