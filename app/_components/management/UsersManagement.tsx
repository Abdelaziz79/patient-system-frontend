"use client";
import { BulkActionBar } from "@/app/_components/management/BulkActionBar";
import { BulkPasswordResetModal } from "@/app/_components/management/BulkPasswordResetModal";
import { UserCards } from "@/app/_components/management/UserCards";
import { UserFilters } from "@/app/_components/management/UserFilters";
import { UserPagination } from "@/app/_components/management/UserPagination";
import { UserTable } from "@/app/_components/management/UserTable";
import { UserFormModal } from "@/app/_components/profile/UserFormModal";
import { useAuth, User } from "@/app/_hooks/useAuth";
import { UserCreateData, useUserAdmin } from "@/app/_hooks/useUserAdmin";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AnimatePresence, motion } from "framer-motion";
import { FilterIcon, RefreshCw, UserPlusIcon } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { PasswordResetModal } from "./PasswordResetModal";
import { SubscriptionUpdateModal } from "./SubscriptionUpdateModal";

const ITEMS_PER_PAGE = 10;

export default function UsersManagement() {
  // Get current user authentication info
  const { user: currentUser } = useAuth();
  const isSuperAdmin = currentUser?.role === "super_admin";

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
    undeleteUser,
    updateUserSubscription,
    isUpdatingSubscription,
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
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [sortField, setSortField] = useState<keyof User>("name");
  const [sortDirection, setSortDirection] = useState("asc");
  const [isMobileView, setIsMobileView] = useState(false);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [localCurrentPage, setLocalCurrentPage] = useState(1);
  const [isStatusConfirmOpen, setIsStatusConfirmOpen] = useState(false);
  const [paginatedUsers, setPaginatedUsers] = useState<User[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [filtersExpanded, setFiltersExpanded] = useState(false);
  const [bulkSelectMode, setBulkSelectMode] = useState(false);
  const [selectedUserIds, setSelectedUserIds] = useState<Set<string>>(
    new Set()
  );
  const [isBulkPasswordResetModalOpen, setIsBulkPasswordResetModalOpen] =
    useState(false);
  const [isBulkResettingPassword, setIsBulkResettingPassword] = useState(false);

  const isFiltering = Boolean(searchQuery || roleFilter);

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

  // Handle filtered users pagination
  useEffect(() => {
    if (isFiltering) {
      // Client-side pagination for filtered results
      const startIndex = (localCurrentPage - 1) * ITEMS_PER_PAGE;
      const endIndex = startIndex + ITEMS_PER_PAGE;
      setPaginatedUsers(filteredUsers.slice(startIndex, endIndex));
    } else {
      // For non-filtered view, use the users from the backend directly
      setPaginatedUsers(users);
    }
  }, [filteredUsers, localCurrentPage, users, isFiltering]);

  // When filters change, reset to page 1
  useEffect(() => {
    if (searchQuery || roleFilter) {
      setLocalCurrentPage(1);
      // Also clear any selected users when filters change
      setSelectedUserIds(new Set());
    }
  }, [searchQuery, roleFilter]);

  // Sync local page state with hook page state when not filtering
  useEffect(() => {
    if (!searchQuery && !roleFilter) {
      setLocalCurrentPage(currentPage);
    }
  }, [currentPage, searchQuery, roleFilter]);

  // Clean up event handlers when modals change
  useEffect(() => {
    return () => {
      document.body.style.pointerEvents = "";
    };
  }, [
    isUserModalOpen,
    isPasswordChangeModalOpen,
    isStatusConfirmOpen,
    isSubscriptionModalOpen,
    isBulkPasswordResetModalOpen,
  ]);

  // Handle page changes
  const handlePageChange = async (page: number) => {
    // Clear selections when changing pages
    setSelectedUserIds(new Set());
    setLocalCurrentPage(page);

    // Only fetch from backend if no filters are applied
    if (!searchQuery && !roleFilter) {
      try {
        await fetchUsers(page);
      } catch (error) {
        toast.error("Failed to load users");
        console.error("Error fetching users:", error);
      }
    }
  };

  // Refresh data
  const refreshData = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await fetchUsers(localCurrentPage);
      toast.success("User data refreshed");
    } catch (error) {
      toast.error("Failed to refresh data");
      console.error("Error fetching users:", error);
    } finally {
      setIsRefreshing(false);
    }
  }, [fetchUsers, localCurrentPage]);

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

  // Open modal for updating subscription
  const handleUpdateSubscriptionClick = (user: User) => {
    setSelectedUser(user);
    setIsSubscriptionModalOpen(true);
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

  // Toggle user selection for bulk actions
  const toggleUserSelection = (userId: string) => {
    setSelectedUserIds((prevSelected) => {
      const newSelected = new Set(prevSelected);
      if (newSelected.has(userId)) {
        newSelected.delete(userId);
      } else {
        newSelected.add(userId);
      }
      return newSelected;
    });
  };

  // Toggle all users on current page
  const toggleAllUsers = () => {
    if (selectedUserIds.size === paginatedUsers.length) {
      // If all are selected, unselect all
      setSelectedUserIds(new Set());
    } else {
      // Otherwise select all
      setSelectedUserIds(new Set(paginatedUsers.map((user) => user.id)));
    }
  };

  // Reset filters
  const clearFilters = () => {
    setSearchQuery("");
    setRoleFilter("");
    setSortField("name");
    setSortDirection("asc");
  };

  // Handle user status action (deactivate/reactivate)
  const handleUserStatusAction = (userId: string) => {
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
      const isActive = selectedUser.isActive !== false;
      let result;

      if (isActive) {
        result = await deleteUser(selectedUser.id);
      } else {
        result = await undeleteUser(selectedUser.id);
      }

      if (result.success) {
        toast.success(result.message);
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
    // Determine new sort direction
    const newDirection =
      sortField === field && sortDirection === "asc" ? "desc" : "asc";

    // Update the state
    setSortField(field);
    setSortDirection(newDirection);

    // Only fetch from backend if we're not filtering locally
    if (!searchQuery && !roleFilter) {
      fetchUsers(localCurrentPage, ITEMS_PER_PAGE, field, newDirection).catch(
        (error) => {
          toast.error("Failed to sort users");
          console.error("Error fetching sorted users:", error);
        }
      );
    }
  };

  // Toggle bulk select mode
  const toggleBulkSelectMode = () => {
    setBulkSelectMode(!bulkSelectMode);
    // Clear selections when exiting bulk mode
    if (bulkSelectMode) {
      setSelectedUserIds(new Set());
    }
  };

  // Clear all selections
  const clearSelections = () => {
    setSelectedUserIds(new Set());
  };

  // Handle bulk deactivation
  const handleBulkDeactivate = async () => {
    if (selectedUserIds.size === 0) return;

    try {
      // Show loading state - you might want to implement this
      const results = [];

      // Process each selected user
      for (const userId of selectedUserIds) {
        const result = await deleteUser(userId);
        results.push(result);
      }

      // Count successes and failures
      const successCount = results.filter((r) => r.success).length;
      const failureCount = results.length - successCount;

      if (successCount > 0) {
        toast.success(
          `Successfully deactivated ${successCount} user${
            successCount !== 1 ? "s" : ""
          }`
        );
      }

      if (failureCount > 0) {
        toast.error(
          `Failed to deactivate ${failureCount} user${
            failureCount !== 1 ? "s" : ""
          }`
        );
      }

      // Refresh user list and clear selections
      await fetchUsers(localCurrentPage);
      clearSelections();
    } catch (error) {
      toast.error("An error occurred during bulk deactivation");
      console.error("Bulk deactivation error:", error);
    }
  };

  // Handle bulk reactivation
  const handleBulkReactivate = async () => {
    if (selectedUserIds.size === 0) return;

    try {
      // Show loading state - you might want to implement this
      const results = [];

      // Process each selected user
      for (const userId of selectedUserIds) {
        const result = await undeleteUser(userId);
        results.push(result);
      }

      // Count successes and failures
      const successCount = results.filter((r) => r.success).length;
      const failureCount = results.length - successCount;

      if (successCount > 0) {
        toast.success(
          `Successfully reactivated ${successCount} user${
            successCount !== 1 ? "s" : ""
          }`
        );
      }

      if (failureCount > 0) {
        toast.error(
          `Failed to reactivate ${failureCount} user${
            failureCount !== 1 ? "s" : ""
          }`
        );
      }

      // Refresh user list and clear selections
      await fetchUsers(localCurrentPage);
      clearSelections();
    } catch (error) {
      toast.error("An error occurred during bulk reactivation");
      console.error("Bulk reactivation error:", error);
    }
  };

  const handleBulkPasswordReset = () => {
    if (selectedUserIds.size === 0) return;
    setIsBulkPasswordResetModalOpen(true);
  };

  // Add this new function to handle the actual reset
  const executeBulkPasswordReset = async (newPassword: string) => {
    if (selectedUserIds.size === 0) return;

    setIsBulkResettingPassword(true);
    try {
      const results = [];

      // Process each selected user
      for (const userId of selectedUserIds) {
        const result = await resetUserPassword(userId, newPassword);
        results.push(result);
      }

      // Count successes and failures
      const successCount = results.filter((r) => r.success).length;
      const failureCount = results.length - successCount;

      if (successCount > 0) {
        toast.success(
          `Reset passwords for ${successCount} user${
            successCount !== 1 ? "s" : ""
          }`
        );
      }

      if (failureCount > 0) {
        toast.error(
          `Failed to reset passwords for ${failureCount} user${
            failureCount !== 1 ? "s" : ""
          }`
        );
      }

      // Clear selections
      clearSelections();
    } catch (error) {
      toast.error("An error occurred during bulk password reset");
      console.error("Bulk password reset error:", error);
    } finally {
      setIsBulkResettingPassword(false);
    }
  };

  // Optional: Bulk invite users (if you have this functionality)
  const handleBulkInvite = async () => {
    if (selectedUserIds.size === 0) return;

    try {
      // Implement your invite functionality here
      toast.success(
        `Sent invitations to ${selectedUserIds.size} user${
          selectedUserIds.size !== 1 ? "s" : ""
        }`
      );
      clearSelections();
    } catch (error) {
      toast.error("An error occurred while sending invitations");
      console.error("Bulk invite error:", error);
    }
  };

  // Get unique roles for filter dropdown
  const roles =
    users && users.length > 0
      ? Array.from(new Set(users.map((user) => user.role))).sort()
      : ["admin", "doctor", "nurse", "staff"];

  // Calculate pagination data
  const filteredTotalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const totalPages = isFiltering
    ? filteredTotalPages
    : pages || Math.ceil(totalUsers / ITEMS_PER_PAGE);

  // Loading skeletons for better UX
  const UserSkeletons = () => (
    <div className="space-y-4">
      {Array(5)
        .fill(0)
        .map((_, i) => (
          <div
            key={i}
            className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow"
          >
            <div className="flex items-center gap-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-48" />
              </div>
            </div>
          </div>
        ))}
    </div>
  );

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
                  <div className="flex items-center">
                    <CardTitle className="text-xl sm:text-2xl font-bold text-green-800 dark:text-green-300">
                      User Management
                    </CardTitle>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="ml-2 p-1 h-auto"
                      onClick={refreshData}
                      disabled={isRefreshing || isLoading}
                    >
                      <RefreshCw
                        className={`h-4 w-4 text-green-600 dark:text-green-400 ${
                          isRefreshing ? "animate-spin" : ""
                        }`}
                      />
                    </Button>
                  </div>
                  <CardDescription className="text-green-600 dark:text-green-400 mt-1 text-sm">
                    {isFiltering
                      ? `Filtered results: ${filteredUsers.length} user${
                          filteredUsers.length !== 1 ? "s" : ""
                        }`
                      : `Manage system users, roles and permissions • ${totalUsers} total user${
                          totalUsers !== 1 ? "s" : ""
                        }`}
                  </CardDescription>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                  {isFiltering && (
                    <Button
                      onClick={clearFilters}
                      variant="outline"
                      size="sm"
                      className="border-green-200 text-green-700 dark:border-green-800 dark:text-green-400 w-full sm:w-auto"
                    >
                      Clear Filters
                    </Button>
                  )}
                  <Button
                    onClick={handleCreateUserClick}
                    className="w-full sm:w-auto bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 text-white transition-all duration-200"
                  >
                    <UserPlusIcon className="mr-2 h-4 w-4" />
                    <span>Add New User</span>
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="px-3 sm:px-6">
              {/* Search and Filters Component */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    Filters
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setFiltersExpanded(!filtersExpanded)}
                    className="h-8 px-2 text-gray-500 dark:text-gray-400"
                  >
                    <FilterIcon className="h-4 w-4 mr-1" />
                    {filtersExpanded ? "Hide Filters" : "Show Filters"}
                  </Button>
                </div>

                <AnimatePresence>
                  {(filtersExpanded || isFiltering) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <UserFilters
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        roleFilter={roleFilter}
                        setRoleFilter={setRoleFilter}
                        roles={roles}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <div>
                <BulkActionBar
                  selectedCount={selectedUserIds.size}
                  onClearSelection={clearSelections}
                  onToggleBulkMode={toggleBulkSelectMode}
                  bulkSelectMode={bulkSelectMode}
                  onBulkDeactivate={handleBulkDeactivate}
                  onBulkReactivate={handleBulkReactivate}
                  onBulkResetPassword={handleBulkPasswordReset}
                  onBulkInvite={handleBulkInvite}
                />
              </div>
              {/* Loading State */}
              {isLoading ? (
                <UserSkeletons />
              ) : (
                <>
                  {/* Mobile View - Card Layout */}
                  {isMobileView ? (
                    <UserCards
                      users={paginatedUsers}
                      onResetPassword={handleResetPassword}
                      onDeleteUser={handleUserStatusAction}
                      onEditUser={handleEditUserClick}
                      onUpdateSubscription={
                        isSuperAdmin ? handleUpdateSubscriptionClick : undefined
                      }
                      bulkSelectMode={bulkSelectMode}
                      onToggleUserSelection={toggleUserSelection}
                      selectedUserIds={selectedUserIds}
                    />
                  ) : (
                    /* Desktop View - Table Layout */
                    <UserTable
                      users={paginatedUsers}
                      currentPage={localCurrentPage}
                      itemsPerPage={ITEMS_PER_PAGE}
                      sortField={sortField}
                      sortDirection={sortDirection}
                      onSort={handleSort}
                      onResetPassword={handleResetPassword}
                      onDeleteUser={handleUserStatusAction}
                      onEditUser={handleEditUserClick}
                      onUpdateSubscription={
                        isSuperAdmin ? handleUpdateSubscriptionClick : undefined
                      }
                      // New features for bulk selections
                      bulkSelectMode={bulkSelectMode}
                      selectedUserIds={selectedUserIds}
                      onToggleUserSelection={toggleUserSelection}
                      onToggleAllUsers={toggleAllUsers}
                    />
                  )}

                  {/* Pagination and info */}
                  <div className="mt-4  items-center text-sm text-gray-500 dark:text-gray-400">
                    {totalPages > 1 && (
                      <UserPagination
                        currentPage={localCurrentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                        totalUsers={totalUsers}
                        isFiltering={isFiltering}
                        filteredCount={filteredUsers.length}
                        itemsPerPage={ITEMS_PER_PAGE}
                      />
                    )}
                  </div>
                </>
              )}
            </CardContent>

            {/* Status Confirmation Modal - Enhanced with AlertDialog */}
            <AlertDialog
              open={isStatusConfirmOpen}
              onOpenChange={setIsStatusConfirmOpen}
            >
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    {selectedUser?.isActive !== false
                      ? "Deactivate User"
                      : "Reactivate User"}
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    {selectedUser?.isActive !== false
                      ? `Are you sure you want to deactivate ${selectedUser?.name}? They will no longer be able to access the system. This action can be reversed.`
                      : `Are you sure you want to reactivate ${selectedUser?.name}? They will regain access to the system.`}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleConfirmStatusChange}
                    className={
                      selectedUser?.isActive !== false
                        ? "bg-red-600 hover:bg-red-700 text-white"
                        : "bg-green-600 hover:bg-green-700 text-white"
                    }
                  >
                    {selectedUser?.isActive !== false
                      ? "Yes, Deactivate User"
                      : "Yes, Reactivate User"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
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
      <BulkPasswordResetModal
        isOpen={isBulkPasswordResetModalOpen}
        onClose={() => setIsBulkPasswordResetModalOpen(false)}
        selectedUserCount={selectedUserIds.size}
        onReset={executeBulkPasswordReset}
        isResetting={isBulkResettingPassword}
      />

      {/* Subscription Update Modal - Only for super_admin */}
      {isSuperAdmin && (
        <SubscriptionUpdateModal
          isOpen={isSubscriptionModalOpen}
          onClose={() => setIsSubscriptionModalOpen(false)}
          userId={selectedUser?.id || ""}
          userName={selectedUser?.name || ""}
          currentSubscription={selectedUser?.subscription}
          onUpdate={updateUserSubscription}
          isUpdating={isUpdatingSubscription}
        />
      )}
    </div>
  );
}
