import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import {
  IAIGroupAnalysisOptions,
  IAIProgressAnalysisOptions,
  IAITreatmentRecommendationsOptions,
  IEventReportConfig,
  IReport,
  reportApi,
} from "@/app/_hooks/report/reportApi";

// Hook options interface
export interface UseReportOptions {
  initialFetch?: boolean;
}

// Main hook function
export const useReport = (options: UseReportOptions = {}) => {
  const queryClient = useQueryClient();
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);

  // Check if user has access to reports
  const { data: accessResult, isSuccess: accessCheckComplete } = useQuery({
    queryKey: ["reportAccess"],
    queryFn: async () => {
      try {
        const hasAccess = await reportApi.checkReportAccess();
        return hasAccess;
      } catch (error) {
        console.error("Error checking report access:", error);
        return false;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  useEffect(() => {
    if (accessCheckComplete) {
      setHasAccess(accessResult);
    }
  }, [accessResult, accessCheckComplete]);

  // Query for fetching all reports
  const {
    data: reports,
    isPending: isReportsLoading,
    error: reportsError,
    refetch: refetchReports,
  } = useQuery({
    queryKey: ["reports"],
    queryFn: reportApi.getAllReports,
    enabled: options.initialFetch !== false && !!hasAccess,
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
      toast.success("Report created successfully");
    },
    onError: (error) => {
      const message =
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : "Failed to create report";
      toast.error(message);
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
      toast.success("Report updated successfully");
    },
    onError: (error) => {
      const message =
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : "Failed to update report";
      toast.error(message);
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
      toast.success("Report deleted successfully");
    },
    onError: (error) => {
      const message =
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : "Failed to delete report";
      toast.error(message);
    },
  });

  // Get report by ID with caching
  const getReport = async (id: string) => {
    if (!hasAccess) {
      return { success: false, error: "Access denied to reports" };
    }

    try {
      // Check cache first
      const cachedReport = queryClient.getQueryData<IReport>(["reports", id]);
      if (cachedReport) return { success: true, data: cachedReport };

      // If not in cache, fetch it
      const report = await reportApi.getReportById(id);
      queryClient.setQueryData(["reports", id], report);
      return { success: true, data: report };
    } catch (error) {
      const errorMsg =
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : "Failed to fetch report";
      return { success: false, error: errorMsg };
    }
  };

  // Generate report
  const generateReport = async (id: string) => {
    if (!hasAccess) {
      return { success: false, error: "Access denied to reports" };
    }

    if (!id) {
      return { success: false, error: "Report ID is required" };
    }

    try {
      const loadingToast = toast.loading("Generating report...");
      const data = await reportApi.generateReport(id);
      toast.dismiss(loadingToast);
      return { success: true, data };
    } catch (error) {
      const errorMsg =
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : "Failed to generate report";
      toast.error(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  // Generate custom report
  const generateCustomReport = async (reportConfig: {
    type?: "patient" | "visit" | "status" | "custom" | "event";
    filters?: any[];
    charts?: any[];
    includeFields?: string[];
  }) => {
    if (!hasAccess) {
      return { success: false, error: "Access denied to reports" };
    }

    try {
      const loadingToast = toast.loading("Generating custom report...");
      const data = await reportApi.generateCustomReport(reportConfig);
      toast.dismiss(loadingToast);
      return { success: true, data };
    } catch (error) {
      const errorMsg =
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : "Failed to generate custom report";
      toast.error(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  // Generate event report
  const generateEventReport = async (reportConfig: IEventReportConfig) => {
    if (!hasAccess) {
      return { success: false, error: "Access denied to reports" };
    }

    try {
      const loadingToast = toast.loading("Generating event report...");
      const data = await reportApi.generateEventReport(reportConfig);
      toast.dismiss(loadingToast);
      return { success: true, data };
    } catch (error) {
      const errorMsg =
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : "Failed to generate event report";
      toast.error(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  // AI report functions
  const generatePatientAIReport = async (patientId: string) => {
    if (!hasAccess) {
      return { success: false, error: "Access denied to reports" };
    }

    if (!patientId) {
      return { success: false, error: "Patient ID is required" };
    }

    try {
      const loadingToast = toast.loading("Generating AI patient report...");
      const data = await reportApi.generatePatientAIReport(patientId);
      toast.dismiss(loadingToast);
      return { success: true, data };
    } catch (error) {
      const errorMsg =
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : "Failed to generate AI patient report";
      toast.error(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  const generateGroupAnalysis = async (
    patientIds: string[],
    options?: IAIGroupAnalysisOptions
  ) => {
    if (!hasAccess) {
      return { success: false, error: "Access denied to reports" };
    }

    if (!patientIds || patientIds.length < 2) {
      return {
        success: false,
        error: "At least two patient IDs are required for group analysis",
      };
    }

    try {
      const loadingToast = toast.loading("Generating group analysis...");
      const data = await reportApi.generateGroupAnalysis(patientIds, options);
      toast.dismiss(loadingToast);
      return { success: true, data };
    } catch (error) {
      const errorMsg =
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : "Failed to generate group analysis";
      toast.error(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  const generateTreatmentRecommendations = async (
    patientId: string,
    options?: IAITreatmentRecommendationsOptions
  ) => {
    if (!hasAccess) {
      return { success: false, error: "Access denied to reports" };
    }

    if (!patientId) {
      return { success: false, error: "Patient ID is required" };
    }

    try {
      const loadingToast = toast.loading(
        "Generating treatment recommendations..."
      );
      const data = await reportApi.generateTreatmentRecommendations(
        patientId,
        options
      );
      toast.dismiss(loadingToast);
      return { success: true, data };
    } catch (error) {
      const errorMsg =
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : "Failed to generate treatment recommendations";
      toast.error(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  const generateProgressAnalysis = async (
    patientId: string,
    options?: IAIProgressAnalysisOptions
  ) => {
    if (!hasAccess) {
      return { success: false, error: "Access denied to reports" };
    }

    if (!patientId) {
      return { success: false, error: "Patient ID is required" };
    }

    try {
      const loadingToast = toast.loading("Generating progress analysis...");
      const data = await reportApi.generateProgressAnalysis(patientId, options);
      toast.dismiss(loadingToast);
      return { success: true, data };
    } catch (error) {
      const errorMsg =
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : "Failed to generate progress analysis";
      toast.error(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  // Helper functions for report operations with try/catch wrapper
  const createReport = async (reportData: Partial<IReport>) => {
    if (!hasAccess) {
      return { success: false, error: "Access denied to reports" };
    }

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
    if (!hasAccess) {
      return { success: false, error: "Access denied to reports" };
    }

    if (!id) {
      return { success: false, error: "Report ID is required" };
    }

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
    if (!hasAccess) {
      return { success: false, error: "Access denied to reports" };
    }

    if (!id) {
      return { success: false, error: "Report ID is required" };
    }

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
    hasAccess: !!hasAccess,

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
    generateEventReport,

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
