import { User } from "@/app/_types/User";
import axios from "axios";

const usersUrl = process.env.NEXT_PUBLIC_BACK_URL + "/api/users";

// API functions separated from the hook
export const authApi = {
  getMe: async (): Promise<User> => {
    const res = await axios.get(`${usersUrl}/me`, { withCredentials: true });
    if (res.data.success) {
      return res.data.data;
    }
    throw new Error(res.data.message || "Failed to fetch user data");
  },

  login: async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<User> => {
    const res = await axios.post(
      `${usersUrl}/login`,
      { email, password },
      { withCredentials: true }
    );

    if (res.data.success) {
      return res.data.data;
    }
    throw new Error(res.data.message || "Login failed");
  },

  logout: async (): Promise<void> => {
    await axios.post(`${usersUrl}/logout`, {}, { withCredentials: true });
  },
};
