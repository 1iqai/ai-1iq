import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  IconButton,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { toast } from "react-toastify";
import type { Organization } from "../DashBoards/OrganizationManagement/OrganizationManagement";

type DeleteOrganizationModalProps = {
  open: boolean;
  organization: Organization | null;
  onClose: () => void;
  onSuccess: () => void;
};

const DeleteOrganizationModal: React.FC<DeleteOrganizationModalProps> = ({
  open,
  organization,
  onClose,
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!organization) return;

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const result = await fetch(`${import.meta.env.VITE_BACKEND_URL}/organization/delete/${organization.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!result.ok) {
        throw new Error(`Failed to delete organization, status: ${result.status}`);
      }

      toast.success("Organization deleted successfully");
      onSuccess();
      onClose();
    } catch (error) {
      toast.error("Failed to delete organization");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        Confirm Deletion
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Typography>
          Are you sure you want to delete <strong>{organization?.name}</strong>? This action cannot be undone.
        </Typography>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button onClick={handleDelete} variant="contained" color="error" disabled={loading}>
          {loading ? "Deleting..." : "Delete"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteOrganizationModal;
