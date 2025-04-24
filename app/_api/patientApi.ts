import axios from "axios";
import { IPatient, IStatus, IVisit, IVisitInput } from "../_types/Patient";

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
    const response = await axios.get(url, { withCredentials: true });
    if (response.data.success) {
      return response.data;
    }
    throw new Error(response.data.message || "Failed to fetch patients");
  },

  // Get patient by ID
  getPatientById: async (id: string) => {
    const response = await axios.get(`${patientApi.baseUrl}/${id}`, {
      withCredentials: true,
    });
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.message || "Failed to fetch patient");
  },

  // Create new patient
  createPatient: async (patientData: Partial<IPatient>) => {
    const response = await axios.post(patientApi.baseUrl, patientData, {
      withCredentials: true,
    });
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
    const response = await axios.put(`${patientApi.baseUrl}/${id}`, data, {
      withCredentials: true,
    });
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.message || "Failed to update patient");
  },

  // Delete patient (soft delete)
  deletePatient: async (id: string) => {
    const response = await axios.delete(`${patientApi.baseUrl}/${id}`, {
      withCredentials: true,
    });
    if (response.data.success) {
      return true;
    }
    throw new Error(response.data.message || "Failed to delete patient");
  },

  // Update patient status
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
      { withCredentials: true }
    );
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.message || "Failed to update patient status");
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
      { withCredentials: true }
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
      { withCredentials: true }
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
      { withCredentials: true }
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
      { withCredentials: true }
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
      { withCredentials: true }
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
      { withCredentials: true }
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
      { withCredentials: true }
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
      { withCredentials: true }
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
    const response = await axios.get(`${patientApi.baseUrl}/${id}/history`, {
      withCredentials: true,
    });
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
      { withCredentials: true }
    );
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.message || "Failed to add tag");
  },

  // Remove tag from patient
  removePatientTag: async ({ id, tag }: { id: string; tag: string }) => {
    const response = await axios.delete(`${patientApi.baseUrl}/${id}/tags`, {
      data: { tag },
      withCredentials: true,
    });
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.message || "Failed to remove tag");
  },

  // Get patient statistics
  getPatientStats: async () => {
    const response = await axios.get(`${patientApi.baseUrl}/stats`, {
      withCredentials: true,
    });
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
      { withCredentials: true }
    );
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.message || "Failed to search patients");
  },

  // Export patient data to PDF
  exportPatientToPdf: async (id: string) => {
    const response = await axios.get(`${patientApi.baseUrl}/${id}/export/pdf`, {
      withCredentials: true,
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
      withCredentials: true,
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
        withCredentials: true,
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
      { withCredentials: true }
    );

    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.message || "Failed to share patient data");
  },
};
