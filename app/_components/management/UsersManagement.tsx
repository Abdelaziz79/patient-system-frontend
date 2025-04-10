"use client";
import { UserCards } from "@/app/_components/management/UserCards";
import { UserFilters } from "@/app/_components/management/UserFilters";
import { UserPagination } from "@/app/_components/management/UserPagination";
import { UserTable } from "@/app/_components/management/UserTable";
import { UserFormModal } from "@/app/_components/profile/UserFormModal";
import { User } from "@/app/_hooks/useAuth";
import { UserCreateData, useUserAdmin } from "@/app/_hooks/useUserAdmin";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { motion } from "framer-motion";
import { Loader2, UserPlusIcon } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { PasswordResetModal } from "./PasswordResetModal";

const ITEMS_PER_PAGE = 10;

export default function UsersManagement() {
  // User admin hook for data and operations
  const {
    users,
    totalUsers,
    currentPage,
    isLoading,
    isCreating,
    fetchUsers,
    createUser,
    resetUserPassword,
    isResettingPassword,
    deleteUser,
    undeleteUser, // Added hook function for reactivating users
    pages,
    isUpdating,
    updateUser,
  } = useUserAdmin();

  // Component state
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [userModalMode, setUserModalMode] = useState<"create" | "update">(
    "create"
  );
  const [isPasswordChangeModalOpen, setIsPasswordChangeModalOpen] =
    useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [sortField, setSortField] = useState<keyof User>("name");
  const [sortDirection, setSortDirection] = useState("asc");
  const [isMobileView, setIsMobileView] = useState(false);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [localCurrentPage, setLocalCurrentPage] = useState(1);
  const [isStatusConfirmOpen, setIsStatusConfirmOpen] = useState(false); // New state for confirmation modal

  // Check for mobile view
  useEffect(() => {
    const checkMobileView = () => {
      setIsMobileView(window.innerWidth < 768);
    };
    checkMobileView();
    window.addEventListener("resize", checkMobileView);
    return () => {
      window.removeEventListener("resize", checkMobileView);
    };
  }, []);

  // Load users when component mounts
  useEffect(() => {
    fetchUsers(1).catch((error) => {
      toast.error(error.message || "Failed to load users");
    });
  }, []);

  // Filter and sort users
  useEffect(() => {
    if (!users) return;

    let result = [...users];

    // Apply search filter
    if (searchQuery) {
      result = result.filter(
        (user) =>
          user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply role filter
    if (roleFilter) {
      result = result.filter((user) => user.role === roleFilter);
    }

    // Apply sorting
    result.sort((a, b) => {
      const valueA = String(a[sortField] || "").toLowerCase();
      const valueB = String(b[sortField] || "").toLowerCase();

      if (sortDirection === "asc") {
        return valueA.localeCompare(valueB);
      } else {
        return valueB.localeCompare(valueA);
      }
    });

    setFilteredUsers(result);
  }, [searchQuery, roleFilter, users, sortField, sortDirection]);

  // When filters change, reset to page 1
  useEffect(() => {
    if (searchQuery || roleFilter) {
      setLocalCurrentPage(1);
    }
  }, [searchQuery, roleFilter]);

  // Sync local page state with hook page state
  useEffect(() => {
    setLocalCurrentPage(currentPage);
  }, [currentPage]);

  useEffect(() => {
    // This runs when the component unmounts or when modal states change
    return () => {
      // Cleanup function to ensure any stuck focus/event handlers are reset
      document.body.style.pointerEvents = "";
    };
  }, [isUserModalOpen, isPasswordChangeModalOpen, isStatusConfirmOpen]);

  // Handler for page changes
  const handlePageChange = (page: number) => {
    setLocalCurrentPage(page);
    fetchUsers(page).catch((error) => {
      toast.error(error.message || "Failed to load users");
    });
  };

  // Open modal for creating a new user
  const handleCreateUserClick = () => {
    setSelectedUser(null);
    setUserModalMode("create");
    setIsUserModalOpen(true);
  };

  // Open modal for editing an existing user
  const handleEditUserClick = (user: User) => {
    setSelectedUser(user);
    setUserModalMode("update");
    setIsUserModalOpen(true);
  };

  // Close user modal (both create and update)
  const handleCloseUserModal = () => {
    setIsUserModalOpen(false);
  };

  // Handle form submission (works for both create and update)
  const handleSubmitUserForm = async (userData: UserCreateData | User) => {
    try {
      let result;

      if (userModalMode === "create") {
        result = await createUser(userData as UserCreateData);
      } else {
        // For update, ensure we have the ID
        if (!selectedUser?.id) {
          toast.error("Missing user ID for update");
          return;
        }
        result = await updateUser(selectedUser.id, userData);
      }

      if (result.success) {
        toast.success(result.message);
        setIsUserModalOpen(false);
        // Refresh user list after operation
        fetchUsers(localCurrentPage);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error(
        `Failed to ${userModalMode === "create" ? "create" : "update"} user`
      );
      console.error(
        `Error ${userModalMode === "create" ? "creating" : "updating"} user:`,
        error
      );
    }
  };

  // Handle password reset request
  const handleResetPassword = (userId: string) => {
    // Get the user details first
    const user = users.find((u) => u.id === userId);
    if (user) {
      setSelectedUser(user);
      setIsPasswordChangeModalOpen(true);
    }
  };

  // Updated to handle both deactivate and reactivate user
  const handleUserStatusAction = (userId: string) => {
    // Get the user details first
    const user = users.find((u) => u.id === userId);
    if (user) {
      setSelectedUser(user);
      setIsStatusConfirmOpen(true);
    }
  };

  // Handle confirmation to toggle user status
  const handleConfirmStatusChange = async () => {
    if (!selectedUser) return;

    try {
      // Check if user is active to determine action
      const isActive = selectedUser.isActive !== false;
      let result;

      if (isActive) {
        // Deactivate user
        result = await deleteUser(selectedUser.id);
      } else {
        // Reactivate user
        result = await undeleteUser(selectedUser.id);
      }

      if (result.success) {
        toast.success(result.message);
        // Refresh the current page
        fetchUsers(localCurrentPage);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error(
        `Failed to ${
          selectedUser.isActive !== false ? "deactivate" : "reactivate"
        } user`
      );
      console.error("Error toggling user status:", error);
    } finally {
      setIsStatusConfirmOpen(false);
    }
  };

  const handleSort = (field: keyof User) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Get unique roles for filter dropdown
  const roles =
    users && users.length > 0
      ? Array.from(new Set(users.map((user) => user.role))).sort()
      : ["admin", "doctor", "nurse", "staff"];

  // Calculate pagination data
  const totalPages = pages || Math.ceil(totalUsers / ITEMS_PER_PAGE);

  return (
    <div className="min-h-screen dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full"
        >
          <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border-green-100 dark:border-green-900 shadow-xl">
            <CardHeader className="px-4 sm:px-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <CardTitle className="text-xl sm:text-2xl font-bold text-green-800 dark:text-green-300">
                    User Management
                  </CardTitle>
                  <CardDescription className="text-green-600 dark:text-green-400 mt-1 text-sm">
                    Manage system users, roles and permissions
                  </CardDescription>
                </div>
                <Button
                  onClick={handleCreateUserClick}
                  className="w-full sm:w-auto bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 text-white transition-all duration-200"
                >
                  <UserPlusIcon className="mr-2 h-4 w-4" />
                  <span>Add New User</span>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="px-3 sm:px-6">
              {/* Search and Filters Component */}
              <UserFilters
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                roleFilter={roleFilter}
                setRoleFilter={setRoleFilter}
                roles={roles}
              />

              {/* Loading State */}
              {isLoading ? (
                <div className="flex items-center justify-center py-8 sm:py-12">
                  <Loader2 className="h-10 w-10 sm:h-12 sm:w-12 animate-spin text-green-600 dark:text-green-400" />
                </div>
              ) : (
                <>
                  {/* Mobile View - Card Layout */}
                  {isMobileView ? (
                    <UserCards
                      users={filteredUsers}
                      currentPage={localCurrentPage}
                      itemsPerPage={ITEMS_PER_PAGE}
                      onResetPassword={handleResetPassword}
                      onDeleteUser={handleUserStatusAction}
                      onEditUser={handleEditUserClick}
                    />
                  ) : (
                    /* Desktop View - Table Layout */
                    <UserTable
                      users={filteredUsers}
                      currentPage={localCurrentPage}
                      itemsPerPage={ITEMS_PER_PAGE}
                      sortField={sortField}
                      sortDirection={sortDirection}
                      onSort={handleSort}
                      onResetPassword={handleResetPassword}
                      onDeleteUser={handleUserStatusAction}
                      onEditUser={handleEditUserClick}
                    />
                  )}

                  {/* Pagination Component */}
                  <div className="mt-4 flex flex-col sm:flex-row justify-between items-center text-sm text-gray-500 dark:text-gray-400">
                    <div>
                      Total users:{" "}
                      <span className="font-medium">
                        {filteredUsers.length}
                      </span>{" "}
                      of <span className="font-medium">{totalUsers}</span>
                    </div>

                    {totalPages > 1 && (
                      <UserPagination
                        currentPage={localCurrentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                      />
                    )}
                  </div>
                </>
              )}
            </CardContent>

            {/* Status Confirmation Modal */}
            {isStatusConfirmOpen && selectedUser && (
              <CardFooter className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <div
                  className={`w-full ${
                    selectedUser.isActive !== false
                      ? "bg-red-50 dark:bg-red-900/10"
                      : "bg-green-50 dark:bg-green-900/10"
                  } p-4 rounded-md`}
                >
                  <p
                    className={`${
                      selectedUser.isActive !== false
                        ? "text-red-600 dark:text-red-400"
                        : "text-green-600 dark:text-green-400"
                    } font-medium mb-4`}
                  >
                    {selectedUser.isActive !== false
                      ? "Are you sure you want to deactivate this user? This action can be reversed later."
                      : "Are you sure you want to reactivate this user?"}
                  </p>
                  <div className="flex gap-4">
                    <Button
                      onClick={() => setIsStatusConfirmOpen(false)}
                      variant="outline"
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleConfirmStatusChange}
                      variant={
                        selectedUser.isActive !== false
                          ? "destructive"
                          : "default"
                      }
                      className={`flex-1 ${
                        selectedUser.isActive === false
                          ? "bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 text-white"
                          : ""
                      }`}
                    >
                      {selectedUser.isActive !== false
                        ? "Confirm Deactivation"
                        : "Confirm Reactivation"}
                    </Button>
                  </div>
                </div>
              </CardFooter>
            )}
          </Card>
        </motion.div>
      </div>

      {/* User Form Modal (handles both create and update) */}
      <UserFormModal
        isOpen={isUserModalOpen}
        onClose={handleCloseUserModal}
        onSubmit={handleSubmitUserForm}
        isSubmitting={userModalMode === "create" ? isCreating : isUpdating}
        user={selectedUser}
        mode={userModalMode}
      />

      {/* Password Change Modal */}
      <PasswordResetModal
        isOpen={isPasswordChangeModalOpen}
        onClose={() => setIsPasswordChangeModalOpen(false)}
        userId={selectedUser?.id || ""}
        userName={selectedUser?.name || ""}
        onReset={resetUserPassword}
        isResetting={isResettingPassword}
      />
    </div>
  );
}
