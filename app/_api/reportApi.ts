import axios from "axios";

// Base URL for report endpoints
const reportUrl = process.env.NEXT_PUBLIC_BACK_URL + "/api/reports";

// Report interfaces
export interface IReportField {
  name: string;
  label: string;
  type: string;
  section: string;
  description?: string;
}

export interface IReportFilter {
  field: string;
  operator: string;
  value: any;
  fieldType?: string;
}

export interface IReportChart {
  type: string;
  title: string;
  dataField: string;
  groupBy?: string;
  timeInterval?: string;
  options?: any;
}

export interface IReport {
  id?: string;
  name: string;
  description?: string;
  type: string;
  filters: IReportFilter[];
  charts: IReportChart[];
  includeFields: string[];
  isPrivate: boolean;
  createdBy: any;
  lastModifiedBy?: any;
  createdAt?: Date;
  updatedAt?: Date;
}

// AI Report Interfaces
export interface IAIPatientReport {
  patient: {
    id: string;
    name: string;
    status: any;
  };
  aiAnalysis: string;
  generatedAt: Date;
}

export interface IAIGroupAnalysisOptions {
  focus?: string;
  timeframe?: string;
  includeVisits?: boolean;
}

export interface IAITreatmentRecommendationsOptions {
  considerHistoricalTreatments?: boolean;
  specificCondition?: string;
}

export interface IAIProgressAnalysisOptions {
  timeframe?: string;
  focusArea?: string;
}

// API functions
export const reportApi = {
  // Get all reports
  getAllReports: async () => {
    const response = await axios.get(reportUrl, { withCredentials: true });
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.message || "Failed to fetch reports");
  },

  // Get report by ID
  getReportById: async (id: string) => {
    const response = await axios.get(`${reportUrl}/${id}`, {
      withCredentials: true,
    });
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.message || "Failed to fetch report");
  },

  // Create a new report
  createReport: async (reportData: Partial<IReport>) => {
    const response = await axios.post(reportUrl, reportData, {
      withCredentials: true,
    });
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.message || "Failed to create report");
  },

  // Update a report
  updateReport: async ({
    id,
    data,
  }: {
    id: string;
    data: Partial<IReport>;
  }) => {
    const response = await axios.put(`${reportUrl}/${id}`, data, {
      withCredentials: true,
    });
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.message || "Failed to update report");
  },

  // Delete a report
  deleteReport: async (id: string) => {
    const response = await axios.delete(`${reportUrl}/${id}`, {
      withCredentials: true,
    });
    if (response.data.success) {
      return true;
    }
    throw new Error(response.data.message || "Failed to delete report");
  },

  // Generate a report from saved configuration
  generateReport: async (id: string) => {
    const response = await axios.get(`${reportUrl}/${id}/generate`, {
      withCredentials: true,
    });
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.message || "Failed to generate report");
  },

  // Get available fields for reporting
  getReportFields: async () => {
    const response = await axios.get(`${reportUrl}/fields`, {
      withCredentials: true,
    });
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.message || "Failed to fetch report fields");
  },

  // Generate a custom ad-hoc report
  generateCustomReport: async (reportConfig: {
    type?: string;
    filters?: IReportFilter[];
    charts?: IReportChart[];
    includeFields?: string[];
  }) => {
    const response = await axios.post(
      `${reportUrl}/generate-custom`,
      reportConfig,
      {
        withCredentials: true,
      }
    );
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(
      response.data.message || "Failed to generate custom report"
    );
  },

  // AI Report Functions

  // Generate AI analysis for a single patient
  generatePatientAIReport: async (patientId: string) => {
    const response = await axios.get(`${reportUrl}/ai/patient/${patientId}`, {
      withCredentials: true,
    });
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(
      response.data.message || "Failed to generate AI patient report"
    );
  },

  // Generate comparative analysis of multiple patients
  generateGroupAnalysis: async (
    patientIds: string[],
    options?: IAIGroupAnalysisOptions
  ) => {
    const response = await axios.post(
      `${reportUrl}/ai/group-analysis`,
      { patientIds, ...options },
      { withCredentials: true }
    );
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(
      response.data.message || "Failed to generate group analysis"
    );
  },

  // Generate AI treatment recommendations
  generateTreatmentRecommendations: async (
    patientId: string,
    options?: IAITreatmentRecommendationsOptions
  ) => {
    const response = await axios.post(
      `${reportUrl}/ai/treatment-recommendations/${patientId}`,
      options || {},
      { withCredentials: true }
    );
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(
      response.data.message || "Failed to generate treatment recommendations"
    );
  },

  // Generate progress analysis report
  generateProgressAnalysis: async (
    patientId: string,
    options?: IAIProgressAnalysisOptions
  ) => {
    const response = await axios.post(
      `${reportUrl}/ai/progress-analysis/${patientId}`,
      options || {},
      { withCredentials: true }
    );
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(
      response.data.message || "Failed to generate progress analysis"
    );
  },
};
