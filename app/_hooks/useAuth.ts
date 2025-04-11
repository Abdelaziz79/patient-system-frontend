// hooks/useAuth.ts
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface ISubscription {
  type: "free_trial" | "basic" | "premium" | "enterprise";
  startDate: string;
  endDate: string;
  isActive: boolean;
  features: string[];
}

// Define the user type based on your API response
export interface User {
  id: string;
  name: string;
  email: string;
  role: "super_admin" | "admin" | "doctor" | "nurse" | "staff";
  isActive?: boolean;
  lastLogin?: string;
  profileImage?: string;
  specialization?: string;
  contactNumber?: string;
  createdBy?: string;
  adminId?: string;
  subscription?: ISubscription;
  createdAt?: string;
  updatedAt?: string;
  password?: string; // Optional, only if you need it for some reason

  // Methods for the model, not used in frontend
  matchPassword?: (enteredPassword: string) => Promise<boolean>;
  getSignedJwtToken?: () => string;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

const usersUrl = process.env.NEXT_PUBLIC_BACK_URL + "/api/users";

export const useAuth = () => {
  const router = useRouter();
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
    error: null,
  });

  // Check if user is already logged in
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const res = await axios.get(`${usersUrl}/me`, {
          withCredentials: true,
        });
        if (res.data.success) {
          setAuthState({
            user: res.data.data,
            isLoading: false,
            isAuthenticated: true,
            error: null,
          });
        }
      } catch (error) {
        setAuthState({
          user: null,
          isLoading: false,
          isAuthenticated: false,
          error: null,
        });
        console.error("Error checking auth status:", error);
      }
    };

    checkAuthStatus();
  }, []);

  // Set user function
  const setUser = (user: User | null) => {
    setAuthState((prev) => ({
      ...prev,
      user,
      isAuthenticated: user !== null,
      error: null,
    }));
  };

  // Login function
  const login = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; data?: User; error?: string }> => {
    setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const res = await axios.post(
        `${usersUrl}/login`,
        { email, password },
        { withCredentials: true }
      );

      if (res.data.success) {
        // After successful login, immediately fetch the complete user data
        try {
          const userRes = await axios.get(`${usersUrl}/me`, {
            withCredentials: true,
          });

          if (userRes.data.success) {
            setAuthState({
              user: userRes.data.data,
              isLoading: false,
              isAuthenticated: true,
              error: null,
            });

            return { success: true, data: userRes.data.data };
          } else {
            // Fall back to login response if /me fails
            setAuthState({
              user: res.data.data,
              isLoading: false,
              isAuthenticated: true,
              error: null,
            });

            return { success: true, data: res.data.data };
          }
        } catch (fetchError) {
          // If fetching complete user data fails, use the login data
          console.error("Error fetching complete user data:", fetchError);
          setAuthState({
            user: res.data.data,
            isLoading: false,
            isAuthenticated: true,
            error: null,
          });

          return { success: true, data: res.data.data };
        }
      } else {
        return { success: false, error: "Unknown error occurred" };
      }
    } catch (error) {
      const errorMsg =
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : "Login failed";

      setAuthState((prev) => ({
        ...prev,
        isLoading: false,
        error: errorMsg,
      }));

      return { success: false, error: errorMsg };
    }
  };

  // Logout function
  const logout = async () => {
    setAuthState((prev) => ({ ...prev, isLoading: true }));
    try {
      await axios.post(
        `${usersUrl}/logout`,
        {}, // Empty request body
        { withCredentials: true } // Configuration as third parameter
      );

      setAuthState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
        error: null,
      });

      router.push("/login");
    } catch (error) {
      setAuthState((prev) => ({
        ...prev,
        isLoading: false,
        error: "Logout failed",
      }));
      console.error("Error logging out:", error);
    }
  };

  return {
    ...authState,
    login,
    logout,
    setUser,
  };
};
