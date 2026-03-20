import type { User } from "../DashBoards/UserManagement";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton,
} from "@mui/material";
import { CloseRounded as CloseIcon, WarningAmberRounded as WarningIcon } from "@mui/icons-material";

interface DeleteUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  userToDelete: User | null;
}

export const DeleteUserModal: React.FC<DeleteUserModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  userToDelete,
}) => {
  return (
    <Dialog
      open={isOpen && userToDelete !== null}
      onClose={onClose}
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
      {userToDelete && (
        <>
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
              Confirm Deletion
            </Typography>
            <IconButton
              aria-label="close"
              onClick={onClose}
              sx={{
                color: "text.secondary",
              }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>

          <DialogContent dividers>
            <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
              <WarningIcon
                sx={{
                  color: "error.main",
                  fontSize: 40,
                  flexShrink: 0,
                }}
              />
              <Box>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  Are you sure you want to delete the user{" "}
                  <Typography component="span" fontWeight={600}>
                    {userToDelete.name}
                  </Typography>
                  ?
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  This action cannot be undone. All user data will be permanently removed.
                </Typography>
              </Box>
            </Box>
          </DialogContent>

          <DialogActions sx={{ px: 3, py: 2 }}>
            <Button onClick={onClose} color="inherit">
              Cancel
            </Button>
            <Button onClick={onConfirm} variant="contained" color="error">
              Delete
            </Button>
          </DialogActions>
        </>
      )}
    </Dialog>
  );
};
