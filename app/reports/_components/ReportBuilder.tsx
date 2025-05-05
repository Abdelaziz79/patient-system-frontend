"use client";

import { useLanguage } from "@/app/_contexts/LanguageContext";
import { usePatient } from "@/app/_hooks/patient/usePatient";
import {
  IReport,
  IReportChart,
  IReportField,
  IReportFilter,
} from "@/app/_hooks/report/reportApi";
import { useReport } from "@/app/_hooks/report/useReport";
import { IPatient } from "@/app/_types/Patient";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { ChevronDown, FileBarChart, Loader2, Save, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

interface ReportBuilderProps {
  onReportCreated: (report?: IReport) => void;
  reportFields?: IReportField[];
  isFieldsLoading?: boolean;
  onGenerateCustomReport?: (reportConfig: {
    type?: "patient" | "visit" | "status" | "custom" | "event";
    filters?: IReportFilter[];
    charts?: IReportChart[];
    includeFields?: string[];
  }) => Promise<any>;
  patients?: IPatient[];
  isPatientsLoading?: boolean;
  createReportFn?: (
    reportData: Partial<IReport>
  ) => Promise<{ success: boolean; data?: IReport; error?: string }>;
}

export default function ReportBuilder({
  onReportCreated,
  reportFields: propReportFields,
  isFieldsLoading: propIsFieldsLoading,
  onGenerateCustomReport,
  patients: propPatients,
  isPatientsLoading: propIsPatientsLoading,
  createReportFn: propCreateReport,
}: ReportBuilderProps) {
  const { t, isRTL } = useLanguage();

  // Extract only the specific methods needed from hooks
  const {
    createReport: hookCreateReport,
    isCreating,
    refetchFields,
  } = useReport({
    initialFetch: false,
  });

  const {
    patients: hookPatients,
    isLoading: hookIsLoading,
    stats,
    refetchStats,
  } = usePatient({
    initialFetch: !propPatients,
    initialLimit: 5, // Just need a small sample for preview
  });

  // Use props if provided, otherwise use hooks
  const createReport = propCreateReport || hookCreateReport;
  const reportFields = propReportFields || [];
  const isFieldsLoading =
    propIsFieldsLoading !== undefined ? propIsFieldsLoading : false;
  const patients = propPatients || hookPatients;
  const isPatientsLoading =
    propIsPatientsLoading !== undefined ? propIsPatientsLoading : hookIsLoading;

  const [reportForm, setReportForm] = useState<Partial<IReport>>({
    name: "",
    description: "",
    type: "patient", // Default type
    filters: [],
    charts: [],
    includeFields: [],
    isPrivate: false,
  });

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Load stats on component mount
  useEffect(() => {
    if (!stats) {
      refetchStats();
    }
  }, [stats, refetchStats]);

  const updateForm = (field: keyof IReport, value: any) => {
    setReportForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Add a patient field filter
  const addFilter = (
    fieldName: string,
    operator:
      | "equals"
      | "notEquals"
      | "contains"
      | "greaterThan"
      | "lessThan"
      | "between"
      | "in",
    value: any,
    fieldType:
      | "text"
      | "number"
      | "date"
      | "boolean"
      | "status"
      | "tag"
      | "template"
      | "visit" = "text"
  ) => {
    setReportForm((prev) => {
      const newFilters = [...(prev.filters || [])];
      // Check if filter for this field already exists
      const existingIndex = newFilters.findIndex((f) => f.field === fieldName);

      const newFilter: IReportFilter = {
        field: fieldName,
        operator,
        value,
        fieldType,
      };

      if (existingIndex >= 0) {
        // Update existing filter
        newFilters[existingIndex] = newFilter;
      } else {
        // Add new filter
        newFilters.push(newFilter);
      }

      return {
        ...prev,
        filters: newFilters,
      };
    });
  };

  // Toggle a field in includeFields
  const toggleField = (fieldName: string) => {
    setReportForm((prev) => {
      const fields = [...(prev.includeFields || [])];
      if (fields.includes(fieldName)) {
        return {
          ...prev,
          includeFields: fields.filter((f) => f !== fieldName),
        };
      } else {
        return {
          ...prev,
          includeFields: [...fields, fieldName],
        };
      }
    });
  };

  // Add a chart configuration
  const addChart = (
    type: "bar" | "line" | "pie" | "table" | "summary",
    title: string,
    dataField: string
  ) => {
    setReportForm((prev) => {
      const newChart: IReportChart = {
        type,
        title,
        dataField,
      };

      return {
        ...prev,
        charts: [...(prev.charts || []), newChart],
      };
    });
  };

  // Handle generating a custom report without saving it
  const handleGeneratePreview = async () => {
    if (!onGenerateCustomReport) return;

    setIsGenerating(true);

    try {
      // Prepare report configuration
      const reportConfig = {
        type: reportForm.type,
        filters: reportForm.filters,
        charts: reportForm.charts?.length
          ? reportForm.charts
          : getDefaultCharts(reportForm.type),
        includeFields: reportForm.includeFields,
      };

      await onGenerateCustomReport(reportConfig);

      toast.success("Report preview generated successfully");
    } catch (error) {
      console.error("Error generating report preview:", error);
      toast.error("Failed to generate report preview");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // If no charts are defined, add some default ones based on report type
      const formData = { ...reportForm };

      if (!formData.charts || formData.charts.length === 0) {
        formData.charts = getDefaultCharts(formData.type);
      }

      const result = await createReport(formData);

      if (result.success) {
        toast.success("Report created successfully");
        onReportCreated(result.data);
      } else {
        toast.error(result.error || "Failed to create report");
      }
    } catch (error) {
      console.error("Error creating report:", error);
      toast.error("An error occurred while creating the report");
    }
  };

  // Helper function to get default charts based on report type
  const getDefaultCharts = (reportType?: string): IReportChart[] => {
    switch (reportType) {
      case "patient":
        return [
          { type: "pie", title: "Gender Distribution", dataField: "gender" },
          {
            type: "bar",
            title: "Patients by Status",
            dataField: "status.label",
          },
          {
            type: "summary",
            title: "Patient Summary",
            dataField: "summary",
          },
        ];
      case "visit":
        return [
          { type: "line", title: "Visit Trends", dataField: "createdAt" },
          { type: "bar", title: "Visit Counts", dataField: "visits" },
        ];
      case "status":
        return [
          { type: "pie", title: "Status Distribution", dataField: "status" },
          { type: "bar", title: "Status Timeline", dataField: "statusHistory" },
        ];
      case "event":
        return [
          { type: "bar", title: "Events by Type", dataField: "eventType" },
          { type: "line", title: "Event Timeline", dataField: "eventTimeline" },
        ];
      default:
        return [
          {
            type: "bar",
            title: "Custom Report",
            dataField: "data",
          },
        ];
    }
  };

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="mb-4 border-b border-gray-200 dark:border-gray-700 pb-4">
        <h3 className="text-lg font-medium text-blue-800 dark:text-blue-300">
          {t("newReport")}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          {t("reportsDescription")}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="report-name">{t("name")}</Label>
            <Input
              id="report-name"
              value={reportForm.name}
              onChange={(e) => updateForm("name", e.target.value)}
              placeholder={t("newReport")}
              required
              className="border-gray-200 dark:border-gray-700"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="report-type">{t("template")}</Label>
            <Select
              value={reportForm.type}
              onValueChange={(
                value: "patient" | "visit" | "status" | "custom" | "event"
              ) => updateForm("type", value)}
            >
              <SelectTrigger
                id="report-type"
                className="border-gray-200 dark:border-gray-700"
              >
                <SelectValue placeholder={t("selectReport")} />
              </SelectTrigger>
              <SelectContent>
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
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="report-description">{t("description")}</Label>
          <Textarea
            id="report-description"
            value={reportForm.description || ""}
            onChange={(e) => updateForm("description", e.target.value)}
            placeholder={t("noDescription")}
            className="min-h-[100px] resize-y border-gray-200 dark:border-gray-700"
          />
        </div>

        {/* Additional options toggled by Advanced button */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="mb-4 w-full justify-between"
          >
            {t("advanced")}
            <ChevronDown
              className={`h-4 w-4 transition-transform ${
                showAdvanced ? "rotate-180" : ""
              }`}
            />
          </Button>

          {showAdvanced && (
            <div className="space-y-4 mt-4 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="filters">
                  <AccordionTrigger className="text-sm">
                    {t("filters")}
                    {reportForm.filters && reportForm.filters.length > 0 && (
                      <Badge variant="outline" className="mx-2">
                        {reportForm.filters.length}
                      </Badge>
                    )}
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      <div className="grid grid-cols-1 gap-2">
                        <div className="flex items-center gap-2">
                          <Checkbox
                            id="filter-active"
                            checked={reportForm.filters?.some(
                              (f) => f.field === "isActive" && f.value === true
                            )}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                addFilter("isActive", "equals", true);
                              } else {
                                setReportForm((prev) => ({
                                  ...prev,
                                  filters:
                                    prev.filters?.filter(
                                      (f) => f.field !== "isActive"
                                    ) || [],
                                }));
                              }
                            }}
                          />
                          <Label htmlFor="filter-active">
                            {t("activePatientsOnly")}
                          </Label>
                        </div>

                        {/* More filters could be added here */}
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="fields">
                  <AccordionTrigger className="text-sm">
                    {t("includeFields")}
                    {reportForm.includeFields &&
                      reportForm.includeFields.length > 0 && (
                        <Badge variant="outline" className="mx-2">
                          {reportForm.includeFields.length}
                        </Badge>
                      )}
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        {["name", "status", "createdAt", "gender", "age"].map(
                          (field) => (
                            <div
                              key={field}
                              className="flex items-center gap-2"
                            >
                              <Checkbox
                                id={`field-${field}`}
                                checked={reportForm.includeFields?.includes(
                                  field
                                )}
                                onCheckedChange={() => toggleField(field)}
                              />
                              <Label htmlFor={`field-${field}`}>
                                {t(field as keyof typeof t) || field}
                              </Label>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="charts">
                  <AccordionTrigger className="text-sm">
                    {t("charts")}
                    {reportForm.charts && reportForm.charts.length > 0 && (
                      <Badge variant="outline" className="mx-2">
                        {reportForm.charts.length}
                      </Badge>
                    )}
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {t("defaultChartsWillBeAdded")}
                      </p>

                      <div className="grid grid-cols-1 gap-3 mt-3">
                        {reportForm.type === "patient" && (
                          <div className="flex items-center p-2 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800">
                            <FileBarChart className="h-4 w-4 mx-2 text-blue-500" />
                            <span className="text-sm">
                              Gender Distribution Chart
                            </span>
                          </div>
                        )}

                        {reportForm.type === "patient" && (
                          <div className="flex items-center p-2 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800">
                            <FileBarChart className="h-4 w-4 mx-2 text-blue-500" />
                            <span className="text-sm">
                              Status Distribution Chart
                            </span>
                          </div>
                        )}

                        {reportForm.type === "visit" && (
                          <div className="flex items-center p-2 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800">
                            <FileBarChart className="h-4 w-4 mx-2 text-blue-500" />
                            <span className="text-sm">Visit Trends Chart</span>
                          </div>
                        )}

                        {reportForm.type === "custom" && (
                          <div className="flex items-center p-2 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800">
                            <FileBarChart className="h-4 w-4 mx-2 text-blue-500" />
                            <span className="text-sm">Custom Report Chart</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              <div className="flex items-center gap-x-2">
                <Checkbox
                  id="report-private"
                  checked={reportForm.isPrivate}
                  onCheckedChange={(checked) =>
                    updateForm("isPrivate", !!checked)
                  }
                />
                <Label htmlFor="report-private" className="text-sm">
                  {t("isPrivate")}
                </Label>
              </div>
            </div>
          )}
        </div>

        {/* Patient statistics preview for report */}
        {stats && (
          <div className="border border-blue-100 dark:border-blue-900/30 rounded-lg bg-blue-50 dark:bg-blue-900/10 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <h4 className="text-sm font-medium text-blue-700 dark:text-blue-300">
                {t("patientsSummary")}
              </h4>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 dark:text-gray-400">
              <div>
                {t("totalPatients")}: {stats.totalPatients || 0}
              </div>
              <div>
                {t("active")}: {stats.activePatients || 0}
              </div>
              {stats.recentPatients && (
                <div>
                  {t("newPatientsRecent")}: {stats.recentPatients}
                </div>
              )}
              {stats.totalVisits && (
                <div>
                  {t("totalVisits")}: {stats.totalVisits}
                </div>
              )}
            </div>
          </div>
        )}

        <div className="flex items-center justify-end gap-4 pt-4">
          <Button
            type="submit"
            disabled={isCreating || !reportForm.name}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isCreating ? (
              <>
                <Loader2 className="mx-2 h-4 w-4 animate-spin" />
                {t("generating")}
              </>
            ) : (
              <>
                <Save className="mx-2 h-4 w-4" />
                {t("createReport")}
              </>
            )}
          </Button>
        </div>
      </form>
    </motion.div>
  );
}
