import { backupApi } from "@/app/_api/backupApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export interface Backup {
  name: string;
  date: string;
  metadata: {
    description: string;
    timestamp: string;
  };
}

export interface BackupState {
  backups: Backup[];
  isLoading: boolean;
  error: string | null;
}

export const useBackup = () => {
  const queryClient = useQueryClient();

  // Query for backups list
  const {
    data: backups,
    isPending,
    error,
    failureReason,
  } = useQuery({
    queryKey: ["backups"],
    queryFn: backupApi.getBackups,
    staleTime: 1 * 60 * 1000, // 1 minute
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true,
  });

  // Create backup mutation
  const createBackupMutation = useMutation({
    mutationFn: backupApi.createBackup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["backups"] });
    },
  });

  // Restore backup mutation
  const restoreBackupMutation = useMutation({
    mutationFn: backupApi.restoreBackup,
    onSuccess: () => {
      // Invalidate all queries as data may have changed after restore
      queryClient.invalidateQueries();
    },
  });

  // Delete backup mutation
  const deleteBackupMutation = useMutation({
    mutationFn: backupApi.deleteBackup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["backups"] });
    },
  });

  // Create backup function
  const createBackup = async (name?: string) => {
    try {
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
    createBackup,
    restoreBackup,
    deleteBackup,
    // Export mutation states for UI feedback
    isCreating: createBackupMutation.isPending,
    isRestoring: restoreBackupMutation.isPending,
    isDeleting: deleteBackupMutation.isPending,
  };
};
