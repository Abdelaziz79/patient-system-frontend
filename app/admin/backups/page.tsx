"use client";

import { useLanguage } from "@/app/_contexts/LanguageContext";
import { useBackup } from "@/app/_hooks/backup/useBackup";
import { format, formatDistanceToNow } from "date-fns";
import { ar, enUS } from "date-fns/locale";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  Calendar,
  CheckCircle,
  Clock,
  Database,
  Download,
  FileText,
  Filter,
  Loader2,
  Plus,
  RefreshCw,
  Search,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";

import { useAuthContext } from "@/app/_providers/AuthProvider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

// Spinner component
const Spinner = ({
  size = "md",
  className = "",
}: {
  size?: "sm" | "md" | "lg";
  className?: string;
}) => {
  const sizeMap = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  };

  return <Loader2 className={`animate-spin ${sizeMap[size]} ${className}`} />;
};

// Access Denied component
const AccessDeniedCard = () => {
  const { t, isRTL } = useLanguage();
  const router = useRouter();

  return (
    <div
      className="flex items-center justify-center min-h-[calc(100vh-200px)]"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <Card className="w-[450px] border-red-200 dark:border-red-900 shadow-lg">
        <CardHeader className="space-y-1">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
            <CardTitle className="text-red-600 dark:text-red-400">
              {t("accessDenied")}
            </CardTitle>
          </div>
          <CardDescription className="text-base">
            {t("noPermissionBackupPage")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            variant="outline"
            className="mt-2 w-full"
            onClick={() => router.push("/")}
          >
            {t("backToDashboard")}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

const BackupsPage = () => {
  const { t, language, isRTL } = useLanguage();
  const { user, isAuthenticated } = useAuthContext();
  const router = useRouter();

  const [backupName, setBackupName] = useState("");
  const [backupDescription, setBackupDescription] = useState("");
  const [selectedBackup, setSelectedBackup] = useState<string | null>(null);
  const [restoreDialogOpen, setRestoreDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<
    "newest" | "oldest" | "alphabetical"
  >("newest");

  const {
    backups,
    isLoading,
    hasAccess,
    error,
    createBackup,
    restoreBackup,
    deleteBackup,
    refetchBackups,
    isCreating,
    isRestoring,
    isDeleting,
  } = useBackup();

  // Sort and filter backups
  const filteredAndSortedBackups = [...(backups || [])]
    .filter((backup) =>
      searchQuery
        ? backup.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (backup.metadata?.description || "")
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
        : true
    )
    .sort((a, b) => {
      if (sortOrder === "newest") {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      } else if (sortOrder === "oldest") {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      } else {
        return a.name.localeCompare(b.name);
      }
    });

  // Handle backup creation
  const handleCreateBackup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!backupName.trim()) {
      toast.error(t("backupNameRequired"));
      return;
    }

    const backupData = {
      name: backupName.trim(),
      description: backupDescription.trim(),
    };

    const result = await createBackup(backupData.name);

    if (result.success) {
      toast.success(t("backupCreatedSuccess"));
      setBackupName("");
      setBackupDescription("");
      setCreateDialogOpen(false);
    } else {
      toast.error(result.error || t("backupCreationFailed"));
    }
  };

  // Handle backup restore
  const handleRestoreBackup = async () => {
    if (!selectedBackup) return;

    const result = await restoreBackup(selectedBackup);
    setRestoreDialogOpen(false);

    if (result.success) {
      toast.success(t("backupRestoredSuccess"));
    } else {
      toast.error(result.error || t("backupRestoreFailed"));
    }
  };

  // Handle backup deletion
  const handleDeleteBackup = async () => {
    if (!selectedBackup) return;

    const result = await deleteBackup(selectedBackup);
    setDeleteDialogOpen(false);

    if (result.success) {
      toast.success(t("backupDeletedSuccess"));
    } else {
      toast.error(result.error || t("backupDeleteFailed"));
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const dateLocale = language === "ar" ? ar : enUS;

      return {
        formatted: format(date, "PPpp", { locale: dateLocale }),
        relative: formatDistanceToNow(date, {
          addSuffix: true,
          locale: dateLocale,
        }),
      };
    } catch (error) {
      return {
        formatted: dateString,
        relative: "",
      };
    }
  };

  // Simulate backup size for display (this would come from actual API in real implementation)
  const getBackupSize = (backup: any) => {
    // Using backup name length as a seed for random size between 10MB and 2GB
    const seed = backup.name.length;
    const size = (10 + ((seed * 137) % 2000)) * 1024 * 1024; // Between 10MB and 2GB in bytes

    return formatBytes(size);
  };

  // Format bytes to human readable format
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";

    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // Handle download (in a real implementation, this would trigger a download)
  const handleDownload = (backupName: string) => {
    toast.success(`${t("downloadStarted")}: ${backupName}`);
    // In a real implementation, this would use an API endpoint to download the backup
  };

  if (hasAccess === false) {
    return <AccessDeniedCard />;
  }

  if (error) {
    return (
      <div
        className="container mx-auto py-6 max-w-7xl"
        dir={isRTL ? "rtl" : "ltr"}
      >
        <Card className="border-red-200 dark:border-red-900">
          <CardHeader>
            <CardTitle className="text-red-600 dark:text-red-400">
              {t("error")}
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
    <div
      className="container mx-auto py-6 max-w-7xl"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-1 text-blue-800 dark:text-blue-300">
              {t("systemBackups")}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {t("manageSystemBackups")}
            </p>
          </div>

          <div className="flex gap-3 mt-4 sm:mt-0">
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => refetchBackups()}
            >
              <RefreshCw className="h-4 w-4" />
              {t("refresh")}
            </Button>

            <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  {t("createBackup")}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{t("createNewBackup")}</DialogTitle>
                  <DialogDescription>
                    {t("createBackupDescription")}
                  </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleCreateBackup} className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <label
                      htmlFor="backup-name"
                      className="text-sm font-medium"
                    >
                      {t("backupName")}*
                    </label>
                    <Input
                      id="backup-name"
                      placeholder={t("backupNamePlaceholder")}
                      value={backupName}
                      onChange={(e) => setBackupName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="backup-description"
                      className="text-sm font-medium"
                    >
                      {t("description")}
                    </label>
                    <Input
                      id="backup-description"
                      placeholder={t("descriptionOptional")}
                      value={backupDescription}
                      onChange={(e) => setBackupDescription(e.target.value)}
                    />
                  </div>

                  <DialogFooter className="mt-6">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setCreateDialogOpen(false)}
                    >
                      {t("cancel")}
                    </Button>
                    <Button
                      type="submit"
                      disabled={isCreating || !backupName.trim()}
                    >
                      {isCreating ? (
                        <>
                          <Spinner size="sm" className="mx-2" />
                          {t("creating")}
                        </>
                      ) : (
                        t("createBackup")
                      )}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Search and Filter Controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder={t("searchBackups")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-10"
            />
          </div>

          <Select
            value={sortOrder}
            onValueChange={(value: any) => setSortOrder(value)}
          >
            <SelectTrigger className="w-[180px]">
              <Filter className="h-4 w-4 mx-2" />
              <SelectValue placeholder={t("sortBy")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">{t("newestFirst")}</SelectItem>
              <SelectItem value="oldest">{t("oldestFirst")}</SelectItem>
              <SelectItem value="alphabetical">{t("alphabetical")}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Backups List */}
        <Card className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-md border-blue-100 dark:border-blue-900 shadow-xl overflow-hidden rounded-xl">
          <CardHeader>
            <CardTitle>{t("availableBackups")}</CardTitle>
            <CardDescription>{t("manageBackupsDescription")}</CardDescription>
          </CardHeader>

          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="flex items-center gap-4 p-4 border dark:border-gray-700 rounded-lg"
                  >
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-40" />
                      <Skeleton className="h-3 w-full max-w-xs" />
                    </div>
                    <div className="flex gap-2">
                      <Skeleton className="h-9 w-24" />
                      <Skeleton className="h-9 w-24" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredAndSortedBackups.length === 0 ? (
              <div className="text-center py-12">
                <Database className="h-16 w-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {searchQuery ? t("noBackupsMatch") : t("noBackupsAvailable")}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                  {searchQuery
                    ? t("tryDifferentSearch")
                    : t("createFirstBackup")}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredAndSortedBackups.map((backup) => {
                  const dateInfo = formatDate(backup.date);
                  const backupSize = getBackupSize(backup);

                  return (
                    <motion.div
                      key={backup.name}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="flex flex-col md:flex-row md:items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors"
                    >
                      <div className="flex items-start gap-3 mb-4 md:mb-0">
                        <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg">
                          <Database className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <div className="flex items-center flex-wrap gap-2">
                            <h3 className="font-medium">{backup.name}</h3>
                            <Badge variant="outline" className="text-xs">
                              {backupSize}
                            </Badge>
                          </div>

                          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-sm text-gray-500 dark:text-gray-400">
                            <span className="inline-flex items-center gap-1">
                              <Calendar className="h-3.5 w-3.5" />
                              {dateInfo.formatted}
                            </span>
                            <span className="inline-flex items-center gap-1">
                              <Clock className="h-3.5 w-3.5" />
                              {dateInfo.relative}
                            </span>
                          </div>

                          {backup.metadata?.description && (
                            <p className="mt-1 text-sm text-gray-600 dark:text-gray-300 flex gap-1 items-center">
                              <FileText className="h-3.5 w-3.5" />
                              {backup.metadata.description}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 ms-12 md:ms-0">
                        {/* Download button (in real implementation would trigger download) */}
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-blue-600 dark:text-blue-400"
                          onClick={() => handleDownload(backup.name)}
                        >
                          <Download className="h-4 w-4 mx-2" />
                          {t("download")}
                        </Button>

                        {/* Restore Dialog */}
                        <Dialog
                          open={
                            restoreDialogOpen && selectedBackup === backup.name
                          }
                          onOpenChange={(open) => {
                            setRestoreDialogOpen(open);
                            if (!open) setSelectedBackup(null);
                          }}
                        >
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-green-600 dark:text-green-400"
                              onClick={() => setSelectedBackup(backup.name)}
                            >
                              <CheckCircle className="h-4 w-4 mx-2" />
                              {t("restore")}
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>{t("restoreSystem")}</DialogTitle>
                              <DialogDescription>
                                {t("restoreSystemWarning")}
                              </DialogDescription>
                            </DialogHeader>

                            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-md p-3 mt-2 text-amber-800 dark:text-amber-300">
                              <div className="flex gap-2">
                                <AlertTriangle className="h-5 w-5 flex-shrink-0" />
                                <p className="text-sm">
                                  {t("restoreDataLossWarning")}
                                </p>
                              </div>
                            </div>

                            <DialogFooter className="mt-4">
                              <Button
                                variant="ghost"
                                onClick={() => {
                                  setRestoreDialogOpen(false);
                                  setSelectedBackup(null);
                                }}
                              >
                                {t("cancel")}
                              </Button>
                              <Button
                                variant="destructive"
                                onClick={handleRestoreBackup}
                                disabled={isRestoring}
                              >
                                {isRestoring ? (
                                  <>
                                    <Spinner size="sm" className="mx-2" />
                                    {t("restoring")}
                                  </>
                                ) : (
                                  t("confirmRestore")
                                )}
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>

                        {/* Delete Dialog */}
                        <Dialog
                          open={
                            deleteDialogOpen && selectedBackup === backup.name
                          }
                          onOpenChange={(open) => {
                            setDeleteDialogOpen(open);
                            if (!open) setSelectedBackup(null);
                          }}
                        >
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-600 dark:text-red-400"
                              onClick={() => setSelectedBackup(backup.name)}
                            >
                              <Trash2 className="h-4 w-4 mx-2" />
                              {t("delete")}
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>{t("deleteBackup")}</DialogTitle>
                              <DialogDescription>
                                {t("deleteBackupConfirmation")}
                              </DialogDescription>
                            </DialogHeader>
                            <DialogFooter className="mt-4">
                              <Button
                                variant="ghost"
                                onClick={() => {
                                  setDeleteDialogOpen(false);
                                  setSelectedBackup(null);
                                }}
                              >
                                {t("cancel")}
                              </Button>
                              <Button
                                variant="destructive"
                                onClick={handleDeleteBackup}
                                disabled={isDeleting}
                              >
                                {isDeleting ? (
                                  <>
                                    <Spinner size="sm" className="mx-2" />
                                    {t("deleting")}
                                  </>
                                ) : (
                                  t("confirmDelete")
                                )}
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </CardContent>

          <CardFooter className="border-t border-gray-100 dark:border-gray-800 px-6 py-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {filteredAndSortedBackups.length > 0
                ? `${filteredAndSortedBackups.length} ${t("backupsCount")}`
                : t("noBackupsFound")}
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default BackupsPage;
