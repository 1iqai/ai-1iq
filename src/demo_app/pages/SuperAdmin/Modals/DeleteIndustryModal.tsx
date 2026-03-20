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
import type { Industry } from "../types/Industry";

type DeleteIndustryModalProps = {
  open: boolean;
  industry: Industry | null;
  onClose: () => void;
  onSuccess: () => void;
};

const DeleteIndustryModal: React.FC<DeleteIndustryModalProps> = ({ open, industry, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!industry) return;

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const result = await fetch(`${import.meta.env.VITE_BACKEND_URL}/industry/delete/${industry.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!result.ok) {
        throw new Error(`Failed to delete industry, status: ${result.status}`);
      }

      toast.success("Industry deleted successfully");
      onSuccess();
      onClose();
    } catch (error) {
      toast.error("Failed to delete industry");
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
          Are you sure you want to delete <strong>{industry?.name}</strong>? This action cannot be undone.
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

export default DeleteIndustryModal;
