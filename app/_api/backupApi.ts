import axios from "axios";

interface Backup {
  name: string;
  date: string;
  metadata: {
    description: string;
    timestamp: string;
  };
}

interface CreateBackupResponse {
  path: string;
  name: string;
  date: string;
}

const backupUrl = process.env.NEXT_PUBLIC_BACK_URL + "/api/backups";

export const backupApi = {
  // Get all backups
  getBackups: async (): Promise<Backup[]> => {
    const res = await axios.get(`${backupUrl}`, { withCredentials: true });
    if (res.data.success) {
      return res.data.data;
    }
    throw new Error(res.data.message || "Failed to fetch backups");
  },

  // Create a new backup
  createBackup: async (name?: string): Promise<CreateBackupResponse> => {
    const res = await axios.post(
      `${backupUrl}`,
      { name },
      { withCredentials: true }
    );

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
      { withCredentials: true }
    );

    if (!res.data.success) {
      throw new Error(res.data.message || "Failed to restore backup");
    }
  },

  // Delete a backup
  deleteBackup: async (backupName: string): Promise<void> => {
    const res = await axios.delete(`${backupUrl}/${backupName}`, {
      withCredentials: true,
    });

    if (!res.data.success) {
      throw new Error(res.data.message || "Failed to delete backup");
    }
  },
};
