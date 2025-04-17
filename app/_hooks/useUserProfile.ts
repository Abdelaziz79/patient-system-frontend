// hooks/useUserProfile.ts
import {
  PasswordChangeData,
  profileApi,
  ProfileFormData,
} from "@/app/_api/profileApi";
import { useAuthContext } from "@/app/_providers/AuthProvider";
import { User } from "@/app/_types/User";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export const useUserProfile = () => {
  const { user, setUser } = useAuthContext();
  const queryClient = useQueryClient();

  // UI states
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [formData, setFormData] = useState<ProfileFormData>({
    name: "",
    email: "",
    contactNumber: "",
    specialization: "",
  });

  const [passwordData, setPasswordData] = useState<PasswordChangeData>({
    currentPassword: "",
    newPassword: "",
  });

  // Initialize form data when user data becomes available
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        contactNumber: user.contactNumber || "",
        specialization: user.specialization || "",
      });
    }
  }, [user]);

  // Profile update mutation
  const profileMutation = useMutation({
    mutationFn: profileApi.updateProfile,
    onSuccess: (updatedUser) => {
      // Update user in both the auth context and query cache
      setUser(updatedUser);
      queryClient.setQueryData(["auth", "me"], updatedUser);
      setIsEditing(false);
      setError(null);
    },
    onError: (error: Error) => {
      setError(error.message);
    },
  });

  // Password change mutation
  const passwordMutation = useMutation({
    mutationFn: profileApi.changePassword,
    onSuccess: () => {
      setIsChangingPassword(false);
      // Reset password form
      setPasswordData({
        currentPassword: "",
        newPassword: "",
      });
      setError(null);
    },
    onError: (error: Error) => {
      setError(error.message);
    },
  });

  // Handle form changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle password form changes
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Save profile changes
  const saveProfile = async (): Promise<{
    success: boolean;
    message: string;
  }> => {
    setError(null);

    try {
      await profileMutation.mutateAsync(formData);
      return { success: true, message: "Profile updated successfully" };
    } catch (error) {
      const errorMsg =
        error instanceof Error
          ? error.message
          : "An error occurred while updating your profile";
      return { success: false, message: errorMsg };
    }
  };

  // Change password
  const changePassword = async (): Promise<{
    success: boolean;
    message: string;
  }> => {
    setError(null);

    try {
      await passwordMutation.mutateAsync(passwordData);
      return { success: true, message: "Password changed successfully" };
    } catch (error) {
      const errorMsg =
        error instanceof Error
          ? error.message
          : "An error occurred while changing your password";
      return { success: false, message: errorMsg };
    }
  };

  // Reset form data to current user values
  const resetForm = () => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        contactNumber: user.contactNumber || "",
        specialization: user.specialization || "",
      });
    }
    setIsEditing(false);
    setError(null);
  };

  // Utility functions
  const calculateDaysRemaining = (user: User) => {
    if (!user?.subscription?.endDate) return 0;

    const endDate = new Date(user.subscription.endDate);
    const today = new Date();
    const differenceInTime = endDate.getTime() - today.getTime();
    const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));
    return differenceInDays > 0 ? differenceInDays : 0;
  };

  const formatDate = (dateString?: string | Date) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (dateString?: string | Date) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const isSubscriptionActive = (user: User) => {
    if (!user?.subscription) return false;

    return (
      user.subscription.isActive &&
      new Date(user.subscription.endDate) > new Date()
    );
  };

  const getSubscriptionBadge = (type?: string) => {
    const badges = {
      free_trial: {
        bg: "bg-blue-100 dark:bg-blue-900/40",
        text: "text-blue-600 dark:text-blue-400",
      },
      premium: {
        bg: "bg-purple-100 dark:bg-purple-900/40",
        text: "text-purple-600 dark:text-purple-400",
      },
      basic: {
        bg: "bg-green-100 dark:bg-green-900/40",
        text: "text-green-600 dark:text-green-400",
      },
      enterprise: {
        bg: "bg-amber-100 dark:bg-amber-900/40",
        text: "text-amber-600 dark:text-amber-400",
      },
      expired: {
        bg: "bg-red-100 dark:bg-red-900/40",
        text: "text-red-600 dark:text-red-400",
      },
    };

    // If subscription is inactive or expired, return expired style
    if (
      user?.subscription &&
      (!user.subscription.isActive ||
        new Date(user.subscription.endDate) <= new Date())
    ) {
      return badges.expired;
    }

    const defaultBadge = badges.free_trial;
    return type && type in badges
      ? badges[type as keyof typeof badges]
      : defaultBadge;
  };

  const getRoleBadge = (role?: string) => {
    const badges = {
      super_admin: {
        bg: "bg-purple-100 dark:bg-purple-900/40",
        text: "text-purple-600 dark:text-purple-400",
      },
      admin: {
        bg: "bg-indigo-100 dark:bg-indigo-900/40",
        text: "text-indigo-600 dark:text-indigo-400",
      },
      doctor: {
        bg: "bg-green-100 dark:bg-green-900/40",
        text: "text-green-600 dark:text-green-400",
      },
      nurse: {
        bg: "bg-blue-100 dark:bg-blue-900/40",
        text: "text-blue-600 dark:text-blue-400",
      },
      staff: {
        bg: "bg-amber-100 dark:bg-amber-900/40",
        text: "text-amber-600 dark:text-amber-400",
      },
    };

    const defaultBadge = badges.staff;
    return role && role in badges
      ? badges[role as keyof typeof badges]
      : defaultBadge;
  };

  return {
    formData,
    isEditing,
    isSaving: profileMutation.isPending,
    error,
    setIsEditing,
    handleChange,
    saveProfile,
    resetForm,
    calculateDaysRemaining,
    isSubscriptionActive,
    formatDate,
    formatTime,
    getSubscriptionBadge,
    getRoleBadge,
    // Password change functionality
    passwordData,
    isChangingPassword,
    setIsChangingPassword,
    isSubmittingPassword: passwordMutation.isPending,
    handlePasswordChange,
    changePassword,
  };
};
