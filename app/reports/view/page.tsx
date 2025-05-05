"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Download, Info } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useReport } from "@/app/_hooks/report/useReport";
import { Spinner } from "@/app/_components/Spinner";
import ReportViewer from "../_components/ReportViewer";

// Helper function to get patient name from the updated patient model
const getPatientName = (patient: any): string => {
  if (!patient) return "Unknown Patient";

  // Get name directly from personalInfo fields
  if (patient.personalInfo) {
    const firstName = patient.personalInfo.firstName || "";
    const lastName = patient.personalInfo.lastName || "";
    if (firstName || lastName) {
      return `${firstName} ${lastName}`.trim();
    }
  }

  // Fallbacks
  if (patient.name) {
    return patient.name;
  }

  return `Patient ${patient.id?.substring(0, 6) || "Unknown"}`;
};

// Helper function to format date objects or ISODate MongoDB format
const formatDate = (date: any): string => {
  if (!date) return "N/A";

  try {
    // Handle MongoDB ISODate format
    if (typeof date === "object" && date.$date) {
      return new Date(date.$date).toLocaleString();
    }

    // Handle empty objects (MongoDB dates sometimes appear as empty objects)
    if (typeof date === "object" && Object.keys(date).length === 0) {
      return "N/A";
    }

    // Handle standard dates
    if (date instanceof Date) {
      return date.toLocaleString();
    }

    // Convert string to date
    if (typeof date === "string") {
      return new Date(date).toLocaleString();
    }

    return "N/A";
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Invalid Date";
  }
};

// Function to safely access nested fields with dot notation
const getNestedValue = (obj: any, path: string): any => {
  if (!obj) return null;

  const keys = path.split(".");
  let current = obj;

  for (const key of keys) {
    if (current === null || current === undefined) return null;
    current = current[key];
  }

  return current;
};

export default function ReportViewerPage() {
  const searchParams = useSearchParams();
  const reportId = searchParams.get("id");
  const [reportData, setReportData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { getReport, generateReport } = useReport();

  useEffect(() => {
    async function fetchReport() {
      if (!reportId) {
        setError("No report ID provided");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // Get the report configuration
        const reportResult = await getReport(reportId);

        if (!reportResult.success) {
          setError(reportResult.error || "Failed to fetch report");
          setLoading(false);
          return;
        }

        // Generate the report data
        const generatedResult = await generateReport(reportId);

        if (!generatedResult.success) {
          setError(generatedResult.error || "Failed to generate report");
          setLoading(false);
          return;
        }

        setReportData(generatedResult.data);
        setLoading(false);
      } catch (err) {
        setError("An error occurred while fetching the report");
        setLoading(false);
        console.error("Error fetching report:", err);
      }
    }

    fetchReport();
  }, [reportId, getReport, generateReport]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <Spinner size="lg" />
        <p className="mt-4 text-gray-500">Loading report...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-red-500">
        <Info className="h-12 w-12 mb-4" />
        <p className="text-xl font-medium mb-2">Error</p>
        <p>{error}</p>
        <Button asChild className="mt-6" variant="outline">
          <Link href="/reports">Go Back to Reports</Link>
        </Button>
      </div>
    );
  }

  if (!reportData) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-yellow-500">
        <Info className="h-12 w-12 mb-4" />
        <p className="text-xl font-medium mb-2">No Data</p>
        <p>No report data available</p>
        <Button asChild className="mt-6" variant="outline">
          <Link href="/reports">Go Back to Reports</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 max-w-7xl">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <Button asChild variant="outline" size="icon">
            <Link href="/reports">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">
              {reportData.reportConfig?.name || "Report"}
            </h1>
            <p className="text-gray-500">
              Generated: {formatDate(reportData.generatedAt)}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mx-2" />
            Export
          </Button>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Report Details</CardTitle>
          {reportData.patient && (
            <div className="text-right">
              <div className="font-medium">
                {getPatientName(reportData.patient)}
              </div>
              <div className="text-sm text-gray-500">
                {reportData.patient.status &&
                  `Status: ${
                    reportData.patient.status.label ||
                    reportData.patient.status.name
                  }`}
              </div>
            </div>
          )}
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Description</p>
              <p>
                {reportData.reportConfig?.description ||
                  "No description provided"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Type</p>
              <p className="capitalize">
                {reportData.reportConfig?.type || "Custom"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Created</p>
              <p>{formatDate(reportData.reportConfig?.createdAt)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Last Updated</p>
              <p>{formatDate(reportData.reportConfig?.updatedAt)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Report Results</CardTitle>
        </CardHeader>
        <CardContent>
          {reportData.data && Array.isArray(reportData.data) ? (
            <div>
              <ReportViewer reportData={reportData} />

              {/* Detailed tables section */}
              {reportData.data &&
                Array.isArray(reportData.data) &&
                reportData.data.some(
                  (chart: any) => chart.type === "table"
                ) && (
                  <div className="mb-6">
                    <h4 className="font-medium text-lg mb-3">
                      Detailed Data Tables
                    </h4>
                    {reportData.data
                      .filter((chart: any) => chart.type === "table")
                      .map((tableChart: any, tableIndex: number) => (
                        <div
                          key={`table-${tableIndex}`}
                          className="mb-4 overflow-x-auto"
                        >
                          <h5 className="font-medium mb-2">
                            {tableChart.title}
                          </h5>
                          {tableChart.rows && tableChart.rows.length > 0 ? (
                            <div className="overflow-x-auto">
                              <table className="min-w-full border-collapse">
                                <thead>
                                  <tr className="bg-gray-50 dark:bg-gray-800">
                                    {tableChart.headers &&
                                      tableChart.headers.map(
                                        (header: any, headerIndex: number) => (
                                          <th
                                            key={`header-${headerIndex}`}
                                            className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                          >
                                            {header.label}
                                          </th>
                                        )
                                      )}
                                  </tr>
                                </thead>
                                <tbody>
                                  {tableChart.rows.map(
                                    (row: any, rowIndex: number) => (
                                      <tr
                                        key={`row-${rowIndex}`}
                                        className={
                                          rowIndex % 2 === 0
                                            ? "bg-white dark:bg-gray-900"
                                            : "bg-gray-50 dark:bg-gray-800"
                                        }
                                      >
                                        {tableChart.headers &&
                                          tableChart.headers.map(
                                            (
                                              header: any,
                                              cellIndex: number
                                            ) => {
                                              // Handle different data types
                                              let cellValue = getNestedValue(
                                                row,
                                                header.key
                                              );

                                              // Format date fields
                                              if (
                                                header.key
                                                  .toLowerCase()
                                                  .includes("date") &&
                                                cellValue
                                              ) {
                                                cellValue =
                                                  formatDate(cellValue);
                                              }

                                              // Handle arrays
                                              if (Array.isArray(cellValue)) {
                                                cellValue =
                                                  cellValue.join(", ");
                                              }

                                              return (
                                                <td
                                                  key={`cell-${rowIndex}-${cellIndex}`}
                                                  className="px-4 py-2 text-sm"
                                                >
                                                  {cellValue !== null &&
                                                  cellValue !== undefined
                                                    ? String(cellValue)
                                                    : "—"}
                                                </td>
                                              );
                                            }
                                          )}
                                      </tr>
                                    )
                                  )}
                                </tbody>
                              </table>
                            </div>
                          ) : (
                            <p className="text-gray-500">
                              No data available for this table
                            </p>
                          )}
                        </div>
                      ))}
                  </div>
                )}
            </div>
          ) : (
            <div className="text-center py-8 text-yellow-500">
              <Info className="h-8 w-8 mx-auto mb-2" />
              <p>No report data available or format is not supported</p>
              {reportData.data && (
                <pre className="mt-4 text-left text-xs bg-gray-50 dark:bg-gray-800 p-4 rounded-md overflow-auto max-h-40">
                  {JSON.stringify(reportData.data, null, 2)}
                </pre>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
