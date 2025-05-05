import {
  SubscriptionUpdateData,
  User,
  UserCreateData,
  UserStats,
  UserUpdateData,
  UsersResponse,
} from "@/app/_types/User";
import { UserEvent } from "../_hooks/auth/authApi";
import axios from "axios";

const usersUrl = process.env.NEXT_PUBLIC_BACK_URL + "/api/users";

export interface GetUserEventsParams {
  startDate?: string;
  endDate?: string;
  eventType?: string;
  includeDeleted?: boolean;
}

export const userAdminApi = {
  // Fetch all users (paginated)
  getUsers: async ({
    page = 1,
    limit = 10,
    sort = "name",
    direction = "asc",
  }: {
    page?: number;
    limit?: number;
    sort?: string;
    direction?: string;
  }): Promise<UsersResponse> => {
    const response = await axios.get<UsersResponse>(usersUrl, {
      params: { page, limit, sort, direction },
      withCredentials: true,
    });

    if (response.data) {
      return response.data;
    }
    throw new Error("Failed to fetch users");
  },

  // Fetch users by admin ID
  getUsersByAdmin: async ({
    adminId,
    page = 1,
    limit = 10,
  }: {
    adminId: string;
    page?: number;
    limit?: number;
  }): Promise<UsersResponse> => {
    const response = await axios.get<UsersResponse>(
      `${usersUrl}/by-admin/${adminId}`,
      {
        params: { page, limit },
        withCredentials: true,
      }
    );

    if (response.data) {
      return response.data;
    }
    throw new Error("Failed to fetch users");
  },

  // Fetch user by ID
  getUserById: async (userId: string): Promise<User> => {
    const response = await axios.get<{ data: User; success: boolean }>(
      `${usersUrl}/${userId}`,
      {
        withCredentials: true,
      }
    );

    if (response.data.success) {
      return response.data.data;
    }
    throw new Error("Failed to fetch user");
  },

  // Fetch user events
  getUserEvents: async (
    userId: string,
    params?: GetUserEventsParams
  ): Promise<{ data: UserEvent[] }> => {
    const response = await axios.get<{ success: boolean; data: UserEvent[] }>(
      `${usersUrl}/${userId}/events`,
      {
        params,
        withCredentials: true,
      }
    );

    if (response.data.success) {
      return { data: response.data.data };
    }
    throw new Error("Failed to fetch user events");
  },

  // Fetch user statistics
  getUserStats: async (): Promise<UserStats> => {
    const response = await axios.get<{ success: boolean; data: UserStats }>(
      `${usersUrl}/stats`,
      {
        withCredentials: true,
      }
    );

    if (response.data.success) {
      return response.data.data;
    }
    throw new Error("Failed to fetch user statistics");
  },

  // Create a new user
  createUser: async (userData: UserCreateData): Promise<User> => {
    const response = await axios.post(`${usersUrl}/create`, userData, {
      withCredentials: true,
    });

    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || "Failed to create user");
  },

  // Update user
  updateUser: async ({
    userId,
    userData,
  }: {
    userId: string;
    userData: UserUpdateData;
  }): Promise<User> => {
    const response = await axios.put(`${usersUrl}/${userId}`, userData, {
      withCredentials: true,
    });

    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || "Failed to update user");
  },

  // Reset user password
  resetUserPassword: async ({
    userId,
    newPassword,
  }: {
    userId: string;
    newPassword: string;
  }): Promise<void> => {
    const response = await axios.put(
      `${usersUrl}/${userId}/reset-password`,
      { newPassword },
      { withCredentials: true }
    );

    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to reset password");
    }
  },

  // Update user subscription
  updateUserSubscription: async ({
    userId,
    subscriptionData,
  }: {
    userId: string;
    subscriptionData: SubscriptionUpdateData;
  }): Promise<User> => {
    const response = await axios.put(
      `${usersUrl}/${userId}/subscription`,
      subscriptionData,
      { withCredentials: true }
    );

    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || "Failed to update subscription");
  },

  // Delete (soft delete) user
  deleteUser: async (userId: string): Promise<void> => {
    const response = await axios.delete(`${usersUrl}/${userId}`, {
      withCredentials: true,
    });

    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to delete user");
    }
  },

  // Undelete (reactivate) user
  undeleteUser: async (userId: string): Promise<User> => {
    const response = await axios.post(
      `${usersUrl}/${userId}/undelete`,
      {},
      { withCredentials: true }
    );

    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || "Failed to reactivate user");
  },

  // Change current user's password
  changePassword: async ({
    currentPassword,
    newPassword,
  }: {
    currentPassword: string;
    newPassword: string;
  }): Promise<void> => {
    const response = await axios.put(
      `${usersUrl}/password`,
      { currentPassword, newPassword },
      { withCredentials: true }
    );

    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to change password");
    }
  },

  // Update current user's profile
  updateProfile: async (profileData: {
    name?: string;
    contactNumber?: string;
    specialization?: string;
    profileImage?: string;
  }): Promise<User> => {
    const response = await axios.put(`${usersUrl}/profile`, profileData, {
      withCredentials: true,
    });

    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || "Failed to update profile");
  },

  // Get current user details
  getCurrentUser: async (): Promise<User> => {
    const response = await axios.get<{ success: boolean; data: User }>(
      `${usersUrl}/me`,
      { withCredentials: true }
    );

    if (response.data.success) {
      return response.data.data;
    }
    throw new Error("Failed to get current user");
  },
};
