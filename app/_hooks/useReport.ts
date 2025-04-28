import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import {
  IAIGroupAnalysisOptions,
  IAIProgressAnalysisOptions,
  IAITreatmentRecommendationsOptions,
  IReport,
  reportApi,
} from "../_api/reportApi";

// Hook options interface
export interface UseReportOptions {
  initialFetch?: boolean;
}

// Main hook function
export const useReport = (options: UseReportOptions = {}) => {
  const queryClient = useQueryClient();

  // Query for fetching all reports
  const {
    data: reports,
    isPending: isReportsLoading,
    error: reportsError,
    refetch: refetchReports,
  } = useQuery({
    queryKey: ["reports"],
    queryFn: reportApi.getAllReports,
    enabled: options.initialFetch !== false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
  });

  // Query for fetching available report fields
  const {
    data: reportFields,
    isPending: isFieldsLoading,
    error: fieldsError,
    refetch: refetchFields,
  } = useQuery({
    queryKey: ["reportFields"],
    queryFn: reportApi.getReportFields,
    enabled: false, // Only fetch when explicitly requested
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
  });

  // Mutation for creating a report
  const createMutation = useMutation({
    mutationFn: reportApi.createReport,
    onSuccess: (newReport) => {
      queryClient.setQueryData(["reports"], (oldData: IReport[] | undefined) =>
        oldData ? [...oldData, newReport] : [newReport]
      );
      queryClient.invalidateQueries({ queryKey: ["reports"] });
    },
  });

  // Mutation for updating a report
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<IReport> }) =>
      reportApi.updateReport({ id, data }),
    onSuccess: (updatedReport) => {
      // Update specific report in cache
      queryClient.setQueryData(["reports", updatedReport.id], updatedReport);

      // Update report in the list
      queryClient.setQueryData(
        ["reports"],
        (oldData: IReport[] | undefined) => {
          if (!oldData) return [updatedReport];
          return oldData.map((report) =>
            report.id === updatedReport.id ? updatedReport : report
          );
        }
      );

      queryClient.invalidateQueries({ queryKey: ["reports"] });
    },
  });

  // Mutation for deleting a report
  const deleteMutation = useMutation({
    mutationFn: reportApi.deleteReport,
    onSuccess: (_, deletedId) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: ["reports", deletedId] });

      // Update reports list
      queryClient.setQueryData(
        ["reports"],
        (oldData: IReport[] | undefined) => {
          if (!oldData) return [];
          return oldData.filter((report) => report.id !== deletedId);
        }
      );

      queryClient.invalidateQueries({ queryKey: ["reports"] });
    },
  });

  // Get report by ID with caching
  const getReport = async (id: string) => {
    // Check cache first
    const cachedReport = queryClient.getQueryData<IReport>(["reports", id]);
    if (cachedReport) return cachedReport;

    // If not in cache, fetch it
    try {
      const report = await reportApi.getReportById(id);
      queryClient.setQueryData(["reports", id], report);
      return report;
    } catch (error) {
      console.error("Error fetching report:", error);
      throw error;
    }
  };

  // Generate report
  const generateReport = async (id: string) => {
    try {
      return await reportApi.generateReport(id);
    } catch (error) {
      console.error("Error generating report:", error);
      throw error;
    }
  };

  // Generate custom report
  const generateCustomReport = async (reportConfig: {
    type?: string;
    filters?: any[];
    charts?: any[];
    includeFields?: string[];
  }) => {
    try {
      return await reportApi.generateCustomReport(reportConfig);
    } catch (error) {
      console.error("Error generating custom report:", error);
      throw error;
    }
  };

  // AI report functions
  const generatePatientAIReport = async (patientId: string) => {
    try {
      return await reportApi.generatePatientAIReport(patientId);
    } catch (error) {
      console.error("Error generating AI patient report:", error);
      throw error;
    }
  };

  const generateGroupAnalysis = async (
    patientIds: string[],
    options?: IAIGroupAnalysisOptions
  ) => {
    try {
      return await reportApi.generateGroupAnalysis(patientIds, options);
    } catch (error) {
      console.error("Error generating group analysis:", error);
      throw error;
    }
  };

  const generateTreatmentRecommendations = async (
    patientId: string,
    options?: IAITreatmentRecommendationsOptions
  ) => {
    try {
      return await reportApi.generateTreatmentRecommendations(
        patientId,
        options
      );
    } catch (error) {
      console.error("Error generating treatment recommendations:", error);
      throw error;
    }
  };

  const generateProgressAnalysis = async (
    patientId: string,
    options?: IAIProgressAnalysisOptions
  ) => {
    try {
      return await reportApi.generateProgressAnalysis(patientId, options);
    } catch (error) {
      console.error("Error generating progress analysis:", error);
      throw error;
    }
  };

  // Helper functions for report operations with try/catch wrapper
  const createReport = async (reportData: Partial<IReport>) => {
    try {
      const data = await createMutation.mutateAsync(reportData);
      return { success: true, data };
    } catch (error) {
      const errorMsg =
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : "Failed to create report";
      return { success: false, error: errorMsg };
    }
  };

  const updateReport = async (id: string, data: Partial<IReport>) => {
    try {
      const updatedData = await updateMutation.mutateAsync({ id, data });
      return { success: true, data: updatedData };
    } catch (error) {
      const errorMsg =
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : "Failed to update report";
      return { success: false, error: errorMsg };
    }
  };

  const deleteReport = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id);
      return { success: true };
    } catch (error) {
      const errorMsg =
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : "Failed to delete report";
      return { success: false, error: errorMsg };
    }
  };

  return {
    // Data
    reports,
    reportFields,

    // Loading states
    isReportsLoading,
    isFieldsLoading,

    // Errors
    reportsError,
    fieldsError,

    // Refetch functions
    refetchReports,
    refetchFields,

    // API operations
    createReport,
    updateReport,
    deleteReport,
    getReport,
    generateReport,
    generateCustomReport,

    // AI report functions
    generatePatientAIReport,
    generateGroupAnalysis,
    generateTreatmentRecommendations,
    generateProgressAnalysis,

    // Mutation states
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};
