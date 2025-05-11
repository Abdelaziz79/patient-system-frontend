import { User } from "@/app/_types/User";
import axios from "axios";
import { createAuthConfig } from "../utils/authUtils";

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

const usersUrl = process.env.NEXT_PUBLIC_BACK_URL + "/api/users";

// API handlers
export const profileApi = {
  updateProfile: async (data: ProfileFormData): Promise<User> => {
    const response = await axios.put(
      `${usersUrl}/profile`,
      data,
      createAuthConfig()
    );

    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.message || "Failed to update profile");
  },

  changePassword: async (data: PasswordChangeData): Promise<void> => {
    const response = await axios.put(
      `${usersUrl}/password`,
      data,
      createAuthConfig()
    );

    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to change password");
    }
  },
};
