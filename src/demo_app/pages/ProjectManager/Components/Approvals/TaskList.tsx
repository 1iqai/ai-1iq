import { useState } from "react";
import type { ITask } from "../../Dashboards/ProjectManagement/Approvals";
import { motion } from "framer-motion";
import { capitalCase } from "change-case";
import { formatDate } from "../../../../utility/dateCalculations";
import {
  TaskAcceptanceStatusColours,
  type TaskAcceptanceStatusType,
} from "../../../../constants";

// MUI Imports
import {
  Box,
  Typography,
  Button,
  Chip,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { WarningAmberRounded, CheckCircle } from "@mui/icons-material";

interface TaskListProps {
  tasks: ITask[];
  onSelectTask: (task: ITask) => void;
  selectedTaskId: string | undefined;
  refetch: () => void;
}

export const TaskList: React.FC<TaskListProps> = ({ tasks, onSelectTask, selectedTaskId, refetch }) => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState<'accept' | 'reject' | null>(null);
  const [activeTask, setActiveTask] = useState<ITask | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Multi-select state
  const [selectedTaskIds, setSelectedTaskIds] = useState<Set<string>>(new Set());
  const [showBulkConfirmModal, setShowBulkConfirmModal] = useState(false);
  const [bulkAction, setBulkAction] = useState<'accept' | 'reject' | null>(null);

  // Filter tasks that can be selected (only MarkedComplete status)
  const selectableTasks = tasks.filter(t => t.status === 'MarkedComplete');
  const allSelected = selectableTasks.length > 0 && selectableTasks.every(t => selectedTaskIds.has(t.id));
  const someSelected = selectedTaskIds.size > 0;

  const toggleTaskSelection = (taskId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedTaskIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(taskId)) {
        newSet.delete(taskId);
      } else {
        newSet.add(taskId);
      }
      return newSet;
    });
  };

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedTaskIds(new Set());
    } else {
      setSelectedTaskIds(new Set(selectableTasks.map(t => t.id)));
    }
  };

  const openModal = (task: ITask, action: 'accept' | 'reject') => {
    setActiveTask(task);
    setConfirmAction(action);
    setShowConfirmModal(true);
  };

  const closeModal = () => {
    setShowConfirmModal(false);
    setConfirmAction(null);
    setActiveTask(null);
  };

  const openBulkModal = (action: 'accept' | 'reject') => {
    setBulkAction(action);
    setShowBulkConfirmModal(true);
  };

  const closeBulkModal = () => {
    setShowBulkConfirmModal(false);
    setBulkAction(null);
  };

  const handleConfirm = async () => {
    if (!confirmAction || !activeTask) return;
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      const confirm = confirmAction === 'accept';
      await fetch(`${import.meta.env.VITE_BACKEND_URL}/task/${activeTask.id}/confirm`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ confirm }),
      });
      await refetch();
      closeModal();
    } catch (err) {
      alert(`Failed to ${confirmAction} task.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBulkConfirm = async () => {
    if (!bulkAction || selectedTaskIds.size === 0) return;
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      const confirm = bulkAction === 'accept';
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/task/bulk-confirm`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          taskIds: Array.from(selectedTaskIds),
          confirm
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to process tasks');
      }

      setSelectedTaskIds(new Set());
      await refetch();
      closeBulkModal();
    } catch (err) {
      alert(`Failed to ${bulkAction} tasks.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusColor = (status: string): TaskAcceptanceStatusType => {
    const statusMap: Record<string, TaskAcceptanceStatusType> = {
      MarkedComplete: "Marked Complete",
      TaskComplete: "Task Complete",
      TaskRejected: "Task Rejected",
    };
    return statusMap[status] || "Marked Complete";
  };

  return (
    <>
      {/* Bulk Action Header */}
      {selectableTasks.length > 0 && (
        <Box sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 1,
          py: 1.5,
          mb: 1,
          bgcolor: "background.paper",
          borderRadius: 1,
          border: 1,
          borderColor: "divider"
        }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={allSelected}
                indeterminate={someSelected && !allSelected}
                onChange={toggleSelectAll}
                color="primary"
              />
            }
            label={
              <Typography variant="body2" fontWeight={500}>
                Select All ({selectableTasks.length})
              </Typography>
            }
          />

          {someSelected && (
            <Box sx={{ display: "flex", gap: 1 }}>
              <Button
                variant="contained"
                color="success"
                size="small"
                onClick={() => openBulkModal('accept')}
                startIcon={<CheckCircle />}
                sx={{ textTransform: "none" }}
              >
                Accept Selected ({selectedTaskIds.size})
              </Button>
            </Box>
          )}
        </Box>
      )}

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2, px: 1 }}>
        {tasks.map((task) => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Card
              onClick={() => onSelectTask(task)}
              sx={{
                cursor: "pointer",
                transition: "all 0.2s ease",
                border: 2,
                borderColor: selectedTaskIds.has(task.id)
                  ? "success.main"
                  : selectedTaskId === task.id
                    ? "primary.main"
                    : "divider",
                bgcolor: selectedTaskIds.has(task.id)
                  ? "success.lighter"
                  : selectedTaskId === task.id
                    ? "action.selected"
                    : "background.paper",
                "&:hover": {
                  borderColor: "primary.light",
                  bgcolor: "action.hover",
                },
              }}
            >
              <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
                <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
                  {/* Checkbox for MarkedComplete tasks */}
                  {task.status === 'MarkedComplete' && (
                    <Checkbox
                      checked={selectedTaskIds.has(task.id)}
                      onClick={(e) => toggleTaskSelection(task.id, e)}
                      sx={{ p: 0, mt: 0.5 }}
                      color="success"
                    />
                  )}

                  {/* Status Dot for non-selectable tasks */}
                  {task.status !== 'MarkedComplete' && (
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        mt: 1,
                        flexShrink: 0,
                        bgcolor: TaskAcceptanceStatusColours[getStatusColor(task.status)],
                      }}
                    />
                  )}

                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    {/* Header Row */}
                    <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 1 }}>
                      <Typography
                        variant="subtitle2"
                        fontWeight={600}
                        sx={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          flex: 1,
                        }}
                      >
                        {task.name}
                      </Typography>
                      <Chip
                        label={capitalCase(task.status)}
                        size="small"
                        sx={{
                          bgcolor: TaskAcceptanceStatusColours[getStatusColor(task.status)],
                          color: "#fff",
                          fontWeight: 500,
                          fontSize: "0.75rem",
                        }}
                      />
                    </Box>

                    {/* Project Name */}
                    <Typography variant="body2" fontWeight={500} color="text.primary" sx={{ mt: 0.5 }}>
                      Project Name: {task.milestone.project.name}
                    </Typography>

                    {/* Meta Info */}
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mt: 1 }}>
                      <Typography variant="caption" color="text.secondary">
                        Due: {task.endDate ? formatDate(task.endDate) : "No due date"}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Team Name: {task.teamName || "Unassigned"}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Completed By: {task.assigneeUser || "Unassigned"}
                      </Typography>
                    </Box>

                    {/* Action Buttons - Only show for MarkedComplete tasks */}
                    {task.status === 'MarkedComplete' && (
                      <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
                        <Button
                          variant="contained"
                          color="success"
                          size="small"
                          onClick={(e) => { e.stopPropagation(); openModal(task, 'accept'); }}
                          sx={{ textTransform: "none" }}
                        >
                          Accept
                        </Button>
                        <Button
                          variant="contained"
                          color="error"
                          size="small"
                          onClick={(e) => { e.stopPropagation(); openModal(task, 'reject'); }}
                          sx={{ textTransform: "none" }}
                        >
                          Reject
                        </Button>
                      </Box>
                    )}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </Box>

      {/* Single Task Confirmation Dialog */}
      <Dialog
        open={showConfirmModal && activeTask !== null}
        onClose={closeModal}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ textAlign: "center", pb: 1 }}>
          <WarningAmberRounded
            sx={{
              fontSize: 48,
              color: confirmAction === 'accept' ? "success.main" : "error.main",
              mb: 1,
            }}
          />
          <Typography variant="h6" fontWeight={600}>
            Confirm {confirmAction === 'accept' ? 'Accept' : 'Reject'} Task
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" textAlign="center">
            Are you sure you want to {confirmAction === 'accept' ? 'accept' : 'reject'} "{activeTask?.name}"?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
          <Button
            variant="outlined"
            onClick={closeModal}
            disabled={isSubmitting}
            sx={{ flex: 1, textTransform: "none" }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color={confirmAction === 'accept' ? "success" : "error"}
            onClick={handleConfirm}
            disabled={isSubmitting}
            sx={{ flex: 1, textTransform: "none" }}
            startIcon={isSubmitting ? <CircularProgress size={16} color="inherit" /> : null}
          >
            {confirmAction === 'accept' ? 'Accept' : 'Reject'} Task
          </Button>
        </DialogActions>
      </Dialog>

      {/* Bulk Confirmation Dialog */}
      <Dialog
        open={showBulkConfirmModal}
        onClose={closeBulkModal}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ textAlign: "center", pb: 1 }}>
          <CheckCircle
            sx={{
              fontSize: 48,
              color: "success.main",
              mb: 1,
            }}
          />
          <Typography variant="h6" fontWeight={600}>
            Confirm Bulk Accept
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" textAlign="center">
            Are you sure you want to accept {selectedTaskIds.size} task{selectedTaskIds.size > 1 ? 's' : ''}?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
          <Button
            variant="outlined"
            onClick={closeBulkModal}
            disabled={isSubmitting}
            sx={{ flex: 1, textTransform: "none" }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="success"
            onClick={handleBulkConfirm}
            disabled={isSubmitting}
            sx={{ flex: 1, textTransform: "none" }}
            startIcon={isSubmitting ? <CircularProgress size={16} color="inherit" /> : null}
          >
            Accept {selectedTaskIds.size} Task{selectedTaskIds.size > 1 ? 's' : ''}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
