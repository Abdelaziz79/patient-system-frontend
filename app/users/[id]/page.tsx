"use client";

import ErrorComp from "@/app/_components/ErrorComp";
import Loading from "@/app/_components/Loading";
import { useLanguage } from "@/app/_contexts/LanguageContext";
import { useAuth } from "@/app/_hooks/auth/useAuth";
import { useUserAdmin } from "@/app/_hooks/userAdmin/useUserAdmin";
import { User, UserCreateData } from "@/app/_types/User";
import { PasswordResetModal } from "@/app/admin/users/_components/PasswordResetModal";
import { SubscriptionUpdateModal } from "@/app/admin/users/_components/SubscriptionUpdateModal";
import { UserFormModal } from "@/app/profile/_components/UserFormModal";
import { AccountInfoCard } from "@/app/users/_components/AccountInfoCard";
import { ActivityTimelineCard } from "@/app/users/_components/ActivityTimelineCard";
import { AdminActionsCard } from "@/app/users/_components/AdminActionsCard";
import { ProfileHeader } from "@/app/users/_components/ProfileHeader";
import { ProfileSidebar } from "@/app/users/_components/ProfileSidebar";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

export default function UserProfilePage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.id as string;
  const { t, dir, isRTL } = useLanguage();

  // Get current user info to check if super_admin
  const { user: currentUser } = useAuth();
  const isSuperAdmin = currentUser?.role === "super_admin";

  // States
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isPasswordChangeModalOpen, setIsPasswordChangeModalOpen] =
    useState(false);
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  // User admin hook for operations
  const {
    fetchUserById,
    updateUser,
    deleteUser,
    undeleteUser,
    resetUserPassword,
    updateUserSubscription,
    isUpdating,
    isResettingPassword,
    isUpdatingSubscription,
  } = useUserAdmin();

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId) {
        setError(t("userIdRequired"));
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetchUserById(userId);
        if (response) {
          setUser(response);
        } else {
          setError(response || t("failedToLoadUserData"));
        }
      } catch (error) {
        setError(t("unexpectedErrorFetchingUser"));
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  // Modal state handlers
  const toggleUserModal = (open: boolean) => setIsUserModalOpen(open);
  const togglePasswordModal = (open: boolean) =>
    setIsPasswordChangeModalOpen(open);
  const toggleSubscriptionModal = (open: boolean) =>
    setIsSubscriptionModalOpen(open);
  const toggleDeleteConfirm = (open: boolean) => setDeleteConfirmOpen(open);

  // Handle user update
  const handleUpdateUser = async (userData: User | UserCreateData) => {
    if (!user) return;

    try {
      const result = await updateUser(userId, userData as User);

      if (result.success) {
        toast.success(result.message);
        setIsUserModalOpen(false);

        // Update local state with new user data
        setUser((prevUser) =>
          prevUser
            ? {
                ...prevUser,
                ...userData,
                role: userData.role as
                  | "super_admin"
                  | "admin"
                  | "doctor"
                  | "nurse"
                  | "staff",
              }
            : null
        );
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error(t("failedToUpdateUser"));
      console.error("Error updating user:", error);
    }
  };

  // Handle password reset
  const handlePasswordReset = async (userId: string, newPassword: string) => {
    try {
      const result = await resetUserPassword(userId, newPassword);

      if (result.success) {
        setIsPasswordChangeModalOpen(false);
      } else {
        toast.error(result.message);
      }

      return result;
    } catch (error) {
      toast.error(t("failedToResetPassword"));
      console.error("Error resetting password:", error);
      return { success: false, message: t("error") };
    }
  };

  // Handle subscription update
  const handleSubscriptionUpdate = async (
    userId: string,
    subscriptionData: any
  ) => {
    try {
      const result = await updateUserSubscription(userId, subscriptionData);

      if (result.success) {
        setIsSubscriptionModalOpen(false);

        // Update local user state
        setUser((prevUser) => {
          if (!prevUser) return null;
          return {
            ...prevUser,
            subscription: {
              ...prevUser.subscription,
              ...subscriptionData,
            },
          };
        });
      } else {
        toast.error(result.message);
      }

      return result;
    } catch (error) {
      toast.error(t("failedToUpdateSubscription"));
      console.error("Error updating subscription:", error);
      return { success: false, message: t("error") };
    }
  };

  // Handle user activation/deactivation
  const handleUserStatusChange = async () => {
    if (!user) return;

    try {
      const result = user.isActive
        ? await deleteUser(userId)
        : await undeleteUser(userId);

      if (result.success) {
        toast.success(result.message);
        setUser((prevUser) =>
          prevUser ? { ...prevUser, isActive: !prevUser.isActive } : null
        );
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error(
        user.isActive
          ? t("failedToDeactivateUser")
          : t("failedToReactivateUser")
      );
      console.error(
        `Error ${user.isActive ? "deactivating" : "reactivating"} user:`,
        error
      );
    } finally {
      setDeleteConfirmOpen(false);
    }
  };

  // Return to users list
  const handleBackToList = () => {
    router.push("/admin/users");
  };

  if (loading) {
    return <Loading />;
  }

  if (error || !user) {
    return <ErrorComp message={error || t("userNotFound")} />;
  }

  return (
    <div className="p-2 sm:p-4 md:p-6 max-w-6xl mx-auto" dir={dir}>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 sm:mb-8">
          <ProfileHeader />
          <Button
            onClick={handleBackToList}
            variant="outline"
            size="sm"
            className="w-full sm:w-auto bg-green-50 hover:bg-green-100 dark:bg-slate-700 dark:hover:bg-slate-600 text-green-800 dark:text-green-300 transition-colors"
          >
            <ArrowLeft className={`h-4 w-4 ${isRTL ? "mx-2" : "mx-2"}`} />
            {t("backToUsers")}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {/* Profile Sidebar */}
          <div className="md:col-span-1">
            <ProfileSidebar user={user} />
          </div>

          {/* Main Content */}
          <div className="md:col-span-2 lg:col-span-3 space-y-4 md:space-y-6">
            <AccountInfoCard user={user} />
            <ActivityTimelineCard user={user} />
            <AdminActionsCard
              user={user}
              isSuperAdmin={isSuperAdmin}
              onEditUser={() => toggleUserModal(true)}
              onResetPassword={() => togglePasswordModal(true)}
              onUpdateSubscription={() => toggleSubscriptionModal(true)}
              onToggleUserStatus={() => toggleDeleteConfirm(true)}
              deleteConfirmOpen={deleteConfirmOpen}
              onCloseDeleteConfirm={() => toggleDeleteConfirm(false)}
              onConfirmStatusChange={handleUserStatusChange}
            />
          </div>
        </div>
      </motion.div>

      {/* Modals */}
      <UserFormModal
        isOpen={isUserModalOpen}
        onClose={() => toggleUserModal(false)}
        onSubmit={handleUpdateUser}
        isSubmitting={isUpdating}
        user={user}
        mode="update"
      />

      <PasswordResetModal
        isOpen={isPasswordChangeModalOpen}
        onClose={() => togglePasswordModal(false)}
        userId={user.id}
        userName={user.name}
        onReset={handlePasswordReset}
        isResetting={isResettingPassword}
      />

      {user.subscription && (
        <SubscriptionUpdateModal
          isOpen={isSubscriptionModalOpen}
          onClose={() => toggleSubscriptionModal(false)}
          isUpdating={isUpdatingSubscription}
          onUpdate={handleSubscriptionUpdate}
          userId={user.id}
          userName={user.name}
          currentSubscription={user.subscription}
        />
      )}
    </div>
  );
}
