import axios from "axios";
import { createAuthConfig } from "../utils/authUtils";

// Types for appointment data
export interface IFollowUpAppointment {
  type: "visit" | "event";
  id: string;
  date: string;
  title: string;
  followUpDate: string;
  appointmentType: string;
  notes: string;
  importance?: string; // Only for events
}

export interface IUpcomingAppointment {
  type: "visit" | "event";
  patientId: string;
  patientName: string;
  patientPhone: string;
  id: string;
  date: string;
  title: string;
  followUpDate: string;
  appointmentType: string;
  daysUntilFollowUp: number;
  importance?: string; // Only for events
}

// API client for appointment operations
export const appointmentApi = {
  // Base URL
  baseUrl: process.env.NEXT_PUBLIC_BACK_URL + "/api/appointments",

  // Get follow-up appointments for a specific patient
  getPatientFollowUps: async (
    patientId: string
  ): Promise<IFollowUpAppointment[]> => {
    const response = await axios.get(
      `${appointmentApi.baseUrl}/patient/${patientId}/followups`,
      createAuthConfig()
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
  }): Promise<IUpcomingAppointment[]> => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, String(value));
        }
      });
    }

    const url = `${appointmentApi.baseUrl}/upcoming?${queryParams.toString()}`;
    const response = await axios.get(url, createAuthConfig());
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(
      response.data.message || "Failed to fetch upcoming appointments"
    );
  },
};
