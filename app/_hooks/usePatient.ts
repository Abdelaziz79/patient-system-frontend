import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { IPatient, IStatus, IVisit, IVisitInput } from "@/app/_types/Patient"; // Adjust import path as needed
import { patientApi } from "../_api/patientApi";

// Hook interface
export interface UsePatientsOptions {
  initialFetch?: boolean;
  initialPage?: number;
  initialLimit?: number;
  initialStatus?: string;
  initialIsActive?: boolean;
  initialTemplateId?: string;
  initialSortBy?: string;
  initialSortDir?: "asc" | "desc";
}

// Main hook function
export const usePatient = (options: UsePatientsOptions = {}) => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [page, setPage] = useState<number>(options.initialPage || 1);
  const [limit, setLimit] = useState<number>(options.initialLimit || 10);
  const [status, setStatus] = useState<string | undefined>(
    options.initialStatus
  );
  const [isActive, setIsActive] = useState<boolean | undefined>(
    options.initialIsActive
  );
  const [templateId, setTemplateId] = useState<string | undefined>(
    options.initialTemplateId
  );
  const [sortBy, setSortBy] = useState<string | undefined>(
    options.initialSortBy
  );
  const [sortDir, setSortDir] = useState<"asc" | "desc" | undefined>(
    options.initialSortDir
  );

  const {
    data: patientsData,
    isPending,
    error,
    failureReason,
    refetch,
  } = useQuery({
    queryKey: [
      "patients",
      page,
      limit,
      status,
      isActive,
      templateId,
      sortBy,
      sortDir,
    ],
    queryFn: () =>
      patientApi.getPatients({
        page,
        limit,
        status,
        isActive,
        templateId,
        sortBy,
        sortDir,
      }),
    enabled: options.initialFetch !== false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
  });

  // Stats query
  const {
    data: stats,
    isPending: isStatsLoading,
    refetch: refetchStats,
  } = useQuery({
    queryKey: ["patientStats"],
    queryFn: patientApi.getPatientStats,
    enabled: false, // Only fetch when explicitly requested
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  // Create patient mutation
  const createMutation = useMutation({
    mutationFn: patientApi.createPatient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
      queryClient.invalidateQueries({ queryKey: ["patientStats"] });
    },
  });

  // Update patient mutation
  const updateMutation = useMutation({
    mutationFn: patientApi.updatePatient,
    onSuccess: (updatedPatient) => {
      queryClient.setQueryData(["patient", updatedPatient.id], updatedPatient);
      queryClient.invalidateQueries({ queryKey: ["patients"] });
    },
  });

  // Delete patient mutation
  const deleteMutation = useMutation({
    mutationFn: patientApi.deletePatient,
    onSuccess: (_, deletedId) => {
      queryClient.removeQueries({ queryKey: ["patient", deletedId] });
      queryClient.invalidateQueries({ queryKey: ["patients"] });
      queryClient.invalidateQueries({ queryKey: ["patientStats"] });
    },
  });

  // Update status mutation
  const updateStatusMutation = useMutation({
    mutationFn: patientApi.updatePatientStatus,
    onSuccess: (updatedPatient) => {
      queryClient.setQueryData(["patient", updatedPatient.id], updatedPatient);
      queryClient.invalidateQueries({ queryKey: ["patients"] });
      queryClient.invalidateQueries({ queryKey: ["patientStats"] });
    },
  });

  // Batch update status mutation
  const batchUpdateStatusMutation = useMutation({
    mutationFn: patientApi.batchUpdatePatientStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
      queryClient.invalidateQueries({ queryKey: ["patientStats"] });
    },
  });

  // Add visit mutation
  const addVisitMutation = useMutation({
    mutationFn: patientApi.addVisit,
    onSuccess: (updatedPatient) => {
      queryClient.setQueryData(["patient", updatedPatient.id], updatedPatient);
      queryClient.invalidateQueries({
        queryKey: ["patientVisits", updatedPatient.id],
      });
    },
  });

  // Update visit mutation
  const updateVisitMutation = useMutation({
    mutationFn: patientApi.updateVisit,
    onSuccess: (updatedVisit, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["patientVisits", variables.patientId],
      });
      queryClient.invalidateQueries({
        queryKey: ["patient", variables.patientId],
      });
    },
  });

  // Delete visit mutation
  const deleteVisitMutation = useMutation({
    mutationFn: patientApi.deleteVisit,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["patientVisits", variables.patientId],
      });
      queryClient.invalidateQueries({
        queryKey: ["patient", variables.patientId],
      });
    },
  });

  // Restore visit mutation
  const restoreVisitMutation = useMutation({
    mutationFn: patientApi.restoreVisit,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["patientVisits", variables.patientId],
      });
      queryClient.invalidateQueries({
        queryKey: ["patient", variables.patientId],
      });
    },
  });

  // Update patient activation mutation
  const updateActivationMutation = useMutation({
    mutationFn: patientApi.updatePatientActivation,
    onSuccess: (updatedPatient) => {
      queryClient.setQueryData(["patient", updatedPatient.id], updatedPatient);
      queryClient.invalidateQueries({ queryKey: ["patients"] });
      queryClient.invalidateQueries({ queryKey: ["patientStats"] });
    },
  });

  // Add tag mutation
  const addTagMutation = useMutation({
    mutationFn: patientApi.addPatientTag,
    onSuccess: (updatedPatient) => {
      queryClient.setQueryData(["patient", updatedPatient.id], updatedPatient);
      queryClient.invalidateQueries({ queryKey: ["patients"] });
    },
  });

  // Remove tag mutation
  const removeTagMutation = useMutation({
    mutationFn: patientApi.removePatientTag,
    onSuccess: (updatedPatient) => {
      queryClient.setQueryData(["patient", updatedPatient.id], updatedPatient);
      queryClient.invalidateQueries({ queryKey: ["patients"] });
    },
  });

  // Export patient to PDF mutation
  const exportToPdfMutation = useMutation({
    mutationFn: patientApi.exportPatientToPdf,
  });

  // Export patient to CSV mutation
  const exportToCsvMutation = useMutation({
    mutationFn: patientApi.exportPatientToCsv,
  });

  // Generate medical report mutation
  const generateReportMutation = useMutation({
    mutationFn: (params: { id: string; options?: any }) =>
      patientApi.generateMedicalReport(params.id, params.options),
  });

  // Share patient via email mutation
  const shareViaEmailMutation = useMutation({
    mutationFn: (params: { id: string; emailData: any }) =>
      patientApi.sharePatientViaEmail(params.id, params.emailData),
  });

  // Search patients query
  const performSearch = async (searchParams: {
    query?: string;
    status?: string;
    isActive?: boolean;
    templateId?: string;
    tag?: string;
  }) => {
    try {
      return await patientApi.searchPatients(searchParams);
    } catch (error) {
      const errorMsg =
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : "Failed to search patients";
      return { success: false, error: errorMsg, data: [] };
    }
  };

  // Get patient by ID with caching
  const getPatient = async (id: string) => {
    // Check cache first
    const cachedPatient = queryClient.getQueryData<IPatient>(["patient", id]);
    if (cachedPatient) return cachedPatient;

    // If not in cache, fetch it
    try {
      const patient = await patientApi.getPatientById(id);
      queryClient.setQueryData(["patient", id], patient);
      return patient;
    } catch (error) {
      console.error("Error fetching patient:", error);
      throw error;
    }
  };

  // Get patient visits
  const getPatientVisits = async (patientId: string) => {
    try {
      const visits = await patientApi.getVisits(patientId);
      queryClient.setQueryData(["patientVisits", patientId], visits);
      return visits;
    } catch (error) {
      console.error("Error fetching visits:", error);
      throw error;
    }
  };

  // Get patient history
  const getHistory = async (patientId: string) => {
    try {
      const history = await patientApi.getPatientHistory(patientId);
      queryClient.setQueryData(["patientHistory", patientId], history);
      return history;
    } catch (error) {
      console.error("Error fetching history:", error);
      throw error;
    }
  };

  // Search visits
  const searchVisits = async (patientId: string, query: string) => {
    try {
      return await patientApi.searchVisits({ patientId, query });
    } catch (error) {
      console.error("Error searching visits:", error);
      throw error;
    }
  };

  // Helper functions with try/catch wrapper
  const createPatient = async (patientData: Partial<IPatient>) => {
    try {
      const data = await createMutation.mutateAsync(patientData);
      return { success: true, data };
    } catch (error) {
      const errorMsg =
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : "Failed to create patient";
      return { success: false, error: errorMsg };
    }
  };

  const updatePatient = async (id: string, data: Partial<IPatient>) => {
    try {
      const updatedData = await updateMutation.mutateAsync({ id, data });
      return { success: true, data: updatedData };
    } catch (error) {
      const errorMsg =
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : "Failed to update patient";
      return { success: false, error: errorMsg };
    }
  };

  const deletePatient = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id);
      return { success: true };
    } catch (error) {
      const errorMsg =
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : "Failed to delete patient";
      return { success: false, error: errorMsg };
    }
  };

  const updatePatientStatus = async (
    id: string,
    statusData: Partial<IStatus>
  ) => {
    try {
      const updatedData = await updateStatusMutation.mutateAsync({
        id,
        statusData,
      });
      return { success: true, data: updatedData };
    } catch (error) {
      const errorMsg =
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : "Failed to update patient status";
      return { success: false, error: errorMsg };
    }
  };

  const batchUpdateStatus = async (
    patientIds: string[],
    status: Partial<IStatus>
  ) => {
    try {
      const result = await batchUpdateStatusMutation.mutateAsync({
        patientIds,
        status,
      });
      return { success: true, data: result };
    } catch (error) {
      const errorMsg =
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : "Failed to update patient statuses";
      return { success: false, error: errorMsg };
    }
  };

  const addVisit = async (patientId: string, visitData: IVisitInput) => {
    try {
      const updatedPatient = await addVisitMutation.mutateAsync({
        patientId,
        visitData,
      });
      return { success: true, data: updatedPatient };
    } catch (error) {
      const errorMsg =
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : "Failed to add visit";
      return { success: false, error: errorMsg };
    }
  };

  const updateVisit = async (
    patientId: string,
    visitId: string,
    visitData: Partial<IVisit>
  ) => {
    try {
      const updatedVisit = await updateVisitMutation.mutateAsync({
        patientId,
        visitId,
        visitData,
      });
      return { success: true, data: updatedVisit };
    } catch (error) {
      const errorMsg =
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : "Failed to update visit";
      return { success: false, error: errorMsg };
    }
  };

  const deleteVisit = async (patientId: string, visitId: string) => {
    try {
      await deleteVisitMutation.mutateAsync({ patientId, visitId });
      return { success: true };
    } catch (error) {
      const errorMsg =
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : "Failed to delete visit";
      return { success: false, error: errorMsg };
    }
  };

  const restoreVisit = async (patientId: string, visitId: string) => {
    try {
      const result = await restoreVisitMutation.mutateAsync({
        patientId,
        visitId,
      });
      return { success: true, data: result };
    } catch (error) {
      const errorMsg =
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : "Failed to restore visit";
      return { success: false, error: errorMsg };
    }
  };

  const updateActivation = async (id: string, isActive: boolean) => {
    try {
      const updatedPatient = await updateActivationMutation.mutateAsync({
        id,
        isActive,
      });
      return { success: true, data: updatedPatient };
    } catch (error) {
      const errorMsg =
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : "Failed to update activation status";
      return { success: false, error: errorMsg };
    }
  };

  const addTag = async (id: string, tag: string) => {
    try {
      const updatedPatient = await addTagMutation.mutateAsync({ id, tag });
      return { success: true, data: updatedPatient };
    } catch (error) {
      const errorMsg =
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : "Failed to add tag";
      return { success: false, error: errorMsg };
    }
  };

  const removeTag = async (id: string, tag: string) => {
    try {
      const updatedPatient = await removeTagMutation.mutateAsync({ id, tag });
      return { success: true, data: updatedPatient };
    } catch (error) {
      const errorMsg =
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : "Failed to remove tag";
      return { success: false, error: errorMsg };
    }
  };

  // Export patient data to PDF - with blob handling
  const exportPatientToPdf = async (id: string) => {
    try {
      const blobData = await exportToPdfMutation.mutateAsync(id);
      // Create a URL for the blob
      const url = window.URL.createObjectURL(new Blob([blobData]));
      // Create a link and trigger download
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `patient_${id}_report.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      return { success: true };
    } catch (error) {
      console.error("Error exporting to PDF:", error);
      return {
        success: false,
        error: "Failed to export patient data to PDF",
      };
    }
  };

  // Export patient data to CSV - with blob handling
  const exportPatientToCsv = async (id: string) => {
    try {
      const blobData = await exportToCsvMutation.mutateAsync(id);
      const url = window.URL.createObjectURL(new Blob([blobData]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `patient_${id}_data.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      return { success: true };
    } catch (error) {
      console.error("Error exporting to CSV:", error);
      return {
        success: false,
        error: "Failed to export patient data to CSV",
      };
    }
  };

  // Generate a medical report
  const generateMedicalReport = async (
    id: string,
    options?: {
      includeVisits?: boolean;
      includeHistory?: boolean;
      customTitle?: string;
    }
  ) => {
    try {
      const blobData = await generateReportMutation.mutateAsync({
        id,
        options,
      });
      const url = window.URL.createObjectURL(new Blob([blobData]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `patient_${id}_medical_report.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      return { success: true };
    } catch (error) {
      console.error("Error generating medical report:", error);
      return {
        success: false,
        error: "Failed to generate medical report",
      };
    }
  };

  // Share patient data via email
  const sharePatientViaEmail = async (
    id: string,
    emailData: {
      recipientEmail: string;
      message?: string;
      includeAttachment?: boolean;
    }
  ) => {
    try {
      await shareViaEmailMutation.mutateAsync({ id, emailData });
      return { success: true };
    } catch (error) {
      const errorMsg =
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : "Failed to share patient data";
      return { success: false, error: errorMsg };
    }
  };

  // Print patient details
  const printPatientDetails = (patientData: IPatient) => {
    try {
      // Create a new window for printing
      const printWindow = window.open("", "_blank");
      if (!printWindow) {
        throw new Error(
          "Unable to open print window. Please check your popup settings."
        );
      }

      // Generate HTML content for printing
      const printContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Patient Information: ${
            patientData.sectionData?.personalinfo?.full_name || "Unknown"
          }</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { color: #0f766e; border-bottom: 1px solid #ddd; padding-bottom: 10px; }
            h2 { color: #0f766e; margin-top: 20px; }
            .section { margin-bottom: 25px; }
            .field { margin-bottom: 10px; display: flex; }
            .field-label { font-weight: bold; width: 200px; }
            .status { padding: 5px 10px; border-radius: 4px; display: inline-block; margin-top: 5px; }
            .visit { margin-bottom: 15px; padding: 10px; border: 1px solid #ddd; border-radius: 4px; }
            .visit-header { display: flex; justify-content: space-between; margin-bottom: 10px; }
            .tag { display: inline-block; background-color: #e5e7eb; padding: 3px 8px; margin-right: 5px; margin-bottom: 5px; border-radius: 4px; font-size: 0.85em; }
            @media print {
              body { font-size: 12px; }
              h1 { font-size: 18px; }
              h2 { font-size: 16px; }
            }
          </style>
        </head>
        <body>
          <h1>Patient Information: ${
            patientData.sectionData?.personalinfo?.full_name || "Unknown"
          }</h1>
          
          <div class="section">
            <h2>Basic Information</h2>
            <div class="field">
              <div class="field-label">ID:</div>
              <div>${patientData.id || "N/A"}</div>
            </div>
            <div class="field">
              <div class="field-label">Status:</div>
              <div>
                <span class="status" style="background-color: ${
                  patientData.status?.color || "#ccc"
                }; color: white;">
                  ${patientData.status?.label || "Unknown"}
                </span>
              </div>
            </div>
            <div class="field">
              <div class="field-label">Active:</div>
              <div>${patientData.isActive ? "Yes" : "No"}</div>
            </div>
            <div class="field">
              <div class="field-label">Template:</div>
              <div>${patientData.templateId?.name || "N/A"}</div>
            </div>
            <div class="field">
              <div class="field-label">Created By:</div>
              <div>${patientData.createdBy?.name || "N/A"}</div>
            </div>
            <div class="field">
              <div class="field-label">Created At:</div>
              <div>${new Date(patientData.createdAt).toLocaleString()}</div>
            </div>
            <div class="field">
              <div class="field-label">Updated At:</div>
              <div>${new Date(patientData.updatedAt).toLocaleString()}</div>
            </div>
          </div>
          
          ${Object.entries(patientData.sectionData || {})
            .map(
              ([sectionKey, sectionData]) => `
            <div class="section">
              <h2>${sectionKey
                .replace(/([A-Z])/g, " $1")
                .replace(/_/g, " ")
                .trim()}</h2>
              ${Object.entries(sectionData as Record<string, any>)
                .map(
                  ([fieldKey, fieldValue]) => `
                <div class="field">
                  <div class="field-label">${fieldKey
                    .replace(/([A-Z])/g, " $1")
                    .replace(/_/g, " ")
                    .trim()}:</div>
                  <div>${
                    typeof fieldValue === "boolean"
                      ? fieldValue
                        ? "Yes"
                        : "No"
                      : String(fieldValue || "N/A")
                  }</div>
                </div>
              `
                )
                .join("")}
            </div>
          `
            )
            .join("")}
          
          ${
            patientData.visits && patientData.visits.length > 0
              ? `
            <div class="section">
              <h2>Visits (${patientData.visits.length})</h2>
              ${patientData.visits
                .map(
                  (visit) => `
                <div class="visit">
                  <div class="visit-header">
                    <strong>${visit.title || "Visit"}</strong>
                    <span>${new Date(visit.date).toLocaleString()}</span>
                  </div>
                  ${
                    visit.notes
                      ? `<div><strong>Notes:</strong> ${visit.notes}</div>`
                      : ""
                  }
                </div>
              `
                )
                .join("")}
            </div>
          `
              : ""
          }
          
          ${
            patientData.tags && patientData.tags.length > 0
              ? `
            <div class="section">
              <h2>Tags</h2>
              <div>
                ${patientData.tags
                  .map((tag) => `<span class="tag">${tag}</span>`)
                  .join("")}
              </div>
            </div>
          `
              : ""
          }
          
          <div style="text-align: center; margin-top: 30px; font-size: 0.8em; color: #666;">
            Printed on ${new Date().toLocaleString()}
          </div>
        </body>
        </html>
      `;

      // Write to the window and print
      printWindow.document.write(printContent);
      printWindow.document.close();

      // Add event listener to close the window after printing
      printWindow.onafterprint = () => {
        printWindow.close();
      };

      // Print the window
      setTimeout(() => {
        printWindow.print();
      }, 500);

      return { success: true };
    } catch (error) {
      console.error("Error printing patient details:", error);
      return {
        success: false,
        error:
          typeof error === "object" && error !== null && "message" in error
            ? (error as Error).message
            : "Failed to print patient details",
      };
    }
  };

  // Extract error message from failureReason
  const errorMessage = failureReason
    ? failureReason instanceof Error
      ? failureReason.message
      : "An error occurred"
    : null;

  // Return value
  return {
    // Data
    patients: patientsData?.data || [],
    total: patientsData?.total || 0,
    pages: patientsData?.pages || 0,
    currentPage: patientsData?.currentPage || page,
    stats,

    // State
    isLoading: isPending,
    isStatsLoading,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isUpdatingStatus: updateStatusMutation.isPending,
    isBatchUpdating: batchUpdateStatusMutation.isPending,
    isAddingVisit: addVisitMutation.isPending,
    isUpdatingVisit: updateVisitMutation.isPending,
    isDeletingVisit: deleteVisitMutation.isPending,
    isRestoringVisit: restoreVisitMutation.isPending,
    isUpdatingActivation: updateActivationMutation.isPending,
    isAddingTag: addTagMutation.isPending,
    isRemovingTag: removeTagMutation.isPending,
    isExportingToPdf: exportToPdfMutation.isPending,
    isExportingToCsv: exportToCsvMutation.isPending,
    isGeneratingReport: generateReportMutation.isPending,
    isSharingViaEmail: shareViaEmailMutation.isPending,
    error: errorMessage,

    // Pagination and filtering controls
    searchTerm,
    setSearchTerm,
    page,
    setPage,
    limit,
    setLimit,
    status,
    setStatus,
    isActive,
    setIsActive,
    templateId,
    setTemplateId,
    sortBy,
    setSortBy,
    sortDir,
    setSortDir,

    // Actions
    refetch,
    refetchStats,
    getPatient,
    getPatientVisits,
    getHistory,
    performSearch,
    searchVisits,

    // CRUD operations
    createPatient,
    updatePatient,
    deletePatient,
    updatePatientStatus,
    batchUpdateStatus,
    addVisit,
    updateVisit,
    deleteVisit,
    restoreVisit,
    updateActivation,
    addTag,
    removeTag,

    // New export operations
    exportPatientToPdf,
    exportPatientToCsv,
    generateMedicalReport,
    sharePatientViaEmail,
    printPatientDetails,
  };
};
