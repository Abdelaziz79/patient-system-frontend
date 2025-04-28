"use client";

import { useBackup } from "@/app/_hooks/useBackup";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Database, Download, Loader2, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

// Simple Spinner component
type SpinnerSize = "sm" | "md" | "lg";

interface SpinnerProps {
  size?: SpinnerSize;
  className?: string;
}

const Spinner = ({ size = "md", className = "" }: SpinnerProps) => {
  const sizeMap: Record<SpinnerSize, string> = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  };

  return <Loader2 className={`animate-spin ${sizeMap[size]} ${className}`} />;
};

const BackupsPage = () => {
  const [backupName, setBackupName] = useState("");
  const [selectedBackup, setSelectedBackup] = useState<string | null>(null);
  const [restoreDialogOpen, setRestoreDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const {
    backups,
    isLoading,
    error,
    createBackup,
    restoreBackup,
    deleteBackup,
    isCreating,
    isRestoring,
    isDeleting,
  } = useBackup();

  // Sort backups by date (newest first)
  const sortedBackups = [...backups].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  // Handle backup creation
  const handleCreateBackup = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await createBackup(backupName.trim() || undefined);

    if (result.success) {
      toast.success(`Backup "${result.data?.name}" created successfully.`);
      setBackupName("");
    } else {
      toast.error(result.error || "Failed to create backup");
    }
  };

  // Handle backup restore
  const handleRestoreBackup = async () => {
    if (!selectedBackup) return;

    const result = await restoreBackup(selectedBackup);
    setRestoreDialogOpen(false);

    if (result.success) {
      toast.success(`System restored from backup "${selectedBackup}".`);
    } else {
      toast.error(result.error || "Failed to restore backup");
    }
  };

  // Handle backup deletion
  const handleDeleteBackup = async () => {
    if (!selectedBackup) return;

    const result = await deleteBackup(selectedBackup);
    setDeleteDialogOpen(false);

    if (result.success) {
      toast.success(`Backup "${selectedBackup}" deleted successfully.`);
    } else {
      toast.error(result.error || "Failed to delete backup");
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  if (error) {
    return (
      <div className="p-6">
        <Card className="border-red-200 dark:border-red-900">
          <CardHeader>
            <CardTitle className="text-red-600 dark:text-red-400">
              Error
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-6 max-w-5xl">
      <h1 className="text-3xl font-bold mb-6">System Backups</h1>

      {/* Create Backup Form */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Create New Backup</CardTitle>
          <CardDescription>
            Create a new backup of the entire database
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateBackup} className="flex gap-4">
            <Input
              placeholder="Backup name (optional)"
              value={backupName}
              onChange={(e) => setBackupName(e.target.value)}
              className="max-w-md"
            />
            <Button type="submit" disabled={isCreating}>
              {isCreating ? (
                <Spinner size="sm" className="mr-2" />
              ) : (
                <Plus className="h-4 w-4 mr-2" />
              )}
              Create Backup
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Backups List */}
      <Card>
        <CardHeader>
          <CardTitle>Available Backups</CardTitle>
          <CardDescription>Manage your system backups</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Spinner size="lg" />
            </div>
          ) : sortedBackups.length === 0 ? (
            <p className="text-center py-8 text-gray-500 dark:text-gray-400">
              No backups available
            </p>
          ) : (
            <div className="space-y-4">
              {sortedBackups.map((backup) => (
                <div
                  key={backup.name}
                  className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Database className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <div>
                      <h3 className="font-medium">{backup.name}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(backup.date)}
                      </p>
                      {backup.metadata && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {backup.metadata.description}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {/* Restore Dialog */}
                    <Dialog
                      open={restoreDialogOpen && selectedBackup === backup.name}
                      onOpenChange={setRestoreDialogOpen}
                    >
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-blue-600 dark:text-blue-400"
                          onClick={() => setSelectedBackup(backup.name)}
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Restore
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Restore System</DialogTitle>
                          <DialogDescription>
                            Are you sure you want to restore the system from
                            this backup? This will overwrite the current
                            database with the backup data.
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                          <Button
                            variant="ghost"
                            onClick={() => setRestoreDialogOpen(false)}
                          >
                            Cancel
                          </Button>
                          <Button
                            variant="default"
                            onClick={handleRestoreBackup}
                            disabled={isRestoring}
                          >
                            {isRestoring ? (
                              <Spinner size="sm" className="mr-2" />
                            ) : null}
                            Restore System
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>

                    {/* Delete Dialog */}
                    <Dialog
                      open={deleteDialogOpen && selectedBackup === backup.name}
                      onOpenChange={setDeleteDialogOpen}
                    >
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 dark:text-red-400"
                          onClick={() => setSelectedBackup(backup.name)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Delete Backup</DialogTitle>
                          <DialogDescription>
                            Are you sure you want to delete this backup? This
                            action cannot be undone.
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                          <Button
                            variant="ghost"
                            onClick={() => setDeleteDialogOpen(false)}
                          >
                            Cancel
                          </Button>
                          <Button
                            variant="destructive"
                            onClick={handleDeleteBackup}
                            disabled={isDeleting}
                          >
                            {isDeleting ? (
                              <Spinner size="sm" className="mr-2" />
                            ) : null}
                            Delete Backup
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BackupsPage;
