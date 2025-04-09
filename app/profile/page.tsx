"use client";

import ErrorComp from "@/app/_components/ErrorComp";
import Loading from "@/app/_components/Loading";
import { AccountActivityCard } from "@/app/_components/profile/AccountActivityCard";
import { AccountInformationForm } from "@/app/_components/profile/AccountInformationForm";
import { ProfileActions } from "@/app/_components/profile/ProfileActions";
import { ProfileHeader } from "@/app/_components/profile/ProfileHeader";
import { ProfileSummaryCard } from "@/app/_components/profile/ProfileSummaryCard";
import { SubscriptionManagementCard } from "@/app/_components/profile/SubscriptionManagementCard";
import { SubscriptionStatusCard } from "@/app/_components/profile/SubscriptionStatusCard";
import { useUserProfile } from "@/app/_hooks/useUserProfile";
import { useAuthContext } from "@/app/_providers/AuthProvider";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";

export default function ProfilePage() {
  const { user, logout, isAuthenticated, isLoading } = useAuthContext();
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
      <ErrorComp message="User not authenticated. Please log in to view your profile." />
    );
  }

  // Calculate derived data after ensuring user exists
  const daysRemaining = calculateDaysRemaining(user);
  const subscriptionBadge = getSubscriptionBadge(user.subscription.type);
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
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error("Error logging out");
      console.error("Logout error:", error);
    }
  };

  return (
    <div className="flex items-center justify-center p-4 py-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="z-10 w-full max-w-4xl"
      >
        <ProfileHeader />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="space-y-4">
            <ProfileSummaryCard
              user={user}
              isEditing={isEditing}
              setIsEditing={setIsEditing}
              roleBadge={roleBadge}
            />
            <SubscriptionStatusCard
              user={user}
              subscriptionBadge={subscriptionBadge}
              daysRemaining={daysRemaining}
              formatDate={formatDate}
            />
            <AccountActivityCard
              user={user}
              formatDate={formatDate}
              formatTime={formatTime}
            />
          </div>

          {/* Right Column */}
          <div className="md:col-span-2 space-y-6">
            <AccountInformationForm
              user={user}
              formData={formData}
              isEditing={isEditing}
              isSaving={isSaving}
              handleChange={handleChange}
              handleSave={handleSave}
            />
            <ProfileActions
              user={user}
              isChangingPassword={isChangingPassword}
              setIsChangingPassword={setIsChangingPassword}
              onLogout={handleLogout}
            />
            <SubscriptionManagementCard />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
