import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  IconButton,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { toast } from "react-toastify";

type AddIndustryModalProps = {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
};

const AddIndustryModal: React.FC<AddIndustryModalProps> = ({ open, onClose, onSuccess }) => {
  const [form, setForm] = useState({ name: "", description: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error("Name is required");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const result = await fetch(`${import.meta.env.VITE_BACKEND_URL}/industry/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: form.name.trim(),
          description: form.description?.trim(),
        }),
      });

      if (!result.ok) {
        const errorBody = await result.json().catch(() => null);
        const message =
          (errorBody && (errorBody.message || errorBody.error)) ||
          (result.status === 409 ? "An industry with this name already exists." : "Failed to add industry");
        throw new Error(message);
      }

      toast.success("Industry added successfully");
      setForm({ name: "", description: "" });
      onSuccess();
      onClose();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to add industry");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        Add Industry
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              label="Name"
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              required
              fullWidth
              autoFocus
            />
            <TextField
              label="Description"
              value={form.description}
              onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
              multiline
              rows={3}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={onClose} color="inherit">
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? "Adding..." : "Add"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddIndustryModal;
