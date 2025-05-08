import axios from "axios";

// Base URL for report endpoints
const reportUrl = process.env.NEXT_PUBLIC_BACK_URL + "/api/reports";

// Field Types and Operators
export type FilterOperator =
  | "equals"
  | "notEquals"
  | "contains"
  | "greaterThan"
  | "lessThan"
  | "between"
  | "in"
  | "exists"
  | "notExists";

export type FieldType =
  | "text"
  | "number"
  | "date"
  | "boolean"
  | "status"
  | "tag"
  | "template"
  | "visit"
  | "event"
  | "reference";

export type ChartType =
  | "bar"
  | "line"
  | "pie"
  | "table"
  | "summary"
  | "heatmap"
  | "scatter";

export type TimeInterval = "day" | "week" | "month" | "quarter" | "year";

export type ReportType =
  | "patient"
  | "visit"
  | "status"
  | "custom"
  | "event"
  | "comparative";

// Report interfaces
export interface IReportField {
  key: string;
  label: string;
  type: string;
  section?: string;
  description?: string;
  templateId?: string;
  templateName?: string;
}

export interface IReportFilter {
  field: string;
  operator: FilterOperator;
  value?: any;
  endValue?: any;
  fieldType: FieldType;
  displayLabel?: string;
}

export interface IChartConfig {
  type: ChartType;
  dataField: string;
  groupBy?: string;
  timeInterval?: TimeInterval;
  title?: string;
  description?: string;
  options?: Map<string, any>;
  order?: number;
  color?: string;
  colorScheme?: string;
}

export interface IDashboardConfig {
  layout?: Map<string, any>;
  refreshInterval?: number;
  defaultTimeRange?: string;
}

export interface ISchedule {
  enabled: boolean;
  frequency?: "daily" | "weekly" | "monthly";
  dayOfWeek?: number;
  dayOfMonth?: number;
  time?: string;
  recipients?: string[];
  lastRun?: Date;
}

export interface IReport {
  id: string;
  name: string;
  description?: string;
  type: string;
  isFavorite: boolean;
  isTemplate: boolean;
  lastGeneratedAt: string | Date | null;
  category?: string;

  // Additional required properties
  filters?: Record<string, any>;
  charts?: Array<any>;
  includeFields?: Array<string>;
  isPrivate?: boolean;
  tags?: Array<string>;
  createdBy?: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

// Event report interface
export interface IEventReportConfig {
  type: "event";
  filters?: IReportFilter[];
  charts?: IChartConfig[];
  includeFields?: string[];
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
  reportId?: string;
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
  getAllReports: async (params?: {
    category?: string;
    type?: ReportType;
    favorite?: boolean;
    template?: boolean;
    search?: string;
    sortBy?: "name" | "created" | "generated";
  }) => {
    const queryParams = new URLSearchParams();

    if (params?.category) queryParams.append("category", params.category);
    if (params?.type) queryParams.append("type", params.type);
    if (params?.favorite) queryParams.append("favorite", "true");
    if (params?.template !== undefined)
      queryParams.append("template", params.template ? "true" : "false");
    if (params?.search) queryParams.append("search", params.search);
    if (params?.sortBy) queryParams.append("sortBy", params.sortBy);

    const url = `${reportUrl}?${queryParams.toString()}`;
    const response = await axios.get(url, { withCredentials: true });

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
    type?: ReportType;
    filters?: IReportFilter[];
    charts?: IChartConfig[];
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

  // Generate an event-specific report
  generateEventReport: async (reportConfig: IEventReportConfig) => {
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
    throw new Error(response.data.message || "Failed to generate event report");
  },

  // Check if user has access to the reports
  checkReportAccess: async (): Promise<boolean> => {
    try {
      const response = await axios.get(reportUrl, { withCredentials: true });
      return response.data.success || false;
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

  // Get report categories
  getReportCategories: async () => {
    const response = await axios.get(`${reportUrl}/categories`, {
      withCredentials: true,
    });
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(
      response.data.message || "Failed to fetch report categories"
    );
  },

  // Get report templates
  getReportTemplates: async () => {
    const response = await axios.get(`${reportUrl}/templates`, {
      withCredentials: true,
    });
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(
      response.data.message || "Failed to fetch report templates"
    );
  },

  // Copy a report
  copyReport: async (id: string, newName?: string) => {
    const response = await axios.post(
      `${reportUrl}/${id}/copy`,
      { name: newName },
      { withCredentials: true }
    );
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.message || "Failed to copy report");
  },

  // Toggle favorite status
  toggleFavorite: async (id: string) => {
    const response = await axios.patch(
      `${reportUrl}/${id}/favorite`,
      {},
      { withCredentials: true }
    );
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(
      response.data.message || "Failed to toggle favorite status"
    );
  },

  // Toggle template status
  toggleTemplateStatus: async (id: string) => {
    const response = await axios.patch(
      `${reportUrl}/${id}/template`,
      {},
      { withCredentials: true }
    );
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(
      response.data.message || "Failed to toggle template status"
    );
  },

  // Get scheduled reports
  getScheduledReports: async () => {
    const response = await axios.get(`${reportUrl}/scheduled`, {
      withCredentials: true,
    });
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(
      response.data.message || "Failed to fetch scheduled reports"
    );
  },

  // Update report schedule
  updateReportSchedule: async (
    id: string,
    scheduleData: Partial<ISchedule>
  ) => {
    const response = await axios.patch(
      `${reportUrl}/${id}/schedule`,
      scheduleData,
      { withCredentials: true }
    );
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(
      response.data.message || "Failed to update report schedule"
    );
  },

  // AI Report Functions

  // Generate AI analysis for a single patient
  generatePatientAIReport: async (
    patientId: string,
    options?: { save?: boolean; name?: string }
  ) => {
    let url = `${reportUrl}/ai/patient/${patientId}`;

    if (options) {
      const queryParams = new URLSearchParams();
      if (options.save) queryParams.append("save", "true");
      if (options.name) queryParams.append("name", options.name);
      if (queryParams.toString()) {
        url += `?${queryParams.toString()}`;
      }
    }

    const response = await axios.get(url, {
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
    options?: IAIGroupAnalysisOptions & { save?: boolean; name?: string }
  ) => {
    let url = `${reportUrl}/ai/group-analysis`;

    if (options?.save || options?.name) {
      const queryParams = new URLSearchParams();
      if (options.save) queryParams.append("save", "true");
      if (options.name) queryParams.append("name", options.name);
      if (queryParams.toString()) {
        url += `?${queryParams.toString()}`;
      }
    }

    const requestData = {
      patientIds,
      focus: options?.focus,
      timeframe: options?.timeframe,
      includeVisits: options?.includeVisits,
    };

    const response = await axios.post(url, requestData, {
      withCredentials: true,
    });
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
    options?: IAITreatmentRecommendationsOptions & {
      save?: boolean;
      name?: string;
    }
  ) => {
    let url = `${reportUrl}/ai/treatment-recommendations/${patientId}`;

    if (options?.save || options?.name) {
      const queryParams = new URLSearchParams();
      if (options.save) queryParams.append("save", "true");
      if (options.name) queryParams.append("name", options.name);
      if (queryParams.toString()) {
        url += `?${queryParams.toString()}`;
      }
    }

    const requestData = {
      considerHistoricalTreatments: options?.considerHistoricalTreatments,
      specificCondition: options?.specificCondition,
    };

    const response = await axios.post(url, requestData, {
      withCredentials: true,
    });
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
    options?: IAIProgressAnalysisOptions & { save?: boolean; name?: string }
  ) => {
    let url = `${reportUrl}/ai/progress-analysis/${patientId}`;

    if (options?.save || options?.name) {
      const queryParams = new URLSearchParams();
      if (options.save) queryParams.append("save", "true");
      if (options.name) queryParams.append("name", options.name);
      if (queryParams.toString()) {
        url += `?${queryParams.toString()}`;
      }
    }

    const requestData = {
      timeframe: options?.timeframe,
      focusArea: options?.focusArea,
    };

    const response = await axios.post(url, requestData, {
      withCredentials: true,
    });
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(
      response.data.message || "Failed to generate progress analysis"
    );
  },
};

export interface GenerateReportParams {
  reportId: string;
  dateRange?: {
    startDate: string | Date;
    endDate: string | Date;
  };
  filters?: Record<string, any>;
}

export interface ReportApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

export interface CreateReportData {
  name: string;
  description?: string;
  type: string;
  isTemplate?: boolean;
  category?: string;
  filters?: Record<string, any>;
  charts?: Array<any>;
  includeFields?: Array<string>;
  isPrivate?: boolean;
  tags?: Array<string>;
}

export class ReportApi {
  static async fetchReports(): Promise<IReport[]> {
    const response = await fetch("/api/reports");

    if (!response.ok) {
      throw new Error(`Failed to fetch reports: ${response.statusText}`);
    }

    return response.json();
  }

  static async fetchReportById(id: string): Promise<IReport> {
    const response = await fetch(`/api/reports/${id}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch report: ${response.statusText}`);
    }

    return response.json();
  }

  static async createReport(
    data: CreateReportData
  ): Promise<ReportApiResponse<IReport>> {
    const response = await fetch("/api/reports", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    return response.json();
  }

  static async updateReport(
    id: string,
    data: Partial<CreateReportData>
  ): Promise<ReportApiResponse<IReport>> {
    const response = await fetch(`/api/reports/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    return response.json();
  }

  static async deleteReport(id: string): Promise<ReportApiResponse<null>> {
    const response = await fetch(`/api/reports/${id}`, {
      method: "DELETE",
    });

    return response.json();
  }

  static async generateReport(
    params: GenerateReportParams
  ): Promise<ReportApiResponse<any>> {
    const response = await fetch(`/api/reports/${params.reportId}/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    });

    return response.json();
  }

  static async toggleFavorite(
    id: string
  ): Promise<ReportApiResponse<{ isFavorite: boolean }>> {
    const response = await fetch(`/api/reports/${id}/favorite`, {
      method: "POST",
    });

    return response.json();
  }
}
