import { useEffect, useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";

import type { RoleOption, User } from "../DashBoards/UserManagement";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  Button,
  Box,
  Typography,
  FormControl,
  InputLabel,
  IconButton,
  InputAdornment,
  FormHelperText,
  // FormGroup,
  // FormControlLabel,
  // Checkbox,
  CircularProgress,
  Alert,
} from "@mui/material";
import { Close as CloseIcon, Visibility, VisibilityOff } from "@mui/icons-material";
import { toast } from "react-toastify";

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddUser: (
    newUser: Omit<User, "id" | "status" | "lastLogin" | "avatar"> & { organizationId?: string; divisionIds?: string[] }
  ) => Promise<boolean | string>;
  roles: RoleOption[];
}

interface AddUserFormData {
  username: string;
  name: string;
  email: string;
  password: string;
  roleId: string;
  organizationId?: string;
  divisionIds?: string[];
}

export const AddUserModal: React.FC<AddUserModalProps> = ({ isOpen, onClose, onAddUser, roles }) => {
  const {
    control,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm<AddUserFormData>({
    defaultValues: {
      username: "",
      name: "",
      email: "",
      password: "",
      roleId: "",
      organizationId: "",
      divisionIds: [],
    },
    mode: "onChange",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [organizations, setOrganizations] = useState<{ id: string; name: string }[]>([]);
  const [organizationsLoading, setOrganizationsLoading] = useState(false);
  // const [divisions, setDivisions] = useState<{ id: string; name: string }[]>([]);
  // const [divisionsLoading, setDivisionsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const selectedRoleId = watch("roleId");
  // const selectedOrganizationId = watch("organizationId");
  const dialogContentRef = useRef<HTMLDivElement>(null);

  // Check if selected role is Super Admin
  const selectedRole = roles.find((role) => role.id === selectedRoleId);
  const isSuperAdmin = selectedRole?.name?.toLowerCase() === "super admin";

  // Clear organization when Super Admin role is selected
  useEffect(() => {
    if (isSuperAdmin) {
      setValue("organizationId", "");
    }
  }, [isSuperAdmin, setValue]);

  // Auto-scroll to top when error occurs
  useEffect(() => {
    if (submitError && dialogContentRef.current) {
      dialogContentRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [submitError]);

  // // Auto-scroll to bottom when divisions appear (organization selected)
  // useEffect(() => {
  //   if (selectedOrganizationId && dialogContentRef.current) {
  //     setTimeout(() => {
  //       dialogContentRef.current?.scrollTo({ top: dialogContentRef.current.scrollHeight, behavior: "smooth" });
  //     }, 100);
  //   }
  // }, [selectedOrganizationId]);

  const backendBaseUrl = (import.meta.env.VITE_BACKEND_URL || "").replace(/\/+$/, "");
  const apiBaseUrl = backendBaseUrl
    ? backendBaseUrl.endsWith("/api")
      ? backendBaseUrl
      : `${backendBaseUrl}/api`
    : "/api";

  useEffect(() => {
    const fetchOrganizations = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Not authenticated. Please sign in again.");
        setOrganizations([]);
        return;
      }
      setOrganizationsLoading(true);
      try {
        const url = new URL(`${apiBaseUrl}/organization/list`, window.location.origin);
        url.searchParams.set("page", "1");
        url.searchParams.set("limit", "1000");

        const res = await fetch(url.toString(), {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        let payload: any = null;
        try {
          payload = await res.json();
        } catch {
          payload = null;
        }

        if (!res.ok) {
          const message = payload?.message || `Failed to fetch organizations (${res.status})`;
          throw new Error(message);
        }

        console.log("Organizations fetched:", payload);
        setOrganizations(Array.isArray(payload?.data) ? payload.data : []);
      } catch (e) {
        const message = e instanceof Error ? e.message : "Failed to load organizations";
        console.error("Error fetching organizations:", e);
        toast.error(message);
        setOrganizations([]);
      } finally {
        setOrganizationsLoading(false);
      }
    };

    if (isOpen) {
      fetchOrganizations();
    } else {
      // Reset organizations when modal closes
      setOrganizations([]);
      // setDivisions([]);
    }
  }, [isOpen]);

  // const fetchDivisionsByOrg = async (organizationId: string) => {
  //   const token = localStorage.getItem("token");
  //   if (!token) {
  //     toast.error("Not authenticated. Please sign in again.");
  //     setDivisions([]);
  //     return;
  //   }
  //   setDivisionsLoading(true);
  //   try {
  //     const res = await fetch(`${apiBaseUrl}/organization/${organizationId}/divisions`, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });
  //
  //     let payload: any = null;
  //     try {
  //       payload = await res.json();
  //     } catch {
  //       payload = null;
  //     }
  //
  //     if (!res.ok) {
  //       const message = payload?.message || `Failed to fetch divisions (${res.status})`;
  //       throw new Error(message);
  //     }
  //
  //     console.log("Teams fetched:", payload);
  //     setDivisions(Array.isArray(payload?.data) ? payload.data : []);
  //   } catch (e) {
  //     const message = e instanceof Error ? e.message : "Failed to load teams";
  //     console.error("Error fetching teams:", e);
  //     toast.error(message);
  //     setDivisions([]);
  //   } finally {
  //     setDivisionsLoading(false);
  //   }
  // };

  // const handleOrganizationChange = async (value: string) => {
  //   setValue("divisionIds", []);
  //   if (!value) {
  //     setDivisions([]);
  //     return;
  //   }
  //   await fetchDivisionsByOrg(value);
  // };

  const onSubmit = async (data: AddUserFormData) => {
    try {
      setSubmitError(null);
      // if ((data.divisionIds?.length || 0) > 0 && !data.organizationId) {
      //   setSubmitError("Please select an organization before assigning divisions");
      //   return;
      // }
      setIsSubmitting(true);
      const result = await onAddUser({
        ...data,
        organizationId: data.organizationId || undefined,
        // divisionIds: data.divisionIds || [],
      } as any);

      if (result === true) {
        reset();
        setSubmitError(null);
        onClose();
      } else if (typeof result === "string") {
        setSubmitError(result);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to add user";
      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    reset();
    setSubmitError(null);
    onClose();
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
          Add New User
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
        <Box component="form" id="add-user-form" onSubmit={handleSubmit(onSubmit)} autoComplete="off" noValidate>
          {/* Role Select Field */}
          <Controller
            name="roleId"
            control={control}
            rules={{ required: "Role is required" }}
            render={({ field }) => (
              <FormControl fullWidth margin="normal" required error={!!errors.roleId}>
                <InputLabel id="role-select-label">Role</InputLabel>
                <Select {...field} labelId="role-select-label" id="role-select" label="Role">
                  <MenuItem value="" disabled>
                    <em>Select a Role</em>
                  </MenuItem>
                  {roles.map((role: RoleOption) => (
                    <MenuItem key={role.id} value={role.id}>
                      {role.name}
                    </MenuItem>
                  ))}
                </Select>
                {errors.roleId && <FormHelperText>{errors.roleId.message}</FormHelperText>}
              </FormControl>
            )}
          />

          {/* Organization Select Field - Hidden when Super Admin */}
          {!isSuperAdmin && (
            <Controller
              name="organizationId"
              control={control}
              rules={{
                validate: (value) => {
                  if (!isSuperAdmin && !value) return "Organization is required";
                  return true;
                },
              }}
              render={({ field }) => (
                <FormControl fullWidth margin="normal" required error={!!errors.organizationId}>
                  <InputLabel id="organization-select-label">Organization</InputLabel>
                  <Select
                    {...field}
                    labelId="organization-select-label"
                    id="organization-select"
                    label="Organization"
                    onChange={(e) => {
                      const value = e.target.value as string;
                      field.onChange(value);
                    }}
                  >
                    <MenuItem value="" disabled>
                      <em>Select an Organization</em>
                    </MenuItem>
                    {organizationsLoading ? (
                      <MenuItem value="" disabled>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <CircularProgress size={16} />
                          <Typography variant="body2">Loading...</Typography>
                        </Box>
                      </MenuItem>
                    ) : (
                      organizations.map((org) => (
                        <MenuItem key={org.id} value={org.id}>
                          {org.name}
                        </MenuItem>
                      ))
                    )}
                  </Select>
                  {errors.organizationId && <FormHelperText>{errors.organizationId.message}</FormHelperText>}
                </FormControl>
              )}
            />
          )}

          {/* Username Field */}
          <Controller
            name="username"
            control={control}
            rules={{
              required: "Username is required",
              validate: (value) => !/\s/.test(value) || "Username cannot contain spaces",
            }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Username"
                required
                margin="normal"
                variant="outlined"
                error={!!errors.username}
                helperText={errors.username?.message || "Username cannot contain spaces"}
              />
            )}
          />

          {/* Name Field */}
          <Controller
            name="name"
            control={control}
            rules={{
              required: "Name is required",
              validate: (value) => !/[0-9]/.test(value) || "Name cannot contain numbers",
            }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Name"
                required
                margin="normal"
                variant="outlined"
                error={!!errors.name}
                helperText={errors.name?.message || "Name cannot contain numbers"}
              />
            )}
          />

          {/* Email Field */}
          <Controller
            name="email"
            control={control}
            rules={{
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address",
              },
            }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Email"
                required
                margin="normal"
                variant="outlined"
                error={!!errors.email}
                helperText={errors.email?.message}
              />
            )}
          />

          {/* Password Field */}
          <Controller
            name="password"
            control={control}
            rules={{
              required: "Password is required",
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters",
              },
              validate: {
                hasNumber: (value) => /[0-9]/.test(value) || "Must contain at least 1 number",
                hasSpecial: (value) =>
                  /[!@#$%^&*(),.?":{}|<>]/.test(value) || "Must contain at least 1 special character",
                hasUppercase: (value) => /[A-Z]/.test(value) || "Must contain at least 1 uppercase letter",
                hasLowercase: (value) => /[a-z]/.test(value) || "Must contain at least 1 lowercase letter",
              },
            }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Temporary Password"
                type={showPassword ? "text" : "password"}
                required
                margin="normal"
                variant="outlined"
                error={!!errors.password}
                helperText={errors.password?.message}
                onKeyDown={(e) => {
                  if (e.key === " ") e.preventDefault();
                }}
                onChange={(e) => {
                  // Remove spaces from password
                  field.onChange(e.target.value.replace(/\s+/g, ""));
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword((prev) => !prev)}
                        edge="end"
                      >
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            )}
          />

          {/* Divisions Select Field - Hidden/Disabled */}
          {/* {selectedOrganizationId ? (
            <Controller
              name="divisionIds"
              control={control}
              render={({ field }) => (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    Teams
                  </Typography>
                  {divisionsLoading ? (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, py: 1 }}>
                      <CircularProgress size={18} />
                      <Typography variant="body2" color="text.secondary">
                        Loading divisions...
                      </Typography>
                    </Box>
                  ) : divisions.length === 0 ? (
                    <Typography variant="body2" color="text.secondary" sx={{ py: 1 }}>
                      No divisions found for this organization.
                    </Typography>
                  ) : (
                    <FormGroup>
                      {divisions.map((division) => (
                        <FormControlLabel
                          key={division.id}
                          control={
                            <Checkbox
                              checked={field.value?.includes(division.id) || false}
                              onChange={(e) => {
                                const updatedDivisions = e.target.checked
                                  ? [...(field.value || []), division.id]
                                  : (field.value || []).filter((id) => id !== division.id);
                                field.onChange(updatedDivisions);
                              }}
                            />
                          }
                          label={division.name}
                        />
                      ))}
                    </FormGroup>
                  )}
                </Box>
              )}
            />
          ) : null} */}
        </Box>
      </DialogContent>

      <DialogActions className="dialog-action" sx={{ px: 3, py: 2 }}>
        <Button onClick={handleClose} color="inherit" disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" form="add-user-form" variant="contained" color="primary" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <CircularProgress size={18} color="inherit" /> <span style={{ marginLeft: 8 }}>Adding User...</span>
            </>
          ) : (
            "Add User"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
