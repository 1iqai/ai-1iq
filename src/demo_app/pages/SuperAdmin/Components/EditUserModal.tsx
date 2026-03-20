import { useState, useEffect, useRef /*, useCallback */ } from "react";
import { useForm, Controller } from "react-hook-form";
import type { User, RoleOption } from "../DashBoards/UserManagement";
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
  // Checkbox,
  // FormControlLabel,
  // FormGroup,
  FormHelperText,
  CircularProgress,
  Alert,
} from "@mui/material";
import { CloseRounded as CloseIcon } from "@mui/icons-material";
import { toast } from "react-toastify";

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEditUser: (user: Partial<User> & { organizationId?: string; divisionIds?: string[] }) => Promise<boolean | string>;
  userToEdit: User | null;
  roles: RoleOption[];
}

interface EditUserFormData {
  id: string;
  name: string;
  email: string;
  roleId: string;
  username: string;
  organizationId?: string;
  divisionIds?: string[];
}

export const EditUserModal: React.FC<EditUserModalProps> = ({
  isOpen,
  onClose,
  onEditUser,
  userToEdit,
  roles,
}) => {
  const {
    control,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm<EditUserFormData>({
    defaultValues: {
      id: "",
      name: "",
      email: "",
      roleId: "",
      username: "",
      organizationId: "",
      divisionIds: [],
    },
    mode: "onChange",
  });

  const [organizations, setOrganizations] = useState<{ id: string; name: string }[]>([]);
  const [, setOrganizationsLoading] = useState(false);
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

  const backendBaseUrl = (import.meta.env.VITE_BACKEND_URL || "").replace(/\/+$/, "");
  const apiBaseUrl = backendBaseUrl
    ? backendBaseUrl.endsWith("/api")
      ? backendBaseUrl
      : `${backendBaseUrl}/api`
    : "/api";

  // Clear organization when role changes to Super Admin
  useEffect(() => {
    if (isSuperAdmin) {
      setValue("organizationId", "");
      // setValue("divisionIds", []);
      // setDivisions([]);
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
        const payload = await res.json();
        setOrganizations(Array.isArray(payload?.data) ? payload.data : []);
      } catch (e) {
        setOrganizations([]);
      } finally {
        setOrganizationsLoading(false);
      }
    };

    if (isOpen) {
      fetchOrganizations();
    } else {
      setOrganizations([]);
      // setDivisions([]);
    }
  }, [isOpen, apiBaseUrl]);

  // const fetchDivisionsByOrg = useCallback(async (organizationId: string) => {
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
  //     const payload = await res.json();
  //     setDivisions(Array.isArray(payload?.data) ? payload.data : []);
  //   } catch (e) {
  //     setDivisions([]);
  //   } finally {
  //     setDivisionsLoading(false);
  //   }
  // }, [apiBaseUrl]);

  // const fetchUserDivisions = useCallback(async (userId: string) => {
  //   const token = localStorage.getItem("token");
  //   try {
  //     const res = await fetch(`${apiBaseUrl}/user/${userId}/divisions`, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });
  //     if (res.ok) {
  //       const payload = await res.json();
  //       return Array.isArray(payload?.data) ? payload.data.map((d: any) => d.id) : [];
  //     }
  //   } catch (e) {
  //     console.error("Failed to fetch user divisions:", e);
  //   }
  //   return [];
  // }, [apiBaseUrl]);

  useEffect(() => {
    const loadUserData = async () => {
      if (userToEdit) {
        // const userDivisions = await fetchUserDivisions(userToEdit.id);

        reset({
          id: userToEdit.id,
          name: userToEdit.name,
          email: userToEdit.email,
          roleId: userToEdit.roleId,
          username: userToEdit.username,
          organizationId: userToEdit.organizationId || "",
          // divisionIds: userDivisions,
        });

        // // Fetch divisions if organization exists
        // if (userToEdit.organizationId) {
        //   await fetchDivisionsByOrg(userToEdit.organizationId);
        // }
      }
    };

    if (isOpen && userToEdit) {
      loadUserData();
    }
  }, [userToEdit, isOpen, reset]);

  // const handleOrganizationChange = async (value: string) => {
  //   setValue("divisionIds", []);
  //   if (!value) {
  //     setDivisions([]);
  //     return;
  //   }
  //   await fetchDivisionsByOrg(value);
  // };

  const onSubmit = async (data: EditUserFormData) => {
    try {
      setSubmitError(null);
      // if ((data.divisionIds?.length || 0) > 0 && !data.organizationId) {
      //   setSubmitError("Please select an organization before assigning divisions");
      //   return;
      // }
      setIsSubmitting(true);
      const result = await onEditUser({
        ...data,
        organizationId: data.organizationId || undefined,
        // divisionIds: data.divisionIds || [],
      });

      if (result === true) {
        reset();
        setSubmitError(null);
        onClose();
      } else if (typeof result === "string") {
        setSubmitError(result);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to update user";
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
      open={isOpen && userToEdit !== null}
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
      {userToEdit && (
        <>
          <DialogTitle sx={{ m: 0, p: 2, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Typography variant="h6" component="span" fontWeight={600}>
              Edit User: {userToEdit.name}
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
            <Box component="form" id="edit-user-form" onSubmit={handleSubmit(onSubmit)} autoComplete="off" noValidate>
              {/* Organization Field - Disabled (read-only) */}
              <Controller
                name="organizationId"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth margin="normal" disabled>
                    <InputLabel id="organization-select-label">Organization</InputLabel>
                    <Select
                      {...field}
                      labelId="organization-select-label"
                      id="organization-select"
                      label="Organization"
                    >
                      <MenuItem value="">
                        <em>No Organization</em>
                      </MenuItem>
                      {organizations.map((org) => (
                        <MenuItem key={org.id} value={org.id}>
                          {org.name}
                        </MenuItem>
                      ))}
                    </Select>
                    <FormHelperText>Organization cannot be changed</FormHelperText>
                  </FormControl>
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

              {/* Email Field - Disabled */}
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Email"
                    type="email"
                    disabled
                    margin="normal"
                    variant="outlined"
                    helperText="Email cannot be changed"
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

          <DialogActions sx={{ px: 3, py: 2 }}>
            <Button onClick={handleClose} color="inherit" disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" form="edit-user-form" variant="contained" color="primary" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <CircularProgress size={18} color="inherit" /> <span style={{ marginLeft: 8 }}>Saving...</span>
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogActions>
        </>
      )}
    </Dialog>
  );
};
