import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { INotification, notificationApi } from "../_api/notificationApi";

// Hook interface
export interface UseNotificationOptions {
  initialDays?: number;
}

// Main hook function
export const useNotification = (options: UseNotificationOptions = {}) => {
  const queryClient = useQueryClient();
  const [days, setDays] = useState<number>(options.initialDays || 7);

  // Get user notifications query
  const {
    data: notifications,
    isPending: isNotificationsLoading,
    error: notificationsError,
    refetch: refetchNotifications,
  } = useQuery({
    queryKey: ["userNotifications", days],
    queryFn: () => notificationApi.getUserNotifications({ days }),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
  });

  // Get notification summary query
  const {
    data: notificationSummary,
    isPending: isNotificationSummaryLoading,
    error: notificationSummaryError,
    refetch: refetchNotificationSummary,
  } = useQuery({
    queryKey: ["notificationSummary"],
    queryFn: () => notificationApi.getNotificationsSummary(),
    staleTime: 3 * 60 * 1000, // 3 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
  });

  // Get user notifications by user ID (admin only)
  const getUserNotificationsById = async (
    userId: string,
    notificationDays?: number
  ) => {
    try {
      const data = await queryClient.fetchQuery({
        queryKey: ["userNotifications", userId, notificationDays || days],
        queryFn: () =>
          notificationApi.getUserNotificationsById(userId, {
            days: notificationDays || days,
          }),
        staleTime: 5 * 60 * 1000, // 5 minutes
      });
      return data as INotification[];
    } catch (error) {
      console.error("Failed to fetch user notifications:", error);
      throw error;
    }
  };

  // Use specific user notifications query (admin only)
  const useUserNotificationsById = (
    userId: string,
    notificationDays?: number
  ) => {
    return useQuery({
      queryKey: ["userNotifications", userId, notificationDays || days],
      queryFn: () =>
        notificationApi.getUserNotificationsById(userId, {
          days: notificationDays || days,
        }),
      staleTime: 5 * 60 * 1000, // 5 minutes
      enabled: !!userId,
    });
  };

  // Update days filter setting
  const updateDaysFilter = (newDays: number) => {
    setDays(newDays);
  };

  return {
    // Queries
    notifications,
    isNotificationsLoading,
    notificationsError,
    refetchNotifications,

    // Summary
    notificationSummary,
    isNotificationSummaryLoading,
    notificationSummaryError,
    refetchNotificationSummary,

    // Filter state
    days,

    // Functions
    getUserNotificationsById,
    useUserNotificationsById,
    updateDaysFilter,
  };
};
