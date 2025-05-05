"use client";
import { useAuth } from "@/app/_hooks/auth/useAuth";
import useMobileView from "@/app/_hooks/useMobileView";
import { useUserAdmin } from "@/app/_hooks/userAdmin/useUserAdmin";
import { User, UserCreateData } from "@/app/_types/User";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { UsersManagementContent } from "./UsersManagementContent";
import { UsersManagementHeader } from "./UsersManagementHeader";
import { UsersManagementModals } from "./UsersManagementModals";
import { useLanguage } from "@/app/_contexts/LanguageContext";

const ITEMS_PER_PAGE = 10;

export default function UsersManagement() {
  // Get language context for RTL support
  const { t, isRTL } = useLanguage();

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

  // Mobile view hook
  const { isMobileView } = useMobileView();

  const isFiltering = Boolean(searchQuery || roleFilter);

  // Load users when component mounts
  useEffect(() => {
    fetchUsers(1).catch((error) => {
      toast.error(error.message || "Failed to load users");
    });
  }, [fetchUsers]);

  // Filter users
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

    setFilteredUsers(result);
  }, [searchQuery, roleFilter, users]);

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

  return (
    <div
      className="min-h-screen dark:from-slate-900 dark:to-slate-800"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full"
        >
          <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border-green-100 dark:border-green-900 shadow-xl">
            <UsersManagementHeader
              isFiltering={isFiltering}
              filteredUsersCount={filteredUsers.length}
              totalUsers={totalUsers}
              onRefresh={refreshData}
              isRefreshing={isRefreshing}
              onClearFilters={clearFilters}
              onCreateUser={handleCreateUserClick}
              isRTL={isRTL}
            />

            <UsersManagementContent
              isLoading={isLoading}
              isMobileView={isMobileView}
              isFiltering={isFiltering}
              filtersExpanded={filtersExpanded}
              setFiltersExpanded={setFiltersExpanded}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              roleFilter={roleFilter}
              setRoleFilter={setRoleFilter}
              roles={roles}
              paginatedUsers={paginatedUsers}
              bulkSelectMode={bulkSelectMode}
              selectedUserIds={selectedUserIds}
              onToggleUserSelection={toggleUserSelection}
              onToggleAllUsers={toggleAllUsers}
              onResetPassword={handleResetPassword}
              onDeleteUser={handleUserStatusAction}
              onEditUser={handleEditUserClick}
              onUpdateSubscription={handleUpdateSubscriptionClick}
              isSuperAdmin={isSuperAdmin}
              currentPage={localCurrentPage}
              itemsPerPage={ITEMS_PER_PAGE}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              totalUsers={totalUsers}
              filteredUsersCount={filteredUsers.length}
              onClearSelection={clearSelections}
              onToggleBulkMode={toggleBulkSelectMode}
              onBulkDeactivate={handleBulkDeactivate}
              onBulkReactivate={handleBulkReactivate}
              onBulkResetPassword={handleBulkPasswordReset}
              onBulkInvite={handleBulkInvite}
              isRTL={isRTL}
            />
          </Card>
        </motion.div>
      </div>

      <UsersManagementModals
        isUserModalOpen={isUserModalOpen}
        setIsUserModalOpen={setIsUserModalOpen}
        userModalMode={userModalMode}
        selectedUser={selectedUser}
        isCreating={isCreating}
        isUpdating={isUpdating}
        onSubmitUserForm={handleSubmitUserForm}
        isPasswordChangeModalOpen={isPasswordChangeModalOpen}
        setIsPasswordChangeModalOpen={setIsPasswordChangeModalOpen}
        isResettingPassword={isResettingPassword}
        onResetPassword={async (userId, newPassword) => {
          const result = await resetUserPassword(userId, newPassword);
          if (result.success) {
            toast.success(result.message);
          } else {
            toast.error(result.message);
          }
          return result;
        }}
        isBulkPasswordResetModalOpen={isBulkPasswordResetModalOpen}
        setIsBulkPasswordResetModalOpen={setIsBulkPasswordResetModalOpen}
        isBulkResettingPassword={isBulkResettingPassword}
        onBulkResetPassword={executeBulkPasswordReset}
        selectedUserIds={selectedUserIds}
        isSubscriptionModalOpen={isSubscriptionModalOpen}
        setIsSubscriptionModalOpen={setIsSubscriptionModalOpen}
        isUpdatingSubscription={isUpdatingSubscription}
        onUpdateSubscription={async (userId, subscription) => {
          const result = await updateUserSubscription(userId, subscription);
          if (result.success) {
            toast.success(result.message);
          } else {
            toast.error(result.message);
          }
          return result;
        }}
        isStatusConfirmOpen={isStatusConfirmOpen}
        setIsStatusConfirmOpen={setIsStatusConfirmOpen}
        onConfirmStatusChange={handleConfirmStatusChange}
        isSuperAdmin={isSuperAdmin}
        isRTL={isRTL}
      />
    </div>
  );
}
