"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { PlusCircle, RefreshCw, Eye, Trash, Edit } from "lucide-react";
import { IReport } from "@/app/_api/reportApi";
import { useReport } from "@/app/_hooks/useReport";

interface ReportListProps {
  reports: IReport[];
  onViewReport: (id: string) => void;
  selectedReportId: string | null;
  onCreateNew: () => void;
  onRefresh: () => void;
}

export default function ReportList({
  reports,
  onViewReport,
  selectedReportId,
  onCreateNew,
  onRefresh,
}: ReportListProps) {
  const { deleteReport, isDeleting } = useReport();

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this report?")) {
      const result = await deleteReport(id);
      if (result.success) {
        onRefresh();
      } else {
        alert(`Failed to delete report: ${result.error}`);
      }
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">My Reports</h2>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            title="Refresh reports"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={onCreateNew}
            className="bg-green-600 hover:bg-green-700"
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            New Report
          </Button>
        </div>
      </div>

      <div className="overflow-y-auto flex-grow">
        {reports.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No reports found</p>
            <Button variant="link" onClick={onCreateNew} className="mt-2">
              Create your first report
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {reports.map((report) => (
              <Card
                key={report.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedReportId === report.id
                    ? "border-green-500 shadow-md"
                    : ""
                }`}
                onClick={() => onViewReport(report.id!)}
              >
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-base mb-1">
                        {report.name}
                      </CardTitle>
                      <p className="text-sm text-gray-500">
                        {report.type.charAt(0).toUpperCase() +
                          report.type.slice(1)}{" "}
                        Report
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {report.updatedAt
                          ? new Date(report.updatedAt).toLocaleDateString()
                          : "Date unknown"}
                      </p>
                    </div>
                    <div className="flex space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          onViewReport(report.id!);
                        }}
                        title="View report"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                        onClick={(e) => handleDelete(report.id!, e)}
                        disabled={isDeleting}
                        title="Delete report"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
