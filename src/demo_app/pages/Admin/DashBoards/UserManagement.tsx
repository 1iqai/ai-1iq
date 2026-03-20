import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { signUp } from "../../../utility/utils";
import DashboardHeader from "../../../components/shared/DashboardHeader";
import { toast } from "react-toastify";
import { handleError } from "../../../utility/errorHandler";
import { formatedRoleChars } from "../../../utility/getRole";
import { SearchIcon } from "../../../components/Icons/SearchIcon";
import { DeleteUserModal } from "../Components/DeleteUserModal";
import { AddUserModal } from "../Components/AddUserModal";
import { EditUserModal } from "../Components/EditUserModal";
import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Box,
  IconButton,
  Tooltip,
  Avatar,
  Chip,
  Button,
  Select,
  MenuItem,
  FormControl,
} from "@mui/material";
import { DeleteOutlined, PersonAdd, NavigateNext, CheckCircleOutlined } from "@mui/icons-material";
import DriveFileRenameOutlineRoundedIcon from "@mui/icons-material/DriveFileRenameOutlineRounded";

export type RoleOption = {
  name: string;
  id: string;
};

export type UserStatus = "Active" | "Invited" | "Disabled" | "Deleted";

export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  uid: string;
  role: string;
  active: UserStatus;
  roleId: string;
  password?: string;
  lastLogin: string | null;
  image: string;
  divisions?: { id: string; name: string }[];
  organizationId?: string | null;
}

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, _setRoleFilter] = useState("All");
  const [statusFilter, _setStatusFilter] = useState("All");
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState<User | null>(null);
  const [roles, setRoles] = useState<RoleOption[]>([]);
  const token = localStorage.getItem("token");

  // Helper function to get status chip color
  const getStatusChipColor = (status: UserStatus): "success" | "info" | "warning" | "error" | "default" => {
    switch (status) {
      case "Active":
        return "success";
      case "Invited":
        return "info";
      case "Disabled":
        return "warning";
      case "Deleted":
        return "error";
      default:
        return "default";
    }
  };
  const fetchRoles = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/user/roles`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();

      setRoles(data.data || []);
    } catch (error) {
      // console.error("Error fetching roles:", error);
      setRoles([]);
    }
  };

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    fetchRoles();
    setIsLoading(true);
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const url = new URL(`${import.meta.env.VITE_BACKEND_URL}/user/list-search-users`);

      // Add query parameters using URLSearchParams
      if (searchTerm) {
        url.searchParams.append("query", searchTerm);
      }
      url.searchParams.append("page", page.toString());
      url.searchParams.append("limit", limit.toString());

      // Use the standard fetch API
      const response = await fetch(url.toString(), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Check if the response was successful (status code 200-299)
      if (!response.ok) {
        throw new Error(`Network response was not ok, status: ${response.status}`);
      }
      const { data, meta } = await response.json(); // Parse the JSON response
      setUsers(data);
      setTotalPages(meta.totalPages);
      setTotalCount(meta.totalItems);
    } catch (error) {
      // console.error("Error fetching users:", error);
      setUsers([]);

      setTotalPages(0);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchUsers();
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [searchTerm, page, limit]);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      if (roleFilter !== "All" && user.role !== roleFilter) return false;
      if (statusFilter !== "All" && user.active !== statusFilter) return false;
      return true;
    });
  }, [users, roleFilter, statusFilter]);

  const handleEditUser = (user: User) => {
    setUserToEdit(user);
    setIsEditUserModalOpen(true);
  };

  const handleUpdateUser = async (
    updatedUser: Partial<User>
  ): Promise<boolean | string> => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/user/update-user/${updatedUser.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: updatedUser.name,
          email: updatedUser.email,
          roleId: updatedUser.roleId,
        }),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || `Failed to update user, status: ${response.status}`);
      }
      toast.success(`User '${updatedUser.name}' updated successfully!`);
      fetchUsers();
      return true;
    } catch (error) {
      // console.error("Error updating user:", error);
      return handleError(error).message;
    }
  };

  const openDeleteModal = (user: User) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteUser = async () => {
    if (!userToDelete) return;
    try {
      const result = await fetch(`${import.meta.env.VITE_BACKEND_URL}/user/delete-user/${userToDelete.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!result.ok) {
        throw new Error("Failed to delete user.");
      }
      toast.success(`User '${userToDelete.name}' deleted successfully.`);
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user.");
    } finally {
      setIsDeleteModalOpen(false);
      setUserToDelete(null);
    }
  };

  const handleActivateUser = async (user: User) => {
    try {
      const result = await fetch(`${import.meta.env.VITE_BACKEND_URL}/user/activate-user/${user.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!result.ok) {
        const errorData = await result.json().catch(() => null);
        throw new Error(errorData?.message || "Failed to activate user.");
      }
      toast.success(`User '${user.name}' activated successfully.`);
      fetchUsers();
    } catch (error) {
      console.error("Error activating user:", error);
      toast.error(handleError(error).message);
    }
  };

  const handleAddUser = async (formdata: any): Promise<boolean | string> => {
    try {
      const result = await signUp(formdata);

      if (!result.ok) {
        const errorData = await result.json();
        throw new Error(errorData.message);
      }

      const data = await result.json();

      if (data) {
        toast.success(`User '${formdata.name}' added successfully!`);
        fetchUsers();
        return true;
      } else {
        throw new Error("Add user failed.");
      }
    } catch (error) {
      console.error("Error adding new user:", error);
      return handleError(error).message;
    }
  };

  return (
    <>
      <Box sx={{p: 2}}>
        <DashboardHeader
          title="User Management"
          subtitle="Manage all users, their roles, and system access."
          breadcrumbs={[{ label: "Dashboard", path: "/admin/dashboard" }, { label: "User Management" }]}
        />

        <Box
          sx={{
            padding: {
              xs: 1.5,
              md: 2,
            },
            borderRadius: 2,
            backgroundColor: "background.default",
          }}
        >
          {/* Toolbar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="flex flex-col md:flex-row items-end md:items-center md:justify-between gap-4"
          >
            <div className="relative w-full md:w-auto">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <SearchIcon />
              </div>
              <input
                type="text"
                placeholder="Search by name or email..."
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
                startIcon={<PersonAdd />}
                onClick={() => setIsAddUserModalOpen(true)}
                sx={{ whiteSpace: "nowrap" }}
              >
                Add User
              </Button>
            </div>
          </motion.div>

          {/* User Table */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="mt-6"
          >
            {isLoading ? (
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
                  Loading users...
                </Typography>
              </Box>
            ) : filteredUsers.length === 0 ? (
              <Box
                sx={{
                  textAlign: "center",
                  py: 8,
                  backgroundColor: "background.default",
                  borderRadius: 2,
                }}
              >
                <Typography variant="h6" color="text.primary">
                  No Users Found
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Your search or filter criteria did not match any users.
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
                      py: 1,
                      px: 2.5,
                    },
                  }}
                >
                  <TableHead>
                    <TableRow sx={{ backgroundColor: "background.surface" }}>
                      <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Username</TableCell>
                      <TableCell style={{ minWidth: 50 }} sx={{ fontWeight: 600 }}>
                        Role
                      </TableCell>

                      <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 600 }}>
                        Actions
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredUsers.map((user, index) => (
                      <TableRow
                        key={user.id}
                        component={motion.tr}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        sx={{
                          "&:hover": {
                            backgroundColor: "action.hover",
                          },
                        }}
                      >
                        {/* Name Column */}
                        <TableCell>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                            <Avatar src={user.image} alt={user.name} sx={{ width: 35, height: 35 }}>
                              {user.name.charAt(0).toUpperCase()}
                            </Avatar>
                            <Box>
                              <Typography variant="body2" fontWeight={500}>
                                {user.name}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {user.email}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>

                        {/* Username Column */}
                        <TableCell>
                          <Typography variant="body2">{user.username}</Typography>
                        </TableCell>

                        {/* Role Column */}
                        <TableCell>
                          <Typography variant="body2">{formatedRoleChars(user.role) || "N/A"}</Typography>
                        </TableCell>


                        {/* Status Column */}
                        <TableCell>
                          <Chip label={user.active} size="medium" color={getStatusChipColor(user.active)} />
                        </TableCell>

                        {/* Actions Column */}
                        <TableCell align="center">
                          {user.role !== "Super Admin" && user.active !== "Deleted" && (
                            <Box sx={{ display: "flex", gap: 1, justifyContent: "center" }}>
                              {user.active === "Disabled" && (
                                <Tooltip title="Activate User">
                                  <IconButton
                                    size="medium"
                                    onClick={() => handleActivateUser(user)}
                                    sx={{
                                      color: "success.main",
                                      transition: "all 0.2s ease-in-out",
                                      "&:hover": {
                                        backgroundColor: "success.main",
                                        color: "success.contrastText",
                                        transform: "scale(1.05)",
                                      },
                                    }}
                                  >
                                    <CheckCircleOutlined fontSize="medium" />
                                  </IconButton>
                                </Tooltip>
                              )}
                              <Tooltip title="Edit User">
                                <IconButton
                                  size="medium"
                                  onClick={() => handleEditUser(user)}
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
                                  <DriveFileRenameOutlineRoundedIcon fontSize="medium" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Delete User">
                                <IconButton
                                  size="medium"
                                  onClick={() => openDeleteModal(user)}
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
                                  <DeleteOutlined fontSize="medium" />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </motion.div>

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
                Total Users: {totalCount}
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

          <AnimatePresence>
            {isAddUserModalOpen && (
              <AddUserModal
                isOpen={isAddUserModalOpen}
                onClose={() => setIsAddUserModalOpen(false)}
                onAddUser={handleAddUser}
                roles={roles}
              />
            )}
            {isEditUserModalOpen && (
              <EditUserModal
                isOpen={isEditUserModalOpen}
                onClose={() => setIsEditUserModalOpen(false)}
                onEditUser={handleUpdateUser}
                userToEdit={userToEdit}
                roles={roles}
              />
            )}
            {isDeleteModalOpen && (
              <DeleteUserModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDeleteUser}
                userToDelete={userToDelete}
              />
            )}
          </AnimatePresence>
        </Box>
      </Box>
    </>
  );
};

export default UserManagement;
