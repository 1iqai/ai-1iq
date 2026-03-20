import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import DashboardHeader from "../../../../components/shared/DashboardHeader";
import AddDivisionModal from "../../Modals/AddDivisionModal";
import EditDivisionModal from "../../Modals/EditDivisionModal";
import DeleteDivisionModal from "../../Modals/DeleteDivisionModal";
import type { Division } from "../../types/Division";
import {
  Box,
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
  Typography,
} from "@mui/material";
import {
  Add as AddIcon,
  Search as SearchIcon,
  DriveFileRenameOutlineRounded as EditIcon,
  DeleteOutlineRounded as DeleteIcon,
  NavigateNext,
} from "@mui/icons-material";

const DivisionManagement = () => {
  const [divisions, setDivisions] = useState<Division[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editingDivision, setEditingDivision] = useState<Division | null>(null);
  const [deletingDivision, setDeletingDivision] = useState<Division | null>(null);

  const fetchDivisions = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const url = new URL(`${import.meta.env.VITE_BACKEND_URL}/division/list`);

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
        throw new Error(`Failed to fetch divisions, status: ${response.status}`);
      }

      const { data, meta } = await response.json();
      setDivisions(data || []);
      setTotalPages(meta?.totalPages ?? 1);
      setTotalCount(meta?.totalItems || meta?.total || data.length);
    } catch (error) {
      toast.error("Failed to fetch divisions");
      setDivisions([]);
      setTotalPages(0);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchDivisions();
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [searchTerm, page, limit]);

  return (
    <>
      <DashboardHeader
        title="Team Management"
        subtitle="Manage all teams, their details, and related information."
        breadcrumbs={[{ label: "Dashboard", path: "/super-admin/dashboard" }, { label: "Team Management" }]}
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
              Add a Team
            </Button>
          </div>
        </motion.div>

        {/* Division Table */}
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
                Loading divisions...
              </Typography>
            </Box>
          ) : divisions.length === 0 ? (
            <Box
              sx={{
                textAlign: "center",
                py: 8,
                backgroundColor: "background.default",
                borderRadius: 2,
              }}
            >
              <Typography variant="h6" color="text.primary">
                No Team Found
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Add your first division to get started.
              </Typography>
            </Box>
          ) : (
            <TableContainer
              component={Box}
              sx={{
                borderColor: "divider",
              }}
            >
              <Table
                sx={{
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
                    <TableCell style={{ minWidth: 220 }} sx={{ fontWeight: 600 }}>Name</TableCell>
                    <TableCell style={{ minWidth: 420 }} sx={{ fontWeight: 600 }}>Description</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 600 }}>
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {divisions.map((division) => (
                    <TableRow
                      key={division.id}
                      sx={{
                        "&:hover": {
                          backgroundColor: "action.hover",
                        },
                      }}
                    >
                      <TableCell>
                        <Typography variant="body2" fontWeight={500}>
                          {division.name}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {division.description?.trim() || "-"}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: "flex", gap: 1, justifyContent: "center", alignItems: "center" }}>
                          <Tooltip title="Edit Team">
                            <IconButton
                              size="medium"
                              onClick={() => {
                                setEditingDivision(division);
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
                          <Tooltip title="Delete Team">
                            <IconButton
                              size="medium"
                              onClick={() => {
                                setDeletingDivision(division);
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
        </motion.div>

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
              Total Team: {totalCount}
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
      </Box>

      <AddDivisionModal open={isAddOpen} onClose={() => setIsAddOpen(false)} onSuccess={fetchDivisions} />
      <EditDivisionModal
        open={isEditOpen}
        division={editingDivision}
        onClose={() => {
          setIsEditOpen(false);
          setEditingDivision(null);
        }}
        onSuccess={fetchDivisions}
      />
      <DeleteDivisionModal
        open={isDeleteOpen}
        division={deletingDivision}
        onClose={() => {
          setIsDeleteOpen(false);
          setDeletingDivision(null);
        }}
        onSuccess={fetchDivisions}
      />
    </>
  );
};

export default DivisionManagement;
