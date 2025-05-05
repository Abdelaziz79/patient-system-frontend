import {
  appointmentApi,
  IFollowUpAppointment,
  IUpcomingAppointment,
} from "@/app/_hooks/appointment/appointmentApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

// Hook interface
export interface UseAppointmentOptions {
  initialDays?: number;
  initialAdminId?: string;
  enableAutoFetch?: boolean;
}

// Main hook function
export const useAppointment = (options: UseAppointmentOptions = {}) => {
  const queryClient = useQueryClient();
  const [days, setDays] = useState<number>(options.initialDays || 7);
  const [adminId, setAdminId] = useState<string | undefined>(
    options.initialAdminId
  );
  const [error, setError] = useState<string | null>(null);

  // Get all upcoming appointments query
  const upcomingAppointmentsQuery = useQuery<IUpcomingAppointment[]>({
    queryKey: ["upcomingAppointments", days, adminId],
    queryFn: () => appointmentApi.getAllUpcomingFollowUps({ days, adminId }),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    enabled: options.enableAutoFetch !== false, // Enabled by default unless explicitly disabled
  });

  // Create mutation for getting patient follow-ups
  const patientFollowUpsMutation = useMutation({
    mutationFn: (patientId: string) =>
      appointmentApi.getPatientFollowUps(patientId),
    onError: (error: Error) => {
      setError(error.message);
    },
  });

  // Get patient follow-ups (imperative approach)
  const getPatientFollowUps = async (
    patientId: string
  ): Promise<{
    success: boolean;
    data?: IFollowUpAppointment[];
    message: string;
  }> => {
    try {
      const data = await patientFollowUpsMutation.mutateAsync(patientId);
      return {
        success: true,
        data,
        message: "Patient follow-ups retrieved successfully",
      };
    } catch (error) {
      const errorMsg =
        error instanceof Error
          ? error.message
          : "Failed to fetch patient follow-ups";
      setError(errorMsg);
      return { success: false, message: errorMsg };
    }
  };

  // Patient follow-ups for a specific patient query (declarative approach)
  const usePatientFollowUps = (patientId: string) => {
    return useQuery<IFollowUpAppointment[]>({
      queryKey: ["patientFollowUps", patientId],
      queryFn: () => appointmentApi.getPatientFollowUps(patientId),
      staleTime: 5 * 60 * 1000, // 5 minutes
      enabled: !!patientId && options.enableAutoFetch !== false,
    });
  };

  // Get all upcoming appointments (imperative approach)
  const getAllUpcomingFollowUps = async (params?: {
    days?: number;
    adminId?: string;
  }): Promise<{
    success: boolean;
    data?: IUpcomingAppointment[];
    message: string;
  }> => {
    // Use current state values if not provided
    const queryParams = {
      days: params?.days ?? days,
      adminId: params?.adminId ?? adminId,
    };

    try {
      const data = await appointmentApi.getAllUpcomingFollowUps(queryParams);

      // Update local state if new values were provided
      if (params?.days !== undefined && params.days !== days) {
        setDays(params.days);
      }
      if (params?.adminId !== undefined && params.adminId !== adminId) {
        setAdminId(params.adminId);
      }

      // Update cache
      queryClient.setQueryData(
        ["upcomingAppointments", queryParams.days, queryParams.adminId],
        data
      );

      return {
        success: true,
        data,
        message: "Upcoming appointments retrieved successfully",
      };
    } catch (error) {
      const errorMsg =
        error instanceof Error
          ? error.message
          : "Failed to fetch upcoming appointments";
      setError(errorMsg);
      return { success: false, message: errorMsg };
    }
  };

  // Update appointment filter settings
  const updateFilters = (newFilters: Partial<UseAppointmentOptions>) => {
    let filtersChanged = false;

    if (
      newFilters.initialDays !== undefined &&
      newFilters.initialDays !== days
    ) {
      setDays(newFilters.initialDays);
      filtersChanged = true;
    }

    if (
      newFilters.initialAdminId !== undefined &&
      newFilters.initialAdminId !== adminId
    ) {
      setAdminId(newFilters.initialAdminId);
      filtersChanged = true;
    }

    // Automatically refetch if filters changed and auto fetch is enabled
    if (filtersChanged && options.enableAutoFetch !== false) {
      // This will automatically trigger a refetch since we're using days and adminId in the queryKey
      upcomingAppointmentsQuery.refetch();
    }

    return filtersChanged;
  };

  // Clear any errors
  const clearError = () => setError(null);

  return {
    // Upcoming appointments data and state
    upcomingAppointments: upcomingAppointmentsQuery.data,
    isUpcomingAppointmentsLoading: upcomingAppointmentsQuery.isPending,
    upcomingAppointmentsError: upcomingAppointmentsQuery.error,
    refetchUpcomingAppointments: upcomingAppointmentsQuery.refetch,

    // Current filter state
    days,
    adminId,

    // Patient follow-ups mutation state
    isLoadingPatientFollowUps: patientFollowUpsMutation.isPending,
    patientFollowUpsError: patientFollowUpsMutation.error,

    // General error state
    error,
    clearError,

    // API methods
    getPatientFollowUps,
    getAllUpcomingFollowUps,
    usePatientFollowUps,
    updateFilters,

    // Raw query/mutation objects for advanced usage
    upcomingAppointmentsQuery,
    patientFollowUpsMutation,
  };
};
