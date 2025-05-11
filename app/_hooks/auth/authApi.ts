import { User } from "@/app/_types/User";
import axios from "axios";
import {
  createAuthConfig,
  storeAuthToken,
  clearAuthToken,
} from "../utils/authUtils";

const usersUrl = process.env.NEXT_PUBLIC_BACK_URL + "/api/users";

export interface UserEvent {
  _id: string;
  patientId: string;
  patientName: string;
  eventType: string;
  date: string;
  notes: string;
  createdBy: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

// Helper to get auth token
export const getAuthToken = () => localStorage.getItem("authToken");

// Helper to set auth headers for all requests
export const setAuthHeader = (token: string | null) => {
  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common["Authorization"];
  }
};

// API functions separated from the hook
export const authApi = {
  getMe: async (): Promise<User> => {
    const res = await axios.get(`${usersUrl}/me`, createAuthConfig());
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
      // Store the token in localStorage
      if (res.data.token) {
        storeAuthToken(res.data.token);
      }
      return res.data.data;
    }
    throw new Error(res.data.message || "Login failed");
  },

  logout: async (): Promise<void> => {
    await axios.post(`${usersUrl}/logout`, {}, createAuthConfig());
    // Clear token on logout
    clearAuthToken();
  },

  getMyUpcomingEvents: async (
    days?: number
  ): Promise<{ data: UserEvent[] }> => {
    const params = days ? { days } : undefined;
    const res = await axios.get(
      `${usersUrl}/me/upcoming-events`,
      createAuthConfig({ params })
    );

    if (res.data.success) {
      return { data: res.data.data };
    }
    throw new Error(res.data.message || "Failed to fetch upcoming events");
  },
};
