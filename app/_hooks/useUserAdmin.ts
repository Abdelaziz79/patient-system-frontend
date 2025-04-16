import axios from "axios";
import { useState } from "react";
import {
  SubscriptionUpdateData,
  User,
  UserCreateData,
  UserStats,
  UserUpdateData,
  UsersResponse,
} from "../_types/User";

export const useUserAdmin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [isUpdatingSubscription, setIsUpdatingSubscription] = useState(false);
  const [isUndeleting, setIsUndeleting] = useState(false);
  const [isLoadingStats, setIsLoadingStats] = useState(false);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [pages, setPages] = useState(0);
  const usersUrl = process.env.NEXT_PUBLIC_BACK_URL + "/api/users";

  // Fetch all users (paginated)
  // Update the fetchUsers function to accept sorting parameters
  const fetchUsers = async (
    page = 1,
    pageLimit = 10,
    field = "name",
    direction = "asc"
  ) => {
    setIsLoading(true);
    try {
      const response = await axios.get<UsersResponse>(usersUrl, {
        params: { page, limit: pageLimit, sort: field, direction },
        withCredentials: true,
      });

      setUsers(response.data.data);
      setTotalUsers(response.data.total);
      setCurrentPage(response.data.currentPage);
      setPages(response.data.pages);
      return response.data;
    } catch (error) {
      const errorMsg =
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : "Failed to fetch users";

      throw new Error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };
  // Fetch users by admin ID
  const fetchUsersByAdmin = async (
    adminId: string,
    page = 1,
    pageLimit = 10
  ) => {
    setIsLoading(true);
    try {
      const response = await axios.get<UsersResponse>(
        `${usersUrl}/by-admin/${adminId}`,
        {
          params: { page, limit: pageLimit },
          withCredentials: true,
        }
      );

      setUsers(response.data.data);
      setTotalUsers(response.data.total);
      setCurrentPage(response.data.currentPage);
      setPages(response.data.pages);

      return response.data;
    } catch (error) {
      const errorMsg =
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : "Failed to fetch users";

      throw new Error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch user by ID
  const fetchUserById = async (userId: string) => {
    setIsLoading(true);
    try {
      const response = await axios.get<{ data: User; success: boolean }>(
        `${usersUrl}/${userId}`,
        {
          withCredentials: true,
        }
      );
      setSelectedUser(response.data.data);
      return response.data.data;
    } catch (error) {
      const errorMsg =
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : "Failed to fetch user";

      throw new Error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch user statistics
  const fetchUserStats = async (): Promise<UserStats> => {
    setIsLoadingStats(true);
    try {
      const response = await axios.get<{ success: boolean; data: UserStats }>(
        `${usersUrl}/stats`,
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        setUserStats(response.data.data);
        return response.data.data;
      } else {
        throw new Error("Failed to fetch user statistics");
      }
    } catch (error) {
      const errorMsg =
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : "Failed to fetch user statistics";

      throw new Error(errorMsg);
    } finally {
      setIsLoadingStats(false);
    }
  };

  // Create a new user
  const createUser = async (
    userData: UserCreateData
  ): Promise<{ success: boolean; message: string; user?: User }> => {
    setIsCreating(true);
    try {
      const response = await axios.post(`${usersUrl}/create`, userData, {
        withCredentials: true,
      });

      // If successful, update the users list
      if (response.data.success && response.data.data) {
        setUsers((prev) => [response.data.data, ...prev]);
        setTotalUsers((prev) => prev + 1);
      }

      return {
        success: response.data.success,
        message: response.data.message || "User created successfully",
        user: response.data.data,
      };
    } catch (error) {
      const errorMsg =
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : "Failed to create user";

      return { success: false, message: errorMsg };
    } finally {
      setIsCreating(false);
    }
  };

  // Update user
  const updateUser = async (
    userId: string,
    userData: UserUpdateData
  ): Promise<{ success: boolean; message: string; user?: User }> => {
    setIsUpdating(true);
    try {
      const response = await axios.put(`${usersUrl}/${userId}`, userData, {
        withCredentials: true,
      });

      // If successful, update the selected user and users list
      if (response.data.success && response.data.data) {
        setSelectedUser(response.data.data);
        setUsers((prev) =>
          prev.map((user) => (user.id === userId ? response.data.data : user))
        );
      }

      return {
        success: response.data.success,
        message: response.data.message || "User updated successfully",
        user: response.data.data,
      };
    } catch (error) {
      const errorMsg =
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : "Failed to update user";

      return { success: false, message: errorMsg };
    } finally {
      setIsUpdating(false);
    }
  };

  // Reset user password
  const resetUserPassword = async (
    userId: string,
    newPassword: string
  ): Promise<{ success: boolean; message: string }> => {
    setIsResettingPassword(true);
    try {
      const response = await axios.put(
        `${usersUrl}/${userId}/reset-password`,
        { newPassword },
        { withCredentials: true }
      );

      return {
        success: response.data.success,
        message: response.data.message || "Password reset successfully",
      };
    } catch (error) {
      const errorMsg =
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : "Failed to reset password";

      return { success: false, message: errorMsg };
    } finally {
      setIsResettingPassword(false);
    }
  };

  // Update user subscription
  const updateUserSubscription = async (
    userId: string,
    subscriptionData: SubscriptionUpdateData
  ): Promise<{ success: boolean; message: string; user?: User }> => {
    setIsUpdatingSubscription(true);
    try {
      const response = await axios.put(
        `${usersUrl}/${userId}/subscription`,
        subscriptionData,
        { withCredentials: true }
      );

      // If successful, update the selected user and users list
      if (response.data.success && response.data.data) {
        setSelectedUser(response.data.data);
        setUsers((prev) =>
          prev.map((user) => (user.id === userId ? response.data.data : user))
        );
      }

      return {
        success: response.data.success,
        message: response.data.message || "Subscription updated successfully",
        user: response.data.data,
      };
    } catch (error) {
      const errorMsg =
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : "Failed to update subscription";

      return { success: false, message: errorMsg };
    } finally {
      setIsUpdatingSubscription(false);
    }
  };

  // Delete (soft delete) user
  const deleteUser = async (
    userId: string
  ): Promise<{ success: boolean; message: string }> => {
    setIsUpdating(true);
    try {
      const response = await axios.delete(`${usersUrl}/${userId}`, {
        withCredentials: true,
      });

      // If successful, update the users list
      if (response.data.success) {
        // Handle as a soft delete by updating isActive status
        setUsers((prev) =>
          prev.map((user) =>
            user.id === userId ? { ...user, isActive: false } : user
          )
        );

        // If this is the currently selected user, update it
        if (selectedUser?.id === userId) {
          setSelectedUser({ ...selectedUser, isActive: false });
        }
      }

      return {
        success: response.data.success,
        message: response.data.message || "User deleted successfully",
      };
    } catch (error) {
      const errorMsg =
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : "Failed to delete user";

      return { success: false, message: errorMsg };
    } finally {
      setIsUpdating(false);
    }
  };

  // Undelete (reactivate) user
  const undeleteUser = async (
    userId: string
  ): Promise<{ success: boolean; message: string; user?: User }> => {
    setIsUndeleting(true);
    try {
      const response = await axios.post(
        `${usersUrl}/${userId}/undelete`,
        {},
        { withCredentials: true }
      );

      // If successful, update the users list
      if (response.data.success && response.data.data) {
        // Update the user's active status
        setUsers((prev) =>
          prev.map((user) =>
            user.id === userId ? { ...user, isActive: true } : user
          )
        );

        // If this is the currently selected user, update it
        if (selectedUser?.id === userId) {
          setSelectedUser({ ...selectedUser, isActive: true });
        }
      }

      return {
        success: response.data.success,
        message: response.data.message || "User reactivated successfully",
        user: response.data.data,
      };
    } catch (error) {
      const errorMsg =
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : "Failed to reactivate user";

      return { success: false, message: errorMsg };
    } finally {
      setIsUndeleting(false);
    }
  };

  // Change current user's password
  const changePassword = async (
    currentPassword: string,
    newPassword: string
  ): Promise<{ success: boolean; message: string }> => {
    setIsUpdating(true);
    try {
      const response = await axios.put(
        `${usersUrl}/password`,
        { currentPassword, newPassword },
        { withCredentials: true }
      );

      return {
        success: response.data.success,
        message: response.data.message || "Password changed successfully",
      };
    } catch (error) {
      const errorMsg =
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : "Failed to change password";

      return { success: false, message: errorMsg };
    } finally {
      setIsUpdating(false);
    }
  };

  // Update current user's profile
  const updateProfile = async (profileData: {
    name?: string;
    contactNumber?: string;
    specialization?: string;
    profileImage?: string;
  }): Promise<{ success: boolean; message: string; user?: User }> => {
    setIsUpdating(true);
    try {
      const response = await axios.put(`${usersUrl}/profile`, profileData, {
        withCredentials: true,
      });

      if (response.data.success && response.data.data) {
        // If the updated user is the currently selected user, update selectedUser
        if (selectedUser && selectedUser.id === response.data.data.id) {
          setSelectedUser(response.data.data);
        }
      }

      return {
        success: response.data.success,
        message: response.data.message || "Profile updated successfully",
        user: response.data.data,
      };
    } catch (error) {
      const errorMsg =
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : "Failed to update profile";

      return { success: false, message: errorMsg };
    } finally {
      setIsUpdating(false);
    }
  };

  // Get current user details
  const getCurrentUser = async (): Promise<User | null> => {
    setIsLoading(true);
    try {
      const response = await axios.get<{ success: boolean; data: User }>(
        `${usersUrl}/me`,
        { withCredentials: true }
      );

      if (response.data.success) {
        return response.data.data;
      }
      return null;
    } catch (error) {
      console.error("Failed to get current user", error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Parse user stats data for different views
  const getRoleDistribution = () => {
    if (!userStats) return null;

    return {
      doctor: userStats.totalDoctors,
      nurse: userStats.totalNurses,
      staff: userStats.totalStaff,
      admin: userStats.totalAdmins || 0,
    };
  };

  // Get subscription information for admin
  const getSubscriptionInfo = () => {
    if (!userStats || !userStats.subscription) return null;

    return {
      type: userStats.subscription.type,
      isActive: userStats.subscription.isActive,
      endDate: userStats.subscription.endDate,
      daysRemaining: userStats.subscription.daysRemaining,
      features: userStats.subscription.features,
    };
  };

  // Get subscription statistics (super_admin only)
  const getSubscriptionStats = () => {
    if (!userStats || !userStats.subscriptionStats) return null;

    return userStats.subscriptionStats;
  };

  // Get recent users
  const getRecentUsers = () => {
    if (!userStats || !userStats.recentUsers) return [];

    return userStats.recentUsers;
  };

  // Get recent logins
  const getRecentLogins = () => {
    if (!userStats || !userStats.recentLogins) return [];

    return userStats.recentLogins;
  };

  return {
    users,
    totalUsers,
    currentPage,
    pages,
    isLoading,
    selectedUser,
    isCreating,
    isUpdating,
    isResettingPassword,
    isUpdatingSubscription,
    isUndeleting,
    isLoadingStats,
    userStats,
    fetchUsers,
    fetchUsersByAdmin,
    fetchUserById,
    fetchUserStats,
    createUser,
    updateUser,
    resetUserPassword,
    updateUserSubscription,
    deleteUser,
    undeleteUser,
    changePassword,
    updateProfile,
    getCurrentUser,
    setSelectedUser,
    // Utility functions for statistics and data analysis
    getRoleDistribution,
    getSubscriptionInfo,
    getSubscriptionStats,
    getRecentUsers,
    getRecentLogins,
  };
};
