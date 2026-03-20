import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  CircularProgress,
  Select,
  MenuItem,
  Tooltip,
  FormControl,
} from "@mui/material";
import {
  Add as AddIcon,
  Search as SearchIcon,
  DriveFileRenameOutlineRounded as EditIcon,
  DeleteOutlineRounded as DeleteIcon,
  NavigateNext,
} from "@mui/icons-material";
import { toast } from "react-toastify";
import AddIndustryModal from "../Modals/AddIndustryModal";
import EditIndustryModal from "../Modals/EditIndustryModal";
import DeleteIndustryModal from "../Modals/DeleteIndustryModal";
import type { Industry } from "../types/Industry";
import { motion } from "framer-motion";
import DashboardHeader from "../../../components/shared/DashboardHeader";

const IndustryManagement = () => {
  const [industries, setIndustries] = useState<Industry[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editingIndustry, setEditingIndustry] = useState<Industry | null>(null);
  const [deletingIndustry, setDeletingIndustry] = useState<Industry | null>(null);

  const fetchIndustries = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const url = new URL(`${import.meta.env.VITE_BACKEND_URL}/industry/list`);

      if (searchTerm) {
        url.searchParams.append("query", searchTerm);
      }
      url.searchParams.append("page", page.toString());
      url.searchParams.append("limit", limit.toString());

      const response = await fetch(url.toString(), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch industries, status: ${response.status}`);
      }

      const { data, meta } = await response.json();
      setIndustries(data || []);
      setTotalPages(meta?.totalPages ?? 1);
      setTotalCount(meta?.totalItems || meta?.total || data.length);
    } catch (error) {
      toast.error("Failed to fetch industries");
      setIndustries([]);
      setTotalPages(0);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchIndustries();
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [searchTerm, page, limit]);

  return (
    <>
      <DashboardHeader
        title="Industry Management"
        subtitle="Manage industries. Add, edit, or delete items."
        breadcrumbs={[{ label: "Dashboard", path: "/super-admin/dashboard" }, { label: "Industry Management" }]}
      />

      <Box sx={{ padding: { xs: 1.5, md: 2 }, borderRadius: 2, backgroundColor: "background.default" }}>
        {/* Toolbar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex flex-col md:flex-row items-center justify-between gap-4"
        >
          <div className="relative w-full md:w-auto">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <SearchIcon />
            </div>
            <input
              type="text"
              placeholder="Search by name..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1); // Reset to first page on new search
              }}
              className="w-full md:w-64 lg:w-80 pl-10 pr-4 py-2 bg-bg-secondary-light dark:bg-bg-secondary-dark border border-gray-200/50 dark:border-gray-700/50 rounded-lg focus:ring-2 focus:ring-brand-primary-500 focus:border-brand-primary-500 outline-none transition"
            />
          </div>
          <div className="flex items-center justify-end gap-4 w-full md:w-auto">
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => setIsAddOpen(true)}
              sx={{ whiteSpace: "nowrap" }}
            >
              Add Industry
            </Button>
          </div>
        </motion.div>

        {/* Industry Table */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mt-6"
        >
          {loading ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                py: 8,
              }}
            >
              <CircularProgress size={40} />
              <Typography variant="body2" sx={{ mt: 2, color: "text.secondary" }}>
                Loading industries...
              </Typography>
            </Box>
          ) : industries.length === 0 ? (
            <Box
              sx={{
                textAlign: "center",
                py: 8,
                backgroundColor: "background.default",
                borderRadius: 2,
              }}
            >
              <Typography variant="h6" color="text.primary">
                No Industries Found
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Add your first industry to get started.
              </Typography>
            </Box>
          ) : (
            <TableContainer
              component={Box}
              sx={{
                borderColor: "divider",
                // 1. Force the container to handle scrolling
                overflowX: "auto",
                width: "100%",
                display: "block",
              }}
            >
              <Table
                sx={{
                  minWidth: 1000,
                  width: "100%",
                  "& .MuiTableCell-root": {
                    borderBottom: "1px solid",
                    borderColor: "divider",
                    py: 1.5,
                    px: 2.5,
                    
                  },
                }}
              >
                <TableHead>
                  <TableRow sx={{ backgroundColor: "background.surface" }}>
                    <TableCell style={{ minWidth: 220 }} sx={{ fontWeight: 600 }}>
                      Name
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, minWidth: 300 }}>
                      Description
                    </TableCell>
                    <TableCell align="center" sx={{ fontWeight: 600 , maxWidth: 120}}>
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {industries.map((industry) => (
                    <TableRow
                      key={industry.id}
                      sx={{
                        "&:hover": {
                          backgroundColor: "action.hover",
                        },
                      }}
                    >
                      <TableCell>
                        <Typography variant="body2" fontWeight={500}>
                          {industry.name}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ minWidth: 300 }}>
                        <Typography variant="body2" color="text.secondary">
                          {industry.description?.trim() || "-"}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: "flex", gap: 1, justifyContent: "center", alignItems: "center" }}>
                          <Tooltip title="Edit Industry">
                            <IconButton
                              size="medium"
                              onClick={() => {
                                setEditingIndustry(industry);
                                setIsEditOpen(true);
                              }}
                              sx={{
                                color: "primary.main",
                                transition: "all 0.2s ease-in-out",
                                "&:hover": {
                                  backgroundColor: "primary.main",
                                  color: "primary.contrastText",
                                  transform: "scale(1.05)",
                                },
                              }}
                            >
                              <EditIcon fontSize="medium" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete Industry">
                            <IconButton
                              size="medium"
                              onClick={() => {
                                setDeletingIndustry(industry);
                                setIsDeleteOpen(true);
                              }}
                              sx={{
                                color: "error.main",
                                transition: "all 0.2s ease-in-out",
                                "&:hover": {
                                  backgroundColor: "error.main",
                                  color: "error.contrastText",
                                  transform: "scale(1.05)",
                                },
                              }}
                            >
                              <DeleteIcon fontSize="medium" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {/* Pagination Controls */}
          {totalPages > 0 && (
            <Box
              sx={{
                display: "flex",
                gap: { xs: 1, md: 4 },
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: {
                  xs: "flex-end",
                  sm: "space-between",
                },
                pt: 2,
              }}
            >
              {/* Left side - Total Users Count */}
              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                Total Industry: {totalCount}
              </Typography>

              {/* Right side - Pagination controls */}
              <Box
                sx={{
                  width: {
                    xs: "100%",
                    sm: "auto",
                  },
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: {
                    xs: "flex-end",
                    sm: "space-between",
                  },
                  alignItems: "center",
                  gap: {
                    xs: 1,
                    sm: 4,
                  },
                }}
              >
                {/* Rows per page */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography noWrap variant="body2" color="text.secondary">
                    Rows per page:
                  </Typography>
                  <FormControl size="small">
                    <Select
                      value={limit}
                      onChange={(event) => {
                        setLimit(Number(event.target.value));
                        setPage(1);
                      }}
                      sx={{
                        minWidth: 60,
                        "& .MuiSelect-select": {
                          py: 0.5,
                          px: 1,
                          fontSize: "0.875rem",
                        },
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: "divider",
                        },
                      }}
                    >
                      <MenuItem value={5}>5</MenuItem>
                      <MenuItem value={10}>10</MenuItem>
                      <MenuItem value={25}>25</MenuItem>
                      <MenuItem value={50}>50</MenuItem>
                    </Select>
                  </FormControl>
                </Box>

                {/* Range display with navigation */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    {`${(page - 1) * limit + 1}–${Math.min(page * limit, totalCount)} of ${totalCount}`}
                  </Typography>
                  <Box sx={{ display: "flex", gap: 0.5 }}>
                    <IconButton
                      size="small"
                      onClick={() => setPage(1)}
                      disabled={page === 1}
                      sx={{
                        color: "text.secondary",
                        "&:disabled": { color: "action.disabled" },
                      }}
                    >
                      <NavigateNext sx={{ transform: "rotate(180deg)" }} fontSize="small" />
                      <NavigateNext sx={{ transform: "rotate(180deg)", ml: -1.5 }} fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => setPage(page - 1)}
                      disabled={page === 1}
                      sx={{
                        color: "text.secondary",
                        "&:disabled": { color: "action.disabled" },
                      }}
                    >
                      <NavigateNext sx={{ transform: "rotate(180deg)" }} fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => setPage(page + 1)}
                      disabled={page === totalPages}
                      sx={{
                        color: "text.secondary",
                        "&:disabled": { color: "action.disabled" },
                      }}
                    >
                      <NavigateNext fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => setPage(totalPages)}
                      disabled={page === totalPages}
                      sx={{
                        color: "text.secondary",
                        "&:disabled": { color: "action.disabled" },
                      }}
                    >
                      <NavigateNext fontSize="small" />
                      <NavigateNext sx={{ ml: -1.5 }} fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
              </Box>
            </Box>
          )}
        </motion.div>
      </Box>

      <AddIndustryModal open={isAddOpen} onClose={() => setIsAddOpen(false)} onSuccess={fetchIndustries} />
      <EditIndustryModal
        open={isEditOpen}
        industry={editingIndustry}
        onClose={() => {
          setIsEditOpen(false);
          setEditingIndustry(null);
        }}
        onSuccess={fetchIndustries}
      />
      <DeleteIndustryModal
        open={isDeleteOpen}
        industry={deletingIndustry}
        onClose={() => {
          setIsDeleteOpen(false);
          setDeletingIndustry(null);
        }}
        onSuccess={fetchIndustries}
      />
    </>
  );
};

export default IndustryManagement;
