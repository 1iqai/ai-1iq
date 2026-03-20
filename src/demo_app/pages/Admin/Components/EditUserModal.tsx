import { useState, useEffect, useRef } from "react";
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
  CircularProgress,
  FormHelperText,
  Alert,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEditUser: (user: Partial<User>) => Promise<boolean | string>;
  userToEdit: User | null;
  roles: RoleOption[];
}

interface EditUserFormData {
  id: string;
  name: string;
  email: string;
  roleId: string;
  username: string;
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
    reset,
    formState: { errors },
  } = useForm<EditUserFormData>({
    defaultValues: {
      id: "",
      name: "",
      email: "",
      roleId: "",
      username: "",
    },
    mode: "onChange",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const dialogContentRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to top when error occurs
  useEffect(() => {
    if (submitError && dialogContentRef.current) {
      dialogContentRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [submitError]);


  useEffect(() => {
    if (isOpen && userToEdit) {
      reset({
        id: userToEdit.id,
        name: userToEdit.name,
        email: userToEdit.email,
        roleId: userToEdit.roleId,
        username: userToEdit.username,
      });
    }
  }, [userToEdit, isOpen, reset]);

  const handleClose = () => {
    reset();
    setSubmitError(null);
    onClose();
  };

  const onSubmit = async (data: EditUserFormData) => {
    try {
      setSubmitError(null);
      setIsSubmitting(true);
      const result = await onEditUser(data);

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
