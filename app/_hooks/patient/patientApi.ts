import axios from "axios";
import { createAuthConfig } from "../utils/authUtils";
import {
  IPatient,
  IStatus,
  IVisit,
  IVisitInput,
  IEvent,
  IEventInput,
  IPatientStatusOption,
} from "@/app/_types/Patient";

// API client for patient operations
export const patientApi = {
  // Base URL
  baseUrl: process.env.NEXT_PUBLIC_BACK_URL + "/api/patients",

  // Get all patients with optional filtering and pagination
  getPatients: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    isActive?: boolean;
    templateId?: string;
    sortBy?: string;
    sortDir?: "asc" | "desc";
  }) => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, String(value));
        }
      });
    }

    const url = `${patientApi.baseUrl}?${queryParams.toString()}`;
    const response = await axios.get(url, createAuthConfig());
    if (response.data.success) {
      return response.data;
    }
    throw new Error(response.data.message || "Failed to fetch patients");
  },

  // Get patient by ID
  getPatientById: async (id: string) => {
    const response = await axios.get(
      `${patientApi.baseUrl}/${id}`,
      createAuthConfig()
    );
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.message || "Failed to fetch patient");
  },

  // Create new patient
  createPatient: async (patientData: Partial<IPatient>) => {
    const response = await axios.post(
      patientApi.baseUrl,
      patientData,
      createAuthConfig()
    );
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.message || "Failed to create patient");
  },

  // Update patient
  updatePatient: async ({
    id,
    data,
  }: {
    id: string;
    data: Partial<IPatient>;
  }) => {
    const response = await axios.put(
      `${patientApi.baseUrl}/${id}`,
      data,
      createAuthConfig()
    );
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.message || "Failed to update patient");
  },

  // Delete patient (soft delete)
  deletePatient: async (id: string) => {
    const response = await axios.delete(
      `${patientApi.baseUrl}/${id}`,
      createAuthConfig()
    );
    if (response.data.success) {
      return true;
    }
    throw new Error(response.data.message || "Failed to delete patient");
  },

  // Update patient status (legacy method)
  updatePatientStatus: async ({
    id,
    statusData,
  }: {
    id: string;
    statusData: Partial<IStatus>;
  }) => {
    const response = await axios.put(
      `${patientApi.baseUrl}/${id}/status`,
      statusData,
      createAuthConfig()
    );
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.message || "Failed to update patient status");
  },

  // New method to change patient status
  changePatientStatus: async ({
    patientId,
    statusData,
  }: {
    patientId: string;
    statusData: Partial<IStatus>;
  }) => {
    const response = await axios.put(
      `${patientApi.baseUrl}/${patientId}/status-update`,
      statusData,
      createAuthConfig()
    );
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.message || "Failed to change patient status");
  },

  // Batch update patient status
  batchUpdatePatientStatus: async ({
    patientIds,
    status,
  }: {
    patientIds: string[];
    status: Partial<IStatus>;
  }) => {
    const response = await axios.put(
      `${patientApi.baseUrl}/batch/status`,
      { patientIds, status },
      createAuthConfig()
    );
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.message || "Failed to batch update status");
  },

  // Get patient visits
  getVisits: async (patientId: string) => {
    const response = await axios.get(
      `${patientApi.baseUrl}/${patientId}/visits`,
      createAuthConfig()
    );
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.message || "Failed to fetch visits");
  },

  // Add visit to patient
  addVisit: async ({
    patientId,
    visitData,
  }: {
    patientId: string;
    visitData: IVisitInput;
  }) => {
    const response = await axios.post(
      `${patientApi.baseUrl}/${patientId}/visits`,
      visitData,
      createAuthConfig()
    );
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.message || "Failed to add visit");
  },

  // Update visit
  updateVisit: async ({
    patientId,
    visitId,
    visitData,
  }: {
    patientId: string;
    visitId: string;
    visitData: Partial<IVisit>;
  }) => {
    const response = await axios.put(
      `${patientApi.baseUrl}/${patientId}/visits/${visitId}`,
      visitData,
      createAuthConfig()
    );
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.message || "Failed to update visit");
  },

  // Delete visit (soft delete)
  deleteVisit: async ({
    patientId,
    visitId,
  }: {
    patientId: string;
    visitId: string;
  }) => {
    const response = await axios.delete(
      `${patientApi.baseUrl}/${patientId}/visits/${visitId}`,
      createAuthConfig()
    );
    if (response.data.success) {
      return true;
    }
    throw new Error(response.data.message || "Failed to delete visit");
  },

  // Restore visit
  restoreVisit: async ({
    patientId,
    visitId,
  }: {
    patientId: string;
    visitId: string;
  }) => {
    const response = await axios.put(
      `${patientApi.baseUrl}/${patientId}/visits/${visitId}/restore`,
      {},
      createAuthConfig()
    );
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.message || "Failed to restore visit");
  },

  // Search visits
  searchVisits: async ({
    patientId,
    query,
  }: {
    patientId: string;
    query: string;
  }) => {
    const response = await axios.get(
      `${
        patientApi.baseUrl
      }/${patientId}/visits/search?query=${encodeURIComponent(query)}`,
      createAuthConfig()
    );
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.message || "Failed to search visits");
  },

  // Update patient activation
  updatePatientActivation: async ({
    id,
    isActive,
  }: {
    id: string;
    isActive: boolean;
  }) => {
    const response = await axios.put(
      `${patientApi.baseUrl}/${id}/activation`,
      { isActive },
      createAuthConfig()
    );
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(
      response.data.message || "Failed to update activation status"
    );
  },

  // Get patient history
  getPatientHistory: async (id: string) => {
    const response = await axios.get(
      `${patientApi.baseUrl}/${id}/history`,
      createAuthConfig()
    );
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.message || "Failed to fetch patient history");
  },

  // Add tag to patient
  addPatientTag: async ({ id, tag }: { id: string; tag: string }) => {
    const response = await axios.post(
      `${patientApi.baseUrl}/${id}/tags`,
      { tag },
      createAuthConfig()
    );
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.message || "Failed to add tag");
  },

  // Remove tag from patient
  removePatientTag: async ({ id, tag }: { id: string; tag: string }) => {
    const response = await axios.delete(`${patientApi.baseUrl}/${id}/tags`, {
      ...createAuthConfig(),
      data: { tag },
    });
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.message || "Failed to remove tag");
  },

  // Get patient statistics
  getPatientStats: async () => {
    const response = await axios.get(
      `${patientApi.baseUrl}/stats`,
      createAuthConfig()
    );
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(
      response.data.message || "Failed to fetch patient statistics"
    );
  },

  // Search patients
  searchPatients: async (params: {
    query?: string;
    status?: string;
    isActive?: boolean;
    templateId?: string;
    tag?: string;
  }) => {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, String(value));
      }
    });

    const response = await axios.get(
      `${patientApi.baseUrl}/search?${queryParams.toString()}`,
      createAuthConfig()
    );
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.message || "Failed to search patients");
  },

  // Export patient data to PDF
  exportPatientToPdf: async (id: string) => {
    const response = await axios.get(`${patientApi.baseUrl}/${id}/export/pdf`, {
      ...createAuthConfig(),
      responseType: "blob", // Important for handling PDF binary data
    });

    if (response.status === 200) {
      return response.data;
    }
    throw new Error("Failed to export patient data to PDF");
  },

  // Export patient data to CSV
  exportPatientToCsv: async (id: string) => {
    const response = await axios.get(`${patientApi.baseUrl}/${id}/export/csv`, {
      ...createAuthConfig(),
      responseType: "blob",
    });

    if (response.status === 200) {
      return response.data;
    }
    throw new Error("Failed to export patient data to CSV");
  },

  // Generate a medical report
  generateMedicalReport: async (
    id: string,
    options?: {
      includeVisits?: boolean;
      includeHistory?: boolean;
      customTitle?: string;
    }
  ) => {
    const response = await axios.post(
      `${patientApi.baseUrl}/${id}/report`,
      options || {},
      {
        ...createAuthConfig(),
        responseType: "blob",
      }
    );

    if (response.status === 200) {
      return response.data;
    }
    throw new Error("Failed to generate medical report");
  },

  // Share patient data via email
  sharePatientViaEmail: async (
    id: string,
    emailData: {
      recipientEmail: string;
      message?: string;
      includeAttachment?: boolean;
    }
  ) => {
    const response = await axios.post(
      `${patientApi.baseUrl}/${id}/share`,
      emailData,
      createAuthConfig()
    );

    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.message || "Failed to share patient data");
  },

  // Get patient status options
  getPatientStatusOptions: async (patientId: string) => {
    const response = await axios.get(
      `${patientApi.baseUrl}/${patientId}/status-options`,
      createAuthConfig()
    );
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.message || "Failed to fetch status options");
  },

  // Add patient status option
  addPatientStatusOption: async ({
    patientId,
    statusOption,
  }: {
    patientId: string;
    statusOption: IPatientStatusOption;
  }) => {
    const response = await axios.post(
      `${patientApi.baseUrl}/${patientId}/status-options`,
      statusOption,
      createAuthConfig()
    );
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.message || "Failed to add status option");
  },

  // Remove patient status option
  removePatientStatusOption: async ({
    patientId,
    statusName,
  }: {
    patientId: string;
    statusName: string;
  }) => {
    const response = await axios.delete(
      `${patientApi.baseUrl}/${patientId}/status-options/${statusName}`,
      createAuthConfig()
    );
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.message || "Failed to remove status option");
  },

  // Add event
  addEvent: async ({
    patientId,
    eventData,
  }: {
    patientId: string;
    eventData: IEventInput;
  }) => {
    const response = await axios.post(
      `${patientApi.baseUrl}/${patientId}/events`,
      eventData,
      createAuthConfig()
    );
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.message || "Failed to add event");
  },

  // Get events
  getEvents: async (
    patientId: string,
    params?: {
      query?: string;
      eventType?: string;
      importance?: string;
    }
  ) => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, String(value));
        }
      });
    }

    const url = `${patientApi.baseUrl}/${patientId}/events${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
    }`;
    const response = await axios.get(url, createAuthConfig());
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.message || "Failed to fetch events");
  },

  // Update event
  updateEvent: async ({
    patientId,
    eventId,
    eventData,
  }: {
    patientId: string;
    eventId: string;
    eventData: Partial<IEvent>;
  }) => {
    const response = await axios.put(
      `${patientApi.baseUrl}/${patientId}/events/${eventId}`,
      eventData,
      createAuthConfig()
    );
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.message || "Failed to update event");
  },

  // Delete event
  deleteEvent: async ({
    patientId,
    eventId,
  }: {
    patientId: string;
    eventId: string;
  }) => {
    const response = await axios.delete(
      `${patientApi.baseUrl}/${patientId}/events/${eventId}`,
      createAuthConfig()
    );
    if (response.data.success) {
      return true;
    }
    throw new Error(response.data.message || "Failed to delete event");
  },

  // Restore event
  restoreEvent: async ({
    patientId,
    eventId,
  }: {
    patientId: string;
    eventId: string;
  }) => {
    const response = await axios.put(
      `${patientApi.baseUrl}/${patientId}/events/${eventId}/restore`,
      {},
      createAuthConfig()
    );
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.message || "Failed to restore event");
  },
};
