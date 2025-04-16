import { useAuthContext } from "@/app/_providers/AuthProvider";
import axios from "axios";
import { useEffect, useState } from "react";
import { User } from "../_types/User";

export interface ProfileFormData {
  name: string;
  email: string;
  contactNumber?: string;
  specialization?: string;
}

export interface PasswordChangeData {
  currentPassword: string;
  newPassword: string;
}

export const useUserProfile = () => {
  const { user, setUser } = useAuthContext();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isSubmittingPassword, setIsSubmittingPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [passwordData, setPasswordData] = useState<PasswordChangeData>({
    currentPassword: "",
    newPassword: "",
  });
  const [formData, setFormData] = useState<ProfileFormData>({
    name: "",
    email: "",
    contactNumber: "",
    specialization: "",
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

  // Calculate subscription days remaining
  const calculateDaysRemaining = (user: User) => {
    if (!user?.subscription?.endDate) return 0;

    const endDate = new Date(user.subscription.endDate);
    const today = new Date();
    const differenceInTime = endDate.getTime() - today.getTime();
    const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));
    return differenceInDays > 0 ? differenceInDays : 0;
  };

  // Format dates for display
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

  // Save profile changes
  const saveProfile = async (): Promise<{
    success: boolean;
    message: string;
  }> => {
    setIsSaving(true);
    setError(null);

    try {
      const usersUrl = process.env.NEXT_PUBLIC_BACK_URL + "/api/users";
      const response = await axios.put(`${usersUrl}/profile`, formData, {
        withCredentials: true,
      });

      setIsSaving(false);
      setIsEditing(false);

      if (response.data.success) {
        // Update the user context with new data
        if (setUser && response.data.data) {
          setUser(response.data.data);
        }
        return { success: true, message: "Profile updated successfully" };
      } else {
        const errorMsg = response.data.message || "Failed to update profile";
        setError(errorMsg);
        return { success: false, message: errorMsg };
      }
    } catch (error) {
      setIsSaving(false);

      const errorMsg =
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : "An error occurred while updating your profile";

      setError(errorMsg);
      return { success: false, message: errorMsg };
    }
  };

  // Change password
  const changePassword = async (): Promise<{
    success: boolean;
    message: string;
  }> => {
    setIsSubmittingPassword(true);
    setError(null);

    try {
      const usersUrl = process.env.NEXT_PUBLIC_BACK_URL + "/api/users";
      const response = await axios.put(`${usersUrl}/password`, passwordData, {
        withCredentials: true,
      });

      setIsSubmittingPassword(false);

      if (response.data.success) {
        setIsChangingPassword(false);

        // Reset password form
        setPasswordData({
          currentPassword: "",
          newPassword: "",
        });

        return { success: true, message: "Password changed successfully" };
      } else {
        const errorMsg = response.data.message || "Failed to change password";
        setError(errorMsg);
        return { success: false, message: errorMsg };
      }
    } catch (error) {
      setIsSubmittingPassword(false);

      const errorMsg =
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : "An error occurred while changing your password";

      setError(errorMsg);
      return { success: false, message: errorMsg };
    }
  };

  // Check if subscription is active and valid
  const isSubscriptionActive = (user: User) => {
    if (!user?.subscription) return false;

    return (
      user.subscription.isActive &&
      new Date(user.subscription.endDate) > new Date()
    );
  };

  // Get subscription badge style based on type
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

  // Get role badge style
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

  return {
    formData,
    isEditing,
    isSaving,
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
    isSubmittingPassword,
    handlePasswordChange,
    changePassword,
  };
};
