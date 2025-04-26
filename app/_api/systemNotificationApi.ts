import axios from "axios";

// Enum for notification types
export enum NotificationType {
  SUBSCRIPTION_EXPIRING = "subscription_expiring",
  SYSTEM_NOTIFICATION = "system_notification",
  CUSTOM_MESSAGE = "custom_message",
}

// Types for system notification data
export interface ISystemNotification {
  _id: string;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  recipients: string[];
  targetAll: boolean;
  createdBy?: {
    _id: string;
    name: string;
    role: string;
  };
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface IUnreadCount {
  unreadCount: number;
}

// API client for system notification operations
export const systemNotificationApi = {
  // Base URL
  baseUrl: process.env.NEXT_PUBLIC_BACK_URL + "/api/system-notifications",

  // Get all system notifications for the current user
  getUserNotifications: async (params?: {
    isRead?: boolean;
    type?: NotificationType;
  }) => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, String(value));
        }
      });
    }

    const url = `${systemNotificationApi.baseUrl}?${queryParams.toString()}`;
    const response = await axios.get(url, { withCredentials: true });
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(
      response.data.message || "Failed to fetch system notifications"
    );
  },

  // Get unread notification count for the current user
  getUnreadCount: async () => {
    const response = await axios.get(
      `${systemNotificationApi.baseUrl}/unread-count`,
      {
        withCredentials: true,
      }
    );
    if (response.data.success) {
      return response.data.data as IUnreadCount;
    }
    throw new Error(response.data.message || "Failed to fetch unread count");
  },

  // Mark a notification as read
  markAsRead: async (notificationId: string) => {
    const response = await axios.put(
      `${systemNotificationApi.baseUrl}/${notificationId}/mark-read`,
      {},
      { withCredentials: true }
    );
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(
      response.data.message || "Failed to mark notification as read"
    );
  },

  // Admin only: Send a notification to all users or specific users
  sendAdminNotification: async (data: {
    title: string;
    message: string;
    recipients?: string[];
    type?: NotificationType;
    expiryDays?: number;
  }) => {
    const response = await axios.post(
      `${systemNotificationApi.baseUrl}/send`,
      data,
      { withCredentials: true }
    );
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(
      response.data.message || "Failed to send admin notification"
    );
  },

  // Admin only: Check for subscription expirations and create notifications
  checkSubscriptionExpirations: async () => {
    const response = await axios.post(
      `${systemNotificationApi.baseUrl}/check-subscriptions`,
      {},
      { withCredentials: true }
    );
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(
      response.data.message || "Failed to check subscription expirations"
    );
  },
};
