"use client";

import { useLanguage } from "@/app/_contexts/LanguageContext";
import { usePatient } from "@/app/_hooks/patient/usePatient";
import {
  IReport,
  IReportChart,
  IReportFilter,
} from "@/app/_hooks/report/reportApi";
import { IPatient } from "@/app/_types/Patient";
import { useAuthContext } from "@/app/_providers/AuthProvider";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-hot-toast";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart3,
  Download,
  FileBarChart2,
  FileText,
  Filter,
  Loader2,
  Plus,
  RefreshCw,
  Sparkles,
} from "lucide-react";

import AIReports from "./AIReports";
import { EmptyReportState } from "./EmptyReportState";
import ReportBuilder from "./ReportBuilder";
import ReportList from "./ReportList";
import ReportViewer from "./ReportViewer";

// Define interface for the component props
interface ReportsViewProps {
  // Report properties
  reports: IReport[];
  hasAccess: boolean;
  isReportsLoading: boolean;
  reportsError: Error | null;
  refetchReports: () => void;
  generateReport: (id: string) => Promise<any>;
  generateCustomReport: (reportConfig: any) => Promise<any>;
  createReport: (
    reportData: Partial<IReport>
  ) => Promise<{ success: boolean; data?: IReport; error?: string }>;
  updateReport: (id: string, data: Partial<IReport>) => Promise<any>;
  deleteReport: (id: string) => Promise<{ success: boolean; error?: string }>;
  reportFields: any;
  refetchFields: () => void;
  isFieldsLoading: boolean;
  generatePatientAIReport: (patientId: string) => Promise<any>;
  generateGroupAnalysis: (patientIds: string[], options?: any) => Promise<any>;
  generateTreatmentRecommendations: (
    patientId: string,
    options?: any
  ) => Promise<any>;
  generateProgressAnalysis: (patientId: string, options?: any) => Promise<any>;

  // Patient properties
  patients: IPatient[];
  isPatientsLoading: boolean;
  totalPatients: number;
  getPatient: (id: string) => Promise<any>;
  searchPatients: (params: { query?: string }) => Promise<any>;
  refetchPatients: () => void;
}

export default function ReportsView({
  reports,
  hasAccess,
  isReportsLoading,
  reportsError,
  refetchReports,
  generateReport,
  generateCustomReport,
  createReport,
  updateReport,
  deleteReport,
  reportFields,
  refetchFields,
  isFieldsLoading,
  generatePatientAIReport,
  generateGroupAnalysis,
  generateTreatmentRecommendations,
  generateProgressAnalysis,
  patients,
  isPatientsLoading,
  totalPatients,
  getPatient,
  searchPatients,
  refetchPatients,
}: ReportsViewProps) {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthContext();
  const { t, isRTL } = useLanguage();
  const [activeTab, setActiveTab] = useState("my-reports");
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  const [reportData, setReportData] = useState<any>(null);
  const [filterType, setFilterType] = useState<string>("all");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Get report fields on initial load
  useEffect(() => {
    if (hasAccess && !reportFields) {
      refetchFields();
    }
  }, [hasAccess, reportFields, refetchFields]);

  // Helper function to normalize MongoDB ObjectId to string
  const normalizeId = (report: any) => {
    if (!report) return report;

    // Handle _id if it exists (MongoDB format)
    if (report._id && typeof report._id === "object" && report._id.$oid) {
      report.id = report._id.$oid;
    } else if (report._id) {
      report.id = report._id.toString();
    }

    // Handle dates in ISODate format
    if (report.createdAt && report.createdAt.$date) {
      report.createdAt = new Date(report.createdAt.$date);
    }

    if (report.updatedAt && report.updatedAt.$date) {
      report.updatedAt = new Date(report.updatedAt.$date);
    }

    // Convert ObjectIds in nested arrays
    if (report.filters && Array.isArray(report.filters)) {
      report.filters = report.filters.map((filter: any) => {
        if (filter._id && typeof filter._id === "object" && filter._id.$oid) {
          filter.id = filter._id.$oid;
        }
        return filter;
      });
    }

    if (report.charts && Array.isArray(report.charts)) {
      report.charts = report.charts.map((chart: any) => {
        if (chart._id && typeof chart._id === "object" && chart._id.$oid) {
          chart.id = chart._id.$oid;
        }
        return chart;
      });
    }

    return report;
  };

  // Helper function to get patient name
  const getPatientName = (patient: IPatient): string => {
    return patient.personalInfo?.firstName && patient.personalInfo?.lastName
      ? `${patient.personalInfo.firstName} ${patient.personalInfo.lastName}`
      : `Patient ${patient.id?.substring(0, 6)}`;
  };

  // Handle report selection and generation
  const handleViewReport = useCallback(
    async (id: string) => {
      try {
        setReportData(null); // Clear previous report data
        setSelectedReportId(id);
        setIsGenerating(true);

        const result = await generateReport(id);

        if (result.success && result.data) {
          // Normalize MongoDB ObjectIds to string IDs
          let enrichedData = normalizeId({ ...result.data });

          // If report contains patient IDs, try to fetch their details
          if (result.data.patientIds && Array.isArray(result.data.patientIds)) {
            const patientDetails = await Promise.all(
              result.data.patientIds.map(async (patientId: string) => {
                try {
                  return await getPatient(patientId);
                } catch (error) {
                  console.error(`Error fetching patient ${patientId}:`, error);
                  return { id: patientId, name: "Unknown Patient" };
                }
              })
            );

            enrichedData.patientDetails = patientDetails;
          }

          // Add global context
          enrichedData.patientContext = {
            totalPatients,
            recentPatients:
              patients && patients.length > 0 ? patients.slice(0, 10) : [],
          };

          // Store for standalone viewing
          localStorage.setItem(
            "currentReport",
            JSON.stringify({
              ...enrichedData,
              generatedAt: new Date(),
              type: result.data.reportConfig?.type || "custom",
            })
          );

          setReportData(enrichedData);
        } else {
          console.error("Failed to generate report data:", result);
          toast.error(result.error || "Failed to load report data");
        }
      } catch (error) {
        console.error("Error generating report:", error);
        toast.error("An error occurred while generating the report");
      } finally {
        setIsGenerating(false);
      }
    },
    [generateReport, getPatient, patients, totalPatients]
  );

  // Handle export of report data
  const handleExportReport = useCallback(
    async (format: "pdf" | "csv" | "json") => {
      if (!reportData) return;

      try {
        setIsExporting(true);

        const reportTitle = reportData.reportConfig?.name || "Report";
        const reportDate = new Date().toISOString().split("T")[0];
        const fileName = `${reportTitle
          .replace(/\s+/g, "_")
          .toLowerCase()}_${reportDate}`;

        switch (format) {
          case "json":
            // Export as JSON
            const jsonBlob = new Blob([JSON.stringify(reportData, null, 2)], {
              type: "application/json",
            });
            const jsonUrl = URL.createObjectURL(jsonBlob);
            const jsonLink = document.createElement("a");
            jsonLink.href = jsonUrl;
            jsonLink.download = `${fileName}.json`;
            document.body.appendChild(jsonLink);
            jsonLink.click();
            document.body.removeChild(jsonLink);
            break;

          case "csv":
            // Simple CSV export for basic report data
            // This is a simplified version - for complex reports you might need a proper CSV converter
            let csvContent = "";

            // Extract headers from the first data entry
            if (reportData.data && reportData.data.length > 0) {
              const headers = Object.keys(reportData.data[0]);
              csvContent += headers.join(",") + "\n";

              // Add data rows
              reportData.data.forEach((row: any) => {
                const values = headers.map((header) => {
                  const cell = row[header];
                  return typeof cell === "string"
                    ? `"${cell.replace(/"/g, '""')}"`
                    : cell;
                });
                csvContent += values.join(",") + "\n";
              });

              const csvBlob = new Blob([csvContent], {
                type: "text/csv;charset=utf-8;",
              });
              const csvUrl = URL.createObjectURL(csvBlob);
              const csvLink = document.createElement("a");
              csvLink.href = csvUrl;
              csvLink.download = `${fileName}.csv`;
              document.body.appendChild(csvLink);
              csvLink.click();
              document.body.removeChild(csvLink);
            } else {
              toast.error("No tabular data available for CSV export");
            }
            break;

          case "pdf":
            // For PDF we would typically use the browser's print functionality
            // In a production app you might want to use a proper PDF library
            localStorage.setItem(
              "currentReport",
              JSON.stringify({
                ...reportData,
                generatedAt: new Date(),
                type: reportData.reportConfig?.type || "custom",
              })
            );

            // Open the dedicated report view page for printing
            window.open("/reports/view", "_blank");
            break;
        }

        toast.success(`Report exported as ${format.toUpperCase()}`);
      } catch (error) {
        console.error(`Error exporting report as ${format}:`, error);
        toast.error(`Failed to export report as ${format}`);
      } finally {
        setIsExporting(false);
      }
    },
    [reportData]
  );

  // Handle creation of custom report from the current data
  const handleGenerateCustomReport = useCallback(
    async (reportConfig: {
      type?: "patient" | "visit" | "status" | "custom" | "event";
      filters?: IReportFilter[];
      charts?: IReportChart[];
      includeFields?: string[];
    }) => {
      try {
        setReportData(null);
        setIsGenerating(true);

        const result = await generateCustomReport(reportConfig);

        if (result.success && result.data) {
          // Normalize MongoDB ObjectIds to string IDs
          const normalizedData = normalizeId(result.data);

          // Show the results in the same view
          setReportData(normalizedData);

          // Also store for standalone viewing
          localStorage.setItem(
            "currentReport",
            JSON.stringify({
              ...normalizedData,
              generatedAt: new Date(),
              type: reportConfig.type || "custom",
            })
          );

          // Switch to the reports tab
          setActiveTab("my-reports");
          setSelectedReportId(null); // Not based on a saved report
        } else {
          toast.error(result.error || "Failed to generate custom report");
        }
      } catch (error) {
        console.error("Error generating custom report:", error);
        toast.error("An error occurred while generating the custom report");
      } finally {
        setIsGenerating(false);
      }
    },
    [generateCustomReport]
  );

  // Helper function to get report type labels
  const getReportTypeLabel = (type: string) => {
    switch (type) {
      case "patient":
        return "Patient Reports";
      case "visit":
        return "Visit Reports";
      case "status":
        return "Status Reports";
      case "custom":
        return "Custom Reports";
      case "event":
        return "Event Reports";
      default:
        return "Reports";
    }
  };

  // Normalize the reports array to handle MongoDB ObjectId format
  const normalizedReports = reports ? reports.map(normalizeId) : [];

  // Filter reports based on type
  const filteredReports = normalizedReports
    ? normalizedReports.filter((report: IReport) => {
        if (filterType === "all") return true;
        return report.type === filterType;
      })
    : [];

  // Refresh reports and patients data on auth change
  useEffect(() => {
    if (isAuthenticated) {
      refetchReports();
      refetchPatients();
    }
  }, [isAuthenticated, refetchReports, refetchPatients]);

  // Redirect if no access
  if (hasAccess === false) {
    return (
      <div className="container px-4 sm:px-6 mx-auto py-4 sm:py-6 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-md border-red-100 dark:border-red-900 shadow-xl overflow-hidden rounded-xl">
            <CardHeader className="px-6 pb-4">
              <CardTitle className="text-xl font-bold text-red-600">
                Access Denied
              </CardTitle>
              <CardDescription>
                You don't have access to the reports module
              </CardDescription>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              <Button
                onClick={() => router.push("/")}
                variant="default"
                className="mt-2"
              >
                Back to Dashboard
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container px-4 sm:px-6 mx-auto py-4 sm:py-6 max-w-6xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="rounded-xl overflow-hidden"
      >
        <Card className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-md border-blue-100 dark:border-blue-900 shadow-xl">
          <CardHeader className="px-4 sm:px-6 pb-2">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <CardTitle className="text-xl sm:text-2xl font-bold text-blue-800 dark:text-blue-300 flex items-center gap-2">
                  <BarChart3 className={`h-5 w-5 ${isRTL ? "mx-1" : "mx-1"}`} />
                  Reports & Analytics
                </CardTitle>
                <CardDescription className="text-blue-600 dark:text-blue-400 mt-1">
                  Generate comprehensive reports and insights from your patient
                  data
                </CardDescription>
              </div>
              <Button
                onClick={() => setActiveTab("create-report")}
                variant="default"
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                <Plus className="h-4 w-4 mx-1" />
                New Report
              </Button>
            </div>
          </CardHeader>

          <CardContent className="p-4 sm:p-6 pt-2">
            <Tabs
              defaultValue="my-reports"
              className="w-full"
              value={activeTab}
              onValueChange={setActiveTab}
              dir={isRTL ? "rtl" : "ltr"}
            >
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-0 sm:justify-between sm:items-center border-b border-gray-200 dark:border-gray-700 pb-4">
                <TabsList className="mb-2 sm:mb-0 bg-gray-100/80 dark:bg-gray-800/80 backdrop-blur-sm p-1 rounded-lg">
                  <TabsTrigger
                    value="my-reports"
                    className="px-3 sm:px-4 rounded-md data-[state=active]:bg-white dark:data-[state=active]:bg-gray-950"
                  >
                    <FileText className="h-4 w-4 mx-1.5" />
                    My Reports
                  </TabsTrigger>
                  <TabsTrigger
                    value="create-report"
                    className="px-3 sm:px-4 rounded-md data-[state=active]:bg-white dark:data-[state=active]:bg-gray-950"
                  >
                    <Plus className="h-4 w-4 mx-1.5" />
                    Create Report
                  </TabsTrigger>
                  <TabsTrigger
                    value="ai-reports"
                    className="px-3 sm:px-4 rounded-md data-[state=active]:bg-white dark:data-[state=active]:bg-gray-950"
                  >
                    <Sparkles className="h-4 w-4 mx-1.5" />
                    AI Analysis
                  </TabsTrigger>
                </TabsList>

                {/* Filters - only show in my reports tab */}
                {activeTab === "my-reports" && (
                  <div className="flex items-center">
                    <Filter className="h-4 w-4 text-gray-400 mx-2" />
                    <Select value={filterType} onValueChange={setFilterType}>
                      <SelectTrigger
                        className="w-full sm:w-[160px] h-8 text-sm bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                        dir={isRTL ? "rtl" : "ltr"}
                      >
                        <SelectValue placeholder="Filter Reports" />
                      </SelectTrigger>
                      <SelectContent dir={isRTL ? "rtl" : "ltr"}>
                        <SelectItem value="all">All Reports</SelectItem>
                        <SelectItem value="patient">
                          {getReportTypeLabel("patient")}
                        </SelectItem>
                        <SelectItem value="visit">
                          {getReportTypeLabel("visit")}
                        </SelectItem>
                        <SelectItem value="status">
                          {getReportTypeLabel("status")}
                        </SelectItem>
                        <SelectItem value="custom">
                          {getReportTypeLabel("custom")}
                        </SelectItem>
                        <SelectItem value="event">
                          {getReportTypeLabel("event")}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="mx-1 h-8 w-8 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200"
                      onClick={() => {
                        refetchReports();
                        refetchPatients();
                      }}
                    >
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>

              {/* My Reports Tab */}
              <AnimatePresence mode="wait">
                <TabsContent value="my-reports" className="mt-4 sm:mt-6">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div>
                      <h3 className="font-semibold mb-3 text-gray-700 dark:text-gray-300">
                        Saved Reports
                      </h3>
                      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
                        {isReportsLoading ? (
                          <div className="p-6 text-center">
                            <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2 text-blue-500" />
                            <p className="text-sm text-gray-500">
                              Loading reports...
                            </p>
                          </div>
                        ) : reportsError ? (
                          <div className="p-6 text-center">
                            <p className="text-sm text-red-500">
                              Error loading reports
                            </p>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => refetchReports()}
                              className="mt-2"
                            >
                              <RefreshCw className="h-4 w-4 mx-1" />
                              Try again
                            </Button>
                          </div>
                        ) : filteredReports && filteredReports.length > 0 ? (
                          <ReportList
                            reports={filteredReports}
                            onViewReport={handleViewReport}
                            selectedReportId={selectedReportId}
                            onCreateNew={() => setActiveTab("create-report")}
                            onRefresh={refetchReports}
                            deleteReportFn={deleteReport}
                          />
                        ) : (
                          <EmptyReportState
                            onCreateNew={() => setActiveTab("create-report")}
                          />
                        )}
                      </div>
                    </div>

                    <div className="lg:col-span-2">
                      <h3 className="font-semibold mb-3 text-gray-700 dark:text-gray-300">
                        {selectedReportId ? "Report Details" : "Report Viewer"}
                      </h3>

                      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden p-5">
                        {isGenerating ? (
                          <div className="flex flex-col items-center justify-center py-12">
                            <Loader2 className="h-8 w-8 animate-spin text-blue-500 mb-4" />
                            <p className="text-gray-500">
                              Generating report...
                            </p>
                          </div>
                        ) : reportData ? (
                          <>
                            <div className="flex justify-end gap-2 mb-4">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleExportReport("csv")}
                                disabled={isExporting}
                              >
                                <Download className="h-4 w-4 mx-1.5" />
                                CSV
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleExportReport("json")}
                                disabled={isExporting}
                              >
                                <FileBarChart2 className="h-4 w-4 mx-1.5" />
                                JSON
                              </Button>
                              <Button
                                variant="default"
                                size="sm"
                                onClick={() => handleExportReport("pdf")}
                                disabled={isExporting}
                              >
                                <FileText className="h-4 w-4 mx-1.5" />
                                PDF
                              </Button>
                            </div>
                            <ReportViewer reportData={reportData} />
                          </>
                        ) : (
                          <div className="text-center py-12">
                            <FileText className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                              No Report Selected
                            </h3>
                            <p className="text-gray-500 max-w-md mx-auto">
                              Select a report from the list to view its details
                              or create a new one.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </AnimatePresence>

              {/* Create Report Tab */}
              <AnimatePresence mode="wait">
                <TabsContent value="create-report" className="mt-4 sm:mt-6">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="bg-white dark:bg-slate-800/50 border border-gray-100 dark:border-gray-700 rounded-lg shadow-sm p-3 sm:p-4">
                      <ReportBuilder
                        onReportCreated={(newReport) => {
                          refetchReports();
                          setActiveTab("my-reports");
                          // If a report was actually created, select it
                          if (newReport?.id) {
                            setSelectedReportId(newReport.id);
                            handleViewReport(newReport.id);
                          }
                        }}
                        reportFields={reportFields}
                        isFieldsLoading={isFieldsLoading}
                        onGenerateCustomReport={handleGenerateCustomReport}
                        patients={patients || []}
                        isPatientsLoading={isPatientsLoading}
                        createReportFn={createReport}
                      />
                    </div>
                  </motion.div>
                </TabsContent>
              </AnimatePresence>

              {/* AI Reports Tab */}
              <AnimatePresence mode="wait">
                <TabsContent value="ai-reports" className="mt-4 sm:mt-6">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="bg-white dark:bg-slate-800/50 border border-gray-100 dark:border-gray-700 rounded-lg shadow-sm p-3 sm:p-4">
                      <AIReports
                        patients={patients || []}
                        isPatientsLoading={isPatientsLoading}
                        generatePatientAIReport={generatePatientAIReport}
                        generateGroupAnalysis={generateGroupAnalysis}
                        generateTreatmentRecommendations={
                          generateTreatmentRecommendations
                        }
                        generateProgressAnalysis={generateProgressAnalysis}
                        searchPatients={searchPatients}
                      />
                    </div>
                  </motion.div>
                </TabsContent>
              </AnimatePresence>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
