import React, { useEffect, useState, useCallback, useRef } from "react";
import toast from "react-hot-toast";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

// MUI Imports
import {
  Box,
  Typography,
  Button,
  IconButton,
  Chip,
  Card,
  CardContent,
  TextField,
  Collapse,
  Dialog,
  CircularProgress,
  Alert,
  Avatar,
  Tooltip,
} from "@mui/material";
import {
  ErrorOutlineRounded,
  ImageNotSupportedRounded,
  VisibilityRounded,
  ChatBubbleOutlineRounded,
  ExpandLessRounded,
  ExpandMoreRounded,
  CheckCircleOutlineRounded,
  CloseRounded,
  AssignmentOutlined,
  GroupsOutlined,
  PersonOutlineRounded,
  CalendarTodayRounded,
  PriorityHighRounded,
  WarningAmberRounded,
  ReportProblemOutlined,
  AddCommentRounded,
} from "@mui/icons-material";

export interface Issue {
  active: boolean;
  assignedBy: string;
  assignee: string;
  assigneeEmail: string;
  assigneedByEmail: string;
  dateDue: string;
  projectName: string;
  description: string;
  id: string;
  image: string;
  teamName: string;
  reportedBy: string;
  reportedByEmail: string;
  severity: "Medium" | "High" | "Low" | "Critical";
  status: "Resolved" | "NotResolved";
  taskName: string;
  lastComment?: string;
  isLastCommentByYou?: boolean;
}

export interface IssueComment {
  id: string;
  content: string;
  dateCreated: string;
  createdBy: {
    id: string;
    name: string;
    email: string;
  };
}

interface IssueComponentProps {
  selectedProject?: any;
  selectedMilestone?: any;
  selectedTeam?: any;
  selectedTask?: any;
  statusFilter?: string;
}

// Severity configuration with colors and icons
const severityConfig = {
  Critical: {
    color: "#dc2626",
    bgColor: "rgba(220, 38, 38, 0.1)",
    icon: PriorityHighRounded,
    pulse: true,
  },
  High: {
    color: "#ef4444",
    bgColor: "rgba(239, 68, 68, 0.1)",
    icon: WarningAmberRounded,
    pulse: false,
  },
  Medium: {
    color: "#f59e0b",
    bgColor: "rgba(245, 158, 11, 0.1)",
    icon: ReportProblemOutlined,
    pulse: false,
  },
  Low: {
    color: "#10b981",
    bgColor: "rgba(16, 185, 129, 0.1)",
    icon: CheckCircleOutlineRounded,
    pulse: false,
  },
};

// Get initials from name
const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

// Format relative time
const formatRelativeTime = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
};

// ─── Mock data ───────────────────────────────────────────────────────────────
const MOCK_ISSUES: Issue[] = [
  {
    id: "issue-001",
    active: true,
    assignedBy: "John Carter",
    assignee: "Mike Torres",
    assigneeEmail: "m.torres@745project.com",
    assigneedByEmail: "pm@745project.com",
    dateDue: "2026-03-01",
    projectName: "745 18th St",
    description:
      "Horizontal cracking observed in north foundation wall approx. 18\" below grade. Crack extends ~4 ft — possible formwork pressure failure during pour.",
    image: "",
    teamName: "Structural Team",
    reportedBy: "Mike Torres",
    reportedByEmail: "m.torres@745project.com",
    severity: "Critical",
    status: "NotResolved",
    taskName: "Foundation Repairs",
  },
  {
    id: "issue-002",
    active: true,
    assignedBy: "John Carter",
    assignee: "Dana Wells",
    assigneeEmail: "d.wells@745project.com",
    assigneedByEmail: "pm@745project.com",
    dateDue: "2026-03-10",
    projectName: "745 18th St",
    description:
      "Water infiltration detected at southeast corner of basement slab after heavy rain. Standing water ~1\" depth. Possible sub-slab drainage blockage.",
    image: "",
    teamName: "Civil Team",
    reportedBy: "Dana Wells",
    reportedByEmail: "d.wells@745project.com",
    severity: "High",
    status: "NotResolved",
    taskName: "Site Drainage & Utilities",
  },
  {
    id: "issue-003",
    active: true,
    assignedBy: "John Carter",
    assignee: "Ray Nguyen",
    assigneeEmail: "r.nguyen@745project.com",
    assigneedByEmail: "pm@745project.com",
    dateDue: "2026-03-20",
    projectName: "745 18th St",
    description:
      "Electrical conduit in west wall rough-in is ¾\" EMT where drawings specify 1\" for feeder run to panel LP-2. Will need to re-pull before drywall.",
    image: "",
    teamName: "MEP Team",
    reportedBy: "Ray Nguyen",
    reportedByEmail: "r.nguyen@745project.com",
    severity: "Medium",
    status: "NotResolved",
    taskName: "Electrical Rough-In",
  },
  {
    id: "issue-004",
    active: true,
    assignedBy: "John Carter",
    assignee: "Sara Kim",
    assigneeEmail: "s.kim@745project.com",
    assigneedByEmail: "pm@745project.com",
    dateDue: "2026-04-05",
    projectName: "745 18th St",
    description:
      "Tree trimming on north boundary encroached ~2 ft onto adjacent property. Neighbor notified. Arborist report needed before final landscaping.",
    image: "",
    teamName: "Landscaping Crew",
    reportedBy: "Sara Kim",
    reportedByEmail: "s.kim@745project.com",
    severity: "Low",
    status: "NotResolved",
    taskName: "Landscaping & Grading",
  },
];

const MOCK_COMMENTS: Record<string, IssueComment[]> = {
  "issue-001": [
    {
      id: "c-001-1",
      content: "Structural engineer has been notified. Site visit scheduled for Tuesday morning.",
      dateCreated: "2026-02-20T09:15:00Z",
      createdBy: { id: "u-1", name: "John Carter", email: "pm@745project.com" },
    },
    {
      id: "c-001-2",
      content: "Crack width measured at 1/8\". Monitoring with gauges. Holding concrete work in adjacent bays until review.",
      dateCreated: "2026-02-21T14:30:00Z",
      createdBy: { id: "u-2", name: "Mike Torres", email: "m.torres@745project.com" },
    },
  ],
  "issue-002": [
    {
      id: "c-002-1",
      content: "Checked drain tile around perimeter — outlet at SE corner is partially blocked with construction debris. Clearing tomorrow.",
      dateCreated: "2026-02-22T11:00:00Z",
      createdBy: { id: "u-3", name: "Dana Wells", email: "d.wells@745project.com" },
    },
  ],
  "issue-003": [],
  "issue-004": [],
};
// ─────────────────────────────────────────────────────────────────────────────

const IssueComponent: React.FC<IssueComponentProps> = ({
  statusFilter,
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const highlightedIssueId = searchParams.get("issueId");
  const issueRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);
  const [activeCommentBox, setActiveCommentBox] = useState<string | null>(null);
  const [commentText, setCommentText] = useState("");
  const [submittingCommentId, setSubmittingCommentId] = useState<string | null>(null);
  const [expandedIssueId, setExpandedIssueId] = useState<string | null>(null);
  const [issueComments, setIssueComments] = useState<Record<string, IssueComment[]>>({});
  const [resolvingIssueId, setResolvingIssueId] = useState<string | null>(null);

  // Auto-expand and scroll to highlighted issue
  useEffect(() => {
    if (highlightedIssueId && issues.length > 0) {
      // Expand the highlighted issue
      setExpandedIssueId(highlightedIssueId);

      // Scroll to the issue after a short delay
      setTimeout(() => {
        const issueElement = issueRefs.current[highlightedIssueId];
        if (issueElement) {
          issueElement.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 300);

      // Clear the issueId from URL after highlighting
      setTimeout(() => {
        searchParams.delete("issueId");
        setSearchParams(searchParams, { replace: true });
      }, 3000);
    }
  }, [highlightedIssueId, issues]);

  const fetchIssues = useCallback(() => {
    setLoading(true);
    setError(null);
    // Filter mock issues by status param (default "NotResolved")
    const wantStatus = statusFilter ? statusFilter.replace(/\s/g, "") : "NotResolved";
    const filtered = MOCK_ISSUES.filter((i) => i.status === wantStatus || wantStatus === "All");
    setIssues(filtered);
    // Pre-load comments so the thread is ready without a fetch
    setIssueComments(MOCK_COMMENTS);
    setLoading(false);
  }, [statusFilter]);

  useEffect(() => {
    fetchIssues();
  }, [fetchIssues]);

  const fetchComments = useCallback((issueId: string) => {
    // Comments are pre-loaded from MOCK_COMMENTS — nothing to fetch
    setIssueComments((prev) => ({
      ...prev,
      [issueId]: prev[issueId] ?? MOCK_COMMENTS[issueId] ?? [],
    }));
  }, []);

  const toggleComments = (issueId: string) => {
    if (expandedIssueId === issueId) {
      setExpandedIssueId(null);
    } else {
      setExpandedIssueId(issueId);
      if (!issueComments[issueId]) {
        fetchComments(issueId);
      }
    }
  };

  const handleAddComment = (issueId: string) => {
    if (!commentText.trim()) return;
    setSubmittingCommentId(issueId);
    const newComment: IssueComment = {
      id: `c-new-${Date.now()}`,
      content: commentText,
      dateCreated: new Date().toISOString(),
      createdBy: { id: "demo-user", name: "Demo User", email: "demo@745project.com" },
    };
    setIssueComments((prev) => ({
      ...prev,
      [issueId]: [...(prev[issueId] ?? []), newComment],
    }));
    setCommentText("");
    setActiveCommentBox(null);
    setExpandedIssueId(issueId);
    setSubmittingCommentId(null);
  };

  const handleResolveIssue = (issueId: string) => {
    setResolvingIssueId(issueId);
    setTimeout(() => {
      setResolvingIssueId(null);
      toast("This is a demo — issue resolution is not persisted.", {
        icon: "🛈",
        duration: 3500,
      });
    }, 600);
  };

  // Loading State
  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          py: 8,
        }}
      >
        <CircularProgress size={32} />
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          Loading issues...
        </Typography>
      </Box>
    );
  }

  // Error State
  if (error) {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", py: 8 }}>
        <Alert severity="error" sx={{ maxWidth: 400 }}>
          {error.message}
        </Alert>
      </Box>
    );
  }

  // Empty State
  if (issues.length === 0) {
    return (
      <Box sx={{ py: 8, textAlign: "center" }}>
        <Box
          sx={{
            width: 64,
            height: 64,
            borderRadius: "50%",
            bgcolor: "grey.200",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mx: "auto",
            mb: 2,
          }}
        >
          <ErrorOutlineRounded sx={{ fontSize: 32, color: "grey.500" }} />
        </Box>
        <Typography variant="h6" fontWeight={600} gutterBottom>
          No Issues Found
        </Typography>
        <Typography variant="body2" color="text.secondary">
          No issues found for above selections
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5, pb: 4 }}>
      <AnimatePresence>
        {issues.map((issue, index) => {
          const severity = severityConfig[issue.severity];
          const SeverityIcon = severity.icon;

          const isHighlighted = issue.id === highlightedIssueId;

          return (
            <motion.div
              key={issue.id}
              ref={(el) => { issueRefs.current[issue.id] = el; }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Card
                sx={{
                  borderRadius: 3,
                  overflow: "hidden",
                  border: isHighlighted ? 2 : 1,
                  borderColor: isHighlighted ? "primary.main" : "divider",
                  transition: "all 0.2s ease-in-out",
                  bgcolor: "background.default",
                  boxShadow: isHighlighted ? "0 0 10px rgba(25, 118, 210, 0.4)" : "none",
                }}
              >
                {/* Header */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    px: 2.5,
                    py: 1.5,
                    bgcolor: severity.bgColor,
                    borderBottom: 1,
                    borderColor: "divider",
                  }}
                >
                  <Chip
                    icon={
                      <SeverityIcon
                        sx={{
                          fontSize: 12,
                          color: `${severity.color} !important`,
                          animation: severity.pulse ? "pulse 2s infinite" : "none",
                          "@keyframes pulse": {
                            "0%, 100%": { opacity: 1 },
                            "50%": { opacity: 0.5 },
                          },
                        }}
                      />
                    }
                    label={issue.severity}
                    size="small"
                    sx={{
                      bgcolor: "background.default",
                      color: severity.color,
                      fontWeight: 600,
                      fontSize: "0.75rem",
                      border: 1,
                      px: 1,
                      py: 1.8,
                      borderColor: severity.color,
                      "& .MuiChip-icon": {
                        ml: 0,
                      },
                    }}
                  />
                  <Box
                    sx={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      bgcolor: issue.status === "Resolved" ? "success.main" : "warning.main",
                    }}
                  />
                </Box>

                <CardContent sx={{ p: 2.5, "&:last-child": { pb: 2 } }}>
                  {/* Body - Image and Details */}
                  <Box sx={{ display: "flex", gap: 2.5, alignItems: "flex-start" }}>
                    {/* Image Container with Hover Effect */}
                    <Box
                      sx={{
                        width: { xs: 100, sm: 120 },
                        height: { xs: 100, sm: 120 },
                        flexShrink: 0,
                        borderRadius: 2,
                        border: 1,  
                        borderColor: "divider",
                        overflow: "hidden",
                        bgcolor: "grey.100",
                        position: "relative",
                        "&:hover .image-overlay": {
                          opacity: 1,
                        },
                        "&:hover img": {
                          transform: "scale(1.05)",
                        },
                      }}
                    >
                      {issue.image ? (
                        <>
                          <Box
                            component="img"
                            src={issue.image}
                            alt={`Issue: ${issue.description}`}
                            sx={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                              transition: "transform 0.3s ease",
                            }}
                          />
                          <Box
                            className="image-overlay"
                            sx={{
                              position: "absolute",
                              inset: 0,
                              bgcolor: "rgba(0,0,0,0.5)",
                              opacity: 0,
                              transition: "opacity 0.2s ease",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <IconButton
                              onClick={() => setFullscreenImage(issue.image)}
                              sx={{
                                bgcolor: "rgba(255,255,255,0.2)",
                                color: "#fff",
                                "&:hover": { bgcolor: "rgba(255,255,255,0.3)" },
                              }}
                            >
                              <VisibilityRounded />
                            </IconButton>
                          </Box>
                        </>
                      ) : (
                        <Box
                          sx={{
                            width: "100%",
                            height: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            bgcolor: "grey.100",
                          }}
                        >
                          <ImageNotSupportedRounded sx={{ fontSize: 32, color: "grey.400" }} />
                        </Box>
                      )}
                    </Box>

                    {/* Details */}
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography
                        variant="subtitle1"
                        fontWeight={600}
                        sx={{
                          mb: 1.5,
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {issue.description}
                      </Typography>

                      {/* Info Items with Icons */}
                      <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75 }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <AssignmentOutlined sx={{ fontSize: 16, color: "text.secondary" }} />
                          <Typography variant="body2" color="text.secondary" noWrap>
                            {issue.taskName}
                          </Typography>
                        </Box>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <GroupsOutlined sx={{ fontSize: 16, color: "text.secondary" }} />
                          <Typography variant="body2" color="text.secondary">
                            {issue.teamName}
                          </Typography>
                        </Box>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <PersonOutlineRounded sx={{ fontSize: 16, color: "text.secondary" }} />
                          <Typography variant="body2" color="text.secondary" noWrap>
                            {issue.reportedByEmail}
                          </Typography>
                        </Box>
                        {issue.dateDue && (
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <CalendarTodayRounded sx={{ fontSize: 16, color: "text.secondary" }} />
                            <Typography variant="body2" color="text.secondary">
                              Due: {new Date(issue.dateDue).toLocaleDateString()}
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    </Box>
                  </Box>

                  {/* Footer - Action Buttons */}
                  <Box
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 1,
                      pt: 2,
                      mt: 2,
                      borderTop: 1,
                      borderColor: "divider",
                      alignItems: "center",
                    }}
                  >
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => toggleComments(issue.id)}
                      startIcon={<ChatBubbleOutlineRounded sx={{ fontSize: 16 }} />}
                      endIcon={expandedIssueId === issue.id ? <ExpandLessRounded /> : <ExpandMoreRounded />}
                      sx={{ textTransform: "none", borderRadius: 5 }}
                    >
                      Comments
                    </Button>

                    <Button
                      size="small"
                      variant="outlined"
                      color="primary"
                      onClick={() => {
                        setActiveCommentBox(activeCommentBox === issue.id ? null : issue.id);
                        if (expandedIssueId !== issue.id) {
                          toggleComments(issue.id);
                        }
                      }}
                      startIcon={<AddCommentRounded sx={{ fontSize: 16 }} />}
                      sx={{ textTransform: "none", borderRadius: 5 }}
                    >
                      Add Comment
                    </Button>

                    <Box sx={{ flex: 1 }} />

                    {issue.status !== "Resolved" && (
                      <Button
                        size="small"
                        variant="contained"
                        color="success"
                        onClick={() => handleResolveIssue(issue.id)}
                        disabled={resolvingIssueId === issue.id}
                        startIcon={
                          resolvingIssueId === issue.id ? (
                            <CircularProgress size={16} color="inherit" />
                          ) : (
                            <CheckCircleOutlineRounded sx={{ fontSize: 16 }} />
                          )
                        }
                        sx={{
                          textTransform: "none",
                          borderRadius: 5,
                          px: 2,
                        }}
                      >
                        {resolvingIssueId === issue.id ? "Resolving..." : "Mark Resolved"}
                      </Button>
                    )}
                  </Box>

                  {/* Comments Thread */}
                  <Collapse in={expandedIssueId === issue.id}>
                    <Box sx={{ mt: 2, pt: 2, borderTop: 1, borderColor: "divider" }}>
                      <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1.5 }}>
                        Comments Thread
                      </Typography>

                      {issueComments[issue.id]?.length === 0 ? (
                        <Box
                          sx={{
                            py: 3,
                            textAlign: "center",
                            bgcolor: "action.hover",
                            borderRadius: 2,
                          }}
                        >
                          <ChatBubbleOutlineRounded sx={{ fontSize: 32, color: "text.disabled", mb: 1 }} />
                          <Typography variant="body2" color="text.secondary">
                            No comments yet. Be the first to comment!
                          </Typography>
                        </Box>
                      ) : (
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, maxHeight: 300, overflow: "auto" }}>
                          {issueComments[issue.id]?.map((comment) => (
                            <Box
                              key={comment.id}
                              sx={{
                                display: "flex",
                                gap: 1.5,
                                p: 1.5,
                                bgcolor: "action.hover",
                                borderRadius: 2,
                              }}
                            >
                              <Avatar
                                sx={{
                                  width: 36,
                                  height: 36,
                                  bgcolor: "primary.main",
                                  fontSize: "0.875rem",
                                }}
                              >
                                {getInitials(comment.createdBy.name)}
                              </Avatar>
                              <Box sx={{ flex: 1, minWidth: 0 }}>
                                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 0.5 }}>
                                  <Typography variant="body2" fontWeight={600}>
                                    {comment.createdBy.name}
                                  </Typography>
                                  <Tooltip title={new Date(comment.dateCreated).toLocaleString()}>
                                    <Typography variant="caption" color="text.secondary">
                                      {formatRelativeTime(comment.dateCreated)}
                                    </Typography>
                                  </Tooltip>
                                </Box>
                                <Typography variant="body2" color="text.primary">
                                  {comment.content}
                                </Typography>
                              </Box>
                            </Box>
                          ))}
                        </Box>
                      )}
                    </Box>
                  </Collapse>

                  {/* Comment Box */}
                  <Collapse in={activeCommentBox === issue.id}>
                    <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 1.5 }}>
                      <TextField
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder="Write your comment..."
                        multiline
                        rows={2}
                        size="small"
                        fullWidth
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 2,
                          },
                        }}
                      />
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => handleAddComment(issue.id)}
                          disabled={submittingCommentId === issue.id || !commentText.trim()}
                          sx={{ textTransform: "none", borderRadius: 2 }}
                        >
                          {submittingCommentId === issue.id ? "Submitting..." : "Submit"}
                        </Button>
                        <Button
                          variant="outlined"
                          onClick={() => {
                            setActiveCommentBox(null);
                            setCommentText("");
                          }}
                          sx={{ textTransform: "none", borderRadius: 2 }}
                        >
                          Cancel
                        </Button>
                      </Box>
                    </Box>
                  </Collapse>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* Fullscreen Image Dialog */}
      <Dialog
        open={fullscreenImage !== null}
        onClose={() => setFullscreenImage(null)}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: "transparent",
            boxShadow: "none",
          },
        }}
      >
        <Box sx={{ position: "relative" }}>
          <IconButton
            onClick={() => setFullscreenImage(null)}
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              bgcolor: "rgba(0,0,0,0.6)",
              color: "#fff",
              "&:hover": { bgcolor: "rgba(0,0,0,0.8)" },
              zIndex: 1,
            }}
          >
            <CloseRounded />
          </IconButton>
          {fullscreenImage && (
            <Box
              component="img"
              src={fullscreenImage}
              sx={{
                width: "100%",
                maxHeight: "90vh",
                objectFit: "contain",
                borderRadius: 2,
              }}
            />
          )}
        </Box>
      </Dialog>
    </Box>
  );
};

export default IssueComponent;
