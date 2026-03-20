import { useState, useEffect, useRef } from "react";
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
  divisionIds?: string[];
}

export const AddUserModal: React.FC<AddUserModalProps> = ({ isOpen, onClose, onAddUser, roles }) => {
  const [showPassword, setShowPassword] = useState(false);
  // const [divisions, setDivisions] = useState<{ id: string; name: string }[]>([]);
  // const [divisionsLoading, setDivisionsLoading] = useState(false);
  const [adminOrganizationId, setAdminOrganizationId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const dialogContentRef = useRef<HTMLDivElement>(null);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddUserFormData>({
    defaultValues: {
      username: "",
      name: "",
      email: "",
      password: "",
      roleId: "",
      divisionIds: [],
    },
    mode: "onChange",
  });

  // Auto-scroll to top when error occurs
  useEffect(() => {
    if (submitError && dialogContentRef.current) {
      dialogContentRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [submitError]);

  // // Auto-scroll to bottom when divisions appear (organization fetched)
  // useEffect(() => {
  //   if (adminOrganizationId && dialogContentRef.current) {
  //     setTimeout(() => {
  //       dialogContentRef.current?.scrollTo({ top: dialogContentRef.current.scrollHeight, behavior: "smooth" });
  //     }, 100);
  //   }
  // }, [adminOrganizationId]);

  const backendBaseUrl = (import.meta.env.VITE_BACKEND_URL || "").replace(/\/+$/, "");
  const apiBaseUrl = backendBaseUrl
    ? backendBaseUrl.endsWith("/api")
      ? backendBaseUrl
      : `${backendBaseUrl}/api`
    : "/api";

  const fetchAdminOrganization = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("DEBUG: No token found");
      return;
    }

    try {
      // Fetch Admin Profile
      const profileUrl = `${apiBaseUrl}/user/get-profile-data`;
      const profileRes = await fetch(profileUrl, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!profileRes.ok) {
        throw new Error("Failed to fetch profile");
      }

      const profileData = await profileRes.json();
      const orgId = profileData?.organizationId;

      if (orgId) {
        setAdminOrganizationId(orgId);
      } else {
        setAdminOrganizationId(null);
      }

      // // 2. Fetch Divisions
      // const divisionsUrl = `${apiBaseUrl}/organization/${orgId}/divisions`;
      // console.log("DEBUG: Fetching divisions from:", divisionsUrl);
      //
      // const divisionsRes = await fetch(divisionsUrl, {
      //   headers: { Authorization: `Bearer ${token}` },
      // });
      //
      // console.log("DEBUG: Divisions response status:", divisionsRes.status);
      //
      // if (divisionsRes.ok) {
      //   const divisionsData = await divisionsRes.json();
      //   const divisionsList = divisionsData?.data || [];
      //   const finalDivisions = Array.isArray(divisionsList) ? divisionsList : [];
      //   setDivisions(finalDivisions);
      // } else {
      //   setDivisions([]);
      // }
    } catch (error) {
      console.error("Error fetching admin data:", error);
      toast.error("Failed to load organization data");
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchAdminOrganization();
    } else {
      // setDivisions([]);
      setAdminOrganizationId(null);
    }
  }, [isOpen]);

  const handleClose = () => {
    reset();
    setSubmitError(null);
    onClose();
  };

  const onSubmit = async (data: AddUserFormData) => {
    try {
      setSubmitError(null);
      setIsSubmitting(true);
      const userData = {
        ...data,
        organizationId: adminOrganizationId || undefined,
        // divisionIds: data.divisionIds || [],
      };
      const result = await onAddUser(userData as any);

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
                type="email"
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

          {/* Divisions Checklist Field - Hidden/Disabled */}
          {/* {adminOrganizationId && (
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
                        Loading teams...
                      </Typography>
                    </Box>
                  ) : divisions.length === 0 ? (
                    <Typography variant="body2" color="text.secondary" sx={{ py: 1 }}>
                      No divisions found for your organization.
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
          )} */}

        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
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
