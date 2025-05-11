import axios from "axios";
import { createAuthConfig } from "../utils/authUtils";

export interface Backup {
  name: string;
  date: string;
  metadata: {
    description: string;
    timestamp: string;
  };
}

export interface CreateBackupResponse {
  path: string;
  name: string;
  date: string;
}

const backupUrl = process.env.NEXT_PUBLIC_BACK_URL + "/api/backups";

export const backupApi = {
  // Get all backups
  getBackups: async (): Promise<Backup[]> => {
    const res = await axios.get(`${backupUrl}`, createAuthConfig());
    if (res.data.success) {
      return res.data.data;
    }
    throw new Error(res.data.message || "Failed to fetch backups");
  },

  // Create a new backup
  createBackup: async (name?: string): Promise<CreateBackupResponse> => {
    const res = await axios.post(`${backupUrl}`, { name }, createAuthConfig());

    if (res.data.success) {
      return res.data.data;
    }
    throw new Error(res.data.message || "Failed to create backup");
  },

  // Restore from a backup
  restoreBackup: async (backupName: string): Promise<void> => {
    const res = await axios.post(
      `${backupUrl}/${backupName}/restore`,
      {},
      createAuthConfig()
    );

    if (!res.data.success) {
      throw new Error(res.data.message || "Failed to restore backup");
    }
  },

  // Delete a backup
  deleteBackup: async (backupName: string): Promise<void> => {
    const res = await axios.delete(
      `${backupUrl}/${backupName}`,
      createAuthConfig()
    );

    if (!res.data.success) {
      throw new Error(res.data.message || "Failed to delete backup");
    }
  },

  // Download a backup
  downloadBackup: async (backupName: string): Promise<void> => {
    // For download, we need to add the token to the URL as a query parameter
    const token = localStorage.getItem("authToken");
    const url = token
      ? `${backupUrl}/${backupName}/download?token=${token}`
      : `${backupUrl}/${backupName}/download`;

    window.open(url, "_blank");
  },

  // Check if user has access to backups (is super_admin)
  checkBackupAccess: async (): Promise<boolean> => {
    try {
      await axios.get(`${backupUrl}`, createAuthConfig());
      return true;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 403) {
        return false;
      }
      throw error;
    }
  },
};
