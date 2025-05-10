"use client";

import { useLanguage } from "@/app/_contexts/LanguageContext";
import { IReport } from "@/app/_hooks/report/reportApi";
import { useReport } from "@/app/_hooks/report/useReport";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  BarChart3,
  BarChart4,
  Calendar,
  Clock,
  FileText,
  Filter,
  Layers,
  Loader2,
  PieChart,
  User,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import ReportCharts from "../_components/ReportCharts";

// Type definitions
interface ChartConfig {
  type: string;
  dataField: string;
  title: string;
  options?: Record<string, any>;
  order: number;
  _id: string;
  timeInterval?: string;
  groupBy?: string;
}

interface ReportConfig {
  schedule: {
    enabled: boolean;
    recipients: string[];
  };
  name: string;
  description: string;
  type: string;
  filters: Array<Record<string, any>>;
  charts: ChartConfig[];
  includeFields: string[];
  isPrivate: boolean;
  isFavorite: boolean;
  isTemplate: boolean;
  tags: string[];
  category?: string;
  createdBy: {
    name: string;
    email: string;
    id: string;
  };
  lastModifiedBy: {
    name: string;
    email: string;
    id: string;
  };
  version: number;
  createdAt: string;
  updatedAt: string;
  lastGeneratedAt?: string;
  id: string;
}

interface ChartData {
  type: string;
  title: string;
  field: string;
  data?: any[];
  segments?: string[];
  segmentCounts?: Array<{ segment: string; count: number; percentage: number }>;
  totalPatients?: number;
  period?: string;
  headers?: Array<{ key: string; label: string }>;
  rows?: Array<Record<string, any>>;
  statusDistribution?: Array<{
    status?: string;
    name?: string;
    count: number;
    percentage: number;
  }>;
  avgDaysInCurrentStatus?: number;
  statusTransitions?: Array<{ from: string; to: string; count: number }>;
  genderDistribution?: Array<{
    gender: string;
    count: number;
    percentage: number;
  }>;
  total?: number;
  active?: number;
  inactive?: number;
  avgAge?: number;
  mostRecentVisit?: Record<string, any>;
  oldestVisit?: Record<string, any>;
  totalVisits?: number;
  avgVisitsPerPatient?: string;
  visitsByDayOfWeek?: Array<{ day: string; count: number; percentage: number }>;
}

interface GeneratedReport {
  reportConfig: ReportConfig;
  data: ChartData[];
  generatedAt: string;
  metadata: {
    version: number;
    type: string;
    filterCount: number;
    chartCount: number;
  };
}

// Report Type Configuration - visual styling for different report types
const reportTypeConfig = {
  patient: {
    badge:
      "bg-blue-100/80 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 border border-blue-200 dark:border-blue-800/30",
    displayName: "Patient Overview",
    icon: User,
  },
  comparative: {
    badge:
      "bg-purple-100/80 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300 border border-purple-200 dark:border-purple-800/30",
    displayName: "Comparative Analysis",
    icon: BarChart3,
  },
  status: {
    badge:
      "bg-green-100/80 text-green-800 dark:bg-green-900/40 dark:text-green-300 border border-green-200 dark:border-green-800/30",
    displayName: "Status Analysis",
    icon: BarChart4,
  },
  visit: {
    badge:
      "bg-amber-100/80 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 border border-amber-200 dark:border-amber-800/30",
    displayName: "Visit Tracking",
    icon: Calendar,
  },
  custom: {
    badge:
      "bg-indigo-100/80 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/30",
    displayName: "Custom Analysis",
    icon: PieChart,
  },
  default: {
    badge:
      "bg-gray-100/80 text-gray-800 dark:bg-gray-800/60 dark:text-gray-300 border border-gray-200 dark:border-gray-700/30",
    displayName: "Report",
    icon: FileText,
  },
};

export default function ReportDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const reportId = params.id as string;
  const [report, setReport] = useState<IReport | null>(null);
  const [generatedData, setGeneratedData] = useState<GeneratedReport | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoadingReportData, setIsLoadingReportData] = useState(false);
  const { t, dir } = useLanguage();

  // Using refs to track fetch states
  const initialFetchDone = useRef(false);
  const reportDataFetchAttempted = useRef(false);

  const { getReport, generateReport } = useReport();

  // Fetch report details on initial mount
  useEffect(() => {
    async function fetchReport() {
      if (!reportId || initialFetchDone.current) return;
      initialFetchDone.current = true;

      try {
        setIsLoading(true);
        const result = await getReport(reportId);
        if (result.success) {
          setReport(result.data);
        } else {
          toast.error("Failed to load report");
          router.push("/reports");
        }
      } catch (error) {
        console.log(error);
        toast.error("An error occurred while loading the report");
      } finally {
        setIsLoading(false);
      }
    }

    fetchReport();
  }, []);

  // Load report data if already generated
  useEffect(() => {
    async function loadReportDataIfNeeded() {
      if (
        !report ||
        !report.lastGeneratedAt ||
        reportDataFetchAttempted.current ||
        generatedData ||
        isGenerating ||
        isLoadingReportData
      ) {
        return;
      }

      reportDataFetchAttempted.current = true;
      await fetchReportData();
    }

    loadReportDataIfNeeded();
  }, [report, generatedData, isGenerating, isLoadingReportData]);

  // Function to fetch report data without generating a new report
  const fetchReportData = async () => {
    if (!reportId || isGenerating || isLoadingReportData) return;

    try {
      setIsLoadingReportData(true);
      const result = await generateReport(reportId);
      console.log(result);

      if (result.success) {
        setGeneratedData(result.data);
      } else {
        toast.error("Failed to load report data");
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to load report visualizations");
    } finally {
      setIsLoadingReportData(false);
    }
  };

  // Action handlers
  const handleGoBack = () => router.back();

  const handleGenerateReport = async () => {
    if (!report || isGenerating || isLoadingReportData) return;

    try {
      setIsGenerating(true);
      const result = await generateReport(reportId);

      if (result.success) {
        setGeneratedData(result.data);

        // Refresh report data to show updated generation time
        const updatedReport = await getReport(reportId);
        if (updatedReport.success) {
          setReport(updatedReport.data);
        }
        toast.success("Report generated successfully");
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to generate report");
    } finally {
      setIsGenerating(false);
    }
  };

  // Render report type badge helper
  const renderReportTypeBadge = (type: string) => {
    const typeKey = type.toLowerCase() as keyof typeof reportTypeConfig;
    const config = reportTypeConfig[typeKey] || reportTypeConfig.default;
    const IconComponent = config.icon;

    return (
      <div className="flex items-center space-x-2">
        <div
          className={`px-3 py-1.5 rounded-full text-xs font-medium ${config.badge} shadow-sm flex items-center`}
        >
          <IconComponent className="h-3.5 w-3.5 mr-1.5" />
          {config.displayName}
        </div>
      </div>
    );
  };

  // Render summary metrics based on report type
  const renderSummaryMetrics = () => {
    if (!generatedData?.data) return null;

    const summaryChart = generatedData.data.find(
      (chart) => chart.type === "summary"
    );
    if (!summaryChart) return null;

    const reportType = generatedData.reportConfig.type.toLowerCase();
    const metricCardClass =
      "bg-gradient-to-br from-white/90 to-white/70 dark:from-slate-800/90 dark:to-slate-800/70 backdrop-blur-sm p-5 rounded-xl shadow hover:shadow-md transition-all duration-300 border border-blue-100/50 dark:border-blue-900/30 hover:border-blue-200 dark:hover:border-blue-800 relative overflow-hidden group";

    const metricsConfig = {
      patient: [
        {
          label: "Total Patients",
          value: summaryChart.total || 0,
          icon: User,
          color: "from-blue-500/10 to-blue-600/5",
        },
        {
          label: "Active Patients",
          value: summaryChart.active || 0,
          icon: User,
          color: "from-green-500/10 to-green-600/5",
        },
        {
          label: "Average Age",
          value: summaryChart.avgAge || "Unknown",
          icon: User,
          color: "from-amber-500/10 to-amber-600/5",
        },
      ],
      comparative: [
        {
          label: "Total Patients",
          value: summaryChart.totalPatients || 0,
          icon: User,
          color: "from-blue-500/10 to-blue-600/5",
        },
        {
          label: "Comparison Groups",
          value: summaryChart.segments?.length || 0,
          icon: Layers,
          color: "from-purple-500/10 to-purple-600/5",
        },
        {
          label: "Fields Analyzed",
          value: generatedData.reportConfig.includeFields.length,
          icon: Layers,
          color: "from-indigo-500/10 to-indigo-600/5",
        },
      ],
      status: [
        {
          label: "Status Groups",
          value: summaryChart.statusDistribution?.length || 0,
          icon: Layers,
          color: "from-green-500/10 to-green-600/5",
        },
        {
          label: "Avg Days in Status",
          value: summaryChart.avgDaysInCurrentStatus || 0,
          icon: Clock,
          color: "from-blue-500/10 to-blue-600/5",
        },
        {
          label: "Transitions",
          value: summaryChart.statusTransitions?.length || 0,
          icon: BarChart4,
          color: "from-amber-500/10 to-amber-600/5",
        },
      ],
      visit: [
        {
          label: "Total Visits",
          value: summaryChart.totalVisits || 0,
          icon: Calendar,
          color: "from-amber-500/10 to-amber-600/5",
        },
        {
          label: "Total Patients",
          value: summaryChart.totalPatients || 0,
          icon: User,
          color: "from-blue-500/10 to-blue-600/5",
        },
        {
          label: "Avg Visits/Patient",
          value: summaryChart.avgVisitsPerPatient || "0",
          icon: BarChart3,
          color: "from-green-500/10 to-green-600/5",
        },
      ],
      default: [
        {
          label: "Report Type",
          value: generatedData.metadata.type,
          icon: FileText,
          color: "from-blue-500/10 to-blue-600/5",
        },
        {
          label: "Charts",
          value: generatedData.metadata.chartCount,
          icon: PieChart,
          color: "from-purple-500/10 to-purple-600/5",
        },
        {
          label: "Filters",
          value: generatedData.metadata.filterCount,
          icon: Filter,
          color: "from-green-500/10 to-green-600/5",
        },
      ],
    };

    const metrics =
      metricsConfig[reportType as keyof typeof metricsConfig] ||
      metricsConfig.default;

    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {metrics.map((metric, index) => {
          const IconComponent = metric.icon;
          return (
            <motion.div
              key={index}
              className={metricCardClass}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${metric.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
              ></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-muted-foreground font-medium">
                    {metric.label}
                  </p>
                  <IconComponent className="h-4 w-4 text-blue-500 dark:text-blue-400 opacity-70" />
                </div>
                <p className="text-2xl font-semibold bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-400 dark:to-blue-600 bg-clip-text text-transparent">
                  {typeof metric.value === "string" &&
                  metric.value.toLowerCase() === "report type"
                    ? metric.value.charAt(0).toUpperCase() +
                      metric.value.slice(1)
                    : metric.value}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    );
  };

  // Loading state UI
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4 py-6 min-h-screen bg-gradient-to-br from-blue-50/90 to-white/90 dark:from-slate-950/90 dark:to-slate-900/90">
        <div className="container max-w-6xl backdrop-blur-sm p-6 rounded-xl">
          <div className="flex items-center mb-8 pb-6 border-b border-blue-100/30 dark:border-blue-900/20">
            <div className="flex items-center">
              <Skeleton className="h-10 w-10 rounded-lg mr-4" />
              <Skeleton className="h-9 w-64" />
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <Skeleton className="h-[420px] w-full rounded-xl" />
            <Skeleton className="h-[420px] w-full rounded-xl lg:col-span-2" />
          </div>
        </div>
      </div>
    );
  }

  // Not found state UI
  if (!report) {
    return (
      <div className="flex items-center justify-center p-4 py-8 min-h-screen bg-gradient-to-br from-blue-50/90 to-white/90 dark:from-slate-950/90 dark:to-slate-900/90">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="container max-w-md p-8 rounded-xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-lg shadow-lg border border-blue-100 dark:border-blue-900/30 text-center"
        >
          <div className="p-5 bg-blue-50 dark:bg-blue-900/20 rounded-full inline-flex mb-6">
            <FileText className="h-8 w-8 text-blue-600 dark:text-blue-400 opacity-70" />
          </div>
          <h2 className="text-xl font-semibold mb-2 bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-400 dark:to-blue-600 bg-clip-text text-transparent">
            {t("reportNotFound")}
          </h2>
          <p className="text-blue-600/70 dark:text-blue-400/70 mb-6">
            {t("reportNotFoundDescription")}
          </p>
          <Button
            onClick={() => router.push("/reports")}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 dark:from-blue-700 dark:to-blue-800 dark:hover:from-blue-600 dark:hover:to-blue-700 text-white transition-all duration-300 shadow hover:shadow-xl rounded-lg"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t("backToReports")}
          </Button>
        </motion.div>
      </div>
    );
  }

  // Main UI
  return (
    <div className="min-h-screen py-6 px-4" dir={dir}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto max-w-6xl"
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg rounded-2xl p-6 mb-6 border border-blue-100/50 dark:border-blue-900/30 shadow-lg"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-start md:items-center flex-col md:flex-row gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleGoBack}
                className="hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-all duration-300"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                {t("back")}
              </Button>

              <div className="flex flex-col md:flex-row md:items-center gap-3">
                <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-400 dark:to-blue-600 bg-clip-text text-transparent">
                  {report.name}
                </h1>

                <div className="flex items-center">
                  {renderReportTypeBadge(report.type)}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mt-2 md:mt-0">
              <Button
                onClick={handleGenerateReport}
                disabled={isGenerating || isLoadingReportData}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 dark:from-blue-700 dark:to-blue-800 dark:hover:from-blue-600 dark:hover:to-blue-700 text-white transition-all duration-300 shadow hover:shadow-xl rounded-lg"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t("generating")}
                  </>
                ) : (
                  <>
                    <FileText className="mr-2 h-4 w-4" />
                    {report.lastGeneratedAt
                      ? t("regenerate")
                      : t("generateReport")}
                  </>
                )}
              </Button>
            </div>
          </div>

          {report.description && (
            <div className="mt-4 bg-blue-50/50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-100/50 dark:border-blue-900/30">
              <p className="text-blue-700/90 dark:text-blue-300/90">
                {report.description}
              </p>
            </div>
          )}
        </motion.div>

        {/* Main Content - Combined Overview and Details */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="space-y-6"
        >
          {/* Combined Report Details & Summary Card */}
          <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-lg border-blue-100/50 dark:border-blue-900/50 shadow-lg transition-all duration-300 overflow-hidden rounded-xl">
            <CardHeader className="bg-gradient-to-r from-blue-50/80 to-white/80 dark:from-blue-900/30 dark:to-slate-800/80 border-b border-blue-100/50 dark:border-blue-900/20">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-400 dark:to-blue-600 bg-clip-text text-transparent">
                    {t("reportDetails")}
                  </CardTitle>
                  <CardDescription className="text-blue-600/70 dark:text-blue-400/70">
                    {t("id")}: {reportId}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-6">
              {/* Summary Metrics Section */}
              {report.lastGeneratedAt && (
                <div className="mb-6">
                  <h3 className="text-md font-semibold mb-4 text-blue-700 dark:text-blue-300">
                    {t("summary")}
                  </h3>
                  {isLoadingReportData ? (
                    <div className="text-center py-12">
                      <Loader2 className="h-10 w-10 animate-spin text-blue-600 dark:text-blue-400 mx-auto mb-4 opacity-70" />
                      <p className="text-blue-600/70 dark:text-blue-400/70 font-medium">
                        {t("loadingReportData")}
                      </p>
                    </div>
                  ) : generatedData ? (
                    renderSummaryMetrics()
                  ) : (
                    <div className="text-center py-8 px-4">
                      <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-full inline-flex mb-4">
                        <FileText className="h-7 w-7 text-blue-600 dark:text-blue-400 opacity-70" />
                      </div>
                      <p className="text-blue-600/70 dark:text-blue-400/70 font-medium mb-4">
                        {t("reportNotGeneratedYet")}
                      </p>
                      <Button
                        onClick={handleGenerateReport}
                        disabled={isGenerating || isLoadingReportData}
                        className="mt-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 dark:from-blue-700 dark:to-blue-800 dark:hover:from-blue-600 dark:hover:to-blue-700 text-white transition-all duration-300 shadow hover:shadow-xl rounded-lg"
                      >
                        {isGenerating ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            {t("generating")}
                          </>
                        ) : (
                          <>
                            <FileText className="mr-2 h-4 w-4" />
                            {t("generateNow")}
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {!report.lastGeneratedAt && (
                <div className="text-center py-6 mb-6">
                  <div className="p-4 bg-blue-50/50 dark:bg-blue-900/20 rounded-full inline-flex mb-4">
                    <FileText className="h-8 w-8 text-blue-600 dark:text-blue-400 opacity-70" />
                  </div>
                  <p className="text-blue-600/70 dark:text-blue-400/70 font-medium mb-4 text-lg">
                    {t("reportNotGeneratedYet")}
                  </p>
                  <Button
                    onClick={handleGenerateReport}
                    disabled={isGenerating || isLoadingReportData}
                    className="mt-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 dark:from-blue-700 dark:to-blue-800 dark:hover:from-blue-600 dark:hover:to-blue-700 text-white transition-all duration-300 shadow hover:shadow-xl rounded-lg"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {t("generating")}
                      </>
                    ) : (
                      <>
                        <FileText className="mr-2 h-4 w-4" />
                        {t("generateNow")}
                      </>
                    )}
                  </Button>
                </div>
              )}

              {/* Report Details Section */}
              <Separator className="my-6" />
              <h3 className="text-md font-semibold mb-4 text-blue-700 dark:text-blue-300">
                {t("details")}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">
                      {t("reportType")}
                    </h3>
                    <div>{renderReportTypeBadge(report.type)}</div>
                  </div>

                  {report.category && (
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-2">
                        {t("reportCategory")}
                      </h3>
                      <Badge
                        variant="outline"
                        className="border-blue-200 dark:border-blue-800/50 px-2.5 py-1 rounded-full text-blue-700 dark:text-blue-300 shadow-sm"
                      >
                        {report.category}
                      </Badge>
                    </div>
                  )}

                  {report.tags && report.tags.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-2">
                        {t("tags")}
                      </h3>
                      <div className="flex flex-wrap gap-1.5">
                        {report.tags.map((tag, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="border-blue-200 dark:border-blue-800/50 px-2.5 py-0.5 rounded-full text-blue-700 dark:text-blue-300 shadow-sm"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">
                      {t("settings")}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      <Badge
                        variant="outline"
                        className={`px-2.5 py-0.5 rounded-full ${
                          report.isFavorite
                            ? "bg-yellow-100/80 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800/30"
                            : ""
                        }`}
                      >
                        {report.isFavorite ? t("favorite") : t("notFavorited")}
                      </Badge>
                      <Badge
                        variant="outline"
                        className={`px-2.5 py-0.5 rounded-full ${
                          report.isPrivate
                            ? "bg-red-100/80 text-red-800 dark:bg-red-900/40 dark:text-red-300 border-red-200 dark:border-red-800/30"
                            : "bg-green-100/80 text-green-800 dark:bg-green-900/40 dark:text-green-300 border-green-200 dark:border-green-800/30"
                        }`}
                      >
                        {report.isPrivate
                          ? t("reportVisibilityPrivate")
                          : t("reportVisibilityPublic")}
                      </Badge>
                      <Badge
                        variant="outline"
                        className={`px-2.5 py-0.5 rounded-full ${
                          report.isTemplate
                            ? "bg-purple-100/80 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300 border-purple-200 dark:border-purple-800/30"
                            : ""
                        }`}
                      >
                        {report.isTemplate
                          ? t("template")
                          : t("standardReport")}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  {report.charts && report.charts.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-2">
                        {t("charts")}
                      </h3>
                      <div className="flex flex-wrap gap-1.5">
                        {report.charts.map((chart, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="text-xs capitalize bg-blue-100/70 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2.5 py-0.5 rounded-full shadow-sm"
                          >
                            {chart.title}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {report.includeFields && report.includeFields.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-2">
                        {t("reportIncludedFields")}
                      </h3>
                      <div className="flex flex-wrap gap-1.5">
                        {report.includeFields.map((field, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="text-xs border-blue-200 dark:border-blue-800/50 px-2.5 py-0.5 rounded-full text-blue-700 dark:text-blue-300 shadow-sm"
                          >
                            {field.split(".").pop()}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {report.filters && report.filters.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-2">
                        {t("reportFilters")}
                      </h3>
                      <Badge
                        variant="outline"
                        className="text-xs border-blue-200 dark:border-blue-800/50 px-2.5 py-0.5 rounded-full text-blue-700 dark:text-blue-300 shadow-sm"
                      >
                        {report.filters.length} {t("reportFiltersApplied")}
                      </Badge>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Report Visualizations */}
          {generatedData && generatedData.data ? (
            <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-lg border-blue-100/50 dark:border-blue-900/50 shadow-lg transition-all duration-300 overflow-hidden rounded-xl">
              <CardHeader className="bg-gradient-to-r from-blue-50/80 to-white/80 dark:from-blue-900/30 dark:to-slate-800/80 border-b border-blue-100/50 dark:border-blue-900/20">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-400 dark:to-blue-600 bg-clip-text text-transparent">
                      {t("reportVisualizations")}
                    </CardTitle>
                    <CardDescription className="text-blue-600/70 dark:text-blue-400/70">
                      {report.charts?.length || 0} {t("reportChart")}{" "}
                      {(report.charts?.length || 0) !== 1
                        ? t("chartsPlural")
                        : ""}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <ReportCharts reportData={generatedData.data} />
              </CardContent>
            </Card>
          ) : (
            <div className="flex items-center justify-center py-16 rounded-xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-lg border-blue-100/50 dark:border-blue-900/50 shadow-lg">
              <div className="text-center">
                <div className="p-4 bg-blue-50/50 dark:bg-blue-900/20 rounded-full inline-flex mb-4">
                  <FileText className="h-8 w-8 text-blue-600 dark:text-blue-400 opacity-70" />
                </div>
                <h3 className="text-xl font-semibold mb-2 bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-400 dark:to-blue-600 bg-clip-text text-transparent">
                  {t("noVisualizationsYet")}
                </h3>
                <p className="text-blue-600/70 dark:text-blue-400/70 mb-6 max-w-md mx-auto">
                  {t("generateReportToViewCharts")}
                </p>
                <Button
                  onClick={handleGenerateReport}
                  disabled={isGenerating || isLoadingReportData}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 dark:from-blue-700 dark:to-blue-800 dark:hover:from-blue-600 dark:hover:to-blue-700 text-white transition-all duration-300 shadow hover:shadow-xl rounded-lg"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t("generating")}
                    </>
                  ) : (
                    <>
                      <FileText className="mr-2 h-4 w-4" />
                      {t("generateReport")}
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}
