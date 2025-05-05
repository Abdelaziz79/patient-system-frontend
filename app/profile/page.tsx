"use client";

import ErrorComp from "@/app/_components/ErrorComp";
import Loading from "@/app/_components/Loading";
import { useLanguage } from "@/app/_contexts/LanguageContext";
import { useUserProfile } from "@/app/_hooks/profile/useUserProfile";
import { useAuthContext } from "@/app/_providers/AuthProvider";
import { AccountActivityCard } from "@/app/profile/_components/AccountActivityCard";
import { AccountInformationForm } from "@/app/profile/_components/AccountInformationForm";
import { ProfileActions } from "@/app/profile/_components/ProfileActions";
import { ProfileHeader } from "@/app/profile/_components/ProfileHeader";
import { ProfileSummaryCard } from "@/app/profile/_components/ProfileSummaryCard";
import { SubscriptionStatusCard } from "@/app/profile/_components/SubscriptionStatusCard";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";

export default function ProfilePage() {
  const { user, logout, isAuthenticated, isLoading } = useAuthContext();
  const { t, isRTL } = useLanguage();
  const {
    formData,
    isEditing,
    isSaving,
    setIsEditing,
    handleChange,
    saveProfile,
    calculateDaysRemaining,
    formatDate,
    formatTime,
    getSubscriptionBadge,
    getRoleBadge,
    isChangingPassword,
    setIsChangingPassword,
  } = useUserProfile();

  if (isLoading) {
    return <Loading />;
  }
  if (!isAuthenticated || !user) {
    return (
      <ErrorComp
        message={
          t("userNotAuthenticated") ||
          "User not authenticated. Please log in to view your profile."
        }
      />
    );
  }

  // Calculate derived data after ensuring user exists
  const daysRemaining = calculateDaysRemaining(user);
  const subscriptionBadge = getSubscriptionBadge(
    user?.subscription?.type ?? ""
  );
  const roleBadge = getRoleBadge(user.role);

  // Handle save button click
  const handleSave = async () => {
    const result = await saveProfile();
    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await logout();
      toast.success(t("loggedOutSuccessfully") || "Logged out successfully");
    } catch (error) {
      toast.error(t("errorLoggingOut") || "Error logging out");
      console.error("Logout error:", error);
    }
  };

  return (
    <div className="flex items-center justify-center p-4 py-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="z-10 w-full max-w-6xl"
      >
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <ProfileHeader />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          {/* Left Column */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <ProfileSummaryCard
                user={user}
                isEditing={isEditing}
                setIsEditing={setIsEditing}
                roleBadge={roleBadge}
              />
            </motion.div>

            {user.subscription && (
              <motion.div
                initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <SubscriptionStatusCard
                  user={user}
                  subscriptionBadge={subscriptionBadge}
                  daysRemaining={daysRemaining}
                  formatDate={formatDate}
                />
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <AccountActivityCard
                user={user}
                formatDate={formatDate}
                formatTime={formatTime}
              />
            </motion.div>
          </div>

          {/* Right Column */}
          <div className="md:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, x: isRTL ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <AccountInformationForm
                user={user}
                formData={formData}
                isEditing={isEditing}
                isSaving={isSaving}
                handleChange={handleChange}
                handleSave={handleSave}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: isRTL ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <ProfileActions
                user={user}
                isChangingPassword={isChangingPassword}
                setIsChangingPassword={setIsChangingPassword}
                onLogout={handleLogout}
              />
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
