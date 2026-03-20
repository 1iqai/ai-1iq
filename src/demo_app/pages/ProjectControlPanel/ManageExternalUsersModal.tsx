import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  IconButton,
  CircularProgress,
  Alert,
  Checkbox,
  Chip,
  Divider,
  Tooltip,
} from "@mui/material";
import {
  Close as CloseIcon,
  DeleteRounded,
  GroupAddRounded,
} from "@mui/icons-material";

interface ExternalUser {
  id: string;
  name: string;
  email: string;
  roleName: string;
  organizationName: string;
  addedAt?: string;
}

interface AvailableOrg {
  orgId: string;
  orgName: string;
  users: {
    id: string;
    name: string;
    email: string;
    roleName: string;
  }[];
}

interface ManageExternalUsersModalProps {
  open: boolean;
  onClose: () => void;
  projectId: string;
  projectName: string;
}

const ManageExternalUsersModal: React.FC<ManageExternalUsersModalProps> = ({
  open,
  onClose,
  projectId,
  projectName,
}) => {
  const token = localStorage.getItem("token");

  // Current external users state
  const [currentUsers, setCurrentUsers] = useState<ExternalUser[]>([]);
  const [loadingCurrent, setLoadingCurrent] = useState(false);

  // Available external users state
  const [availableOrgs, setAvailableOrgs] = useState<AvailableOrg[]>([]);
  const [loadingAvailable, setLoadingAvailable] = useState(false);

  // Selection state
  const [selectedUserIds, setSelectedUserIds] = useState<Set<string>>(new Set());

  // Action states
  const [adding, setAdding] = useState(false);
  const [removingUserId, setRemovingUserId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchCurrentUsers = useCallback(async () => {
    if (!projectId || !token) return;
    setLoadingCurrent(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/project-external-user/${projectId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.ok) {
        const result = await response.json();
        setCurrentUsers(result.data || []);
      } else {
        const result = await response.json();
        setError(result.message || "Failed to load current external users");
      }
    } catch {
      setError("Failed to load current external users");
    } finally {
      setLoadingCurrent(false);
    }
  }, [projectId, token]);

  const fetchAvailableUsers = useCallback(async () => {
    if (!projectId || !token) return;
    setLoadingAvailable(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/project-external-user/${projectId}/available`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.ok) {
        const result = await response.json();
        setAvailableOrgs(result.data || []);
      } else {
        const result = await response.json();
        setError(result.message || "Failed to load available external users");
      }
    } catch {
      setError("Failed to load available external users");
    } finally {
      setLoadingAvailable(false);
    }
  }, [projectId, token]);

  // Load data when modal opens
  useEffect(() => {
    if (open && projectId) {
      setError(null);
      setSelectedUserIds(new Set());
      fetchCurrentUsers();
      fetchAvailableUsers();
    }
  }, [open, projectId, fetchCurrentUsers, fetchAvailableUsers]);

  const handleToggleUser = (userId: string) => {
    setSelectedUserIds((prev) => {
      const next = new Set(prev);
      if (next.has(userId)) {
        next.delete(userId);
      } else {
        next.add(userId);
      }
      return next;
    });
  };

  const handleAddUsers = async () => {
    if (selectedUserIds.size === 0) return;
    setAdding(true);
    setError(null);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/project-external-user`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            projectId,
            userIds: Array.from(selectedUserIds),
          }),
        }
      );
      if (response.ok) {
        const result = await response.json();
        toast.success(`${result.data?.count || selectedUserIds.size} external user(s) added`);
        setSelectedUserIds(new Set());
        fetchCurrentUsers();
        fetchAvailableUsers();
      } else {
        const result = await response.json();
        setError(result.message || "Failed to add external users");
      }
    } catch {
      setError("Failed to add external users");
    } finally {
      setAdding(false);
    }
  };

  const handleRemoveUser = async (userId: string) => {
    setRemovingUserId(userId);
    setError(null);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/project-external-user`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ projectId, userId }),
        }
      );
      if (response.ok) {
        toast.success("External user removed");
        fetchCurrentUsers();
        fetchAvailableUsers();
      } else {
        const result = await response.json();
        setError(result.message || "Failed to remove external user");
      }
    } catch {
      setError("Failed to remove external user");
    } finally {
      setRemovingUserId(null);
    }
  };

  const handleClose = () => {
    setError(null);
    setSelectedUserIds(new Set());
    onClose();
  };

  const totalAvailableUsers = availableOrgs.reduce((sum, org) => sum + org.users.length, 0);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      slotProps={{
        paper: {
          sx: { borderRadius: 2, maxHeight: "85vh" },
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
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <GroupAddRounded color="primary" />
          <Typography variant="h6" component="span" fontWeight={600}>
            External Users
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
            {projectName}
          </Typography>
        </Box>
        <IconButton aria-label="close" onClick={handleClose} sx={{ color: "text.secondary" }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ p: 0 }}>
        {error && (
          <Alert severity="error" onClose={() => setError(null)} sx={{ m: 2, mb: 0 }}>
            {error}
          </Alert>
        )}

        {/* Section: Current External Users */}
        <Box sx={{ p: 2 }}>
          <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1.5 }}>
            Current External Users ({currentUsers.length})
          </Typography>

          {loadingCurrent ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
              <CircularProgress size={28} />
            </Box>
          ) : currentUsers.length === 0 ? (
            <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: "center" }}>
              No external users added to this project yet.
            </Typography>
          ) : (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {currentUsers.map((user) => (
                <Box
                  key={user.id}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    p: 1.5,
                    borderRadius: 1.5,
                    border: 1,
                    borderColor: "divider",
                    "&:hover": { backgroundColor: "action.hover" },
                  }}
                >
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
                      <Typography variant="body2" fontWeight={500} noWrap>
                        {user.name}
                      </Typography>
                      <Chip label={user.roleName} size="small" variant="outlined" />
                      <Chip label={user.organizationName} size="small" color="info" variant="outlined" />
                    </Box>
                    <Typography variant="caption" color="text.secondary" noWrap>
                      {user.email}
                    </Typography>
                  </Box>
                  <Tooltip title="Remove from project">
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleRemoveUser(user.id)}
                      disabled={removingUserId === user.id}
                    >
                      {removingUserId === user.id ? (
                        <CircularProgress size={18} color="inherit" />
                      ) : (
                        <DeleteRounded fontSize="small" />
                      )}
                    </IconButton>
                  </Tooltip>
                </Box>
              ))}
            </Box>
          )}
        </Box>

        <Divider />

        {/* Section: Add External Users */}
        <Box sx={{ p: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1.5 }}>
            <Typography variant="subtitle1" fontWeight={600}>
              Add External Users
            </Typography>
            {selectedUserIds.size > 0 && (
              <Chip
                label={`${selectedUserIds.size} selected`}
                size="small"
                color="primary"
              />
            )}
          </Box>

          {loadingAvailable ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
              <CircularProgress size={28} />
            </Box>
          ) : totalAvailableUsers === 0 ? (
            <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: "center" }}>
              {availableOrgs.length === 0
                ? "No contracted organizations found. Contact a Super Admin to set up organization contracts."
                : "All available external users have already been added to this project."}
            </Typography>
          ) : (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {availableOrgs.map((org) => (
                <Box key={org.orgId}>
                  <Typography variant="body2" fontWeight={600} color="text.secondary" sx={{ mb: 0.5 }}>
                    {org.orgName}
                  </Typography>
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                    {org.users.map((user) => (
                      <Box
                        key={user.id}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          p: 1,
                          pl: 0.5,
                          borderRadius: 1,
                          cursor: "pointer",
                          "&:hover": { backgroundColor: "action.hover" },
                        }}
                        onClick={() => handleToggleUser(user.id)}
                      >
                        <Checkbox
                          checked={selectedUserIds.has(user.id)}
                          size="small"
                          sx={{ p: 0.5, mr: 1 }}
                        />
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <Typography variant="body2" fontWeight={500} noWrap>
                              {user.name}
                            </Typography>
                            <Chip label={user.roleName} size="small" variant="outlined" />
                          </Box>
                          <Typography variant="caption" color="text.secondary" noWrap>
                            {user.email}
                          </Typography>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </Box>
              ))}
            </Box>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={handleClose} color="inherit">
          Close
        </Button>
        <Button
          variant="contained"
          onClick={handleAddUsers}
          disabled={selectedUserIds.size === 0 || adding}
          startIcon={adding ? <CircularProgress size={18} color="inherit" /> : <GroupAddRounded />}
        >
          {adding ? "Adding..." : `Add Selected (${selectedUserIds.size})`}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ManageExternalUsersModal;
