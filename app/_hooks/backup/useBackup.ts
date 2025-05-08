import { backupApi, Backup } from "@/app/_hooks/backup/backupApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";

export interface BackupState {
  backups: Backup[];
  isLoading: boolean;
  error: string | null;
  hasAccess: boolean;
}

export const useBackup = () => {
  const queryClient = useQueryClient();
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);

  // Check if user has access to backups (is super_admin)
  const { data: accessResult, isSuccess: accessCheckComplete } = useQuery({
    queryKey: ["backupAccess"],
    queryFn: async () => {
      try {
        const hasAccess = await backupApi.checkBackupAccess();
        return hasAccess;
      } catch (error) {
        console.error("Error checking backup access:", error);
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

  // Query for backups list
  const {
    data: backups,
    isPending,
    error,
    failureReason,
    refetch: refetchBackups,
  } = useQuery({
    queryKey: ["backups"],
    queryFn: backupApi.getBackups,
    staleTime: 1 * 60 * 1000, // 1 minute
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true,
    enabled: !!hasAccess, // Only fetch if user has access
  });

  // Create backup mutation
  const createBackupMutation = useMutation({
    mutationFn: backupApi.createBackup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["backups"] });
      toast.success("Backup created successfully");
    },
    onError: (error) => {
      const message =
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : "Failed to create backup";
      toast.error(message);
    },
  });

  // Restore backup mutation
  const restoreBackupMutation = useMutation({
    mutationFn: backupApi.restoreBackup,
    onSuccess: () => {
      // Invalidate all queries as data may have changed after restore
      queryClient.invalidateQueries();
      toast.success("Backup restored successfully");
    },
    onError: (error) => {
      const message =
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : "Failed to restore backup";
      toast.error(message);
    },
  });

  // Delete backup mutation
  const deleteBackupMutation = useMutation({
    mutationFn: backupApi.deleteBackup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["backups"] });
      toast.success("Backup deleted successfully");
    },
    onError: (error) => {
      const message =
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : "Failed to delete backup";
      toast.error(message);
    },
  });

  // Create backup function
  const createBackup = async (name?: string) => {
    try {
      if (!hasAccess) {
        return {
          success: false,
          error: "Only super admin can create backups",
        };
      }

      const data = await createBackupMutation.mutateAsync(name);
      return { success: true, data };
    } catch (error) {
      const errorMsg =
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : "Failed to create backup";

      return { success: false, error: errorMsg };
    }
  };

  // Restore backup function
  const restoreBackup = async (backupName: string) => {
    try {
      if (!hasAccess) {
        return {
          success: false,
          error: "Only super admin can restore backups",
        };
      }

      if (!backupName) {
        return {
          success: false,
          error: "Backup name is required",
        };
      }

      await restoreBackupMutation.mutateAsync(backupName);
      return { success: true };
    } catch (error) {
      const errorMsg =
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : "Failed to restore backup";

      return { success: false, error: errorMsg };
    }
  };

  // Delete backup function
  const deleteBackup = async (backupName: string) => {
    try {
      if (!hasAccess) {
        return {
          success: false,
          error: "Only super admin can delete backups",
        };
      }

      if (!backupName) {
        return {
          success: false,
          error: "Backup name is required",
        };
      }

      await deleteBackupMutation.mutateAsync(backupName);
      return { success: true };
    } catch (error) {
      const errorMsg =
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : "Failed to delete backup";

      return { success: false, error: errorMsg };
    }
  };

  // Download backup function
  const downloadBackup = (backupName: string) => {
    try {
      if (!hasAccess) {
        toast.error("Only super admin can download backups");
        return {
          success: false,
          error: "Only super admin can download backups",
        };
      }

      if (!backupName) {
        toast.error("Backup name is required");
        return { success: false, error: "Backup name is required" };
      }

      backupApi.downloadBackup(backupName);
      return { success: true };
    } catch (error) {
      const errorMsg = "Failed to download backup";
      toast.error(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  // Extract error message from failureReason
  const errorMessage = failureReason
    ? failureReason instanceof Error
      ? failureReason.message
      : "An error occurred"
    : null;

  return {
    backups: backups || [],
    isLoading: isPending,
    error: errorMessage,
    hasAccess: !!hasAccess,
    createBackup,
    restoreBackup,
    deleteBackup,
    downloadBackup,
    refetchBackups,
    // Export mutation states for UI feedback
    isCreating: createBackupMutation.isPending,
    isRestoring: restoreBackupMutation.isPending,
    isDeleting: deleteBackupMutation.isPending,
  };
};
