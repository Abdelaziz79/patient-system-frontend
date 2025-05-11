import axios from "axios";
import { createAuthConfig } from "../utils/authUtils";

// Updated types for notification data to match backend
export interface INotification {
  patientId: string;
  patientName: string;
  followUpDate: string;
  daysUntil: number;
  id: string; // Changed from visitId
  type: "visit" | "event"; // New field
  appointmentType: string; // Changed from visitType
  importance?: string; // New field
  message: string;
}

export interface INotificationSummary {
  total: number;
  today: number;
  tomorrow: number;
  thisWeek: number;
  highPriority: number; // New field from backend
}

// API client for notification operations
export const notificationApi = {
  // Base URL
  baseUrl: process.env.NEXT_PUBLIC_BACK_URL + "/api/notifications",

  // Get notifications for current user
  getUserNotifications: async (params?: { days?: number }) => {
    const queryParams = new URLSearchParams();
    if (params?.days !== undefined) {
      queryParams.append("days", String(params.days));
    }

    const url = `${notificationApi.baseUrl}?${queryParams.toString()}`;
    const response = await axios.get(url, createAuthConfig());
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(
      response.data.message || "Failed to fetch user notifications"
    );
  },

  // Get notifications for a specific user (admin only)
  getUserNotificationsById: async (
    userId: string,
    params?: { days?: number }
  ) => {
    const queryParams = new URLSearchParams();
    if (params?.days !== undefined) {
      queryParams.append("days", String(params.days));
    }

    const url = `${
      notificationApi.baseUrl
    }/user/${userId}?${queryParams.toString()}`;
    const response = await axios.get(url, createAuthConfig());
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(
      response.data.message || "Failed to fetch notifications for user"
    );
  },

  // Get notification summary (counts) for current user
  getNotificationsSummary: async () => {
    const response = await axios.get(
      `${notificationApi.baseUrl}/summary`,
      createAuthConfig()
    );
    if (response.data.success) {
      return response.data.data as INotificationSummary;
    }
    throw new Error(
      response.data.message || "Failed to fetch notification summary"
    );
  },
};
