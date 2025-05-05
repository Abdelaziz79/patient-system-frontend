// hooks/useUserAdmin.ts
import {
  SubscriptionUpdateData,
  User,
  UserCreateData,
  UserUpdateData,
} from "@/app/_types/User";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import {
  GetUserEventsParams,
  userAdminApi,
} from "@/app/_hooks/userAdmin/userAdminApi";

export const useUserAdmin = () => {
  const queryClient = useQueryClient();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageLimit, setPageLimit] = useState(10);
  const [sortField, setSortField] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");

  // Queries
  const {
    data: usersData,
    isPending: isLoading,
    error: usersError,
  } = useQuery({
    queryKey: ["users", currentPage, pageLimit, sortField, sortDirection],
    queryFn: () =>
      userAdminApi.getUsers({
        page: currentPage,
        limit: pageLimit,
        sort: sortField,
        direction: sortDirection,
      }),
    placeholderData: keepPreviousData,
  });

  const {
    data: userStats,
    isPending: isLoadingStats,
    error: statsError,
  } = useQuery({
    queryKey: ["userStats"],
    queryFn: userAdminApi.getUserStats,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // User by ID query function
  const getUserById = async (userId: string) => {
    try {
      const user = await queryClient.fetchQuery({
        queryKey: ["user", userId],
        queryFn: () => userAdminApi.getUserById(userId),
      });
      setSelectedUser(user);
      return user;
    } catch (error) {
      const errorMsg =
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : "Failed to fetch user";

      throw new Error(errorMsg);
    }
  };

  // Get user events query function
  const getUserEvents = async (
    userId: string,
    params?: GetUserEventsParams
  ) => {
    try {
      const events = await queryClient.fetchQuery({
        queryKey: ["userEvents", userId, params],
        queryFn: () => userAdminApi.getUserEvents(userId, params),
      });
      return events.data;
    } catch (error) {
      const errorMsg =
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : "Failed to fetch user events";

      throw new Error(errorMsg);
    }
  };

  // Mutations
  const createUserMutation = useMutation({
    mutationFn: userAdminApi.createUser,
    onSuccess: (newUser) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["userStats"] });
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: userAdminApi.updateUser,
    onSuccess: (updatedUser) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["user", updatedUser.id] });
      if (selectedUser?.id === updatedUser.id) {
        setSelectedUser(updatedUser);
      }
    },
  });

  const resetPasswordMutation = useMutation({
    mutationFn: userAdminApi.resetUserPassword,
  });

  const updateSubscriptionMutation = useMutation({
    mutationFn: userAdminApi.updateUserSubscription,
    onSuccess: (updatedUser) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["user", updatedUser.id] });
      queryClient.invalidateQueries({ queryKey: ["userStats"] });
      if (selectedUser?.id === updatedUser.id) {
        setSelectedUser(updatedUser);
      }
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: userAdminApi.deleteUser,
    onSuccess: (_, userId) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["user", userId] });
      queryClient.invalidateQueries({ queryKey: ["userStats"] });

      // Update the selected user if it's the deleted one
      if (selectedUser?.id === userId) {
        setSelectedUser((prev) => (prev ? { ...prev, isActive: false } : null));
      }
    },
  });

  const undeleteUserMutation = useMutation({
    mutationFn: userAdminApi.undeleteUser,
    onSuccess: (reactivatedUser) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["user", reactivatedUser.id] });
      queryClient.invalidateQueries({ queryKey: ["userStats"] });

      // Update the selected user if it's the undeleted one
      if (selectedUser?.id === reactivatedUser.id) {
        setSelectedUser(reactivatedUser);
      }
    },
  });

  const changePasswordMutation = useMutation({
    mutationFn: userAdminApi.changePassword,
  });

  const updateProfileMutation = useMutation({
    mutationFn: userAdminApi.updateProfile,
    onSuccess: (updatedUser) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["user", updatedUser.id] });
      queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
    },
  });

  const getCurrentUserMutation = useMutation({
    mutationFn: userAdminApi.getCurrentUser,
  });

  // Action functions with error handling
  const fetchUsers = async (
    page = currentPage,
    limit = pageLimit,
    field = sortField,
    direction = sortDirection
  ) => {
    setCurrentPage(page);
    setPageLimit(limit);
    setSortField(field);
    setSortDirection(direction);
    return queryClient.invalidateQueries({
      queryKey: ["users", page, limit, field, direction],
    });
  };

  const fetchUsersByAdmin = async (adminId: string, page = 1, limit = 10) => {
    try {
      const response = await queryClient.fetchQuery({
        queryKey: ["users", "admin", adminId, page, limit],
        queryFn: () => userAdminApi.getUsersByAdmin({ adminId, page, limit }),
      });
      return response;
    } catch (error) {
      const errorMsg =
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : "Failed to fetch users";

      throw new Error(errorMsg);
    }
  };

  const fetchUserStats = async () => {
    return queryClient.invalidateQueries({ queryKey: ["userStats"] });
  };

  const createUser = async (userData: UserCreateData) => {
    try {
      const user = await createUserMutation.mutateAsync(userData);
      return {
        success: true,
        message: "User created successfully",
        user,
      };
    } catch (error) {
      const errorMsg =
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : "Failed to create user";

      return { success: false, message: errorMsg };
    }
  };

  const updateUser = async (userId: string, userData: UserUpdateData) => {
    try {
      const user = await updateUserMutation.mutateAsync({
        userId,
        userData,
      });
      return {
        success: true,
        message: "User updated successfully",
        user,
      };
    } catch (error) {
      const errorMsg =
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : "Failed to update user";

      return { success: false, message: errorMsg };
    }
  };

  const resetUserPassword = async (userId: string, newPassword: string) => {
    try {
      await resetPasswordMutation.mutateAsync({ userId, newPassword });
      return {
        success: true,
        message: "Password reset successfully",
      };
    } catch (error) {
      const errorMsg =
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : "Failed to reset password";

      return { success: false, message: errorMsg };
    }
  };

  const updateUserSubscription = async (
    userId: string,
    subscriptionData: SubscriptionUpdateData
  ) => {
    try {
      const user = await updateSubscriptionMutation.mutateAsync({
        userId,
        subscriptionData,
      });
      return {
        success: true,
        message: "Subscription updated successfully",
        user,
      };
    } catch (error) {
      const errorMsg =
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : "Failed to update subscription";

      return { success: false, message: errorMsg };
    }
  };

  const deleteUser = async (userId: string) => {
    try {
      await deleteUserMutation.mutateAsync(userId);
      return {
        success: true,
        message: "User deleted successfully",
      };
    } catch (error) {
      const errorMsg =
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : "Failed to delete user";

      return { success: false, message: errorMsg };
    }
  };

  const undeleteUser = async (userId: string) => {
    try {
      const user = await undeleteUserMutation.mutateAsync(userId);
      return {
        success: true,
        message: "User reactivated successfully",
        user,
      };
    } catch (error) {
      const errorMsg =
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : "Failed to reactivate user";

      return { success: false, message: errorMsg };
    }
  };

  const changePassword = async (
    currentPassword: string,
    newPassword: string
  ) => {
    try {
      await changePasswordMutation.mutateAsync({
        currentPassword,
        newPassword,
      });
      return {
        success: true,
        message: "Password changed successfully",
      };
    } catch (error) {
      const errorMsg =
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : "Failed to change password";

      return { success: false, message: errorMsg };
    }
  };

  const updateProfile = async (profileData: {
    name?: string;
    contactNumber?: string;
    specialization?: string;
    profileImage?: string;
  }) => {
    try {
      const user = await updateProfileMutation.mutateAsync(profileData);
      return {
        success: true,
        message: "Profile updated successfully",
        user,
      };
    } catch (error) {
      const errorMsg =
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : "Failed to update profile";

      return { success: false, message: errorMsg };
    }
  };

  const getCurrentUser = async () => {
    try {
      return await getCurrentUserMutation.mutateAsync();
    } catch (error) {
      console.error("Failed to get current user", error);
      return null;
    }
  };

  // Function to fetch user events with error handling
  const fetchUserEvents = async (
    userId: string,
    params?: GetUserEventsParams
  ) => {
    try {
      const events = await getUserEvents(userId, params);
      return {
        success: true,
        data: events,
      };
    } catch (error) {
      const errorMsg =
        error instanceof Error ? error.message : "Failed to fetch user events";
      return {
        success: false,
        message: errorMsg,
        data: [],
      };
    }
  };

  // Utility functions for statistics and data analysis
  const getRoleDistribution = () => {
    if (!userStats) return null;

    return {
      doctor: userStats.totalDoctors,
      nurse: userStats.totalNurses,
      staff: userStats.totalStaff,
      admin: userStats.totalAdmins || 0,
    };
  };

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

  const getSubscriptionStats = () => {
    if (!userStats || !userStats.subscriptionStats) return null;

    return userStats.subscriptionStats;
  };

  const getRecentUsers = () => {
    if (!userStats || !userStats.recentUsers) return [];

    return userStats.recentUsers;
  };

  const getRecentLogins = () => {
    if (!userStats || !userStats.recentLogins) return [];

    return userStats.recentLogins;
  };

  return {
    // Query data
    users: usersData?.data || [],
    totalUsers: usersData?.total || 0,
    currentPage: usersData?.currentPage || currentPage,
    pages: usersData?.pages || 0,

    // Loading states
    isLoading,
    isCreating: createUserMutation.isPending,
    isUpdating: updateUserMutation.isPending,
    isResettingPassword: resetPasswordMutation.isPending,
    isUpdatingSubscription: updateSubscriptionMutation.isPending,
    isUndeleting: undeleteUserMutation.isPending,
    isLoadingStats,

    // Error states
    usersError,
    statsError,

    // Current state
    selectedUser,
    userStats,

    // Functions
    fetchUsers,
    fetchUsersByAdmin,
    fetchUserById: getUserById,
    fetchUserStats,
    fetchUserEvents,
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

    // Utility functions
    getRoleDistribution,
    getSubscriptionInfo,
    getSubscriptionStats,
    getRecentUsers,
    getRecentLogins,

    // Sorting and pagination controls
    setSortField,
    setSortDirection,
    setCurrentPage,
    setPageLimit,
  };
};
