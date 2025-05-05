import { authApi } from "@/app/_hooks/auth/authApi";
import { User } from "@/app/_types/User";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

export const useAuth = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  // Query for user data - updated for v5
  const {
    data: user,
    isPending,
    error,
    failureReason,
  } = useQuery({
    queryKey: ["auth", "me"],
    queryFn: authApi.getMe,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    // v5 syntax
    refetchOnWindowFocus: false,
  });

  // Upcoming events query
  const {
    data: upcomingEvents,
    isPending: isLoadingEvents,
    refetch: refetchUpcomingEvents,
  } = useQuery({
    queryKey: ["auth", "upcomingEvents"],
    queryFn: () => authApi.getMyUpcomingEvents(),
    enabled: !!user, // Only fetch if user is logged in
    refetchOnWindowFocus: false,
  });

  // Login mutation with v5 syntax
  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (userData) => {
      // Update auth cache on successful login
      queryClient.setQueryData(["auth", "me"], userData);
      queryClient.invalidateQueries({ queryKey: ["auth"] });
    },
  });

  // Logout mutation with v5 syntax
  const logoutMutation = useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      // Clear user from cache on successful logout
      queryClient.setQueryData(["auth", "me"], null);
      queryClient.invalidateQueries({ queryKey: ["auth"] });
      router.push("/login");
    },
  });

  // Function to set user data manually (if needed)
  const setUser = (userData: User | null) => {
    queryClient.setQueryData(["auth", "me"], userData);
  };

  // Login function
  const login = async (email: string, password: string) => {
    try {
      const data = await loginMutation.mutateAsync({ email, password });
      return { success: true, data };
    } catch (error) {
      const errorMsg =
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : "Login failed";

      return { success: false, error: errorMsg };
    }
  };

  // Logout function
  const logout = async () => {
    await logoutMutation.mutateAsync();
  };

  // Extract error message from failureReason
  const errorMessage = failureReason
    ? failureReason instanceof Error
      ? failureReason.message
      : "An error occurred"
    : null;

  return {
    user: user || null,
    isLoading: isPending, // v5 uses isPending instead of isLoading
    isAuthenticated: !!user,
    error: errorMessage,
    login,
    logout,
    setUser,
    // Upcoming events functionality
    upcomingEvents: upcomingEvents?.data || [],
    isLoadingEvents,
    refetchUpcomingEvents,
  };
};
