import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  exportApi,
  ExportFormat,
  ExportPatientParams,
  ExportUserParams,
} from "./exportApi";
import { toast } from "react-hot-toast";

// Re-export the ExportFormat type for convenience
export type {
  ExportFormat,
  ExportPatientParams,
  ExportUserParams,
} from "./exportApi";

interface UseExportOptions {
  initialFetch?: boolean;
}

export const useExport = (options: UseExportOptions = {}) => {
  const [patientExportLoading, setPatientExportLoading] = useState(false);
  const [userExportLoading, setUserExportLoading] = useState(false);
  const [hasRegularAccess, setHasRegularAccess] = useState<boolean | null>(
    null
  );
  const [hasAdminAccess, setHasAdminAccess] = useState<boolean | null>(null);

  // Check if user has access to the export functionality
  const { data: regularAccessResult, isSuccess: regularAccessCheckComplete } =
    useQuery({
      queryKey: ["exportAccess"],
      queryFn: async () => {
        try {
          const hasAccess = await exportApi.checkExportAccess();
          return hasAccess;
        } catch (error) {
          console.error("Error checking export access:", error);
          return false;
        }
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
    });

  // Check if user has admin access for user exports
  const { data: adminAccessResult, isSuccess: adminAccessCheckComplete } =
    useQuery({
      queryKey: ["exportAdminAccess"],
      queryFn: async () => {
        try {
          const hasAccess = await exportApi.checkAdminExportAccess();
          return hasAccess;
        } catch (error) {
          console.error("Error checking admin export access:", error);
          return false;
        }
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
      enabled: !!hasRegularAccess, // Only check admin access if the user has regular access
    });

  useEffect(() => {
    if (regularAccessCheckComplete) {
      setHasRegularAccess(regularAccessResult);
    }
  }, [regularAccessResult, regularAccessCheckComplete]);

  useEffect(() => {
    if (adminAccessCheckComplete) {
      setHasAdminAccess(adminAccessResult);
    }
  }, [adminAccessResult, adminAccessCheckComplete]);

  /**
   * Helper function to trigger a file download from a blob
   */
  const downloadFile = (blob: Blob, filename: string) => {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  };

  /**
   * Get appropriate file extension based on format
   */
  const getFileExtension = (format: ExportFormat): string => {
    switch (format) {
      case "excel":
        return "xlsx";
      case "csv":
        return "csv";
      case "pdf":
        return "pdf";
      default:
        return "xlsx";
    }
  };

  /**
   * Export all patients data
   */
  const exportAllPatients = async (params?: ExportPatientParams) => {
    if (!hasRegularAccess) {
      toast.error("You don't have permission to export patient data");
      return { success: false, error: "Permission denied" };
    }

    try {
      setPatientExportLoading(true);
      const format = params?.format || "excel";
      const loadingToast = toast.loading(`Exporting patients as ${format}...`);

      const blob = await exportApi.exportAllPatients(params);

      const filename = `patients_export.${getFileExtension(format)}`;
      downloadFile(blob, filename);

      toast.dismiss(loadingToast);
      toast.success("Export successful");

      return { success: true };
    } catch (error) {
      console.error("Error exporting patients:", error);
      toast.error("Failed to export patients");
      return {
        success: false,
        error: "Failed to export patients. Please try again.",
      };
    } finally {
      setPatientExportLoading(false);
    }
  };

  /**
   * Export a single patient's data
   */
  const exportPatient = async (
    patientId: string,
    format: ExportFormat = "excel"
  ) => {
    if (!hasRegularAccess) {
      toast.error("You don't have permission to export patient data");
      return { success: false, error: "Permission denied" };
    }

    if (!patientId) {
      toast.error("Patient ID is required");
      return { success: false, error: "Patient ID is required" };
    }

    try {
      setPatientExportLoading(true);
      const loadingToast = toast.loading(`Exporting patient as ${format}...`);

      const blob = await exportApi.exportPatient(patientId, format);

      const filename = `patient_${patientId}.${getFileExtension(format)}`;
      downloadFile(blob, filename);

      toast.dismiss(loadingToast);
      toast.success("Export successful");

      return { success: true };
    } catch (error) {
      console.error("Error exporting patient:", error);
      toast.error("Failed to export patient");
      return {
        success: false,
        error: "Failed to export patient. Please try again.",
      };
    } finally {
      setPatientExportLoading(false);
    }
  };

  /**
   * Export a patient's data to PDF
   */
  const exportPatientToPDF = async (patientId: string) => {
    if (!hasRegularAccess) {
      toast.error("You don't have permission to export patient data");
      return { success: false, error: "Permission denied" };
    }

    if (!patientId) {
      toast.error("Patient ID is required");
      return { success: false, error: "Patient ID is required" };
    }

    try {
      setPatientExportLoading(true);
      const loadingToast = toast.loading("Generating PDF report...");

      const blob = await exportApi.exportPatientToPDF(patientId);

      const filename = `patient_${patientId}.pdf`;
      downloadFile(blob, filename);

      toast.dismiss(loadingToast);
      toast.success("PDF generated successfully");

      return { success: true };
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate PDF report");
      return {
        success: false,
        error: "Failed to generate PDF report. Please try again.",
      };
    } finally {
      setPatientExportLoading(false);
    }
  };

  /**
   * Export all users data (admin only)
   */
  const exportUsers = async (params?: ExportUserParams) => {
    if (!hasAdminAccess) {
      toast.error("You don't have admin permission to export user data");
      return { success: false, error: "Permission denied" };
    }

    try {
      setUserExportLoading(true);
      const format = params?.format || "excel";
      const loadingToast = toast.loading(`Exporting users as ${format}...`);

      const blob = await exportApi.exportUsers(params);

      const filename = `users_export.${getFileExtension(format)}`;
      downloadFile(blob, filename);

      toast.dismiss(loadingToast);
      toast.success("Export successful");

      return { success: true };
    } catch (error) {
      console.error("Error exporting users:", error);
      toast.error("Failed to export users");
      return {
        success: false,
        error: "Failed to export users. Please try again.",
      };
    } finally {
      setUserExportLoading(false);
    }
  };

  /**
   * Export a single user's data (admin only)
   */
  const exportUser = async (userId: string, format: ExportFormat = "excel") => {
    if (!hasAdminAccess) {
      toast.error("You don't have admin permission to export user data");
      return { success: false, error: "Permission denied" };
    }

    if (!userId) {
      toast.error("User ID is required");
      return { success: false, error: "User ID is required" };
    }

    try {
      setUserExportLoading(true);
      const loadingToast = toast.loading(`Exporting user as ${format}...`);

      const blob = await exportApi.exportUser(userId, format);

      const filename = `user_${userId}.${getFileExtension(format)}`;
      downloadFile(blob, filename);

      toast.dismiss(loadingToast);
      toast.success("Export successful");

      return { success: true };
    } catch (error) {
      console.error("Error exporting user:", error);
      toast.error("Failed to export user");
      return {
        success: false,
        error: "Failed to export user. Please try again.",
      };
    } finally {
      setUserExportLoading(false);
    }
  };

  return {
    // Access states
    hasRegularAccess: !!hasRegularAccess,
    hasAdminAccess: !!hasAdminAccess,

    // Loading states
    patientExportLoading,
    userExportLoading,
    isLoading: patientExportLoading || userExportLoading,

    // Patient export functions
    exportAllPatients,
    exportPatient,
    exportPatientToPDF,

    // User export functions (admin only)
    exportUsers,
    exportUser,
  };
};
