import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import {
  IPatientEventNotificationRequest,
  NotificationType,
  systemNotificationApi,
} from "@/app/_hooks/systemNotification/systemNotificationApi";

// Hook interface
export interface UseSystemNotificationOptions {
  initialIsRead?: boolean;
  initialType?: NotificationType;
}

// Main hook function
export const useSystemNotification = (
  options: UseSystemNotificationOptions = {}
) => {
  const queryClient = useQueryClient();
  const [isRead, setIsRead] = useState<boolean | undefined>(
    options.initialIsRead
  );
  const [type, setType] = useState<NotificationType | undefined>(
    options.initialType
  );

  // Get user system notifications query
  const {
    data: systemNotifications,
    isPending: isSystemNotificationsLoading,
    error: systemNotificationsError,
    refetch: refetchSystemNotifications,
  } = useQuery({
    queryKey: ["systemNotifications", isRead, type],
    queryFn: () => systemNotificationApi.getUserNotifications({ isRead, type }),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
  });

  // Get unread notification count query
  const {
    data: unreadCount,
    isPending: isUnreadCountLoading,
    error: unreadCountError,
    refetch: refetchUnreadCount,
  } = useQuery({
    queryKey: ["systemNotificationsUnreadCount"],
    queryFn: () => systemNotificationApi.getUnreadCount(),
    staleTime: 3 * 60 * 1000, // 3 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
  });

  // Mark notification as read mutation
  const markAsReadMutation = useMutation({
    mutationFn: systemNotificationApi.markAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["systemNotifications"] });
      queryClient.invalidateQueries({
        queryKey: ["systemNotificationsUnreadCount"],
      });
    },
  });

  // Send admin notification mutation (admin only)
  const sendAdminNotificationMutation = useMutation({
    mutationFn: systemNotificationApi.sendAdminNotification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["systemNotifications"] });
    },
  });

  // Check subscription expirations mutation (admin only)
  const checkSubscriptionExpirationsMutation = useMutation({
    mutationFn: systemNotificationApi.checkSubscriptionExpirations,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["systemNotifications"] });
    },
  });

  // Create patient event notification mutation
  const createPatientEventNotificationMutation = useMutation({
    mutationFn: systemNotificationApi.createPatientEventNotification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["systemNotifications"] });
    },
  });

  // Check upcoming events mutation (admin only)
  const checkUpcomingEventsMutation = useMutation({
    mutationFn: systemNotificationApi.checkUpcomingEvents,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["systemNotifications"] });
    },
  });

  // Update filter settings
  const updateFilters = (newFilters: Partial<UseSystemNotificationOptions>) => {
    if (newFilters.initialIsRead !== undefined) {
      setIsRead(newFilters.initialIsRead);
    }
    if (newFilters.initialType !== undefined) {
      setType(newFilters.initialType);
    }
  };

  // Mark notification as read
  const markAsRead = async (notificationId: string) => {
    try {
      await markAsReadMutation.mutateAsync(notificationId);
      return true;
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
      return false;
    }
  };

  // Send admin notification (admin only)
  const sendAdminNotification = async (data: {
    title: string;
    message: string;
    recipients?: string[];
    type?: NotificationType;
    expiryDays?: number;
  }) => {
    try {
      const result = await sendAdminNotificationMutation.mutateAsync(data);
      return result;
    } catch (error) {
      console.error("Failed to send admin notification:", error);
      throw error;
    }
  };

  // Check subscription expirations (admin only)
  const checkSubscriptionExpirations = async () => {
    try {
      const result = await checkSubscriptionExpirationsMutation.mutateAsync();
      return result;
    } catch (error) {
      console.error("Failed to check subscription expirations:", error);
      throw error;
    }
  };

  // Create patient event notification
  const createPatientEventNotification = async (
    data: IPatientEventNotificationRequest
  ) => {
    try {
      const result = await createPatientEventNotificationMutation.mutateAsync(
        data
      );
      return result;
    } catch (error) {
      console.error("Failed to create patient event notification:", error);
      throw error;
    }
  };

  // Check upcoming events (admin only)
  const checkUpcomingEvents = async () => {
    try {
      const result = await checkUpcomingEventsMutation.mutateAsync();
      return result;
    } catch (error) {
      console.error("Failed to check upcoming events:", error);
      throw error;
    }
  };

  return {
    // Queries
    systemNotifications,
    isSystemNotificationsLoading,
    systemNotificationsError,
    refetchSystemNotifications,

    // Unread count
    unreadCount,
    isUnreadCountLoading,
    unreadCountError,
    refetchUnreadCount,

    // Filter state
    isRead,
    type,

    // Mutations
    markAsReadMutation,
    sendAdminNotificationMutation,
    checkSubscriptionExpirationsMutation,
    createPatientEventNotificationMutation,
    checkUpcomingEventsMutation,

    // Functions
    updateFilters,
    markAsRead,
    sendAdminNotification,
    checkSubscriptionExpirations,
    createPatientEventNotification,
    checkUpcomingEvents,
  };
};
