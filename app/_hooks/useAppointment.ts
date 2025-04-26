import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { appointmentApi, IFollowUpAppointment } from "../_api/appointmentApi";

// Hook interface
export interface UseAppointmentOptions {
  initialDays?: number;
  initialAdminId?: string;
}

// Main hook function
export const useAppointment = (options: UseAppointmentOptions = {}) => {
  const queryClient = useQueryClient();
  const [days, setDays] = useState<number>(options.initialDays || 7);
  const [adminId, setAdminId] = useState<string | undefined>(
    options.initialAdminId
  );

  // Get all upcoming appointments query
  const {
    data: upcomingAppointments,
    isPending: isUpcomingAppointmentsLoading,
    error: upcomingAppointmentsError,
    refetch: refetchUpcomingAppointments,
  } = useQuery({
    queryKey: ["upcomingAppointments", days, adminId],
    queryFn: () => appointmentApi.getAllUpcomingFollowUps({ days, adminId }),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
  });

  // Get patient follow-ups query (function to be called when needed)
  const getPatientFollowUps = async (patientId: string) => {
    try {
      const data = await queryClient.fetchQuery({
        queryKey: ["patientFollowUps", patientId],
        queryFn: () => appointmentApi.getPatientFollowUps(patientId),
        staleTime: 5 * 60 * 1000, // 5 minutes
      });
      return data as IFollowUpAppointment[];
    } catch (error) {
      console.error("Failed to fetch patient follow-ups:", error);
      throw error;
    }
  };

  // Patient follow-ups for a specific patient query
  const usePatientFollowUps = (patientId: string) => {
    return useQuery({
      queryKey: ["patientFollowUps", patientId],
      queryFn: () => appointmentApi.getPatientFollowUps(patientId),
      staleTime: 5 * 60 * 1000, // 5 minutes
      enabled: !!patientId,
    });
  };

  // Update appointment filter settings
  const updateFilters = (newFilters: Partial<UseAppointmentOptions>) => {
    if (newFilters.initialDays !== undefined) {
      setDays(newFilters.initialDays);
    }
    if (newFilters.initialAdminId !== undefined) {
      setAdminId(newFilters.initialAdminId);
    }
  };

  return {
    // Queries
    upcomingAppointments,
    isUpcomingAppointmentsLoading,
    upcomingAppointmentsError,
    refetchUpcomingAppointments,

    // Filter state
    days,
    adminId,

    // Functions
    getPatientFollowUps,
    usePatientFollowUps,
    updateFilters,
  };
};
