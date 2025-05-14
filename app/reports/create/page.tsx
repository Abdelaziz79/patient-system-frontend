"use client";

import {
  ChartType,
  FieldType,
  FilterOperator,
  IChartConfig,
  IReport,
  IReportFilter,
  ReportType,
  TimeInterval,
} from "@/app/_hooks/report/reportApi"; // Adjust path as needed
import { useReport } from "@/app/_hooks/report/useReport"; // Adjust path as needed
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ComboboxCreatable } from "@/components/ui/combobox-creatable"; // Adjust path
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MultiSelect } from "@/components/ui/multi-select"; // Adjust path
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, PlusCircle, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";

const reportTypeOptions: { value: ReportType; label: string }[] = [
  { value: "patient", label: "Patient Report" },
  { value: "visit", label: "Visit Report" },
  { value: "status", label: "Status Report" },
  { value: "custom", label: "Custom Report" },
  { value: "event", label: "Event Report" },
  { value: "comparative", label: "Comparative Report" },
];

const filterOperatorOptions: { value: FilterOperator; label: string }[] = [
  { value: "equals", label: "Equals" },
  { value: "notEquals", label: "Not Equals" },
  { value: "contains", label: "Contains" },
  { value: "greaterThan", label: "Greater Than" },
  { value: "lessThan", label: "Less Than" },
  { value: "between", label: "Between" },
  { value: "in", label: "In (comma-separated)" },
  { value: "exists", label: "Exists" },
  { value: "notExists", label: "Not Exists" },
];

const fieldTypeOptions: { value: FieldType; label: string }[] = [
  { value: "text", label: "Text" },
  { value: "number", label: "Number" },
  { value: "date", label: "Date" },
  { value: "boolean", label: "Boolean" },
  { value: "status", label: "Status" },
  { value: "tag", label: "Tag" },
  { value: "template", label: "Template" },
  { value: "visit", label: "Visit" },
  { value: "event", label: "Event" },
  { value: "reference", label: "Reference" },
];

const chartTypeOptions: { value: ChartType; label: string }[] = [
  { value: "bar", label: "Bar Chart" },
  { value: "line", label: "Line Chart" },
  { value: "pie", label: "Pie Chart" },
  { value: "table", label: "Table" },
  { value: "summary", label: "Summary" },
  { value: "heatmap", label: "Heatmap" },
  { value: "scatter", label: "Scatter Plot" },
];

const timeIntervalOptions: { value: TimeInterval; label: string }[] = [
  { value: "day", label: "Day" },
  { value: "week", label: "Week" },
  { value: "month", label: "Month" },
  { value: "quarter", label: "Quarter" },
  { value: "year", label: "Year" },
];

export default function CreateReportPage() {
  const router = useRouter();
  const {
    createReport,
    isCreating,
    reportFields,
    isFieldsLoading,
    refetchFields,
    reportCategories,
    isCategoriesLoading,
    refetchCategories,
    hasAccess,
  } = useReport();
  const [reportData, setReportData] = useState<Partial<IReport>>({
    name: "",
    description: "",
    type: "custom",
    filters: [],
    charts: [],
    includeFields: [],
    category: "",
    isPrivate: false,
    isFavorite: false,
    isTemplate: false,
    tags: [],
  });

  useEffect(() => {
    if (hasAccess) {
      refetchFields();
      refetchCategories();
    }
  }, [hasAccess, refetchFields, refetchCategories]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setReportData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: keyof IReport, value: string) => {
    setReportData((prev) => ({ ...prev, [name]: value }));
  };

  // --- Filters Logic ---
  const addFilter = () => {
    setReportData((prev) => ({
      ...prev,
      filters: [
        ...((prev.filters || []) as IReportFilter[]),
        {
          field: "",
          operator: "equals",
          value: "",
          fieldType: "text",
          displayLabel: "",
        },
      ],
    }));
  };

  const updateFilter = (index: number, updatedFilter: IReportFilter) => {
    setReportData((prev) => ({
      ...prev,
      filters: ((prev.filters || []) as IReportFilter[]).map(
        (f: IReportFilter, i: number) => (i === index ? updatedFilter : f)
      ),
    }));
  };

  const removeFilter = (index: number) => {
    setReportData((prev) => ({
      ...prev,
      filters: ((prev.filters || []) as IReportFilter[]).filter(
        (_: IReportFilter, i: number) => i !== index
      ),
    }));
  };

  // --- Charts Logic (Simplified) ---
  const addChart = () => {
    setReportData((prev) => ({
      ...prev,
      charts: [
        ...(prev.charts || []),
        {
          type: "table",
          dataField: "",
          title: "",
          timeInterval: "month", // Default
        },
      ],
    }));
  };

  const updateChart = (index: number, updatedChart: IChartConfig) => {
    setReportData((prev) => ({
      ...prev,
      charts: (prev.charts || []).map((c, i) =>
        i === index ? updatedChart : c
      ),
    }));
  };

  const removeChart = (index: number) => {
    setReportData((prev) => ({
      ...prev,
      charts: (prev.charts || []).filter((_, i) => i !== index),
    }));
  };

  // --- Include Fields Logic ---
  const handleIncludeFieldsChange = (selectedFields: string[]) => {
    // Clean up any index suffixes that might have been added by the MultiSelect
    const cleanedFields = selectedFields.map((field) => {
      // Remove any __idx_X suffixes from the field keys
      return field.replace(/__idx_\d+(?:__idx_\d+)*/g, "");
    });

    // Remove any duplicates that might occur after cleaning
    const uniqueFields = [...new Set(cleanedFields)];

    setReportData((prev) => ({ ...prev, includeFields: uniqueFields }));
  };

  const availableReportFieldOptions = useMemo(() => {
    if (isFieldsLoading || !reportFields || !Array.isArray(reportFields)) {
      return [];
    }

    // Flatten fields from all categories and ensure unique keys
    const allFields = reportFields.flatMap((category) =>
      Array.isArray(category.fields) ? category.fields : []
    );

    // Create a Set to track seen keys and prevent duplicates
    const processedKeys = new Set();
    const uniqueFields = [];

    for (const field of allFields) {
      if (
        field &&
        typeof field.key === "string" &&
        !processedKeys.has(field.key)
      ) {
        processedKeys.add(field.key);
        uniqueFields.push({
          value: field.key,
          label: field.label || field.key,
        });
      }
    }

    return uniqueFields;
  }, [reportFields, isFieldsLoading]);

  // --- Category Options Logic ---
  const categoryOptionsForCombobox = useMemo(() => {
    if (
      isCategoriesLoading ||
      !reportCategories ||
      !Array.isArray(reportCategories)
    ) {
      return [];
    }
    return reportCategories
      .filter(
        (category) =>
          category &&
          (typeof category === "string" ||
            (typeof category === "object" &&
              category.name &&
              typeof category.name === "string"))
      )
      .map((category) => {
        // Handle both string categories and object categories with name property
        const categoryName =
          typeof category === "string" ? category : category.name;

        return {
          value: categoryName,
          label: categoryName,
        };
      });
  }, [reportCategories, isCategoriesLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportData.name || !reportData.type) {
      toast.error("Report Name and Type are required.");
      return;
    }

    const result = await createReport(reportData as IReport);
    if (result?.success && result.data) {
      const reportId = result.data.id || result.data._id; // Handle both possible ID fields
      if (reportId) {
        router.push(`/reports/${reportId}`);
      } else {
        toast.error("Report created, but ID is missing. Cannot navigate.");
        router.push("/reports"); // Fallback navigation
      }
    }
  };

  if (hasAccess === null || isFieldsLoading || isCategoriesLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p className="mx-2">Loading configuration...</p>
      </div>
    );
  }

  if (hasAccess === false) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>You do not have access to create reports.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <form onSubmit={handleSubmit} className="space-y-8">
        <h1 className="text-3xl font-bold mb-6">Create New Report</h1>

        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Report Name</Label>
              <Input
                id="name"
                name="name"
                value={reportData.name}
                onChange={handleInputChange}
                required
                placeholder="e.g., Monthly Sales Performance"
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={reportData.description}
                onChange={handleInputChange}
                placeholder="A brief description of the report"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="type">Report Type</Label>
                <Select
                  name="type"
                  value={reportData.type}
                  onValueChange={(value) =>
                    handleSelectChange("type", value as ReportType)
                  }
                >
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select report type" />
                  </SelectTrigger>
                  <SelectContent>
                    {reportTypeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <ComboboxCreatable
                  options={categoryOptionsForCombobox}
                  value={reportData.category || ""}
                  onChange={(value) => handleSelectChange("category", value)}
                  placeholder="Select or create category"
                  searchPlaceholder="Search or type new..."
                  emptyStateMessage="No category found. Type to create."
                  disabled={isCategoriesLoading}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Filters Section */}
        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {((reportData.filters || []) as IReportFilter[]).map(
              (filter: IReportFilter, index: number) => (
                <div
                  key={index}
                  className="p-4 border rounded-md space-y-3 bg-muted/50"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor={`filter-field-${index}`}>Field</Label>
                      <Select
                        value={filter.field}
                        onValueChange={(value) =>
                          updateFilter(index, { ...filter, field: value })
                        }
                        disabled={isFieldsLoading}
                      >
                        <SelectTrigger id={`filter-field-${index}`}>
                          <SelectValue placeholder="Select field" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableReportFieldOptions.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                              {opt.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor={`filter-operator-${index}`}>
                        Operator
                      </Label>
                      <Select
                        value={filter.operator}
                        onValueChange={(value) =>
                          updateFilter(index, {
                            ...filter,
                            operator: value as FilterOperator,
                          })
                        }
                      >
                        <SelectTrigger id={`filter-operator-${index}`}>
                          <SelectValue placeholder="Select operator" />
                        </SelectTrigger>
                        <SelectContent>
                          {filterOperatorOptions.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                              {opt.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor={`filter-fieldType-${index}`}>
                        Field Type
                      </Label>
                      <Select
                        value={filter.fieldType}
                        onValueChange={(value) =>
                          updateFilter(index, {
                            ...filter,
                            fieldType: value as FieldType,
                          })
                        }
                      >
                        <SelectTrigger id={`filter-fieldType-${index}`}>
                          <SelectValue placeholder="Select field type" />
                        </SelectTrigger>
                        <SelectContent>
                          {fieldTypeOptions.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                              {opt.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor={`filter-value-${index}`}>Value</Label>
                      <Input
                        id={`filter-value-${index}`}
                        value={filter.value || ""}
                        onChange={(e) =>
                          updateFilter(index, {
                            ...filter,
                            value: e.target.value,
                          })
                        }
                        placeholder="Enter filter value"
                        disabled={
                          filter.operator === "exists" ||
                          filter.operator === "notExists"
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor={`filter-displayLabel-${index}`}>
                        Display Label (Optional)
                      </Label>
                      <Input
                        id={`filter-displayLabel-${index}`}
                        value={filter.displayLabel || ""}
                        onChange={(e) =>
                          updateFilter(index, {
                            ...filter,
                            displayLabel: e.target.value,
                          })
                        }
                        placeholder="e.g., Last Name is Smith"
                      />
                    </div>
                  </div>
                  {filter.operator === "between" && (
                    <div>
                      <Label htmlFor={`filter-endValue-${index}`}>
                        End Value (for between)
                      </Label>
                      <Input
                        id={`filter-endValue-${index}`}
                        value={filter.endValue || ""}
                        onChange={(e) =>
                          updateFilter(index, {
                            ...filter,
                            endValue: e.target.value,
                          })
                        }
                        placeholder="Enter end value"
                      />
                    </div>
                  )}

                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => removeFilter(index)}
                    className="mt-2"
                  >
                    <Trash2 className="h-4 w-4 mx-2" /> Remove Filter
                  </Button>
                </div>
              )
            )}
            <Button type="button" variant="outline" onClick={addFilter}>
              <PlusCircle className="h-4 w-4 mx-2" /> Add Filter
            </Button>
          </CardContent>
        </Card>

        {/* Include Fields Section */}
        <Card>
          <CardHeader>
            <CardTitle>Include Fields in Report Data</CardTitle>
          </CardHeader>
          <CardContent>
            <Label htmlFor="includeFields">Select fields to include</Label>
            {isFieldsLoading ? (
              <p>Loading fields...</p>
            ) : (
              <MultiSelect
                options={availableReportFieldOptions}
                selected={reportData.includeFields || []}
                onChange={handleIncludeFieldsChange}
                placeholder="Select fields..."
                className="mt-1"
              />
            )}
          </CardContent>
        </Card>

        {/* Charts Section (Simplified) */}
        <Card>
          <CardHeader>
            <CardTitle>Charts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {(reportData.charts || []).map((chart, index) => (
              <div
                key={index}
                className="p-4 border rounded-md space-y-3 bg-muted/50"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor={`chart-title-${index}`}>Chart Title</Label>
                    <Input
                      id={`chart-title-${index}`}
                      value={chart.title || ""}
                      onChange={(e) =>
                        updateChart(index, { ...chart, title: e.target.value })
                      }
                      placeholder="e.g., Status Changes Over Time"
                    />
                  </div>
                  <div>
                    <Label htmlFor={`chart-type-${index}`}>Chart Type</Label>
                    <Select
                      value={chart.type}
                      onValueChange={(value) =>
                        updateChart(index, {
                          ...chart,
                          type: value as ChartType,
                        })
                      }
                    >
                      <SelectTrigger id={`chart-type-${index}`}>
                        <SelectValue placeholder="Select chart type" />
                      </SelectTrigger>
                      <SelectContent>
                        {chartTypeOptions.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor={`chart-dataField-${index}`}>
                      Data Field
                    </Label>
                    <Select
                      value={chart.dataField}
                      onValueChange={(value) =>
                        updateChart(index, { ...chart, dataField: value })
                      }
                      disabled={isFieldsLoading}
                    >
                      <SelectTrigger id={`chart-dataField-${index}`}>
                        <SelectValue placeholder="Select data field for chart" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableReportFieldOptions.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {(chart.type === "line" || chart.type === "bar") && (
                    <div>
                      <Label htmlFor={`chart-timeInterval-${index}`}>
                        Time Interval
                      </Label>
                      <Select
                        value={chart.timeInterval}
                        onValueChange={(value) =>
                          updateChart(index, {
                            ...chart,
                            timeInterval: value as TimeInterval,
                          })
                        }
                      >
                        <SelectTrigger id={`chart-timeInterval-${index}`}>
                          <SelectValue placeholder="Select time interval" />
                        </SelectTrigger>
                        <SelectContent>
                          {timeIntervalOptions.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                              {opt.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>

                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => removeChart(index)}
                  className="mt-2"
                >
                  <Trash2 className="h-4 w-4 mx-2" /> Remove Chart
                </Button>
              </div>
            ))}
            <Button type="button" variant="outline" onClick={addChart}>
              <PlusCircle className="h-4 w-4 mx-2" /> Add Chart
            </Button>
          </CardContent>
        </Card>

        <CardFooter className="flex justify-end pt-6">
          <Button type="submit" disabled={isCreating}>
            {isCreating && <Loader2 className="mx-2 h-4 w-4 animate-spin" />}
            Create Report
          </Button>
        </CardFooter>
      </form>
    </div>
  );
}
