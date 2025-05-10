"use client";
import { useLanguage } from "@/app/_contexts/LanguageContext";
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

const ITEMS_PER_PAGE = 10;

export default function UsersManagement() {
  // Get language context for RTL support
  const { t, isRTL, dir } = useLanguage();

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
  const [isStatusConfirmOpen, setIsStatusConfirmOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [bulkSelectMode, setBulkSelectMode] = useState(false);
  const [selectedUserIds, setSelectedUserIds] = useState<Set<string>>(
    new Set()
  );
  const [isBulkPasswordResetModalOpen, setIsBulkPasswordResetModalOpen] =
    useState(false);
  const [isBulkResettingPassword, setIsBulkResettingPassword] = useState(false);

  // Mobile view hook
  const { isMobileView } = useMobileView();

  // Load users when component mounts
  useEffect(() => {
    fetchUsers(1).catch((error) => {
      console.error("Error fetching users:", error);
      toast.error(t("failedToLoadUsers"));
    });
  }, [fetchUsers, t]);

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

    try {
      await fetchUsers(page);
    } catch (error) {
      toast.error(t("failedToLoadUsers"));
      console.error("Error fetching users:", error);
    }
  };

  // Refresh data
  const refreshData = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await fetchUsers(currentPage);
      toast.success(t("userDataRefreshed"));
    } catch (error) {
      toast.error(t("failedToRefreshData"));
      console.error("Error fetching users:", error);
    } finally {
      setIsRefreshing(false);
    }
  }, [fetchUsers, currentPage, t]);

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
          toast.error(t("missingUserIdUpdate"));
          return;
        }
        result = await updateUser(selectedUser.id, userData);
      }

      if (result.success) {
        toast.success(result.message);
        setIsUserModalOpen(false);
        // Refresh user list after operation
        fetchUsers(currentPage);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error(
        userModalMode === "create"
          ? t("failedToCreateUser")
          : t("failedToUpdateUser")
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
    if (selectedUserIds.size === users.length) {
      // If all are selected, unselect all
      setSelectedUserIds(new Set());
    } else {
      // Otherwise select all
      setSelectedUserIds(new Set(users.map((user) => user.id)));
    }
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
        fetchUsers(currentPage);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error(
        selectedUser.isActive !== false
          ? t("failedToDeactivateUser")
          : t("failedToReactivateUser")
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
          successCount === 1
            ? t("successfullyDeactivatedUser")
            : t("successfullyDeactivatedUsers").replace(
                "{count}",
                successCount.toString()
              )
        );
      }

      if (failureCount > 0) {
        toast.error(
          failureCount === 1
            ? t("failedToDeactivateUser")
            : t("failedToDeactivateUsers").replace(
                "{count}",
                failureCount.toString()
              )
        );
      }

      // Refresh user list and clear selections
      await fetchUsers(currentPage);
      clearSelections();
    } catch (error) {
      toast.error(t("bulkDeactivationError"));
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
          successCount === 1
            ? t("successfullyReactivatedUser")
            : t("successfullyReactivatedUsers").replace(
                "{count}",
                successCount.toString()
              )
        );
      }

      if (failureCount > 0) {
        toast.error(
          failureCount === 1
            ? t("failedToReactivateUser")
            : t("failedToReactivateUsers").replace(
                "{count}",
                failureCount.toString()
              )
        );
      }

      // Refresh user list and clear selections
      await fetchUsers(currentPage);
      clearSelections();
    } catch (error) {
      toast.error(t("bulkReactivationError"));
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
          successCount === 1
            ? t("successfullyResetPassword")
            : t("successfullyResetPasswords").replace(
                "{count}",
                successCount.toString()
              )
        );
      }

      if (failureCount > 0) {
        toast.error(
          failureCount === 1
            ? t("failedToResetPassword")
            : t("failedToResetPasswords").replace(
                "{count}",
                failureCount.toString()
              )
        );
      }

      // Clear selections
      clearSelections();
    } catch (error) {
      toast.error(t("bulkPasswordResetError"));
      console.error("Bulk password reset error:", error);
    } finally {
      setIsBulkResettingPassword(false);
    }
  };

  return (
    <div
      className="min-h-screen dark:from-slate-900 dark:to-slate-800"
      dir={dir}
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
              isFiltering={false}
              filteredUsersCount={users?.length || 0}
              totalUsers={totalUsers}
              onRefresh={refreshData}
              isRefreshing={isRefreshing}
              onClearFilters={() => {}}
              onCreateUser={handleCreateUserClick}
            />

            <UsersManagementContent
              isLoading={isLoading}
              isMobileView={isMobileView}
              isFiltering={false}
              filtersExpanded={false}
              searchQuery=""
              setSearchQuery={() => {}}
              roleFilter=""
              setRoleFilter={() => {}}
              roles={[]}
              paginatedUsers={users || []}
              bulkSelectMode={bulkSelectMode}
              selectedUserIds={selectedUserIds}
              onToggleUserSelection={toggleUserSelection}
              onToggleAllUsers={toggleAllUsers}
              onResetPassword={handleResetPassword}
              onDeleteUser={handleUserStatusAction}
              onEditUser={handleEditUserClick}
              onUpdateSubscription={handleUpdateSubscriptionClick}
              isSuperAdmin={isSuperAdmin}
              currentPage={currentPage}
              itemsPerPage={ITEMS_PER_PAGE}
              totalPages={pages || Math.ceil(totalUsers / ITEMS_PER_PAGE)}
              onPageChange={handlePageChange}
              totalUsers={totalUsers}
              filteredUsersCount={users?.length || 0}
              onClearSelection={clearSelections}
              onToggleBulkMode={toggleBulkSelectMode}
              onBulkDeactivate={handleBulkDeactivate}
              onBulkReactivate={handleBulkReactivate}
              onBulkResetPassword={handleBulkPasswordReset}
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
