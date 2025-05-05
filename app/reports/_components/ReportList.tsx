"use client";

import { useLanguage } from "@/app/_contexts/LanguageContext";
import { IReport } from "@/app/_hooks/report/reportApi";
import { useReport } from "@/app/_hooks/report/useReport";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle, Search, Trash2 } from "lucide-react";
import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { ReportCard } from "./ReportCard";

interface ReportListProps {
  reports: IReport[];
  onViewReport: (id: string) => void;
  selectedReportId: string | null;
  onCreateNew?: () => void;
  onRefresh?: () => void;
  deleteReportFn?: (
    id: string
  ) => Promise<{ success: boolean; error?: string }>;
}

export default function ReportList({
  reports,
  onViewReport,
  selectedReportId,
  onCreateNew,
  onRefresh,
  deleteReportFn,
}: ReportListProps) {
  const { t, isRTL } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [reportToDelete, setReportToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Only use the hook if deleteReportFn is not provided
  const { deleteReport: hookDeleteReport, isDeleting: hookIsDeleting } =
    useReport({
      initialFetch: false,
    });

  // Use the prop if provided, otherwise use the hook
  const deleteReport = deleteReportFn || hookDeleteReport;

  // Helper function to normalize report IDs
  const getReportId = (report: IReport): string => {
    // Check for different ID formats
    if (report.id) return report.id;
    if (report._id) {
      // Handle MongoDB ObjectId format
      if (typeof report._id === "object" && report._id.$oid) {
        return report._id.$oid;
      }
      return report._id.toString();
    }
    return "";
  };

  // Filter reports based on search query
  const filteredReports = reports.filter((report) =>
    report.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle delete confirmation
  const handleConfirmDelete = async () => {
    if (reportToDelete) {
      setIsDeleting(true);
      try {
        const result = await deleteReport(reportToDelete);
        if (result.success) {
          toast.success("Report deleted successfully");
          if (onRefresh) {
            onRefresh();
          }
        } else {
          toast.error(result.error || "Failed to delete report");
        }
      } catch (error) {
        console.error("Error deleting report:", error);
        toast.error("An error occurred while deleting the report");
      } finally {
        setIsDeleting(false);
        setReportToDelete(null);
      }
    }
  };

  // Handle report click
  const handleReportClick = (id: string) => {
    onViewReport(id);
  };

  // Handle report delete click
  const handleDeleteClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setReportToDelete(id);
  };

  return (
    <div className="flex flex-col" dir={isRTL ? "rtl" : "ltr"}>
      {/* Search input */}
      <div className="relative mb-3 px-4 pt-4">
        <Search className="absolute top-[1.35rem] left-7 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search reports..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="px-9 h-9 text-sm bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
        />
      </div>

      {/* Report list */}
      {filteredReports.length === 0 ? (
        <div className="text-center py-6 text-gray-500 dark:text-gray-400">
          <p className="text-sm">
            {searchQuery
              ? "No reports found matching your search"
              : "No reports yet"}
          </p>
          {onCreateNew && (
            <Button
              variant="link"
              onClick={onCreateNew}
              className="mt-2 text-blue-600 dark:text-blue-400"
            >
              Create your first report
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-2 px-4 pb-4">
          {filteredReports.map((report, index) => {
            // Get the proper ID from the report
            const reportId = getReportId(report);

            return (
              <div key={reportId || index} className="relative group">
                <ReportCard
                  report={report}
                  isSelected={selectedReportId === reportId}
                  onClick={() => reportId && handleReportClick(reportId)}
                  index={index}
                />

                {/* Delete button overlay */}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <AlertDialog
                    open={reportToDelete === reportId}
                    onOpenChange={(open) => !open && setReportToDelete(null)}
                  >
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 bg-white dark:bg-gray-800 rounded-full shadow-sm hover:bg-red-50 dark:hover:bg-red-900/20 border border-gray-200 dark:border-gray-700"
                        onClick={(e) =>
                          reportId && handleDeleteClick(e, reportId)
                        }
                      >
                        <Trash2 className="h-3 w-3 text-red-500" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Report</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this report? This
                          action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleConfirmDelete}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          {isDeleting ? "Deleting..." : "Delete"}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create new button for mobile */}
      {onCreateNew && (
        <div className="mt-4 px-4 pb-4 sm:hidden">
          <Button
            variant="default"
            size="sm"
            onClick={onCreateNew}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            <PlusCircle className="h-4 w-4 mx-2" />
            New Report
          </Button>
        </div>
      )}
    </div>
  );
}
