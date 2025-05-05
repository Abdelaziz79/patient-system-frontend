import axios from "axios";

const baseUrl = process.env.NEXT_PUBLIC_BACK_URL + "/api/export";

export type ExportFormat = "excel" | "csv" | "pdf";

export interface ExportPatientParams {
  format?: ExportFormat;
  status?: string;
  isActive?: boolean;
  tag?: string;
  fromDate?: string;
  toDate?: string;
}

export interface ExportUserParams {
  format?: ExportFormat;
  role?: string;
  isActive?: boolean;
}

export const exportApi = {
  /**
   * Export all patients data
   * @param params Optional parameters for filtering exports
   * @returns Blob data that can be used to create a download
   */
  exportAllPatients: async (params?: ExportPatientParams): Promise<Blob> => {
    const queryParams = new URLSearchParams();

    if (params) {
      if (params.format) queryParams.append("format", params.format);
      if (params.status) queryParams.append("status", params.status);
      if (params.isActive !== undefined)
        queryParams.append("isActive", String(params.isActive));
      if (params.tag) queryParams.append("tag", params.tag);
      if (params.fromDate) queryParams.append("fromDate", params.fromDate);
      if (params.toDate) queryParams.append("toDate", params.toDate);
    }

    const url = `${baseUrl}/patients${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
    }`;

    const response = await axios.get(url, {
      withCredentials: true,
      responseType: "blob",
    });

    return response.data;
  },

  /**
   * Export a single patient's data
   * @param patientId The ID of the patient to export
   * @param format The format to export (excel, csv, pdf)
   * @returns Blob data that can be used to create a download
   */
  exportPatient: async (
    patientId: string,
    format: ExportFormat = "excel"
  ): Promise<Blob> => {
    const url = `${baseUrl}/patients/${patientId}?format=${format}`;

    const response = await axios.get(url, {
      withCredentials: true,
      responseType: "blob",
    });

    return response.data;
  },

  /**
   * Export a patient's data to PDF
   * @param patientId The ID of the patient to export
   * @returns Blob data that can be used to create a download
   */
  exportPatientToPDF: async (patientId: string): Promise<Blob> => {
    const url = `${baseUrl}/patients/${patientId}/pdf`;

    const response = await axios.get(url, {
      withCredentials: true,
      responseType: "blob",
    });

    return response.data;
  },

  /**
   * Export all users data (admin only)
   * @param params Optional parameters for filtering exports
   * @returns Blob data that can be used to create a download
   */
  exportUsers: async (params?: ExportUserParams): Promise<Blob> => {
    const queryParams = new URLSearchParams();

    if (params) {
      if (params.format) queryParams.append("format", params.format);
      if (params.role) queryParams.append("role", params.role);
      if (params.isActive !== undefined)
        queryParams.append("isActive", String(params.isActive));
    }

    const url = `${baseUrl}/users${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
    }`;

    const response = await axios.get(url, {
      withCredentials: true,
      responseType: "blob",
    });

    return response.data;
  },

  /**
   * Export a single user's data (admin only)
   * @param userId The ID of the user to export
   * @param format The format to export (excel, csv, pdf)
   * @returns Blob data that can be used to create a download
   */
  exportUser: async (
    userId: string,
    format: ExportFormat = "excel"
  ): Promise<Blob> => {
    const url = `${baseUrl}/users/${userId}?format=${format}`;

    const response = await axios.get(url, {
      withCredentials: true,
      responseType: "blob",
    });

    return response.data;
  },

  /**
   * Check if user has access to the export functionality
   * @returns Boolean indicating if user has access
   */
  checkExportAccess: async (): Promise<boolean> => {
    try {
      await axios.get(`${baseUrl}/patients`, {
        withCredentials: true,
        params: { format: "excel", limit: 1 },
      });
      return true;
    } catch (error) {
      if (
        axios.isAxiosError(error) &&
        (error.response?.status === 403 || error.response?.status === 401)
      ) {
        return false;
      }
      throw error;
    }
  },

  /**
   * Check if user has admin access for user exports
   * @returns Boolean indicating if user has admin access
   */
  checkAdminExportAccess: async (): Promise<boolean> => {
    try {
      await axios.get(`${baseUrl}/users`, {
        withCredentials: true,
        params: { format: "excel", limit: 1 },
      });
      return true;
    } catch (error) {
      if (
        axios.isAxiosError(error) &&
        (error.response?.status === 403 || error.response?.status === 401)
      ) {
        return false;
      }
      throw error;
    }
  },
};
