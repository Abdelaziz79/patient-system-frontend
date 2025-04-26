import axios from "axios";

// Types for appointment data
export interface IFollowUpAppointment {
  visitId: string;
  visitDate: string;
  visitTitle: string;
  followUpDate: string;
  visitType: string;
  notes: string;
}

export interface IUpcomingAppointment {
  patientId: string;
  patientName: string;
  patientPhone: string;
  visitId: string;
  visitDate: string;
  visitTitle: string;
  followUpDate: string;
  visitType: string;
  daysUntilFollowUp: number;
}

// API client for appointment operations
export const appointmentApi = {
  // Base URL
  baseUrl: process.env.NEXT_PUBLIC_BACK_URL + "/api/appointments",

  // Get follow-up appointments for a specific patient
  getPatientFollowUps: async (patientId: string) => {
    const response = await axios.get(
      `${appointmentApi.baseUrl}/patient/${patientId}/followups`,
      { withCredentials: true }
    );
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(
      response.data.message || "Failed to fetch patient follow-ups"
    );
  },

  // Get all upcoming follow-up appointments with optional filters
  getAllUpcomingFollowUps: async (params?: {
    days?: number;
    adminId?: string;
  }) => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, String(value));
        }
      });
    }

    const url = `${appointmentApi.baseUrl}/upcoming?${queryParams.toString()}`;
    const response = await axios.get(url, { withCredentials: true });
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(
      response.data.message || "Failed to fetch upcoming appointments"
    );
  },
};
