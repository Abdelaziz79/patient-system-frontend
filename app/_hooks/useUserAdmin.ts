import { User } from "@/app/_hooks/useAuth";
import axios from "axios";
import { useState } from "react";

export interface UserCreateData {
  name: string;
  email: string;
  password?: string;
  role: string;
  contactNumber?: string;
  specialization?: string;
}

export interface UserUpdateData {
  name?: string;
  // email?: string;
  role?: string;
  contactNumber?: string;
  specialization?: string;
  isActive?: boolean;
}

export interface SubscriptionUpdateData {
  type: string;
  startDate: Date | string;
  endDate: Date | string;
  status: string;
}

export interface UsersResponse {
  data: User[];
  total: number;
  pages: number;
  currentPage: number;
}

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
  const [pages, setPages] = useState(0);
  const usersUrl = process.env.NEXT_PUBLIC_BACK_URL + "/api/users";

  // Fetch all users (paginated)
  const fetchUsers = async (page = 1, pageLimit = 10) => {
    setIsLoading(true);
    try {
      const response = await axios.get<UsersResponse>(usersUrl, {
        params: { page, limit: pageLimit },
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
      const response = await axios.get<{ user: User; success: boolean }>(
        `${usersUrl}/${userId}`,
        {
          withCredentials: true,
        }
      );

      setSelectedUser(response.data.user);
      return response.data.user;
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
      if (response.data.success && response.data.user) {
        setUsers((prev) => [response.data.user, ...prev]);
        setTotalUsers((prev) => prev + 1);
      }

      return {
        success: response.data.success,
        message: response.data.message || "User created successfully",
        user: response.data.user,
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
  ): Promise<{ success: boolean; message: string }> => {
    setIsUpdating(true);
    try {
      const response = await axios.put(`${usersUrl}/${userId}`, userData, {
        withCredentials: true,
      });

      // If successful, update the selected user and users list
      if (response.data.success && response.data.user) {
        setSelectedUser(response.data.user);
        setUsers((prev) =>
          prev.map((user) => (user.id === userId ? response.data.user : user))
        );
      }

      return {
        success: response.data.success,
        message: response.data.message || "User updated successfully",
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
        {
          withCredentials: true,
        }
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
  ): Promise<{ success: boolean; message: string }> => {
    setIsUpdatingSubscription(true);
    try {
      const response = await axios.put(
        `${usersUrl}/${userId}/subscription`,
        subscriptionData,
        {
          withCredentials: true,
        }
      );

      // If successful, update the selected user and users list
      if (response.data.success && response.data.user) {
        setSelectedUser(response.data.user);
        setUsers((prev) =>
          prev.map((user) => (user.id === userId ? response.data.user : user))
        );
      }

      return {
        success: response.data.success,
        message: response.data.message || "Subscription updated successfully",
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
    fetchUsers,
    fetchUsersByAdmin,
    fetchUserById,
    createUser,
    updateUser,
    resetUserPassword,
    updateUserSubscription,
    deleteUser,
    setSelectedUser,
  };
};
